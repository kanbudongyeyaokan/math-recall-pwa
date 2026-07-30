import { describe, expect, it } from 'vitest'
import type { Problem, ReviewLog } from '../types'
import { buildAdaptiveQueue } from './adaptivePractice'

function problem(id: string, tag: string, difficulty: 1 | 2 | 3 | 4 | 5): Problem {
  return {
    id,
    kind: 'problem',
    title: id,
    statement: `完整题面 ${id}`,
    source: '测试',
    page: '1',
    tags: ['高等数学', tag],
    coreMethod: `方法 ${tag}`,
    mistakes: '检查条件',
    answerText: '完整答案',
    questionFormat: 'open',
    options: [],
    correctOptionIds: [],
    solutionMethods: [],
    difficulty,
    discrimination: difficulty,
    estimatedMinutes: 5,
    qualityStatus: 'verified',
    createdAt: 1,
    updatedAt: 1,
    nextReviewAt: 1,
    intervalIndex: -1,
    reviewCount: 0
  }
}

function review(problemId: string, rating: ReviewLog['rating'], reviewedAt: number, durationSeconds = 300): ReviewLog {
  return { problemId, rating, reviewedAt, durationSeconds, nextReviewAt: reviewedAt + 1, intervalIndex: 0, xpEarned: 1 }
}

describe('自适应刷题队列', () => {
  const problems = [
    problem('foundation', '极限定义', 1),
    problem('normal', '极限计算', 2),
    problem('weak', '连续', 3),
    problem('hard', '参数极限', 5)
  ]

  it('基础巩固优先低难度未掌握题', () => {
    expect(buildAdaptiveQueue({ problems, reviews: [], mode: 'foundation', limit: 1, seed: 1, now: 100 })[0]).toBe('foundation')
  })

  it('薄弱突破优先最近失败、提示或明显超时的题', () => {
    const reviews = [review('normal', 'independent', 80), review('weak', 'again', 90, 900)]
    expect(buildAdaptiveQueue({ problems, reviews, mode: 'weak', limit: 1, seed: 1, now: 100 })[0]).toBe('weak')
  })

  it('综合模式结果稳定、无重复并优先覆盖不同知识点', () => {
    const first = buildAdaptiveQueue({ problems, reviews: [], mode: 'mixed', limit: 4, seed: 17, now: 100 })
    const second = buildAdaptiveQueue({ problems, reviews: [], mode: 'mixed', limit: 4, seed: 17, now: 100 })
    expect(first).toEqual(second)
    expect(new Set(first).size).toBe(4)
  })

  it('模拟冲刺优先高难度和高区分度题', () => {
    expect(buildAdaptiveQueue({ problems, reviews: [], mode: 'sprint', limit: 1, seed: 1, now: 100 })[0]).toBe('hard')
  })
})
