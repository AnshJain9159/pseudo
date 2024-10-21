/* eslint-disable @typescript-eslint/no-explicit-any */
//not working
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import Web3 from "web3";
import crypto from "crypto";
import { readFileSync } from "fs";
import { join } from "path";

const contractABI = JSON.parse(
    readFileSync(join(process.cwd(), "src", "lib", "contracts", "UserManager.json"), "utf8")
);

const contractAddress = "0x60fa0a07ed23c68120c14f61099a5534cfa11f8b";
const web3 = new Web3("http://localhost:8545");
const userRegistryContract = new web3.eth.Contract(contractABI.abi, contractAddress);

function convertToBytes32(hexString: string): string {
    hexString = hexString.replace('0x', '');
    while (hexString.length < 64) {
        hexString = '0' + hexString;
    }
    return '0x' + hexString;
}

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
                    console.log("Attempting to find user with email:", credentials.email);
                    const user = await UserModel.findOne({
                        email: credentials.email,
                    });

                    if (!user) {
                        console.log('No user found with this email');
                        throw new Error('No user found with this email');
                    }

                    console.log("User found:", user.email);

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

                    if (isPasswordCorrect) {
                        console.log("Password is correct");
                        // MongoDB authentication successful, now verify with blockchain
                        const emailHashBuffer = crypto.createHash("sha256").update(credentials.email).digest();
                        const passwordHashBuffer = crypto.createHash("sha256").update(credentials.password).digest();
                        
                        const emailHashBytes32 = convertToBytes32(emailHashBuffer.toString('hex'));
                        const passwordHashBytes32 = convertToBytes32(passwordHashBuffer.toString('hex'));

                        try {
                            console.log("Attempting blockchain authentication for user:", user.ethereumAddress);
                            const isAuthenticatedOnBlockchain = await userRegistryContract.methods
                                .authenticateUser(emailHashBytes32, passwordHashBytes32)
                                .call({ from: user.ethereumAddress });

                            if (isAuthenticatedOnBlockchain) {
                                console.log("Blockchain authentication successful");
                                return user;
                            } else {
                                console.log('Blockchain authentication failed');
                                throw new Error("Blockchain authentication failed");
                            }
                        } catch (blockchainError) {
                            console.error('Blockchain authentication error:', blockchainError);
                            throw new Error("Blockchain authentication error");
                        }
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
                token.ethereumAddress = user.ethereumAddress;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id;
                session.user.ethereumAddress = token.ethereumAddress;
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