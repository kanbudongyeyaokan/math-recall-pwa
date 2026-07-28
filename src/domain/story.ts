import type { PlayerProfile } from '../types'

export type StoryRole = 'family' | 'mentor' | 'rival' | 'friend' | 'classmate' | 'romance' | 'stranger' | 'protagonist'
export type RomanceRouteId = 'chen-yanjun' | 'medusa' | 'xiaoyixian'

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
  {
    id: 'he-yaokun', name: '何耀焜', role: 'protagonist', title: '数学修炼者', unlockAt: 0,
    summary: '从一道道题中积累选择未来的力量。',
    backstory: '普通家庭出发的考研修炼者。没有天降捷径，只有把定义、计算和复盘一遍遍练成可靠能力。',
    motivation: '考入上海交通大学，让父母拥有更从容的生活，也让自己拥有选择未来的底气。',
    firstMeeting: '故事从书桌前的第一道题开始。那个仍会害怕失败的年轻人，决定先把今天做完。',
    quote: '质疑可以很响，但我的下一步会更扎实。',
    relationship: '这就是你正在塑造的自己。', portrait: characterPortrait('hero-standard.webp')
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
    relationship: '试图用数量打乱你节奏的宿敌；你的稳定正在让他重新估量你。', portrait: characterPortrait('rival-zeng-yuxin.webp')
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
    relationship: '最深情缘。你们从补全证明开始，逐步成为低谷中仍能彼此说真话的同行者。', portrait: characterPortrait('romance-chen-yanjun.webp')
  },
  {
    id: 'yuan-yue', name: '袁越', role: 'rival', title: '速解榜首', unlockAt: 32,
    summary: '计算速度惊人，习惯用限时排名定义所有人的价值。',
    backstory: '极强的短时决策者，从小在竞赛环境里接受“慢就是弱”的规则。他不靠小动作取胜，却会不断把别人拖进自己最擅长的速度战。',
    motivation: '守住速解榜首，并证明考场只承认最后的分数和时间。',
    firstMeeting: '数列速解板前，他在何耀焜写完第二步时已经交卷。',
    quote: '完整很好，但考场不会替你暂停计时。',
    relationship: '逼你提升速度的宿敌；完整性和速度之间的较量仍未结束。', portrait: characterPortrait('rival-yuan-yue.webp')
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
    relationship: '强势情缘与战略盟友；并肩的前提是各自都能站稳。', portrait: characterPortrait('romance-medusa.webp')
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
    relationship: '试图用评价拉垮你的宿敌；你正在用持续结果夺回叙事权。', portrait: characterPortrait('rival-chen-ruibin.webp')
  },
  {
    id: 'xiaoyixian', name: '小医仙', role: 'romance', title: '恢复研究者', unlockAt: 168,
    summary: '温柔但有边界，擅长修复透支后的学习节奏。',
    backstory: '她研究记忆、睡眠与压力恢复，把温柔建立在专业判断上。她会陪伴，却不会认同用伤害自己证明决心。',
    motivation: '让更多人以可持续方式抵达目标，也守住自己的药学研究道路。',
    firstMeeting: '何耀焜连续训练后手抖，她按停计时器，开出的第一张“药方”是睡足七小时。',
    quote: '休息不是退出战斗，是让明天的你仍有能力出手。',
    relationship: '温柔坚定的情缘与恢复搭档；尊重边界才会走得更近。', portrait: characterPortrait('romance-xiaoyixian.webp')
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
    id: 'yanjun-first-proof', threshold: 22, act: '第五幕', title: '补全那一行证明', location: '天台观测室', speaker: '陈彦君', portraitId: 'chen-yanjun', role: 'romance',
    dialogue: ['陈彦君指向“显然”两个字：结果对了，但最关键的条件被藏住了。你愿意从定义重写吗？', '何耀焜补到最后一行。她合上笔记：肯承认缺口，再亲手补上，比聪明更难得。'],
    objective: '解锁情缘「并肩长路」。'
  },
  {
    id: 'yuan-speedboard', threshold: 32, act: '第六幕', title: '速解榜首', location: '数列速解板', speaker: '袁越', portraitId: 'yuan-yue', role: 'rival',
    dialogue: ['袁越提前交卷：你的完整推导不错，可考场不会为完整暂停计时。', '何耀焜：那我保住每个条件，再把速度一秒秒练回来。你的优势，会成为我的训练坐标。'],
    objective: '独立完成一次数列极限证明。'
  },
  {
    id: 'two-methods', threshold: 45, act: '第七幕', title: '两条路在答案相遇', location: '求导兵器阁', speaker: '顾砚舟', portraitId: 'gu-yanzhou', role: 'friend',
    dialogue: ['我走隐函数，你走参数方程。最后在同一个答案碰面，才算真的稳。', '朋友不是替你做题的人，是敢指出你漏了哪一项的人。'],
    objective: '完成第一次一题多解。'
  },
  {
    id: 'yuxin-overtime', threshold: 58, act: '第八幕', title: '凌晨两点的截图', location: '训练群榜单', speaker: '曾宇鑫', portraitId: 'zeng-yuxin', role: 'rival',
    dialogue: ['群里弹出曾宇鑫凌晨两点的第七次打卡。他故意点名：何耀焜，睡得这么早，还想追谁？', '何耀焜关掉消息：明天的清醒也是训练资源。我要赢的是考场，不是熬夜截图。'],
    objective: '守住自己的训练计划，不被无效比较带走。'
  },
  {
    id: 'yanjun-night-study', threshold: 72, act: '第九幕', title: '深夜并肩训练', location: '闭馆前的长桌', speaker: '陈彦君', portraitId: 'chen-yanjun', role: 'romance',
    dialogue: ['陈彦君把两份解答并排：你负责找我证明的漏洞，我负责查你的计算边界，谁也别只说好听的。', '闭馆铃响时，两页批注都写满了。她轻声说：和你一起训练，不需要假装永远强大。'],
    objective: '完成一次一题多解，并认真比较适用条件。'
  },
  {
    id: 'home-call', threshold: 85, act: '第十幕', title: '一碗留到深夜的饭', location: '家中厨房', speaker: '母亲 · 钟珊燕', portraitId: 'zhong-shanyan', role: 'family',
    dialogue: ['钟珊燕把饭推近：家里现在不富裕，不等于你必须把每一天都过成苦役。结果重要，你也重要。', '何耀焜：我想让你们以后选喜欢的生活，不再只选最省钱的那一个。但我也会好好走到那里。'],
    objective: '继续做题，也守住睡眠与吃饭。'
  },
  {
    id: 'medusa-pact', threshold: 95, act: '第十一幕', title: '女王划定战场', location: '联合训练指挥厅', speaker: '美杜莎', portraitId: 'medusa', role: 'romance',
    dialogue: ['美杜莎合上榜单：回应挑衅之前，先告诉我这会提高哪项能力。若没有，就不值得你浪费一秒。', '她递来一枚策略令：真正的强者决定战场。何耀焜，你要做追赶者，还是规则制定者？'],
    objective: '解锁情缘「女王盟约」。'
  },
  {
    id: 'mistake-cards', threshold: 108, act: '第十二幕', title: '错题不是判决书', location: '教学楼台阶', speaker: '江楠', portraitId: 'jiang-nan', role: 'classmate',
    dialogue: ['你看，我这盒彩卡全是错题。它们不是黑历史，是已经交过学费的情报。', '她抽出一张递来：写下触发条件。下次再见到它，先认出它，再打赢它。'],
    objective: '累计完成 108 道题。'
  },
  {
    id: 'ruibin-ranking', threshold: 120, act: '第十三幕', title: '被截断的成绩单', location: '模拟赛大屏', speaker: '陈睿斌', portraitId: 'chen-ruibin', role: 'rival',
    dialogue: ['陈睿斌放大何耀焜的失分截图：过程没人关心，榜单会替大家记住你在哪一层。', '何耀焜没有争辩，只把错因和三次重做结果贴回同一块屏幕：那就让榜单也记住后续。'],
    objective: '把三道失分题完成订正和重做。'
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
    id: 'mock-failure', threshold: 230, act: '第二十幕', title: '模拟考坠落', location: '空教室', speaker: '周守元', portraitId: 'zhou-shouyuan', role: 'mentor',
    dialogue: ['分数难看，所以它有价值。把失分拆准，别用“状态不好”糊弄自己。', '你已经有人陪，也有对手逼迫，但最后握笔的人仍是你。明早开始，一项项拿回来。'],
    objective: '将三道错题重新评为“独立完成”。'
  },
  {
    id: 'rival-triad', threshold: 245, act: '第二十一幕', title: '三面围场', location: '终极训练营', speaker: '曾宇鑫', portraitId: 'zeng-yuxin', role: 'rival',
    dialogue: ['曾宇鑫加量，袁越压缩时间，陈睿斌放大每次失误。三种压力同时袭来，等着何耀焜先乱。', '何耀焜：我会像 C 罗一样把嘘声变成下一组训练。你们越想拉垮我，我越会用更好的完成质量站回来。'],
    objective: '完成一组数量、速度和准确率兼顾的综合训练。'
  },
  {
    id: 'recovery-plan', threshold: 258, act: '第二十二幕', title: '冲刺期的留白', location: '安静药房', speaker: '小医仙', portraitId: 'xiaoyixian', role: 'romance',
    dialogue: ['小医仙划掉考前夜的加练：你现在缺的不是第十一小时，而是让前十小时真正沉淀。', '她把新的节奏表交给何耀焜：能走到最后的人，才有资格谈全力以赴。'],
    objective: '完成一次短时高质量训练后按时休息。'
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
    id: 'future', threshold: 300, act: '终章', title: '交大之门', location: '上海交通大学校门前', speaker: '何耀焜', portraitId: 'he-yaokun', role: 'protagonist',
    dialogue: ['爸，妈，我到了。不是来赌一个奇迹，是来兑现一路写下的每一步。', '所谓最强斗魂，是我终于有能力选择未来、照顾家人，也不丢掉自己。同行者仍在，对手仍在，下一程现在开始。'],
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
