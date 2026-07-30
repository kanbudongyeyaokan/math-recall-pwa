import { CALCULUS_LECTURES, getProblemLectureIds, getProblemRole } from './curriculum'
import { isProblemEligibleForPractice } from '../data/questionQuality'
import { shuffleProblemIds } from './practiceCycle'
import type { LectureMastery } from './mastery'
import type { PracticeSessionOutcome, Problem } from '../types'

export interface LectureBoss {
  id: string
  lectureId: string
  name: string
  title: string
  opponentId: string
  maxHp: number
}

const BOSS_NAMES = [
  ['极限噬界者', '连续山门'], ['数列巡天者', '递推石阶'], ['导数镜魔', '定义裂隙'], ['求导千刃主', '复合兵器阁'],
  ['曲线判官', '几何试炼场'], ['中值守关人', '定理锁链'], ['变化率傀儡师', '现实演算域'], ['积分源泉兽', '概念与敛散边界'],
  ['积分锻造王', '换元分部炉'], ['旋转秘境主', '面积体积之门'], ['积分裁决者', '等式不等式审判'], ['万象建模师', '物理经济战场'],
  ['多元雾主', '偏导与极值迷宫'], ['二重疆主', '区域换序大阵'], ['方程傀儡师', '解族战线'], ['级数万象魔', '审敛与展开之塔'],
  ['空间星兽', '几何观测站'], ['场论终焉使', '三大公式终局']
] as const

const OPPONENTS = ['zeng-yuxin', 'yuan-yue', 'chen-ruibin', 'shen-li', 'pei-shenxing', 'han-che'] as const

export const LECTURE_BOSSES: LectureBoss[] = CALCULUS_LECTURES.map((lecture, index) => ({
  id: `boss-${lecture.id}`,
  lectureId: lecture.id,
  name: BOSS_NAMES[index][0],
  title: BOSS_NAMES[index][1],
  opponentId: OPPONENTS[index % OPPONENTS.length],
  maxHp: 100
}))

export function getLectureBoss(lectureId: string) {
  return LECTURE_BOSSES.find((boss) => boss.lectureId === lectureId) || LECTURE_BOSSES[0]
}

export function getBossEligibility(mastery: LectureMastery, defeated = false) {
  const requiredAttempted = Math.min(mastery.total, Math.max(8, Math.ceil(mastery.total * 0.35)))
  const requiredMastered = Math.min(mastery.total, Math.max(6, Math.ceil(requiredAttempted * 0.75)))
  const requiredScorePercent = Math.min(50, mastery.total ? 50 : 0)
  const unlocked = defeated || (
    mastery.total > 0
    && mastery.attempted >= requiredAttempted
    && mastery.mastered >= requiredMastered
    && mastery.scorePercent >= requiredScorePercent
  )
  return {
    unlocked,
    requiredAttempted,
    requiredMastered,
    requiredScorePercent,
    attemptedRemaining: Math.max(0, requiredAttempted - mastery.attempted),
    masteredRemaining: Math.max(0, requiredMastered - mastery.mastered),
    scoreRemaining: Math.max(0, requiredScorePercent - mastery.scorePercent)
  }
}

export function buildBossQueue(problems: readonly Problem[], mastery: LectureMastery, seed = Date.now()) {
  const candidates = problems.filter((problem) => isProblemEligibleForPractice(problem) && getProblemLectureIds(problem).includes(mastery.lectureId))
  const scoreById = new Map(mastery.problemMastery.map((item) => [item.problemId, item.score]))
  const roles = ['choice', 'example', 'exercise'] as const
  const selected: string[] = []
  roles.forEach((role, index) => {
    const ids = candidates
      .filter((problem) => getProblemRole(problem) === role)
      .sort((a, b) => (
        (scoreById.get(a.id) || 0) - (scoreById.get(b.id) || 0)
        || (b.difficulty || 2) - (a.difficulty || 2)
        || (b.discrimination || 2) - (a.discrimination || 2)
      ))
      .map((problem) => problem.id)
    const id = shuffleProblemIds(ids.slice(0, Math.max(4, Math.ceil(ids.length / 2))), seed + index)[0]
    if (id) selected.push(id)
  })
  const remaining = candidates
    .filter((problem) => !selected.includes(problem.id))
    .sort((a, b) => (scoreById.get(a.id) || 0) - (scoreById.get(b.id) || 0) || (b.difficulty || 2) - (a.difficulty || 2))
    .map((problem) => problem.id)
  const queueSize = Math.min(5, candidates.length)
  const remainingSlots = Math.max(0, queueSize - selected.length)
  const priorityWindow = remaining.slice(0, Math.max(remainingSlots, Math.ceil(remainingSlots * 1.5)))
  return [...selected, ...shuffleProblemIds(priorityWindow, seed + 97).slice(0, remainingSlots)]
}

export function scoreBossBattle(outcomes: readonly PracticeSessionOutcome[], problems: readonly Problem[]) {
  const byId = new Map(problems.map((problem) => [problem.id, problem]))
  let score = 0
  let strongWins = 0
  for (const outcome of outcomes) {
    const problem = byId.get(outcome.problemId)
    const choiceFailed = problem?.questionFormat !== 'open' && outcome.isCorrect !== true
    if (choiceFailed || outcome.rating === 'again') continue
    const difficulty = problem?.difficulty || 2
    if (outcome.rating === 'hint') score += Math.max(4, 4 + difficulty * 2)
    if (outcome.rating === 'independent') { score += 12 + difficulty * 4; strongWins += 1 }
    if (outcome.rating === 'multiple') { score += 16 + difficulty * 4; strongWins += 1 }
  }
  const normalized = Math.min(100, Math.round(score * (5 / Math.max(1, outcomes.length))))
  return {
    damage: Math.min(100, score),
    score: normalized,
    strongWins,
    passed: normalized >= 80 && strongWins >= Math.min(4, outcomes.length),
    remainingHp: Math.max(0, 100 - normalized)
  }
}
