import { NextResponse } from "next/server";
import connectDB from "../../utils/database";
import { Task } from "../../utils/schemaModels";

// 1. GET Method - Fetches all tasks
export async function GET() {
  try {
    await connectDB();
    const tasks = await Task.find({}).sort({ createdAt: -1 });
    return NextResponse.json(tasks, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 2. POST Method - Creates a new task
export async function POST(request) {
  try {
    await connectDB();
    const { title } = await request.json();

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const newTask = await Task.create({ title });
    return NextResponse.json(newTask, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}