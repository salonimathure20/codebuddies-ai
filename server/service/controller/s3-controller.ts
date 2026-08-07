import AWS from "aws-sdk";
import SessionsModel from "../models/session";
import STATUS from "../../constants/authCodes";
import { Request, Response, NextFunction } from "express";
import logger from "../../utils/logger";
import { CustomError } from "../../middlewares/error";
import multer from "multer";

// Configure AWS S3 using environment variables
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  region: process.env.AWS_REGION!,
});

const s3 = new AWS.S3();
const upload = multer();
const signedUrlExpireSeconds = 3000;

/**
 * Controller function for handling the S3 URL generation and session update.
 * @param req - The HTTP request
 * @param res - The HTTP response
 * @param next - The next middleware function
 */
export const s3Controller = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId, sessionId, filename } = req.body;

    // If any of these parameters are missing, return an error
    if (!userId || !sessionId || !filename) {
      res.status(STATUS.BAD_REQUEST).json({
        status: STATUS.BAD_REQUEST,
        message: "UserId, sessionId, and filename are required.",
      });
    }

    const BUCKET = process.env.AWS_BUCKET_NAME!;
    const KEY = `${userId}/${sessionId}/${filename}`;

    // Generate a pre-signed URL for uploading the video file to S3
    const url = await s3.getSignedUrlPromise("putObject", {
      Bucket: BUCKET,
      Key: KEY,
      Expires: signedUrlExpireSeconds,
      ContentType: "video/mp4",
    });

    // Update the session with the S3 URL of the uploaded video
    const updatedSession = await SessionsModel.findByIdAndUpdate(sessionId, {
      videoUrl: `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${userId}/${sessionId}/${filename}`,
    });

    if (!updatedSession) {
      const err: CustomError = {
        statusCode: STATUS.NOT_FOUND,
        customMessage: "Session not found or could not be updated.",
      };
      throw err;
    }

    // Return the signed URL and the updated session data
    res.status(STATUS.OK).json({
      status: STATUS.OK,
      message: "Video added to S3 bucket and session updated",
      result: {
        signedUrl: url,
        updatedSession,
      },
    });
  } catch (err) {
    logger.error(`Error in s3Controller: ${JSON.stringify(err)}`);
    next(err); // Pass the error to the error handling middleware
  }
};

/**
 * Controller function for handling the S3 URL generation and session update.
 * @param req - The HTTP request
 * @param res - The HTTP response
 * @param next - The next middleware function
 */
export const getProfilePictureSignedUrl = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, filename } = req.body;
    const file = req.file; // File provided by Multer

    if (!file || !userId || !filename) {
      res.status(400).send({ error: "Missing required fields or file." });
    }
    const BUCKET = process.env.AWS_BUCKET_NAME!;
    const key = `profile-pictures/${userId}`;

    // Generate a pre-signed URL
    const signedUrl = s3.getSignedUrl("putObject", {
      Bucket: BUCKET,
      Key: key,
      Expires: 60, // URL expires in 60 seconds
      ContentType: file?.mimetype,
    });

    const imgUrl = `https://${BUCKET}.s3.amazonaws.com/${key}`;

    res.status(200).json({
      result: {
        signedUrl,
        imgUrl,
      },
    });
  } catch (err) {
    console.error("Error generating signed URL:", err);
    res.status(500).send({ error: "Failed to generate signed URL." });
  }
};
