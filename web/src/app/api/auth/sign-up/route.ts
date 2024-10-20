import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs"

export async function POST(request:Request){
    await dbConnect();
    try {
        const {fullName,email,password,role} = await request.json()
        const existingUserByEmail =await UserModel.findOne({email})

        if(existingUserByEmail){

            return Response.json({
                success:false,
                message: "User Already Exist With This Email"
            },{status:300})

        }else{
            const hashedPassword = await bcrypt.hash(password,10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours()+1)

            const newUser = new UserModel({
                fullName,
                email,
                password:hashedPassword,
                role,
            })

            await newUser.save()
        }

       
        return Response.json({
            success:true,
            message: "User registered Successfully."
        },{status:200})
        } catch (error) {
        console.error('Error Registring User',error)
        return Response.json(
            {
                success:false,
                message: "error Registring User"
            },
            {
                status: 500
            }
        )
    }
}

// import dbConnect from "@/lib/dbConnect";
// import UserModel from "@/models/User";
// import bcrypt from "bcryptjs";
// import Web3 from "web3";
// import fs from "fs";
// import path from "path";
// import crypto from "crypto";


// // Load the compiled smart contract ABI and the contract address
// const contractABI = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../../../../blockchain/build/contracts/UserManager.json"), "utf8"));
// const contractAddress = "0x313ca3d6aaE1B8C53c523849152Ad654838aF239";

// // Connect to the Ethereum provider
// const web3 = new Web3("http://localhost:8545"); // Replace with your Ethereum provider URL

// // Create a contract instance
// const userRegistryContract = new web3.eth.Contract(contractABI, contractAddress);

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

//         } else {
//             //mongo db wala user
//             const hashedPassword = await bcrypt.hash(password, 10);
//             const expiryDate = new Date();
//             expiryDate.setHours(expiryDate.getHours() + 1);

//             // Hash the email and password using SHA-256
//             const emailHash = crypto.createHash("sha256").update(email).digest("hex");
//             const passwordHash = crypto.createHash("sha256").update(password).digest("hex");
            
//             const newUser = new UserModel({
//                 fullName,
//                 email,
//                 password: hashedPassword,
//                 role,
//             });

//             await newUser.save();

//             // Register the user on the blockchain
//             const accounts = await web3.eth.getAccounts();
//             await userRegistryContract.methods.registerUser(fullName, emailHash, passwordHash, role).send({ from: accounts[0] });

//             return Response.json({
//                 success: true,
//                 message: "User registered Successfully.",
//             }, { status: 200 });
//         }
//     } catch (error) {
//         console.error('Error Registring User', error);
//         return Response.json(
//             {
//                 success: false,
//                 message: "Error Registring User",
//             },
//             {
//                 status: 500,
//             }
//         );
//     }
// }
