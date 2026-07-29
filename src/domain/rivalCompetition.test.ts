import { describe, expect, it } from 'vitest'
import { defaultProfile } from '../db'
import {
  advanceRivalCompetition,
  createRivalCompetitionState,
  getCompetitionRows,
  getRivalAttitude,
  getRivalDialogue
} from './rivalCompetition'

describe('对手修炼进度模拟', () => {
  const profile = { ...defaultProfile, xp: 800, masteredProblemIds: Array.from({ length: 20 }, (_, index) => `q-${index}`) }

  it('首次建立时围绕真实掌握力形成有压迫感但有限的差距', () => {
    const state = createRivalCompetitionState(profile, new Date(2026, 6, 20, 12).getTime())
    expect(state.rivals['zeng-yuxin'].power).toBe(29)
    expect(state.rivals['yuan-yue'].power).toBe(30)
    expect(state.rivals['chen-ruibin'].power).toBe(46)
    expect(Object.values(state.rivals).every((entry) => entry.todayGain === 0)).toBe(true)
  })

  it('每天只结算一次，跨日增长稳定且单日掌握力最多增加三点', () => {
    const dayOne = new Date(2026, 6, 20, 12).getTime()
    const initial = createRivalCompetitionState(profile, dayOne)
    const sameDay = advanceRivalCompetition(profile, initial, dayOne + 3_600_000)
    expect(sameDay).toEqual(initial)

    const nextDay = advanceRivalCompetition(profile, initial, dayOne + 86_400_000)
    for (const id of ['zeng-yuxin', 'yuan-yue', 'chen-ruibin'] as const) {
      expect(nextDay.rivals[id].power - initial.rivals[id].power).toBeGreaterThanOrEqual(1)
      expect(nextDay.rivals[id].power - initial.rivals[id].power).toBeLessThanOrEqual(3)
      expect(nextDay.rivals[id].todayQuestions).toBeGreaterThanOrEqual(6)
    }
  })

  it('排名包含何耀焜与三名宿敌，差距和境界均可解释', () => {
    const state = createRivalCompetitionState(profile, new Date(2026, 6, 20).getTime())
    const rows = getCompetitionRows(profile, state)
    expect(rows).toHaveLength(4)
    expect(rows.map((row) => row.power)).toEqual([...rows.map((row) => row.power)].sort((a, b) => b - a))
    expect(rows.find((row) => row.isPlayer)?.gapToPlayer).toBe(0)
    expect(rows.every((row) => row.realmLabel.includes('星'))).toBe(true)
  })

  it('对手会随差距从压迫转为警惕、嘴硬和退让', () => {
    const state = createRivalCompetitionState(profile, new Date(2026, 6, 20).getTime())
    const entry = state.rivals['zeng-yuxin']
    expect(getRivalAttitude(profile, { ...entry, power: 50, xp: 2_000 })).toBe('dominant')
    expect(getRivalAttitude(profile, { ...entry, power: 22, xp: 800 })).toBe('wary')
    expect(getRivalAttitude(profile, { ...entry, power: 10, xp: 500 })).toBe('bluffing')
    expect(getRivalAttitude(profile, { ...entry, power: 0, xp: 0 })).toBe('yielding')
    expect(getRivalDialogue(profile, state, 'zeng-yuxin').length).toBeGreaterThan(20)
  })
})
