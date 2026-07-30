import { scoreBossBattle } from './boss'
import { getProblemLectureIds, getProblemRole } from './curriculum'
import { shuffleProblemIds } from './practiceCycle'
import { getCharacter, type CharacterPose, type StoryCharacter } from './story'
import type { DuelScope, PlayerProfile, PracticeSessionOutcome, Problem } from '../types'
import { isProblemEligibleForPractice } from '../data/questionQuality'

export const DUEL_QUESTION_COUNT = 5
export const DUEL_TIME_MS = 12 * 60 * 1000
export const DUEL_SETTLEMENT_KEY = 'duel-settlement-state-v1'

export interface DuelSettlementState {
  settledChallengeIds: string[]
}

export interface DuelScore {
  score: number
  strongWins: number
  completed: number
  passed: boolean
  timedOut: boolean
}

export interface DuelPresentation {
  name: string
  title: string
  ruleLabel: string
  winCoins: number
  requiredStrongWins: number
  invite: string
  playerVictory: string
  opponentVictory: string
}

export type DuelEmotion = 'smug' | 'focused' | 'nervous' | 'victorious' | 'defeated'

export interface DuelLiveState {
  opponentCompleted: number
  opponentProgressPercent: number
  playerCompleted: number
  gap: number
  emotion: DuelEmotion
  line: string
}

export function getDuelOpponentPose(emotion: DuelEmotion): CharacterPose {
  if (emotion === 'smug' || emotion === 'victorious') return 'victory'
  if (emotion === 'nervous' || emotion === 'defeated') return 'speaking'
  return 'challenge'
}

export const DUEL_SCOPE_OPTIONS: readonly { id: DuelScope; label: string; description: string }[] = [
  { id: 'all', label: '全高数', description: '跨讲次随机抽取，检验综合反应。' },
  { id: 'lecture', label: '指定讲次', description: '锁定一讲，正面比拼当前训练成果。' },
  { id: 'weak', label: '薄弱题', description: '优先抽取尚未真正掌握的题。' },
  { id: 'choice', label: '快速五题', description: '优先抽资料选择题，不足五道时由经典题补足。' }
] as const

const MAIN_RIVAL_LINES: Record<string, Pick<DuelPresentation, 'invite' | 'playerVictory' | 'opponentVictory'>> = {
  'zeng-yuxin': {
    invite: '五道题，十二分钟。别用目标压我，用完成度说话。',
    playerVictory: '曾宇鑫的题量攻势被逐题拆开。他盯着比分沉默片刻，第一次主动收起了嘲讽。',
    opponentVictory: '曾宇鑫把题单推回来：数量不是全部，但你连这五题都没守住。整理错因，再来。'
  },
  'yuan-yue': {
    invite: '路径正确只是起点。五道题见速度，也见你能不能在压力下保持完整。',
    playerVictory: '计时器停下，何耀焜同时守住正确率与速度。袁越点头，承认这是一场干净的胜利。',
    opponentVictory: '袁越按停计时器：慢不是罪，但犹豫必须被训练掉。复盘后，我等你的下一场。'
  },
  'chen-ruibin': {
    invite: '我已经打开榜单了。五道题之后，谁也别用解释替成绩说话。',
    playerVictory: '陈睿斌准备好的失败截图没有派上用场。新榜单把何耀焜的名字压在他的上方。',
    opponentVictory: '陈睿斌保存了比分：故事讲得再好，榜单只认完成。想删掉这张图，就赢回来。'
  }
}

