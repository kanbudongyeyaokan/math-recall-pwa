import { useEffect, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import {
  AudioLines,
  BookOpen,
  ChevronRight,
  Coins,
  HeartHandshake,
  LockKeyhole,
  MapPin,
  MessageCircle,
  Quote,
  Square,
  Sparkles,
  Swords,
  Target,
  UsersRound,
  Volume2,
  X
} from 'lucide-react'
import { chooseStoryEncounter, db } from '../db'
import { getBondStatus, getPendingEncounter } from '../domain/encounters'
import {
  getCharacter,
  getRomanceRouteStatus,
  getStoryProgress,
  isCharacterUnlocked,
  isStoryThresholdUnlocked,
  ROMANCE_ROUTES,
  STORY_CHARACTERS,
  type RomanceRouteId,
  type CharacterPose,
  type StoryCharacter,
  type StoryRole
} from '../domain/story'
import { CharacterPortrait } from './CharacterPortrait'
import type { PlayerProfile } from '../types'
import { getAudioPreferences, playSound } from '../utils/sound'
import { getStoryVoiceCue, speakCharacterVoice, stopCharacterVoice } from '../utils/voice'

export const STORY_ROLE_LABELS: Record<StoryRole, string> = {
  family: '家人',
  mentor: '引路人',
  rival: '宿敌',
  friend: '益友',
  classmate: '同学',
  romance: '情缘',
  stranger: '途中相遇',
  protagonist: '何耀焜'
}

const routeSettingKey = 'active-romance-route'

function getDialogueCharacterId(text: string, fallbackId: string) {
  return STORY_CHARACTERS.find((character) => text.startsWith(character.name))?.id || fallbackId
}

interface ArchiveProps {
  character: StoryCharacter
  profile: PlayerProfile
  activeRouteId?: RomanceRouteId
  onClose: () => void
}

export function CharacterArchive({ character, profile, activeRouteId, onClose }: ArchiveProps) {
  const [speaking, setSpeaking] = useState(false)
  const [pose, setPose] = useState<CharacterPose>('idle')
  const bondPoints = profile.characterBonds[character.id] || 0
  const route = ROMANCE_ROUTES.find((candidate) => candidate.id === character.id)
  const routeStatus = route ? getRomanceRouteStatus(route, profile) : undefined
  const currentRelation = character.role === 'protagonist'
    ? '本命角色 · 由每一次做题持续塑造'
    : route && routeStatus
      ? `${routeStatus.label}${activeRouteId === route.id ? ` · 正在同行「${route.routeName}」` : ' · 尚未选择同行路线'}`
      : character.role === 'family'
        ? `至亲 · ${getBondStatus(bondPoints)}`
        : getBondStatus(bondPoints)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    return () => {
      stopCharacterVoice()
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose])

  function toggleQuoteVoice() {
    if (speaking) {
      stopCharacterVoice()
      setSpeaking(false)
      return
    }
    playSound('character-open')
    const started = speakCharacterVoice(getStoryVoiceCue(character.id, character.quote), {
      onStart: () => setSpeaking(true),
      onEnd: () => setSpeaking(false)
    })
    if (started) setSpeaking(true)
  }

  return (
    <div className="character-archive-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <article className={`character-archive archive-${character.role}`} role="dialog" aria-modal="true" aria-labelledby="character-archive-title">
        <button className="character-archive-close" type="button" onClick={onClose} aria-label="关闭人物档案" title="关闭人物档案">
          <X size={21} />
        </button>
        <div className="character-archive-visual">
          <CharacterPortrait character={character} pose={speaking ? 'speaking' : pose} alt={`${character.name}人物镜头`} />
          <div className="character-archive-vignette" />
          <div className="character-archive-identity">
            <span>{STORY_ROLE_LABELS[character.role]}档案</span>
            <h2 id="character-archive-title">{character.name}</h2>
            <p>{character.title}</p>
          </div>
        </div>

        <div className="character-archive-body">
          {character.portraits && (
            <div className="character-pose-selector" role="group" aria-label={`${character.name}角色镜头`}>
              {([
                ['idle', '待机'],
                ['speaking', '对白'],
                ['victory', '鼓励'],
                ['challenge', '对峙']
              ] as const).map(([nextPose, label]) => (
                <button type="button" className={pose === nextPose ? 'active' : ''} onClick={() => { setPose(nextPose); playSound('character-open') }} key={nextPose}>{label}</button>
              ))}
            </div>
          )}
          <div className="character-current-relation">
            <HeartHandshake size={18} />
            <div><small>当前关系</small><strong>{currentRelation}</strong></div>
            {character.role !== 'protagonist' && <b>{bondPoints} 羁绊</b>}
          </div>
          {character.role !== 'protagonist' && (
            <div className="character-bond-track" role="progressbar" aria-label={`${character.name}羁绊`} aria-valuemin={0} aria-valuemax={48} aria-valuenow={Math.min(48, bondPoints)}>
              <span style={{ width: `${Math.min(100, (bondPoints / 48) * 100)}%` }} />
            </div>
          )}

          <blockquote className="character-quote"><Quote size={19} /><p>{character.quote}</p><button type="button" onClick={toggleQuoteVoice} aria-label={speaking ? `停止${character.name}语音` : `播放${character.name}语音`} title={speaking ? '停止语音' : '播放角色语音'}>{speaking ? <Square size={16} /> : <Volume2 size={18} />}</button></blockquote>

          <section className="character-archive-section">
            <h3><BookOpen size={17} />人物背景</h3>
            <p>{character.backstory}</p>
          </section>
          <section className="character-archive-section">
            <h3><Target size={17} />个人目标</h3>
            <p>{character.motivation}</p>
          </section>
          <section className="character-archive-section">
            <h3><Sparkles size={17} />初次相遇</h3>
            <p>{character.firstMeeting}</p>
          </section>
          <section className="character-archive-section relation-note">
            <h3><HeartHandshake size={17} />与你的关系</h3>
            <p>{character.relationship}</p>
          </section>
        </div>
      </article>
    </div>
  )
}

