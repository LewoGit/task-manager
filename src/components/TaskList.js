import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("General");
  const [selectedPriority, setSelectedPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [filter, setFilter] = useState("All");
  const [darkMode, setDarkMode] = useState(false);

  // Add Task
  const handleAddTask = () => {
    if (!inputValue.trim()) return;

    const newTask = {
      id: Date.now(),
      text: inputValue,
      category: selectedCategory,
      priority: selectedPriority,
      dueDate: dueDate || null,
    };

    const updated = [...tasks, newTask];
    setTasks(sortTasks(updated));
    setInputValue("");
    setDueDate("");
  };

  // Delete Task
  const handleDeleteTask = (id) => {
    setTasks(sortTasks(tasks.filter((task) => task.id !== id)));
  };

  // Sorting: by date then priority
  const sortTasks = (arr) => {
    const order = { High: 1, Medium: 2, Low: 3 };
    return arr.sort((a, b) => {
      // 1. Sort by date if both have dates
      if (a.dueDate && b.dueDate) return new Date(a.dueDate) - new Date(b.dueDate);

      // 2. Tasks with due dates come first
      if (a.dueDate && !b.dueDate) return -1;
      if (!a.dueDate && b.dueDate) return 1;

      // 3. Sort by priority
      return order[a.priority] - order[b.priority];
    });
  };

  // Drag & Drop reorder
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reordered = Array.from(tasks);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    setTasks(sortTasks(reordered));
  };

  // Priority badge colors
  const priorityColors = {
    High: "bg-red-300 text-red-800",
    Medium: "bg-yellow-300 text-yellow-900",
    Low: "bg-green-300 text-green-900",
  };

  // Calculate remaining days / overdue
  const getDueText = (date) => {
    if (!date) return "";
    const today = new Date();
    const due = new Date(date);
    const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

    if (diff < 0) return "Overdue";
    if (diff === 0) return "Due Today";
    if (diff === 1) return "Due Tomorrow";
    return `Due in ${diff} days`;
  };

  return (
    <div
      className={`w-full max-w-md rounded-xl shadow-lg p-5 transition-colors ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold flex-grow text-center">Task Manager</h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="ml-2 px-3 py-1 rounded-lg border hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          {darkMode ? "Light" : "Dark"}
        </button>
      </div>

      {/* Input section */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <input
          type="text"
          value={inputValue}
          className={`flex-1 border rounded p-2 focus:outline-none focus:ring-2 ${
            darkMode ? "bg-gray-700 border-gray-600 text-white" : ""
          }`}
          placeholder="Add a task..."
          onChange={(e) => setInputValue(e.target.value)}
        />

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className={`border rounded p-2 ${
            darkMode ? "bg-gray-700 border-gray-600 text-white" : ""
          }`}
        />

        <select
          className={`border rounded p-2 ${
            darkMode ? "bg-gray-700 border-gray-600 text-white" : ""
          }`}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option>General</option>
          <option>Work</option>
          <option>Personal</option>
          <option>Study</option>
          <option>Urgent</option>
        </select>

        <select
          className={`border rounded p-2 ${
            darkMode ? "bg-gray-700 border-gray-600 text-white" : ""
          }`}
          value={selectedPriority}
          onChange={(e) => setSelectedPriority(e.target.value)}
        >
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

        <button
          onClick={handleAddTask}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 justify-center flex-wrap">
        {["All", "General", "Work", "Personal", "Study", "Urgent"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1 rounded-lg text-sm ${
              filter === cat
                ? "bg-blue-600 text-white"
                : darkMode
                ? "bg-gray-700 text-white"
                : "bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Task List */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
              {tasks
                .filter((task) => filter === "All" || task.category === filter)
                .map((task, index) => {
                  const dueText = getDueText(task.dueDate);
                  const overdue = dueText === "Overdue";

                  return (
                    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                      {(provided) => (
                        <div
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                          className={`p-3 rounded-lg shadow border cursor-move flex justify-between items-center ${
                            overdue
                              ? "bg-red-200 border-red-500"
                              : darkMode
                              ? "bg-gray-700 border-gray-600"
                              : "bg-gray-100"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span>{task.text}</span>
                            <span className="text-xs px-2 py-1 rounded bg-blue-200 text-gray-800">
                              {task.category}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded font-semibold ${priorityColors[task.priority]}`}>
                              {task.priority}
                            </span>

                            {task.dueDate && (
                              <span
                                className={`text-xs px-2 py-1 rounded ${
                                  overdue
                                    ? "bg-red-600 text-white"
                                    : "bg-orange-200 text-orange-900"
                                }`}
                              >
                                {dueText}
                              </span>
                            )}
                          </div>

                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="text-red-500 hover:text-red-700 font-semibold transition"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </Draggable>
                  );
                })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}


















