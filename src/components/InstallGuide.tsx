import { useState } from 'react'
import { Check, Copy, ExternalLink, MoreHorizontal, Share2, Smartphone, X } from 'lucide-react'

interface InstallGuideProps {
  canInstall: boolean
  isWechat: boolean
  onInstall: () => Promise<void>
  onClose: () => void
}

export function InstallGuide({ canInstall, isWechat, onInstall, onClose }: InstallGuideProps) {
  const [copied, setCopied] = useState(false)
  const isIOS = /iPad|iPhone|iPod/i.test(navigator.userAgent)

  async function copyAddress() {
    await navigator.clipboard.writeText(location.href.split('#')[0])
    setCopied(true)
  }

  return (
    <div className="install-guide-backdrop" role="dialog" aria-modal="true" aria-labelledby="install-guide-title">
      <section className="install-guide">
        <button type="button" className="icon-button install-guide-close" onClick={onClose} aria-label="关闭安装说明"><X size={20} /></button>
        <span className="install-guide-icon"><Smartphone size={27} /></span>
        <p className="eyebrow">保留在手机桌面</p>
        <h2 id="install-guide-title">安装斗破数学</h2>
        {canInstall ? (
          <>
            <p>当前浏览器支持直接安装。安装后可全屏打开、离线做题，并继续使用同一份 IndexedDB 记录。</p>
            <button type="button" className="button button-accent button-full" onClick={onInstall}><Smartphone size={18} />立即安装</button>
          </>
        ) : isWechat ? (
          <div className="install-steps">
            <p><span>1</span><MoreHorizontal size={19} />点击微信右上角菜单</p>
            <p><span>2</span><ExternalLink size={19} />选择“在浏览器打开”</p>
            <p><span>3</span><Smartphone size={19} />再使用浏览器的“安装应用”或“添加到主屏幕”</p>
          </div>
        ) : isIOS ? (
          <div className="install-steps">
            <p><span>1</span><Share2 size={19} />使用 Safari 点击底部“分享”</p>
            <p><span>2</span><Smartphone size={19} />选择“添加到主屏幕”</p>
            <p><span>3</span><Check size={19} />确认名称后点击“添加”</p>
          </div>
        ) : (
          <div className="install-steps">
            <p><span>1</span><MoreHorizontal size={19} />打开 Chrome 或系统浏览器菜单</p>
            <p><span>2</span><Smartphone size={19} />选择“安装应用”或“添加到主屏幕”</p>
            <p><span>3</span><Check size={19} />首次打开后等待离线题库就绪</p>
          </div>
        )}
        {!canInstall && (
          <button type="button" className="button button-secondary button-full" onClick={copyAddress}>
            {copied ? <Check size={18} /> : <Copy size={18} />}{copied ? '网址已复制' : '复制网址到系统浏览器'}
          </button>
        )}
        <p className="install-data-note">微信、Safari、Chrome 各自保存独立记录。换入口前先导出完整备份，避免看起来像“记录消失”。</p>
      </section>
    </div>
  )
}
