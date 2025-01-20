import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../../auth/[...nextauth]/options"; 
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user = session?.user;
    const diaryId = params.id;

    if (!session || !user) {
        return new Response(JSON.stringify({ message: "Not authenticated" }), { status: 401 });
    }

    try {
        const userData = await UserModel.findById(user._id);
        if (!userData) {
            return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
        }

        const diary = userData.diaries.find((diary) => diary._id.toString() === diaryId);
        if (!diary) {
            return new Response(JSON.stringify({ message: "Diary not found" }), { status: 404 });
        }

        return new Response(JSON.stringify(diary), { status: 200 });
    } catch (error: any) {
        console.error("Error fetching diary:", error);
        return new Response(JSON.stringify({ message: "Error fetching diary" }), { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const { title, description } = await req.json();
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user = session?.user;
    const diaryId = params.id;

    if (!session || !user) {
        return new Response(JSON.stringify({ message: "Not authenticated" }), { status: 401 });
    }

    try {
        const updatedUser = await UserModel.findOneAndUpdate(
            { _id: user._id, 'diaries._id': diaryId },
            { $set: { 'diaries.$.title': title, 'diaries.$.description': description } },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return new Response(JSON.stringify({ message: "Diary not found or user not found" }), { status: 404 });
        }

        return new Response(JSON.stringify({ message: "Diary updated successfully" }), { status: 200 });
    } catch (error: any) {
        console.error("Error updating diary:", error);
        return new Response(JSON.stringify({ message: "Error updating diary" }), { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user = session?.user;
    const diaryId = params.id;

    if (!session || !user) {
        return new Response(JSON.stringify({ message: "Not authenticated" }), { status: 401 });
    }

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            user._id,
            { $pull: { diaries: { _id: diaryId } } },
            { new: true }
        );

        if (!updatedUser) {
            return new Response(JSON.stringify({ message: "Diary not found or user not found" }), { status: 404 });
        }

        return new Response(JSON.stringify({ message: "Diary deleted successfully" }), { status: 200 });
    } catch (error: any) {
        console.error("Error deleting diary:", error);
        return new Response(JSON.stringify({ message: "Error deleting diary" }), { status: 500 });
    }
}
