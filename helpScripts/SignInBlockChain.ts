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

const contractAddress = "0x07254deD9EeA5cA826C9d1F3F939eA38924D5941";
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
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email and password required');
                }

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

                    if (!isPasswordCorrect) {
                        console.log('Incorrect Password');
                        throw new Error("Incorrect Password");
                    }

                    console.log("Password is correct");
                    
                    try {
                        // Get the Ethereum accounts
                        const accounts = await web3.eth.getAccounts();
                        console.log('Available accounts:', accounts);
                        
                        // Check user's Ethereum address
                        console.log('User Ethereum address:', user.ethereumAddress);
                        
                        // Check user's balance
                        const balance = await web3.eth.getBalance(user.ethereumAddress);
                        console.log('User balance:', balance);

                        // If balance is low, fund the account
                        if (web3.utils.toBN(balance).lt(web3.utils.toBN(web3.utils.toWei('0.01', 'ether')))) {
                            console.log('Funding user account...');
                            await web3.eth.sendTransaction({
                                from: accounts[0],
                                to: user.ethereumAddress,
                                value: web3.utils.toWei('0.1', 'ether')
                            });
                        }

                        // Create the hashes
                        const emailHashBuffer = crypto.createHash("sha256").update(credentials.email).digest();
                        const passwordHashBuffer = crypto.createHash("sha256").update(credentials.password).digest();
                        
                        const emailHashBytes32 = convertToBytes32(emailHashBuffer.toString('hex'));
                        const passwordHashBytes32 = convertToBytes32(passwordHashBuffer.toString('hex'));

                        console.log('Email hash:', emailHashBytes32);
                        console.log('Password hash:', passwordHashBytes32);

                        // Get the deployed contract
                        const code = await web3.eth.getCode(contractAddress);
                        console.log('Contract exists:', code !== '0x');

                        // Call the authenticateUser function
                        console.log("Attempting blockchain authentication for user:", user.ethereumAddress);
                        const isAuthenticatedOnBlockchain = await userRegistryContract.methods
                            .authenticateUser(emailHashBytes32, passwordHashBytes32)
                            .call({ 
                                from: user.ethereumAddress,
                                gas: '200000'  // Specify gas limit
                            });

                        console.log('Blockchain authentication result:', isAuthenticatedOnBlockchain);

                        if (isAuthenticatedOnBlockchain) {
                            console.log("Blockchain authentication successful");
                            return {
                                //id: user._id.toString(),
                                email: user.email,
                                ethereumAddress: user.ethereumAddress,
                                role: user.role
                            };
                        } else {
                            console.log('Blockchain authentication failed - hashes did not match');
                            throw new Error("Blockchain authentication failed - invalid credentials");
                        }
                    } catch (blockchainError: any) {
                        console.error('Detailed blockchain error:', blockchainError);
                        
                        // Check if it's a revert error
                        if (blockchainError.message.includes('revert')) {
                            throw new Error(`Smart contract revert: ${blockchainError.message}`);
                        }
                        
                        // Check if it's a connection error
                        if (blockchainError.message.includes('connection')) {
                            throw new Error('Failed to connect to blockchain network');
                        }
                        
                        throw new Error(`Blockchain authentication error: ${blockchainError.message}`);
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
                token._id = user._id;
                //token.email = user.email;
                token.ethereumAddress = user.ethereumAddress;
                //token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user._id = token._id;
                //session.user.email = token.email;
                session.user.ethereumAddress = token.ethereumAddress;
               // session.user.role = token.role;
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
    debug: true,  // Enable debug mode
    secret: process.env.NEXTAUTH_SECRET,
};