import api from './client'

export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  register: (data: any) =>
    api.post('/auth/register', data),

  logout: () =>
    api.post('/auth/logout'),

  getMe: () =>
    api.get('/auth/me'),

  changePassword: (old_password: string, new_password: string) =>
    api.post('/auth/change-password', { old_password, new_password }),

  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),

  resetPassword: (email: string, new_password: string) =>
    api.post('/auth/reset-password', { email, new_password }),

  googleLogin: (id_token: string) =>
    api.post('/auth/google', { id_token }),

  facebookLogin: (access_token: string) =>
    api.post('/auth/facebook', { access_token })
}
