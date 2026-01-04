import { NextResponse } from "next/server";
import {connectDB} from "@/lib/db";
import Notification from "@/models/Notification";

export async function GET(req) {
  // 🔌 Connect DB
  await connectDB();

  try {
    
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json({ success: true, notifications });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}