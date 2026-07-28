import type { PlayerProfile } from '../types'

export type StoryRole = 'family' | 'mentor' | 'rival' | 'friend' | 'classmate' | 'romance' | 'stranger' | 'protagonist'
export type RomanceRouteId = 'lin-jianyue' | 'su-wanqiao' | 'tang-zhixia'

export interface StoryCharacter {
  id: string
  name: string
  role: StoryRole
  title: string
  summary: string
  portrait: string
  unlockAt: number
}

export interface StoryChapter {
  id: string
  threshold: number
  act: string
  title: string
  location: string
  speaker: string
  portraitId: string
  role: StoryRole
  dialogue: string[]
  objective: string
}

export interface RomanceRoute {
  id: RomanceRouteId
  name: string
  portraitId: string
  unlockAt: number
  confidantAt: number
  partnerAt: number
  routeName: string
  promise: string
}

const characterPortrait = (filename: string) => `${import.meta.env.BASE_URL}characters/${filename}`

export const STORY_CHARACTERS: StoryCharacter[] = [
  { id: 'he-yaokun', name: '何耀焜', role: 'protagonist', title: '数学修炼者', summary: '从一道道题中积累选择未来的力量。', portrait: characterPortrait('hero-standard.webp'), unlockAt: 0 },
  { id: 'he-jiancheng', name: '何建成', role: 'family', title: '父亲', summary: '话不多的技术工人，用旧工具撑起一个家。', portrait: characterPortrait('family-father.webp'), unlockAt: 0 },
  { id: 'chen-xiulan', name: '陈秀兰', role: 'family', title: '母亲', summary: '总把热饭留到深夜，也把担心藏在寻常话里。', portrait: characterPortrait('family-mother.webp'), unlockAt: 0 },
  { id: 'zhou-shouyuan', name: '周守元', role: 'mentor', title: '严师', summary: '只认定义、条件与完整推导的数学导师。', portrait: characterPortrait('mentor-zhou-shouyuan.webp'), unlockAt: 1 },
  { id: 'luo-yiming', name: '罗一鸣', role: 'classmate', title: '同桌', summary: '基础普通，却从不把一次低分当作结论。', portrait: characterPortrait('classmate-luo-yiming.webp'), unlockAt: 4 },
  { id: 'pei-shenxing', name: '裴慎行', role: 'rival', title: '名门优等生', summary: '聪明、精致，也习惯低估从普通家庭出发的人。', portrait: characterPortrait('rival-pei-shenxing.webp'), unlockAt: 8 },
  { id: 'xu-tang', name: '许棠', role: 'friend', title: '学习委员', summary: '擅长把混乱计划变成真正能执行的清单。', portrait: characterPortrait('friend-xu-tang.webp'), unlockAt: 14 },
  { id: 'lin-jianyue', name: '林见月', role: 'romance', title: '证明系研究生', summary: '冷静锐利，珍惜能把一个定义讲清楚的人。', portrait: characterPortrait('romance-lin-jianyue.webp'), unlockAt: 22 },
  { id: 'shen-li', name: '沈砺', role: 'rival', title: '榜首守关者', summary: '严格到近乎无情，却从不否认真正扎实的答案。', portrait: characterPortrait('rival-shen-li.webp'), unlockAt: 32 },
  { id: 'gu-yanzhou', name: '顾砚舟', role: 'friend', title: '多解搭档', summary: '喜欢用另一种方法验算，也敢当面指出漏洞。', portrait: characterPortrait('friend-gu-yanzhou.webp'), unlockAt: 45 },
  { id: 'su-wanqiao', name: '苏晚桥', role: 'romance', title: '统计系旅伴', summary: '温暖而有分寸，在夜班列车上坚持自己的远方。', portrait: characterPortrait('romance-su-wanqiao.webp'), unlockAt: 60 },
  { id: 'jiang-nan', name: '江楠', role: 'classmate', title: '错题卡高手', summary: '把每次失误做成卡片，笑着把薄弱点逐个消掉。', portrait: characterPortrait('classmate-jiang-nan.webp'), unlockAt: 98 },
  { id: 'chen-ye', name: '陈野', role: 'friend', title: '晨跑室友', summary: '相信脑力和耐力一样，都靠一次次完成训练。', portrait: characterPortrait('friend-chen-ye.webp'), unlockAt: 120 },
  { id: 'han-che', name: '韩澈', role: 'rival', title: '限时赛专家', summary: '强硬、公平、从不放水，是最可靠的压力测试。', portrait: characterPortrait('rival-han-che.webp'), unlockAt: 145 },
  { id: 'tang-zhixia', name: '唐知夏', role: 'romance', title: '数据竞赛对手', summary: '野心坦荡、判断果断，喜欢能与她并肩向前的人。', portrait: characterPortrait('romance-tang-zhixia.webp'), unlockAt: 170 },
  { id: 'liang-shu', name: '梁叔', role: 'stranger', title: '夜班铁路工', summary: '只同路一站，却用半生经历说中坚持的意义。', portrait: characterPortrait('stranger-liang-shu.webp'), unlockAt: 200 }
]

