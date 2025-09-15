import { NextRequest } from "next/server";
import jwt, { JwtPayload } from 'jsonwebtoken';

interface DecodedToken extends JwtPayload {
    userId: string;
}
export const getUserIdFromToken = (req: NextRequest): string | undefined => {
    try {
        const token = req.cookies.get('token')?.value;


        if (!token)
            throw new Error("Auth not found!!");

        const verfiyToken = jwt.verify(token, process.env.AUTH_SECRET!) as DecodedToken;
        console.log(verfiyToken);
        return verfiyToken.userId;
    } catch (error: unknown) {
        if (error instanceof Error)
            throw new Error(error.message);

    }
}