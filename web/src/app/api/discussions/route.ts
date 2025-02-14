import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from 'app/api/auth/[...nextauth]/options';
import dbConnect from 'lib/dbConnect';
import Discussion from 'models/Discussions';
import { z } from 'zod';

// Validation schema for discussion creation
const createDiscussionSchema = z.object({
  topic: z.string().min(1).max(200),
  content: z.string().min(1).max(2000),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const body = await req.json();
    const validation = createDiscussionSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validation.error },
        { status: 400 }
      );
    }

    const discussion = await Discussion.create({
      topic: validation.data.topic,
      content: validation.data.content,
      author: session.user._id,
    });

    // Populate author details
    await discussion.populate('author', 'fullName email');

    return NextResponse.json(discussion, { status: 201 });
  } catch (error) {
    console.error('Failed to create discussion:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const topic = searchParams.get('topic');
    const page = parseInt(searchParams.get('page') ?? '1');
    const limit = parseInt(searchParams.get('limit') ?? '10');
    const skip = (page - 1) * limit;

    const query = topic ? { topic } : {};

    const discussions = await Discussion.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'fullName email')
      .populate('responses.author', 'fullName');

    const total = await Discussion.countDocuments(query);

    return NextResponse.json({
      discussions,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Failed to fetch discussions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}