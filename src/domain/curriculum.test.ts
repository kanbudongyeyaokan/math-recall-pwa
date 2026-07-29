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

  it('不因共享关键词把概率论题误归入高数讲次', () => {
    expect(getProblemLectureIds(problem({
      title: '分布函数的四条硬条件',
      statement: '分布函数为什么必须右连续？',
      source: '斗破数学 · 考纲原创同型',
      page: '',
      tags: ['概率论', '定义', '分布函数']
    }))).toEqual([])
  })

  it('不因函数与极值等共享词把线代题误归入高数讲次', () => {
    expect(getProblemLectureIds(problem({
      title: '二次型与特征值',
      statement: '求矩阵对应二次型的极值。',
      source: '斗破数学 · 考纲原创同型',
      page: '',
      tags: ['线性代数', '二次型', '特征值']
    }))).toEqual([])
  })
})
