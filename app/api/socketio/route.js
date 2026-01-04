import { NextResponse } from 'next/server';

// This route is just for WebSocket connection initiation
export async function GET() {
  return NextResponse.json({ message: 'Socket.IO endpoint' });
}
