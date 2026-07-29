import { CALCULUS_LECTURES, getProblemLectureIds, getProblemRole } from './curriculum'
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
  const requiredAttempted = Math.min(mastery.total, 6)
  const requiredMastered = Math.min(mastery.total, 4)
  const unlocked = defeated || (mastery.total > 0 && mastery.attempted >= requiredAttempted && mastery.mastered >= requiredMastered)
  return {
    unlocked,
    requiredAttempted,
    requiredMastered,
    attemptedRemaining: Math.max(0, requiredAttempted - mastery.attempted),
    masteredRemaining: Math.max(0, requiredMastered - mastery.mastered)
  }
}

export function buildBossQueue(problems: readonly Problem[], mastery: LectureMastery, seed = Date.now()) {
  const candidates = problems.filter((problem) => !problem.archived && getProblemLectureIds(problem).includes(mastery.lectureId))
  const scoreById = new Map(mastery.problemMastery.map((item) => [item.problemId, item.score]))
  const roles = ['concept', 'choice', 'example', 'exercise'] as const
  const selected: string[] = []
  roles.forEach((role, index) => {
    const ids = candidates
      .filter((problem) => getProblemRole(problem) === role)
      .sort((a, b) => (scoreById.get(a.id) || 0) - (scoreById.get(b.id) || 0))
      .map((problem) => problem.id)
    const id = shuffleProblemIds(ids.slice(0, Math.max(4, Math.ceil(ids.length / 2))), seed + index)[0]
    if (id) selected.push(id)
  })
  const remaining = candidates.map((problem) => problem.id).filter((id) => !selected.includes(id))
  return [...selected, ...shuffleProblemIds(remaining, seed + 97)].slice(0, Math.min(5, candidates.length))
}

export function scoreBossBattle(outcomes: readonly PracticeSessionOutcome[], problems: readonly Problem[]) {
  const byId = new Map(problems.map((problem) => [problem.id, problem]))
  let score = 0
  let strongWins = 0
  for (const outcome of outcomes) {
    const problem = byId.get(outcome.problemId)
    const choiceFailed = problem?.questionFormat !== 'open' && outcome.isCorrect !== true
    if (choiceFailed || outcome.rating === 'again') continue
    if (outcome.rating === 'hint') score += 8
    if (outcome.rating === 'independent') { score += 20; strongWins += 1 }
    if (outcome.rating === 'multiple') { score += 24; strongWins += 1 }
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
