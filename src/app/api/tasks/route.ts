import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { NextApiResponse } from "next";

export async function POST(req: Request, res: NextApiResponse) {
    const { title, description, deadLine, status } = await req.json();
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!session || !user) {
        return new Response(JSON.stringify({ message: "Not authenticated" }), { status: 401 });
    }

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            user._id,
            { $push: { tasks: { title, description, deadLine, status } } },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
        }
        const newTask = updatedUser.tasks.pop(); // Get the newly created task
        return new Response(JSON.stringify({ message: "Task created successfully", task: newTask }), { status: 201 });

    } catch (error: any) {
        console.error('Error creating task:', error);
        return new Response(JSON.stringify({ message: error.message || 'Error creating task' }), { status: 500 });
    }
}


export async function GET(req:Request, res:NextApiResponse){
    await dbConnect();
    const session = await getServerSession(authOptions)
    const user = session?.user;
    if(!session || !user){
        return new Response(JSON.stringify({message:"Not authenticated"}), {status:401})
    }
    try {
        const userData = await UserModel.findById(user._id);

        if(!userData){
            return new Response(JSON.stringify({message: "User not found"}), {status:404})
        }
        return new Response(JSON.stringify(userData.tasks), {status:200})
    } catch (error:any) {
        console.error("Error fetching tasks:", error)
        return new Response(JSON.stringify({message:"Error fetching tasks"}), {status:500})
    }
}