import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";
import userRoutes from "./routes/users.js";

// [BEGINNER NOTE]
// This is the "Brain" of your backend.
// It sets up the server, connects to the database, and defines where requests go.

dotenv.config(); // Loads secret keys from .env file (like database password)

const app = express(); // Create the server application
const httpServer = createServer(app); // Wrap express in HTTP server for Socket.io
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.CLIENT_ORIGIN,
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

const io = new Server(httpServer, {
  cors: corsOptions,
});

// Store io instance in app so we can use it in controllers
app.set("io", io);

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Middleware (Gatekeepers)
app.use(cors(corsOptions));
app.use(express.json()); // Allows server to understand JSON data sent by frontend

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple check to see if server is alive
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

import fs from "fs";

// [BEGINNER NOTE] Serving Frontend
// This tells the backend to serve the "dist" folder (the built version of React)
const distPath = path.join(__dirname, "../frontend/dist");

if (fs.existsSync(distPath)) {
  console.log("✅ Frontend build found at:", distPath);
  app.use(express.static(distPath));
} else {
  console.warn("⚠️ WARNING: Frontend build NOT found at:", distPath);
  console.warn("👉 Make sure you ran 'npm run build' in the frontend folder.");
}

// [BEGINNER NOTE] Routing
// "If a request starts with /api/auth, send it to authRoutes file"
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

// Handle React Router: For any route not handled by API, serve index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

const port = process.env.PORT || 5002;

// Function to start the server listening for requests
const startServer = () => {
  httpServer
    .listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    })
    .on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.error(
          `❌ Cổng ${port} đã bị chiếm. Vui lòng sử dụng cổng khác.`,
        );
        process.exit(1);
      } else {
        console.error(err);
        process.exit(1);
      }
    });
};

// [BEGINNER NOTE] Database Connection
// First connect to MongoDB, THEN start the server.
const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error("❌ ERROR: MONGODB_URI is not defined in environment variables.");
  console.error("👉 Please add MONGODB_URI to your Render Environment settings.");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    startServer();
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error);
  });
