import type { ReviewRating } from '../types'
import type { UnlockEvent, UnlockEventKind } from '../types'

export type SoundEffect =
  | 'option'
  | 'option-remove'
  | 'focus'
  | 'correct'
  | 'wrong'
  | 'reveal'
  | 'rating-again'
  | 'rating-hint'
  | 'rating-independent'
  | 'rating-multiple'
  | 'card-drop'
  | 'technique'
  | 'coin'
  | 'star-up'
  | 'realm-up'
  | 'achievement-unlock'
  | 'character-unlock'
  | 'challenge-unlock'
  | 'quest-unlock'
  | 'next'
  | 'story-next'
  | 'story-choice'
  | 'character-open'
  | 'world-open'
  | 'market-open'
  | 'purchase'
  | 'equip'
  | 'mission-open'
  | 'battle-start'
  | 'mastery-up'
  | 'correction'
  | 'boss-hit'
  | 'boss-victory'
  | 'boss-defeat'
  | 'chapter-open'
  | 'bond-up'
  | 'rival-open'
  | 'romance-open'
  | 'campus-bell'
  | 'ambush-alert'
  | 'countdown-warning'
  | 'sound-on'
  | 'sound-off'

export type MusicScene = 'home' | 'practice' | 'focus' | 'story' | 'market' | 'battle' | 'resolve'
export type MusicTrack = MusicScene | 'rain' | 'library' | 'campus' | 'ascent' | 'starlight'
export type MusicSelection = 'auto' | MusicTrack

export interface AudioPreferences {
  soundEnabled: boolean
  musicEnabled: boolean
  voiceEnabled: boolean
  autoVoice: boolean
  soundVolume: number
  musicVolume: number
  voiceVolume: number
  voiceRate: number
  musicTrackId: MusicSelection
}

interface ToneSpec {
  frequency: number
  endFrequency?: number
  startMs: number
  durationMs: number
  gain: number
  wave: OscillatorType
  pan: number
}

interface NoiseSpec {
  startMs: number
  durationMs: number
  gain: number
  filterFrequency: number
  filterType: BiquadFilterType
  pan: number
}

export interface SoundSequenceItem {
  effect: SoundEffect
  delayMs?: number
}

export interface RewardSoundOptions {
  rating: ReviewRating
  techniqueTriggered: boolean
  coinsEarned: number
  advanced: boolean
  realmBreakthrough: boolean
  masteryGained?: boolean
  corrected?: boolean
  bossHit?: boolean
  bossResult?: 'victory' | 'defeat'
}

const tone = (
  frequency: number,
  startMs: number,
  durationMs: number,
  gain: number,
  wave: OscillatorType = 'sine',
  endFrequency?: number,
  pan = 0
): ToneSpec => ({ frequency, endFrequency, startMs, durationMs, gain, wave, pan })

const noise = (
  startMs: number,
  durationMs: number,
  gain: number,
  filterFrequency: number,
  filterType: BiquadFilterType = 'bandpass',
  pan = 0
): NoiseSpec => ({ startMs, durationMs, gain, filterFrequency, filterType, pan })

