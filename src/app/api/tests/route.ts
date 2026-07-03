// src/app/api/tests/route.ts
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Test } from '@/models/Test';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    const tests = await Test.find({}).sort({ createdAt: -1 });
    return NextResponse.json(tests, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}