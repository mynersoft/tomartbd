import {connectDB} from '@/lib/db';
import Bogo from '@/models/Bogo';
import { NextResponse } from 'next/server';

export async function POST(req) {
  await connectDB();
  const body = await req.json();
  const bogo = await Bogo.create(body);
  return NextResponse.json(bogo);
}

export async function GET() {
  await connectDB();
  const bogos = await Bogo.find().populate('mainItem freeItem');
  return NextResponse.json(bogos);
}