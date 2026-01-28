import express from "express";
import { requireAuth } from "../middlewares/auth.js";
import { createTask, getTasks, updateStatus, saveTask, unsaveTask, getUserFavorites } from "../controllers/taskController.js";

const router = express.Router();

router.get("/", requireAuth, getTasks);
router.post("/", requireAuth, createTask);
router.patch("/:id/status", requireAuth, updateStatus);
router.post("/:id/save", requireAuth, saveTask);
router.delete("/:id/save", requireAuth, unsaveTask);
router.get("/favorites", requireAuth, getUserFavorites);

export default router;
