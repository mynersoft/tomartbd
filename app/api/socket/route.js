import { NextResponse } from 'next/server';
import { initSocketIO } from '@/lib/socket';

export async function GET(request) {
  return NextResponse.json({ message: 'Socket.IO API' });
}
