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
    id: 'shared-campus-map', threshold: 25, characterId: 'chen-yanjun', title: '同一张校园地图', prompt: '上海交大开放日直播结束后，陈彦君问你们该如何保存这份向往。',
    choices: [
      choice('weekly-target', '各自写下本周最真实的薄弱点', '把喜欢的地方变成本周能完成的行动，这比合影更接近未来。', 'chen-yanjun'),
      choice('definition-route', '沿地图交换一组定义问答', '那就从这里出发。每答清一个条件，我们都向闵行近一点。', 'chen-yanjun')
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
    id: 'two-methods-bet', threshold: 42, characterId: 'gu-yanzhou', title: '两种解法的赌约', prompt: '顾砚舟提议同一道题各走一条路线，输的人负责讲清两种方法的边界。',
    choices: [
      choice('different-route', '主动选择不熟悉的路线', '敢走不熟的路，才有机会把第二种方法练成自己的。', 'gu-yanzhou'),
      choice('audit-both', '先列出两种方法的条件再开题', '先把边界摆上桌，这场比较才不会只剩计算速度。', 'gu-yanzhou')
    ]
  },
  {
    id: 'overnight-bait', threshold: 60, characterId: 'zeng-yuxin', title: '凌晨加量陷阱', prompt: '曾宇鑫在训练群连续点名，想诱使你临时取消休息并追赶数量。',
    choices: [
      choice('mute', '关闭群提醒，按原计划睡觉', '不接招？那我明天看你能不能真的保持质量。', 'zeng-yuxin'),
      choice('one-audit', '只审一道最有价值的错题后收工', '你居然能在挑衅里只拿走有用部分。下一次我会更难缠。', 'zeng-yuxin')
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
    id: 'open-day-route', threshold: 88, characterId: 'luo-yiming', title: '东川路上的四十分钟', prompt: '去上海交大开放日的地铁上，罗一鸣问这段路该拍照还是继续训练。',
    choices: [
      choice('oral-review', '互相口述十个核心定义', '等到了校门口，我们至少能说今天不是只来想象未来。', 'luo-yiming'),
      choice('rest-and-plan', '先休息，再写下返程训练清单', '有节奏地靠近目标，比一路紧绷更能走到终点。', 'xu-tang')
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
    id: 'cropped-progress', threshold: 115, characterId: 'chen-ruibin', title: '被裁掉的进步曲线', prompt: '陈睿斌只展示你的最低分，却刻意裁掉后续订正和稳定提升。',
    choices: [
      choice('full-evidence', '公开完整曲线与错因记录', '证据比辩解难对付。可别以为一次曲线就能保你到最后。', 'chen-ruibin'),
      choice('private-proof', '不争围观，只保留自己的连续证据', '你可以不回应，但我会等下一次失误。', 'chen-ruibin')
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
    id: 'rainy-mock', threshold: 138, characterId: 'chen-yanjun', title: '雨夜低分之后', prompt: '模拟考失利后你不想说话，陈彦君把卷子分成不会、算错和超时三栏。',
    choices: [
      choice('admit-hurt', '坦白难受，再认领第一项订正', '你不用在我面前假装强大。愿意回来处理第一项，就已经在前进。', 'chen-yanjun'),
      choice('walk-first', '先走十分钟，再共同拆错因', '情绪被看见以后，卷子才重新变成可以处理的问题。', 'chen-yanjun')
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
    id: 'recovery-agreement', threshold: 165, characterId: 'xiaoyixian', title: '恢复协议', prompt: '小医仙提出连续高强度训练后必须安排恢复，但你担心因此落后。',
    choices: [
      choice('full-rest', '接受完整恢复并记录次日状态', '恢复也要验证。明天更清醒的你，会给今天一个可靠答案。', 'xiaoyixian'),
      choice('light-recall', '只做轻量定义回忆后休息', '保留连接，不继续消耗。你开始会控制强度了。', 'xiaoyixian')
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
    id: 'speed-truce', threshold: 190, characterId: 'yuan-yue', title: '速度战后的停战十分钟', prompt: '袁越赢下对决，却主动给你十分钟一起核对双方最危险的省略步骤。',
    choices: [
      choice('share-gap', '先公开自己漏掉的条件', '肯把最薄弱的地方摆出来，下一场才值得认真赢你。', 'yuan-yue'),
      choice('compare-path', '逐题比较快在哪里、险在哪里', '速度应该来自路径熟练，不是来自侥幸删步。你终于追到这一层了。', 'yuan-yue')
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
    id: 'queen-campus-board', threshold: 214, characterId: 'medusa', title: '闵行战区沙盘', prompt: '美杜莎把交大目标拆成章节掌握、限时表现和恢复稳定三条战线。',
    choices: [
      choice('weakest-front', '先集中资源击穿最弱章节', '真正的战略不是平均用力，而是在关键处形成优势。', 'medusa'),
      choice('stable-front', '先守住稳定得分，再攻高难上限', '先建立不会崩的底盘。你开始懂得胜利需要秩序。', 'medusa')
    ]
  },
  {
    id: 'siyuan-letter', threshold: 220, characterId: 'chen-yanjun', title: '写给思源湖的信', prompt: '陈彦君提议分别写下成功与失利后的下一步，避免把关系和人生押在唯一结果上。',
    choices: [
      choice('two-futures', '认真写下两种未来的行动', '我想和你一起抵达，但更想我们无论在哪里，都有继续成长的能力。', 'chen-yanjun'),
      choice('shared-truth', '约定结果出来后先说真话', '不粉饰，也不互相否定。能这样面对未来，才算真正并肩。', 'chen-yanjun')
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
    id: 'rival-gate', threshold: 242, characterId: 'zeng-yuxin', title: '校门定位邀战', prompt: '曾宇鑫发来上海交大校门定位，逼你立刻接受一场超量挑战。',
    choices: [
      choice('boss-proof', '用一场讲次 Boss 战回应', '行。少说一句，多打一场真正的硬仗。', 'zeng-yuxin'),
      choice('scheduled-duel', '拒绝临时打乱，约定复盘后再战', '你越来越难被我带节奏了。那我就在约定时间等你。', 'zeng-yuxin')
    ]
  },
  {
    id: 'sprint-team', threshold: 252, characterId: 'gu-yanzhou', title: '冲刺小队的边界', prompt: '四人小队可以互查、计时和复盘，但有人开始依赖别人给出第一步。',
    choices: [
      choice('solo-first', '规定每题先独立思考再讨论', '同行不是共享答案，是让每个人都更能独自落笔。', 'gu-yanzhou'),
      choice('role-rotate', '轮换讲题、质疑与验算角色', '每个人都经历完整闭环，小队才不会只有一个发动机。', 'gu-yanzhou')
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
  },
  {
    id: 'after-admission', threshold: 315, characterId: 'chen-yanjun', title: '抵达以后继续并肩', prompt: '站在思源湖边，陈彦君问：录取之后，你们还需要怎样的关系？',
    choices: [
      choice('independent-growth', '各自成长，也诚实分享低谷', '不是互相占有时间，而是让彼此拥有更大的世界。', 'chen-yanjun'),
      choice('new-problem', '共同选择一个真正未知的问题', '好。下一次并肩，不为同一张试卷，而为我们真正想理解的世界。', 'chen-yanjun')
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
