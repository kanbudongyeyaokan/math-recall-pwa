import type { Problem } from '../types'

export const LEGACY_PRIVATE_BANK_SOURCE = '何耀焜私人整理 · 张宇基础30讲高数（自购资料）'

export function isLegacyPrivateBankProblem(problem: Pick<Problem, 'id' | 'source'>) {
  if (problem.source !== LEGACY_PRIVATE_BANK_SOURCE) return false
  const match = /^zy30-heyaokun-(\d{3}|1000)$/.exec(problem.id)
  if (!match) return false
  const sequence = Number(match[1])
  return sequence >= 1 && sequence <= 1000
}

export interface DuplicateGroup {
  fingerprint: string
  problemIds: string[]
}

export function findDuplicateMethodGroups(problems: readonly Problem[]): DuplicateGroup[] {
  const groups = new Map<string, string[]>()
  for (const problem of problems) {
    if (!problem.methodFingerprint) continue
    const ids = groups.get(problem.methodFingerprint) || []
    ids.push(problem.id)
    groups.set(problem.methodFingerprint, ids)
  }
  return [...groups.entries()]
    .filter(([, problemIds]) => problemIds.length > 1)
    .map(([fingerprint, problemIds]) => ({ fingerprint, problemIds }))
}

export function getMathFragments(text: string) {
  const fragments: string[] = []
  const delimiter = /(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$)/g
  for (const match of text.matchAll(delimiter)) {
    const wrapped = match[0]
    fragments.push(wrapped.startsWith('$$') ? wrapped.slice(2, -2) : wrapped.slice(1, -1))
  }
  return fragments
}

export function getProblemTextFields(problem: Problem) {
  return [
    problem.title,
    problem.statement,
    problem.coreMethod,
    problem.mistakes,
    problem.answerText,
    ...problem.options.map((option) => option.text),
    ...problem.solutionMethods.map((method) => method.content)
  ]
}

export function hasBalancedMathDelimiters(text: string) {
  const withoutBlocks = text.replace(/\$\$[\s\S]*?\$\$/g, '')
  return (withoutBlocks.match(/\$/g)?.length || 0) % 2 === 0
}

const UNWRAPPED_MATH_SYMBOLS = /[∫∑√∞∂∇∏∬∮₀₁₂₃₄₅₆₇₈₉⁰¹²³⁴⁵⁶⁷⁸⁹ᵀᵖᐟ]/

export function hasUnwrappedMathSymbols(text: string) {
  const prose = text
    .replace(/\$\$[\s\S]*?\$\$/g, '')
    .replace(/\$[^$\n]+?\$/g, '')
  return UNWRAPPED_MATH_SYMBOLS.test(prose)
}