export const SOUND_PATTERNS: Readonly<Record<SoundEffect, readonly ToneSpec[]>> = {
  option: [tone(520, 0, 48, 0.025, 'square', 640, -0.14), tone(1040, 8, 32, 0.012, 'sine', undefined, 0.16)],
  'option-remove': [tone(420, 0, 58, 0.022, 'square', 310, 0.12), tone(210, 12, 62, 0.014, 'triangle', undefined, -0.1)],
  focus: [tone(196, 0, 260, 0.032, 'sine', 294, -0.2), tone(392, 130, 230, 0.022, 'triangle', 494, 0.2)],
  correct: [
    tone(131, 0, 170, 0.035, 'sine', 196), tone(262, 8, 170, 0.045, 'triangle', undefined, -0.2),
    tone(523, 24, 150, 0.05, 'sine', undefined, 0.18), tone(659, 92, 190, 0.048, 'sine', undefined, -0.12),
    tone(784, 165, 240, 0.052, 'triangle', undefined, 0.18), tone(1175, 220, 210, 0.025)
  ],
  wrong: [tone(196, 0, 250, 0.05, 'triangle', 147, -0.12), tone(98, 35, 300, 0.045, 'sine', 82, 0.1), tone(247, 120, 170, 0.02, 'sine', 196)],
  reveal: [tone(330, 0, 260, 0.028, 'sine', undefined, -0.2), tone(494, 45, 280, 0.032, 'sine', undefined, 0.2), tone(659, 95, 330, 0.034), tone(988, 155, 290, 0.018)],
  'rating-again': [tone(220, 0, 210, 0.038, 'triangle', 196, -0.1), tone(294, 135, 200, 0.03, 'sine', 330, 0.1)],
  'rating-hint': [tone(294, 0, 150, 0.035, 'triangle', undefined, -0.14), tone(392, 95, 170, 0.038), tone(494, 195, 220, 0.035, 'sine', undefined, 0.14)],
  'rating-independent': [tone(262, 0, 170, 0.04, 'triangle', undefined, -0.18), tone(392, 80, 180, 0.042), tone(523, 160, 210, 0.045, 'sine', undefined, 0.18), tone(784, 240, 260, 0.032)],
  'rating-multiple': [
    tone(330, 0, 150, 0.038, 'triangle', undefined, -0.24), tone(440, 65, 160, 0.04, 'sine', undefined, 0.18),
    tone(554, 130, 170, 0.044, 'sine', undefined, -0.14), tone(659, 195, 190, 0.046, 'sine', undefined, 0.16),
    tone(880, 265, 270, 0.045, 'triangle'), tone(1320, 330, 260, 0.022)
  ],
  'card-drop': [tone(1568, 85, 240, 0.018, 'sine', 2093, 0.2), tone(784, 110, 300, 0.024, 'triangle', 1175, -0.16), tone(2350, 210, 180, 0.012)],
  technique: [tone(110, 0, 380, 0.044, 'sine', 165), tone(330, 55, 240, 0.032, 'triangle', 494, -0.2), tone(659, 170, 290, 0.035, 'triangle', 988, 0.2)],
  coin: [tone(1319, 0, 90, 0.029, 'square', undefined, -0.18), tone(1760, 58, 120, 0.033, 'triangle', undefined, 0.16), tone(2637, 128, 170, 0.021)],
  'star-up': [tone(131, 0, 500, 0.055, 'triangle', 196), tone(392, 45, 180, 0.04, 'sine', undefined, -0.2), tone(494, 145, 190, 0.043, 'sine', undefined, 0.2), tone(587, 245, 200, 0.046), tone(784, 355, 430, 0.052), tone(1175, 470, 360, 0.025)],
  'realm-up': [
    tone(65, 0, 760, 0.065, 'sine', 98), tone(131, 0, 650, 0.052, 'triangle', 196),
    tone(262, 110, 210, 0.04, 'sine', undefined, -0.28), tone(330, 230, 220, 0.042, 'sine', undefined, 0.24),
    tone(392, 350, 230, 0.044, 'sine', undefined, -0.18), tone(523, 480, 260, 0.05, 'sine', undefined, 0.18),
    tone(659, 610, 380, 0.052), tone(784, 735, 520, 0.052), tone(1047, 850, 560, 0.045),
    tone(523, 880, 600, 0.03, 'triangle'), tone(1319, 1010, 460, 0.025)
  ],
  'achievement-unlock': [
    tone(523, 0, 170, 0.04, 'triangle', undefined, -0.2), tone(659, 85, 190, 0.043, 'sine', undefined, 0.18),
    tone(784, 175, 220, 0.047), tone(1047, 275, 360, 0.038), tone(1568, 360, 300, 0.021)
  ],
  'character-unlock': [
    tone(220, 0, 330, 0.03, 'sine', 330), tone(440, 80, 260, 0.032, 'triangle', undefined, -0.22),
    tone(554, 190, 280, 0.035, 'sine', undefined, 0.2), tone(880, 330, 390, 0.033)
  ],
  'challenge-unlock': [
    tone(82, 0, 520, 0.052, 'sine', 110), tone(165, 70, 330, 0.042, 'sawtooth', 220),
    tone(330, 250, 220, 0.037, 'triangle'), tone(247, 460, 390, 0.041, 'triangle', 370)
  ],
  'quest-unlock': [
    tone(294, 0, 210, 0.03, 'sine', 392, -0.18), tone(587, 100, 230, 0.034, 'triangle', 698, 0.18),
    tone(880, 235, 330, 0.035), tone(1175, 360, 310, 0.023)
  ],
  next: [tone(494, 0, 90, 0.027, 'triangle', 587, -0.1), tone(784, 70, 130, 0.025, 'sine', 988, 0.12)],
  'story-next': [tone(260, 0, 85, 0.019, 'triangle', 330, -0.22), tone(520, 55, 120, 0.021, 'sine', 620, 0.18)],
  'story-choice': [tone(196, 0, 210, 0.032, 'triangle', 294), tone(392, 90, 180, 0.034, 'sine', undefined, -0.16), tone(587, 180, 240, 0.038, 'sine', undefined, 0.16)],
  'character-open': [tone(294, 0, 150, 0.022, 'sine', 392, -0.14), tone(587, 75, 210, 0.027, 'triangle', 784, 0.14)],
  'world-open': [tone(147, 0, 260, 0.03, 'sine', 220, -0.18), tone(440, 90, 220, 0.029, 'triangle', 659, 0.16), tone(880, 230, 280, 0.022)],
  'market-open': [tone(392, 0, 90, 0.025, 'triangle', 523, -0.2), tone(784, 62, 120, 0.026, 'sine', 1047, 0.2)],
  purchase: [tone(988, 0, 100, 0.032, 'triangle', 1319, -0.18), tone(1568, 80, 120, 0.035, 'sine', undefined, 0.18), tone(2093, 170, 210, 0.027)],
  equip: [tone(196, 0, 170, 0.036, 'triangle', 294), tone(587, 80, 190, 0.032, 'sine', 784, -0.16), tone(1175, 205, 210, 0.025, 'triangle', undefined, 0.16)],
  'mission-open': [tone(262, 0, 140, 0.028, 'triangle', 330, -0.16), tone(523, 85, 160, 0.03, 'sine', 659, 0.16), tone(988, 190, 210, 0.022)],
  'battle-start': [tone(98, 0, 420, 0.048, 'sawtooth', 147, -0.18), tone(196, 180, 360, 0.04, 'triangle', 294, 0.18), tone(587, 430, 260, 0.034, 'square', 784)],
  'mastery-up': [
    tone(196, 0, 280, 0.038, 'sine', 294), tone(392, 40, 160, 0.043, 'triangle', undefined, -0.22),
    tone(523, 125, 180, 0.047, 'sine', undefined, 0.2), tone(659, 220, 210, 0.05), tone(988, 330, 360, 0.035)
  ],
  correction: [
    tone(147, 0, 210, 0.04, 'triangle', 196, -0.15), tone(294, 120, 190, 0.042, 'sine', 392, 0.12),
    tone(523, 260, 240, 0.048, 'triangle', 784), tone(1047, 400, 260, 0.028)
  ],
  'boss-hit': [
    tone(72, 0, 230, 0.07, 'sine', 48), tone(144, 5, 150, 0.052, 'sawtooth', 96, -0.22),
    tone(880, 32, 100, 0.035, 'square', 1320, 0.2), tone(1760, 92, 130, 0.023)
  ],
  'boss-victory': [
    tone(65, 0, 820, 0.07, 'sine', 98), tone(196, 60, 250, 0.047, 'triangle', 294, -0.25),
    tone(392, 230, 260, 0.05, 'triangle', 523, 0.2), tone(659, 430, 310, 0.055),
    tone(784, 620, 380, 0.058, 'triangle'), tone(1047, 790, 480, 0.052), tone(1568, 980, 520, 0.034)
  ],
  'boss-defeat': [tone(147, 0, 330, 0.052, 'triangle', 110, -0.15), tone(220, 180, 300, 0.036, 'sine', 165, 0.14), tone(294, 420, 310, 0.028, 'triangle', 392)],
  'chapter-open': [tone(262, 0, 260, 0.036, 'sine', 392, -0.2), tone(523, 110, 280, 0.04, 'triangle', 659, 0.18), tone(784, 270, 410, 0.042), tone(1175, 460, 360, 0.026)],
  'bond-up': [tone(220, 0, 240, 0.035, 'sine', 330, -0.2), tone(440, 90, 250, 0.038, 'triangle', 554, 0.18), tone(659, 230, 340, 0.042), tone(880, 390, 330, 0.027)],
  'rival-open': [tone(82, 0, 360, 0.058, 'sine', 110), tone(165, 70, 260, 0.04, 'sawtooth', 220, -0.2), tone(330, 260, 210, 0.036, 'triangle', 247, 0.2)],
  'romance-open': [tone(261.63, 0, 300, 0.03, 'sine', 329.63, -0.18), tone(523.25, 100, 310, 0.034, 'sine', 659.25, 0.18), tone(783.99, 290, 420, 0.035)],
  'campus-bell': [tone(523.25, 0, 390, 0.036, 'sine'), tone(659.25, 210, 420, 0.04, 'sine'), tone(783.99, 430, 520, 0.044, 'sine'), tone(1046.5, 690, 620, 0.036, 'triangle')],
  'ambush-alert': [
    tone(82, 0, 520, 0.074, 'sawtooth', 123, -0.22), tone(659, 80, 120, 0.052, 'square', 988, 0.2),
    tone(82, 290, 520, 0.078, 'sawtooth', 147, 0.2), tone(784, 380, 150, 0.056, 'square', 1175, -0.18),
    tone(196, 650, 420, 0.058, 'triangle', 294), tone(587, 820, 380, 0.05, 'square', 880)
  ],
  'countdown-warning': [tone(880, 0, 115, 0.052, 'square', 660), tone(880, 240, 115, 0.054, 'square', 660), tone(1047, 480, 180, 0.056, 'square', 784)],
  'sound-on': [tone(392, 0, 110, 0.035, 'triangle', undefined, -0.1), tone(587, 85, 180, 0.04, 'sine', undefined, 0.1)],
  'sound-off': [tone(440, 0, 120, 0.03, 'triangle', 330, 0.1), tone(220, 85, 150, 0.022, 'sine', undefined, -0.1)]
}

