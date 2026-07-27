import { useEffect, useState } from 'react'
import { CheckCircle2, RefreshCw, Smartphone, X } from 'lucide-react'
import { registerSW } from 'virtual:pwa-register'
import { BottomNav, type Screen } from './components/BottomNav'
import { initializeDatabase, repairStreakIfNeeded, requestPersistentStorage } from './db'
import { HomePage } from './pages/HomePage'
import { LibraryPage } from './pages/LibraryPage'
import { ProblemFormPage } from './pages/ProblemFormPage'
import { ProfilePage } from './pages/ProfilePage'
import { ReviewPage } from './pages/ReviewPage'

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
  const [toast, setToast] = useState('')
  const [online, setOnline] = useState(navigator.onLine)
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent>()
  const [isStandalone, setIsStandalone] = useState(window.matchMedia('(display-mode: standalone)').matches)
  const [showWechatNotice, setShowWechatNotice] = useState(/MicroMessenger/i.test(navigator.userAgent))
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [updateSW, setUpdateSW] = useState<((reloadPage?: boolean) => Promise<void>)>()
  const isWechat = /MicroMessenger/i.test(navigator.userAgent)

  useEffect(() => {
    initializeDatabase()
      .then(repairStreakIfNeeded)
      .then(async () => {
        await requestPersistentStorage().catch(() => undefined)
        setReady(true)
      })
      .catch((error) => setFatalError(error instanceof Error ? error.message : '本地数据库初始化失败'))
  }, [])

  useEffect(() => {
    let updateTimer: number | undefined
    const updater = registerSW({
      immediate: true,
      onNeedRefresh: () => setUpdateAvailable(true),
      onOfflineReady: () => setToast('离线题库已准备好'),
      onRegisteredSW: (_url, registration) => {
        if (!registration) return
        updateTimer = window.setInterval(() => registration.update().catch(() => undefined), 60 * 60 * 1000)
      }
    })
    setUpdateSW(() => updater)
    return () => {
      if (updateTimer) window.clearInterval(updateTimer)
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

  function navigate(next: Screen) {
    if (next === 'form') setEditId(undefined)
    if (next === 'review') setReviewId(undefined)
    setScreen(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function openReview(id?: string) {
    setReviewId(id)
    setScreen('review')
    window.scrollTo({ top: 0 })
  }

  function openEdit(id: string) {
    setEditId(id)
    setScreen('form')
    window.scrollTo({ top: 0 })
  }

  async function installApp() {
    if (!installPrompt) return
    await installPrompt.prompt()
    await installPrompt.userChoice
    setInstallPrompt(undefined)
  }

  if (fatalError) {
    return <main className="boot-state"><h1>无法打开本地题库</h1><p>{fatalError}</p><button className="button button-primary" onClick={() => location.reload()}>重新加载</button></main>
  }

  if (!ready) {
    return <main className="boot-state"><div className="brand-mark"><span /></div><h1>斗破数学</h1><p>正在打开你的本地题库…</p><div className="loader" /></main>
  }

  return (
    <div className="app-shell">
      {(showWechatNotice || updateAvailable) && <div className="system-notices">
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
            <button type="button" className="button button-accent" onClick={() => updateSW?.(true)}>立即升级</button>
          </div>
        )}
      </div>}
      {screen === 'home' && <HomePage online={online} onStartReview={openReview} onAdd={() => navigate('form')} />}
      {screen === 'review' && <ReviewPage requestedId={reviewId} onBack={() => navigate('home')} onNext={() => { setReviewId(undefined); setScreen('review') }} />}
      {screen === 'library' && <LibraryPage onAdd={() => navigate('form')} onEdit={openEdit} onReview={openReview} notify={setToast} />}
      {screen === 'form' && <ProblemFormPage editId={editId} onBack={() => navigate(editId ? 'library' : 'home')} onSaved={(message) => { setToast(message); navigate('library') }} />}
      {screen === 'profile' && <ProfilePage canInstall={!!installPrompt} isStandalone={isStandalone} isWechat={isWechat} onInstall={installApp} notify={setToast} />}
      <BottomNav active={screen} onNavigate={navigate} />
      {toast && (
        <div className="toast" role="status">
          <CheckCircle2 size={19} /> <span>{toast}</span>
          <button type="button" onClick={() => setToast('')} aria-label="关闭提示"><X size={16} /></button>
        </div>
      )}
    </div>
  )
}
