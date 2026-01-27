import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    title: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["todo", "in_progress", "done"],
      default: "todo"
    },
    category: { type: String, default: "web_development" },
    deadline: { type: Date },
    assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
  
