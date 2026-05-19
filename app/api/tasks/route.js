// app/api/tasks/route.js
import { NextResponse } from "next/server";
import connectDB from "../../utils/database";
import { Task } from "../../utils/schemaModels";

async function getAuthenticatedUser(request) {
  // Placeholder ID string so code compiles safely while testing
  return "65f1a2cc90b56123456789ab"; 
}

// 1. GET - Only fetches tasks belonging to the logged-in user
export async function GET(request) {
  try {
    await connectDB();
    const userId = await getAuthenticatedUser(request);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const tasks = await Task.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json(tasks, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 2. POST - Assigns the active user's ID and optional Due Date directly to the new task item
export async function POST(request) {
  try {
    await connectDB();
    const userId = await getAuthenticatedUser(request);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 🎯 UPDATED: Pull dueDate out of the incoming request JSON bundle
    const { title, dueDate } = await request.json();
    if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });

    // 🎯 UPDATED: Inject dueDate (saves a string or null if they left it empty)
    const newTask = await Task.create({ 
      title, 
      userId, 
      dueDate: dueDate || null 
    });
    
    return NextResponse.json(newTask, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// 3. PUT - Safeguards the update logic so users can't accidentally modify other users' data
export async function PUT(request) {
  try {
    await connectDB();
    const userId = await getAuthenticatedUser(request);
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

// 4. DELETE - Restricts deletion capabilities to the task's authentic owner
export async function DELETE(request) {
  try {
    await connectDB();
    const userId = await getAuthenticatedUser(request);
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