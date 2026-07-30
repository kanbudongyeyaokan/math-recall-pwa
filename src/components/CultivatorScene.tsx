import type { PlayerProfile } from '../types'

export type CultivatorPose = 'idle' | 'focus' | 'victory' | 'breakthrough' | 'story'

interface CultivatorSceneProps {
  profile: PlayerProfile
  pose?: CultivatorPose
  compact?: boolean
  label?: string
}

const formulae = ['∫', 'lim', 'Σ', '∇']

function getHeroArt(outfitId: string, pose: CultivatorPose, compact: boolean) {
  const characterBase = `${import.meta.env.BASE_URL}characters/`
  if (compact) {
    const compactPose = pose === 'victory' || pose === 'breakthrough' ? 'victory' : pose === 'focus' ? 'challenge' : 'idle'
    return `${characterBase}variants/he-yaokun-${compactPose}.webp`
  }
  if (outfitId === 'outfit-apprentice') return `${characterBase}hero-apprentice.webp`
  if (outfitId === 'outfit-jiaoda') return `${characterBase}hero-jiaoda.webp`
  return `${characterBase}hero-standard.webp`
}

function getCompanionArt(companionId: string) {
  if (companionId === 'companion-none') return undefined
  return `${import.meta.env.BASE_URL}shop-items/${companionId}.webp`
}

export function CultivatorScene({ profile, pose = 'idle', compact = false, label }: CultivatorSceneProps) {
  const companionArt = getCompanionArt(profile.activeCompanionId)
  const equipment = [
    profile.equippedOutfitId,
    profile.equippedAuraId,
    profile.equippedWeaponId,
    profile.equippedAccessoryId,
    profile.activeCompanionId
  ].filter(Boolean).join(' ')

  return (
    <div
      className={`cultivator-scene art-scene pose-${pose} ${compact ? 'compact' : ''} ${equipment}`}
      role="img"
      aria-label={label || `${profile.name}的原创数学修炼者动画形象`}
    >
      <div className="cultivator-backdrop" aria-hidden="true">
        <span className="scene-moon" />
        <span className="scene-grid" />
        <span className="aura-ring ring-one" />
        <span className="aura-ring ring-two" />
        {formulae.map((formula, index) => <span className={`orbit-formula formula-${index + 1}`} key={formula}>{formula}</span>)}
        {Array.from({ length: 10 }, (_, index) => <i className={`ember ember-${index + 1}`} key={index} />)}
      </div>

      <div className="cultivator-character" aria-hidden="true">
        <span className="hero-art-glow" />
        <img className="cultivator-character-art" src={getHeroArt(profile.equippedOutfitId, pose, compact)} alt="" />
      </div>

      {companionArt && <div className="companion-spirit" aria-hidden="true"><span /><img src={companionArt} alt="" /><i /></div>}
      <div className="victory-impact" aria-hidden="true"><span>{pose === 'breakthrough' ? '破境！' : '漂亮！'}</span></div>
      <div className="scene-floor" aria-hidden="true" />
    </div>
  )
}
