import { THEOREM_KNOWLEDGE } from './theoremKnowledge'
import type {
  Problem,
  ProblemDifficulty,
  ProblemQualityIssue,
  ProblemQualityStatus
} from '../types'

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

const GENERIC_TAGS = new Set([
  '高等数学', '线性代数', '概率论', '精品重构题', '经典方法精选', '经典例题', '计算题',
  '证明题', '选择题', '多选题', '错解辨析', '命题辨析', '定义', '定义与判据'
])

const VAGUE_CONTEXT_PATTERN = /(?:某道相关题|上(?:述|题|文)|下图|如图所示|由前题|沿用前式|该结论同前|见原题)/
const PLACEHOLDER_ANSWER_PATTERN = /^(?:略|见答案|答案略|自行计算|同上|显然)$/
const CONDITION_MARKERS = ['连续', '可导', '可微', '可积', '闭区间', '开区间', '不变号', '非负', '分段光滑', '单连通', '偏导']

function unique<T>(values: readonly T[]) {
  return [...new Set(values)]
}

function stableHash(value: string) {
  let hash = 0x811c9dc5
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 0x01000193)
  }
  return (hash >>> 0).toString(36)
}

function normalizeSemanticText(text: string) {
  return text
    .toLowerCase()
    .replace(/\\(?:left|right|,|!|;|quad|qquad)/g, '')
    .replace(/\d+(?:\.\d+)?/g, '#')
    .replace(/\b(?:x|y|z|t|n|m|a|b|c|u|v)\b/g, 'v')
    .replace(/[\s，。；：、“”‘’（）()\[\]{}]/g, '')
}

function normalizeOptionText(text: string) {
  return text
    .toLowerCase()
    .replace(/\\(?:left|right|,|!|;|quad|qquad)/g, '')
    // Brackets encode interval closure, grouping and matrix structure in math options.
    .replace(/[\s，。；：、“”‘’]/g, '')
}

function getTaskArchetype(problem: Pick<Problem, 'kind' | 'questionFormat' | 'title' | 'tags'>) {
  if (problem.kind === 'concept') return 'concept'
  if (problem.questionFormat !== 'open') return problem.questionFormat
  if (/错解|审判|辨析/.test(problem.title) || problem.tags.includes('错解辨析')) return 'audit'
  if (/证明/.test(problem.title) || problem.tags.includes('证明题')) return 'proof'
  return 'application'
}

export function getPrimaryKnowledgePoint(problem: Pick<Problem, 'tags' | 'title'>) {
  return problem.tags.find((tag) => !GENERIC_TAGS.has(tag) && !/^第\s?\d+(?:-\d+)?\s?讲$/.test(tag))
    || problem.title.replace(/[：:].*$/, '')
}

export function buildSemanticClusterId(problem: Pick<Problem, 'kind' | 'questionFormat' | 'title' | 'tags' | 'coreMethod' | 'solutionMethods'>) {
  const primary = getPrimaryKnowledgePoint(problem)
  const methodText = [problem.coreMethod, ...problem.solutionMethods.map((method) => method.title)].join('|')
  const signature = `${primary}|${getTaskArchetype(problem)}|${normalizeSemanticText(methodText)}`
  return `semantic:${stableHash(signature)}`
}

function inferDifficulty(problem: Pick<Problem, 'kind' | 'questionFormat' | 'statement' | 'tags' | 'solutionMethods'>): ProblemDifficulty {
  let score = problem.kind === 'concept' ? 1 : problem.questionFormat === 'single-choice' ? 2 : problem.questionFormat === 'multiple-choice' ? 3 : 2
  if (problem.tags.some((tag) => /证明|不等式|参数|多元|曲面|场论|综合/.test(tag))) score += 1
  if (problem.statement.length > 180 || problem.solutionMethods.some((method) => method.content.length > 420)) score += 1
  return Math.max(1, Math.min(5, score)) as ProblemDifficulty
}

function inferPrerequisites(problem: Pick<Problem, 'tags' | 'title'>) {
  return unique(problem.tags.filter((tag) => !GENERIC_TAGS.has(tag) && !/^第\s?\d+(?:-\d+)?\s?讲$/.test(tag))).slice(0, 4)
}

