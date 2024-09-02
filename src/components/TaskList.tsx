import React, { useState } from 'react';
import Task from './Task';
import TaskForm from './TaskForm';

interface TaskType {
  id: number;
  name: string;
  estimate: number;
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<TaskType[]>([
    { id: 1, name: 'Outline Plot', estimate: 3 },
    { id: 2, name: 'Develop Characters', estimate: 5 },
    { id: 3, name: 'Generate a theme', estimate: 4 },
  ]);

  const [editingTask, setEditingTask] = useState<TaskType | null>(null);  // Track the task being edited

  const handleEdit = (id: number) => {
    const taskToEdit = tasks.find(task => task.id === id);
    if (taskToEdit) {
      setEditingTask(taskToEdit);
    }
  };

  const updateTask = (updatedTask: TaskType) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
    setEditingTask(null);
  };

  const handleDelete = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  }

  return (
    <div>
      <h2>Tasks</h2>
      <TaskForm
        setTasks={setTasks}
        tasks={tasks}
        editingTask={editingTask}
        updateTask={updateTask}
      />
      {tasks.map((task) => (
        <Task key={task.id} 
        {...task} 
        onEdit={handleEdit} 
        onDelete={handleDelete}
        />
      ))}
    </div>
  );
};

export default TaskList;
