import { Types } from "mongoose";

/* -------- Answer Type -------- */
export interface IAnswer {
  _id?: Types.ObjectId;

  userId: Types.ObjectId;
  answer: string;

  isAdmin?: boolean;
  isApproved?: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

/* -------- Question Type -------- */
export interface IQuestion {
  _id?: Types.ObjectId;

  productId: Types.ObjectId;
  userId: Types.ObjectId;

  question: string;
  answers?: IAnswer[];

  createdAt?: Date;
  updatedAt?: Date;
}