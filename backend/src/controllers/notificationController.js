import Notification from "../models/Notification.js";
export const getNotifications= async (req,res)=>{
    try {
        const userId = req.user.id; // Get user from the request (authenticated user)

        // Fetch notifications for the user, sorted by createdAt in descending order
        const notifications = await Notification.find({ user: userId , read: false})
            .sort({ createdAt: -1 }); // Sort notifications by newest first

        if (!notifications) {
            return res.status(404).json({ message: "No notifications found" });
        }

        res.status(200).json({ notifications });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}


export const markAllNotificationsAsRead = async (req, res) => {
    try {
        console.log("i made it to markAllNotificationsAsRead ")
        const userId = req.user.id; // Extract user ID from the authenticated token

        // Find all unread notifications for this user
        const notifications = await Notification.find({ user:userId, read: false });
        console.log(notifications)

        if (notifications.length === 0) {
            return res.status(200).json({ message: "No unread notifications" });
        }

        // Mark all as read
        await Notification.updateMany({ user:userId, read: false }, { $set: { read: true } });

        res.status(200).json({ message: "All notifications marked as read" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

