import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  DEFAULT_AUDIO_PREFERENCES,
  getAudioPreferences,
  getMusicOutputGain,
  getSoundPatternDuration,
  getSoundOutputGain,
  getSoundSequenceDuration,
  MUSIC_SCENES,
  MUSIC_TRACK_OPTIONS,
  MUSIC_TRACKS,
  RATING_SOUND,
  resolveMusicTrack,
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

  it('四类首次解锁都有独立且可辨认的提示音', () => {
    const effects = ['achievement-unlock', 'character-unlock', 'challenge-unlock', 'quest-unlock'] as const
    expect(new Set(effects.map((effect) => SOUND_PATTERNS[effect][0].frequency)).size).toBe(effects.length)
    expect(effects.every((effect) => getSoundPatternDuration(effect) >= 600)).toBe(true)
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

    saveAudioPreferences({ soundVolume: 0.37, musicEnabled: false, musicVolume: 0.24, voiceVolume: 0.64, voiceRate: 1.1, musicTrackId: 'silent-watch' })

    expect(getAudioPreferences()).toMatchObject({ soundVolume: 0.37, musicEnabled: false, musicVolume: 0.24, voiceVolume: 0.64, voiceRate: 1.1, musicTrackId: 'silent-watch' })
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'doupo-math-audio-preferences-v2',
      expect.stringContaining('"soundVolume":0.37')
    )
  })

  it('普通页面使用舒缓曲目，竞技场景自动切换紧张曲目', () => {
    expect(Object.keys(MUSIC_SCENES)).toEqual(['home', 'practice', 'focus', 'story', 'market', 'battle', 'resolve'])
    expect(MUSIC_SCENES.battle).toBe('silent-watch')
    expect(Object.entries(MUSIC_SCENES).filter(([scene]) => scene !== 'battle').every(([, track]) => track === 'quietly-hopeful')).toBe(true)
  })

  it('只提供两首真实音频并保留场景自动切换与固定播放', () => {
    expect(Object.keys(MUSIC_TRACKS)).toEqual(['quietly-hopeful', 'silent-watch'])
    expect(MUSIC_TRACK_OPTIONS).toHaveLength(2)
    expect(Object.values(MUSIC_TRACKS).every((track) => track.file.endsWith('.mp3'))).toBe(true)
    expect(resolveMusicTrack('battle', 'auto')).toBe('silent-watch')
    expect(resolveMusicTrack('battle', 'quietly-hopeful')).toBe('quietly-hopeful')
  })

  it('最大音量使用增益补偿并保持零音量近似静音', () => {
    expect(getSoundOutputGain(1)).toBeCloseTo(2.15)
    expect(getMusicOutputGain(1)).toBeCloseTo(1.75)
    expect(getSoundOutputGain(0)).toBeLessThan(0.001)
    expect(getMusicOutputGain(0)).toBeLessThan(0.001)
    expect(getSoundOutputGain(0.5)).toBeGreaterThan(1.2)
    expect(getMusicOutputGain(0.5)).toBeGreaterThan(1)
  })

  it('掌握、订正、Boss、羁绊与交大剧情均有专属反馈音', () => {
    const effects = [
      'mastery-up', 'correction', 'boss-hit', 'boss-victory', 'boss-defeat',
      'chapter-open', 'bond-up', 'rival-open', 'romance-open', 'campus-bell'
    ] as const
    expect(effects.every((effect) => SOUND_PATTERNS[effect].length >= 3)).toBe(true)
    expect(getSoundPatternDuration('boss-victory')).toBeGreaterThan(getSoundPatternDuration('boss-hit'))
    expect(getSoundPatternDuration('campus-bell')).toBeGreaterThan(1000)
  })

  it('旧设置中的越界和无效音量会被安全归一化', () => {
    const { values } = mockBrowserStorage()
    values.set('doupo-math-audio-preferences-v2', JSON.stringify({
      soundVolume: 2,
      voiceVolume: 'invalid',
      musicVolume: 2,
      musicTrackId: 'missing-track',
      voiceRate: 0.2,
      soundEnabled: 'false'
    }))

    expect(getAudioPreferences()).toMatchObject({
      soundVolume: 1,
      voiceVolume: DEFAULT_AUDIO_PREFERENCES.voiceVolume,
      musicVolume: 1,
      musicTrackId: 'auto',
      voiceRate: 0.8,
      soundEnabled: DEFAULT_AUDIO_PREFERENCES.soundEnabled
    })
  })
})
