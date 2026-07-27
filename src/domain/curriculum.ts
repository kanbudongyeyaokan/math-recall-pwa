import type { Problem } from '../types'

export type PracticeRole = 'all' | 'concept' | 'example' | 'choice' | 'exercise'

export interface LectureSection {
  id: string
  title: string
  keywords: string[]
}

export interface CalculusLecture {
  id: string
  number: number
  title: string
  shortTitle: string
  printPages: [number, number]
  pdfPages: [number, number]
  region: string
  aliases: string[]
  sections: LectureSection[]
}

export interface PracticeSelection {
  lectureId: string
  sectionId?: string
  role: PracticeRole
  label: string
}

export const PRACTICE_ROLE_LABELS: Record<PracticeRole, string> = {
  all: '全部题目',
  concept: '定义与判据',
  example: '经典例题',
  choice: '选择题',
  exercise: '课后训练'
}

export const CALCULUS_LECTURES: CalculusLecture[] = [
  {
    id: 'lecture-01', number: 1, title: '函数极限与连续', shortTitle: '函数极限', printPages: [1, 75], pdfPages: [6, 80], region: '极限山门',
    aliases: ['函数极限与连续'],
    sections: [
      { id: 'limit-definition', title: '极限定义与性质', keywords: ['极限定义', '左右极限', '无穷小', '无穷大'] },
      { id: 'limit-calculation', title: '极限计算', keywords: ['等价无穷小', '洛必达', '泰勒', '夹逼', '极限计算'] },
      { id: 'continuity', title: '连续与间断', keywords: ['连续', '间断', '分段函数'] }
    ]
  },
  {
    id: 'lecture-02', number: 2, title: '数列极限', shortTitle: '数列极限', printPages: [76, 98], pdfPages: [81, 103], region: '数列石阶',
    aliases: ['数列极限'],
    sections: [
      { id: 'sequence-definition', title: '收敛定义与性质', keywords: ['数列收敛', '收敛定义', '夹逼'] },
      { id: 'sequence-recursion', title: '递推数列', keywords: ['递推', '单调有界', '根式数列'] },
      { id: 'sequence-sum', title: 'Stolz 与黎曼和', keywords: ['Stolz', '黎曼和', '求和'] }
    ]
  },
  {
    id: 'lecture-03', number: 3, title: '一元函数微分学的概念', shortTitle: '导数概念', printPages: [99, 118], pdfPages: [104, 123], region: '微分初境',
    aliases: ['导数与微分'],
    sections: [
      { id: 'derivative-definition', title: '导数定义', keywords: ['导数定义', '差商', '左右导数'] },
      { id: 'differentiability', title: '可导与可微', keywords: ['可导', '可微', '局部线性'] },
      { id: 'piecewise-derivative', title: '分段点判定', keywords: ['分段', '振荡', '原点可导'] }
    ]
  },
  {
    id: 'lecture-04', number: 4, title: '一元函数微分学的计算', shortTitle: '导数计算', printPages: [119, 138], pdfPages: [124, 143], region: '求导兵器阁',
    aliases: ['导数与微分'],
    sections: [
      { id: 'composite-derivative', title: '复合与隐函数', keywords: ['复合', '隐函数', '参数方程'] },
      { id: 'higher-derivative', title: '高阶导数', keywords: ['高阶导数', 'Leibniz', '二阶导数'] },
      { id: 'differential-calculation', title: '微分计算', keywords: ['微分', '近似计算'] }
    ]
  },
  {
    id: 'lecture-05', number: 5, title: '一元函数微分学的几何应用', shortTitle: '导数几何应用', printPages: [139, 163], pdfPages: [144, 168], region: '曲线试炼场',
    aliases: ['中值定理与导数应用'],
    sections: [
      { id: 'monotonic-extrema', title: '单调与极值', keywords: ['单调', '极值', '最值'] },
      { id: 'convexity', title: '凹凸与拐点', keywords: ['凹凸', '拐点', '曲率'] },
      { id: 'root-count', title: '根的个数', keywords: ['根的个数', '方程根', '凸函数'] }
    ]
  },
  {
    id: 'lecture-06', number: 6, title: '中值定理、微分等式与不等式', shortTitle: '中值定理', printPages: [164, 185], pdfPages: [169, 190], region: '定理裁决台',
    aliases: ['中值定理与导数应用'],
    sections: [
      { id: 'mean-value', title: '三大中值定理', keywords: ['Rolle', 'Lagrange', 'Cauchy', '中值定理'] },
      { id: 'taylor', title: 'Taylor 公式', keywords: ['Taylor', '泰勒'] },
      { id: 'differential-inequality', title: '微分不等式', keywords: ['不等式', '证明', '反正切'] }
    ]
  },
  {
    id: 'lecture-07', number: 7, title: '微分学物理与经济应用', shortTitle: '微分应用', printPages: [186, 194], pdfPages: [191, 199], region: '现实演算域',
    aliases: ['微分学物理与经济应用'],
    sections: [
      { id: 'related-rates', title: '相关变化率', keywords: ['变化率', '速度', '加速度'] },
      { id: 'economics-derivative', title: '边际与弹性', keywords: ['边际', '弹性', '经济'] },
      { id: 'optimization-model', title: '最优化模型', keywords: ['最优化', '最大利润', '最小成本'] }
    ]
  },
  {
    id: 'lecture-08', number: 8, title: '一元积分的概念与性质', shortTitle: '积分概念', printPages: [195, 229], pdfPages: [200, 234], region: '积分源泉',
    aliases: ['一元积分'],
    sections: [
      { id: 'antiderivative', title: '原函数与定积分', keywords: ['原函数', '定积分', 'Newton', '变上限'] },
      { id: 'integral-properties', title: '定积分性质', keywords: ['积分性质', '积分中值'] },
      { id: 'improper-integral', title: '反常积分', keywords: ['反常积分', '瑕点', 'p 判据'] }
    ]
  },
  {
    id: 'lecture-09', number: 9, title: '一元积分的计算', shortTitle: '积分计算', printPages: [230, 262], pdfPages: [235, 267], region: '积分锻造炉',
    aliases: ['一元积分'],
    sections: [
      { id: 'substitution', title: '换元积分', keywords: ['换元', '三角换元', '根式'] },
      { id: 'integration-parts', title: '分部积分', keywords: ['分部积分', '指数三角'] },
      { id: 'definite-techniques', title: '定积分技巧', keywords: ['对称换元', '区间反射', '定积分计算'] }
    ]
  },
  {
    id: 'lecture-10', number: 10, title: '积分的几何应用', shortTitle: '积分几何应用', printPages: [263, 281], pdfPages: [268, 286], region: '旋转体秘境',
    aliases: ['定积分应用'],
    sections: [
      { id: 'plane-area', title: '平面图形面积', keywords: ['面积', '平均值'] },
      { id: 'solid-volume', title: '旋转体体积', keywords: ['旋转体', '体积', '柱壳', '垫片'] },
      { id: 'arc-length', title: '弧长与旋转曲面', keywords: ['弧长', '旋转曲面'] }
    ]
  },
  {
    id: 'lecture-11', number: 11, title: '积分等式与不等式', shortTitle: '积分等式不等式', printPages: [282, 293], pdfPages: [287, 298], region: '积分论证台',
    aliases: ['定积分应用'],
    sections: [
      { id: 'integral-equality', title: '积分等式', keywords: ['积分等式', '对称换元'] },
      { id: 'integral-inequality', title: '积分不等式', keywords: ['Cauchy', '积分不等式', '证明'] },
      { id: 'weighted-mean', title: '正权平均', keywords: ['正权', '积分中值'] }
    ]
  },
  {
    id: 'lecture-12', number: 12, title: '积分物理与经济应用', shortTitle: '积分应用模型', printPages: [294, 303], pdfPages: [299, 308], region: '万象建模场',
    aliases: ['积分物理与经济应用'],
    sections: [
      { id: 'work-pressure', title: '功与压力', keywords: ['功', '压力', '引力'] },
      { id: 'mass-center', title: '质量与质心', keywords: ['质量', '质心', '密度'] },
      { id: 'economics-integral', title: '经济总量', keywords: ['总收益', '总成本', '经济'] }
    ]
  },
  {
    id: 'lecture-13', number: 13, title: '多元函数微分学', shortTitle: '多元微分', printPages: [304, 337], pdfPages: [309, 342], region: '多元星盘',
    aliases: ['多元函数微分'],
    sections: [
      { id: 'partial-differential', title: '偏导与全微分', keywords: ['偏导', '全微分', '可微'] },
      { id: 'multivariable-chain', title: '复合与隐函数', keywords: ['多元复合', '链式法则', '隐函数'] },
      { id: 'multivariable-extrema', title: '极值与条件极值', keywords: ['条件极值', 'Lagrange 乘子', 'Hessian'] }
    ]
  },
  {
    id: 'lecture-14', number: 14, title: '二重积分', shortTitle: '二重积分', printPages: [338, 376], pdfPages: [343, 381], region: '二重积分阵',
    aliases: ['二重积分'],
    sections: [
      { id: 'iterated-integral', title: '直角坐标与换序', keywords: ['累次积分', '换序', '区域'] },
      { id: 'polar-integral', title: '极坐标', keywords: ['极坐标', '圆域', '径向'] },
      { id: 'double-symmetry', title: '对称性', keywords: ['对称', '奇偶'] }
    ]
  },
  {
    id: 'lecture-15', number: 15, title: '微分方程', shortTitle: '微分方程', printPages: [377, 408], pdfPages: [382, 413], region: '方程战线',
    aliases: ['微分方程'],
    sections: [
      { id: 'first-order-ode', title: '一阶方程', keywords: ['一阶', '可分离', '齐次', 'Bernoulli'] },
      { id: 'linear-ode', title: '线性方程', keywords: ['一阶线性', '积分因子'] },
      { id: 'second-order-ode', title: '二阶常系数', keywords: ['二阶', '特征方程', '常系数'] }
    ]
  },
  {
    id: 'lecture-16', number: 16, title: '无穷级数', shortTitle: '无穷级数', printPages: [409, 463], pdfPages: [414, 468], region: '无穷长阶',
    aliases: ['无穷级数'],
    sections: [
      { id: 'numeric-series', title: '数项级数', keywords: ['正项级数', '交错级数', '绝对收敛'] },
      { id: 'power-series', title: '幂级数', keywords: ['幂级数', '收敛半径', '和函数'] },
      { id: 'fourier-series', title: 'Fourier 级数', keywords: ['Fourier', '傅里叶'] }
    ]
  },
  {
    id: 'lecture-17', number: 17, title: '多元积分学预备', shortTitle: '空间解析几何', printPages: [464, 487], pdfPages: [469, 492], region: '空间观星台',
    aliases: ['空间解析几何'],
    sections: [
      { id: 'space-plane-line', title: '空间直线与平面', keywords: ['空间直线', '平面', '交线'] },
      { id: 'surface-tangent', title: '曲面与切平面', keywords: ['曲面', '切平面', '梯度'] },
      { id: 'space-distance', title: '距离与夹角', keywords: ['距离', '夹角', '投影'] }
    ]
  },
  {
    id: 'lecture-18', number: 18, title: '多元函数积分学', shortTitle: '曲线曲面积分', printPages: [488, 545], pdfPages: [493, 550], region: '三大公式终域',
    aliases: ['曲线曲面积分'],
    sections: [
      { id: 'line-integral', title: '曲线积分与 Green', keywords: ['曲线积分', 'Green'] },
      { id: 'surface-integral', title: '曲面积分与 Gauss', keywords: ['曲面积分', 'Gauss', '通量'] },
      { id: 'stokes', title: 'Stokes 与场论', keywords: ['Stokes', '旋度', '散度'] }
    ]
  }
]

