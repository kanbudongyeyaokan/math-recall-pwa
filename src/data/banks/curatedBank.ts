import { buildPointSeeds } from './buildPointSeeds'
import { calculus01to06Points } from './calculus01to06'
import { calculus07to12Points } from './calculus07to12'
import { calculus13to18Points } from './calculus13to18'
import { calculusQualityExpansionPoints } from './calculusQualityExpansionBank'
import { linearAlgebraPoints } from './linearAlgebra'
import { probabilityPoints } from './probability'
import { wuFoundationPoints } from './wuFoundationRebuiltBank'

export const curatedBankPoints = [
  ...calculus01to06Points,
  ...calculus07to12Points,
  ...calculus13to18Points,
  ...linearAlgebraPoints,
  ...probabilityPoints
]

export const curatedQuestionSeeds = [
  ...buildPointSeeds(curatedBankPoints),
  ...buildPointSeeds(wuFoundationPoints, {
    idPrefix: 'wzx27',
    sharedTag: '高数基础方法强化',
    varyChoicePosition: true
  }),
  ...buildPointSeeds(calculusQualityExpansionPoints, {
    idPrefix: 'dpm20',
    sharedTag: '经典方法精选',
    varyChoicePosition: true
  })
]
