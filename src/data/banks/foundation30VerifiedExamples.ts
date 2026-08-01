import type { SeedInput } from './types'

const SOURCE = '何耀焜私人整理 · 张宇《基础30讲》高数 · 逐页核验原例题重排'

type VerifiedExample = Omit<SeedInput, 'id' | 'kind' | 'source' | 'tags' | 'methodFingerprint'> & {
  number: string
  page: string
  tags: string[]
  fingerprint: string
}

function verifiedExample(input: VerifiedExample): SeedInput {
  return {
    ...input,
    id: `zy30-verified-l01-example-${input.number.replace('.', '-')}`,
    kind: 'problem',
    source: SOURCE,
    tags: ['高等数学', '第1讲', '经典例题', 'PDF逐页核验', ...input.tags],
    methodFingerprint: `zy30-verified:l01:${input.fingerprint}`
  }
}

export const foundation30VerifiedExampleSeeds: SeedInput[] = [
  verifiedExample({
    number: '1.1', page: 'PDF 8 · 书页 3', fingerprint: 'functional-equation:symmetric-substitution',
    title: '例 1.1 · 对应法则求函数表达式',
    statement: `设

$$f\\left(x+\\frac1x\\right)=\\frac{x+x^3}{1+x^4}.$$

求当 $x\\ge2$ 时 $f(x)$ 的表达式。`,
    tags: ['函数关系', '对应法则', '整体代换'],
    coreMethod: '把复合自变量作为整体，并将右端同步改写为这个整体的有理式。',
    mistakes: '直接把外层自变量与原式中的参数混为一谈；没有先把右端除以 $x^2$，因而看不出 $x+1/x$。',
    answerText: `$$f(x)=\\frac{x}{x^2-2},\\qquad x\\ge2.$$`,
    solutionMethods: [
      { title: '方法一 · 整体对应', content: `令 $t=x+1/x$。原式右端分子、分母同除以 $x^2$，得

$$\\frac{x+x^3}{1+x^4}=\\frac{x+1/x}{(x+1/x)^2-2}=\\frac{t}{t^2-2}.$$

因此 $f(t)=t/(t^2-2)$。把字母 $t$ 换回 $x$，即得所求表达式。` },
      { title: '方法二 · 代回复核', content: `设 $F(u)=u/(u^2-2)$，则

$$F\\left(x+\\frac1x\\right)=\\frac{x+1/x}{x^2+x^{-2}}=\\frac{x+x^3}{1+x^4}.$$

代回后与题设完全一致，确认对应法则正确。` }
    ]
  }),
  verifiedExample({
    number: '1.2', page: 'PDF 9 · 书页 4', fingerprint: 'functional-equation:reciprocal-system-elimination',
    title: '例 1.2 · 倒数代换联立函数方程',
    statement: `设函数 $f(x)$ 的定义域为 $(0,+\\infty)$，且

$$2f(x)+x^2f\\left(\\frac1x\\right)=\\frac{x^2+2x}{\\sqrt{1+x^2}}.$$

求 $f(x)$。`,
    tags: ['函数方程', '倒数代换', '联立消元'],
    coreMethod: '利用定义域对倒数封闭，把 $x$ 换成 $1/x$ 得到第二个方程，再联立消元。',
    mistakes: '换元后漏改 $x^2$ 和根式；或没有利用 $x>0$ 化简 $\\sqrt{1+1/x^2}$。',
    answerText: `$$f(x)=\\frac{x}{\\sqrt{1+x^2}},\\qquad x>0.$$`,
    solutionMethods: [
      { title: '方法一 · 联立消元', content: `原式记为式 (1)。把 $x$ 换成 $1/x$，并利用 $x>0$ 化简，得到

$$2f\\left(\\frac1x\\right)+\\frac1{x^2}f(x)=\\frac{1+2x}{x\\sqrt{1+x^2}}.$$

两边乘 $x^2$ 得式 (2)。用式 (1) 的两倍减式 (2)，可得

$$3f(x)=\\frac{3x}{\\sqrt{1+x^2}},$$

故 $f(x)=x/\\sqrt{1+x^2}$。` },
      { title: '方法二 · 代入闭环', content: `把 $f(x)=x/\\sqrt{1+x^2}$ 代入左端。由于

$$f(1/x)=\\frac{1}{\\sqrt{1+x^2}},$$

所以左端为 $(2x+x^2)/\\sqrt{1+x^2}$，与右端相同，且定义域满足 $x>0$。` }
    ]
  }),
  verifiedExample({
    number: '1.3', page: 'PDF 10-11 · 书页 5-6', fingerprint: 'inverse-function:hyperbolic-log-rationalization',
    title: '例 1.3 · 对数型函数的反函数',
    statement: `求函数

$$y=f(x)=\\ln\\left(x+\\sqrt{x^2+1}\\right)$$

的反函数表达式及其定义域。`,
    tags: ['反函数', '对数函数', '有理化'],
    coreMethod: '先利用有理化写出 $e^{-y}$，再与 $e^y$ 作差消去根式。',
    mistakes: '直接从 $e^y=x+\\sqrt{x^2+1}$ 平方，造成不必要的繁算；或漏掉原函数值域为 $\\mathbb R$。',
    answerText: `$$f^{-1}(x)=\\frac{e^x-e^{-x}}2,\\qquad x\\in\\mathbb R.$$`,
    solutionMethods: [
      { title: '方法一 · 共轭有理化', content: `由

$$e^y=x+\\sqrt{x^2+1}$$

以及 $(\\sqrt{x^2+1}+x)(\\sqrt{x^2+1}-x)=1$，得到

$$e^{-y}=\\sqrt{x^2+1}-x.$$

两式相减即得 $x=(e^y-e^{-y})/2$。交换 $x,y$ 的位置，便得到反函数。` },
      { title: '方法二 · 单调与值域复核', content: `原函数导数为 $1/\\sqrt{x^2+1}>0$，所以在 $\\mathbb R$ 上严格增加。又当 $x\\to\\pm\\infty$ 时函数值分别趋于 $\\pm\\infty$，故值域为 $\\mathbb R$，这正是反函数的定义域。` }
    ]
  }),
  verifiedExample({
    number: '1.4', page: 'PDF 12 · 书页 7', fingerprint: 'composite-function:nonnegative-square-root-range',
    title: '例 1.4 · 由复合函数反求内函数',
    statement: `设 $f(x)=x^2$，且

$$f[\\varphi(x)]=-x^2+2x+3,\\qquad \\varphi(x)\\ge0.$$

求 $\\varphi(x)$ 及其定义域和值域。`,
    tags: ['复合函数', '定义域', '值域'],
    coreMethod: '由外函数是平方得到内函数的平方，再用非负条件选定算术平方根。',
    mistakes: '写出 $\\pm\\sqrt{-x^2+2x+3}$ 而忽略 $\\varphi(x)\\ge0$；或只求根式定义域，没有求值域。',
    answerText: `$$\\varphi(x)=\\sqrt{4-(x-1)^2},\\quad D_{\\varphi}=[-1,3],\\quad R_{\\varphi}=[0,2].$$`,
    solutionMethods: [
      { title: '方法一 · 根式与配方', content: `由 $f[\\varphi(x)]=\\varphi^2(x)$，得

$$\\varphi^2(x)=-x^2+2x+3=4-(x-1)^2.$$

结合 $\\varphi(x)\\ge0$，有 $\\varphi(x)=\\sqrt{4-(x-1)^2}$。根式非负给出 $x\\in[-1,3]$，而被开方数从 $0$ 到 $4$，故值域为 $[0,2]$。` },
      { title: '方法二 · 半圆图像复核', content: `方程 $y=\\sqrt{4-(x-1)^2}$ 等价于 $(x-1)^2+y^2=4$ 且 $y\\ge0$，图像是圆心 $(1,0)$、半径 $2$ 的上半圆。因此横坐标范围为 $[-1,3]$，纵坐标范围为 $[0,2]$。` }
    ]
  }),
  verifiedExample({
    number: '1.5', page: 'PDF 13 · 书页 8', fingerprint: 'piecewise-composite:sign-of-inner-function',
    title: '例 1.5 · 分段函数的复合',
    statement: `设

$$g(x)=\\begin{cases}2-x,&x\\le0,\\\\2+x,&x>0,\\end{cases}\\qquad
f(x)=\\begin{cases}x^2,&x<0,\\\\-x-1,&x\\ge0.\\end{cases}$$

求 $g[f(x)]$。`,
    tags: ['分段函数', '复合函数', '符号判断'],
    coreMethod: '外层分段要根据 $f(x)$ 的正负选择，因此先在 $x$ 的各区间判断内函数符号。',
    mistakes: '直接按 $x$ 的正负套用 $g$ 的分段，而没有判断真正进入 $g$ 的自变量 $f(x)$。',
    answerText: `$$g[f(x)]=\\begin{cases}2+x^2,&x<0,\\\\3+x,&x\\ge0.\\end{cases}$$`,
    solutionMethods: [
      { title: '方法一 · 内层符号分区', content: `当 $x<0$ 时，$f(x)=x^2>0$，应使用 $g(u)=2+u$，故 $g[f(x)]=2+x^2$。当 $x\\ge0$ 时，$f(x)=-x-1<0$，应使用 $g(u)=2-u$，故 $g[f(x)]=2-(-x-1)=3+x$。` },
      { title: '方法二 · 绝对值统一', content: `注意 $g(u)=2+|u|$。于是

$$g[f(x)]=2+|f(x)|.$$

对 $x<0$，$|f(x)|=x^2$；对 $x\\ge0$，$|f(x)|=x+1$，从而得到同一分段结果。` }
    ]
  }),
  verifiedExample({
    number: '1.6', page: 'PDF 14-15 · 书页 9-10', fingerprint: 'boundedness:amgm-global-bound',
    title: '例 1.6 · 证明有理函数全局有界',
    statement: `证明函数

$$f(x)=\\frac{x}{1+x^2}$$

在 $(-\\infty,+\\infty)$ 内有界。`,
    tags: ['有界性', '不等式', '证明题'],
    coreMethod: '对绝对值作整体估计，找出与 $x$ 无关的统一上界。',
    mistakes: '只说明 $x\\to\\infty$ 时函数趋于零，却没有控制所有有限点；有界性要求一个全局统一常数。',
    answerText: `对任意 $x\\in\\mathbb R$，均有 $|f(x)|\\le1/2$，故函数在全实数域有界。`,
    solutionMethods: [
      { title: '方法一 · 均值不等式', content: `当 $x\\ne0$ 时，

$$|f(x)|=\\frac{|x|}{1+x^2}=\\frac1{|x|+1/|x|}\\le\\frac12,$$

其中使用了 $|x|+1/|x|\\ge2$。当 $x=0$ 时 $f(0)=0$，所以统一上界 $1/2$ 对所有 $x$ 都成立。` },
      { title: '方法二 · 配方估计', content: `由 $(|x|-1)^2\\ge0$ 得 $1+x^2\\ge2|x|$，因此

$$\\left|\\frac{x}{1+x^2}\\right|\\le\\frac{|x|}{2|x|}=\\frac12$$

对 $x\\ne0$ 成立；零点单独代入即可。等号在 $x=\\pm1$ 处取得。` }
    ]
  }),
  verifiedExample({
    number: '1.7', page: 'PDF 15-16 · 书页 10-11', fingerprint: 'monotonic-transform:reflection-and-negation',
    title: '例 1.7 · 单调函数的图像变换',
    statement: `设 $f(x)$ 在 $(-\\infty,+\\infty)$ 上有定义，且任意 $x_1\\ne x_2$ 均满足

$$ (x_1-x_2)[f(x_1)-f(x_2)]>0.$$

下列函数一定单调增加的是（　）。`,
    tags: ['单调性', '图像变换', '选择题'],
    coreMethod: '题设等价于 $f$ 严格增加；分别追踪自变量反射与函数值取负对单调性的影响。',
    mistakes: '只数负号个数却不区分它出现在自变量还是函数值上；绝对值变换通常会破坏全域单调性。',
    answerText: '正确选项为 D，即 $-f(-x)$ 一定严格单调增加。',
    questionFormat: 'single-choice',
    options: ['$|f(x)|$', '$f(|x|)$', '$|f(-x)|$', '$-f(-x)$'],
    correctOptionIds: ['D'],
    solutionMethods: [
      { title: '方法一 · 代数比较', content: `题设说明 $f$ 严格增加。若 $x_1<x_2$，则 $-x_1>-x_2$，从而 $f(-x_1)>f(-x_2)$。两边取负得到

$$-f(-x_1)<-f(-x_2),$$

所以 $-f(-x)$ 严格增加。` },
      { title: '方法二 · 图像变换', content: `$f(-x)$ 是把 $f(x)$ 关于 $y$ 轴反射，严格增加变成严格减少；再乘 $-1$ 相当于关于 $x$ 轴反射，严格减少重新变成严格增加。其余三个选项含绝对值，均可能折叠图像。` }
    ]
  }),
  verifiedExample({
    number: '1.8', page: 'PDF 18 · 书页 13', fingerprint: 'oddness:additive-functional-equation',
    title: '例 1.8 · 由加法关系证明奇函数',
    statement: `已知对任意 $x,y\\in\\mathbb R$，均有

$$f(x+y)=f(x)+f(y).$$

证明 $f(x)$ 是奇函数。`,
    tags: ['函数方程', '奇偶性', '证明题'],
    coreMethod: '先从特殊值求出 $f(0)$，再令两个自变量互为相反数。',
    mistakes: '直接写 $f(-x)=-f(x)$ 而没有从题设推出；必须先处理 $f(0)$。',
    answerText: `由题设可得 $f(0)=0$ 且 $f(-x)=-f(x)$，因此 $f$ 为奇函数。`,
    solutionMethods: [
      { title: '方法一 · 两次特殊赋值', content: `令 $x=y=0$，则 $f(0)=2f(0)$，故 $f(0)=0$。再令 $y=-x$，有

$$0=f(0)=f(x)+f(-x),$$

所以 $f(-x)=-f(x)$，满足奇函数的判定式。` },
      { title: '方法二 · 直接构造相反数', content: `由加法关系，

$$f(x)+f(-x)=f(x-x)=f(0).$$

而取任意 $u$ 与 $0$，有 $f(u)=f(u)+f(0)$，故 $f(0)=0$。因此上式立即给出 $f(-x)=-f(x)$。` }
    ]
  }),
  verifiedExample({
    number: '1.9', page: 'PDF 19 · 书页 14', fingerprint: 'periodicity:iterate-shift-equation',
    title: '例 1.9 · 递推平移关系证明周期性',
    statement: `设函数 $f(x)$ 在 $\\mathbb R$ 上满足

$$f(x)=f(x-\\pi)+\\sin x.$$

证明 $f(x)$ 是以 $2\\pi$ 为周期的周期函数。`,
    tags: ['周期性', '函数方程', '证明题'],
    coreMethod: '把平移关系连续使用两次，使两个正弦增量恰好抵消。',
    mistakes: '只把 $x$ 换成 $x+2\\pi$ 一次就声称相等；还需要继续展开中间的 $f(x+\\pi)$。',
    answerText: `对任意 $x$，均有 $f(x+2\\pi)=f(x)$，故 $2\\pi$ 是 $f$ 的一个周期。`,
    solutionMethods: [
      { title: '方法一 · 连续平移两次', content: `由题设的等价形式 $f(t)=f(t-\\pi)+\\sin t$，分别取 $t=x+2\\pi$ 与 $t=x+\\pi$，得到

$$f(x+2\\pi)=f(x+\\pi)+\\sin(x+2\\pi),$$
$$f(x+\\pi)=f(x)+\\sin(x+\\pi).$$

相加后两个正弦项为 $\\sin x-\\sin x=0$，所以 $f(x+2\\pi)=f(x)$。` },
      { title: '方法二 · 差分累加', content: `题设给出 $f(x+\\pi)-f(x)=\\sin(x+\\pi)=-\\sin x$。再向前平移一次，有 $f(x+2\\pi)-f(x+\\pi)=\\sin(x+2\\pi)=\\sin x$。两式相加，左端中间项消去，右端和为零。` }
    ]
  }),
  verifiedExample({
    number: '1.10', page: 'PDF 20-21 · 书页 15-16', fingerprint: 'product-maximum:logarithmic-derivative',
    title: '例 1.10 · 多项乘积的最大值点',
    statement: `设 $0<x<1/2$，求函数

$$y=x^6(1-x)^2(1-2x)^4$$

的最大值点。`,
    tags: ['最值', '对数求导', '乘积结构'],
    coreMethod: '乘积、商和幂混合的正函数最值优先取对数，把乘除幂转成线性组合。',
    mistakes: '对原函数直接展开求导，导致计算量失控；或保留不在给定区间内的另一个驻点。',
    answerText: `最大值点为

$$x=\\frac{7-\\sqrt{13}}{12}.$$`,
    solutionMethods: [
      { title: '方法一 · 对数求导', content: `区间内 $y>0$。取对数得

$$\\ln y=6\\ln x+2\\ln(1-x)+4\\ln(1-2x).$$

令对数导数为零：

$$\\frac6x-\\frac2{1-x}-\\frac8{1-2x}=0,$$

化为 $12x^2-14x+3=0$。两根为 $(7\\pm\\sqrt{13})/12$，只有较小根落在 $(0,1/2)$。两端函数趋于零，故该驻点给出最大值。` },
      { title: '方法二 · 单峰性复核', content: `对数导数通分后的分母 $x(1-x)(1-2x)$ 在给定区间内为正，分子的两个零点中只有 $(7-\\sqrt{13})/12$ 位于区间内。分子在该点前为正、点后为负，因此 $y$ 先增后减，最大值点唯一。` }
    ]
  }),
  verifiedExample({
    number: '1.11', page: 'PDF 23 · 书页 18', fingerprint: 'exponential-series:base-conversion',
    title: '例 1.11 · 指数函数幂级数的底数转换',
    statement: `已知

$$e^x=\\sum_{n=0}^{\\infty}\\frac{x^n}{n!},\\qquad x\\in\\mathbb R,$$

则 $2^x$ 等于（　）。`,
    tags: ['指数函数', '幂级数', '选择题'],
    coreMethod: '指数函数 Taylor 级数对任意实数整体变量都收敛；先写成 $2^x=e^{x\\ln2}$，再把整体变量替换为 $x\\ln2$。',
    mistakes: '漏掉 $n=0$ 的常数项；或只给 $x^n$ 乘一个 $\\ln2$，没有把整个 $x\\ln2$ 取 $n$ 次幂。',
    answerText: '正确选项为 B。',
    questionFormat: 'single-choice',
    options: [
      '$\\displaystyle\\sum_{n=1}^{\\infty}\\frac{(x\\ln2)^n}{n!}$',
      '$\\displaystyle\\sum_{n=0}^{\\infty}\\frac{(x\\ln2)^n}{n!}$',
      '$\\displaystyle\\sum_{n=1}^{\\infty}\\frac{(\\ln2)x^n}{n!}$',
      '$\\displaystyle\\sum_{n=0}^{\\infty}\\frac{(\\ln2)x^n}{n!}$'
    ],
    correctOptionIds: ['B'],
    solutionMethods: [
      { title: '方法一 · 整体代换', content: `Taylor 公式 $e^u=\\sum_{n=0}^{\\infty}u^n/n!$ 对任意 $u\\in\\mathbb R$ 都收敛。由 $2^x=e^{x\\ln2}$，令 $u=x\\ln2$，立即得到

$$2^x=\\sum_{n=0}^{\\infty}\\frac{(x\\ln2)^n}{n!}.$$` },
      { title: '方法二 · 前三项复核', content: `在 $x=0$ 时必须有 $2^0=1$，因此级数必须从 $n=0$ 开始，可先排除 A、C。再比较一阶项：$2^x=e^{x\\ln2}=1+x\\ln2+\\cdots$，B 的二阶及更高项也含 $(\\ln2)^n$，而 D 不含，故选择 B。` }
    ]
  }),
  verifiedExample({
    number: '1.12', page: 'PDF 27-28 · 书页 22-23', fingerprint: 'inverse-branches:sine-monotone-intervals',
    title: '例 1.12 · 正弦函数各单调区间的反函数',
    statement: `设 $y=\\sin x$，$0\\le x\\le2\\pi$。求其所有单调区间上的反函数。`,
    tags: ['反函数', '三角函数', '分段函数'],
    coreMethod: '先按正弦函数的单调性把区间切成三段，再在每段使用反正弦主值并校正象限。',
    mistakes: '把 $\\arcsin y$ 当作整个 $[0,2\\pi]$ 上的反函数；反正弦主值只能直接返回 $[-\\pi/2,\\pi/2]$。',
    answerText: `三个单调分支的反函数分别为

$$x=\\begin{cases}
\\arcsin y,&y\\in[0,1],\\\\
\\pi-\\arcsin y,&y\\in[-1,1],\\\\
2\\pi+\\arcsin y,&y\\in[-1,0].
\\end{cases}$$

它们依次对应 $x\\in[0,\\pi/2]$、$x\\in[\\pi/2,3\\pi/2]$、$x\\in[3\\pi/2,2\\pi]$。`,
    solutionMethods: [
      { title: '方法一 · 分象限解方程', content: `第一段 $[0,\\pi/2]$ 上，主值直接给出 $x=\\arcsin y$。第二段 $[\\pi/2,3\\pi/2]$ 上利用 $\\sin(\\pi-t)=\\sin t$，得 $x=\\pi-\\arcsin y$。第三段 $[3\\pi/2,2\\pi]$ 上利用周期性，得 $x=2\\pi+\\arcsin y$。每段的 $y$ 范围分别是 $[0,1]$、$[-1,1]$、$[-1,0]$。` },
      { title: '方法二 · 图像镜像复核', content: `把 $y=\\sin x$ 在三段单调曲线分别关于直线 $y=x$ 镜像。第一段落在反正弦主值支；中间下降支必须关于 $\\pi/2$ 校正为 $\\pi-\\arcsin y$；最后一支位于第四象限对应的周期平移，故为 $2\\pi+\\arcsin y$。` }
    ]
  })
]
