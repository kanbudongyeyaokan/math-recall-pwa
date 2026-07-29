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

export function TitleBadgeArt({ title, index, locked = false }: { title: string; index: number; locked?: boolean }) {
  const Icon = TITLE_ICONS[index] || Award
  const tier = index < 3 ? 'bronze' : index < 7 ? 'jade' : index < 11 ? 'crimson' : index < 15 ? 'star' : 'emperor'

  return (
    <span className={`title-badge-art tier-${tier} ${locked ? 'is-locked' : ''}`} role="img" aria-label={`${title}${locked ? '未解锁' : '称号徽章'}`}>
      <span><Icon size={22} strokeWidth={1.8} /></span>
      <i />
    </span>
  )
}
