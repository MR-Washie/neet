import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Attempt } from '@/models/Attempt';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions'; // Ensure this matches your project location

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Authentication clearance required.' }, { status: 401 });
    }

    await connectToDatabase();
    const body = await req.json();
    
    const { testId, testTitle, totalMarks, maxPossibleMarks, correctAnswers, wrongAnswers, attemptedCount, selectedAnswersSnapshot } = body;

    const userIdentifier = session.user.email || 'guest_user';

    const newAttempt = await Attempt.create({
      userId: userIdentifier,
      testId,
      testTitle,
      totalMarks,
      maxPossibleMarks,
      correctAnswers,
      wrongAnswers,
      attemptedCount,
      selectedAnswersSnapshot
    });

    return NextResponse.json({ message: 'Telemetry saved securely.', attemptId: newAttempt._id }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Authentication clearance required.' }, { status: 401 });
    }

    await connectToDatabase();
    const userIdentifier = session.user.email || 'guest_user';

    // Fetch user attempts sorted by latest attempt date
    const userHistory = await Attempt.find({ userId: userIdentifier }).sort({ attemptedAt: -1 });
    return NextResponse.json(userHistory, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}