import { describe, expect, it } from 'vitest'
import type { Problem } from '../types'
import { getProblemLectureIds, getProblemRole, matchesPracticeSelection } from './curriculum'

function problem(overrides: Partial<Problem> = {}): Problem {
  return {
    id: 'private-1',
    kind: 'problem',
    title: '中值定理经典例题',
    statement: '使用 Lagrange 中值定理证明不等式',
    source: '张宇基础30讲 · 高等数学',
    page: '170',
    tags: ['经典例题', '第6讲'],
    coreMethod: '构造辅助函数并应用中值定理',
    mistakes: '遗漏区间条件',
    answerText: '证明略',
    questionFormat: 'open',
    options: [],
    correctOptionIds: [],
    solutionMethods: [],
    createdAt: 1,
    updatedAt: 1,
    nextReviewAt: 1,
    intervalIndex: -1,
    reviewCount: 0,
    ...overrides
  }
}

describe('高数18讲做题分类', () => {
  it('按教材印刷页码映射到对应讲次', () => {
    expect(getProblemLectureIds(problem())).toContain('lecture-06')
  })

  it('明确讲次标签优先于共享大类名称，避免相邻讲次重复计数', () => {
    expect(getProblemLectureIds(problem({
      title: '导数与微分经典例题',
      page: '99-118',
      tags: ['高等数学', '导数与微分', '第3讲']
    }))).toEqual(['lecture-03'])
  })

  it('识别经典例题并支持讲内板块筛选', () => {
    const item = problem()
    expect(getProblemRole(item)).toBe('example')
    expect(matchesPracticeSelection(item, {
      lectureId: 'lecture-06',
      sectionId: 'mean-value',
      role: 'example',
      label: '第 6 讲'
    })).toBe(true)
  })

  it('选择题优先归入选择题训练', () => {
    expect(getProblemRole(problem({ questionFormat: 'single-choice' }))).toBe('choice')
  })
})
