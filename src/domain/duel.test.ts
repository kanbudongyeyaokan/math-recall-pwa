import { describe, expect, it } from 'vitest'
import { defaultProfile } from '../db'
import { makeSeedProblems } from '../data/seed'
import { buildDuelQueue, createDuelChallengeId, DUEL_QUESTION_COUNT, getDuelLiveState, getDuelOpponentPose, getDuelPresentation, scoreDuel } from './duel'

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

  it('快速五题优先抽可作答选择题并从 PDF 经典题补足，指定讲次不会越界', async () => {
    const choiceIds = buildDuelQueue({ problems, profile: defaultProfile, scope: 'choice', seed: 7 })
    const availableChoiceIds = new Set(problems.filter((problem) => problem.questionFormat !== 'open').map((problem) => problem.id))
    expect(choiceIds).toHaveLength(DUEL_QUESTION_COUNT)
    expect(choiceIds.every((id) => availableChoiceIds.has(id))).toBe(true)

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

  it('对手进度由挑战种子和用时稳定重放，领先与落后会切换表情', () => {
    const opening = getDuelLiveState({ opponentId: 'zeng-yuxin', challengeSeed: 42, elapsedMs: 0, playerCompleted: 0 })
    const pressure = getDuelLiveState({ opponentId: 'zeng-yuxin', challengeSeed: 42, elapsedMs: 4 * 60_000, playerCompleted: 0 })
    const comeback = getDuelLiveState({ opponentId: 'zeng-yuxin', challengeSeed: 42, elapsedMs: 60_000, playerCompleted: 2 })
    expect(opening.opponentCompleted).toBe(0)
    expect(pressure.opponentCompleted).toBeGreaterThan(0)
    expect(pressure.emotion).toBe('smug')
    expect(comeback.emotion).toBe('nervous')
    expect(getDuelLiveState({ opponentId: 'zeng-yuxin', challengeSeed: 42, elapsedMs: 4 * 60_000, playerCompleted: 0 })).toEqual(pressure)
  })

  it('持平、结算胜负和动作映射各自使用不同反馈', () => {
    const tied = getDuelLiveState({ opponentId: 'yuan-yue', challengeSeed: 9, elapsedMs: 0, playerCompleted: 0 })
    const opponentDefeated = getDuelLiveState({ opponentId: 'yuan-yue', challengeSeed: 9, elapsedMs: 5 * 60_000, playerCompleted: 5, settled: 'victory' })
    const opponentVictorious = getDuelLiveState({ opponentId: 'yuan-yue', challengeSeed: 9, elapsedMs: 20 * 60_000, playerCompleted: 3, settled: 'defeat' })

    expect(tied).toMatchObject({ emotion: 'focused', gap: 0 })
    expect(opponentDefeated).toMatchObject({ emotion: 'defeated', playerCompleted: 5 })
    expect(opponentVictorious).toMatchObject({ emotion: 'victorious', opponentCompleted: 5 })
    expect(opponentVictorious.opponentProgressPercent).toBe(100)
    expect(getDuelOpponentPose(tied.emotion)).toBe('challenge')
    expect(getDuelOpponentPose('smug')).toBe('victory')
    expect(getDuelOpponentPose('nervous')).toBe('speaking')
    expect(getDuelOpponentPose(opponentDefeated.emotion)).toBe('speaking')
    expect(getDuelOpponentPose(opponentVictorious.emotion)).toBe('victory')
  })
})
