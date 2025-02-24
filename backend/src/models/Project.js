import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ['pending', 'inProgress', 'completed'], default: "pending" },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assignedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
    deadline: { type: Date },
}, { timestamps: true });

export default mongoose.model("Project", projectSchema);
