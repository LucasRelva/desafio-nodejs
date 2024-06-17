import React from 'react';
import { Task } from '../services/taskService.ts';
import projectIcon from '../assets/project-icon.svg';

interface Project {
  id: number;
  name: string;
  description: string;
  creatorId: number;
  tasks: Task[];
}

interface SidebarProps {
  userName: string;
  projects: Project[];
  onProjectSelect: (projectId: number) => void;
  onOpenModal: () => void; // Function to open modal
}

const Sidebar: React.FC<SidebarProps> = ({ userName, projects, onProjectSelect, onOpenModal }) => {
  return (
    <div className="sidebar">
      <div className="user-info">
        <h3>{userName}</h3>
      </div>
      <div className="project-list">
        <h4>Projects</h4>
        <ul>
          {projects.map(project => (
            <li key={project.id}>
              <button onClick={() => onProjectSelect(project.id)}>
                <img src={projectIcon} alt={project.name} />
                {project.name}
                <span>
                  {project.tasks.length}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="new-project-button">
        <button onClick={onOpenModal} className="button">
          New Project
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
