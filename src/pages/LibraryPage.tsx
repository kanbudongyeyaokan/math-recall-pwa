import { useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { BookOpen, CalendarClock, Edit3, FileQuestion, Filter, ListChecks, Plus, Search, Tags, Trash2 } from 'lucide-react'
import { db, deleteProblem } from '../db'
import type { ProblemKind, QuestionFormat } from '../types'
import { DbImage } from '../components/DbImage'

interface LibraryPageProps {
  onAdd: () => void
  onEdit: (id: string) => void
  onReview: (id: string) => void
  notify: (message: string) => void
}

type KindFilter = 'all' | ProblemKind
type FormatFilter = 'all' | QuestionFormat

export function LibraryPage({ onAdd, onEdit, onReview, notify }: LibraryPageProps) {
  const problems = useLiveQuery(() => db.problems.orderBy('updatedAt').reverse().toArray(), [], [])
  const [query, setQuery] = useState('')
  const [tag, setTag] = useState('all')
  const [kind, setKind] = useState<KindFilter>('all')
  const [format, setFormat] = useState<FormatFilter>('all')

  const tags = useMemo(() => Array.from(new Set(problems.flatMap((problem) => problem.tags))).sort(), [problems])
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return problems.filter((problem) => {
      if (kind !== 'all' && problem.kind !== kind) return false
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
  }, [problems, query, tag, kind, format])

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
          <h1>经典题与定义</h1>
        </div>
        <button type="button" className="icon-button solid" onClick={onAdd} aria-label="新增题卡"><Plus size={22} /></button>
      </header>

      <div className="search-box">
        <Search size={19} aria-hidden="true" />
        <label className="sr-only" htmlFor="problem-search">搜索题库</label>
        <input id="problem-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜题目、来源、方法、易错点…" />
      </div>

      <section className="filter-panel" aria-label="题库筛选">
        <div className="segmented-control">
          {([['all', '全部'], ['problem', '典型题'], ['concept', '定义卡']] as const).map(([value, label]) => (
            <button type="button" key={value} className={kind === value ? 'active' : ''} onClick={() => setKind(value)}>{label}</button>
          ))}
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
        {(query || tag !== 'all' || kind !== 'all' || format !== 'all') && (
          <button type="button" onClick={() => { setQuery(''); setTag('all'); setKind('all'); setFormat('all') }}>清除筛选</button>
        )}
      </div>

      <section className="problem-list">
        {filtered.map((problem) => {
          const isDue = problem.nextReviewAt <= Date.now()
          return (
            <article className="library-card" key={problem.id}>
              {problem.questionImageId && (
                <div className="library-thumb"><DbImage imageId={problem.questionImageId} alt={`${problem.title}缩略图`} /></div>
              )}
              <div className="library-card-body">
                <div className="library-card-topline">
                  <span className={`kind-badge kind-${problem.kind}`}>{problem.kind === 'concept' ? '定义' : '题目'}</span>
                  {problem.questionFormat !== 'open' && <span className="format-badge">{problem.questionFormat === 'single-choice' ? '单选' : '多选'}</span>}
                  <span className={isDue ? 'due-label' : 'scheduled-label'}><CalendarClock size={13} />{isDue ? '建议复做' : formatSchedule(problem.nextReviewAt)}</span>
                </div>
                <h2>{problem.title}</h2>
                <p>{problem.statement || problem.coreMethod || '图片题卡'}</p>
                <div className="tag-list compact">
                  {problem.tags.slice(0, 3).map((item) => <span className="tag" key={item}>{item}</span>)}
                </div>
                <div className="card-actions">
                  <button type="button" className="text-button primary-text" onClick={() => onReview(problem.id)}><BookOpen size={16} />做题</button>
                  <button type="button" className="text-button" onClick={() => onEdit(problem.id)}><Edit3 size={16} />编辑</button>
                  <button type="button" className="text-button danger-text" onClick={() => remove(problem.id, problem.title)}><Trash2 size={16} />删除</button>
                </div>
              </div>
            </article>
          )
        })}
      </section>

      {!filtered.length && (
        <section className="empty-state">
          <FileQuestion size={42} />
          <h2>{problems.length ? '没有匹配的卡片' : '建立你的第一张题卡'}</h2>
          <p>{problems.length ? '换个关键词或清除筛选试试。' : '拍下题目和答案，写一句真正关键的方法。'}</p>
          {!problems.length && <button type="button" className="button button-primary" onClick={onAdd}><Plus size={18} />新增题卡</button>}
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
