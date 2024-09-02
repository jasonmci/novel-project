import React, { useState } from 'react';
import Task from './Task';
import TaskForm from './TaskForm';
import { generateWBS } from '../utils/wbsUtils';

export interface TaskType {
  id: number;
  name: string;
  estimate: number;
  subtasks?: TaskType[];
  parentId?: number | null;
  wbs?: string;  // Add 'wbs' as an optional property
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<TaskType[]>([
    { id: 1, name: 'Outline Plot', estimate: 3, subtasks: [] },
    { id: 2, name: 'Develop Characters', estimate: 5, subtasks: [] },
    { id: 3, name: 'Generate a theme', estimate: 4, subtasks: [] },
  ]);

  const [editingTask, setEditingTask] = useState<TaskType | null>(null);  // Track the task being edited

  const handleEdit = (id: number) => {
    console.log('Edit button clicked for task ID:', id);
    const taskToEdit = findTaskById(tasks, id);
    if (taskToEdit) {
      console.log('Found task to edit:', taskToEdit);
      setEditingTask(taskToEdit);
    }
  };
  

  const handleDelete = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  }

  const updateTask = (updatedTask: TaskType) => {
    setTasks(updateTaskInList(tasks, updatedTask));
    setEditingTask(null);
  };

  const findTaskById = (tasks: TaskType[], id: number): TaskType | undefined => {
    for (const task of tasks) {
      if (task.id === id) {
        console.log('Found task:', task);
        return task;
      }
      if (task.subtasks) {
        const found = findTaskById(task.subtasks, id);
        if (found) {
          console.log('Found subtask:', found);
          return found;
        }
      }
    }
  };
  
  

  const deleteTaskById = (tasks: TaskType[], id: number): TaskType[] => {
    return tasks.filter(task => task.id !== id)
      .map(task => ({
        ...task,
        subtasks: task.subtasks ? deleteTaskById(task.subtasks, id) : [],
      }));
  };

  const updateTaskInList = (tasks: TaskType[], updatedTask: TaskType): TaskType[] => {
    return tasks.map(task =>
      task.id === updatedTask.id
        ? updatedTask
        : {
            ...task,
            subtasks: task.subtasks ? updateTaskInList(task.subtasks, updatedTask) : [],
          }
    );
  };

  const renderTasks = (tasks: TaskType[], parentWBS = '') => {
    return tasks.map((task, index) => {
      const wbs = `${parentWBS}${index + 1}`;
      return (
        <div key={task.id}>
          <Task
            id={task.id}
            name={`${wbs}. ${task.name}`}
            estimate={task.estimate}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          {task.subtasks && renderTasks(task.subtasks, `${wbs}.`)}
        </div>
      );
    });
  };

  // Use generateWBS function before rendering tasks
  const tasksWithWBS = generateWBS(tasks);

  return (
    <div>
      <h2>Tasks</h2>
      <TaskForm
        setTasks={setTasks}
        tasks={tasksWithWBS}  // Pass tasksWithWBS here
        editingTask={editingTask}
        updateTask={updateTask}
      />
      {renderTasks(tasksWithWBS)}
    </div>
  );
};

export default TaskList;
