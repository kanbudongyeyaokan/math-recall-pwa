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
})