export const SOUND_TEXTURES: Readonly<Partial<Record<SoundEffect, readonly NoiseSpec[]>>> = {
  correct: [noise(0, 95, 0.026, 190, 'lowpass'), noise(110, 210, 0.012, 3800, 'highpass', 0.12)],
  wrong: [noise(0, 155, 0.028, 150, 'lowpass')],
  reveal: [noise(25, 330, 0.01, 2500, 'highpass')],
  'battle-start': [noise(0, 260, 0.035, 180, 'lowpass'), noise(390, 240, 0.018, 3200, 'bandpass')],
  'card-drop': [noise(0, 300, 0.024, 1700, 'bandpass', -0.16)],
  technique: [noise(0, 420, 0.014, 620, 'bandpass')],
  'star-up': [noise(30, 650, 0.018, 1900, 'bandpass')],
  'realm-up': [noise(0, 950, 0.033, 420, 'lowpass'), noise(280, 850, 0.021, 2400, 'bandpass')],
  'achievement-unlock': [noise(80, 480, 0.014, 3200, 'highpass')],
  'character-unlock': [noise(40, 560, 0.012, 1800, 'bandpass')],
  'challenge-unlock': [noise(0, 620, 0.03, 240, 'lowpass'), noise(280, 440, 0.014, 1300, 'bandpass')],
  'quest-unlock': [noise(20, 500, 0.013, 2300, 'bandpass')],
  'story-next': [noise(0, 125, 0.012, 1500, 'bandpass', -0.18)],
  'story-choice': [noise(0, 230, 0.015, 760, 'bandpass')],
  'mastery-up': [noise(70, 540, 0.018, 2100, 'bandpass')],
  correction: [noise(0, 220, 0.018, 480, 'bandpass'), noise(270, 320, 0.012, 2600, 'highpass')],
  'boss-hit': [noise(0, 220, 0.055, 170, 'lowpass'), noise(20, 160, 0.026, 2600, 'bandpass')],
  'boss-victory': [noise(0, 900, 0.038, 380, 'lowpass'), noise(300, 980, 0.024, 2600, 'bandpass')],
  'boss-defeat': [noise(0, 520, 0.026, 240, 'lowpass')],
  'chapter-open': [noise(90, 620, 0.012, 2400, 'highpass')],
  'bond-up': [noise(80, 520, 0.01, 1800, 'bandpass')],
  'rival-open': [noise(0, 420, 0.03, 210, 'lowpass')],
  'campus-bell': [noise(260, 920, 0.009, 3600, 'highpass')],
  'ambush-alert': [noise(0, 900, 0.045, 190, 'lowpass'), noise(320, 620, 0.021, 2100, 'bandpass')]
}

