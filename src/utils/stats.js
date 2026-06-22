export function normalizeLinkStats(data) {
  const stats = data.data ?? data
  const daily =
    stats.clicks_by_day ??
    stats.clicksByDay ??
    stats.daily ??
    stats.days ??
    stats.clicks_per_day ??
    []

  return {
    totalClicks: stats.total_clicks ?? stats.totalClicks ?? stats.clicks ?? 0,
    clicksByDay: daily.map((item) => ({
      date: item.date ?? item.day ?? item.label,
      clicks: item.clicks ?? item.count ?? item.total ?? 0,
    })),
    slug: stats.slug ?? stats.link?.slug ?? '',
    shortUrl: stats.short_url ?? stats.shortUrl ?? stats.link?.short_url ?? null,
    originalUrl:
      stats.original_url ??
      stats.originalUrl ??
      stats.link?.original_url ??
      stats.link?.url ??
      '',
  }
}

function toDateKey(value) {
  const date = new Date(value)
  date.setHours(0, 0, 0, 0)
  return date.toISOString().slice(0, 10)
}

function formatChartLabel(date) {
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

export function prepareLast7DaysChart(clicksByDay) {
  const clicksMap = new Map(
    clicksByDay.map((item) => [toDateKey(item.date), Number(item.clicks) || 0]),
  )

  const labels = []
  const data = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let offset = 6; offset >= 0; offset -= 1) {
    const date = new Date(today)
    date.setDate(today.getDate() - offset)

    const key = toDateKey(date)
    labels.push(formatChartLabel(date))
    data.push(clicksMap.get(key) ?? 0)
  }

  return { labels, data }
}
