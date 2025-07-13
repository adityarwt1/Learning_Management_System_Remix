// app/models/video.ts
import mongoose, { Schema } from "mongoose";

interface Video extends Document {
  url: string;
  createdAt: Date;
  updatedAt: Date;
}

const VideoSchema: Schema<Video> = new Schema(
  {
    url: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Video =
  mongoose.models.Video || mongoose.model<Video>("Video", VideoSchema);

export default Video;
