import React, { useState, useEffect } from "react";
import { fetchTasksForUser } from "../api/taskApi";
import Layout from "../components/Layout";

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token"); // Get the auth token
        const response = await fetchTasksForUser(token); // Fetch tasks from API
        setTasks(response.data.tasks);
        setLoading(false);
      } catch (err) {
        setError("Error fetching tasks");
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold text-gray-600">Loading tasks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold text-red-600">{error}</div>
      </div>
    );
  }

  // Function to determine task progress percentage based on status
  const getTaskProgress = (status) => {
    console.log(status)
    switch (status) {
      case "in progress":
        return 50; // In Progress -> 50%
      case "completed":
        return 100; // Completed -> 100%
      case "pending":
        return 0; // Pending -> 0%
      default:
        return 0; // Default case for unknown status
    }
  };

  return (
    <Layout name="Tasks">
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Tasks</h1>

      {tasks.length === 0 ? (
        <p className="text-lg text-gray-500">No tasks assigned to you.</p>
      ) : (
        <ul className="space-y-4">
          {tasks.map((task) => (
            <li
              key={task._id}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out"
            >
              <h3 className="text-xl font-semibold text-gray-800">{task.title}</h3>
              <p className="text-gray-600 mb-2">{task.description}</p>
              <p className="text-sm text-gray-500">
                <strong>Project:</strong> {task.projectId ? task.projectId.name : "No project assigned"}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Due Date:</strong> {new Date(task.dueDate).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Status:</strong> {task.status}
              </p>

              {/* Task Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full mt-4">
                <div
                  className="bg-blue-500 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
                  style={{ width: `${getTaskProgress(task.status)}%` }}
                >
                  {getTaskProgress(task.status)}%
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
    </Layout>
  );
};

export default TasksPage;
