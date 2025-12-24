// app/api/notifications/[id]/read/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Notification from '@/models/Notification';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";



export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id; //
const id = userId;

    const notification = await Notification.findByIdAndUpdate(
      id,
      { $set: { read: true } },
      { new: true }
    );

    if (!notification) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true,
      notification 
    });
    
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    );
  }
}