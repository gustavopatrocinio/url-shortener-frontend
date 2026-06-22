import axios from 'axios'
import router from '@/router'

export const TOKEN_KEY = 'token'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY)

      const currentPath = router.currentRoute.value.path
      if (currentPath !== '/login' && currentPath !== '/register') {
        router.push('/login')
      }
    }

    return Promise.reject(error)
  },
)

export default api
