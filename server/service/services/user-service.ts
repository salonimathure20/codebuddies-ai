import { ObjectId } from "mongoose";
import UserModel from "../models/user";
import { Result } from "../../interfaces/result";
import { IUser } from "../../interfaces/user";
import logger from "../../utils/logger";
import { IOrganization } from "../../interfaces/organization";
import OrganizationModel from "../models/organization";

export const findUserByEmail = async (email: string) => {
  try {
    const result = await UserModel.findOne({
      email,
    });

    if (!result) {
      return Result.error("User not found");
    }

    // if user details stored than return success as true
    return Result.ok(result);
  } catch (error) {
    // logging the error
    logger.error(
      `at:"repositories/userRepo/findUserByEmail" => ${JSON.stringify(
        error
      )}\n${error}`
    );
    // returning false
    return Result.error(error);
  }
};

//This code is for deleting user
export const deleteUserRepo = async (id: string) => {
  try {
    const result = await UserModel.findByIdAndDelete(id);

    if (!result) {
      return Result.error("User not deleted");
    }

    // if user details stored than return success as true
    return Result.ok(result);
  } catch (error) {
    // logging the error
    logger.error(
      `at:"repositories/userRepo/deleteUserRepo" => ${JSON.stringify(
        error
      )}\n${error}`
    );
    // returning false
    return Result.error(error);
  }
};

export const createUser = async (
  data: IUser,
  organizationName?: boolean
): Promise<Result<IUser | null>> => {
  try {
    // destructuring data
    const {
      name,
      email,
      password,
      userType,
      currentStatus,
      isOrganizationUser,
      organizationId,
    } = data;
    // creating new user details data in database.
    const result1 = await UserModel.create({
      name,
      email: email.toLowerCase(),
      password,
      userType,
      currentStatus,
      isOrganizationUser,
      organizationId,
    });

    let orgResult: IOrganization;
    let result2: IUser | null;
    if (isOrganizationUser) {
      if (!organizationName) {
        throw new Error(
          "Organization name is required for organization users."
        );
      }
      orgResult = await OrganizationModel.create({
        name: organizationName,
        adminIds: [result1?._id],
      });

      result2 = await UserModel.findByIdAndUpdate(result1?._id, {
        organizationId: orgResult?._id,
      });
    }

    // if user details stored than return success as true
    return Result.ok(result2!);
  } catch (error) {
    // logging the error
    logger.error(
      `at:"repositories/userRepo/createUser" => ${JSON.stringify(
        error
      )}\n${error}`
    );
    // returning false
    return Result.error(error);
  }
};

export const resetPasswordRepo = async (id: string, newPassword: string) => {
  try {
    const result = await UserModel.findByIdAndUpdate(id, {
      password: newPassword,
    });

    if (!result) {
      return Result.error("Password not changed");
    }

    // if user details stored than return success as true
    return Result.ok(result);
  } catch (error) {
    // logging the error
    logger.error(
      `at:"repositories/userRepo/resetPassword" => ${JSON.stringify(
        error
      )}\n${error}`
    );
    // returning false
    return Result.error(error);
  }
};

export const findAllActiveUsers = async (organizationId?: string) => {
  try {
    // Create query object to filter users based on their status and optionally their organizationId
    let query;

    // If organizationId is provided, modify the query to include users belonging to that organization
    if (organizationId) {
      query = { currentStatus: "active", organizationId };
    } else {
      query = { currentStatus: "active" };
    }

    const result = await UserModel.find(query);

    if (!result) {
      return Result.error("Active users not found.");
    }

    // if user details stored than return success as true
    return Result.ok(result);
  } catch (error) {
    // logging the error
    logger.error(
      `at:"repositories/userRepo/findAllActiveUsers" => ${JSON.stringify(
        error
      )}\n${error}`
    );
    // returning false
    return Result.error(error);
  }
};

export const activateUser = async (id: ObjectId) => {
  try {
    const result = await UserModel.findByIdAndUpdate(id, {
      currentStatus: "active",
    });

    if (!result) {
      return Result.error("User was not activated.");
    }

    // if user details stored than return success as true
    return Result.ok(result);
  } catch (error) {
    // logging the error
    logger.error(
      `at:"repositories/userRepo/activateUser" => ${JSON.stringify(
        error
      )}\n${error}`
    );
    // returning false
    return Result.error(error);
  }
};
