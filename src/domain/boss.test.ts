import { describe, expect, it } from 'vitest'
import type { LectureMastery } from './mastery'
import { getBossEligibility, LECTURE_BOSSES, scoreBossBattle } from './boss'
import type { Problem } from '../types'

const mastery = (attempted: number, mastered: number): LectureMastery => ({
  lectureId: 'lecture-01', total: 20, attempted, mastered, corrected: 0, scorePercent: 0, problemMastery: []
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

  it('至少尝试 6 题且真实掌握 4 题后解锁', () => {
    expect(getBossEligibility(mastery(5, 4)).unlocked).toBe(false)
    expect(getBossEligibility(mastery(6, 3)).unlocked).toBe(false)
    expect(getBossEligibility(mastery(6, 4)).unlocked).toBe(true)
  })

  it('五题至少四题独立完成且总伤害达到 80 才能击破', () => {
    const win = problems.map((problem) => ({ problemId: problem.id, rating: 'independent' as const, isCorrect: true }))
    expect(scoreBossBattle(win, problems).passed).toBe(true)
    expect(scoreBossBattle([{ ...win[0], isCorrect: false }, ...win.slice(1, 4), { ...win[4], rating: 'hint' }], problems).passed).toBe(false)
  })
})
