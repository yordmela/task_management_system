import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/authApi";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee", // Default role
  });
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Call API for signup (to be implemented)
    try {
      // Make API call to register the user
      const response = await registerUser(formData);
      console.log("User registered:", response);
      
      // Redirect to login page after successful signup
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Create New Account</h2>

        <input
          type="text"
          name="name"
          placeholder="Enter your name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
        />

        {/* Role Selection Dropdown */}
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full p-2 mb-3 border rounded"
        >
          <option value="employee">Employee</option>
          <option value="project Manager">Project Manager</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Register;
