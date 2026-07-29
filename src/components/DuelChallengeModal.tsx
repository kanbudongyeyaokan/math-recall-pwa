import { useState } from 'react'
import { Clock3, Crosshair, Shield, Sparkles, Swords, Target, Trophy, X } from 'lucide-react'
import { CALCULUS_LECTURES } from '../domain/curriculum'
import {
  DUEL_QUESTION_COUNT,
  DUEL_SCOPE_OPTIONS,
  DUEL_TIME_MS,
  getDuelPresentation,
  type DuelScore
} from '../domain/duel'
import { getCharacter, type StoryCharacter } from '../domain/story'
import type { DuelScope, PlayerProfile } from '../types'
import { formatChallengeTime } from '../domain/surpriseChallenge'
import { CharacterPortrait } from './CharacterPortrait'
import { CultivatorScene } from './CultivatorScene'
import { SpiritStoneIcon } from './GameCollectibleArt'

interface ChallengeModalProps {
  character: StoryCharacter
  profile: PlayerProfile
  openingLine?: string
  onClose: () => void
  onStart: (input: { opponentId: string; scope: DuelScope; lectureId?: string }) => void
}

export function DuelChallengeModal({ character, profile, openingLine, onClose, onStart }: ChallengeModalProps) {
  const [scope, setScope] = useState<DuelScope>(character.role === 'rival' ? 'weak' : 'all')
  const [lectureId, setLectureId] = useState('lecture-01')
  const presentation = getDuelPresentation(character.id)
  const record = profile.duelRecords[character.id]

  return (
    <div className="duel-backdrop" role="dialog" aria-modal="true" aria-labelledby="duel-challenge-title" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className={`duel-sheet role-${character.role}`}>
        <button type="button" className="duel-close icon-button" onClick={onClose} aria-label="关闭挑战面板"><X size={20} /></button>
        <div className="duel-character-stage">
          <CharacterPortrait character={character} pose="challenge" />
          <div><small>{presentation.ruleLabel}</small><strong>{character.name}</strong><span>{character.title}</span></div>
        </div>
        <div className="duel-intro">
          <p className="eyebrow"><Crosshair size={14} /> 主动约战</p>
          <h2 id="duel-challenge-title">五题定胜负</h2>
          <blockquote>{openingLine || presentation.invite}</blockquote>
        </div>

        <div className="duel-record-strip" aria-label={`与${character.name}的历史战绩`}>
          <span><small>历史</small><strong>{record ? `${record.wins}胜 ${record.losses}负` : '首次交锋'}</strong></span>
          <span><small>最佳压制</small><strong>{record?.bestScore || 0}</strong></span>
          <span><small>胜利奖励</small><strong><SpiritStoneIcon size="sm" /> {presentation.winCoins}</strong></span>
        </div>

        <fieldset className="duel-scope-fieldset">
          <legend>选择战场</legend>
          <div className="duel-scope-grid">
            {DUEL_SCOPE_OPTIONS.map((option) => (
              <button type="button" className={scope === option.id ? 'active' : ''} aria-pressed={scope === option.id} onClick={() => setScope(option.id)} key={option.id}>
                <strong>{option.label}</strong><small>{option.description}</small>
              </button>
            ))}
          </div>
        </fieldset>

        {scope === 'lecture' && (
          <label className="duel-lecture-select">
            <span>指定讲次</span>
            <select value={lectureId} onChange={(event) => setLectureId(event.target.value)}>
              {CALCULUS_LECTURES.map((lecture) => <option value={lecture.id} key={lecture.id}>第 {lecture.number} 讲 · {lecture.shortTitle}</option>)}
            </select>
          </label>
        )}

        <div className="duel-rule-grid">
          <span><Target size={17} /><strong>{DUEL_QUESTION_COUNT} 题</strong><small>随机且不重复</small></span>
          <span><Clock3 size={17} /><strong>{formatChallengeTime(DUEL_TIME_MS)}</strong><small>刷新继续计时</small></span>
          <span><Shield size={17} /><strong>{presentation.requiredStrongWins} 次</strong><small>独立或多解命中</small></span>
        </div>

        <button type="button" className="button button-primary button-full duel-start" onClick={() => onStart({ opponentId: character.id, scope, lectureId: scope === 'lecture' ? lectureId : undefined })}>
          <Swords size={19} />向 {character.name} 发起挑战
        </button>
        <p className="duel-safety-note">失败不扣经验或灵石；每题仍写入真实做题记录与错题状态。</p>
      </section>
    </div>
  )
}

interface ResultModalProps {
  opponentId: string
  score: DuelScore
  profile: PlayerProfile
  coinBonus: number
  bondBonus: number
  onClose: () => void
}

export function DuelResultModal({ opponentId, score, profile, coinBonus, bondBonus, onClose }: ResultModalProps) {
  const character = getCharacter(opponentId)
  const presentation = getDuelPresentation(opponentId)
  return (
    <div className={`duel-backdrop duel-result-backdrop ${score.passed ? 'is-victory' : 'is-defeat'}`} role="dialog" aria-modal="true" aria-labelledby="duel-result-title">
      <section className="duel-sheet duel-result-sheet">
        <div className="duel-result-stage">
          {score.passed ? (
            <><CultivatorScene profile={profile} pose="victory" compact label="何耀焜赢下五题挑战" /><div className="duel-opponent-defeated"><CharacterPortrait character={character} pose="challenge" /></div></>
          ) : (
            <><div className="duel-opponent-victory"><CharacterPortrait character={character} pose="victory" /></div><CultivatorScene profile={profile} pose="focus" compact label="何耀焜记录五题挑战失利" /></>
          )}
        </div>
        <p className="eyebrow">{score.passed ? <Trophy size={15} /> : <Clock3 size={15} />} {score.passed ? '挑战胜利' : score.timedOut ? '时间归零' : '挑战失利'}</p>
        <h2 id="duel-result-title">{score.passed ? `何耀焜压过了${character.name}` : `${character.name}守住这一场`}</h2>
        <p>{score.passed ? presentation.playerVictory : presentation.opponentVictory}</p>
        <div className="duel-result-stats">
          <span><small>完成</small><strong>{score.completed}/{DUEL_QUESTION_COUNT}</strong></span>
          <span><small>压制</small><strong>{score.score}</strong></span>
          <span><small>强命中</small><strong>{score.strongWins}</strong></span>
          <span><small>灵石</small><strong>+{coinBonus}</strong></span>
        </div>
        <div className="duel-bond-gain"><Sparkles size={16} /><span>关系进展 +{bondBonus}</span></div>
        <button type="button" className="button button-primary button-full" onClick={onClose}>{score.passed ? '收下战绩' : '记下差距，返回争锋榜'}</button>
      </section>
    </div>
  )
}
