import type { PlayerProfile, ReviewRating, RewardCard, RewardRarity, ShopItem } from '../types'

export const REALMS = [
  { name: '斗者', xpPerStar: 80 },
  { name: '斗师', xpPerStar: 100 },
  { name: '大斗师', xpPerStar: 125 },
  { name: '斗灵', xpPerStar: 155 },
  { name: '斗王', xpPerStar: 190 },
  { name: '斗皇', xpPerStar: 230 },
  { name: '斗宗', xpPerStar: 280 },
  { name: '斗尊', xpPerStar: 340 },
  { name: '斗圣', xpPerStar: 420 },
  { name: '斗帝', xpPerStar: 0 }
] as const

export interface RealmProgress {
  realm: (typeof REALMS)[number]['name']
  realmIndex: number
  star: number
  xpIntoStar: number
  xpForStar: number
  progressPercent: number
  totalStars: number
  isPeak: boolean
  label: string
}

export function getRealmProgress(xp: number): RealmProgress {
  let remaining = Math.max(0, xp)
  let completedStars = 0

  for (let realmIndex = 0; realmIndex < REALMS.length - 1; realmIndex += 1) {
    const realm = REALMS[realmIndex]
    const realmCost = realm.xpPerStar * 9
    if (remaining < realmCost) {
      const star = Math.floor(remaining / realm.xpPerStar) + 1
      const xpIntoStar = remaining % realm.xpPerStar
      return {
        realm: realm.name,
        realmIndex,
        star,
        xpIntoStar,
        xpForStar: realm.xpPerStar,
        progressPercent: (xpIntoStar / realm.xpPerStar) * 100,
        totalStars: completedStars + star - 1,
        isPeak: false,
        label: `${realm.name} · ${star} 星`
      }
    }
    remaining -= realmCost
    completedStars += 9
  }

  return {
    realm: '斗帝',
    realmIndex: REALMS.length - 1,
    star: 1,
    xpIntoStar: 0,
    xpForStar: 0,
    progressPercent: 100,
    totalStars: completedStars,
    isPeak: true,
    label: '斗帝 · 巅峰'
  }
}

export function getRealmAdvance(previousXp: number, nextXp: number) {
  const previous = getRealmProgress(previousXp)
  const next = getRealmProgress(nextXp)
  return {
    advanced: next.totalStars > previous.totalStars || next.isPeak !== previous.isPeak,
    realmBreakthrough: next.realmIndex > previous.realmIndex,
    previous,
    next
  }
}

export type TitleTier = '凡品' | '玄品' | '地品' | '天品' | '帝品'
export type TitleCategory = '征途' | '掌握' | '连胜' | '挑战' | '境界'

interface TitleDefinition {
  id: string
  name: string
  tier: TitleTier
  category: TitleCategory
  requirement: string
  story: string
  target: number
  progress: (profile: PlayerProfile) => number
}

