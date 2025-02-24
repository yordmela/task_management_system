import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

// Fetch tasks for a specific user
export const fetchTasksForUser = (token) =>
  API.get("/tasks/user", { headers: { Authorization: `Bearer ${token}` } });

// Fetch tasks for a specific user
export const fetchTasksForProject = (projectId, token) =>
    API.get(`/tasks/project/${projectId}`, { headers: { Authorization: `Bearer ${token}` } });

// Create a new task
export const createTask = (taskData, token) =>
  API.post("/tasks", taskData, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Update a task (e.g., mark as completed)
export const updateTask = (taskId, taskData, token) =>
  API.put(`/tasks/${taskId}`, taskData, {
    headers: { Authorization: `Bearer ${token}` },
  });

// Delete a task
export const deleteTask = (taskId, token) =>
  API.delete(`/tasks/${taskId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
