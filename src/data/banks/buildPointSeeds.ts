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
  options: { idPrefix?: string; sharedTag?: string; varyChoicePosition?: boolean } = {}
): SeedInput[] {
  const idPrefix = options.idPrefix || 'zy27'
  const seeds = points.flatMap((point) => {
    const tags = options.sharedTag ? [...sharedTags(point), options.sharedTag] : sharedTags(point)
    const source = point.source
    const page = point.page
    const correctChoice = `在“${point.conditions}”成立时，可以推出“${point.conclusion}”。`
    const distractors = [
      `无需核对任何条件，总能直接得到“${point.conclusion}”。`,
      point.misconception,
      `只要“${point.conclusion}”成立，就必然反推出全部原条件。`
    ]
    const correctChoiceIndex = options.varyChoicePosition
      ? [...point.id].reduce((total, character, index) => total + character.charCodeAt(0) * (index + 1), 0) % 4
      : 0
    const choiceOptions = [...distractors]
    choiceOptions.splice(correctChoiceIndex, 0, correctChoice)
    const correctOptionId = String.fromCharCode(65 + correctChoiceIndex)
    return [
      {
        id: `${idPrefix}-${point.id}-choice`,
        kind: 'problem',
        title: `${point.title}：命题辨析`,
        statement: `关于“${point.title}”，下列说法正确的是（ ）。`,
        tags: [...tags, '选择题', '命题辨析'],
        coreMethod: `逐项核对 ${point.principle} 的对象、条件与结论，不凭关键词选答案。`,
        mistakes: point.misconception,
        answerText: `正确选项为 ${correctOptionId}。该项完整保留了适用条件和结论；其余选项分别删除条件、落入常见误区或擅自使用逆命题。`,
        questionFormat: 'single-choice',
        options: choiceOptions,
        correctOptionIds: [correctOptionId],
        solutionMethods: [
          { title: '路线一 · 正向定理核对', content: `原理是 ${point.principle}。${correctOptionId} 同时保留条件“${point.conditions}”和结论“${point.conclusion}”，因此成立。` },
          { title: '路线二 · 反例优先排除', content: `其余三项分别删除必要条件、落入典型误区“${point.misconception}”，或把正向结论擅自倒置。逐项排除后，应选 ${correctOptionId}。` }
        ],
        source,
        page,
        methodFingerprint: fingerprint(point, 'proposition-discrimination')
      },
      {
        id: `${idPrefix}-${point.id}-audit`,
        kind: 'problem',
        title: `${point.title}：错解审判`,
        statement: `某解答采用了以下做法：“${point.misconception}”请说明这一步为什么不可靠，并写出可以直接执行的订正顺序。`,
        tags: [...tags, '错解辨析', '证明题'],
        coreMethod: `先判断错误发生在对象、条件、推理方向还是计算步骤，再用 ${point.principle} 重建论证。`,
        mistakes: `只说“答案错了”而不指出缺失条件；订正必须写出能够复用的判断顺序。`,
        answerText: `该做法不可靠。订正时先核对：${point.conditions}；再调用 ${point.principle}，得到：${point.conclusion}。若条件不足，应停在“不能确定”，并用边界情形或反例说明。`,
        solutionMethods: [
          { title: '路线一 · 定位最早错误', content: `从原解第一步开始检查，最先需要确认的是：${point.conditions}。只有这些条件都满足，才能使用 ${point.principle} 并写出 ${point.conclusion}。` },
          { title: '路线二 · 边界反证', content: `暂时撤掉被忽略的条件，检查零点、端点、退化参数或不连续点。常见误判“${point.misconception}”会在这些边界处暴露，因此原推理不能直接通过。` }
        ],
        source,
        page,
        methodFingerprint: fingerprint(point, 'solution-audit-boundary')
      },
      {
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
      }
    ] satisfies SeedInput[]
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
