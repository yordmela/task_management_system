import express from "express";
import { createProject, getProjects, updateProject, deleteProject } from "../controllers/projectController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { getAllProjects } from "../controllers/projectController.js";

const router = express.Router();

// Create a Project
router.post("/", protect, createProject);



// Get all Projects
router.get("/", protect, getAllProjects);

// get a specific project
router.get("/:id", protect, getProjects);

// Update a Project
router.put("/:id", protect, updateProject);

// Delete a Project
router.delete("/:id", protect, deleteProject);

export default router;
