import api from '@/services/api'
import { extractLinksPayload, normalizeLink } from '@/utils/links'
import { normalizeLinkStats } from '@/utils/stats'

export async function fetchLinks() {
  const { data } = await api.get('/links')
  return extractLinksPayload(data)
}

export async function fetchLink(id) {
  const { data } = await api.get(`/links/${id}`)
  return normalizeLink(data.data ?? data)
}

export async function createLink(payload) {
  const { data } = await api.post('/links', payload)
  return normalizeLink(data.data ?? data)
}

export async function updateLink(id, payload) {
  const { data } = await api.put(`/links/${id}`, payload)
  return normalizeLink(data.data ?? data)
}

export async function deleteLink(id) {
  await api.delete(`/links/${id}`)
}

export async function fetchLinkStats(id) {
  const { data } = await api.get(`/links/${id}/stats`)
  return normalizeLinkStats(data)
}
