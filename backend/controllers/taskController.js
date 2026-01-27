import * as taskService from "../services/taskService.js";

export const getTasks = async (req, res) => {
  try {
    const tasks = await taskService.getAllTasks();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

export const createTask = async (req, res) => {
  try {
    const { title, assignees, deadline, category } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const io = req.app.get("io");
    const task = await taskService.createNewTask(
      { title, assignees, deadline, category },
      req.user.id,
      io
    );
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message || "Could not create task" });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["todo", "in_progress", "done"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const task = await taskService.updateTaskStatus(req.params.id, status, req.user.id);
    res.json(task);
  } catch (error) {
    const status = error.message === "Task not found" ? 404 : 403;
    res.status(status).json({ message: error.message });
  }
};

export const saveTask = async (req, res) => {
  try {
    const task = await taskService.saveUserTask(req.params.id, req.user.id);
    res.json(task);
  } catch (error) {
    const status = error.message === "Task not found" ? 404 : 400;
    res.status(status).json({ message: error.message });
  }
};

export const unsaveTask = async (req, res) => {
  try {
    const task = await taskService.unsaveUserTask(req.params.id, req.user.id);
    res.json(task);
  } catch (error) {
    res.status(404).json({ message: "Task not found" });
  }
};

export const getUserFavorites = async (req, res) => {
  try {
    const favorites = await taskService.getFavorites(req.user.id);
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch favorites" });
  }
};
