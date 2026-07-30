import { AudioLines, Crown, Layers3, ScrollText, Sparkles, Volume2, X, Zap } from 'lucide-react'
import type { PlayerProfile, RewardCard, UnlockEvent } from '../types'
import type { RealmProgress } from '../domain/gamification'
import { getTechniqueStageName, type TechniqueResolution } from '../domain/cultivation'
import { getCharacter } from '../domain/story'
import { CharacterPortrait } from './CharacterPortrait'
import type { CharacterVoiceCue } from '../utils/voice'
import { CultivatorScene } from './CultivatorScene'
import { SpiritStoneIcon } from './GameCollectibleArt'

interface RewardRevealProps {
  card: RewardCard
  xp: number
  intervalDays: number
  advanced: boolean
  realmBreakthrough: boolean
  nextRealm: RealmProgress
  coinsEarned: number
  encouragement: string
  profile: PlayerProfile
  technique: TechniqueResolution
  unlockEvents?: UnlockEvent[]
  voiceCue?: CharacterVoiceCue
  continueLabel?: string
  onReplayVoice?: () => void
  onClose: () => void
}

const rarityLabel = {
  common: '普通',
  rare: '稀有',
  epic: '史诗',
  legendary: '传奇'
}

const unlockKindLabel = { achievement: '新成就', character: '新人物', challenge: '新挑战', quest: '新任务' }

export function RewardReveal({ card, xp, intervalDays, advanced, realmBreakthrough, nextRealm, coinsEarned, encouragement, profile, technique, unlockEvents = [], voiceCue, continueLabel = '收下卡片，继续', onReplayVoice, onClose }: RewardRevealProps) {
  const voiceCharacter = voiceCue ? getCharacter(voiceCue.characterId) : undefined
  return (
    <div className={`reward-backdrop ${realmBreakthrough ? 'is-breakthrough' : advanced ? 'is-advanced' : ''}`} role="dialog" aria-modal="true" aria-label="做题奖励">
      <div className="reward-rays" aria-hidden="true" />
      <div className="reward-particles" aria-hidden="true">
        {Array.from({ length: 16 }, (_, index) => <i style={{ '--particle-index': index } as React.CSSProperties} key={index} />)}
      </div>
      <section className={`reward-modal rarity-${card.rarity}`}>
        <button type="button" className="icon-button reward-close" onClick={onClose} aria-label="关闭奖励">
          <X size={20} />
        </button>
        <p className="eyebrow reward-eyebrow">
          {realmBreakthrough ? <Crown size={15} /> : advanced ? <Zap size={15} /> : <Sparkles size={15} />}
          {realmBreakthrough ? '破境成功' : advanced ? '星阶突破' : '做题结算'}
        </p>
        {advanced && <div className={`breakthrough-banner ${realmBreakthrough ? 'realm-up' : ''}`}><strong>{nextRealm.label}</strong><span>{realmBreakthrough ? '新境界已开启' : '斗气凝聚完成'}</span></div>}
        <CultivatorScene profile={profile} pose={realmBreakthrough ? 'breakthrough' : 'victory'} compact label={`${profile.name}完成题目后欢呼`} />
        <div className="reward-card-art" aria-hidden="true">
          <Layers3 size={54} strokeWidth={1.7} />
        </div>
        <span className="rarity-pill">{rarityLabel[card.rarity]}</span>
        <h2>{card.name}</h2>
        <p>{card.description}</p>
        <p className="personal-encouragement">{encouragement}</p>
        {unlockEvents.length > 0 && (
          <div className="reward-unlocks" aria-label="本次解锁内容">
            {unlockEvents.map((event) => (
              <div className={`reward-unlock unlock-${event.kind}`} key={event.id}>
                <Sparkles size={17} />
                <span><small>{unlockKindLabel[event.kind]}</small><strong>{event.title}</strong><em>{event.description}</em></span>
              </div>
            ))}
          </div>
        )}
        {voiceCue && voiceCharacter && (
          <div className={`reward-voice voice-${voiceCue.tone}`}>
            <CharacterPortrait character={voiceCharacter} pose={voiceCue.tone === 'challenge' ? 'challenge' : 'victory'} />
            <div><small><AudioLines size={13} />{voiceCue.speaker} · {voiceCue.toneLabel}</small><p>“{voiceCue.text}”</p></div>
            <button type="button" onClick={onReplayVoice} aria-label={`重播${voiceCue.speaker}语音`} title="重播角色语音"><Volume2 size={18} /></button>
          </div>
        )}
        <div className={`technique-result ${technique.triggered ? 'triggered' : ''}`}>
          <ScrollText size={19} />
          <span><small>{technique.triggered ? '功法触发' : '本题未触发'}</small><strong>{technique.technique.name}</strong></span>
          <b>{technique.triggered ? `熟练度 +${technique.masteryGained}` : technique.technique.triggerLabel}</b>
        </div>
        {technique.triggered && (
          <div className="technique-bonuses">
            <span>额外经验 +{technique.xpBonus}</span>
            <span><SpiritStoneIcon size="sm" />额外灵石 +{technique.coinBonus}</span>
            {technique.nextLevel > technique.previousLevel && <strong>功法升至 {technique.nextLevel} 重 · {getTechniqueStageName(technique.nextLevel)}</strong>}
          </div>
        )}
        <div className="reward-stats">
          <span><strong>+{xp}</strong> 斗气经验</span>
          <span><strong><SpiritStoneIcon size="sm" />+{coinsEarned}</strong> 灵石</span>
          <span><strong>+{intervalDays}</strong> 天复做间隔</span>
        </div>
        <button type="button" className="button button-primary button-full" onClick={onClose}>{continueLabel}</button>
      </section>
    </div>
  )
}
