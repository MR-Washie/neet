import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Test } from '@/models/Test';

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { title, duration, questions } = body;

    // Strict validation mapping
    if (!title || !duration || !questions || !Array.isArray(questions)) {
      return NextResponse.json(
        { error: 'Missing parameters. Ensure test title and question blocks are filled out correctly.' },
        { status: 400 }
      );
    }

    // Creating document model structure matching target parameters layout
    const newTest = new Test({
      title,
      duration: Number(duration),
      questions: questions.map((q) => ({
        imageUrl: q.imageUrl,
        options: q.options,
        correctOptionIndex: Number(q.correctOptionIndex),
        subject: q.subject,
        topic: q.topic || ''
      }))
    });

    await newTest.save();

    return NextResponse.json(
      { message: 'Test completely saved in Cluster node database.', id: newTest._id },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Admin DB insert thread failed:', error);
    return NextResponse.json(
      { error: 'Internal Server Error saving document maps.', details: error.message },
      { status: 500 }
    );
  }
}