import { NextRequest, NextResponse } from 'next/server';
import connectDb from '@/lib/db';
import Room from '@/models/room';
import { getUserIdFromToken } from '@/lib/auth';
import { HTTP_STATUS, MESSAGES } from '@/utils/http';

export async function GET(req: NextRequest) {
    try {
        getUserIdFromToken(req); // auth gibi, kullanıcı yoksa zaten catch kısmına yakalanacak
        await connectDb();


        const rooms = await Room.find({}).sort({ createdAt: -1 });
        return NextResponse.json({ rooms }, { status: HTTP_STATUS.OK });

    } catch (error: unknown) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message  || MESSAGES.BAD_REQUEST }, { status: HTTP_STATUS.INTERNAL_SERVER_ERROR });
    }
}