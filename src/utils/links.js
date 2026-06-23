export function truncateUrl(url, maxLength = 48) {
  if (!url || url.length <= maxLength) {
    return url
  }

  return `${url.slice(0, maxLength - 1)}…`
}

export function buildShortUrl(link, baseUrl) {
  const base = (baseUrl ?? '').replace(/\/$/, '')

  if (base && link.slug) {
    return `${base}/${link.slug}`
  }

  if (link.shortUrl) {
    return link.shortUrl
  }

  return link.slug ? `/${link.slug}` : ''
}

export function formatExpiresAt(value) {
  if (!value) {
    return null
  }

  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function normalizeLink(link) {
  return {
    id: link.id,
    originalUrl: link.original_url ?? link.originalUrl ?? link.url ?? '',
    slug: link.slug ?? '',
    clicks: link.clicks ?? link.clicks_count ?? link.click_count ?? link.total_clicks ?? 0,
    expiresAt: link.expires_at ?? link.expiresAt ?? null,
    shortUrl: link.short_url ?? link.shortUrl ?? null,
  }
}

export function extractLinksPayload(data) {
  const links = Array.isArray(data) ? data : (data.data ?? [])
  const baseUrl =
    data.base_url ??
    data.meta?.base_url ??
    import.meta.env.VITE_SHORT_URL_BASE ??
    ''

  return {
    links: links.map(normalizeLink),
    baseUrl,
  }
}

export function toDatetimeLocalValue(value) {
  if (!value) {
    return ''
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  const pad = (part) => String(part).padStart(2, '0')

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function fromDatetimeLocalValue(value) {
  if (!value) {
    return null
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  return date.toISOString()
}

export function buildLinkPayload(form, { isEditing = false } = {}) {
  const payload = {
    original_url: form.originalUrl.trim(),
  }

  const slug = form.slug.trim()

  if (slug) {
    payload.slug = slug
  } else if (isEditing) {
    payload.slug = null
  }

  const expiresAt = fromDatetimeLocalValue(form.expiresAt)

  if (expiresAt || isEditing) {
    payload.expires_at = expiresAt
  }

  return payload
}
