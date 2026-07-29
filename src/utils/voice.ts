import { getCharacter, type RomanceRouteId, type StoryRole } from '../domain/story'
import type { PlayerProfile, ReviewRating } from '../types'
import { getAudioPreferences } from './sound'

export type VoiceMoment = ReviewRating | 'star' | 'realm'
export type VoiceTone = 'self' | 'family' | 'mentor' | 'challenge' | 'bond'

export interface CharacterVoiceCue {
  characterId: string
  speaker: string
  text: string
  tone: VoiceTone
  toneLabel: string
}

export interface ReviewVoiceContext {
  profile: PlayerProfile
  rating: ReviewRating
  isCorrect?: boolean
  advanced: boolean
  realmBreakthrough: boolean
  activeRouteId?: RomanceRouteId
  seed?: number
}

export interface SpeakCharacterOptions {
  delayMs?: number
  onStart?: () => void
  onEnd?: () => void
}

interface VoicePersona {
  rate: number
  pitch: number
  voiceOffset: number
}

interface ReviewSpeaker {
  id: string
  unlockAt: number
}

const TONE_LABELS: Record<VoiceTone, string> = {
  self: '自我宣言',
  family: '家人守望',
  mentor: '导师点拨',
  challenge: '宿敌挑战',
  bond: '同行羁绊'
}

const ROLE_PERSONAS: Record<StoryRole, VoicePersona> = {
  protagonist: { rate: 0.96, pitch: 0.92, voiceOffset: 0 },
  family: { rate: 0.9, pitch: 0.94, voiceOffset: 1 },
  mentor: { rate: 0.88, pitch: 0.86, voiceOffset: 2 },
  rival: { rate: 1.05, pitch: 0.9, voiceOffset: 3 },
  friend: { rate: 0.97, pitch: 1.02, voiceOffset: 4 },
  classmate: { rate: 1, pitch: 0.98, voiceOffset: 5 },
  romance: { rate: 0.92, pitch: 1.04, voiceOffset: 6 },
  stranger: { rate: 0.95, pitch: 1, voiceOffset: 7 }
}

const PERSONA_OVERRIDES: Record<string, Partial<VoicePersona>> = {
  'he-yaokun': { rate: 0.98, pitch: 0.92 },
  'he-xinping': { rate: 0.86, pitch: 0.82 },
  'zhong-shanyan': { rate: 0.9, pitch: 1.08 },
  'zhou-shouyuan': { rate: 0.86, pitch: 0.84 },
  'zeng-yuxin': { rate: 1.08, pitch: 0.86 },
  'yuan-yue': { rate: 1.1, pitch: 0.94 },
  'chen-ruibin': { rate: 1.02, pitch: 0.9 },
  'chen-yanjun': { rate: 0.91, pitch: 1.04, voiceOffset: 2 },
  medusa: { rate: 0.86, pitch: 0.98, voiceOffset: 3 },
  xiaoyixian: { rate: 0.89, pitch: 1.09, voiceOffset: 4 }
}

const REVIEW_SPEAKERS: Record<ReviewRating, readonly ReviewSpeaker[]> = {
  again: [
    { id: 'he-yaokun', unlockAt: 0 }, { id: 'zhong-shanyan', unlockAt: 0 }, { id: 'he-xinping', unlockAt: 0 },
    { id: 'zhou-shouyuan', unlockAt: 1 }, { id: 'zeng-yuxin', unlockAt: 8 }, { id: 'chen-yanjun', unlockAt: 22 },
    { id: 'medusa', unlockAt: 95 }, { id: 'xiaoyixian', unlockAt: 168 }
  ],
  hint: [
    { id: 'zhou-shouyuan', unlockAt: 1 }, { id: 'he-yaokun', unlockAt: 0 }, { id: 'xu-tang', unlockAt: 14 },
    { id: 'chen-yanjun', unlockAt: 22 }, { id: 'chen-yanjun', unlockAt: 22 }
  ],
  independent: [
    { id: 'he-yaokun', unlockAt: 0 }, { id: 'he-xinping', unlockAt: 0 }, { id: 'chen-yanjun', unlockAt: 22 },
    { id: 'chen-yanjun', unlockAt: 22 }, { id: 'yuan-yue', unlockAt: 32 }, { id: 'medusa', unlockAt: 95 }
  ],
  multiple: [
    { id: 'zhou-shouyuan', unlockAt: 1 }, { id: 'he-yaokun', unlockAt: 0 }, { id: 'chen-yanjun', unlockAt: 22 },
    { id: 'chen-yanjun', unlockAt: 22 }, { id: 'chen-yanjun', unlockAt: 22 }, { id: 'medusa', unlockAt: 95 }
  ]
}

