import { useEffect, useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import {
  Award,
  BookOpenCheck,
  Check,
  ChevronRight,
  CircleUserRound,
  Coins,
  Gem,
  LockKeyhole,
  Map,
  PackageCheck,
  ScrollText,
  Shield,
  ShoppingBag,
  Sparkles,
  Swords,
  Target,
  UserRoundSearch,
  X
} from 'lucide-react'
import { CharacterPortrait } from '../components/CharacterPortrait'
import { ShopItemArt, SpiritStoneIcon, TitleBadgeArt } from '../components/GameCollectibleArt'
import { PlayerAvatar } from '../components/PlayerAvatar'
import { CharacterArchive, STORY_ROLE_LABELS, StoryPanel } from '../components/StoryPanel'
import { db, defaultProfile, equipShopItem, equipTechnique, purchaseShopItem } from '../db'
import { CULTIVATION_TECHNIQUES, getTechniqueProgress } from '../domain/cultivation'
import { getBondStatus, STORY_ENCOUNTERS } from '../domain/encounters'
import { getRealmProgress, getTitleStatuses, SHOP_ITEMS } from '../domain/gamification'
import {
  getRomanceRouteStatus,
  getStoryProgress,
  ROMANCE_ROUTES,
  STORY_CHAPTERS,
  STORY_CHARACTERS,
  type RomanceRouteId,
  type StoryCharacter,
  type StoryRole
} from '../domain/story'
import type { ShopItem, ShopItemCategory } from '../types'
import { playSound, setBackgroundMusicScene } from '../utils/sound'

interface WorldPageProps {
  notify: (message: string) => void
  onPractice: () => void
}

type WorldTab = 'characters' | 'market' | 'missions'
type CharacterFilter = 'all' | Exclude<StoryRole, 'protagonist'>
type MissionView = 'story' | 'challenge' | 'technique' | 'honor'

const worldTabs = [
  { id: 'characters' as const, label: '人物', Icon: CircleUserRound },
  { id: 'market' as const, label: '坊市', Icon: ShoppingBag },
  { id: 'missions' as const, label: '任务', Icon: Target }
]

const characterFilters: { id: CharacterFilter; label: string }[] = [
  { id: 'all', label: '全部' },
  { id: 'family', label: '家人' },
  { id: 'romance', label: '情缘' },
  { id: 'friend', label: '益友' },
  { id: 'rival', label: '宿敌' },
  { id: 'mentor', label: '引路人' },
  { id: 'classmate', label: '同学' },
  { id: 'stranger', label: '途中相遇' }
]

const shopCategories: { id: 'all' | ShopItemCategory; label: string }[] = [
  { id: 'all', label: '全部' },
  { id: 'outfit', label: '战衣' },
  { id: 'aura', label: '气息' },
  { id: 'weapon', label: '武器' },
  { id: 'accessory', label: '配饰' },
  { id: 'companion', label: '灵体' }
]

const slotLabels: Record<ShopItemCategory, string> = {
  outfit: '战衣',
  aura: '气息',
  weapon: '武器',
  accessory: '配饰',
  companion: '灵体'
}

const missionViews = [
  { id: 'story' as const, label: '主线', Icon: Map },
  { id: 'challenge' as const, label: '挑战', Icon: Swords },
  { id: 'technique' as const, label: '功法', Icon: ScrollText },
  { id: 'honor' as const, label: '荣誉', Icon: Award }
]

function isUnlockedCharacter(character: StoryCharacter, totalReviews: number) {
  return character.role === 'protagonist' || totalReviews >= character.unlockAt
}

function nextBondLabel(points: number) {
  if (points < 8) return `再获得 ${8 - points} 羁绊进入“留下印象”`
  if (points < 16) return `再获得 ${16 - points} 羁绊进入“彼此信任”`
  if (points < 32) return `再获得 ${32 - points} 羁绊进入“并肩知己”`
  if (points < 48) return `再获得 ${48 - points} 羁绊进入“生死相托”`
  return '羁绊已抵达最高阶段'
}

export function WorldPage({ notify, onPractice }: WorldPageProps) {
  const profile = useLiveQuery(() => db.profiles.get('player'), [], defaultProfile) || defaultProfile
  const rewards = useLiveQuery(() => db.rewards.orderBy('earnedAt').reverse().limit(12).toArray(), [], [])
  const routeSetting = useLiveQuery(() => db.settings.get('active-romance-route'))
  const [tab, setTab] = useState<WorldTab>('characters')
  const [characterFilter, setCharacterFilter] = useState<CharacterFilter>('all')
  const [selectedCharacter, setSelectedCharacter] = useState<StoryCharacter>()
  const [shopCategory, setShopCategory] = useState<'all' | ShopItemCategory>('all')
  const [ownedOnly, setOwnedOnly] = useState(false)
  const [selectedItem, setSelectedItem] = useState<ShopItem>()
  const [purchaseBurst, setPurchaseBurst] = useState(false)
  const [missionView, setMissionView] = useState<MissionView>('story')
  const [showAllChapters, setShowAllChapters] = useState(false)
  const realm = getRealmProgress(profile.xp)
  const story = getStoryProgress(profile)
  const titleStatuses = getTitleStatuses(profile)
  const activeRouteId = routeSetting?.value as RomanceRouteId | undefined
  const currentChapterIndex = STORY_CHAPTERS.findIndex((chapter) => chapter.id === story.current.id)
  const visibleChapters = showAllChapters
    ? STORY_CHAPTERS
    : STORY_CHAPTERS.slice(Math.max(0, currentChapterIndex - 2), Math.min(STORY_CHAPTERS.length, currentChapterIndex + 4))

  const visibleCharacters = useMemo(() => STORY_CHARACTERS.filter((character) => (
    characterFilter === 'all' || character.role === characterFilter
  )), [characterFilter])

  const visibleShopItems = useMemo(() => SHOP_ITEMS.filter((item) => (
    (shopCategory === 'all' || item.category === shopCategory)
      && (!ownedOnly || profile.ownedItemIds.includes(item.id))
  )), [ownedOnly, profile.ownedItemIds, shopCategory])

  useEffect(() => {
    setBackgroundMusicScene(tab === 'market' ? 'market' : tab === 'missions' && missionView === 'challenge' ? 'battle' : 'journey')
  }, [missionView, tab])

  function changeTab(next: WorldTab) {
    setTab(next)
    playSound(next === 'market' ? 'market-open' : next === 'missions' ? 'mission-open' : 'world-open')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function isEquipped(item: ShopItem) {
    return item.id === profile.equippedOutfitId
      || item.id === profile.equippedAuraId
      || item.id === profile.equippedWeaponId
      || item.id === profile.equippedAccessoryId
      || item.id === profile.activeCompanionId
  }

  function equipmentFor(category: ShopItemCategory) {
    const id = category === 'outfit' ? profile.equippedOutfitId
      : category === 'aura' ? profile.equippedAuraId
        : category === 'weapon' ? profile.equippedWeaponId
          : category === 'accessory' ? profile.equippedAccessoryId
            : profile.activeCompanionId
    return SHOP_ITEMS.find((item) => item.id === id)
  }

  async function buyItem(item: ShopItem) {
    try {
      await purchaseShopItem(item.id)
      setPurchaseBurst(true)
      playSound('purchase')
      window.setTimeout(() => setPurchaseBurst(false), 700)
      notify(`已购入 ${item.name}，可随时装备`)
    } catch (error) {
      playSound('wrong')
      notify(error instanceof Error ? error.message : '购买失败')
    }
  }

  async function equipItem(item: ShopItem) {
    try {
      await equipShopItem(item.id)
      playSound('equip')
      notify(`已装备：${item.name}`)
      setSelectedItem(undefined)
    } catch (error) {
      notify(error instanceof Error ? error.message : '装备失败')
    }
  }

  async function chooseTechnique(techniqueId: string) {
    try {
      const next = await equipTechnique(techniqueId)
      const technique = CULTIVATION_TECHNIQUES.find((item) => item.id === next.activeTechniqueId)
      playSound('equip')
      notify(`已运转功法：${technique?.name}`)
    } catch (error) {
      notify(error instanceof Error ? error.message : '功法装备失败')
    }
  }

  async function chooseTitle(title: string) {
    await db.profiles.update('player', { selectedTitle: title })
    playSound('equip')
    notify(`已佩戴称号：${title}`)
  }

  return (
    <main className="page world-page">
      <header className="world-hero">
        <div className="world-avatar"><PlayerAvatar profile={profile} /></div>
        <div className="world-identity">
          <p className="eyebrow">何耀焜的修炼世界</p>
          <h1>斗界</h1>
          <strong>{realm.label} · {profile.selectedTitle}</strong>
          <div className="quest-track"><span style={{ width: `${realm.progressPercent}%` }} /></div>
          <small>{realm.isPeak ? '斗帝巅峰' : `距下一星 ${realm.xpForStar - realm.xpIntoStar} 经验`}</small>
        </div>
        <div className="world-currency"><SpiritStoneIcon size="sm" /><strong>{profile.coins}</strong><span>灵石</span></div>
      </header>

      <nav className="world-tabs" aria-label="斗界功能">
        {worldTabs.map(({ id, label, Icon }) => (
          <button type="button" className={tab === id ? 'active' : ''} aria-current={tab === id ? 'page' : undefined} onClick={() => changeTab(id)} key={id}>
            <Icon size={18} /><span>{label}</span>
          </button>
        ))}
      </nav>

      {tab === 'characters' && (
        <div className="world-content characters-world">
          <StoryPanel profile={profile} />

          <section className="world-section character-roster-section">
            <div className="world-section-heading">
              <div><p className="eyebrow"><UserRoundSearch size={14} /> 人物志</p><h2>相遇与羁绊</h2></div>
              <strong>{STORY_CHARACTERS.filter((character) => isUnlockedCharacter(character, profile.totalReviews)).length}/{STORY_CHARACTERS.length}</strong>
            </div>
            <div className="horizontal-filters" role="tablist" aria-label="人物阵营">
              {characterFilters.map((filter) => <button type="button" role="tab" aria-selected={characterFilter === filter.id} className={characterFilter === filter.id ? 'active' : ''} onClick={() => setCharacterFilter(filter.id)} key={filter.id}>{filter.label}</button>)}
            </div>
            <div className="world-character-grid">
              {visibleCharacters.map((character) => {
                const unlocked = isUnlockedCharacter(character, profile.totalReviews)
                const bond = profile.characterBonds[character.id] || 0
                const route = ROMANCE_ROUTES.find((candidate) => candidate.id === character.id)
                const relation = route ? getRomanceRouteStatus(route, profile.totalReviews).label : character.role === 'protagonist' ? realm.realm : getBondStatus(bond)
                return (
                  <button type="button" className={`world-character ${unlocked ? '' : 'locked'} role-${character.role}`} disabled={!unlocked} onClick={() => { playSound('character-open'); setSelectedCharacter(character) }} key={character.id}>
                    <span className="world-character-portrait"><CharacterPortrait character={character} pose={character.role === 'rival' ? 'challenge' : 'idle'} /></span>
                    <span className="world-character-copy">
                      <small>{STORY_ROLE_LABELS[character.role]}</small>
                      <strong>{unlocked ? character.name : '尚未相遇'}</strong>
                      <em>{unlocked ? relation : `完成 ${character.unlockAt} 题解锁`}</em>
                      {unlocked && character.role !== 'protagonist' && <i>{nextBondLabel(bond)}</i>}
                    </span>
                    {unlocked ? <ChevronRight size={18} /> : <LockKeyhole size={17} />}
                  </button>
                )
              })}
            </div>
          </section>
        </div>
      )}

      {tab === 'market' && (
        <div className="world-content market-world">
          <section className="equipment-strip" aria-label="当前装备">
            <div className="world-section-heading"><div><p className="eyebrow"><Shield size={14} /> 当前装束</p><h2>何耀焜的装备栏</h2></div><strong><SpiritStoneIcon size="sm" /> {profile.coins}</strong></div>
            <div className="equipment-slots">
              {(Object.keys(slotLabels) as ShopItemCategory[]).map((category) => {
                const item = equipmentFor(category)
                return <button type="button" onClick={() => item && setSelectedItem(item)} key={category}><small>{slotLabels[category]}</small><strong>{item?.name || '未装备'}</strong></button>
              })}
            </div>
          </section>

          <section className="world-section market-catalogue">
            <div className="world-section-heading"><div><p className="eyebrow"><ShoppingBag size={14} /> 黑角坊市</p><h2>用做题所得换取装扮</h2></div><label className="owned-filter"><input type="checkbox" checked={ownedOnly} onChange={(event) => setOwnedOnly(event.target.checked)} /><span>仅已拥有</span></label></div>
            <div className="horizontal-filters shop-world-filters" role="tablist" aria-label="商品分类">
              {shopCategories.map((category) => <button type="button" role="tab" aria-selected={shopCategory === category.id} className={shopCategory === category.id ? 'active' : ''} onClick={() => setShopCategory(category.id)} key={category.id}>{category.label}</button>)}
            </div>
            <div className="world-shop-grid">
              {visibleShopItems.map((item) => {
                const owned = profile.ownedItemIds.includes(item.id)
                const equipped = isEquipped(item)
                return (
                  <button type="button" className={`world-shop-item ${equipped ? 'equipped' : ''}`} onClick={() => { playSound('market-open'); setSelectedItem(item) }} key={item.id}>
                    <ShopItemArt item={item} />
                    <span><small>{slotLabels[item.category]}{equipped ? ' · 使用中' : ''}</small><strong>{item.name}</strong></span>
                    <b>{owned ? <><PackageCheck size={14} /> 已拥有</> : <><SpiritStoneIcon size="sm" /> {item.price}</>}</b>
                  </button>
                )
              })}
            </div>
          </section>
        </div>
      )}

      {tab === 'missions' && (
        <div className="world-content missions-world">
          <section className="mission-command">
            <div><p className="eyebrow">当前主线 · {story.current.act}</p><h2>{story.current.title}</h2><p>{story.current.objective}</p></div>
            <button type="button" className="button button-accent" onClick={onPractice}><Swords size={18} />进入训练</button>
          </section>
          <nav className="mission-tabs" aria-label="任务分类">
            {missionViews.map(({ id, label, Icon }) => <button type="button" className={missionView === id ? 'active' : ''} onClick={() => { setMissionView(id); playSound(id === 'challenge' ? 'challenge-unlock' : 'mission-open') }} key={id}><Icon size={17} />{label}</button>)}
          </nav>

          {missionView === 'story' && (
            <section className="world-section mission-list-section">
              <div className="world-section-heading"><div><p className="eyebrow"><Map size={14} /> 交大之路</p><h2>主线章节</h2></div><strong>{story.unlocked.length}/{STORY_CHAPTERS.length}</strong></div>
              <div className="story-timeline">
                {visibleChapters.map((chapter) => {
                  const unlocked = profile.totalReviews >= chapter.threshold
                  const current = chapter.id === story.current.id
                  return <article className={`${unlocked ? 'unlocked' : 'locked'} ${current ? 'current' : ''}`} key={chapter.id}><span>{unlocked ? <Check size={15} /> : <LockKeyhole size={14} />}</span><div><small>{chapter.act} · {chapter.location}</small><strong>{chapter.title}</strong><p>{unlocked ? chapter.objective : `累计完成 ${chapter.threshold} 题解锁`}</p></div>{current && <b>当前</b>}</article>
                })}
              </div>
              <button type="button" className="timeline-toggle" onClick={() => setShowAllChapters((current) => !current)}>{showAllChapters ? '收起章节' : `查看完整 ${STORY_CHAPTERS.length} 章`}<ChevronRight size={17} /></button>
            </section>
          )}

          {missionView === 'challenge' && (
            <section className="world-section mission-list-section">
              <div className="world-section-heading"><div><p className="eyebrow"><Swords size={14} /> 抉择事件</p><h2>对手与同行者的挑战</h2></div><strong>{Object.keys(profile.storyChoices).length}/{STORY_ENCOUNTERS.length}</strong></div>
              <div className="challenge-list">
                {STORY_ENCOUNTERS.map((encounter) => {
                  const unlocked = profile.totalReviews >= encounter.threshold
                  const completed = Boolean(profile.storyChoices[encounter.id])
                  const character = STORY_CHARACTERS.find((item) => item.id === encounter.characterId)
                  return <article className={`${unlocked ? '' : 'locked'} ${completed ? 'completed' : ''}`} key={encounter.id}><span>{character && <CharacterPortrait character={character} pose={character.role === 'rival' ? 'challenge' : 'idle'} />}</span><div><small>{character?.name || '未知来客'} · {encounter.threshold} 题</small><strong>{encounter.title}</strong><p>{completed ? '抉择已完成，羁绊与奖励已结算' : unlocked ? '回到人物页进入当前剧情，作出你的选择' : `还需完成 ${encounter.threshold - profile.totalReviews} 题`}</p></div>{completed ? <Check size={18} /> : unlocked ? <ChevronRight size={18} /> : <LockKeyhole size={16} />}</article>
                })}
              </div>
            </section>
          )}

          {missionView === 'technique' && (
            <section className="world-section mission-list-section">
              <div className="world-section-heading"><div><p className="eyebrow"><ScrollText size={14} /> 功法阁</p><h2>选择本轮做题加成</h2></div></div>
              <div className="technique-world-list">
                {CULTIVATION_TECHNIQUES.map((technique) => {
                  const unlocked = technique.unlocked(profile)
                  const active = profile.activeTechniqueId === technique.id
                  const progress = getTechniqueProgress(profile.techniqueMastery[technique.id] || 0)
                  return <button type="button" className={`${active ? 'active' : ''} ${unlocked ? '' : 'locked'}`} disabled={!unlocked} onClick={() => chooseTechnique(technique.id)} key={technique.id}><span>{unlocked ? progress.level : <LockKeyhole size={16} />}</span><div><small>{technique.school}</small><strong>{technique.name}</strong><p>{technique.description}</p><em>{unlocked ? `熟练度 ${progress.mastery}${progress.nextLevelAt ? `/${progress.nextLevelAt}` : ' · 圆满'}` : technique.unlockLabel}</em></div><b>{active ? '运转中' : unlocked ? '装备' : '未解锁'}</b></button>
                })}
              </div>
            </section>
          )}

          {missionView === 'honor' && (
            <section className="world-section mission-list-section">
              <div className="world-section-heading"><div><p className="eyebrow"><Award size={14} /> 荣誉殿</p><h2>称号与知识卡</h2></div><strong>{titleStatuses.filter((title) => title.isUnlocked).length}/{titleStatuses.length}</strong></div>
              <div className="world-title-grid">
                {titleStatuses.map((title, index) => <button type="button" className={`${title.isUnlocked ? '' : 'locked'} ${profile.selectedTitle === title.name ? 'selected' : ''}`} disabled={!title.isUnlocked} onClick={() => chooseTitle(title.name)} key={title.name}><TitleBadgeArt title={title.name} index={index} locked={!title.isUnlocked} /><span><strong>{title.name}</strong><small>{title.isUnlocked ? profile.selectedTitle === title.name ? '当前佩戴' : '点击佩戴' : title.requirement}</small></span></button>)}
              </div>
              <div className="reward-vault-heading"><Sparkles size={17} /><div><strong>最近获得的知识卡</strong><small>每次真实完成，都留下可见战利品</small></div></div>
              {rewards.length ? <div className="world-reward-strip">{rewards.map((reward) => <article className={`rarity-${reward.rarity}`} key={reward.id}><Gem size={21} /><small>{reward.rarity}</small><strong>{reward.name}</strong><p>{reward.description}</p></article>)}</div> : <div className="empty-inline"><BookOpenCheck size={18} />完成第一题后，第一张知识卡会在这里出现。</div>}
            </section>
          )}
        </div>
      )}

      {selectedCharacter && <CharacterArchive character={selectedCharacter} profile={profile} activeRouteId={activeRouteId} onClose={() => setSelectedCharacter(undefined)} />}

      {selectedItem && (
        <div className="shop-detail-backdrop" role="dialog" aria-modal="true" aria-labelledby="shop-detail-title" onMouseDown={(event) => event.target === event.currentTarget && setSelectedItem(undefined)}>
          <section className={`shop-detail-sheet ${purchaseBurst ? 'purchase-success' : ''}`}>
            <button type="button" className="shop-detail-close" onClick={() => setSelectedItem(undefined)} aria-label="关闭商品详情"><X size={20} /></button>
            <div className="shop-detail-art"><ShopItemArt item={selectedItem} />{purchaseBurst && <span className="purchase-banner"><Sparkles size={22} />购入成功</span>}</div>
            <small>{slotLabels[selectedItem.category]} · 黑角坊市</small>
            <h2 id="shop-detail-title">{selectedItem.name}</h2>
            <p>{selectedItem.description}</p>
            <div className="shop-detail-price"><Coins size={18} /><span>售价</span><strong><SpiritStoneIcon size="sm" /> {selectedItem.price} 灵石</strong></div>
            {profile.ownedItemIds.includes(selectedItem.id) ? (
              <button type="button" className="button button-accent button-full" onClick={() => equipItem(selectedItem)} disabled={isEquipped(selectedItem)}>{isEquipped(selectedItem) ? <><Check size={18} />当前使用中</> : <><Shield size={18} />立即装备</>}</button>
            ) : (
              <button type="button" className="button button-accent button-full" onClick={() => buyItem(selectedItem)} disabled={profile.coins < selectedItem.price}><Gem size={18} />{profile.coins >= selectedItem.price ? '确认购买' : `还差 ${selectedItem.price - profile.coins} 灵石`}</button>
            )}
          </section>
        </div>
      )}
    </main>
  )
}
