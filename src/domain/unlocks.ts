import type { PlayerProfile, UnlockEvent } from '../types'
import { STORY_ENCOUNTERS } from './encounters'
import { TITLE_DEFINITIONS } from './gamification'
import { STORY_CHAPTERS, STORY_CHARACTERS } from './story'

function crossed(previous: number, next: number, threshold: number) {
  return previous < threshold && next >= threshold
}

export function getNewUnlockEvents(previous: PlayerProfile, next: PlayerProfile): UnlockEvent[] {
  const achievements = TITLE_DEFINITIONS
    .filter((title) => !title.unlocked(previous) && title.unlocked(next))
    .map((title) => ({
      id: `achievement:${title.name}`,
      kind: 'achievement' as const,
      title: title.name,
      description: title.requirement
    }))

  const characters = STORY_CHARACTERS
    .filter((character) => crossed(previous.totalReviews, next.totalReviews, character.unlockAt))
    .map((character) => ({
      id: `character:${character.id}`,
      kind: 'character' as const,
      title: character.name,
      description: `新人物 · ${character.title}`
    }))

  const challenges = STORY_ENCOUNTERS
    .filter((encounter) => crossed(previous.totalReviews, next.totalReviews, encounter.threshold))
    .map((encounter) => ({
      id: `challenge:${encounter.id}`,
      kind: 'challenge' as const,
      title: encounter.title,
      description: '新挑战已出现'
    }))

  const quests = STORY_CHAPTERS
    .filter((chapter) => crossed(previous.totalReviews, next.totalReviews, chapter.threshold))
    .map((chapter) => ({
      id: `quest:${chapter.id}`,
      kind: 'quest' as const,
      title: chapter.title,
      description: `${chapter.act} · ${chapter.location}`
    }))

  return [...achievements, ...characters, ...challenges, ...quests]
}
