import { NextResponse } from 'next/server';
import { HTTP_STATUS, MESSAGES } from '@/utils/http';

export async function POST() {

    try {
        const res = NextResponse.json({ message: MESSAGES.SUCCESS_LOGOUT }, { status: HTTP_STATUS.OK });
        res.cookies.set('token', '', {
            httpOnly: true,
            path: '/',
            maxAge: -1,
        });

        return res;
    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json({ message: error.message || MESSAGES.ERROR_LOGOUT }, { status: HTTP_STATUS.INTERNAL_SERVER_ERROR });
        }

    }

}