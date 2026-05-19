import { NextResponse } from "next/server";
import { cookies } from "next/headers"; // 🎯 ADDED: For setting session cookies
import connectDB from "../../../utils/database";
import { User } from "../../../utils/schemaModels"; 

export async function POST(request) {
  try {
    await connectDB();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 400 });
    }

    // Create the new user document in MongoDB
    const newUser = await User.create({ email, password });

    // 🎯 SECURE LOGIN ON REGISTER: Drop the session cookie right here
    const cookieStore = await cookies();
    cookieStore.set("session_user_id", newUser._id.toString(), {
      httpOnly: true,       // Prevents malicious browser scripts from reading the user ID
      secure: process.env.NODE_ENV === "production", // Forces HTTPS in production
      maxAge: 60 * 60 * 24 * 7, // Cookie stays alive for 7 days
      path: "/",            // Available across your entire application
    });

    return NextResponse.json({ 
      message: "User created and logged in successfully!", 
      userId: newUser._id 
    }, { status: 201 });

  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}