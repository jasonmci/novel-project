// src/utils/wbsUtils.ts

import { TaskType } from '../components/TaskList';  // Import TaskType

// Function to generate WBS numbers for tasks and subtasks
export const generateWBS = (tasks: TaskType[], parentWBS = ''): TaskType[] => {
  return tasks.map((task, index) => {
    const wbs = `${parentWBS}${index + 1}`;
    const updatedTask: TaskType = {
      ...task,
      wbs,
      subtasks: task.subtasks ? generateWBS(task.subtasks, `${wbs}.`) : [],
    };
    return updatedTask;
  });
};
