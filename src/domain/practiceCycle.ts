export interface PracticeCycleState {
  version: 1
  lectureId: string
  cycle: number
  seed: number
  orderIds: string[]
  seenIds: string[]
}

export interface PreparedPracticeCycle {
  state: PracticeCycleState
  changed: boolean
  restarted: boolean
}

function uniqueSorted(ids: readonly string[]) {
  return [...new Set(ids)].sort((a, b) => a.localeCompare(b))
}

function arraysEqual(a: readonly string[], b: readonly string[]) {
  return a.length === b.length && a.every((value, index) => value === b[index])
}

function nextRandom(seed: number) {
  let value = seed | 0
  value ^= value << 13
  value ^= value >>> 17
  value ^= value << 5
  return value >>> 0
}

export function shuffleProblemIds(ids: readonly string[], seed: number) {
  const shuffled = uniqueSorted(ids)
  let state = seed || 0x6d2b79f5
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    state = nextRandom(state)
    const target = state % (index + 1)
    const current = shuffled[index]
    shuffled[index] = shuffled[target]
    shuffled[target] = current
  }
  return shuffled
}

function createCycle(lectureId: string, ids: readonly string[], cycle: number, seed: number): PracticeCycleState {
  return {
    version: 1,
    lectureId,
    cycle,
    seed,
    orderIds: shuffleProblemIds(ids, seed),
    seenIds: []
  }
}

export function preparePracticeCycle(
  lectureId: string,
  problemIds: readonly string[],
  previous?: PracticeCycleState,
  seed = Date.now()
): PreparedPracticeCycle {
  const currentIds = uniqueSorted(problemIds)
  if (!previous || previous.version !== 1 || previous.lectureId !== lectureId) {
    return { state: createCycle(lectureId, currentIds, 1, seed), changed: true, restarted: false }
  }

  const currentSet = new Set(currentIds)
  const seenIds = previous.seenIds.filter((id, index, values) => currentSet.has(id) && values.indexOf(id) === index)
  if (currentIds.length > 0 && seenIds.length >= currentIds.length) {
    return {
      state: createCycle(lectureId, currentIds, previous.cycle + 1, seed),
      changed: true,
      restarted: true
    }
  }

  const retainedOrder = previous.orderIds.filter((id, index, values) => currentSet.has(id) && values.indexOf(id) === index)
  const retainedSet = new Set(retainedOrder)
  const addedIds = currentIds.filter((id) => !retainedSet.has(id))
  const orderIds = [...retainedOrder, ...shuffleProblemIds(addedIds, previous.seed + previous.cycle + retainedOrder.length)]
  const changed = !arraysEqual(orderIds, previous.orderIds) || !arraysEqual(seenIds, previous.seenIds)
  return { state: { ...previous, orderIds, seenIds }, changed, restarted: false }
}

export function markPracticeProblemSeen(state: PracticeCycleState, problemId: string) {
  if (!state.orderIds.includes(problemId) || state.seenIds.includes(problemId)) return state
  return { ...state, seenIds: [...state.seenIds, problemId] }
}

export function getUnseenPracticeIds(state: PracticeCycleState, candidateIds?: readonly string[]) {
  const seen = new Set(state.seenIds)
  const candidates = candidateIds ? new Set(candidateIds) : undefined
  return state.orderIds.filter((id) => !seen.has(id) && (!candidates || candidates.has(id)))
}

export function getPracticeCycleProgress(state: PracticeCycleState | undefined, problemIds: readonly string[]) {
  const ids = new Set(problemIds)
  const seen = state?.seenIds.filter((id) => ids.has(id)).length || 0
  return { seen, total: ids.size, complete: ids.size > 0 && seen >= ids.size }
}

export function getPracticeCycleSettingKey(lectureId: string) {
  return `practice-cycle:${lectureId}`
}
