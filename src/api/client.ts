import axios from 'axios'

export const ADMIN_URL = import.meta.env.VITE_ADMIN_URL || (
  typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:8000/admin'
    : 'https://admin.shacrawi.com/admin'
)

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || (
    typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
      ? 'http://localhost:8000/api'
      : 'https://admin.shacrawi.com/api'
  ),
  headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
})

// Attach Bearer token from localStorage
api.interceptors.request.use(config => {
  const token = localStorage.getItem('auth_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  // Attach locale header so Laravel picks up the right language
  const locale = localStorage.getItem('locale') ?? 'en'
  config.headers['X-App-Locale'] = locale
  return config
})

// Auto logout on 401
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