function inferEstimatedMinutes(problem: Pick<Problem, 'kind' | 'questionFormat' | 'statement' | 'solutionMethods'>, difficulty: ProblemDifficulty) {
  const base = problem.kind === 'concept' ? 2 : problem.questionFormat === 'open' ? 5 : 3
  const reading = Math.min(4, Math.floor((problem.statement.length + problem.solutionMethods.reduce((sum, method) => sum + method.content.length, 0)) / 320))
  return Math.max(2, Math.min(20, base + difficulty + reading))
}

function inferDiscrimination(problem: Pick<Problem, 'questionFormat' | 'solutionMethods' | 'mistakes'>, difficulty: ProblemDifficulty): ProblemDifficulty {
  let value = Math.max(1, difficulty - 1)
  if (problem.questionFormat === 'multiple-choice') value += 1
  if (problem.solutionMethods.length >= 2 && problem.mistakes.trim().length >= 12) value += 1
  return Math.min(5, value) as ProblemDifficulty
}

function issue(code: string, message: string, severity: ProblemQualityIssue['severity']): ProblemQualityIssue {
  return { code, message, severity }
}

export function auditProblemQuality(problem: Problem): ProblemQualityIssue[] {
  const issues: ProblemQualityIssue[] = []
  const statement = problem.statement.trim()
  const answer = problem.answerText.trim()
  const combinedSolution = [problem.coreMethod, answer, ...problem.solutionMethods.map((method) => method.content)].join('\n')

  if (!statement && !problem.questionImageId) issues.push(issue('missing-statement', '缺少可独立理解的题面文字或图片。', 'error'))
  else if (statement && statement.length < 8) issues.push(issue('short-statement', '题面过短，可能缺少已知条件或明确任务。', 'error'))
  if (VAGUE_CONTEXT_PATTERN.test(statement) && !problem.questionImageId) issues.push(issue('context-dependent', '题面依赖未提供的上文或图片。', 'error'))
  if (!answer && !problem.answerImageId) issues.push(issue('missing-answer', '缺少答案或答案图片。', 'error'))
  if (answer && PLACEHOLDER_ANSWER_PATTERN.test(answer.replace(/\s/g, ''))) issues.push(issue('placeholder-answer', '答案仍是占位语，无法核验结论。', 'error'))
  if (!problem.coreMethod.trim()) issues.push(issue('missing-core-method', '尚未填写可迁移的核心方法。', 'warning'))
  if (problem.kind === 'problem' && problem.solutionMethods.filter((method) => method.content.trim().length >= 12).length < 2) {
    issues.push(issue('incomplete-solutions', '完整解析不足两条，建议补充主线与复核路线。', 'warning'))
  }
  if (!problem.source.trim()) issues.push(issue('missing-source', '来源尚未填写。', 'warning'))
  if (!problem.page.trim()) issues.push(issue('missing-page', '来源页码尚未填写。', 'warning'))

  if (problem.questionFormat !== 'open') {
    const optionIds = problem.options.map((option) => option.id)
    // Numeric bounds and constants distinguish answer choices even though the
    // cross-problem structural audit intentionally ignores them.
    const normalizedOptions = problem.options.map((option) => normalizeOptionText(option.text))
    if (problem.options.length < 2) issues.push(issue('insufficient-options', '选择题至少需要两个有效选项。', 'error'))
    if (unique(optionIds).length !== optionIds.length || normalizedOptions.some((text) => !text)) issues.push(issue('invalid-options', '选项编号重复或存在空选项。', 'error'))
    if (unique(normalizedOptions).length !== normalizedOptions.length) issues.push(issue('duplicate-options', '存在语义相同的重复选项。', 'error'))
    if (!problem.correctOptionIds.length || problem.correctOptionIds.some((id) => !optionIds.includes(id))) issues.push(issue('invalid-answer-key', '正确选项没有完整对应现有选项。', 'error'))
    if (problem.questionFormat === 'single-choice' && problem.correctOptionIds.length !== 1) issues.push(issue('single-choice-key', '单选题必须且只能有一个正确选项。', 'error'))
    if (problem.correctOptionIds.length >= problem.options.length && problem.options.length) issues.push(issue('all-options-correct', '所有选项都被标为正确，区分度不足。', 'error'))
    const writtenKey = answer.match(/正确选项(?:为|是)\s*([A-F](?:\s*[、,，]\s*[A-F])*)/i)?.[1]
    if (writtenKey) {
      const parsed = writtenKey.toUpperCase().match(/[A-F]/g) || []
      if (unique(parsed).sort().join('|') !== unique(problem.correctOptionIds).sort().join('|')) {
        issues.push(issue('answer-key-conflict', '解析文字中的答案与正确选项标记不一致。', 'error'))
      }
    }
  }

  const referencedTheorems = THEOREM_KNOWLEDGE.filter((entry) => entry.aliases.some((alias) => combinedSolution.includes(alias)))
  if (referencedTheorems.length && !CONDITION_MARKERS.some((marker) => combinedSolution.includes(marker))) {
    issues.push(issue('theorem-conditions', `使用了${referencedTheorems.map((entry) => entry.name).join('、')}，但解析中没有明确交代适用条件。`, 'warning'))
  }
  return issues
}

