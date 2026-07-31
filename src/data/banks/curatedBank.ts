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
import { foundation30Lecture9ExpansionSeeds } from './foundation30Lecture9Expansion'
import { lecture9CompanionExpansionSeeds } from './lecture9CompanionExpansion'
import { foundation30Lecture10ExpansionSeeds } from './foundation30Lecture10Expansion'
import { lecture10CompanionExpansionSeeds } from './lecture10CompanionExpansion'
import { foundation30Lecture11ExpansionSeeds } from './foundation30Lecture11Expansion'
import { lecture11CompanionExpansionSeeds } from './lecture11CompanionExpansion'
import { wuLecture11ExpansionSeeds } from './wuLecture11Expansion'
import { foundation30Lecture12ExpansionSeeds } from './foundation30Lecture12Expansion'
import { lecture12CompanionExpansionSeeds } from './lecture12CompanionExpansion'
import { wuLecture12ExpansionSeeds } from './wuLecture12Expansion'

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
  ...lecture8CompanionExpansionSeeds,
  ...foundation30Lecture9ExpansionSeeds,
  ...lecture9CompanionExpansionSeeds,
  ...foundation30Lecture10ExpansionSeeds,
  ...lecture10CompanionExpansionSeeds,
  ...foundation30Lecture11ExpansionSeeds,
  ...lecture11CompanionExpansionSeeds,
  ...wuLecture11ExpansionSeeds,
  ...foundation30Lecture12ExpansionSeeds,
  ...lecture12CompanionExpansionSeeds,
  ...wuLecture12ExpansionSeeds
]
