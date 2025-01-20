import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { NextApiResponse } from "next";

export async function POST(req: Request, res: NextApiResponse) {
    const {title, description } = await req.json();
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if(!session || !user){
        return new Response(JSON.stringify({message:"Not authenticated"}), {status:401})
    }

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            user._id,
            {$push: {diaries: {title, description}}},
            {new: true, runValidators: true}
        );

        if(!updatedUser){
            return new Response(JSON.stringify({message:"User not found"}), {status:404})
        }

        const newDiary = updatedUser.diaries.pop();
        return new Response(JSON.stringify({message:"Diary created successfully", diary:newDiary}), {status:201})
    } catch (error: any) {
        console.error('Error creating diary:', error);
        return new Response(JSON.stringify({message:error.message || 'Error creating diary'}), {status:500})
    }

}

export async function GET(req: Request, res: NextApiResponse) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user = session?.user;
    if(!session || !user){
        return new Response(JSON.stringify({message:"Not authenticated"}), {status:401})
    }
    try {
        const userData = await UserModel.findById(user._id);

        if(!userData){
            return new Response(JSON.stringify({message:"User not found"}), {status:404})
        }
        return new Response(JSON.stringify(userData.diaries), {status:200})

    } catch (error: any) {
        console.error("Error fetching diaries:", error)
        return new Response(JSON.stringify({message:"Error fetching diaries"}), {status:500})
    }
}