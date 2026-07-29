import katex from 'katex'
import { describe, expect, it } from 'vitest'
import { curatedBankPoints } from './banks/curatedBank'
import { getProblemRole } from '../domain/curriculum'
import {
  findDuplicateMethodGroups,
  getMathFragments,
  getProblemTextFields,
  hasBalancedMathDelimiters,
  hasUnwrappedMathSymbols
} from './questionQuality'
import { DEPRECATED_SEED_IDS, makeSeedProblems } from './seed'

describe('高质量考研数学题库', () => {
  const seeds = makeSeedProblems(1_000_000)
  const curated = seeds.filter((problem) => problem.id.startsWith('zy27-'))

  it('新增 624 道资料考点重构题，总题数为 698 且 ID 稳定唯一', () => {
    expect(curatedBankPoints).toHaveLength(156)
    expect(curated).toHaveLength(624)
    expect(seeds).toHaveLength(698)
    expect(new Set(seeds.map((problem) => problem.id)).size).toBe(seeds.length)
    expect(DEPRECATED_SEED_IDS.every((id) => !seeds.some((problem) => problem.id === id))).toBe(true)
  })

  it('方法指纹唯一，阻止仅换数字或同解法题再次混入', () => {
    expect(seeds.every((problem) => problem.methodFingerprint)).toBe(true)
    expect(findDuplicateMethodGroups(seeds)).toEqual([])
    expect(new Set(curated.map((problem) => problem.methodFingerprint)).size).toBe(624)
  })

  it('每个资料考点恰好包含四种不同认知任务', () => {
    for (const point of curatedBankPoints) {
      const cards = curated.filter((problem) => problem.id.startsWith(`zy27-${point.id}-`))
      expect(cards.map((problem) => problem.id.split('-').at(-1)).sort()).toEqual(['application', 'audit', 'choice', 'definition'])
    }
  })

  it('624 道新增题按结构化标签进入正确做题类型', () => {
    const expectedRoles = {
      definition: 'concept',
      choice: 'choice',
      audit: 'exercise',
      application: 'example'
    } as const
    for (const problem of curated) {
      const task = problem.id.split('-').at(-1) as keyof typeof expectedRoles
      expect(getProblemRole(problem)).toBe(expectedRoles[task])
    }
  })

  it('新增题均有来源页码、错因、答案和双路线解析', () => {
    const weak: string[] = []
    for (const problem of curated) {
      expect(problem.source).toContain('张宇')
      expect(problem.page).toMatch(/PDF\s*\d+/)
      if (problem.statement.length <= 12) weak.push(`${problem.id}:statement`)
      if (problem.coreMethod.length <= 12) weak.push(`${problem.id}:coreMethod`)
      if (problem.mistakes.length <= 12) weak.push(`${problem.id}:mistakes`)
      if (problem.answerText.length <= 18) weak.push(`${problem.id}:answerText`)
      expect(problem.solutionMethods).toHaveLength(2)
      expect(problem.solutionMethods.every((method) => method.content.length > 20)).toBe(true)
    }
    expect(weak).toEqual([])
  })

  it('所有选择题答案键有效且只有一个正确答案', () => {
    const choices = seeds.filter((problem) => problem.questionFormat !== 'open')
    expect(choices.length).toBeGreaterThan(170)
    for (const problem of choices) {
      const optionIds = new Set(problem.options.map((option) => option.id))
      expect(problem.options.length).toBeGreaterThanOrEqual(2)
      expect(problem.correctOptionIds).toHaveLength(problem.questionFormat === 'single-choice' ? 1 : problem.correctOptionIds.length)
      expect(problem.correctOptionIds.length).toBeGreaterThan(0)
      expect(problem.correctOptionIds.every((id) => optionIds.has(id))).toBe(true)
    }
  })

  it('全题库数学分隔符配对、无散落 Unicode 公式且每段均能被 KaTeX 严格解析', () => {
    const failures: string[] = []
    for (const problem of seeds) {
      for (const text of getProblemTextFields(problem)) {
        if (!hasBalancedMathDelimiters(text)) failures.push(`${problem.id}:unbalanced`)
        if (hasUnwrappedMathSymbols(text)) failures.push(`${problem.id}:unwrapped-unicode`)
        for (const formula of getMathFragments(text)) {
          try {
            katex.renderToString(formula, { throwOnError: true, strict: 'error' })
          } catch (error) {
            failures.push(`${problem.id}:${formula}:${String(error)}`)
          }
        }
      }
    }
    expect(failures).toEqual([])
  })

  it('新增题文本不含 OCR 乱码或空白占位内容', () => {
    const forbidden = /�|锟|待补充|TODO|BUSY|解析略|同上/
    const failures = curated.flatMap((problem) => getProblemTextFields(problem)
      .filter((text) => forbidden.test(text))
      .map((text) => `${problem.id}:${text}`))
    expect(failures).toEqual([])
  })
})
