import mongoose, { Schema, Document } from "mongoose";

export interface IProfile extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  bio?: string;
  techSkills: string[];
  previousExperience?: string;
  profilePicture?: string;
}

const ProfileSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    bio: { type: String },
    techSkills: { type: [String], required: true },
    previousExperience: { type: String },
    profilePicture: { type: String },
  },
  { timestamps: true }
);

export const Profile = mongoose.model<IProfile>("Profile", ProfileSchema);
