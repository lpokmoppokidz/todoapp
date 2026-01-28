import express from "express";
import { login, logout, refresh, register, getOnlineUsers } from "../controllers/authController.js";
import { requireAuth } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/online-users", requireAuth, getOnlineUsers);

export default router;
