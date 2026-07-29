import katex from 'katex'
import { describe, expect, it } from 'vitest'
import { getMathFragments, hasBalancedMathDelimiters } from './questionQuality'
import { THEOREM_KNOWLEDGE, splitTheoremReferences } from './theoremKnowledge'

describe('可点击定理知识库', () => {
  it('内置 20 个高频定理且 ID、别名均唯一', () => {
    expect(THEOREM_KNOWLEDGE).toHaveLength(20)
    expect(new Set(THEOREM_KNOWLEDGE.map((theorem) => theorem.id)).size).toBe(THEOREM_KNOWLEDGE.length)
    const aliases = THEOREM_KNOWLEDGE.flatMap((theorem) => theorem.aliases)
    expect(new Set(aliases).size).toBe(aliases.length)
  })

  it('优先识别更长的定理名称并保留普通正文顺序', () => {
    const segments = splitTheoremReferences('先用正权积分中值定理，再比较积分中值定理。')
    expect(segments.filter((segment) => segment.type === 'theorem').map((segment) => segment.theorem?.id)).toEqual([
      'weighted-integral-mean-value',
      'integral-mean-value'
    ])
    expect(segments.map((segment) => segment.text).join('')).toBe('先用正权积分中值定理，再比较积分中值定理。')
  })

  it('每条讲解都有条件、结论、直觉、误区与例子', () => {
    for (const theorem of THEOREM_KNOWLEDGE) {
      expect(theorem.conditions.length).toBeGreaterThan(0)
      expect(theorem.formulas.length).toBeGreaterThan(0)
      expect(theorem.traps.length).toBeGreaterThan(0)
      expect(theorem.summary.length).toBeGreaterThan(12)
      expect(theorem.conclusion.length).toBeGreaterThan(12)
      expect(theorem.intuition.length).toBeGreaterThan(12)
      expect(theorem.example.length).toBeGreaterThan(12)
    }
  })

  it('讲解正文数学分隔符配对，所有标准公式均可被 KaTeX 严格解析', () => {
    const failures: string[] = []
    for (const theorem of THEOREM_KNOWLEDGE) {
      const prose = [theorem.summary, ...theorem.conditions, theorem.conclusion, theorem.intuition, ...theorem.traps, theorem.example]
      for (const text of prose) {
        if (!hasBalancedMathDelimiters(text)) failures.push(theorem.id + ':unbalanced')
        for (const formula of getMathFragments(text)) {
          try { katex.renderToString(formula, { throwOnError: true, strict: 'error' }) }
          catch (error) { failures.push(theorem.id + ':' + formula + ':' + String(error)) }
        }
      }
      for (const formula of theorem.formulas) {
        try { katex.renderToString(formula, { throwOnError: true, strict: 'error' }) }
        catch (error) { failures.push(theorem.id + ':' + formula + ':' + String(error)) }
      }
    }
    expect(failures).toEqual([])
  })
})
