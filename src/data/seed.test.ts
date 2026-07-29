import { describe, expect, it } from 'vitest'
import { makeSeedProblems } from './seed'

describe('原创考研题库', () => {
  const seeds = makeSeedProblems(1_000_000)

  it('包含 76 张稳定 ID 的题卡', () => {
    expect(seeds).toHaveLength(76)
    expect(new Set(seeds.map((problem) => problem.id)).size).toBe(76)
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

  it('基础结论训练覆盖高数 18 讲且每题都有双解析', () => {
    const conclusions = seeds.filter((problem) => problem.source === '斗破数学 · 基础结论原创训练')
    expect(conclusions).toHaveLength(36)
    for (let lecture = 1; lecture <= 18; lecture += 1) {
      expect(conclusions.filter((problem) => problem.tags.includes(`第${lecture}讲`))).toHaveLength(2)
    }
    expect(conclusions.every((problem) => problem.solutionMethods.length === 2)).toBe(true)
  })
})
