import { useEffect, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import {
  ArrowLeft,
  Brain,
  Check,
  CheckCircle2,
  CircleX,
  Eye,
  Image as ImageIcon,
  Lightbulb,
  ListChecks,
  Route,
  ScrollText,
  ShieldAlert
} from 'lucide-react'
import { CultivatorScene } from '../components/CultivatorScene'
import { DbImage } from '../components/DbImage'
import { Lightbox } from '../components/Lightbox'
import { MathText } from '../components/MathText'
import { RewardReveal } from '../components/RewardReveal'
import { db, defaultProfile, recordReview } from '../db'
import {
  getLectureById,
  getProblemLectureIds,
  getProblemRole,
  matchesPracticeSelection,
  PRACTICE_ROLE_LABELS,
  type PracticeSelection
} from '../domain/curriculum'
import type { RealmProgress } from '../domain/gamification'
import { getTechnique, type TechniqueResolution } from '../domain/cultivation'
import { isChoiceAnswerCorrect } from '../domain/questions'
import type { PlayerProfile, ReviewRating, RewardCard } from '../types'

interface ReviewPageProps {
  requestedId?: string
  selection?: PracticeSelection
  onBack: () => void
  onComplete: () => void
}

const ratingOptions: { id: ReviewRating; label: string; caption: string; Icon: typeof Check }[] = [
  { id: 'again', label: '不会', caption: '标记薄弱，1 天后复做', Icon: CircleX },
  { id: 'hint', label: '提示后会', caption: '入口已找到', Icon: Lightbulb },
  { id: 'independent', label: '独立完成', caption: '完整闭合推导', Icon: Check },
  { id: 'multiple', label: '能够多解', caption: '掌握第二条路线', Icon: Route }
]

function problemOrder(a: { page: string; id: string }, b: { page: string; id: string }) {
  const pageA = Number(a.page.match(/\d+/)?.[0] || Number.MAX_SAFE_INTEGER)
  const pageB = Number(b.page.match(/\d+/)?.[0] || Number.MAX_SAFE_INTEGER)
  return pageA - pageB || a.id.localeCompare(b.id)
}

export function ReviewPage({ requestedId, selection, onBack, onComplete }: ReviewPageProps) {
  const queue = useLiveQuery(async () => {
    if (requestedId) {
      const requested = await db.problems.get(requestedId)
      return requested && !requested.archived ? [requested] : []
    }
    const all = await db.problems.filter((item) => !item.archived).toArray()
    return (selection ? all.filter((problem) => matchesPracticeSelection(problem, selection)) : all).sort(problemOrder)
  }, [requestedId, selection?.lectureId, selection?.sectionId, selection?.role])
  const profile = useLiveQuery(() => db.profiles.get('player'), [], defaultProfile) || defaultProfile
  const [queueIndex, setQueueIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [thinking, setThinking] = useState(false)
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([])
  const [choiceSubmitted, setChoiceSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [lightbox, setLightbox] = useState<{ id: string; alt: string }>()
  const [reward, setReward] = useState<{
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
  }>()

  const problem = queue?.[queueIndex]
  const isChoice = problem?.questionFormat === 'single-choice' || problem?.questionFormat === 'multiple-choice'
  const choiceCorrect = !!problem && choiceSubmitted && isChoiceAnswerCorrect(selectedOptionIds, problem.correctOptionIds)
  const lecture = selection
    ? getLectureById(selection.lectureId)
    : getLectureById(problem ? getProblemLectureIds(problem)[0] : undefined)
  const queueLabel = selection?.label || (lecture ? `第 ${lecture.number} 讲 · ${PRACTICE_ROLE_LABELS[getProblemRole(problem!)]}` : '自选题目')

  useEffect(() => setQueueIndex(0), [requestedId, selection?.lectureId, selection?.sectionId, selection?.role])

  useEffect(() => {
    setRevealed(false)
    setThinking(false)
    setSelectedOptionIds([])
    setChoiceSubmitted(false)
  }, [problem?.id])

  function toggleOption(id: string) {
    if (!problem || choiceSubmitted) return
    if (problem.questionFormat === 'single-choice') {
      setSelectedOptionIds([id])
      return
    }
    setSelectedOptionIds((current) => current.includes(id) ? current.filter((optionId) => optionId !== id) : [...current, id])
  }

  function submitChoice() {
    if (!selectedOptionIds.length) return
    setChoiceSubmitted(true)
    setThinking(true)
  }

  async function grade(rating: ReviewRating) {
    if (!problem || saving || !revealed) return
    setSaving(true)
    try {
      const result = await recordReview(problem.id, rating, isChoice ? {
        selectedOptionIds,
        isCorrect: choiceCorrect
      } : {})
      if ('vibrate' in navigator) navigator.vibrate?.(result.advance.realmBreakthrough ? [50, 35, 80, 35, 110] : [35, 30, 55])
      setReward({
        card: result.reward,
        xp: result.outcome.xp,
        intervalDays: result.outcome.intervalDays,
        advanced: result.advance.advanced,
        realmBreakthrough: result.advance.realmBreakthrough,
        nextRealm: result.advance.next,
        coinsEarned: result.coinsEarned,
        encouragement: result.encouragement,
        profile: result.profile,
        technique: result.technique
      })
    } finally {
      setSaving(false)
    }
  }

  function closeReward() {
    setReward(undefined)
    if (queue && queueIndex < queue.length - 1) {
      setQueueIndex((index) => index + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    onComplete()
  }

  if (queue === undefined) {
    return <main className="page centered-state"><div className="loader" /><p>正在打开题目…</p></main>
  }

  if (!problem) {
    return (
      <main className="page centered-state">
        <Brain size={46} />
        <h1>{selection ? '这个板块还没有题目' : '题库还是空的'}</h1>
        <p>{selection ? '返回讲次地图，换一个板块；也可以在题库中录入自己的经典题。' : '先拍下一道典型题，就能开始你的做题旅程。'}</p>
        <button type="button" className="button button-primary" onClick={onBack}>返回</button>
      </main>
    )
  }

  return (
    <main className="page review-page practice-session-page">
      <header className="review-header">
        <button type="button" className="icon-button" onClick={onBack} aria-label="退出本次做题"><ArrowLeft size={22} /></button>
        <div>
          <span>{queueLabel}</span>
          <small>{problem.kind === 'concept' ? '定义与判据' : problem.questionFormat === 'open' ? '主观题' : problem.questionFormat === 'single-choice' ? '单选题' : '多选题'}</small>
        </div>
        <span className="review-count">{queueIndex + 1}/{queue.length}</span>
      </header>

      <div className="session-progress" role="progressbar" aria-label="本次做题进度" aria-valuemin={0} aria-valuemax={queue.length} aria-valuenow={queueIndex + 1}>
        <span style={{ width: `${((queueIndex + 1) / queue.length) * 100}%` }} />
      </div>

      <div className="active-technique-strip"><ScrollText size={16} /><span>运转功法</span><strong>{getTechnique(profile.activeTechniqueId).name}</strong><small>{getTechnique(profile.activeTechniqueId).triggerLabel}</small></div>

      <article className="review-card">
        <div className="review-meta">
          <span>{problem.source || '个人题库'}{problem.page ? ` · P${problem.page}` : ''}</span>
          {isChoice && <span><ListChecks size={14} /> {problem.questionFormat === 'single-choice' ? '单选' : '多选'}</span>}
        </div>
        <h1>{problem.title}</h1>
        <div className="tag-list">
          {[...new Set(problem.tags)].map((tag) => <span className="tag" key={tag}>{tag}</span>)}
        </div>
        {problem.questionImageId && (
          <DbImage
            imageId={problem.questionImageId}
            alt={`${problem.title}题目图片`}
            className="review-image"
            onClick={() => setLightbox({ id: problem.questionImageId!, alt: `${problem.title}题目图片` })}
          />
        )}
        {problem.statement && <MathText className="problem-statement" text={problem.statement} />}

        {isChoice && (
          <div className="choice-list" role="group" aria-label={problem.questionFormat === 'single-choice' ? '单选题选项' : '多选题选项'}>
            {problem.options.map((option) => {
              const selected = selectedOptionIds.includes(option.id)
              const correct = revealed && problem.correctOptionIds.includes(option.id)
              const incorrect = revealed && selected && !problem.correctOptionIds.includes(option.id)
              return (
                <button
                  type="button"
                  key={option.id}
                  className={`choice-option ${selected ? 'selected' : ''} ${correct ? 'correct' : ''} ${incorrect ? 'incorrect' : ''}`}
                  onClick={() => toggleOption(option.id)}
                  disabled={choiceSubmitted}
                  aria-pressed={selected}
                >
                  <span>{option.id}</span><MathText className="choice-option-text" text={option.text} />
                  {correct && <CheckCircle2 size={18} />}
                  {incorrect && <CircleX size={18} />}
                </button>
              )
            })}
          </div>
        )}
      </article>

      {!revealed ? (
        <section className={`answer-gate ${thinking ? 'is-thinking' : ''} ${choiceCorrect ? 'is-correct' : ''}`}>
          {choiceSubmitted && choiceCorrect ? (
            <div className="choice-cheer">
              <CultivatorScene profile={profile} pose="victory" compact label="何耀焜答对题目后欢呼" />
              <div><strong>判断命中，漂亮！</strong><span>先回想你的依据，再展开多方法解析。</span></div>
            </div>
          ) : !isChoice && thinking ? (
            <CultivatorScene profile={profile} pose="focus" compact label="何耀焜凝聚公式专注思考" />
          ) : <div className="gate-icon"><Brain size={30} /></div>}
          {isChoice ? (
            !choiceSubmitted ? (
              <>
                <h2>{selectedOptionIds.length ? '确认你的判断' : '答案仍然锁定'}</h2>
                <p>{problem.questionFormat === 'multiple-choice' ? '可选择多个选项，确认后本题不可改选。' : '选择一个答案，锁定后再看解析。'}</p>
                <button type="button" className="button button-primary button-full" onClick={submitChoice} disabled={!selectedOptionIds.length}>
                  <Check size={19} /> 锁定答案
                </button>
              </>
            ) : (
              <>
                {!choiceCorrect && <div className="choice-result incorrect"><CircleX size={21} /><strong>这次没有命中</strong></div>}
                {!choiceCorrect && <p>先定位犹豫点。正确选项仍在解析中锁定，等你主动揭晓。</p>}
                <button type="button" className="button button-accent button-full" onClick={() => setRevealed(true)}>
                  <Eye size={19} /> 查看完整解析
                </button>
              </>
            )
          ) : (
            <>
              <h2>{thinking ? '在脑中走完关键步骤' : '答案已锁定'}</h2>
              <p>{thinking ? '想清入口、关键变形、适用条件和验算，再揭晓。' : '先独立思考，避免把“看懂”错当成“会做”。'}</p>
              {!thinking ? (
                <button type="button" className="button button-primary button-full" onClick={() => setThinking(true)}><Brain size={19} /> 开始思考</button>
              ) : (
                <button type="button" className="button button-accent button-full" onClick={() => setRevealed(true)}><Eye size={19} /> 我已经想过了，揭晓答案</button>
              )}
            </>
          )}
        </section>
      ) : (
        <section className="answer-panel">
          <div className="answer-heading"><Eye size={19} /><h2>解析与多解</h2></div>
          {problem.answerImageId && (
            <DbImage
              imageId={problem.answerImageId}
              alt={`${problem.title}答案图片`}
              className="review-image answer-image"
              onClick={() => setLightbox({ id: problem.answerImageId!, alt: `${problem.title}答案图片` })}
            />
          )}
          {problem.answerText && <MathText className="answer-text" text={problem.answerText} />}
          {!!problem.solutionMethods.length && (
            <div className="solution-methods">
              {problem.solutionMethods.map((method, index) => (
                <article className="solution-method" key={method.id}>
                  <div><span>{index + 1}</span><strong>{method.title}</strong></div>
                  <MathText text={method.content} />
                </article>
              ))}
            </div>
          )}
          {problem.coreMethod && (
            <div className="insight-block method-block"><div><Lightbulb size={18} /><strong>核心方法</strong></div><MathText text={problem.coreMethod} /></div>
          )}
          {problem.mistakes && (
            <div className="insight-block mistake-block"><div><ShieldAlert size={18} /><strong>易错点</strong></div><MathText text={problem.mistakes} /></div>
          )}

          <div className="rating-section">
            <p className="eyebrow">这次真正完成到哪一步？</p>
            <div className="rating-grid">
              {ratingOptions.map(({ id, label, caption, Icon }) => (
                <button type="button" key={id} className={`rating-button rating-${id}`} onClick={() => grade(id)} disabled={saving}>
                  <Icon size={19} /><span><strong>{label}</strong><small>{caption}</small></span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {!problem.questionImageId && !problem.statement && <div className="empty-inline"><ImageIcon size={18} />这张卡还没有题面，请稍后编辑补充。</div>}
      {lightbox && <Lightbox imageId={lightbox.id} alt={lightbox.alt} onClose={() => setLightbox(undefined)} />}
      {reward && (
        <RewardReveal
          {...reward}
          continueLabel={queueIndex < queue.length - 1 ? `继续下一题 · ${queueIndex + 2}/${queue.length}` : selection ? '完成本轮，返回讲次' : '完成本题'}
          onClose={closeReward}
        />
      )}
    </main>
  )
}
