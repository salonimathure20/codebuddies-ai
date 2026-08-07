export interface DecodedToken {
  id: string;
  email: string;
  name: string;
  userType: string;
  isOrganizationUser?: boolean;
  organizationId?: string;
  exp: number; // Expiration time in seconds
}
