export type ProblemKind = 'problem' | 'concept'

export type QuestionFormat = 'open' | 'single-choice' | 'multiple-choice'

export type ReviewRating = 'again' | 'hint' | 'independent' | 'multiple'

export type RewardRarity = 'common' | 'rare' | 'epic' | 'legendary'

export type ProblemDifficulty = 1 | 2 | 3 | 4 | 5

export type ProblemQualityStatus = 'verified' | 'needs-review' | 'excluded'

export type QualityIssueSeverity = 'warning' | 'error'

export interface ProblemQualityIssue {
  code: string
  message: string
  severity: QualityIssueSeverity
}

export type AdaptivePracticeMode = 'foundation' | 'weak' | 'mixed' | 'sprint'

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
  semanticClusterId?: string
  difficulty?: ProblemDifficulty
  prerequisites?: string[]
  estimatedMinutes?: number
  discrimination?: ProblemDifficulty
  qualityStatus?: ProblemQualityStatus
  qualityIssues?: ProblemQualityIssue[]
  qualityAuditedAt?: number
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
  durationSeconds?: number
  revealedAt?: number
}

export interface BossVictory {
  lectureId: string
  bossId: string
  bestScore: number
  victories: number
  lastDefeatedAt: number
}

export type DuelScope = 'all' | 'lecture' | 'weak' | 'choice'

export type PracticeSessionMode = 'practice' | 'boss' | 'ambush' | 'duel' | 'single'

export interface PracticeSessionSelection {
  lectureId: string
  sectionId?: string
  role: 'all' | 'concept' | 'example' | 'choice' | 'exercise'
  label: string
  mode?: 'practice' | 'boss' | 'ambush' | 'duel'
  challengeId?: string
  rivalId?: string
  deadlineAt?: number
  challengeSeed?: number
  opponentId?: string
  duelScope?: DuelScope
  duelLectureId?: string
  adaptiveMode?: AdaptivePracticeMode
}

export interface PracticeSessionAnswer {
  problemId: string
  thinking: boolean
  revealed: boolean
  selectedOptionIds: string[]
  choiceSubmitted: boolean
  expandedSectionIds: string[]
  thinkingStartedAt?: number
  revealedAt?: number
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

export interface PracticeSessionCheckpoint {
  id: string
  sessionId: string
  createdAt: number
  session: ActivePracticeSession
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
  surpriseChallengeWins: number
  surpriseChallengeLosses: number
  surpriseChallengeBestScore: number
  lastSurpriseChallengeId?: string
  lastSurpriseChallengeAt?: number
  duelWins: number
  duelLosses: number
  duelRecords: Record<string, { wins: number; losses: number; bestScore: number; lastPlayedAt: number }>
  lastDuelId?: string
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
