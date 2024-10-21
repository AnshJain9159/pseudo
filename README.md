/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import Web3 from "web3";
import { join } from "path";
import crypto from "crypto";
import { readFileSync } from "fs";

// Load contract ABI and Web3
const contractABI = JSON.parse(
    readFileSync(join(process.cwd(), "src", "lib", "contracts", "UserManager.json"), "utf8")
);
const contractAddress = "0x445100aae9747ec1edeb8e41da1dab5947084be0";
const web3 = new Web3("http://localhost:8545");
const userRegistryContract = new web3.eth.Contract(contractABI.abi, contractAddress);

// Helper function to convert to bytes32 format
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
                      // Create email and password hashes for blockchain verification
                      const emailHashBuffer = crypto.createHash("sha256").update(credentials.email).digest();
                      const passwordHashBuffer = crypto.createHash("sha256").update(credentials.password).digest();
  
                      const emailHashBytes32 = convertToBytes32(emailHashBuffer.toString('hex'));
                      const passwordHashBytes32 = convertToBytes32(passwordHashBuffer.toString('hex'));
                      // Get the current account and gas price
                        const accounts = await web3.eth.getAccounts();
                        const gasPrice = await web3.eth.getGasPrice();
                    
                    // Estimate gas for the transaction
                    const gasEstimate = await userRegistryContract.methods
                        .authenticateUser(emailHashBytes32, passwordHashBytes32)
                        .estimateGas({ from: accounts[0] });

                    // Convert gasEstimate and gasPrice to strings and handle the multiplication
                    const gasLimit = Math.ceil(Number(gasEstimate) * 1.2).toString();
                      // Call the smart contract to authenticate the user on the blockchain
                      const isAuthenticated = await userRegistryContract.methods
                          .authenticateUser(emailHashBytes32, passwordHashBytes32)
                          .call({ 
                            from: accounts[0],
                            gas: gasLimit,
                            gasPrice: gasPrice.toString(),
                            type: '0x0' // Force legacy transaction type
                        });
  
                      if (!isAuthenticated) {
                          console.log("Blockchain authentication failed");
                          throw new Error("Blockchain authentication failed");
                      }

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

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";
import Web3 from "web3";
import { join } from "path";
import crypto from "crypto";
import { readFileSync } from "fs";

const contractABI = JSON.parse(
    readFileSync(join(process.cwd(), "src", "lib", "contracts", "UserManager.json"), "utf8")
);

const contractAddress = "0x445100aae9747ec1edeb8e41da1dab5947084be0";
const web3 = new Web3("http://localhost:8545");
const userRegistryContract = new web3.eth.Contract(contractABI.abi, contractAddress);

function convertToBytes32(hexString: string): string {
    hexString = hexString.replace('0x', '');
    while (hexString.length < 64) {
        hexString = '0' + hexString;
    }
    return '0x' + hexString;
}

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { fullName, email, password, role } = await request.json();
        const existingUserByEmail = await UserModel.findOne({ email });

        if (existingUserByEmail) {
            return Response.json({
                success: false,
                message: "User Already Exist With This Email",
            }, { status: 300 });
        }

        // MongoDB user creation
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create bytes32 hashes for blockchain
        const emailHashBuffer = crypto.createHash("sha256").update(email).digest();
        const passwordHashBuffer = crypto.createHash("sha256").update(password).digest();
        
        const emailHashBytes32 = convertToBytes32(emailHashBuffer.toString('hex'));
        const passwordHashBytes32 = convertToBytes32(passwordHashBuffer.toString('hex'));

        const newUser = new UserModel({
            fullName,
            email,
            password: hashedPassword,
            role,
        });

        await newUser.save();

        // Get the current account and gas price
        const accounts = await web3.eth.getAccounts();
        const gasPrice = await web3.eth.getGasPrice();
        
        // Estimate gas for the transaction
        const gasEstimate = await userRegistryContract.methods
            .registerUser(fullName, emailHashBytes32, passwordHashBytes32, role)
            .estimateGas({ from: accounts[0] });

        // Convert gasEstimate and gasPrice to strings and handle the multiplication
        const gasLimit = Math.ceil(Number(gasEstimate) * 1.2).toString();
        
        // Send transaction with legacy format
        await userRegistryContract.methods
            .registerUser(fullName, emailHashBytes32, passwordHashBytes32, role)
            .send({ 
                from: accounts[0],
                gas: gasLimit,
                gasPrice: gasPrice.toString(),
                type: '0x0' // Force legacy transaction type
            });

        return Response.json({
            success: true,
            message: "User registered Successfully.",
        }, { status: 200 });
    } catch (error) {
        console.error('Error Registering User', error);
        return Response.json(
            {
                success: false,
                message: "Error Registering User",
            },
            {
                status: 500,
            }
        );
    }
}