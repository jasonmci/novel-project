import React, { useState, useEffect } from 'react';
import { TaskType } from '../components/TaskList';  // Import TaskType

interface TaskFormProps {
  tasks: TaskType[];
  setTasks: React.Dispatch<React.SetStateAction<TaskType[]>>;
  editingTask: TaskType | null;
  updateTask: (task: TaskType) => void;
  parentId?: number | null;  // Optional parentId for adding subtasks
  addSubtask?: (
    parentId: number, 
    name: string, 
    estimate: number, 
    description: string, 
    plotNotes: string, 
    characterNotes: string, 
    themeNotes: string) => void; // New prop for adding subtasks
  formId? : string;
}

const TaskForm: React.FC<TaskFormProps> = ({
  tasks,
  setTasks,
  editingTask,
  updateTask,
  parentId = null,
  addSubtask,  // Use the addSubtask function
  formId = '',
}) => {
  const [name, setName] = useState('');
  const [estimate, setEstimate] = useState(1);
  const [description, setDescription] = useState('');
  const [plotNotes, setPlotNotes] = useState('');
  const [characterNotes, setCharacterNotes] = useState('');
  const [themeNotes, setThemeNotes] = useState('');

  useEffect(() => {
    if (editingTask) {
      setName(editingTask.name);
      setEstimate(editingTask.estimate);
      setDescription(editingTask.description || '');
      setPlotNotes(editingTask.plotNotes || '');
      setCharacterNotes(editingTask.characterNotes || '');
      setThemeNotes(editingTask.themeNotes || '');
    }
  }, [editingTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newTask: TaskType = {
      id: editingTask ? editingTask.id : tasks.length + 1,
      name,
      estimate,
      description,
      plotNotes,
      characterNotes,
      themeNotes,
      parentId,
      subtasks: editingTask?.subtasks || [],
    };

    if (editingTask) {
      updateTask(newTask);
    } else if (parentId && addSubtask) {
      addSubtask(parentId, name, estimate, description, plotNotes, characterNotes, themeNotes);
    } else {
      setTasks([...tasks, newTask]);
    }

    setName('');
    setEstimate(1);
    setDescription('');
    setPlotNotes('');
    setCharacterNotes('');
    setThemeNotes('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor={`taskName-${formId}`}>
          {parentId ? 'Subtask Name:' : 'Task Name:'}
        </label>
        <input
          id={`taskName-${formId}`}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor={`estimate-${formId}`}>
          Estimate (Pomodoros):
        </label>
        <input
          id={`estimate-${formId}`}
          type="number"
          value={estimate}
          onChange={(e) => setEstimate(Number(e.target.value))}
          required
        />
      </div>
      <div>
        <label htmlFor={`description-${formId}`}>Prompt (Description):</label>
        <textarea
          id={`description-${formId}`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor={`plotNotes-${formId}`}>Plot Notes:</label>
        <textarea
          id={`plotNotes-${formId}`}
          value={plotNotes}
          onChange={(e) => setPlotNotes(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor={`characterNotes-${formId}`}>Character Notes:</label>
        <textarea
          id={`characterNotes-${formId}`}
          value={characterNotes}
          onChange={(e) => setCharacterNotes(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor={`themeNotes-${formId}`}>Theme Notes:</label>
        <textarea
          id={`themeNotes-${formId}`}
          value={themeNotes}
          onChange={(e) => setThemeNotes(e.target.value)}
        />
      </div>
      <button type="submit">
        {editingTask ? 'Update Task' : parentId ? 'Add Subtask' : 'Add Task'}
      </button>
    </form>
  );
};

export default TaskForm;
