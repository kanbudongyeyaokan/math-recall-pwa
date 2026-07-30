import type { SeedInput } from './types'

type CompanionSeed = Omit<SeedInput, 'id' | 'kind' | 'tags' | 'methodFingerprint'> & {
  id: string
  tags: string[]
  fingerprint: string
}

function companion(input: CompanionSeed): SeedInput {
  return {
    ...input,
    id: 'zy30-verified-l02-companion-' + input.id,
    kind: 'problem',
    tags: ['高等数学', '第2讲', '经典例题', 'PDF逐页核验', ...input.tags],
    methodFingerprint: 'zy30-verified:l02:companion:' + input.fingerprint
  }
}

export const foundation30Lecture2CompanionSeeds: SeedInput[] = [
  companion({
    id: 'wzx-17',
    source: '何耀焜私人整理 · 武忠祥《高数基础篇做题本》',
    page: 'PDF 9 · 书页 P18 · 例 17',
    fingerprint: 'product-limit:standard-e-sine-factor',
    title: '精选 2.24 · 标准指数极限与正弦因子的乘积',
    statement: '求极限\n\n$$\\lim_{n\\to\\infty}\\frac{n^{n+1}}{(n+1)^n}\\sin\\frac1n.$$',
    tags: ['数列极限', '重要极限', '等价无穷小'],
    coreMethod: '拆成 $n\\sin(1/n)$ 与 $[n/(n+1)]^n$，分别识别正弦基本极限和指数型重要极限。',
    mistakes: '把 $n^{n+1}/(n+1)^n$ 看成单独趋于零；提取一个 $n$ 后，其余部分才是标准的 $1^\\infty$ 型。',
    answerText: '极限为 $e^{-1}$。',
    solutionMethods: [
      {
        title: '方法一 · 拆分两个标准极限',
        content: '原式可写成\n\n$$n\\sin\\frac1n\\left(\\frac n{n+1}\\right)^n=n\\sin\\frac1n\\left(1+\\frac1n\\right)^{-n}.$$\n\n其中 $n\\sin(1/n)\\to1$，而 $(1+1/n)^{-n}\\to e^{-1}$，故乘积极限为 $e^{-1}$。'
      },
      {
        title: '方法二 · 整体取对数复核',
        content: '各因子最终为正。记原式为 $A_n$，则\n\n$$\\ln A_n=\\ln\\left(n\\sin\\frac1n\\right)+n\\ln\\left(1-\\frac1{n+1}\\right).$$\n\n第一项趋于 $0$；第二项等于 $\\dfrac{n}{n+1}\\cdot\\dfrac{\\ln(1-t_n)}{t_n}$，其中 $t_n=1/(n+1)$，故趋于 $-1$。于是 $A_n\\to e^{-1}$。'
      }
    ]
  }),
  companion({
    id: 'wzx-18',
    source: '何耀焜私人整理 · 武忠祥《高数基础篇做题本》',
    page: 'PDF 10 · 书页 P19 · 例 18',
    fingerprint: 'one-power:exponential-average-cotangent',
    title: '精选 2.25 · 指数平均底数的幂指极限',
    statement: '求极限\n\n$$\\lim_{x\\to0}\\left(\\frac{1+e^x}{2}\\right)^{\\cot x}.$$',
    tags: ['函数极限', '幂指型极限', 'Taylor公式'],
    coreMethod: '对 $1^\\infty$ 型先取对数，只需找出 $\\ln[(1+e^x)/2]$ 的一阶主项。',
    mistakes: '把底数误写成 $1+x$；底数相对 $1$ 的一阶增量是 $x/2$，这会直接决定最终指数。',
    answerText: '极限为 $e^{1/2}$。',
    solutionMethods: [
      {
        title: '方法一 · 对数化与等价无穷小',
        content: '设原式为 $A(x)$。因为底数在零点附近为正，\n\n$$\\ln A(x)=\\cot x\\,\\ln\\left(1+\\frac{e^x-1}{2}\\right).$$\n\n当 $x\\to0$ 时，$\\cot x\\sim1/x$，$\\ln(1+u)\\sim u$，且 $e^x-1\\sim x$，所以 $\\ln A(x)\\to1/2$，从而 $A(x)\\to e^{1/2}$。'
      },
      {
        title: '方法二 · Taylor 展开复核',
        content: '由 $e^x=1+x+x^2/2+O(x^3)$，有\n\n$$\\frac{1+e^x}{2}=1+\\frac x2+\\frac{x^2}{4}+O(x^3),$$\n\n进而 $\\ln[(1+e^x)/2]=x/2+O(x^2)$。又 $\\cot x=1/x+O(x)$，两者乘积为 $1/2+O(x)$，故原极限为 $e^{1/2}$。'
      }
    ]
  }),
  companion({
    id: 'wzx-19',
    source: '何耀焜私人整理 · 武忠祥《高数基础篇做题本》',
    page: 'PDF 10 · 书页 P19 · 例 19',
    fingerprint: 'one-power:rational-first-order-parameter',
    title: '精选 2.26 · 含参有理底数的无穷次幂',
    statement: '设 $a,b$ 为常数，求\n\n$$\\lim_{x\\to\\infty}\\left[\\frac{x^2}{(x-a)(x+b)}\\right]^x.$$',
    tags: ['函数极限', '幂指型极限', '参数'],
    coreMethod: '把有理底数化为 $1$ 加一阶小量，保留分母展开中的 $b-a$ 项，再使用 $(1+u)^v$ 的对数判定。',
    mistakes: '只比较最高次项得到底数趋于 $1$ 就停止；无穷次幂的值由 $1/x$ 阶修正项决定。',
    answerText: '正确选项为 C：极限为 $e^{a-b}$。',
    questionFormat: 'single-choice',
    options: ['$1$', '$e$', '$e^{a-b}$', '$e^{b-a}$'],
    correctOptionIds: ['C'],
    solutionMethods: [
      {
        title: '方法一 · 提取一阶增量',
        content: '分母为 $x^2+(b-a)x-ab$，故\n\n$$\\frac{x^2}{(x-a)(x+b)}=\\frac1{1+(b-a)/x-ab/x^2}=1+\\frac{a-b}{x}+O(x^{-2}).$$\n\n取对数并乘以 $x$ 得 $x\\ln(\\cdots)\\to a-b$，所以原极限为 $e^{a-b}$，选择 C。'
      },
      {
        title: '方法二 · 标准幂指公式复核',
        content: '令底数为 $1+u_x$，则\n\n$$xu_x=x\\frac{x^2-(x-a)(x+b)}{(x-a)(x+b)}=\\frac{(a-b)x^2+abx}{x^2+(b-a)x-ab}\\to a-b.$$\n\n同时 $u_x\\to0$，由 $(1+u_x)^{1/u_x}\\to e$ 得 $(1+u_x)^x\\to e^{a-b}$。'
      }
    ]
  }),
  companion({
    id: 'wzx-20',
    source: '何耀焜私人整理 · 武忠祥《高数基础篇做题本》',
    page: 'PDF 10 · 书页 P19 · 例 20',
    fingerprint: 'one-power:nth-root-arithmetic-mean-geometric-mean',
    title: '精选 2.27 · n 次根算术平均的指数极限',
    statement: '设 $a>0,b>0,c>0$，求\n\n$$\\lim_{n\\to\\infty}\\left(\\frac{\\sqrt[n]a+\\sqrt[n]b+\\sqrt[n]c}{3}\\right)^n.$$',
    tags: ['数列极限', '幂指型极限', 'Taylor公式'],
    coreMethod: '把每个 $n$ 次根写成 $e^{(\\ln a)/n}$，求出算术平均相对 $1$ 的一阶增量。',
    mistakes: '误把“先算术平均再取 $n$ 次幂”当成几何平均的恒等式；结论来自一阶极限，而不是有限 $n$ 下相等。',
    answerText: '极限为 $(abc)^{1/3}$。',
    solutionMethods: [
      {
        title: '方法一 · 指数展开',
        content: '对任意固定正数 $a$，\n\n$$a^{1/n}=e^{(\\ln a)/n}=1+\\frac{\\ln a}{n}+O(n^{-2}).$$\n\n三项取平均得到\n\n$$1+\\frac{\\ln a+\\ln b+\\ln c}{3n}+O(n^{-2}).$$\n\n其 $n$ 次幂趋于 $\\exp[(\\ln a+\\ln b+\\ln c)/3]=(abc)^{1/3}$。'
      },
      {
        title: '方法二 · 辅助函数求导复核',
        content: '令\n\n$$F(t)=\\ln\\frac{a^t+b^t+c^t}{3}.$$\n\n$F$ 在 $t=0$ 附近可导，$F(0)=0$，且 $F\\prime(0)=(\\ln a+\\ln b+\\ln c)/3$。原式的对数为 $nF(1/n)=F(1/n)/(1/n)\\to F\\prime(0)$，取指数即得结论。'
      }
    ]
  }),
  companion({
    id: 'wzx-44',
    source: '何耀焜私人整理 · 武忠祥《高数基础篇做题本》',
    page: 'PDF 18 · 书页 P32 · 例 44',
    fingerprint: 'riemann-sum:harmonic-window-one-to-two',
    title: '精选 2.28 · 调和窗口和的极限',
    statement: '求极限\n\n$$\\lim_{n\\to\\infty}\\left(\\frac1{n+1}+\\frac1{n+2}+\\cdots+\\frac1{n+n}\\right).$$',
    tags: ['数列极限', '有限和', '黎曼和'],
    coreMethod: '把每项提取 $1/n$，识别为函数 $1/(1+x)$ 在 $[0,1]$ 上的右端点黎曼和。',
    mistakes: '认为每一项都趋于零便断言总和趋于零；这里项数也随 $n$ 增长，必须整体处理。',
    answerText: '极限为 $\\ln2$。',
    solutionMethods: [
      {
        title: '方法一 · 黎曼和',
        content: '原式写成\n\n$$\\frac1n\\sum_{k=1}^n\\frac1{1+k/n}.$$\n\n函数 $f(x)=1/(1+x)$ 在 $[0,1]$ 上连续，因此右端点黎曼和收敛到\n\n$$\\int_0^1\\frac{dx}{1+x}=\\ln2.$$'
      },
      {
        title: '方法二 · 积分夹逼复核',
        content: '$f(x)=1/x$ 在正半轴单调递减。对 $k=n+1,\\ldots,2n$，有\n\n$$\\int_k^{k+1}\\frac{dx}{x}\\le\\frac1k\\le\\int_{k-1}^{k}\\frac{dx}{x}.$$\n\n求和后上下界分别趋于 $\\ln[(2n+1)/(n+1)]$ 与 $\\ln2$，二者都趋于 $\\ln2$，故原极限为 $\\ln2$。'
      }
    ]
  }),
  companion({
    id: 'wzx-45',
    source: '何耀焜私人整理 · 武忠祥《高数基础篇做题本》',
    page: 'PDF 19 · 书页 P32 · 例 45',
    fingerprint: 'equivalent-infinitesimal:rationalize-composite-radicals',
    title: '精选 2.29 · 复合根式差的等价系数',
    statement: '当 $x\\to0$ 时，若\n\n$$\\alpha(x)=kx^2,\\qquad \\beta(x)=\\sqrt{1+x\\arcsin x}-\\sqrt{\\cos x}$$\n\n为等价无穷小，求 $k$。',
    tags: ['函数极限', '等价无穷小', '有理化'],
    coreMethod: '对两个复合根式之差整体有理化，分子主项由 $x\\arcsin x$ 与 $1-\\cos x$ 共同贡献。',
    mistakes: '漏掉 $1-\\cos x\\sim x^2/2$，或把两个根式分别等价替换后直接相减，都会丢失主项。',
    answerText: '$$k=\\frac34.$$',
    solutionMethods: [
      {
        title: '方法一 · 整体有理化',
        content: '有\n\n$$\\frac{\\beta(x)}{x^2}=\\frac{x\\arcsin x+1-\\cos x}{x^2\\left(\\sqrt{1+x\\arcsin x}+\\sqrt{\\cos x}\\right)}.$$\n\n当 $x\\to0$ 时，$x\\arcsin x/x^2\\to1$，$(1-\\cos x)/x^2\\to1/2$，而根式和趋于 $2$，故比值趋于 $(1+1/2)/2=3/4$。'
      },
      {
        title: '方法二 · 二阶展开复核',
        content: '$\\arcsin x=x+O(x^3)$，故\n\n$$\\sqrt{1+x\\arcsin x}=1+\\frac{x^2}{2}+O(x^4).$$\n\n又 $\\cos x=1-x^2/2+O(x^4)$，所以 $\\sqrt{\\cos x}=1-x^2/4+O(x^4)$。两式相减为 $3x^2/4+O(x^4)$，因此 $k=3/4$。'
      }
    ]
  }),
  companion({
    id: 'wzx-46',
    source: '何耀焜私人整理 · 武忠祥《高数基础篇做题本》',
    page: 'PDF 19 · 书页 P33 · 例 46',
    fingerprint: 'order-comparison:two-sided-power-constraints',
    title: '精选 2.30 · 两组高阶无穷小条件锁定整数',
    statement: '当 $x\\to0$ 时，$(1-\\cos x)\\ln(1+x^2)$ 是比 $x\\sin x^n$ 高阶的无穷小，而 $x\\sin x^n$ 是比 $e^{x^2}-1$ 高阶的无穷小。求正整数 $n$。',
    tags: ['函数极限', '无穷小阶', '等价无穷小', '选择题'],
    coreMethod: '分别把三组表达式化成幂函数主阶，再把“前者比后者高阶”翻译成指数严格更大。',
    mistakes: '把“高阶”理解成数值更大；在 $x\\to0$ 时，幂指数越大反而趋零越快、阶越高。',
    answerText: '正确选项为 B：$n=2$。',
    questionFormat: 'single-choice',
    options: ['$1$', '$2$', '$3$', '$4$'],
    correctOptionIds: ['B'],
    solutionMethods: [
      {
        title: '方法一 · 主阶指数比较',
        content: '当 $x\\to0$ 时，\n\n$$(1-\\cos x)\\ln(1+x^2)\\sim\\frac12x^4,\\qquad x\\sin x^n\\sim x^{n+1},\\qquad e^{x^2}-1\\sim x^2.$$\n\n第一条高阶关系要求 $4>n+1$，即 $n<3$；第二条要求 $n+1>2$，即 $n>1$。正整数中只有 $n=2$。'
      },
      {
        title: '方法二 · 比值极限复核',
        content: '题设等价于\n\n$$\\frac{(1-\\cos x)\\ln(1+x^2)}{x\\sin x^n}\\to0,\\qquad \\frac{x\\sin x^n}{e^{x^2}-1}\\to0.$$\n\n两比值分别与 $x^{3-n}/2$、$x^{n-1}$ 等价。它们都趋于零恰好要求 $3-n>0$ 且 $n-1>0$，故 $n=2$。'
      }
    ]
  }),
  companion({
    id: 'wzx-47',
    source: '何耀焜私人整理 · 武忠祥《高数基础篇做题本》',
    page: 'PDF 19 · 书页 P34 · 例 47',
    fingerprint: 'order-comparison:log-cosine-parameter-range',
    title: '精选 2.31 · 含参幂函数的高阶条件',
    statement: '当 $x\\to0^+$ 时，若 $\\ln^\\alpha(1+2x)$ 与 $(1-\\cos x)^{1/\\alpha}$ 均为比 $x$ 高阶的无穷小，求 $\\alpha$ 的取值范围。',
    tags: ['函数极限', '无穷小阶', '参数', '选择题'],
    coreMethod: '在右极限下把两式分别化为 $x^\\alpha$ 与 $x^{2/\\alpha}$，再要求两个指数都大于 $1$。',
    mistakes: '忽略 $x\\to0^+$ 的条件或没有先确认 $\\alpha>0$；分式不等式 $2/\\alpha>1$ 只有在正参数下才能直接同乘。',
    answerText: '正确选项为 B：$1<\\alpha<2$。',
    questionFormat: 'single-choice',
    options: ['$(2,+\\infty)$', '$(1,2)$', '$(1/2,1)$', '$(0,1/2)$'],
    correctOptionIds: ['B'],
    solutionMethods: [
      {
        title: '方法一 · 等价无穷小比较',
        content: '由右极限可知 $\\ln(1+2x)>0$。当 $x\\to0^+$ 时，\n\n$$\\ln^\\alpha(1+2x)\\sim(2x)^\\alpha,$$\n\n它比 $x$ 高阶要求 $\\alpha>1$。又\n\n$$(1-\\cos x)^{1/\\alpha}\\sim2^{-1/\\alpha}x^{2/\\alpha},$$\n\n高阶条件要求 $2/\\alpha>1$。合并得 $1<\\alpha<2$。'
      },
      {
        title: '方法二 · 对数阶数复核',
        content: '分别考察与 $x$ 的比值：第一项的对数主部为 $(\\alpha-1)\\ln x+O(1)$，要使比值趋零须 $\\alpha-1>0$；第二项的对数主部为 $(2/\\alpha-1)\\ln x+O(1)$，须 $2/\\alpha-1>0$。两条件仍给出 $1<\\alpha<2$。'
      }
    ]
  }),
  companion({
    id: 'zy1000-01',
    source: '何耀焜私人整理 · 张宇《1000题数一》解析册',
    page: 'PDF 20 · 解析页 14 · 第 1 题',
    fingerprint: 'one-power:arctangent-near-pi-quarter',
    title: '精选 2.32 · 反正切底数的数列幂指极限',
    statement: '求极限\n\n$$\\lim_{n\\to\\infty}\\left(\\frac4\\pi\\arctan\\frac n{n+1}\\right)^n.$$',
    tags: ['数列极限', '幂指型极限', '反正切'],
    coreMethod: '底数趋于 $1$，令 $t=1/n$ 后求 $\\ln[(4/\\pi)\\arctan(1/(1+t))]$ 在 $t=0$ 的一阶系数。',
    mistakes: '把 $\\arctan[n/(n+1)]$ 直接替换为 $\\pi/4$ 会丢掉决定幂指极限的一阶偏差。',
    answerText: '极限为 $e^{-2/\\pi}$。',
    solutionMethods: [
      {
        title: '方法一 · 对数与导数',
        content: '令 $t=1/n$，并设\n\n$$g(t)=\\ln\\left[\\frac4\\pi\\arctan\\frac1{1+t}\\right].$$\n\n有 $g(0)=0$。括号内函数在 $t=0$ 附近为正且可导，直接求导得 $g\\prime(0)=-2/\\pi$。因此原式对数为 $g(t)/t\\to-2/\\pi$，原极限为 $e^{-2/\\pi}$。'
      },
      {
        title: '方法二 · 一阶展开复核',
        content: '$1/(1+t)=1-t+O(t^2)$，而 $\\arctan u$ 在 $u=1$ 处的导数为 $1/2$，故\n\n$$\\arctan\\frac1{1+t}=\\frac\\pi4-\\frac t2+O(t^2).$$\n\n于是底数为 $1-2t/\\pi+O(t^2)$。取 $n=1/t$ 次幂，极限即 $e^{-2/\\pi}$。'
      }
    ]
  }),
  companion({
    id: 'zy1000-10',
    source: '何耀焜私人整理 · 张宇《1000题数一》解析册',
    page: 'PDF 22 · 解析页 16 · 第 10 题',
    fingerprint: 'implicit-sequences:exponential-order-squeeze',
    title: '精选 2.33 · 指数差约束下的数列夹逼',
    statement: '设数列 $\\{a_n\\},\\{b_n\\}$ 满足\n\n$$e^{b_n}-e^{a_n}=a_n>0,$$\n\n且 $b_n\\to0$。证明 $a_n\\to0$。',
    tags: ['数列极限', '隐式关系', '夹逼准则', '证明题'],
    coreMethod: '由指数函数严格递增，把指数差为正转成 $b_n>a_n$，再与 $a_n>0$ 一起直接夹逼。',
    mistakes: '没有先利用题设中的 $a_n>0$；只有得到 $0<a_n<b_n$，才能从 $b_n\\to0$ 闭合证明。',
    answerText: '$$\\lim_{n\\to\\infty}a_n=0.$$',
    solutionMethods: [
      {
        title: '方法一 · 单调性与夹逼',
        content: '由 $e^{b_n}-e^{a_n}=a_n>0$ 得 $e^{b_n}>e^{a_n}$。指数函数在实数上严格递增，所以 $b_n>a_n>0$。又 $b_n\\to0$，故\n\n$$0<a_n<b_n\\to0.$$\n\n由夹逼准则立即得到 $a_n\\to0$。'
      },
      {
        title: '方法二 · 单调反函数复核',
        content: '题设可改写为\n\n$$b_n=h(a_n),\\qquad h(x)=\\ln(e^x+x),\\quad x>0.$$\n\n函数 $h$ 在 $[0,+\\infty)$ 上连续且严格递增，$h(0)=0$，所以其反函数在零点连续。由 $b_n\\to0$ 得 $a_n=h^{-1}(b_n)\\to h^{-1}(0)=0$。'
      }
    ]
  })
]