export const TITLE_DEFINITIONS: readonly TitleDefinition[] = [
  { id: 'first-step', name: '斗气化题', tier: '凡品', category: '征途', requirement: '开始修炼', story: '第一缕斗气并不耀眼，却标志着何耀焜真正开始把目标变成每天的行动。', target: 1, progress: () => 1 },
  { id: 'first-flame', name: '焜火初燃', tier: '凡品', category: '征途', requirement: '完成第一道题', story: '第一题闭环完成，焜火在卷边亮起。往后的每一步，都从这次落笔开始。', target: 1, progress: (profile) => profile.totalReviews },
  { id: 'error-hunter', name: '错因猎手', tier: '玄品', category: '掌握', requirement: '完成 10 道题', story: '不逃避错题的人，才有资格追踪真正的薄弱处。', target: 10, progress: (profile) => profile.totalReviews },
  { id: 'limit-breaker', name: '极限破壁者', tier: '玄品', category: '掌握', requirement: '独立完成 10 次', story: '没有提示仍能找到入口，第一道真正的壁垒已经被你亲手击穿。', target: 10, progress: (profile) => profile.independentReviews },
  { id: 'choice-sentinel', name: '定理守门人', tier: '玄品', category: '掌握', requirement: '选择题答对 15 次', story: '条件、范围和结论都逃不过你的检查，似是而非的选项止步于此。', target: 15, progress: (profile) => profile.correctChoiceReviews },
  { id: 'many-path-master', name: '多解宗师', tier: '地品', category: '掌握', requirement: '能够多解 5 次', story: '答案只有一个，通往答案的道路却已在你眼前展开。', target: 5, progress: (profile) => profile.multipleSolutionReviews },
  { id: 'three-day-flame', name: '三日凝火', tier: '凡品', category: '连胜', requirement: '连续做题 3 天', story: '三日不熄的火苗，证明行动正在越过一时兴起。', target: 3, progress: (profile) => profile.streak },
  { id: 'seven-day-lamp', name: '七日燃灯', tier: '玄品', category: '连胜', requirement: '连续做题 7 天', story: '一周风雨未曾吹灭桌前的灯，稳定开始成为你的武器。', target: 7, progress: (profile) => profile.streak },
  { id: 'fifty-forged', name: '百炼题心', tier: '地品', category: '征途', requirement: '完成 50 道题', story: '五十次完整思考，让躁动沉下去，让题心慢慢成形。', target: 50, progress: (profile) => profile.totalReviews },
  { id: 'hundred-crown', name: '百题问鼎', tier: '地品', category: '征途', requirement: '完成 100 道题', story: '百题不是终点，而是你第一次拥有可被验证的长期积累。', target: 100, progress: (profile) => profile.totalReviews },
  { id: 'thirty-lectures', name: '三十讲巡猎者', tier: '天品', category: '征途', requirement: '完成 150 道题', story: '你已经穿过高数主线的大部分关隘，陌生题型开始显露熟悉的骨架。', target: 150, progress: (profile) => profile.totalReviews },
  { id: 'correction-reversal', name: '逆风翻盘者', tier: '地品', category: '掌握', requirement: '订正并掌握 10 道错题', story: '曾经击倒你的题，如今都成了脚下的台阶。', target: 10, progress: (profile) => profile.correctedProblemIds.length },
  { id: 'boss-slayer', name: '十八关镇守者', tier: '天品', category: '挑战', requirement: '击败 3 名讲次 Boss', story: '关隘不再只是地图上的名字，三枚胜印已经刻入你的战绩。', target: 3, progress: (profile) => Object.keys(profile.bossVictories).length },
  { id: 'duel-winner', name: '五题争锋客', tier: '玄品', category: '挑战', requirement: '赢下 3 场五题挑战', story: '计时与压迫都没能打乱你的推导，三场胜利证明你能在竞争中保持清醒。', target: 3, progress: (profile) => profile.duelWins },
  { id: 'high-math-gate', name: '高数玄关破阵者', tier: '天品', category: '掌握', requirement: '独立完成 100 次', story: '一百次不借外力的闭环，让高数玄关真正向你敞开。', target: 100, progress: (profile) => profile.independentReviews },
  { id: 'many-path-lord', name: '何氏万法阁主', tier: '天品', category: '掌握', requirement: '能够多解 30 次', story: '何耀焜以自己的方法谱系立阁，万法入卷，各有来路。', target: 30, progress: (profile) => profile.multipleSolutionReviews },
  { id: 'nine-turns', name: '九转破境人', tier: '天品', category: '境界', requirement: '跨越 5 个大境界', story: '每次破境都来自真实完成。五次跨越之后，旧日的自己已在身后很远。', target: 5, progress: (profile) => profile.breakthroughCount },
  { id: 'matrix-stargazer', name: '矩阵观星者', tier: '地品', category: '境界', requirement: '抵达斗王', story: '抵达斗王之时，矩阵如星图展开，结构开始代替蛮力。', target: 4, progress: (profile) => getRealmProgress(profile.xp).realmIndex },
  { id: 'formula-sea', name: '公式焚海', tier: '天品', category: '境界', requirement: '抵达斗宗', story: '公式不再是零散记忆，它们在你的方法体系中汇成可调度的火海。', target: 6, progress: (profile) => getRealmProgress(profile.xp).realmIndex },
  { id: 'theorem-judge', name: '定理裁决者', tier: '帝品', category: '境界', requirement: '抵达斗圣', story: '每一次使用定理，你都能说清条件、路径和边界。斗圣之名由此而来。', target: 8, progress: (profile) => getRealmProgress(profile.xp).realmIndex },
  { id: 'all-methods', name: '万题归宗', tier: '帝品', category: '境界', requirement: '抵达斗帝', story: '千般题面终归结构，万种路径皆可验证。此称号只为走到巅峰的人亮起。', target: 9, progress: (profile) => getRealmProgress(profile.xp).isPeak ? 9 : getRealmProgress(profile.xp).realmIndex }
] as const

