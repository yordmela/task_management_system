import Notification from "../models/Notification.js";
export const getNotifications= async (req,res)=>{
    try {
        const userId = req.user.id; // Get user from the request (authenticated user)

        // Fetch notifications for the user, sorted by createdAt in descending order
        const notifications = await Notification.find({ user: userId })
            .sort({ createdAt: -1 }); // Sort notifications by newest first

        if (!notifications) {
            return res.status(404).json({ message: "No notifications found" });
        }

        res.status(200).json({ notifications });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}


export const markNotificationAsRead = async (req, res) => {
    try {
        const notificationId = req.params.id;  // Assuming notification ID is passed as a URL parameter

        // Find the notification by its ID
        const notification = await Notification.findById(notificationId);

        // If the notification doesn't exist
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        // Mark the notification as read
        notification.read = true;
        
        // Save the updated notification
        await notification.save();

        // Respond with the updated notification
        res.status(200).json({ message: "Notification marked as read", notification });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
