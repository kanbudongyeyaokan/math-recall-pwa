import {
  createRecoverySnapshot,
  db,
  defaultProfile,
  markExternalBackupCreated,
  normalizeProblemRecord,
  normalizeProfileRecord
} from '../db'
import type { AppSetting, ImageAsset, PlayerProfile, Problem, ReviewLog, RewardCard } from '../types'
import { auditProblemBank } from '../data/questionQuality'

export const BACKUP_FORMAT = 'math-recall-backup-v2'
export const LEGACY_BACKUP_FORMAT = 'math-recall-backup-v1'
export const ENCRYPTED_BACKUP_FORMAT = 'math-recall-encrypted-v1'
const ENCRYPTION_ITERATIONS = 210_000

interface SerializedImage extends Omit<ImageAsset, 'blob'> {
  dataUrl: string
}

export interface BackupPayload {
  format: typeof BACKUP_FORMAT | typeof LEGACY_BACKUP_FORMAT
  exportedAt: string
  appVersion: string
  data: {
    problems: Problem[]
    images: SerializedImage[]
    reviews: ReviewLog[]
    rewards: RewardCard[]
    profiles: PlayerProfile[]
    settings?: AppSetting[]
  }
}

export interface EncryptedBackupEnvelope {
  format: typeof ENCRYPTED_BACKUP_FORMAT
  algorithm: 'AES-GCM'
  keyDerivation: 'PBKDF2-SHA-256'
  iterations: number
  createdAt: string
  salt: string
  iv: string
  ciphertext: string
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })
}

async function dataUrlToBlob(dataUrl: string) {
  const response = await fetch(dataUrl)
  return response.blob()
}

export function isBackupPayload(value: unknown): value is BackupPayload {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Partial<BackupPayload>
  return (candidate.format === BACKUP_FORMAT || candidate.format === LEGACY_BACKUP_FORMAT)
    && !!candidate.data
    && Array.isArray(candidate.data.problems)
    && Array.isArray(candidate.data.images)
    && Array.isArray(candidate.data.reviews)
    && Array.isArray(candidate.data.rewards)
    && Array.isArray(candidate.data.profiles)
}

export function isEncryptedBackupEnvelope(value: unknown): value is EncryptedBackupEnvelope {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Partial<EncryptedBackupEnvelope>
  return candidate.format === ENCRYPTED_BACKUP_FORMAT
    && candidate.algorithm === 'AES-GCM'
    && candidate.keyDerivation === 'PBKDF2-SHA-256'
    && typeof candidate.iterations === 'number'
    && typeof candidate.salt === 'string'
    && typeof candidate.iv === 'string'
    && typeof candidate.ciphertext === 'string'
}

function assertBackupRecordStructure(payload: BackupPayload) {
  const invalidProblem = payload.data.problems.find((problem) => (
    !problem || typeof problem.id !== 'string' || !problem.id
    || typeof problem.title !== 'string' || typeof problem.statement !== 'string'
    || typeof problem.coreMethod !== 'string' || typeof problem.answerText !== 'string'
    || !Array.isArray(problem.tags)
  ))
  if (invalidProblem) throw new Error('备份中存在字段不完整的题卡')

  const validRatings = new Set(['again', 'hint', 'independent', 'multiple'])
  if (payload.data.reviews.some((review) => !review || typeof review.problemId !== 'string' || !validRatings.has(review.rating))) {
    throw new Error('备份中的做题记录格式不完整')
  }
  if (payload.data.images.some((image) => !image || typeof image.id !== 'string' || typeof image.dataUrl !== 'string' || !image.dataUrl.startsWith('data:'))) {
    throw new Error('备份中的图片数据格式不完整')
  }
  if (payload.data.rewards.some((reward) => !reward || typeof reward.id !== 'string' || typeof reward.problemId !== 'string')) {
    throw new Error('备份中的奖励卡格式不完整')
  }
  if (payload.data.profiles.some((profile) => !profile || typeof profile.id !== 'string')) {
    throw new Error('备份中的个人档案格式不完整')
  }
}

function bytesToBase64(bytes: Uint8Array) {
  let binary = ''
  const chunkSize = 0x8000
  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize))
  }
  return btoa(binary)
}

