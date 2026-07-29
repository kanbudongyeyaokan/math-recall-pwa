import { Fragment, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Maximize2, Minus, Plus, X } from 'lucide-react'
import { BlockMath, InlineMath } from 'react-katex'

interface MathTextProps {
  text: string
  className?: string
}

const MATH_DELIMITER = /(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$)/g
const MIN_FORMULA_SCALE = 0.8
const MAX_FORMULA_SCALE = 1.8

interface FormulaViewerProps {
  formula: string
  onClose: () => void
}

function FormulaViewer({ formula, onClose }: FormulaViewerProps) {
  const [scale, setScale] = useState(1.1)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  function adjustScale(delta: number) {
    setScale((current) => Math.min(MAX_FORMULA_SCALE, Math.max(MIN_FORMULA_SCALE, Number((current + delta).toFixed(1)))))
  }

  return (
    <div className="formula-viewer-backdrop" role="dialog" aria-modal="true" aria-labelledby="formula-viewer-title" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="formula-viewer">
        <header>
          <div><span>公式查看器</span><strong id="formula-viewer-title">横向拖动查看完整公式</strong></div>
          <button ref={closeButtonRef} type="button" className="icon-button" onClick={onClose} aria-label="关闭公式查看器"><X size={20} /></button>
        </header>
        <div className="formula-viewer-canvas">
          <div style={{ fontSize: `${scale}rem` }}>
            <BlockMath math={formula} renderError={() => <code>{formula}</code>} />
          </div>
        </div>
        <footer>
          <button type="button" className="icon-button" onClick={() => adjustScale(-0.1)} disabled={scale <= MIN_FORMULA_SCALE} aria-label="缩小公式"><Minus size={19} /></button>
          <span>{Math.round(scale * 100)}%</span>
          <button type="button" className="icon-button" onClick={() => adjustScale(0.1)} disabled={scale >= MAX_FORMULA_SCALE} aria-label="放大公式"><Plus size={19} /></button>
        </footer>
      </section>
    </div>
  )
}

export function MathText({ text, className = '' }: MathTextProps) {
  const [activeFormula, setActiveFormula] = useState<string>()
  const formulaTriggerRef = useRef<HTMLButtonElement | null>(null)
  const parts = text.split(MATH_DELIMITER)

  function openFormula(formula: string, trigger: HTMLButtonElement) {
    formulaTriggerRef.current = trigger
    setActiveFormula(formula)
  }

  function closeFormula() {
    setActiveFormula(undefined)
    window.requestAnimationFrame(() => formulaTriggerRef.current?.focus())
  }

  return (
    <>
      <div className={`math-text ${className}`.trim()}>
        {parts.map((part, index) => {
          if (part.startsWith('$$') && part.endsWith('$$')) {
            const formula = part.slice(2, -2).trim()
            return (
              <div className="math-block-shell" key={index}>
                <div className="math-block-scroll" tabIndex={0} role="region" aria-label="可横向滚动的数学公式">
                  <BlockMath math={formula} renderError={() => <code>{part}</code>} />
                </div>
                <button type="button" className="math-expand-button" onClick={(event) => openFormula(formula, event.currentTarget)} aria-label="全屏查看这条公式" title="全屏查看公式">
                  <Maximize2 size={15} />
                </button>
              </div>
            )
          }
          if (part.startsWith('$') && part.endsWith('$')) {
            return (
              <span className="math-inline-scroll" key={index}>
                <InlineMath math={part.slice(1, -1).trim()} renderError={() => <code>{part}</code>} />
              </span>
            )
          }
          return <Fragment key={index}>{part}</Fragment>
        })}
      </div>
      {activeFormula && typeof document !== 'undefined' && createPortal(<FormulaViewer formula={activeFormula} onClose={closeFormula} />, document.body)}
    </>
  )
}
