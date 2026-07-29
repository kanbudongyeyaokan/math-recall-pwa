import type { PlayerProfile } from '../types'
import { getMasteryPower } from './mastery'

export type StoryRole = 'family' | 'mentor' | 'rival' | 'friend' | 'classmate' | 'romance' | 'stranger' | 'protagonist'
export type RomanceRouteId = 'chen-yanjun' | 'medusa' | 'xiaoyixian'
export type CharacterPose = 'idle' | 'speaking' | 'victory' | 'challenge'

export interface StoryCharacter {
  id: string
  name: string
  role: StoryRole
  title: string
  summary: string
  backstory: string
  motivation: string
  firstMeeting: string
  quote: string
  relationship: string
  portrait: string
  portraits?: Partial<Record<CharacterPose, string>>
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
const characterVariants = (characterId: string): Record<CharacterPose, string> => ({
  idle: characterPortrait(`variants/${characterId}-idle.webp`),
  speaking: characterPortrait(`variants/${characterId}-speaking.webp`),
  victory: characterPortrait(`variants/${characterId}-victory.webp`),
  challenge: characterPortrait(`variants/${characterId}-challenge.webp`)
})

export const STORY_CHARACTERS: StoryCharacter[] = [
  {
    id: 'he-yaokun', name: '何耀焜', role: 'protagonist', title: '数学修炼者', unlockAt: 0,
    summary: '从一道道题中积累选择未来的力量。',
    backstory: '普通家庭出发的考研修炼者。没有天降捷径，只有把定义、计算和复盘一遍遍练成可靠能力。',
    motivation: '考入上海交通大学，让父母拥有更从容的生活，也让自己拥有选择未来的底气。',
    firstMeeting: '故事从书桌前的第一道题开始。那个仍会害怕失败的年轻人，决定先把今天做完。',
    quote: '质疑可以很响，但我的下一步会更扎实。',
    relationship: '这就是你正在塑造的自己。', portrait: characterPortrait('hero-standard.webp'), portraits: characterVariants('he-yaokun')
  },
  {
    id: 'he-xinping', name: '何新平', role: 'family', title: '父亲', unlockAt: 0,
    summary: '沉默可靠，把对儿子的期待藏在每一次实际行动里。',
    backstory: '习惯修好旧物再继续用，也习惯把家庭的压力留给自己。他不善于说漂亮话，却总在何耀焜需要时留出一盏灯。',
    motivation: '希望儿子有真正喜欢且能站稳脚跟的道路，而不是重复上一代的局限。',
    firstMeeting: '清晨，他把修好的台灯放回书桌，只说了一句“慢慢来，别把身体熬坏”。',
    quote: '先把自己的路走稳，家里永远是你的后方。',
    relationship: '最坚实的家人，也是这段旅程安静的后盾。', portrait: characterPortrait('family-father.webp')
  },
  {
    id: 'zhong-shanyan', name: '钟珊燕', role: 'family', title: '母亲', unlockAt: 0,
    summary: '敏锐温柔，总能看出逞强背后的疲惫。',
    backstory: '她记得何耀焜每次重要考试的日期，也记得他最容易忽略的是吃饭和休息。关心从不等于控制，她更希望儿子活得长久而明亮。',
    motivation: '让家始终是可以恢复力量的地方，而不是另一张成绩单。',
    firstMeeting: '深夜复盘时，厨房里留着一碗温热的饭和一张写着“吃完再算”的纸条。',
    quote: '结果重要，你也重要。',
    relationship: '最牵挂你的家人，负责提醒你别在追梦途中丢掉自己。', portrait: characterPortrait('family-mother.webp')
  },
  {
    id: 'zhou-shouyuan', name: '周守元', role: 'mentor', title: '定义守门人', unlockAt: 1,
    summary: '只认条件、定义与完整推导的严格导师。',
    backstory: '长期负责高数训练，见过太多靠题型记忆取得短期高分的人。他把严厉留给推理漏洞，把尊重留给诚实复盘。',
    motivation: '训练出离开模板仍能独立思考的学生。',
    firstMeeting: '他划掉一页跳步解答，要求何耀焜只用极限定义重新讲一遍。',
    quote: '答案不是通行证，定义才是。',
    relationship: '要求极高的引路人，认可只来自扎实进步。', portrait: characterPortrait('mentor-zhou-shouyuan.webp')
  },
  {
    id: 'luo-yiming', name: '罗一鸣', role: 'classmate', title: '倒数第二排同桌', unlockAt: 4,
    summary: '基础普通，却从不把一次低分当作最终结论。',
    backstory: '曾经长期在成绩榜后段徘徊，后来学会用最小可执行任务重建信心。他理解普通人的慢，也相信慢不等于停。',
    motivation: '证明稳定完成比短暂爆发更能改变一个人。',
    firstMeeting: '晚自习只剩两人，他把计时器推到桌中间：“先一起坐满这四十分钟。”',
    quote: '普通人也能把每一步走得很硬。',
    relationship: '一起守住基础和出勤率的同桌战友。', portrait: characterPortrait('classmate-luo-yiming.webp')
  },
  {
    id: 'zeng-yuxin', name: '曾宇鑫', role: 'rival', title: '超量题单制造者', unlockAt: 8,
    summary: '擅长用夸张进度和公开比较压迫对手节奏。',
    backstory: '把竞争看成零和游戏，习惯用一天三套卷、凌晨打卡和榜单截图制造心理优势。他能力很强，却把停下等同于失败。',
    motivation: '始终占据所有可见榜单的第一名，并让追赶者先被自己的焦虑击败。',
    firstMeeting: '他把一叠超量题单放在何耀焜桌前，笑着问：“你的交大目标，能撑过今晚吗？”',
    quote: '做不完这份量，就别谈和我竞争。',
    relationship: '试图用数量打乱你节奏的宿敌；你的稳定正在让他重新估量你。', portrait: characterPortrait('rival-zeng-yuxin.webp'), portraits: characterVariants('zeng-yuxin')
  },
  {
    id: 'xu-tang', name: '许棠', role: 'friend', title: '节奏规划师', unlockAt: 14,
    summary: '擅长把混乱目标变成真正能执行的清单。',
    backstory: '曾因过度计划陷入长期拖延，后来建立了以完成度而非任务数量衡量进展的方法。她不替任何人努力，只帮人看清下一步。',
    motivation: '让认真准备的人不再被失控计划拖垮。',
    firstMeeting: '她拿走那张写满二十项任务的计划表，删到只剩三项。',
    quote: '计划不是惩罚表，能执行到最后才叫计划。',
    relationship: '能在你失控前指出问题的可靠益友。', portrait: characterPortrait('friend-xu-tang.webp')
  },
  {
    id: 'chen-yanjun', name: '陈彦君', role: 'romance', title: '证明同行者', unlockAt: 22,
    summary: '冷静、真诚，在长线训练中与你建立最深的默契。',
    backstory: '从不迷信天赋光环。她在自己的学习道路上也经历过重要考试失利，因此格外珍惜愿意承认漏洞、重新推导的人。她有独立目标，不会围着任何人的人生旋转。',
    motivation: '进入理想的研究平台，继续做严谨而有现实价值的数学建模；也想找到能尊重彼此目标的同行者。',
    firstMeeting: '天台观测室里，她指出何耀焜证明中的隐藏条件。何耀焜没有辩解，而是坐下从定义补到最后一行。',
    quote: '我喜欢的不是你永远答对，而是你肯把缺口补到底。',
    relationship: '最深情缘。你们从补全证明开始，逐步成为低谷中仍能彼此说真话的同行者。', portrait: characterPortrait('romance-chen-yanjun.webp'), portraits: characterVariants('chen-yanjun')
  },
  {
    id: 'yuan-yue', name: '袁越', role: 'rival', title: '速解榜首', unlockAt: 32,
    summary: '计算速度惊人，习惯用限时排名定义所有人的价值。',
    backstory: '极强的短时决策者，从小在竞赛环境里接受“慢就是弱”的规则。他不靠小动作取胜，却会不断把别人拖进自己最擅长的速度战。',
    motivation: '守住速解榜首，并证明考场只承认最后的分数和时间。',
    firstMeeting: '数列速解板前，他在何耀焜写完第二步时已经交卷。',
    quote: '完整很好，但考场不会替你暂停计时。',
    relationship: '逼你提升速度的宿敌；完整性和速度之间的较量仍未结束。', portrait: characterPortrait('rival-yuan-yue.webp'), portraits: characterVariants('yuan-yue')
  },
  {
    id: 'gu-yanzhou', name: '顾砚舟', role: 'friend', title: '多解搭档', unlockAt: 45,
    summary: '喜欢用另一种方法验算，也敢当面指出漏洞。',
    backstory: '相信真正理解一道题的标志，是能说清不同方法为什么都成立、又在哪里失效。讨论时锋利，结束后从不计较输赢。',
    motivation: '建立一套经得起相互质疑的多解方法库。',
    firstMeeting: '他用隐函数法复核了何耀焜的参数方程解法，并准确指出漏掉的一种情形。',
    quote: '两条路在同一个答案相遇，心里才真正有底。',
    relationship: '最适合拆方法边界的多解搭档。', portrait: characterPortrait('friend-gu-yanzhou.webp')
  },
  {
    id: 'medusa', name: '美杜莎', role: 'romance', title: '战略女王', unlockAt: 95,
    summary: '强势、成熟，擅长在高压竞争中重新划定规则。',
    backstory: '她以代号行事，是联合训练营最年轻的策略负责人。比起安慰，她更习惯给出资源、边界和胜率判断；尊重能承担选择后果的人。',
    motivation: '建立不被噪声操控的训练秩序，并找到能在压力下独立决策的盟友。',
    firstMeeting: '榜单争议最激烈时，她合上终端：“你可以回应挑衅，但先告诉我这会提高哪项能力。”',
    quote: '真正的强者决定战场，而不是被战场决定。',
    relationship: '强势情缘与战略盟友；并肩的前提是各自都能站稳。', portrait: characterPortrait('romance-medusa.webp'), portraits: characterVariants('medusa')
  },
  {
    id: 'jiang-nan', name: '江楠', role: 'classmate', title: '错题卡高手', unlockAt: 108,
    summary: '把每次失误做成卡片，笑着逐个消掉薄弱点。',
    backstory: '她曾经害怕翻开错题本，后来把错误按触发条件、错因和修复动作分类。那些彩色卡片成了她最可靠的进步证据。',
    motivation: '让错误从情绪负担变成可以利用的训练情报。',
    firstMeeting: '教学楼台阶上，她递来一张空白错题卡，只让何耀焜写“下次如何认出它”。',
    quote: '错题不是判决书，是已经交过学费的情报。',
    relationship: '能把挫败转化为具体修复动作的同学。', portrait: characterPortrait('classmate-jiang-nan.webp')
  },
  {
    id: 'chen-ye', name: '陈野', role: 'friend', title: '晨跑室友', unlockAt: 118,
    summary: '相信脑力和耐力一样，都靠恢复后继续训练。',
    backstory: '经历过连续熬夜后的崩盘，因此把睡眠、运动和学习视为同一套长期系统。他不鼓励透支式努力。',
    motivation: '在关键阶段维持可以持续输出的身体与心态。',
    firstMeeting: '天亮前的操场，他递来半瓶水：“慢一点没关系，别让节奏断掉。”',
    quote: '真正可怕的不是不休息，是休息后回不来。',
    relationship: '负责把你从书桌拉回长期节奏的室友。', portrait: characterPortrait('friend-chen-ye.webp')
  },
  {
    id: 'chen-ruibin', name: '陈睿斌', role: 'rival', title: '舆论操盘手', unlockAt: 120,
    summary: '擅长放大单次失误，用旁观者目光制造自我怀疑。',
    backstory: '他对题型和人心同样敏锐，常在公开讨论里选择最刺耳的比较方式。比起正面邀战，他更希望对手先在舆论中失去节奏。',
    motivation: '控制训练营的话语权，让所有人的发挥都成为巩固自己位置的素材。',
    firstMeeting: '一次模拟考后，他把何耀焜的失分截图放上大屏，故意省略了后续复盘。',
    quote: '大家只会记住排名，不会替你解释过程。',
    relationship: '试图用评价拉垮你的宿敌；你正在用持续结果夺回叙事权。', portrait: characterPortrait('rival-chen-ruibin.webp'), portraits: characterVariants('chen-ruibin')
  },
  {
    id: 'xiaoyixian', name: '小医仙', role: 'romance', title: '恢复研究者', unlockAt: 168,
    summary: '温柔但有边界，擅长修复透支后的学习节奏。',
    backstory: '她研究记忆、睡眠与压力恢复，把温柔建立在专业判断上。她会陪伴，却不会认同用伤害自己证明决心。',
    motivation: '让更多人以可持续方式抵达目标，也守住自己的药学研究道路。',
    firstMeeting: '何耀焜连续训练后手抖，她按停计时器，开出的第一张“药方”是睡足七小时。',
    quote: '休息不是退出战斗，是让明天的你仍有能力出手。',
    relationship: '温柔坚定的情缘与恢复搭档；尊重边界才会走得更近。', portrait: characterPortrait('romance-xiaoyixian.webp'), portraits: characterVariants('xiaoyixian')
  },
  {
    id: 'lin-jianyue', name: '林见月', role: 'classmate', title: '反例收集者', unlockAt: 52,
    summary: '总能用一个恰到好处的反例拆穿错误逆命题。',
    backstory: '她曾经把定理结论背得滚瓜烂熟，却在变式中不断丢分，于是开始为每个常见误判建立反例册。她的提问不尖刻，却往往直指逻辑缺口。',
    motivation: '把“听起来正确”训练成“经得起条件检查”，并完成自己的数学教育研究。',
    firstMeeting: '她在讨论桌上写下一个分段函数，只问：“你刚才那句话，遇到它还成立吗？”',
    quote: '记住结论不难，知道它为什么不能反过来才是真功夫。',
    relationship: '帮你守住定义边界的同学，也是反例训练的固定搭档。', portrait: characterPortrait('romance-lin-jianyue.webp')
  },
  {
    id: 'shen-li', name: '沈砺', role: 'rival', title: '定义背诵王', unlockAt: 64,
    summary: '能飞快复述定理，却轻视条件与反例的真正作用。',
    backstory: '记忆力出众，习惯在讨论开始前抢先背完结论。他并非没有实力，只是太依赖熟练感，把能复述误当成能迁移。',
    motivation: '用最短时间覆盖最多结论，在所有知识竞答中保持第一。',
    firstMeeting: '他一口气背完中值定理，却在何耀焜追问闭区间条件时皱起眉。',
    quote: '能背出来就够用了，考场哪有时间追究每个条件？',
    relationship: '逼你把“会背”升级为“会用、会辨”的新对手。', portrait: characterPortrait('rival-shen-li.webp')
  },
  {
    id: 'su-wanqiao', name: '苏晚桥', role: 'classmate', title: '图像直觉师', unlockAt: 102,
    summary: '擅长把抽象式子翻译成曲线、面积与变化趋势。',
    backstory: '她早期计算并不快，却能敏锐看出函数图像的整体结构。后来她把图像直觉和严格推导结合，形成一套先判断范围、再精算答案的方法。',
    motivation: '让抽象数学变得可观察，同时证明直觉也必须接受推导校验。',
    firstMeeting: '面对一页积分式，她先画出正负面积，准确指出答案不可能为负。',
    quote: '先看见答案应该长什么样，再让计算把它证明出来。',
    relationship: '负责用图像和数量级复核结果的同学。', portrait: characterPortrait('romance-su-wanqiao.webp')
  },
  {
    id: 'pei-shenxing', name: '裴慎行', role: 'rival', title: '模板执行官', unlockAt: 114,
    summary: '解题步骤极整齐，却排斥任何不在模板里的新入口。',
    backstory: '他靠高度标准化的笔记长期稳定高分，也因此把陌生方法看成风险。面对变化题时，他会用更强硬的语气掩盖路径失效后的迟疑。',
    motivation: '证明一套固定模板足以覆盖所有考场，并把训练营统一成自己的步骤。',
    firstMeeting: '他给何耀焜的多解答案打了叉：“标准答案只需要一条路。”',
    quote: '考场要的是可复制步骤，不是你的灵感实验。',
    relationship: '让你学会在稳定模板与结构理解之间取舍的对手。', portrait: characterPortrait('rival-pei-shenxing.webp')
  },
  {
    id: 'tang-zhixia', name: '唐知夏', role: 'friend', title: '限时策略师', unlockAt: 198,
    summary: '能在时间、分值与风险之间做清醒取舍。',
    backstory: '她曾因死磕一道压轴题丢掉整张卷子的节奏，从此研究考场决策。她不鼓励轻易放弃，而是要求每一次坚持都有收益依据。',
    motivation: '建立一套压力下仍能执行的取舍系统，让真实能力完整转化为分数。',
    firstMeeting: '模拟考剩十五分钟，她按住何耀焜准备重算的手：“先拿回后面两道确定分。”',
    quote: '强者不是什么都做，而是知道此刻最该拿下什么。',
    relationship: '帮助你把能力转化为考场结果的可靠益友。', portrait: characterPortrait('romance-tang-zhixia.webp')
  },
  {
    id: 'han-che', name: '韩澈', role: 'rival', title: '沉默压迫者', unlockAt: 224,
    summary: '从不公开挑衅，只用连续高分制造无声压力。',
    backstory: '他寡言、自律、几乎不展示训练过程，却总在榜单前列出现。与其他宿敌不同，他不试图操纵谁，只相信落后的理由没有价值。',
    motivation: '以绝对稳定完成整个备考周期，不给任何人追近的窗口。',
    firstMeeting: '空教室里，两人同时交卷。韩澈只看了一眼计时器：“下一次别慢这三分钟。”',
    quote: '解释不会改变分差，下一场会。',
    relationship: '不靠喧闹也能逼出你稳定性的强劲对手。', portrait: characterPortrait('rival-han-che.webp')
  },
  {
    id: 'liang-shu', name: '梁叔', role: 'stranger', title: '夜班铁路工', unlockAt: 200,
    summary: '只同路一站，却用半生经历说中坚持的意义。',
    backstory: '在铁路线上工作多年，看过无数人带着期待抵达上海，也看过许多人在抵达后重新开始。',
    motivation: '把一句真正有用的提醒留给还在赶路的年轻人。',
    firstMeeting: '上海站清晨，他把保温杯递给空腹赶路的何耀焜。',
    quote: '车票只负责让你到站，留下来要靠到站后的每一天。',
    relationship: '短暂相遇却留下长久提醒的路人。', portrait: characterPortrait('stranger-liang-shu.webp')
  }
]

export const ROMANCE_ROUTES: RomanceRoute[] = [
  { id: 'chen-yanjun', name: '陈彦君', portraitId: 'chen-yanjun', unlockAt: 22, confidantAt: 80, partnerAt: 180, routeName: '并肩长路', promise: '不替彼此许诺结果，只在每次低谷里继续说真话、走下一步。' },
  { id: 'medusa', name: '美杜莎', portraitId: 'medusa', unlockAt: 95, confidantAt: 185, partnerAt: 280, routeName: '女王盟约', promise: '各自掌控命运，也愿意把最重要的战局交给彼此后背。' },
  { id: 'xiaoyixian', name: '小医仙', portraitId: 'xiaoyixian', unlockAt: 168, confidantAt: 230, partnerAt: 295, routeName: '青囊同心', promise: '既追逐远方，也共同守住身体、边界和长久生活。' }
]

export const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: 'departure', threshold: 0, act: '序章', title: '旧台灯与新目标', location: '家中清晨', speaker: '父亲 · 何新平', portraitId: 'he-xinping', role: 'family',
    dialogue: ['何新平把修好的台灯放回书桌：爸妈不求你替我们扛下一切。把自己的路走稳，就是这个家最好的盼头。', '何耀焜看着灯下的交大目标：我要让爸妈以后有更多选择，也要让自己真正配得上想去的未来。'],
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
    id: 'first-taunt', threshold: 8, act: '第三幕', title: '超量题单', location: '联合自习厅', speaker: '曾宇鑫', portraitId: 'zeng-yuxin', role: 'rival',
    dialogue: ['曾宇鑫把三套限时卷压在桌角：目标写成交大，不会让你的进度自动追上我。今晚敢不敢全部做完？', '何耀焜：我不陪你表演透支。我会把该练的练透，下一场用结果说话。'],
    objective: '把一次“不会”重新做成“独立完成”。'
  },
  {
    id: 'plan-rescue', threshold: 14, act: '第四幕', title: '失控的计划表', location: '图书馆长桌', speaker: '许棠', portraitId: 'xu-tang', role: 'friend',
    dialogue: ['一天列二十项，不叫努力，叫提前制造挫败。删到三项，现在就做第一项。', '她划掉满页任务，只留下极限、导数和一次错题回炉。混乱第一次有了出口。'],
    objective: '完成一次讲次内混合训练。'
  },
  {
    id: 'sjtu-calendar', threshold: 18, act: '第四幕 · 交大支线', title: '把交大拆进日历', location: '图书馆目标墙', speaker: '许棠', portraitId: 'xu-tang', role: 'friend',
    dialogue: ['许棠把“考上上海交大”从墙上揭下来，拆成十八讲、每周订正和月底模考：远方如果不能落到日历上，只会制造焦虑。', '何耀焜重新贴好目标：从今天起，交大不只是一张壁纸，而是每一个能被完成、被复盘的动作。'],
    objective: '用一讲的真实掌握证明计划可以执行。'
  },
  {
    id: 'yanjun-first-proof', threshold: 22, act: '第五幕', title: '补全那一行证明', location: '天台观测室', speaker: '陈彦君', portraitId: 'chen-yanjun', role: 'romance',
    dialogue: ['陈彦君指向“显然”两个字：结果对了，但最关键的条件被藏住了。你愿意从定义重写吗？', '何耀焜补到最后一行。她合上笔记：肯承认缺口，再亲手补上，比聪明更难得。'],
    objective: '解锁情缘「并肩长路」。'
  },
  {
    id: 'campus-map-promise', threshold: 27, act: '第五幕 · 情缘支线', title: '同一张校园地图', location: '上海交大线上开放日', speaker: '陈彦君', portraitId: 'chen-yanjun', role: 'romance',
    dialogue: ['直播画面掠过闵行校区，陈彦君在校园地图上圈下思源湖：先别把自己放进想象里的合影，告诉我你这周准备补哪块短板。', '何耀焜在旁边写下数列极限。她笑了：那就约好，地图负责提醒方向，今天的题负责把我们送近一点。'],
    objective: '完成数列极限中的一个真实薄弱点。'
  },
  {
    id: 'yuan-speedboard', threshold: 32, act: '第六幕', title: '速解榜首', location: '数列速解板', speaker: '袁越', portraitId: 'yuan-yue', role: 'rival',
    dialogue: ['袁越提前交卷：你的完整推导不错，可考场不会为完整暂停计时。', '何耀焜：那我保住每个条件，再把速度一秒秒练回来。你的优势，会成为我的训练坐标。'],
    objective: '独立完成一次数列极限证明。'
  },
  {
    id: 'goal-wall-duel', threshold: 38, act: '第六幕 · 宿敌支线', title: '目标不是护身符', location: '交大目标墙前', speaker: '袁越', portraitId: 'yuan-yue', role: 'rival',
    dialogue: ['袁越看着墙上的上海交大校名：写得再大，也不能替你在四十五分钟里做完一张卷。', '何耀焜取下装饰性的口号，只留下计时记录：你说得对。目标不是护身符，它是我每天接受检验的理由。'],
    objective: '在保持步骤完整的前提下完成一次限时训练。'
  },
  {
    id: 'two-methods', threshold: 45, act: '第七幕', title: '两条路在答案相遇', location: '求导兵器阁', speaker: '顾砚舟', portraitId: 'gu-yanzhou', role: 'friend',
    dialogue: ['我走隐函数，你走参数方程。最后在同一个答案碰面，才算真的稳。', '朋友不是替你做题的人，是敢指出你漏了哪一项的人。'],
    objective: '完成第一次一题多解。'
  },
  {
    id: 'counterexample-book', threshold: 52, act: '第七幕 · 支线', title: '逆命题的裂缝', location: '定理讨论桌', speaker: '林见月', portraitId: 'lin-jianyue', role: 'classmate',
    dialogue: ['林见月推来一页反例：你说“偏导存在就可微”，那这个函数为什么在原点失败？', '何耀焜重新圈出条件：从今天起，每背一个结论，我都要知道它能不能反过来。'],
    objective: '完成一组定义与结论辨析题。'
  },
  {
    id: 'yuxin-overtime', threshold: 58, act: '第八幕', title: '凌晨两点的截图', location: '训练群榜单', speaker: '曾宇鑫', portraitId: 'zeng-yuxin', role: 'rival',
    dialogue: ['群里弹出曾宇鑫凌晨两点的第七次打卡。他故意点名：何耀焜，睡得这么早，还想追谁？', '何耀焜关掉消息：明天的清醒也是训练资源。我要赢的是考场，不是熬夜截图。'],
    objective: '守住自己的训练计划，不被无效比较带走。'
  },
  {
    id: 'definition-duel', threshold: 64, act: '第八幕 · 支线', title: '会背不等于会用', location: '定义擂台', speaker: '沈砺', portraitId: 'shen-li', role: 'rival',
    dialogue: ['沈砺背完定理便要落笔。何耀焜指着区间端点：条件少了一个，结论就不属于你。', '沈砺收起笑意：那就下一轮见。何耀焜：下一轮，我还会带着反例来。'],
    objective: '在结论题中连续辨对 5 个成立条件。'
  },
  {
    id: 'yanjun-night-study', threshold: 72, act: '第九幕', title: '深夜并肩训练', location: '闭馆前的长桌', speaker: '陈彦君', portraitId: 'chen-yanjun', role: 'romance',
    dialogue: ['陈彦君把两份解答并排：你负责找我证明的漏洞，我负责查你的计算边界，谁也别只说好听的。', '闭馆铃响时，两页批注都写满了。她轻声说：和你一起训练，不需要假装永远强大。'],
    objective: '完成一次一题多解，并认真比较适用条件。'
  },
  {
    id: 'east-chuan-train', threshold: 80, act: '第九幕 · 益友支线', title: '开往东川路的列车', location: '校园开放日地铁途中', speaker: '罗一鸣', portraitId: 'luo-yiming', role: 'friend',
    dialogue: ['车厢屏幕跳出“东川路方向”，罗一鸣把错题本往中间推：先别激动，去程四十分钟，正好互相抽查十个定义。', '列车向闵行驶去。何耀焜第一次感到，朋友的陪伴不是替他抵达，而是让漫长路程始终有下一步。'],
    objective: '和同行者完成一轮定义口述。'
  },
  {
    id: 'home-call', threshold: 85, act: '第十幕', title: '一碗留到深夜的饭', location: '家中厨房', speaker: '母亲 · 钟珊燕', portraitId: 'zhong-shanyan', role: 'family',
    dialogue: ['钟珊燕把饭推近：家里现在不富裕，不等于你必须把每一天都过成苦役。结果重要，你也重要。', '何耀焜：我想让你们以后选喜欢的生活，不再只选最省钱的那一个。但我也会好好走到那里。'],
    objective: '继续做题，也守住睡眠与吃饭。'
  },
  {
    id: 'siyuan-open-day', threshold: 92, act: '第十幕 · 交大支线', title: '思源湖边的三分钟', location: '上海交大闵行校区 · 思源湖', speaker: '陈彦君', portraitId: 'chen-yanjun', role: 'romance',
    dialogue: ['开放日人群从湖边经过，陈彦君没有拍照打卡，只问：如果明天又考砸，你还愿不愿意继续把定义写完整？', '何耀焜望着水面：愿意。喜欢这里给了我方向，但真正能留下我的，只会是失败之后仍肯重来的能力。'],
    objective: '把一次失误订正为真正掌握。'
  },
  {
    id: 'medusa-pact', threshold: 95, act: '第十一幕', title: '女王划定战场', location: '联合训练指挥厅', speaker: '美杜莎', portraitId: 'medusa', role: 'romance',
    dialogue: ['美杜莎合上榜单：回应挑衅之前，先告诉我这会提高哪项能力。若没有，就不值得你浪费一秒。', '她递来一枚策略令：真正的强者决定战场。何耀焜，你要做追赶者，还是规则制定者？'],
    objective: '解锁情缘「女王盟约」。'
  },
  {
    id: 'graph-sense', threshold: 102, act: '第十一幕 · 支线', title: '先看见答案的形状', location: '函数图像室', speaker: '苏晚桥', portraitId: 'su-wanqiao', role: 'classmate',
    dialogue: ['苏晚桥画出积分区域：式子很长，但面积不会说谎。你算出的负数，第一眼就该被拦住。', '何耀焜把草图留在解答旁：直觉负责报警，推导负责定案。'],
    objective: '用图像或范围检查一道积分题。'
  },
  {
    id: 'mistake-cards', threshold: 108, act: '第十二幕', title: '错题不是判决书', location: '教学楼台阶', speaker: '江楠', portraitId: 'jiang-nan', role: 'classmate',
    dialogue: ['你看，我这盒彩卡全是错题。它们不是黑历史，是已经交过学费的情报。', '她抽出一张递来：写下触发条件。下次再见到它，先认出它，再打赢它。'],
    objective: '累计完成 108 道题。'
  },
  {
    id: 'template-boundary', threshold: 114, act: '第十二幕 · 支线', title: '模板之外', location: '标准解答审查室', speaker: '裴慎行', portraitId: 'pei-shenxing', role: 'rival',
    dialogue: ['裴慎行划掉第二种解法：考场只需要标准步骤。何耀焜把两条路线的适用条件并排写下：模板能保底，理解才能应变。', '裴慎行盯着那道变式沉默了几秒：下一次，我会让你的灵感没有入口。'],
    objective: '比较两种方法的适用边界。'
  },
  {
    id: 'ruibin-ranking', threshold: 120, act: '第十三幕', title: '被截断的成绩单', location: '模拟赛大屏', speaker: '陈睿斌', portraitId: 'chen-ruibin', role: 'rival',
    dialogue: ['陈睿斌放大何耀焜的失分截图：过程没人关心，榜单会替大家记住你在哪一层。', '何耀焜没有争辩，只把错因和三次重做结果贴回同一块屏幕：那就让榜单也记住后续。'],
    objective: '把三道失分题完成订正和重做。'
  },
  {
    id: 'campus-dream-taunt', threshold: 128, act: '第十三幕 · 宿敌支线', title: '交大梦的笑话', location: '模拟赛散场通道', speaker: '陈睿斌', portraitId: 'chen-ruibin', role: 'rival',
    dialogue: ['陈睿斌晃着低分截图：去过一次开放日，就真把自己当交大学生了？', '何耀焜收起卷子：我现在当然不是。所以我会把每个失分点留下证据，直到你的截图只能证明我曾经从哪里爬起来。'],
    objective: '用连续三次稳定完成回应一次公开轻视。'
  },
  {
    id: 'yanjun-lowpoint', threshold: 135, act: '第十四幕', title: '低谷不需要表演', location: '雨夜自习室', speaker: '陈彦君', portraitId: 'chen-yanjun', role: 'romance',
    dialogue: ['模拟分数落下，何耀焜第一次不想翻开卷子。陈彦君没有劝他振作，只坐在旁边把失分栏分成不会、算错和超时。', '她说：今晚可以难受。明天我陪你拿回第一项，但你不必在我面前装作没有受伤。'],
    objective: '完成低谷后的第一道重做题。'
  },
  {
    id: 'yuan-rematch', threshold: 150, act: '第十五幕', title: '四十五分钟再战', location: '限时赛走廊', speaker: '袁越', portraitId: 'yuan-yue', role: 'rival',
    dialogue: ['计时结束，袁越看完答卷：你比上次快了九分钟，每个等号条件还在。', '何耀焜：速度不是删步骤，是把正确路径练成反应。下一场，我还会更快。'],
    objective: '完成一次限时选择题训练。'
  },
  {
    id: 'teach-future-classmate', threshold: 160, act: '第十五幕 · 益友支线', title: '讲给未来同学听', location: '空教室黑板前', speaker: '顾砚舟', portraitId: 'gu-yanzhou', role: 'friend',
    dialogue: ['顾砚舟把粉笔递来：假装台下坐着未来的交大同学，把这道二重积分讲到他们挑不出区域错误。', '讲到第三遍，何耀焜终于不再依赖背过的步骤。顾砚舟点头：能教清楚，才说明它真正属于你。'],
    objective: '把一道综合题讲成条件、路径与验算三部分。'
  },
  {
    id: 'xiaoyixian-rest', threshold: 168, act: '第十六幕', title: '第一张恢复处方', location: '药学研修室', speaker: '小医仙', portraitId: 'xiaoyixian', role: 'romance',
    dialogue: ['小医仙按停计时器：手在抖，继续算只是在重复损耗。今晚的第一项训练是睡足七小时。', '何耀焜迟疑。她把处方递来：休息不是退出战斗，是确保明天还有能力出手。'],
    objective: '解锁情缘「青囊同心」。'
  },
  {
    id: 'yanjun-promise', threshold: 185, act: '第十七幕', title: '彼此的约定', location: '江边步道', speaker: '陈彦君', portraitId: 'chen-yanjun', role: 'romance',
    dialogue: ['陈彦君：我们都有自己的目标。我不会要求你为关系放弃道路，也不会把自己的未来交给你的结果。', '何耀焜：那就约定，无论分数高低都说真话，互相提醒节奏，然后继续成为更有能力的人。'],
    objective: '与陈彦君进入知己阶段。'
  },
  {
    id: 'letters-to-minhang', threshold: 192, act: '第十七幕 · 情缘支线', title: '写给闵行的两封信', location: '闭馆后的自习室', speaker: '陈彦君', portraitId: 'chen-yanjun', role: 'romance',
    dialogue: ['陈彦君把两张纸分开：一封写录取后的生活，一封写如果没有如愿，下一步怎样继续。', '何耀焜写完才明白，并肩不是共同幻想唯一结局，而是无论结果如何，都不让彼此停止成长。'],
    objective: '为成功与失利都准备一条诚实的下一步。'
  },
  {
    id: 'exam-triage', threshold: 198, act: '第十七幕 · 支线', title: '先拿回确定分', location: '限时模拟考场', speaker: '唐知夏', portraitId: 'tang-zhixia', role: 'friend',
    dialogue: ['唐知夏敲了敲剩余时间：坚持不是在一道题上证明倔强，是让整张卷子交出最高收益。', '何耀焜暂时标记难题，先拿回后面的确定分。回头时，他仍有完整的八分钟。'],
    objective: '完成一次限时训练并执行跳题回收策略。'
  },
  {
    id: 'medusa-strategy', threshold: 205, act: '第十八幕', title: '把噪声变成情报', location: '策略沙盘室', speaker: '美杜莎', portraitId: 'medusa', role: 'romance',
    dialogue: ['美杜莎把三名宿敌的动作拆成数量、速度和舆论三列：别恨他们，利用他们暴露你的短板。', '她抬眼：你不需要赢下每次口舌，只要让每次压力都为最终战服务。'],
    objective: '针对一个真实短板完成专项训练。'
  },
  {
    id: 'dawn-run', threshold: 218, act: '第十九幕', title: '天亮前的一圈', location: '校园操场', speaker: '陈野', portraitId: 'chen-ye', role: 'friend',
    dialogue: ['冲刺不是每天把自己练废。真正可怕的是，别人休息后还能回来，你也能。', '跑完这一圈去做二重积分。慢一点没关系，别让节奏断掉。'],
    objective: '让连续做题达到 3 天。'
  },
  {
    id: 'study-group-oath', threshold: 221, act: '第十九幕 · 益友支线', title: '四个人的缺口清单', location: '清晨看台', speaker: '陈野', portraitId: 'chen-ye', role: 'friend',
    dialogue: ['陈野、许棠、顾砚舟和何耀焜把各自最怕的章节写在同一张纸上。没有人只展示强项，也没有人替别人承担。', '他们约定每周只问三件事：哪里还不会、怎样验证、下次何时重做。交大目标第一次有了可靠的队伍感。'],
    objective: '完成一轮薄弱点公开、训练和回访。'
  },
  {
    id: 'silent-pressure', threshold: 224, act: '第十九幕 · 支线', title: '无声的三分钟', location: '空教室计时场', speaker: '韩澈', portraitId: 'han-che', role: 'rival',
    dialogue: ['韩澈把两张满分卷放在一起，只看了眼计时器：你比我慢三分钟。', '何耀焜收好答卷：那就把这三分钟拆成每一道题的选择。下一场，我会更完整，也会更快。'],
    objective: '在不丢步骤的前提下缩短一次完成时间。'
  },
  {
    id: 'mock-failure', threshold: 230, act: '第二十幕', title: '模拟考坠落', location: '空教室', speaker: '周守元', portraitId: 'zhou-shouyuan', role: 'mentor',
    dialogue: ['分数难看，所以它有价值。把失分拆准，别用“状态不好”糊弄自己。', '你已经有人陪，也有对手逼迫，但最后握笔的人仍是你。明早开始，一项项拿回来。'],
    objective: '将三道错题重新评为“独立完成”。'
  },
  {
    id: 'gate-taunt', threshold: 238, act: '第二十幕 · 宿敌支线', title: '校门前的最后嘲讽', location: '上海交大校门外', speaker: '曾宇鑫', portraitId: 'zeng-yuxin', role: 'rival',
    dialogue: ['曾宇鑫发来校门定位：有人来这里参观，有人会拿着通知书回来。你最好想清楚自己是哪一种。', '何耀焜没有回嘴，只启动下一场 Boss 战：我不靠一句狠话决定身份，我靠每一次真实掌握把答案做出来。'],
    objective: '击破一名讲次 Boss，用结果回应挑衅。'
  },
  {
    id: 'rival-triad', threshold: 245, act: '第二十一幕', title: '三面围场', location: '终极训练营', speaker: '曾宇鑫', portraitId: 'zeng-yuxin', role: 'rival',
    dialogue: ['曾宇鑫加量，袁越压缩时间，陈睿斌放大每次失误。三种压力同时袭来，等着何耀焜先乱。', '何耀焜：我会像 C 罗一样把嘘声变成下一组训练。你们越想拉垮我，我越会用更好的完成质量站回来。'],
    objective: '完成一组数量、速度和准确率兼顾的综合训练。'
  },
  {
    id: 'four-person-sprint', threshold: 250, act: '第二十一幕 · 益友支线', title: '冲刺小队不替你答题', location: '图书馆四人桌', speaker: '顾砚舟', portraitId: 'gu-yanzhou', role: 'friend',
    dialogue: ['有人负责计时，有人核对条件，有人收集反例，但落笔时每个人都必须独立完成。', '顾砚舟把答案收走：真正的队友不会制造依赖，只会让你更有能力单独走进考场。'],
    objective: '在同伴监督下独立完成一组综合题。'
  },
  {
    id: 'recovery-plan', threshold: 258, act: '第二十二幕', title: '冲刺期的留白', location: '安静药房', speaker: '小医仙', portraitId: 'xiaoyixian', role: 'romance',
    dialogue: ['小医仙划掉考前夜的加练：你现在缺的不是第十一小时，而是让前十小时真正沉淀。', '她把新的节奏表交给何耀焜：能走到最后的人，才有资格谈全力以赴。'],
    objective: '完成一次短时高质量训练后按时休息。'
  },
  {
    id: 'mail-to-future', threshold: 265, act: '第二十二幕 · 情缘支线', title: '定时发送给未来', location: '考前夜的电脑屏幕', speaker: '陈彦君', portraitId: 'chen-yanjun', role: 'romance',
    dialogue: ['陈彦君写下一封定时邮件：如果我们都到了闵行，就在思源湖边打开；如果没有，也在新的路上一起打开。', '何耀焜按下保存：最深的情缘不是拿结果绑住彼此，而是让两个人都有勇气面对真实未来。'],
    objective: '完成考前最后一轮高质量训练，然后按计划休息。'
  },
  {
    id: 'yanjun-before-exam', threshold: 272, act: '第二十三幕', title: '终章前夕', location: '考场外的长廊', speaker: '陈彦君', portraitId: 'chen-yanjun', role: 'romance',
    dialogue: ['陈彦君替何耀焜理好最后一页定义清单：明天不用证明给所有人看，只要把你已经练成的东西完整交出去。', '她伸出手：无论门后是什么，我们都不否定走到这里的彼此。考完以后，再一起讨论下一段路。'],
    objective: '完成考前最后一次定义与错题回顾。'
  },
  {
    id: 'family-future', threshold: 286, act: '第二十四幕', title: '未来的饭桌', location: '家中客厅', speaker: '父亲 · 何新平', portraitId: 'he-xinping', role: 'family',
    dialogue: ['何新平问：等这一程结束，你最想先做什么？', '何耀焜：先带你和妈妈去看看更大的世界。何新平笑了：先把自己的路走好，到时候我们一起去。'],
    objective: '把对家人的承诺落实为今天的行动。'
  },
  {
    id: 'empty-seat-photo', threshold: 294, act: '第二十四幕 · 交大支线', title: '校门合影里留出的空位', location: '家中相册', speaker: '母亲 · 钟珊燕', portraitId: 'zhong-shanyan', role: 'family',
    dialogue: ['钟珊燕翻出开放日照片，校门前特意空着两个人的位置：等真正进去那天，再让你爸和我站进去。', '何耀焜没有许诺必然成功，只说：我会把剩下的每一步走稳。无论结果如何，我都会拥有让你们生活更好的本事。'],
    objective: '完成终局前最后一次薄弱章节回炉。'
  },
  {
    id: 'future', threshold: 300, act: '终章', title: '交大之门', location: '上海交通大学校门前', speaker: '何耀焜', portraitId: 'he-yaokun', role: 'protagonist',
    dialogue: ['爸，妈，我到了。不是来赌一个奇迹，是来兑现一路写下的每一步。', '所谓最强斗魂，是我终于有能力选择未来、照顾家人，也不丢掉自己。同行者仍在，对手仍在，下一程现在开始。'],
    objective: '继续做题，把录取通知书从剧情变成现实。'
  },
  {
    id: 'siyuan-dawn', threshold: 312, act: '录取后日谈 · 一', title: '思源湖的第一场晨光', location: '上海交大闵行校区 · 思源湖', speaker: '陈彦君', portraitId: 'chen-yanjun', role: 'romance',
    dialogue: ['晨光落在湖面，两封定时邮件终于同时打开。陈彦君看完笑着问：抵达以后，最怕的是什么？', '何耀焜：怕把录取当成终点。她把新的课程表递来：那就继续并肩，但这一次，为更大的能力和更自由的未来。'],
    objective: '在新阶段继续保持真实掌握，而不是只收藏胜利。'
  },
  {
    id: 'first-lab', threshold: 326, act: '录取后日谈 · 二', title: '第一盏实验室灯', location: '上海交大教学楼', speaker: '顾砚舟', portraitId: 'gu-yanzhou', role: 'friend',
    dialogue: ['新问题没有标准答案，顾砚舟却像从前一样把条件写满白板：我们曾经练的，不只是考研题，是面对未知时不慌乱的方式。', '何耀焜打开笔记本。校门已经在身后，真正值得期待的难题才刚刚开始。'],
    objective: '把数学训练迁移到一个新的真实问题。'
  },
  {
    id: 'parents-campus', threshold: 340, act: '录取后日谈 · 三', title: '带爸妈走进校园', location: '上海交大闵行校区', speaker: '父亲 · 何新平', portraitId: 'he-xinping', role: 'family',
    dialogue: ['何新平和钟珊燕站进照片里曾经空着的位置。父亲只说了一句：这里很好，但你走到这里的本事，比这里更珍贵。', '何耀焜按下快门。让爸妈过上更好的生活不再只是一句誓言，而是从能力、选择和每个踏实的明天开始。'],
    objective: '继续积累能让自己与家人拥有更多选择的能力。'
  }
]

