// app/utils/schemaModels.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    status: {
      type: String,
      default: "not done",
      enum: ["not done", "in progress", "done"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dueDate: { type: String, default: null },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
export const Task = mongoose.models.Task || mongoose.model("Task", TaskSchema);