import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user = session?.user;
    const taskId = await params.id;

    if (!session || !user) {
        return new Response(JSON.stringify({ message: "Not authenticated" }), { status: 401 });
    }

    try {
        const userData = await UserModel.findById(user._id);
        if (!userData) {
            return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
        }
        const task = userData.tasks.find((task) => task._id.toString() === taskId);

        if (!task) {
        return new Response(JSON.stringify({ message: "Task not found" }), { status: 404 });
        }

        return new Response(JSON.stringify(task), { status: 200 });
    } catch (error: any) {
        console.error("Error fetching task", error);
        return new Response(JSON.stringify({ message: "Error fetching task" }), { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const { title, description, deadLine, status } = await req.json();
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user = session?.user;
    const taskId = params.id;

    if (!session || !user) {
        return new Response(JSON.stringify({ message: "Not authenticated" }), { status: 401 });
    }

    try {
        const updatedUser = await UserModel.findOneAndUpdate(
            { _id: user._id, 'tasks._id': taskId },
            { $set: { 'tasks.$.title': title, 'tasks.$.description': description, 'tasks.$.deadLine': deadLine, 'tasks.$.status': status } },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return new Response(JSON.stringify({ message: "Task not found or user not found" }), { status: 404 });
        }

        return new Response(JSON.stringify({ message: "Task updated successfully" }), { status: 200 });
    } catch (error: any) {
        console.error("Error updating task:", error);
        return new Response(JSON.stringify({ message: error.message || "Error updating task" }), { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user = session?.user;
    const taskId = params.id;

    if (!session || !user) {
        return new Response(JSON.stringify({ message: "Not authenticated" }), { status: 401 });
    }

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            user._id,
            { $pull: { tasks: { _id: taskId } } },
            { new: true }
        );

        if (!updatedUser) {
            return new Response(JSON.stringify({ message: "Task not found or user not found" }), { status: 404 });
        }

        return new Response(JSON.stringify({ message: "Task deleted successfully" }), { status: 200 });
    } catch (error: any) {
        console.error("Error deleting task:", error);
        return new Response(JSON.stringify({ message: error.message || "Error deleting task" }), { status: 500 });
    }
}