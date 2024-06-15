export interface Project {
    id: number;
    name: string;
    taskCount: number;
}

export interface Task {
    id: number;
    title: string;
    date: string;
    creator: string;
    tags: string[];
    avatar: string;
}

export const fetchProjects = async (): Promise<Project[]> => {
    const response = await fetch('https://api.example.com/projects');
    return response.json();
};

export const fetchTasks = async (projectId: number): Promise<Task[]> => {
    const response = await fetch(`https://api.example.com/projects/${projectId}/tasks`);
    return response.json();
};
