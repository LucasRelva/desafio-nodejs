import axiosInstance from './axiosInterceptor';

export interface LoginResponse {
  access_token: string;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await axiosInstance.post('/user/login', { email, password });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.message || error.message;
  }
};
