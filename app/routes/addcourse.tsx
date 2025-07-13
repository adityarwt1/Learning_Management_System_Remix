// app/courses/add/page.tsx
"use client";

import { useState } from "react";
import { useSubmit } from "@remix-run/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import { redirect } from "@remix-run/react";
import { Upload, Image, Video, CctvIcon } from "lucide-react";
import { MetaFunction } from "@remix-run/node";

export default function AddCoursePage() {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // You'll implement the actual submission logic
      console.log("Form data to submit:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return redirect("/courses");
    } catch (error) {
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="container py-8">
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Add New Course</CardTitle>
          <CardDescription>
            Fill out the form below to create a new course.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Course Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter course title"
                required
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
                    <label htmlFor="thumbnail" className="cursor-pointer">
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

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter course description"
                rows={5}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => redirect("/courses")}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Course"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export const meta: MetaFunction = () => {
  return [{ title: "Add course" }];
};
