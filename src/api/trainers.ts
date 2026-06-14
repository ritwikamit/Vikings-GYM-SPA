import api from './client'

export const trainersAPI = {
  getAll: (params?: object) => api.get('/trainers', { params }),
  getById: (id: string) => api.get(`/trainers/${id}`),
  create: (data: object) => api.post('/trainers', data),
  update: (id: string, data: object) => api.put(`/trainers/${id}`, data),
  delete: (id: string) => api.delete(`/trainers/${id}`),
  getClients: (id: string) => api.get(`/trainers/${id}/clients`),
  getPerformance: (id: string) => api.get(`/trainers/${id}/performance`)
}
