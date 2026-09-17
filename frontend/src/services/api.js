import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Response interceptor to format error messages
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || error.message || 'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export const taskApi = {
  getTasks: async (params = {}) => {
    const res = await apiClient.get('/tasks', { params });
    return res.data;
  },
  getTaskById: async (id) => {
    const res = await apiClient.get(`/tasks/${id}`);
    return res.data;
  },
  createTask: async (data) => {
    const res = await apiClient.post('/tasks', data);
    return res.data;
  },
  updateTask: async (id, data) => {
    const res = await apiClient.put(`/tasks/${id}`, data);
    return res.data;
  },
  updateTaskStatus: async (id, status) => {
    const res = await apiClient.patch(`/tasks/${id}/status`, { status });
    return res.data;
  },
  deleteTask: async (id) => {
    const res = await apiClient.delete(`/tasks/${id}`);
    return res.data;
  }
};

export const projectApi = {
  getProjects: async () => {
    const res = await apiClient.get('/projects');
    return res.data;
  },
  getProjectById: async (id) => {
    const res = await apiClient.get(`/projects/${id}`);
    return res.data;
  },
  createProject: async (data) => {
    const res = await apiClient.post('/projects', data);
    return res.data;
  },
  getProjectMembers: async (projectId) => {
    const res = await apiClient.get(`/projects/${projectId}/members`);
    return res.data;
  },
  addProjectMember: async (projectId, data) => {
    const res = await apiClient.post(`/projects/${projectId}/members`, data);
    return res.data;
  },
  getProjectWorkload: async (projectId) => {
    const res = await apiClient.get(`/projects/${projectId}/workload`);
    return res.data;
  }
};

export const userApi = {
  getUsers: async () => {
    const res = await apiClient.get('/users');
    return res.data;
  },
  createUser: async (data) => {
    const res = await apiClient.post('/users', data);
    return res.data;
  }
};

export default apiClient;
