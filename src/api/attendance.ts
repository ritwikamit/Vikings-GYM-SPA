import api from './client'

export const attendanceAPI = {
  checkIn: (data: { memberId: string, method: string }) =>
    api.post('/attendance/checkin', data),

  checkOut: (data: { memberId: string }) =>
    api.post('/attendance/checkout', data),

  getAll: (params?: object) => api.get('/attendance', { params }),
  getToday: () => api.get('/attendance/today'),
  getAnalytics: () => api.get('/attendance/analytics'),
  getHeatmap: () => api.get('/attendance/heatmap'),
  getPeakHours: () => api.get('/attendance/peak-hours')
}
