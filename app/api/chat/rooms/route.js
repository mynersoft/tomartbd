import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { ChatRoom } from '@/models/Chat';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const rooms = await ChatRoom.find({
      'participants.userId': userId,
    })
      .sort({ lastMessageAt: -1 })
      .populate('productId', 'name images');

    return NextResponse.json({ rooms });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { userId, userType, productId, userName, userAvatar } = data;

    // Generate unique room ID
    const roomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const room = new ChatRoom({
      roomId,
      participants: [
        {
          userId,
          userType,
          name: userName,
          avatar: userAvatar,
        },
      ],
      productId,
      unreadCount: { admin: 0 },
    });

    await room.save();

    return NextResponse.json({ room });
  } catch (error) {
    console.error('Error creating room:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