function base64ToBytes(value: string) {
  const binary = atob(value)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index)
  return bytes
}

async function deriveBackupKey(passphrase: string, salt: Uint8Array, iterations: number, usage: KeyUsage[]) {
  if (passphrase.length < 6) throw new Error('加密密码至少需要 6 个字符')
  const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(passphrase), 'PBKDF2', false, ['deriveKey'])
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    usage
  )
}

export async function encryptBackupPayload(payload: BackupPayload, passphrase: string): Promise<EncryptedBackupEnvelope> {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const key = await deriveBackupKey(passphrase, salt, ENCRYPTION_ITERATIONS, ['encrypt'])
  const plaintext = new TextEncoder().encode(JSON.stringify(payload))
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plaintext)
  return {
    format: ENCRYPTED_BACKUP_FORMAT,
    algorithm: 'AES-GCM',
    keyDerivation: 'PBKDF2-SHA-256',
    iterations: ENCRYPTION_ITERATIONS,
    createdAt: new Date().toISOString(),
    salt: bytesToBase64(salt),
    iv: bytesToBase64(iv),
    ciphertext: bytesToBase64(new Uint8Array(ciphertext))
  }
}

export async function decryptBackupEnvelope(envelope: EncryptedBackupEnvelope, passphrase: string): Promise<BackupPayload> {
  try {
    const salt = base64ToBytes(envelope.salt)
    const iv = base64ToBytes(envelope.iv)
    const key = await deriveBackupKey(passphrase, salt, envelope.iterations, ['decrypt'])
    const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, base64ToBytes(envelope.ciphertext))
    const parsed: unknown = JSON.parse(new TextDecoder().decode(plaintext))
    if (!isBackupPayload(parsed)) throw new Error('解密后的内容不是有效备份')
    return parsed
  } catch (error) {
    if (error instanceof Error && /至少需要|不是有效/.test(error.message)) throw error
    throw new Error('无法解密备份，请检查密码或文件是否损坏')
  }
}

async function parseBackupFile(file: File, passphrase?: string) {
  const parsed: unknown = JSON.parse(await file.text())
  if (isEncryptedBackupEnvelope(parsed)) {
    if (!passphrase) throw new Error('这是加密备份，请输入备份密码')
    const payload = await decryptBackupEnvelope(parsed, passphrase)
    assertBackupRecordStructure(payload)
    return { payload, encrypted: true }
  }
  if (!isBackupPayload(parsed)) throw new Error('不是有效的斗破数学备份文件')
  assertBackupRecordStructure(parsed)
  return { payload: parsed, encrypted: false }
}

export async function createBackup(): Promise<BackupPayload> {
  const [problems, images, reviews, rewards, profiles, settings] = await Promise.all([
    db.problems.toArray(),
    db.images.toArray(),
    db.reviews.toArray(),
    db.rewards.toArray(),
    db.profiles.toArray(),
    db.settings.filter((setting) => setting.key !== 'storage-persistence').toArray()
  ])
  const serializedImages = await Promise.all(images.map(async ({ blob, ...image }) => ({
    ...image,
    dataUrl: await blobToDataUrl(blob)
  })))

  return {
    format: BACKUP_FORMAT,
    exportedAt: new Date().toISOString(),
    appVersion: typeof __APP_VERSION__ === 'string' ? __APP_VERSION__ : '0.21.0',
    data: { problems, images: serializedImages, reviews, rewards, profiles, settings }
  }
}

