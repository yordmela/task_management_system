import { useState, useEffect } from "react";
import { FiBell } from "react-icons/fi";
import { FaCheck } from "react-icons/fa"; // Import the tick icon
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { fetchNotifications, markAllNotificationsAsRead } from "../api/notificationApi"; // Import markAllNotificationsAsRead
import io from 'socket.io-client';

const Navbar = ({name}) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [userName, setUserName] = useState("");
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();

    // Initialize WebSocket connection
    useEffect(() => {
        const socket = io("http://localhost:5000");

        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setUserName(decodedToken.name);

                // Fetch notifications when the component mounts
                fetchNotifications(token).then((response) => {
                    setNotifications(response.data.notifications);
                });

                // Set the user ID in the WebSocket connection
                socket.emit('setUser', decodedToken.id);

                // Listen for real-time notifications
                socket.on('newNotification', (newNotification) => {
                    setNotifications((prevNotifications) => [
                        newNotification, ...prevNotifications
                    ]);
                });

                return () => {
                    socket.disconnect();
                };
            } catch (error) {
                console.error("Invalid token", error);
                navigate("/login");
            }
        } else {
            navigate("/login");
        }
    }, [navigate]);



    // Mark all notifications as read
    const handleMarkAllRead = () => {
        console.log("Mark all as read clicked!");  // Debugging
        const token = localStorage.getItem("token");
        console.log(token)
        if (token) {
            markAllNotificationsAsRead(token)
                .then(() => {
                    console.log("Notifications marked as read successfully!");
                    setNotifications([]); // Clear all notifications
                })
                .catch((error) => {
                    console.error("Error marking all as read:", error);
                });
        }
    };


    const getInitials = (name) => {
        const nameParts = name.split(" ");
        return nameParts.slice(0, 2).map((part) => part.charAt(0).toUpperCase()).join("");
    };

    return (
        <div className="bg-white flex justify-between items-center p-4 shadow-md">
            {/* Left Side (Logo and Navigation) */}
            <div className="flex items-center space-x-4">
                <h1 className="text-3xl font-bold text-gray-800">{name}</h1>
            </div>

            {/* Right Side (Profile, Notifications) */}
            <div className="flex items-center space-x-6">
                {/* Notification Bell */}
                <div className="relative">
                    <button
                        className="relative p-2"
                        onClick={() => setShowDropdown(!showDropdown)}
                    >
                        <FiBell className="text-2xl text-gray-800" />
                        {notifications.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                {notifications.length}
                            </span>
                        )}
                    </button>

                    {/* Notification Dropdown */}
                    {showDropdown && (
                        <div
                            className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-4"
                            onMouseEnter={() => setShowDropdown(true)}
                            onMouseLeave={() => setShowDropdown(false)}
                        >
                            <div className="flex justify-between items-center">
                                <h3 className="font-bold mb-2">Notifications</h3>
                                {notifications.length > 0 && (
                                    <FaCheck
                                        className="text-green-500 cursor-pointer"
                                        title="Mark all as read"
                                        onClick={handleMarkAllRead}
                                    />
                                )}
                            </div>
                            {notifications.length > 0 ? (
                                <ul>
                                    {notifications.map((notification) => (
                                        <li
                                            key={notification.id}
                                            className="text-sm mb-2 border-b pb-2 cursor-pointer"
                                            onClick={() => handleNotificationClick(notification.id)}
                                        >
                                            {notification.message}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-500">No notifications</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Profile Icon with User Initials */}
                <div className="relative">
                    <button
                        onClick={() => setShowProfile(!showProfile)}
                        className="flex items-center space-x-2"
                    >
                        <div className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full">
                            {getInitials(userName)}
                        </div>
                    </button>

                    {/* Profile Dropdown */}
                    {showProfile && (
                        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg p-4">
                            <p className="font-bold">{userName}</p>
                            <button
                                onClick={() => {
                                    localStorage.removeItem("token");
                                    navigate("/login");
                                }}
                                className="mt-4 w-full bg-red-500 text-white p-2 rounded"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