export const RATING_SOUND: Readonly<Record<ReviewRating, SoundEffect>> = {
  again: 'rating-again',
  hint: 'rating-hint',
  independent: 'rating-independent',
  multiple: 'rating-multiple'
}

export const DEFAULT_AUDIO_PREFERENCES: AudioPreferences = {
  soundEnabled: true,
  musicEnabled: true,
  voiceEnabled: true,
  autoVoice: true,
  soundVolume: 0.86,
  musicVolume: 0.56,
  voiceVolume: 0.82,
  voiceRate: 1,
  musicTrackId: 'auto'
}

const LEGACY_SOUND_ENABLED_KEY = 'doupo-math-sound-enabled'
const AUDIO_PREFERENCES_KEY = 'doupo-math-audio-preferences-v2'
export const AUDIO_PREFERENCES_EVENT = 'doupo-audio-preferences-changed'
let audioContext: AudioContext | undefined
let outputNode: GainNode | undefined
let musicOutputNode: GainNode | undefined
let musicScene: MusicScene = 'home'
let activeMusicTrack: MusicTrack | undefined
let musicTimer: number | undefined
let musicSources: AudioScheduledSourceNode[] = []
let musicRestartToken = 0

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

export function getSoundOutputGain(volume: number) {
  const normalized = clamp(finiteNumber(volume, 0), 0, 1)
  return normalized <= 0 ? 0.0001 : 2.15 * Math.pow(normalized, 0.7)
}

export function getMusicOutputGain(volume: number) {
  const normalized = clamp(finiteNumber(volume, 0), 0, 1)
  return normalized <= 0 ? 0.0001 : 1.75 * Math.pow(normalized, 0.65)
}

function finiteNumber(value: unknown, fallback: number) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function booleanValue(value: unknown, fallback: boolean) {
  return typeof value === 'boolean' ? value : fallback
}

const MUSIC_TRACK_IDS: MusicTrack[] = ['home', 'practice', 'focus', 'story', 'market', 'battle', 'resolve', 'rain', 'library', 'campus', 'ascent', 'starlight']

function musicSelectionValue(value: unknown): MusicSelection {
  return value === 'auto' || MUSIC_TRACK_IDS.includes(value as MusicTrack) ? value as MusicSelection : DEFAULT_AUDIO_PREFERENCES.musicTrackId
}

function normalizePreferences(value?: Partial<AudioPreferences>): AudioPreferences {
  return {
    soundEnabled: booleanValue(value?.soundEnabled, DEFAULT_AUDIO_PREFERENCES.soundEnabled),
    musicEnabled: booleanValue(value?.musicEnabled, DEFAULT_AUDIO_PREFERENCES.musicEnabled),
    voiceEnabled: booleanValue(value?.voiceEnabled, DEFAULT_AUDIO_PREFERENCES.voiceEnabled),
    autoVoice: booleanValue(value?.autoVoice, DEFAULT_AUDIO_PREFERENCES.autoVoice),
    soundVolume: clamp(finiteNumber(value?.soundVolume, DEFAULT_AUDIO_PREFERENCES.soundVolume), 0, 1),
    musicVolume: clamp(finiteNumber(value?.musicVolume, DEFAULT_AUDIO_PREFERENCES.musicVolume), 0, 1),
    voiceVolume: clamp(finiteNumber(value?.voiceVolume, DEFAULT_AUDIO_PREFERENCES.voiceVolume), 0, 1),
    voiceRate: clamp(finiteNumber(value?.voiceRate, DEFAULT_AUDIO_PREFERENCES.voiceRate), 0.8, 1.2),
    musicTrackId: musicSelectionValue(value?.musicTrackId)
  }
}

export function getAudioPreferences(): AudioPreferences {
  if (typeof window === 'undefined') return { ...DEFAULT_AUDIO_PREFERENCES }
  try {
    const saved = window.localStorage.getItem(AUDIO_PREFERENCES_KEY)
    const parsed = saved ? JSON.parse(saved) as Partial<AudioPreferences> : undefined
    const legacySound = window.localStorage.getItem(LEGACY_SOUND_ENABLED_KEY)
    return normalizePreferences({ ...parsed, soundEnabled: parsed?.soundEnabled ?? legacySound !== '0' })
  } catch {
    return { ...DEFAULT_AUDIO_PREFERENCES }
  }
}

export function saveAudioPreferences(patch: Partial<AudioPreferences>): AudioPreferences {
  const previous = getAudioPreferences()
  const next = normalizePreferences({ ...previous, ...patch })
  const trackChanged = previous.musicTrackId !== next.musicTrackId
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(AUDIO_PREFERENCES_KEY, JSON.stringify(next))
      window.localStorage.setItem(LEGACY_SOUND_ENABLED_KEY, next.soundEnabled ? '1' : '0')
      window.dispatchEvent(new CustomEvent(AUDIO_PREFERENCES_EVENT, { detail: next }))
    } catch {
      // Audio preferences are optional; restricted storage must not block doing a problem.
    }
  }
  if (audioContext && outputNode) outputNode.gain.setTargetAtTime(getSoundOutputGain(next.soundVolume), audioContext.currentTime, 0.02)
  if (audioContext && musicOutputNode) {
    musicOutputNode.gain.setTargetAtTime(next.musicEnabled ? getMusicOutputGain(next.musicVolume) : 0.0001, audioContext.currentTime, 0.08)
    if (!next.musicEnabled) stopMusicSources()
    else if (trackChanged && !document.hidden) restartBackgroundMusic()
    else if (!document.hidden) void resumeBackgroundMusic()
  }
  return next
}

