import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
	{
		userId: mongoose.Schema.Types.ObjectId,
		sender: { type: String, enum: ["admin", "user"] },
		message: String,
	},
	{ timestamps: true }
);

export default mongoose.models.Chat || mongoose.model("Chat", ChatSchema);
