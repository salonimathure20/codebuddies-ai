import jwt from "jsonwebtoken";
import { IUserTokenDetails } from "../interfaces/jwt-token";

export const generateToken = async ({
  id,
  name,
  email,
  userType,
  isOrganizationUser,
  organizationId,
}: IUserTokenDetails): Promise<string> => {
  return jwt.sign(
    { id, name, email, userType, isOrganizationUser, organizationId },
    process.env.JWT_SECRET!,
    {
      expiresIn: "1hr",
    }
  );
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, process.env.JWT_SECRET as string);
};
