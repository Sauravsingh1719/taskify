import { sendForgotEmail } from "@/helpers/sendForgotEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request){
    await dbConnect();

        try {
            
            const { email } = await request.json();
            const existingUserByEmail = await UserModel.findOne({
                email
            })

            let forgotPasswordCode = Math.floor(100000 + Math.random() * 900000).toString();

            if(existingUserByEmail){
                existingUserByEmail.forgotPasswordCode = forgotPasswordCode;
                existingUserByEmail.forgotPasswordCodeExpiry = new Date(Date.now() + 600000);
                await existingUserByEmail.save();
                await sendForgotEmail(email, forgotPasswordCode);
                return Response.json(
                    {
                        success: true,
                        message: "Email sent"
                    },
                    {
                        status: 200
                    }
                )
            } 

            return Response.json(
                {
                    success: false,
                    message: "Email not found"
                },
                {
                    status: 404
                }
            )


        } catch (error) {
            console.error("Error sending forgot password email", error);
            return Response.json(
                {
                    success: false,
                    message: "Failed to send forgot password email"
                },
                {
                    status: 500
                }
            )
        }

}