import mongoose, { Schema, Document } from "mongoose";

interface User extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
}

const UserSchema: Schema<User> = new Schema({
  name: {
    type: String,
    required: [true, "Please provide the name"],
  },
  email: {
    type: String,
    required: [true, "Please provide the name"],
  },
  password: {
    type: String,
    required: [true, "Please provide the password"],
  },
  role: {
    type: String,
    required: [true, "Please provide the role"],
  },
});

const User = mongoose.models.User || mongoose.model<User>("User", UserSchema);

export default User;
