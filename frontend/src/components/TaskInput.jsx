import React from "react";

const TaskInput = ({ task, onChange, onRemove }) => {
  return (
    <div className="p-3 border border-gray-300 rounded-lg relative">
      <button
        onClick={onRemove}
        className="absolute top-1 right-1 text-red-500 hover:text-red-700"
      >
        ✖
      </button>
      <input
        type="text"
        placeholder="Task Title"
        value={task.title}
        onChange={(e) => onChange("title", e.target.value)}
        className="p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <textarea
        placeholder="Task Description"
        value={task.description}
        onChange={(e) => onChange("description", e.target.value)}
        className="p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
      />
      <input
        type="date"
        value={task.dueDate}
        onChange={(e) => onChange("dueDate", e.target.value)}
        className="p-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
      />
    </div>
  );
};

export default TaskInput;
