import { getProblemLectureIds } from './curriculum'
import type { PlayerProfile, Problem, ReviewLog } from '../types'

export interface ProblemMastery {
  problemId: string
  attempted: boolean
  score: number
  mastered: boolean
  corrected: boolean
  strongReviews: number
}

export interface LectureMastery {
  lectureId: string
  total: number
  attempted: number
  mastered: number
  corrected: number
  scorePercent: number
  problemMastery: ProblemMastery[]
}

function reviewScore(problem: Problem, review: ReviewLog) {
  if (problem.questionFormat !== 'open' && review.isCorrect !== true) return 0
  if (review.rating === 'multiple') return 92
  if (review.rating === 'independent') return 78
  if (review.rating === 'hint') return 36
  return 0
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
    strongReviews
  }
}

export function getLectureMastery(problems: readonly Problem[], reviews: readonly ReviewLog[], lectureId: string): LectureMastery {
  const lectureProblems = problems.filter((problem) => !problem.archived && getProblemLectureIds(problem).includes(lectureId))
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
    problemMastery
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
    .filter((problem) => !problem.archived)
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
