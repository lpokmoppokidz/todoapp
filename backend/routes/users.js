import express from "express";
import { requireAuth } from "../middleware/auth.js";
import { listUsers } from "../controllers/userController.js";

const router = express.Router();

router.get("/", requireAuth, listUsers);

export default router;
