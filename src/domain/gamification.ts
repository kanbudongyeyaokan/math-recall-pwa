import type { PlayerProfile, ReviewRating, RewardCard, RewardRarity } from '../types'

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

export const TITLE_DEFINITIONS = [
  { name: '斗气化题', requirement: '开始修炼', unlocked: () => true },
  { name: '错因猎手', requirement: '完成 10 次有效回忆', unlocked: (profile: PlayerProfile) => profile.totalReviews >= 10 },
  { name: '极限破壁者', requirement: '独立完成 10 次', unlocked: (profile: PlayerProfile) => profile.independentReviews >= 10 },
  { name: '定理守门人', requirement: '选择题答对 15 次', unlocked: (profile: PlayerProfile) => profile.correctChoiceReviews >= 15 },
  { name: '多解宗师', requirement: '能够多解 5 次', unlocked: (profile: PlayerProfile) => profile.multipleSolutionReviews >= 5 },
  { name: '三日凝火', requirement: '连续复习 3 天', unlocked: (profile: PlayerProfile) => profile.streak >= 3 },
  { name: '七日燃灯', requirement: '连续复习 7 天', unlocked: (profile: PlayerProfile) => profile.streak >= 7 },
  { name: '百炼题心', requirement: '完成 50 次有效回忆', unlocked: (profile: PlayerProfile) => profile.totalReviews >= 50 },
  { name: '百题问鼎', requirement: '完成 100 次有效回忆', unlocked: (profile: PlayerProfile) => profile.totalReviews >= 100 },
  { name: '九转破境人', requirement: '跨越 5 个大境界', unlocked: (profile: PlayerProfile) => profile.breakthroughCount >= 5 },
  { name: '矩阵观星者', requirement: '抵达斗王', unlocked: (profile: PlayerProfile) => getRealmProgress(profile.xp).realmIndex >= 4 },
  { name: '公式焚海', requirement: '抵达斗宗', unlocked: (profile: PlayerProfile) => getRealmProgress(profile.xp).realmIndex >= 6 },
  { name: '定理裁决者', requirement: '抵达斗圣', unlocked: (profile: PlayerProfile) => getRealmProgress(profile.xp).realmIndex >= 8 },
  { name: '万题归宗', requirement: '抵达斗帝', unlocked: (profile: PlayerProfile) => getRealmProgress(profile.xp).isPeak }
] as const

export function getTitleStatuses(profile: PlayerProfile) {
  return TITLE_DEFINITIONS.map((title) => ({ ...title, isUnlocked: title.unlocked(profile) }))
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
  result?: { rating?: ReviewRating; isCorrect?: boolean; realmBreakthrough?: boolean }
): PlayerProfile {
  const today = getTodayKey(now)
  const distance = daysBetween(profile.lastStudyDate, today)
  const streak = distance === 0 ? profile.streak : distance === 1 ? profile.streak + 1 : 1

  return {
    ...profile,
    xp: profile.xp + xp,
    streak,
    lastStudyDate: today,
    totalReviews: profile.totalReviews + 1,
    independentReviews: (profile.independentReviews || 0) + (result?.rating === 'independent' ? 1 : 0),
    multipleSolutionReviews: (profile.multipleSolutionReviews || 0) + (result?.rating === 'multiple' ? 1 : 0),
    correctChoiceReviews: (profile.correctChoiceReviews || 0) + (result?.isCorrect ? 1 : 0),
    breakthroughCount: (profile.breakthroughCount || 0) + (result?.realmBreakthrough ? 1 : 0)
  }
}

const CARD_POOLS: Record<ReviewRating, readonly (readonly [string, string])[]> = {
  again: [
    ['错因余烬', '一次失手不是失败，它标出了下一次破局的位置。'],
    ['定义碎晶', '回到定义，重新锻造最可靠的起点。']
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
