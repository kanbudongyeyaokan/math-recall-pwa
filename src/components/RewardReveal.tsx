import { Coins, Crown, Layers3, Sparkles, X, Zap } from 'lucide-react'
import type { RewardCard } from '../types'
import type { RealmProgress } from '../domain/gamification'

interface RewardRevealProps {
  card: RewardCard
  xp: number
  intervalDays: number
  advanced: boolean
  realmBreakthrough: boolean
  nextRealm: RealmProgress
  coinsEarned: number
  encouragement: string
  onClose: () => void
}

const rarityLabel = {
  common: '普通',
  rare: '稀有',
  epic: '史诗',
  legendary: '传奇'
}

export function RewardReveal({ card, xp, intervalDays, advanced, realmBreakthrough, nextRealm, coinsEarned, encouragement, onClose }: RewardRevealProps) {
  return (
    <div className="reward-backdrop" role="dialog" aria-modal="true" aria-label="复习奖励">
      <div className="reward-rays" aria-hidden="true" />
      <section className={`reward-modal rarity-${card.rarity}`}>
        <button type="button" className="icon-button reward-close" onClick={onClose} aria-label="关闭奖励">
          <X size={20} />
        </button>
        <p className="eyebrow reward-eyebrow">
          {realmBreakthrough ? <Crown size={15} /> : advanced ? <Zap size={15} /> : <Sparkles size={15} />}
          {realmBreakthrough ? '破境成功' : advanced ? '星阶突破' : '回忆结算'}
        </p>
        {advanced && <div className={`breakthrough-banner ${realmBreakthrough ? 'realm-up' : ''}`}><strong>{nextRealm.label}</strong><span>{realmBreakthrough ? '新境界已开启' : '斗气凝聚完成'}</span></div>}
        <div className="reward-card-art" aria-hidden="true">
          <Layers3 size={54} strokeWidth={1.7} />
        </div>
        <span className="rarity-pill">{rarityLabel[card.rarity]}</span>
        <h2>{card.name}</h2>
        <p>{card.description}</p>
        <p className="personal-encouragement">{encouragement}</p>
        <div className="reward-stats">
          <span><strong>+{xp}</strong> 斗气经验</span>
          <span><strong><Coins size={15} />+{coinsEarned}</strong> 灵石</span>
          <span><strong>{intervalDays}</strong> 天后再见</span>
        </div>
        <button type="button" className="button button-primary button-full" onClick={onClose}>收下卡片，继续</button>
      </section>
    </div>
  )
}
