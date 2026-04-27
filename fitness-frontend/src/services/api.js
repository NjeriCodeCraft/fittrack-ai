import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerUser = (data) => API.post('/users/register/', data);
export const loginUser = (data) => API.post('/users/login/', data);
export const getProfile = () => API.get('/users/profile/');
export const updateProfile = (data) => API.patch('/users/profile/', data);

export const getActivities = () => API.get('/activities/');
export const addActivity = (data) => API.post('/activities/', data);
export const deleteActivity = (id) => API.delete(`/activities/${id}/`);

export const getNutrition = () => API.get('/nutrition/');
export const addNutrition = (data) => API.post('/nutrition/', data);
export const deleteNutrition = (id) => API.delete(`/nutrition/${id}/`);
export const getNutritionSummary = () => API.get('/nutrition/summary/');

export const calculateBMI = (data) => API.post('/bmi/calculate/', data);
export const getBMIHistory = () => API.get('/bmi/history/');

export const getGoals = () => API.get('/goals/');
export const addGoal = (data) => API.post('/goals/', data);
export const updateGoal = (id, data) => API.patch(`/goals/${id}/`, data);
export const deleteGoal = (id) => API.delete(`/goals/${id}/`);

export const getRecommendations = () => API.get('/recommendations/');