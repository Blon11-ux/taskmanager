import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    
    // Delete the tracking cookie from the browser storage pipeline
    cookieStore.delete("session_user_id");

    return NextResponse.json({ message: "Logged out successfully" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}