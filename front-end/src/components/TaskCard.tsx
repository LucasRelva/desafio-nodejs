import React from 'react';

interface Task {
    id: number;
    title: string;
    date: string;
    creator: string;
    tags: string[];
    avatar: string;
}

interface TaskCardProps {
    task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
    return (
        <div className="task-card">
            <h4>{task.title}</h4>
            <p>{task.date} • Criado por {task.creator}</p>
            <div className="tags">
                {task.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                ))}
            </div>
            <img src={task.avatar} alt={task.creator} />
        </div>
    );
};

export default TaskCard;
