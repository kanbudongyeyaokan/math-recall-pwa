import type { SeedInput } from './types'

const ZY1000_SOURCE = '何耀焜私人整理 · 张宇《1000题》数一解析册 · 第6章逐页核验'
type CompanionSeed = Omit<SeedInput, 'id' | 'kind' | 'tags' | 'methodFingerprint' | 'source'> & {
  id: string
  tags: string[]
  fingerprint: string
}

function companion(input: CompanionSeed): SeedInput {
  return {
    ...input,
    id: `zy1000-verified-l06-${input.id}`,
    kind: 'problem',
    source: ZY1000_SOURCE,
    tags: ['高等数学', '第6讲', '经典例题', 'PDF逐页核验', ...input.tags],
    methodFingerprint: `zy1000-verified:l06:${input.fingerprint}`
  }
}

export const lecture6CompanionExpansionSeeds: SeedInput[] = [
  companion({
    id: 'problem-14-concave-derivative-sequence', page: '题面解析 PDF 263-264 · 书页 257-258 · 第 14 题',
    fingerprint: 'strict-concavity:derivative-level-sequence-converges-to-maximum-point',
    title: '1000题第 14 题 · 用导数等高点逼近最大值点',
    statement: `设 $f\\in C^2[0,1]$，满足

$$f(0)=f(1)=0,\\qquad f^{(2)}(x)<0\\quad(0<x<1).$$

记 $M=\\max_{0\\le x\\le1}f(x)$。证明：

1. 对每个正整数 $n$，存在唯一的 $x_n\\in(0,1)$，使 $f^{(1)}(x_n)=M/n$；
2. 数列 $\\{x_n\\}$ 严格递增，且 $\\lim_{n\\to\\infty}f(x_n)=M$。`,
    tags: ['凹函数', 'Lagrange中值定理', '数列极限', '证明题'],
    coreMethod: '严格凹性使导函数严格递减、最大值点唯一；用左端到最大值点的割线制造高于 $M/n$ 的导数值，再由导数介值性确定唯一等高点。',
    mistakes: '目标导数值 $M/n$ 随 $n$ 下降，而导函数也随横坐标下降，所以对应横坐标序列应当递增。',
    answerText: `每个 $x_n$ 唯一存在，且

$$0<x_1<x_2<\\cdots<x_0,\\qquad \\lim_{n\\to\\infty}x_n=x_0,\\qquad \\lim_{n\\to\\infty}f(x_n)=M,$$

其中 $x_0$ 是 $f$ 的唯一最大值点。`,
    solutionMethods: [
      { title: '方法一 · 中值定理与导数单调性', content: `由 $f^{(2)}<0$，$f$ 严格凹，在 $(0,1)$ 内有唯一最大值点 $x_0$，并且 $M=f(x_0)>0$、$f^{(1)}(x_0)=0$。在 $[0,x_0]$ 上使用 Lagrange 中值定理，存在 $\\xi\\in(0,x_0)$ 使

$$f^{(1)}(\\xi)=\\frac{f(x_0)-f(0)}{x_0}=\\frac{M}{x_0}>M\\ge\\frac Mn.$$

而 $f^{(1)}(x_0)=0<M/n$。由 $f^{(1)}$ 连续且严格递减，$(\\xi,x_0)$ 内存在唯一 $x_n$ 使 $f^{(1)}(x_n)=M/n$。

因为 $M/n>M/(n+1)$ 且 $f^{(1)}$ 严格递减，所以 $x_n<x_{n+1}<x_0$。序列递增有界，设极限为 $L$。连续性给出

$$f^{(1)}(L)=\\lim_{n\\to\\infty}\\frac Mn=0.$$

导数零点唯一，故 $L=x_0$，进而 $f(x_n)\\to f(x_0)=M$。` },
      { title: '方法二 · 水平线扫描导函数图像', content: `严格凹性等价于 $f^{(1)}$ 严格下降。导函数图像在最大值点穿过横轴，而左侧某点的高度大于 $M$。因此每条水平线 $y=M/n$ 都与这段导函数图像恰交一次。水平线随 $n$ 增大向零下降，交点便单调向右移动并逼近唯一零点 $x_0$；再由 $f$ 连续，函数值逼近 $M$。` }
    ]
  }),
  companion({
    id: 'problem-16-arctan-parameter-root', page: '题面解析 PDF 264-265 · 书页 258-259 · 第 16 题',
    fingerprint: 'parameter-root-range:arctan-scaled-difference-monotone-integral',
    title: '1000题第 16 题 · 反正切缩放方程的参数范围',
    statement: `求常数 $k$ 的取值范围，使方程

$$\\frac1{x^2}-\\frac{\\arctan x}{x^3}=k$$

在 $(0,1]$ 内有实根。`,
    tags: ['参数方程', '反正切函数', '单调性'],
    coreMethod: '研究左端函数在 $(0,1]$ 上的严格单调性和两个端点值；也可把 $x-\\arctan x$ 写成定积分后无量纲化。',
    mistakes: '$x\\to0^+$ 时函数只趋近 $1/3$ 而不能取到该值，所以参数区间右端必须是开端点。',
    answerText: `$$1-\\frac\\pi4\\le k<\\frac13.$$`,
    solutionMethods: [
      { title: '方法一 · 嵌套辅助函数判单调', content: `令

$$F(x)=\\frac1{x^2}-\\frac{\\arctan x}{x^3}=\\frac{x-\\arctan x}{x^3}.$$

求导可写为

$$F^{(1)}(x)=\\frac{3\\arctan x-2x-x/(1+x^2)}{x^4}.$$

令分子为 $G(x)$，则

$$G^{(1)}(x)=-\\frac{2x^4}{(1+x^2)^2}<0,\\qquad G(0)=0,$$

所以 $F^{(1)}(x)<0$。因此 $F$ 在 $(0,1]$ 上严格减少。又

$$\\lim_{x\\to0^+}F(x)=\\frac13,\\qquad F(1)=1-\\frac\\pi4.$$

故值域为 $[1-\\pi/4,1/3)$，这正是 $k$ 的范围。` },
      { title: '方法二 · 定积分无量纲化', content: `由

$$x-\\arctan x=\\int_0^x\\frac{t^2}{1+t^2}\\,dt,$$

令 $t=xu$，得到

$$F(x)=\\int_0^1\\frac{u^2}{1+x^2u^2}\\,du.$$

对每个 $u\\in(0,1]$，被积函数随 $x>0$ 严格减少，所以 $F$ 严格减少。端点值直接为

$$F(0^+)=\\int_0^1u^2du=\\frac13,\\qquad F(1)=\\int_0^1\\frac{u^2}{1+u^2}du=1-\\frac\\pi4.$$

同样得到半开值域。` }
    ]
  })
]
