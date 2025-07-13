// app/routes/video.tsx
import { ActionFunction, ActionFunctionArgs, json } from "@remix-run/node";
import { useSubmit } from "@remix-run/react";
import { connectDB } from "~/lib/mongodb";
import Video from "~/models/video"; // You'll need to create this model

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  const formdata = await request.formData();
  console.log("video data of form ", formdata);

  await connectDB();
  const video = new Video({ url: formdata.get("url") });
  await video.save();
  return json({ success: true, message: "Video processed" });
};

export default function VideoUpload() {
  const submit = useSubmit();
  const base64Video = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      console.log("file not found");
      return;
    }
    const videoUrl = await base64Video(file);
    const formdata = new FormData();
    if (!videoUrl) return;
    formdata.append("url", videoUrl);
    console.log(videoUrl);
    submit(formdata, {
      method: "POST",
    });
  };

  return (
    <div>
      <input type="file" accept="video/*" onChange={handleVideoChange} />
    </div>
  );
}
