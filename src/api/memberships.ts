import api from './client'

export const membershipsAPI = {
  getAll: (params?: object) => api.get('/memberships', { params }),
  getPlans: () => api.get('/memberships/plans'),
  assign: (data: object) => api.post('/memberships', data),
  renew: (id: string, data: object) => api.put(`/memberships/${id}/renew`, data),
  upgrade: (id: string, data: object) => api.put(`/memberships/${id}/upgrade`, data),
  freeze: (id: string, data: object) => api.put(`/memberships/${id}/freeze`, data),
  cancel: (id: string) => api.put(`/memberships/${id}/cancel`, {}),
  getExpiring: () => api.get('/memberships/expiring'),
  getExpired: () => api.get('/memberships/expired')
}
