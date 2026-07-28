import {
  createRecoverySnapshot,
  db,
  defaultProfile,
  markExternalBackupCreated,
  normalizeProblemRecord,
  normalizeProfileRecord
} from '../db'
import type { AppSetting, ImageAsset, PlayerProfile, Problem, ReviewLog, RewardCard } from '../types'

export const BACKUP_FORMAT = 'math-recall-backup-v2'
export const LEGACY_BACKUP_FORMAT = 'math-recall-backup-v1'

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
    appVersion: '0.5.0',
    data: { problems, images: serializedImages, reviews, rewards, profiles, settings }
  }
}

export async function downloadBackup() {
  const payload = await createBackup()
  const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `斗破数学-备份-${new Date().toISOString().slice(0, 10)}.json`
  anchor.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  await markExternalBackupCreated()
}

export async function restoreBackup(file: File, replaceExisting: boolean) {
  const parsed: unknown = JSON.parse(await file.text())
  if (!isBackupPayload(parsed)) throw new Error('不是有效的斗破数学备份文件')

  const images = await Promise.all(parsed.data.images.map(async ({ dataUrl, ...image }) => ({
    ...image,
    blob: await dataUrlToBlob(dataUrl)
  })))
  const problems = parsed.data.problems.map(normalizeProblemRecord)
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

  await createRecoverySnapshot('导入备份')
  return { problems: importedProblems, images: importedImages, preservedProblems }
}
