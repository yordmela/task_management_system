import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assignedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }], // Reference to tasks
    deadline: { type: Date },
}, { timestamps: true });

export default mongoose.model("Project", projectSchema);
