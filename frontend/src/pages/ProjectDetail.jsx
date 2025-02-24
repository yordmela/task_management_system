import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react'; // For managing tasks and modal visibility
import Modal from '../components/Modal'; // Assuming you have a Modal component
import Layout from '../components/Layout';
import { fetchTasksForProject } from '../api/taskApi'; // Import your API function

const ProjectDetail = () => {
    const location = useLocation();
    const { project } = location.state;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tasks, setTasks] = useState([]); // State to hold tasks

    // Fetch tasks when the component mounts
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                // Pass projectId and token for authorization
                const token = localStorage.getItem('token'); // Replace with actual token storage method
                const response = await fetchTasksForProject(project._id, token);
                console.log(response.data.tasks)
                setTasks(response.data.tasks); // Assuming the response contains tasks in the data field
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        };

        fetchTasks();
    }, [project._id]);

    // Function to toggle the modal
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
        <Layout name="Project Detail">
            <div className="p-6 bg-gray-50 min-h-screen">
                {/* Project Title and Description */}
                <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                    <h2 className="text-3xl font-semibold text-gray-900">{project.title}</h2>
                    <p className="mt-4 text-lg text-gray-700">{project.description}</p>
                </div>

                {/* Assigned Users Section */}
                <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-6">Assigned Users:</h3>
                    <ul className="space-y-4">
                        {project.assignedUsers.map((user, index) => (
                            <li key={index} className="text-lg text-gray-800">
                                {user.email}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Tasks Section */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">Assigned Tasks</h3>

                    {Array.isArray(tasks) && tasks.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {tasks.map((task, index) => (
                                <li key={task._id || index} className="p-4 bg-gray-50 rounded-lg shadow-md">
                                    <h4 className="text-lg font-semibold text-gray-800">{task.title}</h4>
                                    <p className="text-gray-600">{task.description}</p>
                                    <p className="text-sm text-gray-500">Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>

                                    {/* Assigned Users Section */}
                                    <div className="mt-2">
                                        <h5 className="text-sm font-semibold text-gray-700">Assigned Users:</h5>
                                        {task.assignedTo && task.assignedTo.length > 0 ? (
                                            <ul className="list-disc list-inside text-gray-600">
                                                {task.assignedTo.map((user, userIndex) => (
                                                    <li key={userIndex} className="text-sm">{user.email}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-sm text-gray-500">No assigned users</p>
                                        )}
                                    </div>

                                    {/* Task Status */}
                                    <span className={`inline-block mt-2 px-3 py-1 text-sm font-semibold rounded-md ${task.status === 'pending' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'
                                        }`}>
                                        {task.status}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-lg text-gray-700">No tasks assigned yet.</p>
                    )}
                </div>



                {/* Task Assignment Button */}
                <div className="flex justify-end mb-6">
                    <button
                        onClick={toggleModal}
                        className="px-6 py-3 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition duration-300 transform hover:scale-105"
                    >
                        Assign Tasks to Users
                    </button>
                </div>

                {/* Task Assignment Modal */}
                {isModalOpen && (
                    <Modal onClose={toggleModal}>
                        <div className="p-6">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Assign Tasks</h2>
                            <form className="space-y-6">
                                <div>
                                    <label
                                        htmlFor="taskName"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Task Name
                                    </label>
                                    <input
                                        type="text"
                                        id="taskName"
                                        name="taskName"
                                        className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter task name"
                                        required
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="assignedUser"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Assign to
                                    </label>
                                    <select
                                        id="assignedUser"
                                        name="assignedUser"
                                        className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        {project.assignedUsers.map((user, index) => (
                                            <option key={index} value={user._id}>
                                                {user.email}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        type="submit"
                                        className="px-6 py-3 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition duration-300 transform hover:scale-105"
                                    >
                                        Assign Task
                                    </button>
                                </div>
                            </form>
                        </div>
                    </Modal>
                )}
            </div>
        </Layout>
    );
};

export default ProjectDetail;
