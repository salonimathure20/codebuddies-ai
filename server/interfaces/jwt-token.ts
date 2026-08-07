import { ObjectId } from "mongoose";

export interface IUserTokenDetails {
  id: ObjectId;
  email: string;
  name: string;
  userType: string;
  isOrganizationUser?: boolean;
  organizationId?: string;
}
