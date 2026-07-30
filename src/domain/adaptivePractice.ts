import { getPrimaryKnowledgePoint, isProblemEligibleForPractice } from '../data/questionQuality'
import type { AdaptivePracticeMode, Problem, ReviewLog } from '../types'
import { getProblemMastery } from './mastery'

export interface AdaptiveModeDefinition {
  id: AdaptivePracticeMode
  name: string
  shortDescription: string
  queueSize: number
}

export const ADAPTIVE_MODES: AdaptiveModeDefinition[] = [
  { id: 'foundation', name: '基础巩固', shortDescription: '先补定义、条件与低阶通法', queueSize: 8 },
  { id: 'weak', name: '薄弱突破', shortDescription: '优先错题、提示题与超时题型', queueSize: 8 },
  { id: 'mixed', name: '综合混练', shortDescription: '跨知识点交替，保持迁移能力', queueSize: 10 },
  { id: 'sprint', name: '模拟冲刺', shortDescription: '高区分度题组，检验独立完成', queueSize: 10 }
]

export function getAdaptiveMode(mode: AdaptivePracticeMode = 'mixed') {
  return ADAPTIVE_MODES.find((item) => item.id === mode) || ADAPTIVE_MODES[2]
}

function jitter(id: string, seed: number) {
  let hash = seed | 0
  for (let index = 0; index < id.length; index += 1) hash = Math.imul(hash ^ id.charCodeAt(index), 16777619)
  return (hash >>> 0) / 0xffffffff
}

function getPriority(problem: Problem, reviews: readonly ReviewLog[], mode: AdaptivePracticeMode, now: number, seed: number) {
  const problemReviews = reviews.filter((review) => review.problemId === problem.id)
  const mastery = getProblemMastery(problem, problemReviews)
  const latest = problemReviews.sort((a, b) => a.reviewedAt - b.reviewedAt).at(-1)
  const ageDays = latest ? Math.min(60, Math.max(0, (now - latest.reviewedAt) / 86_400_000)) : 60
  const overdue = problem.nextReviewAt <= now ? 1 : 0
  const slow = latest?.durationSeconds && problem.estimatedMinutes
    ? Math.min(2, latest.durationSeconds / (problem.estimatedMinutes * 60))
    : 0
  const failed = latest && (latest.rating === 'again' || latest.rating === 'hint' || (problem.questionFormat !== 'open' && latest.isCorrect !== true)) ? 1 : 0
  const difficulty = problem.difficulty || 2
  const discrimination = problem.discrimination || difficulty
  const randomTieBreak = jitter(problem.id, seed)

  if (mode === 'foundation') {
    return Number(!mastery.attempted) * 80 + (6 - difficulty) * 14 + (100 - mastery.score) * 0.35 + overdue * 12 + randomTieBreak
  }
  if (mode === 'weak') {
    return failed * 95 + (100 - mastery.score) * 1.2 + slow * 20 + overdue * 18 + ageDays * 0.8 + randomTieBreak
  }
  if (mode === 'sprint') {
    return difficulty * 22 + discrimination * 20 + (100 - mastery.score) * 0.35 + ageDays * 0.6 + overdue * 8 + randomTieBreak
  }
  return Number(!mastery.attempted) * 45 + (100 - mastery.score) * 0.55 + discrimination * 10 + ageDays * 0.7 + overdue * 10 + randomTieBreak
}

function preferredCandidates(problems: readonly Problem[], mode: AdaptivePracticeMode) {
  if (mode === 'foundation') {
    const preferred = problems.filter((problem) => (problem.difficulty || 2) <= 2 || problem.kind === 'concept')
    return preferred.length >= 4 ? preferred : [...problems]
  }
  if (mode === 'sprint') {
    const preferred = problems.filter((problem) => problem.kind === 'problem' && (problem.difficulty || 2) >= 2)
    return preferred.length >= 5 ? preferred : [...problems]
  }
  return [...problems]
}

export function buildAdaptiveQueue(input: {
  problems: readonly Problem[]
  reviews: readonly ReviewLog[]
  mode?: AdaptivePracticeMode
  limit?: number
  seed?: number
  now?: number
}) {
  const mode = input.mode || 'mixed'
  const now = input.now ?? Date.now()
  const seed = input.seed ?? now
  const limit = Math.min(input.limit || getAdaptiveMode(mode).queueSize, input.problems.length)
  const eligible = preferredCandidates(input.problems.filter(isProblemEligibleForPractice), mode)
  const ranked = eligible
    .map((problem) => ({ problem, score: getPriority(problem, input.reviews, mode, now, seed) }))
    .sort((a, b) => b.score - a.score || a.problem.id.localeCompare(b.problem.id))

  const selected: Problem[] = []
  const usedKnowledge = new Set<string>()
  for (const item of ranked) {
    const knowledgePoint = getPrimaryKnowledgePoint(item.problem)
    if (usedKnowledge.has(knowledgePoint)) continue
    selected.push(item.problem)
    usedKnowledge.add(knowledgePoint)
    if (selected.length >= limit) return selected.map((problem) => problem.id)
  }
  for (const item of ranked) {
    if (selected.some((problem) => problem.id === item.problem.id)) continue
    selected.push(item.problem)
    if (selected.length >= limit) break
  }
  return selected.map((problem) => problem.id)
}
