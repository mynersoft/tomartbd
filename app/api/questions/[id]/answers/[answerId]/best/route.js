import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Question from '@/models/Question';
import { getIdFromReq } from '@/lib/getIdFromReq';

// PATCH: Mark answer as best
export async function PATCH(req) {
  try {
    await connectDB();
	   const id = getIdFromReq(req);
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id: questionId, answerId } = params;

    const question = await Question.findById(questionId);

    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    // Check if user is the question owner
    if (question.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'Only question owner can mark best answer' },
        { status: 403 }
      );
    }

    // Mark all answers as not best
    question.answers.forEach((answer) => {
      answer.isBestAnswer = false;
    });

    // Mark specific answer as best
    const answer = question.answers.id(answerId);
    if (!answer) {
      return NextResponse.json({ error: 'Answer not found' }, { status: 404 });
    }

    answer.isBestAnswer = true;
    await question.save();

    const updatedQuestion = await Question.findById(questionId)
      .populate('userId', 'name email avatar')
      .populate('answers.userId', 'name email avatar');

    return NextResponse.json(updatedQuestion);
  } catch (error) {
    console.error('Error marking best answer:', error);
    return NextResponse.json(
      { error: 'Failed to mark best answer', details: error.message },
      { status: 500 }
    );
  }
}