export function StoryPanel({ profile }: { profile: PlayerProfile }) {
  const progress = getStoryProgress(profile)
  const routeSetting = useLiveQuery(() => db.settings.get(routeSettingKey))
  const [lineIndex, setLineIndex] = useState(0)
  const [showRoster, setShowRoster] = useState(false)
  const [selectedCharacter, setSelectedCharacter] = useState<StoryCharacter>()
  const [speaking, setSpeaking] = useState(false)
  const [encounterReply, setEncounterReply] = useState<{ title: string; reply: string; bondTargetId: string; bondGain: number; coinReward: number }>()
  const currentCharacter = getCharacter(progress.current.portraitId)
  const dialogueCharacter = getCharacter(getDialogueCharacterId(progress.current.dialogue[lineIndex], currentCharacter.id))
  const dialoguePose: CharacterPose = speaking ? 'speaking' : dialogueCharacter.role === 'rival' ? 'challenge' : 'idle'
  const activeRouteId = routeSetting?.value as RomanceRouteId | undefined
  const activeRoute = ROMANCE_ROUTES.find((route) => route.id === activeRouteId)
  const pendingEncounter = getPendingEncounter(profile)

  useEffect(() => {
    stopCharacterVoice()
    setSpeaking(false)
    setLineIndex(0)
  }, [progress.current.id])

  useEffect(() => () => stopCharacterVoice(), [])

  function openCharacter(character: StoryCharacter) {
    playSound('character-open')
    stopCharacterVoice()
    setSpeaking(false)
    setSelectedCharacter(character)
  }

  function speakDialogue(index: number, delayMs = 0) {
    const line = progress.current.dialogue[index]
    const characterId = getDialogueCharacterId(line, currentCharacter.id)
    const started = speakCharacterVoice(getStoryVoiceCue(characterId, line), {
      delayMs,
      onStart: () => setSpeaking(true),
      onEnd: () => setSpeaking(false)
    })
    if (started) setSpeaking(true)
  }

  function toggleDialogueVoice() {
    if (speaking) {
      stopCharacterVoice()
      setSpeaking(false)
      return
    }
    playSound('character-open')
    speakDialogue(lineIndex, 130)
  }

  function continueDialogue() {
    const nextIndex = lineIndex + 1
    stopCharacterVoice()
    setSpeaking(false)
    playSound('story-next')
    setLineIndex(nextIndex)
    if (getAudioPreferences().autoVoice) speakDialogue(nextIndex, 180)
  }

  async function chooseRoute(routeId: RomanceRouteId) {
    await db.settings.put({ key: routeSettingKey, value: routeId, updatedAt: Date.now() })
  }

  async function chooseEncounter(choiceId: string) {
    if (!pendingEncounter) return
    const selected = pendingEncounter.choices.find((choice) => choice.id === choiceId)
    if (!selected) return
    playSound('story-choice')
    await chooseStoryEncounter(pendingEncounter.id, selected.id)
    setEncounterReply({ title: pendingEncounter.title, reply: selected.reply, bondTargetId: selected.bondTargetId, bondGain: selected.bondGain, coinReward: selected.coinReward })
    if (getAudioPreferences().autoVoice) speakCharacterVoice(getStoryVoiceCue(pendingEncounter.characterId, selected.reply), { delayMs: 380 })
  }

  const hasNextLine = lineIndex < progress.current.dialogue.length - 1
  return (
    <section className={`story-panel story-${progress.current.role}`} aria-labelledby="story-title">
      <div className="story-heading">
        <div>
          <span className="story-act"><Swords size={14} />{progress.current.act} · {STORY_ROLE_LABELS[progress.current.role]}</span>
          <h2 id="story-title">{progress.current.title}</h2>
          <p><MapPin size={14} />{progress.current.location}</p>
        </div>
        <button className="story-speaker" type="button" onClick={() => openCharacter(dialogueCharacter)} aria-label={`查看${dialogueCharacter.name}人物档案`}>
          <span className={`story-portrait speaking-portrait ${speaking ? 'is-speaking' : ''}`}>
            <CharacterPortrait character={dialogueCharacter} pose={dialoguePose} />
            <i aria-hidden="true" />
          </span>
          <strong>{dialogueCharacter.name}</strong>
          <small>{STORY_ROLE_LABELS[dialogueCharacter.role]} · 点开档案</small>
        </button>
      </div>
      <blockquote className="story-dialogue" key={`${progress.current.id}-${lineIndex}`}>
        <MessageCircle size={19} />
        <p>{progress.current.dialogue[lineIndex]}</p>
      </blockquote>
      <div className="story-actions">
        <span>{progress.current.objective}</span>
        <div className="story-action-buttons">
          <button type="button" onClick={toggleDialogueVoice} aria-label={speaking ? '停止当前角色语音' : '播放当前角色语音'} title={speaking ? '停止语音' : '播放当前对白'}>
            {speaking ? <Square size={16} /> : <AudioLines size={19} />}
          </button>
          {hasNextLine && (
            <button type="button" onClick={continueDialogue} aria-label="继续对话" title="继续对话">
              <ChevronRight size={19} />
            </button>
          )}
        </div>
      </div>
      <div className="story-progress" aria-label="剧情解锁进度" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress.percent}>
        <span style={{ width: `${progress.percent}%` }} />
      </div>
      {progress.next && <small className="story-next">再获得 {progress.remaining} 掌握力，解锁「{progress.next.title}」</small>}

      {encounterReply ? (
        <div className="encounter-result bond-awarded">
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
          <UsersRound size={16} />人物志 · {STORY_CHARACTERS.filter((character) => isCharacterUnlocked(profile, character)).length}/{STORY_CHARACTERS.length}
        </button>
        <span><HeartHandshake size={15} />{activeRoute ? activeRoute.routeName : '情缘未定'}</span>
      </div>

      {showRoster && (
        <div className="story-roster" aria-label="已相遇人物">
          {[...STORY_CHARACTERS].sort((left, right) => left.unlockAt - right.unlockAt).map((character) => {
            const unlocked = isCharacterUnlocked(profile, character)
            const bonds = profile.characterBonds[character.id] || 0
            return (
              <button
                type="button"
                className={unlocked ? 'roster-person' : 'roster-person locked'}
                disabled={!unlocked}
                onClick={() => openCharacter(character)}
                aria-label={unlocked ? `查看${character.name}人物档案` : `掌握力达到${character.unlockAt}后解锁人物`}
                key={character.id}
              >
                <span className="roster-portrait">
                  <CharacterPortrait character={character} pose={character.role === 'rival' ? 'challenge' : 'idle'} />
                  {!unlocked && <LockKeyhole size={16} />}
                  {unlocked && <i aria-hidden="true" />}
                </span>
                <strong>{unlocked ? character.name : `掌握力 ${character.unlockAt}`}</strong>
                <small>{unlocked ? character.title : '尚未相遇'}</small>
                {unlocked && <p>{character.summary}</p>}
                {unlocked && bonds > 0 && <em>{getBondStatus(bonds)} · {bonds} 羁绊</em>}
              </button>
            )
          })}
        </div>
      )}

      {isStoryThresholdUnlocked(profile, ROMANCE_ROUTES[0].unlockAt) && (
        <div className="romance-routes" aria-label="情缘路线">
          <div className="romance-route-heading"><HeartHandshake size={17} /><strong>情缘路线</strong><small>选择同行路线，点击查看档案</small></div>
          <div className="romance-route-list">
            {ROMANCE_ROUTES.map((route) => {
              const character = getCharacter(route.portraitId)
              const unlocked = isStoryThresholdUnlocked(profile, route.unlockAt)
              const status = getRomanceRouteStatus(route, profile)
              const active = activeRouteId === route.id
              return (
                <button
                  type="button"
                  className={active ? 'romance-route active' : 'romance-route'}
                  disabled={!unlocked}
                  onClick={() => {
                    playSound('story-choice')
                    void chooseRoute(route.id)
                    openCharacter(character)
                  }}
                  key={route.id}
                >
                  <CharacterPortrait character={character} pose="idle" />
                  <span><strong>{unlocked ? route.name : `掌握力 ${route.unlockAt}`}</strong><small>{unlocked ? `${route.routeName} · ${status.label}` : '尚未相遇'}</small></span>
                  {active && <HeartHandshake size={16} />}
                </button>
              )
            })}
          </div>
          {activeRoute && <p className="romance-promise">{activeRoute.promise}</p>}
        </div>
      )}

      {selectedCharacter && (
        <CharacterArchive character={selectedCharacter} profile={profile} activeRouteId={activeRouteId} onClose={() => { stopCharacterVoice(); setSelectedCharacter(undefined) }} />
      )}
    </section>
  )
}
