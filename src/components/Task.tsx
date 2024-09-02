import React from 'react';

interface TaskProps {
  id: number;
  name: string;
  estimate: number;
  description?: string;
  plotNotes?: string;
  characterNotes?: string;
  themeNotes?: string;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const Task: React.FC<TaskProps> = ({ 
  id, 
  name,
  estimate,
  description,
  plotNotes,
  characterNotes,
  themeNotes,
  onEdit,
  onDelete }) => {
  return (
    <div>
      <h3>{name}</h3>
      <p>Estimate: {estimate} pomodoros</p>
      {description && <p><strong>Description:</strong> {description}</p>}
      {plotNotes && <p><strong>Plot Notes:</strong> {plotNotes}</p>}
      {characterNotes && <p><strong>Character Notes:</strong> {characterNotes}</p>}
      {themeNotes && <p><strong>Theme Notes:</strong> {themeNotes}</p>}
      <button onClick={() => onEdit(id)}>Edit</button>
      <button onClick={() => onDelete(id)}>Delete</button>
    </div>
  );
};

export default Task;
