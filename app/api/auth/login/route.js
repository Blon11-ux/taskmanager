import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "../../../utils/database";
import { User } from "../../../utils/schemaModels";

export async function POST(request) {
  try {
    await connectDB();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    // 1. Find the user by their email address
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // 2. Validate password matches (Plain text for now since your register saves plain text)
    if (user.password !== password) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // 3. 🎯 SUCCESSFUL LOGIN: Generate the secure browser cookie session
    const cookieStore = await cookies();
    cookieStore.set("session_user_id", user._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return NextResponse.json({ message: "Login successful!", userId: user._id }, { status: 200 });

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}