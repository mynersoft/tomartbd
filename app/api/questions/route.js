import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Question from '@/models/Question';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET: Fetch questions with pagination and filters
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const status = searchParams.get('status');
    const sortBy = searchParams.get('sortBy') || 'newest';
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    // Build query
    let query = { productId };

    if (status && status !== 'all') {
      query.status = status;
    }

    // Build sort
    let sort = {};
    switch (sortBy) {
      case 'newest':
        sort = { createdAt: -1 };
        break;
      case 'oldest':
        sort = { createdAt: 1 };
        break;
      case 'votes':
        sort = { votes: -1 };
        break;
      case 'unanswered':
        query.status = 'pending';
        sort = { createdAt: -1 };
        break;
      default:
        sort = { createdAt: -1 };
    }

    // Execute query with pagination
    const [questions, total] = await Promise.all([
      Question.find(query)
        .populate('userId', 'name email avatar')
        .populate('answers.userId', 'name email avatar')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Question.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      questions,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions', details: error.message },
      { status: 500 }
    );
  }
}

// POST: Create new question
export async function POST(request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log(session, '==============');
    

    // Validate required fields
    if (!body.productId || !body.question) {
      return NextResponse.json(
        { error: 'Product ID and question are required' },
        { status: 400 }
      );
    }

    if (body.question.length < 10) {
      return NextResponse.json(
        { error: 'Question must be at least 10 characters' },
        { status: 400 }
      );
    }

    // Create question
    const question = await Question.create({
      productId: body.productId,
      userId: session.user.id,
      question: body.question,
      status: 'pending',
    });

    // Populate user data
    const populatedQuestion = await Question.findById(question._id)
      .populate('userId', 'name email avatar')
      .populate('answers.userId', 'name email avatar');

    return NextResponse.json(populatedQuestion, { status: 201 });
  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json(
      { error: 'Failed to create question', details: error.message },
      { status: 500 }
    );
  }
}
