import { authOptions } from "@/app/auth/[...nextAuth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import mongoose from "mongoose";
import { getServerSession, User } from "next-auth";

export async function GET(request: Request){
    await dbConnect();
    const session = await getServerSession(authOptions);
    const _user: User = session?.user;

    if(!session || !_user){
       return Response.json({
        success: false,
        message: "Not authenticated"
       }, {status: 401});
    }

    const userId = new mongoose.Types.ObjectId(_user._id);
    try {
        const user = await UserModel.aggregate([
            {$match: {_id: userId}},
            {$unwind: '$tasks'},
            {$sort: {'tasks.createdAt': -1}},
            {$group: {_id: '$_id', tasks: {$push: '$tasks'}}},
        ]).exec();

        if(!user || user.length === 0){ 
            return Response.json({
                success: false,
                message: "No tasks found"
            }, {status: 404});
        }

        return Response.json(
            {
                success: true,
                data: user[0].tasks
            },
            {status: 200}
            )
    } catch (error) {
        console.error('An unexpected error occurred:', error);
        return Response.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}