import Task from "../models/Task.js";
import User from "../models/User.js";

const generateCode = () => `PRO-${Math.floor(100 + Math.random() * 900)}`;

export const getAllTasks = async () => {
  return await Task.find()
    .populate("createdBy", "name email")
    .populate("assignees", "name email")
    .sort({ createdAt: -1 });
};

export const createNewTask = async (taskData, userId, io) => {
  const { title, assignees, deadline, category } = taskData;
  
  const assigneeIds = Array.isArray(assignees) ? assignees : [];
  let assigneeObjectIds = [];
  
  if (assigneeIds.length > 0) {
    const existingAssignees = await User.find({ _id: { $in: assigneeIds } });
    assigneeObjectIds = existingAssignees.map((user) => user._id);
  }

  const payload = {
    code: generateCode(),
    title,
    category: category || "web_development",
    assignees: assigneeObjectIds,
    createdBy: userId
  };

  if (deadline) {
    payload.deadline = deadline;
  }

  const task = await Task.create(payload);
  const populated = await Task.findById(task._id)
    .populate("createdBy", "name email")
    .populate("assignees", "name email");

  // [LEARNING NOTE] Real-time Broadcast
  // After saving to the DB, we tell everyone else about it!
  if (io) {
    io.emit("task:created", populated);
  }

  return populated;
};

export const updateTaskStatus = async (taskId, status, userId) => {
  const task = await Task.findById(taskId);
  if (!task) throw new Error("Task not found");

  if (task.createdBy.toString() !== userId) {
    throw new Error("Only creator can update status");
  }

  task.status = status;
  await task.save();

  return await Task.findById(taskId)
    .populate("createdBy", "name email")
    .populate("assignees", "name email");
};

export const saveUserTask = async (taskId, userId) => {
  const task = await Task.findById(taskId);
  if (!task) throw new Error("Task not found");

  if (task.savedBy.includes(userId)) {
    throw new Error("Task already saved");
  }

  task.savedBy.push(userId);
  await task.save();

  return await Task.findById(taskId)
    .populate("createdBy", "name email")
    .populate("assignees", "name email");
};

export const unsaveUserTask = async (taskId, userId) => {
  const task = await Task.findById(taskId);
  if (!task) throw new Error("Task not found");

  task.savedBy = task.savedBy.filter(id => id.toString() !== userId);
  await task.save();

  return await Task.findById(taskId)
    .populate("createdBy", "name email")
    .populate("assignees", "name email");
};

export const getFavorites = async (userId) => {
  return await Task.find({ savedBy: userId })
    .populate("createdBy", "name email")
    .populate("assignees", "name email")
    .sort({ createdAt: -1 });
};
