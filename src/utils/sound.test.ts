import { describe, expect, it } from 'vitest'
import { getSoundPatternDuration, RATING_SOUND, SOUND_PATTERNS } from './sound'

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
})
