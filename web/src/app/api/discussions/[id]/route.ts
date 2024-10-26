import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Discussion from '@/models/Discussions';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect(); 
  const { id } = params;

  try {
    // Fetch the discussion by ID
    const discussion = await Discussion.findById(id);
    if (!discussion) {
      return NextResponse.json({ message: 'Discussion not found' }, { status: 404 });
    }

    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    } 

    // Only allow delete if the logged-in user is the author
    if (discussion.author._id.toString() !== session?.user._id?.toString()) {
      return NextResponse.json({ message: 'You are not authorized to delete this discussion' }, { status: 403 });
    }

    await Discussion.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Discussion deleted successfully' }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete discussion', error }, { status: 500 });
  }
}
