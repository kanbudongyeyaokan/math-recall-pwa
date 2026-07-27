import { useLiveQuery } from 'dexie-react-hooks'
import { ArrowRight, BookOpenCheck, Coins, Flame, Layers3, Plus, Shuffle, Sparkles, WifiOff, Zap } from 'lucide-react'
import { db, defaultProfile } from '../db'
import { getRealmProgress } from '../domain/gamification'

interface HomePageProps {
  online: boolean
  onStartReview: (problemId?: string) => void
  onAdd: () => void
}

function startOfToday() {
  const date = new Date()
  date.setHours(0, 0, 0, 0)
  return date.getTime()
}

export function HomePage({ online, onStartReview, onAdd }: HomePageProps) {
  const dueProblems = useLiveQuery(
    () => db.problems.where('nextReviewAt').belowOrEqual(Date.now()).filter((p) => !p.archived).sortBy('nextReviewAt'),
    [],
    []
  )
  const allProblems = useLiveQuery(() => db.problems.filter((p) => !p.archived).toArray(), [], [])
  const profile = useLiveQuery(() => db.profiles.get('player'), [], defaultProfile) || defaultProfile
  const todayReviews = useLiveQuery(
    () => db.reviews.where('reviewedAt').aboveOrEqual(startOfToday()).count(),
    [],
    0
  )
  const lastReward = useLiveQuery(() => db.rewards.orderBy('earnedAt').last())

  const realm = getRealmProgress(profile.xp)
  const dailyTarget = 5
  const questProgress = Math.min(100, (todayReviews / dailyTarget) * 100)

  function drawRandom() {
    if (!allProblems.length) return onAdd()
    const selected = allProblems[Math.floor(Math.random() * allProblems.length)]
    onStartReview(selected.id)
  }

  return (
    <main className="page page-home">
      <header className="home-header">
        <div>
          <p className="eyebrow">斗破数学 · 今日行动</p>
          <h1>{dueProblems.length ? `${profile.name}，趁热再走一阶。` : `${profile.name}，今日已清空。`}</h1>
        </div>
        <div className="level-chip realm-chip" aria-label={`当前境界 ${realm.label}`}>
          <span>{realm.realm}</span><strong>{realm.isPeak ? '巅峰' : `${realm.star}星`}</strong>
        </div>
      </header>

      {!online && (
        <div className="offline-banner"><WifiOff size={17} /> 当前离线，题目和图片仍可正常使用</div>
      )}

      <section className="hero-card">
        <div className="hero-orbit" aria-hidden="true" />
        <div className="hero-topline">
          <span><span className="status-dot" /> 今日待复习</span>
          <strong className="hero-wallet"><Coins size={15} /> {profile.coins}</strong>
        </div>
        <div className="hero-number">{dueProblems.length}</div>
        <p>{dueProblems.length ? `最早一题：${dueProblems[0]?.title}` : '间隔计划已全部完成，可以随机探索。'}</p>
        <button
          type="button"
          className="button button-accent hero-action"
          onClick={() => onStartReview(dueProblems[0]?.id)}
        >
          <BookOpenCheck size={20} /> {dueProblems.length ? '开始今日复习' : '随机回顾一题'} <ArrowRight size={18} />
        </button>
      </section>

      <section className="quick-grid" aria-label="快捷操作">
        <button className="quick-card random-card" type="button" onClick={drawRandom}>
          <span className="quick-icon"><Shuffle size={22} /></span>
          <span><strong>随机抽题</strong><small>打破熟悉顺序</small></span>
        </button>
        <button className="quick-card add-card" type="button" onClick={onAdd}>
          <span className="quick-icon"><Plus size={22} /></span>
          <span><strong>快速新增</strong><small>拍照即入库</small></span>
        </button>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><Zap size={14} /> 每日任务</p>
            <h2>完成 {dailyTarget} 次有效回忆</h2>
          </div>
          <strong>{todayReviews}/{dailyTarget}</strong>
        </div>
        <div className="quest-track" aria-label={`每日任务完成 ${Math.round(questProgress)}%`}>
          <span style={{ width: `${questProgress}%` }} />
        </div>
        <p className="section-note">不是看过就算：揭晓答案并自评后，才计入一次。</p>
      </section>

      <section className="stats-row">
        <div className="mini-stat">
          <Flame size={20} />
          <span><strong>{profile.streak}</strong><small>连续天数</small></span>
        </div>
        <div className="mini-stat">
          <Sparkles size={20} />
          <span><strong>{realm.isPeak ? 'MAX' : `${realm.xpIntoStar}/${realm.xpForStar}`}</strong><small>破星斗气</small></span>
        </div>
        <div className="mini-stat">
          <Coins size={20} />
          <span><strong>{profile.coins}</strong><small>可用灵石</small></span>
        </div>
      </section>

      {lastReward && (
        <section className={`last-loot rarity-border-${lastReward.rarity}`}>
          <div className="loot-icon"><Layers3 size={24} /></div>
          <div>
            <p className="eyebrow">最近战利品</p>
            <h3>{lastReward.name}</h3>
            <p>{lastReward.description}</p>
          </div>
        </section>
      )}
    </main>
  )
}
