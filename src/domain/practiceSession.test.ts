import { describe, expect, it } from 'vitest'
import {
  advancePracticeSession,
  completeSessionProblem,
  createPracticeSession,
  getPendingPracticeSession,
  sanitizePracticeSession,
  sessionMatchesRequest,
  updateSessionAnswer
} from './practiceSession'

describe('做题会话持久化', () => {
  const selection = { lectureId: 'lecture-01', role: 'all' as const, label: '第 1 讲' }

  it('保存题序、当前位置、作答状态并可继续到下一题', () => {
    const session = createPracticeSession({ mode: 'practice', selection, queueIds: ['q1', 'q2'], now: 1 })
    const answered = updateSessionAnswer(session, { thinking: true, selectedOptionIds: ['A'] }, 2)
    const completed = completeSessionProblem(answered, { problemId: 'q1', rating: 'independent', isCorrect: true }, 3)
    const next = advancePracticeSession(completed, 4)
    expect(next?.queueIndex).toBe(1)
    expect(next?.answer.problemId).toBe('q2')
    expect(next?.answer.selectedOptionIds).toEqual([])
    expect(next?.outcomes).toHaveLength(1)
  })

  it('只恢复相同筛选，并在题库变化后剔除失效题目', () => {
    const session = createPracticeSession({ mode: 'practice', selection, queueIds: ['q1', 'q2'], now: 1 })
    expect(sessionMatchesRequest(session, undefined, selection)).toBe(true)
    expect(sessionMatchesRequest(session, undefined, { ...selection, role: 'concept' })).toBe(false)
    expect(sanitizePracticeSession(session, new Set(['q2']))?.queueIds).toEqual(['q2'])
  })

  it('不同自适应模式不会错误恢复同一场会话', () => {
    const weakSelection = { ...selection, adaptiveMode: 'weak' as const }
    const session = createPracticeSession({ mode: 'practice', selection: weakSelection, queueIds: ['q1'], now: 1 })
    expect(sessionMatchesRequest(session, undefined, weakSelection)).toBe(true)
    expect(sessionMatchesRequest(session, undefined, { ...selection, adaptiveMode: 'foundation' })).toBe(false)
  })

  it('当前题被升级移除时保持在相近进度，已结算题自动前进', () => {
    const session = { ...createPracticeSession({ mode: 'practice', selection, queueIds: ['q1', 'q2', 'q3'], now: 1 }), queueIndex: 1 }
    const sanitized = sanitizePracticeSession(session, new Set(['q1', 'q3']))
    expect(sanitized?.queueIndex).toBe(1)
    expect(sanitized?.answer.problemId).toBe('q3')

    const completed = completeSessionProblem(createPracticeSession({ mode: 'practice', selection, queueIds: ['q1', 'q2'], now: 1 }), {
      problemId: 'q1', rating: 'independent', isCorrect: true
    }, 2)
    expect(getPendingPracticeSession(completed)?.queueIndex).toBe(1)
    expect(getPendingPracticeSession(completeSessionProblem({ ...completed, queueIndex: 1, answer: { ...completed.answer, problemId: 'q2' } }, {
      problemId: 'q2', rating: 'independent', isCorrect: true
    }, 3))).toBeUndefined()
  })

  it('突发邀战在刷新后保留题序、截止时间和随机种子', () => {
    const ambushSelection = {
      ...selection,
      mode: 'ambush' as const,
      challengeId: 'ambush-1',
      rivalId: 'zeng-yuxin',
      deadlineAt: 480_001,
      challengeSeed: 17
    }
    const session = createPracticeSession({ mode: 'ambush', selection: ambushSelection, queueIds: ['q5', 'q2', 'q9', 'q1', 'q7'], now: 1 })
    const restored = sanitizePracticeSession(session, new Set(session.queueIds))

    expect(restored?.selection).toEqual(ambushSelection)
    expect(restored?.queueIds).toEqual(['q5', 'q2', 'q9', 'q1', 'q7'])
    expect(sessionMatchesRequest(restored, undefined, ambushSelection)).toBe(true)
    expect(sessionMatchesRequest(restored, undefined, { ...ambushSelection, challengeId: 'ambush-2' })).toBe(false)
  })

  it('主动挑战在刷新后保留对手、题型范围、讲次和截止时间', () => {
    const duelSelection = {
      ...selection,
      mode: 'duel' as const,
      challengeId: 'duel-1',
      opponentId: 'chen-yanjun',
      duelScope: 'lecture' as const,
      duelLectureId: 'lecture-09',
      deadlineAt: 720_001,
      challengeSeed: 29
    }
    const session = createPracticeSession({ mode: 'duel', selection: duelSelection, queueIds: ['q8', 'q3', 'q6', 'q1', 'q4'], now: 1 })
    const restored = sanitizePracticeSession(session, new Set(session.queueIds))

    expect(restored?.selection).toEqual(duelSelection)
    expect(restored?.queueIds).toEqual(session.queueIds)
    expect(sessionMatchesRequest(restored, undefined, duelSelection)).toBe(true)
    expect(sessionMatchesRequest(restored, undefined, { ...duelSelection, challengeId: 'duel-2' })).toBe(false)
  })
})