function rolePresentation(character: StoryCharacter) {
  if (character.role === 'romance') return {
    invite: '不需要证明给别人看。我们用五道题互相校准，把薄弱处留在今天。',
    playerVictory: `${character.name}笑着收起草稿：这场是你赢。下一次，我会带更好的题来。`,
    opponentVictory: `${character.name}把错因圈好：输赢先放一边，这五题已经告诉我们下一步练什么。`
  }
  if (character.role === 'family') return {
    invite: '我不懂所有公式，但愿意陪你把这五道题做完。稳稳地走，就是胜利。',
    playerVictory: `${character.name}看着完成页：做得好。真正让人放心的，是你能一直这样走下去。`,
    opponentVictory: `${character.name}没有责怪：累了就整理一下，明天再把没守住的地方补回来。`
  }
  if (character.role === 'rival') return {
    invite: '五道题定一场输赢。你若真有实力，就别绕开自己的薄弱处。',
    playerVictory: `${character.name}收起了先前的轻视。这五题没有借口，何耀焜赢得干脆。`,
    opponentVictory: `${character.name}守住了这一场：差距已经写在答案里。修正以后，再来挑战。`
  }
  return {
    invite: '来一场五题切磋。输赢只是表面，真正要带走的是更可靠的解题路径。',
    playerVictory: `${character.name}认可了这场发挥：五题闭合得很稳，继续保持。`,
    opponentVictory: `${character.name}把比分放到一旁：把错题修正，下次就会是另一种结果。`
  }
}

export function getDuelPresentation(characterId: string): DuelPresentation {
  const character = getCharacter(characterId)
  const mainRival = MAIN_RIVAL_LINES[character.id]
  const lines = mainRival || rolePresentation(character)
  const isMainRival = Boolean(mainRival)
  const isRival = character.role === 'rival'
  return {
    name: character.name,
    title: character.title,
    ruleLabel: isMainRival ? '宿敌决斗' : isRival ? '对手争锋' : '五题切磋',
    winCoins: isMainRival ? 72 : isRival ? 56 : 42,
    requiredStrongWins: isRival ? 4 : 3,
    ...lines
  }
}