const VOICE_LINES: Record<string, Partial<Record<VoiceMoment, readonly string[]>>> = {
  'he-yaokun': {
    again: ['这次没拿下，就把漏洞写清。下一次，我会亲手赢回来。', '不会不可怕。停在原地，才会让质疑变成结论。'],
    hint: ['入口已经出现，剩下的路，我要自己走完。'],
    independent: ['漂亮，这一题是我自己完整拿下的。', '条件、推导、结论都守住了。再来一题。'],
    multiple: ['两条路都能走通，我开始真正看见题目的结构了。'],
    star: ['星阶提升。不是运气，是我把一次次训练留在了身上。'],
    realm: ['新境界已开。质疑可以很响，我的下一步会更扎实。']
  },
  'he-xinping': {
    again: ['没做出来也别慌。把原因找准，明天再稳稳拿回来。'],
    independent: ['这一步走得很稳。照这个节奏，把自己的路走出来。'],
    star: ['爸看得见，你不是突然变强，是一天一天熬出了本事。'],
    realm: ['走到新境界，别忘了身体，也别忘了你为什么出发。']
  },
  'zhong-shanyan': {
    again: ['结果重要，你也重要。先把错因记下，别用一次失手否定自己。'],
    hint: ['已经找到入口了，慢一点，把后面的推导走稳。'],
    star: ['耀焜，妈妈为你的坚持高兴。记得吃饭，也记得休息。']
  },
  'zhou-shouyuan': {
    again: ['别急着记答案。回到定义，指出你究竟断在哪个条件。'],
    hint: ['提示只能打开门。能否独立走到结论，决定这道题是否属于你。'],
    independent: ['推导闭合，条件完整。这一次，答案才是你的通行证。'],
    multiple: ['能比较两种方法的适用边界，才算真正掌握这一类题。'],
    star: ['星阶只是结果。继续守住定义和每一个适用条件。']
  },
  'xu-tang': {
    again: ['只记录一个最关键的错因，然后安排下一次复做。别把复盘变成惩罚。'],
    hint: ['入口找到了。现在把剩下的步骤拆小，一步一步闭合。']
  },
  'zeng-yuxin': {
    again: ['这就停了？你的交大目标，可不会替你补上这个漏洞。'],
    independent: ['这题算你拿下了。但下一场，我会把强度再提一档。']
  },
  'yuan-yue': {
    independent: ['完整性保住了。下一次，再把这条正确路径练成速度。'],
    multiple: ['方法够多还不够。考场上，要选最快也最稳的那一条。']
  },
  'chen-ruibin': {
    again: ['一次失手就会留在榜单上。你最好拿出真正的后续。'],
    independent: ['这次结果不错。可别人只会等你下一次露出破绽。']
  },
  'chen-yanjun': {
    again: ['不用急着证明你没事。把缺口找准，我们下一次一起拿回来。', '这次可以难受，但别含糊错因。明天，我们先拿回第一步。'],
    hint: ['入口找到了。剩下的推导，要由你亲手走成自己的。'],
    independent: ['条件、推导、结论都守住了。何耀焜，这一题很漂亮。', '我看见你没有跳过那个难点。这次完成，是真的。'],
    multiple: ['两条路线都能闭合。你已经不只是在解题，而是在看结构。', '我走一条，你走一条，最后在同一个结论碰面。漂亮。'],
    star: ['我看见了。这不是运气，是你一题一题练出来的。'],
    realm: ['新境界不是终点。我会陪你把下一段路，也走得扎实。']
  },
  medusa: {
    again: ['失手已经发生。把情绪收进鞘里，告诉我下一次如何避免。'],
    hint: ['既然入口已经找到，就别把主动权重新交还给题目。'],
    independent: ['判断准确，执行完整。真正的强者，本就该掌控自己的战场。'],
    multiple: ['不被单一路线束缚，才有资格成为规则的制定者。'],
    star: ['很好。力量增长时，别忘了决定它将用于哪一场战斗。'],
    realm: ['境界已破。现在抬头，重新选择你要征服的战场。']
  },
  xiaoyixian: {
    again: ['先放下自责。找准错因以后，给大脑一次真正恢复的机会。'],
    independent: ['做得很好。现在松开肩膀，呼吸一下，再决定是否继续。'],
    star: ['进步已经留下来了。别用透支，破坏你刚刚建立的节奏。'],
    realm: ['新境界需要新的承载力。训练、睡眠和恢复，一个都不能少。']
  }
}

let pendingTimer: number | undefined
let activeEnd: (() => void) | undefined

function hashText(value: string) {
  let hash = 0
  for (let index = 0; index < value.length; index += 1) hash = ((hash << 5) - hash + value.charCodeAt(index)) | 0
  return Math.abs(hash)
}

