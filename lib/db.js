import mongoose from "mongoose";

let isConnected = false;

export async function connectDB() {
	if (isConnected) return;
	mongoose.set("strictQuery", true);
	await mongoose.connect(process.env.MONGODB_URI);
	isConnected = true;
	console.log("MongoDB connected");
}
