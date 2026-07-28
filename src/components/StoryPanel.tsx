import { useEffect, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { ChevronRight, Coins, HeartHandshake, LockKeyhole, MapPin, MessageCircle, Swords, UsersRound } from 'lucide-react'
import { chooseStoryEncounter, db } from '../db'
import { getBondStatus, getPendingEncounter } from '../domain/encounters'
import {
  getCharacter,
  getRomanceRouteStatus,
  getStoryProgress,
  ROMANCE_ROUTES,
  STORY_CHARACTERS,
  type RomanceRouteId,
  type StoryRole
} from '../domain/story'
import type { PlayerProfile } from '../types'

const roleLabel: Record<StoryRole, string> = {
  family: '家人',
  mentor: '引路人',
  rival: '对手',
  friend: '益友',
  classmate: '同学',
  romance: '情缘',
  stranger: '途中相遇',
  protagonist: '何耀焜'
}

const routeSettingKey = 'active-romance-route'

export function StoryPanel({ profile }: { profile: PlayerProfile }) {
  const progress = getStoryProgress(profile)
  const routeSetting = useLiveQuery(() => db.settings.get(routeSettingKey))
  const [lineIndex, setLineIndex] = useState(0)
  const [showRoster, setShowRoster] = useState(false)
  const [encounterReply, setEncounterReply] = useState<{ title: string; reply: string; bondTargetId: string; bondGain: number; coinReward: number }>()
  const currentCharacter = getCharacter(progress.current.portraitId)
  const activeRouteId = routeSetting?.value as RomanceRouteId | undefined
  const activeRoute = ROMANCE_ROUTES.find((route) => route.id === activeRouteId)
  const pendingEncounter = getPendingEncounter(profile)

  useEffect(() => setLineIndex(0), [progress.current.id])

  async function chooseRoute(routeId: RomanceRouteId) {
    await db.settings.put({ key: routeSettingKey, value: routeId, updatedAt: Date.now() })
  }

  async function chooseEncounter(choiceId: string) {
    if (!pendingEncounter) return
    const selected = pendingEncounter.choices.find((choice) => choice.id === choiceId)
    if (!selected) return
    await chooseStoryEncounter(pendingEncounter.id, selected.id)
    setEncounterReply({ title: pendingEncounter.title, reply: selected.reply, bondTargetId: selected.bondTargetId, bondGain: selected.bondGain, coinReward: selected.coinReward })
  }

  const hasNextLine = lineIndex < progress.current.dialogue.length - 1
  return (
    <section className={`story-panel story-${progress.current.role}`} aria-labelledby="story-title">
      <div className="story-heading">
        <div>
          <span className="story-act"><Swords size={14} />{progress.current.act} · {roleLabel[progress.current.role]}</span>
          <h2 id="story-title">{progress.current.title}</h2>
          <p><MapPin size={14} />{progress.current.location}</p>
        </div>
        <div className="story-speaker">
          <div className="story-portrait" role="img" aria-label={`${progress.current.speaker}人物原画`}>
            <img src={currentCharacter.portrait} alt="" />
          </div>
          <strong>{progress.current.speaker}</strong>
          <small>{roleLabel[progress.current.role]}</small>
        </div>
      </div>
      <blockquote className="story-dialogue">
        <MessageCircle size={19} />
        <p>{progress.current.dialogue[lineIndex]}</p>
      </blockquote>
      <div className="story-actions">
        <span>{progress.current.objective}</span>
        {hasNextLine && (
          <button type="button" onClick={() => setLineIndex((index) => index + 1)} aria-label="继续对话" title="继续对话">
            <ChevronRight size={19} />
          </button>
        )}
      </div>
      <div className="story-progress" aria-label="剧情解锁进度" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress.percent}>
        <span style={{ width: `${progress.percent}%` }} />
      </div>
      {progress.next && <small className="story-next">再完成 {progress.remaining} 道题，解锁「{progress.next.title}」</small>}

      {encounterReply ? (
        <div className="encounter-result">
          <MessageCircle size={18} /><div><strong>{encounterReply.title}</strong><p>{encounterReply.reply}</p><small><HeartHandshake size={14} /> 羁绊 +{encounterReply.bondGain} <Coins size={14} /> 灵石 +{encounterReply.coinReward}</small></div>
          <button type="button" onClick={() => setEncounterReply(undefined)} aria-label="收下剧情奖励"><ChevronRight size={18} /></button>
        </div>
      ) : pendingEncounter && (
        <div className="story-encounter">
          <span>命运抉择</span><strong>{pendingEncounter.title}</strong><p>{pendingEncounter.prompt}</p>
          <div>{pendingEncounter.choices.map((choice) => <button type="button" onClick={() => chooseEncounter(choice.id)} key={choice.id}>{choice.label}</button>)}</div>
        </div>
      )}

      <div className="story-secondary-actions">
        <button type="button" onClick={() => setShowRoster((value) => !value)} aria-expanded={showRoster}>
          <UsersRound size={16} />人物志 · {STORY_CHARACTERS.filter((character) => profile.totalReviews >= character.unlockAt).length}/{STORY_CHARACTERS.length}
        </button>
        <span><HeartHandshake size={15} />{activeRoute ? activeRoute.routeName : '情缘未定'}</span>
      </div>

      {showRoster && (
        <div className="story-roster" aria-label="已相遇人物">
          {STORY_CHARACTERS.map((character) => {
            const unlocked = profile.totalReviews >= character.unlockAt
            return (
              <div className={unlocked ? 'roster-person' : 'roster-person locked'} key={character.id}>
                <div className="roster-portrait">
                  <img src={character.portrait} alt="" />
                  {!unlocked && <LockKeyhole size={16} />}
                </div>
                <strong>{unlocked ? character.name : `${character.unlockAt} 题解锁`}</strong>
                <small>{unlocked ? character.title : '尚未相遇'}</small>
                {unlocked && <p>{character.summary}</p>}
                {unlocked && (profile.characterBonds[character.id] || 0) > 0 && <em>{getBondStatus(profile.characterBonds[character.id])} · {profile.characterBonds[character.id]} 羁绊</em>}
              </div>
            )
          })}
        </div>
      )}

      {profile.totalReviews >= ROMANCE_ROUTES[0].unlockAt && (
        <div className="romance-routes" aria-label="情缘路线">
          <div className="romance-route-heading"><HeartHandshake size={17} /><strong>情缘路线</strong><small>一次选择一条同行路线</small></div>
          <div className="romance-route-list">
            {ROMANCE_ROUTES.map((route) => {
              const character = getCharacter(route.portraitId)
              const unlocked = profile.totalReviews >= route.unlockAt
              const status = getRomanceRouteStatus(route, profile.totalReviews)
              const active = activeRouteId === route.id
              return (
                <button type="button" className={active ? 'romance-route active' : 'romance-route'} disabled={!unlocked} onClick={() => chooseRoute(route.id)} key={route.id}>
                  <img src={character.portrait} alt="" />
                  <span><strong>{unlocked ? route.name : `${route.unlockAt} 题`}</strong><small>{unlocked ? `${route.routeName} · ${status.label}` : '尚未相遇'}</small></span>
                  {active && <HeartHandshake size={16} />}
                </button>
              )
            })}
          </div>
          {activeRoute && <p className="romance-promise">{activeRoute.promise}</p>}
        </div>
      )}
    </section>
  )
}
