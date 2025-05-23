import mongoose, {Document, Schema} from 'mongoose';

export interface Diary extends Document {
    id: string;
    title: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

const DiarySchema : Schema<Diary> = new Schema({
    title: {
        type: String,
        required: [true, "Please provide a title for the diary"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Please provide a description for the diary"],
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

export interface Task extends Document {
    id: string;
    title: string;
    description: string;
    createdAt: Date;
    deadLine: Date;
    status: string;
}

const TaskSchema : Schema<Task> = new Schema ({
    title: {
        type: String,
        required: [true, "Please provide a title for the task"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Please provide a description for the task"],
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    deadLine: {
        type: Date,
        required: [true, "Please provide a deadline for the task"]
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'completed'],
        default: 'pending'
    }
})

export interface User extends Document {
    username: string;
    name: string;
    email: string;
    password: string;
    verifyCode:string,
    forgotPasswordCode: string,
    forgotPasswordCodeExpiry: Date,
    isVerified: boolean,
    verifyCodeExpiry: Date,
    tasks: Task[];
    diaries: Diary[];
}

const UserSchema : Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Please provide a username"],
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required:[ true, "Please provide a name"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
        trim: true,
        match: [/.+\@.+\..+/, 'Please use a valid email format']
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
    },
    verifyCode: {
        type: String,
        required: true
    },
    forgotPasswordCode: {
        type: String,
    },
    forgotPasswordCodeExpiry: {
        type: Date,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verifyCodeExpiry: {
        type: Date,
        required: true
    },

    tasks: [TaskSchema],
    diaries: [DiarySchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema)

export default UserModel;