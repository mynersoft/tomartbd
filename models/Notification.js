import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  message: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    enum: [
      "order",
      "vendor",
      "withdraw",
      "flash-sale",
      "system",
    ],
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
    type: String, // redirect link in admin panel
  },
}, { timestamps: true });

export default mongoose.model("Notification", NotificationSchema);