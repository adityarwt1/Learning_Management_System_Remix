import mongoose, { Document, Schema } from "mongoose";

interface Course extends Document {
  title: string;
  thumbnail: string;
  description: string;
  rating: number;
  votes: number;
  instroductionVideo: string;
}

const CourseSchema: Schema<Course> = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
    },
    votes: {
      type: Number,
    },
    instroductionVideo: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Course =
  mongoose.models.Course || mongoose.model<Course>("Course", CourseSchema);

export default Course;
