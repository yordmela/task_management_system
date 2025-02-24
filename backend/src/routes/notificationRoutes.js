import express from "express";
import { getNotifications, markAllNotificationsAsRead } from "../controllers/notificationController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Get User Notifications
router.get("/", protect, getNotifications);

// Mark Notification as Read
router.put("/read", protect, markAllNotificationsAsRead);

export default router;
