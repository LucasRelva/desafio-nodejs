import React from 'react';
import TaskCard from './TaskCard';

interface Task {
    id: number;
    title: string;
    date: string;
    creator: string;
    tags: string[];
    avatar: string;
}

interface TaskColumnProps {
    status: string;
    tasks: Task[];
}

const TaskColumn: React.FC<TaskColumnProps> = ({ status, tasks }) => {
    return (
        <div className={`task-column ${status}`}>
            <h3>{status}</h3>
            {tasks.map(task => (
                <TaskCard key={task.id} task={task} />
            ))}
        </div>
    );
};

export default TaskColumn;
