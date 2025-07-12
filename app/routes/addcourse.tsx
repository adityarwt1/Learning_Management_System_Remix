import {
  LoaderFunction,
  LoaderFunctionArgs,
  MetaFunction,
  redirect,
  ActionFunction,
  json,
} from "@remix-run/node";
import { useLoaderData, useFetcher, useNavigation } from "@remix-run/react";
import { cookieToken } from "~/utils/cookie.server";
import { connectDB } from "~/lib/mongodb";
import User from "~/models/User";
import Course from "~/models/courseOverView";
import Chapter from "~/models/Chapters";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Textarea } from "~/components/ui/textarea";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { Upload, BookOpen, Video, Image } from "lucide-react";

export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
  const cookieHeader = request.headers.get("cookie");
  const userData = await cookieToken.parse(cookieHeader);

  if (!userData) {
    return redirect("/signin");
  }

  await connectDB();
  const user = await User.findById(userData._id);

  if (!user) {
    return redirect("/signin");
  }

  if (user.role !== "instructor") {
    return redirect("/profile?message=instructor");
  }

  return { user };
};

export const action: ActionFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("cookie");
  const userData = await cookieToken.parse(cookieHeader);

  if (!userData) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();

  const fileToBase64 = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  try {
    await connectDB();

    if (formData.has("courseTitle")) {
      const title = formData.get("courseTitle")?.toString();
      const description = formData.get("description")?.toString();
      const thumbnailFile = formData.get("thumbnail") as File;
      const videoFile = formData.get("video") as File;

      if (!title || !description || !thumbnailFile || !videoFile) {
        return json({ error: "All fields are required" }, { status: 400 });
      }

      const thumbnailBase64 = await fileToBase64(thumbnailFile);
      const videoBase64 = await fileToBase64(videoFile);

      const course = new Course({
        title,
        description,
        thumbnail: thumbnailBase64,
        rating: 0,
        votes: 0,
      });

      await course.save();

      const chapter = new Chapter({
        refrence: course._id.toString(),
        title: "Introduction",
        subtitles: [
          {
            title: "Course Introduction",
            videourl: videoBase64,
          },
        ],
      });

      await chapter.save();

      return json({ success: true, courseId: course._id });
    }

    return json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Course creation error:", error);
    return json({ error: "Failed to create course" }, { status: 500 });
  }
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.user) {
    return [{ title: "Add Course - LMS" }];
  }

  return [
    { title: `Add Course - ${data?.user?.name || "Instructor"} | LMS` },
    { name: "description", content: `Add a new course as ${data.user.name}` },
  ];
};

export default function AddCoursePage() {
  const { user } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Create New Course
              </h1>
              <p className="text-gray-600">
                Share your knowledge with the world
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Instructor</Badge>
            <span className="text-gray-500">•</span>
            <span className="text-gray-600">Welcome back, {user.name}</span>
          </div>
        </div>

        {/* Main Form */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Course Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <fetcher.Form
              method="post"
              encType="multipart/form-data"
              className="space-y-6"
            >
              {/* Course Title */}
              <div className="space-y-2">
                <Label htmlFor="courseTitle" className="text-sm font-medium">
                  Course Title *
                </Label>
                <Input
                  id="courseTitle"
                  name="courseTitle"
                  type="text"
                  required
                  placeholder="Enter your course title"
                  className="w-full h-12 text-lg"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Course Description *
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  required
                  placeholder="Describe what students will learn in this course..."
                  className="w-full min-h-[120px] resize-none"
                  rows={5}
                />
              </div>

              <Separator />

              {/* File Uploads */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Thumbnail Upload */}
                <div className="space-y-3">
                  <Label
                    htmlFor="thumbnail"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <Image className="h-4 w-4" />
                    Course Thumbnail *
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <Input
                      id="thumbnail"
                      name="thumbnail"
                      type="file"
                      accept="image/*"
                      required
                      className="hidden"
                    />
                    <label htmlFor="thumbnail" className="cursor-pointer">
                      <Image className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">
                        Click to upload thumbnail
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        PNG, JPG up to 5MB
                      </p>
                    </label>
                  </div>
                </div>

                {/* Video Upload */}
                <div className="space-y-3">
                  <Label
                    htmlFor="video"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <Video className="h-4 w-4" />
                    Introduction Video *
                  </Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <Input
                      id="video"
                      name="video"
                      type="file"
                      accept="video/*"
                      required
                      className="hidden"
                    />
                    <label htmlFor="video" className="cursor-pointer">
                      <Video className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600">
                        Click to upload video
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        MP4, MOV up to 100MB
                      </p>
                    </label>
                  </div>
                </div>
              </div>

              {/* Error/Success Messages */}
              {fetcher.data?.error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{fetcher.data.error}</p>
                </div>
              )}
              {fetcher.data?.success && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-600 text-sm font-medium">
                    ✅ Course created successfully! Redirecting...
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => window.history.back()}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating Course...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Create Course
                    </div>
                  )}
                </Button>
              </div>
            </fetcher.Form>
          </CardContent>
        </Card>

        {/* Tips Section */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h3 className="font-medium text-blue-900 mb-2">
              💡 Tips for a great course:
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>
                • Use a clear, descriptive title that explains what students
                will learn
              </li>
              <li>
                • Write a detailed description highlighting key benefits and
                outcomes
              </li>
              <li>
                • Choose an eye-catching thumbnail that represents your course
                content
              </li>
              <li>
                • Keep your introduction video concise and engaging (2-5
                minutes)
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
