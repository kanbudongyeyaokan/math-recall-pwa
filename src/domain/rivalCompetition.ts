import { getRealmProgress } from './gamification'
import { getMasteryPower } from './mastery'
import type { PlayerProfile } from '../types'

export const RIVAL_COMPETITION_STATE_KEY = 'rival-competition-state-v1'

export type PrimaryRivalId = 'zeng-yuxin' | 'yuan-yue' | 'chen-ruibin'

interface RivalSimulationConfig {
  id: PrimaryRivalId
  name: string
  title: string
  basePower: number
  openingGap: number
  openingXpGap: number
  questionBase: number
  efficiency: number
}

export interface RivalProgressEntry {
  power: number
  xp: number
  totalQuestions: number
  todayQuestions: number
  todayGain: number
}

export interface RivalCompetitionState {
  version: 1
  lastDayKey: string
  rivals: Record<PrimaryRivalId, RivalProgressEntry>
}

export interface CompetitionRow {
  id: 'he-yaokun' | PrimaryRivalId
  name: string
  title: string
  power: number
  realmLabel: string
  todayQuestions: number
  todayGain: number
  gapToPlayer: number
  isPlayer: boolean
}

export type RivalAttitude = 'dominant' | 'pressing' | 'wary' | 'bluffing' | 'yielding'

const DAY_MS = 86_400_000

export const PRIMARY_RIVAL_CONFIGS: readonly RivalSimulationConfig[] = [
  { id: 'zeng-yuxin', name: '曾宇鑫', title: '题量围猎者', basePower: 18, openingGap: 9, openingXpGap: 360, questionBase: 8, efficiency: 86 },
  { id: 'yuan-yue', name: '袁越', title: '极速封锁者', basePower: 30, openingGap: 4, openingXpGap: 220, questionBase: 7, efficiency: 91 },
  { id: 'chen-ruibin', name: '陈睿斌', title: '榜单狙击者', basePower: 46, openingGap: -3, openingXpGap: -80, questionBase: 6, efficiency: 79 }
] as const

const DIALOGUE: Record<PrimaryRivalId, Record<RivalAttitude, string>> = {
  'zeng-yuxin': {
    dominant: '你还在后面慢慢磨？我今天的题单已经翻页了。先追上我的背影，再谈上海交大。',
    pressing: '差距还在。你每犹豫一天，我就多刷一轮；别拿偶尔状态好当成追上我。',
    wary: '居然贴到这个位置了。别以为我会让榜首，我今晚会把训练量再加一档。',
    bluffing: '领先几题就想压住我？我只是刚好在整理错题，下一轮你未必守得住。',
    yielding: '行，我承认你现在更强。先别急着庆祝，我会按你的节奏加练，再把差距咬回来。'
  },
  'yuan-yue': {
    dominant: '你的思路还算完整，但榜单只记录完成。速度差没有消失，五题计时场见。',
    pressing: '你已经能看见我了，可看见和超越之间还隔着稳定速度。来挑战，我不等你热身。',
    wary: '正确率和速度都开始逼近，这才像真正的对手。下一场我不会留试探题。',
    bluffing: '暂时领先不代表限时稳定。敢把范围锁到薄弱题，我就承认这不是运气。',
    yielding: '这轮是你更稳。我收回之前的话，但下一次计时器响起，我仍会来抢回位置。'
  },
  'chen-ruibin': {
    dominant: '榜单差距已经替我说完了。你的目标很大，可现在还没有值得展示的战绩。',
    pressing: '又靠近了一点？我已经留好你失败的位置。五题之后，看谁的截图会被留下。',
    wary: '最近的成绩不像偶然。我先不下结论，等你在挑战场把五题全部做完。',
    bluffing: '别误会，我落后只是最近没把结果上传。你真敢挑战，我就让榜单重新排一次。',
    yielding: '这张榜单现在是你的。我不会再拿旧成绩说事，但我也不会一直站在下面。'
  }
}

