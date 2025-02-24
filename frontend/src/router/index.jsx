import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Tasks from "../pages/Tasks";
import ProtectedRoute from "./ProtectedRoute";
import ProjectsPage from "../pages/Project";
import ProjectDetails from "../pages/ProjectDetail";


const AppRouter = () => {
  return (
    <Router>

      <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="projectDetail" element={<ProjectDetails />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
