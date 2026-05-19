import { NextResponse } from "next/server";
import connectDB from "../../../utils/database";
import { User } from "../../../utils/schemaModels"; // Placed in curly braces!

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

    const newUser = await User.create({ email, password });

    return NextResponse.json({ message: "User created successfully!", userId: newUser._id }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}