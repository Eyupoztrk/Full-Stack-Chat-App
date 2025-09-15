import connectDb from '@/lib/db';
import { HTTP_STATUS, MESSAGES } from '@/utils/http';
import { NextResponse } from "next/server";
import User from '@/models/user';
import EmailVerificationToken from '@/models/emailVerificationToken';

import bcrypt from "bcryptjs";
import { Resend } from "resend";
import crypto from "crypto";


const resend = new Resend(process.env.RESEND_API_KEY);


export async function POST(req: Request) {
  try {
    await connectDb();

    const body = await req.json();
    const { name, email, password, emailVerified } = body;

    if (!name || !email || !password)
      throw new Error(MESSAGES.BAD_REQUEST);


    const existingUser = await User.findOne({ email });
    if (existingUser)
      throw new Error("Email is already in use");

    const passwordHash = await bcrypt.hash(password, 10);


    const newUser = await User.create({
      name: name,
      email: email,
      password: passwordHash,
      emailVerified: emailVerified
    });

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 86400); // 24 saat

    await EmailVerificationToken.create({
      userId: newUser._id,
      token: token,
      expiresAt: expiresAt
    });

    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify?token=${token}`;

    await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: email,
      subject: "Verify your email",
      html: `<p>Hello ${name}, to verify your email <a href="${verifyUrl}">click here</a>.</p>`,
    });

    return NextResponse.json({ message: MESSAGES.CREATED, userId: newUser._id }, { status: HTTP_STATUS.CREATED });
  } catch (error: unknown) {
    if (error instanceof Error)
      return NextResponse.json({ message: error.message  || MESSAGES.BAD_REQUEST }, { status: HTTP_STATUS.INTERNAL_SERVER_ERROR });

  }
}