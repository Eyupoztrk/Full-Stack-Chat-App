import connectDb from "@/lib/db";
import User from '@/models/user';
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { HTTP_STATUS, MESSAGES } from "@/utils/http";


export async function POST(req: Request) {
    try {
        await connectDb();

        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ message: MESSAGES.BAD_REQUEST }, { status: HTTP_STATUS.BAD_REQUEST });
        }

        const user = await User.findOne({ email });
        console.log(user);
        if (!user) {
            return NextResponse.json({ message: MESSAGES.INVALID_CREDENTIALS }, { status: HTTP_STATUS.UNAUTHORIZED });
        }

        if (!user.emailVerified) {
            return NextResponse.json({ message: MESSAGES.EMAIL_NOT_VERIFIED }, { status: HTTP_STATUS.FORBIDDEN });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return NextResponse.json({ message: MESSAGES.INVALID_CREDENTIALS }, { status: HTTP_STATUS.UNAUTHORIZED });
        }

        const payload = {
            userId: user._id,
            email: user.email,
            name: user.name
        };

        const token = jwt.sign(payload, process.env.AUTH_SECRET!, { expiresIn: '1d' });
        console.log(token);

        const response = NextResponse.json({ message: MESSAGES.SUCCESS_LOGIN, user: payload }, { status: HTTP_STATUS.OK });

        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: '/',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24,
        });

        return response;

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: MESSAGES.SERVER_ERROR }, { status: HTTP_STATUS.INTERNAL_SERVER_ERROR });
    }
}