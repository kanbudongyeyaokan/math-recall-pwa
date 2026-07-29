import { getCharacterPortrait, type CharacterPose, type StoryCharacter } from '../domain/story'

interface CharacterPortraitProps {
  character: StoryCharacter
  pose?: CharacterPose
  alt?: string
  className?: string
}

export function CharacterPortrait({ character, pose = 'idle', alt = '', className = '' }: CharacterPortraitProps) {
  const source = getCharacterPortrait(character, pose)

  return (
    <img
      key={`${character.id}-${pose}-${source}`}
      className={`character-pose-image pose-${pose} ${className}`.trim()}
      src={source}
      alt={alt}
      draggable={false}
    />
  )
}
