import type { PlayerProfile } from '../types'
import { CultivatorScene } from './CultivatorScene'
import { DbImage } from './DbImage'

interface PlayerAvatarProps {
  profile: PlayerProfile
  compact?: boolean
}

export function PlayerAvatar({ profile, compact = false }: PlayerAvatarProps) {
  return (
    <div className={`player-avatar ${compact ? 'compact' : ''}`} aria-label={`${profile.name}的个人形象`}>
      {profile.avatarImageId ? (
        <DbImage imageId={profile.avatarImageId} alt={`${profile.name}的头像`} className="avatar-photo" />
      ) : (
        <CultivatorScene profile={profile} pose="idle" compact label={`${profile.name}的原创数学修炼者形象`} />
      )}
    </div>
  )
}
