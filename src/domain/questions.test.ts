import { describe, expect, it } from 'vitest'
import { isChoiceAnswerCorrect } from './questions'

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
