import type { BankPoint } from './types'

export type PointRow = readonly [
  id: string,
  title: string,
  sectionTags: readonly string[],
  principle: string,
  conditions: string,
  conclusion: string,
  misconception: string,
  statement: string,
  answer: string,
  derivation: string,
  verification: string
]

interface PointGroup {
  subject: BankPoint['subject']
  lectureTag: string
  source: string
  page: string
}

export function makePointGroup(group: PointGroup, rows: readonly PointRow[]): BankPoint[] {
  return rows.map((row) => ({
    id: row[0],
    subject: group.subject,
    lectureTag: group.lectureTag,
    sectionTags: [...row[2]],
    title: row[1],
    principle: row[3],
    conditions: row[4],
    conclusion: row[5],
    misconception: row[6],
    example: {
      statement: row[7],
      answer: row[8],
      derivation: row[9],
      verification: row[10]
    },
    source: group.source,
    page: group.page
  }))
}

export const ZY1000_SOURCE = '《张宇考研数学题源探析经典1000题（数学一）解析册》考点重构'
export const CORE_CALC_SOURCE = '《张宇核心计算通关讲义》方法重构'
