import Project from "../models/Project.js";

export const createProject = async (req, res) => {
    try {
        const { title, description, status, team, assignedBy,assignedUsers, tasks, deadline } = req.body;
        const userId = req.user.id;
        const userRole = req.user.role;

        if (userRole !== 'admin' && userRole !== 'projectManager') {
            return res.status(403).json({ message: "Permission denied. You need to be an admin or project manager to create a project." });
        }

        const newProject = await Project.create({ title, description, status, team, assignedBy: userId, assignedUsers,tasks, deadline });

        const createdTasks = [];

        // Check if tasks are provided in the request
        if (tasks && tasks.length > 0) {
            // If tasks are provided, create them and associate with the project
            const taskPromises = tasks.map(taskData => {
                return Task.create({
                    ...taskData,
                    projectId: newProject._id,
                });
            });

            createdTasks = await Promise.all(taskPromises);

            // Update the project with the task references
            newProject.tasks = createdTasks.map(task => task._id);
            await newProject.save();
        };

        res.status(201).json({ message: "Project created successfully", project: newProject, tasks: createdTasks })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

export const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find();

        if (!projects.length) {
            return res.status(404).json({ message: "No projects found" });
        }

        res.status(200).json({ message: "here are all projects", projects })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}

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
        const projectId = req.params.id;

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        project.title = req.body.title || project.title;
        project.description = req.body.description || project.description;
        project.status = req.body.status || project.status;
        project.team = req.body.team || project.team;
        project.assignedBy = req.body.assignedBy || project.assignedBy;
        project.tasks = req.body.tasks || project.tasks;
        project.deadline = req.body.deadline || project.deadline;

        await project.save();
        res.status(201).json({ message: "successfully updated", project })
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message })
    }
}
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

