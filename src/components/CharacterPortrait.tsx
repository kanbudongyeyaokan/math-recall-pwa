import { useEffect, useState } from 'react'
import { getCharacterPortrait, type CharacterPose, type StoryCharacter } from '../domain/story'

interface CharacterPortraitProps {
  character: StoryCharacter
  pose?: CharacterPose
  alt?: string
  className?: string
}

export function CharacterPortrait({ character, pose = 'idle', alt = '', className = '' }: CharacterPortraitProps) {
  const source = getCharacterPortrait(character, pose)
  const [failed, setFailed] = useState(false)

  useEffect(() => setFailed(false), [source])

  if (failed) {
    const poseLabel = pose === 'speaking' ? '对白' : pose === 'victory' ? '鼓励' : pose === 'challenge' ? '对峙' : '待机'
    return (
      <span
        key={`${character.id}-${pose}-fallback`}
        className={`character-pose-image character-art-fallback role-${character.role} pose-${pose} ${className}`.trim()}
        role="img"
        aria-label={alt || `${character.name}原画待同步`}
      >
        <strong>{character.name.slice(-1)}</strong>
        <small>{poseLabel}镜头</small>
        <em>原画待同步</em>
      </span>
    )
  }

  return (
    <img
      key={`${character.id}-${pose}-${source}`}
      className={`character-pose-image pose-${pose} ${className}`.trim()}
      src={source}
      alt={alt}
      draggable={false}
      onError={() => setFailed(true)}
    />
  )
}
