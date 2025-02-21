import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to user
    message: { type: String, required: true }, // The message content
    read: { type: Boolean, default: false }, // If the user has read it
    createdAt: { type: Date, default: Date.now }, // When the notification was created
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' }, // Task related to this notification
  });
  
export default  mongoose.model('Notification', notificationSchema);
  
