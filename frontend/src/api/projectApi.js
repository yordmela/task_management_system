import axios from "axios";

// Create an axios instance with the base URL of the backend API
const API = axios.create({ baseURL: "http://localhost:5000/api" });

// Fetch all projects
export const fetchProjects = (token) =>
  API.get("/projects", { headers: { Authorization: `Bearer ${token}` } });

// Create a new project
export const createProject = (token, projectData) =>
  API.post(
    "/projects",
    { projectData },
    { headers: { Authorization: `Bearer ${token}` } }
  );

// Update a project
export const updateProject = (token, projectId, projectData) =>
  API.put(
    `/projects/${projectId}`,
     projectData ,
    { headers: { Authorization: `Bearer ${token}` } }
  );

// Delete a project
export const deleteProject = (token, projectId) =>
  API.delete(`/projects/${projectId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
