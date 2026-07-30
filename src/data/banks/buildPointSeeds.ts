import type { BankPoint, SeedInput } from './types'

const sharedTags = (point: BankPoint) => [
  point.subject,
  point.lectureTag,
  ...point.sectionTags,
  '精品重构题'
]

function fingerprint(point: BankPoint, task: string) {
  return `${point.subject}:${point.id}:${task}`
}

function polishMath(text: string) {
  return text.replace(/(?<!\\\\)\\blim_/g, '\\\\lim_')
}

export function buildPointSeeds(
  points: readonly BankPoint[],
  options: { idPrefix?: string; sharedTag?: string } = {}
): SeedInput[] {
  const idPrefix = options.idPrefix || 'zy27'
  const seeds = points.map<SeedInput>((point) => {
    const tags = options.sharedTag ? [...sharedTags(point), options.sharedTag] : sharedTags(point)
    const source = point.source
    const page = point.page
    return {
      id: `${idPrefix}-${point.id}-application`,
      kind: 'problem',
      title: `${point.title}：经典应用`,
      statement: point.example.statement,
      tags: [...tags, '经典例题', '计算题'],
      coreMethod: `${point.principle}；先验条件为：${point.conditions}`,
      mistakes: point.misconception,
      answerText: `${point.example.answer}\n\n详细推导：${point.example.derivation}`,
      solutionMethods: [
        { title: '路线一 · 主线推导', content: point.example.derivation },
        { title: '路线二 · 结构复核', content: point.example.verification }
      ],
      source,
      page,
      methodFingerprint: fingerprint(point, 'worked-application')
    } satisfies SeedInput
  })
  return seeds.map((seed) => ({
    ...seed,
    statement: polishMath(seed.statement),
    coreMethod: polishMath(seed.coreMethod),
    mistakes: polishMath(seed.mistakes),
    answerText: polishMath(seed.answerText),
    options: seed.options?.map(polishMath),
    solutionMethods: seed.solutionMethods?.map((method) => ({ ...method, content: polishMath(method.content) }))
  }))
}
