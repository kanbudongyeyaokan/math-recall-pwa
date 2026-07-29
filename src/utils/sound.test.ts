import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  DEFAULT_AUDIO_PREFERENCES,
  getAudioPreferences,
  getSoundPatternDuration,
  getSoundSequenceDuration,
  RATING_SOUND,
  saveAudioPreferences,
  SOUND_PATTERNS,
  SOUND_TEXTURES
} from './sound'

afterEach(() => {
  vi.unstubAllGlobals()
})

function mockBrowserStorage() {
  const values = new Map<string, string>()
  const localStorage = {
    getItem: vi.fn((key: string) => values.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => values.set(key, value))
  }
  vi.stubGlobal('window', { localStorage, dispatchEvent: vi.fn() })
  vi.stubGlobal('CustomEvent', class {
    constructor(public type: string, public init?: CustomEventInit) {}
  })
  return { values, localStorage }
}

describe('做题分层音效', () => {
  it('每个交互事件都有可播放的音符层', () => {
    for (const pattern of Object.values(SOUND_PATTERNS)) {
      expect(pattern.length).toBeGreaterThan(0)
      expect(pattern.every((tone) => tone.frequency > 0 && tone.durationMs > 0 && tone.gain > 0)).toBe(true)
    }
  })

  it('奖励强度随掌握程度提升', () => {
    expect(getSoundPatternDuration(RATING_SOUND.hint)).toBeGreaterThan(getSoundPatternDuration(RATING_SOUND.again))
    expect(getSoundPatternDuration(RATING_SOUND.independent)).toBeGreaterThan(getSoundPatternDuration(RATING_SOUND.hint))
    expect(getSoundPatternDuration(RATING_SOUND.multiple)).toBeGreaterThan(getSoundPatternDuration(RATING_SOUND.independent))
  })

  it('破境庆典明显长于普通答题反馈', () => {
    expect(getSoundPatternDuration('star-up')).toBeGreaterThan(getSoundPatternDuration('correct'))
    expect(getSoundPatternDuration('realm-up')).toBeGreaterThan(getSoundPatternDuration('star-up'))
  })

  it('关键反馈含低频或气流纹理，结算序列按阶段展开', () => {
    expect(SOUND_TEXTURES.correct?.length).toBeGreaterThan(0)
    expect(SOUND_TEXTURES['card-drop']?.length).toBeGreaterThan(0)
    expect(SOUND_TEXTURES['realm-up']?.length).toBeGreaterThan(0)
    expect(getSoundSequenceDuration([
      { effect: 'rating-independent' },
      { effect: 'card-drop', delayMs: 360 },
      { effect: 'coin', delayMs: 610 }
    ])).toBeGreaterThan(getSoundPatternDuration('rating-independent'))
  })

  it('按百分比保存音效与语音音量，并能在重新读取时恢复', () => {
    const { localStorage } = mockBrowserStorage()

    saveAudioPreferences({ soundVolume: 0.37, voiceVolume: 0.64, voiceRate: 1.1 })

    expect(getAudioPreferences()).toMatchObject({ soundVolume: 0.37, voiceVolume: 0.64, voiceRate: 1.1 })
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'doupo-math-audio-preferences-v2',
      expect.stringContaining('"soundVolume":0.37')
    )
  })

  it('旧设置中的越界和无效音量会被安全归一化', () => {
    const { values } = mockBrowserStorage()
    values.set('doupo-math-audio-preferences-v2', JSON.stringify({
      soundVolume: 2,
      voiceVolume: 'invalid',
      voiceRate: 0.2,
      soundEnabled: 'false'
    }))

    expect(getAudioPreferences()).toMatchObject({
      soundVolume: 1,
      voiceVolume: DEFAULT_AUDIO_PREFERENCES.voiceVolume,
      voiceRate: 0.8,
      soundEnabled: DEFAULT_AUDIO_PREFERENCES.soundEnabled
    })
  })
})
