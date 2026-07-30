import type { ActivePracticeSession, PracticeSessionAnswer, PracticeSessionMode, PracticeSessionSelection } from '../types'

export const ACTIVE_PRACTICE_SESSION_KEY = 'active-practice-session'

function emptyAnswer(problemId: string): PracticeSessionAnswer {
  return {
    problemId,
    thinking: false,
    revealed: false,
    selectedOptionIds: [],
    choiceSubmitted: false,
    expandedSectionIds: ['answer', 'core']
  }
}

export function createPracticeSession(input: {
  mode: PracticeSessionMode
  requestedId?: string
  selection?: PracticeSessionSelection
  queueIds: readonly string[]
  now?: number
}): ActivePracticeSession {
  const now = input.now ?? Date.now()
  return {
    version: 1,
    id: crypto.randomUUID(),
    mode: input.mode,
    requestedId: input.requestedId,
    selection: input.selection,
    queueIds: [...input.queueIds],
    queueIndex: 0,
    answer: emptyAnswer(input.queueIds[0] || ''),
    outcomes: [],
    startedAt: now,
    updatedAt: now
  }
}

export function sessionMatchesRequest(
  session: ActivePracticeSession | undefined,
  requestedId?: string,
  selection?: PracticeSessionSelection
) {
  if (!session || session.version !== 1 || session.queueIndex >= session.queueIds.length) return false
  if (requestedId) return session.mode === 'single' && session.requestedId === requestedId
  if (!selection || !session.selection) return false
  return session.selection.lectureId === selection.lectureId
    && session.selection.sectionId === selection.sectionId
    && session.selection.role === selection.role
    && (session.selection.mode || 'practice') === (selection.mode || 'practice')
    && (session.selection.adaptiveMode || 'mixed') === (selection.adaptiveMode || 'mixed')
    && session.selection.challengeId === selection.challengeId
}

export function sanitizePracticeSession(session: ActivePracticeSession, availableIds: ReadonlySet<string>) {
  const queueIds = session.queueIds.filter((id, index, ids) => availableIds.has(id) && ids.indexOf(id) === index)
  if (!queueIds.length) return undefined
  const currentId = session.queueIds[session.queueIndex]
  const queueIndex = currentId ? queueIds.indexOf(currentId) : -1
  const safeIndex = queueIndex >= 0 ? queueIndex : Math.min(session.queueIndex, queueIds.length - 1)
  const problemId = queueIds[safeIndex]
  return {
    ...session,
    queueIds,
    queueIndex: safeIndex,
    answer: session.answer.problemId === problemId ? session.answer : emptyAnswer(problemId),
    outcomes: session.outcomes.filter((outcome) => availableIds.has(outcome.problemId))
  }
}

export function getPendingPracticeSession(session?: ActivePracticeSession) {
  let pending = session
  while (pending?.outcomes.some((outcome) => outcome.problemId === pending!.queueIds[pending!.queueIndex])) {
    pending = advancePracticeSession(pending)
  }
  return pending
}

export function updateSessionAnswer(session: ActivePracticeSession, patch: Partial<PracticeSessionAnswer>, now = Date.now()) {
  return { ...session, answer: { ...session.answer, ...patch }, updatedAt: now }
}

export function completeSessionProblem(
  session: ActivePracticeSession,
  outcome: ActivePracticeSession['outcomes'][number],
  now = Date.now()
) {
  return {
    ...session,
    outcomes: [...session.outcomes.filter((item) => item.problemId !== outcome.problemId), outcome],
    updatedAt: now
  }
}

export function advancePracticeSession(session: ActivePracticeSession, now = Date.now()) {
  const queueIndex = session.queueIndex + 1
  if (queueIndex >= session.queueIds.length) return undefined
  return {
    ...session,
    queueIndex,
    answer: emptyAnswer(session.queueIds[queueIndex]),
    updatedAt: now
  }
}
