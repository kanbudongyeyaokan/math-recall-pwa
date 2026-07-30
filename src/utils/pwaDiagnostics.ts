export type DiagnosticStatus = 'pass' | 'warning' | 'fail'

export interface PwaDiagnosticItem {
  id: 'secure' | 'manifest' | 'service-worker' | 'offline-cache' | 'persistent-storage' | 'installed' | 'network'
  label: string
  status: DiagnosticStatus
  detail: string
}

export interface PwaDiagnosticReport {
  checkedAt: number
  score: number
  items: PwaDiagnosticItem[]
}

export function summarizeDiagnostics(items: readonly PwaDiagnosticItem[]) {
  if (!items.length) return 0
  const points = items.reduce((total, item) => total + (item.status === 'pass' ? 1 : item.status === 'warning' ? 0.5 : 0), 0)
  return Math.round((points / items.length) * 100)
}

export async function runPwaDiagnostics(isStandalone: boolean): Promise<PwaDiagnosticReport> {
  const host = location.hostname
  const secure = location.protocol === 'https:' || host === 'localhost' || host === '127.0.0.1'
  const manifest = !!document.querySelector('link[rel~="manifest"]')
  const serviceWorkerSupported = 'serviceWorker' in navigator
  const registration = serviceWorkerSupported ? await navigator.serviceWorker.getRegistration().catch(() => undefined) : undefined
  const controlled = !!navigator.serviceWorker?.controller
  const cacheSupported = 'caches' in globalThis
  const cacheNames = cacheSupported ? await caches.keys().catch(() => []) : []
  const persisted = await navigator.storage?.persisted?.().catch(() => false)
  const canPersist = typeof navigator.storage?.persist === 'function'

  const items: PwaDiagnosticItem[] = [
    {
      id: 'secure', label: '安全连接', status: secure ? 'pass' : 'fail',
      detail: secure ? 'HTTPS 环境可使用安装、离线缓存与加密能力。' : '当前不是 HTTPS，浏览器会限制 PWA 能力。'
    },
    {
      id: 'manifest', label: '安装清单', status: manifest ? 'pass' : 'fail',
      detail: manifest ? '应用名称、图标和桌面启动方式已就绪。' : '页面没有发现 Web App Manifest。'
    },
    {
      id: 'service-worker', label: '在线升级', status: registration && controlled ? 'pass' : registration ? 'warning' : 'fail',
      detail: registration && controlled ? 'Service Worker 已接管页面，可检查并切换新版本。' : registration ? '更新服务已注册，重新打开后会接管页面。' : '尚未注册更新服务。'
    },
    {
      id: 'offline-cache', label: '离线题库', status: cacheNames.length ? 'pass' : cacheSupported ? 'warning' : 'fail',
      detail: cacheNames.length ? `已建立 ${cacheNames.length} 个离线缓存。` : cacheSupported ? '首次完整打开后会建立离线缓存。' : '当前浏览器不支持 Cache Storage。'
    },
    {
      id: 'persistent-storage', label: '记录保护', status: persisted ? 'pass' : canPersist ? 'warning' : 'fail',
      detail: persisted ? '浏览器已承诺不主动回收本应用数据。' : canPersist ? 'IndexedDB 正常，但尚未获得持久存储保护。' : '当前浏览器不能申请持久存储。'
    },
    {
      id: 'installed', label: '桌面安装', status: isStandalone ? 'pass' : 'warning',
      detail: isStandalone ? '当前正在独立应用窗口运行。' : '当前仍在浏览器中，可按系统指引添加到桌面。'
    },
    {
      id: 'network', label: '当前网络', status: navigator.onLine ? 'pass' : cacheNames.length ? 'warning' : 'fail',
      detail: navigator.onLine ? '当前在线，可检查应用升级。' : cacheNames.length ? '当前离线，仍可使用已缓存题库。' : '当前离线且尚未确认离线缓存。'
    }
  ]
  return { checkedAt: Date.now(), score: summarizeDiagnostics(items), items }
}
