import mongoose, { Schema, Document, ObjectId } from "mongoose";
import { IUser } from "../../interfaces/user";

interface IUserModel extends IUser, Document {
  _id: ObjectId;
}

const userSchema = new Schema<IUserModel>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userType: {
      type: String,
      required: true,
      enum: ["proctor", "coder", "admin"],
    },
    currentStatus: { type: String, required: true },
    isOrganizationUser: { type: Boolean, required: true },
    organizationId: { type: String, ref: "organizations" },
  },
  { timestamps: true }
);

const UserModel = mongoose.model<IUserModel>("users", userSchema);
export default UserModel;
