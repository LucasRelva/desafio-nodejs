import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const API_URL = 'http://localhost:3000';

const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    if (config.url?.endsWith('/login')) {
      return config;
    }

    const token = sessionStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.clear();
      console.log('Unauthorized error:', error.response.data);
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
