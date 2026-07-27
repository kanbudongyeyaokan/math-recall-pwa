import { describe, expect, it } from 'vitest'
import { BACKUP_FORMAT, isBackupPayload } from './backup'

describe('备份格式校验', () => {
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
})
