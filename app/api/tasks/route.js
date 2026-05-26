import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "../../utils/database";
import { Task } from "../../utils/schemaModels";

async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("session_user_id")?.value;
  return userId || null;
}

export async function GET() {
  try {
    await connectDB();
    const userId = await getAuthenticatedUser();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const tasks = await Task.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json(tasks, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const userId = await getAuthenticatedUser();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { title, dueDate, dueTime } = await request.json();
    if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });

    const newTask = await Task.create({
      title,
      userId,
      dueDate: dueDate || null,
      dueTime: dueTime || null,
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await connectDB();
    const userId = await getAuthenticatedUser();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id, status } = await request.json();

    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, userId },
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedTask) return NextResponse.json({ error: "Task not found or access denied" }, { status: 404 });
    return NextResponse.json(updatedTask, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await connectDB();
    const userId = await getAuthenticatedUser();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const deletedTask = await Task.findOneAndDelete({ _id: id, userId });
    if (!deletedTask) return NextResponse.json({ error: "Task not found or access denied" }, { status: 404 });

    return NextResponse.json({ message: "Task deleted successfully" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}