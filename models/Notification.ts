import mongoose, { Schema, Model, Document } from "mongoose";
import { INotification } from "@/types/notification";

export interface NotificationDocument
  extends Omit<INotification, "_id">,
    Document {}

const NotificationSchema = new Schema<NotificationDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["order", "vendor", "withdraw", "flash-sale", "system"],
      default: "system",
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    adminOnly: {
      type: Boolean,
      default: true,
    },

    link: {
      type: String,
    },
  },
  { timestamps: true }
);

/* -------- Prevent model overwrite (Next.js) -------- */
const Notification: Model<NotificationDocument> =
  mongoose.models.Notification ||
  mongoose.model<NotificationDocument>(
    "Notification",
    NotificationSchema
  );

export default Notification;