import { ChangeEvent, useEffect, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import {
  ArchiveRestore,
  Award,
  Camera,
  Check,
  CheckCircle2,
  CloudOff,
  Coins,
  Database,
  Download,
  HardDrive,
  Layers3,
  LockKeyhole,
  RefreshCcw,
  RefreshCw,
  ScrollText,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Upload
} from 'lucide-react'
import { db, defaultProfile, equipShopItem, equipTechnique, purchaseShopItem, requestPersistentStorage, restoreLatestSnapshot, saveImage } from '../db'
import { CULTIVATION_TECHNIQUES, getTechniqueProgress } from '../domain/cultivation'
import { getRealmProgress, getTitleStatuses, SHOP_ITEMS } from '../domain/gamification'
import type { ShopItem, ShopItemCategory, StoragePersistenceState } from '../types'
import { downloadBackup, restoreBackup } from '../utils/backup'
import { PlayerAvatar } from '../components/PlayerAvatar'

interface ProfilePageProps {
  canInstall: boolean
  isStandalone: boolean
  isWechat: boolean
  onInstall: () => Promise<void>
  onCheckUpdate: () => Promise<void>
  appVersion: string
  notify: (message: string) => void
}

const rarityLabel = { common: '普通', rare: '稀有', epic: '史诗', legendary: '传奇' }
const shopCategories: { id: ShopItemCategory; label: string }[] = [
  { id: 'outfit', label: '战衣' },
  { id: 'aura', label: '气息' },
  { id: 'weapon', label: '武器' },
  { id: 'accessory', label: '配饰' },
  { id: 'companion', label: '灵体' }
]

export function ProfilePage({ canInstall, isStandalone, isWechat, onInstall, onCheckUpdate, appVersion, notify }: ProfilePageProps) {
  const profile = useLiveQuery(() => db.profiles.get('player'), [], defaultProfile) || defaultProfile
  const rewards = useLiveQuery(() => db.rewards.orderBy('earnedAt').reverse().limit(20).toArray(), [], [])
  const rewardCount = useLiveQuery(() => db.rewards.count(), [], 0)
  const problemCount = useLiveQuery(() => db.problems.count(), [], 0)
  const imageCount = useLiveQuery(() => db.images.count(), [], 0)
  const persistenceRecord = useLiveQuery(() => db.settings.get('storage-persistence'))
  const lastBackupRecord = useLiveQuery(() => db.settings.get('last-external-backup-at'))
  const latestSnapshot = useLiveQuery(() => db.snapshots.orderBy('createdAt').last())
  const [replaceExisting, setReplaceExisting] = useState(false)
  const [busy, setBusy] = useState(false)
  const [shopCategory, setShopCategory] = useState<ShopItemCategory>('outfit')
  const [storage, setStorage] = useState<{ usage: number; quota: number }>()
  const realm = getRealmProgress(profile.xp)
  const titleStatuses = getTitleStatuses(profile)
  const persistence = persistenceRecord?.value as StoragePersistenceState | undefined
  const lastBackup = lastBackupRecord?.value as string | undefined

  function isEquipped(item: ShopItem) {
    return item.id === profile.equippedOutfitId
      || item.id === profile.equippedAuraId
      || item.id === profile.equippedWeaponId
      || item.id === profile.equippedAccessoryId
      || item.id === profile.activeCompanionId
  }

  useEffect(() => {
    navigator.storage?.estimate().then((estimate) => {
      setStorage({ usage: estimate.usage || 0, quota: estimate.quota || 0 })
    }).catch(() => undefined)
  }, [imageCount])

  async function chooseTitle(title: string) {
    await db.profiles.update('player', { selectedTitle: title })
    notify(`已佩戴称号：${title}`)
  }

  async function chooseTechnique(techniqueId: string) {
    try {
      const next = await equipTechnique(techniqueId)
      const technique = CULTIVATION_TECHNIQUES.find((item) => item.id === next.activeTechniqueId)
      notify(`已运转功法：${technique?.name}`)
    } catch (error) {
      notify(error instanceof Error ? error.message : '功法装备失败')
    }
  }

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

  async function handleShopItem(item: ShopItem) {
    const owned = profile.ownedItemIds.includes(item.id)
    try {
      if (!owned) {
        if (!window.confirm(`花费 ${item.price} 灵石购买“${item.name}”吗？`)) return
        await purchaseShopItem(item.id)
      }
      await equipShopItem(item.id)
      notify(owned ? `已装备：${item.name}` : `购买成功并装备：${item.name}`)
    } catch (error) {
      notify(error instanceof Error ? error.message : '操作失败')
    }
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

      <section className="section-block technique-section">
        <div className="section-heading"><div><p className="eyebrow"><ScrollText size={14} /> 功法阁</p><h2>选择本轮修炼加成</h2></div></div>
        <div className="technique-list">
          {CULTIVATION_TECHNIQUES.map((technique) => {
            const unlocked = technique.unlocked(profile)
            const active = profile.activeTechniqueId === technique.id
            const progress = getTechniqueProgress(profile.techniqueMastery[technique.id] || 0)
            return (
              <button type="button" className={`technique-item ${active ? 'active' : ''} ${unlocked ? '' : 'locked'}`} disabled={!unlocked} onClick={() => chooseTechnique(technique.id)} key={technique.id}>
                <span className="technique-seal">{unlocked ? progress.level : <LockKeyhole size={16} />}</span>
                <span><strong>{technique.name}<small>{technique.school}</small></strong><p>{technique.description}</p><em>{unlocked ? `${technique.triggerLabel} · 熟练度 ${progress.mastery}${progress.nextLevelAt ? `/${progress.nextLevelAt}` : ' · 圆满'}` : technique.unlockLabel}</em></span>
                <b>{active ? '运转中' : unlocked ? '装备' : '未解锁'}</b>
              </button>
            )
          })}
        </div>
      </section>

      <section className="section-block avatar-section">
        <div className="section-heading">
          <div><p className="eyebrow"><ShoppingBag size={14} /> 个人形象与坊市</p><h2>做题赚灵石，装扮何耀焜</h2></div>
          <strong className="coin-balance"><Coins size={16} /> {profile.coins}</strong>
        </div>
        <div className="avatar-actions">
          <label className={`button button-secondary ${busy ? 'disabled' : ''}`}><Camera size={17} />上传本人头像<input type="file" accept="image/*" onChange={uploadAvatar} disabled={busy} /></label>
          {profile.avatarImageId && <button type="button" className="button button-secondary" onClick={removeAvatar} disabled={busy}>使用修炼形象</button>}
        </div>
        <div className="shop-category-tabs" role="tablist" aria-label="坊市分类">
          {shopCategories.map((category) => (
            <button type="button" role="tab" aria-selected={shopCategory === category.id} className={shopCategory === category.id ? 'active' : ''} onClick={() => setShopCategory(category.id)} key={category.id}>
              {category.label}<small>{SHOP_ITEMS.filter((item) => item.category === category.id).length}</small>
            </button>
          ))}
        </div>
        <div className="shop-list">
          {SHOP_ITEMS.filter((item) => item.category === shopCategory).map((item) => {
            const owned = profile.ownedItemIds.includes(item.id)
            const equipped = isEquipped(item)
            return (
              <button type="button" className={`shop-item ${equipped ? 'equipped' : ''}`} key={item.id} onClick={() => handleShopItem(item)}>
                <span className="shop-swatch" style={{ background: item.swatch }} />
                <span><strong>{item.name}</strong><small>{item.description}</small></span>
                <b>{equipped ? '装备中' : owned ? '装备' : `${item.price} 灵石`}</b>
              </button>
            )
          })}
        </div>
        <p className="section-note">每道题每天首次完成会结算灵石；选择题答对另有奖励，同题反复点击不会重复结算。</p>
      </section>

      <section className="section-block title-section">
        <div className="section-heading"><div><p className="eyebrow"><Sparkles size={14} /> 称号库</p><h2>用真实做题解锁</h2></div></div>
        <div className="title-list">
          {titleStatuses.map((title) => (
            <button
              type="button"
              key={title.name}
              className={`${profile.selectedTitle === title.name ? 'selected' : ''} ${title.isUnlocked ? '' : 'locked'}`}
              onClick={() => title.isUnlocked && chooseTitle(title.name)}
              disabled={!title.isUnlocked}
            >
              {title.isUnlocked ? <Award size={17} /> : <LockKeyhole size={17} />}
              <span><strong>{title.name}</strong><small>{title.isUnlocked ? '已解锁' : title.requirement}</small></span>
              {profile.selectedTitle === title.name && <Check size={16} />}
            </button>
          ))}
        </div>
      </section>

      <section className="section-block collection-section">
        <div className="section-heading"><div><p className="eyebrow"><Layers3 size={14} /> 知识卡收藏</p><h2>最近获得</h2></div><strong>{rewardCount}</strong></div>
        {rewards.length ? (
          <div className="reward-collection">
            {rewards.map((reward) => (
              <article className={`collection-card rarity-${reward.rarity}`} key={reward.id}>
                <div><Layers3 size={22} /></div>
                <span>{rarityLabel[reward.rarity]}</span>
                <h3>{reward.name}</h3>
                <p>{reward.description}</p>
              </article>
            ))}
          </div>
        ) : <p className="section-note">完成第一道题，就会掉落第一张知识卡。</p>}
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
