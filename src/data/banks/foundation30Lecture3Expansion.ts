import type { SeedInput } from './types'

const ZY30_SOURCE = '何耀焜私人整理 · 张宇《基础30讲》高数 · 第3讲逐页核验'
const WZX_SOURCE = '何耀焜私人整理 · 武忠祥《高数基础篇做题本》· 导数与微分'
const ZY1000_SOURCE = '何耀焜私人整理 · 张宇《1000题数一》解析册 · 第3章'

type LectureThreeSeed = Omit<SeedInput, 'id' | 'kind' | 'tags' | 'methodFingerprint'> & {
  id: string
  source: string
  role: 'example' | 'exercise'
  tags: string[]
  fingerprint: string
}

function lectureThree(input: LectureThreeSeed): SeedInput {
  const roleLabel = input.role === 'example' ? '经典例题' : '课后习题'
  return {
    ...input,
    id: `zy30-verified-l03-${input.id}`,
    kind: 'problem',
    tags: ['高等数学', '第3讲', roleLabel, 'PDF逐页核验', ...input.tags],
    methodFingerprint: `zy30-verified:l03:${input.fingerprint}`
  }
}

export const foundation30Lecture3ExpansionSeeds: SeedInput[] = [
  lectureThree({
    id: 'zy30-example-3-2', source: ZY30_SOURCE, role: 'example', page: 'PDF 108-109 · 书页 103-104 · 例 3.2',
    fingerprint: 'symmetry-periodicity:second-derivative-value-order',
    title: '例 3.2 · 奇偶性与周期性联动比较导数值',
    statement: `设 $f(x)$ 是二阶可导且以 $2$ 为周期的奇函数，$f(1/2)>0$，$f'(1/2)>0$。记

$$M=f\\left(-\\frac12\\right),\\qquad N=f'\\left(\\frac32\\right),\\qquad K=f''(0).$$

判断 $M,N,K$ 的大小关系。`,
    tags: ['奇偶性', '周期性', '二阶导数', '选择题'],
    coreMethod: '奇函数的一阶导数为偶函数、二阶导数为奇函数；再用导函数继承原函数的周期，把三个量分别定号。',
    mistakes: '每求一次导数，奇偶性会互换；周期平移应对导函数使用同一个周期 $2$。',
    answerText: '正确选项为 C：$M<K<N$。',
    questionFormat: 'single-choice',
    options: ['$M<N<K$', '$M>N>K$', '$M<K<N$', '$M>K>N$'],
    correctOptionIds: ['C'],
    solutionMethods: [
      {
        title: '方法一 · 奇偶性与周期性逐项定号',
        content: '由 $f$ 为奇函数，$M=f(-1/2)=-f(1/2)<0$。又 $f\\prime$ 为偶函数且以 $2$ 为周期，所以 $N=f\\prime(3/2)=f\\prime(-1/2)=f\\prime(1/2)>0$。因为 $f^{(2)}$ 为奇函数，故 $K=f^{(2)}(0)=0$。于是 $M<K<N$。'
      },
      {
        title: '方法二 · 恒等式求导复核',
        content: '从 $f(-x)=-f(x)$ 两次求导，依次得到 $f\\prime(-x)=f\\prime(x)$ 与 $f^{(2)}(-x)=-f^{(2)}(x)$；令 $x=0$ 即得 $K=0$。从 $f(x+2)=f(x)$ 求导得 $f\\prime(x+2)=f\\prime(x)$，代入 $x=-1/2$ 得 $N=f\\prime(-1/2)>0$，结论不变。'
      }
    ]
  }),
  lectureThree({
    id: 'zy30-example-3-3', source: ZY30_SOURCE, role: 'example', page: 'PDF 109 · 书页 104 · 例 3.3',
    fingerprint: 'squeeze:differentiability-from-quadratic-bound',
    title: '例 3.3 · 二阶小量上界强制原点可导',
    statement: '设 $f(x)$ 在 $x=0$ 的某邻域内有定义，并且 $|f(x)|\\le 1-\\cos x$。判断 $f$ 在 $x=0$ 处的连续性与可导性。',
    tags: ['夹逼准则', '可导性', '差商', '选择题'],
    coreMethod: '先把 $x=0$ 代入不等式锁定 $f(0)=0$，再用 $|f(x)/x|\\le(1-\\cos x)/|x|$ 夹逼差商。',
    mistakes: '只由 $f(x)\\to0$ 得到连续便停止；题给上界是二阶小量，除以 $x$ 后仍趋零，足以继续推出导数。',
    answerText: '正确选项为 C：$f$ 在原点可导且 $f\\prime(0)=0$。',
    questionFormat: 'single-choice',
    options: ['极限存在但不连续', '连续但不可导', '可导且 $f\\prime(0)=0$', '可导且 $f\\prime(0)\\ne0$'],
    correctOptionIds: ['C'],
    solutionMethods: [
      {
        title: '方法一 · 两层夹逼',
        content: `代入 $x=0$ 得 $|f(0)|\\le0$，故 $f(0)=0$。又 $|f(x)|\\le1-\\cos x\\to0$，所以 $f(x)\\to f(0)$。进一步有

$$0\\le\\left|\\frac{f(x)-f(0)}x\\right|\\le\\frac{1-\\cos x}{|x|}\\sim\\frac{|x|}{2}\\to0,$$

故 $f\\prime(0)=0$。`
      },
      {
        title: '方法二 · 高阶小量语言复核',
        content: '因为 $1-\\cos x=O(x^2)$，题设直接给出 $f(x)=O(x^2)$，并且 $f(0)=0$。于是 $f(x)-f(0)=o(x)$，这正说明原点处的线性主部系数为 $0$，所以函数可导且导数为零。'
      }
    ]
  }),
  lectureThree({
    id: 'zy30-example-3-4', source: ZY30_SOURCE, role: 'example', page: 'PDF 109-110 · 书页 104-105 · 例 3.4',
    fingerprint: 'product:first-zero-factor-derivative-at-origin',
    title: '例 3.4 · 连乘函数在零点只保留一个求导项',
    statement: `设正整数 $n\\ge1$，

$$f(x)=(e^x-1)(e^{2x}-2)\\cdots(e^{nx}-n).$$

求 $f\\prime(0)$。`,
    tags: ['乘积求导', '零点', '选择题'],
    coreMethod: '在 $x=0$ 时只有因子 $e^x-1$ 为零；乘积求导的其余项仍含这个零因子，全部消失。',
    mistakes: '把所有因子都误认为在零点为零，或展开完整乘积后陷入无关计算。',
    answerText: '正确选项为 A：$f\\prime(0)=(-1)^{n-1}(n-1)!$。',
    questionFormat: 'single-choice',
    options: ['$(-1)^{n-1}(n-1)!$', '$(-1)^n(n-1)!$', '$(-1)^{n-1}n!$', '$(-1)^n n!$'],
    correctOptionIds: ['A'],
    solutionMethods: [
      {
        title: '方法一 · 导数定义',
        content: `因 $f(0)=0$，有

$$f\\prime(0)=\\lim_{x\\to0}\\frac{e^x-1}{x}\\prod_{k=2}^{n}(e^{kx}-k)=1\\cdot\\prod_{k=2}^{n}(1-k).$$

后一个乘积为 $(-1)^{n-1}(n-1)!$。`
      },
      {
        title: '方法二 · 零因子隔离',
        content: '令 $g(x)=\\prod_{k=2}^{n}(e^{kx}-k)$，则 $f=(e^x-1)g$。因此 $f\\prime(0)=e^0g(0)+(e^0-1)g\\prime(0)=g(0)$，而 $g(0)=(1-2)\\cdots(1-n)=(-1)^{n-1}(n-1)!$。'
      }
    ]
  }),
  lectureThree({
    id: 'zy30-example-3-6', source: ZY30_SOURCE, role: 'example', page: 'PDF 110-111 · 书页 105-106 · 例 3.6',
    fingerprint: 'absolute-polynomial:nondifferentiable-zero-count',
    title: '例 3.6 · 因式分解统计绝对值函数不可导点',
    statement: `设

$$\\begin{aligned}
f_1(x)&=(x^2-1)|x^3+x^2-2x-2|,\\\\
f_2(x)&=(x^2-1)|x^3-2x^2-x+2|,\\\\
f_3(x)&=(x^2-1)|x^3+3x^2-2x-6|.
\\end{aligned}$$

将 $f_i$ 的不可导点个数记为 $n_i$，比较 $n_1,n_2,n_3$。`,
    tags: ['绝对值函数', '因式分解', '不可导点', '选择题'],
    coreMethod: '把绝对值内多项式完全因式分解；对每个单根检查绝对值外因子是否同时为零，只有未被消去的尖点计数。',
    mistakes: '把绝对值内部的所有零点都直接算作不可导点；若外部因子在同一点也为零，可能把尖点乘平。',
    answerText: '正确选项为 A：$n_2<n_1<n_3$，具体为 $1<2<3$。',
    questionFormat: 'single-choice',
    options: ['$n_2<n_1<n_3$', '$n_1<n_2<n_3$', '$n_3<n_2<n_1$', '$n_2<n_3<n_1$'],
    correctOptionIds: ['A'],
    solutionMethods: [
      {
        title: '方法一 · 逐式因式分解',
        content: '三个绝对值内多项式分别分解为 $(x+1)(x^2-2)$、$(x^2-1)(x-2)$、$(x^2-2)(x+3)$。结合外因子 $x^2-1$ 后，$f_1$ 在 $\\pm\\sqrt2$ 留下两个尖点，$f_2$ 只在 $2$ 留下尖点，$f_3$ 在 $\\pm\\sqrt2,-3$ 留下三个尖点。因此 $n_2=1,n_1=2,n_3=3$。'
      },
      {
        title: '方法二 · 局部阶数复核',
        content: '在绝对值内的单根 $r$ 附近，$|P(x)|\\sim C|x-r|$。若外因子在 $r$ 非零，局部仍是尖点；若外因子也含 $(x-r)$，局部变为常数乘 $(x-r)|x-r|$，其导数在 $r$ 存在。按此规则快速筛除 $r=\\pm1$，得到同样计数。'
      }
    ]
  }),
  lectureThree({
    id: 'zy30-example-3-7', source: ZY30_SOURCE, role: 'example', page: 'PDF 114 · 书页 109 · 例 3.7',
    fingerprint: 'absolute-composition:guaranteed-differentiability-nonzero-value',
    title: '例 3.7 · 绝对值复合函数的必然可导点',
    statement: `设 $f$ 处处可导，$f(0)=-1$，$f\\prime(0)=1$，令

$$g(x)=|f(x-1)|.$$

判断下列哪一项必然成立。`,
    tags: ['绝对值函数', '复合函数', '可导性', '选择题'],
    coreMethod: '$|u|$ 只可能在 $u=0$ 处产生尖点；找到内函数值已知且非零的自变量即可作出必然判断。',
    mistakes: '在 $x=0$ 处误用已知的 $f(0)$；此时内层是 $f(-1)$，题设并未给出。',
    answerText: '正确选项为 C：$g$ 在 $x=1$ 处必然可导。',
    questionFormat: 'single-choice',
    options: ['$g$ 在 $x=0$ 处必然可导', '$g$ 在 $x=0$ 处必然不可导', '$g$ 在 $x=1$ 处必然可导', '$g$ 在 $x=1$ 处必然不可导'],
    correctOptionIds: ['C'],
    solutionMethods: [
      {
        title: '方法一 · 非零邻域保号',
        content: '当 $x=1$ 时，内函数值为 $f(0)=-1\\ne0$。由 $f$ 连续，$f(x-1)$ 在 $x=1$ 附近保持负号，故 $g(x)=-f(x-1)$，于是 $g$ 在 $1$ 处可导。'
      },
      {
        title: '方法二 · 反例排除其余选项',
        content: '在 $x=0$ 时需要知道 $f(-1)$，题设没有约束它为零或非零，因此 A、B 都不能保证。在 $x=1$ 时内函数严格非零，绝对值局部等于加负号的光滑函数，故也不可能必然不可导，排除 D。'
      }
    ]
  }),
  lectureThree({
    id: 'zy30-example-3-8', source: ZY30_SOURCE, role: 'example', page: 'PDF 115 · 书页 110 · 例 3.8',
    fingerprint: 'tangent-intercept:power-family-exponential-limit',
    title: '例 3.8 · 幂函数切线横截距生成指数极限',
    statement: '曲线 $y=f_n(x)=x^n$ 在点 $(1,1)$ 处的切线与 $x$ 轴交于 $(\\xi_n,0)$。求 $\\lim_{n\\to\\infty}f_n(\\xi_n)$。',
    tags: ['切线', '幂函数', '数列极限'],
    coreMethod: '先由切线斜率求横截距 $\\xi_n=1-1/n$，再识别第二重要极限。',
    mistakes: '把 $f_n(\\xi_n)$ 误写成 $\\xi_n$，忽略每一步对应的函数本身也随 $n$ 改变。',
    answerText: '极限为 $e^{-1}$。',
    solutionMethods: [
      {
        title: '方法一 · 切线方程',
        content: `$f_n\\prime(1)=n$，故切线为 $y-1=n(x-1)$。令 $y=0$ 得 $\\xi_n=1-1/n$，于是

$$f_n(\\xi_n)=\\left(1-\\frac1n\\right)^n\\to e^{-1}.$$`
      },
      {
        title: '方法二 · 对数复核',
        content: '对结果取对数：$n\\ln(1-1/n)=\\dfrac{\\ln(1-u_n)}{u_n}$，其中 $u_n=1/n$，故趋于 $-1$。再取指数便得到极限 $e^{-1}$。'
      }
    ]
  }),
  lectureThree({
    id: 'zy30-example-3-9', source: ZY30_SOURCE, role: 'example', page: 'PDF 116-117 · 书页 111-112 · 例 3.9',
    fingerprint: 'second-derivative:strict-local-extremum-proof',
    title: '例 3.9 · 由二阶导数定义证明严格极值',
    statement: `设 $f$ 在 $x=x_0$ 处二阶可导，$f\\prime(x_0)=0$ 且 $f^{(2)}(x_0)\\ne0$。证明：

1. 若 $f^{(2)}(x_0)<0$，则 $f$ 在 $x_0$ 处取得严格极大值；
2. 若 $f^{(2)}(x_0)>0$，则 $f$ 在 $x_0$ 处取得严格极小值。`,
    tags: ['二阶导数', '严格极值', '证明题'],
    coreMethod: '由二阶差商的局部保号性推出 $f\\prime(x)$ 与 $x-x_0$ 的符号关系，再用一阶导数变号判别极值。',
    mistakes: '直接引用二阶导数判别而没有说明为何在去心邻域成立；本题要求从二阶导数定义闭合证明。',
    answerText: '$f^{(2)}(x_0)<0$ 时为严格极大值，$f^{(2)}(x_0)>0$ 时为严格极小值。',
    solutionMethods: [
      {
        title: '方法一 · 二阶差商保号',
        content: `若 $f^{(2)}(x_0)<0$，则在充分小去心邻域内

$$\\frac{f\\prime(x)-f\\prime(x_0)}{x-x_0}<0.$$

因 $f\\prime(x_0)=0$，当 $x<x_0$ 时 $f\\prime(x)>0$，当 $x>x_0$ 时 $f\\prime(x)<0$，故函数先增后减，在 $x_0$ 取严格极大值。正号情形同理得到先减后增与严格极小值。`
      },
      {
        title: '方法二 · 二阶 Peano 展开复核',
        content: `二阶可导给出

$$f(x_0+h)-f(x_0)=\\frac12f^{(2)}(x_0)h^2+o(h^2),$$

因为常数项之外的一阶项为 $f\\prime(x_0)h=0$。当 $h\\ne0$ 足够小时，增量与 $f^{(2)}(x_0)$ 同号，因此负号对应严格极大，正号对应严格极小。`
      }
    ]
  }),
  lectureThree({
    id: 'zy30-example-3-10', source: ZY30_SOURCE, role: 'example', page: 'PDF 118-119 · 书页 113-114 · 例 3.10',
    fingerprint: 'differential:coefficient-from-increment-expansion',
    title: '例 3.10 · 从增量展开直接读取微分',
    statement: `设函数 $y=f(x)$ 在任意点 $x$ 处的增量满足

$$\\Delta y=\\frac{y\\,\\Delta x}{x+\\sqrt{x^2+y^2}}+o(\\Delta x),$$

且 $f(0)=1$。求 $y=f(x)$ 在 $x=0$ 处的微分 $dy$。`,
    tags: ['函数增量', '微分', '局部线性', '选择题'],
    coreMethod: '增量中 $\\Delta x$ 的线性系数就是导数；代入点值后乘上 $dx$。',
    mistakes: '把 $o(\\Delta x)$ 也保留进微分，或在代入 $x=0$ 时漏掉题给的 $y=f(0)=1$。',
    answerText: '正确选项为 B：$dy=dx$。',
    questionFormat: 'single-choice',
    options: ['$0$', '$dx$', '$2dx$', '$3dx$'],
    correctOptionIds: ['B'],
    solutionMethods: [
      {
        title: '方法一 · 读取线性主部',
        content: `由可微增量形式可知

$$y\\prime=\\frac{y}{x+\\sqrt{x^2+y^2}}.$$

在 $x=0,y=1$ 处，$y\\prime(0)=1/(0+1)=1$，故 $dy|_{x=0}=y\\prime(0)dx=dx$。`
      },
      {
        title: '方法二 · 除以增量复核',
        content: '将题设除以 $\\Delta x$ 并令其趋零，得 $\\lim \\Delta y/\\Delta x=y/(x+\\sqrt{x^2+y^2})$。该极限就是导数，在 $(0,1)$ 处为 $1$，所以微分仍为 $dx$。'
      }
    ]
  }),
  lectureThree({
    id: 'zy30-example-3-11', source: ZY30_SOURCE, role: 'example', page: 'PDF 119 · 书页 114 · 例 3.11',
    fingerprint: 'differential:composite-linear-part-recover-inner-derivative',
    title: '例 3.11 · 由复合函数线性主部反求导数',
    statement: '设 $f(u)$ 可导，$y=f(x^2)$。当 $x=-1$ 且 $\\Delta x=-0.1$ 时，函数增量 $\\Delta y$ 的线性主部为 $0.1$。求 $f\\prime(1)$。',
    tags: ['微分', '复合函数', '链式法则', '选择题'],
    coreMethod: '线性主部就是 $dy=y\\prime\\Delta x=2x f\\prime(x^2)\\Delta x$，把给定点与增量代入。',
    mistakes: '把线性主部 $0.1$ 当成导数值；它还包含自变量增量 $\\Delta x=-0.1$。',
    answerText: '正确选项为 C：$f\\prime(1)=0.5$。',
    questionFormat: 'single-choice',
    options: ['$-1$', '$0.1$', '$0.5$', '$1$'],
    correctOptionIds: ['C'],
    solutionMethods: [
      {
        title: '方法一 · 链式微分',
        content: '$dy=f\\prime(x^2)d(x^2)=2x f\\prime(x^2)\\Delta x$。代入 $x=-1$、$\\Delta x=-0.1$，有 $dy=0.2f\\prime(1)$。题给 $dy=0.1$，故 $f\\prime(1)=0.5$。'
      },
      {
        title: '方法二 · 线性近似复核',
        content: '有 $(x+\\Delta x)^2-x^2=2x\\Delta x+o(\\Delta x)=0.2+o(\\Delta x)$。因此 $\\Delta y=f\\prime(1)\\cdot0.2+o(\\Delta x)$；比较线性主部仍得 $0.2f\\prime(1)=0.1$。'
      }
    ]
  }),
  lectureThree({
    id: 'zy30-exercise-3-1', source: ZY30_SOURCE, role: 'exercise', page: 'PDF 120-121 · 书页 115-116 · 习题 3.1',
    fingerprint: 'piecewise:bounded-factor-one-sided-derivatives',
    title: '习题 3.1 · 有界因子下的分段点可导性',
    statement: `设

$$f(x)=\\begin{cases}
\\dfrac{1-\\cos x}{\\sqrt{x}},&x>0,\\\\
x^2g(x),&x\\le0,
\\end{cases}$$

其中 $g(x)$ 为有界函数。判断 $f$ 在 $x=0$ 处的可导性。`,
    tags: ['分段函数', '左右导数', '有界函数', '选择题'],
    coreMethod: '先由两段得到 $f(0)=0$ 与连续性，再分别夹逼左、右差商。',
    mistakes: '看到 $g$ 未知便断言左导数不存在；乘上 $x$ 后有界性足以把左差商夹到零。',
    answerText: '正确选项为 D：$f$ 在 $x=0$ 处可导，且 $f\\prime(0)=0$。',
    questionFormat: 'single-choice',
    options: ['极限不存在', '极限存在但不连续', '连续但不可导', '可导'],
    correctOptionIds: ['D'],
    solutionMethods: [
      {
        title: '方法一 · 左右差商',
        content: '由 $f(0)=0$。右差商为 $(1-\\cos x)/x^{3/2}\\sim\\sqrt{x}/2\\to0$；左差商为 $xg(x)$，因 $g$ 有界而趋于 $0$。左右导数相等，所以 $f\\prime(0)=0$。'
      },
      {
        title: '方法二 · 阶数估计',
        content: '右侧 $f(x)=O(x^{3/2})=o(x)$；左侧 $|f(x)|\\le Mx^2=o(|x|)$。两侧统一满足 $f(x)-f(0)=o(x)$，故原点可导且线性系数为零。'
      }
    ]
  }),
  lectureThree({
    id: 'zy30-exercise-3-3', source: ZY30_SOURCE, role: 'exercise', page: 'PDF 120-121 · 书页 115-116 · 习题 3.3',
    fingerprint: 'geometry:differential-from-perpendicular-tangent',
    title: '习题 3.3 · 由垂直关系判定微分阶数',
    statement: '设函数 $f$ 可导，曲线 $y=f(x)$ 在点 $(x_0,f(x_0))$ 处的切线与直线 $y=2-x$ 垂直。当 $\\Delta x\\to0$ 时，判断该函数在 $x_0$ 处的微分 $dy$ 与 $\\Delta x$ 的关系。',
    tags: ['切线斜率', '微分', '无穷小阶', '选择题'],
    coreMethod: '直线斜率为 $-1$，垂直切线的斜率为 $1$，因此 $dy=f\\prime(x_0)\\Delta x=\\Delta x$。',
    mistakes: '把垂直斜率写成相反数而不是负倒数；本题恰好仍为 $1$。',
    answerText: '正确选项为 B：$dy$ 与 $\\Delta x$ 等价。',
    questionFormat: 'single-choice',
    options: ['与 $\\Delta x$ 同阶但非等价', '与 $\\Delta x$ 等价', '比 $\\Delta x$ 高阶', '比 $\\Delta x$ 低阶'],
    correctOptionIds: ['B'],
    solutionMethods: [
      {
        title: '方法一 · 斜率乘积',
        content: '垂直直线的斜率乘积为 $-1$，故 $f\\prime(x_0)(-1)=-1$，即 $f\\prime(x_0)=1$。于是 $dy=\\Delta x$，两者比值恒为 $1$。'
      },
      {
        title: '方法二 · 方向向量复核',
        content: '$y=2-x$ 的方向向量可取 $(1,-1)$；与它垂直的切线方向可取 $(1,1)$，斜率为 $1$。因此局部线性主部正是 $1\\cdot\\Delta x$。'
      }
    ]
  }),
  lectureThree({
    id: 'zy30-exercise-3-4', source: ZY30_SOURCE, role: 'exercise', page: 'PDF 120-122 · 书页 115-117 · 习题 3.4',
    fingerprint: 'differential:error-relative-to-nonzero-linear-part',
    title: '习题 3.4 · 微分误差相对线性主部的阶数',
    statement: '设 $y=f(x)$ 在 $x_0$ 处可导且 $f\\prime(x_0)\\ne0$。当 $\\Delta x\\to0$ 时，判断 $\\Delta y-dy$ 相对于 $dy$ 的无穷小阶数。',
    tags: ['微分误差', '无穷小阶', '选择题'],
    coreMethod: '由 $\\Delta y=dy+o(\\Delta x)$，再利用 $dy=f\\prime(x_0)\\Delta x$ 与 $\\Delta x$ 等价。',
    mistakes: '只写 $\\Delta y-dy=o(\\Delta x)$，却没有使用 $f\\prime(x_0)\\ne0$ 把比较对象换成 $dy$。',
    answerText: '正确选项为 A：$\\Delta y-dy$ 是 $dy$ 的高阶无穷小。',
    questionFormat: 'single-choice',
    options: ['高阶无穷小', '低阶无穷小', '同阶非等价无穷小', '等价无穷小'],
    correctOptionIds: ['A'],
    solutionMethods: [
      {
        title: '方法一 · 比值判定',
        content: `可导性给出 $\\Delta y-dy=o(\\Delta x)$，而 $dy=f\\prime(x_0)\\Delta x$。因此

$$\\frac{\\Delta y-dy}{dy}=\\frac1{f\\prime(x_0)}\\frac{o(\\Delta x)}{\\Delta x}\\to0,$$

故为高阶无穷小。`
      },
      {
        title: '方法二 · 等价关系复核',
        content: '因 $f\\prime(x_0)\\ne0$，有 $dy\\sim f\\prime(x_0)\\Delta x$，所以 $dy$ 与 $\\Delta x$ 同阶。相对于 $\\Delta x$ 的高阶项自然也相对于 $dy$ 为高阶项。'
      }
    ]
  }),
  lectureThree({
    id: 'zy30-exercise-3-5', source: ZY30_SOURCE, role: 'exercise', page: 'PDF 120-122 · 书页 115-117 · 习题 3.5',
    fingerprint: 'derivative-definition:continuous-factor-at-simple-zero',
    title: '习题 3.5 · 仅凭连续性求乘积在零因子点的导数',
    statement: '设 $f(x)=(x-a)\\varphi(x)$，其中 $\\varphi$ 在 $x=a$ 处连续。求 $f\\prime(a)$。',
    tags: ['乘积结构', '连续函数', '差商'],
    coreMethod: '不能对未知是否可导的 $\\varphi$ 使用乘积求导；直接把简单零因子在差商中约去。',
    mistakes: '机械写出 $\\varphi\\prime(a)$；题设只保证 $\\varphi$ 连续，导数未必存在。',
    answerText: '$f\\prime(a)=\\varphi(a)$。',
    solutionMethods: [
      {
        title: '方法一 · 差商约分',
        content: `有 $f(a)=0$，故

$$f\\prime(a)=\\lim_{x\\to a}\\frac{(x-a)\\varphi(x)}{x-a}=\\lim_{x\\to a}\\varphi(x)=\\varphi(a),$$

最后一步只用到了连续性。`
      },
      {
        title: '方法二 · 增量展开复核',
        content: '由 $\\varphi(a+h)=\\varphi(a)+o(1)$，可得 $f(a+h)-f(a)=h\\varphi(a+h)=\\varphi(a)h+o(h)$。线性主部系数就是 $\\varphi(a)$，因此导数为该值。'
      }
    ]
  }),
  lectureThree({
    id: 'zy30-exercise-3-6', source: ZY30_SOURCE, role: 'exercise', page: 'PDF 120-122 · 书页 115-117 · 习题 3.6',
    fingerprint: 'composite-limit:recover-derivative-times-inner-ratio',
    title: '习题 3.6 · 复合增量极限提取原点导数',
    statement: `设 $f(0)=0$ 且 $f\\prime(0)$ 存在，求

$$\\lim_{x\\to0}\\frac{f(1-\\sqrt{\\cos x})}{\\ln(1-x\\sin x)}.$$`,
    tags: ['复合极限', '导数', '等价无穷小'],
    coreMethod: '拆成函数差商与内层增量比；前者趋于 $f\\prime(0)$，后者用等价无穷小计算。',
    mistakes: '把 $1-\\sqrt{\\cos x}$ 粗略看成 $1-\\cos x$，会漏掉系数 $1/2$。',
    answerText: '极限为 $-\\dfrac14f\\prime(0)$。',
    solutionMethods: [
      {
        title: '方法一 · 差商拆分',
        content: `原式写成

$$\\frac{f(1-\\sqrt{\\cos x})-f(0)}{1-\\sqrt{\\cos x}}\\cdot\\frac{1-\\sqrt{\\cos x}}{\\ln(1-x\\sin x)}.$$

第一因子趋于 $f\\prime(0)$。又 $1-\\sqrt{\\cos x}\\sim x^2/4$，$\\ln(1-x\\sin x)\\sim-x^2$，第二因子趋于 $-1/4$。`
      },
      {
        title: '方法二 · 局部线性展开',
        content: '由可导性 $f(u)=f\\prime(0)u+o(u)$。令 $u=1-\\sqrt{\\cos x}=x^2/4+o(x^2)$，分子为 $f\\prime(0)x^2/4+o(x^2)$；分母为 $-x^2+o(x^2)$，相除即得 $-f\\prime(0)/4$。'
      }
    ]
  }),
  lectureThree({
    id: 'zy30-exercise-3-7', source: ZY30_SOURCE, role: 'exercise', page: 'PDF 120-122 · 书页 115-117 · 习题 3.7',
    fingerprint: 'one-sided-derivative:limit-of-nearby-derivatives',
    title: '习题 3.7 · 邻域导数极限推出端点侧导数',
    statement: `证明：若 $F$ 在 $[x_0,x_0+\\delta)$ 上连续，在 $(x_0,x_0+\\delta)$ 内可导，且

$$\\lim_{x\\to x_0^+}F\\prime(x)=A,$$

则 $F_+\\prime(x_0)=A$。左侧区间上的对应结论同样成立。`,
    tags: ['单侧导数', 'Lagrange中值定理', '证明题'],
    coreMethod: '对端点与邻近点之间使用 Lagrange 中值定理，把端点差商等于某个内部点的导数。',
    mistakes: '直接使用洛必达而不核验端点连续和邻域可导条件；中值定理能更直接地说明条件为何足够。',
    answerText: '右导数与左导数分别等于对应一侧的导数极限 $A$。',
    solutionMethods: [
      {
        title: '方法一 · Lagrange 中值定理',
        content: `对任意 $x\\in(x_0,x_0+\\delta)$，函数在 $[x_0,x]$ 连续、在内部可导，故存在 $\\xi_x\\in(x_0,x)$ 使

$$\\frac{F(x)-F(x_0)}{x-x_0}=F\\prime(\\xi_x).$$

当 $x\\to x_0^+$ 时，$\\xi_x\\to x_0^+$，右端趋于 $A$，所以 $F_+\\prime(x_0)=A$。左侧同理。`
      },
      {
        title: '方法二 · Cauchy 中值定理复核',
        content: '把 $F$ 与 $G(x)=x$ 在 $[x_0,x]$ 上使用 Cauchy 中值定理，端点增量之比等于 $F\\prime(\\xi_x)/G\\prime(\\xi_x)=F\\prime(\\xi_x)$。令端点收缩即可得到同一结论。'
      }
    ]
  }),
  lectureThree({
    id: 'zy30-exercise-3-8', source: ZY30_SOURCE, role: 'exercise', page: 'PDF 120、122-123 · 书页 115、117-118 · 习题 3.8',
    fingerprint: 'piecewise:oscillation-polynomial-parameters-differentiability',
    title: '习题 3.8 · 振荡分段函数的可导参数',
    statement: `设

$$f(x)=\\begin{cases}
x^2\\sin\\dfrac{\\pi}{x},&x<0,\\\\
A,&x=0,\\\\
ax^2+b,&x>0.
\\end{cases}$$

求常数 $A,a,b$，使 $f$ 在 $x=0$ 处可导，并求 $f\\prime(0)$。`,
    tags: ['分段函数', '振荡函数', '参数', '左右导数'],
    coreMethod: '可导先要求连续，由左右极限锁定点值与常数项；再分别计算左右差商。',
    mistakes: '只令左右导数相等而漏掉连续性；参数 $a$ 乘在二阶项上，不会影响原点的一阶差商。',
    answerText: '$A=0$、$b=0$，$a$ 可取任意常数，且 $f\\prime(0)=0$。',
    solutionMethods: [
      {
        title: '方法一 · 连续与左右导数分步',
        content: '左极限为 $0$，右极限为 $b$，故连续要求 $A=b=0$。此时左差商为 $x\\sin(\\pi/x)\\to0$，右差商为 $ax\\to0$，所以任意 $a$ 都使两侧导数相等，且 $f\\prime(0)=0$。'
      },
      {
        title: '方法二 · 统一小量估计',
        content: '在 $A=b=0$ 后，左侧 $|f(x)|\\le x^2$，右侧 $|f(x)|=|a|x^2$。两侧都满足 $f(x)-f(0)=O(x^2)=o(x)$，因此原点可导且导数为零；这个估计与 $a$ 的具体值无关。'
      }
    ]
  }),
  lectureThree({
    id: 'zy30-exercise-3-9', source: ZY30_SOURCE, role: 'exercise', page: 'PDF 120-121、123 · 书页 115-116、118 · 习题 3.9',
    fingerprint: 'implicit-limit:taylor-coefficient-forces-derivative',
    title: '习题 3.9 · 隐式极限条件强制原点可导',
    statement: `设 $\\delta>0$，$f$ 在 $[-\\delta,\\delta]$ 上有定义，$f(0)=1$，且

$$\\lim_{x\\to0}\\frac{\\ln(1-2x)+2xf(x)}{x^2}=0.$$

证明 $f$ 在 $x=0$ 处可导，并求 $f\\prime(0)$。`,
    tags: ['隐式极限', 'Taylor公式', '可导性', '证明题'],
    coreMethod: '把对数展开到二阶，题设极限便直接化成 $[f(x)-f(0)]/x$ 的极限。',
    mistakes: '只保留 $\\ln(1-2x)$ 的一阶项会发生完全抵消，无法读出导数；必须保留二阶项 $-2x^2$。',
    answerText: '$f$ 在原点可导，且 $f\\prime(0)=1$。',
    solutionMethods: [
      {
        title: '方法一 · Taylor 展开闭环',
        content: `有 $\\ln(1-2x)=-2x-2x^2+o(x^2)$，因此题设分子为

$$2x[f(x)-1]-2x^2+o(x^2).$$

除以 $x^2$ 后极限为 $2\\lim_{x\\to0}[f(x)-1]/x-2=0$，故差商极限存在且等于 $1$，即 $f\\prime(0)=1$。`
      },
      {
        title: '方法二 · 代数隔离差商',
        content: `题设等价于

$$2\\frac{f(x)-f(0)}x=-\\frac{\\ln(1-2x)+2x}{x^2}+o(1).$$

右侧由基本展开趋于 $2$，故左侧差商趋于 $1$。这同时证明了可导性并给出导数值。`
      }
    ]
  }),
  lectureThree({
    id: 'wzx-example-1', source: WZX_SOURCE, role: 'example', page: 'PDF 24 · 书页 P43 · 例 1',
    fingerprint: 'piecewise:jump-destroys-right-derivative-only',
    title: '武忠祥例 1 · 跳跃分段点的左右导数',
    statement: '设\n\n$$f(x)=\\begin{cases}\\dfrac23x^3,&x\\le1,\\\\x^2,&x>1.\\end{cases}$$\n\n判断 $f$ 在 $x=1$ 处左、右导数的存在性。',
    tags: ['分段函数', '左右导数', '选择题'],
    coreMethod: '左右导数都使用同一个点值 $f(1)=2/3$；右侧函数极限不等于点值，因此右差商直接发散。',
    mistakes: '把右导数误算为右侧表达式 $x^2$ 在 $1$ 的导数；分段点导数必须以真实点值 $f(1)$ 为基准。',
    answerText: '正确选项为 B：左导数存在，右导数不存在。',
    questionFormat: 'single-choice',
    options: ['左、右导数都存在', '左导数存在但右导数不存在', '左导数不存在但右导数存在', '左、右导数都不存在'],
    correctOptionIds: ['B'],
    solutionMethods: [
      {
        title: '方法一 · 单侧差商',
        content: '当 $h<0$ 时，\n\n$$\\frac{f(1+h)-f(1)}h=\\frac{\\frac23(1+h)^3-\\frac23}{h}\\to2,$$\n\n故左导数存在。当 $h>0$ 时，分子 $(1+h)^2-2/3\\to1/3\\ne0$，再除以 $h\\to0^+$ 发散，所以右导数不存在。'
      },
      {
        title: '方法二 · 连续性先行复核',
        content: '左侧函数在 $1$ 处与点值衔接，因此左导数可继续计算；右极限为 $1$，但 $f(1)=2/3$，右侧不连续。有限右导数必推出右连续，故右导数不可能存在。'
      }
    ]
  }),
  lectureThree({
    id: 'wzx-example-2', source: WZX_SOURCE, role: 'example', page: 'PDF 24 · 书页 P44 · 例 2',
    fingerprint: 'functional-equation:translation-derivative-transfer',
    title: '武忠祥例 2 · 平移函数方程传递导数',
    statement: '设函数 $f$ 对任意 $x$ 都满足 $f(1+x)=af(x)$，且 $f\\prime(0)=b$，其中 $a,b$ 为非零常数。判断 $f$ 在 $x=1$ 处的可导性并求 $f\\prime(1)$。',
    tags: ['函数方程', '差商', '选择题'],
    coreMethod: '把 $x=1$ 附近的增量平移到 $x=0$，函数差商整体多出常数因子 $a$。',
    mistakes: '把函数值倍率 $a$ 与导数值 $b$ 分开选择；平移恒等式会让导数同样乘上 $a$。',
    answerText: '正确选项为 D：$f$ 在 $1$ 处可导，且 $f\\prime(1)=ab$。',
    questionFormat: 'single-choice',
    options: ['在 $1$ 处不可导', '在 $1$ 处可导且 $f\\prime(1)=a$', '在 $1$ 处可导且 $f\\prime(1)=b$', '在 $1$ 处可导且 $f\\prime(1)=ab$'],
    correctOptionIds: ['D'],
    solutionMethods: [
      {
        title: '方法一 · 差商平移',
        content: '由题设 $f(1+h)=af(h)$ 且 $f(1)=af(0)$，所以\n\n$$f\\prime(1)=\\lim_{h\\to0}\\frac{f(1+h)-f(1)}h=a\\lim_{h\\to0}\\frac{f(h)-f(0)}h=ab.$$'
      },
      {
        title: '方法二 · 恒等式求导复核',
        content: '已知 $f$ 在 $0$ 可导。恒等式右端 $af(x)$ 在 $0$ 可导，因此左端 $f(1+x)$ 在 $x=0$ 可导；按链式法则其导数为 $f\\prime(1)$，右端导数为 $af\\prime(0)=ab$。'
      }
    ]
  }),
  lectureThree({
    id: 'wzx-example-3', source: WZX_SOURCE, role: 'example', page: 'PDF 24 · 书页 P45 · 例 3',
    fingerprint: 'differential:nonzero-constant-multiple-equivalence',
    title: '武忠祥例 3 · 非零导数下微分与增量等价',
    statement: '若函数 $y=f(x)$ 满足 $f\\prime(x_0)=1/2$，判断当 $\\Delta x\\to0$ 时，函数在 $x_0$ 处的微分 $dy$ 与 $\\Delta x$ 的无穷小关系。',
    tags: ['微分', '无穷小阶', '选择题'],
    coreMethod: '$dy=f\\prime(x_0)\\Delta x$；与非零常数相乘不改变无穷小阶数，但比值不为 $1$ 时并不等价。',
    mistakes: '把“同阶”与“等价”混为一谈；本题 $dy/\\Delta x=1/2$，不是 $1$。',
    answerText: '正确选项为 B：$dy$ 与 $\\Delta x$ 同阶，但不等价。',
    questionFormat: 'single-choice',
    options: ['与 $\\Delta x$ 等价', '与 $\\Delta x$ 同阶', '比 $\\Delta x$ 低阶', '比 $\\Delta x$ 高阶'],
    correctOptionIds: ['B'],
    solutionMethods: [
      {
        title: '方法一 · 比值判定',
        content: '有 $dy=\\frac12\\Delta x$，故\n\n$$\\lim_{\\Delta x\\to0}\\frac{dy}{\\Delta x}=\\frac12\\ne0.$$\n\n所以二者同阶；由于该极限不等于 $1$，二者不等价。'
      },
      {
        title: '方法二 · 阶数语言复核',
        content: '非零常数倍不会改变趋零速度，因此 $dy$ 与 $\\Delta x$ 都是一阶无穷小。只有导数值恰为 $1$ 时，$dy$ 才与 $\\Delta x$ 等价。'
      }
    ]
  }),
  lectureThree({
    id: 'wzx-example-17', source: WZX_SOURCE, role: 'example', page: 'PDF 29 · 书页 P52 · 例 17',
    fingerprint: 'difference-quotient:two-shifted-increments',
    title: '武忠祥例 17 · 两个错位函数增量的差商极限',
    statement: '已知 $f\\prime(x_0)=-1$，求\n\n$$\\lim_{x\\to0}\\frac{x}{f(x_0-2x)-f(x_0-x)}.$$',
    tags: ['差商', '函数增量', '极限'],
    coreMethod: '在分母中加减 $f(x_0)$，把两个不同步长的函数增量分别化成标准差商。',
    mistakes: '把分母直接看成 $f\\prime(x_0)(-x)$ 时符号算错；两个增量之差的净步长是 $-x$。',
    answerText: '极限为 $1$。',
    solutionMethods: [
      {
        title: '方法一 · 一阶展开',
        content: '可导性给出 $f(x_0+h)=f(x_0)+f\\prime(x_0)h+o(h)$。因此分母为\n\n$$[-2xf\\prime(x_0)+o(x)]-[-xf\\prime(x_0)+o(x)]=-xf\\prime(x_0)+o(x)=x+o(x),$$\n\n故极限为 $1$。'
      },
      {
        title: '方法二 · 拆成两个差商',
        content: '分母除以 $x$ 后为\n\n$$-2\\frac{f(x_0-2x)-f(x_0)}{-2x}+\\frac{f(x_0-x)-f(x_0)}{-x}\\to-2(-1)+(-1)=1.$$\n\n原极限是该极限的倒数，仍为 $1$。'
      }
    ]
  }),
  lectureThree({
    id: 'wzx-example-18', source: WZX_SOURCE, role: 'example', page: 'PDF 29 · 书页 P53 · 例 18',
    fingerprint: 'difference-quotient:scaled-arguments-cubic-cancellation',
    title: '武忠祥例 18 · 不同步长下的三阶配平',
    statement: '设 $f$ 在 $x=0$ 处可导且 $f(0)=0$，求\n\n$$\\lim_{x\\to0}\\frac{x^2f(x)-2f(x^3)}{x^3}.$$',
    tags: ['差商', '缩放变量', '选择题'],
    coreMethod: '把 $f(x)$ 与 $f(x^3)$ 分别按各自增量提取 $f\\prime(0)$，两项恰好都落在 $x^3$ 阶。',
    mistakes: '误认为 $f(x^3)$ 比 $x^2f(x)$ 高阶而直接丢弃；可导且 $f(0)=0$ 时两者同为三阶。',
    answerText: '正确选项为 B：极限为 $-f\\prime(0)$。',
    questionFormat: 'single-choice',
    options: ['$-2f\\prime(0)$', '$-f\\prime(0)$', '$f\\prime(0)$', '$0$'],
    correctOptionIds: ['B'],
    solutionMethods: [
      {
        title: '方法一 · 分项提取差商',
        content: '原式等于\n\n$$\\frac{f(x)}x-2\\frac{f(x^3)}{x^3}.$$\n\n因为 $f(0)=0$，两个差商都趋于 $f\\prime(0)$，故极限为 $f\\prime(0)-2f\\prime(0)=-f\\prime(0)$。'
      },
      {
        title: '方法二 · 一阶展开复核',
        content: '$f(u)=f\\prime(0)u+o(u)$。于是 $x^2f(x)=f\\prime(0)x^3+o(x^3)$，$2f(x^3)=2f\\prime(0)x^3+o(x^3)$；相减除以 $x^3$ 即得 $-f\\prime(0)$。'
      }
    ]
  }),
  lectureThree({
    id: 'wzx-example-19', source: WZX_SOURCE, role: 'example', page: 'PDF 30 · 书页 P53 · 例 19',
    fingerprint: 'implicit-function:sequence-limit-from-tangent-at-origin',
    title: '武忠祥例 19 · 隐函数切线系数决定数列极限',
    statement: '函数 $y=f(x)$ 由方程\n\n$$y-x=e^{x(1-y)}$$\n\n确定。求 $\\lim_{n\\to\\infty}n[f(1/n)-1]$。',
    tags: ['隐函数', '数列极限', '导数'],
    coreMethod: '先由方程求 $f(0)$ 和 $f\\prime(0)$，再把数列极限识别为原点处的差商。',
    mistakes: '未先算出 $f(0)=1$，就无法把 $n[f(1/n)-1]$ 准确写成导数差商。',
    answerText: '极限为 $1$。',
    solutionMethods: [
      {
        title: '方法一 · 隐式求导',
        content: '令 $x=0$ 得 $f(0)=1$。两边求导：\n\n$$f\\prime(x)-1=e^{x(1-f(x))}[1-f(x)-xf\\prime(x)].$$\n\n代入 $x=0,f(0)=1$ 得 $f\\prime(0)=1$。而\n\n$$n[f(1/n)-1]=\\frac{f(1/n)-f(0)}{1/n}\\to f\\prime(0)=1.$$'
      },
      {
        title: '方法二 · 局部展开复核',
        content: '设 $f(x)=1+cx+o(x)$。代回方程，左边为 $1+(c-1)x+o(x)$，右边 $e^{x[-cx+o(x)]}=1+o(x)$。比较一次项得 $c=1$，所以所求差商极限为 $1$。'
      }
    ]
  }),
  lectureThree({
    id: 'wzx-example-20', source: WZX_SOURCE, role: 'example', page: 'PDF 30 · 书页 P53 · 例 20',
    fingerprint: 'absolute-value:compare-four-origin-differentiability-orders',
    title: '武忠祥例 20 · 四个绝对值复合函数的原点可导性',
    statement: '下列函数中，在 $x=0$ 处不可导的是哪一个？',
    tags: ['绝对值函数', '可导性', '选择题'],
    coreMethod: '分别求 $[f(x)-f(0)]/x$ 的左右极限；优先用小角展开识别最低阶的 $|x|$ 项。',
    mistakes: '看到绝对值就一律判不可导；若整体最低阶高于一次，绝对值造成的尖角会被高阶因子压平。',
    answerText: '正确选项为 D：$f(x)=\\cos\\sqrt{|x|}$。',
    questionFormat: 'single-choice',
    options: ['$|x|\\sin|x|$', '$|x|\\sin\\sqrt{|x|}$', '$\\cos|x|$', '$\\cos\\sqrt{|x|}$'],
    correctOptionIds: ['D'],
    solutionMethods: [
      {
        title: '方法一 · 最低阶展开',
        content: 'A、B 分别为 $O(x^2)$、$O(|x|^{3/2})$，除以 $x$ 后都趋零；C 因 $\\cos|x|=\\cos x$ 可导。D 满足\n\n$$\\cos\\sqrt{|x|}=1-\\frac{|x|}{2}+o(|x|),$$\n\n故右导数为 $-1/2$、左导数为 $1/2$，不可导。'
      },
      {
        title: '方法二 · 左右差商复核',
        content: '对 D，有\n\n$$\\frac{\\cos\\sqrt{|x|}-1}{x}=\\frac{\\cos u-1}{u^2}\\cdot\\frac{|x|}{x},\\qquad u=\\sqrt{|x|}.$$\n\n第一因子趋于 $-1/2$，第二因子在左右两侧分别为 $1$ 与 $-1$，故左右极限相反。'
      }
    ]
  }),
  lectureThree({
    id: 'zy1000-question-2', source: ZY1000_SOURCE, role: 'exercise', page: 'PDF 23 · 解析页 17 · 第 2 题',
    fingerprint: 'product:nondifferentiable-factor-forces-zero-multiplier',
    title: '1000 题第 2 题 · 不可导因子迫使乘子为零',
    statement: '设 $F(x)=g(x)\\varphi(x)$，$F$ 与 $g$ 在 $x=a$ 处均可导，而 $\\varphi$ 在 $x=a$ 处不可导。证明 $g(a)=0$。',
    tags: ['乘积结构', '反证法', '证明题'],
    coreMethod: '若 $g(a)\\ne0$，则邻域内可以写成 $\\varphi=F/g$，两个可导函数之商仍可导，立即矛盾。',
    mistakes: '直接对 $g\\varphi$ 使用乘积公式；题设恰好没有保证 $\\varphi\\prime(a)$ 存在。',
    answerText: '必有 $g(a)=0$。',
    solutionMethods: [
      {
        title: '方法一 · 商函数反证',
        content: '假设 $g(a)\\ne0$。由 $g$ 连续，$g$ 在 $a$ 的某邻域内不为零，于是 $\\varphi(x)=F(x)/g(x)$。因 $F,g$ 在 $a$ 可导且分母非零，商函数在 $a$ 可导，这与题设矛盾。因此 $g(a)=0$。'
      },
      {
        title: '方法二 · 乘积差商隔离',
        content: '写出\n\n$$\\frac{F(a+h)-F(a)}h=\\frac{g(a+h)-g(a)}h\\varphi(a+h)+g(a)\\frac{\\varphi(a+h)-\\varphi(a)}h.$$\n\n若 $g(a)\\ne0$，前两函数的连续性与左端、第一项极限的存在会迫使最后的 $\\varphi$ 差商存在，仍与不可导矛盾。'
      }
    ]
  }),
  lectureThree({
    id: 'zy1000-question-4', source: ZY1000_SOURCE, role: 'exercise', page: 'PDF 24 · 解析页 18 · 第 4 题',
    fingerprint: 'difference-quotient:square-composition-factorization',
    title: '1000 题第 4 题 · 平方复合的差商极限',
    statement: '设 $f$ 在 $x=0$ 处可导，且 $f(0)=\\sqrt2$、$f\\prime(0)=\\sqrt2$。求\n\n$$\\lim_{x\\to0}\\frac{f^2(x)-2}{x}.$$',
    tags: ['复合函数', '差商', '极限'],
    coreMethod: '利用平方差分解，拆成趋于常数的 $f(x)+f(0)$ 与标准差商。',
    mistakes: '直接把 $f^2(x)$ 的导数写成 $2f\\prime(0)$，漏掉链式法则中的 $f(0)$。',
    answerText: '极限为 $4$。',
    solutionMethods: [
      {
        title: '方法一 · 平方差分解',
        content: '因为 $2=f^2(0)$，原式为\n\n$$[f(x)+f(0)]\\frac{f(x)-f(0)}x\\to(\\sqrt2+\\sqrt2)\\sqrt2=4.$$'
      },
      {
        title: '方法二 · 复合函数求导复核',
        content: '令 $H(x)=f^2(x)$，则所求极限是 $H\\prime(0)$。链式法则给出 $H\\prime(0)=2f(0)f\\prime(0)=2\\sqrt2\\cdot\\sqrt2=4$。'
      }
    ]
  }),
  lectureThree({
    id: 'zy1000-question-6', source: ZY1000_SOURCE, role: 'exercise', page: 'PDF 24 · 解析页 18 · 第 6 题',
    fingerprint: 'sequence:logarithmic-composite-difference-quotient',
    title: '1000 题第 6 题 · 对数函数值比的数列差商',
    statement: '设 $f$ 在 $x=0$ 处可导且 $f(0)>0$。求\n\n$$\\lim_{n\\to\\infty}n\\ln\\frac{f(1/n)}{f(0)}.$$',
    tags: ['数列极限', '对数复合', '差商'],
    coreMethod: '把 $n$ 写成 $1/(1/n)$，整体识别为 $\\ln f(x)$ 在原点的右差商。',
    mistakes: '分别对分子、分母取极限只得到 $\\ln1=0$；外面的 $n$ 要与函数增量一起处理。',
    answerText: '极限为 $\\dfrac{f\\prime(0)}{f(0)}$。',
    solutionMethods: [
      {
        title: '方法一 · 复合函数差商',
        content: '令 $x=1/n\\to0^+$，原式变为\n\n$$\\frac{\\ln f(x)-\\ln f(0)}x\\to[\\ln f(x)]\\prime\\big|_{x=0}=\\frac{f\\prime(0)}{f(0)}.$$'
      },
      {
        title: '方法二 · 对数等价复核',
        content: '由 $f(x)=f(0)+f\\prime(0)x+o(x)$，\n\n$$\\ln\\frac{f(x)}{f(0)}=\\ln\\left(1+\\frac{f\\prime(0)}{f(0)}x+o(x)\\right)=\\frac{f\\prime(0)}{f(0)}x+o(x).$$\n\n再取 $x=1/n$ 即得结论。'
      }
    ]
  }),
  lectureThree({
    id: 'zy1000-question-7', source: ZY1000_SOURCE, role: 'exercise', page: 'PDF 24-25 · 解析页 18-19 · 第 7 题',
    fingerprint: 'absolute-value:nondifferentiability-characterization',
    title: '1000 题第 7 题 · 绝对值复合不可导的必要结构',
    statement: '设 $f$ 在 $x=0$ 处可导，而 $|f(x)|$ 在 $x=0$ 处不可导。证明 $f(0)=0$ 且 $f\\prime(0)\\ne0$。',
    tags: ['绝对值函数', '可导性', '反证法', '证明题'],
    coreMethod: '若函数值非零，连续性使其局部保号；若函数值与导数都为零，绝对值差商又会趋零。两种情况都会使绝对值可导。',
    mistakes: '仅得到 $f(0)=0$ 就停止；还必须排除 $f\\prime(0)=0$，否则 $|f|$ 的导数仍存在。',
    answerText: '$f(0)=0$ 且 $f\\prime(0)\\ne0$。',
    solutionMethods: [
      {
        title: '方法一 · 分两步反证',
        content: '若 $f(0)\\ne0$，由连续性 $f$ 在原点附近保号，故 $|f|$ 局部等于 $f$ 或 $-f$，必可导，矛盾。所以 $f(0)=0$。若再有 $f\\prime(0)=0$，则\n\n$$\\left|\\frac{|f(x)|-|f(0)|}{x}\\right|=\\left|\\frac{f(x)-f(0)}x\\right|\\to0,$$\n\n仍推出 $|f|$ 可导，故 $f\\prime(0)\\ne0$。'
      },
      {
        title: '方法二 · 局部线性形态复核',
        content: '可导性给出 $f(x)=f(0)+f\\prime(0)x+o(x)$。非零常数项不会穿过零点，绝对值保持光滑；常数项和一次项都为零时，$|f(x)|=o(|x|)$，导数为零。只有 $f(0)=0$ 且一次系数非零时，$|f|$ 才形成尖点。'
      }
    ]
  }),
  lectureThree({
    id: 'zy1000-question-8', source: ZY1000_SOURCE, role: 'exercise', page: 'PDF 25 · 解析页 19 · 第 8 题',
    fingerprint: 'tangent:logarithmic-reference-limit-recovers-slope',
    title: '1000 题第 8 题 · 由对数参照极限求切线',
    statement: '设 $f$ 在 $x=1$ 附近有定义，且\n\n$$\\lim_{x\\to1}\\frac{f(x)-1}{\\ln x}=2.$$\n\n求曲线 $y=f(x)$ 在 $x=1$ 处的切线方程。',
    tags: ['切线', '差商', '对数极限'],
    coreMethod: '先由极限得到 $f(x)\\to1$，再乘上 $\\ln x/(x-1)\\to1$ 还原标准导数差商。',
    mistakes: '没有先确认 $f(1)=1$；切线方程需要点值和斜率两项信息。',
    answerText: '切线方程为 $y=2x-1$。',
    solutionMethods: [
      {
        title: '方法一 · 还原导数差商',
        content: '题设给出 $f(x)-1\\to0$，故连续延拓下 $f(1)=1$。于是\n\n$$f\\prime(1)=\\lim_{x\\to1}\\frac{f(x)-1}{x-1}=\\lim_{x\\to1}\\frac{f(x)-1}{\\ln x}\\frac{\\ln x}{x-1}=2.$$ \n\n切线为 $y-1=2(x-1)$。'
      },
      {
        title: '方法二 · 局部等价复核',
        content: '由题设 $f(x)-1\\sim2\\ln x$，而 $\\ln x\\sim x-1$，所以 $f(x)=1+2(x-1)+o(x-1)$。局部线性主部直接给出点 $(1,1)$ 与斜率 $2$。'
      }
    ]
  }),
  lectureThree({
    id: 'zy1000-question-10', source: ZY1000_SOURCE, role: 'exercise', page: 'PDF 25 · 解析页 19 · 第 10 题',
    fingerprint: 'piecewise:oscillation-derivative-continuity-at-origin',
    title: '1000 题第 10 题 · 振荡项仍可得到连续导函数',
    statement: '设\n\n$$f(x)=\\begin{cases}x^2,&x<0,\\\\0,&x=0,\\\\x^3\\sin\\dfrac1x,&x>0.\\end{cases}$$\n\n判断 $f$ 在原点是否可导，并判断 $f\\prime$ 在原点是否连续。',
    tags: ['分段函数', '振荡函数', '导函数连续性'],
    coreMethod: '原点导数用差商；导函数连续性则先分别求两侧邻域内导数，再夹逼各项。',
    mistakes: '看到 $\\sin(1/x)$ 或 $\\cos(1/x)$ 振荡便直接判不连续；必须检查它前面的幂次是否足够压制。',
    answerText: '$f\\prime(0)=0$，且 $f\\prime$ 在 $x=0$ 处连续。',
    solutionMethods: [
      {
        title: '方法一 · 分两层检查',
        content: '左差商为 $x\\to0$，右差商为 $x^2\\sin(1/x)\\to0$，故 $f\\prime(0)=0$。当 $x<0$，$f\\prime(x)=2x\\to0$；当 $x>0$，\n\n$$f\\prime(x)=3x^2\\sin(1/x)-x\\cos(1/x)\\to0.$$\n\n两侧都趋于 $f\\prime(0)$，所以导函数连续。'
      },
      {
        title: '方法二 · 一致估计复核',
        content: '右侧导数满足 $|f\\prime(x)|\\le3x^2+|x|\\to0$，左侧满足 $|f\\prime(x)|=2|x|\\to0$。这个估计避开振荡相位，直接证明邻域导数统一趋零。'
      }
    ]
  }),
  lectureThree({
    id: 'zy1000-question-11', source: ZY1000_SOURCE, role: 'exercise', page: 'PDF 25-26 · 解析页 19-20 · 第 11 题',
    fingerprint: 'absolute-log-perturbation:one-sided-derivative-matching',
    title: '1000 题第 11 题 · 含绝对值对数扰动的可导条件',
    statement: '设 $\\varphi$ 在 $x=0$ 处可导，且\n\n$$f(x)=\\varphi(x)\\,[1+\\ln(1+|x|)].$$\n\n求 $f$ 在 $x=0$ 处可导的条件，并求此时的 $f\\prime(0)$。',
    tags: ['绝对值函数', '对数函数', '左右导数', '参数条件'],
    coreMethod: '分别计算绝对值内层造成的左右一阶系数；两侧导数相等迫使 $\\varphi(0)=0$。',
    mistakes: '直接套乘积求导并给 $|x|$ 在原点赋一个不存在的导数；必须分左右处理。',
    answerText: '$f$ 在原点可导当且仅当 $\\varphi(0)=0$；此时 $f\\prime(0)=\\varphi\\prime(0)$。',
    solutionMethods: [
      {
        title: '方法一 · 左右差商',
        content: '因 $f(0)=\\varphi(0)$，有\n\n$$\\frac{f(x)-f(0)}x=\\frac{\\varphi(x)-\\varphi(0)}x+\\varphi(x)\\frac{\\ln(1+|x|)}x.$$\n\n右极限为 $\\varphi\\prime(0)+\\varphi(0)$，左极限为 $\\varphi\\prime(0)-\\varphi(0)$。二者相等当且仅当 $\\varphi(0)=0$，共同值为 $\\varphi\\prime(0)$。'
      },
      {
        title: '方法二 · 单侧展开复核',
        content: '$\\varphi(x)=\\varphi(0)+\\varphi\\prime(0)x+o(x)$，而 $\\ln(1+|x|)=|x|+o(|x|)$。因此\n\n$$f(x)-f(0)=\\varphi\\prime(0)x+\\varphi(0)|x|+o(|x|).$$\n\n绝对值一次项只有系数为零时才不会形成尖点。'
      }
    ]
  }),
  lectureThree({
    id: 'zy1000-question-12', source: ZY1000_SOURCE, role: 'exercise', page: 'PDF 26 · 解析页 20 · 第 12 题',
    fingerprint: 'sequence:asymmetric-two-sided-difference-quotient',
    title: '1000 题第 12 题 · 两个异步趋近点的函数差',
    statement: '设 $f$ 在 $x=x_0$ 处可导，数列 $x_n\\sim1/n$。求\n\n$$\\lim_{n\\to\\infty}\\frac{f(x_0+1/n)-f(x_0-x_n)}{\\sin(1/n)}.$$',
    tags: ['数列极限', '差商', '两侧增量'],
    coreMethod: '在分子中加减 $f(x_0)$，把右侧增量与左侧增量分别化成导数，再用 $x_n/(1/n)\\to1$。',
    mistakes: '把两点之间的总步长误看成 $1/n-x_n$；第二点在 $x_0$ 左侧，净距离实际是 $1/n+x_n$。',
    answerText: '极限为 $2f\\prime(x_0)$。',
    solutionMethods: [
      {
        title: '方法一 · 拆分两个差商',
        content: '利用 $\\sin(1/n)\\sim1/n$，原式等价于\n\n$$\\frac{f(x_0+1/n)-f(x_0)}{1/n}+\\frac{f(x_0-x_n)-f(x_0)}{-x_n}\\frac{x_n}{1/n}.$$\n\n三因子分别趋于 $f\\prime(x_0)$、$f\\prime(x_0)$ 与 $1$，总和为 $2f\\prime(x_0)$。'
      },
      {
        title: '方法二 · 局部线性展开',
        content: '有 $f(x_0+h)=f(x_0)+f\\prime(x_0)h+o(h)$。分子因此为 $f\\prime(x_0)(1/n+x_n)+o(1/n)$。又 $x_n\\sim1/n$、$\\sin(1/n)\\sim1/n$，所以比值趋于 $2f\\prime(x_0)$。'
      }
    ]
  }),
  lectureThree({
    id: 'zy1000-question-13', source: ZY1000_SOURCE, role: 'exercise', page: 'PDF 26 · 解析页 20 · 第 13 题',
    fingerprint: 'odd-function:scaled-argument-linear-combination-limit',
    title: '1000 题第 13 题 · 奇函数缩放组合的导数极限',
    statement: '设 $f$ 为奇函数且在 $x=0$ 处可导，$t$ 为实数。求\n\n$$\\lim_{x\\to0}\\frac{f(tx)-5f(x)}x.$$',
    tags: ['奇函数', '缩放变量', '差商'],
    coreMethod: '奇函数给出 $f(0)=0$，再把 $f(tx)$ 与 $f(x)$ 分别化为原点标准差商。',
    mistakes: '当 $t=0$ 时认为不能除以 $tx$；应单独看出 $f(0)=0$，统一公式仍成立。',
    answerText: '极限为 $(t-5)f\\prime(0)$。',
    solutionMethods: [
      {
        title: '方法一 · 分拆差商',
        content: '因 $f(0)=0$。当 $t\\ne0$ 时，\n\n$$\\frac{f(tx)-5f(x)}x=t\\frac{f(tx)-f(0)}{tx}-5\\frac{f(x)-f(0)}x\\to(t-5)f\\prime(0).$$\n\n当 $t=0$ 时第一项恒为零，所得公式同样成立。'
      },
      {
        title: '方法二 · 一阶展开复核',
        content: '原点可导且 $f(0)=0$，故 $f(u)=f\\prime(0)u+o(u)$。代入 $u=tx$ 与 $u=x$，分子为 $(t-5)f\\prime(0)x+o(x)$，除以 $x$ 即得结论。'
      }
    ]
  })
]
