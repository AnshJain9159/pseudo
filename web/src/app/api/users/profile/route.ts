import { NextRequest, NextResponse } from 'next/server';
import dbConnect from 'lib/dbConnect';
import UserModel from 'models/User';
interface SafeUser {
  fullName: string;
  email: string;
  role: string;
  ethereumAddress: string;
  topics: string[]; // assuming topics is an array of strings
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    await dbConnect();
    const user = await UserModel.findOne({ email }).lean();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Assert the type of `user`
    const safeUser: SafeUser = {
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      ethereumAddress: user.ethereumAddress,
      topics: user.topics
    };

    return NextResponse.json(safeUser);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
