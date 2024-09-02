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
  description?: string;  // Prompt (Description)
  plotNotes?: string;
  characterNotes?: string;
  themeNotes?: string;
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<TaskType[]>([
    { id: 1, name: 'Outline Plot', estimate: 3, subtasks: [] },
    { id: 2, name: 'Develop Characters', estimate: 5, subtasks: [] },
    { id: 3, name: 'Generate a theme', estimate: 4, subtasks: [] },
  ]);

  const [editingTask, setEditingTask] = useState<TaskType | null>(null);
  const [addingSubtaskTo, setAddingSubtaskTo] = useState<number | null>(null);
  const [nextId, setNextId] = useState<number>(tasks.length + 1); // Track the next available ID

  const handleEdit = (id: number) => {
    const taskToEdit = findTaskById(tasks, id);
    if (taskToEdit) {
      setEditingTask(taskToEdit);
    }
  };

  const handleDelete = (id: number) => {
    setTasks(deleteTaskById(tasks, id));
  };

  const updateTask = (updatedTask: TaskType) => {
    setTasks(updateTaskInList(tasks, updatedTask));
    setEditingTask(null);
  };

  const findTaskById = (tasks: TaskType[], id: number): TaskType | undefined => {
    for (const task of tasks) {
      if (task.id === id) return task;
      if (task.subtasks) {
        const found = findTaskById(task.subtasks, id);
        if (found) return found;
      }
    }
  };

  const deleteTaskById = (tasks: TaskType[], id: number): TaskType[] => {
    return tasks
      .filter(task => task.id !== id)
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

  const addSubtask = (
    parentId: number, 
    name: string, 
    estimate: number,
    description?: string,
    plotNotes?: string,
    characterNotes?: string,
    themeNotes?: string
  ) => {
    const newSubtask: TaskType = {
      id: nextId,
      name,
      estimate,
      description,
      plotNotes,
      characterNotes,
      themeNotes,
      parentId,
      subtasks: [],
    };
    setNextId(nextId + 1); // Increment the next ID

    const updatedTasks = tasks.map(task =>
      task.id === parentId
        ? { ...task, subtasks: [...(task.subtasks || []), newSubtask] }
        : {
            ...task,
            subtasks: task.subtasks ? addSubtaskInTree(task.subtasks, parentId, newSubtask) : [],
          }
    );
    setTasks(updatedTasks);
  };

  const addSubtaskInTree = (subtasks: TaskType[], parentId: number, newTask: TaskType): TaskType[] => {
    return subtasks.map(task =>
      task.id === parentId
        ? { ...task, subtasks: [...(task.subtasks || []), newTask] }
        : { ...task, subtasks: task.subtasks ? addSubtaskInTree(task.subtasks, parentId, newTask) : [] }
    );
  };

  const renderTasks = (tasks: TaskType[], parentWBS = '') => {
    return tasks.map((task, index) => {
      const wbs = `${parentWBS}${index + 1}`;
      return (
        <div key={task.id} style={{ marginLeft: parentWBS ? '20px' : '0px' }}>
          <Task
            id={task.id}
            name={`${wbs}. ${task.name}`}
            estimate={task.estimate}
            description={task.description}
            plotNotes={task.plotNotes}
            characterNotes={task.characterNotes}
            themeNotes={task.themeNotes}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          <button onClick={() => setAddingSubtaskTo(task.id)}>Add Subtask</button>
          {addingSubtaskTo === task.id && (
            <TaskForm
              setTasks={setTasks}
              tasks={tasks}
              editingTask={null}
              updateTask={updateTask}
              parentId={task.id} // Pass the parentId to add a subtask
              addSubtask={addSubtask} // Pass the addSubtask function
              formId={`subtask-${task.id}`}  // Unique form ID for subtasks
            />
          )}
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
        tasks={tasksWithWBS}
        editingTask={editingTask}
        updateTask={updateTask}
        formId={`topLevel`}  // Unique form ID for top-level tasks
      />
      {renderTasks(tasksWithWBS)}
    </div>
  );
};

export default TaskList;
