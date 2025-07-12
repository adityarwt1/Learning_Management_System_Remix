import mongoose, { Schema } from "mongoose";
import { Document } from "mongoose";

// Define the subtitle interface
interface Subtitle {
  title: string;
  videourl: string;
}

// Define the chapter interface
interface Chapter extends Document {
  refrence: string;
  title: string;
  subtitles: Subtitle[];
  createdAt: Date;
  updatedAt: Date;
}

// Define the subtitle schema
const SubtitleSchema: Schema<Subtitle> = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    videourl: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
); // Disable _id for subdocuments

// Define the chapter schema
const ChapterSchema: Schema<Chapter> = new Schema(
  {
    refrence: {
      type: String,
      required: true,
      trim: true,
      index: true, // Add index for better query performance
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitles: [SubtitleSchema],
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt
  }
);

// Add indexes for better performance
ChapterSchema.index({ refrence: 1 });
ChapterSchema.index({ title: 1 });

// Add validation
ChapterSchema.pre("save", function (next) {
  if (this.subtitles.length === 0) {
    next(new Error("Chapter must have at least one subtitle"));
  }
  next();
});

const Chapter =
  mongoose.models.Chapter || mongoose.model<Chapter>("Chapter", ChapterSchema);

export default Chapter;
export type { Chapter, Subtitle };