export function enrichProblemQuality(problem: Problem, auditedAt = Date.now()): Problem {
  const difficulty = problem.difficulty || inferDifficulty(problem)
  const enriched: Problem = {
    ...problem,
    semanticClusterId: problem.semanticClusterId || buildSemanticClusterId(problem),
    difficulty,
    prerequisites: problem.prerequisites?.length ? unique(problem.prerequisites) : inferPrerequisites(problem),
    estimatedMinutes: problem.estimatedMinutes || inferEstimatedMinutes(problem, difficulty),
    discrimination: problem.discrimination || inferDiscrimination(problem, difficulty),
    qualityAuditedAt: auditedAt
  }
  const qualityIssues = auditProblemQuality(enriched)
  const qualityStatus: ProblemQualityStatus = enriched.qualityStatus === 'excluded'
    ? 'excluded'
    : qualityIssues.some((item) => item.severity === 'error') ? 'needs-review' : 'verified'
  return { ...enriched, qualityIssues, qualityStatus }
}

function structuralStatement(problem: Problem) {
  return normalizeSemanticText(problem.statement)
}

export function auditProblemBank(problems: readonly Problem[], auditedAt = Date.now()) {
  const enriched = problems.map((problem) => enrichProblemQuality(problem, auditedAt))
  const clusters = new Map<string, Problem[]>()
  for (const problem of enriched) {
    if (problem.archived || problem.qualityStatus === 'excluded') continue
    const list = clusters.get(problem.semanticClusterId!) || []
    list.push(problem)
    clusters.set(problem.semanticClusterId!, list)
  }
  const duplicateIds = new Set<string>()
  for (const cluster of clusters.values()) {
    const shapes = new Map<string, Problem[]>()
    for (const problem of cluster) {
      const shape = structuralStatement(problem)
      if (!shape) continue
      const list = shapes.get(shape) || []
      list.push(problem)
      shapes.set(shape, list)
    }
    for (const group of shapes.values()) {
      if (group.length < 2) continue
      group.sort((a, b) => Number(!a.isSeed) - Number(!b.isSeed) || a.createdAt - b.createdAt || a.id.localeCompare(b.id))
      group.slice(1).forEach((problem) => duplicateIds.add(problem.id))
    }
  }
  return enriched.map((problem) => {
    if (!duplicateIds.has(problem.id)) return problem
    const duplicateIssue = issue('semantic-duplicate', '与题库中另一题仅有数字、字母或表述变化，已移出随机题池等待确认。', 'error')
    return {
      ...problem,
      qualityStatus: 'needs-review' as const,
      qualityIssues: [...(problem.qualityIssues || []), duplicateIssue]
    }
  })
}

export function isProblemEligibleForPractice(problem: Pick<Problem, 'kind' | 'archived' | 'qualityStatus'>) {
  return problem.kind === 'problem' && !problem.archived && problem.qualityStatus !== 'needs-review' && problem.qualityStatus !== 'excluded'
}

export function getQualitySummary(problems: readonly Problem[]) {
  return problems.reduce((summary, problem) => {
    if (problem.archived || problem.qualityStatus === 'excluded') summary.excluded += 1
    else if (problem.qualityStatus === 'needs-review') summary.needsReview += 1
    else summary.verified += 1
    return summary
  }, { verified: 0, needsReview: 0, excluded: 0 })
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