export function getSoundEnabled() {
  return getAudioPreferences().soundEnabled
}

export function saveSoundEnabled(enabled: boolean) {
  return saveAudioPreferences({ soundEnabled: enabled })
}

function getTextureDuration(effect: SoundEffect) {
  const textures = SOUND_TEXTURES[effect] || []
  return textures.length ? Math.max(...textures.map((item) => item.startMs + item.durationMs)) : 0
}

export function getSoundPatternDuration(effect: SoundEffect) {
  return Math.max(
    ...SOUND_PATTERNS[effect].map((item) => item.startMs + item.durationMs),
    getTextureDuration(effect)
  )
}

export function getSoundSequenceDuration(items: readonly SoundSequenceItem[]) {
  if (!items.length) return 0
  return Math.max(...items.map((item) => (item.delayMs || 0) + getSoundPatternDuration(item.effect)))
}

function ensureAudioGraph() {
  if (typeof window === 'undefined') return
  const AudioContextClass = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AudioContextClass) return
  if (!audioContext || audioContext.state === 'closed') {
    audioContext = new AudioContextClass({ latencyHint: 'interactive' })
    const compressor = audioContext.createDynamicsCompressor()
    compressor.threshold.value = -16
    compressor.knee.value = 18
    compressor.ratio.value = 5
    compressor.attack.value = 0.002
    compressor.release.value = 0.22
    outputNode = audioContext.createGain()
    outputNode.gain.value = getSoundOutputGain(getAudioPreferences().soundVolume)
    musicOutputNode = audioContext.createGain()
    musicOutputNode.gain.value = 0.0001
    outputNode.connect(compressor)
    musicOutputNode.connect(compressor)
    compressor.connect(audioContext.destination)
  }
  return { context: audioContext, output: outputNode! }
}

interface MusicSceneSpec {
  title: string
  tempo: number
  steps: readonly (readonly number[])[]
  bass: readonly number[]
  accent: readonly number[]
  wave: OscillatorType
  filterFrequency: number
  noteGain: number
  bassGain: number
  rhythmGain: number
}

export const MUSIC_SCENES: Readonly<Record<MusicScene, MusicSceneSpec>> = {
  home: {
    title: '交大晨光', tempo: 72,
    steps: [[261.63, 392], [329.63, 493.88], [293.66, 440], [349.23, 523.25], [392, 587.33], [349.23, 523.25], [329.63, 493.88], [293.66, 440]],
    bass: [130.81, 146.83, 174.61, 146.83], accent: [659.25, 783.99, 698.46, 880, 783.99, 698.46, 659.25, 587.33],
    wave: 'sine', filterFrequency: 1750, noteGain: 0.052, bassGain: 0.046, rhythmGain: 0.012
  },
  practice: {
    title: '山门启程', tempo: 80,
    steps: [[220, 329.63], [246.94, 369.99], [261.63, 392], [293.66, 440], [261.63, 392], [246.94, 369.99], [220, 329.63], [196, 293.66]],
    bass: [110, 123.47, 130.81, 98], accent: [440, 493.88, 523.25, 587.33, 523.25, 493.88, 440, 392],
    wave: 'triangle', filterFrequency: 1450, noteGain: 0.048, bassGain: 0.05, rhythmGain: 0.018
  },
  focus: {
    title: '深夜推演', tempo: 60,
    steps: [[196], [293.66], [220], [329.63], [174.61], [261.63], [196], [293.66]],
    bass: [98, 110, 87.31, 98], accent: [392, 440, 392, 493.88, 349.23, 440, 392, 329.63],
    wave: 'triangle', filterFrequency: 920, noteGain: 0.042, bassGain: 0.044, rhythmGain: 0
  },
  story: {
    title: '同行长路', tempo: 68,
    steps: [[196, 293.66], [220, 329.63], [246.94, 369.99], [220, 329.63], [174.61, 261.63], [196, 293.66], [220, 329.63], [246.94, 369.99]],
    bass: [98, 110, 87.31, 123.47], accent: [587.33, 659.25, 739.99, 659.25, 523.25, 587.33, 659.25, 739.99],
    wave: 'sine', filterFrequency: 1550, noteGain: 0.047, bassGain: 0.042, rhythmGain: 0.006
  },
  market: {
    title: '黑角坊市', tempo: 88,
    steps: [[293.66, 440], [329.63], [392, 493.88], [329.63], [261.63, 392], [329.63], [440, 523.25], [392]],
    bass: [146.83, 164.81, 130.81, 146.83], accent: [880, 987.77, 1174.66, 987.77, 783.99, 987.77, 1318.51, 1174.66],
    wave: 'triangle', filterFrequency: 1900, noteGain: 0.048, bassGain: 0.047, rhythmGain: 0.016
  },
  battle: {
    title: '宿敌决战', tempo: 104,
    steps: [[220], [220, 329.63], [246.94], [261.63, 392], [196], [220, 329.63], [174.61], [196, 293.66]],
    bass: [55, 61.74, 49, 55], accent: [440, 440, 493.88, 523.25, 392, 440, 349.23, 392],
    wave: 'sawtooth', filterFrequency: 1250, noteGain: 0.052, bassGain: 0.066, rhythmGain: 0.032
  },
  resolve: {
    title: '思源回响', tempo: 64,
    steps: [[174.61, 261.63], [196, 293.66], [220, 329.63], [246.94, 369.99], [261.63, 392], [246.94, 369.99], [220, 329.63], [196, 293.66]],
    bass: [87.31, 98, 110, 123.47], accent: [523.25, 587.33, 659.25, 739.99, 783.99, 739.99, 659.25, 587.33],
    wave: 'sine', filterFrequency: 1650, noteGain: 0.049, bassGain: 0.043, rhythmGain: 0.008
  }
}

