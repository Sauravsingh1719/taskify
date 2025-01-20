import { sendForgotEmail } from "@/helpers/sendForgotEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request){
    await dbConnect();

        try {
            
            const { email } = await request.json();
            const existingUserByEmail = await UserModel.findOne({
                email
            })

            if(!existingUserByEmail){
                return Response.json(
                    {
                        success: false,
                        message: "Account doesn't exist"
                    },
                    {
                        status: 400
                    }
                )
            } 

            let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

            

        } catch (error) {
            
        }

}