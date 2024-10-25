import { NextResponse } from 'next/server';
import UserModel from '@/models/User';
import dbConnect from "@/lib/dbConnect";

export async function POST(request: Request) {
  try {
    await dbConnect();
    
    const body = await request.json();
    const { email, fullName, topics } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Find and update the user
    const updatedUser = await UserModel.findOneAndUpdate(
      { email },
      { 
        $set: {
          fullName,
          topics
        }
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { success: false, error: error.message }, 
      { status: 500 }
    );
  }
}