const ADDITIONAL_MUSIC_TRACKS: Readonly<Record<Exclude<MusicTrack, MusicScene>, MusicSceneSpec>> = {
  rain: {
    title: '梧桐雨夜', tempo: 56,
    steps: [[174.61, 261.63], [196], [220, 293.66], [196], [164.81, 246.94], [174.61], [196, 261.63], [146.83]],
    bass: [87.31, 82.41, 73.42, 82.41], accent: [523.25, 440, 587.33, 493.88, 440, 392, 523.25, 349.23],
    wave: 'sine', filterFrequency: 780, noteGain: 0.038, bassGain: 0.039, rhythmGain: 0
  },
  library: {
    title: '闭馆前一小时', tempo: 66,
    steps: [[261.63, 329.63], [293.66], [329.63, 392], [349.23], [293.66, 369.99], [261.63], [246.94, 329.63], [220]],
    bass: [130.81, 146.83, 123.47, 110], accent: [659.25, 587.33, 783.99, 698.46, 659.25, 523.25, 587.33, 493.88],
    wave: 'triangle', filterFrequency: 1320, noteGain: 0.044, bassGain: 0.041, rhythmGain: 0.004
  },
  campus: {
    title: '思源湖风', tempo: 76,
    steps: [[293.66, 440], [329.63, 493.88], [392, 587.33], [349.23, 523.25], [329.63, 493.88], [293.66, 440], [261.63, 392], [329.63, 493.88]],
    bass: [146.83, 164.81, 196, 174.61], accent: [880, 987.77, 1174.66, 1046.5, 987.77, 880, 783.99, 987.77],
    wave: 'sine', filterFrequency: 2050, noteGain: 0.05, bassGain: 0.044, rhythmGain: 0.008
  },
  ascent: {
    title: '破境长阶', tempo: 94,
    steps: [[196, 293.66], [220, 329.63], [246.94, 369.99], [293.66, 440], [329.63, 493.88], [293.66, 440], [246.94, 369.99], [220, 329.63]],
    bass: [98, 110, 123.47, 146.83], accent: [587.33, 659.25, 739.99, 880, 987.77, 880, 739.99, 659.25],
    wave: 'sawtooth', filterFrequency: 1480, noteGain: 0.046, bassGain: 0.056, rhythmGain: 0.024
  },
  starlight: {
    title: '凌晨四点的公式', tempo: 52,
    steps: [[220, 329.63], [196], [174.61, 261.63], [164.81], [196, 293.66], [220], [246.94, 369.99], [196]],
    bass: [110, 98, 82.41, 98], accent: [440, 493.88, 392, 523.25, 587.33, 493.88, 659.25, 440],
    wave: 'sine', filterFrequency: 720, noteGain: 0.036, bassGain: 0.038, rhythmGain: 0
  }
}

export const MUSIC_TRACKS: Readonly<Record<MusicTrack, MusicSceneSpec>> = {
  ...MUSIC_SCENES,
  ...ADDITIONAL_MUSIC_TRACKS
}

export const MUSIC_TRACK_OPTIONS: readonly { id: MusicTrack, title: string, description: string }[] = [
  { id: 'home', title: '交大晨光', description: '明亮舒展，适合开始今天的第一组题。' },
  { id: 'practice', title: '山门启程', description: '稳健节拍，适合连续做题与章节推进。' },
  { id: 'focus', title: '深夜推演', description: '低干扰慢拍，适合长解析与专注计算。' },
  { id: 'story', title: '同行长路', description: '温和叙事感，适合人物与交大主线。' },
  { id: 'market', title: '黑角坊市', description: '轻快灵动，适合商城和奖励整理。' },
  { id: 'battle', title: '宿敌决战', description: '高压强节奏，适合 Boss 与五题挑战。' },
  { id: 'resolve', title: '思源回响', description: '平静收束，适合复盘、洞府和错因整理。' },
  { id: 'rain', title: '梧桐雨夜', description: '雨夜般稀疏安静，减少长时间学习疲劳。' },
  { id: 'library', title: '闭馆前一小时', description: '克制的倒计时感，适合冲刺一个小节。' },
  { id: 'campus', title: '思源湖风', description: '开阔明亮，把交大目标留在背景里。' },
  { id: 'ascent', title: '破境长阶', description: '逐步抬升的战斗感，适合需要提神时。' },
  { id: 'starlight', title: '凌晨四点的公式', description: '最慢、最轻的一首，适合夜间低刺激刷题。' }
]

export function resolveMusicTrack(scene: MusicScene, selection: MusicSelection): MusicTrack {
  return selection === 'auto' ? scene : selection
}

function stopMusicSources() {
  if (musicTimer !== undefined && typeof window !== 'undefined') window.clearTimeout(musicTimer)
  musicTimer = undefined
  musicSources.forEach((source) => {
    try { source.stop() } catch { /* Source may already have ended. */ }
  })
  musicSources = []
  activeMusicTrack = undefined
}

