import { describe, expect, it } from 'vitest'
import { defaultProfile } from '../db'
import { getRomanceRouteStatus, getStoryProgress, ROMANCE_ROUTES, STORY_CHAPTERS, STORY_CHARACTERS } from './story'

describe('交大斗魂剧情进度', () => {
  it('新玩家从父母与交大目标的序章出发', () => {
    const progress = getStoryProgress(defaultProfile)
    expect(progress.current.id).toBe('departure')
    expect(progress.remaining).toBe(1)
  })

  it('按真实掌握力解锁宿敌与后续对话', () => {
    const progress = getStoryProgress({ ...defaultProfile, masteredProblemIds: Array.from({ length: 32 }, (_, index) => `q${index}`) })
    expect(progress.current.id).toBe('yuan-speedboard')
    expect(progress.current.speaker).toBe('袁越')
    expect(progress.next?.id).toBe('two-methods')
  })

  it('掌握力达到三百后抵达交大终章', () => {
    const progress = getStoryProgress({ ...defaultProfile, masteredProblemIds: Array.from({ length: 300 }, (_, index) => `q${index}`) })
    expect(progress.current.id).toBe('future')
    expect(progress.percent).toBe(100)
  })

  it('收录主角与二十一名剧情角色，并只保留三条既定情缘路线', () => {
    expect(STORY_CHARACTERS).toHaveLength(22)
    expect(ROMANCE_ROUTES).toHaveLength(3)
    expect(ROMANCE_ROUTES.map((route) => route.id)).toEqual(['chen-yanjun', 'medusa', 'xiaoyixian'])
    expect(STORY_CHARACTERS.filter((character) => character.role === 'romance').map((character) => character.id))
      .toEqual(['chen-yanjun', 'medusa', 'xiaoyixian'])
  })

  it('七名核心角色具备待机、对白、胜利和对峙四种镜头', () => {
    const coreIds = ['he-yaokun', 'zeng-yuxin', 'yuan-yue', 'chen-ruibin', 'chen-yanjun', 'medusa', 'xiaoyixian']
    for (const characterId of coreIds) {
      const character = STORY_CHARACTERS.find((candidate) => candidate.id === characterId)
      expect(Object.keys(character?.portraits || {}).sort()).toEqual(['challenge', 'idle', 'speaking', 'victory'])
    }
  })

  it('每个人物档案完整，陈彦君拥有最多且贯穿全程的个人主线', () => {
    expect(STORY_CHARACTERS.every((character) => (
      character.backstory && character.motivation && character.firstMeeting && character.quote && character.relationship
    ))).toBe(true)
    const chapterCounts = STORY_CHAPTERS.reduce<Record<string, number>>((counts, chapter) => {
      counts[chapter.portraitId] = (counts[chapter.portraitId] || 0) + 1
      return counts
    }, {})
    expect(chapterCounts['chen-yanjun']).toBe(5)
    expect(chapterCounts['chen-yanjun']).toBeGreaterThan(Math.max(chapterCounts.medusa || 0, chapterCounts.xiaoyixian || 0))
  })

  it('情缘关系按未相识、相识、知己、恋人四阶段推进', () => {
    const route = ROMANCE_ROUTES[0]
    const milestones = [route.unlockAt - 1, route.unlockAt, route.confidantAt, route.partnerAt]
    expect(milestones.map((reviews) => getRomanceRouteStatus(route, reviews).label))
      .toEqual(['未相识', '相识', '知己', '恋人'])
  })
})
