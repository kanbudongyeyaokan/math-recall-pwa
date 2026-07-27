import { describe, expect, it } from 'vitest'
import { defaultProfile } from '../db'
import { getStoryProgress } from './story'

describe('交大斗魂剧情进度', () => {
  it('新玩家从奶奶的序章出发', () => {
    const progress = getStoryProgress(defaultProfile)
    expect(progress.current.id).toBe('departure')
    expect(progress.remaining).toBe(1)
  })

  it('按真实做题数量解锁宿敌与后续对话', () => {
    const progress = getStoryProgress({ ...defaultProfile, totalReviews: 6 })
    expect(progress.current.id).toBe('rival')
    expect(progress.current.speaker).toBe('沈砺')
    expect(progress.next?.id).toBe('ally')
  })

  it('三百题后抵达交大终章', () => {
    const progress = getStoryProgress({ ...defaultProfile, totalReviews: 300 })
    expect(progress.current.id).toBe('future')
    expect(progress.percent).toBe(100)
  })
})
