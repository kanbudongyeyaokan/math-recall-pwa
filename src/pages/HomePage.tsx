import { useLiveQuery } from 'dexie-react-hooks'
import { ArrowRight, Flame, Plus, Shuffle, Smartphone, Sparkles, Target, WifiOff } from 'lucide-react'
import { CultivatorScene } from '../components/CultivatorScene'
import { SpiritStoneIcon } from '../components/GameCollectibleArt'
import { StoryPanel } from '../components/StoryPanel'
import { db, defaultProfile, getOrStartPracticeCycle } from '../db'
import { CALCULUS_LECTURES, getProblemLectureIds, type PracticeSelection } from '../domain/curriculum'
import { getRealmProgress } from '../domain/gamification'
import { getUnseenPracticeIds } from '../domain/practiceCycle'
import { playSound } from '../utils/sound'

interface HomePageProps {
  online: boolean
  onOpenPractice: () => void
  onStartProblem: (problemId: string, selection?: PracticeSelection) => void
  onAdd: () => void
  onInstall: () => void
}

export function HomePage({ online, onOpenPractice, onStartProblem, onAdd, onInstall }: HomePageProps) {
  const problems = useLiveQuery(() => db.problems.filter((problem) => !problem.archived).toArray(), [], [])
  const profile = useLiveQuery(() => db.profiles.get('player'), [], defaultProfile) || defaultProfile
  const lastReward = useLiveQuery(() => db.rewards.orderBy('earnedAt').last())
  const realm = getRealmProgress(profile.xp)
  const calculusProblems = problems.filter((problem) => getProblemLectureIds(problem).length > 0)
  const completedLectures = CALCULUS_LECTURES.filter((lecture) => (
    calculusProblems.some((problem) => problem.reviewCount > 0 && getProblemLectureIds(problem).includes(lecture.id))
  )).length

  async function drawRandom() {
    if (!problems.length) return onAdd()
    const lecturePools = CALCULUS_LECTURES.map((lecture) => ({
      lecture,
      problems: calculusProblems.filter((problem) => getProblemLectureIds(problem).includes(lecture.id))
    })).filter((pool) => pool.problems.length > 0)
    if (!lecturePools.length) {
      const randomIndex = crypto.getRandomValues(new Uint32Array(1))[0] % problems.length
      onStartProblem(problems[randomIndex].id)
      return
    }
    const poolIndex = crypto.getRandomValues(new Uint32Array(1))[0] % lecturePools.length
    const pool = lecturePools[poolIndex]
    const prepared = await getOrStartPracticeCycle(pool.lecture.id, pool.problems.map((problem) => problem.id))
    const problemId = getUnseenPracticeIds(prepared.state)[0]
    if (!problemId) return
    playSound('story-choice')
    onStartProblem(problemId, {
      lectureId: pool.lecture.id,
      role: 'all',
      label: `第 ${pool.lecture.number} 讲 · 随机未刷题`
    })
  }

  return (
    <main className="page page-home journey-home">
      <header className="journey-topbar">
        <div><span>斗破数学</span><strong>何耀焜的交大斗魂之路</strong></div>
        <button type="button" onClick={onInstall} aria-label="安装到手机桌面" title="安装到手机桌面"><Smartphone size={20} /></button>
      </header>

      {!online && <div className="offline-banner"><WifiOff size={17} />当前离线，题库与做题记录仍可使用</div>}

      <section className="journey-hero" aria-labelledby="journey-title">
        <div className="journey-hero-copy">
          <p className="eyebrow">主线目标 · 上海交通大学</p>
          <h1 id="journey-title">为爸妈拼出<br />更好的生活。</h1>
          <p>从第 1 讲到第 18 讲，把交大目标拆成今天真正做会的每一道题。</p>
          <div className="hero-identity">
            <span>{profile.name}</span><strong>{realm.label}</strong><small>{profile.selectedTitle}</small>
          </div>
          <button type="button" className="button button-accent journey-primary-action" onClick={onOpenPractice}>
            选择讲次做题 <ArrowRight size={19} />
          </button>
        </div>
        <CultivatorScene profile={profile} pose={realm.isPeak ? 'breakthrough' : 'idle'} label="焜火算师何耀焜站在通往上海交通大学的修炼路上" />
        <div className="journey-progress">
          <div><span>斗气经验</span><strong>{profile.xp}</strong></div>
          <div className="journey-progress-track"><span style={{ width: `${realm.progressPercent}%` }} /></div>
          <small>{realm.isPeak ? '斗帝巅峰' : `距下一星 ${realm.xpForStar - realm.xpIntoStar} 经验`}</small>
        </div>
      </section>

      <section className="mission-strip" aria-label="交大主线进度">
        <div><Target size={19} /><span><strong>{completedLectures}/18</strong><small>高数讲次已踏足</small></span></div>
        <div><Flame size={19} /><span><strong>{profile.totalReviews}</strong><small>累计完成题目</small></span></div>
        <div><SpiritStoneIcon size="md" /><span><strong>{profile.coins}</strong><small>可用灵石</small></span></div>
      </section>

      <StoryPanel profile={profile} />

      <section className="journey-actions" aria-labelledby="journey-actions-title">
        <div className="section-heading"><div><p className="eyebrow"><Sparkles size={14} />自由行动</p><h2 id="journey-actions-title">现在去哪里</h2></div></div>
        <div className="journey-action-grid">
          <button type="button" className="journey-action primary" onClick={onOpenPractice}>
            <span><Target size={22} /></span><div><strong>高数 18 讲</strong><small>选择讲次与板块</small></div><ArrowRight size={18} />
          </button>
          <button type="button" className="journey-action" onClick={() => void drawRandom()}>
            <span><Shuffle size={22} /></span><div><strong>偶遇一题</strong><small>从 18 讲本轮未刷题池抽取</small></div><ArrowRight size={18} />
          </button>
          <button type="button" className="journey-action" onClick={onAdd}>
            <span><Plus size={22} /></span><div><strong>录入新题</strong><small>拍题面与答案图片</small></div><ArrowRight size={18} />
          </button>
        </div>
      </section>

      {lastReward && (
        <section className={`last-loot rarity-border-${lastReward.rarity}`}>
          <div className="loot-icon"><Sparkles size={24} /></div>
          <div><p className="eyebrow">最近获得</p><h3>{lastReward.name}</h3><p>{lastReward.description}</p></div>
        </section>
      )}
    </main>
  )
}
