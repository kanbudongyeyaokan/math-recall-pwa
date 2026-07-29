import { describe, expect, it } from 'vitest'
import type { PlayerProfile, PracticeSessionOutcome, Problem } from '../types'
import {
  buildSurpriseChallengeQueue,
  getEligibleSurpriseRivals,
  prepareSurpriseChallengeOffer,
  scoreSurpriseChallenge,
  SURPRISE_CHALLENGE_QUESTION_COUNT
} from './surpriseChallenge'

function makeProfile(masteryPower = 5, totalReviews = 5) {
  return {
    totalReviews,
    masteredProblemIds: Array.from({ length: masteryPower }, (_, index) => `mastered-${index}`),
    correctedProblemIds: [],
    bossVictories: {}
  } as unknown as PlayerProfile
}

function makeProblem(index: number): Problem {
  return {
    id: `q${index}`,
    kind: 'problem',
    title: `选择题 ${index}`,
    statement: '题面',
    source: '测试题库',
    page: '',
    tags: [`第 ${index + 1} 讲`],
    coreMethod: '方法',
    mistakes: '',
    answerText: 'A',
    questionFormat: 'single-choice',
    options: [{ id: 'A', text: '正确' }, { id: 'B', text: '错误' }],
    correctOptionIds: ['A'],
    solutionMethods: [],
    createdAt: 1,
    updatedAt: 1,
    nextReviewAt: 1,
    intervalIndex: -1,
    reviewCount: index
  }
}

describe('突发邀战', () => {
  it('至少完成五次做题后才会发出邀战', () => {
    const before = prepareSurpriseChallengeOffer({ profile: makeProfile(5, 4), availableProblemCount: 5, now: 100, seed: 1 })
    const after = prepareSurpriseChallengeOffer({ profile: makeProfile(5, 5), availableProblemCount: 5, now: 100, seed: 1 })
    expect(before.offer).toBeUndefined()
    expect(after.offer?.id).toContain('ambush-100-')
  })

  it('宿敌随真实掌握力逐步解锁', () => {
    expect(getEligibleSurpriseRivals(makeProfile(5))).toHaveLength(1)
    expect(getEligibleSurpriseRivals(makeProfile(32)).map((rival) => rival.id)).toEqual(['zeng-yuxin', 'yuan-yue'])
    expect(getEligibleSurpriseRivals(makeProfile(120))).toHaveLength(3)
  })

  it('恢复未过期邀请，并遵守拒绝或结算后的冷却', () => {
    const pendingOffer = { id: 'ambush-pending', rivalId: 'zeng-yuxin' as const, createdAt: 10, expiresAt: 200, seed: 9 }
    const restored = prepareSurpriseChallengeOffer({
      profile: makeProfile(),
      state: { nextEligibleAt: 0, pendingOffer },
      availableProblemCount: 5,
      now: 100,
      seed: 10
    })
    const coolingDown = prepareSurpriseChallengeOffer({
      profile: makeProfile(),
      state: { nextEligibleAt: 300 },
      availableProblemCount: 5,
      now: 100,
      seed: 10
    })
    expect(restored.offer).toEqual(pendingOffer)
    expect(restored.changed).toBe(false)
    expect(coolingDown.offer).toBeUndefined()
    expect(coolingDown.state.settledChallengeIds).toEqual([])
  })

  it('从不同讲次抽出恰好五道不重复选择题', () => {
    const problems = Array.from({ length: 8 }, (_, index) => makeProblem(index))
    const queue = buildSurpriseChallengeQueue(problems, 19)
    expect(queue).toHaveLength(SURPRISE_CHALLENGE_QUESTION_COUNT)
    expect(new Set(queue)).toHaveLength(SURPRISE_CHALLENGE_QUESTION_COUNT)
    expect(queue.every((id) => problems.find((problem) => problem.id === id)?.questionFormat !== 'open')).toBe(true)
  })

  it('五题中至少四题独立正确且未超时才胜利', () => {
    const problems = Array.from({ length: 5 }, (_, index) => makeProblem(index))
    const win: PracticeSessionOutcome[] = problems.map((problem, index) => ({
      problemId: problem.id,
      rating: index < 4 ? 'independent' : 'hint',
      isCorrect: true
    }))
    expect(scoreSurpriseChallenge({ outcomes: win, problems, deadlineAt: 1_000, completedAt: 999 }).passed).toBe(true)
    expect(scoreSurpriseChallenge({ outcomes: win.slice(0, 4), problems, deadlineAt: 1_000, completedAt: 999 }).passed).toBe(false)
    expect(scoreSurpriseChallenge({ outcomes: [{ ...win[0], isCorrect: false }, ...win.slice(1)], problems, deadlineAt: 1_000, completedAt: 999 }).passed).toBe(false)
    expect(scoreSurpriseChallenge({ outcomes: win, problems, deadlineAt: 1_000, completedAt: 1_001 })).toMatchObject({ passed: false, timedOut: true })
  })
})
