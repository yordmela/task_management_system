import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date, required: true },
    status: { 
      type: String, 
      enum: ['pending', 'inProgress', 'completed'], 
      default: 'pending' 
    },
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // User assigned to this task
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // User who assigned the task
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' ,required: true}, // The project this task belongs to
    team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' }, // The team this task is part of
  },
  { timestamps: true }
);

const Task = mongoose.model('Task', taskSchema);

export default Task;
