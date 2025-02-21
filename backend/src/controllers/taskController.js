import Task from "../models/Task.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import mongoose from "mongoose";
import Project from "../models/Project.js";

export const createTask = async (req, res) => {

    try {
        const { title, description, dueDate, assignedTo, assignedBy, project, team } = req.body;
        const userId = req.user.id;
        const userRole = req.user.role;

        if (!Array.isArray(assignedTo) || assignedTo.length === 0) {
            return res.status(400).json({ message: "At least one user must be assigned to the task" });
        }


        /// Validate project
        const projectData = await Project.findById(project);
        if (!projectData) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Add assigned users to project if they are not already included
        for (const user of assignedTo) {
            if (!projectData.assignedUsers.includes(user)) {
                projectData.assignedUsers.push(user);  // Add user to project if not already assigned
            }
        }
        await projectData.save(); // Save updated project with assigned users


        if (userRole !== 'admin' && userRole !== 'projectManager') {
            return res.status(403).json({ message: "Permission denied. You need to be an admin or project manager to create a project." });
        }

        const newTask = await Task.create({ title, description, dueDate, assignedTo, assignedBy: userId, project, team });


        // Notify each assigned user about the new task
        await Promise.all(assignedTo.map(async (userId) => {
            const userToNotify = await User.findById(userId);
            if (userToNotify) {
                const notification = new Notification({
                    user: userId, // Each user gets their own notification
                    message: `You have been assigned a new task: ${title}`,
                    task: newTask._id,
                });
                await notification.save(); // Save the notification
            } else {
                console.log(`User with ID ${userId} not found. No notification sent.`);
            }
        }));




        res.status(201).json({ message: "Task created successfully", task: newTask })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }

}
export const getTasksForUser = async (req, res) => {
    try {
        const userId = req.user.id; // Get user ID from the authenticated request
        console.log(userId);
        // Fetch tasks assigned to the user, sorted by dueDate or createdAt
        const tasks = await Task.find({ assignedTo: userId }).sort({ dueDate: 1 }); // Sorting by dueDate (ascending)
        console.log(tasks)
        if (!tasks || tasks.length === 0) {
            return res.status(404).json({ message: "No tasks found for this user" });
        }


        res.status(200).json({ tasks });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}


export const getTasksForProject = async (req, res) => {
    try {
        const projectId = req.params.id;

        // Validate if projectId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({ message: "Invalid project ID format" });
        }

        const tasks = await Task.find({ project: projectId });

        if (!tasks || tasks.length === 0) {
            return res.status(404).json({ message: "No tasks found for this project" });
        }

        res.status(200).json({ tasks });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


export const updateTask = async (req, res) => {
    try {
        const taskId = req.params.id;

        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ message: "This task is not found" });
        }

        const originalTask = { ...task._doc };

        task.title = req.body.title || task.title;
        task.description = req.body.description || task.description;
        task.dueDate = req.body.dueDate || task.dueDate;
        task.assignedTo = req.body.assignedTo || task.assignedTo;
        task.assignedBy = req.body.assignedBy || task.assignedBy;
        task.project = req.body.project || task.project;
        task.team = req.body.team || task.team;

        await task.save();

        // Notify the assigned user if their task has been updated
        if (task.assignedTo !== originalTask.assignedTo || task.dueDate !== originalTask.dueDate || task.title !== originalTask.title) {
            const notificationMessage = `Your task "${task.title}" has been updated. Please check it for new details.`;
            const notification = new Notification({
                user: task.assignedTo, // Notify the assigned user
                message: notificationMessage,
                task: task._id,
            });
            await notification.save(); // Save notification
        }


        res.status(200).json({ message: "successfully updated", task })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const deleteTask = async (req, res) => {
    try {
        const taskId = req.params.id;

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: "Task not found" })
        }

        // Notify the assigned user about task deletion (optional)
        const notificationMessage = `The task "${task.title}" has been deleted.`;
        const notification = new Notification({
            user: task.assignedTo, // Notify the assigned user
            message: notificationMessage,
            task: task._id,
        });
        await notification.save(); // Save notification

        await task.deleteOne();
        res.status(204).json({ message: "successfully deleted" })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}