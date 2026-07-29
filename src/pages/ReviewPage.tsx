import { useEffect, useRef, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import {
  ArrowLeft,
  Brain,
  Check,
  CheckCircle2,
  Clock3,
  ChevronDown,
  ChevronUp,
  CircleX,
  Eye,
  Image as ImageIcon,
  Lightbulb,
  ListChecks,
  Route,
  ScrollText,
  ShieldAlert,
  Swords,
  Volume2,
  VolumeX,
  X
} from 'lucide-react'
import { AudioSettingsControls } from '../components/AudioSettingsControls'
import { CultivatorScene } from '../components/CultivatorScene'
import { DbImage } from '../components/DbImage'
import { DuelResultModal } from '../components/DuelChallengeModal'
import { Lightbox } from '../components/Lightbox'
import { MathText } from '../components/MathText'
import { RewardReveal } from '../components/RewardReveal'
import { SurpriseChallengeResultModal } from '../components/SurpriseChallengeModal'
import {
  clearActivePracticeSession,
  db,
  defaultProfile,
  getActivePracticeSession,
  getOrStartPracticeCycle,
  recordPracticeCycleCompletion,
  recordBossBattleResult,
  recordDuelResult,
  recordReview,
  recordSurpriseChallengeResult,
  saveActivePracticeSession
} from '../db'
import {
  getLectureById,
  getProblemLectureIds,
  getProblemRole,
  matchesPracticeSelection,
  PRACTICE_ROLE_LABELS,
  type PracticeSelection
} from '../domain/curriculum'
import { buildBossQueue, getLectureBoss, scoreBossBattle } from '../domain/boss'
import {
  buildDuelQueue,
  DUEL_QUESTION_COUNT,
  DUEL_TIME_MS,
  getDuelPresentation,
  scoreDuel,
  type DuelScore
} from '../domain/duel'
import { getLectureMastery } from '../domain/mastery'
import type { RealmProgress } from '../domain/gamification'
import { getTechnique, type TechniqueResolution } from '../domain/cultivation'
import { formatProblemPageLabel, isChoiceAnswerCorrect } from '../domain/questions'
import { getUnseenPracticeIds } from '../domain/practiceCycle'
import {
  advancePracticeSession,
  completeSessionProblem,
  createPracticeSession,
  getPendingPracticeSession,
  sanitizePracticeSession,
  sessionMatchesRequest,
  updateSessionAnswer
} from '../domain/practiceSession'
import type { RomanceRouteId } from '../domain/story'
import {
  buildSurpriseChallengeQueue,
  formatChallengeTime,
  getSurpriseRival,
  scoreSurpriseChallenge,
  SURPRISE_CHALLENGE_QUESTION_COUNT,
  SURPRISE_CHALLENGE_TIME_MS,
  type SurpriseChallengeOffer,
  type SurpriseChallengeScore
} from '../domain/surpriseChallenge'
import type { ActivePracticeSession, PlayerProfile, Problem, ReviewRating, RewardCard, UnlockEvent } from '../types'
import {
  getAudioPreferences,
  playRewardSound,
  playSound,
  playUnlockSounds,
  pulseHaptic,
  resumeBackgroundMusic,
  saveAudioPreferences
} from '../utils/sound'
import { getReviewVoiceCue, getStoryVoiceCue, hasCharacterVoiceSupport, speakCharacterVoice, stopCharacterVoice, type CharacterVoiceCue } from '../utils/voice'

interface ReviewPageProps {
  requestedId?: string
  selection?: PracticeSelection
  onBack: () => void
  onComplete: () => void
}

const ratingOptions: { id: ReviewRating; label: string; caption: string; Icon: typeof Check }[] = [
  { id: 'again', label: '不会', caption: '标记薄弱，1 天后复做', Icon: CircleX },
  { id: 'hint', label: '提示后会', caption: '入口已找到', Icon: Lightbulb },
  { id: 'independent', label: '独立完成', caption: '完整闭合推导', Icon: Check },
  { id: 'multiple', label: '能够多解', caption: '掌握第二条路线', Icon: Route }
]

function problemOrder(a: { page: string; id: string }, b: { page: string; id: string }) {
  const pageA = Number(a.page.match(/\d+/)?.[0] || Number.MAX_SAFE_INTEGER)
  const pageB = Number(b.page.match(/\d+/)?.[0] || Number.MAX_SAFE_INTEGER)
  return pageA - pageB || a.id.localeCompare(b.id)
}

export function ReviewPage({ requestedId, selection, onBack, onComplete }: ReviewPageProps) {
  const allProblems = useLiveQuery(() => db.problems.filter((item) => !item.archived).toArray(), [])
  const problemIdKey = allProblems?.map((problem) => problem.id).sort().join('|')
  const [queue, setQueue] = useState<Problem[]>()
  const [activeSession, setActiveSession] = useState<ActivePracticeSession>()
  const [cycleStatus, setCycleStatus] = useState<{ cycle: number; lectureRemaining: number; selectedTotal: number }>()
  const profile = useLiveQuery(() => db.profiles.get('player'), [], defaultProfile) || defaultProfile
  const [queueIndex, setQueueIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [thinking, setThinking] = useState(false)
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([])
  const [choiceSubmitted, setChoiceSubmitted] = useState(false)
  const romanceSetting = useLiveQuery(() => db.settings.get('active-romance-route'))
  const [audioPreferences, setAudioPreferences] = useState(getAudioPreferences)
  const [audioOpen, setAudioOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['answer', 'core']))
  const [saving, setSaving] = useState(false)
  const [lightbox, setLightbox] = useState<{ id: string; alt: string }>()
  const [ambushTimeRemaining, setAmbushTimeRemaining] = useState(0)
  const [duelTimeRemaining, setDuelTimeRemaining] = useState(0)
  const ambushResolvingRef = useRef(false)
  const ambushWarningPlayedRef = useRef(false)
  const duelResolvingRef = useRef(false)
  const duelWarningPlayedRef = useRef(false)
  const [ambushResult, setAmbushResult] = useState<{
    offer: SurpriseChallengeOffer
    score: SurpriseChallengeScore
    profile: PlayerProfile
    coinBonus: number
  }>()
  const [duelResult, setDuelResult] = useState<{
    opponentId: string
    score: DuelScore
    profile: PlayerProfile
    coinBonus: number
    bondBonus: number
  }>()
  const [reward, setReward] = useState<{
    card: RewardCard
    xp: number
    intervalDays: number
    advanced: boolean
    realmBreakthrough: boolean
    nextRealm: RealmProgress
    coinsEarned: number
    encouragement: string
    profile: PlayerProfile
    technique: TechniqueResolution
    unlockEvents: UnlockEvent[]
    voiceCue: CharacterVoiceCue
  }>()

  const problem = queue?.[queueIndex]
  const isChoice = problem?.questionFormat === 'single-choice' || problem?.questionFormat === 'multiple-choice'
  const choiceCorrect = !!problem && choiceSubmitted && isChoiceAnswerCorrect(selectedOptionIds, problem.correctOptionIds)
  const lecture = selection
    ? getLectureById(selection.lectureId)
    : getLectureById(problem ? getProblemLectureIds(problem)[0] : undefined)
  const queueLabel = selection?.label || (lecture ? `第 ${lecture.number} 讲 · ${PRACTICE_ROLE_LABELS[getProblemRole(problem!)]}` : '自选题目')
  const voiceSupported = hasCharacterVoiceSupport()
  const boss = selection?.mode === 'boss' ? getLectureBoss(selection.lectureId) : undefined
  const bossProgress = boss ? scoreBossBattle(activeSession?.outcomes || [], queue || []) : undefined
  const ambushRival = selection?.mode === 'ambush' ? getSurpriseRival(selection.rivalId) : undefined
  const ambushOffer: SurpriseChallengeOffer | undefined = ambushRival && selection?.challengeId && selection.deadlineAt
    ? {
        id: selection.challengeId,
        rivalId: ambushRival.id,
        createdAt: selection.deadlineAt - SURPRISE_CHALLENGE_TIME_MS,
        expiresAt: selection.deadlineAt,
        seed: selection.challengeSeed || selection.deadlineAt
      }
    : undefined
  const ambushProgress = ambushOffer && queue
    ? scoreSurpriseChallenge({ outcomes: activeSession?.outcomes || [], problems: queue, deadlineAt: selection!.deadlineAt!, completedAt: Date.now() })
    : undefined
  const duelOpponentId = selection?.mode === 'duel' ? selection.opponentId : undefined
  const duelPresentation = duelOpponentId ? getDuelPresentation(duelOpponentId) : undefined
  const duelProgress = duelOpponentId && queue && selection?.deadlineAt
    ? scoreDuel({
        outcomes: activeSession?.outcomes || [],
        problems: queue,
        opponentId: duelOpponentId,
        deadlineAt: selection.deadlineAt,
        completedAt: Math.min(Date.now(), selection.deadlineAt)
      })
    : undefined
  const effectiveAmbushTime = selection?.deadlineAt
    ? ambushTimeRemaining || Math.max(0, selection.deadlineAt - Date.now())
    : 0
  const effectiveDuelTime = selection?.deadlineAt
    ? duelTimeRemaining || Math.max(0, selection.deadlineAt - Date.now())
    : 0

  useEffect(() => {
    let cancelled = false
    setQueue(undefined)
    setQueueIndex(0)
    setCycleStatus(undefined)
    if (!allProblems) return () => { cancelled = true }

    async function buildQueue() {
      const availableById = new Map(allProblems!.map((problem) => [problem.id, problem]))
      const restoreOrCreate = async (nextProblems: Problem[]) => {
        if (!nextProblems.length) {
          if (!cancelled) setQueue([])
          return
        }
        const stored = await getActivePracticeSession()
        let restored = sessionMatchesRequest(stored, requestedId, selection)
          ? sanitizePracticeSession(stored!, new Set(availableById.keys()))
          : undefined
        if (restored) {
          const pending = getPendingPracticeSession(restored)
          if (!pending) {
            await clearActivePracticeSession(restored.id)
            if (!cancelled) setQueue([])
            return
          }
          restored = pending
        }
        const session = restored || createPracticeSession({
          mode: requestedId ? 'single' : selection?.mode === 'boss' ? 'boss' : selection?.mode === 'ambush' ? 'ambush' : selection?.mode === 'duel' ? 'duel' : 'practice',
          requestedId,
          selection,
          queueIds: nextProblems.map((problem) => problem.id)
        })
        const sessionQueue = session.queueIds.flatMap((id) => availableById.get(id) || [])
        await saveActivePracticeSession(session)
        if (!cancelled) {
          setActiveSession(session)
          setQueueIndex(session.queueIndex)
          setQueue(sessionQueue)
        }
      }

      if (requestedId) {
        const requested = allProblems!.find((problem) => problem.id === requestedId)
        await restoreOrCreate(requested ? [requested] : [])
        return
      }
      if (!selection) {
        await restoreOrCreate([...allProblems!].sort(problemOrder))
        return
      }

      if (selection.mode === 'ambush') {
        const queueIds = buildSurpriseChallengeQueue(allProblems!, selection.challengeSeed)
        await restoreOrCreate(queueIds.flatMap((id) => availableById.get(id) || []))
        return
      }

      if (selection.mode === 'duel' && selection.opponentId) {
        const currentProfile = await db.profiles.get('player') || profile
        const queueIds = buildDuelQueue({
          problems: allProblems!,
          profile: currentProfile,
          scope: selection.duelScope || 'all',
          lectureId: selection.duelLectureId,
          seed: selection.challengeSeed
        })
        await restoreOrCreate(queueIds.flatMap((id) => availableById.get(id) || []))
        return
      }

      const lectureProblems = allProblems!.filter((problem) => getProblemLectureIds(problem).includes(selection.lectureId))
      if (selection.mode === 'boss') {
        const reviews = await db.reviews.toArray()
        const mastery = getLectureMastery(allProblems!, reviews, selection.lectureId)
        const queueIds = buildBossQueue(allProblems!, mastery)
        const byId = new Map(lectureProblems.map((problem) => [problem.id, problem]))
        await restoreOrCreate(queueIds.flatMap((id) => byId.get(id) || []))
        return
      }
      const selectedProblems = lectureProblems.filter((problem) => matchesPracticeSelection(problem, selection))
      const prepared = await getOrStartPracticeCycle(selection.lectureId, lectureProblems.map((problem) => problem.id))
      const selectedIds = new Set(selectedProblems.map((problem) => problem.id))
      const unseenIds = getUnseenPracticeIds(prepared.state, [...selectedIds])
      if (!cancelled) {
        setCycleStatus({
          cycle: prepared.state.cycle,
          lectureRemaining: getUnseenPracticeIds(prepared.state).length,
          selectedTotal: selectedProblems.length
        })
      }
      const byId = new Map(selectedProblems.map((problem) => [problem.id, problem]))
      await restoreOrCreate(unseenIds.flatMap((id) => byId.get(id) || []))
    }

    void buildQueue()
    return () => { cancelled = true }
  }, [requestedId, selection?.lectureId, selection?.sectionId, selection?.role, selection?.mode, selection?.challengeId, selection?.duelScope, selection?.duelLectureId, problemIdKey])

  useEffect(() => {
    stopCharacterVoice()
    const saved = activeSession && activeSession.answer.problemId === problem?.id ? activeSession.answer : undefined
    setRevealed(saved?.revealed || false)
    setThinking(saved?.thinking || false)
    setSelectedOptionIds(saved?.selectedOptionIds || [])
    setChoiceSubmitted(saved?.choiceSubmitted || false)
    setExpandedSections(new Set(saved?.expandedSectionIds?.length
      ? saved.expandedSectionIds
      : ['answer', 'core', ...(problem?.solutionMethods[0]?.id ? [`method:${problem.solutionMethods[0].id}`] : [])]))
  }, [problem?.id])

  useEffect(() => () => stopCharacterVoice(), [])

  useEffect(() => {
    if (!audioOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setAudioOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [audioOpen])

  useEffect(() => {
    ambushResolvingRef.current = false
    ambushWarningPlayedRef.current = false
    duelResolvingRef.current = false
    duelWarningPlayedRef.current = false
    setAmbushResult(undefined)
    setDuelResult(undefined)
  }, [selection?.challengeId])

  useEffect(() => {
    if (!ambushOffer || !selection?.deadlineAt || ambushResult) return
    const updateCountdown = () => {
      const remaining = Math.max(0, selection.deadlineAt! - Date.now())
      setAmbushTimeRemaining(remaining)
      if (remaining > 0 && remaining <= 60_000 && !ambushWarningPlayedRef.current) {
        ambushWarningPlayedRef.current = true
        playSound('countdown-warning')
        pulseHaptic([35, 45, 35])
      }
      if (remaining === 0 && !saving && activeSession && queue?.length) void finishAmbush(activeSession, true)
    }
    updateCountdown()
    const timer = window.setInterval(updateCountdown, 1000)
    return () => window.clearInterval(timer)
  }, [activeSession?.id, activeSession?.outcomes.length, ambushOffer?.id, ambushResult, queue?.length, saving, selection?.deadlineAt])

  useEffect(() => {
    if (!duelOpponentId || !selection?.deadlineAt || duelResult) return
    const updateCountdown = () => {
      const remaining = Math.max(0, selection.deadlineAt! - Date.now())
      setDuelTimeRemaining(remaining)
      if (remaining > 0 && remaining <= 60_000 && !duelWarningPlayedRef.current) {
        duelWarningPlayedRef.current = true
        playSound('countdown-warning')
        pulseHaptic([35, 45, 35])
      }
      if (remaining === 0 && !saving && activeSession && queue?.length) void finishDuel(activeSession, true)
    }
    updateCountdown()
    const timer = window.setInterval(updateCountdown, 1000)
    return () => window.clearInterval(timer)
  }, [activeSession?.id, activeSession?.outcomes.length, duelOpponentId, duelResult, queue?.length, saving, selection?.deadlineAt])

  async function finishAmbush(session: ActivePracticeSession, forcedTimeout = false) {
    if (!ambushOffer || !ambushRival || !queue || !selection?.deadlineAt || ambushResolvingRef.current) return
    ambushResolvingRef.current = true
    try {
      const completedAt = forcedTimeout ? Math.max(Date.now(), selection.deadlineAt + 1) : Date.now()
      const score = scoreSurpriseChallenge({ outcomes: session.outcomes, problems: queue, deadlineAt: selection.deadlineAt, completedAt })
      const recorded = await recordSurpriseChallengeResult({
        challengeId: ambushOffer.id,
        rivalId: ambushRival.id,
        score: score.score,
        passed: score.passed,
        timedOut: score.timedOut
      })
      await clearActivePracticeSession(session.id)
      const result = { offer: ambushOffer, score, profile: recorded.profile, coinBonus: recorded.coinBonus }
      setAmbushResult(result)
      if (forcedTimeout) {
        stopCharacterVoice()
        setReward(undefined)
        playSound('boss-defeat')
        pulseHaptic([90, 45, 120])
        if (getAudioPreferences().autoVoice) speakCharacterVoice(getStoryVoiceCue(ambushRival.id, ambushRival.defeat), { delayMs: 760 })
      }
      return result
    } catch (error) {
      ambushResolvingRef.current = false
      throw error
    }
  }

  async function finishDuel(session: ActivePracticeSession, forcedTimeout = false) {
    if (!duelOpponentId || !queue || !selection?.deadlineAt || !selection.challengeId || duelResolvingRef.current) return
    duelResolvingRef.current = true
    try {
      const completedAt = forcedTimeout ? Math.max(Date.now(), selection.deadlineAt + 1) : Date.now()
      const score = scoreDuel({ outcomes: session.outcomes, problems: queue, opponentId: duelOpponentId, deadlineAt: selection.deadlineAt, completedAt })
      const recorded = await recordDuelResult({
        challengeId: selection.challengeId,
        opponentId: duelOpponentId,
        score: score.score,
        passed: score.passed,
        timedOut: score.timedOut
      })
      await clearActivePracticeSession(session.id)
      const result = {
        opponentId: duelOpponentId,
        score,
        profile: recorded.profile,
        coinBonus: recorded.coinBonus,
        bondBonus: recorded.bondBonus
      }
      setDuelResult(result)
      if (forcedTimeout) {
        stopCharacterVoice()
        setReward(undefined)
        playSound('boss-defeat')
        pulseHaptic([90, 45, 120])
        if (getAudioPreferences().autoVoice) {
          speakCharacterVoice(getStoryVoiceCue(duelOpponentId, getDuelPresentation(duelOpponentId).opponentVictory), { delayMs: 760 })
        }
      }
      return result
    } catch (error) {
      duelResolvingRef.current = false
      throw error
    }
  }

  function persistAnswer(patch: Partial<ActivePracticeSession['answer']>) {
    setActiveSession((current) => {
      if (!current || current.answer.problemId !== problem?.id) return current
      const next = updateSessionAnswer(current, patch)
      void saveActivePracticeSession(next)
      return next
    })
  }

  function toggleOption(id: string) {
    if (!problem || choiceSubmitted) return
    playSound(problem.questionFormat === 'multiple-choice' && selectedOptionIds.includes(id) ? 'option-remove' : 'option')
    pulseHaptic(8)
    if (problem.questionFormat === 'single-choice') {
      setSelectedOptionIds([id])
      persistAnswer({ selectedOptionIds: [id] })
      return
    }
    const next = selectedOptionIds.includes(id) ? selectedOptionIds.filter((optionId) => optionId !== id) : [...selectedOptionIds, id]
    setSelectedOptionIds(next)
    persistAnswer({ selectedOptionIds: next })
  }

  function submitChoice() {
    if (!problem || !selectedOptionIds.length) return
    const correct = isChoiceAnswerCorrect(selectedOptionIds, problem.correctOptionIds)
    playSound(correct ? 'correct' : 'wrong')
    pulseHaptic(correct ? [16, 22, 34] : 45)
    setChoiceSubmitted(true)
    setThinking(true)
    persistAnswer({ choiceSubmitted: true, thinking: true })
  }

  function startThinking() {
    playSound('focus')
    setThinking(true)
    persistAnswer({ thinking: true })
  }

  function revealAnswer() {
    playSound('reveal')
    pulseHaptic(12)
    setRevealed(true)
    persistAnswer({ revealed: true })
  }

  function toggleSound() {
    const next = !audioPreferences.soundEnabled
    if (!next) playSound('sound-off')
    const preferences = saveAudioPreferences({ soundEnabled: next })
    setAudioPreferences(preferences)
    if (next) playSound('sound-on')
  }

  function toggleVoice() {
    const next = !audioPreferences.voiceEnabled
    if (!next) stopCharacterVoice()
    const preferences = saveAudioPreferences({ voiceEnabled: next })
    setAudioPreferences(preferences)
    if (next) {
      playSound('character-open')
      speakCharacterVoice(getStoryVoiceCue('he-yaokun', '角色语音助阵已开启。下一题，继续。'), { delayMs: 180 })
    }
  }

  function updateAudioPreferences(patch: Parameters<typeof saveAudioPreferences>[0]) {
    setAudioPreferences(saveAudioPreferences(patch))
  }

  function previewVoice() {
    speakCharacterVoice(getStoryVoiceCue('he-yaokun', '音量已经调好。何耀焜，保持节奏，继续破题。'))
  }

  function toggleAnalysisSection(id: string) {
    const next = new Set(expandedSections)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setExpandedSections(next)
    persistAnswer({ expandedSectionIds: [...next] })
  }

  function toggleAllMethods() {
    if (!problem) return
    const methodKeys = problem.solutionMethods.map((method) => `method:${method.id}`)
    const allExpanded = methodKeys.every((key) => expandedSections.has(key))
    const next = new Set(expandedSections)
    methodKeys.forEach((key) => allExpanded ? next.delete(key) : next.add(key))
    if (allExpanded && methodKeys[0]) next.add(methodKeys[0])
    setExpandedSections(next)
    persistAnswer({ expandedSectionIds: [...next] })
  }

  async function grade(rating: ReviewRating) {
    if (!problem || saving || !revealed) return
    if (ambushOffer && selection?.deadlineAt && Date.now() >= selection.deadlineAt && activeSession) {
      await finishAmbush(activeSession, true)
      return
    }
    if (duelOpponentId && selection?.deadlineAt && Date.now() >= selection.deadlineAt && activeSession) {
      await finishDuel(activeSession, true)
      return
    }
    setSaving(true)
    try {
      const result = await recordReview(problem.id, rating, isChoice ? {
        selectedOptionIds,
        isCorrect: choiceCorrect
      } : {})
      const cycleLectureId = selection?.lectureId || getProblemLectureIds(problem)[0]
      if (cycleLectureId && allProblems && selection?.mode !== 'boss' && selection?.mode !== 'ambush' && selection?.mode !== 'duel') {
        const lectureProblemIds = allProblems
          .filter((candidate) => getProblemLectureIds(candidate).includes(cycleLectureId))
          .map((candidate) => candidate.id)
        await recordPracticeCycleCompletion(cycleLectureId, problem.id, lectureProblemIds).catch(() => undefined)
      }
      let completedSession = activeSession
      let rewardProfile = result.profile
      let rewardCoins = result.coinsEarned
      let rewardEncouragement = result.encouragement
      let rewardUnlockEvents = result.unlockEvents
      let bossResultStatus: 'victory' | 'defeat' | undefined
      let ambushBattleResult: Awaited<ReturnType<typeof finishAmbush>> | undefined = undefined
      let duelBattleResult: Awaited<ReturnType<typeof finishDuel>> | undefined = undefined
      if (activeSession) {
        completedSession = completeSessionProblem(activeSession, {
          problemId: problem.id,
          rating,
          isCorrect: isChoice ? choiceCorrect : undefined
        })
        await saveActivePracticeSession(completedSession)
        setActiveSession(completedSession)
      }
      if (boss && queue && completedSession && queueIndex === queue.length - 1) {
        const battleScore = scoreBossBattle(completedSession.outcomes, queue)
        const bossResult = await recordBossBattleResult(boss.lectureId, battleScore.score, battleScore.passed)
        rewardProfile = bossResult.profile
        rewardCoins += bossResult.coinBonus
        bossResultStatus = battleScore.passed ? 'victory' : 'defeat'
        rewardUnlockEvents = [...new Map([...result.unlockEvents, ...bossResult.unlockEvents].map((event) => [event.id, event])).values()]
        rewardEncouragement = battleScore.passed
          ? `${result.encouragement} ${boss.name}已被击破，真实掌握通过检验。`
          : `${result.encouragement} ${boss.name}还剩 ${battleScore.remainingHp} 点生命；补强薄弱题后再战。`
      }
      if (ambushOffer && ambushRival && queue && completedSession && queueIndex === queue.length - 1) {
        ambushBattleResult = await finishAmbush(completedSession)
        if (ambushBattleResult) {
          rewardProfile = ambushBattleResult.profile
          rewardCoins += ambushBattleResult.coinBonus
          bossResultStatus = ambushBattleResult.score.passed ? 'victory' : 'defeat'
          rewardEncouragement = ambushBattleResult.score.passed
            ? `${result.encouragement} ${ambushRival.name}的突袭被你正面踩住，额外夺得 ${ambushBattleResult.coinBonus} 灵石。`
            : `${result.encouragement} ${ambushRival.name}赢下这一场；错题已经留下，下一次用结果打回去。`
        }
      }
      if (duelOpponentId && duelPresentation && queue && completedSession && queueIndex === queue.length - 1) {
        duelBattleResult = await finishDuel(completedSession)
        if (duelBattleResult) {
          rewardProfile = duelBattleResult.profile
          rewardCoins += duelBattleResult.coinBonus
          bossResultStatus = duelBattleResult.score.passed ? 'victory' : 'defeat'
          rewardEncouragement = duelBattleResult.score.passed
            ? `${result.encouragement} 你赢下了与${duelPresentation.name}的五题挑战，额外获得 ${duelBattleResult.coinBonus} 灵石。`
            : `${result.encouragement} ${duelPresentation.name}守住这一场；真实错因已经留下，修正后再战。`
        }
      }
      const soundDuration = playRewardSound({
        rating,
        techniqueTriggered: result.technique.triggered,
        coinsEarned: rewardCoins,
        advanced: result.advance.advanced,
        realmBreakthrough: result.advance.realmBreakthrough,
        masteryGained: result.problemMastered,
        corrected: result.problemCorrected,
        bossHit: (!!boss || !!ambushRival || !!duelOpponentId) && (rating === 'independent' || rating === 'multiple') && (!isChoice || choiceCorrect),
        bossResult: bossResultStatus
      })
      const unlockSoundDuration = rewardUnlockEvents.length
        ? playUnlockSounds(rewardUnlockEvents, soundDuration + 120)
        : 0
      const voiceCue = duelBattleResult && duelOpponentId && duelPresentation
        ? getStoryVoiceCue(
            duelBattleResult.score.passed ? 'he-yaokun' : duelOpponentId,
            duelBattleResult.score.passed ? duelPresentation.playerVictory : duelPresentation.opponentVictory
          )
        : ambushBattleResult && ambushRival
        ? getStoryVoiceCue(
            ambushBattleResult.score.passed ? 'he-yaokun' : ambushRival.id,
            ambushBattleResult.score.passed ? '突发邀战拿下。想用嘲讽压住我，只会让我下一题更强。' : ambushRival.defeat
          )
        : getReviewVoiceCue({
            profile: rewardProfile,
            rating,
            isCorrect: choiceCorrect,
            advanced: result.advance.advanced,
            realmBreakthrough: result.advance.realmBreakthrough,
            activeRouteId: romanceSetting?.value as RomanceRouteId | undefined,
            seed: rewardProfile.totalReviews + problem.reviewCount
          })
      pulseHaptic(result.advance.realmBreakthrough ? [55, 35, 85, 35, 120] : result.advance.advanced ? [35, 25, 55, 25, 75] : [28, 24, 48])
      setReward({
        card: result.reward,
        xp: result.outcome.xp,
        intervalDays: result.outcome.intervalDays,
        advanced: result.advance.advanced,
        realmBreakthrough: result.advance.realmBreakthrough,
        nextRealm: result.advance.next,
        coinsEarned: rewardCoins,
        encouragement: rewardEncouragement,
        profile: rewardProfile,
        technique: result.technique,
        unlockEvents: rewardUnlockEvents,
        voiceCue
      })
      if (getAudioPreferences().autoVoice) speakCharacterVoice(voiceCue, { delayMs: Math.max(soundDuration, unlockSoundDuration) + 160 })
    } finally {
      setSaving(false)
    }
  }

  async function closeReward() {
    stopCharacterVoice()
    playSound('next')
    setReward(undefined)
    if ((ambushResult || duelResult) && queue && queueIndex === queue.length - 1) return
    if (queue && queueIndex < queue.length - 1) {
      if (activeSession) {
        const next = advancePracticeSession(activeSession)
        if (next) {
          await saveActivePracticeSession(next)
          setActiveSession(next)
          setQueueIndex(next.queueIndex)
        }
      } else {
        setQueueIndex((index) => index + 1)
      }
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    await clearActivePracticeSession(activeSession?.id)
    setActiveSession(undefined)
    onComplete()
  }

  function closeAmbushResult() {
    stopCharacterVoice()
    playSound('next')
    setAmbushResult(undefined)
    onComplete()
  }

  function closeDuelResult() {
    stopCharacterVoice()
    playSound('next')
    setDuelResult(undefined)
    onComplete()
  }

  if (queue === undefined) {
    return <main className="page centered-state"><div className="loader" /><p>正在打开题目…</p></main>
  }

  if (!problem) {
    const selectionExhausted = !!selection && !!cycleStatus?.selectedTotal && cycleStatus.lectureRemaining > 0
    return (
      <main className="page centered-state">
        <Brain size={46} />
        <h1>{selectionExhausted ? '本轮这个板块已经刷完' : selection ? '这个板块还没有题目' : '题库还是空的'}</h1>
        <p>{selectionExhausted
          ? `第 ${cycleStatus?.cycle} 轮本讲还有 ${cycleStatus?.lectureRemaining} 道未刷。换一个板块继续；整讲全部完成后才会重新洗牌。`
          : selection ? '返回讲次地图，换一个板块；也可以在题库中录入自己的经典题。' : '先拍下一道典型题，就能开始你的做题旅程。'}</p>
        <button type="button" className="button button-primary" onClick={onBack}>返回</button>
      </main>
    )
  }

  return (
    <main className="page review-page practice-session-page">
      <header className="review-header">
        <button type="button" className="icon-button" onClick={onBack} aria-label="退出本次做题"><ArrowLeft size={22} /></button>
        <div>
          <span>{queueLabel}</span>
          <small>{problem.kind === 'concept' ? '定义与判据' : problem.questionFormat === 'open' ? '主观题' : problem.questionFormat === 'single-choice' ? '单选题' : '多选题'}</small>
        </div>
        <div className="review-header-actions">
          <button type="button" className="icon-button sound-toggle" onClick={() => setAudioOpen(true)} aria-label="打开音效和语音设置" aria-expanded={audioOpen} title="音效和语音设置">
            {audioPreferences.soundEnabled || audioPreferences.voiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
          <span className="review-count session-saved" title="当前进度已保存到本机">{queueIndex + 1}/{queue.length}</span>
        </div>
      </header>

      {audioOpen && (
        <div className="audio-quick-backdrop" role="dialog" aria-modal="true" aria-labelledby="audio-quick-title" onMouseDown={(event) => event.target === event.currentTarget && setAudioOpen(false)}>
          <section className="audio-quick-panel">
            <header><div><span>本次做题</span><h2 id="audio-quick-title">音效与角色语音</h2></div><button type="button" className="icon-button" onClick={() => setAudioOpen(false)} autoFocus aria-label="关闭音频设置"><X size={20} /></button></header>
            <div className="audio-quick-toggles">
              <label><span><strong>做题音效</strong><small>答题、灵石与突破反馈</small></span><input type="checkbox" role="switch" checked={audioPreferences.soundEnabled} onChange={toggleSound} /></label>
              <label><span><strong>角色语音</strong><small>{voiceSupported ? '结算鼓励与剧情台词' : '当前浏览器不支持语音'}</small></span><input type="checkbox" role="switch" checked={audioPreferences.voiceEnabled && voiceSupported} onChange={toggleVoice} disabled={!voiceSupported} /></label>
            </div>
            <AudioSettingsControls preferences={audioPreferences} voiceSupported={voiceSupported} onChange={updateAudioPreferences} onPreviewMusic={() => void resumeBackgroundMusic()} onPreviewSound={() => playSound('coin')} onPreviewVoice={previewVoice} idPrefix="review-audio" compact />
          </section>
        </div>
      )}

      <div className="session-progress" role="progressbar" aria-label="本次做题进度" aria-valuemin={0} aria-valuemax={queue.length} aria-valuenow={queueIndex + 1}>
        <span style={{ width: `${((queueIndex + 1) / queue.length) * 100}%` }} />
      </div>

      {boss && bossProgress && (
        <section className="boss-battle-hud" aria-label={`${boss.name}生命值`}>
          <div><span><Swords size={15} />Boss 战 · {boss.title}</span><strong>{boss.name}</strong></div>
          <b>HP {Math.max(0, boss.maxHp - bossProgress.damage)}/{boss.maxHp}</b>
          <div className="boss-hp-track"><span style={{ width: `${Math.max(0, boss.maxHp - bossProgress.damage)}%` }} /></div>
          <small>至少 4 题独立完成且造成 80 点伤害</small>
        </section>
      )}

      {ambushRival && ambushOffer && ambushProgress && selection?.deadlineAt && (
        <section className={`ambush-battle-hud ${effectiveAmbushTime <= 60_000 ? 'is-urgent' : ''}`} aria-label={`${ambushRival.name}突发邀战倒计时`}>
          <div><span><Swords size={15} />突发邀战 · {ambushRival.title}</span><strong>{ambushRival.name}</strong></div>
          <b><Clock3 size={16} />{formatChallengeTime(effectiveAmbushTime)}</b>
          <div className="ambush-time-track"><span style={{ width: `${Math.min(100, (effectiveAmbushTime / SURPRISE_CHALLENGE_TIME_MS) * 100)}%` }} /></div>
          <small>已完成 {ambushProgress.completed}/{SURPRISE_CHALLENGE_QUESTION_COUNT} · 独立命中 {ambushProgress.strongWins}/4 · 压制 {ambushProgress.score}/100</small>
        </section>
      )}

      {duelOpponentId && duelPresentation && duelProgress && selection?.deadlineAt && (
        <section className={`duel-battle-hud ${effectiveDuelTime <= 60_000 ? 'is-urgent' : ''}`} aria-label={`与${duelPresentation.name}的五题挑战倒计时`}>
          <div><span><Swords size={15} />{duelPresentation.ruleLabel}</span><strong>{duelPresentation.name}</strong></div>
          <b><Clock3 size={16} />{formatChallengeTime(effectiveDuelTime)}</b>
          <div className="duel-time-track"><span style={{ width: `${Math.min(100, (effectiveDuelTime / DUEL_TIME_MS) * 100)}%` }} /></div>
          <small>已完成 {duelProgress.completed}/{DUEL_QUESTION_COUNT} · 强命中 {duelProgress.strongWins}/{duelPresentation.requiredStrongWins} · 压制 {duelProgress.score}/100</small>
        </section>
      )}

      <div className="active-technique-strip"><ScrollText size={16} /><span>运转功法</span><strong>{getTechnique(profile.activeTechniqueId).name}</strong><small>{getTechnique(profile.activeTechniqueId).triggerLabel}</small></div>

      <article className="review-card">
        <div className="review-meta">
          <span>{problem.source || '个人题库'}{problem.page ? ` · ${formatProblemPageLabel(problem.page)}` : ''}</span>
          {isChoice && <span><ListChecks size={14} /> {problem.questionFormat === 'single-choice' ? '单选' : '多选'}</span>}
        </div>
        <h1>{problem.title}</h1>
        <div className="tag-list">
          {[...new Set(problem.tags)].map((tag) => <span className="tag" key={tag}>{tag}</span>)}
        </div>
        {problem.questionImageId && (
          <DbImage
            imageId={problem.questionImageId}
            alt={`${problem.title}题目图片`}
            className="review-image"
            onClick={() => setLightbox({ id: problem.questionImageId!, alt: `${problem.title}题目图片` })}
          />
        )}
        {problem.statement && <MathText className="problem-statement" text={problem.statement} />}

        {isChoice && (
          <div className="choice-list" role="group" aria-label={problem.questionFormat === 'single-choice' ? '单选题选项' : '多选题选项'}>
            {problem.options.map((option) => {
              const selected = selectedOptionIds.includes(option.id)
              const correct = revealed && problem.correctOptionIds.includes(option.id)
              const incorrect = revealed && selected && !problem.correctOptionIds.includes(option.id)
              return (
                <button
                  type="button"
                  key={option.id}
                  className={`choice-option ${selected ? 'selected' : ''} ${correct ? 'correct' : ''} ${incorrect ? 'incorrect' : ''}`}
                  onClick={() => toggleOption(option.id)}
                  disabled={choiceSubmitted}
                  aria-pressed={selected}
                >
                  <span>{option.id}</span><MathText className="choice-option-text" text={option.text} enableTheoremLinks={false} />
                  {correct && <CheckCircle2 size={18} />}
                  {incorrect && <CircleX size={18} />}
                </button>
              )
            })}
          </div>
        )}
      </article>

      {!revealed ? (
        <section className={`answer-gate ${thinking ? 'is-thinking' : ''} ${choiceCorrect ? 'is-correct' : ''}`}>
          {choiceSubmitted && choiceCorrect ? (
            <div className="choice-cheer">
              <CultivatorScene profile={profile} pose="victory" compact label="何耀焜答对题目后欢呼" />
              <div><strong>判断命中，漂亮！</strong><span>先回想你的依据，再展开多方法解析。</span></div>
            </div>
          ) : !isChoice && thinking ? (
            <CultivatorScene profile={profile} pose="focus" compact label="何耀焜凝聚公式专注思考" />
          ) : <div className="gate-icon"><Brain size={30} /></div>}
          {isChoice ? (
            !choiceSubmitted ? (
              <>
                <h2>{selectedOptionIds.length ? '确认你的判断' : '答案仍然锁定'}</h2>
                <p>{problem.questionFormat === 'multiple-choice' ? '可选择多个选项，确认后本题不可改选。' : '选择一个答案，锁定后再看解析。'}</p>
                <button type="button" className="button button-primary button-full" onClick={submitChoice} disabled={!selectedOptionIds.length}>
                  <Check size={19} /> 锁定答案
                </button>
              </>
            ) : (
              <>
                {!choiceCorrect && <div className="choice-result incorrect"><CircleX size={21} /><strong>这次没有命中</strong></div>}
                {!choiceCorrect && <p>先定位犹豫点。正确选项仍在解析中锁定，等你主动揭晓。</p>}
                <button type="button" className="button button-accent button-full" onClick={revealAnswer}>
                  <Eye size={19} /> 查看完整解析
                </button>
              </>
            )
          ) : (
            <>
              <h2>{thinking ? '在脑中走完关键步骤' : '答案已锁定'}</h2>
              <p>{thinking ? '想清入口、关键变形、适用条件和验算，再揭晓。' : '先独立思考，避免把“看懂”错当成“会做”。'}</p>
              {!thinking ? (
                <button type="button" className="button button-primary button-full" onClick={startThinking}><Brain size={19} /> 开始思考</button>
              ) : (
                <button type="button" className="button button-accent button-full" onClick={revealAnswer}><Eye size={19} /> 我已经想过了，揭晓答案</button>
              )}
            </>
          )}
        </section>
      ) : (
        <section className="answer-panel">
          <div className="answer-heading"><Eye size={19} /><div><h2>解析与多解</h2><p>先读结论，再逐条展开解法</p></div></div>
          <nav className="analysis-index" aria-label="解析内容索引">
            {problem.answerText && <span>答案结论</span>}
            {!!problem.solutionMethods.length && <span>{problem.solutionMethods.length} 种解法</span>}
            {problem.coreMethod && <span>核心方法</span>}
            {problem.mistakes && <span>易错点</span>}
          </nav>
          {problem.answerImageId && (
            <DbImage
              imageId={problem.answerImageId}
              alt={`${problem.title}答案图片`}
              className="review-image answer-image"
              onClick={() => setLightbox({ id: problem.answerImageId!, alt: `${problem.title}答案图片` })}
            />
          )}
          {problem.answerText && (
            <section className={`analysis-section answer-summary ${expandedSections.has('answer') ? 'expanded' : ''}`}>
              <button type="button" className="analysis-section-toggle" onClick={() => toggleAnalysisSection('answer')} aria-expanded={expandedSections.has('answer')}>
                <span><CheckCircle2 size={18} /><strong>答案与结论</strong></span>{expandedSections.has('answer') ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {expandedSections.has('answer') && <MathText className="answer-text" text={problem.answerText} />}
            </section>
          )}
          {!!problem.solutionMethods.length && (
            <div className="solution-methods">
              <div className="solution-methods-heading"><div><Route size={18} /><span><strong>分步解法</strong><small>默认展开第一种，按需比较</small></span></div>{problem.solutionMethods.length > 1 && <button type="button" onClick={toggleAllMethods}>{problem.solutionMethods.every((method) => expandedSections.has(`method:${method.id}`)) ? '收起其余' : '全部展开'}</button>}</div>
              {problem.solutionMethods.map((method, index) => (
                <article className={`solution-method ${expandedSections.has(`method:${method.id}`) ? 'expanded' : ''}`} key={method.id}>
                  <button type="button" className="solution-method-toggle" onClick={() => toggleAnalysisSection(`method:${method.id}`)} aria-expanded={expandedSections.has(`method:${method.id}`)}>
                    <span><i>{index + 1}</i><strong>{method.title}</strong></span>
                    {expandedSections.has(`method:${method.id}`) ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                  {expandedSections.has(`method:${method.id}`) && <MathText text={method.content} />}
                </article>
              ))}
            </div>
          )}
          {problem.coreMethod && (
            <section className={`insight-block method-block ${expandedSections.has('core') ? 'expanded' : ''}`}>
              <button type="button" onClick={() => toggleAnalysisSection('core')} aria-expanded={expandedSections.has('core')}><span><Lightbulb size={18} /><strong>核心方法</strong></span>{expandedSections.has('core') ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</button>
              {expandedSections.has('core') && <MathText text={problem.coreMethod} />}
            </section>
          )}
          {problem.mistakes && (
            <section className={`insight-block mistake-block ${expandedSections.has('mistakes') ? 'expanded' : ''}`}>
              <button type="button" onClick={() => toggleAnalysisSection('mistakes')} aria-expanded={expandedSections.has('mistakes')}><span><ShieldAlert size={18} /><strong>易错点</strong></span>{expandedSections.has('mistakes') ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</button>
              {expandedSections.has('mistakes') && <MathText text={problem.mistakes} />}
            </section>
          )}

          <div className="rating-section">
            <p className="eyebrow">这次真正完成到哪一步？</p>
            <div className="rating-grid">
              {ratingOptions.map(({ id, label, caption, Icon }) => (
                <button type="button" key={id} className={`rating-button rating-${id}`} onClick={() => grade(id)} disabled={saving}>
                  <Icon size={19} /><span><strong>{label}</strong><small>{caption}</small></span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {!problem.questionImageId && !problem.statement && <div className="empty-inline"><ImageIcon size={18} />这张卡还没有题面，请稍后编辑补充。</div>}
      {lightbox && <Lightbox imageId={lightbox.id} alt={lightbox.alt} onClose={() => setLightbox(undefined)} />}
      {reward && (
        <RewardReveal
          {...reward}
          onReplayVoice={() => speakCharacterVoice(reward.voiceCue)}
          continueLabel={queueIndex < queue.length - 1 ? `继续下一题 · ${queueIndex + 2}/${queue.length}` : ambushResult ? '查看邀战结算' : duelResult ? '查看挑战结算' : selection ? '完成本轮，返回讲次' : '完成本题'}
          onClose={closeReward}
        />
      )}
      {ambushResult && !reward && <SurpriseChallengeResultModal {...ambushResult} onClose={closeAmbushResult} />}
      {duelResult && !reward && <DuelResultModal {...duelResult} onClose={closeDuelResult} />}
    </main>
  )
}
