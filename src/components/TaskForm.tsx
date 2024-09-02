import React, { useState, useEffect } from 'react';

interface TaskFormProps {
  tasks: { id: number; name: string; estimate: number }[];
  setTasks: React.Dispatch<React.SetStateAction<{ id: number; name: string; estimate: number }[]>>;
  editingTask: { id: number; name: string; estimate: number } | null;
  updateTask: (task: { id: number; name: string; estimate: number }) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ tasks, setTasks, editingTask, updateTask }) => {
  const [name, setName] = useState('');
  const [estimate, setEstimate] = useState(1);

  useEffect(() => {
    if (editingTask) {
      setName(editingTask.name);
      setEstimate(editingTask.estimate);
    }
  }, [editingTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingTask) {
      // Update existing task
      updateTask({ id: editingTask.id, name, estimate });
    } else {
      // Add new task
      const newTask = {
        id: tasks.length + 1,
        name,
        estimate,
      };
      setTasks([...tasks, newTask]);
    }

    // Clear form fields
    setName('');
    setEstimate(1);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="taskName">Task Name:</label>
        <input
          id="taskName"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="estimate">Estimate (Pomodoros):</label>
        <input
          id="estimate"
          type="number"
          value={estimate}
          onChange={(e) => setEstimate(Number(e.target.value))}
          required
        />
      </div>
      <button type="submit">
        {editingTask ? 'Update Task' : 'Add Task'}
      </button>
    </form>
  );
};

export default TaskForm;
