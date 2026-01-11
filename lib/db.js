import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env");
}

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;

  try {
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    isConnected = true;
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed. Retrying in 5s...", error);

    setTimeout(connectDB, 5000); // auto retry
  }
}

/* 🔄 Connection event listeners */
mongoose.connection.on("connected", () => {
  console.log("🟢 MongoDB connected");
  isConnected = true;
});

mongoose.connection.on("disconnected", () => {
  console.warn("🟠 MongoDB disconnected. Reconnecting...");
  isConnected = false;
  connectDB();
});

mongoose.connection.on("error", (err) => {
  console.error("🔴 MongoDB error:", err);
});