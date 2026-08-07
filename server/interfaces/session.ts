import { ObjectId } from "mongoose";

export interface ISession {
  _id?: ObjectId;
  coderId: ObjectId;
  proctorId: ObjectId;
  videoUrl?: string;
  code?: string;
  allottedTime: string;
  language: string;
  status: string;
  date: Date;
}
