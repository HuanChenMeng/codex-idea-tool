export type UsageSchedule = { enabled: boolean; times: string[]; startAccountIds: string[] }

export const DEFAULT_USAGE_SCHEDULE: UsageSchedule = {
  enabled: false,
  times: ['06:00', '12:00', '17:00'],
  startAccountIds: [],
}

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/

export function normalizeUsageSchedule(value: unknown): UsageSchedule {
  if (!value || typeof value !== 'object') return DEFAULT_USAGE_SCHEDULE
  const schedule = value as Partial<UsageSchedule>
  const times = Array.isArray(schedule.times)
    ? [...new Set(schedule.times.filter((time): time is string => typeof time === 'string' && TIME_PATTERN.test(time)))].sort()
    : DEFAULT_USAGE_SCHEDULE.times
  const startAccountIds = Array.isArray(schedule.startAccountIds)
    ? [...new Set(schedule.startAccountIds.filter((id): id is string => typeof id === 'string' && id.length > 0))]
    : []
  return { enabled: schedule.enabled === true, times, startAccountIds }
}

export function dueUsageSlot(now: Date, schedule: UsageSchedule, lastSlot: string): string | null {
  if (!schedule.enabled) return null
  const day = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  const currentMinute = now.getHours() * 60 + now.getMinutes()
  const time = [...schedule.times].reverse().find(item => {
    const [hour, minute] = item.split(':').map(Number)
    const elapsed = currentMinute - (hour * 60 + minute)
    return elapsed >= 0 && elapsed <= 5
  })
  if (!time) return null
  const slot = `${day} ${time}`
  return slot === lastSlot ? null : slot
}
