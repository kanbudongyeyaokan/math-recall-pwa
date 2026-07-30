import katex from 'katex'
import { describe, expect, it } from 'vitest'
import { curatedBankPoints } from './banks/curatedBank'
import { getProblemLectureIds, getProblemRole } from '../domain/curriculum'
import {
  findDuplicateMethodGroups,
  getMathFragments,
  getProblemTextFields,
  hasBalancedMathDelimiters,
  hasUnwrappedMathSymbols,
  isProblemEligibleForPractice
} from './questionQuality'
import { isRetiredBuiltInProblem, makeSeedProblems } from './seed'

describe('PDF 精品考研数学题库', () => {
  const seeds = makeSeedProblems(1_000_000)
  const curated = seeds.filter((problem) => problem.id.startsWith('zy27-'))
  const sourceQuestions = seeds.filter((problem) => problem.id.startsWith('zy30-source-'))

  it('仅保留 PDF 题型重构与基础30讲来源题，ID 稳定唯一', () => {
    expect(curatedBankPoints).toHaveLength(156)
    expect(curated).toHaveLength(156)
    expect(sourceQuestions).toHaveLength(36)
    expect(seeds).toHaveLength(192)
    expect(new Set(seeds.map((problem) => problem.id)).size).toBe(seeds.length)
    expect(seeds.every((problem) => problem.kind === 'problem')).toBe(true)
    expect(seeds.every((problem) => /张宇|核心计算/.test(problem.source))).toBe(true)
    expect(seeds.every((problem) => !isRetiredBuiltInProblem(problem))).toBe(true)
    expect(seeds.every((problem) => !/(?:命题辨析|错解审判|错解辨析)/.test(problem.title))).toBe(true)
    expect(seeds.every((problem) => !problem.tags.some((tag) => ['定义', '定义与判据', '命题辨析', '错解辨析'].includes(tag)))).toBe(true)
  })

  it('基础30讲来源精选覆盖 18 讲的例题与课后题', () => {
    expect(sourceQuestions.filter((problem) => problem.tags.includes('经典例题'))).toHaveLength(18)
    expect(sourceQuestions.filter((problem) => problem.tags.includes('课后训练'))).toHaveLength(18)
    expect(new Set(sourceQuestions.flatMap(getProblemLectureIds))).toEqual(new Set(
      Array.from({ length: 18 }, (_, index) => `lecture-${String(index + 1).padStart(2, '0')}`)
    ))
    for (let lecture = 1; lecture <= 18; lecture += 1) {
      expect(sourceQuestions.filter((problem) => problem.tags.includes(`第${lecture}讲`))).toHaveLength(2)
    }
    for (const problem of sourceQuestions) {
      expect(problem.source).toContain('张宇《基础30讲》')
      expect(problem.page).toMatch(/^PDF \d+ · 书页 \d+$/)
      expect(problem.solutionMethods).toHaveLength(2)
      expect(problem.solutionMethods.every((method) => method.content.length > 30)).toBe(true)
      expect(problem.methodFingerprint).toMatch(/^zy30-source:/)
      expect(isProblemEligibleForPractice(problem)).toBe(true)
    }
  })

  it('每个资料考点只生成一道经典应用题，不再派生定义或辨析模板', () => {
    for (const point of curatedBankPoints) {
      const cards = curated.filter((problem) => problem.id.startsWith(`zy27-${point.id}-`))
      expect(cards).toHaveLength(1)
      expect(cards[0].id).toBe(`zy27-${point.id}-application`)
      expect(getProblemRole(cards[0])).toBe('example')
      expect(cards[0].source).toContain('张宇')
      expect(cards[0].page).toMatch(/PDF\s*\d+/)
    }
  })

  it('方法指纹唯一，阻止仅换数字或同解法题再次混入', () => {
    expect(seeds.every((problem) => problem.methodFingerprint)).toBe(true)
    expect(findDuplicateMethodGroups(seeds)).toEqual([])
    expect(new Set(curated.map((problem) => problem.methodFingerprint)).size).toBe(curated.length)
  })

  it('全部题目有来源页码、错因、答案和双路线解析', () => {
    const weak: string[] = []
    for (const problem of seeds) {
      if (!problem.page) weak.push(`${problem.id}:page`)
      if (problem.statement.length <= 12) weak.push(`${problem.id}:statement`)
      if (problem.coreMethod.length <= 12) weak.push(`${problem.id}:coreMethod`)
      if (problem.mistakes.length <= 12) weak.push(`${problem.id}:mistakes`)
      if (problem.answerText.length <= 5) weak.push(`${problem.id}:answerText`)
      expect(problem.solutionMethods).toHaveLength(2)
      expect(problem.solutionMethods.every((method) => method.content.length > 20)).toBe(true)
    }
    expect(weak).toEqual([])
  })

  it('保留下来的 PDF 选择题答案键有效', () => {
    const choices = seeds.filter((problem) => problem.questionFormat !== 'open')
    expect(choices.length).toBeGreaterThan(0)
    for (const problem of choices) {
      const optionIds = new Set(problem.options.map((option) => option.id))
      expect(problem.options.length).toBeGreaterThanOrEqual(2)
      expect(problem.correctOptionIds.length).toBeGreaterThan(0)
      expect(problem.correctOptionIds.every((id) => optionIds.has(id))).toBe(true)
    }
  })

  it('所有公式分隔符配对、无散落 Unicode 公式且可被 KaTeX 严格解析', () => {
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

  it('题目文本不含 OCR 乱码或空白占位内容', () => {
    const forbidden = /�|锟|待补充|TODO|BUSY|解析略|同上/
    const failures = seeds.flatMap((problem) => getProblemTextFields(problem)
      .filter((text) => forbidden.test(text))
      .map((text) => `${problem.id}:${text}`))
    expect(failures).toEqual([])
  })
})
