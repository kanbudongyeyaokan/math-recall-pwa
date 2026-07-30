import type { SeedInput } from './types'

const SOURCE = '何耀焜私人整理 · 张宇《基础30讲》高数 · 第1讲逐页核验扩充'

type LectureOneSeed = Omit<SeedInput, 'id' | 'kind' | 'source' | 'tags' | 'methodFingerprint'> & {
  number: string
  role: 'example' | 'exercise'
  page: string
  tags: string[]
  fingerprint: string
}

function lectureOne(input: LectureOneSeed): SeedInput {
  const roleLabel = input.role === 'example' ? '经典例题' : '课后习题'
  return {
    ...input,
    id: `zy30-verified-l01-${input.role}-${input.number.replace('.', '-')}`,
    kind: 'problem',
    source: SOURCE,
    tags: ['高等数学', '第1讲', roleLabel, 'PDF逐页核验', ...input.tags],
    methodFingerprint: `zy30-verified:l01:${input.fingerprint}`
  }
}

export const foundation30Lecture1ExpansionSeeds: SeedInput[] = [
  lectureOne({
    role: 'example', number: '1.13', page: 'PDF 31 · 书页 26', fingerprint: 'floor:fractional-part-periodicity',
    title: '例 1.13 · 小数部分函数的周期性',
    statement: '设 $[x]$ 表示不超过 $x$ 的最大整数，则 $y=x-[x]$ 是（　）。',
    tags: ['取整函数', '周期函数', '选择题'],
    coreMethod: '直接比较 $y(x+1)$ 与 $y(x)$，使用 $[x+1]=[x]+1$。',
    mistakes: '把图像在整数点的跳跃误判为无界；周期函数不要求连续。',
    answerText: '正确选项为 D，$y=x-[x]$ 是以 $1$ 为周期的函数。',
    questionFormat: 'single-choice',
    options: ['无界函数', '单调函数', '偶函数', '周期函数'],
    correctOptionIds: ['D'],
    solutionMethods: [
      { title: '方法一 · 代数验证', content: '由 $[x+1]=[x]+1$，有 $y(x+1)=x+1-[x+1]=x-[x]=y(x)$，故 $1$ 是它的周期。' },
      { title: '方法二 · 区间图像', content: '当 $k\\le x<k+1$ 时，$[x]=k$，所以 $y=x-k\\in[0,1)$；每个单位区间都重复同一条斜线段，故选 D。' }
    ]
  }),
  lectureOne({
    role: 'example', number: '1.14', page: 'PDF 34-35 · 书页 29-30', fingerprint: 'limit:implicit-coefficient-equation',
    title: '例 1.14 · 用已知极限建立系数方程',
    statement: `已知 $\\displaystyle\\lim_{x\\to0}\\frac{f(x)}{x^2}$ 存在，且

$$f(x)=\\frac{x-\\sin x}{x}+x^2\\lim_{x\\to0}\\frac{f(x)}{1-\\cos x}.$$

求 $\\displaystyle\\lim_{x\\to0}\\frac{f(x)}{x^2}$。`,
    tags: ['函数极限', '待定系数', '选择题'],
    coreMethod: '把所求极限设为常数 $A$，再把题设中另一处含 $f$ 的极限化为 $2A$。',
    mistakes: '未先确认第二个极限可由所求极限表示；应利用 $f(x)/x^2\\to A$ 与 $(1-\\cos x)/x^2\\to1/2$ 得到它等于 $2A$。',
    answerText: '正确选项为 D，极限为 $-\\frac16$。',
    questionFormat: 'single-choice',
    options: ['$-\\frac13$', '$\\frac13$', '$\\frac16$', '$-\\frac16$'],
    correctOptionIds: ['D'],
    solutionMethods: [
      { title: '方法一 · 设元闭环', content: `设 $A=\\lim_{x\\to0}f(x)/x^2$。当 $x\\to0$ 时，

$$\\frac{f(x)}{x^2}=\\frac{x-\\sin x}{x^3}+\\lim_{t\\to0}\\frac{f(t)}{1-\\cos t}\\to\\frac16+2A.$$

故 $A=\\frac16+2A$，解得 $A=-\\frac16$。` },
      { title: '方法二 · Taylor 复核', content: '由 $x-\\sin x=\\frac{x^3}{6}+o(x^3)$、$1-\\cos x=\\frac{x^2}{2}+o(x^2)$，题设化为 $f(x)=x^2(\\frac16+2A)+o(x^2)$；比较二阶系数仍得 $A=-\\frac16$。' }
    ]
  }),
  lectureOne({
    role: 'example', number: '1.15', page: 'PDF 42-43 · 书页 37-38', fingerprint: 'one-sided-limit:exponential-barrier',
    title: '例 1.15 · 指数屏障造成的左右极限分裂',
    statement: `当 $x\\to1$ 时，函数

$$\\frac{e^{\\frac1{x-1}}\\ln|1+x|}{(e^x-1)(x-2)}$$

的极限（　）。`,
    tags: ['单侧极限', '指数函数', '选择题'],
    coreMethod: '把 $1/(x-1)$ 的左右趋向分开：右侧趋于 $+\\infty$，左侧趋于 $-\\infty$。',
    mistakes: '看到表达式相同就忽略单侧极限；指数函数会把符号差异放大成 $0$ 与无穷大。',
    answerText: '正确选项为 D：极限不存在且不为无穷大。',
    questionFormat: 'single-choice',
    options: ['等于 $1$', '等于 $0$', '为 $\\infty$', '不存在且不为 $\\infty$'],
    correctOptionIds: ['D'],
    solutionMethods: [
      { title: '方法一 · 左右极限', content: '当 $x\\to1^-$ 时，$e^{1/(x-1)}\\to0$，原式趋于 $0$；当 $x\\to1^+$ 时，指数项趋于 $+\\infty$，其余因子趋于有限非零值且分母为负，故原式趋于 $-\\infty$。' },
      { title: '方法二 · 序列复核', content: '取 $x_n=1-1/n$ 得函数值趋于 $0$；取 $y_n=1+1/n$ 得函数值趋于 $-\\infty$。同一点存在两条趋近序列给出不同结果，所以双侧极限不存在。' }
    ]
  }),
  lectureOne({
    role: 'example', number: '1.16', page: 'PDF 43 · 书页 38', fingerprint: 'composition:piecewise-one-sided',
    title: '例 1.16 · 分段复合函数的左右极限',
    statement: `设

$$g(x)=\\begin{cases}2-x,&x\\le0,\\\\2+x,&x>0,\\end{cases}\\qquad
f(x)=\\begin{cases}x^2,&x<0,\\\\-x-1,&x\\ge0,\\end{cases}$$

求 $\\displaystyle\\lim_{x\\to0}g[f(x)]$。`,
    tags: ['复合函数', '分段函数', '选择题'],
    coreMethod: '先判断内函数在左右两侧落入 $g$ 的哪一段，再分别求外层表达式。',
    mistakes: '只看 $f(x)\\to0$ 就直接代入 $g(0)$；事实上右侧的 $f(x)$ 趋于 $-1$。',
    answerText: '正确选项为 D，左右极限分别为 $2$ 与 $3$，故不存在。',
    questionFormat: 'single-choice',
    options: ['$3$', '$2$', '$1$', '不存在'],
    correctOptionIds: ['D'],
    solutionMethods: [
      { title: '方法一 · 逐侧代入', content: '当 $x<0$ 时，$f(x)=x^2>0$，故 $g[f(x)]=2+x^2\\to2$；当 $x\\ge0$ 时，$f(x)=-x-1<0$，故 $g[f(x)]=2-(-x-1)=3+x\\to3$。' },
      { title: '方法二 · 映射链复核', content: '左侧路径是 $x\\to0^-\\Rightarrow f(x)\\to0^+\\Rightarrow g(f(x))\\to2$；右侧路径是 $x\\to0^+\\Rightarrow f(x)\\to-1^-\\Rightarrow g(f(x))\\to3$，两条映射链终点不同。' }
    ]
  }),
  lectureOne({
    role: 'example', number: '1.17', page: 'PDF 44 · 书页 39', fingerprint: 'boundedness:open-interval-endpoints',
    title: '例 1.17 · 开区间端点极限判定有界性',
    statement: `在下列区间内，函数

$$f(x)=\\frac{x\\sin(x-3)}{(x-1)(x-3)^2}$$

有界的是（　）。`,
    tags: ['函数有界性', '端点极限', '选择题'],
    coreMethod: '开区间不能直接套闭区间有界定理，应检查区间内奇点和两个端点处的单侧极限。',
    mistakes: '把“开区间上连续”误当成必然有界；若端点靠近 $1$ 或 $3$，仍可能发散。',
    answerText: '正确选项为 B，即 $(-1,0)$。',
    questionFormat: 'single-choice',
    options: ['$(-2,1)$', '$(-1,0)$', '$(1,2)$', '$(2,3)$'],
    correctOptionIds: ['B'],
    solutionMethods: [
      { title: '方法一 · 奇点排查', content: '$x=1,3$ 是潜在奇点，靠近 $1$ 时分母含一阶零因子，靠近 $3$ 时约为常数除以 $x-3$，都无界。四个区间中只有 $(-1,0)$ 的闭包避开这两个点。' },
      { title: '方法二 · 闭包连续复核', content: '$f$ 在闭区间 $[-1,0]$ 上连续，因此有界，进而在 $(-1,0)$ 上有界；其余三个区间分别以 $1$ 或 $3$ 为端点，单侧极限发散。' }
    ]
  }),
  lectureOne({
    role: 'example', number: '1.18', page: 'PDF 45-46 · 书页 40-41', fingerprint: 'sign-preservation:negative-limit',
    title: '例 1.18 · 由极限符号锁定邻域符号',
    statement: `已知 $f(x)$ 在 $x=0$ 的某个邻域内连续，且

$$\\lim_{x\\to0}\\frac{f(x)}{1-\\cos x}=-1,$$

则存在 $\\delta>0$，下列结论正确的是（　）。`,
    tags: ['局部保号性', '函数极限', '选择题'],
    coreMethod: '分母在去心邻域恒正，而商的极限为负，因此商最终为负，进而 $f(x)$ 最终为负。',
    mistakes: '把 $1-\\cos x$ 当成会随 $x$ 变号；它在 $x\\ne0$ 的小邻域内恒正。',
    answerText: '正确选项为 D：在 $(-\\delta,0)$ 与 $(0,\\delta)$ 上均有 $f(x)<0$。',
    questionFormat: 'single-choice',
    options: [
      '$x\\in(-\\delta,0)$ 时 $f(x)>0$，$x\\in(0,\\delta)$ 时 $f(x)<0$',
      '$x\\in(-\\delta,0)$ 时 $f(x)<0$，$x\\in(0,\\delta)$ 时 $f(x)>0$',
      '两侧均有 $f(x)>0$',
      '两侧均有 $f(x)<0$'
    ],
    correctOptionIds: ['D'],
    solutionMethods: [
      { title: '方法一 · 极限保号', content: '取误差 $1/2$，可使商落在 $(-3/2,-1/2)$ 内，因而为负；又 $1-\\cos x>0$，所以两侧去心邻域内 $f(x)<0$。' },
      { title: '方法二 · 等价量复核', content: '由 $1-\\cos x\\sim x^2/2>0$，题设给出 $f(x)\\sim-(1-\\cos x)\\sim-x^2/2$，故在 $0$ 的左右两侧都严格为负。' }
    ]
  }),
  lectureOne({
    role: 'example', number: '1.19', page: 'PDF 50 · 书页 45', fingerprint: 'infinitesimal-order:exponential-trig-difference',
    title: '例 1.19 · 指数差的无穷小阶数',
    statement: '当 $x\\to0$ 时，$e^{\\tan x}-e^{\\sin x}$ 与 $x^n$ 是同阶无穷小，求 $n$。',
    tags: ['无穷小阶数', '等价变形', '选择题'],
    coreMethod: '提出 $e^{\\sin x}$，把指数差转化为 $e^{\\tan x-\\sin x}-1$。',
    mistakes: '分别把两个指数函数只展开到一阶后相减，会把决定阶数的三阶项一起消掉。',
    answerText: '正确选项为 C，$n=3$。',
    questionFormat: 'single-choice',
    options: ['$1$', '$2$', '$3$', '$4$'],
    correctOptionIds: ['C'],
    solutionMethods: [
      { title: '方法一 · 等价链', content: '$e^{\\tan x}-e^{\\sin x}=e^{\\sin x}(e^{\\tan x-\\sin x}-1)\\sim\\tan x-\\sin x\\sim x^3/2$，故与 $x^3$ 同阶。' },
      { title: '方法二 · Taylor 展开', content: '$\\tan x=x+x^3/3+o(x^3)$、$\\sin x=x-x^3/6+o(x^3)$，差为 $x^3/2+o(x^3)$；外层指数在零点的一阶系数为 $1$，阶数不变。' }
    ]
  }),
  lectureOne({
    role: 'example', number: '1.20', page: 'PDF 51 · 书页 46', fingerprint: 'limit-algebra:quotient-zero-proofs',
    title: '例 1.20 · 商极限与零极限的反向推导',
    statement: `证明：

1. 若 $\\displaystyle\\lim\\frac{f(x)}{g(x)}=A$ 且 $\\lim g(x)=0$，则 $\\lim f(x)=0$；
2. 若 $\\displaystyle\\lim\\frac{f(x)}{g(x)}=A\\ne0$ 且 $\\lim f(x)=0$，则 $\\lim g(x)=0$。`,
    tags: ['极限四则运算', '证明题'],
    coreMethod: '分别写成 $f=(f/g)g$ 与 $g=f/(f/g)$，再使用乘法或除法极限定理。',
    mistakes: '第二问漏掉 $A\\ne0$；若商极限为零，不能保证可以作除法。',
    answerText: '两条结论均由极限四则运算直接成立，第二条必须保留 $A\\ne0$。',
    solutionMethods: [
      { title: '方法一 · 恒等变形', content: '第一问中 $f=(f/g)g$，故 $\\lim f=A\\cdot0=0$。第二问中 $g=f/(f/g)$，且分母极限 $A\\ne0$，故 $\\lim g=0/A=0$。' },
      { title: '方法二 · 序列复核', content: '对任意趋向目标点的序列，把函数值记为 $f_n,g_n$。已知 $f_n/g_n\\to A$；乘积定理给出第一问，$A\\ne0$ 时倒数序列 $g_n/f_n$ 的相应商变形给出第二问。' }
    ]
  }),
  lectureOne({
    role: 'example', number: '1.21', page: 'PDF 51-52 · 书页 46-47', fingerprint: 'parameter-limit:finite-nonzero-product',
    title: '例 1.21 · 非零有限极限反求两个参数',
    statement: `设

$$\\lim_{x\\to0}\\frac{\\sin x}{e^x-a}(\\cos x-b)=5,$$

求 $b$。`,
    tags: ['参数极限', '等价无穷小', '选择题'],
    coreMethod: '极限非零先迫使分母也趋于零，确定 $a=1$，再计算剩余常数因子。',
    mistakes: '未先锁定 $a$ 就直接代入；若 $a\\ne1$，整体极限只能为零。',
    answerText: '正确选项为 A，$b=-4$。',
    questionFormat: 'single-choice',
    options: ['$-4$', '$-3$', '$-2$', '$-1$'],
    correctOptionIds: ['A'],
    solutionMethods: [
      { title: '方法一 · 非零条件', content: '因极限为 $5\\ne0$ 且 $\\sin x\\to0$，必须有 $e^x-a\\to0$，故 $a=1$。此时 $\\sin x/(e^x-1)\\to1$，所以 $1-b=5$，得 $b=-4$。' },
      { title: '方法二 · 一阶展开', content: '$\\sin x=x+o(x)$、$e^x-a=(1-a)+x+o(x)$、$\\cos x-b=1-b+o(1)$。有限非零极限要求 $1-a=0$，再比较一阶项得 $1-b=5$。' }
    ]
  }),
  lectureOne({
    role: 'example', number: '1.22', page: 'PDF 54 · 书页 49', fingerprint: 'equivalent-infinitesimals:arsinh-cos-power',
    title: '例 1.22 · 两个常用等价无穷小的证明',
    statement: `证明当 $x\\to0$ 时：

$$\\ln\\left(x+\\sqrt{1+x^2}\\right)\\sim x,$$

以及对 $\\alpha\\ne0$，

$$1-(\\cos x)^\\alpha\\sim\\frac{\\alpha}{2}x^2.$$
`,
    tags: ['等价无穷小', '洛必达法则', '证明题'],
    coreMethod: '把等价关系写成比值极限为 $1$，再在 $0/0$ 型下求导。',
    mistakes: '第二式遗漏条件 $\\alpha\\ne0$，或把系数误写成 $1/(2\\alpha)$。',
    answerText: '两个比值的极限均为 $1$，故两组等价关系成立。',
    solutionMethods: [
      { title: '方法一 · 洛必达法则', content: '第一式的分子导数为 $1/\\sqrt{1+x^2}$，比值极限为 $1$。第二式除以 $\\alpha x^2/2$ 后求导，化为 $(\\cos x)^{\\alpha-1}(\\sin x/x)\\to1$。' },
      { title: '方法二 · Taylor 复核', content: '$\\operatorname{arsinh}x=\\ln(x+\\sqrt{1+x^2})=x+o(x)$；又 $\\cos x=1-x^2/2+o(x^2)$，用 $(1+u)^\\alpha=1+\\alpha u+o(u)$ 得第二式。' }
    ]
  }),
  lectureOne({
    role: 'example', number: '1.23', page: 'PDF 54-55 · 书页 49-50', fingerprint: 'growth-order:log-power-exponential',
    title: '例 1.23 · 对数幂、幂函数与指数函数的增长次序',
    statement: `设

$$f(x)=\\ln^{10}x,\\qquad g(x)=x,\\qquad h(x)=e^{x/e^{10}},$$

当 $x$ 充分大时，判断三者大小关系。`,
    tags: ['增长阶', '无穷大比较', '选择题'],
    coreMethod: '分别考察 $g/f$ 与 $h/g$ 的极限；若都趋于无穷大，即可串起严格次序。',
    mistakes: '把固定但很小的正指数系数 $1/e^{10}$ 误当成会改变指数函数最终压过幂函数的事实。',
    answerText: '正确选项为 C：$f(x)<g(x)<h(x)$。',
    questionFormat: 'single-choice',
    options: ['$g<h<f$', '$h<g<f$', '$f<g<h$', '$g<f<h$'],
    correctOptionIds: ['C'],
    solutionMethods: [
      { title: '方法一 · 比值极限', content: '连续使用洛必达可得 $x/\\ln^{10}x\\to\\infty$；同时 $e^{x/e^{10}}/x\\to\\infty$。因此对充分大的 $x$，有 $\\ln^{10}x<x<e^{x/e^{10}}$。' },
      { title: '方法二 · 取对数比较', content: '比较 $x$ 与 $\\ln^{10}x$ 可取对数为 $\\ln x$ 与 $10\\ln\\ln x$；比较 $e^{x/e^{10}}$ 与 $x$ 可取对数为 $x/e^{10}$ 与 $\\ln x$。前者最终均压过后者。' }
    ]
  }),
  lectureOne({
    role: 'example', number: '1.24', page: 'PDF 60 · 书页 55', fingerprint: 'indeterminate:second-important-limit-refinement',
    title: '例 1.24 · 第二重要极限的二阶修正',
    statement: '求 $\\displaystyle\\lim_{x\\to0^+}\\frac{(1+x)^{1/x}-e}{x}$。',
    tags: ['未定式', '第二重要极限', 'Taylor公式'],
    coreMethod: '把幂指函数写成 $e^{\\ln(1+x)/x}$，提出 $e$ 后研究指数相对 $1$ 的偏差。',
    mistakes: '只用 $(1+x)^{1/x}\\to e$ 只能得到 $0/0$，还必须保留 $\\ln(1+x)$ 的二阶项。',
    answerText: '极限为 $-\\frac e2$。',
    solutionMethods: [
      { title: '方法一 · 指数等价', content: '令 $u=\\ln(1+x)/x-1\\to0$，则分子为 $e(e^u-1)\\sim eu$。又 $u=[\\ln(1+x)-x]/x\\sim-x/2$，故商趋于 $-e/2$。' },
      { title: '方法二 · Taylor 展开', content: '$\\ln(1+x)/x=1-x/2+o(x)$，于是 $(1+x)^{1/x}=e\\,e^{-x/2+o(x)}=e-ex/2+o(x)$，相减除以 $x$ 即得。' }
    ]
  }),
  lectureOne({
    role: 'example', number: '1.25', page: 'PDF 61 · 书页 56', fingerprint: 'infinity:rational-polynomial-degree',
    title: '例 1.25 · 有理函数在无穷远处的次数判别',
    statement: `设 $a_n\\ne0,b_m\\ne0$，求

$$\\lim_{x\\to\\infty}\\frac{a_nx^n+a_{n-1}x^{n-1}+\\cdots+a_0}{b_mx^m+b_{m-1}x^{m-1}+\\cdots+b_0}.$$
`,
    tags: ['无穷远极限', '有理函数'],
    coreMethod: '只比较分子、分母最高次数，并同除以较合适的最高次幂。',
    mistakes: '当 $n>m$ 时笼统写成 $\\infty$ 而忽略正负号；严格说发散方向由 $a_n/b_m$ 与趋向方向决定。',
    answerText: '当 $n=m$ 时为 $a_n/b_m$；当 $n<m$ 时为 $0$；当 $n>m$ 时绝对值趋于无穷大。',
    solutionMethods: [
      { title: '方法一 · 同除最高幂', content: '若 $n=m$，同除 $x^n$ 后只剩首项系数之比；若 $n<m$，同除 $x^m$ 后分子趋零；若 $n>m$，提出 $x^{n-m}$，其绝对值发散。' },
      { title: '方法二 · 渐近等价', content: '分子等价于 $a_nx^n$，分母等价于 $b_mx^m$，故原式等价于 $(a_n/b_m)x^{n-m}$；三个结论由指数 $n-m$ 的符号立即得到。' }
    ]
  }),
  lectureOne({
    role: 'example', number: '1.26', page: 'PDF 62 · 书页 57', fingerprint: 'sequence-limit:resonant-parameter',
    title: '例 1.26 · 数列极限生成的分段函数',
    statement: `设

$$f(x)=\\lim_{n\\to\\infty}\\frac{x^2+nx(1-x)\\sin^2(\\pi x)}{1+n\\sin^2(\\pi x)},$$

求 $f(x)$。`,
    tags: ['含参极限', '分段函数', '三角函数'],
    coreMethod: '先判断固定系数 $\\sin^2(\\pi x)$ 是否为零；整数点与非整数点必须分开。',
    mistakes: '直接同除以 $n$ 并约去 $\\sin^2(\\pi x)$，会漏掉整数 $x$ 时该系数恒为零的情形。',
    answerText: `$$f(x)=\\begin{cases}x^2,&x\\in\\mathbb Z,\\\\x(1-x),&x\\notin\\mathbb Z.\\end{cases}$$`,
    solutionMethods: [
      { title: '方法一 · 分类取极限', content: '若 $x\\in\\mathbb Z$，则 $\\sin^2(\\pi x)=0$，原式恒为 $x^2$。若 $x\\notin\\mathbb Z$，则固定系数 $\\sin^2(\\pi x)>0$；分子分母同除以 $n$ 后，常数项趋于零，极限为 $x(1-x)$。' },
      { title: '方法二 · 一次式系数比', content: '令 $s=\\sin^2(\\pi x)$。当 $s=0$ 时直接代入得 $x^2$；当 $s>0$ 时，原式是关于 $n$ 的两个一次式之比，其极限等于一次项系数之比 $x(1-x)s/s=x(1-x)$。' }
    ]
  }),
  lectureOne({
    role: 'example', number: '1.27', page: 'PDF 62-63 · 书页 57-58', fingerprint: 'limit:recover-function-asymptotic',
    title: '例 1.27 · 从已知极限反推函数渐近式',
    statement: `已知

$$\\lim_{x\\to0}\\frac{\\tan2x+xf(x)}{\\sin x^3}=0,$$

求 $\\displaystyle\\lim_{x\\to0}\\frac{2+f(x)}{x^2}$。`,
    tags: ['渐近展开', '脱帽法', '选择题'],
    coreMethod: '把原商记作无穷小，解出 $f(x)$，或者直接展开 $\\tan2x$ 到三阶。',
    mistakes: '误把 $\\sin x^3$ 写成 $(\\sin x)^3$；这里是 $\\sin(x^3)\\sim x^3$。',
    answerText: '正确选项为 D，极限为 $-\\frac83$。',
    questionFormat: 'single-choice',
    options: ['$\\frac{13}{9}$', '$4$', '$\\frac{10}{3}$', '$-\\frac83$'],
    correctOptionIds: ['D'],
    solutionMethods: [
      { title: '方法一 · 脱帽法', content: '设原商为 $\\alpha(x)\\to0$，则 $f(x)=[\\alpha(x)\\sin x^3-\\tan2x]/x$。代入所求式并通分，$\\alpha$ 项趋零，而 $(2x-\\tan2x)/x^3\\to-8/3$。' },
      { title: '方法二 · Taylor 展开', content: '$\\tan2x=2x+(2x)^3/3+o(x^3)$，而题设分子为 $o(x^3)$，故 $xf(x)=-2x-8x^3/3+o(x^3)$，即 $f(x)=-2-8x^2/3+o(x^2)$。' }
    ]
  }),
  lectureOne({
    role: 'example', number: '1.28', page: 'PDF 63-64 · 书页 58-59', fingerprint: 'zero-times-infinity:log-product',
    title: '例 1.28 · 对数乘积的零乘无穷型',
    statement: '求 $\\displaystyle\\lim_{x\\to1^-}\\ln x\\,\\ln(1-x)$。',
    tags: ['未定式', '对数极限'],
    coreMethod: '令 $t=1-x\\to0^+$，利用 $\\ln(1-t)\\sim-t$，化为 $t\\ln t$。',
    mistakes: '把 $0\\cdot\\infty$ 直接判为零；必须先比较趋零与发散的速度。',
    answerText: '极限为 $0$。',
    solutionMethods: [
      { title: '方法一 · 换元等价', content: '令 $t=1-x\\to0^+$，则 $\\ln x=\\ln(1-t)\\sim-t$，故原式等价于 $-t\\ln t$；而 $t^\\alpha\\ln t\\to0$ 对任意 $\\alpha>0$ 成立。' },
      { title: '方法二 · 洛必达法则', content: '写成 $\\ln(1-x)/[1/\\ln x]$，求导后化简；或直接研究 $\\ln t/(1/t)$，一次洛必达得到 $-t\\to0$，再结合 $\\ln(1-t)\\sim-t$。' }
    ]
  }),
  lectureOne({
    role: 'example', number: '1.29', page: 'PDF 64 · 书页 59', fingerprint: 'squeeze:floor-near-infinity',
    title: '例 1.29 · 夹逼取整函数极限',
    statement: '求 $\\displaystyle\\lim_{x\\to0}x\\left[\\frac{10}{x}\\right]$，其中 $[\\,\\cdot\\,]$ 为取整符号。',
    tags: ['夹逼准则', '取整函数'],
    coreMethod: '从 $u-1<[u]\\le u$ 出发，并因 $x$ 的正负分别处理不等号方向。',
    mistakes: '直接声称 $[10/x]\\sim10/x$ 而不检查 $x<0$ 时乘不等式会反向。',
    answerText: '极限为 $10$。',
    solutionMethods: [
      { title: '方法一 · 双侧夹逼', content: '由 $10/x-1<[10/x]\\le10/x$。当 $x>0$ 时得 $10-x<x[10/x]\\le10$；当 $x<0$ 时得 $10-x>x[10/x]\\ge10$。两侧都夹到 $10$。' },
      { title: '方法二 · 误差项', content: '写成 $[10/x]=10/x-\\theta(x)$，其中 $0\\le\\theta(x)<1$。于是 $x[10/x]=10-x\\theta(x)$，而 $|x\\theta(x)|\\le|x|\\to0$。' }
    ]
  }),
  lectureOne({
    role: 'example', number: '1.30', page: 'PDF 65 · 书页 60', fingerprint: 'infinity-minus-infinity:common-denominator-log',
    title: '例 1.30 · 对数倒数差的无穷减无穷',
    statement: '求 $\\displaystyle\\lim_{x\\to0}\\left[\\frac1{\\ln(1+x)}-\\frac1x\\right]$。',
    tags: ['未定式', '通分', '洛必达法则'],
    coreMethod: '先通分把 $\\infty-\\infty$ 化为 $0/0$，再使用洛必达或 Taylor。',
    mistakes: '对两个发散项分别取极限再相减；无穷大之间不能这样运算。',
    answerText: '极限为 $\\frac12$。',
    solutionMethods: [
      { title: '方法一 · 通分洛必达', content: '原式为 $[x-\\ln(1+x)]/[x\\ln(1+x)]$。上下同时求导并继续化简，得到 $\\lim 1/[2(1+x)]=1/2$。' },
      { title: '方法二 · Taylor 展开', content: '$\\ln(1+x)=x-x^2/2+o(x^2)$，所以分子为 $x^2/2+o(x^2)$，分母为 $x^2+o(x^2)$，比值趋于 $1/2$。' }
    ]
  }),
  lectureOne({
    role: 'example', number: '1.31', page: 'PDF 66 · 书页 61', fingerprint: 'infinity-minus-infinity:reciprocal-exponential',
    title: '例 1.31 · 指数型无穷减无穷的倒代换',
    statement: '求 $\\displaystyle\\lim_{x\\to\\infty}\\left[x^2\\left(e^{1/x}-1\\right)-x\\right]$。',
    tags: ['未定式', '倒代换', '指数函数'],
    coreMethod: '提出 $x$ 后令 $u=1/x$，把无穷远问题变成零点处的二阶指数余项。',
    mistakes: '只用 $e^{1/x}-1\\sim1/x$ 会得到主项抵消，却无法决定余下常数。',
    answerText: '极限为 $\\frac12$。',
    solutionMethods: [
      { title: '方法一 · 倒代换', content: '原式为 $x[x(e^{1/x}-1)-1]$。令 $u=1/x\\to0^+$，化为 $[e^u-1-u]/u^2\\to1/2$。' },
      { title: '方法二 · Taylor 展开', content: '$e^{1/x}=1+1/x+1/(2x^2)+o(x^{-2})$，乘以 $x^2$ 后为 $x+1/2+o(1)$，再减 $x$ 得 $1/2$。' }
    ]
  }),
  lectureOne({
    role: 'example', number: '1.32', page: 'PDF 66-67 · 书页 61-62', fingerprint: 'power-indeterminate:infinity-zero-log',
    title: '例 1.32 · 无穷大底数的零次幂极限',
    statement: '求 $\\displaystyle\\lim_{x\\to\\infty}\\left(x+\\sqrt{1+x^2}\\right)^{1/x}$。',
    tags: ['幂指函数', '对数化'],
    coreMethod: '设极限为 $e^L$，转而计算 $L=\\lim\\ln(x+\\sqrt{1+x^2})/x$。',
    mistakes: '把“底数趋于无穷、指数趋于零”直接写成 $1$；必须先证明对数乘积趋零。',
    answerText: '极限为 $1$。',
    solutionMethods: [
      { title: '方法一 · 对数洛必达', content: '取对数得 $L=\\lim \\ln(x+\\sqrt{1+x^2})/x$。求导后分子导数为 $1/\\sqrt{1+x^2}$，故 $L=0$，原极限为 $e^0=1$。' },
      { title: '方法二 · 增长阶估计', content: '$x+\\sqrt{1+x^2}\\sim2x$，故其对数等价于 $\\ln(2x)$；而 $\\ln(2x)/x\\to0$，所以对数极限为零。' }
    ]
  }),
  lectureOne({
    role: 'example', number: '1.33', page: 'PDF 67 · 书页 62', fingerprint: 'one-power-infinity:weighted-exponentials',
    title: '例 1.33 · 指数平均的幂指极限',
    statement: '求 $\\displaystyle\\lim_{x\\to0}\\left(\\frac{e^x+e^{2x}+e^{3x}}3\\right)^{e/x}$。',
    tags: ['幂指函数', '第一重要极限'],
    coreMethod: '使用 $u^v=\\exp(v\\ln u)$，只需提取底数减一的一阶系数。',
    mistakes: '只看到底数趋于 $1$ 就写成 $1$；指数 $e/x$ 同时发散，必须计算二者乘积。',
    answerText: '极限为 $e^{2e}$。',
    solutionMethods: [
      { title: '方法一 · 指数化', content: '底数减一为 $[e^x-1+e^{2x}-1+e^{3x}-1]/3\\sim2x$，且 $\\ln(1+u)\\sim u$，故对数极限为 $(e/x)\\cdot2x=2e$。' },
      { title: '方法二 · Taylor 展开', content: '三个指数的一阶系数平均为 $(1+2+3)/3=2$，故底数 $=1+2x+o(x)$；于是 $(1+2x+o(x))^{e/x}\\to e^{2e}$。' }
    ]
  }),
  lectureOne({
    role: 'example', number: '1.34', page: 'PDF 67-68 · 书页 62-63', fingerprint: 'higher-order-infinitesimal:coefficient-matching-exp',
    title: '例 1.34 · 高阶无穷小锁定指数展开系数',
    statement: '当 $x\\to0$ 时，$e^x-(ax^2+bx+1)$ 是比 $x^2$ 高阶的无穷小，求 $a,b$。',
    tags: ['高阶无穷小', '系数匹配', '选择题'],
    coreMethod: '将差除以 $x^2$ 并要求极限为零，匹配常数项、一次项和二次项。',
    mistakes: '只令二次项系数相等而遗漏一次项；若 $b\\ne1$，除以 $x^2$ 后会出现发散项。',
    answerText: '正确选项为 A：$a=\\frac12,b=1$。',
    questionFormat: 'single-choice',
    options: ['$a=\\frac12,b=1$', '$a=1,b=1$', '$a=-\\frac12,b=-1$', '$a=-1,b=1$'],
    correctOptionIds: ['A'],
    solutionMethods: [
      { title: '方法一 · Taylor 配系数', content: '$e^x=1+x+x^2/2+o(x^2)$，相减得 $(1-b)x+(1/2-a)x^2+o(x^2)$。要比 $x^2$ 高阶，前两系数都必须为零。' },
      { title: '方法二 · 连续洛必达', content: '由差除以 $x^2$ 趋零。若 $b\\ne1$，一次洛必达后的分子在零点非零而分母趋零，矛盾，故 $b=1$；再次洛必达得 $1/2-a=0$。' }
    ]
  }),
  lectureOne({
    role: 'example', number: '1.35', page: 'PDF 68-69 · 书页 63-64', fingerprint: 'taylor-product:sin-over-quadratic',
    title: '例 1.35 · 三次 Taylor 多项式的乘积展开',
    statement: `函数

$$f(x)=\\frac{\\sin x}{1+x^2}$$

在 $x=0$ 处的三次 Taylor 多项式为 $ax+bx^2+cx^3$，求 $a,b,c$。`,
    tags: ['Taylor多项式', '幂级数', '选择题'],
    coreMethod: '分别展开 $\\sin x$ 与 $(1+x^2)^{-1}$，再保留到三次项相乘。',
    mistakes: '只展开分子；分母倒数中的 $-x^2$ 与分子的一次项会共同贡献三次项。',
    answerText: '正确选项为 A：$a=1,b=0,c=-\\frac76$。',
    questionFormat: 'single-choice',
    options: ['$a=1,b=0,c=-\\frac76$', '$a=1,b=0,c=\\frac76$', '$a=-1,b=-1,c=-\\frac76$', '$a=-1,b=-1,c=\\frac76$'],
    correctOptionIds: ['A'],
    solutionMethods: [
      { title: '方法一 · 级数乘法', content: '用 $\\sin x=x-x^3/6+o(x^3)$ 与 $(1+x^2)^{-1}=1-x^2+o(x^3)$ 相乘，得 $x-(1+1/6)x^3+o(x^3)=x-7x^3/6+o(x^3)$。' },
      { title: '方法二 · 奇偶性复核', content: '$f$ 是奇函数，所以二次系数必为 $0$；再由 $a=\\lim f(x)/x=1$，并计算 $c=\\lim[f(x)-x]/x^3=-7/6$。' }
    ]
  }),
  lectureOne({
    role: 'example', number: '1.36', page: 'PDF 72 · 书页 67', fingerprint: 'continuity:power-limit-fill-value',
    title: '例 1.36 · 幂指函数补点连续',
    statement: `已知

$$f(x)=\\begin{cases}(\\cos x)^{x^{-2}},&x\\ne0,\\\\a,&x=0,\\end{cases}$$

在 $x=0$ 处连续，求 $a$。`,
    tags: ['连续性', '幂指函数'],
    coreMethod: '连续要求 $a=\\lim_{x\\to0}f(x)$，再把幂指极限对数化。',
    mistakes: '误用 $\\cos x\\to1$ 得出极限为 $1$，忽略指数 $x^{-2}$ 同时发散。',
    answerText: '$a=e^{-1/2}$。',
    solutionMethods: [
      { title: '方法一 · 对数等价', content: '设极限为 $e^L$，则 $L=\\lim \\ln(\\cos x)/x^2$。由 $\\ln(1+u)\\sim u$ 与 $\\cos x-1\\sim-x^2/2$，得 $L=-1/2$。' },
      { title: '方法二 · 标准幂指公式', content: '写成 $[(\\cos x-1)+1]^{1/x^2}$，应用 $(1+u)^{v}\\to e^{\\lim uv}$；这里 $(\\cos x-1)/x^2\\to-1/2$，故极限为 $e^{-1/2}$。' }
    ]
  }),
  lectureOne({
    role: 'exercise', number: '1.6', page: 'PDF 74、76 · 书页 69、71', fingerprint: 'iteration:mobius-composition',
    title: '习题 1.6 · 分式函数的迭代通项',
    statement: `设 $f(x)=x/(1+x)$，$x\\in[0,1]$，定义

$$f_1(x)=f(x),\\qquad f_n(x)=f[f_{n-1}(x)]\\quad(n\\ge2).$$

求 $f_n(x)$。`,
    tags: ['函数迭代', '数学归纳法'],
    coreMethod: '先算前两三项观察分母系数，再用复合公式完成归纳。',
    mistakes: '把 $f_n$ 误认为 $[f(x)]^n$；下标表示复合次数，不是幂。',
    answerText: '$\\displaystyle f_n(x)=\\frac{x}{1+nx}$。',
    solutionMethods: [
      { title: '方法一 · 归纳递推', content: '$f_1=x/(1+x)$，若 $f_k=x/(1+kx)$，则 $f_{k+1}=f_k/(1+f_k)=x/[1+(k+1)x]$，由归纳法成立。' },
      { title: '方法二 · 倒数线性化', content: '令 $u_n=1/f_n$，由 $f_{n+1}=f_n/(1+f_n)$ 得 $u_{n+1}=u_n+1$。又 $u_1=1/x+1$，故 $u_n=1/x+n$，倒回即得。' }
    ]
  }),
  lectureOne({
    role: 'exercise', number: '1.7', page: 'PDF 74、76 · 书页 69、71', fingerprint: 'equivalent-infinitesimal:nested-cosine-root',
    title: '习题 1.7 · 根式与复合余弦的等价无穷小',
    statement: '求 $\\displaystyle\\lim_{x\\to0^+}\\frac{1-\\sqrt{\\cos x}}{x(1-\\cos\\sqrt{x})}$。',
    tags: ['等价无穷小', '有理化'],
    coreMethod: '分子有理化，分母把复合变量 $\\sqrt{x}$ 整体代入 $1-\\cos u\\sim u^2/2$。',
    mistakes: '把 $1-\\cos\\sqrt{x}$ 误写成 $x^2/2$；正确阶数是 $x/2$。',
    answerText: '极限为 $\\frac12$。',
    solutionMethods: [
      { title: '方法一 · 等价链', content: '$1-\\sqrt{\\cos x}=(1-\\cos x)/(1+\\sqrt{\\cos x})\\sim x^2/4$，而 $x(1-\\cos\\sqrt{x})\\sim x\\cdot x/2=x^2/2$，比值为 $1/2$。' },
      { title: '方法二 · 分块标准化', content: '把原式拆为 $[(1-\\sqrt{\\cos x})/(1-\\cos x)]\\cdot[(1-\\cos x)/x^2]\\cdot[x/(1-\\cos\\sqrt{x})]$，三因子依次趋于 $1/2,1/2,2$。' }
    ]
  }),
  lectureOne({
    role: 'exercise', number: '1.9', page: 'PDF 74、77 · 书页 69、72', fingerprint: 'infinity:base-power-difference',
    title: '习题 1.9 · 两个幂函数根式之差',
    statement: '已知 $a>0,b>0$，求 $\\displaystyle\\lim_{x\\to\\infty}x\\left(a^{1/x}-b^{1/x}\\right)$。',
    tags: ['无穷远极限', '倒代换', '指数函数'],
    coreMethod: '令 $t=1/x\\to0^+$，把问题化为两个指数函数在零点的导数差。',
    mistakes: '把 $a^{1/x}$ 与 $b^{1/x}$ 都替换成 $1$ 后直接相减，丢失决定结果的一阶项。',
    answerText: '极限为 $\\ln(a/b)$。',
    solutionMethods: [
      { title: '方法一 · 倒代换', content: '令 $t=1/x$，原式为 $(a^t-b^t)/t$。加减 $1$ 后分别使用 $(c^t-1)/t\\to\\ln c$，得 $\\ln a-\\ln b$。' },
      { title: '方法二 · 指数展开', content: '$a^{1/x}=e^{(\\ln a)/x}=1+(\\ln a)/x+o(1/x)$，$b^{1/x}$ 同理，相减乘 $x$ 后得到 $\\ln a-\\ln b$。' }
    ]
  }),
  lectureOne({
    role: 'exercise', number: '1.10', page: 'PDF 74、77 · 书页 69、72', fingerprint: 'continuity:piecewise-parameter-trig-exp',
    title: '习题 1.10 · 分段函数连续参数',
    statement: `设

$$f(x)=\\begin{cases}\\dfrac{1-e^{\\tan x}}{\\arcsin(x/2)},&x>0,\\\\ae^{2x},&x\\le0,\\end{cases}$$

且 $f$ 在 $x=0$ 处连续，求 $a$。`,
    tags: ['分段函数', '连续性', '参数'],
    coreMethod: '连续要求右极限等于左支在零点的函数值 $a$。',
    mistakes: '漏掉分子前的负号；$1-e^{\\tan x}\\sim-\\tan x$。',
    answerText: '$a=-2$。',
    solutionMethods: [
      { title: '方法一 · 等价无穷小', content: '当 $x\\to0^+$，$1-e^{\\tan x}\\sim-\\tan x\\sim-x$，而 $\\arcsin(x/2)\\sim x/2$，故右极限为 $-2$。连续性给出 $a=f(0)=-2$。' },
      { title: '方法二 · 洛必达法则', content: '右极限是 $0/0$ 型，求导后在零点代入：分子导数为 $-e^{\\tan x}\\sec^2x\\to-1$，分母导数趋于 $1/2$，商为 $-2$。' }
    ]
  }),
  lectureOne({
    role: 'exercise', number: '1.11', page: 'PDF 74、77-78 · 书页 69、72-73', fingerprint: 'graph:arcsin-sine-triangle-wave',
    title: '习题 1.11 · 画出反正弦复合正弦的图像',
    statement: '画出 $f(x)=\\arcsin(\\sin x)$ 的图像，并给出分段表达式。',
    tags: ['复合函数图像', '反三角函数', '周期函数'],
    coreMethod: '利用反正弦主值区间 $[-\\pi/2,\\pi/2]$，按每个半周期把正弦值折回主值区间。',
    mistakes: '误认为 $\\arcsin(\\sin x)=x$ 对所有实数成立；该恒等只在主值区间成立。',
    answerText: `对任意 $k\\in\\mathbb Z$，

$$f(x)=\\begin{cases}x-2k\\pi,&x\\in[-\\pi/2+2k\\pi,\\pi/2+2k\\pi],\\\\(2k+1)\\pi-x,&x\\in[\\pi/2+2k\\pi,3\\pi/2+2k\\pi].\\end{cases}$$`,
    solutionMethods: [
      { title: '方法一 · 主值分段', content: '在 $[-\\pi/2,\\pi/2]$ 上直接等于 $x$；在 $[\\pi/2,3\\pi/2]$ 上用 $\\sin x=\\sin(\\pi-x)$ 得 $\\pi-x$，再按 $2\\pi$ 周期平移。' },
      { title: '方法二 · 几何折叠', content: '把直线 $y=x$ 限制在反正弦值域后，每到 $\\pm\\pi/2$ 就关于水平端点折返，得到值域为 $[-\\pi/2,\\pi/2]$、周期为 $2\\pi$ 的三角波。' }
    ]
  }),
  lectureOne({
    role: 'exercise', number: '1.12', page: 'PDF 75、78 · 书页 70、73', fingerprint: 'limit:difference-cancellation-exp',
    title: '习题 1.12 · 指数商与倒数差的消去',
    statement: '求 $\\displaystyle\\lim_{x\\to0}\\left(\\frac{e^x+xe^x}{e^x-1}-\\frac1x\\right)$。',
    tags: ['极限计算', '通分', '指数函数'],
    coreMethod: '先通分成一个整体，避免分别处理两个发散项。',
    mistakes: '把极限拆成两个无穷大的差；只有通分后才能看见主项抵消。',
    answerText: '极限为 $\\frac32$。',
    solutionMethods: [
      { title: '方法一 · 通分洛必达', content: '通分得 $[xe^x(1+x)+1-e^x]/[x(e^x-1)]$，上下均为二阶小量。连续两次求导或逐次化简，极限为 $3/2$。' },
      { title: '方法二 · Taylor 展开', content: '$e^x=1+x+x^2/2+o(x^2)$。通分后的分子为 $3x^2/2+o(x^2)$，分母为 $x^2+o(x^2)$，故比值趋于 $3/2$。' }
    ]
  }),
  lectureOne({
    role: 'exercise', number: '1.13', page: 'PDF 75、78-79 · 书页 70、73-74', fingerprint: 'power-mean:geometric-product-limit',
    title: '习题 1.13 · 幂平均极限还原几何乘积',
    statement: `设 $a_i>0$，求

$$\\lim_{x\\to0}\\left(\\frac{a_1^x+a_2^x+\\cdots+a_n^x}{n}\\right)^{n/x}.$$
`,
    tags: ['幂指函数', '对数化', '参数'],
    coreMethod: '对数化后提取平均底数减一的一阶项，系数是 $\\frac1n\\sum\\ln a_i$。',
    mistakes: '把“幂的平均”误当成“平均的幂”；指数 $n/x$ 会把一阶微小偏差放大为有限常数。',
    answerText: '极限为 $a_1a_2\\cdots a_n$。',
    solutionMethods: [
      { title: '方法一 · 对数洛必达', content: '取对数后为 $\\frac n x\\ln[(\\sum a_i^x)/n]$。分子分母同趋零，求导并令 $x=0$，得到 $\\sum_{i=1}^n\\ln a_i$，再取指数即为乘积。' },
      { title: '方法二 · 一阶展开', content: '$a_i^x=1+x\\ln a_i+o(x)$，故括号内为 $1+\\frac{x}{n}\\sum\\ln a_i+o(x)$；使用第一重要极限得到 $\\exp(\\sum\\ln a_i)$。' }
    ]
  }),
  lectureOne({
    role: 'exercise', number: '1.16', page: 'PDF 75、80 · 书页 70、75', fingerprint: 'fifth-order-infinitesimal:trig-coefficients',
    title: '习题 1.16 · 五阶无穷小的三角系数匹配',
    statement: '求常数 $a,b$，使 $f(x)=x-(a+b\\cos x)\\sin x$ 在 $x\\to0$ 时是 $x$ 的五阶无穷小。',
    tags: ['高阶无穷小', 'Taylor公式', '系数匹配'],
    coreMethod: '先用积化和差把 $(a+b\\cos x)\\sin x$ 化成 $a\\sin x+\\frac b2\\sin2x$，再展开到五阶。',
    mistakes: '只消去一次项而未消去三次项；“五阶无穷小”还要求五次项系数非零。',
    answerText: '$a=\\frac43,b=-\\frac13$，此时五次项系数非零。',
    solutionMethods: [
      { title: '方法一 · 积化和差展开', content: '写成 $f=x-a\\sin x-(b/2)\\sin2x$。展开得一次项系数 $1-a-b$，三次项系数 $a/6+2b/3$；令二者为零，解得 $a=4/3,b=-1/3$，五次项系数不为零。' },
      { title: '方法二 · 导数条件复核', content: '五阶无穷小要求 $f^{(k)}(0)=0$ 对 $k=0,1,2,3,4$ 成立且 $f^{(5)}(0)\\ne0$。奇函数使偶阶自动为零，解 $f\\prime(0)=0$ 与 $f^{(3)}(0)=0$ 得同一组参数。' }
    ]
  })
]
