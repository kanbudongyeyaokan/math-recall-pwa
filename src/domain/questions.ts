export function isChoiceAnswerCorrect(selectedOptionIds: string[], correctOptionIds: string[]) {
  if (selectedOptionIds.length !== correctOptionIds.length) return false
  const correct = new Set(correctOptionIds)
  return selectedOptionIds.every((id) => correct.has(id))
}