export const ROMANCE_ROUTES: RomanceRoute[] = [
  { id: 'lin-jianyue', name: '林见月', portraitId: 'lin-jianyue', unlockAt: 22, confidantAt: 100, partnerAt: 220, routeName: '月下证明', promise: '把每个重要结论，都讲到彼此真正相信。' },
  { id: 'su-wanqiao', name: '苏晚桥', portraitId: 'su-wanqiao', unlockAt: 60, confidantAt: 140, partnerAt: 250, routeName: '晚桥同路', promise: '各自奔赴远方，也为彼此留一盏灯。' },
  { id: 'tang-zhixia', name: '唐知夏', portraitId: 'tang-zhixia', unlockAt: 170, confidantAt: 230, partnerAt: 290, routeName: '知夏争锋', promise: '既是对手，也是愿意分享胜利的人。' }
]

export const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: 'departure', threshold: 0, act: '序章', title: '旧工具箱与新车票', location: '家中清晨', speaker: '父亲 · 何建成', portraitId: 'he-jiancheng', role: 'family',
    dialogue: ['爸妈不求你替我们扛下一切。把自己的路走稳，就是这个家最好的盼头。', '何耀焜看着父亲反复修补的工具箱：我要去交大，也要让你们以后不必再为每一笔开支犹豫。'],
    objective: '完成第一道题，点燃焜火。'
  },
  {
    id: 'first-fire', threshold: 1, act: '第一幕', title: '定义才是兵器', location: '极限山门', speaker: '周守元', portraitId: 'zhou-shouyuan', role: 'mentor',
    dialogue: ['答案不是通行证，定义才是。你若说不清条件，变式一来就会原形毕露。', '先拿下一题，再拿下一题。交大的门不靠口号打开。'],
    objective: '独立完成 3 道题。'
  },
  {
    id: 'same-desk', threshold: 4, act: '第二幕', title: '倒数第二排', location: '晚自习教室', speaker: '罗一鸣', portraitId: 'luo-yiming', role: 'classmate',
    dialogue: ['我月考又垫底了，但今天这三道极限，我至少知道自己错在哪。', '你要冲交大，我先陪你把今晚坐满。普通人也可以把每一步走得很硬。'],
    objective: '连续完成 4 道基础题。'
  },
  {
    id: 'first-taunt', threshold: 8, act: '第三幕', title: '白金校服的轻笑', location: '联合自习厅', speaker: '裴慎行', portraitId: 'pei-shenxing', role: 'rival',
    dialogue: ['目标写成交大，不会让你的基础自动变好。资源、眼界、天赋，你占哪一样？', '何耀焜：我占今天还能再做一道。等成绩出来，我们再谈谁的起点更重要。'],
    objective: '把一次“不会”重新做成“独立完成”。'
  },
  {
    id: 'plan-rescue', threshold: 14, act: '第四幕', title: '失控的计划表', location: '图书馆长桌', speaker: '许棠', portraitId: 'xu-tang', role: 'friend',
    dialogue: ['一天列二十项，不叫努力，叫提前制造挫败。删到三项，现在就做第一项。', '她划掉满页任务，只留下极限、导数和一次错题回炉。混乱第一次有了出口。'],
    objective: '完成一次讲次内混合训练。'
  },
  {
    id: 'moon-proof', threshold: 22, act: '第五幕', title: '月台上的证明', location: '天台观测室', speaker: '林见月', portraitId: 'lin-jianyue', role: 'romance',
    dialogue: ['你刚才的结果对了，但“显然”两个字藏住了最关键的一步。', '何耀焜补全证明。林见月合上笔记：能承认缺口，再亲手补上，比聪明更难得。'],
    objective: '解锁情缘「月下证明」。'
  },
  {
    id: 'stone-steps', threshold: 32, act: '第六幕', title: '石阶上的冷眼', location: '数列石阶', speaker: '沈砺', portraitId: 'shen-li', role: 'rival',
    dialogue: ['收藏满屏题目没有意义。递推数列连有界性都证不出，你凭什么谈收敛？', '何耀焜：那我就从单调有界开始。你的质疑，我用完整推导回答。'],
    objective: '独立完成一次数列极限证明。'
  },
  {
    id: 'two-methods', threshold: 45, act: '第七幕', title: '两条路在答案相遇', location: '求导兵器阁', speaker: '顾砚舟', portraitId: 'gu-yanzhou', role: 'friend',
    dialogue: ['我走隐函数，你走参数方程。最后在同一个答案碰面，才算真的稳。', '朋友不是替你做题的人，是敢指出你漏了哪一项的人。'],
    objective: '完成第一次一题多解。'
  },
  {
    id: 'night-train', threshold: 60, act: '第八幕', title: '开往上海的夜车', location: '夜班列车', speaker: '苏晚桥', portraitId: 'su-wanqiao', role: 'romance',
    dialogue: ['你讲 Taylor 余项时眼里有光，但别把所有生活都押在一个结果上。', '我们都有自己的终点。若还愿意同路，就让下一次见面时的自己更强一点。'],
    objective: '解锁情缘「晚桥同路」。'
  },
  {
    id: 'home-call', threshold: 78, act: '第九幕', title: '一碗留到深夜的饭', location: '家中厨房', speaker: '母亲 · 陈秀兰', portraitId: 'chen-xiulan', role: 'family',
    dialogue: ['累了就回来吃饭。家里现在不富裕，不等于你必须把每一天都过成苦役。', '何耀焜：我想让你们以后选喜欢的生活，不再只选最省钱的那一个。'],
    objective: '完成 78 道题，也守住睡眠与吃饭。'
  },
  {
    id: 'mistake-cards', threshold: 98, act: '第十幕', title: '错题不是判决书', location: '教学楼台阶', speaker: '江楠', portraitId: 'jiang-nan', role: 'classmate',
    dialogue: ['你看，我这盒彩卡全是错题。它们不是黑历史，是已经交过学费的情报。', '她抽出一张递来：写下触发条件。下次再见到它，先认出它，再打赢它。'],
    objective: '累计完成 100 道题。'
  },
  {
    id: 'dawn-run', threshold: 120, act: '第十一幕', title: '天亮前的一圈', location: '校园操场', speaker: '陈野', portraitId: 'chen-ye', role: 'friend',
    dialogue: ['冲刺不是每天把自己练废。真正可怕的是，别人休息后还能回来，你也能。', '跑完这一圈去做二重积分。慢一点没关系，别让节奏断掉。'],
    objective: '让连续做题达到 3 天。'
  },
  {
    id: 'timed-duel', threshold: 145, act: '第十二幕', title: '四十五分钟裁决', location: '模拟赛走廊', speaker: '韩澈', portraitId: 'han-che', role: 'rival',
    dialogue: ['会做和考场上做出来，是两种能力。今天我不会给你多一秒。', '计时结束，她看完答卷：慢了七分钟，但每个等号条件都在。下次，我等你准时。'],
    objective: '完成一次限时选择题训练。'
  },
  {
    id: 'data-tower', threshold: 170, act: '第十三幕', title: '研究塔上的赌约', location: '数据研究塔', speaker: '唐知夏', portraitId: 'tang-zhixia', role: 'romance',
    dialogue: ['你想进交大，我想拿下竞赛首席。别互相让路，看谁先把结果做出来。', '她伸出手：赢的人请客，输的人交出完整复盘。我们都别拿忙当失约。'],
    objective: '解锁情缘「知夏争锋」。'
  },
  {
    id: 'station-stranger', threshold: 200, act: '第十四幕', title: '陌生人的保温杯', location: '上海站清晨', speaker: '梁叔', portraitId: 'liang-shu', role: 'stranger',
    dialogue: ['我年轻时总以为一张车票能改命。后来才懂，车票只负责让你到站。', '真正留下你的，是你到了以后还能不能把该做的事做完。喝口热水，别空着肚子赶路。'],
    objective: '完成 200 道题，走到题库第一座里程碑。'
  },
  {
    id: 'mock-failure', threshold: 225, act: '第十五幕', title: '模拟考坠落', location: '空教室', speaker: '周守元', portraitId: 'zhou-shouyuan', role: 'mentor',
    dialogue: ['分数难看，所以它有价值。把失分分成不会、算错、超时，别用“状态不好”糊弄自己。', '今晚可以难受。明早开始，按错因一项项拿回来。'],
    objective: '将三道错题重新评为“独立完成”。'
  },
  {
    id: 'allies-return', threshold: 250, act: '第十六幕', title: '并肩的人都回来了', location: '联合冲刺室', speaker: '顾砚舟', portraitId: 'gu-yanzhou', role: 'friend',
    dialogue: ['许棠排计划，陈野盯作息，江楠整理错题。我负责找你第二种解法。', '没有人能替你上考场，但你从来不是一个人在准备。'],
    objective: '累计 20 次一题多解。'
  },
  {
    id: 'final-rival', threshold: 275, act: '第十七幕', title: '榜首不再俯视', location: '终极模拟赛', speaker: '沈砺', portraitId: 'shen-li', role: 'rival',
    dialogue: ['上次你只会证明存在，这次连误差阶都写全了。看来我得收回那句话。', '何耀焜：不用收回。正是那句话，让我学会不靠愤怒撑完全程，而靠能力。'],
    objective: '完成高数第 18 讲。'
  },
  {
    id: 'future', threshold: 300, act: '终章', title: '交大之门', location: '上海交通大学校门前', speaker: '何耀焜', portraitId: 'he-yaokun', role: 'protagonist',
    dialogue: ['爸，妈，我到了。不是来赌一个奇迹，是来兑现一路写下的每一步。', '所谓最强斗魂，是我终于有能力选择未来、照顾家人，也不丢掉自己。下一程，现在开始。'],
    objective: '继续做题，把录取通知书从剧情变成现实。'
  }
]

export function getCharacter(characterId: string) {
  return STORY_CHARACTERS.find((character) => character.id === characterId) || STORY_CHARACTERS[0]
}

export function getRomanceRouteStatus(route: RomanceRoute, totalReviews: number) {
  if (totalReviews < route.unlockAt) return { label: '未相识', progress: 0 }
  if (totalReviews < route.confidantAt) {
    return { label: '相识', progress: Math.round(((totalReviews - route.unlockAt) / (route.confidantAt - route.unlockAt)) * 100) }
  }
  if (totalReviews < route.partnerAt) {
    return { label: '知己', progress: Math.round(((totalReviews - route.confidantAt) / (route.partnerAt - route.confidantAt)) * 100) }
  }
  return { label: '恋人', progress: 100 }
}

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
