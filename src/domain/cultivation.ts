import type { PlayerProfile, Problem, ReviewRating } from '../types'

export type TechniqueTrigger = 'foundation' | 'choice-correct' | 'recovery' | 'independent' | 'multiple' | 'advanced'

export interface CultivationTechnique {
  id: string
  name: string
  school: string
  description: string
  triggerLabel: string
  trigger: TechniqueTrigger
  unlockLabel: string
  unlocked: (profile: PlayerProfile) => boolean
  baseXpBonus: number
  baseCoinBonus: number
}

export interface TechniqueResolution {
  technique: CultivationTechnique
  triggered: boolean
  xpBonus: number
  coinBonus: number
  masteryGained: number
  previousMastery: number
  nextMastery: number
  previousLevel: number
  nextLevel: number
}

export const CULTIVATION_TECHNIQUES: readonly CultivationTechnique[] = [
  {
    id: 'definition-heart', name: '基础锻体诀', school: '根基功法',
    description: '从低难度经典题练稳计算入口、条件检查和基础通法。',
    triggerLabel: '完成难度 1～2 的基础题', trigger: 'foundation', unlockLabel: '初始解锁', unlocked: () => true,
    baseXpBonus: 3, baseCoinBonus: 0
  },
  {
    id: 'question-eye', name: '题眼观想', school: '洞察功法',
    description: '从选项反推条件，迅速捕捉题眼与反例。',
    triggerLabel: '选择题判断正确', trigger: 'choice-correct', unlockLabel: '选择题答对 5 次',
    unlocked: (profile) => profile.correctChoiceReviews >= 5, baseXpBonus: 2, baseCoinBonus: 2
  },
  {
    id: 'error-reforge', name: '错因回火诀', school: '淬炼功法',
    description: '诚实标记不会与提示后会，把失误炼成下一次的入口。',
    triggerLabel: '自评不会或提示后会', trigger: 'recovery', unlockLabel: '累计完成 10 题',
    unlocked: (profile) => profile.totalReviews >= 10, baseXpBonus: 4, baseCoinBonus: 1
  },
  {
    id: 'closed-loop', name: '闭环独行步', school: '实战功法',
    description: '入口、变形、条件与验算全部独立闭合，奖励稳定输出。',
    triggerLabel: '自评独立完成', trigger: 'independent', unlockLabel: '独立完成 10 次',
    unlocked: (profile) => profile.independentReviews >= 10, baseXpBonus: 5, baseCoinBonus: 1
  },
  {
    id: 'many-paths', name: '多解归一功', school: '宗师功法',
    description: '比较不同解法的结构、代价和适用范围，让一题真正成为一类题。',
    triggerLabel: '自评能够多解', trigger: 'multiple', unlockLabel: '能够多解 5 次',
    unlocked: (profile) => profile.multipleSolutionReviews >= 5, baseXpBonus: 7, baseCoinBonus: 3
  },
  {
    id: 'jiaoda-cloud', name: '交大凌云诀', school: '终局功法',
    description: '为冲刺阶段准备的全局心法，稳定完成高质量题目时凝聚额外斗气。',
    triggerLabel: '独立完成或能够多解', trigger: 'advanced', unlockLabel: '累计完成 150 题',
    unlocked: (profile) => profile.totalReviews >= 150, baseXpBonus: 8, baseCoinBonus: 3
  }
] as const

export function getTechnique(id?: string) {
  return CULTIVATION_TECHNIQUES.find((technique) => technique.id === id) || CULTIVATION_TECHNIQUES[0]
}

export function getTechniqueLevel(mastery: number) {
  if (mastery >= 120) return 5
  if (mastery >= 60) return 4
  if (mastery >= 30) return 3
  if (mastery >= 10) return 2
  return 1
}

export function getTechniqueProgress(mastery: number) {
  const thresholds = [0, 10, 30, 60, 120]
  const level = getTechniqueLevel(mastery)
  const start = thresholds[level - 1]
  const end = thresholds[level] ?? start
  return {
    level,
    mastery,
    nextLevelAt: level === 5 ? null : end,
    percent: level === 5 ? 100 : Math.round(((mastery - start) / (end - start)) * 100)
  }
}

function matchesTrigger(trigger: TechniqueTrigger, problem: Problem, rating: ReviewRating, isCorrect?: boolean) {
  if (trigger === 'foundation') return problem.kind === 'problem' && (problem.difficulty || 2) <= 2
  if (trigger === 'choice-correct') return problem.questionFormat !== 'open' && isCorrect === true
  if (trigger === 'recovery') return rating === 'again' || rating === 'hint'
  if (trigger === 'independent') return rating === 'independent'
  if (trigger === 'multiple') return rating === 'multiple'
  return rating === 'independent' || rating === 'multiple'
}

export function resolveTechnique(profile: PlayerProfile, problem: Problem, rating: ReviewRating, isCorrect?: boolean): TechniqueResolution {
  const requested = getTechnique(profile.activeTechniqueId)
  const technique = requested.unlocked(profile) ? requested : CULTIVATION_TECHNIQUES[0]
  const previousMastery = profile.techniqueMastery[technique.id] || 0
  const previousLevel = getTechniqueLevel(previousMastery)
  const triggered = matchesTrigger(technique.trigger, problem, rating, isCorrect)
  const masteryGained = triggered ? 1 : 0
  const nextMastery = previousMastery + masteryGained
  const levelBonus = previousLevel - 1
  return {
    technique,
    triggered,
    xpBonus: triggered ? technique.baseXpBonus + levelBonus : 0,
    coinBonus: triggered ? technique.baseCoinBonus + Math.floor(levelBonus / 2) : 0,
    masteryGained,
    previousMastery,
    nextMastery,
    previousLevel,
    nextLevel: getTechniqueLevel(nextMastery)
  }
}
