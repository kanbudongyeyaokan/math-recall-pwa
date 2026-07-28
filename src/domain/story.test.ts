import { describe, expect, it } from 'vitest'
import { defaultProfile } from '../db'
import { getRomanceRouteStatus, getStoryProgress, ROMANCE_ROUTES, STORY_CHARACTERS } from './story'

describe('交大斗魂剧情进度', () => {
  it('新玩家从父母与交大目标的序章出发', () => {
    const progress = getStoryProgress(defaultProfile)
    expect(progress.current.id).toBe('departure')
    expect(progress.remaining).toBe(1)
  })

  it('按真实做题数量解锁宿敌与后续对话', () => {
    const progress = getStoryProgress({ ...defaultProfile, totalReviews: 32 })
    expect(progress.current.id).toBe('stone-steps')
    expect(progress.current.speaker).toBe('沈砺')
    expect(progress.next?.id).toBe('two-methods')
  })

  it('三百题后抵达交大终章', () => {
    const progress = getStoryProgress({ ...defaultProfile, totalReviews: 300 })
    expect(progress.current.id).toBe('future')
    expect(progress.percent).toBe(100)
  })

  it('收录主角与十五名剧情角色，并提供三条情缘路线', () => {
    expect(STORY_CHARACTERS).toHaveLength(16)
    expect(ROMANCE_ROUTES).toHaveLength(3)
  })

  it('情缘关系按未相识、相识、知己、恋人四阶段推进', () => {
    const route = ROMANCE_ROUTES[0]
    const milestones = [route.unlockAt - 1, route.unlockAt, route.confidantAt, route.partnerAt]
    expect(milestones.map((reviews) => getRomanceRouteStatus(route, reviews).label))
      .toEqual(['未相识', '相识', '知己', '恋人'])
  })
})
