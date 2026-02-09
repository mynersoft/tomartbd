import { Types } from "mongoose";

export type UserRole = "user" | "admin" | "seller";

export interface IUserAddress {
  area?: string;
  thana?: string;
  city?: string;
}

export interface IUser {
  _id?: Types.ObjectId;

  name: string;
  email: string;
  phone?: string;
  password?: string;

  role?: UserRole;

  address?: IUserAddress;

//for vendor products
  products?: Types.ObjectId[];
  shopName?: string;
  shopAddress?: string;

  bankAccount?: string;
  bankName?: string;
  bankBranch?: string;

  avatar?: string;

  isVerified?: boolean;

  otp?: string;
  otpExpiresAt?: Date;

  createdAt?: Date;
  updatedAt?: Date;
}