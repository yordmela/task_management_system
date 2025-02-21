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


dotenv.config();  // Load environment variables
connectDB();      // Connect to MongoDB

const app = express();
app.use(express.json()); // Parse JSON requests
app.use(cookieParser()); // Handle cookies
app.use(cors());         // Enable frontend-backend communication
app.use(morgan("dev"));  // Logs requests
app.use(express.urlencoded({ extended: true }));

// Use Routes
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/notifications", notificationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
