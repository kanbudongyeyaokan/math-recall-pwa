import { getProblemLectureIds } from './curriculum'
import { getMasteryPower } from './mastery'
import { shuffleProblemIds } from './practiceCycle'
import { scoreBossBattle } from './boss'
import type { PlayerProfile, PracticeSessionOutcome, Problem } from '../types'

export const SURPRISE_CHALLENGE_STATE_KEY = 'surprise-challenge-state-v1'
export const SURPRISE_CHALLENGE_QUESTION_COUNT = 5
export const SURPRISE_CHALLENGE_TIME_MS = 8 * 60 * 1000
export const SURPRISE_CHALLENGE_WIN_COINS = 66
export const SURPRISE_CHALLENGE_COOLDOWN_MS = 6 * 60 * 60 * 1000
export const SURPRISE_CHALLENGE_DECLINE_MS = 90 * 60 * 1000
export const SURPRISE_CHALLENGE_OFFER_TTL_MS = 15 * 60 * 1000

export interface SurpriseRival {
  id: 'zeng-yuxin' | 'yuan-yue' | 'chen-ruibin'
  name: string
  unlockAt: number
  title: string
  invite: string
  declined: string
  victory: string
  defeat: string
}

export interface SurpriseChallengeOffer {
  id: string
  rivalId: SurpriseRival['id']
  createdAt: number
  expiresAt: number
  seed: number
}

export interface SurpriseChallengeState {
  nextEligibleAt: number
  pendingOffer?: SurpriseChallengeOffer
  lastOfferedAt?: number
  lastResultAt?: number
  settledChallengeIds: string[]
}

export interface SurpriseChallengeScore {
  score: number
  damage: number
  strongWins: number
  completed: number
  passed: boolean
  timedOut: boolean
  remainingHp: number
}

export const SURPRISE_RIVALS: readonly SurpriseRival[] = [
  {
    id: 'zeng-yuxin', name: '曾宇鑫', unlockAt: 5, title: '题量围猎',
    invite: '我刚又刷完一轮。给你八分钟做五题，敢不敢看看谁才是在假装努力？',
    declined: '先躲着吧。下次我会在你最松懈的时候再来。',
    victory: '五题打完，曾宇鑫的题量攻势被当场压垮。排行榜上那句嘲讽，反而成了何耀焜的战利品。',
    defeat: '曾宇鑫看着倒计时归零：目标写得再大，做不完也只是墙上的装饰。把漏洞补好，再来找我。'
  },
  {
    id: 'yuan-yue', name: '袁越', unlockAt: 32, title: '极速封锁',
    invite: '完整推导不错，但计时器不会等你。八分钟五题，证明你的正确路径已经练成速度。',
    declined: '今天不接也行。速度差不会自己消失，我会等下一场。',
    victory: '最后一题锁定，袁越的计时优势被正面击穿。何耀焜把正确与速度同时压上终点线。',
    defeat: '袁越按停计时器：你输给的不是我，是那些还没练成反应的犹豫。复盘以后再战。'
  },
  {
    id: 'chen-ruibin', name: '陈睿斌', unlockAt: 120, title: '榜单狙击',
    invite: '我已经准备好失败截图了。八分钟五题，看看你这次会留下什么证据。',
    declined: '不敢留下新成绩？没关系，我手里的旧截图还能再挂一阵。',
    victory: '陈睿斌准备好的失败截图彻底作废。何耀焜用五题战绩把对方压到榜单下方，围观只剩沉默。',
    defeat: '陈睿斌晃了晃新截图：过程可以写一整页，榜单只记住你没完成。想删掉它，就拿下一场来换。'
  }
] as const

export function getSurpriseRival(rivalId?: string) {
  return SURPRISE_RIVALS.find((rival) => rival.id === rivalId) || SURPRISE_RIVALS[0]
}

export function getEligibleSurpriseRivals(profile: PlayerProfile) {
  const masteryPower = getMasteryPower(profile)
  return SURPRISE_RIVALS.filter((rival) => masteryPower >= rival.unlockAt)
}

