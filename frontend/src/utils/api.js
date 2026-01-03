import axios from 'axios'

const API_BASE = '/api'

const api = axios.create({
  baseURL: API_BASE,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const auth = {
  login: (email, password) => api.post('/login', { email, password }),
  register: (userData) => api.post('/register', userData),
}

export const trips = {
  getAll: () => api.get('/trips'),
  create: (tripData) => api.post('/trips', tripData),
  getById: (id) => api.get(`/trips/${id}`),
}

export const cities = {
  search: (params) => api.get('/cities', { params }),
}

export const activities = {
  getByCity: (cityId, params) => api.get(`/activities/${cityId}`, { params }),
  search: (params) => api.get('/activities/search', { params }),
  getAll: (params) => api.get('/activities', { params }),
}

export const itinerary = {
  add: (data) => api.post('/itinerary', data),
}

export const community = {
  getComments: () => api.get('/comments'),
  addComment: (commentData) => api.post('/comments', commentData),
}

export const users = {
  updateProfile: (userId, userData) => api.put(`/users/${userId}`, userData),
  updateAvatar: (userId, avatarData) => api.put(`/users/${userId}/avatar`, avatarData),
}

export const admin = {
  getPopularCities: () => api.get('/admin/popular-cities'),
  getAllUsers: () => api.get('/admin/users'),
  getPopularActivities: () => api.get('/admin/popular-activities'),
}