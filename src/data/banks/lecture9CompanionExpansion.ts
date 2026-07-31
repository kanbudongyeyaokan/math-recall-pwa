import type { SeedInput } from './types'

const raw = String.raw
const ZY1000_SOURCE = '何耀焜私人整理 · 张宇《1000题》数一解析册 · 第9章逐页核验'

type CompanionSeed = Omit<SeedInput, 'id' | 'kind' | 'tags' | 'methodFingerprint' | 'source'> & {
  id: string
  tags: string[]
  fingerprint: string
}

function companion(input: CompanionSeed): SeedInput {
  return {
    ...input,
    id: `zy1000-verified-l09-${input.id}`,
    kind: 'problem',
    source: ZY1000_SOURCE,
    tags: ['高等数学', '第9讲', '经典例题', 'PDF逐页核验', ...input.tags],
    methodFingerprint: `zy1000-verified:l09:${input.fingerprint}`
  }
}

export const lecture9CompanionExpansionSeeds: SeedInput[] = [
  companion({
    id: 'problem-2-linear-quadratic-partial-fractions', page: '解析 PDF 276 · 书页 270 · 第 2 题',
    fingerprint: 'partial-fractions:linear-factor-plus-irreducible-quadratic-numerator-matching',
    title: '1000题第 2 题 · 一次因式与不可约二次因式的部分分式',
    statement: raw`求不定积分

$$\int\frac{x+2}{(2x+1)(x^2+x+1)}\,dx.$$`,
    tags: ['不定积分', '部分分式', '配方'],
    coreMethod: raw`按一次因式与不可约二次因式配置分子，通过代特殊值和比较系数确定常数，再把二次分子配成分母导数与常数。`,
    mistakes: raw`二次因式上必须配置一次分子 $Bx+D$；若只写常数，会丢失自由度并导致分解无解。`,
    answerText: raw`$$\ln|2x+1|-\frac12\ln(x^2+x+1)+\frac1{\sqrt3}\arctan\frac{2x+1}{\sqrt3}+C.$$`,
    solutionMethods: [
      { title: '方法一 · 部分分式与配方', content: raw`设

$$\frac{x+2}{(2x+1)(x^2+x+1)}=\frac A{2x+1}+\frac{Bx+D}{x^2+x+1}.$$

通分并代入 $x=-1/2,0,1$，得 $A=2,B=-1,D=0$。于是

$$I=\int\left(\frac2{2x+1}-\frac{x}{x^2+x+1}\right)dx.$$

再写 $x=[(2x+1)-1]/2$，对二次式配方，即得答案。` },
      { title: '方法二 · 对答案求导复核', content: raw`设候选原函数为

$$F=\ln|2x+1|-\frac12\ln(x^2+x+1)+\frac1{\sqrt3}\arctan\frac{2x+1}{\sqrt3}.$$

逐项求导后，后二项合并为 $-x/(x^2+x+1)$，第一项为 $2/(2x+1)$。通分得到 $(x+2)/[(2x+1)(x^2+x+1)]$，与被积函数一致。` }
    ]
  }),
  companion({
    id: 'problem-5-exponential-square-root-tail', page: '解析 PDF 277 · 书页 271 · 第 5 题',
    fingerprint: 'improper-integral:square-root-substitution-exponential-tail-by-parts',
    title: '1000题第 5 题 · 根号指数型无穷区间积分',
    statement: raw`计算反常积分

$$\int_1^{+\infty}2^{-\sqrt x}\,dx.$$`,
    tags: ['反常积分', '根式换元', '分部积分'],
    coreMethod: raw`令 $t=\sqrt x$ 同时处理根号指数与微分，把问题化为一次多项式乘指数衰减的尾积分。`,
    mistakes: raw`换元后漏掉 $dx=2t\,dt$，或在无穷远边界错误保留 $t2^{-t}$；指数衰减快于一次幂增长。`,
    answerText: raw`$$\frac1{\ln2}+\frac1{(\ln2)^2}.$$`,
    solutionMethods: [
      { title: '方法一 · 根式换元后分部积分', content: raw`令 $t=\sqrt x$，则

$$I=2\int_1^{+\infty}t2^{-t}dt.$$

利用 $d(2^{-t})=-(\ln2)2^{-t}dt$ 分部积分，并注意 $t2^{-t}\to0$，得到

$$I=\frac1{\ln2}+\frac1{(\ln2)^2}.$$` },
      { title: '方法二 · 指数尾积分公式', content: raw`写 $a=\ln2$，则

$$I=2\int_1^{+\infty}te^{-at}dt.$$

原函数为 $-e^{-at}(t/a+1/a^2)$。代入端点并用 $e^{-a}=1/2$，得到 $2\cdot\frac12(1/a+1/a^2)$，即所给答案。` }
    ]
  }),
  companion({
    id: 'problem-8-absolute-kernel-piecewise-integral', page: '解析 PDF 277-278 · 书页 271-272 · 第 8 题',
    fingerprint: 'absolute-kernel:translate-interval-and-split-parameter-three-regions',
    title: '1000题第 8 题 · 平移绝对值核的三段积分',
    statement: raw`设

$$f(t)=\int_0^1 t|t-x|\,dx,$$

计算

$$\int_{-1}^{2}f(t)\,dt.$$`,
    tags: ['含参积分', '绝对值', '分段函数'],
    coreMethod: raw`先令 $u=t-x$ 把积分区间改写为 $[t-1,t]$，再按该区间位于零点左侧、跨过零点或位于右侧分三段。`,
    mistakes: raw`绝对值符号由 $t-x$ 决定，不能直接沿用 $0<t<1$ 的拆分；外层还必须在 $t=0,1$ 处分成三个区间。`,
    answerText: raw`$$\int_{-1}^{2}f(t)dt=\frac76.$$`,
    solutionMethods: [
      { title: '方法一 · 平移后按区间位置分段', content: raw`令 $u=t-x$，则

$$f(t)=t\int_{t-1}^{t}|u|du
=\begin{cases}
-t^2+\dfrac t2,&t\le0,\\
t^3-t^2+\dfrac t2,&0<t<1,\\
t^2-\dfrac t2,&t\ge1.
\end{cases}$$

分别在 $[-1,0]$、$[0,1]$、$[1,2]$ 积分，三段依次为 $-7/12,1/6,19/12$，总和为 $7/6$。` },
      { title: '方法二 · 在原变量中拆绝对值', content: raw`对 $t\le0$，在 $0\le x\le1$ 上恒有 $t-x\le0$；对 $0<t<1$，在 $x=t$ 处分段；对 $t\ge1$，恒有 $t-x\ge0$。逐段直接算出同一个 $f(t)$ 分段式，再完成外层三段多项式积分，结果仍为 $7/6$。` }
    ]
  }),
  companion({
    id: 'problem-18-log-power-integral-recurrence', page: '解析 PDF 280 · 书页 274 · 第 18 题',
    fingerprint: 'reduction:logarithm-power-integral-recursion-factorial-closed-form',
    title: '1000题第 18 题 · 对数幂积分的递推通项',
    statement: raw`设 $n$ 为非负整数，计算

$$a_n=\int_0^1x^2\ln^n x\,dx.$$`,
    tags: ['递推积分', '分部积分', '对数幂'],
    coreMethod: raw`以 $x^2dx=d(x^3/3)$ 分部积分，把对数幂次从 $n$ 降到 $n-1$，再结合 $a_0$ 得到通项。`,
    mistakes: raw`忽略 $x\to0^+$ 时 $x^3\ln^n x\to0$，或在求导 $\ln^n x$ 时漏掉系数 $n$ 与因子 $1/x$。`,
    answerText: raw`$$a_n=\frac{(-1)^n n!}{3^{n+1}}.$$`,
    solutionMethods: [
      { title: '方法一 · 分部积分递推', content: raw`对 $n\ge1$，令 $dv=x^2dx$、$u=\ln^n x$。边界项为零，故

$$a_n=-\frac n3\int_0^1x^2\ln^{n-1}x\,dx=-\frac n3a_{n-1}.$$

又 $a_0=1/3$，连续递推得到 $a_n=(-1)^nn!/3^{n+1}$。` },
      { title: '方法二 · 参数积分求导', content: raw`对 $\alpha>-1$ 设

$$F(\alpha)=\int_0^1x^\alpha dx=\frac1{\alpha+1}.$$

在参数下求 $n$ 阶导数，得 $F^{(n)}(\alpha)=\int_0^1x^\alpha\ln^n xdx=(-1)^nn!/(\alpha+1)^{n+1}$。令 $\alpha=2$ 即得答案。` }
    ]
  }),
  companion({
    id: 'problem-20-weighted-distance-maximum', page: '解析 PDF 280-281 · 书页 274-275 · 第 20 题',
    fingerprint: 'parameter-integral:absolute-distance-convexity-endpoint-maximum',
    title: '1000题第 20 题 · 指数权距离积分的区间最大值',
    statement: raw`当 $x\in[-1,1]$ 时，设

$$I(x)=\int_{-1}^{1}|t-x|e^{2t}\,dt.$$

求 $I(x)$ 在 $[-1,1]$ 上的最大值。`,
    tags: ['含参积分', '绝对值', '最值'],
    coreMethod: raw`在移动分点 $t=x$ 处拆开绝对值，求导判断唯一驻点是极小点，因此最大值只能在两个端点中比较。`,
    mistakes: raw`求出 $I'(x)=0$ 就直接当作最大点；事实上 $I''(x)=2e^{2x}>0$，函数严格凸，内部驻点是最小点。`,
    answerText: raw`最大值在 $x=-1$ 处取得，且

$$I_{\max}=\frac34e^2+\frac14e^{-2}.$$`,
    solutionMethods: [
      { title: '方法一 · 分段后求导', content: raw`写成

$$I(x)=\int_{-1}^{x}(x-t)e^{2t}dt+\int_x^1(t-x)e^{2t}dt.$$

由 Leibniz 公式，

$$I'(x)=\int_{-1}^{x}e^{2t}dt-\int_x^1e^{2t}dt
=e^{2x}-\frac{e^2+e^{-2}}2,$$

且 $I''(x)=2e^{2x}>0$。所以最大值在端点取得。比较可得 $I(-1)>I(1)$，并算出 $I(-1)=3e^2/4+e^{-2}/4$。` },
      { title: '方法二 · 凸函数与端点比较', content: raw`对每个固定的 $t$，函数 $x\mapsto|t-x|e^{2t}$ 是凸函数，积分后 $I(x)$ 仍为凸函数，因此闭区间最大值必在端点。直接计算

$$I(-1)=\int_{-1}^1(t+1)e^{2t}dt=\frac34e^2+\frac14e^{-2},$$

$$I(1)=\int_{-1}^1(1-t)e^{2t}dt=\frac14e^2-\frac54e^{-2},$$

前者更大。` }
    ]
  }),
  companion({
    id: 'problem-27-bernoulli-equation-square-integral', page: '解析 PDF 283-284 · 书页 277-278 · 第 27 题',
    fingerprint: 'differential-equation:reciprocal-separation-then-shifted-quadratic-square-integral',
    title: '1000题第 27 题 · 先解微分方程再计算平方积分',
    statement: raw`设 $y=y(x)$ 满足

$$x^2y'+(x^2-3)y^2=0,\qquad y(1)=1.$$

（1）求 $y(x)$；

（2）计算

$$\int_0^3y^2(x)\,dx.$$`,
    tags: ['微分方程', '可分离变量', '定积分'],
    coreMethod: raw`先对 $y$ 作倒数变换，将方程化为可直接积分的形式；再把解的二次分母配方，用正切换元计算平方积分。`,
    mistakes: raw`积分 $y^{-2}dy$ 时符号出错，或由初值求常数时把分母写成 $x^2-3x-3$；第二问还要同时展开分子 $x^2$。`,
    answerText: raw`$$y(x)=\frac{x}{x^2-3x+3},$$

$$\int_0^3y^2(x)dx=1+\frac{8\sqrt3\pi}{9}.$$`,
    solutionMethods: [
      { title: '方法一 · 分离变量与正切换元', content: raw`原方程整理为

$$\frac{dy}{y^2}=\left(\frac3{x^2}-1\right)dx.$$

积分并代入 $y(1)=1$，得 $y=x/(x^2-3x+3)$。第二问中令

$$x-\frac32=\frac{\sqrt3}{2}\tan u,$$

上下限对应 $u=-\pi/3,\pi/3$。把 $x^2$ 展开后，奇项在对称区间抵消，剩余三角积分给出 $1+8\sqrt3\pi/9$。` },
      { title: '方法二 · 倒数函数与对称积分', content: raw`令 $z=1/y$，则 $z'=1-3/x^2$，所以 $z=x+3/x+C$。由初值求得 $C=-3$，从而 $y=x/(x^2-3x+3)$。对第二问令 $s=x-3/2$，利用区间关于零对称，分子 $(s+3/2)^2$ 的奇项积分为零；再用标准积分

$$\int\frac{ds}{(s^2+a^2)^2}$$

与 $a=\sqrt3/2$ 代入端点，得到同一结果。` }
    ]
  }),
  companion({
    id: 'problem-28-reciprocal-reflection-improper-integral', page: '解析 PDF 284 · 书页 278 · 第 28 题',
    fingerprint: 'improper-integral:reciprocal-reflection-cancellation-across-one',
    title: '1000题第 28 题 · 倒数反射使两段反常积分相消',
    statement: raw`计算反常积分

$$\int_0^{+\infty}\frac{x\ln x}{1+x^4}\,dx.$$`,
    tags: ['反常积分', '倒数换元', '区间分拆'],
    coreMethod: raw`先在 $x=1$ 处分成两个各自收敛的反常积分，再对 $(0,1)$ 段作倒数换元，与 $(1,+\infty)$ 段逐项相消。`,
    mistakes: raw`没有先验证两段收敛便把正负部分直接抵消；或在 $x=1/t$ 时漏掉 $dx=-dt/t^2$ 与 $\ln(1/t)=-\ln t$。`,
    answerText: raw`$$0.$$`,
    solutionMethods: [
      { title: '方法一 · 在 1 处分段并倒数换元', content: raw`记

$$I_1=\int_0^1\frac{x\ln x}{1+x^4}dx,\qquad
I_2=\int_1^{+\infty}\frac{x\ln x}{1+x^4}dx.$$

两段均收敛。对 $I_1$ 令 $x=1/t$，整理得

$$I_1=-\int_1^{+\infty}\frac{t\ln t}{1+t^4}dt=-I_2.$$

故原积分 $I_1+I_2=0$。` },
      { title: '方法二 · 对数尺度上的奇函数', content: raw`令 $x=e^u$，则 $dx=e^udu$，原积分化为

$$\int_{-\infty}^{+\infty}\frac{u e^{2u}}{1+e^{4u}}du
=\frac12\int_{-\infty}^{+\infty}\frac{u}{\cosh 2u}du.$$

$1/\cosh 2u$ 为偶函数，乘以 $u$ 后为绝对可积的奇函数，因此对称区间积分为零。` }
    ]
  })
]
