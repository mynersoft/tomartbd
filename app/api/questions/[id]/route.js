import { NextResponse } from 'next/server';
import { connectDB} from '@/lib/db';
import Question from '@/models/Question';
import {getIdFromReq} from '@/lib/getIdFromReq';

// GET: Get single question by ID
export async function GET(req) {
	try {
	   const id = getIdFromReq(req);
    await connectDB();
	 

    const question = await Question.findById(id)
      .populate('userId', 'name email avatar')
      .populate('answers.userId', 'name email avatar');

    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(question);
  } catch (error) {
    console.error('Error fetching question:', error);
    return NextResponse.json(
      { error: 'Failed to fetch question', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Delete question
export async function DELETE(request, { params }) {
  try {
    await connectDB();

    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

     const id = getIdFromReq(req);
    const question = await Question.findById(id);

    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    // Check if user is the owner
    if (question.userId.toString() !== session.user.id) {
      return NextResponse.json(
        { error: 'Not authorized to delete this question' },
        { status: 403 }
      );
    }

    await question.deleteOne();

    return NextResponse.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error deleting question:', error);
    return NextResponse.json(
      { error: 'Failed to delete question', details: error.message },
      { status: 500 }
    );
  }
}
