import type { CSSProperties } from 'react'
import { SHOP_ITEMS } from '../domain/gamification'
import type { PlayerProfile } from '../types'
import { DbImage } from './DbImage'

interface PlayerAvatarProps {
  profile: PlayerProfile
  compact?: boolean
}

export function PlayerAvatar({ profile, compact = false }: PlayerAvatarProps) {
  const outfit = SHOP_ITEMS.find((item) => item.id === profile.equippedOutfitId)
  const aura = profile.equippedAuraId.replace('aura-', '')
  const style = { '--avatar-outfit': outfit?.swatch || '#55765b' } as CSSProperties

  return (
    <div className={`player-avatar aura-${aura} ${compact ? 'compact' : ''}`} style={style} aria-label={`${profile.name}的个人形象`}>
      <div className="avatar-aura" aria-hidden="true" />
      {profile.avatarImageId ? (
        <DbImage imageId={profile.avatarImageId} alt={`${profile.name}的头像`} className="avatar-photo" />
      ) : (
        <div className="avatar-character" aria-hidden="true">
          <div className="avatar-head">耀</div>
          <div className="avatar-body"><span>HYK</span></div>
        </div>
      )}
    </div>
  )
}
