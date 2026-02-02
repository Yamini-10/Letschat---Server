import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  lastSeen: Date,
  isOnline: boolean
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    isOnline:{
      type: Boolean,
    },
    lastSeen: {type: Date}
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
