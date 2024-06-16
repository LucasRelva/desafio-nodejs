import axiosInstance from './axiosInterceptor';

export interface Task {
  id: number;
  title: string;
  description: string;
  assignees: User[];
  tags: Tag[];
  status: string;
  createdAt: string;
}

export interface TaskPaginatedResponse {
  currentPage: string;
  pageSize: number;
  tasks: Task[];
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Tag {
  id: number;
  title: string;
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


export const fetchTasksByStatus = async (page: number, size: number, projectId: number, status: string): Promise<TaskPaginatedResponse> => {
  try {
    const response = await axiosInstance.get('/tasks', {
      params: {
        page: page,
        size: size,
        projectId: projectId,
        status: status,
      }
    });
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

export const createTask = async (title: string, description: string, tagIds: number[], projectId: number ): Promise<Task> => {
  try {
    const response = await axiosInstance.post('/tasks', { title, description, status: 'PENDING', projectId, tags: tagIds });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
};

export const createProject = async (name: string, description: string): Promise<void> => {
  try {
    await axiosInstance.post('/projects', { name, description });
  } catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
}

export const fetchTags = async (page: number, size: number): Promise<Tag[]> => {
    try {
      const response = await axiosInstance.get('/tags', {
        params: {
          page: page,
          size: size,
        }
      })
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.message || error.message;
    }
}

export const updateTaskStatus =  async (newStatus: string, taskId: number): Promise<void> => {
  try {
    await axiosInstance.patch(`/tasks/${taskId}`, { status: newStatus });
  } catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
}
