import { useEffect, useState } from 'react'
import { ChevronRight, MapPin, MessageCircle, Swords } from 'lucide-react'
import { getStoryProgress } from '../domain/story'
import type { PlayerProfile } from '../types'

const roleLabel = {
  memory: '牵挂',
  mentor: '引路人',
  rival: '宿敌',
  ally: '益友',
  encounter: '途中相遇',
  gatekeeper: '守门人'
}

export function StoryPanel({ profile }: { profile: PlayerProfile }) {
  const progress = getStoryProgress(profile)
  const [lineIndex, setLineIndex] = useState(0)

  useEffect(() => setLineIndex(0), [progress.current.id])

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
          <div className="story-portrait" role="img" aria-label={`${progress.current.speaker}人物形象`}>
            <span className="story-portrait-hair" />
            <span className="story-portrait-face"><i /><i /></span>
            <span className="story-portrait-body" />
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
          <button type="button" onClick={() => setLineIndex((index) => index + 1)} aria-label="继续对话">
            <ChevronRight size={19} />
          </button>
        )}
      </div>
      <div className="story-progress" aria-label="剧情解锁进度" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress.percent}>
        <span style={{ width: `${progress.percent}%` }} />
      </div>
      {progress.next && <small className="story-next">再完成 {progress.remaining} 道题，解锁「{progress.next.title}」</small>}
    </section>
  )
}
