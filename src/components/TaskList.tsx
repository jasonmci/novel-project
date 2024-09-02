import React, { useState } from 'react';
import Task from './Task';
import TaskForm from './TaskForm';
import { generateWBS } from '../utils/wbsUtils';
const [inlineEditTaskId, setInlineEditTaskId] = useState<number | null>(null);


export interface TaskType {
  id: number;
  name: string;
  estimate: number;
  subtasks?: TaskType[];
  description?: string;  // Prompt (Description)
  plotNotes?: string;
  characterNotes?: string;
  themeNotes?: string;
  parentId?: number | null;
  wbs?: string;  // Add 'wbs' as an optional property
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

  const renderTaskRows = (tasks: TaskType[], parentWBS = '', indentLevel = 0) => {
    return tasks.map((task, index) => {
      const wbs = `${parentWBS}${index + 1}`;
      return (
        <React.Fragment key={task.id}>
          <tr>
            <td style={{ paddingLeft: `${indentLevel * 20}px` }}>{wbs}</td>
            <td>{task.name}</td>
            <td>{task.description}</td>
            <td>{task.plotNotes}</td>
            <td>{task.characterNotes}</td>
            <td>{task.themeNotes}</td>
            <td>
              <button onClick={() => handleEdit(task.id)}>Edit</button>
              <button onClick={() => handleDelete(task.id)}>Delete</button>
              <button onClick={() => setAddingSubtaskTo(task.id)}>Add Subtask</button>
            </td>
          </tr>
          {addingSubtaskTo === task.id && (
            <tr>
              <td colSpan={7}>
                <TaskForm
                  setTasks={setTasks}
                  tasks={tasks}
                  editingTask={null}
                  updateTask={updateTask}
                  parentId={task.id}
                  addSubtask={addSubtask}
                  formId={`subtask-${task.id}`}
                />
              </td>
            </tr>
          )}
          {task.subtasks && renderTaskRows(task.subtasks, `${wbs}.`, indentLevel + 1)}
        </React.Fragment>
      );
    });
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
        formId={`topLevel`}
      />
      <table cellPadding="5" cellSpacing="0" border={1}>

        <thead>
          <tr>
            <th>WBS</th>
            <th>Task Name</th>
            <th>Description</th>
            <th>Plot Notes</th>
            <th>Character Notes</th>
            <th>Theme Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{renderTaskRows(tasksWithWBS)}</tbody>
      </table>
    </div>
  );
};

export default TaskList;
