import { describe, expect, it } from 'vitest'
import type { PwaDiagnosticItem } from './pwaDiagnostics'
import { summarizeDiagnostics } from './pwaDiagnostics'

describe('PWA 安装诊断评分', () => {
  it('通过、警告和失败分别按 1、0.5、0 计分', () => {
    const item = (status: PwaDiagnosticItem['status'], id: PwaDiagnosticItem['id']): PwaDiagnosticItem => ({
      id,
      label: id,
      status,
      detail: id
    })
    expect(summarizeDiagnostics([
      item('pass', 'secure'),
      item('warning', 'installed'),
      item('fail', 'service-worker')
    ])).toBe(50)
    expect(summarizeDiagnostics([])).toBe(0)
  })
})
