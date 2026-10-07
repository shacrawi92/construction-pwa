import api from './client'

export interface LoginResponse {
  token: string
  user: { id: number; name: string; email: string; locale: string; role: string; avatar: string | null }
}

export const authApi = {
  login: (email: string, password: string) =>
    api.post<LoginResponse>('/auth/login', { email, password }).then(r => r.data),

  logout: () => api.post('/auth/logout'),

  me: () => api.get('/auth/me').then(r => r.data),

  updateLocale: (locale: 'en' | 'am' | 'so') =>
    api.patch('/auth/locale', { locale }).then(r => r.data),
}

export const notificationApi = {
  list:    (page = 1)  => api.get(`/notifications?page=${page}`).then(r => r.data),
  markRead:(id: string) => api.patch(`/notifications/${id}/read`).then(r => r.data),
  readAll: ()           => api.post('/notifications/read-all').then(r => r.data),
}
