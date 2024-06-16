import React, { useState } from 'react';
import './styles/TaskCard.css';
import { Task } from '../services/taskService.ts';

interface TaskCardProps {
  task: Task;
  onUpdateStatus: (taskId: number, newStatus: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdateStatus }) => {
  const [selectedStatus, setSelectedStatus] = useState(task.status);

  const formatDate = (createdAt: string) => {
    const date = new Date(createdAt);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    return `${day} ${month}`;
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setSelectedStatus(newStatus);
    onUpdateStatus(task.id, newStatus);
  };

  const generateRandomColor = (): string => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16); // Generate random hexadecimal number
    return `#${randomColor}`;
  };

  return (
    <div className="task-card">
      <div className="title">{task.title}</div>
      <div className="created-at">{formatDate(task.createdAt)}</div>
      <div className="description">{task.description}</div>
      <div className="tags">
        {task.tags.map((tag: any) => (
          <span key={tag.id} className="tag" style={{ backgroundColor: generateRandomColor() }}>
            {tag.title}
          </span>
        ))}
      </div>
      <div className="assignees">
        {task.assignees.map((assignee: any) => (
          <span key={assignee.id} className="assignee">
            {assignee.name.split(' ')[0]} -
          </span>
        ))}
      </div>
      {task.status != 'COMPLETED' && (
        <div className="status-dropdown">
          <label htmlFor={`status-${task.id}`}></label>
          <select id={`status-${task.id}`} value={selectedStatus} onChange={handleStatusChange}>
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
