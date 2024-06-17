import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import NewTaskModal from './NewTaskModal';
import './styles/Home.css';
import { fetchUser } from '../services/userService.ts';
import { useNavigate } from 'react-router-dom';
import {
  createProject,
  fetchProjects,
  fetchTasksByStatus,
  Project,
  Task,
  updateTaskStatus,
} from '../services/taskService.ts';
import TaskCard from './TaskCard.tsx';

const Home = () => {
  const [userName, setUserName] = useState<string>('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(1);
  const [error, setError] = useState('');
  const [pendingTasks, setPendingTasks] = useState<Task[]>([]);
  const [inProgressTasks, setInProgressTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = sessionStorage.getItem('accessToken');
    const userId = sessionStorage.getItem('userId');

    if (!accessToken || !userId) {
      navigate('/login');
      return;
    }

    fetchUserName(userId);
    listProjects(userId);
  }, [navigate]);

  useEffect(() => {
    if (selectedProjectId) {
      fetchTasks(selectedProjectId);
    }
  }, [selectedProjectId]);

  const fetchUserName = async (userId: string) => {
    try {
      const response = await fetchUser(userId);
      setUserName(response.name);
    } catch (error) {
      setError('Error fetching user data');
    }
  };

  const listProjects = async (userId: string) => {
    try {
      const response = await fetchProjects(1, 1000, userId);
      setProjects(response.projects);
    } catch (error) {
      setError('Error fetching projects');
    }
  };

  const fetchTasks = async (projectId: number) => {
    try {
      const [pendingTasks, inProgressTasks, completedTasks] = await Promise.all([
        fetchTasksByStatus(1, 1000, projectId, 'PENDING'),
        fetchTasksByStatus(1, 1000, projectId, 'IN_PROGRESS'),
        fetchTasksByStatus(1, 1000, projectId, 'COMPLETED'),
      ]);

      setPendingTasks(pendingTasks.tasks);
      setInProgressTasks(inProgressTasks.tasks);
      setCompletedTasks(completedTasks.tasks);
    } catch (error) {
      setError('Error fetching tasks');
    }
  };

  const handleProjectSelect = (projectId: number) => {
    setSelectedProjectId(projectId);
  };

  const handleCloseError = () => {
    setError('');
  };

  const handleOpenTaskModal = () => {
    setIsTaskModalOpen(true);
  };

  const handleCloseTaskModal = () => {
    setIsTaskModalOpen(false);
  };

  const handleOpenProjectModal = () => {
    setIsProjectModalOpen(true);
  };

  const handleCloseProjectModal = () => {
    setNewProjectDescription('');
    setNewProjectName('');
    setIsProjectModalOpen(false);
  };

  const handleCreateProject = async () => {
    try {
      const userId = sessionStorage.getItem('userId');

      if (!userId) {
        navigate('/login');
        return;
      }

      await createProject(newProjectName, newProjectDescription);
      listProjects(userId);
      handleCloseProjectModal();
    } catch (error) {
      setError('Error creating project');
    }
  };

  const handleUpdateStatus = async (taskId: number, newStatus: string) => {
    try {
      await updateTaskStatus(newStatus, taskId);

      if (selectedProjectId) {
        await fetchTasks(selectedProjectId);
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  return (
    <div className="home-page">
      <Sidebar userName={userName} projects={projects} onProjectSelect={handleProjectSelect}
               onOpenModal={handleOpenProjectModal} />
      <div className="content">
        {selectedProjectId && (
          <>
            <div className="tasks-container">
              <div className="tasks-column">
                <h3>Pending</h3>
                {pendingTasks.map(task => (
                  <TaskCard key={task.id} task={task} onUpdateStatus={handleUpdateStatus} />
                ))}
              </div>
              <div className="tasks-column">
                <h3>In Progress</h3>
                {inProgressTasks.map(task => (
                  <TaskCard key={task.id} task={task} onUpdateStatus={handleUpdateStatus} />
                ))}
              </div>
              <div className="tasks-column">
                <h3>Completed</h3>
                {completedTasks.map(task => (
                  <TaskCard key={task.id} task={task} onUpdateStatus={handleUpdateStatus} />
                ))}
              </div>
            </div>
          </>
        )}
        {selectedProjectId !== null && (
          <button onClick={handleOpenTaskModal} className="new-task-button">New Task</button>
        )}
      </div>
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={handleCloseError} className="close-button">X</button>
        </div>
      )}
      {isProjectModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Create New Project</h2>
            <input
              type="text"
              placeholder="Project Name"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
            />
            <textarea
              placeholder="Project Description"
              value={newProjectDescription}
              onChange={(e) => setNewProjectDescription(e.target.value)}
            />
            <button onClick={handleCreateProject}>Create Project</button>
            <button onClick={handleCloseProjectModal}>Close</button>
          </div>
        </div>
      )}
      {selectedProjectId !== null && (
        <NewTaskModal
          projectId={selectedProjectId}
          isOpen={isTaskModalOpen}
          onClose={handleCloseTaskModal}
          onTaskCreated={() => fetchTasks(selectedProjectId!)}
        />
      )}

    </div>
  );
};

export default Home;
