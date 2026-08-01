import { useEffect, useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { AlertTriangle, BookOpen, CalendarClock, ChevronDown, Clock3, Edit3, FileQuestion, Filter, Gauge, ListChecks, Plus, Search, ShieldCheck, Tags, Trash2 } from 'lucide-react'
import { db, deleteProblem } from '../db'
import type { QuestionFormat } from '../types'
import { DbImage } from '../components/DbImage'
import { MathText } from '../components/MathText'
import { getQualitySummary } from '../data/questionQuality'

interface LibraryPageProps {
  onAdd: () => void
  onEdit: (id: string) => void
  onReview: (id: string) => void
  notify: (message: string) => void
}

type FormatFilter = 'all' | QuestionFormat
type QualityFilter = 'all' | 'verified' | 'needs-review'
const PAGE_SIZE = 50

export function LibraryPage({ onAdd, onEdit, onReview, notify }: LibraryPageProps) {
  const problems = useLiveQuery(() => db.problems.orderBy('updatedAt').reverse().toArray(), [], [])
  const [query, setQuery] = useState('')
  const [tag, setTag] = useState('all')
  const [format, setFormat] = useState<FormatFilter>('all')
  const [quality, setQuality] = useState<QualityFilter>('all')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const activeProblems = useMemo(() => problems.filter((problem) => problem.kind === 'problem' && !problem.archived && problem.qualityStatus !== 'excluded'), [problems])
  const qualitySummary = useMemo(() => getQualitySummary(problems), [problems])
  const tags = useMemo(() => Array.from(new Set(activeProblems.flatMap((problem) => problem.tags))).sort(), [activeProblems])
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return activeProblems.filter((problem) => {
      if (quality !== 'all' && (problem.qualityStatus || 'verified') !== quality) return false
      if (format !== 'all' && problem.questionFormat !== format) return false
      if (tag !== 'all' && !problem.tags.includes(tag)) return false
      if (!normalized) return true
      return [
        problem.title,
        problem.statement,
        problem.source,
        problem.page,
        problem.coreMethod,
        problem.mistakes,
        problem.options.map((option) => option.text).join(' '),
        problem.solutionMethods.map((method) => `${method.title} ${method.content}`).join(' '),
        problem.tags.join(' ')
      ].join(' ').toLowerCase().includes(normalized)
    })
  }, [activeProblems, query, tag, format, quality])
  const visibleProblems = filtered.slice(0, visibleCount)

  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [query, tag, format, quality])

  async function remove(problemId: string, title: string) {
    if (!window.confirm(`确定删除“${title}”吗？相关图片、做题记录和奖励卡也会一并删除。`)) return
    await deleteProblem(problemId)
    notify('题卡已删除')
  }

  return (
    <main className="page library-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">个人题库</p>
          <h1>经典题库</h1>
        </div>
        <button type="button" className="icon-button solid" onClick={onAdd} aria-label="新增题卡"><Plus size={22} /></button>
      </header>

      <div className="search-box">
        <Search size={19} aria-hidden="true" />
        <label className="sr-only" htmlFor="problem-search">搜索题库</label>
        <input id="problem-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜题目、来源、方法、易错点…" />
      </div>

      <section className="filter-panel" aria-label="题库筛选">
        <div className="quality-filter-tabs" role="group" aria-label="题库质量状态">
          <button type="button" className={quality === 'all' ? 'active' : ''} onClick={() => setQuality('all')}>全部 <b>{qualitySummary.verified + qualitySummary.needsReview}</b></button>
          <button type="button" className={quality === 'verified' ? 'active' : ''} onClick={() => setQuality('verified')}><ShieldCheck size={15} />已通过</button>
          <button type="button" className={quality === 'needs-review' ? 'active warning' : 'warning'} onClick={() => setQuality('needs-review')}><AlertTriangle size={15} />待人工确认 <b>{qualitySummary.needsReview}</b></button>
        </div>
        <label className="select-wrap">
          <Tags size={17} />
          <span className="sr-only">按知识点筛选</span>
          <select value={tag} onChange={(event) => setTag(event.target.value)}>
            <option value="all">全部知识点</option>
            {tags.map((item) => <option value={item} key={item}>{item}</option>)}
          </select>
        </label>
        <label className="select-wrap">
          <ListChecks size={17} />
          <span className="sr-only">按作答方式筛选</span>
          <select value={format} onChange={(event) => setFormat(event.target.value as FormatFilter)}>
            <option value="all">全部作答方式</option>
            <option value="open">开放题</option>
            <option value="single-choice">单选题</option>
            <option value="multiple-choice">多选题</option>
          </select>
        </label>
      </section>

      <div className="result-summary">
        <span><Filter size={15} /> {filtered.length} 张卡片</span>
        {(query || tag !== 'all' || format !== 'all' || quality !== 'all') && (
          <button type="button" onClick={() => { setQuery(''); setTag('all'); setFormat('all'); setQuality('all') }}>清除筛选</button>
        )}
      </div>

      <section className="problem-list">
        {visibleProblems.map((problem) => {
          const isDue = problem.nextReviewAt <= Date.now()
          return (
            <article className="library-card" key={problem.id}>
              {problem.questionImageId && (
                <div className="library-thumb"><DbImage imageId={problem.questionImageId} alt={`${problem.title}缩略图`} /></div>
              )}
              <div className="library-card-body">
                <div className="library-card-topline">
                  <span className="kind-badge kind-problem">题目</span>
                  {problem.questionFormat !== 'open' && <span className="format-badge">{problem.questionFormat === 'single-choice' ? '单选' : '多选'}</span>}
                  {problem.qualityStatus === 'needs-review' && <span className="quality-review-badge"><AlertTriangle size={12} />待确认</span>}
                  <span className={isDue ? 'due-label' : 'scheduled-label'}><CalendarClock size={13} />{isDue ? '建议复做' : formatSchedule(problem.nextReviewAt)}</span>
                </div>
                <h2><MathText text={problem.title} inline enableTheoremLinks={false} /></h2>
                <MathText className="library-card-statement" text={problem.statement || problem.coreMethod || '图片题卡'} enableTheoremLinks={false} />
                <div className="tag-list compact">
                  {[...new Set(problem.tags)].slice(0, 3).map((item) => <span className="tag" key={item}>{item}</span>)}
                </div>
                <div className="problem-quality-meta">
                  <span><Gauge size={14} />难度 {problem.difficulty || 2}/5</span>
                  <span><Clock3 size={14} />约 {problem.estimatedMinutes || 6} 分钟</span>
                  <span>区分度 {problem.discrimination || 2}/5</span>
                </div>
                {problem.qualityStatus === 'needs-review' && !!problem.qualityIssues?.length && (
                  <div className="quality-issues" role="note">
                    {problem.qualityIssues.slice(0, 2).map((item) => <span key={item.code}>{item.message}</span>)}
                  </div>
                )}
                <div className="card-actions">
                  {problem.qualityStatus !== 'needs-review' && <button type="button" className="text-button primary-text" onClick={() => onReview(problem.id)}><BookOpen size={16} />做题</button>}
                  <button type="button" className="text-button" onClick={() => onEdit(problem.id)}><Edit3 size={16} />{problem.qualityStatus === 'needs-review' ? '审核修正' : '编辑'}</button>
                  <button type="button" className="text-button danger-text" onClick={() => remove(problem.id, problem.title)}><Trash2 size={16} />删除</button>
                </div>
              </div>
            </article>
          )
        })}
      </section>

      {visibleProblems.length < filtered.length && (
        <button type="button" className="button button-secondary button-full library-load-more" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>
          <ChevronDown size={18} />继续加载 · 已显示 {visibleProblems.length}/{filtered.length}
        </button>
      )}

      {!filtered.length && (
        <section className="empty-state">
          <FileQuestion size={42} />
          <h2>{activeProblems.length ? '没有匹配的卡片' : '建立你的第一张题卡'}</h2>
          <p>{activeProblems.length ? '换个关键词或清除筛选试试。' : '拍下题目和答案，写一句真正关键的方法。'}</p>
          {!activeProblems.length && <button type="button" className="button button-primary" onClick={onAdd}><Plus size={18} />新增题卡</button>}
        </section>
      )}
    </main>
  )
}

function formatSchedule(timestamp: number) {
  const days = Math.ceil((timestamp - Date.now()) / 86_400_000)
  if (days <= 1) return '明天'
  return `${days} 天后`
}
