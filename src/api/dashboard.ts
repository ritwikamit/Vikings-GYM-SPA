import api from './client'

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getAlerts: () => api.get('/dashboard/alerts'),
  getAnalytics: () => api.get('/analytics/dashboard'),
  getRevenueTrend: () => api.get('/analytics/revenue'),
  getMemberGrowth: () => api.get('/analytics/members'),
  getAttendanceTrend: () => api.get('/analytics/attendance'),
  getLeadFunnel: () => api.get('/analytics/leads'),
  getTrainerPerformance: () => api.get('/analytics/trainers'),
  getExpenseBreakdown: () => api.get('/analytics/expenses'),
  getPTAnalytics: () => api.get('/analytics/pt')
}