function scheduleMusicPass(context: AudioContext, output: AudioNode, track: MusicTrack) {
  const spec = MUSIC_TRACKS[track]
  const beat = 60 / spec.tempo
  const origin = context.currentTime + 0.06
  const loopDuration = spec.steps.length * beat
  const sources: AudioScheduledSourceNode[] = []

  spec.steps.forEach((chord, index) => {
    chord.forEach((frequency, noteIndex) => {
      const oscillator = context.createOscillator()
      const envelope = context.createGain()
      const filter = context.createBiquadFilter()
      const start = origin + index * beat
      const end = start + beat * 0.76
      oscillator.type = spec.wave
      oscillator.frequency.value = frequency
      filter.type = 'lowpass'
      filter.frequency.value = spec.filterFrequency
      envelope.gain.setValueAtTime(0.0001, start)
      envelope.gain.exponentialRampToValueAtTime(spec.noteGain / (1 + noteIndex * 0.55), start + 0.035)
      envelope.gain.exponentialRampToValueAtTime(0.0001, end)
      oscillator.connect(filter)
      filter.connect(envelope)
      connectWithPan(context, envelope, output, noteIndex ? 0.18 : -0.12)
      oscillator.start(start)
      oscillator.stop(end + 0.03)
      sources.push(oscillator)
    })
  })

  spec.bass.forEach((frequency, index) => {
    const oscillator = context.createOscillator()
    const envelope = context.createGain()
    const start = origin + index * beat * 2
    const end = start + beat * 1.55
    oscillator.type = 'sine'
    oscillator.frequency.value = frequency
    envelope.gain.setValueAtTime(0.0001, start)
    envelope.gain.exponentialRampToValueAtTime(spec.bassGain, start + 0.04)
    envelope.gain.exponentialRampToValueAtTime(0.0001, end)
    oscillator.connect(envelope)
    envelope.connect(output)
    oscillator.start(start)
    oscillator.stop(end + 0.03)
    sources.push(oscillator)
  })

  spec.accent.forEach((frequency, index) => {
    const oscillator = context.createOscillator()
    const envelope = context.createGain()
    const start = origin + index * beat + beat * 0.48
    const end = start + beat * 0.24
    oscillator.type = track === 'battle' ? 'square' : 'sine'
    oscillator.frequency.value = frequency
    envelope.gain.setValueAtTime(0.0001, start)
    envelope.gain.exponentialRampToValueAtTime(spec.noteGain * 0.42, start + 0.018)
    envelope.gain.exponentialRampToValueAtTime(0.0001, end)
    oscillator.connect(envelope)
    connectWithPan(context, envelope, output, index % 2 ? 0.24 : -0.24)
    oscillator.start(start)
    oscillator.stop(end + 0.02)
    sources.push(oscillator)
  })

  if (spec.rhythmGain > 0) {
    spec.steps.forEach((_, index) => {
      const oscillator = context.createOscillator()
      const envelope = context.createGain()
      const start = origin + index * beat
      const end = start + Math.min(0.15, beat * 0.22)
      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(index % 2 ? 96 : 82, start)
      oscillator.frequency.exponentialRampToValueAtTime(48, end)
      envelope.gain.setValueAtTime(spec.rhythmGain, start)
      envelope.gain.exponentialRampToValueAtTime(0.0001, end)
      oscillator.connect(envelope)
      envelope.connect(output)
      oscillator.start(start)
      oscillator.stop(end + 0.02)
      sources.push(oscillator)
    })
  }

  musicSources = sources
  activeMusicTrack = track
  const token = musicRestartToken
  musicTimer = window.setTimeout(() => {
    if (token !== musicRestartToken || document.hidden || !getAudioPreferences().musicEnabled) return
    scheduleMusicPass(context, output, track)
  }, Math.max(250, (loopDuration - 0.12) * 1000))
}

function restartBackgroundMusic() {
  if (!audioContext || !musicOutputNode) return
  musicRestartToken += 1
  const token = musicRestartToken
  musicOutputNode.gain.setTargetAtTime(0.0001, audioContext.currentTime, 0.08)
  window.setTimeout(() => {
    if (token !== musicRestartToken) return
    stopMusicSources()
    void resumeBackgroundMusic()
  }, 180)
}

export function setBackgroundMusicScene(scene: MusicScene) {
  musicScene = scene
  const track = resolveMusicTrack(scene, getAudioPreferences().musicTrackId)
  if (!audioContext || !musicOutputNode || activeMusicTrack === track) return
  restartBackgroundMusic()
}

export async function resumeBackgroundMusic() {
  if (typeof document === 'undefined' || document.hidden || !getAudioPreferences().musicEnabled) return false
  const graph = ensureAudioGraph()
  if (!graph || !musicOutputNode) return false
  try {
    if (graph.context.state === 'suspended') await graph.context.resume()
    if (!activeMusicTrack) {
      musicRestartToken += 1
      scheduleMusicPass(graph.context, musicOutputNode, resolveMusicTrack(musicScene, getAudioPreferences().musicTrackId))
    }
    musicOutputNode.gain.setTargetAtTime(getMusicOutputGain(getAudioPreferences().musicVolume), graph.context.currentTime, 0.18)
    return true
  } catch {
    return false
  }
}

export function pauseBackgroundMusic() {
  musicRestartToken += 1
  const token = musicRestartToken
  if (audioContext && musicOutputNode) musicOutputNode.gain.setTargetAtTime(0.0001, audioContext.currentTime, 0.08)
  window.setTimeout(() => {
    if (token === musicRestartToken) stopMusicSources()
  }, 180)
}

