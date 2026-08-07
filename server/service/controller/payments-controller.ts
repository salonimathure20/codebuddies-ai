import PaymentModel from "../models/payments";
import { NextFunction, Request, Response } from "express";
import UserModel from "../models/user";

export const savePaymentDetails = async (
  req: Request,
  res: Response<any, Record<string, any>>, // Explicitly set the generic types for Response
  next: NextFunction
): Promise<void> => {
  console.log("Route handler triggered with body:", req.body);

  try {
    const { username, planName, price, paymentStatus } = req.body;
    console.log({ username, planName, price, paymentStatus });
    // Validate user
    const user = await UserModel.findOne({ name: username });
    console.log(user);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return; // Exit the function to prevent further execution
    }

    // Save payment data
    const payment = new PaymentModel({
      userName: username, // Assuming username is a property on the user model
      planName,
      price,
      paymentStatus,
    });
    await payment.save();

    res.status(201).json({ message: "Payment details saved successfully" });
  } catch (error) {
    console.error("Error saving payment details:", error);
    next(error); // Pass error to the error handling middleware
  }
};
