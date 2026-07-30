import { describe, expect, it } from 'vitest'
import { defaultProfile } from '../db'
import type { Problem, ReviewLog } from '../types'
import { applyProblemMasteryToProfile, getMasteryPower, getProblemMastery } from './mastery'

const problem: Problem = {
  id: 'q1', kind: 'problem', title: '题', statement: '题面', source: '', page: '', tags: [], coreMethod: '', mistakes: '', answerText: '',
  questionFormat: 'single-choice', options: [], correctOptionIds: ['A'], solutionMethods: [], createdAt: 1, updatedAt: 1,
  nextReviewAt: 1, intervalIndex: -1, reviewCount: 0
}

const review = (rating: ReviewLog['rating'], isCorrect: boolean, reviewedAt: number): ReviewLog => ({
  problemId: 'q1', rating, isCorrect, reviewedAt, nextReviewAt: reviewedAt + 1, intervalIndex: 0, xpEarned: 1
})

describe('真实掌握度', () => {
  it('选择题必须答对且独立完成才算掌握，最近退步会撤销掌握', () => {
    expect(getProblemMastery(problem, [review('independent', false, 1)]).mastered).toBe(false)
    expect(getProblemMastery(problem, [review('independent', true, 1)]).mastered).toBe(true)
    expect(getProblemMastery(problem, [review('independent', true, 1), review('again', false, 2)]).mastered).toBe(false)
  })

  it('先错后独立完成会计入订正，掌握力只统计唯一掌握、订正和 Boss', () => {
    const reviews = [review('again', false, 1), review('independent', true, 2)]
    const next = applyProblemMasteryToProfile(defaultProfile, problem, reviews)
    expect(next.masteredProblemIds).toEqual(['q1'])
    expect(next.correctedProblemIds).toEqual(['q1'])
    expect(getMasteryPower(next)).toBe(2)
  })

  it('明显超时会降低掌握评分，防止只靠自评跳过真实薄弱点', () => {
    const timedProblem = { ...problem, estimatedMinutes: 5 }
    expect(getProblemMastery(timedProblem, [{ ...review('independent', true, 1), durationSeconds: 300 }]).score).toBe(78)
    const overtime = getProblemMastery(timedProblem, [{ ...review('independent', true, 1), durationSeconds: 700 }])
    expect(overtime.score).toBe(66)
    expect(overtime.mastered).toBe(false)
  })
})
