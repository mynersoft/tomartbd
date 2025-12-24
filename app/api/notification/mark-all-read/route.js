// app/api/notifications/mark-all-read/route.js (CORRECT PATH)
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Notification from '@/models/Notification';

export async function POST(request) {
  try {
    await connectDB();
    
    // Get userId from request body
    const body = await request.json();
    const { userId } = body;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    // Update all unread notifications for this user
    await Notification.updateMany(
      { userId, read: false },
      { $set: { read: true } }
    );

    return NextResponse.json({ 
      success: true,
      message: 'All notifications marked as read'
    });
    
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    return NextResponse.json(
      { error: 'Failed to update notifications' },
      { status: 500 }
    );
  }
}