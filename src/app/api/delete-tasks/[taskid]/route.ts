import { authOptions } from "@/app/auth/[...nextAuth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { User } from "next-auth";


export async function DELETE(request: Request, {params}: {params:{taskid: string}}){
    const taskid = params.taskid;
    await dbConnect();
    const session = await getServerSession(authOptions);
    const _user: User = session?.user;
    if(!session || !_user){
        return Response.json({
            success: false,
            message: "Not authenticated"
        }, {status: 401});
    }

    try {
        const updateResult = await UserModel.updateOne(
            {_id: _user._id},
            {$pull: {tasks: {_id: taskid}}}
        );

        if(updateResult.modifiedCount === 0){
            return Response.json({
                success: false,
                message: "Task not found"
            }, {status: 404});
        }

        return Response.json({
            success: true,
            message: "Task deleted successfully"
        }, {status: 200});
    } catch (error) {
        console.error('An unexpected error occurred:', error);
        return Response.json(
            { message: 'Error deleting task' },
            { status: 500 }
        );
    }
}

export async function PATCH(request: Request, {params}: {params:{taskid: string}}){
    const taskid = params.taskid;
    const {title, description, status} = await request.json();
    await dbConnect();
    const session = await getServerSession(authOptions);
    const _user: User = session?.user;
    if(!session || !_user){
        return Response.json({
            success: false,
            message: "Not authenticated"
        }, {status: 401});
    }

    try {
        const updateResult = await UserModel.updateOne(
            {_id: _user._id, 'tasks._id': taskid},
            {
                $set: {
                    'tasks.$.title': title,
                    'tasks.$.description': description,
                    'tasks.$.status': status
                }
            }
        );

        if(updateResult.modifiedCount === 0){
            return Response.json({
                success: false,
                message: "Task not found"
            }, {status: 404});
        }

        return Response.json({
            success: true,
            message: "Task updated successfully"
        }, {status: 200});
    } catch (error) {
        console.error('An unexpected error occurred:', error);
        return Response.json(
            { message: 'Error updating task' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request){
    const {title, description} = await request.json();
    await dbConnect();
    const session = await getServerSession(authOptions);
    const _user: User = session?.user;
    if(!session || !_user){
        return Response.json({
            success: false,
            message: "Not authenticated"
        }, {status: 401});
    }

    try {
        const updateResult = await UserModel.updateOne(
            {_id: _user._id},
            {$push: {tasks: {title, description}}}
        );

        if(updateResult.modifiedCount === 0){
            return Response.json({
                success: false,
                message: "Error creating task"
            }, {status: 500});
        }

        return Response.json({
            success: true,
            message: "Task created successfully"
        }, {status: 200});
    } catch (error) {
        console.error('An unexpected error occurred:', error);
        return Response.json(
            { message: 'Error creating task' },
            { status: 500 }
        );
    }
}