export const SHOP_ITEMS: readonly ShopItem[] = [
  { id: 'outfit-apprentice', name: '青衫学徒', description: '何耀焜的初始修炼服', category: 'outfit', price: 0, swatch: '#55765b' },
  { id: 'outfit-flame', name: '青焰练功服', description: '独立完成时更显锋芒', category: 'outfit', price: 80, swatch: '#168a83' },
  { id: 'outfit-starseer', name: '星陨学者袍', description: '献给看见题目结构的人', category: 'outfit', price: 180, swatch: '#5367a5' },
  { id: 'outfit-master', name: '金鳞宗师衣', description: '多解之路汇于一身', category: 'outfit', price: 360, swatch: '#b98528' },
  { id: 'outfit-jiaoda', name: '交大赤曜战衣', description: '把目标穿在身上，不忘出发理由', category: 'outfit', price: 720, swatch: '#a93432' },
  { id: 'aura-none', name: '静心无相', description: '收敛光芒，专注题面', category: 'aura', price: 0, swatch: '#d9dfda' },
  { id: 'aura-iron', name: '玄铁题环', description: '由一次次订正淬炼而成', category: 'aura', price: 100, swatch: '#68746d' },
  { id: 'aura-lotus', name: '青莲光环', description: '连续修炼者的清醒之火', category: 'aura', price: 240, swatch: '#58c9b6' },
  { id: 'aura-crimson', name: '赤曜破阵焰', description: '攻克薄弱板块后燃起的赤焰', category: 'aura', price: 420, swatch: '#d44a3d' },
  { id: 'aura-emperor', name: '帝境金环', description: '为长期主义者保留的荣光', category: 'aura', price: 680, swatch: '#e3b64d' },
  { id: 'weapon-scroll', name: '演算卷轴', description: '记录入口、变形与验算的完整推导', category: 'weapon', price: 0, swatch: '#d7c79f' },
  { id: 'weapon-ruler', name: '极限玄尺', description: '裁开趋近过程与误差边界', category: 'weapon', price: 90, swatch: '#78999c' },
  { id: 'weapon-compass', name: '多元星规', description: '看清区域、方向与变量关系', category: 'weapon', price: 210, swatch: '#4e8f9b' },
  { id: 'weapon-blade', name: '泰勒焜刃', description: '用局部展开劈开复杂极限', category: 'weapon', price: 420, swatch: '#cf6145' },
  { id: 'weapon-emperor', name: '万法归宗尺', description: '多种方法最终归于结构', category: 'weapon', price: 800, swatch: '#e1b647' },
  { id: 'accessory-none', name: '素心束带', description: '初始配饰，心绪安定', category: 'accessory', price: 0, swatch: '#b9b6aa' },
  { id: 'accessory-jade', name: '错因青玉', description: '提醒自己先检查条件与定义域', category: 'accessory', price: 75, swatch: '#67a88e' },
  { id: 'accessory-badge', name: '交大坐标徽记', description: '目标经纬已经写进征途', category: 'accessory', price: 190, swatch: '#bc3837' },
  { id: 'accessory-crown', name: '九星演算冠', description: '星阶突破时浮现的演算纹章', category: 'accessory', price: 390, swatch: '#d0a33d' },
  { id: 'companion-none', name: '独行之路', description: '暂不携带陪伴灵体', category: 'companion', price: 0, swatch: '#9ba3a0' },
  { id: 'companion-ember', name: '焜火小灵', description: '答对时绕着你欢呼的青焰灵体', category: 'companion', price: 120, swatch: '#39c6ad' },
  { id: 'companion-owl', name: '定理守夜灵', description: '陪你在夜里查漏补缺', category: 'companion', price: 260, swatch: '#6f79a6' },
  { id: 'companion-star', name: '沪城引路星', description: '在交大主线前方标出方向', category: 'companion', price: 520, swatch: '#e0bd52' },
  { id: 'companion-memory', name: '守护心灯', description: '来自家人的牵挂，不替你做题却一直照亮你', category: 'companion', price: 900, swatch: '#ec806f' }
] as const

export function getTitleStatuses(profile: PlayerProfile) {
  return TITLE_DEFINITIONS.map((title) => {
    const current = Math.max(0, title.progress(profile))
    return {
      ...title,
      current,
      isUnlocked: current >= title.target,
      progressPercent: Math.min(100, Math.round((current / title.target) * 100))
    }
  })
}

export function getUnlockedTitles(profile: PlayerProfile) {
  return getTitleStatuses(profile).filter((title) => title.isUnlocked).map((title) => title.name)
}

