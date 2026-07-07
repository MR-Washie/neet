import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { Test } from '@/models/Test';

// 1. DELETE: Pure test document ko target karke uda dena
export async function DELETE(req: Request, { params }: { params: any }) {
  try {
    await connectToDatabase();
    
    // Crucial Fix: Naye Next.js versions ke liye params ko await karna zaroori hai
    // Agar params normal object bhi hua, toh Promise.resolve handle kar lega taaki dono environments mein chale
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;

    console.log("➡️ [ADMIN DELETE RUNNING] Targeted ID received:", id);

    if (!id) {
      return NextResponse.json({ error: 'Route parameters missing runtime ID.' }, { status: 400 });
    }

    const deletedTest = await Test.findByIdAndDelete(id);
    if (!deletedTest) {
      console.log(`❌ Test with ID ${id} was not found inside the Database.`);
      return NextResponse.json({ error: 'Test index node not found in Database.' }, { status: 404 });
    }

    console.log(`✅ Success: Test document ${id} permanently wiped.`);
    return NextResponse.json({ message: 'Test and matching modules deleted successfully.' }, { status: 200 });
  } catch (error: any) {
    console.error("💥 Error during delete process:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. PUT: Modifies the complete test schema structure (Title, Duration, Questions array stack)
export async function PUT(req: Request, { params }: { params: any }) {
  try {
    await connectToDatabase();
    
    // Crucial Fix: Await execution configuration for Next.js routing parameters
    const resolvedParams = await Promise.resolve(params);
    const { id } = resolvedParams;

    console.log("➡️ [ADMIN PUT RUNNING] Targeted ID received:", id);

    if (!id) {
      return NextResponse.json({ error: 'Route parameters missing runtime ID.' }, { status: 400 });
    }

    const body = await req.json();
    const { title, duration, questions } = body;

    const updatedTest = await Test.findByIdAndUpdate(
      id,
      {
        title,
        duration: Number(duration),
        questions: questions.map((q: any) => ({
          imageUrl: q.imageUrl,
          options: q.options,
          correctOptionIndex: Number(q.correctOptionIndex),
          subject: q.subject,
          topic: q.topic || ''
        }))
      },
      { new: true } // Returns the newly updated document map
    );

    if (!updatedTest) {
      console.log(`❌ Failed update setup: ID ${id} missing in Database.`);
      return NextResponse.json({ error: 'Failed to find targeted test to update.' }, { status: 404 });
    }

    console.log(`✅ Success: Test document ${id} cloud matrices updated.`);
    return NextResponse.json({ message: 'Test registry synced successfully.', test: updatedTest }, { status: 200 });
  } catch (error: any) {
    console.error("💥 Error during update process:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}