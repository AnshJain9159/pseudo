// signup route
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";
import { getInitialTopics } from '@/utils/initializeTopics';

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { fullName, email, password, role } = await request.json();

        // Check if user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return new Response(JSON.stringify({
                success: false,
                message: "User already exists with this email",
            }), { status: 409 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save new user
        const newUser = new UserModel({
            fullName,
            email,
            password: hashedPassword,
            role,
            topics: getInitialTopics(),
        });

        await newUser.save();

        return new Response(JSON.stringify({
            success: true,
            message: "User registered successfully.",
        }), { status: 201 });
    } catch (error) {
        console.error('Error registering user', error);
        return new Response(JSON.stringify({
            success: false,
            message: "Error registering user",
        }), { status: 500 });
    }
}