function localDayKey(timestamp: number) {
  const date = new Date(timestamp)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function dayNumber(dayKey: string) {
  const [year, month, day] = dayKey.split('-').map(Number)
  return Date.UTC(year, month - 1, day) / DAY_MS
}

function hash(input: string) {
  let value = 2166136261
  for (let index = 0; index < input.length; index += 1) {
    value ^= input.charCodeAt(index)
    value = Math.imul(value, 16777619)
  }
  return value >>> 0
}

function questionCount(config: RivalSimulationConfig, dayKey: string) {
  return config.questionBase + (hash(`${config.id}:${dayKey}:questions`) % 4)
}

function masteryGain(config: RivalSimulationConfig, dayKey: string, questions: number, behindBy: number) {
  const roll = hash(`${config.id}:${dayKey}:mastery`) % 100
  const base = roll < config.efficiency - 48 ? 2 : 1
  const catchUp = behindBy >= 18 && questions >= config.questionBase + 2 ? 1 : 0
  return Math.min(3, base + catchUp)
}

export function createRivalCompetitionState(profile: PlayerProfile, now = Date.now()): RivalCompetitionState {
  const playerPower = getMasteryPower(profile)
  const dayKey = localDayKey(now)
  const entries = PRIMARY_RIVAL_CONFIGS.map((config) => {
    const power = Math.max(config.basePower, playerPower + config.openingGap)
    const todayQuestions = questionCount(config, dayKey)
    return [config.id, {
      power,
      xp: Math.max(0, profile.xp + config.openingXpGap),
      totalQuestions: Math.max(80, power * 4 + config.questionBase * 3),
      todayQuestions,
      todayGain: 0
    }] as const
  })
  return { version: 1, lastDayKey: dayKey, rivals: Object.fromEntries(entries) as RivalCompetitionState['rivals'] }
}

export function normalizeRivalCompetitionState(
  value: Partial<RivalCompetitionState> | undefined,
  profile: PlayerProfile,
  now = Date.now()
): RivalCompetitionState {
  if (value?.version !== 1 || !value.lastDayKey || !value.rivals) return createRivalCompetitionState(profile, now)
  const fallback = createRivalCompetitionState(profile, now)
  const rivals = Object.fromEntries(PRIMARY_RIVAL_CONFIGS.map((config) => {
    const entry = value.rivals?.[config.id]
    return [config.id, {
      power: Number.isFinite(entry?.power) ? Math.max(0, Math.round(entry!.power)) : fallback.rivals[config.id].power,
      xp: Number.isFinite(entry?.xp) ? Math.max(0, Math.round(entry!.xp)) : fallback.rivals[config.id].xp,
      totalQuestions: Number.isFinite(entry?.totalQuestions) ? Math.max(0, Math.round(entry!.totalQuestions)) : fallback.rivals[config.id].totalQuestions,
      todayQuestions: Number.isFinite(entry?.todayQuestions) ? Math.max(0, Math.round(entry!.todayQuestions)) : 0,
      todayGain: Number.isFinite(entry?.todayGain) ? Math.max(0, Math.min(3, Math.round(entry!.todayGain))) : 0
    }]
  })) as RivalCompetitionState['rivals']
  return { version: 1, lastDayKey: value.lastDayKey, rivals }
}

export function advanceRivalCompetition(
  profile: PlayerProfile,
  state: Partial<RivalCompetitionState> | undefined,
  now = Date.now()
): RivalCompetitionState {
  const normalized = normalizeRivalCompetitionState(state, profile, now)
  const currentDayKey = localDayKey(now)
  const elapsed = Math.max(0, Math.min(365, dayNumber(currentDayKey) - dayNumber(normalized.lastDayKey)))
  if (!elapsed) return normalized

  const playerPower = getMasteryPower(profile)
  const rivals = structuredClone(normalized.rivals)
  for (let dayOffset = 1; dayOffset <= elapsed; dayOffset += 1) {
    const date = new Date((dayNumber(normalized.lastDayKey) + dayOffset) * DAY_MS)
    const dayKey = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`
    for (const config of PRIMARY_RIVAL_CONFIGS) {
      const entry = rivals[config.id]
      const questions = questionCount(config, dayKey)
      const gain = masteryGain(config, dayKey, questions, playerPower - entry.power)
      entry.power += gain
      entry.xp += questions * 7 + gain * 9
      entry.totalQuestions += questions
      entry.todayQuestions = questions
      entry.todayGain = gain
    }
  }
  return { version: 1, lastDayKey: currentDayKey, rivals }
}

export function getRivalAttitude(profile: PlayerProfile, entry: RivalProgressEntry): RivalAttitude {
  const powerGap = getMasteryPower(profile) - entry.power
  const realmGap = getRealmProgress(profile.xp).realmIndex - getRealmProgress(entry.xp).realmIndex
  if (powerGap >= 20 || realmGap >= 2) return 'yielding'
  if (powerGap >= 8 || realmGap >= 1) return 'bluffing'
  if (powerGap >= -5) return 'wary'
  if (powerGap >= -20) return 'pressing'
  return 'dominant'
}

export function getRivalDialogue(profile: PlayerProfile, state: RivalCompetitionState, rivalId: PrimaryRivalId) {
  return DIALOGUE[rivalId][getRivalAttitude(profile, state.rivals[rivalId])]
}

export function getCompetitionRows(profile: PlayerProfile, state: RivalCompetitionState, playerTodayQuestions = 0): CompetitionRow[] {
  const playerPower = getMasteryPower(profile)
  const rows: CompetitionRow[] = [
    {
      id: 'he-yaokun', name: profile.name, title: '交大逐梦者', power: playerPower,
      realmLabel: getRealmProgress(profile.xp).label, todayQuestions: playerTodayQuestions, todayGain: 0, gapToPlayer: 0, isPlayer: true
    },
    ...PRIMARY_RIVAL_CONFIGS.map((config) => {
      const entry = state.rivals[config.id]
      return {
        id: config.id,
        name: config.name,
        title: config.title,
        power: entry.power,
        realmLabel: getRealmProgress(entry.xp).label,
        todayQuestions: entry.todayQuestions,
        todayGain: entry.todayGain,
        gapToPlayer: entry.power - playerPower,
        isPlayer: false
      }
    })
  ]
  return rows.sort((a, b) => b.power - a.power || b.todayGain - a.todayGain || a.name.localeCompare(b.name))
}

export function getCompetitionUpdatedLabel(state: RivalCompetitionState) {
  return `${state.lastDayKey} · 本地模拟`
}
