import type { PlayerProfile } from '../types'
import { SHOP_ITEMS } from '../domain/gamification'
import { getTechnique } from '../domain/cultivation'

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
  const outfitArt: Record<string, string> = {
    'outfit-apprentice': 'hero-apprentice.webp',
    'outfit-flame': 'hero-flame.webp',
    'outfit-starseer': 'hero-starseer.webp',
    'outfit-master': 'hero-master.webp',
    'outfit-jiaoda': 'hero-jiaoda.webp'
  }
  if (outfitArt[outfitId]) return `${characterBase}${outfitArt[outfitId]}`
  if (compact) {
    const compactPose = pose === 'victory' || pose === 'breakthrough' ? 'victory' : pose === 'focus' ? 'challenge' : 'idle'
    return `${characterBase}variants/he-yaokun-${compactPose}.webp`
  }
  return `${characterBase}hero-standard.webp`
}

function getCompanionArt(companionId: string) {
  if (companionId === 'companion-none') return undefined
  return `${import.meta.env.BASE_URL}shop-items/${companionId}.webp`
}

function getEquipmentArt(itemId: string) {
  if (!itemId || itemId.endsWith('-none')) return undefined
  return `${import.meta.env.BASE_URL}shop-items/${itemId}.webp`
}

function getEquipmentName(itemId: string) {
  return SHOP_ITEMS.find((item) => item.id === itemId)?.name || '未装备'
}

export function CultivatorScene({ profile, pose = 'idle', compact = false, label }: CultivatorSceneProps) {
  const companionArt = getCompanionArt(profile.activeCompanionId)
  const auraArt = getEquipmentArt(profile.equippedAuraId)
  const weaponArt = getEquipmentArt(profile.equippedWeaponId)
  const accessoryArt = getEquipmentArt(profile.equippedAccessoryId)
  const technique = getTechnique(profile.activeTechniqueId)
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

      {auraArt && <img className="cultivator-aura-art" src={auraArt} alt="" aria-hidden="true" />}

      <div className="cultivator-character" aria-hidden="true">
        <span className="hero-art-glow" />
        <img className="cultivator-character-art" src={getHeroArt(profile.equippedOutfitId, pose, compact)} alt="" />
        {accessoryArt && <img className="cultivator-accessory-art" src={accessoryArt} alt="" />}
      </div>

      {weaponArt && <img className="cultivator-weapon-art" src={weaponArt} alt="" aria-hidden="true" />}
      <div className="cultivator-technique-sigil" aria-hidden="true">
        <span>{technique.name.slice(0, 1)}</span>
        <small>{technique.name}</small>
      </div>

      {companionArt && <div className="companion-spirit" aria-hidden="true"><span /><img src={companionArt} alt="" /><i /></div>}
      <div className="victory-impact" aria-hidden="true"><span>{pose === 'breakthrough' ? '破境！' : '漂亮！'}</span></div>
      <div className="scene-floor" aria-hidden="true" />
      {!compact && (
        <div className="cultivator-loadout" aria-label="当前可视装备">
          <span><small>战衣</small>{getEquipmentName(profile.equippedOutfitId)}</span>
          <span><small>武器</small>{getEquipmentName(profile.equippedWeaponId)}</span>
          <span><small>配饰</small>{getEquipmentName(profile.equippedAccessoryId)}</span>
          <span><small>功法</small>{technique.name}</span>
        </div>
      )}
    </div>
  )
}
