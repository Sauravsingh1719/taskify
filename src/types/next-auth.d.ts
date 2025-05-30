import 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            _id?: string;
            isVerified?: boolean;
            username?: string;
        } & DefaultSession['user'];
    }

    interface User {
        _id?: string;
        isVerified?: boolean;
        username?: string;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        user: {
            _id?: string;
            isVerified?: boolean;
            username?: string;
        }
    }
}