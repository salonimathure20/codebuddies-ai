import { ObjectId } from "mongoose";

export interface IUser {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
  userType: string;
  currentStatus?: string;
  isOrganizationUser: boolean;
  organizationId?: string;
}
