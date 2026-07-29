import { ChangeEvent, useEffect, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import {
  AudioLines,
  ArchiveRestore,
  Camera,
  CheckCircle2,
  CloudOff,
  Database,
  Download,
  HardDrive,
  Map,
  RefreshCcw,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Upload
} from 'lucide-react'
import { db, defaultProfile, requestPersistentStorage, restoreLatestSnapshot, saveImage } from '../db'
import { getRealmProgress } from '../domain/gamification'
import { getCharacter } from '../domain/story'
import type { StoragePersistenceState } from '../types'
import { downloadBackup, restoreBackup } from '../utils/backup'
import { PlayerAvatar } from '../components/PlayerAvatar'
import { AudioSettingsControls } from '../components/AudioSettingsControls'
import { getAudioPreferences, playSound, saveAudioPreferences, type AudioPreferences } from '../utils/sound'
import { getStoryVoiceCue, getVoiceDiagnostics, hasCharacterVoiceSupport, speakCharacterVoice, stopCharacterVoice, subscribeToVoiceAvailability } from '../utils/voice'

interface ProfilePageProps {
  canInstall: boolean
  isStandalone: boolean
  isWechat: boolean
  onInstall: () => Promise<void>
  onCheckUpdate: () => Promise<void>
  onOpenWorld: () => void
  appVersion: string
  notify: (message: string) => void
}

const voiceSampleCharacterIds = ['he-yaokun', 'chen-yanjun', 'zeng-yuxin', 'yuan-yue', 'chen-ruibin', 'medusa', 'xiaoyixian']

function getVoiceSetupPath() {
  const agent = navigator.userAgent
  if (/Android/i.test(agent)) return '安卓：系统设置 → 语言与输入法 → 文字转语音输出 → 安装或更新 Speech Services → 下载中文语音。'
  if (/iPhone|iPad|iPod/i.test(agent)) return 'iPhone：设置 → 辅助功能 → 朗读内容 → 声音 → 中文 → 下载一种声音。'
  return 'Windows：设置 → 时间和语言 → 语音 → 管理声音 → 添加中文语音包。'
}

export function ProfilePage({ canInstall, isStandalone, isWechat, onInstall, onCheckUpdate, onOpenWorld, appVersion, notify }: ProfilePageProps) {
  const profile = useLiveQuery(() => db.profiles.get('player'), [], defaultProfile) || defaultProfile
  const problemCount = useLiveQuery(() => db.problems.count(), [], 0)
  const imageCount = useLiveQuery(() => db.images.count(), [], 0)
  const persistenceRecord = useLiveQuery(() => db.settings.get('storage-persistence'))
  const lastBackupRecord = useLiveQuery(() => db.settings.get('last-external-backup-at'))
  const latestSnapshot = useLiveQuery(() => db.snapshots.orderBy('createdAt').last())
  const [replaceExisting, setReplaceExisting] = useState(false)
  const [busy, setBusy] = useState(false)
  const [storage, setStorage] = useState<{ usage: number; quota: number }>()
  const [audioPreferences, setAudioPreferences] = useState(getAudioPreferences)
  const [voiceDiagnostics, setVoiceDiagnostics] = useState(() => getVoiceDiagnostics(voiceSampleCharacterIds))
  const realm = getRealmProgress(profile.xp)
  const persistence = persistenceRecord?.value as StoragePersistenceState | undefined
  const lastBackup = lastBackupRecord?.value as string | undefined
  const voiceSupported = hasCharacterVoiceSupport()

  function updateAudioPreferences(patch: Partial<AudioPreferences>) {
    setAudioPreferences(saveAudioPreferences(patch))
  }

  function toggleProfileSound() {
    const enabled = !audioPreferences.soundEnabled
    if (!enabled) playSound('sound-off')
    updateAudioPreferences({ soundEnabled: enabled })
    if (enabled) playSound('sound-on')
  }

  function toggleProfileVoice() {
    const enabled = !audioPreferences.voiceEnabled
    if (!enabled) stopCharacterVoice()
    updateAudioPreferences({ voiceEnabled: enabled })
    if (enabled) previewCharacterVoice()
  }

  function previewCharacterVoice() {
    const characterId = profile.totalReviews >= 22 ? 'chen-yanjun' : 'he-xinping'
    const text = characterId === 'chen-yanjun'
      ? '何耀焜，条件和推导都守住了。这一题，很漂亮。'
      : '先把自己的路走稳，家里永远是你的后方。'
    playSound('correct')
    speakCharacterVoice(getStoryVoiceCue(characterId, text), { delayMs: 430 })
  }

  useEffect(() => {
    navigator.storage?.estimate().then((estimate) => {
      setStorage({ usage: estimate.usage || 0, quota: estimate.quota || 0 })
    }).catch(() => undefined)
  }, [imageCount])

  useEffect(() => subscribeToVoiceAvailability(() => {
    setVoiceDiagnostics(getVoiceDiagnostics(voiceSampleCharacterIds))
  }), [])

  async function uploadAvatar(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    setBusy(true)
    try {
      const previousId = profile.avatarImageId
      const avatarImageId = await saveImage(file)
      await db.profiles.update('player', { avatarImageId })
      if (previousId) await db.images.delete(previousId)
      notify('何耀焜的个人头像已更新')
    } catch (error) {
      notify(error instanceof Error ? error.message : '头像保存失败')
    } finally {
      setBusy(false)
    }
  }

  async function removeAvatar() {
    const previousId = profile.avatarImageId
    await db.profiles.update('player', { avatarImageId: undefined })
    if (previousId) await db.images.delete(previousId)
    notify('已切换回专属修炼形象')
  }

  async function exportData() {
    setBusy(true)
    try {
      await downloadBackup()
      notify('完整备份已下载，请妥善保存')
    } catch (error) {
      notify(error instanceof Error ? error.message : '导出失败')
    } finally {
      setBusy(false)
    }
  }

  async function importData(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (replaceExisting && !window.confirm('替换导入会先清空本机现有题目、图片和进度，确定继续吗？')) return
    setBusy(true)
    try {
      const result = await restoreBackup(file, replaceExisting)
      notify(`恢复完成：新增 ${result.problems} 张题卡、${result.images} 张图片${result.preservedProblems ? `，保留已有 ${result.preservedProblems} 张题卡` : ''}`)
    } catch (error) {
      notify(error instanceof Error ? error.message : '导入失败，请检查备份文件')
    } finally {
      setBusy(false)
    }
  }

  async function retryPersistence() {
    setBusy(true)
    try {
      const result = await requestPersistentStorage()
      notify(result.status === 'granted' ? '本机持久存储保护已开启' : '浏览器暂未授予保护，请安装后再试')
    } finally {
      setBusy(false)
    }
  }

  async function recoverSnapshot() {
    if (!latestSnapshot || !window.confirm(`恢复到 ${formatDateTime(latestSnapshot.createdAt)} 的记录吗？当前题目进度会被该恢复点覆盖，图片不会删除。`)) return
    setBusy(true)
    try {
      const snapshot = await restoreLatestSnapshot()
      notify(`已恢复本机记录：${snapshot.reason}`)
    } catch (error) {
      notify(error instanceof Error ? error.message : '恢复失败')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="page profile-page">
      <header className="page-header">
        <div><p className="eyebrow">何耀焜的本地战绩</p><h1>{profile.name}</h1></div>
        <div className="profile-level">{realm.realm}</div>
      </header>

      <section className="profile-hero">
        <PlayerAvatar profile={profile} />
        <div className="profile-hero-copy">
          <span>{profile.selectedTitle} · 当前斗气境界</span>
          <strong>{realm.label}</strong>
          <div className="quest-track profile-track"><span style={{ width: `${realm.progressPercent}%` }} /></div>
          <small>{realm.isPeak ? `已达巅峰 · 累计 ${profile.xp} 斗气经验` : `距下一星还差 ${realm.xpForStar - realm.xpIntoStar} 经验 · 累计 ${profile.xp}`}</small>
        </div>
      </section>

      <section className="stats-row profile-stats">
        <div className="mini-stat"><span><strong>{profile.totalReviews}</strong><small>累计做题</small></span></div>
        <div className="mini-stat"><span><strong>{profile.correctChoiceReviews}</strong><small>选择命中</small></span></div>
        <div className="mini-stat"><span><strong>{profile.multipleSolutionReviews}</strong><small>多解完成</small></span></div>
      </section>

      <section className="world-handoff">
        <Map size={24} />
        <div><p className="eyebrow">玩法已迁入斗界</p><h2>人物、坊市、任务都在独立入口</h2><p>从底部中间的“斗界”进入，查看羁绊、购买装备、切换功法和领取称号。</p></div>
        <button type="button" className="button button-accent" onClick={onOpenWorld}>进入斗界</button>
      </section>

      <section className="section-block avatar-settings-section">
        <div className="section-heading"><div><p className="eyebrow"><Camera size={14} /> 个人形象</p><h2>头像设置</h2></div></div>
        <div className="avatar-actions">
          <label className={`button button-secondary ${busy ? 'disabled' : ''}`}><Camera size={17} />上传本人头像<input type="file" accept="image/*" onChange={uploadAvatar} disabled={busy} /></label>
          {profile.avatarImageId && <button type="button" className="button button-secondary" onClick={removeAvatar} disabled={busy}>使用修炼形象</button>}
        </div>
      </section>

      <section className="section-block audio-settings-section">
        <div className="section-title"><AudioLines size={20} /><div><h2>战斗音效与角色语音</h2><p>分别控制反馈强度、自动播报和角色声线</p></div></div>
        <div className="audio-toggle-list">
          <label className="audio-toggle-row">
            <span><strong>做题音效</strong><small>选项、答题、掉卡、灵石、功法与破境</small></span>
            <input type="checkbox" role="switch" checked={audioPreferences.soundEnabled} onChange={toggleProfileSound} />
          </label>
          <label className="audio-toggle-row">
            <span><strong>角色语音</strong><small>{voiceSupported ? '使用手机内置普通话语音引擎' : '当前浏览器没有可用语音引擎'}</small></span>
            <input type="checkbox" role="switch" checked={audioPreferences.voiceEnabled && voiceSupported} onChange={toggleProfileVoice} disabled={!voiceSupported} />
          </label>
          <label className="audio-toggle-row">
            <span><strong>结算自动播报</strong><small>奖励音结束后，由当前同行者说一句</small></span>
            <input type="checkbox" role="switch" checked={audioPreferences.autoVoice} onChange={(event) => updateAudioPreferences({ autoVoice: event.target.checked })} disabled={!audioPreferences.voiceEnabled || !voiceSupported} />
          </label>
        </div>
        <AudioSettingsControls
          preferences={audioPreferences}
          voiceSupported={voiceSupported}
          onChange={updateAudioPreferences}
          onPreviewSound={() => playSound('coin')}
          onPreviewVoice={previewCharacterVoice}
          idPrefix="profile-audio"
        />
        <div className={`voice-engine-status ${voiceDiagnostics.chineseVoiceCount ? 'ready' : 'needs-voice'}`}>
          <Smartphone size={19} />
          <div>
            <strong>{!voiceDiagnostics.engineSupported ? '当前浏览器不提供语音引擎' : voiceDiagnostics.chineseVoiceCount ? `已识别 ${voiceDiagnostics.chineseVoiceCount} 套中文音色` : voiceDiagnostics.voicesLoaded ? '语音引擎可用，但没有中文音色' : '正在等待系统加载语音包'}</strong>
            <small>{voiceDiagnostics.chineseVoiceCount ? `${voiceDiagnostics.localChineseVoiceCount} 套可离线 · ${voiceDiagnostics.networkChineseVoiceCount} 套需联网；同音色角色仍有独立语速与音高。` : getVoiceSetupPath()}</small>
          </div>
        </div>
        {voiceDiagnostics.engineSupported && (
          <div className="voice-cast-samples" aria-label="核心角色声线试听">
            {voiceDiagnostics.profiles.map((voiceProfile) => {
              const character = getCharacter(voiceProfile.characterId)
              const unlocked = profile.totalReviews >= character.unlockAt
              return (
                <button type="button" disabled={!unlocked || !audioPreferences.voiceEnabled} onClick={() => speakCharacterVoice(getStoryVoiceCue(character.id, character.quote))} key={character.id}>
                  <span>{character.name.slice(0, 1)}</span>
                  <strong>{unlocked ? character.name : `${character.unlockAt}题`}</strong>
                  <small>{unlocked ? voiceProfile.voiceName || `${voiceProfile.rate.toFixed(2)}x · 音高 ${voiceProfile.pitch.toFixed(2)}` : '尚未相遇'}</small>
                </button>
              )
            })}
          </div>
        )}
        <p className="section-note">语音只播报短鼓励和剧情台词，不会朗读题目或提前透露答案。人物志中每位已解锁角色都可播放自己的台词。</p>
      </section>

      <section className="section-block persistence-section">
        <div className="section-heading"><div><p className="eyebrow"><ShieldCheck size={14} /> 本机记录保护</p><h2>{persistence?.status === 'granted' ? '持久存储已开启' : '记录已保存，可继续加固'}</h2></div></div>
        <div className={`persistence-status status-${persistence?.status || 'checking'}`}>
          {persistence?.status === 'granted' ? <CheckCircle2 size={20} /> : <HardDrive size={20} />}
          <div>
            <strong>{persistence?.status === 'granted' ? '浏览器不会自动回收本应用数据' : persistence?.status === 'unsupported' ? '当前浏览器不支持持久存储申请' : '浏览器暂未授予持久存储'}</strong>
            <span>{latestSnapshot ? `最近恢复点：${formatDateTime(latestSnapshot.createdAt)}` : '完成一道题后自动建立恢复点'}</span>
          </div>
        </div>
        <div className="backup-actions">
          {persistence?.status !== 'granted' && <button type="button" className="button button-secondary" onClick={retryPersistence} disabled={busy}><RefreshCcw size={17} />重新申请保护</button>}
          <button type="button" className="button button-secondary" onClick={recoverSnapshot} disabled={busy || !latestSnapshot}><ArchiveRestore size={17} />恢复最近记录</button>
        </div>
      </section>

      <section className="section-block backup-section">
        <div className="section-heading"><div><p className="eyebrow"><Database size={14} /> 数据保险箱</p><h2>图片与进度完整备份</h2></div></div>
        <div className="data-summary">
          <span><strong>{problemCount}</strong> 题卡</span><span><strong>{imageCount}</strong> 图片</span>
          {storage && <span><strong>{formatBytes(storage.usage)}</strong> 已用</span>}
        </div>
        <p className="section-note">完整 JSON 包含题目、原图、解析、做题历史、个人头像、灵石、坊市物品、斗气境界、称号与奖励卡。{lastBackup ? `上次导出：${formatDateTime(lastBackup)}` : '尚未导出外部备份。'}</p>
        <div className="backup-actions">
          <button type="button" className="button button-primary" onClick={exportData} disabled={busy}><Download size={18} />导出完整备份</button>
          <label className={`button button-secondary ${busy ? 'disabled' : ''}`}><Upload size={18} />导入备份<input type="file" accept="application/json,.json" onChange={importData} disabled={busy} /></label>
        </div>
        <label className="check-row">
          <input type="checkbox" checked={replaceExisting} onChange={(event) => setReplaceExisting(event.target.checked)} />
          <span><ArchiveRestore size={17} />导入前清空本机数据（默认关闭，即同 ID 合并）</span>
        </label>
      </section>

      <section className="section-block install-section">
        <div className="section-title"><Smartphone size={20} /><div><h2>{isStandalone ? '已安装到手机桌面' : '安装到手机桌面'}</h2><p>安装后全屏启动，并可离线做题</p></div></div>
        {isStandalone ? (
          <div className="install-hint success"><CheckCircle2 size={20} /><p>当前正以独立应用模式运行，题库与浏览器站点数据保持一致。</p></div>
        ) : isWechat ? (
          <div className="install-hint"><CloudOff size={20} /><p>微信内可以刷题，但不能直接安装。请点右上角菜单，选择“在浏览器打开”，再按系统提示添加到桌面。</p></div>
        ) : canInstall ? (
          <button type="button" className="button button-accent button-full" onClick={onInstall}><Smartphone size={18} />立即安装应用</button>
        ) : (
          <div className="install-hint"><CloudOff size={20} /><p>iPhone 使用 Safari“分享 → 添加到主屏幕”；Android 使用浏览器菜单中的“安装应用”。</p></div>
        )}
        {storage && storage.quota > 0 && <div className="storage-note"><HardDrive size={15} />浏览器可用空间约 {formatBytes(storage.quota)}</div>}
      </section>

      <section className="section-block update-section">
        <div className="section-title"><RefreshCw size={20} /><div><h2>版本与在线升级</h2><p>当前 v{appVersion} · 更新不会清除本机题库和记录</p></div></div>
        <button type="button" className="button button-secondary button-full" onClick={onCheckUpdate}><RefreshCcw size={17} />检查新版本</button>
      </section>

      <p className="privacy-note">记录会持续保存在当前浏览器的 IndexedDB。清除站点数据、无痕模式或更换浏览器仍会丢失本机副本，因此外部备份是最终保险。</p>
    </main>
  )
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`
}

function formatDateTime(value: number | string) {
  return new Intl.DateTimeFormat('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(value))
}
