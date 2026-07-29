import type { ProblemKind, QuestionFormat } from '../../types'

export interface SeedInput {
  id?: string
  kind: ProblemKind
  title: string
  statement: string
  tags: string[]
  coreMethod: string
  mistakes: string
  answerText: string
  questionFormat?: QuestionFormat
  options?: string[]
  correctOptionIds?: string[]
  solutionMethods?: { title: string; content: string }[]
  source?: string
  page?: string
  methodFingerprint?: string
}

export interface BankPoint {
  id: string
  subject: '高等数学' | '线性代数' | '概率论'
  lectureTag: string
  sectionTags: string[]
  title: string
  principle: string
  conditions: string
  conclusion: string
  misconception: string
  example: {
    statement: string
    answer: string
    derivation: string
    verification: string
  }
  source: string
  page: string
}
