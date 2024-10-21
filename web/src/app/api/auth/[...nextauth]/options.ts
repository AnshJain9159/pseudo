/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                        ],
                    });
                    if (!user) {
                        console.log('No user found with this email/username');
                        throw new Error('No user found with this email/username');
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

                    if (isPasswordCorrect) {
                        return user;
                    } else {
                        console.log('Incorrect Password');
                        throw new Error("Incorrect Password");
                    }
                } catch (error: any) {
                    console.error('Error in authorize:', error);
                    throw new Error(error.message || 'Authorization error');
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString();
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id;
            }
            return session;
        },
    },
    pages: {
        signIn: '/sign-in',
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};