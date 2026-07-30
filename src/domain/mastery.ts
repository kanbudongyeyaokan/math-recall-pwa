import { getProblemLectureIds } from './curriculum'
import { getPrimaryKnowledgePoint, isProblemEligibleForPractice } from '../data/questionQuality'
import type { PlayerProfile, Problem, ReviewLog } from '../types'

export interface ProblemMastery {
  problemId: string
  attempted: boolean
  score: number
  mastered: boolean
  corrected: boolean
  strongReviews: number
  lastReviewedAt?: number
  latestRating?: ReviewLog['rating']
  latestCorrect?: boolean
  averageDurationSeconds?: number
}

export interface KnowledgeMastery {
  knowledgePoint: string
  total: number
  attempted: number
  mastered: number
  scorePercent: number
  lastReviewedAt?: number
  problemIds: string[]
}

export interface LectureMastery {
  lectureId: string
  total: number
  attempted: number
  mastered: number
  corrected: number
  scorePercent: number
  problemMastery: ProblemMastery[]
  knowledgeMastery?: KnowledgeMastery[]
}

function reviewScore(problem: Problem, review: ReviewLog) {
  if (problem.questionFormat !== 'open' && review.isCorrect !== true) return 0
  let score = review.rating === 'multiple' ? 92 : review.rating === 'independent' ? 78 : review.rating === 'hint' ? 36 : 0
  const expectedSeconds = Math.max(60, (problem.estimatedMinutes || 6) * 60)
  if (review.durationSeconds && score > 0) {
    const ratio = review.durationSeconds / expectedSeconds
    if (ratio > 2.2) score -= 12
    else if (ratio > 1.5) score -= 6
    else if (ratio < 0.12) score -= 8
  }
  return Math.max(0, score)
}

function isStrong(problem: Problem, review: ReviewLog) {
  return reviewScore(problem, review) >= 78
}

export function getProblemMastery(problem: Problem, reviews: readonly ReviewLog[]): ProblemMastery {
  const ordered = reviews
    .filter((review) => review.problemId === problem.id)
    .sort((a, b) => a.reviewedAt - b.reviewedAt)
  const latest = ordered.at(-1)
  const strongReviews = ordered.filter((review) => isStrong(problem, review)).length
  const latestScore = latest ? reviewScore(problem, latest) : 0
  const stabilityBonus = latestScore >= 78 ? Math.min(14, Math.max(0, strongReviews - 1) * 7) : 0
  const score = Math.min(100, latestScore + stabilityBonus)
  let lastStrongIndex = -1
  ordered.forEach((review, index) => {
    if (isStrong(problem, review)) lastStrongIndex = index
  })
  const corrected = lastStrongIndex > 0 && ordered.slice(0, lastStrongIndex).some((review) => reviewScore(problem, review) < 78)
  return {
    problemId: problem.id,
    attempted: ordered.length > 0,
    score,
    mastered: score >= 75,
    corrected,
    strongReviews,
    lastReviewedAt: latest?.reviewedAt,
    latestRating: latest?.rating,
    latestCorrect: latest?.isCorrect,
    averageDurationSeconds: ordered.length
      ? Math.round(ordered.reduce((sum, review) => sum + (review.durationSeconds || 0), 0) / ordered.filter((review) => review.durationSeconds).length) || undefined
      : undefined
  }
}

