import { describe, expect, it } from 'vitest'
import { formatProblemPageLabel, isChoiceAnswerCorrect } from './questions'

describe('选择题判分', () => {
  it('单选答案完全匹配时正确', () => {
    expect(isChoiceAnswerCorrect(['B'], ['B'])).toBe(true)
    expect(isChoiceAnswerCorrect(['A'], ['B'])).toBe(false)
  })

  it('多选忽略顺序，但不接受漏选或多选', () => {
    expect(isChoiceAnswerCorrect(['C', 'A'], ['A', 'C'])).toBe(true)
    expect(isChoiceAnswerCorrect(['A'], ['A', 'C'])).toBe(false)
    expect(isChoiceAnswerCorrect(['A', 'B', 'C'], ['A', 'C'])).toBe(false)
  })
})

describe('题目页码显示', () => {
  it('只给普通页码补 P，保留已有资料前缀', () => {
    expect(formatProblemPageLabel('128')).toBe('P128')
    expect(formatProblemPageLabel('PDF 14-20、217-227')).toBe('PDF 14-20、217-227')
    expect(formatProblemPageLabel('P32')).toBe('P32')
    expect(formatProblemPageLabel('')).toBe('')
  })
})
