import type { PlayerProfile } from '../types'

export interface EncounterChoice {
  id: string
  label: string
  reply: string
  bondTargetId: string
  bondGain: number
  coinReward: number
}

export interface StoryEncounter {
  id: string
  threshold: number
  characterId: string
  title: string
  prompt: string
  choices: readonly [EncounterChoice, EncounterChoice]
}

const choice = (id: string, label: string, reply: string, bondTargetId: string): EncounterChoice => ({
  id, label, reply, bondTargetId, bondGain: 8, coinReward: 12
})

export const STORY_ENCOUNTERS: readonly StoryEncounter[] = [
  { id: 'family-call', threshold: 6, characterId: 'chen-xiulan', title: '深夜的一通电话', prompt: '母亲问你最近是不是太累。你准备怎样回答？', choices: [choice('honest', '坦白压力，也说清计划', '不用装得什么都不怕。能照顾好自己，我们才放心。', 'chen-xiulan'), choice('steady', '先让她安心，再继续训练', '你稳稳向前就好，家里永远留着热饭。', 'he-jiancheng')] },
  { id: 'rival-dare', threshold: 18, characterId: 'pei-shenxing', title: '对手的邀战', prompt: '裴慎行把一套限时题放到你桌前。', choices: [choice('accept', '当场接下，按时交卷', '有胆量。下次我会换一套更难的。', 'pei-shenxing'), choice('prepare', '先补短板，三天后再战', '能忍住逞强，也算你看得清自己。', 'zhou-shouyuan')] },
  { id: 'moon-proof', threshold: 35, characterId: 'lin-jianyue', title: '月下证明', prompt: '林见月指出你的结论正确，但论证少了一个条件。', choices: [choice('rebuild', '从定义重写完整证明', '我欣赏的不是你答对，而是你肯把缺口补到底。', 'lin-jianyue'), choice('counterexample', '先找反例确认条件必要性', '先证明它不能被删掉，再把它写回来。很漂亮。', 'lin-jianyue')] },
  { id: 'plan-night', threshold: 70, characterId: 'xu-tang', title: '计划表上的空白', prompt: '许棠发现你的计划没有休息时间。', choices: [choice('rest', '留出恢复时间，保证长期输出', '计划不是惩罚表。能执行到最后，才叫计划。', 'xu-tang'), choice('walk', '约伙伴散步后再继续', '脑子松下来，卡住的结构反而可能浮出来。', 'luo-yiming')] },
  { id: 'night-train', threshold: 105, characterId: 'su-wanqiao', title: '夜班列车', prompt: '旅途中只有四十分钟安静时间，你们决定怎样用？', choices: [choice('quiz', '互相口述定义与判据', '不用纸也能讲清楚，才是真的装进了脑子。', 'su-wanqiao'), choice('one-problem', '共同拆一道经典题', '一题拆透，比匆忙翻十页更像抵达。', 'su-wanqiao')] },
  { id: 'mock-defeat', threshold: 150, characterId: 'han-che', title: '模拟赛失利', prompt: '韩澈赢下限时赛，等你决定下一步。', choices: [choice('review', '逐项复盘失分原因', '输赢先放下。你能把原因拆准，下次就难打了。', 'han-che'), choice('rematch', '订正后约定再次对决', '我等的是变强后的你，不是带着情绪重来。', 'shen-li')] },
  { id: 'summer-duel', threshold: 205, characterId: 'tang-zhixia', title: '知夏争锋', prompt: '唐知夏提出交换各自最得意的解法。', choices: [choice('share', '先展示自己的多解路线', '肯亮出真本事的人，才有资格做我的搭档。', 'tang-zhixia'), choice('listen', '先听她的路线并指出边界', '你不是附和，你真的看见了方法的边界。', 'tang-zhixia')] },
  { id: 'family-future', threshold: 270, characterId: 'he-jiancheng', title: '未来的饭桌', prompt: '父亲问：等这一程结束，你最想先做什么？', choices: [choice('home', '带爸妈去看看更大的世界', '先把自己的路走好。到时候，我们一起去。', 'he-jiancheng'), choice('work', '用所学能力创造稳定生活', '你有自己的本事，比什么承诺都让人踏实。', 'chen-xiulan')] }
] as const

export function getPendingEncounter(profile: PlayerProfile) {
  return STORY_ENCOUNTERS.find((encounter) => profile.totalReviews >= encounter.threshold && !profile.storyChoices[encounter.id])
}

export function getBondStatus(points: number) {
  if (points >= 48) return '生死相托'
  if (points >= 32) return '并肩知己'
  if (points >= 16) return '彼此信任'
  if (points >= 8) return '留下印象'
  return '初次相遇'
}
