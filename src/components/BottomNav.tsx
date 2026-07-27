import { BookOpen, House, Library, Plus, Trophy } from 'lucide-react'

export type Screen = 'home' | 'review' | 'library' | 'form' | 'profile'

interface BottomNavProps {
  active: Screen
  onNavigate: (screen: Screen) => void
}

const items = [
  { id: 'home' as const, label: '首页', Icon: House },
  { id: 'review' as const, label: '复习', Icon: BookOpen },
  { id: 'form' as const, label: '新增', Icon: Plus, prominent: true },
  { id: 'library' as const, label: '题库', Icon: Library },
  { id: 'profile' as const, label: '战绩', Icon: Trophy }
]

export function BottomNav({ active, onNavigate }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="主导航">
      {items.map(({ id, label, Icon, prominent }) => (
        <button
          type="button"
          key={id}
          className={`${active === id ? 'active' : ''} ${prominent ? 'nav-prominent' : ''}`}
          aria-current={active === id ? 'page' : undefined}
          onClick={() => onNavigate(id)}
        >
          <span className="nav-icon"><Icon size={21} strokeWidth={2.2} aria-hidden="true" /></span>
          <span>{label}</span>
        </button>
      ))}
    </nav>
  )
}
