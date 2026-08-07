import { NextFunction, Request, Response } from "express";
import {
  createUser,
  findUserByEmail,
  deleteUserRepo,
  resetPasswordRepo,
  findAllActiveUsers,
  activateUser,
} from "../services/user-service";
import { comparePassword, hashPassword } from "../../utils/bcrypt";
import { IUser } from "../../interfaces/user";
import STATUS from "../../constants/authCodes";
import { Result } from "../../interfaces/result";
import logger from "../../utils/logger";
import { generateToken } from "../../utils/get-jwt";
import { IOrganization } from "../../interfaces/organization";

export const signUpController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Destructuring data from the request body
    const {
      name,
      email,
      password,
      userType,
      isOrganizationUser,
      organizationName,
      organizationId,
    } = req.body;

    if (!email || !password) {
      res.status(STATUS.BAD_REQUEST).json({
        status: STATUS.BAD_REQUEST,
        message: "Email & Password can't be null",
      });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Check if the user already exists
    const isExistingUser: Result<IUser> = await findUserByEmail(email);
    if (isExistingUser.isOk()) {
      res.status(STATUS.BAD_REQUEST).json({
        status: STATUS.BAD_REQUEST,
        message: "User already exists!",
      });
    }

    // Create a new user

    const result: Result<IUser | null> = await createUser(
      {
        name,
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        userType,
        currentStatus: "active",
        isOrganizationUser,
        organizationId,
      },
      organizationName
    );

    if (result.isError()) {
      res.status(STATUS.INTERNAL_SERVER_ERROR).json({
        status: STATUS.INTERNAL_SERVER_ERROR,
        message: result.error?.customMessage || "Error creating user",
      });
    }

    // Generate a token for the user
    const token = await generateToken({
      id: result.data?._id!,
      name: result.data?.name!,
      email: result.data?.email!,
      userType: result.data?.userType!,
      isOrganizationUser: result.data?.isOrganizationUser,
      organizationId: result?.data?.organizationId,
    });

    // Return a success response
    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Sign Up Successful",
      token,
    });
  } catch (error) {
    logger.error(`Error in signUpController: ${JSON.stringify(error)}`);
    next(error); // Pass error to global error handler
  }
};

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Destructuring data from the request body
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      res.status(STATUS.BAD_REQUEST).json({
        status: STATUS.BAD_REQUEST,
        message: "Email & Password can't be null",
      });
      return; // Ensure the function stops here
    }

    // Find user by email
    const result: Result<IUser> = await findUserByEmail(
      email.toLowerCase().trim()
    );
    if (
      result.isError() ||
      !(await comparePassword(password, result.data?.password!))
    ) {
      res.status(STATUS.BAD_REQUEST).json({
        status: STATUS.BAD_REQUEST,
        message: "Invalid Credentials",
      });
      return; // Ensure the function stops here
    }

    // Activate the user if the userId exists
    const userId = result.data?._id;
    if (!userId) {
      res.status(STATUS.BAD_REQUEST).json({
        status: STATUS.BAD_REQUEST,
        message: "Missing user ID",
      });
      return; // Ensure the function stops here
    }
    await activateUser(userId);

    // Generate token
    const token = await generateToken({
      id: userId,
      name: result.data?.name!,
      email: result.data?.email!,
      userType: result.data?.userType!,
      isOrganizationUser: result?.data.isOrganizationUser!,
      organizationId: result?.data?.organizationId,
    });

    // Return success response
    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Login Successful",
      token,
    });
  } catch (error) {
    logger.error(`Error in loginController: ${JSON.stringify(error)}`);
    next(error); // Pass error to the global error handler
  }
};

export const deleteUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Extract user ID from route parameters
    const { id } = req.params;

    if (!id) {
      res.status(STATUS.BAD_REQUEST).json({
        status: STATUS.BAD_REQUEST,
        message: "User ID is required",
      });
      return;
    }

    // Call the repository to delete the user
    const result = await deleteUserRepo(id);

    if (result.isError()) {
      res
        .status(result.error?.statusCode || STATUS.INTERNAL_SERVER_ERROR)
        .json({
          status: result.error?.statusCode || STATUS.INTERNAL_SERVER_ERROR,
          message: result.error?.customMessage || "Failed to delete user",
        });
      return;
    }

    // Return success response
    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "User deleted successfully",
    });
  } catch (error) {
    logger.error(`Error in deleteUserController: ${JSON.stringify(error)}`);
    next(error); // Pass error to global error handler
  }
};

export const resetPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Extract user ID from params and new password from the request body
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!id || !newPassword) {
      res.status(STATUS.BAD_REQUEST).json({
        status: STATUS.BAD_REQUEST,
        message: "User ID and new password are required",
      });
      return;
    }

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);

    // Call the repository to reset the user's password
    const result = await resetPasswordRepo(id, hashedPassword);

    if (result.isError()) {
      res
        .status(result.error?.statusCode || STATUS.INTERNAL_SERVER_ERROR)
        .json({
          status: result.error?.statusCode || STATUS.INTERNAL_SERVER_ERROR,
          message: result.error?.customMessage || "Failed to reset password",
        });
      return;
    }

    // Return success response
    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Password changed successfully",
    });
  } catch (error) {
    logger.error(`Error in resetPasswordController: ${JSON.stringify(error)}`);
    next(error); // Pass error to global error handler
  }
};

export const findAllActiveUsersController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Fetch all active users
    const organizationId = req.query.organizationId as string | undefined;
    const result = await findAllActiveUsers(organizationId);

    if (result.isError()) {
      res.status(result.error?.statusCode || STATUS.BAD_REQUEST).json({
        status: result.error?.statusCode || STATUS.BAD_REQUEST,
        message: result.error?.customMessage || "Error fetching active users",
      });
      return;
    }

    // Return success response
    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Active users retrieved successfully",
      data: result.data,
    });
  } catch (error) {
    logger.error(
      `Error in findAllActiveUsersController: ${JSON.stringify(error)}`
    );
    next(error); // Pass error to global error handler
  }
};
