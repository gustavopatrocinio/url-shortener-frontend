import api, { TOKEN_KEY } from '@/services/api'

export function isAuthenticated() {
  return !!localStorage.getItem(TOKEN_KEY)
}

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export function extractToken(data) {
  return data.token ?? data.access_token ?? null
}

export async function login(credentials) {
  const { data } = await api.post('/auth/login', credentials)
  const token = extractToken(data)

  if (token) {
    saveToken(token)
  }

  return data
}

export async function register(payload) {
  const { data } = await api.post('/auth/register', payload)
  return data
}
