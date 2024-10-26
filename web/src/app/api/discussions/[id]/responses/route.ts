import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import dbConnect from '@/lib/dbConnect';
import Discussion from '@/models/Discussions';
import { z } from 'zod';

const createResponseSchema = z.object({
  content: z.string().min(1).max(1000),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const validation = createResponseSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validation.error },
        { status: 400 }
      );
    }

    const discussion = await Discussion.findById(params.id);
    if (!discussion) {
      return NextResponse.json(
        { error: 'Discussion not found' },
        { status: 404 }
      );
    }

    discussion.responses.push({
      content: validation.data.content,
      author: session.user._id,
    });

    await discussion.save();
    await discussion.populate('responses.author', 'fullName');

    return NextResponse.json(
      discussion.responses[discussion.responses.length - 1],
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to create response:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}