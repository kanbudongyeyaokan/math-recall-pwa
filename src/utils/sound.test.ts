import { describe, expect, it } from 'vitest'
import { getSoundPatternDuration, getSoundSequenceDuration, RATING_SOUND, SOUND_PATTERNS, SOUND_TEXTURES } from './sound'

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
})
