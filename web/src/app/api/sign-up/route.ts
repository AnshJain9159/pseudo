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

