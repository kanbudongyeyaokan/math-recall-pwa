import { useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { ArrowRight, BookOpenCheck, Check, FileUp, Filter, Library, Route, Sigma } from 'lucide-react'
import { db } from '../db'
import {
  CALCULUS_LECTURES,
  getProblemLectureIds,
  getProblemRole,
  getProblemSectionIds,
  matchesPracticeSelection,
  PRACTICE_ROLE_LABELS,
  type PracticeRole,
  type PracticeSelection
} from '../domain/curriculum'
import { getPracticeCycleProgress, getPracticeCycleSettingKey, type PracticeCycleState } from '../domain/practiceCycle'

interface PracticePageProps {
  onStart: (selection: PracticeSelection) => void
  onOpenProfile: () => void
  onOpenLibrary: () => void
}

const roles: PracticeRole[] = ['all', 'concept', 'example', 'choice', 'exercise']

export function PracticePage({ onStart, onOpenProfile, onOpenLibrary }: PracticePageProps) {
  const problems = useLiveQuery(() => db.problems.filter((problem) => !problem.archived).toArray(), [], [])
  const privateCount = useLiveQuery(
    () => db.problems.filter((problem) => problem.source.includes('张宇基础30讲')).count(),
    [],
    0
  )
  const [lectureId, setLectureId] = useState('lecture-01')
  const [role, setRole] = useState<PracticeRole>('all')
  const [sectionId, setSectionId] = useState<string>()
  const cycleRecord = useLiveQuery(() => db.settings.get(getPracticeCycleSettingKey(lectureId)), [lectureId])

  const selectedLecture = CALCULUS_LECTURES.find((lecture) => lecture.id === lectureId) || CALCULUS_LECTURES[0]
  const classified = useMemo(() => problems.map((problem) => ({
    problem,
    lectureIds: getProblemLectureIds(problem),
    role: getProblemRole(problem)
  })), [problems])
  const lectureCounts = useMemo(() => new Map(CALCULUS_LECTURES.map((lecture) => [
    lecture.id,
    classified.filter((item) => item.lectureIds.includes(lecture.id)).length
  ])), [classified])
  const selectedProblems = problems.filter((problem) => matchesPracticeSelection(problem, {
    lectureId,
    sectionId,
    role,
    label: selectedLecture.title
  }))
  const lectureProblems = problems.filter((problem) => getProblemLectureIds(problem).includes(lectureId))
  const cycleState = cycleRecord?.value as PracticeCycleState | undefined
  const cycleProgress = getPracticeCycleProgress(cycleState, lectureProblems.map((problem) => problem.id))
  const cycleSeenIds = new Set(cycleState?.seenIds || [])
  const selectedRemainingCount = cycleProgress.complete
    ? selectedProblems.length
    : selectedProblems.filter((problem) => !cycleSeenIds.has(problem.id)).length
  const unclassifiedCount = classified.filter((item) => item.lectureIds.length === 0).length

  function chooseLecture(nextLectureId: string) {
    setLectureId(nextLectureId)
    setRole('all')
    setSectionId(undefined)
    window.setTimeout(() => document.getElementById('lecture-builder')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  function startSelection() {
    if (!selectedProblems.length) return
    const section = selectedLecture.sections.find((item) => item.id === sectionId)
    onStart({
      lectureId,
      sectionId,
      role,
      label: `第 ${selectedLecture.number} 讲 · ${section?.title || PRACTICE_ROLE_LABELS[role]}`
    })
  }

  return (
    <main className="page practice-page">
      <header className="practice-map-header">
        <div>
          <p className="eyebrow"><Route size={14} />三十讲 · 高数主线</p>
          <h1>选择一讲，直接做题</h1>
          <p>没有“今日必须做几题”。你决定现在攻哪一讲、哪一部分。</p>
        </div>
        <span><Sigma size={22} /><strong>18</strong> 讲</span>
      </header>

      {privateCount < 1000 && (
        <section className="private-bank-callout">
          <FileUp size={21} />
          <div>
            <strong>{privateCount === 0 ? '私人《基础30讲》千题包尚未导入' : `千题包可增量升级 · 当前 ${privateCount}/1000`}</strong>
            <p>{privateCount === 0 ? '1000 张双解题卡只保存在你的私人文件中，导入后会自动归入下面 18 讲。' : '导入时保持“导入前清空本机数据”关闭，只补齐缺失题目，已有做题记录、金币与人物羁绊不会被覆盖。'}</p>
          </div>
          <button type="button" onClick={onOpenProfile}>{privateCount === 0 ? '去导入' : '升级题库'}</button>
        </section>
      )}

      <section className="lecture-map" aria-label="高数18讲">
        {CALCULUS_LECTURES.map((lecture) => {
          const count = lectureCounts.get(lecture.id) || 0
          const active = lecture.id === lectureId
          return (
            <button type="button" className={active ? 'lecture-node active' : 'lecture-node'} onClick={() => chooseLecture(lecture.id)} key={lecture.id}>
              <span className="lecture-number">{String(lecture.number).padStart(2, '0')}</span>
              <span><strong>{lecture.shortTitle}</strong><small>{lecture.region}</small></span>
              <b>{count} 题</b>
              {active && <Check size={16} />}
            </button>
          )
        })}
      </section>

      <section id="lecture-builder" className="lecture-builder" aria-labelledby="lecture-builder-title">
        <div className="lecture-builder-heading">
          <div><span>第 {selectedLecture.number} 讲 · P{selectedLecture.printPages[0]}–{selectedLecture.printPages[1]}</span><h2 id="lecture-builder-title">{selectedLecture.title}</h2></div>
          <strong>第 {cycleState?.cycle || 1} 轮 · {cycleProgress.seen}/{cycleProgress.total} 已刷</strong>
        </div>

        <div className="practice-role-tabs" role="group" aria-label="题目类型">
          {roles.map((item) => {
            const roleProblems = lectureProblems.filter((problem) => item === 'all' || getProblemRole(problem) === item)
            const remaining = cycleProgress.complete ? roleProblems.length : roleProblems.filter((problem) => !cycleSeenIds.has(problem.id)).length
            return <button type="button" className={role === item ? 'active' : ''} onClick={() => { setRole(item); setSectionId(undefined) }} key={item}>{PRACTICE_ROLE_LABELS[item]}<small>{remaining}/{roleProblems.length}</small></button>
          })}
        </div>

        <div className="lecture-section-list">
          <button type="button" className={!sectionId ? 'active' : ''} onClick={() => setSectionId(undefined)}>
            <Filter size={17} /><span><strong>整讲混合</strong><small>定义、例题与训练交替</small></span>
          </button>
          {selectedLecture.sections.map((section) => {
            const sectionProblems = lectureProblems.filter((problem) => getProblemSectionIds(problem, selectedLecture).includes(section.id))
            const count = sectionProblems.length
            const remaining = cycleProgress.complete ? count : sectionProblems.filter((problem) => !cycleSeenIds.has(problem.id)).length
            return (
              <button type="button" className={sectionId === section.id ? 'active' : ''} onClick={() => setSectionId(section.id)} disabled={!count} key={section.id}>
                <BookOpenCheck size={17} /><span><strong>{section.title}</strong><small>{count ? `${remaining}/${count} 道本轮未刷` : '等待补充题目'}</small></span>
              </button>
            )
          })}
        </div>

        <button type="button" className="button button-accent button-full start-lecture-button" disabled={!selectedProblems.length || (!cycleProgress.complete && selectedRemainingCount === 0)} onClick={startSelection}>
          {!selectedProblems.length
            ? <>这一部分还没有题目</>
            : cycleProgress.complete
              ? <>本讲已通关 · 开启第 {(cycleState?.cycle || 1) + 1} 轮<ArrowRight size={19} /></>
              : selectedRemainingCount > 0
                ? <>随机开始 · 本轮剩余 {selectedRemainingCount} 道<ArrowRight size={19} /></>
                : <>本轮此部分已刷完</>}
        </button>
      </section>

      {unclassifiedCount > 0 && (
        <section className="other-bank-row">
          <Library size={20} /><div><strong>线代、概率与自建题库</strong><p>另有 {unclassifiedCount} 道题保留在完整题库中。</p></div><button type="button" onClick={onOpenLibrary}>打开题库</button>
        </section>
      )}
    </main>
  )
}