function downloadJson(value: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(value)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export async function downloadBackup() {
  const payload = await createBackup()
  downloadJson(payload, `斗破数学-备份-${new Date().toISOString().slice(0, 10)}.json`)
  await markExternalBackupCreated()
}

export async function downloadEncryptedBackup(passphrase: string) {
  const payload = await createBackup()
  const envelope = await encryptBackupPayload(payload, passphrase)
  await decryptBackupEnvelope(envelope, passphrase)
  downloadJson(envelope, `斗破数学-加密备份-${new Date().toISOString().slice(0, 10)}.json`)
  await markExternalBackupCreated()
}

export async function verifyBackupFile(file: File, passphrase?: string) {
  const { payload, encrypted } = await parseBackupFile(file, passphrase)
  const decodedImages = await Promise.all(payload.data.images.map((image) => dataUrlToBlob(image.dataUrl)))
  if (decodedImages.some((blob) => blob.size === 0)) throw new Error('备份中存在无法恢复的空图片')
  return {
    encrypted,
    appVersion: payload.appVersion,
    exportedAt: payload.exportedAt,
    problems: payload.data.problems.length,
    images: payload.data.images.length,
    reviews: payload.data.reviews.length
  }
}

export async function restoreBackup(file: File, replaceExisting: boolean, passphrase?: string) {
  const { payload: parsed } = await parseBackupFile(file, passphrase)

  const images = await Promise.all(parsed.data.images.map(async ({ dataUrl, ...image }) => ({
    ...image,
    blob: await dataUrlToBlob(dataUrl)
  })))
  const normalizedProblems = parsed.data.problems.map(normalizeProblemRecord)
  const problems = replaceExisting ? auditProblemBank(normalizedProblems) : normalizedProblems
  const profiles = parsed.data.profiles.map(normalizeProfileRecord)
  let importedProblems = problems.length
  let importedImages = images.length
  let preservedProblems = 0

  await db.transaction('rw', [db.problems, db.images, db.reviews, db.rewards, db.profiles, db.settings], async () => {
    if (replaceExisting) {
      await Promise.all([
        db.problems.clear(), db.images.clear(), db.reviews.clear(), db.rewards.clear(), db.profiles.clear(), db.settings.clear()
      ])
      await db.problems.bulkPut(problems)
      await db.images.bulkPut(images)
      await db.reviews.bulkPut(parsed.data.reviews)
      await db.rewards.bulkPut(parsed.data.rewards)
      if (profiles.length) await db.profiles.bulkPut(profiles)
      else await db.profiles.put(defaultProfile)
      if (parsed.data.settings?.length) await db.settings.bulkPut(parsed.data.settings)
      return
    }

    const [problemIds, imageIds, reviewIds, rewardIds, profileIds, settingKeys] = await Promise.all([
      db.problems.toCollection().primaryKeys(),
      db.images.toCollection().primaryKeys(),
      db.reviews.toCollection().primaryKeys(),
      db.rewards.toCollection().primaryKeys(),
      db.profiles.toCollection().primaryKeys(),
      db.settings.toCollection().primaryKeys()
    ])
    const existingProblemIds = new Set(problemIds)
    const existingImageIds = new Set(imageIds)
    const existingReviewIds = new Set(reviewIds)
    const existingRewardIds = new Set(rewardIds)
    const existingProfileIds = new Set(profileIds)
    const existingSettingKeys = new Set(settingKeys)
    const newProblems = problems.filter((problem) => !existingProblemIds.has(problem.id))
    const newImages = images.filter((image) => !existingImageIds.has(image.id))
    const newReviews = parsed.data.reviews.filter((review) => review.id === undefined || !existingReviewIds.has(review.id))
    const newRewards = parsed.data.rewards.filter((reward) => !existingRewardIds.has(reward.id))
    const newProfiles = profiles.filter((profile) => !existingProfileIds.has(profile.id))
    const newSettings = (parsed.data.settings || []).filter((setting) => !existingSettingKeys.has(setting.key))

    importedProblems = newProblems.length
    importedImages = newImages.length
    preservedProblems = problems.length - newProblems.length
    if (newProblems.length) await db.problems.bulkPut(newProblems)
    if (newImages.length) await db.images.bulkPut(newImages)
    if (newReviews.length) await db.reviews.bulkPut(newReviews)
    if (newRewards.length) await db.rewards.bulkPut(newRewards)
    if (newProfiles.length) await db.profiles.bulkPut(newProfiles)
    else if (!(await db.profiles.get('player'))) await db.profiles.put(defaultProfile)
    if (newSettings.length) await db.settings.bulkPut(newSettings)
  })

  if (!replaceExisting && importedProblems > 0) {
    const auditedBank = auditProblemBank(await db.problems.toArray())
    if (auditedBank.length) await db.problems.bulkPut(auditedBank)
  }

  await createRecoverySnapshot('导入备份')
  return { problems: importedProblems, images: importedImages, preservedProblems }
}
