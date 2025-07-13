import mongoose, { Document, Schema } from "mongoose";

interface Image extends Document {
  url: string;
}

const ImageSchema: Schema<Image> = new Schema({
  url: {
    type: String,
  },
});

const Image =
  mongoose.models.Image || mongoose.model<Image>("Image", ImageSchema);
export default Image;
