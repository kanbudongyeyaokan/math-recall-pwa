import { describe, expect, it } from 'vitest'
import { makeSeedProblems } from './seed'

describe('原创考研题库', () => {
  const seeds = makeSeedProblems(1_000_000)

  it('包含 40 张稳定 ID 的题卡', () => {
    expect(seeds).toHaveLength(40)
    expect(new Set(seeds.map((problem) => problem.id)).size).toBe(40)
  })

  it('计算题至少提供两种解析路线', () => {
    const problemCards = seeds.filter((problem) => problem.kind === 'problem')
    expect(problemCards.length).toBeGreaterThanOrEqual(25)
    expect(problemCards.every((problem) => problem.solutionMethods.length >= 2)).toBe(true)
  })

  it('选择题都有选项和有效答案键', () => {
    const choices = seeds.filter((problem) => problem.questionFormat !== 'open')
    expect(choices.length).toBeGreaterThanOrEqual(15)
    for (const problem of choices) {
      const optionIds = new Set(problem.options.map((option) => option.id))
      expect(problem.options.length).toBeGreaterThanOrEqual(2)
      expect(problem.correctOptionIds.length).toBeGreaterThanOrEqual(1)
      expect(problem.correctOptionIds.every((id) => optionIds.has(id))).toBe(true)
    }
  })
})
