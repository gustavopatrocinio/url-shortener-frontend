import api from '@/services/api'
import { extractLinksPayload } from '@/utils/links'

export async function fetchLinks() {
  const { data } = await api.get('/links')
  return extractLinksPayload(data)
}

export async function deleteLink(id) {
  await api.delete(`/links/${id}`)
}