function connectWithPan(context: AudioContext, input: AudioNode, output: AudioNode, pan: number) {
  if (typeof context.createStereoPanner === 'function') {
    const panner = context.createStereoPanner()
    panner.pan.value = pan
    input.connect(panner)
    panner.connect(output)
    return
  }
  input.connect(output)
}

function scheduleTones(context: AudioContext, output: AudioNode, effect: SoundEffect, origin: number) {
  for (const spec of SOUND_PATTERNS[effect]) {
    const oscillator = context.createOscillator()
    const envelope = context.createGain()
    const start = origin + spec.startMs / 1000
    const end = start + spec.durationMs / 1000
    const attack = Math.min(0.018, spec.durationMs / 4000)

    oscillator.type = spec.wave
    oscillator.frequency.setValueAtTime(spec.frequency, start)
    if (spec.endFrequency) oscillator.frequency.exponentialRampToValueAtTime(spec.endFrequency, end)
    envelope.gain.setValueAtTime(0.0001, start)
    envelope.gain.exponentialRampToValueAtTime(spec.gain, start + attack)
    envelope.gain.exponentialRampToValueAtTime(0.0001, end)
    oscillator.connect(envelope)
    connectWithPan(context, envelope, output, spec.pan)
    oscillator.start(start)
    oscillator.stop(end + 0.025)
  }
}

function scheduleTextures(context: AudioContext, output: AudioNode, effect: SoundEffect, origin: number) {
  for (const spec of SOUND_TEXTURES[effect] || []) {
    const frameCount = Math.max(1, Math.ceil(context.sampleRate * spec.durationMs / 1000))
    const buffer = context.createBuffer(1, frameCount, context.sampleRate)
    const channel = buffer.getChannelData(0)
    for (let index = 0; index < channel.length; index += 1) {
      const decay = 1 - index / channel.length
      channel[index] = (Math.random() * 2 - 1) * decay * decay
    }
    const source = context.createBufferSource()
    const filter = context.createBiquadFilter()
    const envelope = context.createGain()
    const start = origin + spec.startMs / 1000
    const end = start + spec.durationMs / 1000
    source.buffer = buffer
    filter.type = spec.filterType
    filter.frequency.value = spec.filterFrequency
    filter.Q.value = spec.filterType === 'bandpass' ? 0.8 : 0.35
    envelope.gain.setValueAtTime(0.0001, start)
    envelope.gain.exponentialRampToValueAtTime(spec.gain, start + 0.012)
    envelope.gain.exponentialRampToValueAtTime(0.0001, end)
    source.connect(filter)
    filter.connect(envelope)
    connectWithPan(context, envelope, output, spec.pan)
    source.start(start)
    source.stop(end + 0.02)
  }
}

export function playSoundSequence(items: readonly SoundSequenceItem[]) {
  if (!items.length || !getSoundEnabled()) return 0
  const graph = ensureAudioGraph()
  if (!graph) return 0
  const schedule = () => {
    const origin = graph.context.currentTime + 0.008
    for (const item of items) {
      const itemOrigin = origin + (item.delayMs || 0) / 1000
      scheduleTones(graph.context, graph.output, item.effect, itemOrigin)
      scheduleTextures(graph.context, graph.output, item.effect, itemOrigin)
    }
  }
  if (graph.context.state === 'suspended') void graph.context.resume().then(schedule).catch(() => undefined)
  else schedule()
  return getSoundSequenceDuration(items)
}

export function playSound(effect: SoundEffect) {
  return playSoundSequence([{ effect }])
}

export function playRewardSound(options: RewardSoundOptions) {
  const mainEffect = options.realmBreakthrough ? 'realm-up' : options.advanced ? 'star-up' : RATING_SOUND[options.rating]
  const baseDuration = getSoundPatternDuration(mainEffect)
  const cardDelay = options.realmBreakthrough ? 1040 : options.advanced ? 590 : Math.max(210, baseDuration - 120)
  const sequence: SoundSequenceItem[] = [{ effect: mainEffect }]
  if (options.techniqueTriggered) sequence.push({ effect: 'technique', delayMs: options.realmBreakthrough ? 720 : options.advanced ? 420 : 240 })
  if (options.bossHit) sequence.push({ effect: 'boss-hit', delayMs: Math.max(170, baseDuration - 90) })
  if (options.corrected) sequence.push({ effect: 'correction', delayMs: cardDelay + 80 })
  else if (options.masteryGained) sequence.push({ effect: 'mastery-up', delayMs: cardDelay + 80 })
  sequence.push({ effect: 'card-drop', delayMs: cardDelay })
  if (options.coinsEarned > 0) sequence.push({ effect: 'coin', delayMs: cardDelay + 250 })
  if (options.bossResult) sequence.push({ effect: options.bossResult === 'victory' ? 'boss-victory' : 'boss-defeat', delayMs: cardDelay + 520 })
  return playSoundSequence(sequence)
}

const UNLOCK_SOUND: Readonly<Record<UnlockEventKind, SoundEffect>> = {
  achievement: 'achievement-unlock',
  character: 'character-unlock',
  challenge: 'challenge-unlock',
  quest: 'quest-unlock'
}

export function playUnlockSounds(events: readonly UnlockEvent[], delayMs = 0) {
  const uniqueKinds = [...new Set(events.map((event) => event.kind))]
  return playSoundSequence(uniqueKinds.map((kind, index) => ({
    effect: UNLOCK_SOUND[kind],
    delayMs: delayMs + index * 760
  })))
}

export function pulseHaptic(pattern: number | number[]) {
  if (typeof navigator === 'undefined' || !('vibrate' in navigator)) return
  navigator.vibrate?.(pattern)
}
