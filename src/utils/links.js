export function truncateUrl(url, maxLength = 48) {
  if (!url || url.length <= maxLength) {
    return url
  }

  return `${url.slice(0, maxLength - 1)}…`
}

export function buildShortUrl(link, baseUrl) {
  if (link.shortUrl) {
    return link.shortUrl
  }

  const base = (baseUrl ?? '').replace(/\/$/, '')
  return `${base}/${link.slug}`
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
    clicks: link.clicks ?? link.click_count ?? link.total_clicks ?? 0,
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
