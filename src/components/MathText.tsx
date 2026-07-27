import { Fragment } from 'react'
import { BlockMath, InlineMath } from 'react-katex'

interface MathTextProps {
  text: string
  className?: string
}

const MATH_DELIMITER = /(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$)/g

export function MathText({ text, className = '' }: MathTextProps) {
  const parts = text.split(MATH_DELIMITER)

  return (
    <div className={`math-text ${className}`.trim()}>
      {parts.map((part, index) => {
        if (part.startsWith('$$') && part.endsWith('$$')) {
          return <BlockMath key={index} math={part.slice(2, -2).trim()} renderError={() => <code>{part}</code>} />
        }
        if (part.startsWith('$') && part.endsWith('$')) {
          return <InlineMath key={index} math={part.slice(1, -1).trim()} renderError={() => <code>{part}</code>} />
        }
        return <Fragment key={index}>{part}</Fragment>
      })}
    </div>
  )
}