export function getTodayKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function daysBetween(dateA: string, dateB: string) {
  if (!dateA || !dateB) return Number.POSITIVE_INFINITY
  const a = new Date(`${dateA}T12:00:00`).getTime()
  const b = new Date(`${dateB}T12:00:00`).getTime()
  return Math.round((b - a) / 86_400_000)
}

export function applyStudyToProfile(
  profile: PlayerProfile,
  xp: number,
  now = new Date(),
  result?: { rating?: ReviewRating; isCorrect?: boolean; realmBreakthrough?: boolean; coinsEarned?: number }
): PlayerProfile {
  const today = getTodayKey(now)
  const distance = daysBetween(profile.lastStudyDate, today)
  const streak = distance === 0 ? profile.streak : distance === 1 ? profile.streak + 1 : 1

  return {
    ...profile,
    xp: profile.xp + xp,
    coins: profile.coins + (result?.coinsEarned || 0),
    lifetimeCoins: profile.lifetimeCoins + (result?.coinsEarned || 0),
    streak,
    lastStudyDate: today,
    totalReviews: profile.totalReviews + 1,
    independentReviews: (profile.independentReviews || 0) + (result?.rating === 'independent' ? 1 : 0),
    multipleSolutionReviews: (profile.multipleSolutionReviews || 0) + (result?.rating === 'multiple' ? 1 : 0),
    correctChoiceReviews: (profile.correctChoiceReviews || 0) + (result?.isCorrect ? 1 : 0),
    breakthroughCount: (profile.breakthroughCount || 0) + (result?.realmBreakthrough ? 1 : 0)
  }
}

const COIN_REWARDS: Record<ReviewRating, number> = {
  again: 2,
  hint: 5,
  independent: 10,
  multiple: 16
}

export function calculateCoinReward(rating: ReviewRating, isCorrect?: boolean, alreadyRewardedToday = false) {
  if (alreadyRewardedToday) return 0
  return COIN_REWARDS[rating] + (isCorrect ? 3 : 0)
}

const ENCOURAGEMENTS: Record<ReviewRating, readonly string[]> = {
  again: [
    '{name}，敢把不会标出来，就是在把漏洞变成下一次的得分点。',
    '{name}，这次没有白做：你已经准确定位了需要补强的那一环。'
  ],
  hint: [
    '{name}，提示只负责点火，真正走完推导的人是你。',
    '{name}，入口已经抓住，下次把这条路完整走成自己的。'
  ],
  independent: [
    '{name}，这一题是你独立拿下的，思路和分数都算你的。',
    '{name}，没有借力也能闭合推导，这就是扎实的进步。'
  ],
  multiple: [
    '{name}，你不只解出了题，还看见了方法之间的联系。',
    '{name}，一题多解不是炫技，是你已经开始掌控结构。'
  ]
}

export function getEncouragement(name: string, rating: ReviewRating, isCorrect?: boolean, seed = Date.now()) {
  const pool = ENCOURAGEMENTS[rating]
  const message = pool[Math.abs(seed) % pool.length].replace('{name}', name || '何耀焜')
  if (isCorrect && (rating === 'independent' || rating === 'multiple')) return `${message} 选择判断也准确命中。`
  return message
}

const CARD_POOLS: Record<ReviewRating, readonly (readonly [string, string])[]> = {
  again: [
    ['错因余烬', '一次失手不是失败，它标出了下一次破局的位置。'],
    ['错因碎晶', '定位最早失误，重新锻造最可靠的解题主线。']
  ],
  hint: [
    ['思路回响', '提示已经退场，留下的结构要变成自己的。'],
    ['公式刻印', '记住适用条件，公式才真正属于你。']
  ],
  independent: [
    ['破局密钥', '你独立找到了入口，也守住了推导链。'],
    ['结构洞察', '越过计算表面，看见题目真正的骨架。']
  ],
  multiple: [
    ['多解星图', '同一终点被不同路线照亮。'],
    ['万法归一', '方法不止一种，结构却在同一处汇合。']
  ]
}

export function createRewardCard(problemId: string, rating: ReviewRating, now = Date.now()): RewardCard {
  const pool = CARD_POOLS[rating]
  const selected = pool[Math.abs(now) % pool.length]
  const rarity: RewardRarity = rating === 'multiple'
    ? 'legendary'
    : rating === 'independent'
      ? 'epic'
      : rating === 'hint'
        ? 'rare'
        : 'common'

  return {
    id: crypto.randomUUID(),
    problemId,
    name: selected[0],
    description: selected[1],
    rarity,
    earnedAt: now
  }
}
