import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
	{
		title: String,
		message: String,
		type: { type: String, default: "info" },
		read: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

export default mongoose.models.Notification ||
	mongoose.model("Notification", NotificationSchema);
