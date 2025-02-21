import express from "express";
import { createTask, getTasksForUser, getTasksForProject, updateTask, deleteTask } from "../controllers/taskController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create a Task
router.post("/", protect, createTask);

// Get user Tasks
router.get("/user", protect, getTasksForUser);

// Get project Tasks
router.get("/project/:id", protect, getTasksForProject);


// Update a Task
router.put("/:id", protect, updateTask);

// Delete a Task
router.delete("/:id", protect, deleteTask);

export default router;
