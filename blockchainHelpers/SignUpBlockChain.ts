// import dbConnect from "@/lib/dbConnect";
// import UserModel from "@/models/User";
// import bcrypt from "bcryptjs";
// import Web3 from "web3";
// import { join } from "path";
// import crypto from "crypto";
// import { readFileSync } from "fs";

// const contractABI = JSON.parse(
//     readFileSync(join(process.cwd(), "src", "lib", "contracts", "UserManager.json"), "utf8")
// );

// const contractAddress = "0x60fa0a07ed23c68120c14f61099a5534cfa11f8b";
// const web3 = new Web3("http://localhost:8545");
// const userRegistryContract = new web3.eth.Contract(contractABI.abi, contractAddress);

// function convertToBytes32(hexString: string): string {
//     hexString = hexString.replace('0x', '');
//     while (hexString.length < 64) {
//         hexString = '0' + hexString;
//     }
//     return '0x' + hexString;
// }

// export async function POST(request: Request) {
//     await dbConnect();
//     try {
//         const { fullName, email, password, role } = await request.json();
//         const existingUserByEmail = await UserModel.findOne({ email });

//         if (existingUserByEmail) {
//             return Response.json({
//                 success: false,
//                 message: "User Already Exist With This Email",
//             }, { status: 300 });
//         }

//         // MongoDB user creation
//         const hashedPassword = await bcrypt.hash(password, 10);
        
//         // Create bytes32 hashes for blockchain
//         const emailHashBuffer = crypto.createHash("sha256").update(email).digest();
//         const passwordHashBuffer = crypto.createHash("sha256").update(password).digest();
        
//         const emailHashBytes32 = convertToBytes32(emailHashBuffer.toString('hex'));
//         const passwordHashBytes32 = convertToBytes32(passwordHashBuffer.toString('hex'));

//         // Generate a new Ethereum account for this user
//         const newAccount = web3.eth.accounts.create();

//         // Get the first account (assuming it has funds)
//         const accounts = await web3.eth.getAccounts();
//         const fundingAccount = accounts[0];

//         // Fund the new account with a small amount of Ether (e.g., 0.1 ETH)
//         const fundingAmount = web3.utils.toWei('0.1', 'ether');
//         await web3.eth.sendTransaction({
//             from: fundingAccount,
//             to: newAccount.address,
//             value: fundingAmount
//         });

//         // Get the current gas price
//         const gasPrice = await web3.eth.getGasPrice();

//         // Estimate gas for the transaction
//         const gasEstimate = await userRegistryContract.methods
//             .registerUser(fullName, emailHashBytes32, passwordHashBytes32, role)
//             .estimateGas({ from: newAccount.address });

//         // Convert gasEstimate and gasPrice to strings and handle the multiplication
//         const gasLimit = Math.ceil(Number(gasEstimate) * 1.2).toString();

//         // Get the nonce for the new account (should be 0 for a new account)
//         const nonce = await web3.eth.getTransactionCount(newAccount.address);

//         // Prepare the transaction
//         const tx = {
//             from: newAccount.address,
//             to: contractAddress,
//             gas: gasLimit,
//             gasPrice: gasPrice.toString(),
//             nonce: nonce,
//             data: userRegistryContract.methods.registerUser(fullName, emailHashBytes32, passwordHashBytes32, role).encodeABI(),
//         };

//         // Sign the transaction
//         const signedTx = await web3.eth.accounts.signTransaction(tx, newAccount.privateKey);

//         // Send the signed transaction
//         const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

//         console.log('Transaction receipt:', receipt);

//         // Create and save the new user
//         const newUser = new UserModel({
//             fullName,
//             email,
//             password: hashedPassword,
//             role,
//             ethereumAddress: newAccount.address
//         });

//         await newUser.save();

//         return Response.json({
//             success: true,
//             message: "User registered Successfully.",
//             ethereumAddress: newAccount.address
//         }, { status: 200 });
//     } catch (error) {
//         console.error('Error Registering User', error);
//         return Response.json(
//             {
//                 success: false,
//                 message: "Error Registering User",
//                 //error: error.message
//             },
//             {
//                 status: 500,
//             }
//         );
//     }
// }
