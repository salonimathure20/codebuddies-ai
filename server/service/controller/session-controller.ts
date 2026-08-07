import { Request, Response, NextFunction } from "express";
import STATUS from "../../constants/authCodes";
import {
  createSessionService,
  updateSessionService,
  fetchSessionByProctorIdService,
  fetchSessionByCoderIdService,
  fetchSessionByIdService,
} from "../services/session-service";
import logger from "../../utils/logger";
import { ISession } from "../../interfaces/session";

export const createSessionController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { coderId, proctorId, allottedTime, language, status, date } =
      req.body;

    if (!coderId || !proctorId) {
      res.status(STATUS.BAD_REQUEST).json({
        status: STATUS.BAD_REQUEST,
        message: "Coder ID or Proctor ID can't be null",
      });
      return;
    }

    const data: ISession = {
      coderId,
      proctorId,
      allottedTime,
      language,
      status,
      date,
    };
    const result = await createSessionService(data);

    if (result.isError()) {
      res
        .status(result.error?.statusCode || STATUS.INTERNAL_SERVER_ERROR)
        .json({
          status: result.error?.statusCode || STATUS.INTERNAL_SERVER_ERROR,
          message: result.error?.customMessage || "Error creating session",
        });
      return;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Session created successfully",
      data: result.data,
    });
  } catch (error) {
    logger.error(`Error in createSessionController: ${JSON.stringify(error)}`);
    next(error);
  }
};

export const updateSessionController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      res.status(STATUS.BAD_REQUEST).json({
        status: STATUS.BAD_REQUEST,
        message: "Status cannot be null",
      });
      return;
    }

    const result = await updateSessionService(id, status);

    if (result.isError()) {
      res
        .status(result.error?.statusCode || STATUS.INTERNAL_SERVER_ERROR)
        .json({
          status: result.error?.statusCode || STATUS.INTERNAL_SERVER_ERROR,
          message: result.error?.customMessage || "Error updating session",
        });
      return;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Session updated successfully",
      data: result.data,
    });
  } catch (error) {
    logger.error(`Error in updateSessionController: ${JSON.stringify(error)}`);
    next(error);
  }
};

export const fetchSessionsByProctorIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await fetchSessionByProctorIdService(id);

    if (result.isError()) {
      res.status(result.error?.statusCode || STATUS.NOT_FOUND).json({
        status: result.error?.statusCode || STATUS.NOT_FOUND,
        message: result.error?.customMessage || "Sessions not found",
      });
      return;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Sessions retrieved successfully",
      data: result.data,
    });
  } catch (error) {
    logger.error(
      `Error in fetchSessionsByProctorIdController: ${JSON.stringify(error)}`
    );
    next(error);
  }
};

export const fetchSessionsByCoderIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await fetchSessionByCoderIdService(id);

    if (result.isError()) {
      res.status(result.error?.statusCode || STATUS.NOT_FOUND).json({
        status: result.error?.statusCode || STATUS.NOT_FOUND,
        message: result.error?.customMessage || "Sessions not found",
      });
      return;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Sessions retrieved successfully",
      data: result.data,
    });
  } catch (error) {
    logger.error(
      `Error in fetchSessionsByCoderIdController: ${JSON.stringify(error)}`
    );
    next(error);
  }
};

export const fetchSessionByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await fetchSessionByIdService(id);

    if (result.isError()) {
      res.status(result.error?.statusCode || STATUS.NOT_FOUND).json({
        status: result.error?.statusCode || STATUS.NOT_FOUND,
        message: result.error?.customMessage || "Session not found",
      });
      return;
    }

    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Session retrieved successfully",
      data: result.data,
    });
  } catch (error) {
    logger.error(
      `Error in fetchSessionByIdController: ${JSON.stringify(error)}`
    );
    next(error);
  }
};
