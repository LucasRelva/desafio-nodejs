import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TaskColumn from './components/TaskColumn';
import Login from './components/Login';
import { fetchProjects, fetchTasks, Project, Task } from './services/taskService';
import './App.css';

const App: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [tasks, setTasks] = useState<{ [key: string]: Task[] }>({});
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!sessionStorage.getItem('token'));

    const handleLogin = () => {
        setIsLoggedIn(true);
    };

    useEffect(() => {
        const loadProjects = async () => {
            if (isLoggedIn) {
                const projects = await fetchProjects();
                setProjects(projects);
            }
        };

        loadProjects();
    }, [isLoggedIn]);

    useEffect(() => {
        const loadTasks = async () => {
            if (isLoggedIn) {
                const allTasks: { [key: string]: Task[] } = {};
                for (const project of projects) {
                    const tasks = await fetchTasks(project.id);
                    allTasks[project.name] = tasks;
                }
                setTasks(allTasks);
            }
        };

        if (projects.length > 0) {
            loadTasks();
        }
    }, [projects, isLoggedIn]);

    return (
        <Router>
            <div className="app">
                <Routes>
                    <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
                    <Route path="/" element={isLoggedIn ? (
                        <>
                            <Sidebar projects={projects} />
                            <div className="task-board">
                                <TaskColumn status="Pendente" tasks={tasks['Pendente'] || []} />
                                <TaskColumn status="Em Progresso" tasks={tasks['Em Progresso'] || []} />
                                <TaskColumn status="Feito" tasks={tasks['Feito'] || []} />
                            </div>
                        </>
                    ) : <Navigate to="/login" />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
