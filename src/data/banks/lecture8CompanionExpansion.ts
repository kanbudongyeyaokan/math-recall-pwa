import type { SeedInput } from './types'

const raw = String.raw
const ZY1000_SOURCE = '何耀焜私人整理 · 张宇《1000题》数一解析册 · 第8章逐页核验'

type CompanionSeed = Omit<SeedInput, 'id' | 'kind' | 'tags' | 'methodFingerprint' | 'source'> & {
  id: string
  tags: string[]
  fingerprint: string
}

function companion(input: CompanionSeed): SeedInput {
  return {
    ...input,
    id: `zy1000-verified-l08-${input.id}`,
    kind: 'problem',
    source: ZY1000_SOURCE,
    tags: ['高等数学', '第8讲', '经典例题', 'PDF逐页核验', ...input.tags],
    methodFingerprint: `zy1000-verified:l08:${input.fingerprint}`
  }
}

export const lecture8CompanionExpansionSeeds: SeedInput[] = [
  companion({
    id: 'problem-1-cosine-weighted-riemann-limit', page: '解析 PDF 268 · 书页 262 · 第 1 题',
    fingerprint: 'riemann-sum:cosine-prefactor-times-sec-squared-integral',
    title: '1000题第 1 题 · 余弦小量与黎曼和的乘积极限',
    statement: raw`计算极限

$$\lim_{n\to\infty}\left(1-\cos\frac{\pi}{\sqrt n}\right)
\sum_{i=1}^{n}\frac1{1+\cos\dfrac{i\pi}{2n}}.$$`,
    tags: ['黎曼和', '等价无穷小', '极限'],
    coreMethod: raw`把余弦小量提炼成 $1/n$ 的量级，再把剩余求和识别为 $[0,1]$ 上的黎曼和。`,
    mistakes: raw`只计算 $1-\cos(\pi/\sqrt n)$ 趋于零，却忽略求和有 $n$ 项；或漏掉黎曼和的步长 $1/n$。`,
    answerText: raw`极限为 $\pi$。`,
    solutionMethods: [
      { title: '方法一 · 等价无穷小与黎曼和', content: raw`有

$$1-\cos\frac\pi{\sqrt n}\sim\frac{\pi^2}{2n}.$$

同时

$$\frac1n\sum_{i=1}^n\frac1{1+\cos\dfrac{i\pi}{2n}}
\to\int_0^1\frac{dx}{1+\cos(\pi x/2)}=\frac2\pi.$$

两部分相乘得到 $\pi^2/2\cdot2/\pi=\pi$。` },
      { title: '方法二 · 半角公式直接积分', content: raw`利用 $1+\cos u=2\cos^2(u/2)$，黎曼和对应的积分为

$$\frac12\int_0^1\sec^2\frac{\pi x}{4}\,dx
=\frac2\pi\tan\frac\pi4=\frac2\pi.$$

前因子乘以 $n$ 的极限为 $\pi^2/2$，故总极限仍为 $\pi$。` }
    ]
  }),
  companion({
    id: 'problem-2-midpoint-weighted-riemann-sum', page: '解析 PDF 268 · 书页 262 · 第 2 题',
    fingerprint: 'riemann-sum:midpoints-weighted-by-one-plus-x',
    title: '1000题第 2 题 · 中点型加权和化为定积分',
    statement: raw`设 $f$ 在 $[0,1]$ 上连续，求

$$\lim_{n\to\infty}\frac1n\sum_{k=1}^{n}
\left(1+\frac{2k-1}{2n}\right)
f\left(\frac{2k-1}{2n}\right).$$`,
    tags: ['黎曼和', '中点取样', '连续函数'],
    coreMethod: raw`识别 $\xi_k=(2k-1)/(2n)$ 是第 $k$ 个小区间的中点，权函数为 $1+x$。`,
    mistakes: raw`把中点误写成 $k/n$ 后丢掉权函数，或把外部 $1/n$ 错当成被积函数的一部分。`,
    answerText: raw`极限为
$$\int_0^1(1+x)f(x)\,dx.$$`,
    solutionMethods: [
      { title: '方法一 · 中点黎曼和', content: raw`令 $\Delta x=1/n$，第 $k$ 段中点为 $\xi_k=(2k-1)/(2n)$。原式正是

$$\sum_{k=1}^n(1+\xi_k)f(\xi_k)\Delta x,$$

由连续性收敛到 $\int_0^1(1+x)f(x)dx$。` },
      { title: '方法二 · 与右端点和比较', content: raw`连续函数 $(1+x)f(x)$ 在闭区间上一致连续。把每个中点 $\xi_k$ 换成右端点 $k/n$ 所造成的总误差不超过其连续模，且随网格宽度趋于零，因此极限等于同一积分。` }
    ]
  }),
  companion({
    id: 'problem-3-log-product-riemann-limit', page: '解析 PDF 268 · 书页 262 · 第 3 题',
    fingerprint: 'riemann-product:logarithm-linearization-and-exponential-integral',
    title: '1000题第 3 题 · 乘积取对数后化为黎曼和',
    statement: raw`设 $f$ 在 $[0,1]$ 上连续，计算

$$\lim_{n\to\infty}\prod_{i=0}^{n-1}
\left[1+\frac1n f\left(\frac in\right)\right].$$`,
    tags: ['乘积极限', '黎曼和', '对数'],
    coreMethod: raw`对正乘积取对数，用 $\ln(1+u)=u+o(u)$ 将乘积转为 $f$ 的黎曼和，最后再指数还原。`,
    mistakes: raw`把乘积极限直接写成积分，漏掉外层指数；或没有说明连续函数有界，从而无法控制对数展开的总误差。`,
    answerText: raw`极限为
$$\exp\left(\int_0^1f(x)\,dx\right).$$`,
    solutionMethods: [
      { title: '方法一 · 取对数', content: raw`连续函数有界，因此当 $n$ 足够大时各因子为正。设乘积为 $P_n$，则

$$\ln P_n=\sum_{i=0}^{n-1}\ln\left[1+\frac1nf\left(\frac in\right)\right]
=\frac1n\sum_{i=0}^{n-1}f\left(\frac in\right)+o(1).$$

右侧趋于 $\int_0^1f$，指数化即得答案。` },
      { title: '方法二 · 统一误差估计', content: raw`由 $f$ 有界，存在 $M$ 使 $|f|\le M$。在 $|u|\le M/n$ 上有 $|\ln(1+u)-u|\le C u^2$，故 $n$ 项余量总和不超过 $CM^2/n\to0$。主项是黎曼和，所以极限闭合。` }
    ]
  }),
  companion({
    id: 'problem-4-three-sine-integrals-order', page: '解析 PDF 269 · 书页 263 · 第 4 题',
    fingerprint: 'integral-comparison:sine-kernels-reflection-and-partial-fraction',
    title: '1000题第 4 题 · 三个正弦积分的大小关系',
    statement: raw`设

$$I_1=\int_0^{2\pi}\frac{\sin x}{x}\,dx,\qquad
I_2=\int_0^{2\pi}\frac{\sin x}{2\pi-x}\,dx,$$

$$I_3=\int_0^{2\pi}\frac{\sin x}{x(2\pi-x)}\,dx.$$

比较 $I_1,I_2,I_3$ 的大小。`,
    tags: ['定积分比较', '区间反射', '正弦积分'],
    coreMethod: raw`在 $\pi$ 处分段并反射第二段，分别判断 $I_1$ 的符号、$I_2$ 与 $I_1$ 的关系，再用部分分式处理 $I_3$。`,
    mistakes: raw`因为 $\sin x$ 在完整周期积分为零，就忽略分母权重；或把 $x\mapsto2\pi-x$ 后的负号写错。`,
    answerText: raw`$$I_2<I_3<I_1,$$ 其中 $I_2=-I_1<0$、$I_3=0$。`,
    solutionMethods: [
      { title: '方法一 · 分段反射', content: raw`把 $I_1$ 的后半段令 $x=\pi+t$，得到

$$I_1=\int_0^\pi\sin t\left(\frac1t-\frac1{\pi+t}\right)dt>0.$$

对 $I_2$ 作 $x=2\pi-t$，得 $I_2=-I_1<0$。又

$$\frac1{x(2\pi-x)}=\frac1{2\pi}\left(\frac1x+\frac1{2\pi-x}\right),$$

故 $I_3=(I_1+I_2)/(2\pi)=0$。` },
      { title: '方法二 · 权重配对', content: raw`把每个积分中 $x$ 与 $2\pi-x$ 配对。$I_1$ 的配对权重差在 $(0,\pi)$ 上为正，故 $I_1>0$；$I_2$ 的配对正好取反；$I_3$ 的权函数关于 $\pi$ 对称而正弦反对称，所以积分为零。` }
    ]
  }),
  companion({
    id: 'problem-5-two-positive-integrals', page: '解析 PDF 269 · 书页 263 · 第 5 题',
    fingerprint: 'integral-sign:oscillatory-square-phase-and-symmetric-rationalization',
    title: '1000题第 5 题 · 振荡积分与对称积分的符号',
    statement: raw`判断下列两个积分的符号，并求出能够精确计算的积分值：

$$I_1=\int_0^{\sqrt{2\pi}}\sin(x^2)\,dx,\qquad
I_2=\int_{-\pi/4}^{\pi/4}\frac{dx}{1+\sin x}.$$`,
    tags: ['定积分符号', '对称区间', '振荡积分'],
    coreMethod: raw`第一个积分令 $t=x^2$ 后按半周期配对；第二个在对称区间把 $f(x)$ 与 $f(-x)$ 相加。`,
    mistakes: raw`看到 $\sin(x^2)$ 变号便断言正负面积抵消，忽略换元后权重 $1/\sqrt t$ 递减；或把 $I_2$ 的奇函数部分单独误判。`,
    answerText: raw`$I_1>0$，且 $I_2=2>0$。`,
    solutionMethods: [
      { title: '方法一 · 换元后配对', content: raw`令 $t=x^2$，则

$$I_1=\int_0^{2\pi}\frac{\sin t}{2\sqrt t}\,dt
=\int_0^\pi\sin u\left(\frac1{2\sqrt u}-\frac1{2\sqrt{u+\pi}}\right)du>0.$$

正半波的权重大于负半波，因此严格为正。` },
      { title: '方法二 · 对称化计算第二项', content: raw`由

$$\frac1{1+\sin x}+\frac1{1-\sin x}=\frac2{\cos^2x},$$

得到

$$I_2=\int_0^{\pi/4}\frac2{\cos^2x}dx=2\tan\frac\pi4=2.$$

结合第一项的配对结论，两个积分都为正。` }
    ]
  }),
  companion({
    id: 'problem-6-integral-square-identity', page: '解析 PDF 270 · 书页 264 · 第 6 题',
    fingerprint: 'integral-square:complete-square-and-zero-continuous-integrand',
    title: '1000题第 6 题 · 积分平方恒等式反求函数',
    statement: raw`设 $f$ 在 $[0,1]$ 上连续，且

$$\int_0^1f^2(x)\,dx-\int_0^12x^2f(x)\,dx+\frac15=0.$$

求 $f(x)$。`,
    tags: ['积分非负性', '配方', '函数反求'],
    coreMethod: raw`利用 $\int_0^1x^4dx=1/5$，把整个等式配成连续函数平方的积分为零。`,
    mistakes: raw`只由积分为零推出被积函数处处为零，却不检查被积函数非负与连续；二者缺一不可。`,
    answerText: raw`$$f(x)=x^2\qquad(0\le x\le1).$$`,
    solutionMethods: [
      { title: '方法一 · 积分配方', content: raw`原式等价于

$$\int_0^1[f(x)-x^2]^2dx=0.$$

被积函数连续且非负，若某点严格为正，则在其邻域仍为正并产生正积分，矛盾。因此 $f(x)-x^2\equiv0$。` },
      { title: '方法二 · Cauchy 等号条件', content: raw`把原式看成 $L^2[0,1]$ 中的距离平方 $\|f-x^2\|_2^2=0$，故 $f=x^2$ 几乎处处。再由 $f-x^2$ 连续，将几乎处处相等提升为处处相等。` }
    ]
  }),
  companion({
    id: 'problem-7-absolute-composite-parity', page: '解析 PDF 270 · 书页 264 · 第 7 题',
    fingerprint: 'variable-integral:absolute-composition-parity-and-one-sided-derivatives',
    title: '1000题第 7 题 · 绝对值复合变上限积分的奇偶性与可导性',
    statement: raw`设

$$F(x)=\int_0^{|\sin x|}e^{t^2}\,dt,\qquad
G(x)=\int_0^{|x|}\sin(t^2)\,dt.$$

判断 $F,G$ 的奇偶性，并判断它们在 $x=0$ 处是否可导。`,
    tags: ['变上限积分', '奇偶性', '单侧导数'],
    coreMethod: raw`先由上限含绝对值判断偶性，再分别计算零点左右差商；可导性取决于外层原函数在零点的一阶主项。`,
    mistakes: raw`认为偶函数一定在零点可导，或机械写成上限处被积函数乘 $|x|'$ 而忽略绝对值在零点不可导。`,
    answerText: raw`$F,G$ 都是偶函数；$F$ 在 $0$ 处不可导，而 $G$ 在 $0$ 处可导且 $G'(0)=0$。`,
    solutionMethods: [
      { title: '方法一 · 左右差商', content: raw`当 $x\to0^+$ 时

$$\frac{F(x)-F(0)}x\to1,$$

当 $x\to0^-$ 时极限为 $-1$，故 $F$ 不可导。对 $G$，两侧差商分别趋于 $\sin(x^2)$ 与 $-\sin(x^2)$，都趋于零，所以 $G'(0)=0$。` },
      { title: '方法二 · 零点阶数', content: raw`由 $\int_0^u e^{t^2}dt\sim u$，有 $F(x)\sim|x|$，零点形成尖角。又 $\sin(t^2)\sim t^2$，故

$$G(x)\sim\frac{|x|^3}{3},$$

它在零点的一阶导数为零。两个上限都是偶函数，所以两函数均为偶函数。` }
    ]
  }),
  companion({
    id: 'problem-8-integral-constant-functional-equation', page: '解析 PDF 270-271 · 书页 264-265 · 第 8 题',
    fingerprint: 'integral-equation:scalar-square-integral-quadratic-self-consistency',
    title: '1000题第 8 题 · 含积分常数的函数方程',
    statement: raw`设 $f$ 在 $[0,1]$ 上连续，满足

$$f(x)=3x-\sqrt{1-x^2}\int_0^1f^2(t)\,dt.$$

求所有可能的 $f(x)$。`,
    tags: ['积分方程', '待定常数', '二次方程'],
    coreMethod: raw`把积分整体记为非负常数 $A$，先得到 $f$ 的显式形式，再把它代回 $A=\int f^2$ 建立自洽方程。`,
    mistakes: raw`把积分中的哑变量 $t$ 与外部自变量 $x$ 混用，或解出两个 $A$ 后擅自丢掉其中一个非负根。`,
    answerText: raw`共有两组解：

$$f(x)=3x-3\sqrt{1-x^2},$$

或

$$f(x)=3x-\frac32\sqrt{1-x^2}.$$`,
    solutionMethods: [
      { title: '方法一 · 待定积分常数', content: raw`令 $A=\int_0^1f^2(t)dt\ge0$，则 $f(x)=3x-A\sqrt{1-x^2}$。代回得到

$$A=\int_0^1[3x-A\sqrt{1-x^2}]^2dx
=3-2A+\frac23A^2.$$

所以 $2A^2-9A+9=0$，解得 $A=3$ 或 $A=3/2$。` },
      { title: '方法二 · 三个标准积分复核', content: raw`展开平方只需

$$\int_0^1x^2dx=\frac13,\quad
\int_0^1x\sqrt{1-x^2}dx=\frac13,\quad
\int_0^1(1-x^2)dx=\frac23.$$

由此直接复核自洽式 $A=3-2A+2A^2/3$，两根均非负且代回成立。` }
    ]
  }),
  companion({
    id: 'problem-9-floor-improper-integral', page: '解析 PDF 271 · 书页 265 · 第 9 题',
    fingerprint: 'improper-integral:floor-m-over-x-substitution-and-series-comparison',
    title: '1000题第 9 题 · 含取整函数的瑕积分敛散性',
    statement: raw`设 $m,n>0$，其中 $[u]$ 表示不超过 $u$ 的最大整数。判断反常积分

$$\int_0^n\sqrt x\left[\frac mx\right]dx$$

的敛散性。`,
    tags: ['反常积分', '取整函数', '比较判别'],
    coreMethod: raw`令 $y=m/x$ 把零点瑕积分变成无穷区间积分，再用 $[y]\le y$ 与 $y^{-3/2}$ 比较。`,
    mistakes: raw`认为取整函数有无穷多个跳点就必然发散；真正决定敛散的是零点附近的增长阶。`,
    answerText: raw`对任意 $m,n>0$，该反常积分都收敛。`,
    solutionMethods: [
      { title: '方法一 · 倒数换元', content: raw`令 $y=m/x$，则

$$\int_0^n\sqrt x\left[\frac mx\right]dx
=m^{3/2}\int_{m/n}^{+\infty}\frac{[y]}{y^{5/2}}dy.$$

当 $y>0$ 时 $[y]\le y$，而 $\int_A^{+\infty}y^{-3/2}dy$ 收敛，故原积分收敛。` },
      { title: '方法二 · 按取整数分段', content: raw`在 $m/(k+1)<x\le m/k$ 上有 $[m/x]=k$。靠近零点的尾和受

$$\sum_{k\ge K}k\int_{m/(k+1)}^{m/k}\sqrt x\,dx$$

控制，其通项为 $O(k^{-3/2})$，故级数收敛。` }
    ]
  }),
  companion({
    id: 'problem-10-log-power-two-endpoints', page: '解析 PDF 271 · 书页 265 · 第 10 题',
    fingerprint: 'improper-integral:x-power-log-power-both-endpoints',
    title: '1000题第 10 题 · 幂与对数共同控制的双端瑕积分',
    statement: raw`讨论参数 $p,q$ 取何值时，反常积分

$$\int_0^1\frac{dx}{x^p|\ln x|^q}$$

收敛。`,
    tags: ['反常积分', '参数', '双端审敛'],
    coreMethod: raw`零点端作指数换元，右端用 $|\ln x|\sim1-x$；两个端点必须同时收敛。`,
    mistakes: raw`只检查 $x=0$ 而漏掉 $x=1$ 也是瑕点，或把 $p=1$ 时零点端的对数判据与右端条件混在一起。`,
    answerText: raw`当且仅当
$$p<1,\qquad q<1$$
时收敛。`,
    solutionMethods: [
      { title: '方法一 · 两端分别比较', content: raw`当 $x\to1^-$ 时，$|\ln x|\sim1-x$，故需 $q<1$。当 $x\to0^+$ 时，若 $p<1$，幂函数已经保证可积，对数任意固定次幂都不改变结论；若 $p>1$ 必发散。$p=1$ 虽要求 $q>1$，却与右端的 $q<1$ 冲突。因此只剩 $p<1,q<1$。` },
      { title: '方法二 · 指数换元统一零点', content: raw`令 $x=e^{-t}$，零点端化为

$$\int^{+\infty}e^{-(1-p)t}t^{-q}dt.$$

在 $p<1$ 时指数衰减保证收敛；$p=1$ 时需 $q>1$；$p>1$ 发散。再与 $x=1$ 端的 $q<1$ 取交集，得到答案。` }
    ]
  }),
  companion({
    id: 'problem-11-log-tail-parameter-function', page: '解析 PDF 271-272 · 书页 265-266 · 第 11 题',
    fingerprint: 'parameter-integral:log-tail-domain-explicit-form-and-minimum',
    title: '1000题第 11 题 · 参数反常积分的定义域与最小值',
    statement: raw`定义

$$f(x)=\int_2^{+\infty}\frac{dt}{t(\ln t)^{x+1}}.$$

求 $f$ 的定义域、显式表达式，并求其最小值点。`,
    tags: ['参数积分', '反常积分', '最值'],
    coreMethod: raw`令 $u=\ln t$ 精确算出积分，再把求最小值转化为最大化分母 $x(\ln2)^x$。`,
    mistakes: raw`只求出原函数而不检查无穷上限收敛条件；或对 $(\ln2)^x$ 求导时漏乘 $\ln\ln2$。`,
    answerText: raw`定义域为 $(0,+\infty)$，且

$$f(x)=\frac1{x(\ln2)^x}.$$

最小值点为
$$x_0=-\frac1{\ln\ln2},$$
最小值为 $-e\ln\ln2$。`,
    solutionMethods: [
      { title: '方法一 · 先积分再求导', content: raw`令 $u=\ln t$，得 $\int_{\ln2}^{+\infty}u^{-x-1}du$，仅在 $x>0$ 时收敛，值为 $1/[x(\ln2)^x]$。令 $g=x(\ln2)^x$，则

$$g'=(\ln2)^x[1+x\ln\ln2].$$

因此 $g$ 在 $x_0=-1/\ln\ln2$ 取得最大值，$f=1/g$ 在同一点最小。` },
      { title: '方法二 · 对数求导', content: raw`对 $f$ 取对数：

$$\ln f=-\ln x-x\ln\ln2.$$

故 $(\ln f)'=-1/x-\ln\ln2$，唯一驻点为 $x_0$。二阶导数 $1/x^2>0$，所以这是严格最小点；代入并用 $(\ln2)^{x_0}=e^{-1}$ 得最小值。` }
    ]
  }),
  companion({
    id: 'problem-12-two-end-parameter-improper', page: '解析 PDF 272 · 书页 266 · 第 12 题',
    fingerprint: 'improper-integral:log-over-x-p-one-minus-x-one-minus-p',
    title: '1000题第 12 题 · 同一参数控制两个瑕点',
    statement: raw`讨论参数 $p$ 取何值时，反常积分

$$\int_0^1\frac{\ln x}{x^p(1-x)^{1-p}}\,dx$$

收敛。`,
    tags: ['反常积分', '参数', '双端审敛'],
    coreMethod: raw`在零点保留 $\ln x/x^p$ 的主导行为，在右端使用 $\ln x\sim-(1-x)$，分别得到上下界条件。`,
    mistakes: raw`把两端的幂指数写成同一个判据，或漏掉 $\ln x$ 在 $x=1$ 处额外提供一个一阶零点。`,
    answerText: raw`当且仅当
$$-1<p<1$$
时收敛。`,
    solutionMethods: [
      { title: '方法一 · 两端极限比较', content: raw`当 $x\to0^+$ 时，$(1-x)^{1-p}\to1$，需考察 $x^{-p}\ln x$，其可积条件为 $p<1$。当 $x\to1^-$ 时，

$$\frac{\ln x}{x^p(1-x)^{1-p}}\sim-(1-x)^p,$$

可积条件为 $p>-1$。取交集即得 $-1<p<1$。` },
      { title: '方法二 · 小量阶数判据', content: raw`零点端利用 $|\ln x|=o(x^{-\varepsilon})$ 得到充分性，并用极限比较确认边界 $p=1$ 发散；右端令 $u=1-x$，则 $\ln(1-u)\sim-u$，积分与 $\int_0u^pdu$ 同敛散，故需 $p>-1$。` }
    ]
  }),
  companion({
    id: 'problem-15-improper-divergence-screening', page: '解析 PDF 273 · 书页 267 · 第 15 题',
    fingerprint: 'improper-integral:screen-log-singularity-inside-domain',
    title: '1000题第 15 题 · 识别隐藏内部瑕点的发散积分',
    statement: raw`下列反常积分中发散的是（ ）。`,
    tags: ['反常积分', '瑕点筛查', '选择题'],
    coreMethod: raw`逐项列出零点、无穷远和区间内部的全部异常点；内部点 $x=1$ 不能被积分区间的整体写法掩盖。`,
    mistakes: raw`只看 $x\to0$ 与 $x\to+\infty$，漏掉 $\ln x=0$ 造成的内部二阶奇点。`,
    answerText: raw`正确选项为 C。`,
    questionFormat: 'single-choice',
    options: [
      raw`$\displaystyle\int_0^{+\infty}\frac{e^{-x}}{\sqrt x}\,dx$`,
      raw`$\displaystyle\int_0^{+\infty}x^2e^{-x^2}\,dx$`,
      raw`$\displaystyle\int_0^{+\infty}\frac{dx}{x\ln^2x}$`,
      raw`$\displaystyle\int_0^{+\infty}\frac{dx}{(x+2)\ln^2(x+2)}$`
    ],
    correctOptionIds: ['C'],
    solutionMethods: [
      { title: '方法一 · 逐项局部判阶', content: raw`A 在零点为 $x^{-1/2}$ 型、无穷远有指数衰减；B 两端均可积；D 的原函数为 $-1/\ln(x+2)$，也收敛。C 在 $x=1$ 附近满足 $\ln x\sim x-1$，故被积函数与 $1/(x-1)^2$ 同阶，发散。` },
      { title: '方法二 · 分段原函数核验', content: raw`对 C 在 $(0,1)$ 与 $(1,+\infty)$ 分开，原函数为 $-1/\ln x$，当 $x\to1^\pm$ 均无有限极限，所以不是可用主值抵消的普通反常积分。其余三项分别用 Gamma 型估计、指数比较和直接积分确认收敛。` }
    ]
  }),
  companion({
    id: 'problem-16-radical-improper-convergence', page: '解析 PDF 273-274 · 书页 267-268 · 第 16 题',
    fingerprint: 'improper-integral:radical-endpoint-tail-screening-four-options',
    title: '1000题第 16 题 · 根式反常积分的两端联合审敛',
    statement: raw`下列反常积分中收敛的是（ ）。`,
    tags: ['反常积分', '根式瑕点', '选择题'],
    coreMethod: raw`每一项都要同时检查 $x=1$ 附近与无穷远，只有两个端点都可积才算收敛。`,
    mistakes: raw`仅凭无穷远衰减很快就判收敛，忽略下限 $x=1$ 处可能出现一阶或更强奇性。`,
    answerText: raw`正确选项为 C。`,
    questionFormat: 'single-choice',
    options: [
      raw`$\displaystyle\int_1^{+\infty}\frac{dx}{\sqrt{x^2-1}}$`,
      raw`$\displaystyle\int_1^{+\infty}\frac{dx}{\sqrt{x(x-1)}}$`,
      raw`$\displaystyle\int_1^{+\infty}\frac{dx}{x^2\sqrt{x^2-1}}$`,
      raw`$\displaystyle\int_1^{+\infty}\frac{dx}{x(x^2-1)}$`
    ],
    correctOptionIds: ['C'],
    solutionMethods: [
      { title: '方法一 · 两端阶数表', content: raw`A、B 在 $x=1$ 附近均为 $(x-1)^{-1/2}$ 型可积，但在无穷远都与 $1/x$ 同阶而发散。C 在下限仍为 $(x-1)^{-1/2}$ 型，在无穷远为 $x^{-3}$ 型，两端都收敛。D 在 $x=1$ 附近与 $1/[2(x-1)]$ 同阶，发散。` },
      { title: '方法二 · 三角换元复核 C', content: raw`对 C 令 $x=\sec\theta$，$\theta\in[0,\pi/2)$，则

$$\frac{dx}{x^2\sqrt{x^2-1}}=\cos\theta\,d\theta.$$

积分值为 $\int_0^{\pi/2}\cos\theta d\theta=1$，因此确实收敛；其余项可由端点极限比较排除。` }
    ]
  }),
  companion({
    id: 'problem-17-differential-form-and-integral-smoothing', page: '解析 PDF 274 · 书页 268 · 第 17 题',
    fingerprint: 'variable-integral:solve-linear-equation-and-remove-absolute-cusp',
    title: '1000题第 17 题 · 微分方程解与变上限积分的可导性',
    statement: raw`函数 $y=y(x)$ 满足

$$[(1+x)y-1]dx+x(1+x)dy=0,\qquad y(1)=\ln2.$$

先求 $y(x)$。再令

$$F(x)=\int_{-1}^{x}y(|t|)\,dt,$$

其中在 $t=0$ 处按连续延拓取值，判断 $F$ 在 $x=0$ 处是否可导并求导数。`,
    tags: ['一阶线性方程', '变上限积分', '可去间断'],
    coreMethod: raw`先用积分因子解出 $y$，再识别 $y(|t|)$ 在零点的奇性可去；积分上限求导只取连续延拓后的值。`,
    mistakes: raw`看到表达式中有 $|t|$ 就直接断言不可导，忽略外层积分会把连续被积函数平滑一次。`,
    answerText: raw`$$y(x)=\frac{\ln(1+x)}x\quad(-1<x<0\text{ 或 }x>0).$$

$F$ 在 $0$ 处可导，且 $F'(0)=1$。`,
    solutionMethods: [
      { title: '方法一 · 积分因子与基本定理', content: raw`方程化为

$$y'+\frac yx=\frac1{x(1+x)}.$$

乘积分因子 $x$ 得 $(xy)'=1/(1+x)$，所以 $xy=\ln(1+x)+C$。由 $y(1)=\ln2$ 得 $C=0$。又

$$\lim_{t\to0}\frac{\ln(1+|t|)}{|t|}=1,$$

故被积函数在零点连续延拓，基本定理给出 $F'(0)=1$。` },
      { title: '方法二 · 差商直接验证', content: raw`由解得 $y(|t|)=\ln(1+|t|)/|t|$。于是

$$\frac{F(x)-F(0)}x=\frac1x\int_0^x\frac{\ln(1+|t|)}{|t|}dt.$$

被积函数在 $t\to0$ 时趋于 $1$，其积分平均值也趋于 $1$，左右极限一致。` }
    ]
  }),
  companion({
    id: 'problem-18-riemann-defined-inflection', page: '解析 PDF 274-275 · 书页 268-269 · 第 18 题',
    fingerprint: 'riemann-defined-function:gaussian-integral-transform-inflection',
    title: '1000题第 18 题 · 黎曼和定义函数后的拐点判断',
    statement: raw`定义

$$f(x)=\lim_{n\to\infty}\frac xn\sum_{i=1}^{n}
e^{-(ix/n)^2},\qquad y(x)=e^{x^2}f(x).$$

判断曲线 $y=y(x)$ 的凹凸性并求拐点。`,
    tags: ['黎曼和', '凹凸性', '拐点'],
    coreMethod: raw`先把黎曼和还原为 $f(x)=\int_0^xe^{-t^2}dt$，再利用变上限积分求导并对二阶导数判号。`,
    mistakes: raw`在仍是求和极限的形式下直接求导，或只由 $y''(0)=0$ 就断言拐点而不检查两侧符号。`,
    answerText: raw`$y$ 在 $(-\infty,0)$ 上为凹，在 $(0,+\infty)$ 上为凸，唯一拐点为 $(0,0)$。`,
    solutionMethods: [
      { title: '方法一 · 黎曼和后两次求导', content: raw`由定积分定义，

$$f(x)=\int_0^xe^{-t^2}dt.$$

因此

$$y'=2xe^{x^2}\int_0^xe^{-t^2}dt+1,$$

$$y''=2\left[(1+2x^2)e^{x^2}\int_0^xe^{-t^2}dt+x\right].$$

括号内在 $x>0$ 时为正，在 $x<0$ 时为负，且 $y''(0)=0$，故凹凸性在零点改变。` },
      { title: '方法二 · 奇偶性辅助判号', content: raw`$f$ 是奇函数，$e^{x^2}$ 是偶函数，所以 $y$ 为奇函数，$y''$ 也为奇函数。对 $x>0$，二阶导数公式中的积分与 $x$ 都为正，故 $y''>0$；由奇性立刻得到 $x<0$ 时 $y''<0$。又 $y(0)=0$，拐点为原点。` }
    ]
  }),
  companion({
    id: 'problem-19-inverse-range-riemann-squeeze', page: '解析 PDF 275 · 书页 269 · 第 19 题',
    fingerprint: 'riemann-sum:bounded-composite-denominator-squeeze-to-beta-integral',
    title: '1000题第 19 题 · 反函数值域控制分母的黎曼和',
    statement: raw`设 $f$ 与 $\varphi$ 互为反函数，且在 $[-1,3]$ 上

$$f[\varphi(x)]=\varphi^2(x)=-x^2+2x+3,\qquad \varphi(x)>0.$$

计算

$$\lim_{n\to\infty}\frac1{n^3}\sum_{i=1}^{n}
\frac{i^2(n-i)}{n+\varphi(i/n)}.$$`,
    tags: ['黎曼和', '反函数', '夹逼定理'],
    coreMethod: raw`先由 $\varphi(x)=\sqrt{-x^2+2x+3}$ 得到统一有界范围，再把分母夹在 $n$ 与 $n+2$ 之间。`,
    mistakes: raw`试图逐项精确展开 $\varphi(i/n)$，没有利用它相对 $n$ 只是有界扰动；或漏掉外部 $1/n^3$ 的尺度。`,
    answerText: raw`极限为
$$\frac1{12}.$$`,
    solutionMethods: [
      { title: '方法一 · 一致夹逼', content: raw`由题设

$$\varphi(x)=\sqrt{-x^2+2x+3},$$

在 $[-1,3]$ 上值域为 $[0,2]$。因此

$$\frac1{n+2}\sum_{i=1}^n\left(\frac in\right)^2\left(1-\frac in\right)
\le S_n\le
\frac1n\sum_{i=1}^n\left(\frac in\right)^2\left(1-\frac in\right).$$

两端都趋于 $\int_0^1x^2(1-x)dx=1/12$。` },
      { title: '方法二 · 分母一致等价', content: raw`因 $0\le\varphi(i/n)\le2$，有

$$\frac n{n+\varphi(i/n)}\to1$$

且关于 $i$ 一致。于是原和与标准黎曼和

$$\frac1n\sum_{i=1}^n\left(\frac in\right)^2\left(1-\frac in\right)$$

之差趋于零，积分值为 $1/3-1/4=1/12$。` }
    ]
  })
]
