import mongoose, { Schema, Document, ObjectId } from "mongoose";
import { ISession } from "../../interfaces/session";

interface ISessionModel extends ISession, Document {
  _id: ObjectId;
}

const sessionsSchema = new Schema<ISessionModel>(
  {
    coderId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    proctorId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    videoUrl: { type: String },
    code: { type: String },
    allottedTime: { type: String, required: true },
    language: { type: String, required: true },
    status: { type: String, required: true },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

const SessionsModel = mongoose.model<ISessionModel>("sessions", sessionsSchema);
export default SessionsModel;
