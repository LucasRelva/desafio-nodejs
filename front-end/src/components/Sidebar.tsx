import React from 'react';
import { Link } from 'react-router-dom';
import { Task } from '../services/taskService.ts';

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
}

import projectIcon from '../assets/project-icon.svg';

const Sidebar: React.FC<SidebarProps> = ({ userName, projects, onProjectSelect }) => {
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
                {project.name} -- ( {project.tasks.length} )
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="new-project-button">
        <Link to="/new-project" className="button">
          New Project
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
