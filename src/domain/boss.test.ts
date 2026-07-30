import { describe, expect, it } from 'vitest'
import type { LectureMastery } from './mastery'
import { buildBossQueue, getBossEligibility, LECTURE_BOSSES, scoreBossBattle } from './boss'
import type { Problem } from '../types'

const mastery = (attempted: number, mastered: number, scorePercent = 0): LectureMastery => ({
  lectureId: 'lecture-01', total: 20, attempted, mastered, corrected: 0, scorePercent, problemMastery: []
})

const problems = Array.from({ length: 5 }, (_, index): Problem => ({
  id: `q${index}`, kind: 'problem', title: '', statement: '', source: '', page: '', tags: [], coreMethod: '', mistakes: '', answerText: '',
  questionFormat: index === 0 ? 'single-choice' : 'open', options: [], correctOptionIds: [], solutionMethods: [], createdAt: 1,
  updatedAt: 1, nextReviewAt: 1, intervalIndex: -1, reviewCount: 0
}))

describe('每讲 Boss 战', () => {
  it('18 个 Boss 与当前高数讲次逐一对应', () => {
    expect(LECTURE_BOSSES).toHaveLength(18)
    expect(LECTURE_BOSSES.map((boss) => boss.lectureId)).toEqual(
      Array.from({ length: 18 }, (_, index) => `lecture-${String(index + 1).padStart(2, '0')}`)
    )
    expect(LECTURE_BOSSES[1]).toMatchObject({ name: '数列巡天者', title: '递推石阶' })
    expect(LECTURE_BOSSES[14]).toMatchObject({ name: '方程傀儡师', title: '解族战线' })
  })

  it('覆盖、掌握题数和整讲掌握率同时达标后才解锁', () => {
    expect(getBossEligibility(mastery(7, 6, 60)).unlocked).toBe(false)
    expect(getBossEligibility(mastery(8, 5, 60)).unlocked).toBe(false)
    expect(getBossEligibility(mastery(8, 6, 49)).unlocked).toBe(false)
    expect(getBossEligibility(mastery(8, 6, 50)).unlocked).toBe(true)
  })

  it('五题至少四题独立完成且总伤害达到 80 才能击破', () => {
    const win = problems.map((problem) => ({ problemId: problem.id, rating: 'independent' as const, isCorrect: true }))
    expect(scoreBossBattle(win, problems).passed).toBe(true)
    expect(scoreBossBattle([{ ...win[0], isCorrect: false }, ...win.slice(1, 4), { ...win[4], rating: 'hint' }], problems).passed).toBe(false)
  })

  it('Boss 题组从低掌握度高难度窗口抽取，不让全局洗牌冲掉优先级', () => {
    const candidates = Array.from({ length: 14 }, (_, index): Problem => ({
      ...problems[1],
      id: `boss-q${index}`,
      title: `例题 ${index}`,
      statement: `第 ${index} 道完整例题`,
      tags: ['第1讲', '经典例题'],
      difficulty: index < 7 ? 5 : 1,
      discrimination: index < 7 ? 5 : 1,
      qualityStatus: 'verified'
    }))
    const queue = buildBossQueue(candidates, {
      ...mastery(14, 7, 50),
      problemMastery: candidates.map((problem, index) => ({
        problemId: problem.id,
        attempted: true,
        score: index < 7 ? 10 : 95,
        mastered: index >= 7,
        corrected: false,
        strongReviews: index >= 7 ? 1 : 0
      }))
    }, 7)
    expect(queue).toHaveLength(5)
    expect(queue.every((id) => Number(id.replace('boss-q', '')) < 7)).toBe(true)
  })
})
