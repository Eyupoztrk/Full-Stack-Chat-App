import { NextRequest, NextResponse } from 'next/server';
import connectDb from '@/lib/db';
import User from '@/models/user';
import { getUserIdFromToken } from '@/lib/auth';
import { HTTP_STATUS, MESSAGES } from '@/utils/http';


export async function GET(req: NextRequest) {
    try {

        const userId = getUserIdFromToken(req);
        await connectDb();

        const user = await User.findById(userId).select('-password'); // Şifre olmsın 

        if (!user) {
            return NextResponse.json({ message: MESSAGES.USER_NOT_FOUND }, { status: HTTP_STATUS.NOT_FOUND });
        }

        return NextResponse.json({ user }, { status: HTTP_STATUS.OK });

    } catch (error: unknown) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message  || MESSAGES.BAD_REQUEST }, { status: HTTP_STATUS.INTERNAL_SERVER_ERROR });

    }
}

export async function PATCH(req: NextRequest) {
    try {
        const userId = getUserIdFromToken(req);
        const body = await req.json();
        const { name } = body;

        if (!name || name.trim() === '')
            return NextResponse.json({ message: MESSAGES.NAME_BLANK }, { status: HTTP_STATUS.BAD_REQUEST });

        await connectDb();

        const updatedUser = await User.findByIdAndUpdate(userId, { name: name }, { new: true }).select('-password');
        if (!updatedUser)
            return NextResponse.json({ message: MESSAGES.USER_NOT_FOUND }, { status: HTTP_STATUS.NOT_FOUND });

        return NextResponse.json({ message: MESSAGES.UPDATED, user: updatedUser }, { status: HTTP_STATUS.OK });


    } catch (error: unknown) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message  || MESSAGES.BAD_REQUEST }, { status: HTTP_STATUS.INTERNAL_SERVER_ERROR });

    }

}