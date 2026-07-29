import type { ReviewRating } from '../types'

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
  | 'next'
  | 'story-next'
  | 'story-choice'
  | 'character-open'
  | 'sound-on'
  | 'sound-off'

export interface AudioPreferences {
  soundEnabled: boolean
  voiceEnabled: boolean
  autoVoice: boolean
  soundVolume: number
  voiceVolume: number
  voiceRate: number
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
  next: [tone(494, 0, 90, 0.027, 'triangle', 587, -0.1), tone(784, 70, 130, 0.025, 'sine', 988, 0.12)],
  'story-next': [tone(260, 0, 85, 0.019, 'triangle', 330, -0.22), tone(520, 55, 120, 0.021, 'sine', 620, 0.18)],
  'story-choice': [tone(196, 0, 210, 0.032, 'triangle', 294), tone(392, 90, 180, 0.034, 'sine', undefined, -0.16), tone(587, 180, 240, 0.038, 'sine', undefined, 0.16)],
  'character-open': [tone(294, 0, 150, 0.022, 'sine', 392, -0.14), tone(587, 75, 210, 0.027, 'triangle', 784, 0.14)],
  'sound-on': [tone(392, 0, 110, 0.035, 'triangle', undefined, -0.1), tone(587, 85, 180, 0.04, 'sine', undefined, 0.1)],
  'sound-off': [tone(440, 0, 120, 0.03, 'triangle', 330, 0.1), tone(220, 85, 150, 0.022, 'sine', undefined, -0.1)]
}

export const SOUND_TEXTURES: Readonly<Partial<Record<SoundEffect, readonly NoiseSpec[]>>> = {
  correct: [noise(0, 95, 0.026, 190, 'lowpass'), noise(110, 210, 0.012, 3800, 'highpass', 0.12)],
  wrong: [noise(0, 155, 0.028, 150, 'lowpass')],
  reveal: [noise(25, 330, 0.01, 2500, 'highpass')],
  'card-drop': [noise(0, 300, 0.024, 1700, 'bandpass', -0.16)],
  technique: [noise(0, 420, 0.014, 620, 'bandpass')],
  'star-up': [noise(30, 650, 0.018, 1900, 'bandpass')],
  'realm-up': [noise(0, 950, 0.033, 420, 'lowpass'), noise(280, 850, 0.021, 2400, 'bandpass')],
  'story-next': [noise(0, 125, 0.012, 1500, 'bandpass', -0.18)],
  'story-choice': [noise(0, 230, 0.015, 760, 'bandpass')]
}

export const RATING_SOUND: Readonly<Record<ReviewRating, SoundEffect>> = {
  again: 'rating-again',
  hint: 'rating-hint',
  independent: 'rating-independent',
  multiple: 'rating-multiple'
}

export const DEFAULT_AUDIO_PREFERENCES: AudioPreferences = {
  soundEnabled: true,
  voiceEnabled: true,
  autoVoice: true,
  soundVolume: 0.78,
  voiceVolume: 0.82,
  voiceRate: 1
}

const LEGACY_SOUND_ENABLED_KEY = 'doupo-math-sound-enabled'
const AUDIO_PREFERENCES_KEY = 'doupo-math-audio-preferences-v2'
export const AUDIO_PREFERENCES_EVENT = 'doupo-audio-preferences-changed'
let audioContext: AudioContext | undefined
let outputNode: GainNode | undefined

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

function finiteNumber(value: unknown, fallback: number) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function booleanValue(value: unknown, fallback: boolean) {
  return typeof value === 'boolean' ? value : fallback
}

function normalizePreferences(value?: Partial<AudioPreferences>): AudioPreferences {
  return {
    soundEnabled: booleanValue(value?.soundEnabled, DEFAULT_AUDIO_PREFERENCES.soundEnabled),
    voiceEnabled: booleanValue(value?.voiceEnabled, DEFAULT_AUDIO_PREFERENCES.voiceEnabled),
    autoVoice: booleanValue(value?.autoVoice, DEFAULT_AUDIO_PREFERENCES.autoVoice),
    soundVolume: clamp(finiteNumber(value?.soundVolume, DEFAULT_AUDIO_PREFERENCES.soundVolume), 0, 1),
    voiceVolume: clamp(finiteNumber(value?.voiceVolume, DEFAULT_AUDIO_PREFERENCES.voiceVolume), 0, 1),
    voiceRate: clamp(finiteNumber(value?.voiceRate, DEFAULT_AUDIO_PREFERENCES.voiceRate), 0.8, 1.2)
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
  const next = normalizePreferences({ ...getAudioPreferences(), ...patch })
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(AUDIO_PREFERENCES_KEY, JSON.stringify(next))
      window.localStorage.setItem(LEGACY_SOUND_ENABLED_KEY, next.soundEnabled ? '1' : '0')
      window.dispatchEvent(new CustomEvent(AUDIO_PREFERENCES_EVENT, { detail: next }))
    } catch {
      // Audio preferences are optional; restricted storage must not block doing a problem.
    }
  }
  if (audioContext && outputNode) outputNode.gain.setTargetAtTime(0.72 * next.soundVolume, audioContext.currentTime, 0.02)
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
    compressor.threshold.value = -18
    compressor.knee.value = 18
    compressor.ratio.value = 5
    compressor.attack.value = 0.003
    compressor.release.value = 0.18
    outputNode = audioContext.createGain()
    outputNode.gain.value = 0.72 * getAudioPreferences().soundVolume
    outputNode.connect(compressor)
    compressor.connect(audioContext.destination)
  }
  return { context: audioContext, output: outputNode! }
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
  sequence.push({ effect: 'card-drop', delayMs: cardDelay })
  if (options.coinsEarned > 0) sequence.push({ effect: 'coin', delayMs: cardDelay + 250 })
  return playSoundSequence(sequence)
}

export function pulseHaptic(pattern: number | number[]) {
  if (typeof navigator === 'undefined' || !('vibrate' in navigator)) return
  navigator.vibrate?.(pattern)
}
