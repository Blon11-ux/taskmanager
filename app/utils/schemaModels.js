// app/utils/schemaModels.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    status: { 
      type: String, 
      default: "not done", 
      enum: ["not done", "in progress", "done"] 
    },
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    
    // 🎯 FIX: Add this line so MongoDB saves your deadlines!
    dueDate: { type: String, default: null }
  },
  { timestamps: true }
);

// app/utils/schemaModels.js

// ... keep your UserSchema and TaskSchema exactly as they are ...

// 🎯 FIX: Force Mongoose to delete the old cached model and re-compile with the new schema!
if (mongoose.models.Task) {
  delete mongoose.models.Task;
}

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
export const Task = mongoose.model("Task", TaskSchema);