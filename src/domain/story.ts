import type { PlayerProfile } from '../types'

export type StoryRole = 'memory' | 'mentor' | 'rival' | 'ally' | 'encounter' | 'gatekeeper'

export interface StoryChapter {
  id: string
  threshold: number
  act: string
  title: string
  location: string
  speaker: string
  role: StoryRole
  dialogue: string[]
  objective: string
}

export const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: 'departure', threshold: 0, act: '序章', title: '离家之前', location: '清晨的病房走廊', speaker: '奶奶', role: 'memory',
    dialogue: ['耀焜，别怕路远。你把自己的未来走稳，就是奶奶最想看到的事。', '上海交通大学不是传说中的山门，它只是要你把每一道不会的题，慢慢变成会。'],
    objective: '完成第一道题，点燃焜火。'
  },
  {
    id: 'first-fire', threshold: 1, act: '第一幕', title: '焜火初燃', location: '极限山门', speaker: '周守元', role: 'mentor',
    dialogue: ['答案不是通行证，定义才是。你若能说清条件，就不会被变式困住。', '先选一讲，做完再看解析。你不需要一天征服整本书。'],
    objective: '独立完成 3 道题。'
  },
  {
    id: 'rival', threshold: 6, act: '第二幕', title: '石阶上的冷眼', location: '数列石阶', speaker: '沈砺', role: 'rival',
    dialogue: ['收藏了满屏题库又怎样？一道递推数列都证不出收敛，你凭什么谈交大？', '何耀焜：那我就从“先证存在”开始。你说过的话，我会用完整推导回答。'],
    objective: '把一次“不会”重新做成“独立完成”。'
  },
  {
    id: 'ally', threshold: 15, act: '第三幕', title: '并肩验算', location: '求导兵器阁', speaker: '顾砚舟', role: 'ally',
    dialogue: ['我走隐函数路线，你走显函数路线。最后在同一个答案碰面，才算真的稳。', '朋友不是替你做题的人，是敢指出你漏了哪一项的人。'],
    objective: '完成第一次一题多解。'
  },
  {
    id: 'passing-affection', threshold: 30, act: '第四幕', title: '短暂同路', location: '夜班列车', speaker: '苏晚桥', role: 'encounter',
    dialogue: ['我们也许只同路这一段，但你讲 Taylor 余项时眼里有光。别把那束光丢在半路。', '到站后各自前行。真正留下的，不是承诺，是你重新打开题目的那一刻。'],
    objective: '攻下中值定理与 Taylor 板块。'
  },
  {
    id: 'hospital-call', threshold: 50, act: '第五幕', title: '来自家里的电话', location: '积分锻造炉外', speaker: '奶奶', role: 'memory',
    dialogue: ['今天精神很好，你别总惦记。吃饭了吗？', '何耀焜握紧手机：等我走进交大，我要让我们的未来不再被一次病痛逼到墙角。'],
    objective: '累计完成 50 道题，抵达下一段路。'
  },
  {
    id: 'second-clash', threshold: 80, act: '第六幕', title: '定理裁决', location: '积分论证台', speaker: '沈砺', role: 'rival',
    dialogue: ['速度快不等于会做。等号条件都写不全，你的答案只值一半。', '何耀焜：你说得对一半。另一半，我会用第二种方法和完整条件拿回来。'],
    objective: '累计 10 次“能够多解”。'
  },
  {
    id: 'city-gate', threshold: 120, act: '第七幕', title: '沪城门前', location: '上海南站雨夜', speaker: '陌生路人', role: 'encounter',
    dialogue: ['年轻人，你一直在看那本高数。要去哪里？', '何耀焜：去交大。不是碰碰运气，是去兑现我一路写下来的每一步。'],
    objective: '完成高数 18 讲中的 12 讲。'
  },
  {
    id: 'gatekeeper', threshold: 180, act: '第八幕', title: '最强斗魂的门槛', location: '三大公式终域', speaker: '林教授', role: 'gatekeeper',
    dialogue: ['最强斗魂不是让你永不犯错，而是让你每次犯错都能追到定义、条件和方法边界。', '把最后一讲做完。然后告诉我，为什么 Green、Gauss 与 Stokes 本质上在说同一件事。'],
    objective: '完成高数 18 讲全图。'
  },
  {
    id: 'future', threshold: 300, act: '终章', title: '交大之门', location: '上海交通大学校门前', speaker: '何耀焜', role: 'ally',
    dialogue: ['奶奶，我到了。一路上的嘲讽、相遇和告别，都没有替我做过一道题，却都让我知道为什么不能停。', '所谓最强斗魂，是我终于拥有选择未来、守护家人，也守住自己的能力。'],
    objective: '继续做题，让录取不只停留在故事里。'
  }
]

export function getStoryProgress(profile: PlayerProfile) {
  const current = [...STORY_CHAPTERS].reverse().find((chapter) => profile.totalReviews >= chapter.threshold) || STORY_CHAPTERS[0]
  const next = STORY_CHAPTERS.find((chapter) => profile.totalReviews < chapter.threshold)
  const start = current.threshold
  const end = next?.threshold ?? start
  return {
    current,
    next,
    remaining: next ? next.threshold - profile.totalReviews : 0,
    percent: next ? Math.max(0, Math.min(100, Math.round(((profile.totalReviews - start) / (end - start)) * 100))) : 100,
    unlocked: STORY_CHAPTERS.filter((chapter) => profile.totalReviews >= chapter.threshold)
  }
}
