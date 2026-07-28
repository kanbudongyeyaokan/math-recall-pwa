import type { ReviewRating } from '../types'

export type SoundEffect =
  | 'option'
  | 'focus'
  | 'correct'
  | 'wrong'
  | 'reveal'
  | 'rating-again'
  | 'rating-hint'
  | 'rating-independent'
  | 'rating-multiple'
  | 'star-up'
  | 'realm-up'
  | 'next'
  | 'sound-on'
  | 'sound-off'

interface ToneSpec {
  frequency: number
  endFrequency?: number
  startMs: number
  durationMs: number
  gain: number
  wave: OscillatorType
}

const tone = (frequency: number, startMs: number, durationMs: number, gain: number, wave: OscillatorType = 'sine', endFrequency?: number): ToneSpec => ({
  frequency,
  endFrequency,
  startMs,
  durationMs,
  gain,
  wave
})

export const SOUND_PATTERNS: Readonly<Record<SoundEffect, readonly ToneSpec[]>> = {
  option: [tone(520, 0, 48, 0.025, 'square', 640), tone(1040, 8, 32, 0.012)],
  focus: [tone(196, 0, 260, 0.032, 'sine', 294), tone(392, 130, 230, 0.022, 'triangle', 494)],
  correct: [tone(262, 0, 170, 0.045, 'triangle'), tone(523, 15, 150, 0.05, 'sine'), tone(659, 85, 190, 0.048, 'sine'), tone(784, 155, 240, 0.052, 'triangle'), tone(1175, 210, 210, 0.025)],
  wrong: [tone(196, 0, 250, 0.05, 'triangle', 147), tone(98, 35, 300, 0.045, 'sine', 82), tone(247, 120, 170, 0.02, 'sine', 196)],
  reveal: [tone(330, 0, 260, 0.028), tone(494, 45, 280, 0.032), tone(659, 95, 330, 0.034), tone(988, 155, 290, 0.018)],
  'rating-again': [tone(220, 0, 210, 0.038, 'triangle', 196), tone(294, 135, 200, 0.03, 'sine', 330)],
  'rating-hint': [tone(294, 0, 150, 0.035, 'triangle'), tone(392, 95, 170, 0.038), tone(494, 195, 220, 0.035)],
  'rating-independent': [tone(262, 0, 170, 0.04, 'triangle'), tone(392, 80, 180, 0.042), tone(523, 160, 210, 0.045), tone(784, 240, 260, 0.032)],
  'rating-multiple': [tone(330, 0, 150, 0.038, 'triangle'), tone(440, 65, 160, 0.04), tone(554, 130, 170, 0.044), tone(659, 195, 190, 0.046), tone(880, 265, 270, 0.045), tone(1320, 330, 260, 0.022)],
  'star-up': [tone(131, 0, 500, 0.055, 'triangle', 196), tone(392, 45, 180, 0.04), tone(494, 145, 190, 0.043), tone(587, 245, 200, 0.046), tone(784, 355, 430, 0.052), tone(1175, 470, 360, 0.025)],
  'realm-up': [
    tone(65, 0, 760, 0.065, 'sine', 98), tone(131, 0, 650, 0.052, 'triangle', 196),
    tone(262, 110, 210, 0.04), tone(330, 230, 220, 0.042), tone(392, 350, 230, 0.044), tone(523, 480, 260, 0.05),
    tone(659, 610, 380, 0.052), tone(784, 735, 520, 0.052), tone(1047, 850, 560, 0.045),
    tone(523, 880, 600, 0.03, 'triangle'), tone(1319, 1010, 460, 0.025)
  ],
  next: [tone(494, 0, 90, 0.027, 'triangle', 587), tone(784, 70, 130, 0.025, 'sine', 988)],
  'sound-on': [tone(392, 0, 110, 0.035, 'triangle'), tone(587, 85, 180, 0.04)],
  'sound-off': [tone(440, 0, 120, 0.03, 'triangle', 330), tone(220, 85, 150, 0.022)]
}

export const RATING_SOUND: Readonly<Record<ReviewRating, SoundEffect>> = {
  again: 'rating-again',
  hint: 'rating-hint',
  independent: 'rating-independent',
  multiple: 'rating-multiple'
}

const SOUND_ENABLED_KEY = 'doupo-math-sound-enabled'
let audioContext: AudioContext | undefined
let outputNode: GainNode | undefined

export function getSoundEnabled() {
  if (typeof window === 'undefined') return true
  return window.localStorage.getItem(SOUND_ENABLED_KEY) !== '0'
}

export function saveSoundEnabled(enabled: boolean) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(SOUND_ENABLED_KEY, enabled ? '1' : '0')
}

export function getSoundPatternDuration(effect: SoundEffect) {
  return Math.max(...SOUND_PATTERNS[effect].map((item) => item.startMs + item.durationMs))
}

function ensureAudioGraph() {
  if (typeof window === 'undefined') return
  const AudioContextClass = window.AudioContext
  if (!AudioContextClass) return
  if (!audioContext) {
    audioContext = new AudioContextClass({ latencyHint: 'interactive' })
    const compressor = audioContext.createDynamicsCompressor()
    compressor.threshold.value = -18
    compressor.knee.value = 18
    compressor.ratio.value = 5
    compressor.attack.value = 0.003
    compressor.release.value = 0.18
    outputNode = audioContext.createGain()
    outputNode.gain.value = 0.72
    outputNode.connect(compressor)
    compressor.connect(audioContext.destination)
  }
  return { context: audioContext, output: outputNode! }
}

function schedulePattern(effect: SoundEffect) {
  const graph = ensureAudioGraph()
  if (!graph) return
  const { context, output } = graph
  const origin = context.currentTime + 0.008

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
    envelope.connect(output)
    oscillator.start(start)
    oscillator.stop(end + 0.025)
  }
}

export function playSound(effect: SoundEffect) {
  if (!getSoundEnabled()) return
  const graph = ensureAudioGraph()
  if (!graph) return
  if (graph.context.state === 'suspended') {
    void graph.context.resume().then(() => schedulePattern(effect)).catch(() => undefined)
    return
  }
  schedulePattern(effect)
}

export function pulseHaptic(pattern: number | number[]) {
  if (typeof navigator === 'undefined' || !('vibrate' in navigator)) return
  navigator.vibrate?.(pattern)
}
