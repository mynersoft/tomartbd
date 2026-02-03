import { Types } from "mongoose";

export interface IVisitor {
  _id?: Types.ObjectId;

  ip: string;
  userAgent?: string;
  path?: string; // page visited

  createdAt?: Date;
  updatedAt?: Date;
}