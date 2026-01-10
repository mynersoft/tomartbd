import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Question from '@/models/Question';
import { getIdFromReq } from '@/lib/getIdFromReq';

// POST: Add answer to question
export async function POST(req) {
  try {
    const id = getIdFromReq(req);
    await connectDB();

    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await req.json();

    if (!body.answer || body.answer.length < 20) {
      return NextResponse.json(
        { error: 'Answer must be at least 20 characters' },
        { status: 400 }
      );
    }

    const question = await Question.findById(id);

    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    // Add answer
    question.answers.push({
      userId: session.user.id,
      answer: body.answer,
      isBestAnswer: false,
    });

    // Update status
    question.status = 'answered';

    await question.save();

    // Populate data
    const updatedQuestion = await Question.findById(id)
      .populate('userId', 'name email avatar')
      .populate('answers.userId', 'name email avatar');

    return NextResponse.json(updatedQuestion, { status: 201 });
  } catch (error) {
    console.error('Error adding answer:', error);
    return NextResponse.json(
      { error: 'Failed to add answer', details: error.message },
      { status: 500 }
    );
  }
}
