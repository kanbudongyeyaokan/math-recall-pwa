import { buildPointSeeds } from './buildPointSeeds'
import { calculus01to06Points } from './calculus01to06'
import { calculus07to12Points } from './calculus07to12'
import { calculus13to18Points } from './calculus13to18'
import { linearAlgebraPoints } from './linearAlgebra'
import { probabilityPoints } from './probability'
import { zhangYuFoundationQuestionSeeds } from './zhangYuFoundation30Bank'

export const curatedBankPoints = [
  ...calculus01to06Points,
  ...calculus07to12Points,
  ...calculus13to18Points,
  ...linearAlgebraPoints,
  ...probabilityPoints
]

export const curatedQuestionSeeds = [
  ...buildPointSeeds(curatedBankPoints),
  ...zhangYuFoundationQuestionSeeds
]
