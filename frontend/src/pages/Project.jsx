import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { createProject, deleteProject, fetchProjects, updateProject } from "../api/projectApi";
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom";



const ProjectsPage = () => {
    const [projects, setProjects] = useState([]);
    const [newProject, setNewProject] = useState({
        title: "",
        description: "",
        status: "Pending",
        assignedUsers: [],
        deadline: "",
        tasks: [], // Initialize tasks as an empty array
    });
    const [editProject, setEditProject] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [progress, setProgress] = useState(0);
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    useEffect(() => {

        const loadProjects = async () => {
            try {
                const response = await fetchProjects(token);
                setProjects(response.data.projects);
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };
        loadProjects();
    }, [token]);

    // Handle Create Project
    const handleCreate = async () => {
        console.log(token)
        const project = {
            ...newProject,
            assignedUsers: newProject.assignedUsers.split(",").map(email => email.trim()), // Adjust for array format
            progress, // Assuming progress is updated with an input
        };

        try {
            const response = await createProject(token, project);
            console.log(response)
            if (response.project) {
                setProjects((prevProjects) => [response.project, ...prevProjects]);
                setNewProject({
                    title: "",
                    description: "",
                    status: "Pending",
                    assignedUsers: "",
                    deadline: "",
                    tasks: [],
                });
                setProgress(0);

                const updatedProjects = await fetchProjects(token);
                setProjects(updatedProjects.data.projects);

            } else {
                console.error(response.error);
            }
        } catch (error) {
            console.error("Error creating project:", error);
        } finally {
            setIsModalOpen(false); // Ensure the modal closes regardless of success or failure

        }
    };


    // Handle Edit Project
    const handleEdit = async () => {

        const projectData = {
            title: editProject.title,
            description: editProject.description,
            status: editProject.status,
            assignedUsers: editProject.assignedUsers.split(",").map((email) => email.trim()),
            deadline: editProject.deadline,
            progress,
        };

        try {
            console.log(editProject._id)
            const response = await updateProject(token, editProject._id, projectData);
            if (response.data) { // Assuming the API returns the updated project in `response.data`
                const updatedProjects = projects.map((project) =>
                    project.id === editProject._id ? response.data : project
                );
                setProjects(updatedProjects);
                setIsEditModalOpen(false);
                setEditProject(null);
                setProgress(0);
                window.location.reload();
            } else {
                console.error("Error updating project: No data returned");
            }
        } catch (error) {
            console.error("Error updating project:", error);
        }
    };


    // Handle Delete Project
    const handleDelete = async (projectId) => {
        console.log(projectId)
        try {
            const response = await deleteProject(token, projectId); // Assuming deleteProject is an API function
            console.log(response)
            if (response.status === 204) { // Ensure deletion was successful
                setProjects((prevProjects) => prevProjects.filter((project) => project.id !== projectId));
                window.location.reload();
            } else {
                console.error("Error deleting project: Unexpected response");

            }
        } catch (error) {
            console.error("Error deleting project:", error);
        }
    };


    // Handle Edit Click (Open Edit Modal)
    const handleEditClick = (project) => {
        setEditProject({
            ...project,
            assignedUsers: project.assignedUsers.join(", "),
        });
        setProgress(project.progress);
        setIsEditModalOpen(true);
    };

    // Handle Create Click (Open Create Modal)
    const handleCreateClick = () => {
        setNewProject({
            title: "",
            description: "",
            status: "pending",
            assignedUsers: "",
            deadline: "",
            tasks: [], // Reset tasks array
        });
        setProgress(0);
        setIsModalOpen(true);
    };

    // Handle Add Task
    const handleAddTask = () => {
        setNewProject((prevProject) => ({
            ...prevProject,
            tasks: [...prevProject.tasks, { title: "", description: "", dueDate: "" }],
        }));
    };

    const handleProjectClick = (project) => {
        navigate("/projectDetail", { state: { project } })
    }

    return (
        <Layout name="Projects">
            <div className="p-6 bg-gray-50 min-h-screen flex flex-col">
                {/* Projects List */}
                <div className="space-y-6 mb-16">
                    {projects.length === 0 ? (
                        <p className="text-gray-500">No projects available. Create one to get started.</p>
                    ) : (
                        <ul className="space-y-4">
                            {projects?.map((project) => (
                                <li
                                    key={project.id}
                                    className="flex justify-between items-center bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                                >
                                    <div className="flex-1"  onClick={()=>handleProjectClick(project)}>
                                        <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
                                        <p className="text-gray-700 mt-1">{project.description}</p>
                                        <div className="mt-2">
                                            <span
                                                className={`text-xs px-2 py-1 rounded-full ${project.status === "Pending"
                                                    ? "bg-yellow-200 text-yellow-800"
                                                    : project.status === "inprogress"
                                                        ? "bg-blue-200 text-blue-800"
                                                        : "bg-green-200 text-green-800"
                                                    }`}
                                            >
                                                {project.status}
                                            </span>
                                        </div>
                                        <div className="mt-2">
                                            <h4 className="font-medium">Assigned Users:</h4>
                                            <ul>
                                                {project.assignedUsers.map((user, index) => (
                                                    
                                                    <li key={index} className="text-sm text-gray-600">
                                                        {user.email}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="mt-4">
                                            <span className="text-sm text-gray-600">Deadline: {project.deadline}</span>
                                        </div>
                                    </div>

                                    {/* Progress Bar and Actions */}
                                    <div className="flex flex-col justify-between ml-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-600">Progress:</span>
                                            <div className="w-32 bg-gray-300 rounded-full h-2.5">
                                                <div
                                                    className="bg-blue-500 h-2.5 rounded-full"
                                                    style={{ width: `${project.progress}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm font-medium">{project.progress}%</span>
                                        </div>

                                        <div className="flex gap-2 mt-4">
                                            <button
                                                onClick={() => handleEditClick(project)}
                                                className="text-blue-500 hover:text-blue-600"
                                            >
                                                <FaEdit className="inline mr-1" />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(project._id)}
                                                className="text-red-500 hover:text-red-600"
                                            >
                                                <FaTrash className="inline mr-1" />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Create Project Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-8 rounded-lg shadow-lg w-96 max-w-lg">
                            <h2 className="text-2xl font-semibold mb-4 text-center">Create a New Project</h2>
                            <div className="space-y-4">
                                {/* Title Field */}
                                <input
                                    type="text"
                                    placeholder="Project Title"
                                    value={newProject.title}
                                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                                    className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {/* Description Field */}
                                <textarea
                                    placeholder="Project Description"
                                    value={newProject.description}
                                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                    className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {/* Status Field */}
                                <select
                                    value={newProject.status}
                                    onChange={(e) => setNewProject({ ...newProject, status: e.target.value })}
                                    className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="pending">pending</option>
                                    <option value="inprogress">inprogress</option>
                                    <option value="completed">completed</option>
                                </select>
                                {/* Assigned Users */}
                                <div className="space-y-2">
                                    <h3 className="font-medium text-lg">Assigned Users (Email Addresses)</h3>
                                    <input
                                        type="text"
                                        placeholder="Enter emails separated by commas"
                                        value={newProject.assignedUsers}
                                        onChange={(e) => setNewProject({ ...newProject, assignedUsers: e.target.value })}
                                        className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                {/* Deadline Field */}
                                <input
                                    type="date"
                                    value={newProject.deadline}
                                    onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
                                    className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />

                                {/* Task Section */}
                                <div className="space-y-2">
                                    <h3 className="font-medium text-lg">Tasks</h3>

                                    {newProject.tasks?.map((task, index) => (
                                        <div key={index} className="p-3 border border-gray-300 rounded-lg relative">
                                            <button
                                                onClick={() => {
                                                    const updatedTasks = [...newProject.tasks];
                                                    updatedTasks.splice(index, 1);
                                                    setNewProject({ ...newProject, tasks: updatedTasks });
                                                }}
                                                className="absolute top-1 right-1 text-red-500 hover:text-red-700"
                                            >
                                                ✖
                                            </button>
                                            <input
                                                type="text"
                                                placeholder="Task Title"
                                                value={task.title}
                                                onChange={(e) => {
                                                    const updatedTasks = [...newProject.tasks];
                                                    updatedTasks[index].title = e.target.value;
                                                    setNewProject({ ...newProject, tasks: updatedTasks });
                                                }}
                                                className="p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            <textarea
                                                placeholder="Task Description"
                                                value={task.description}
                                                onChange={(e) => {
                                                    const updatedTasks = [...newProject.tasks];
                                                    updatedTasks[index].description = e.target.value;
                                                    setNewProject({ ...newProject, tasks: updatedTasks });
                                                }}
                                                className="p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                                            />
                                            <input
                                                type="date"
                                                value={task.dueDate}
                                                onChange={(e) => {
                                                    const updatedTasks = [...newProject.tasks];
                                                    updatedTasks[index].dueDate = e.target.value;
                                                    setNewProject({ ...newProject, tasks: updatedTasks });
                                                }}
                                                className="p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                                            />
                                        </div>
                                    ))}

                                    {/* Add Task Button */}
                                    <button
                                        onClick={handleAddTask}
                                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 focus:outline-none"
                                    >
                                        + Add Task
                                    </button>
                                </div>

                                {/* Create Project Button */}
                                <div className="flex justify-between mt-4">
                                    <button
                                        onClick={handleCreate}
                                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none"
                                    >
                                        Create Project
                                    </button>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="bg-gray-300 text-black px-6 py-2 rounded-lg hover:bg-gray-400 focus:outline-none"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Project Modal */}
                {isEditModalOpen && editProject && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-8 rounded-lg shadow-lg w-96 max-w-lg">
                            <h2 className="text-2xl font-semibold mb-4 text-center">Edit Project</h2>
                            <div className="space-y-4">
                                {/* Title Field */}
                                <input
                                    type="text"
                                    placeholder="Project Title"
                                    value={editProject.title}
                                    onChange={(e) => setEditProject({ ...editProject, title: e.target.value })}
                                    className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {/* Description Field */}
                                <textarea
                                    placeholder="Project Description"
                                    value={editProject.description}
                                    onChange={(e) => setEditProject({ ...editProject, description: e.target.value })}
                                    className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {/* Status Field */}
                                <select
                                    value={editProject.status}
                                    onChange={(e) => setEditProject({ ...editProject, status: e.target.value })}
                                    className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="pending">pending</option>
                                    <option value="inprogress">inprogress</option>
                                    <option value="completed">completed</option>
                                </select>
                                {/* Assigned Users */}
                                <div className="space-y-2">
                                    <h3 className="font-medium text-lg">Assigned Users (Email Addresses)</h3>
                                    <input
                                        type="text"
                                        placeholder="Enter emails separated by commas"
                                        value={editProject.assignedUsers}
                                        onChange={(e) => setEditProject({ ...editProject, assignedUsers: e.target.value })}
                                        className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                {/* Deadline Field */}
                                <input
                                    type="date"
                                    value={editProject.deadline}
                                    onChange={(e) => setEditProject({ ...editProject, deadline: e.target.value })}
                                    className="p-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />

                                {/* Edit Project Button */}
                                <div className="flex justify-between mt-4">
                                    <button
                                        onClick={handleEdit}
                                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none"
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        onClick={() => setIsEditModalOpen(false)}
                                        className="bg-gray-300 text-black px-6 py-2 rounded-lg hover:bg-gray-400 focus:outline-none"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Create New Project Button (Fixed at the Bottom) */}
                <div className="fixed bottom-0 left-0 right-0 p-6 bg-white shadow-md">
                    <button
                        onClick={handleCreateClick}
                        className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none"
                    >
                        Create New Project
                    </button>
                </div>
            </div>
        </Layout>
    );
};

export default ProjectsPage;