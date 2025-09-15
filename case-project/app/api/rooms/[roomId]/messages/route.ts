import { NextRequest, NextResponse } from 'next/server';
import connectDb from '@/lib/db';
import Message from '@/models/message';
import { getUserIdFromToken } from '@/lib/auth';
import { HTTP_STATUS, MESSAGES } from '@/utils/http';

const MESSAGES_LIMIT = 20; // En fazla gösterilecek mesaj

export async function GET(req: NextRequest, context: { params: Promise<{ roomId: string }> }) {
    try {
        getUserIdFromToken(req);

        await connectDb();

        const { roomId } = await context.params;

        const { searchParams } = new URL(req.url);
        const cursor = searchParams.get('cursor');

        const query: { roomId: string; _id?: { $lt: string } } = { roomId };

        if (cursor) {
            query._id = { $lt: cursor };
        }

        const messages = await Message.find(query)
            .populate('senderId', 'name')
            .sort({ createdAt: -1 })
            .limit(MESSAGES_LIMIT);

        let nextCursor = null;
        if (messages.length === MESSAGES_LIMIT)
            nextCursor = messages[MESSAGES_LIMIT - 1]._id;

        return NextResponse.json({ items: messages, nextCursor }, { status: HTTP_STATUS.OK });

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("GET /messages API Error:", error);
            return NextResponse.json({ message: 'Unkown Error' }, { status: HTTP_STATUS.INTERNAL_SERVER_ERROR });
        }

    }
}
