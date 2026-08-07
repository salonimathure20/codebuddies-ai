import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "../../interfaces/user";

interface IPayment extends Document {
  userName: string; // Reference to the User schema
  planName: string;
  price: string;
  paymentStatus: string; // e.g., "succeeded", "failed", "pending"
  createdAt: Date;
}

const paymentSchema = new Schema<IPayment>({
  userName: { type: String, required: true },
  planName: { type: String, required: true },
  price: { type: String, required: true },
  paymentStatus: {
    type: String,
    required: true,
    enum: ["succeeded", "failed", "pending"],
  },
  createdAt: { type: Date, default: Date.now },
});

const PaymentModel = mongoose.model<IPayment>("payments", paymentSchema);
export default PaymentModel;
