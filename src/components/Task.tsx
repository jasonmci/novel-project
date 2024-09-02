import React from 'react';

interface TaskProps {
  id: number;
  name: string;
  estimate: number;
  onEdit: (id: number) => void;  // New prop to handle edit
  onDelete: (id: number) => void;  // New prop to handle delete
}

const Task: React.FC<TaskProps> = ({ id, name, estimate, onEdit, onDelete }) => {
  return (
    <div>
      <h3>{name}</h3>
      <p>Estimate: {estimate} pomodoros</p>
      <button onClick={() => onEdit(id)}>Edit</button>
      <button onClick={() => onDelete(id)}>Delete</button>
    </div>
  );
};

export default Task;
