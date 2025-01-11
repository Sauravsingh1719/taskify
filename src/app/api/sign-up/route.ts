import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request){
    await dbConnect();

    try {
        const { username, name, email, password } = await request.json();

        const existingVerifiedUserByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })

        if(existingVerifiedUserByUsername){
            return Response.json(
                {
                    success: false,
                    message: "Username already exists"
                },
                {
                    status: 400
                }
            )
        }

        const existingUserByEmail = await UserModel.findOne({
            email
        })
        let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return Response.json(
                    {
                        success: false,
                        message: "Email already exists"
                    },
                    {
                        status: 400
                    }
                )
            } else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserByEmail.save();
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                username,
                name,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate
            });

            await newUser.save();
        }

    const emailResponse = await sendVerificationEmail(email, username, verifyCode);
    if(!emailResponse.success){
        return Response.json(
            {
                success: false,
                message: "Error sending verification email"
            },
            {
                status: 500
            }
        ) 
    }else {
        return Response.json(
            {
                success: true,
                message: "User registered successfully. Verification email sent"
            },
            {
                status: 201
            }
        )
    }


    } catch (error) {
        console.error('Error registering user', error);
        return Response.json(
            {
                success: false,
                message: "Error registering user"
            },
            {
                status: 500
            }
        )
    }
}