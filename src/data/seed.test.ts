import katex from 'katex'
import { describe, expect, it } from 'vitest'
import { curatedBankPoints } from './banks/curatedBank'
import { getProblemLectureIds, getProblemRole } from '../domain/curriculum'
import {
  findDuplicateMethodGroups,
  getMathFragments,
  getPrimaryKnowledgePoint,
  getProblemTextFields,
  hasBalancedMathDelimiters,
  hasUnwrappedMathSymbols,
  isProblemEligibleForPractice
} from './questionQuality'
import { isRetiredBuiltInProblem, makeSeedProblems } from './seed'

describe('PDF 精品考研数学题库', () => {
  const seeds = makeSeedProblems(1_000_000)
  const curated = seeds.filter((problem) => problem.id.startsWith('zy27-'))
  const sourceQuestions = seeds.filter((problem) => problem.id.startsWith('zy30-source-'))
  const verifiedExamples = seeds.filter((problem) => problem.id.startsWith('zy30-verified-'))
  const thousandVerified = seeds.filter((problem) => problem.id.startsWith('zy1000-verified-'))

  it('仅保留 PDF 题型重构与基础30讲来源题，ID 稳定唯一', () => {
    expect(curatedBankPoints).toHaveLength(156)
    expect(curated).toHaveLength(102)
    expect(sourceQuestions).toHaveLength(17)
    expect(verifiedExamples).toHaveLength(417)
    expect(thousandVerified).toHaveLength(97)
    expect(seeds).toHaveLength(641)
    expect(new Set(seeds.map((problem) => problem.id)).size).toBe(seeds.length)
    expect(seeds.every((problem) => problem.kind === 'problem')).toBe(true)
    expect(seeds.every((problem) => /张宇|武忠祥|核心计算/.test(problem.source))).toBe(true)
    expect(seeds.filter((problem) => isRetiredBuiltInProblem(problem)).map((problem) => problem.id)).toEqual([])
    expect(seeds.every((problem) => !/(?:命题辨析|错解审判|错解辨析)/.test(problem.title))).toBe(true)
    expect(seeds.every((problem) => !problem.tags.some((tag) => ['定义', '定义与判据', '命题辨析', '错解辨析'].includes(tag)))).toBe(true)
  })

  it('第1讲形成四十四道逐页核验精品题，排除定义辨析与同构习题', () => {
    const lectureOne = verifiedExamples.filter((problem) => problem.id.startsWith('zy30-verified-l01-'))
    const examples = lectureOne.filter((problem) => problem.id.includes('-example-'))
    const exercises = lectureOne.filter((problem) => problem.id.includes('-exercise-'))
    expect(lectureOne).toHaveLength(44)
    expect(examples.map((problem) => problem.title.match(/例 (1\.\d+)/)?.[1]))
      .toEqual(Array.from({ length: 36 }, (_, index) => `1.${index + 1}`))
    expect(exercises.map((problem) => problem.title.match(/习题 (1\.\d+)/)?.[1]))
      .toEqual(['1.6', '1.7', '1.9', '1.10', '1.11', '1.12', '1.13', '1.16'])
    expect(lectureOne.every((problem) => problem.methodFingerprint?.startsWith('zy30-verified:l01:'))).toBe(true)
  })

  it('第2讲形成四十一道非同构题，其中三十三道经过逐页核验', () => {
    const lectureTwo = verifiedExamples.filter((problem) => problem.id.startsWith('zy30-verified-l02-'))
    const examples = lectureTwo.filter((problem) => problem.id.includes('-example-'))
    const exercises = lectureTwo.filter((problem) => problem.id.includes('-exercise-'))
    const companions = lectureTwo.filter((problem) => problem.id.includes('-companion-'))
    expect(lectureTwo).toHaveLength(33)
    expect(examples.map((problem) => problem.title.match(/例 (2\.\d+)/)?.[1]))
      .toEqual(Array.from({ length: 15 }, (_, index) => '2.' + (index + 1)))
    expect(exercises.map((problem) => problem.title.match(/习题 (2\.\d+)/)?.[1]))
      .toEqual(Array.from({ length: 8 }, (_, index) => '2.' + (index + 1)))
    expect(companions).toHaveLength(10)
    expect(lectureTwo.every((problem) => problem.methodFingerprint?.startsWith('zy30-verified:l02:'))).toBe(true)
    expect(lectureTwo.every((problem) => !/(?:定义|辨析)/.test(problem.title))).toBe(true)
    expect(seeds.filter((problem) => problem.tags.includes('第2讲'))).toHaveLength(41)
  })

  it('第3讲形成四十一道非定义、非辨析、非同构题', () => {
    const lectureThree = verifiedExamples.filter((problem) => problem.id.startsWith('zy30-verified-l03-'))
    expect(lectureThree).toHaveLength(33)
    expect(seeds.filter((problem) => problem.tags.includes('第3讲'))).toHaveLength(41)
    expect(lectureThree.every((problem) => problem.methodFingerprint?.startsWith('zy30-verified:l03:'))).toBe(true)
    expect(lectureThree.every((problem) => !/(?:定义题|命题辨析|错解辨析)/.test(problem.title))).toBe(true)
    expect(lectureThree.every((problem) => problem.solutionMethods.length === 2)).toBe(true)
  })

  it('第4讲形成四十一道非定义、非辨析、非同构题', () => {
    const lectureFour = verifiedExamples.filter((problem) => problem.id.startsWith('zy30-verified-l04-'))
    const zhangYuExamples = lectureFour.filter((problem) => problem.id.includes('-zy30-example-'))
    const zhangYuExercises = lectureFour.filter((problem) => problem.id.includes('-zy30-exercise-'))
    const wuExamples = lectureFour.filter((problem) => problem.id.includes('-wzx-'))
    expect(lectureFour).toHaveLength(33)
    expect(zhangYuExamples).toHaveLength(18)
    expect(zhangYuExercises).toHaveLength(6)
    expect(wuExamples).toHaveLength(9)
    expect(seeds.filter((problem) => problem.tags.includes('第4讲'))).toHaveLength(41)
    expect(lectureFour.every((problem) => problem.methodFingerprint?.startsWith('zy30-verified:l04:'))).toBe(true)
    expect(lectureFour.every((problem) => !/(?:定义题|命题辨析|错解辨析)/.test(problem.title))).toBe(true)
    expect(lectureFour.every((problem) => problem.solutionMethods.length === 2)).toBe(true)
  })

  it('第5讲形成四十道非定义、非辨析、非同构题', () => {
    const lectureFive = verifiedExamples.filter((problem) => problem.id.startsWith('zy30-verified-l05-'))
    const zhangYuExamples = lectureFive.filter((problem) => problem.source.includes('基础30讲') && problem.id.includes('-example-'))
    const zhangYuExercises = lectureFive.filter((problem) => problem.source.includes('基础30讲') && problem.id.includes('-exercise-'))
    const wuExamples = lectureFive.filter((problem) => problem.id.includes('-wzx-'))
    const thousandExercises = lectureFive.filter((problem) => problem.id.includes('-zy1000-'))
    expect(lectureFive).toHaveLength(32)
    expect(zhangYuExamples).toHaveLength(12)
    expect(zhangYuExercises).toHaveLength(7)
    expect(wuExamples).toHaveLength(7)
    expect(thousandExercises).toHaveLength(6)
    expect(seeds.filter((problem) => problem.tags.includes('第5讲'))).toHaveLength(40)
    expect(lectureFive.every((problem) => problem.methodFingerprint?.startsWith('zy30-verified:l05:'))).toBe(true)
    expect(lectureFive.every((problem) => !/(?:定义题|命题辨析|错解辨析)/.test(problem.title))).toBe(true)
    expect(lectureFive.every((problem) => problem.solutionMethods.length === 2)).toBe(true)
  })

  it('第6讲形成四十道逐页核验题并退役来源错标题', () => {
    const lectureSix = seeds.filter((problem) => problem.tags.includes('第6讲'))
    const verifiedLectureSix = lectureSix.filter((problem) => problem.id.startsWith('zy30-verified-l06-'))
    const zhangYuExamples = verifiedLectureSix.filter((problem) => problem.id.includes('-example-'))
    const zhangYuExercises = verifiedLectureSix.filter((problem) => problem.id.includes('-exercise-'))
    const thousandProblems = lectureSix.filter((problem) => problem.id.startsWith('zy1000-verified-l06-'))
    expect(lectureSix).toHaveLength(40)
    expect(zhangYuExamples).toHaveLength(20)
    expect(zhangYuExercises).toHaveLength(11)
    expect(thousandProblems).toHaveLength(2)
    expect(lectureSix.every((problem) => problem.solutionMethods.length === 2)).toBe(true)
    expect(lectureSix.every((problem) => !/(?:定义题|命题辨析|错解辨析)/.test(problem.title))).toBe(true)
    expect(seeds.some((problem) => problem.id === 'zy30-source-l06-exercise-second-divided-difference')).toBe(false)
  })

  it('第7讲只保留十二道可完整核验的非同构原题，不以模板题凑数', () => {
    const lectureSeven = seeds.filter((problem) => problem.tags.includes('第7讲'))
    const foundationProblems = lectureSeven.filter((problem) => problem.id.startsWith('zy30-verified-l07-'))
    const thousandProblems = lectureSeven.filter((problem) => problem.id.startsWith('zy1000-verified-l07-'))
    const retiredIds = [
      'zy27-c07-related-sphere-application',
      'zy27-c07-motion-application',
      'zy27-c07-marginal-application',
      'zy27-c07-elasticity-application',
      'zy27-c07-profit-application',
      'zy27-c07-average-cost-application',
      'zy30-source-l07-example-parabola-arc-rate',
      'zy30-source-l07-exercise-demand-elasticity-revenue'
    ]
    expect(lectureSeven).toHaveLength(12)
    expect(foundationProblems).toHaveLength(7)
    expect(thousandProblems).toHaveLength(5)
    expect(lectureSeven.every((problem) => problem.solutionMethods.length === 2)).toBe(true)
    expect(lectureSeven.every((problem) => !/(?:定义题|命题辨析|错解辨析)/.test(problem.title))).toBe(true)
    expect(retiredIds.every((id) => !seeds.some((problem) => problem.id === id))).toBe(true)
  })

  it('第8讲形成四十道逐页核验的计算、证明与函数性质题', () => {
    const lectureEight = seeds.filter((problem) => problem.tags.includes('第8讲'))
    const foundationProblems = lectureEight.filter((problem) => problem.id.startsWith('zy30-verified-l08-'))
    const thousandProblems = lectureEight.filter((problem) => problem.id.startsWith('zy1000-verified-l08-'))
    const retiredIds = [
      'zy27-c08-antiderivative-application',
      'zy27-c08-newton-application',
      'zy27-c08-variable-upper-application',
      'zy27-c08-mean-application',
      'zy27-c08-improper-infinity-application',
      'zy27-c08-improper-singular-application',
      'zy30-source-l08-example-derivative-darboux-screening',
      'zy30-source-l08-exercise-log-improper-integral'
    ]
    expect(lectureEight).toHaveLength(40)
    expect(foundationProblems).toHaveLength(23)
    expect(thousandProblems).toHaveLength(17)
    expect(lectureEight.every((problem) => problem.solutionMethods.length === 2)).toBe(true)
    expect(lectureEight.every((problem) => !/(?:定义题|命题辨析|错解辨析)/.test(problem.title))).toBe(true)
    expect(retiredIds.every((id) => !seeds.some((problem) => problem.id === id))).toBe(true)
  })

  it('第9讲形成五十道非定义、非辨析、非同构的积分精品题', () => {
    const lectureNine = seeds.filter((problem) => problem.tags.includes('第9讲'))
    const foundationProblems = lectureNine.filter((problem) => problem.id.startsWith('zy30-verified-l09-'))
    const foundationExamples = foundationProblems.filter((problem) => problem.id.includes('-example-'))
    const foundationExercises = foundationProblems.filter((problem) => problem.id.includes('-exercise-'))
    const thousandProblems = lectureNine.filter((problem) => problem.id.startsWith('zy1000-verified-l09-'))
    const retiredIds = [
      'zy27-c09-partial-fraction-application',
      'zy27-c09-trig-sub-application',
      'zy27-c09-parts-application',
      'zy27-c09-reduction-application',
      'zy27-c09-reflection-application',
      'zy27-c09-wallis-application',
      'zy30-source-l09-example-sqrt-substitution-integral',
      'zy30-source-l09-exercise-reciprocal-antiderivative'
    ]
    expect(lectureNine).toHaveLength(50)
    expect(foundationProblems).toHaveLength(43)
    expect(foundationExamples.map((problem) => problem.title.match(/例 (9\.\d+)/)?.[1]).sort((a, b) => Number(a?.split('.')[1]) - Number(b?.split('.')[1])))
      .toEqual([...Array.from({ length: 22 }, (_, index) => `9.${index + 1}`), '9.26', '9.27', '9.28', '9.29'])
    expect(foundationExercises.map((problem) => problem.title.match(/习题 (9\.\d+)/)?.[1]).sort((a, b) => Number(a?.split('.')[1]) - Number(b?.split('.')[1])))
      .toEqual(Array.from({ length: 17 }, (_, index) => `9.${index + 1}`))
    expect(thousandProblems).toHaveLength(7)
    expect(lectureNine.every((problem) => problem.solutionMethods.length === 2)).toBe(true)
    expect(lectureNine.every((problem) => !/(?:定义题|命题辨析|错解辨析)/.test(problem.title))).toBe(true)
    expect(retiredIds.every((id) => !seeds.some((problem) => problem.id === id))).toBe(true)
  })

  it('第10讲形成四十一道逐页核验的几何应用精品题', () => {
    const lectureTen = seeds.filter((problem) => problem.tags.includes('第10讲'))
    const foundationProblems = lectureTen.filter((problem) => problem.id.startsWith('zy30-verified-l10-'))
    const foundationExamples = foundationProblems.filter((problem) => problem.id.includes('-example-'))
    const foundationExercises = foundationProblems.filter((problem) => problem.id.includes('-exercise-'))
    const thousandProblems = lectureTen.filter((problem) => problem.id.startsWith('zy1000-verified-l10-'))
    const retiredIds = [
      'zy27-c10-area-application',
      'zy27-c10-polar-area-application',
      'zy27-c10-disc-volume-application',
      'zy27-c10-shell-volume-application',
      'zy27-c10-arc-length-application',
      'zy27-c10-surface-area-application',
      'zy30-source-l10-example-vanishing-strip-area-limit',
      'zy30-source-l10-exercise-semicircle-surface-of-revolution'
    ]
    expect(lectureTen).toHaveLength(41)
    expect(foundationProblems).toHaveLength(23)
    expect(foundationExamples.map((problem) => problem.title.match(/例 (10\.\d+)/)?.[1]))
      .toEqual(Array.from({ length: 14 }, (_, index) => `10.${index + 1}`))
    expect(foundationExercises.map((problem) => problem.title.match(/习题 (10\.\d+)/)?.[1]))
      .toEqual(Array.from({ length: 9 }, (_, index) => `10.${index + 1}`))
    expect(thousandProblems).toHaveLength(18)
    expect(lectureTen.every((problem) => problem.solutionMethods.length === 2)).toBe(true)
    expect(lectureTen.every((problem) => !/(?:定义题|命题辨析|错解辨析)/.test(problem.title))).toBe(true)
    expect(retiredIds.every((id) => !seeds.some((problem) => problem.id === id))).toBe(true)
  })

  it('第11讲形成三十三道逐页核验的积分等式与不等式精品题', () => {
    const lectureEleven = seeds.filter((problem) => problem.tags.includes('第11讲'))
    const foundationProblems = lectureEleven.filter((problem) => problem.id.startsWith('zy30-verified-l11-'))
    const foundationExamples = foundationProblems.filter((problem) => problem.id.includes('-example-'))
    const foundationExercises = foundationProblems.filter((problem) => problem.id.includes('-exercise-'))
    const thousandProblems = lectureEleven.filter((problem) => problem.id.startsWith('zy1000-verified-l11-'))
    const wuProblems = lectureEleven.filter((problem) => problem.id.startsWith('wzx-verified-l11-'))
    const retiredIds = [
      'zy27-c11-reflection-identity-application',
      'zy27-c11-periodic-application',
      'zy27-c11-cauchy-application',
      'zy27-c11-chebyshev-application',
      'zy27-c11-jensen-application',
      'zy27-c11-weighted-mean-application',
      'zy30-source-l11-example-cauchy-weighted-quotient',
      'zy30-source-l11-exercise-reciprocal-integral-inequality'
    ]
    expect(lectureEleven).toHaveLength(33)
    expect(foundationProblems).toHaveLength(19)
    expect(foundationExamples).toHaveLength(13)
    expect(foundationExercises).toHaveLength(6)
    expect(thousandProblems).toHaveLength(10)
    expect(wuProblems).toHaveLength(4)
    expect(lectureEleven.every((problem) => problem.tags.includes('PDF逐页核验'))).toBe(true)
    expect(lectureEleven.every((problem) => /PDF \d+/.test(problem.page))).toBe(true)
    expect(lectureEleven.every((problem) => problem.solutionMethods.length === 2)).toBe(true)
    expect(lectureEleven.every((problem) => !/(?:定义题|命题辨析|错解辨析)/.test(problem.title))).toBe(true)
    expect(retiredIds.every((id) => !seeds.some((problem) => problem.id === id))).toBe(true)
  })

  it('第12讲形成十八道逐页核验的定积分应用精品题', () => {
    const lectureTwelve = seeds.filter((problem) => problem.tags.includes('第12讲'))
    const foundationProblems = lectureTwelve.filter((problem) => problem.id.startsWith('zy30-verified-l12-'))
    const foundationExamples = foundationProblems.filter((problem) => problem.id.includes('-example-'))
    const foundationExercises = foundationProblems.filter((problem) => problem.id.includes('-exercise-'))
    const thousandProblems = lectureTwelve.filter((problem) => problem.id.startsWith('zy1000-verified-l12-'))
    const wuProblems = lectureTwelve.filter((problem) => problem.id.startsWith('wzx-verified-l12-'))
    const retiredIds = [
      'zy27-c12-work-application',
      'zy27-c12-pressure-application',
      'zy27-c12-mass-application',
      'zy27-c12-centroid-application',
      'zy27-c12-inertia-application',
      'zy27-c12-surplus-application',
      'zy30-source-l12-example-conical-tank-pumping-work',
      'zy30-source-l12-exercise-elasticity-recover-demand'
    ]
    expect(lectureTwelve).toHaveLength(18)
    expect(foundationProblems).toHaveLength(8)
    expect(foundationExamples).toHaveLength(4)
    expect(foundationExercises).toHaveLength(4)
    expect(thousandProblems).toHaveLength(6)
    expect(wuProblems).toHaveLength(4)
    expect(lectureTwelve.every((problem) => problem.tags.includes('PDF逐页核验'))).toBe(true)
    expect(lectureTwelve.every((problem) => /PDF \d+/.test(problem.page))).toBe(true)
    expect(lectureTwelve.every((problem) => problem.solutionMethods.length === 2)).toBe(true)
    expect(lectureTwelve.every((problem) => !/(?:定义题|命题辨析|错解辨析)/.test(problem.title))).toBe(true)
    expect(retiredIds.every((id) => !seeds.some((problem) => problem.id === id))).toBe(true)
  })

  it('第13讲形成四十道逐页核验的多元微分精品题', () => {
    const lectureThirteen = seeds.filter((problem) => problem.tags.includes('第13讲'))
    const foundationProblems = lectureThirteen.filter((problem) => problem.id.startsWith('zy30-verified-l13-'))
    const foundationExamples = foundationProblems.filter((problem) => problem.id.includes('-example-'))
    const foundationExercises = foundationProblems.filter((problem) => problem.id.includes('-exercise-'))
    const thousandProblems = lectureThirteen.filter((problem) => problem.id.startsWith('zy1000-verified-l13-'))
    const retiredIds = [
      'zy27-c13-differentiable-application',
      'zy27-c13-total-differential-application',
      'zy27-c13-chain-application',
      'zy27-c13-implicit-application',
      'zy27-c13-gradient-application',
      'zy27-c13-lagrange-application',
      'zy30-source-l13-example-two-multivariable-limits',
      'zy30-source-l13-exercise-complex-square-laplacian'
    ]
    expect(lectureThirteen).toHaveLength(40)
    expect(foundationProblems).toHaveLength(24)
    expect(foundationExamples).toHaveLength(16)
    expect(foundationExercises).toHaveLength(8)
    expect(thousandProblems).toHaveLength(16)
    expect(lectureThirteen.every((problem) => problem.tags.includes('PDF逐页核验'))).toBe(true)
    expect(lectureThirteen.every((problem) => !['PDF逐页核验', '课后习题'].includes(getPrimaryKnowledgePoint(problem)))).toBe(true)
    expect(lectureThirteen.every((problem) => /PDF \d+/.test(problem.page))).toBe(true)
    expect(lectureThirteen.every((problem) => problem.solutionMethods.length === 2)).toBe(true)
    expect(lectureThirteen.every((problem) => !/(?:定义题|命题辨析|错解辨析)/.test(problem.title))).toBe(true)
    expect(retiredIds.every((id) => !seeds.some((problem) => problem.id === id))).toBe(true)
  })

  it('第14讲形成四十道逐页核验的二重积分精品题', () => {
    const lectureFourteen = seeds.filter((problem) => problem.tags.includes('第14讲'))
    const foundationProblems = lectureFourteen.filter((problem) => problem.id.startsWith('zy30-verified-l14-'))
    const foundationExamples = foundationProblems.filter((problem) => problem.id.includes('-example-'))
    const foundationExercises = foundationProblems.filter((problem) => problem.id.includes('-exercise-'))
    const thousandProblems = lectureFourteen.filter((problem) => problem.id.startsWith('zy1000-verified-l14-'))
    const retiredIds = [
      'zy27-c14-order-application',
      'zy27-c14-polar-application',
      'zy27-c14-symmetry-application',
      'zy27-c14-jacobian-application',
      'zy27-c14-improper-application',
      'zy27-c14-centroid-application',
      'zy30-source-l14-example-moving-disk-integral',
      'zy30-source-l14-exercise-offset-disk-polar-moment'
    ]
    expect(lectureFourteen).toHaveLength(40)
    expect(foundationProblems).toHaveLength(24)
    expect(foundationExamples).toHaveLength(17)
    expect(foundationExercises).toHaveLength(7)
    expect(thousandProblems).toHaveLength(16)
    expect(lectureFourteen.every((problem) => problem.tags.includes('PDF逐页核验'))).toBe(true)
    expect(lectureFourteen.every((problem) => !['PDF逐页核验', '课后习题', '强化题'].includes(getPrimaryKnowledgePoint(problem)))).toBe(true)
    expect(lectureFourteen.every((problem) => /PDF \d+/.test(problem.page))).toBe(true)
    expect(lectureFourteen.every((problem) => problem.solutionMethods.length === 2)).toBe(true)
    expect(lectureFourteen.every((problem) => !/(?:定义题|命题辨析|错解辨析)/.test(problem.title))).toBe(true)
    expect(new Set(lectureFourteen.map((problem) => problem.methodFingerprint)).size).toBe(40)
    expect(retiredIds.every((id) => !seeds.some((problem) => problem.id === id))).toBe(true)
  })

  it('第15讲形成四十道逐页核验的微分方程经典例题与课后题', () => {
    const lectureFifteen = seeds.filter((problem) => problem.tags.includes('第15讲'))
    const foundationProblems = lectureFifteen.filter((problem) => problem.id.startsWith('zy30-verified-l15-'))
    const foundationExamples = foundationProblems.filter((problem) => problem.id.includes('-example-'))
    const foundationExercises = foundationProblems.filter((problem) => problem.id.includes('-exercise-'))
    const retiredIds = [
      'zy27-c15-separable-application',
      'zy27-c15-homogeneous-application',
      'zy27-c15-linear-application',
      'zy27-c15-bernoulli-application',
      'zy27-c15-second-hom-application',
      'zy27-c15-resonance-application',
      'zy30-source-l15-example-damped-oscillation-initial-value',
      'zy30-source-l15-exercise-bernoulli-initial-value'
    ]
    expect(lectureFifteen).toHaveLength(40)
    expect(foundationProblems).toHaveLength(40)
    expect(foundationExamples).toHaveLength(25)
    expect(foundationExercises).toHaveLength(15)
    expect(lectureFifteen.every((problem) => problem.tags.includes('PDF逐页核验'))).toBe(true)
    expect(lectureFifteen.every((problem) => !['PDF逐页核验', '课后习题'].includes(getPrimaryKnowledgePoint(problem)))).toBe(true)
    expect(lectureFifteen.every((problem) => /PDF \d+/.test(problem.page))).toBe(true)
    expect(lectureFifteen.every((problem) => problem.solutionMethods.length === 2)).toBe(true)
    expect(lectureFifteen.every((problem) => !/(?:定义题|命题辨析|错解辨析)/.test(problem.title))).toBe(true)
    expect(new Set(lectureFifteen.map((problem) => problem.methodFingerprint)).size).toBe(40)
    expect(retiredIds.every((id) => !seeds.some((problem) => problem.id === id))).toBe(true)
  })

  it('全部逐页核验题均有精确页码、双路线解析和唯一方法指纹', () => {
    expect(verifiedExamples.every((problem) => problem.tags.includes('PDF逐页核验'))).toBe(true)
    expect(verifiedExamples.every((problem) => problem.page.startsWith('PDF '))).toBe(true)
    expect(verifiedExamples.every((problem) => problem.solutionMethods.length === 2)).toBe(true)
    expect(new Set(verifiedExamples.map((problem) => problem.methodFingerprint)).size).toBe(verifiedExamples.length)
  })

  it('基础30讲来源题覆盖 18 讲的例题与课后题', () => {
    const foundationQuestions = seeds.filter((problem) => problem.source.includes('张宇《基础30讲》'))
    expect(new Set(foundationQuestions.flatMap(getProblemLectureIds))).toEqual(new Set(
      Array.from({ length: 18 }, (_, index) => `lecture-${String(index + 1).padStart(2, '0')}`)
    ))
    for (let lecture = 1; lecture <= 18; lecture += 1) {
      const lectureQuestions = foundationQuestions.filter((problem) => problem.tags.includes(`第${lecture}讲`))
      expect(lectureQuestions.some((problem) => problem.tags.includes('经典例题'))).toBe(true)
      expect(lectureQuestions.some((problem) => problem.tags.includes('课后训练') || problem.tags.includes('课后习题'))).toBe(true)
    }
    for (const problem of sourceQuestions) {
      expect(problem.source).toContain('张宇《基础30讲》')
      expect(problem.page).toMatch(/^PDF \d+ · 书页 \d+$/)
      expect(problem.solutionMethods).toHaveLength(2)
      expect(problem.solutionMethods.every((method) => method.content.length > 30)).toBe(true)
      expect(problem.methodFingerprint).toMatch(/^zy30-source:/)
      expect(isProblemEligibleForPractice(problem)).toBe(true)
    }
  })

  it('每个资料考点只生成一道经典应用题，不再派生定义或辨析模板', () => {
    const activeCuratedIds = new Set(curated.map((problem) => problem.id))
    for (const point of curatedBankPoints) {
      const expectedId = `zy27-${point.id}-application`
      if (!activeCuratedIds.has(expectedId)) continue
      const cards = curated.filter((problem) => problem.id.startsWith(`zy27-${point.id}-`))
      expect(cards).toHaveLength(1)
      expect(cards[0].id).toBe(expectedId)
      expect(getProblemRole(cards[0])).toBe('example')
      expect(cards[0].source).toContain('张宇')
      expect(cards[0].page).toMatch(/PDF\s*\d+/)
    }
  })

  it('方法指纹唯一，阻止仅换数字或同解法题再次混入', () => {
    expect(seeds.every((problem) => problem.methodFingerprint)).toBe(true)
    expect(findDuplicateMethodGroups(seeds)).toEqual([])
    expect(new Set(curated.map((problem) => problem.methodFingerprint)).size).toBe(curated.length)
  })

  it('全部题目有来源页码、错因、答案和双路线解析', () => {
    const weak: string[] = []
    for (const problem of seeds) {
      if (!problem.page) weak.push(`${problem.id}:page`)
      if (problem.statement.length <= 12) weak.push(`${problem.id}:statement`)
      if (problem.coreMethod.length <= 12) weak.push(`${problem.id}:coreMethod`)
      if (problem.mistakes.length <= 12) weak.push(`${problem.id}:mistakes`)
      if (problem.answerText.length <= 5) weak.push(`${problem.id}:answerText`)
      expect(problem.solutionMethods).toHaveLength(2)
      expect(problem.solutionMethods.every((method) => method.content.length > 20)).toBe(true)
    }
    expect(weak).toEqual([])
  })

  it('保留下来的 PDF 选择题答案键有效', () => {
    const choices = seeds.filter((problem) => problem.questionFormat !== 'open')
    expect(choices.length).toBeGreaterThan(0)
    for (const problem of choices) {
      const optionIds = new Set(problem.options.map((option) => option.id))
      expect(problem.options.length).toBeGreaterThanOrEqual(2)
      expect(problem.correctOptionIds.length).toBeGreaterThan(0)
      expect(problem.correctOptionIds.every((id) => optionIds.has(id))).toBe(true)
    }
  })

  it('所有公式分隔符配对、无散落 Unicode 公式且可被 KaTeX 严格解析', () => {
    const failures: string[] = []
    for (const problem of seeds) {
      for (const text of getProblemTextFields(problem)) {
        if (!hasBalancedMathDelimiters(text)) failures.push(`${problem.id}:unbalanced`)
        if (hasUnwrappedMathSymbols(text)) failures.push(`${problem.id}:unwrapped-unicode`)
        for (const formula of getMathFragments(text)) {
          try {
            katex.renderToString(formula, { throwOnError: true, strict: 'error' })
          } catch (error) {
            failures.push(`${problem.id}:${formula}:${String(error)}`)
          }
        }
      }
    }
    expect(failures).toEqual([])
  })

  it('题目文本不含 OCR 乱码或空白占位内容', () => {
    const forbidden = /�|锟|待补充|TODO|BUSY|解析略|同上/
    const failures = seeds.flatMap((problem) => getProblemTextFields(problem)
      .filter((text) => forbidden.test(text))
      .map((text) => `${problem.id}:${text}`))
    expect(failures).toEqual([])
  })
})
