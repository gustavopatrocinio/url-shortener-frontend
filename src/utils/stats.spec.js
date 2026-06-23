import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { prepareLast7DaysChart } from '@/utils/stats'

describe('prepareLast7DaysChart', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2025, 5, 23, 15, 30, 0))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('maps API date-only values to the matching local chart day', () => {
    const chart = prepareLast7DaysChart([{ date: '2025-06-23', clicks: 1 }])

    expect(chart.labels.at(-1)).toContain('Jun 23')
    expect(chart.data.at(-1)).toBe(1)
    expect(chart.data.at(-2)).toBe(0)
  })

  it('accepts backend day field names', () => {
    const chart = prepareLast7DaysChart([{ day: '2025-06-23', clicks: 2 }])

    expect(chart.data.at(-1)).toBe(2)
  })
})
