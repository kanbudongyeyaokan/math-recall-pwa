import type { LucideIcon } from 'lucide-react'
import {
  Award,
  CalendarDays,
  Crown,
  Flame,
  Gem,
  Grid3X3,
  LampDesk,
  Landmark,
  Layers3,
  Map,
  Orbit,
  Route,
  ShieldCheck,
  Sigma,
  Sparkles,
  Star,
  Sun,
  Target,
  Trophy
} from 'lucide-react'
import type { ShopItem } from '../types'

const TITLE_ICONS: readonly LucideIcon[] = [
  Flame,
  Sparkles,
  Target,
  Route,
  ShieldCheck,
  Layers3,
  CalendarDays,
  LampDesk,
  Award,
  Trophy,
  Map,
  Sigma,
  Grid3X3,
  Orbit,
  Star,
  Sun,
  Crown,
  Landmark
]

export function ShopItemArt({ item }: { item: ShopItem }) {
  const image = `${import.meta.env.BASE_URL}shop-items/${item.id}.webp`

  return (
    <span className={`shop-item-art art-${item.category} art-${item.id}`} aria-hidden="true">
      <img src={image} alt="" loading="lazy" decoding="async" />
    </span>
  )
}

export function SpiritStoneIcon({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  return (
    <span className={`spirit-stone spirit-stone-${size} ${className}`.trim()} aria-hidden="true">
      <Gem />
      <i />
    </span>
  )
}

const TITLE_TIER_CLASS: Record<string, string> = {
  '凡品': 'bronze',
  '玄品': 'jade',
  '地品': 'crimson',
  '天品': 'star',
  '帝品': 'emperor'
}

export function TitleBadgeArt({ title, index, tier, locked = false }: { title: string; index: number; tier?: string; locked?: boolean }) {
  const Icon = TITLE_ICONS[index] || Award
  const tierClass = tier ? TITLE_TIER_CLASS[tier] || 'bronze' : index < 3 ? 'bronze' : index < 7 ? 'jade' : index < 11 ? 'crimson' : index < 15 ? 'star' : 'emperor'

  return (
    <span className={`title-badge-art tier-${tierClass} ${locked ? 'is-locked' : ''}`} role="img" aria-label={`${title}${locked ? '未解锁' : '称号徽章'}`}>
      <span><Icon size={22} strokeWidth={1.8} /></span>
      <i />
    </span>
  )
}
