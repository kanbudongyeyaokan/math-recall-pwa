import { describe, expect, it } from 'vitest'
import { defaultProfile } from '../db'
import type { Problem } from '../types'
import { getTechniqueEffect, getTechniqueLevel, getTechniqueProgress, getTechniqueStageName, resolveTechnique } from './cultivation'

const problem: Problem = {
  id: 'p', kind: 'problem', title: '基础例题', statement: '', source: '', page: '', tags: [],
  coreMethod: '', mistakes: '', answerText: '', questionFormat: 'single-choice', options: [],
  correctOptionIds: ['A'], solutionMethods: [], createdAt: 1, updatedAt: 1, nextReviewAt: 1,
  intervalIndex: -1, reviewCount: 0, difficulty: 2
}

describe('功法触发与熟练度', () => {
  it('基础锻体诀在低难度正式题中触发并增加熟练度', () => {
    const result = resolveTechnique(defaultProfile, problem, 'independent', true)
    expect(result.technique.name).toBe('基础锻体诀')
    expect(result.triggered).toBe(true)
    expect(result.xpBonus).toBe(3)
    expect(result.masteryGained).toBe(1)
  })

  it('未解锁功法会回退到初始功法', () => {
    const result = resolveTechnique({ ...defaultProfile, activeTechniqueId: 'many-paths' }, problem, 'multiple')
    expect(result.technique.id).toBe('definition-heart')
  })

  it('熟练度按五阶成长并给出区间进度', () => {
    expect([0, 10, 30, 60, 120].map(getTechniqueLevel)).toEqual([1, 2, 3, 4, 5])
    expect(getTechniqueProgress(20)).toMatchObject({ level: 2, percent: 50, nextLevelAt: 30 })
    expect(getTechniqueStageName(4)).toBe('化境')
    expect(getTechniqueEffect(resolveTechnique(defaultProfile, problem, 'independent', true).technique, 3)).toMatchObject({ xpBonus: 5, coinBonus: 1 })
  })
})
