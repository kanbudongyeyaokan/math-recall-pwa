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
  avatarImageId?: string
}

export type ShopItemCategory = 'outfit' | 'aura'

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
