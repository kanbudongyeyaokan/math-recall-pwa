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
  RefreshCcw,
  Route,
  ShieldAlert
} from 'lucide-react'
import { db, recordReview } from '../db'
import type { ReviewRating, RewardCard } from '../types'
import type { RealmProgress } from '../domain/gamification'
import { isChoiceAnswerCorrect } from '../domain/questions'
import { DbImage } from '../components/DbImage'
import { Lightbox } from '../components/Lightbox'
import { MathText } from '../components/MathText'
import { RewardReveal } from '../components/RewardReveal'

interface ReviewPageProps {
  requestedId?: string
  onBack: () => void
  onNext: () => void
}

const ratingOptions: { id: ReviewRating; label: string; caption: string; Icon: typeof RefreshCcw }[] = [
  { id: 'again', label: '不会', caption: '1 天起步', Icon: RefreshCcw },
  { id: 'hint', label: '提示后会', caption: '稳住当前阶', Icon: Lightbulb },
  { id: 'independent', label: '独立完成', caption: '前进一阶', Icon: Check },
  { id: 'multiple', label: '能够多解', caption: '跃迁两阶', Icon: Route }
]

export function ReviewPage({ requestedId, onBack, onNext }: ReviewPageProps) {
  const problem = useLiveQuery(async () => {
    if (requestedId) return db.problems.get(requestedId)
    const due = await db.problems.where('nextReviewAt').belowOrEqual(Date.now()).filter((item) => !item.archived).first()
    if (due) return due
    const all = await db.problems.filter((item) => !item.archived).toArray()
    return all[Math.floor(Math.random() * all.length)]
  }, [requestedId])
  const dueCount = useLiveQuery(
    () => db.problems.where('nextReviewAt').belowOrEqual(Date.now()).filter((item) => !item.archived).count(),
    [],
    0
  )
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
  }>()

  const isChoice = problem?.questionFormat === 'single-choice' || problem?.questionFormat === 'multiple-choice'
  const choiceCorrect = !!problem && choiceSubmitted && isChoiceAnswerCorrect(selectedOptionIds, problem.correctOptionIds)

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
        encouragement: result.encouragement
      })
    } finally {
      setSaving(false)
    }
  }

  function closeReward() {
    setReward(undefined)
    onNext()
  }

  if (problem === undefined) {
    return <main className="page centered-state"><div className="loader" /><p>正在取出题卡…</p></main>
  }

  if (!problem) {
    return (
      <main className="page centered-state">
        <Brain size={46} />
        <h1>题库还是空的</h1>
        <p>先拍下一道典型题，下一次排队时就能刷它。</p>
        <button type="button" className="button button-primary" onClick={onBack}>返回首页</button>
      </main>
    )
  }

  return (
    <main className="page review-page">
      <header className="review-header">
        <button type="button" className="icon-button" onClick={onBack} aria-label="返回首页"><ArrowLeft size={22} /></button>
        <div>
          <span>{problem.kind === 'concept' ? '定义卡' : problem.questionFormat === 'open' ? '典型题' : problem.questionFormat === 'single-choice' ? '单选题' : '多选题'}</span>
          <small>{dueCount} 张待复习</small>
        </div>
        <span className="review-count">#{problem.reviewCount + 1}</span>
      </header>

      <article className="review-card">
        <div className="review-meta">
          <span>{problem.source || '个人题库'}{problem.page ? ` · P${problem.page}` : ''}</span>
          {isChoice && <span><ListChecks size={14} /> {problem.questionFormat === 'single-choice' ? '单选' : '多选'}</span>}
        </div>
        <h1>{problem.title}</h1>
        <div className="tag-list">
          {problem.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}
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
        <section className={`answer-gate ${thinking ? 'is-thinking' : ''}`}>
          <div className="gate-icon"><Brain size={30} /></div>
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
                <div className={`choice-result ${choiceCorrect ? 'correct' : 'incorrect'}`}>
                  {choiceCorrect ? <CheckCircle2 size={21} /> : <CircleX size={21} />}
                  <strong>{choiceCorrect ? '判断命中' : '这次未命中'}</strong>
                </div>
                <p>{choiceCorrect ? '先回忆你使用的判据，再展开完整路线。' : '先定位犹豫点，正确选项仍在解析中锁定。'}</p>
                <button type="button" className="button button-accent button-full" onClick={() => setRevealed(true)}>
                  <Eye size={19} /> 查看完整解析
                </button>
              </>
            )
          ) : (
            <>
              <h2>{thinking ? '在脑中走完关键步骤' : '答案已锁定'}</h2>
              <p>{thinking ? '想清入口、关键变形和验算，再揭晓。' : '先独立思考，避免把“看懂”错当成“会做”。'}</p>
              {!thinking ? (
                <button type="button" className="button button-primary button-full" onClick={() => setThinking(true)}>
                  <Brain size={19} /> 开始思考
                </button>
              ) : (
                <button type="button" className="button button-accent button-full" onClick={() => setRevealed(true)}>
                  <Eye size={19} /> 我已经想过了，揭晓答案
                </button>
              )}
            </>
          )}
        </section>
      ) : (
        <section className="answer-panel">
          <div className="answer-heading"><Eye size={19} /><h2>答案与复盘</h2></div>
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
            <div className="insight-block method-block">
              <div><Lightbulb size={18} /><strong>核心方法</strong></div>
              <MathText text={problem.coreMethod} />
            </div>
          )}
          {problem.mistakes && (
            <div className="insight-block mistake-block">
              <div><ShieldAlert size={18} /><strong>易错点</strong></div>
              <MathText text={problem.mistakes} />
            </div>
          )}

          <div className="rating-section">
            <p className="eyebrow">这次完成得怎样？</p>
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

      {!problem.questionImageId && !problem.statement && (
        <div className="empty-inline"><ImageIcon size={18} /> 这张卡还没有题面，请稍后编辑补充。</div>
      )}

      {lightbox && <Lightbox imageId={lightbox.id} alt={lightbox.alt} onClose={() => setLightbox(undefined)} />}
      {reward && <RewardReveal {...reward} onClose={closeReward} />}
    </main>
  )
}
