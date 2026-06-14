import api from './client'

export const membersAPI = {
  getAll: (params?: { page?: number, search?: string, status?: string }) =>
    api.get('/members', { params }),

  getById: (id: string) =>
    api.get(`/members/${id}`),

  create: (data: FormData | object) =>
    api.post('/members', data),

  update: (id: string, data: object) =>
    api.put(`/members/${id}`, data),

  delete: (id: string) =>
    api.delete(`/members/${id}`),

  getQR: (id: string) =>
    api.get(`/members/${id}/qr`),

  getMembership: (id: string) =>
    api.get(`/members/${id}/membership`),

  getAttendance: (id: string) =>
    api.get(`/members/${id}/attendance`),

  getPayments: (id: string) =>
    api.get(`/members/${id}/payments`),

  getProgress: (id: string) =>
    api.get(`/members/${id}/progress`),

  getWorkouts: (id: string) =>
    api.get(`/members/${id}/workouts`),

  getDiet: (id: string) =>
    api.get(`/members/${id}/diet`)
}
