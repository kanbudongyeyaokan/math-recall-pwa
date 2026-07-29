import katex from 'katex'
import { describe, expect, it } from 'vitest'
import { curatedBankPoints } from './banks/curatedBank'
import { calculusQualityExpansionPoints } from './banks/calculusQualityExpansionBank'
import { wuFoundationPoints } from './banks/wuFoundationRebuiltBank'
import { getProblemLectureIds, getProblemRole } from '../domain/curriculum'
import {
  findDuplicateMethodGroups,
  getMathFragments,
  getProblemTextFields,
  hasBalancedMathDelimiters,
  hasUnwrappedMathSymbols
} from './questionQuality'
import { DEPRECATED_SEED_IDS, LOW_CLARITY_SEED_IDS, makeSeedProblems } from './seed'

describe('高质量考研数学题库', () => {
  const seeds = makeSeedProblems(1_000_000)
  const curated = seeds.filter((problem) => problem.id.startsWith('zy27-'))

  it('删除 18 道低清晰度旧卡，新增 72 道经典方法精选题且 ID 稳定唯一', () => {
    expect(curatedBankPoints).toHaveLength(156)
    expect(wuFoundationPoints).toHaveLength(18)
    expect(calculusQualityExpansionPoints).toHaveLength(18)
    expect(curated).toHaveLength(606)
    expect(seeds.filter((problem) => problem.id.startsWith('wzx27-'))).toHaveLength(72)
    expect(seeds.filter((problem) => problem.id.startsWith('dpm20-'))).toHaveLength(72)
    expect(seeds).toHaveLength(824)
    expect(new Set(seeds.map((problem) => problem.id)).size).toBe(seeds.length)
    expect(DEPRECATED_SEED_IDS.every((id) => !seeds.some((problem) => problem.id === id))).toBe(true)
  })

  it('72 道高数方法强化题均为原创重构、双路线且能归入具体讲次', () => {
    const rebuilt = seeds.filter((problem) => problem.id.startsWith('wzx27-'))
    for (const problem of rebuilt) {
      expect(problem.source).toBe('斗破数学 · 高数基础题型原创重构')
      expect(problem.tags).toContain('高数基础方法强化')
      expect(problem.solutionMethods).toHaveLength(2)
      expect(getProblemLectureIds(problem)).not.toEqual([])
    }
    const choiceAnswers = rebuilt
      .filter((problem) => problem.questionFormat === 'single-choice')
      .flatMap((problem) => problem.correctOptionIds)
    expect(new Set(choiceAnswers)).toEqual(new Set(['A', 'B', 'C', 'D']))
  })

  it('方法指纹唯一，阻止仅换数字或同解法题再次混入', () => {
    expect(seeds.every((problem) => problem.methodFingerprint)).toBe(true)
    expect(findDuplicateMethodGroups(seeds)).toEqual([])
    expect(new Set(curated.map((problem) => problem.methodFingerprint)).size).toBe(606)
  })

  it('每个资料考点保留三至四种认知任务，低清晰度审判卡被精确移除', () => {
    for (const point of curatedBankPoints) {
      const cards = curated.filter((problem) => problem.id.startsWith(`zy27-${point.id}-`))
      const auditId = `zy27-${point.id}-audit`
      const expected = LOW_CLARITY_SEED_IDS.includes(auditId as typeof LOW_CLARITY_SEED_IDS[number])
        ? ['application', 'choice', 'definition']
        : ['application', 'audit', 'choice', 'definition']
      expect(cards.map((problem) => problem.id.split('-').at(-1)).sort()).toEqual(expected)
    }
  })

  it('生成式错解题不再使用脱离上下文的旧模板，选择题解析跟随真实答案位置', () => {
    const generated = seeds.filter((problem) => /^(zy27|wzx27|dpm20)-/.test(problem.id))
    expect(generated.every((problem) => !problem.statement.includes('某同学在一道相关题中'))).toBe(true)
    for (const problem of generated.filter((candidate) => candidate.id.endsWith('-choice'))) {
      expect(problem.solutionMethods[1].content).toContain(`应选 ${problem.correctOptionIds[0]}`)
      expect(problem.answerText).toContain(`正确选项为 ${problem.correctOptionIds[0]}`)
    }
  })

  it('72 道经典方法精选题覆盖 18 讲、双路线完整且题意自洽', () => {
    const expansion = seeds.filter((problem) => problem.id.startsWith('dpm20-'))
    expect(expansion.every((problem) => problem.source === '斗破数学 · 高数经典方法原创精选')).toBe(true)
    expect(expansion.every((problem) => problem.solutionMethods.length === 2)).toBe(true)
    expect(expansion.every((problem) => problem.statement.length > 18 && problem.answerText.length > 18)).toBe(true)
    expect(new Set(expansion.flatMap(getProblemLectureIds))).toEqual(new Set(
      Array.from({ length: 18 }, (_, index) => `lecture-${String(index + 1).padStart(2, '0')}`)
    ))
  })

  it('资料重构题按结构化标签进入正确做题类型', () => {
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
