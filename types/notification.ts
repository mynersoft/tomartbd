import { Types } from "mongoose";

export type NotificationType =
  | "order"
  | "vendor"
  | "withdraw"
  | "flash-sale"
  | "system";

export interface INotification {
  _id?: Types.ObjectId;

  title: string;
  message: string;

  type?: NotificationType;

  isRead?: boolean;
  adminOnly?: boolean;

  link?: string;

  createdAt?: Date;
  updatedAt?: Date;
}