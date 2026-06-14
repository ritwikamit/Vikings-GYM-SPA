import api from './client'

export const leadsAPI = {
  getAll: (params?: object) => api.get('/leads', { params }),
  getKanban: () => api.get('/leads/kanban'),
  create: (data: object) => api.post('/leads', data),
  update: (id: string, data: object) => api.put(`/leads/${id}`, data),
  updateStatus: (id: string, status: string) =>
    api.put(`/leads/${id}/status`, { status }),
  delete: (id: string) => api.delete(`/leads/${id}`),
  setFollowup: (id: string, date: string) =>
    api.post(`/leads/${id}/followup`, { follow_up_date: date }),
  getAnalytics: () => api.get('/leads/analytics')
}
