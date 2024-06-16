import axiosInstance from './axiosInterceptor';

export interface Task {
  id: number;
  title: string;
  description: string;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  creatorId: number;
  tasks: Task[];
}

export interface PaginatedResponse {
  currentPage: string;
  pageSize: number;
  projects: Project[];
}


export const fetchTasks = async (): Promise<Task[]> => {
  try {
    const response = await axiosInstance.get('/tasks');
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
};

export const fetchProjects = async (page: number, size: number, creatorId: string): Promise<PaginatedResponse> => {
  try {
    const response = await axiosInstance.get('/projects', {
      params: {
        page: page,
        size: size,
        creatorId: creatorId,
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
}

export const createTask = async (title: string, description: string): Promise<Task> => {
  try {
    const response = await axiosInstance.post('/tasks', { title, description });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
};
