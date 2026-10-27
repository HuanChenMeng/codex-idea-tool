import assert from 'node:assert/strict'
import test from 'node:test'
import { DEFAULT_USAGE_SCHEDULE, dueUsageSlot, normalizeUsageSchedule } from './usageSchedule.ts'

test('normalizes and sorts valid local times', () => {
  assert.deepEqual(normalizeUsageSchedule({ enabled: true, times: ['17:00', '06:00', '17:00', '25:00'] }), {
    enabled: true,
    times: ['06:00', '17:00'],
    startAccountIds: [],
  })
  assert.deepEqual(normalizeUsageSchedule({ enabled: false, times: ['09:00'], startAccountIds: ['one', 'one', 'two'] }).startAccountIds, ['one', 'two'])
  assert.deepEqual(normalizeUsageSchedule(null), DEFAULT_USAGE_SCHEDULE)
})

test('runs once per daily slot and never while disabled', () => {
  const schedule = { enabled: true, times: ['06:00'] }
  const first = new Date(2026, 9, 26, 6, 0)
  const slot = dueUsageSlot(first, schedule, '')
  assert.equal(slot, '2026-10-26 06:00')
  assert.equal(dueUsageSlot(first, schedule, slot), null)
  assert.equal(dueUsageSlot(new Date(2026, 9, 26, 6, 1), schedule, ''), slot)
  assert.equal(dueUsageSlot(new Date(2026, 9, 26, 6, 6), schedule, ''), null)
  assert.equal(dueUsageSlot(new Date(2026, 9, 27, 6, 0), schedule, slot), '2026-10-27 06:00')
  assert.equal(dueUsageSlot(first, { ...schedule, enabled: false }, ''), null)
})
