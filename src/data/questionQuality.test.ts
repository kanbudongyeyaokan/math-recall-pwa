import { describe, expect, it } from 'vitest'
import type { Problem } from '../types'
import { makeSeedProblems } from './seed'
import { auditProblemBank, enrichProblemQuality, getQualitySummary } from './questionQuality'

function problem(id: string, statement: string): Problem {
  return {
    id,
    kind: 'problem',
    title: '参数极限',
    statement,
    source: '个人整理',
    page: '12',
    tags: ['高等数学', '极限'],
    coreMethod: '先提取最高阶，再比较分子分母的主导项。',
    mistakes: '不能只比较表面次数。',
    answerText: '提取主导项后约去公共因子，极限为给定常数。',
    questionFormat: 'open',
    options: [],
    correctOptionIds: [],
    solutionMethods: [
      { id: 'm1', title: '主导项', content: '先同除最高次幂，再取极限得到结论。' },
      { id: 'm2', title: '换元复核', content: '令变量倒数为新变量，从零点极限复核。' }
    ],
    createdAt: 1,
    updatedAt: 1,
    nextReviewAt: 1,
    intervalIndex: -1,
    reviewCount: 0
  }
}

describe('题库质量审计 2.0', () => {
  it('只换数字和字母的同构题只保留一题进入随机池', () => {
    const audited = auditProblemBank([
      problem('a', '计算 $\\lim_{x\\to\\infty}(2x+1)/(x+3)$。'),
      problem('b', '计算 $\\lim_{t\\to\\infty}(5t+7)/(t+9)$。')
    ], 10)
    expect(audited.map((item) => item.qualityStatus)).toEqual(['verified', 'needs-review'])
    expect(audited[1].qualityIssues).toContainEqual(expect.objectContaining({ code: 'semantic-duplicate', severity: 'error' }))
  })

  it('选项与答案键冲突时进入待人工确认区', () => {
    const candidate = problem('choice', '下列结论正确的是（ ）。')
    const audited = enrichProblemQuality({
      ...candidate,
      questionFormat: 'single-choice',
      options: [{ id: 'A', text: '结论一' }, { id: 'B', text: '结论二' }],
      correctOptionIds: ['B'],
      answerText: '正确选项为 A。'
    }, 10)
    expect(audited.qualityStatus).toBe('needs-review')
    expect(audited.qualityIssues).toContainEqual(expect.objectContaining({ code: 'answer-key-conflict' }))
  })

  it('清理派生模板后 192 道 PDF 精品题全部拥有学习元数据', () => {
    const seeds = makeSeedProblems(10)
    const summary = getQualitySummary(seeds)
    expect(summary.verified).toBe(192)
    expect(seeds.every((item) => item.semanticClusterId && item.difficulty && item.estimatedMinutes && item.discrimination && item.prerequisites)).toBe(true)
  })
})
