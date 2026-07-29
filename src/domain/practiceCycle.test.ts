import { describe, expect, it } from 'vitest'
import {
  getPracticeCycleProgress,
  getUnseenPracticeIds,
  markPracticeProblemSeen,
  preparePracticeCycle,
  shuffleProblemIds
} from './practiceCycle'

describe('按讲随机不重复题池', () => {
  const ids = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6']

  it('同一轮保持固定随机顺序且不丢题', () => {
    const first = shuffleProblemIds(ids, 42)
    expect(first).toEqual(shuffleProblemIds(ids, 42))
    expect(new Set(first)).toEqual(new Set(ids))
    expect(first).not.toEqual(ids)
  })

  it('重新进入后排除本轮已刷题，并把新导入题追加到本轮', () => {
    const initial = preparePracticeCycle('lecture-01', ids, undefined, 42).state
    const seen = markPracticeProblemSeen(initial, initial.orderIds[0])
    const resumed = preparePracticeCycle('lecture-01', [...ids, 'q7'], seen, 99).state
    expect(resumed.cycle).toBe(1)
    expect(getUnseenPracticeIds(resumed)).not.toContain(initial.orderIds[0])
    expect(getUnseenPracticeIds(resumed)).toContain('q7')
    expect(getPracticeCycleProgress(resumed, [...ids, 'q7']).seen).toBe(1)
  })

  it('只有整讲全部刷完后才开启下一轮并重新洗牌', () => {
    const initial = preparePracticeCycle('lecture-06', ids, undefined, 7).state
    const completed = ids.reduce((state, id) => markPracticeProblemSeen(state, id), initial)
    const next = preparePracticeCycle('lecture-06', ids, completed, 99)
    expect(next.restarted).toBe(true)
    expect(next.state.cycle).toBe(2)
    expect(next.state.seenIds).toEqual([])
    expect(getUnseenPracticeIds(next.state)).toHaveLength(ids.length)
  })

  it('板块筛选只返回本轮未刷的交集，不提前重置整讲', () => {
    const initial = preparePracticeCycle('lecture-03', ids, undefined, 12).state
    const seen = markPracticeProblemSeen(initial, 'q1')
    expect(getUnseenPracticeIds(seen, ['q1', 'q2'])).toEqual(['q2'])
    expect(getUnseenPracticeIds(seen)).toHaveLength(ids.length - 1)
  })
})
