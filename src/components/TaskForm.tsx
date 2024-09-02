import React, { useState, useEffect } from 'react';
import { TaskType } from '../components/TaskList';  // Import TaskType

interface TaskFormProps {
  tasks: TaskType[];
  setTasks: React.Dispatch<React.SetStateAction<TaskType[]>>;
  editingTask: TaskType | null;
  updateTask: (task: TaskType) => void;
  parentId?: number | null;  // New prop for adding subtasks
}

const TaskForm: React.FC<TaskFormProps> = ({
  tasks,
  setTasks,
  editingTask,
  updateTask,
  parentId = null,
}) => {
  const [name, setName] = useState('');
  const [estimate, setEstimate] = useState(1);

  useEffect(() => {
    if (editingTask) {
      console.log('Populating form with task:', editingTask);
      setName(editingTask.name);
      setEstimate(editingTask.estimate);
    }
  }, [editingTask]);
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingTask) {
      // Update existing task
      updateTask({ ...editingTask, name, estimate });
    } else {
      // Add new task or subtask
      const newTask: TaskType = {
        id: tasks.length + 1,
        name,
        estimate,
        parentId,
        subtasks: [],
      };
      
      if (parentId) {
        // Find the parent task and add the subtask
        const updatedTasks = tasks.map(task =>
          task.id === parentId
            ? { ...task, subtasks: [...(task.subtasks || []), newTask] }
            : task
        );
        setTasks(updatedTasks);
      } else {
        setTasks([...tasks, newTask]);
      }
    }

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
        {editingTask ? 'Update Task' : parentId ? 'Add Subtask' : 'Add Task'}
      </button>
    </form>
  );
};

export default TaskForm;
