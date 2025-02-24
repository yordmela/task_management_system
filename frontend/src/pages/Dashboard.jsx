import { useState, useEffect } from "react";
import Layout from "../components/Layout";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [notifications, setNotifications] = useState([]);


  useEffect(() => {
    // Mock Data (Replace with API calls)
    setProjects([
      { id: 1, name: "Project A", progress: 75 },
      { id: 2, name: "Project B", progress: 50 },
    ]);

    setTasks([
      { id: 1, title: "Design UI", assignedTo: "Alice", status: "In Progress" },
      { id: 2, title: "Database Setup", assignedTo: "Bob", status: "Completed" },
    ]);

    setNotifications([
      { id: 1, message: "New task assigned: Design UI" },
      { id: 2, message: "Project A deadline approaching" },
    ]);
  }, []);

  return (
    <Layout name={"DashBoard"}>
      <h2 className="text-2xl font-bold mt-6 mb-4 px-6">Projects</h2>
      <div className="px-6 grid grid-cols-2 gap-4">
        {projects.map((project) => (
          <div key={project.id} className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-bold">{project.name}</h3>
            <div className="w-full bg-gray-200 rounded-full mt-2">
              <div
                className="bg-blue-500 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
                style={{ width: `${project.progress}%` }}
              >
                {project.progress}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Dashboard;
