import { Link } from "react-router-dom";
import { FaHome, FaTasks, FaProjectDiagram, FaUser, FaSignOutAlt } from "react-icons/fa"; // Example Icons

const Sidebar = () => {
  return (
    <div className="bg-gray-800 text-white w-64 h-screen shadow-lg flex flex-col p-6">
      {/* Logo Section */}
      <div className="flex items-center mb-8">
        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white text-2xl font-semibold">TM</span>
        </div>
        <span className="ml-3 text-2xl font-bold">Task Manager</span>
      </div>

      {/* Navigation Links */}
      <ul className="space-y-4">
        <li>
          <Link
            to="/dashboard"
            className="flex items-center text-lg text-gray-300 hover:text-white hover:bg-blue-500 p-2 rounded-lg"
          >
            <FaHome className="mr-3" /> Dashboard
          </Link>
        </li>
        <li>
          <Link
            to="/projects"
            className="flex items-center text-lg text-gray-300 hover:text-white hover:bg-blue-500 p-2 rounded-lg"
          >
            <FaProjectDiagram className="mr-3" /> Projects
          </Link>
        </li>
        <li>
          <Link
            to="/tasks"
            className="flex items-center text-lg text-gray-300 hover:text-white hover:bg-blue-500 p-2 rounded-lg"
          >
            <FaTasks className="mr-3" /> Tasks
          </Link>
        </li>
        <li>
          <Link
            to="/profile"
            className="flex items-center text-lg text-gray-300 hover:text-white hover:bg-blue-500 p-2 rounded-lg"
          >
            <FaUser className="mr-3" /> Profile
          </Link>
        </li>
        <li>
          <Link
            to="/login"
            className="flex items-center text-lg text-gray-300 hover:text-white hover:bg-blue-500 p-2 rounded-lg"
          >
            <FaSignOutAlt className="mr-3" /> Logout
          </Link>
        </li>
      </ul>

      {/* Footer (optional) */}
      <div className="mt-auto text-sm text-gray-500 text-center">
        <p>© 2025 Task Manager. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Sidebar;
