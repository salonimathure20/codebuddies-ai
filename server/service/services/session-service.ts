import mongoose from "mongoose";
import SessionsModel from "../models/session";
import UserModel from "../models/user";
import { Result } from "../../interfaces/result";
import { ISession } from "../../interfaces/session";
import logger from "../../utils/logger";

export const createSessionService = async (data: ISession) => {
  try {
    const { coderId, proctorId } = data;

    const coderExists = await UserModel.findOne({ _id: coderId });
    const proctorExists = await UserModel.findOne({
      _id: proctorId,
    });

    if (!coderExists) {
      return Result.error("Coder not found");
    }

    if (!proctorExists) {
      return Result.error("Proctor not found");
    }
    const result = await SessionsModel.create(data);
    return Result.ok(result);
  } catch (error) {
    // logging the error
    logger.error(
      `at:"services/sessionService/createSessionService" => ${JSON.stringify(
        error
      )}\n${error}`
    );
    // returning false
    return Result.error(error);
  }
};

export const updateSessionService = async (id: string, status: string) => {
  try {
    const result = await SessionsModel.findByIdAndUpdate(id, {
      status,
    });

    if (!result) {
      return Result.error("Session not found");
    }

    return Result.ok(result);
  } catch (error) {
    // logging the error
    logger.error(
      `at:"services/sessionService/createSessionService" => ${JSON.stringify(
        error
      )}\n${error}`
    );
    // returning false
    return Result.error(error);
  }
};

export const fetchSessionByProctorIdService = async (id: string) => {
  try {
    const result = await SessionsModel.find({
      proctorId: id,
      status: "created",
    }).populate("coderId", "name");

    if (!result) {
      return Result.error("Sessions not found");
    }

    return Result.ok(result);
  } catch (error) {
    // logging the error
    logger.error(
      `at:"services/sessionService/fetchSessionByProctorIdService" => ${JSON.stringify(
        error
      )}\n${error}`
    );
    // returning false
    return Result.error(error);
  }
};

export const fetchSessionByCoderIdService = async (id: string) => {
  try {
    const result = await SessionsModel.find({
      coderId: id,
    }).populate("proctorId", "name");

    if (!result) {
      return Result.error("Sessions not found");
    }

    return Result.ok(result);
  } catch (error) {
    // logging the error
    logger.error(
      `at:"services/sessionService/fetchSessionByCoderIdService" => ${JSON.stringify(
        error
      )}\n${error}`
    );
    // returning false
    return Result.error(error);
  }
};

export const fetchSessionByIdService = async (id: string) => {
  try {
    const result = await SessionsModel.findById(id)
      .populate("coderId", "name")
      .populate("proctorId", "name");

    if (!result) {
      return Result.error("Sessions not found");
    }

    return Result.ok(result);
  } catch (error) {
    // logging the error
    logger.error(
      `at:"services/sessionService/fetchSessionByIdService" => ${JSON.stringify(
        error
      )}\n${error}`
    );
    // returning false
    return Result.error(error);
  }
};
