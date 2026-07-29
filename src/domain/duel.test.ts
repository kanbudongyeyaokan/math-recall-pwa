import { describe, expect, it } from 'vitest'
import { defaultProfile } from '../db'
import { makeSeedProblems } from '../data/seed'
import { buildDuelQueue, createDuelChallengeId, DUEL_QUESTION_COUNT, getDuelPresentation, scoreDuel } from './duel'

describe('主动五题挑战', () => {
  const problems = makeSeedProblems(1_000_000)

  it('四种范围都稳定抽取五道不重复高数题', () => {
    for (const scope of ['all', 'lecture', 'weak', 'choice'] as const) {
      const ids = buildDuelQueue({ problems, profile: defaultProfile, scope, lectureId: 'lecture-01', seed: 42 })
      expect(ids).toHaveLength(DUEL_QUESTION_COUNT)
      expect(new Set(ids).size).toBe(DUEL_QUESTION_COUNT)
      expect(buildDuelQueue({ problems, profile: defaultProfile, scope, lectureId: 'lecture-01', seed: 42 })).toEqual(ids)
    }
  })

  it('选择题速战只抽可作答选择题，指定讲次不会越界', async () => {
    const choiceIds = buildDuelQueue({ problems, profile: defaultProfile, scope: 'choice', seed: 7 })
    expect(choiceIds.every((id) => problems.find((problem) => problem.id === id)?.questionFormat !== 'open')).toBe(true)

    const lectureIds = buildDuelQueue({ problems, profile: defaultProfile, scope: 'lecture', lectureId: 'lecture-18', seed: 7 })
    const { getProblemLectureIds } = await import('./curriculum')
    expect(lectureIds.every((id) => getProblemLectureIds(problems.find((problem) => problem.id === id)!).includes('lecture-18'))).toBe(true)
  })

  it('宿敌需要四次强命中，朋友切磋三次即可通过', () => {
    const queue = problems.filter((problem) => problem.questionFormat === 'open').slice(0, 5)
    const outcomes = queue.map((problem, index) => ({ problemId: problem.id, rating: index < 3 ? 'independent' as const : 'hint' as const }))
    const input = { outcomes, problems: queue, deadlineAt: 1_000, completedAt: 900 }
    expect(scoreDuel({ ...input, opponentId: 'zeng-yuxin' }).passed).toBe(false)
    expect(scoreDuel({ ...input, opponentId: 'chen-yanjun' }).passed).toBe(true)
    expect(scoreDuel({ ...input, opponentId: 'chen-yanjun', completedAt: 1_001 }).timedOut).toBe(true)
  })

  it('三名宿敌拥有专属高奖励文案，挑战 ID 可幂等结算', () => {
    expect(getDuelPresentation('zeng-yuxin').winCoins).toBe(72)
    expect(getDuelPresentation('yuan-yue').playerVictory).toContain('袁越')
    expect(getDuelPresentation('chen-ruibin').opponentVictory).toContain('榜单')
    expect(createDuelChallengeId('zeng-yuxin', 123)).toBe('duel-123-zeng-yuxin')
  })
})
