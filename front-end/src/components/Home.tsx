import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import './styles/Home.css';
import { fetchUser } from '../services/userService.ts';
import { useNavigate } from 'react-router-dom';
import { fetchProjects } from '../services/taskService.ts';

const Home = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [projects, setProjects] = useState<any[]>([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserName();
    listProjects();
  }, []);

  const fetchUserName = async () => {
    try {
      const userId = sessionStorage.getItem('userId');

      if (!userId) {
        navigate('/login')
        return
      }

      const response = await fetchUser(userId);
      setUserName(response.name)

    } catch (error) {
      setError('Invalid email or password. Please try again.');
    }
  };

  const listProjects = async () => {
    try {
      const userId = sessionStorage.getItem('userId');

      if (!userId) {
        navigate('/login')
        return
      }

      const response = await fetchProjects(1, 1000, userId);
      setProjects(response.projects);

    } catch (error) {
      setError('Error fetching projects');
    }
  };

  const handleProjectSelect = (projectId: number) => {
    setSelectedProjectId(projectId);
  };

  return (
    <div className="home-page">
      <Sidebar userName={userName} projects={projects} onProjectSelect={handleProjectSelect} />
      <div className="content">
        {selectedProjectId && <h2>Tasks for Project {selectedProjectId}</h2>}
        <p>This is the main content area.</p>
      </div>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Home;
