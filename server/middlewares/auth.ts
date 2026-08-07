import { NextFunction, Request, Response } from "express";
// Middleware for authorizing requests

import STATUS from "../constants/authCodes";
import { verifyToken } from "../utils/get-jwt";

export default (req: Request, res: Response, next: NextFunction) => {
  const bearerHeader = req.header("Authorization");
  if (!bearerHeader)
    return res
      .status(STATUS.UNAUTHORIZED)
      .send("Access Denied. No token provided.");
  const bearer = bearerHeader.split(" ");
  const token = bearer[1];
  if (!token)
    return res
      .status(STATUS.UNAUTHORIZED)
      .send("Access Denied. No token provided.");

  try {
    // using jwt.verify to verify if it is a valid token
    const decoded = verifyToken(token);

    // returns the value of the jwt if the token is verified
    req.user = decoded;
    next();
  } catch (err) {
    next({
      statusCode: STATUS.FORBIDDEN,
      customMessage: "Invalid token",
    });
  }
};
