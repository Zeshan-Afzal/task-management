import axios from 'axios';

const API_BASE_URL = 'http://localhost:3005/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log(token);
    
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: (userData) => api.post('/auth/sign_up', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
};

// Tasks API
export const tasksAPI = {
  getTasks: (queryParams = '') => api.get(`/task/get-tasks${queryParams ? `?${queryParams}` : ''}`),
  getTaskById: (id) => api.get(`/task/get-task/${id}`),
  createTask: (taskData) => api.post('/task/create', taskData),
  updateTask: (taskId, taskData) => api.put(`/task/update-task/${taskId}`, taskData),
  deleteTask: (id) => api.delete(`/task/delete-task/${id}`),
};

export default api; 