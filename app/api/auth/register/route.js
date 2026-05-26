import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import connectDB from "../../../utils/database";
import { User } from "../../../utils/schemaModels";

export async function POST(request) {
  try {
    await connectDB();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing email or password" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
         return NextResponse.json(
          { error: "Invalid email format. Please use a valid email like name@example.com" },
          { status: 400 }
        )
      }

    const passwordRegex = /^(?=.*[0-9]).{8,}$/
      if (!passwordRegex.test(password)) {
        return NextResponse.json(
          { error: "Password must be at least 8 characters and contain at least one number" },
          { status: 400 }
        )
      }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hashedPassword });

    const cookieStore = await cookies();
    cookieStore.set("session_user_id", newUser._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return NextResponse.json(
      { message: "User created and logged in successfully!", userId: newUser._id },
      { status: 201 }
    );

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}