import axiosInstance from './axiosInterceptor';

export interface User {
  id: number;
  name: string;
  email: string;
}

export const fetchUser = async (userId: string): Promise<User> => {
  try {
    const response = await axiosInstance.get(`/user/${userId}`); // Include userId in the URL
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
};

