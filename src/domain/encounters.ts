import type { PlayerProfile } from '../types'
import { isStoryThresholdUnlocked } from './story'

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
  {
    id: 'family-call', threshold: 6, characterId: 'zhong-shanyan', title: '深夜的一通电话', prompt: '钟珊燕听出你声音里的疲惫。你准备怎样回答？',
    choices: [
      choice('honest', '坦白压力，也说清调整计划', '不用装得什么都不怕。你肯照顾好自己，我们才真正放心。', 'zhong-shanyan'),
      choice('steady', '先报平安，约好周末回家吃饭', '好。路要走，饭也要吃。周末我和你爸等你。', 'he-xinping')
    ]
  },
  {
    id: 'rival-dare', threshold: 18, characterId: 'zeng-yuxin', title: '超量邀战', prompt: '曾宇鑫把三套限时题放到你桌前，想让你打乱原定训练。',
    choices: [
      choice('accept', '只接最能暴露短板的一套', '还会挑战场？行，我等你交卷。', 'zeng-yuxin'),
      choice('prepare', '按原计划补短板，三天后再战', '能忍住逞强，也算你看得清自己。', 'zhou-shouyuan')
    ]
  },
  {
    id: 'moon-proof', threshold: 35, characterId: 'chen-yanjun', title: '补全证明', prompt: '陈彦君指出你的结论正确，但论证少了一个必要条件。',
    choices: [
      choice('rebuild', '从定义重写完整证明', '我欣赏的不是你答对，而是你肯把缺口补到底。', 'chen-yanjun'),
      choice('counterexample', '先找反例确认条件必要性', '先证明它不能被删掉，再把它写回来。这个顺序很漂亮。', 'chen-yanjun')
    ]
  },
  {
    id: 'plan-night', threshold: 70, characterId: 'xu-tang', title: '计划表上的空白', prompt: '许棠发现你的计划没有任何恢复时间。',
    choices: [
      choice('rest', '留出恢复时间，保证长期输出', '计划不是惩罚表。能执行到最后，才叫计划。', 'xu-tang'),
      choice('walk', '约同桌散步后再继续', '脑子松下来，卡住的结构反而可能浮出来。', 'luo-yiming')
    ]
  },
  {
    id: 'night-train', threshold: 105, characterId: 'chen-yanjun', title: '闭馆后的四十分钟', prompt: '回程只剩四十分钟安静时间，你和陈彦君决定怎样使用？',
    choices: [
      choice('quiz', '互相口述定义与判据', '不用纸也能讲清楚，才是真的装进了脑子。', 'chen-yanjun'),
      choice('one-problem', '共同拆透一道经典题', '一题拆透，比匆忙翻十页更像抵达。', 'chen-yanjun')
    ]
  },
  {
    id: 'queen-board', threshold: 125, characterId: 'medusa', title: '女王的战场选择', prompt: '榜单争论越来越响，美杜莎让你决定是否回应。',
    choices: [
      choice('ignore', '屏蔽噪声，继续当前专项', '能控制注意力，才有资格控制战局。', 'medusa'),
      choice('audit', '只提取对手暴露的有效短板', '把挑衅变成情报。你开始懂得怎样利用敌人了。', 'medusa')
    ]
  },
  {
    id: 'mock-defeat', threshold: 150, characterId: 'yuan-yue', title: '限时赛失利', prompt: '袁越赢下速度战，等你决定下一步。',
    choices: [
      choice('review', '逐项复盘慢在哪里', '你把原因拆得很准。下次，我不会再有这么大余量。', 'yuan-yue'),
      choice('rematch', '订正后约定再次对决', '带着改好的路径回来。情绪不会让计时器变慢。', 'yuan-yue')
    ]
  },
  {
    id: 'recovery-boundary', threshold: 175, characterId: 'xiaoyixian', title: '恢复也是功课', prompt: '小医仙判断你已经透支，但明天仍有重要训练。',
    choices: [
      choice('sleep', '停止加练，按恢复方案休息', '尊重身体不是软弱，是对长期目标负责。', 'xiaoyixian'),
      choice('light', '只做定义回忆，不再计算', '降低强度而不是彻底失联，这个边界很合适。', 'xiaoyixian')
    ]
  },
  {
    id: 'summer-duel', threshold: 205, characterId: 'medusa', title: '策略盟约', prompt: '美杜莎邀请你共同拆解三名宿敌的训练优势。',
    choices: [
      choice('share', '先公开自己的薄弱点', '敢让盟友看见真实缺口，合作才不是表演。', 'medusa'),
      choice('map', '先建立数量、速度、准确率地图', '先看全局再出手。你越来越像一个决策者。', 'medusa')
    ]
  },
  {
    id: 'public-ranking', threshold: 230, characterId: 'chen-ruibin', title: '公开比较', prompt: '陈睿斌再次截取你的单次低分，试图用围观打乱你。',
    choices: [
      choice('evidence', '贴出完整复盘和重做结果', '你开始会夺回叙事权了，但下一次我还会盯着。', 'chen-ruibin'),
      choice('silent', '不争辩，用下一次稳定发挥回应', '沉默不是退让。只要你真的拿得出下一次。', 'chen-ruibin')
    ]
  },
  {
    id: 'before-exam', threshold: 260, characterId: 'chen-yanjun', title: '终章前的约定', prompt: '陈彦君问你：如果结果不如期待，你们之前的努力是否还算数？',
    choices: [
      choice('truth', '结果要复盘，成长不会被抹掉', '这就是我愿意和你并肩的原因。你尊重结果，也不把自己交给结果处置。', 'chen-yanjun'),
      choice('future', '先交出全力，再共同面对下一步', '好。我们不替未来说空话，只约定不逃避下一步。', 'chen-yanjun')
    ]
  },
  {
    id: 'family-future', threshold: 285, characterId: 'he-xinping', title: '未来的饭桌', prompt: '何新平问：等这一程结束，你最想先做什么？',
    choices: [
      choice('home', '带爸妈去看看更大的世界', '先把自己的路走好。到时候，我们一起去。', 'he-xinping'),
      choice('work', '用所学能力创造稳定生活', '你有自己的本事，比什么承诺都让人踏实。', 'zhong-shanyan')
    ]
  }
] as const

export function getPendingEncounter(profile: PlayerProfile) {
  return STORY_ENCOUNTERS.find((encounter) => isStoryThresholdUnlocked(profile, encounter.threshold) && !profile.storyChoices[encounter.id])
}

export function getBondStatus(points: number) {
  if (points >= 48) return '生死相托'
  if (points >= 32) return '并肩知己'
  if (points >= 16) return '彼此信任'
  if (points >= 8) return '留下印象'
  return '初次相遇'
}
