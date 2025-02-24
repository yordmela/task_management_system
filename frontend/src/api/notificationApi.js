import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

// Fetch notifications for a specific user
export const fetchNotifications = (token) =>
  API.get("/notifications", { headers: { Authorization: `Bearer ${token}` } });

// Mark a notification as read
export const markAllNotificationsAsRead = (token) =>
  API.put(
    `/notifications/read`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
