import { House, Library, Plus, Sigma, TentTree } from 'lucide-react'

export type Screen = 'home' | 'practice' | 'review' | 'library' | 'form' | 'profile'

interface BottomNavProps {
  active: Screen
  onNavigate: (screen: Screen) => void
}

const items = [
  { id: 'home' as const, label: '首页', Icon: House },
  { id: 'practice' as const, label: '做题', Icon: Sigma },
  { id: 'form' as const, label: '新增', Icon: Plus, prominent: true },
  { id: 'library' as const, label: '题库', Icon: Library },
  { id: 'profile' as const, label: '洞府', Icon: TentTree }
]

export function BottomNav({ active, onNavigate }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="主导航">
      {items.map(({ id, label, Icon, prominent }) => {
        const isActive = active === id || (active === 'review' && id === 'practice')
        return (
        <button
          type="button"
          key={id}
          className={`${isActive ? 'active' : ''} ${prominent ? 'nav-prominent' : ''}`}
          aria-current={isActive ? 'page' : undefined}
          onClick={() => onNavigate(id)}
        >
          <span className="nav-icon"><Icon size={21} strokeWidth={2.2} aria-hidden="true" /></span>
          <span>{label}</span>
        </button>
        )
      })}
    </nav>
  )
}
