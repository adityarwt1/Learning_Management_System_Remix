import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL as string, {
      dbName: "VoteLMS",
    });
  } catch (error) {
    console.log((error as Error).message);
  }
};
