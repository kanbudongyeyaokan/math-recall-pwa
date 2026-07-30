import { useEffect, useState } from 'react'
import { BookOpenCheck, CheckCircle2, RefreshCw, Smartphone, X } from 'lucide-react'
import { registerSW } from 'virtual:pwa-register'
import { BottomNav, type Screen } from './components/BottomNav'
import { InstallGuide } from './components/InstallGuide'
import { SurpriseChallengeOfferModal } from './components/SurpriseChallengeModal'
import {
  acceptSurpriseChallengeOffer,
  clearActivePracticeSession,
  createRecoverySnapshot,
  declineSurpriseChallengeOffer,
  getActivePracticeSession,
  getLatestPracticeCheckpoint,
  getOrCreateSurpriseChallengeOffer,
  getSurpriseChallengeState,
  initializeDatabase,
  repairStreakIfNeeded,
  requestPersistentStorage,
  saveActivePracticeSession
} from './db'
import type { PracticeSelection } from './domain/curriculum'
import { getPendingPracticeSession } from './domain/practiceSession'
import {
  getSurpriseChallengeDelay,
  getSurpriseRival,
  SURPRISE_CHALLENGE_TIME_MS,
  type SurpriseChallengeOffer
} from './domain/surpriseChallenge'
import { HomePage } from './pages/HomePage'
import { LibraryPage } from './pages/LibraryPage'
import { PracticePage } from './pages/PracticePage'
import { ProblemFormPage } from './pages/ProblemFormPage'
import { ProfilePage } from './pages/ProfilePage'
import { ReviewPage } from './pages/ReviewPage'
import { WorldPage } from './pages/WorldPage'
import type { ActivePracticeSession } from './types'
import { getAudioPreferences, pauseBackgroundMusic, playSound, playSoundSequence, resumeBackgroundMusic, setBackgroundMusicScene } from './utils/sound'
import { getStoryVoiceCue, speakCharacterVoice, stopCharacterVoice } from './utils/voice'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function App() {
  const [ready, setReady] = useState(false)
  const [fatalError, setFatalError] = useState('')
  const [screen, setScreen] = useState<Screen>('home')
  const [editId, setEditId] = useState<string>()
  const [reviewId, setReviewId] = useState<string>()
  const [practiceSelection, setPracticeSelection] = useState<PracticeSelection>()
  const [toast, setToast] = useState('')
  const [online, setOnline] = useState(navigator.onLine)
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent>()
  const [isStandalone, setIsStandalone] = useState(window.matchMedia('(display-mode: standalone)').matches)
  const [showWechatNotice, setShowWechatNotice] = useState(/MicroMessenger/i.test(navigator.userAgent))
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [updateSW, setUpdateSW] = useState<((reloadPage?: boolean) => Promise<void>)>()
  const [updateRegistration, setUpdateRegistration] = useState<ServiceWorkerRegistration>()
  const [showInstallGuide, setShowInstallGuide] = useState(false)
  const [resumableSession, setResumableSession] = useState<ActivePracticeSession>()
  const [surpriseOffer, setSurpriseOffer] = useState<SurpriseChallengeOffer>()
  const [surpriseProcessing, setSurpriseProcessing] = useState(false)
  const isWechat = /MicroMessenger/i.test(navigator.userAgent)

  useEffect(() => {
    initializeDatabase()
      .then(repairStreakIfNeeded)
      .then(async () => {
        await requestPersistentStorage().catch(() => undefined)
        const storedSession = await getActivePracticeSession().catch(() => undefined)
        const checkpoint = storedSession ? undefined : await getLatestPracticeCheckpoint().catch(() => undefined)
        const checkpointSession = checkpoint && Date.now() - checkpoint.createdAt < 7 * 86_400_000 ? checkpoint.session : undefined
        const candidateSession = storedSession || checkpointSession
        const session = getPendingPracticeSession(candidateSession)
        if (candidateSession && !session) await clearActivePracticeSession(candidateSession.id)
        else if (session && session !== storedSession) await saveActivePracticeSession(session)
        if (session?.queueIds.length && session.queueIndex < session.queueIds.length) setResumableSession(session)
        setReady(true)
      })
      .catch((error) => setFatalError(error instanceof Error ? error.message : '本地数据库初始化失败'))
  }, [])

  useEffect(() => {
    let updateTimer: number | undefined
    let registration: ServiceWorkerRegistration | undefined
    const checkForUpdate = () => registration?.update().catch(() => undefined)
    const checkWhenVisible = () => {
      if (document.visibilityState === 'visible') checkForUpdate()
    }
    const updater = registerSW({
      immediate: true,
      onNeedRefresh: () => setUpdateAvailable(true),
      onOfflineReady: () => setToast('离线题库已准备好'),
      onRegisteredSW: (_url, nextRegistration) => {
        if (!nextRegistration) return
        registration = nextRegistration
        setUpdateRegistration(nextRegistration)
        checkForUpdate()
      }
    })
    updateTimer = window.setInterval(checkForUpdate, 30 * 60 * 1000)
    window.addEventListener('focus', checkForUpdate)
    document.addEventListener('visibilitychange', checkWhenVisible)
    setUpdateSW(() => updater)
    return () => {
      if (updateTimer) window.clearInterval(updateTimer)
      window.removeEventListener('focus', checkForUpdate)
      document.removeEventListener('visibilitychange', checkWhenVisible)
    }
  }, [])

  useEffect(() => {
    const onOnline = () => setOnline(true)
    const onOffline = () => setOnline(false)
    const onInstall = (event: Event) => {
      event.preventDefault()
      setInstallPrompt(event as BeforeInstallPromptEvent)
    }
    const onInstalled = () => {
      setInstallPrompt(undefined)
      setIsStandalone(true)
    }
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    window.addEventListener('beforeinstallprompt', onInstall)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
      window.removeEventListener('beforeinstallprompt', onInstall)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 2800)
    return () => window.clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    const scene = screen === 'review' && (practiceSelection?.mode === 'boss' || practiceSelection?.mode === 'ambush' || practiceSelection?.mode === 'duel')
      ? 'battle'
      : screen === 'review'
        ? 'focus'
        : screen === 'practice'
          ? 'practice'
      : screen === 'world'
        ? 'story'
        : screen === 'profile'
          ? 'resolve'
          : screen === 'home'
            ? 'home'
            : 'practice'
    setBackgroundMusicScene(scene)
  }, [screen, practiceSelection?.mode])

  useEffect(() => {
    const unlockAudio = () => resumeBackgroundMusic()
    const syncVisibility = () => document.visibilityState === 'hidden' ? pauseBackgroundMusic() : resumeBackgroundMusic()
    window.addEventListener('pointerdown', unlockAudio, { once: true })
    window.addEventListener('keydown', unlockAudio, { once: true })
    document.addEventListener('visibilitychange', syncVisibility)
    return () => {
      window.removeEventListener('pointerdown', unlockAudio)
      window.removeEventListener('keydown', unlockAudio)
      document.removeEventListener('visibilitychange', syncVisibility)
      pauseBackgroundMusic()
    }
  }, [])

  useEffect(() => {
    if (!ready || surpriseOffer || resumableSession || screen === 'review' || screen === 'form') return
    let cancelled = false
    let timer: number | undefined

    async function scheduleOffer() {
      const state = await getSurpriseChallengeState().catch(() => undefined)
      if (cancelled) return
      const hasPending = !!state?.pendingOffer && state.pendingOffer.expiresAt > Date.now()
      const delay = hasPending ? 1800 : getSurpriseChallengeDelay(Date.now() + screen.length)
      timer = window.setTimeout(async () => {
        if (cancelled || document.visibilityState !== 'visible' || await getActivePracticeSession().catch(() => undefined)) return
        const offer = await getOrCreateSurpriseChallengeOffer().catch(() => undefined)
        if (!offer || cancelled) return
        setSurpriseOffer(offer)
        playSoundSequence([{ effect: 'ambush-alert' }, { effect: 'rival-open', delayMs: 420 }])
        const rival = getSurpriseRival(offer.rivalId)
        if (getAudioPreferences().autoVoice) speakCharacterVoice(getStoryVoiceCue(rival.id, rival.invite), { delayMs: 880 })
      }, delay)
    }

    void scheduleOffer()
    return () => {
      cancelled = true
      if (timer) window.clearTimeout(timer)
    }
  }, [ready, resumableSession, screen, surpriseOffer])

  function navigate(next: Screen) {
    if (next === 'form') setEditId(undefined)
    if (next === 'practice') {
      setReviewId(undefined)
      setPracticeSelection(undefined)
    }
    setScreen(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function openReview(id?: string, selection?: PracticeSelection) {
    setReviewId(id)
    setPracticeSelection(selection)
    setResumableSession(undefined)
    setScreen('review')
    window.scrollTo({ top: 0 })
  }

  async function exitReview() {
    const session = getPendingPracticeSession(await getActivePracticeSession().catch(() => undefined))
    setResumableSession(session)
    navigate(practiceSelection?.mode === 'ambush' ? 'home' : practiceSelection?.mode === 'duel' ? 'world' : practiceSelection ? 'practice' : 'library')
  }

  function completeReview() {
    const destination = practiceSelection?.mode === 'ambush' ? 'home' : practiceSelection?.mode === 'duel' ? 'world' : 'practice'
    setResumableSession(undefined)
    navigate(destination)
  }

  async function acceptSurpriseOffer() {
    if (!surpriseOffer || surpriseProcessing) return
    setSurpriseProcessing(true)
    try {
      if (Date.now() >= surpriseOffer.expiresAt) {
        await declineSurpriseChallengeOffer(surpriseOffer.id)
        stopCharacterVoice()
        setSurpriseOffer(undefined)
        setToast('这封邀战已经过期，宿敌将在之后重新发起挑战')
        return
      }
      await acceptSurpriseChallengeOffer(surpriseOffer.id)
      stopCharacterVoice()
      playSound('battle-start')
      const rival = getSurpriseRival(surpriseOffer.rivalId)
      const selection: PracticeSelection = {
        lectureId: 'lecture-01',
        role: 'choice',
        mode: 'ambush',
        label: `突发邀战 · ${rival.name}`,
        challengeId: surpriseOffer.id,
        rivalId: surpriseOffer.rivalId,
        deadlineAt: Date.now() + SURPRISE_CHALLENGE_TIME_MS,
        challengeSeed: surpriseOffer.seed
      }
      setSurpriseOffer(undefined)
      openReview(undefined, selection)
    } finally {
      setSurpriseProcessing(false)
    }
  }

  async function declineSurpriseOffer() {
    if (!surpriseOffer || surpriseProcessing) return
    setSurpriseProcessing(true)
    try {
      const rival = getSurpriseRival(surpriseOffer.rivalId)
      await declineSurpriseChallengeOffer(surpriseOffer.id)
      setSurpriseOffer(undefined)
      playSound('story-next')
      if (getAudioPreferences().autoVoice) speakCharacterVoice(getStoryVoiceCue(rival.id, rival.declined), { delayMs: 160 })
      setToast('已暂避邀战，90 分钟内不会再次打扰')
    } finally {
      setSurpriseProcessing(false)
    }
  }

  function openEdit(id: string) {
    setEditId(id)
    setScreen('form')
    window.scrollTo({ top: 0 })
  }

  function resumePracticeSession() {
    if (!resumableSession) return
    setReviewId(resumableSession.requestedId)
    setPracticeSelection(resumableSession.selection as PracticeSelection | undefined)
    setResumableSession(undefined)
    setScreen('review')
    window.scrollTo({ top: 0 })
  }

  async function discardPracticeSession() {
    if (!resumableSession) return
    await clearActivePracticeSession(resumableSession.id)
    setResumableSession(undefined)
    setToast('上次未完成的会话已结束，历史做题记录仍保留')
  }

  async function installApp() {
    if (!installPrompt) {
      setShowInstallGuide(true)
      return
    }
    await installPrompt.prompt()
    await installPrompt.userChoice
    setInstallPrompt(undefined)
    setShowInstallGuide(false)
  }

  async function checkForAppUpdate() {
    if (!online) {
      setToast('当前处于离线状态，联网后再检查更新')
      return
    }
    if (!updateRegistration) {
      setToast('更新服务正在初始化，请稍后再试')
      return
    }
    try {
      await updateRegistration.update()
      setToast('检查完成；如有新版本会提示升级，题库和记录保持不变')
    } catch {
      setToast('检查更新失败，请确认网络后重试')
    }
  }

  async function applyAppUpdate() {
    if (!updateSW) return
    try {
      await createRecoverySnapshot(`升级 v${__APP_VERSION__} 前`)
      await updateSW(true)
    } catch {
      setToast('升级没有完成，当前版本仍可继续使用；更新前恢复点已保留')
    }
  }

  if (fatalError) {
    return <main className="boot-state"><h1>无法打开本地题库</h1><p>{fatalError}</p><button className="button button-primary" onClick={() => location.reload()}>重新加载</button></main>
  }

  if (!ready) {
    return <main className="boot-state"><div className="brand-mark"><span /></div><h1>斗破数学</h1><p>正在打开你的本地题库…</p><div className="loader" /></main>
  }

  return (
    <div className="app-shell">
      {(showWechatNotice || updateAvailable || resumableSession) && <div className="system-notices">
        {resumableSession && (
          <div className="system-banner resume-banner" role="status">
            <BookOpenCheck size={19} />
            <span><strong>上次做到第 {resumableSession.queueIndex + 1}/{resumableSession.queueIds.length} 题</strong><small>题序、选择和解析状态均已保存在本机</small></span>
            <button type="button" className="button button-accent" onClick={resumePracticeSession}>继续</button>
            <button type="button" className="icon-button" onClick={() => void discardPracticeSession()} aria-label="结束上次会话"><X size={17} /></button>
          </div>
        )}
        {showWechatNotice && (
          <div className="system-banner wechat-banner" role="status">
            <Smartphone size={19} />
            <span><strong>微信内可直接刷题</strong><small>要安装到桌面，请点右上角菜单并选择“在浏览器打开”</small></span>
            <button type="button" className="icon-button" onClick={() => setShowWechatNotice(false)} aria-label="关闭微信提示"><X size={17} /></button>
          </div>
        )}
        {updateAvailable && (
          <div className="system-banner update-banner" role="status">
            <RefreshCw size={19} />
            <span><strong>新版本已就绪</strong><small>本机题库与记录不会被覆盖</small></span>
            <button type="button" className="button button-accent" onClick={() => void applyAppUpdate()}>保护记录并升级</button>
          </div>
        )}
      </div>}
      {screen === 'home' && <HomePage online={online} onOpenPractice={() => navigate('practice')} onStartProblem={(id, selection) => openReview(id, selection)} onAdd={() => navigate('form')} onInstall={() => setShowInstallGuide(true)} />}
      {screen === 'practice' && <PracticePage onStart={(selection) => openReview(undefined, selection)} onOpenLibrary={() => navigate('library')} />}
      {screen === 'review' && <ReviewPage requestedId={reviewId} selection={practiceSelection} onBack={() => void exitReview()} onComplete={completeReview} />}
      {screen === 'world' && <WorldPage notify={setToast} onPractice={() => navigate('practice')} onStartDuel={(selection) => openReview(undefined, selection)} />}
      {screen === 'library' && <LibraryPage onAdd={() => navigate('form')} onEdit={openEdit} onReview={openReview} notify={setToast} />}
      {screen === 'form' && <ProblemFormPage editId={editId} onBack={() => navigate(editId ? 'library' : 'home')} onSaved={(message) => { setToast(message); navigate('library') }} />}
      {screen === 'profile' && <ProfilePage canInstall={!!installPrompt} isStandalone={isStandalone} isWechat={isWechat} onInstall={installApp} onCheckUpdate={checkForAppUpdate} onOpenWorld={() => navigate('world')} appVersion={__APP_VERSION__} notify={setToast} />}
      {screen !== 'review' && <BottomNav active={screen} onNavigate={navigate} />}
      {showInstallGuide && <InstallGuide canInstall={!!installPrompt} isWechat={isWechat} onInstall={installApp} onClose={() => setShowInstallGuide(false)} />}
      {surpriseOffer && <SurpriseChallengeOfferModal offer={surpriseOffer} processing={surpriseProcessing} onAccept={() => void acceptSurpriseOffer()} onDecline={() => void declineSurpriseOffer()} />}
      {toast && (
        <div className="toast" role="status">
          <CheckCircle2 size={19} /> <span>{toast}</span>
          <button type="button" onClick={() => setToast('')} aria-label="关闭提示"><X size={16} /></button>
        </div>
      )}
    </div>
  )
}
