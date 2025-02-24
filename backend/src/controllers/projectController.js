import Project from "../models/Project.js";
import Task from "../models/Task.js";
import User from "../models/User.js";
import Notification from '../models/Notification.js'; // Assuming you have a Notification model

export const createProject = async (req, res) => {
    console.log(req.body.projectData);
    try {
        const { title, description, status, assignedBy, assignedUsers, tasks, deadline } = req.body.projectData;
        const userId = req.user.id;

        // Find assigned user IDs based on email
        const assignedUserIds = await User.find({ email: { $in: assignedUsers } }).select('_id');
        
        // Check if all users are found
        if (assignedUserIds.length !== assignedUsers.length) {
            return res.status(404).json({ message: "One or more assigned users not found in the database" });
        }
        

        const assignedUserIdsList = assignedUserIds.map(user => user._id);
        console.log(assignedUserIdsList)
        // Create new project
        const newProject = await Project.create({
            title,
            description,
            status,
            assignedBy: userId,
            assignedUsers: assignedUserIdsList, // Use user IDs
            tasks: [], // Empty initially
            deadline,
        });

        // Create tasks and collect task IDs
        let taskIds = [];
        if (tasks && tasks.length > 0) {
            taskIds = await Promise.all(
                tasks.map(async (task) => {
                    const newTask = new Task({ ...task, project: newProject._id }); // Ensure project ID is included
                    await newTask.save();

                    // Create notifications for each assigned user about the new task
                    assignedUserIds.forEach(async (assignedUserId) => {
                        const notificationMessage = `New task "${task.title}" has been assigned to the project "${title}".`;
                        
                        const notification = new Notification({
                            user: assignedUserId, // Notify each assigned user
                            message: notificationMessage,
                            read: false, // You can set it to 'unread' or other statuses
                        });

                        await notification.save(); // Save the notification to the database
                    });

                    return newTask._id;
                })
            );
        }

        // Update project with task IDs
        newProject.tasks = taskIds;
        await newProject.save();

        res.status(201).json({
            message: "Project created successfully",
            project: newProject,
            tasks: taskIds.length > 0 ? taskIds : "No tasks provided",
        });
    } catch (error) {
        console.log("Error in creating project", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};





export const getAllProjects = async (req, res) => {
    try {
        const userId = req.user._id;  // Assuming the user's ID is available via the request object (e.g., through authentication middleware)

        // Fetch projects where the user is either the one who assigned the project or is assigned to a task in the project
        const projects = await Project.find({
            $or: [
                { assignedBy: userId },  // Projects assigned by this user
                { assignedUsers: userId },  // Projects the user is involved in (assigned to a task)
            ]
        })
        .populate('assignedUsers', 'email') // Populate with the 'email' field of the assigned users

        if (!projects.length) {
            return res.status(404).json({ message: "No projects found for this user" });
        }

        res.status(200).json({ message: "Here are your projects", projects });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


export const getProjects = async (req, res) => {
    try {
        const projectId = req.params.id;

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.status(200).json({ message: "here is the project", project })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }

}

export const updateProject = async (req, res) => {
    try {
        console.log(req.body);
        const projectId = req.params.id;
        console.log(projectId);

        // Find the project
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // // Validate incoming data
        // if (req.body.title && typeof req.body.title !== "string") {
        //     return res.status(400).json({ message: "Invalid title" });
        // }
        // if (req.body.description && typeof req.body.description !== "string") {
        //     return res.status(400).json({ message: "Invalid description" });
        // }
        // if (req.body.status && typeof req.body.status !== "string") {
        //     return res.status(400).json({ message: "Invalid status" });
        // }
        // if (req.body.assignedUsers && !Array.isArray(req.body.assignedUsers)) {
        //     return res.status(400).json({ message: "Invalid assignedUsers" });
        // }
        // if (req.body.deadline && isNaN(Date.parse(req.body.deadline))) {
        //     return res.status(400).json({ message: "Invalid deadline" });
        // }

        // Convert emails to user IDs
        if (req.body.assignedUsers) {
            const emailList = req.body.assignedUsers;

            // Find users by their emails
            const users = await User.find({ email: { $in: emailList } }).select("_id email");
           console.log(users)
            // Check if all emails are valid
            const existingEmails = users.map(user => user.email);
            const invalidEmails = emailList.filter(email => !existingEmails.includes(email));

            console.log("Invalid emails:", invalidEmails); // Debug invalid emails

            if (invalidEmails.length > 0) {
                return res.status(400).json({ message: `Invalid email(s): ${invalidEmails.join(", ")}` });
            }

            // Replace emails with corresponding user IDs
            project.assignedUsers = users.map(user => user._id);
        }

        // Update project fields
        project.title = req.body.title || project.title;
        project.description = req.body.description || project.description;
        project.status = req.body.status || project.status;
        project.deadline = req.body.deadline || project.deadline;
        project.progress = req.body.progress || project.progress; // Add this if needed

        // Save the updated project
        await project.save();

        // Send success response
        res.status(200).json({ message: "Project updated successfully", project });
    } catch (error) {
        console.error("Error updating project:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


export const deleteProject = async (req, res) => {
    try {
        const projectId = req.params.id;
        
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" })
        }

        await project.deleteOne();
        res.status(204).json({ message: "successfully deleted" })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }

}