function getVoiceTone(characterId: string): VoiceTone {
  const role = getCharacter(characterId).role
  if (role === 'protagonist') return 'self'
  if (role === 'family') return 'family'
  if (role === 'mentor') return 'mentor'
  if (role === 'rival') return 'challenge'
  return 'bond'
}

function makeCue(characterId: string, text: string): CharacterVoiceCue {
  const character = getCharacter(characterId)
  const tone = getVoiceTone(characterId)
  return { characterId, speaker: character.name, text, tone, toneLabel: TONE_LABELS[tone] }
}

function getLine(characterId: string, moment: VoiceMoment, seed: number) {
  const ownLines = VOICE_LINES[characterId]?.[moment]
  const fallback = VOICE_LINES['he-yaokun'][moment] || VOICE_LINES['he-yaokun'].independent!
  const pool = ownLines?.length ? ownLines : fallback
  return pool[Math.abs(seed) % pool.length]
}

export function getReviewVoiceCue(context: ReviewVoiceContext): CharacterVoiceCue {
  const moment: VoiceMoment = context.realmBreakthrough ? 'realm' : context.advanced ? 'star' : context.rating
  const seed = context.seed ?? context.profile.totalReviews
  const activeRouteUnlocked = context.activeRouteId
    && getCharacter(context.activeRouteId).unlockAt <= context.profile.totalReviews
  let characterId: string

  if ((moment === 'realm' || moment === 'star') && activeRouteUnlocked) characterId = context.activeRouteId!
  else if (moment === 'realm') characterId = context.profile.totalReviews >= 22 ? 'chen-yanjun' : 'he-yaokun'
  else if (activeRouteUnlocked && (context.rating === 'multiple' || (context.rating === 'independent' && seed % 2 === 0))) characterId = context.activeRouteId!
  else {
    const unlocked = REVIEW_SPEAKERS[context.rating].filter((speaker) => speaker.unlockAt <= context.profile.totalReviews)
    characterId = unlocked[Math.abs(seed) % unlocked.length]?.id || 'he-yaokun'
  }

  return makeCue(characterId, getLine(characterId, moment, seed))
}

export function getStoryVoiceCue(characterId: string, text: string): CharacterVoiceCue {
  return makeCue(characterId, normalizeSpeechText(text))
}

export function normalizeSpeechText(text: string) {
  return text
    .replace(/\$[^$]+\$/g, '一道公式')
    .replace(/[`*_#]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 180)
}

function getPersona(characterId: string): VoicePersona {
  const character = getCharacter(characterId)
  return { ...ROLE_PERSONAS[character.role], ...PERSONA_OVERRIDES[characterId] }
}

function chooseVoice(characterId: string) {
  const voices = window.speechSynthesis.getVoices()
    .filter((voice) => /^zh([_-]|$)/i.test(voice.lang))
    .sort((a, b) => Number(b.localService) - Number(a.localService) || a.name.localeCompare(b.name))
  if (!voices.length) return undefined
  const persona = getPersona(characterId)
  return voices[(hashText(characterId) + persona.voiceOffset) % voices.length]
}

export function hasCharacterVoiceSupport() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined'
}

export function stopCharacterVoice() {
  if (typeof window === 'undefined') return
  if (pendingTimer !== undefined) window.clearTimeout(pendingTimer)
  pendingTimer = undefined
  if ('speechSynthesis' in window) window.speechSynthesis.cancel()
  activeEnd?.()
  activeEnd = undefined
}

export function speakCharacterVoice(cue: CharacterVoiceCue, options: SpeakCharacterOptions = {}) {
  if (!hasCharacterVoiceSupport() || !getAudioPreferences().voiceEnabled) return false
  stopCharacterVoice()
  const start = () => {
    const preferences = getAudioPreferences()
    if (!preferences.voiceEnabled) return
    const persona = getPersona(cue.characterId)
    const utterance = new SpeechSynthesisUtterance(normalizeSpeechText(cue.text))
    utterance.lang = 'zh-CN'
    utterance.rate = Math.min(1.35, Math.max(0.72, persona.rate * preferences.voiceRate))
    utterance.pitch = Math.min(1.35, Math.max(0.7, persona.pitch))
    utterance.volume = preferences.voiceVolume
    utterance.voice = chooseVoice(cue.characterId) || null
    let ended = false
    const finish = () => {
      if (ended) return
      ended = true
      activeEnd = undefined
      options.onEnd?.()
    }
    utterance.onstart = () => options.onStart?.()
    utterance.onend = finish
    utterance.onerror = finish
    activeEnd = finish
    window.speechSynthesis.speak(utterance)
  }
  if (options.delayMs && options.delayMs > 0) pendingTimer = window.setTimeout(start, options.delayMs)
  else start()
  return true
}
