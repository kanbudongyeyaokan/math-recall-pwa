import { BookOpenCheck, Sigma, Sparkles } from 'lucide-react'
import type { PlayerProfile } from '../types'

export type CultivatorPose = 'idle' | 'focus' | 'victory' | 'breakthrough' | 'story'

interface CultivatorSceneProps {
  profile: PlayerProfile
  pose?: CultivatorPose
  compact?: boolean
  label?: string
}

const formulae = ['∫', 'lim', 'Σ', '∇']

export function CultivatorScene({ profile, pose = 'idle', compact = false, label }: CultivatorSceneProps) {
  const equipment = [
    profile.equippedOutfitId,
    profile.equippedAuraId,
    profile.equippedWeaponId,
    profile.equippedAccessoryId,
    profile.activeCompanionId
  ].filter(Boolean).join(' ')

  return (
    <div
      className={`cultivator-scene pose-${pose} ${compact ? 'compact' : ''} ${equipment}`}
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
        <div className="cultivator-shadow" />
        <div className="cultivator-ponytail"><span /></div>
        <div className="cultivator-cape" />
        <div className="cultivator-legs"><span /><span /></div>
        <div className="cultivator-torso">
          <div className="cultivator-inner-robe" />
          <div className="cultivator-belt"><span /></div>
          <div className="cultivator-emblem"><Sigma size={15} /></div>
        </div>
        <div className="cultivator-shoulder shoulder-left" />
        <div className="cultivator-shoulder shoulder-right" />
        <div className="cultivator-arm arm-left"><span className="cultivator-hand" /></div>
        <div className="cultivator-arm arm-right"><span className="cultivator-hand" /></div>
        <div className="cultivator-neck" />
        <div className="cultivator-head">
          <div className="cultivator-ear ear-left" />
          <div className="cultivator-ear ear-right" />
          <div className="cultivator-hair hair-back" />
          <div className="cultivator-face">
            <span className="cultivator-brow brow-left" />
            <span className="cultivator-brow brow-right" />
            <span className="cultivator-eye eye-left" />
            <span className="cultivator-eye eye-right" />
            <span className="cultivator-nose" />
            <span className="cultivator-mouth" />
          </div>
          <div className="cultivator-hair hair-fringe"><span /><span /><span /></div>
          <div className="cultivator-crown" />
        </div>
        <div className="cultivator-weapon"><BookOpenCheck size={28} /></div>
        <div className="cultivator-accessory"><Sparkles size={17} /></div>
      </div>

      <div className="companion-spirit" aria-hidden="true"><span /><i /></div>
      <div className="victory-impact" aria-hidden="true"><span>漂亮！</span></div>
      <div className="scene-floor" aria-hidden="true" />
    </div>
  )
}
