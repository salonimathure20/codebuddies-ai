export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  userType: string;
  currentStatus: string;
  isOrganizationUser?: boolean;
  organizationId?: string;
}
