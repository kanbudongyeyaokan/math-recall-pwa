import 'fake-indexeddb/auto'
import { File } from 'node:buffer'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { db, defaultProfile } from '../db'
import type { Problem } from '../types'
import { BACKUP_FORMAT, isBackupPayload, restoreBackup } from './backup'

const problem = (id: string, reviewCount: number): Problem => ({
  id,
  kind: 'problem',
  title: `题目 ${id}`,
  statement: '题面',
  source: '私人题包',
  page: '1',
  tags: ['第1讲'],
  coreMethod: '方法',
  mistakes: '易错点',
  answerText: '答案',
  questionFormat: 'open',
  options: [],
  correctOptionIds: [],
  solutionMethods: [{ id: 'method-1', title: '方法一', content: '解析一' }, { id: 'method-2', title: '方法二', content: '解析二' }],
  createdAt: 1,
  updatedAt: 1,
  nextReviewAt: reviewCount ? 99 : 0,
  intervalIndex: reviewCount ? 2 : -1,
  reviewCount
})

describe('备份格式校验', () => {
  beforeEach(async () => {
    await db.open()
  })

  afterEach(async () => {
    await db.delete()
  })

  it('接受结构完整的备份', () => {
    expect(isBackupPayload({
      format: BACKUP_FORMAT,
      exportedAt: new Date().toISOString(),
      appVersion: '0.1.0',
      data: { problems: [], images: [], reviews: [], rewards: [], profiles: [] }
    })).toBe(true)
  })

  it('继续接受旧版备份用于迁移', () => {
    expect(isBackupPayload({
      format: 'math-recall-backup-v1',
      exportedAt: new Date().toISOString(),
      appVersion: '0.1.0',
      data: { problems: [], images: [], reviews: [], rewards: [], profiles: [] }
    })).toBe(true)
  })

  it('拒绝普通 JSON', () => {
    expect(isBackupPayload({ data: [] })).toBe(false)
  })

  it('合并导入时只新增缺失题卡并保留本机进度', async () => {
    const existing = problem('same-id', 7)
    await db.problems.put(existing)
    await db.profiles.put({ ...defaultProfile, xp: 320, coins: 45 })
    const payload = {
      format: BACKUP_FORMAT,
      exportedAt: new Date().toISOString(),
      appVersion: '0.4.0',
      data: {
        problems: [problem('same-id', 0), problem('new-id', 0)],
        images: [],
        reviews: [],
        rewards: [],
        profiles: [defaultProfile]
      }
    }

    const result = await restoreBackup(
      new File([JSON.stringify(payload)], 'merge.json', { type: 'application/json' }) as unknown as globalThis.File,
      false
    )

    expect(result).toEqual({ problems: 1, images: 0, preservedProblems: 1 })
    expect(await db.problems.count()).toBe(2)
    expect(await db.problems.get('same-id')).toMatchObject({ reviewCount: 7, intervalIndex: 2, nextReviewAt: 99 })
    expect(await db.profiles.get('player')).toMatchObject({ xp: 320, coins: 45 })
  })
})