export function normalizeSurpriseChallengeState(value?: Partial<SurpriseChallengeState>): SurpriseChallengeState {
  return {
    nextEligibleAt: Number.isFinite(value?.nextEligibleAt) ? Math.max(0, Number(value?.nextEligibleAt)) : 0,
    pendingOffer: value?.pendingOffer,
    lastOfferedAt: value?.lastOfferedAt,
    lastResultAt: value?.lastResultAt,
    settledChallengeIds: Array.isArray(value?.settledChallengeIds)
      ? [...new Set(value.settledChallengeIds.filter((id): id is string => typeof id === 'string' && id.length > 0))].slice(-50)
      : []
  }
}

export function prepareSurpriseChallengeOffer(input: {
  profile: PlayerProfile
  state?: Partial<SurpriseChallengeState>
  availableProblemCount: number
  now?: number
  seed?: number
}) {
  const now = input.now ?? Date.now()
  const seed = input.seed ?? now
  const state = normalizeSurpriseChallengeState(input.state)
  if (state.pendingOffer && state.pendingOffer.expiresAt > now) return { state, offer: state.pendingOffer, changed: false }

  const cleared = state.pendingOffer ? { ...state, pendingOffer: undefined } : state
  const rivals = getEligibleSurpriseRivals(input.profile)
  if (input.profile.totalReviews < 5 || input.availableProblemCount < SURPRISE_CHALLENGE_QUESTION_COUNT || !rivals.length || now < cleared.nextEligibleAt) {
    return { state: cleared, offer: undefined, changed: cleared !== state }
  }

  const rival = rivals[Math.abs(seed) % rivals.length]
  const offer: SurpriseChallengeOffer = {
    id: `ambush-${now}-${rival.id}`,
    rivalId: rival.id,
    createdAt: now,
    expiresAt: now + SURPRISE_CHALLENGE_OFFER_TTL_MS,
    seed
  }
  return {
    state: { ...cleared, pendingOffer: offer, lastOfferedAt: now },
    offer,
    changed: true
  }
}

export function getSurpriseChallengeDelay(seed = Date.now()) {
  return 20_000 + (Math.abs(seed) % 25_001)
}

export function buildSurpriseChallengeQueue(problems: readonly Problem[], seed = Date.now()) {
  const candidates = problems.filter((problem) => (
    !problem.archived
    && getProblemLectureIds(problem).length > 0
    && problem.questionFormat !== 'open'
    && problem.options.length >= 2
    && problem.correctOptionIds.length > 0
  ))
  const idsByLecture = new Map<string, Problem[]>()
  for (const problem of candidates) {
    const lectureId = getProblemLectureIds(problem)[0]
    const bucket = idsByLecture.get(lectureId) || []
    bucket.push(problem)
    idsByLecture.set(lectureId, bucket)
  }

  const selected: string[] = []
  const lectureIds = shuffleProblemIds([...idsByLecture.keys()], seed)
  lectureIds.forEach((lectureId, index) => {
    if (selected.length >= SURPRISE_CHALLENGE_QUESTION_COUNT) return
    const bucket = [...(idsByLecture.get(lectureId) || [])].sort((a, b) => a.reviewCount - b.reviewCount || a.id.localeCompare(b.id))
    const leastReviewed = bucket.slice(0, Math.max(3, Math.ceil(bucket.length / 3)))
    const id = shuffleProblemIds(leastReviewed.map((problem) => problem.id), seed + index + 17)[0]
    if (id) selected.push(id)
  })

  const remaining = candidates.map((problem) => problem.id).filter((id) => !selected.includes(id))
  return [...selected, ...shuffleProblemIds(remaining, seed + 97)].slice(0, SURPRISE_CHALLENGE_QUESTION_COUNT)
}

export function scoreSurpriseChallenge(input: {
  outcomes: readonly PracticeSessionOutcome[]
  problems: readonly Problem[]
  deadlineAt: number
  completedAt?: number
}) : SurpriseChallengeScore {
  const completedAt = input.completedAt ?? Date.now()
  const base = scoreBossBattle(input.outcomes, input.problems)
  const completed = new Set(input.outcomes.map((outcome) => outcome.problemId)).size
  const timedOut = completedAt > input.deadlineAt
  const passed = !timedOut
    && completed === SURPRISE_CHALLENGE_QUESTION_COUNT
    && base.score >= 80
    && base.strongWins >= 4
  return { ...base, completed, passed, timedOut }
}

export function formatChallengeTime(milliseconds: number) {
  const seconds = Math.max(0, Math.ceil(milliseconds / 1000))
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`
}
