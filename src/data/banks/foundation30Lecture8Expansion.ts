import type { SeedInput } from './types'

const raw = String.raw
const ZY30_SOURCE = '何耀焜私人整理 · 张宇《基础30讲》高数 · 第8讲逐页核验'

type LectureEightSeed = Omit<SeedInput, 'id' | 'kind' | 'tags' | 'methodFingerprint' | 'source'> & {
  id: string
  role: 'example' | 'exercise'
  tags: string[]
  fingerprint: string
}

function lectureEight(input: LectureEightSeed): SeedInput {
  const roleLabel = input.role === 'example' ? '经典例题' : '课后习题'
  return {
    ...input,
    id: `zy30-verified-l08-${input.id}`,
    kind: 'problem',
    source: ZY30_SOURCE,
    tags: ['高等数学', '第8讲', roleLabel, 'PDF逐页核验', ...input.tags],
    methodFingerprint: `zy30-verified:l08:${input.fingerprint}`
  }
}

export const foundation30Lecture8ExpansionSeeds: SeedInput[] = [
  lectureEight({
    id: 'example-8-1-antiderivative-composition', role: 'example', page: 'PDF 201 · 书页 196 · 例 8.1',
    fingerprint: 'antiderivative:differentiate-composite-f-of-x-squared',
    title: '例 8.1 · 由不定积分反求复合函数',
    statement: raw`设 $0<x<1$，且

$$\int (1-x^2)f(x^2)\,dx=\arcsin x+C,$$

则 $f(x)$ 等于（ ）。`,
    tags: ['原函数', '复合函数', '选择题'],
    coreMethod: raw`对不定积分等式两端求导，先得到 $f(x^2)$，再利用 $0<x<1$ 作变量替换。`,
    mistakes: raw`从 $f(x^2)$ 还原 $f(x)$ 时漏掉变量平方，或把 $(1-x^2)^{-3/2}$ 的自变量直接照搬。`,
    answerText: raw`正确选项为 B，即 $f(x)=(1-x)^{-3/2}$。`,
    questionFormat: 'single-choice',
    options: [raw`$(1-x)^{3/2}$`, raw`$(1-x)^{-3/2}$`, raw`$(1-x^2)^{3/2}$`, raw`$(1-x^2)^{-3/2}$`],
    correctOptionIds: ['B'],
    solutionMethods: [
      { title: '方法一 · 两端求导', content: raw`对题设求导得

$$ (1-x^2)f(x^2)=\frac1{\sqrt{1-x^2}},$$

故 $f(x^2)=(1-x^2)^{-3/2}$。令 $u=x^2\in(0,1)$，得到 $f(u)=(1-u)^{-3/2}$。` },
      { title: '方法二 · 原函数验算', content: raw`逐项代回候选。只有 B 给出 $f(x^2)=(1-x^2)^{-3/2}$，从而被积函数化为 $(1-x^2)^{-1/2}$，其原函数正是 $\arcsin x+C$。` }
    ]
  }),
  lectureEight({
    id: 'example-8-2-piecewise-antiderivative', role: 'example', page: 'PDF 201-202 · 书页 196-197 · 例 8.2',
    fingerprint: 'antiderivative:piecewise-integrate-and-match-continuity',
    title: '例 8.2 · 分段函数原函数的连续拼接',
    statement: raw`函数

$$f(x)=\begin{cases}\dfrac1{\sqrt{1+x^2}},&x\le0,\\(x+1)\cos x,&x>0\end{cases}$$

的一个原函数是（ ）。`,
    tags: ['原函数', '分段函数', '选择题'],
    coreMethod: '分别积分，再利用原函数必连续以及导数必须等于原函数拼接两侧。',
    mistakes: '只对两段分别积分而不匹配零点处常数，或者右段分部积分时把正弦、余弦符号写反。',
    answerText: '正确选项为 D。',
    questionFormat: 'single-choice',
    options: [
      raw`$F(x)=\begin{cases}\ln(\sqrt{1+x^2}-x),&x\le0,\\(x+1)\cos x-\sin x,&x>0,\end{cases}$`,
      raw`$F(x)=\begin{cases}\ln(\sqrt{1+x^2}-x)+1,&x\le0,\\(x+1)\cos x-\sin x,&x>0,\end{cases}$`,
      raw`$F(x)=\begin{cases}\ln(\sqrt{1+x^2}+x),&x\le0,\\(x+1)\sin x+x\cos x,&x>0,\end{cases}$`,
      raw`$F(x)=\begin{cases}\ln(\sqrt{1+x^2}+x)+1,&x\le0,\\(x+1)\sin x+\cos x,&x>0.\end{cases}$`
    ],
    correctOptionIds: ['D'],
    solutionMethods: [
      { title: '方法一 · 分段求导筛选', content: raw`左段应满足 $F'(x)=1/\sqrt{1+x^2}$，故采用 $\ln(\sqrt{1+x^2}+x)$。右段有

$$[(x+1)\sin x+\cos x]'=(x+1)\cos x.$$

两侧在 $x=0$ 的值都为 $1$，所以 D 连续且导数正确。` },
      { title: '方法二 · 分部积分并配常数', content: raw`右段积分为

$$\int(x+1)\cos x\,dx=(x+1)\sin x+\cos x+C_2.$$

左段为 $\ln(\sqrt{1+x^2}+x)+C_1$。令两段在零点取值相同，选择 $C_1=1,C_2=0$，即得到 D。` }
    ]
  }),
  lectureEight({
    id: 'example-8-4-inverse-area-inequality', role: 'example', page: 'PDF 215 · 书页 210 · 例 8.4',
    fingerprint: 'definite-integral:inverse-function-two-areas-exceed-rectangle',
    title: '例 8.4 · 函数与反函数积分的面积比较',
    statement: raw`可导函数 $y=f(x)$ 在 $[0,+\infty)$ 上的值域为 $[0,+\infty)$，且 $f(0)=0$、$f'(x)>0$。设 $x=\varphi(y)$ 为其反函数。常数 $a,b>0$ 且 $a<\varphi(b)$，记

$$I=\int_0^a f(x)\,dx+\int_0^b\varphi(y)\,dy.$$

比较 $I$ 与 $ab$ 的大小。`,
    tags: ['定积分', '反函数', '面积比较'],
    coreMethod: '把函数与反函数画在同一坐标系，用互为反函数区域的面积互补关系比较。',
    mistakes: raw`误套 $\int_0^a f+\int_0^{f(a)}\varphi=af(a)$，忽略本题上限 $b$ 满足 $b>f(a)$。`,
    answerText: raw`$I>ab$。`,
    solutionMethods: [
      { title: '方法一 · 几何面积分割', content: raw`由 $a<\varphi(b)$ 得 $f(a)<b$。矩形 $[0,a]\times[0,b]$ 的面积为 $ab$，而两积分对应的面积除覆盖该矩形外，还包含 $x\in(a,\varphi(b))$ 上的一块正面积，故 $I>ab$。` },
      { title: '方法二 · 反函数积分公式', content: raw`利用

$$\int_0^b\varphi(y)\,dy=b\varphi(b)-\int_0^{\varphi(b)}f(x)\,dx,$$

得到 $I-ab=(\varphi(b)-a)b-\int_a^{\varphi(b)}f(x)dx$。在该区间 $f(x)<b$，所以右端严格大于零。` }
    ]
  }),
  lectureEight({
    id: 'example-8-5-damped-sine-area', role: 'example', page: 'PDF 215 · 书页 210 · 例 8.5',
    fingerprint: 'improper-integral:oscillatory-area-absolute-value-and-lobe-sum',
    title: '例 8.5 · 衰减振荡曲线的面积表达式',
    statement: raw`曲线 $y=e^{-x}\sin x$ 在 $[0,+\infty)$ 上与 $x$ 轴围成图形的总面积可由下列哪些式子表示：

1. $\int_0^{+\infty}e^{-x}|\sin x|\,dx$；
2. $\left|\int_0^{+\infty}e^{-x}\sin x\,dx\right|$；
3. $\lim_{n\to\infty}\sum_{k=0}^{n}\left|\int_{k\pi}^{(k+1)\pi}e^{-x}\sin x\,dx\right|$。

问正确表达式的个数。`,
    tags: ['反常积分', '几何面积', '选择题'],
    coreMethod: '总面积必须逐段取绝对值；函数交替变号时，积分的绝对值不能替代绝对值的积分。',
    mistakes: raw`把 $\left|\int f\right|$ 当成 $\int|f|$，导致正负波瓣相互抵消。`,
    answerText: '正确的是 1、3，共 2 个，选择 C。',
    questionFormat: 'single-choice',
    options: ['0 个', '1 个', '2 个', '3 个'],
    correctOptionIds: ['C'],
    solutionMethods: [
      { title: '方法一 · 按定义辨认面积', content: raw`面积元始终非负，所以总面积就是 $\int_0^{+\infty}|e^{-x}\sin x|dx$，式 1 正确。式 2 先累加带符号面积，会发生抵消，故错误。` },
      { title: '方法二 · 按零点分瓣求和', content: raw`$\sin x$ 在每个 $[k\pi,(k+1)\pi]$ 上符号固定，因此该波瓣面积等于该段积分的绝对值。把全部波瓣相加并取极限正是式 3。` }
    ]
  }),
  lectureEight({
    id: 'example-8-6-riemann-rational-sum', role: 'example', page: 'PDF 216 · 书页 211 · 例 8.6',
    fingerprint: 'riemann-sum:normalize-n-plus-i-over-n-squared-plus-i-squared',
    title: '例 8.6 · 非标准分式和化为定积分',
    statement: raw`计算极限

$$\lim_{n\to\infty}\sum_{i=1}^{n}\frac{n+i}{n^2+i^2}.$$
`,
    tags: ['定积分定义', '黎曼和', '极限'],
    coreMethod: raw`每项同时除以 $n^2$，主动凑出 $i/n$ 与步长 $1/n$。`,
    mistakes: raw`只看到分母有 $n^2$ 就把每项判为零，忽略共有 $n$ 项；或漏写黎曼和步长 $1/n$。`,
    answerText: raw`极限为

$$\int_0^1\frac{1+x}{1+x^2}\,dx=\frac12\ln2+\frac\pi4.$$`,
    solutionMethods: [
      { title: '方法一 · 直接凑黎曼和', content: raw`改写为

$$\sum_{i=1}^n\frac{1+i/n}{1+(i/n)^2}\frac1n,$$

它是 $f(x)=(1+x)/(1+x^2)$ 在 $[0,1]$ 的右端点黎曼和。积分拆成对数项和反正切项即可。` },
      { title: '方法二 · 两部分分别识别', content: raw`把原和拆为

$$\sum\frac{n}{n^2+i^2}+\sum\frac{i}{n^2+i^2}.$$

两项分别趋于 $\int_0^1dx/(1+x^2)=\pi/4$ 与 $\int_0^1x\,dx/(1+x^2)=\ln2/2$。` }
    ]
  }),
  lectureEight({
    id: 'example-8-7-positive-integral', role: 'example', page: 'PDF 216-217 · 书页 211-212 · 例 8.7',
    fingerprint: 'positive-integral:continuous-nonnegative-not-identically-zero',
    title: '例 8.7 · 非负连续函数积分严格为正',
    statement: raw`设 $f$ 是 $[a,b]$ 上非负的连续函数，且 $f$ 不恒等于零。证明

$$\int_a^b f(x)\,dx>0.$$`,
    tags: ['定积分性质', '连续性', '证明题'],
    coreMethod: '由某点函数值为正和连续性制造一个高度、宽度都为正的小矩形下界。',
    mistakes: '只说被积函数非负便推出严格大于零；若函数恒为零，只能得到积分等于零。',
    answerText: '积分严格大于零。',
    solutionMethods: [
      { title: '方法一 · 局部正下界', content: raw`存在 $x_0\in[a,b]$ 使 $f(x_0)>0$。由连续性，可取 $\delta>0$ 与 $\eta>0$，使 $f(x)\ge\eta$ 在 $[x_0-\delta,x_0+\delta]\cap[a,b]$ 上成立，因此积分至少为一个正的矩形面积。` },
      { title: '方法二 · 反证积分为零', content: raw`若非负连续函数积分为零，而某点 $f(x_0)>0$，连续性会使其在该点邻域仍大于 $f(x_0)/2$，从而产生正积分，矛盾。故积分不可能为零。` }
    ]
  }),
  lectureEight({
    id: 'example-8-8-integral-mean-value', role: 'example', page: 'PDF 217-218 · 书页 212-213 · 例 8.8',
    fingerprint: 'integral-mean-value:extreme-values-and-intermediate-value',
    title: '例 8.8 · 定积分中值定理的两种证明',
    statement: raw`设 $f$ 在 $[a,b]$ 上连续。证明存在 $\xi\in[a,b]$，使

$$\int_a^b f(x)\,dx=f(\xi)(b-a).$$`,
    tags: ['积分中值定理', '证明题', '连续函数'],
    coreMethod: '先把积分平均值夹在函数最小值与最大值之间，再由连续性取到该值。',
    mistakes: raw`忘记 $b-a>0$，或在只可积但不连续时仍断言平均值一定等于某个点的函数值。`,
    answerText: raw`存在 $\xi\in[a,b]$ 满足所给等式。`,
    solutionMethods: [
      { title: '方法一 · 介值定理', content: raw`设最小值、最大值为 $m,M$，则

$$m\le\frac1{b-a}\int_a^bf(x)dx\le M.$$

积分平均值位于值域内，连续函数由介值定理必在某点 $\xi$ 取到它。` },
      { title: '方法二 · 罗尔定理', content: raw`令 $k=(b-a)^{-1}\int_a^bf$，并设 $F(x)=\int_a^xf(t)dt-k(x-a)$。有 $F(a)=F(b)=0$。罗尔定理给出 $F'(\xi)=f(\xi)-k=0$，即得结论。` }
    ]
  }),
  lectureEight({
    id: 'example-8-9-tan-ratio-integrals', role: 'example', page: 'PDF 218 · 书页 213 · 例 8.9',
    fingerprint: 'integral-comparison:tan-x-reciprocal-ratios-and-unit-bound',
    title: '例 8.9 · 互为倒数型积分的大小关系',
    statement: raw`设

$$I_1=\int_0^{\pi/4}\frac{\tan x}{x}\,dx,\qquad I_2=\int_0^{\pi/4}\frac{x}{\tan x}\,dx.$$

比较 $I_1,I_2,1$ 的大小。`,
    tags: ['定积分比较', '三角不等式', '选择题'],
    coreMethod: raw`在 $(0,\pi/4)$ 上使用 $0<\sin x<x<\tan x$，再补一个上界判断 $I_1<1$。`,
    mistakes: raw`由 $\tan x/x>1$ 就误判 $I_1>1$，忽略积分区间长度只有 $\pi/4<1$。`,
    answerText: raw`$1>I_1>I_2$，选择 B。`,
    questionFormat: 'single-choice',
    options: [raw`$I_1>I_2>1$`, raw`$1>I_1>I_2$`, raw`$I_2>I_1>1$`, raw`$1>I_2>I_1$`],
    correctOptionIds: ['B'],
    solutionMethods: [
      { title: '方法一 · 点态比较与上界', content: raw`由 $x<\tan x$ 得 $\tan x/x>x/\tan x$，故 $I_1>I_2$。又在该区间 $\tan x/x<4/\pi$，所以 $I_1<(4/\pi)(\pi/4)=1$。` },
      { title: '方法二 · 差值保号', content: raw`两积分之差的被积函数为

$$\frac{(x+\tan x)(\tan x-x)}{x\tan x}>0,$$

故 $I_1>I_2$。再考察 $g(x)=\tan x/x$ 的单调性，$g(x)<g(\pi/4)=4/\pi$，得到 $I_1<1$。` }
    ]
  }),
  lectureEight({
    id: 'example-8-10-composite-trig-integrals', role: 'example', page: 'PDF 218-219 · 书页 213-214 · 例 8.10',
    fingerprint: 'integral-comparison:sin-sin-and-cos-cos-reflection',
    title: '例 8.10 · 复合三角积分的反射比较',
    statement: raw`设

$$M=\int_0^{\pi/2}\sin(\sin x)\,dx,\qquad N=\int_0^{\pi/2}\cos(\cos x)\,dx.$$

比较 $M,N,1$ 的大小。`,
    tags: ['定积分比较', '区间反射', '选择题'],
    coreMethod: raw`对 $N$ 作 $x=\pi/2-t$，把两个积分统一成 $\sin(sin x)$ 与 $\sin x$ 的比较。`,
    mistakes: '直接比较原被积函数却忽略自变量不同，或把凹函数不等式方向写反。',
    answerText: raw`$M<1<N$，选择 A。`,
    questionFormat: 'single-choice',
    options: [raw`$M<1<N$`, raw`$M<N<1$`, raw`$N<M<1$`, raw`$1<M<N$`],
    correctOptionIds: ['A'],
    solutionMethods: [
      { title: '方法一 · 点态夹逼', content: raw`在 $[0,\pi/2]$ 上有 $\sin(sin x)<\sin x$，故 $M<\int_0^{\pi/2}\sin xdx=1$。令 $x=\pi/2-t$，则 $N=\int_0^{\pi/2}\cos(\sin t)dt>\int_0^{\pi/2}\cos tdt=1$。` },
      { title: '方法二 · 单调函数复合', content: raw`因 $0\le\sin x\le x\le\pi/2$ 且正弦递增，得到 $\sin(\sin x)\le\sin x$，内部严格。反射后 $0\le\sin t\le t$ 且余弦递减，所以 $\cos(\sin t)\ge\cos t$，内部严格。` }
    ]
  }),
  lectureEight({
    id: 'example-8-12-jump-under-variable-upper-integral', role: 'example', page: 'PDF 222 · 书页 217 · 例 8.12',
    fingerprint: 'variable-upper-integral:jump-integrand-continuous-antiderivative-corner',
    title: '例 8.12 · 跳跃被积函数对应的变上限积分',
    statement: raw`设

$$f(x)=\begin{cases}\cos x,&0\le x<\pi,\\1,&\pi\le x\le2\pi,\end{cases}\qquad F(x)=\int_0^x f(t)\,dt.$$

判断 $F$ 在 $x=\pi$ 处的连续性与可导性。`,
    tags: ['变上限积分', '间断点', '选择题'],
    coreMethod: '变上限积分对可积函数保持连续，但在被积函数跳跃点处左右导数分别等于左右极限。',
    mistakes: raw`看到 $f$ 跳跃就断言 $F$ 也跳跃；积分会平滑函数值，但不一定平滑一阶导数。`,
    answerText: raw`$F$ 在 $x=\pi$ 处连续但不可导，选择 C。`,
    questionFormat: 'single-choice',
    options: ['是跳跃间断点', '是可去间断点', '连续但不可导', '可导'],
    correctOptionIds: ['C'],
    solutionMethods: [
      { title: '方法一 · 左右导数', content: raw`$F$ 由积分定义连续。又

$$F'_-(\pi)=\lim_{x\to\pi^-}f(x)=-1,\qquad F'_+(\pi)=\lim_{x\to\pi^+}f(x)=1,$$

左右导数不等，故不可导。` },
      { title: '方法二 · 显式分段积分', content: raw`当 $x<\pi$ 时 $F(x)=\sin x$；当 $x\ge\pi$ 时 $F(x)=x-\pi$。两段在 $\pi$ 都取零，但斜率分别为 $-1$ 与 $1$，形成尖角。` }
    ]
  }),
  lectureEight({
    id: 'example-8-13-isolated-value-integral-derivative', role: 'example', page: 'PDF 222-223 · 书页 217-218 · 例 8.13',
    fingerprint: 'variable-upper-integral:isolated-point-value-does-not-affect-derivative',
    title: '例 8.13 · 孤立点函数值不影响积分导数',
    statement: raw`设

$$f(x)=\begin{cases}e^{x^2}+x^2,&x\ne0,\\a,&x=0,\end{cases}\qquad F(x)=\int_{-1}^x f(t)\,dt.$$

判断下列说法：1. $a=1$ 时 $F$ 在零点可导；2. $a\ne1$ 时 $F$ 在零点可导；3. $a=1$ 时不可导；4. $a\ne1$ 时不可导。`,
    tags: ['变上限积分', '孤立点', '选择题'],
    coreMethod: '黎曼积分不受单个点函数值影响，差商只由零点邻域内几乎处处的函数表达式决定。',
    mistakes: raw`机械套 $F'(0)=f(0)=a$，忽略该公式要求被积函数在零点连续。`,
    answerText: '说法 1、2 正确，选择 B。',
    questionFormat: 'single-choice',
    options: ['1、4', '1、2', '3、4', '2、3'],
    correctOptionIds: ['B'],
    solutionMethods: [
      { title: '方法一 · 改动单点不改积分', content: raw`把 $f(0)$ 改为任意 $a$ 都不改变任何定积分。因此 $F$ 与把零点值取为 $1$ 的连续函数所生成的变上限积分完全相同，故 $F'(0)=1$，与 $a$ 无关。` },
      { title: '方法二 · 差商直接计算', content: raw`有

$$\frac{F(x)-F(0)}x=\frac1x\int_0^x(e^{t^2}+t^2)dt.$$

由积分中值或洛必达法则，极限为 $1$。积分中单点 $t=0$ 的取值不贡献面积。` }
    ]
  }),
  lectureEight({
    id: 'example-8-14-bounded-linear-ode-solution', role: 'example', page: 'PDF 223 · 书页 218 · 例 8.14',
    fingerprint: 'variable-upper-integral:bounded-forcing-exponential-kernel',
    title: '例 8.14 · 指数核积分解的有界性',
    statement: raw`设 $a>0$，函数 $f$ 在 $[0,+\infty)$ 内连续有界。证明任意常数 $C$ 对应的函数

$$y(x)=e^{-ax}\left[\int_0^x e^{at}f(t)\,dt+C\right]$$

在 $[0,+\infty)$ 上有界。`,
    tags: ['变上限积分', '有界性', '证明题'],
    coreMethod: '把外部指数因子乘进积分，转成衰减卷积并用被积函数上界估计。',
    mistakes: raw`只估计 $\int_0^x e^{at}f(t)dt$ 会得到指数增长，漏掉外面的 $e^{-ax}$ 正好抵消该增长。`,
    answerText: raw`若 $|f(x)|\le M$，则 $|y(x)|\le |C|+M/a$，故有界。`,
    solutionMethods: [
      { title: '方法一 · 绝对值估计', content: raw`由 $|f(t)|\le M$，

$$|y(x)|\le |C|e^{-ax}+Me^{-ax}\int_0^xe^{at}dt
=|C|e^{-ax}+\frac M a(1-e^{-ax})\le |C|+\frac M a.$$` },
      { title: '方法二 · 卷积核表示', content: raw`改写为

$$y(x)=Ce^{-ax}+\int_0^xe^{-a(x-t)}f(t)dt.$$

核函数非负且总质量 $\int_0^xe^{-a(x-t)}dt\le1/a$，所以卷积项绝对值不超过 $M/a$。` }
    ]
  }),
  lectureEight({
    id: 'example-8-15-two-end-power-integral', role: 'example', page: 'PDF 226-227 · 书页 221-222 · 例 8.15',
    fingerprint: 'improper-integral:two-end-dominant-powers-a-greater-b',
    title: '例 8.15 · 两端由不同幂次主导的反常积分',
    statement: raw`设 $a>b>0$。反常积分

$$\int_0^{+\infty}\frac{dx}{x^a+x^b}$$

收敛时，$a,b$ 应满足（ ）。`,
    tags: ['反常积分', '参数', '选择题'],
    coreMethod: raw`在 $x\to0^+$ 与 $x\to+\infty$ 分别找分母的主导幂，两个端点必须同时收敛。`,
    mistakes: raw`在 $0<x<1$ 时仍认为次数较大的 $x^a$ 占主导；实际上此时 $x^b$ 更大。`,
    answerText: raw`$a>1$ 且 $b<1$，选择 B。`,
    questionFormat: 'single-choice',
    options: [raw`$a>1,b>1$`, raw`$a>1,b<1$`, raw`$a<1,a+b>1$`, raw`$a<1,b<1$`],
    correctOptionIds: ['B'],
    solutionMethods: [
      { title: '方法一 · 分割区间比较', content: raw`在 $(0,1)$ 上 $x^a+x^b\sim x^b$，需 $\int_0^1x^{-b}dx$ 收敛，即 $b<1$。在 $(1,+\infty)$ 上分母与 $x^a$ 同阶，需 $a>1$。` },
      { title: '方法二 · 极限比较', content: raw`分别计算

$$\lim_{x\to0^+}\frac{1/(x^a+x^b)}{x^{-b}}=1,\qquad
\lim_{x\to\infty}\frac{1/(x^a+x^b)}{x^{-a}}=1.$$

用局部 $p$ 判据得到同一条件。` }
    ]
  }),
  lectureEight({
    id: 'example-8-16-exponential-cosine-tail', role: 'example', page: 'PDF 227 · 书页 222 · 例 8.16',
    fingerprint: 'improper-integral:taylor-leading-order-cos-one-over-x',
    title: '例 8.16 · 用等价无穷小判断指数余弦尾积分',
    statement: raw`若反常积分

$$\int_1^{+\infty}\left(e^{-\cos(1/x)}-e^{-1}\right)x^k\,dx$$

收敛，求 $k$ 的取值范围。`,
    tags: ['反常积分', '等价无穷小', '参数'],
    coreMethod: raw`在无穷远令 $u=1/x$，展开 $1-\cos u$ 的首项，确定原被积函数与哪个幂函数同阶。`,
    mistakes: raw`只看到括号趋于零就判收敛，或漏掉 $1-\cos(1/x)$ 的阶数是 $x^{-2}$。`,
    answerText: raw`$k<1$。`,
    solutionMethods: [
      { title: '方法一 · 等价无穷小', content: raw`当 $x\to\infty$，

$$e^{-\cos(1/x)}-e^{-1}=e^{-1}\left(e^{1-\cos(1/x)}-1\right)\sim\frac{e^{-1}}{2x^2}.$$

乘 $x^k$ 后与 $x^{k-2}$ 同阶，尾积分收敛当且仅当 $k-2<-1$。` },
      { title: '方法二 · 泰勒展开', content: raw`用 $\cos u=1-u^2/2+O(u^4)$，得括号为 $e^{-1}[u^2/2+O(u^4)]$。令 $u=1/x$，主项为常数乘 $x^{-2}$，故条件仍为 $k<1$。` }
    ]
  }),
  lectureEight({
    id: 'example-8-17-improper-divergence-screening', role: 'example', page: 'PDF 227-228 · 书页 222-223 · 例 8.17',
    fingerprint: 'improper-integral:screen-endpoints-internal-singularities-and-symmetry',
    title: '例 8.17 · 同时检查端点、内部瑕点与无穷远',
    statement: '下列反常积分中发散的是（ ）。',
    tags: ['反常积分', '瑕点', '选择题'],
    coreMethod: '逐项列出所有异常点，不能只检查积分上下限；对称性只能在两侧各自收敛后使用。',
    mistakes: raw`把 $\int_{-1}^1dx/\sin x$ 当作奇函数积分而写成零，忽略零点两侧积分分别发散。`,
    answerText: '正确选项为 C。',
    questionFormat: 'single-choice',
    options: [
      raw`$\int_1^{+\infty}\left[\ln\left(1+\frac1x\right)-\frac1{1+x}\right]dx$`,
      raw`$\int_0^{+\infty}\frac{\ln x}{1+x^2}dx$`,
      raw`$\int_{-1}^{1}\frac{dx}{\sin x}$`,
      raw`$\int_{-\infty}^{+\infty}\frac{\sin x}{1+x^2}dx$`
    ],
    correctOptionIds: ['C'],
    solutionMethods: [
      { title: '方法一 · 局部阶数逐项审查', content: raw`A 的被积函数在无穷远为 $O(x^{-2})$；B 经 $x\mapsto1/x$ 两段抵消且分别收敛；D 绝对值受 $1/(1+x^2)$ 控制。C 在零点与 $1/x$ 同阶，左右瑕积分均发散。` },
      { title: '方法二 · 原函数与比较复核', content: raw`C 的原函数局部含 $\ln|\tan(x/2)|$，当 $x\to0^\pm$ 均无有限极限，因此不能用主值替代通常反常积分。其余三项可分别用泰勒展开、倒数换元和绝对收敛比较确认。` }
    ]
  }),
  lectureEight({
    id: 'example-8-18-log-singularity-at-zero', role: 'example', page: 'PDF 228-229 · 书页 223-224 · 例 8.18',
    fingerprint: 'improper-integral:log-over-power-near-zero-parameter',
    title: '例 8.18 · 零点处对数与幂函数的竞争',
    statement: raw`已知 $\alpha>0$。判断反常积分

$$\int_0^1\frac{\ln x}{x^\alpha}\,dx$$

的敛散性。`,
    tags: ['反常积分', '参数', '零点瑕积分'],
    coreMethod: raw`令 $x=e^{-t}$，把零点瑕积分化为无穷区间上的 $t e^{-(1-\alpha)t}$。`,
    mistakes: raw`认为对数发散得比所有幂都快；实际上 $|\ln x|$ 比任意负幂增长慢。`,
    answerText: raw`当且仅当 $0<\alpha<1$ 时收敛。`,
    solutionMethods: [
      { title: '方法一 · 指数换元', content: raw`令 $x=e^{-t}$，则积分绝对值对应

$$\int_0^{+\infty}t e^{-(1-\alpha)t}dt.$$

它在 $1-\alpha>0$ 时收敛，在 $\alpha\ge1$ 时发散。` },
      { title: '方法二 · 幂函数夹逼', content: raw`当 $\alpha<1$ 时取 $\varepsilon>0$ 使 $\alpha+\varepsilon<1$，有 $|\ln x|=o(x^{-\varepsilon})$，故被积函数受 $x^{-\alpha-\varepsilon}$ 控制。$\alpha\ge1$ 时与更强的非可积幂比较即发散。` }
    ]
  }),
  lectureEight({
    id: 'example-8-19-log-tail-at-infinity', role: 'example', page: 'PDF 229-230 · 书页 224-225 · 例 8.19',
    fingerprint: 'improper-integral:log-over-power-at-infinity-parameter',
    title: '例 8.19 · 无穷远处对数与幂函数的竞争',
    statement: raw`已知 $\alpha>0$。判断反常积分

$$\int_1^{+\infty}\frac{\ln x}{x^\alpha}\,dx$$

的敛散性。`,
    tags: ['反常积分', '参数', '无穷区间'],
    coreMethod: raw`无穷远处 $\ln x$ 慢于任意正幂，关键是分母幂次是否严格大于 $1$。`,
    mistakes: raw`把零点判据 $\alpha<1$ 原样搬到无穷远；同一幂函数在两个端点的判据方向相反。`,
    answerText: raw`当且仅当 $\alpha>1$ 时收敛。`,
    solutionMethods: [
      { title: '方法一 · 指数换元', content: raw`令 $x=e^t$，得到

$$\int_0^{+\infty}t e^{-(\alpha-1)t}dt.$$

仅当 $\alpha-1>0$ 时指数衰减足以保证收敛。` },
      { title: '方法二 · 分部积分', content: raw`对有限上限 $R$ 分部积分。若 $\alpha>1$，边界项 $R^{1-\alpha}\ln R\to0$，余项为收敛幂积分；若 $\alpha=1$，原函数为 $(\ln x)^2/2$；若 $\alpha<1$，被积函数最终不小于常数倍 $x^{-\alpha}$，均发散。` }
    ]
  }),
  lectureEight({
    id: 'exercise-8-1-sine-ratio-integrals', role: 'exercise', page: 'PDF 230-231 · 书页 225-226 · 习题 8.1',
    fingerprint: 'exercise-integral-comparison:sin-x-ratios-over-zero-to-pi-half',
    title: '习题 8.1 · 正弦比值积分与常数 1 的比较',
    statement: raw`设

$$I_1=\int_0^{\pi/2}\frac{\sin x}{x}\,dx,\qquad I_2=\int_0^{\pi/2}\frac{x}{\sin x}\,dx.$$

比较 $I_1,I_2,1$ 的大小。`,
    tags: ['定积分比较', '三角不等式', '选择题'],
    coreMethod: raw`利用 $0<\sin x<x$ 得 $I_2>I_1$，再用 $\sin x/x>2/\pi$ 得 $I_1>1$。`,
    mistakes: raw`只用 $\sin x/x<1$ 就误判积分小于 1；积分区间长度为 $\pi/2$。`,
    answerText: raw`$I_2>I_1>1$，选择 C。`,
    questionFormat: 'single-choice',
    options: [raw`$I_1>I_2>1$`, raw`$I_1>1>I_2$`, raw`$I_2>I_1>1$`, raw`$1>I_2>I_1$`],
    correctOptionIds: ['C'],
    solutionMethods: [
      { title: '方法一 · 两级点态不等式', content: raw`由 $\sin x<x$，有 $x/\sin x>\sin x/x$，故 $I_2>I_1$。又 $\sin x/x>2/\pi$ 在 $(0,\pi/2)$ 成立，所以 $I_1>(2/\pi)(\pi/2)=1$。` },
      { title: '方法二 · 凹性弦线下界', content: raw`正弦在 $[0,\pi/2]$ 上凹，其图像位于连接端点的弦上方，即 $\sin x\ge2x/\pi$，内部严格。结合 $x/\sin x>\sin x/x$ 得到完整次序。` }
    ]
  }),
  lectureEight({
    id: 'exercise-8-3-two-end-log-parameter', role: 'exercise', page: 'PDF 230-232 · 书页 225-227 · 习题 8.3',
    fingerprint: 'exercise-improper-integral:log-over-one-plus-x-two-end-parameter',
    title: '习题 8.3 · 同一参数控制两个反常端点',
    statement: raw`讨论参数 $p$ 取何值时，反常积分

$$\int_0^{+\infty}\frac{\ln x}{(1+x)x^{1-p}}\,dx$$

收敛。`,
    tags: ['反常积分', '参数讨论', '两端审敛'],
    coreMethod: raw`在零点与无穷远分别化成 $\ln x$ 乘幂函数，取两个条件的交集。`,
    mistakes: '只分析一个端点，或把两个端点的幂积分判据方向写成相同。',
    answerText: raw`当且仅当 $0<p<1$ 时收敛。`,
    solutionMethods: [
      { title: '方法一 · 两端极限比较', content: raw`当 $x\to0^+$，被积函数与 $x^{p-1}\ln x$ 同阶，需 $p>0$；当 $x\to\infty$，它与 $x^{p-2}\ln x$ 同阶，需 $p<1$。交集为 $0<p<1$。` },
      { title: '方法二 · 倒数换元统一两端', content: raw`把 $[1,+\infty)$ 一段令 $x=1/t$，可化到 $(0,1]$ 上另一项。两段分别出现 $t^{p-1}|\ln t|$ 与 $t^{-p}|\ln t|$，局部可积条件为 $p>0$ 和 $p<1$。` }
    ]
  }),
  lectureEight({
    id: 'exercise-8-4-square-root-riemann-sum', role: 'exercise', page: 'PDF 230、232 · 书页 225、227 · 习题 8.4',
    fingerprint: 'exercise-riemann-sum:square-root-n-squared-plus-ni',
    title: '习题 8.4 · 根式分母极限和',
    statement: raw`计算

$$\lim_{n\to\infty}\sum_{i=1}^{n}\frac1{\sqrt{n^2+ni}}.$$`,
    tags: ['黎曼和', '极限', '根式'],
    coreMethod: raw`从根号中提出 $n^2$，把每项写成 $f(i/n)/n$。`,
    mistakes: raw`提出 $n^2$ 后漏掉根号使 $\sqrt{n^2}=n$，或遗漏外部步长 $1/n$。`,
    answerText: raw`极限为 $2\sqrt2-2$。`,
    solutionMethods: [
      { title: '方法一 · 黎曼和', content: raw`原式为

$$\sum_{i=1}^n\frac1{\sqrt{1+i/n}}\frac1n\to\int_0^1\frac{dx}{\sqrt{1+x}}=2\sqrt2-2.$$` },
      { title: '方法二 · 单调函数上下和', content: raw`$f(x)=(1+x)^{-1/2}$ 连续单调。原和是其右端点和，左右端点和之差为 $[f(0)-f(1)]/n\to0$，因此与定积分同极限，再计算原函数即可。` }
    ]
  }),
  lectureEight({
    id: 'exercise-8-5-sine-squeeze-sum', role: 'exercise', page: 'PDF 230、232-233 · 书页 225、227-228 · 习题 8.5',
    fingerprint: 'exercise-riemann-sum:sine-weight-denominator-n-plus-i-over-n-squeeze',
    title: '习题 8.5 · 用夹逼校正非标准步长',
    statement: raw`计算

$$\lim_{n\to\infty}\sum_{i=1}^{n}\frac{\sin(i\pi/n)}{n+i/n}.$$`,
    tags: ['黎曼和', '夹逼定理', '三角函数'],
    coreMethod: raw`分母位于 $n$ 与 $n+1$ 之间，用两个标准黎曼和夹住原和。`,
    mistakes: raw`把 $n+i/n$ 错看成 $n+i$，会得到完全不同的权函数和极限。`,
    answerText: raw`极限为 $2/\pi$。`,
    solutionMethods: [
      { title: '方法一 · 夹逼标准和', content: raw`因 $n<n+i/n\le n+1$，

$$\frac1{n+1}\sum_{i=1}^n\sin\frac{i\pi}{n}
\le S_n\le
\frac1n\sum_{i=1}^n\sin\frac{i\pi}{n}.$$

两端都趋于 $\int_0^1\sin(\pi x)dx=2/\pi$。` },
      { title: '方法二 · 一致误差估计', content: raw`写成

$$S_n=\frac1n\sum_{i=1}^n\frac{\sin(i\pi/n)}{1+i/n^2}.$$

因 $1/(1+i/n^2)$ 在所有 $i$ 上一致趋于 $1$，它与标准黎曼和之差绝对值不超过 $1/n$ 量级，故极限相同。` }
    ]
  }),
  lectureEight({
    id: 'exercise-8-6-floor-variable-upper', role: 'exercise', page: 'PDF 230、233 · 书页 225、228 · 习题 8.6',
    fingerprint: 'exercise-variable-upper:floor-sawtooth-one-sided-derivatives',
    title: '习题 8.6 · 取整函数变上限积分的单侧导数',
    statement: raw`设

$$F(x)=\int_0^x(t-\lfloor t\rfloor)\,dt,$$

其中 $\lfloor t\rfloor$ 表示不超过 $t$ 的最大整数。求 $F'_-(1)+F'_+(1)$。`,
    tags: ['变上限积分', '取整函数', '单侧导数'],
    coreMethod: '在整数点，被积函数左右极限不同；变上限积分的左右导数分别等于这两个单侧极限。',
    mistakes: raw`直接代入 $t=1$ 得零并认为两侧导数都为零，忽略左侧 $t-\lfloor t\rfloor\to1$。`,
    answerText: raw`$F'_-(1)+F'_+(1)=1$。`,
    solutionMethods: [
      { title: '方法一 · 单侧基本定理', content: raw`当 $t\to1^-$ 时 $t-\lfloor t\rfloor=t\to1$；当 $t\to1^+$ 时它等于 $t-1\to0$。所以 $F'_-(1)=1,F'_+(1)=0$。` },
      { title: '方法二 · 差商直接积分', content: raw`对 $h<0$，$[F(1+h)-F(1)]/h$ 是 $[1+h,1]$ 上 $t$ 的平均值，趋于 $1$；对 $h>0$，它是 $[1,1+h]$ 上 $t-1$ 的平均值，趋于 $0$。` }
    ]
  }),
  lectureEight({
    id: 'exercise-8-7-log-p-test', role: 'exercise', page: 'PDF 230、233-234 · 书页 225、228-229 · 习题 8.7',
    fingerprint: 'exercise-improper-integral:one-over-x-log-power-p-test',
    title: '习题 8.7 · 对数型反常积分的临界指数',
    statement: raw`讨论实数 $p$ 取何值时，反常积分

$$\int_2^{+\infty}\frac{dx}{x(\ln x)^p}$$

收敛。`,
    tags: ['反常积分', '对数判据', '参数'],
    coreMethod: raw`令 $u=\ln x$，把对数型积分精确化成标准幂积分 $\int u^{-p}du$。`,
    mistakes: raw`只用被积函数趋于零判断收敛，或把无穷远幂积分的条件 $p>1$ 写反。`,
    answerText: raw`当且仅当 $p>1$ 时收敛。`,
    solutionMethods: [
      { title: '方法一 · 对数换元', content: raw`令 $u=\ln x$，$du=dx/x$，得到

$$\int_{\ln2}^{+\infty}u^{-p}du,$$

标准无穷区间幂积分当且仅当 $p>1$ 收敛。` },
      { title: '方法二 · 直接求原函数', content: raw`$p\ne1$ 时原函数为 $(\ln x)^{1-p}/(1-p)$，其在无穷远有有限极限恰需 $1-p<0$；$p=1$ 时原函数为 $\ln\ln x$，仍发散。` }
    ]
  })
]