function stableSeed(value: string) {
  let hash = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function opponentQuestionDurations(opponentId: string, challengeSeed: number) {
  const character = getCharacter(opponentId)
  const roleFactor = character.role === 'rival' ? 0.9 : character.role === 'mentor' ? 0.97 : 1.06
  const seed = stableSeed(`${opponentId}:${challengeSeed}`)
  const baseSeconds = [82, 104, 91, 118, 106]
  return baseSeconds.map((seconds, index) => {
    const jitter = ((seed >>> (index * 5)) % 29) - 14
    return Math.max(54, Math.round((seconds + jitter) * roleFactor)) * 1000
  })
}

export function getDuelLiveState(input: {
  opponentId: string
  challengeSeed: number
  elapsedMs: number
  playerCompleted: number
  settled?: 'victory' | 'defeat'
}): DuelLiveState {
  const durations = opponentQuestionDurations(input.opponentId, input.challengeSeed)
  const elapsedMs = Math.max(0, input.elapsedMs)
  let spent = 0
  let opponentCompleted = 0
  let partial = 0

  for (const duration of durations) {
    if (elapsedMs >= spent + duration) {
      opponentCompleted += 1
      spent += duration
      continue
    }
    partial = Math.min(1, Math.max(0, (elapsedMs - spent) / duration))
    break
  }

  const playerCompleted = Math.min(DUEL_QUESTION_COUNT, Math.max(0, input.playerCompleted))
  const gap = opponentCompleted - playerCompleted
  const character = getCharacter(input.opponentId)
  const emotion: DuelEmotion = input.settled === 'victory'
    ? 'defeated'
    : input.settled === 'defeat'
      ? 'victorious'
      : gap > 0
        ? 'smug'
        : gap < 0
          ? 'nervous'
          : 'focused'
  const line = emotion === 'smug'
    ? `${character.name}暂时领先，神情明显得意。`
    : emotion === 'nervous'
      ? `${character.name}落后了，正在加快验算。`
      : emotion === 'victorious'
        ? `${character.name}已经赢下这一场。`
        : emotion === 'defeated'
          ? `${character.name}盯着比分，收起了先前的轻视。`
          : `${character.name}与你咬得很紧，正在专注推进。`

  return {
    opponentCompleted,
    opponentProgressPercent: Math.min(100, ((opponentCompleted + partial) / DUEL_QUESTION_COUNT) * 100),
    playerCompleted,
    gap,
    emotion,
    line
  }
}

function eligibleProblems(problems: readonly Problem[], profile: PlayerProfile, scope: DuelScope, lectureId?: string) {
  const calculus = problems.filter((problem) => isProblemEligibleForPractice(problem) && getProblemLectureIds(problem).length > 0)
  if (scope === 'lecture') return calculus.filter((problem) => getProblemLectureIds(problem).includes(lectureId || ''))
  if (scope === 'choice') {
    const choices = calculus.filter((problem) => problem.questionFormat !== 'open' && problem.correctOptionIds.length > 0)
    return choices.length >= DUEL_QUESTION_COUNT ? choices : [...choices, ...calculus.filter((problem) => !choices.includes(problem))]
  }
  if (scope === 'weak') {
    const mastered = new Set(profile.masteredProblemIds)
    const weak = calculus.filter((problem) => !mastered.has(problem.id))
    return weak.length >= DUEL_QUESTION_COUNT ? weak : calculus
  }
  return calculus
}

export function buildDuelQueue(input: {
  problems: readonly Problem[]
  profile: PlayerProfile
  scope: DuelScope
  lectureId?: string
  seed?: number
}) {
  const seed = input.seed ?? Date.now()
  const candidates = eligibleProblems(input.problems, input.profile, input.scope, input.lectureId)
    .sort((a, b) => a.reviewCount - b.reviewCount || a.id.localeCompare(b.id))
  const pool = candidates.slice(0, Math.max(DUEL_QUESTION_COUNT * 4, Math.ceil(candidates.length * 0.55)))
  const selected: string[] = []

  if (input.scope !== 'choice') {
    ;(['choice', 'example', 'exercise'] as const).forEach((role, index) => {
      const ids = pool.filter((problem) => getProblemRole(problem) === role).map((problem) => problem.id)
      const id = shuffleProblemIds(ids, seed + index * 17)[0]
      if (id) selected.push(id)
    })
  } else {
    const choiceIds = candidates
      .filter((problem) => problem.questionFormat !== 'open' && problem.correctOptionIds.length > 0)
      .map((problem) => problem.id)
    selected.push(...shuffleProblemIds(choiceIds, seed + 31).slice(0, DUEL_QUESTION_COUNT))
  }

  const remaining = pool.map((problem) => problem.id).filter((id) => !selected.includes(id))
  return [...selected, ...shuffleProblemIds(remaining, seed + 101)].slice(0, DUEL_QUESTION_COUNT)
}

export function scoreDuel(input: {
  outcomes: readonly PracticeSessionOutcome[]
  problems: readonly Problem[]
  opponentId: string
  deadlineAt: number
  completedAt?: number
}): DuelScore {
  const completedAt = input.completedAt ?? Date.now()
  const base = scoreBossBattle(input.outcomes, input.problems)
  const completed = new Set(input.outcomes.map((outcome) => outcome.problemId)).size
  const timedOut = completedAt > input.deadlineAt
  const requiredStrongWins = getDuelPresentation(input.opponentId).requiredStrongWins
  const threshold = requiredStrongWins === 4 ? 78 : 60
  return {
    score: base.score,
    strongWins: base.strongWins,
    completed,
    timedOut,
    passed: !timedOut && completed === DUEL_QUESTION_COUNT && base.score >= threshold && base.strongWins >= requiredStrongWins
  }
}

export function createDuelChallengeId(opponentId: string, now = Date.now()) {
  return `duel-${now}-${opponentId}`
}

export function normalizeDuelSettlementState(value?: Partial<DuelSettlementState>): DuelSettlementState {
  return {
    settledChallengeIds: Array.isArray(value?.settledChallengeIds)
      ? [...new Set(value.settledChallengeIds.filter((id): id is string => typeof id === 'string' && id.length > 0))].slice(-100)
      : []
  }
}
