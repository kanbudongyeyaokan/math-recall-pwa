export type ProblemKind = 'problem' | 'concept'

export type QuestionFormat = 'open' | 'single-choice' | 'multiple-choice'

export type ReviewRating = 'again' | 'hint' | 'independent' | 'multiple'

export type RewardRarity = 'common' | 'rare' | 'epic' | 'legendary'

export interface ProblemOption {
  id: string
  text: string
}

export interface SolutionMethod {
  id: string
  title: string
  content: string
}

export interface Problem {
  id: string
  kind: ProblemKind
  title: string
  statement: string
  source: string
  page: string
  tags: string[]
  coreMethod: string
  mistakes: string
  answerText: string
  questionFormat: QuestionFormat
  options: ProblemOption[]
  correctOptionIds: string[]
  solutionMethods: SolutionMethod[]
  methodFingerprint?: string
  questionImageId?: string
  answerImageId?: string
  createdAt: number
  updatedAt: number
  nextReviewAt: number
  intervalIndex: number
  reviewCount: number
  archived?: boolean
  isSeed?: boolean
  seedVersion?: number
}

export type UnlockEventKind = 'achievement' | 'character' | 'challenge' | 'quest'

export interface UnlockEvent {
  id: string
  kind: UnlockEventKind
  title: string
  description: string
}

export interface ImageAsset {
  id: string
  blob: Blob
  name: string
  mimeType: string
  createdAt: number
}

export interface ReviewLog {
  id?: number
  problemId: string
  rating: ReviewRating
  reviewedAt: number
  nextReviewAt: number
  intervalIndex: number
  xpEarned: number
  coinsEarned?: number
  selectedOptionIds?: string[]
  isCorrect?: boolean
  techniqueId?: string
  techniqueXpBonus?: number
  techniqueCoinBonus?: number
  techniqueMasteryGained?: number
}

export interface BossVictory {
  lectureId: string
  bossId: string
  bestScore: number
  victories: number
  lastDefeatedAt: number
}

export type PracticeSessionMode = 'practice' | 'boss' | 'single'

export interface PracticeSessionSelection {
  lectureId: string
  sectionId?: string
  role: 'all' | 'concept' | 'example' | 'choice' | 'exercise'
  label: string
  mode?: 'practice' | 'boss'
}

export interface PracticeSessionAnswer {
  problemId: string
  thinking: boolean
  revealed: boolean
  selectedOptionIds: string[]
  choiceSubmitted: boolean
  expandedSectionIds: string[]
}

export interface PracticeSessionOutcome {
  problemId: string
  rating: ReviewRating
  isCorrect?: boolean
}

export interface ActivePracticeSession {
  version: 1
  id: string
  mode: PracticeSessionMode
  requestedId?: string
  selection?: PracticeSessionSelection
  queueIds: string[]
  queueIndex: number
  answer: PracticeSessionAnswer
  outcomes: PracticeSessionOutcome[]
  startedAt: number
  updatedAt: number
}

export interface RewardCard {
  id: string
  problemId: string
  name: string
  description: string
  rarity: RewardRarity
  earnedAt: number
}

export interface PlayerProfile {
  id: 'player'
  name: string
  xp: number
  coins: number
  lifetimeCoins: number
  streak: number
  lastStudyDate: string
  totalReviews: number
  selectedTitle: string
  independentReviews: number
  multipleSolutionReviews: number
  correctChoiceReviews: number
  breakthroughCount: number
  ownedItemIds: string[]
  equippedOutfitId: string
  equippedAuraId: string
  equippedWeaponId: string
  equippedAccessoryId: string
  activeCompanionId: string
  activeTechniqueId: string
  techniqueMastery: Record<string, number>
  storyChoices: Record<string, string>
  characterBonds: Record<string, number>
  masteredProblemIds: string[]
  correctedProblemIds: string[]
  bossVictories: Record<string, BossVictory>
  bossAttempts: number
  avatarImageId?: string
}

export type ShopItemCategory = 'outfit' | 'aura' | 'weapon' | 'accessory' | 'companion'

export interface ShopItem {
  id: string
  name: string
  description: string
  category: ShopItemCategory
  price: number
  swatch: string
}

export interface AppSetting<T = unknown> {
  key: string
  value: T
  updatedAt: number
}

export interface RecoverySnapshot {
  id: string
  createdAt: number
  reason: string
  data: {
    problems: Problem[]
    reviews: ReviewLog[]
    rewards: RewardCard[]
    profiles: PlayerProfile[]
  }
}

export interface StoragePersistenceState {
  status: 'granted' | 'denied' | 'unsupported'
  checkedAt: number
}

export interface ReviewOutcome {
  nextReviewAt: number
  intervalIndex: number
  intervalDays: number
  xp: number
}
