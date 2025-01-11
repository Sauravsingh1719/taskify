import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs';    
                           
export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'Credentials',
            credentials:{
                emai:{label: 'Email', type: 'text'},
                password:{label: 'Password', type: 'password'}
            },
            async authorize(credentials: any): Promise<any>{
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        $or:[
                            {email: credentials.identifier},
                            {username: credentials.identifier}
                        ],
                    })

                    if(!user){
                        throw new Error('No user found');
                    }
                    if(!user.isVerified){
                        throw new Error('User not verified');
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
                    if(!isPasswordCorrect){
                        throw new Error('Password incorrect');
                    }
                } catch (err: any) {
                    throw new Error(err)
                }
            }
        })
    ],
    callbacks: {
        async jwt({token, user}){
            if(user){
                token._id = user._id?.toString();
                token.username = user.username; 
                token.isVerified = user.isVerified;
            }
            return token;
        },
        async session({session, token}){
            if(token){
                session.user._id = token._id;
                session.user.username = token.username;
                session.user.isVerified = token.isVerified;
            }
            return session;
    },
},
session: {
    strategy: 'jwt',
},
secret: process.env.NEXTAUTH_SECRET,
pages: {
    signIn: '/sign-in'
}};