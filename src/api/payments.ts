import api from './client'

export const paymentsAPI = {
  getAll: (params?: object) => api.get('/payments', { params }),
  recordOffline: (data: object) => api.post('/payments/offline', data),
  createRazorpayOrder: (data: object) => api.post('/payments/razorpay/create', data),
  verifyRazorpay: (data: object) => api.post('/payments/razorpay/verify', data),
  getInvoice: (id: string) => api.get(`/payments/${id}/invoice`, { responseType: 'blob' }),
  applyCoupon: (data: object) => api.post('/payments/apply-coupon', data),
  getAnalytics: () => api.get('/payments/analytics')
}