export function getCharacter(characterId: string) {
  return STORY_CHARACTERS.find((character) => character.id === characterId) || STORY_CHARACTERS[0]
}

export function getCharacterPortrait(character: StoryCharacter, pose: CharacterPose = 'idle') {
  return character.portraits?.[pose] || character.portraits?.idle || character.portrait
}

export function isStoryThresholdUnlocked(profile: PlayerProfile, threshold: number) {
  return getMasteryPower(profile) >= threshold
}

export function isCharacterUnlocked(profile: PlayerProfile, character: StoryCharacter) {
  return character.role === 'protagonist' || isStoryThresholdUnlocked(profile, character.unlockAt)
}

export function getRomanceRouteStatus(route: RomanceRoute, source: PlayerProfile | number) {
  const masteryPower = typeof source === 'number' ? source : getMasteryPower(source)
  if (masteryPower < route.unlockAt) return { label: '未相识', progress: 0 }
  if (masteryPower < route.confidantAt) {
    return { label: '相识', progress: Math.round(((masteryPower - route.unlockAt) / (route.confidantAt - route.unlockAt)) * 100) }
  }
  if (masteryPower < route.partnerAt) {
    return { label: '知己', progress: Math.round(((masteryPower - route.confidantAt) / (route.partnerAt - route.confidantAt)) * 100) }
  }
  return { label: '恋人', progress: 100 }
}

export function getStoryProgress(profile: PlayerProfile) {
  const masteryPower = getMasteryPower(profile)
  const current = [...STORY_CHAPTERS].reverse().find((chapter) => masteryPower >= chapter.threshold) || STORY_CHAPTERS[0]
  const next = STORY_CHAPTERS.find((chapter) => masteryPower < chapter.threshold)
  const start = current.threshold
  const end = next?.threshold ?? start
  return {
    current,
    next,
    masteryPower,
    remaining: next ? next.threshold - masteryPower : 0,
    percent: next ? Math.max(0, Math.min(100, Math.round(((masteryPower - start) / (end - start)) * 100))) : 100,
    unlocked: STORY_CHAPTERS.filter((chapter) => masteryPower >= chapter.threshold)
  }
}
