import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import userRoutes from "./routes/userRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import http from "http"; // Import HTTP server to work with socket.io
import { Server } from "socket.io"; // Correct import for Socket.IO v4+

dotenv.config(); // Load environment variables
connectDB(); // Connect to MongoDB

const app = express();

// Create HTTP server for WebSocket integration
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000", // Allow frontend to connect
      methods: ["GET", "POST"],
      credentials: true
    }
  });

app.use(express.json()); // Parse JSON requests
app.use(cookieParser()); // Handle cookies
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(morgan("dev")); // Logs requests
app.use(express.urlencoded({ extended: true }));

// Use Routes
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/notifications", notificationRoutes);

// Set up Socket.io
io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle user-specific notifications
  socket.on("setUser", (userId) => {
    console.log(`User ${userId} connected`);
    // You can store the userId to send notifications to specific users
    socket.userId = userId;
  });

  // Emit a real-time notification to all connected clients
  socket.on("sendNotification", (notification) => {
    console.log("Sending notification: ", notification);
    io.emit("newNotification", notification); // Emit to all clients
  });

  // When a user disconnects
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));