export function isChoiceAnswerCorrect(selectedOptionIds: string[], correctOptionIds: string[]) {
  if (selectedOptionIds.length !== correctOptionIds.length) return false
  const correct = new Set(correctOptionIds)
  return selectedOptionIds.every((id) => correct.has(id))
}

export function formatProblemPageLabel(page: string) {
  const trimmed = page.trim()
  if (!trimmed) return ''
  if (/^(?:pdf\b|p(?=\d)|第.+页$)/i.test(trimmed)) return trimmed
  return `P${trimmed}`
}
