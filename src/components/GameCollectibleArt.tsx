import type { CSSProperties } from 'react'
import type { LucideIcon } from 'lucide-react'
import {
  Award,
  Bird,
  CalendarDays,
  Circle,
  Compass,
  Crown,
  Flame,
  Flower2,
  Gem,
  GraduationCap,
  Grid3X3,
  LampDesk,
  Landmark,
  Layers3,
  Map,
  MapPin,
  Orbit,
  Ribbon,
  Route,
  Ruler,
  ScrollText,
  ShieldCheck,
  Sigma,
  Sparkles,
  Star,
  Sun,
  Sword,
  Target,
  Trophy,
  WandSparkles
} from 'lucide-react'
import type { ShopItem } from '../types'

const SHOP_ICONS: Partial<Record<string, LucideIcon>> = {
  'aura-none': Circle,
  'aura-iron': Orbit,
  'aura-lotus': Flower2,
  'aura-crimson': Flame,
  'aura-emperor': Sun,
  'weapon-scroll': ScrollText,
  'weapon-ruler': Ruler,
  'weapon-compass': Compass,
  'weapon-blade': Sword,
  'weapon-emperor': WandSparkles,
  'accessory-none': Ribbon,
  'accessory-jade': Gem,
  'accessory-badge': MapPin,
  'accessory-crown': Crown,
  'companion-none': Sparkles,
  'companion-ember': Flame,
  'companion-owl': Bird,
  'companion-star': Star,
  'companion-memory': LampDesk
}

const OUTFIT_IMAGES: Partial<Record<string, string>> = {
  'outfit-apprentice': `${import.meta.env.BASE_URL}characters/hero-apprentice.webp`,
  'outfit-flame': `${import.meta.env.BASE_URL}characters/hero-standard.webp`,
  'outfit-starseer': `${import.meta.env.BASE_URL}characters/hero-standard.webp`,
  'outfit-master': `${import.meta.env.BASE_URL}characters/hero-standard.webp`,
  'outfit-jiaoda': `${import.meta.env.BASE_URL}characters/hero-jiaoda.webp`
}

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

function artStyle(color: string) {
  return { '--collectible-accent': color } as CSSProperties
}

export function ShopItemArt({ item }: { item: ShopItem }) {
  const image = OUTFIT_IMAGES[item.id]
  const Icon = SHOP_ICONS[item.id] || GraduationCap

  return (
    <span className={`shop-item-art art-${item.category} art-${item.id}`} style={artStyle(item.swatch)} aria-hidden="true">
      <span className="collectible-glow" />
      {image ? <img src={image} alt="" /> : <Icon size={44} strokeWidth={1.55} />}
      <span className="collectible-rune" />
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
