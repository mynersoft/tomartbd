import { Types } from "mongoose";

export interface IBrand {
  _id?: Types.ObjectId;

  name: string;
  slug?: string;
  logo?: string;

  createdAt?: Date;
  updatedAt?: Date;
}