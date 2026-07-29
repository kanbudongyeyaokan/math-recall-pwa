import { Clock3, Shield, Swords, TimerOff, Trophy } from 'lucide-react'
import { getCharacter } from '../domain/story'
import {
  formatChallengeTime,
  getSurpriseRival,
  SURPRISE_CHALLENGE_QUESTION_COUNT,
  SURPRISE_CHALLENGE_TIME_MS,
  type SurpriseChallengeOffer,
  type SurpriseChallengeScore
} from '../domain/surpriseChallenge'
import type { PlayerProfile } from '../types'
import { CharacterPortrait } from './CharacterPortrait'
import { CultivatorScene } from './CultivatorScene'

interface OfferProps {
  offer: SurpriseChallengeOffer
  processing?: boolean
  onAccept: () => void
  onDecline: () => void
}

export function SurpriseChallengeOfferModal({ offer, processing = false, onAccept, onDecline }: OfferProps) {
  const rival = getSurpriseRival(offer.rivalId)
  const character = getCharacter(rival.id)

  return (
    <div className="ambush-backdrop" role="dialog" aria-modal="true" aria-labelledby="ambush-offer-title">
      <section className="ambush-modal ambush-offer">
        <div className="ambush-warning"><Swords size={18} /><span>突发邀战</span><b>{formatChallengeTime(SURPRISE_CHALLENGE_TIME_MS)}</b></div>
        <div className="ambush-opponent-stage">
          <CharacterPortrait character={character} pose="challenge" />
          <span>{rival.title}</span>
        </div>
        <div className="ambush-copy">
          <small>{rival.name}突然拦路</small>
          <h2 id="ambush-offer-title">八分钟，正面接战</h2>
          <blockquote>{rival.invite}</blockquote>
        </div>
        <div className="ambush-rules" aria-label="邀战规则">
          <span><strong>{SURPRISE_CHALLENGE_QUESTION_COUNT}</strong>道随机选择题</span>
          <span><strong>4</strong>次独立命中</span>
          <span><strong>66</strong>胜利灵石</span>
        </div>
        <div className="ambush-actions">
          <button type="button" className="button button-primary" onClick={onAccept} disabled={processing}><Swords size={18} />接战</button>
          <button type="button" className="button button-secondary" onClick={onDecline} disabled={processing}><Shield size={17} />暂不接战</button>
        </div>
        <p>拒绝没有损失；接受后即刻开始计时，刷新或退出不会重置。</p>
      </section>
    </div>
  )
}

interface ResultProps {
  offer: SurpriseChallengeOffer
  score: SurpriseChallengeScore
  profile: PlayerProfile
  coinBonus: number
  onClose: () => void
}

export function SurpriseChallengeResultModal({ offer, score, profile, coinBonus, onClose }: ResultProps) {
  const rival = getSurpriseRival(offer.rivalId)
  const character = getCharacter(rival.id)

  return (
    <div className={`ambush-backdrop ambush-result-backdrop ${score.passed ? 'is-victory' : 'is-defeat'}`} role="dialog" aria-modal="true" aria-labelledby="ambush-result-title">
      <section className="ambush-modal ambush-result-modal">
        <div className="ambush-result-stage">
          {score.passed ? (
            <>
              <CultivatorScene profile={profile} pose="victory" compact label="何耀焜赢下突发邀战后欢呼" />
              <div className="ambush-defeated-rival"><CharacterPortrait character={character} pose="challenge" /></div>
            </>
          ) : (
            <>
              <div className="ambush-rival-victory"><CharacterPortrait character={character} pose="victory" /></div>
              <CultivatorScene profile={profile} pose="focus" compact label="何耀焜记录突发邀战失利并准备再战" />
            </>
          )}
        </div>
        <div className="ambush-result-mark">{score.passed ? <Trophy size={21} /> : <TimerOff size={21} />}<span>{score.passed ? '反杀成功' : score.timedOut ? '时间归零' : '挑战失利'}</span></div>
        <h2 id="ambush-result-title">{score.passed ? `${rival.name}被你当场打到闭嘴` : `${rival.name}拿下了这一场`}</h2>
        <p>{score.passed ? rival.victory : rival.defeat}</p>
        <div className="ambush-result-stats">
          <span><small>完成</small><strong>{score.completed}/{SURPRISE_CHALLENGE_QUESTION_COUNT}</strong></span>
          <span><small>战绩</small><strong>{score.score}</strong></span>
          <span><small>独立命中</small><strong>{score.strongWins}</strong></span>
          <span><small>灵石</small><strong>+{coinBonus}</strong></span>
        </div>
        <button type="button" className="button button-primary button-full" onClick={onClose}>{score.passed ? '收下战利品' : '记住嘲讽，下次打回来'}</button>
        {!score.passed && <small className="ambush-retry-note"><Clock3 size={14} />失败不扣经验与灵石，错题记录已经保留。</small>}
      </section>
    </div>
  )
}
