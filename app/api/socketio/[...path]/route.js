import { NextRequest, NextResponse } from 'next/server';
import { initSocketIO } from '@/lib/socket-server';

// This is a catch-all route for Socket.IO
export const dynamic = 'force-dynamic';

export async function GET(request) {
  return NextResponse.json({
    message: 'Socket.IO is running',
    timestamp: new Date().toISOString(),
  });
}