function normalizedProblemText(problem: Problem) {
  return [problem.title, problem.statement, problem.coreMethod, problem.answerText, ...problem.tags].join(' ').toLocaleLowerCase()
}

function parsePageRange(page: string): [number, number] | undefined {
  if (!/^\s*\d+(?:\s*[-–—~至]\s*\d+)?\s*$/.test(page)) return undefined
  const numbers = page.match(/\d+/g)?.map(Number) || []
  if (!numbers.length) return undefined
  return [numbers[0], numbers[1] || numbers[0]]
}

export function getProblemRole(problem: Problem): PracticeRole {
  const text = normalizedProblemText(problem)
  if (problem.questionFormat !== 'open' || text.includes('选择题')) return 'choice'
  if (text.includes('课后') || text.includes('训练')) return 'exercise'
  if (problem.kind === 'concept' || text.includes('定义') || text.includes('判据')) return 'concept'
  return 'example'
}

export function getProblemLectureIds(problem: Problem) {
  const text = normalizedProblemText(problem)
  const direct = CALCULUS_LECTURES.filter((lecture) => lecture.aliases.some((alias) => text.includes(alias.toLocaleLowerCase())))
  const pageRange = parsePageRange(problem.page)
  if (pageRange && (text.includes('高等数学') || text.includes('张宇基础30讲'))) {
    const pageMatches = CALCULUS_LECTURES.filter((lecture) => pageRange[0] <= lecture.printPages[1] && pageRange[1] >= lecture.printPages[0])
    if (pageMatches.length) return [...new Set([...direct, ...pageMatches].map((lecture) => lecture.id))]
  }
  if (direct.length === 1) return [direct[0].id]
  if (direct.length > 1) {
    const scored = direct.map((lecture) => ({
      lecture,
      score: lecture.sections.flatMap((section) => section.keywords).filter((keyword) => text.includes(keyword.toLocaleLowerCase())).length
    })).sort((a, b) => b.score - a.score)
    if (scored[0].score > scored[1].score) return [scored[0].lecture.id]
  }
  const keywordMatches = CALCULUS_LECTURES.map((lecture) => ({
    lecture,
    score: lecture.sections.flatMap((section) => section.keywords).filter((keyword) => text.includes(keyword.toLocaleLowerCase())).length
  })).filter((item) => item.score > 0).sort((a, b) => b.score - a.score)
  return keywordMatches.length ? [keywordMatches[0].lecture.id] : []
}

export function getProblemSectionIds(problem: Problem, lecture: CalculusLecture) {
  const text = normalizedProblemText(problem)
  return lecture.sections
    .filter((section) => section.keywords.some((keyword) => text.includes(keyword.toLocaleLowerCase())))
    .map((section) => section.id)
}

export function matchesPracticeSelection(problem: Problem, selection: PracticeSelection) {
  if (!getProblemLectureIds(problem).includes(selection.lectureId)) return false
  if (selection.role !== 'all' && getProblemRole(problem) !== selection.role) return false
  if (!selection.sectionId) return true
  const lecture = CALCULUS_LECTURES.find((item) => item.id === selection.lectureId)
  return lecture ? getProblemSectionIds(problem, lecture).includes(selection.sectionId) : false
}

export function getLectureById(id?: string) {
  return CALCULUS_LECTURES.find((lecture) => lecture.id === id)
}
