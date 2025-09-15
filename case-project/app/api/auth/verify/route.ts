import connectDb from '@/lib/db';
import { HTTP_STATUS, MESSAGES } from '@/utils/http';
import { NextResponse } from "next/server";
import User from '@/models/user';
import EmailVerificationToken from '@/models/emailVerificationToken';


export async function GET(req: Request) {
  try {
     console.log("searchParams");
    const { searchParams } = new URL(req.url);
   
    const token = searchParams.get("token");

    if (!token)
      throw new Error("Token is required");

    await connectDb();

    const tokenDoc = await EmailVerificationToken.findOne({ token });
    if (!tokenDoc)
      throw new Error("Invalid Token");

    if (tokenDoc.expiresAt < new Date())
      throw new Error("Token expired");

    await User.findByIdAndUpdate(tokenDoc.userId, {emailVerified: true});

    await EmailVerificationToken.deleteOne({_id: tokenDoc._id});


    return NextResponse.json({ message: MESSAGES.EMAIL_VERIFIED }, { status: HTTP_STATUS.OK });
  } catch (error: unknown) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message  || MESSAGES.BAD_REQUEST }, { status: HTTP_STATUS.INTERNAL_SERVER_ERROR });
  }
}