export function getKnowledgeMastery(problems: readonly Problem[], reviews: readonly ReviewLog[]): KnowledgeMastery[] {
  const reviewsByProblem = new Map<string, ReviewLog[]>()
  for (const review of reviews) {
    const list = reviewsByProblem.get(review.problemId) || []
    list.push(review)
    reviewsByProblem.set(review.problemId, list)
  }
  const groups = new Map<string, { problems: Problem[]; mastery: ProblemMastery[] }>()
  for (const problem of problems.filter(isProblemEligibleForPractice)) {
    const knowledgePoint = getPrimaryKnowledgePoint(problem)
    const group = groups.get(knowledgePoint) || { problems: [], mastery: [] }
    group.problems.push(problem)
    group.mastery.push(getProblemMastery(problem, reviewsByProblem.get(problem.id) || []))
    groups.set(knowledgePoint, group)
  }
  return [...groups.entries()].map(([knowledgePoint, group]) => {
    const attempted = group.mastery.filter((item) => item.attempted).length
    const mastered = group.mastery.filter((item) => item.mastered).length
    const scoreTotal = group.mastery.reduce((sum, item) => sum + item.score, 0)
    const reviewedTimes = group.mastery.flatMap((item) => item.lastReviewedAt || [])
    return {
      knowledgePoint,
      total: group.problems.length,
      attempted,
      mastered,
      scorePercent: group.problems.length ? Math.round(scoreTotal / group.problems.length) : 0,
      lastReviewedAt: reviewedTimes.length ? Math.max(...reviewedTimes) : undefined,
      problemIds: group.problems.map((problem) => problem.id)
    }
  }).sort((a, b) => a.scorePercent - b.scorePercent || a.knowledgePoint.localeCompare(b.knowledgePoint))
}

export function getLectureMastery(problems: readonly Problem[], reviews: readonly ReviewLog[], lectureId: string): LectureMastery {
  const lectureProblems = problems.filter((problem) => isProblemEligibleForPractice(problem) && getProblemLectureIds(problem).includes(lectureId))
  const reviewsByProblem = new Map<string, ReviewLog[]>()
  for (const review of reviews) {
    const list = reviewsByProblem.get(review.problemId) || []
    list.push(review)
    reviewsByProblem.set(review.problemId, list)
  }
  const problemMastery = lectureProblems.map((problem) => getProblemMastery(problem, reviewsByProblem.get(problem.id) || []))
  const attempted = problemMastery.filter((item) => item.attempted).length
  const mastered = problemMastery.filter((item) => item.mastered).length
  const corrected = problemMastery.filter((item) => item.corrected).length
  const scoreTotal = problemMastery.reduce((sum, item) => sum + item.score, 0)
  return {
    lectureId,
    total: lectureProblems.length,
    attempted,
    mastered,
    corrected,
    scorePercent: lectureProblems.length ? Math.round(scoreTotal / lectureProblems.length) : 0,
    problemMastery,
    knowledgeMastery: getKnowledgeMastery(lectureProblems, reviews)
  }
}

export function rebuildProfileMastery(profile: PlayerProfile, problems: readonly Problem[], reviews: readonly ReviewLog[]) {
  const reviewsByProblem = new Map<string, ReviewLog[]>()
  for (const review of reviews) {
    const list = reviewsByProblem.get(review.problemId) || []
    list.push(review)
    reviewsByProblem.set(review.problemId, list)
  }
  const mastery = problems
    .filter(isProblemEligibleForPractice)
    .map((problem) => getProblemMastery(problem, reviewsByProblem.get(problem.id) || []))
  return {
    ...profile,
    masteredProblemIds: mastery.filter((item) => item.mastered).map((item) => item.problemId),
    correctedProblemIds: mastery.filter((item) => item.corrected).map((item) => item.problemId)
  }
}

export function applyProblemMasteryToProfile(
  profile: PlayerProfile,
  problem: Problem,
  reviews: readonly ReviewLog[]
): PlayerProfile {
  const mastery = getProblemMastery(problem, reviews)
  const mastered = new Set(profile.masteredProblemIds)
  const corrected = new Set(profile.correctedProblemIds)
  if (mastery.mastered) mastered.add(problem.id)
  else mastered.delete(problem.id)
  if (mastery.corrected) corrected.add(problem.id)
  else corrected.delete(problem.id)
  return { ...profile, masteredProblemIds: [...mastered], correctedProblemIds: [...corrected] }
}

export function getMasteryPower(profile: PlayerProfile) {
  if (!Array.isArray(profile.masteredProblemIds) || !Array.isArray(profile.correctedProblemIds)) {
    return profile.totalReviews || 0
  }
  const bossVictories = Object.keys(profile.bossVictories || {}).length
  return profile.masteredProblemIds.length + profile.correctedProblemIds.length + bossVictories * 8
}
