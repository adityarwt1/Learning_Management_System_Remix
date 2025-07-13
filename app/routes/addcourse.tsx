// app/courses/add/page.tsx
"use client";

import { useState } from "react";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { redirect } from "@remix-run/react";
import { Upload, Image, Video, CctvIcon } from "lucide-react";
import {
  LoaderFunction,
  MetaFunction,
  LoaderFunctionArgs,
  ActionFunction,
  ActionFunctionArgs,
} from "@remix-run/node";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { useLoaderData, useFetcher, useNavigation } from "@remix-run/react";
import { useSubmit } from "@remix-run/react";
import { Badge } from "~/components/ui/badge";
import { BookOpen } from "lucide-react";
import { cookieToken } from "~/utils/cookie.server";

type ActionData = {
  error?: string;
  success?: boolean;
};

export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
  const cookieHeader = request.headers.get("cookie");
  const user = await cookieToken.parse(cookieHeader);
  if (!user) {
    return redirect("/signin");
  }
  return {
    user,
  };
};

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  const formdata = await request.formData();
  console.log("formdata ", formdata);
  if (formdata.has("create")) {
  }
  return {};
};
export default function AddCoursePage() {
  const { user } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<ActionData>();
  const navigation = useNavigation();
  const submit = useSubmit();
  const isSubmitting = navigation.state === "submitting";

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add state for image preview
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Add these state variables after your existing state
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [isVideoUploading, setIsVideoUploading] = useState(false);

  // Image upload function from image.tsx
  const base64Image = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  // Handle thumbnail upload
  const handleThumbnailUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const imageUrl = await base64Image(file);
      setThumbnailPreview(imageUrl);

      const formData = new FormData();
      formData.append("url", imageUrl);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  // Add video upload function
  const base64Video = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  // Handle video upload
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsVideoUploading(true);
    try {
      const videoUrl = await base64Video(file);
      setVideoPreview(videoUrl);

      const formData = new FormData();
      formData.append("url", videoUrl);
    } catch (error) {
      console.error("Video upload failed:", error);
    } finally {
      setIsVideoUploading(false);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // You'll implement the actual submission logic
      console.log("Form data to submit:", formData);
      console.log(thumbnailPreview, videoPreview);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return redirect("/courses");
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="container py-8">
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

        {/* Accordion Steps */}
        <Accordion type="single" collapsible className="w-full">
          {/* Step 1: Create Course */}
          <AccordionItem value="step-1" className="border rounded-lg mb-4">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">1</span>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-lg">Create Course</h3>
                  <p className="text-sm text-gray-500">
                    Add course title, description, and media
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <Card className="border-0 shadow-none">
                <CardContent className="p-0">
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* Course Title */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="courseTitle"
                        className="text-sm font-medium"
                      >
                        Course Title *
                      </Label>
                      <Input
                        id="courseTitle"
                        name="courseTitle"
                        type="text"
                        required
                        placeholder="Enter your course title"
                        className="w-full h-12 text-lg"
                        onChange={(e) => {
                          setFormData({ ...formData, title: e.target.value });
                        }}
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="description"
                        className="text-sm font-medium"
                      >
                        Course Description *
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        required
                        placeholder="Describe what students will learn in this course..."
                        className="w-full min-h-[120px] resize-none"
                        rows={5}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          });
                        }}
                      />
                    </div>

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

                        {thumbnailPreview ? (
                          <div className="space-y-3">
                            <div className="relative">
                              <img
                                src={thumbnailPreview}
                                alt="Thumbnail preview"
                                className="w-full h-48 object-cover rounded-lg border"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="absolute top-2 right-2"
                                onClick={() => setThumbnailPreview(null)}
                              >
                                Remove
                              </Button>
                            </div>
                            <p className="text-sm text-green-600">
                              ✓ Thumbnail uploaded successfully
                            </p>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                            <Input
                              id="thumbnail"
                              name="thumbnail"
                              type="file"
                              accept="image/*"
                              required
                              className="hidden"
                              onChange={handleThumbnailUpload}
                            />
                            <label
                              htmlFor="thumbnail"
                              className="cursor-pointer"
                            >
                              <div className="flex flex-col items-center gap-2">
                                <div className="p-3 bg-blue-100 rounded-full">
                                  {isUploading ? (
                                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                  ) : (
                                    <Upload className="h-6 w-6 text-blue-600" />
                                  )}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-700">
                                    {isUploading
                                      ? "Uploading..."
                                      : "Click to upload thumbnail"}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    PNG, JPG up to 5MB
                                  </p>
                                </div>
                              </div>
                            </label>
                          </div>
                        )}
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

                        {videoPreview ? (
                          <div className="space-y-3">
                            <div className="relative">
                              <video
                                src={videoPreview}
                                controls
                                className="w-full h-48 object-cover rounded-lg border"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="absolute top-2 right-2"
                                onClick={() => setVideoPreview(null)}
                              >
                                Remove
                              </Button>
                            </div>
                            <p className="text-sm text-green-600">
                              ✓ Video uploaded successfully
                            </p>
                          </div>
                        ) : (
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                            <Input
                              id="video"
                              name="video"
                              type="file"
                              accept="video/*"
                              required
                              className="hidden"
                              onChange={handleVideoUpload}
                            />
                            <label htmlFor="video" className="cursor-pointer">
                              <div className="flex flex-col items-center gap-2">
                                <div className="p-3 bg-green-100 rounded-full">
                                  {isVideoUploading ? (
                                    <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                                  ) : (
                                    <Video className="h-6 w-6 text-green-600" />
                                  )}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-700">
                                    {isVideoUploading
                                      ? "Uploading..."
                                      : "Click to upload video"}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    MP4, MOV up to 100MB
                                  </p>
                                </div>
                              </div>
                            </label>
                          </div>
                        )}
                      </div>
                    </div>

                    {fetcher.data?.error && (
                      <p className="text-red-500 text-sm">
                        {fetcher.data.error}
                      </p>
                    )}
                    {fetcher?.data?.success && (
                      <p className="text-green-500 text-sm">
                        Course created successfully!
                      </p>
                    )}

                    <Button
                      type="submit"
                      name="create"
                      disabled={isSubmitting || isUploading}
                      className="w-full"
                    >
                      {isSubmitting ? "Creating Course..." : "Create Course"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>

          {/* Step 2: Add Chapters */}
          <AccordionItem value="step-2" className="border rounded-lg">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-semibold">2</span>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-lg">Add Chapters</h3>
                  <p className="text-sm text-gray-500">
                    Organize your course content into chapters
                  </p>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <Card className="border-0 shadow-none">
                <CardContent className="p-0">
                  <div className="space-y-6">
                    {/* Chapter Form UI */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="chapterTitle"
                          className="text-sm font-medium"
                        >
                          Chapter Title
                        </Label>
                        <Input
                          id="chapterTitle"
                          name="chapterTitle"
                          type="text"
                          placeholder="Enter chapter title"
                          className="w-full"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="chapterDescription"
                          className="text-sm font-medium"
                        >
                          Chapter Description
                        </Label>
                        <Textarea
                          id="chapterDescription"
                          name="chapterDescription"
                          placeholder="Describe what this chapter covers..."
                          className="w-full"
                          rows={3}
                        />
                      </div>

                      {/* Chapter Video Upload */}
                      <div className="space-y-3">
                        <Label
                          htmlFor="chapterVideo"
                          className="text-sm font-medium flex items-center gap-2"
                        >
                          <CctvIcon className="h-4 w-4" />
                          Chapter Video
                        </Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                          <Input
                            id="chapterVideo"
                            name="chapterVideo"
                            type="file"
                            accept="video/*"
                            className="hidden"
                          />
                          <label
                            htmlFor="chapterVideo"
                            className="cursor-pointer"
                          >
                            <div className="flex flex-col items-center gap-2">
                              <div className="p-3 bg-green-100 rounded-full">
                                <Video className="h-6 w-6 text-green-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-700">
                                  Click to upload chapter video
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  MP4, MOV up to 100MB
                                </p>
                              </div>
                            </div>
                          </label>
                        </div>
                      </div>

                      <Button
                        type="button"
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        Add Chapter
                      </Button>
                    </div>

                    {/* Chapters List (placeholder) */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">
                        Added Chapters
                      </h4>
                      <div className="text-center py-8 text-gray-500">
                        <BookOpen className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                        <p>No chapters added yet</p>
                        <p className="text-sm">Add your first chapter above</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

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
              <li>
                • Organize chapters logically to guide students through the
                learning journey
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export const meta: MetaFunction = () => {
  return [{ title: "Add course" }];
};
