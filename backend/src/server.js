import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
import corsOptions from "./config/cors.js";

dotenv.config();

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: corsOptions,
});

// Attach io to app so controllers can use it
app.set("io", io);

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const port = process.env.PORT || 5002;

const start = async () => {
  await connectDB();
  httpServer.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });
};

start();
