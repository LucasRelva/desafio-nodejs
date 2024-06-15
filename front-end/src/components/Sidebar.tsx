import React from 'react';

interface Project {
    id: number;
    name: string;
    taskCount: number;
}

interface SidebarProps {
    projects: Project[];
}

const Sidebar: React.FC<SidebarProps> = ({ projects }) => {
    return (
        <div className="sidebar">
            <h2>João Marcos</h2>
            <ul>
                {projects.map(project => (
                    <li key={project.id}>
                        {project.name} <span>{project.taskCount}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
