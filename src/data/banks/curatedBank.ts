import { buildPointSeeds } from './buildPointSeeds'
import { calculus01to06Points } from './calculus01to06'
import { calculus07to12Points } from './calculus07to12'
import { calculus13to18Points } from './calculus13to18'
import { linearAlgebraPoints } from './linearAlgebra'
import { probabilityPoints } from './probability'
import { zhangYuFoundationQuestionSeeds } from './zhangYuFoundation30Bank'
import { foundation30VerifiedExampleSeeds } from './foundation30VerifiedExamples'
import { foundation30Lecture1ExpansionSeeds } from './foundation30Lecture1Expansion'
import { foundation30Lecture2ExpansionSeeds } from './foundation30Lecture2Expansion'
import { foundation30Lecture2CompanionSeeds } from './foundation30Lecture2Companion'
import { foundation30Lecture3ExpansionSeeds } from './foundation30Lecture3Expansion'
import { foundation30Lecture4ExpansionSeeds } from './foundation30Lecture4Expansion'
import { foundation30Lecture5ExpansionSeeds } from './foundation30Lecture5Expansion'
import { lecture5CompanionExpansionSeeds } from './lecture5CompanionExpansion'
import { foundation30Lecture6ExpansionSeeds } from './foundation30Lecture6Expansion'
import { lecture6CompanionExpansionSeeds } from './lecture6CompanionExpansion'
import { foundation30Lecture7ExpansionSeeds } from './foundation30Lecture7Expansion'
import { lecture7CompanionExpansionSeeds } from './lecture7CompanionExpansion'
import { foundation30Lecture8ExpansionSeeds } from './foundation30Lecture8Expansion'
import { lecture8CompanionExpansionSeeds } from './lecture8CompanionExpansion'

export const curatedBankPoints = [
  ...calculus01to06Points,
  ...calculus07to12Points,
  ...calculus13to18Points,
  ...linearAlgebraPoints,
  ...probabilityPoints
]

export const curatedQuestionSeeds = [
  ...buildPointSeeds(curatedBankPoints),
  ...zhangYuFoundationQuestionSeeds,
  ...foundation30VerifiedExampleSeeds,
  ...foundation30Lecture1ExpansionSeeds,
  ...foundation30Lecture2ExpansionSeeds,
  ...foundation30Lecture2CompanionSeeds,
  ...foundation30Lecture3ExpansionSeeds,
  ...foundation30Lecture4ExpansionSeeds,
  ...foundation30Lecture5ExpansionSeeds,
  ...lecture5CompanionExpansionSeeds,
  ...foundation30Lecture6ExpansionSeeds,
  ...lecture6CompanionExpansionSeeds,
  ...foundation30Lecture7ExpansionSeeds,
  ...lecture7CompanionExpansionSeeds,
  ...foundation30Lecture8ExpansionSeeds,
  ...lecture8CompanionExpansionSeeds
]
