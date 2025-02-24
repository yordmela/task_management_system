import express from "express";
import { registerUser, loginUser, getUserProfile, getUserById } from "../controllers/authController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// User Registration
router.post("/register", registerUser);

// User Login
router.post("/login", loginUser);

// Get User Profile (Protected)
router.get("/profile", protect, getUserProfile);

router.get("/:id", getUserById)

export default router;
