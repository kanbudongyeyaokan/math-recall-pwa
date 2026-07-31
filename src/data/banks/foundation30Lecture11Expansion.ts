import type { SeedInput } from './types'

const raw = String.raw
const ZY30_SOURCE = '何耀焜私人整理 · 张宇《基础30讲》高数 · 第11讲逐页核验'

type LectureElevenSeed = Omit<SeedInput, 'id' | 'kind' | 'tags' | 'methodFingerprint' | 'source'> & {
  id: string
  role: 'example' | 'exercise'
  tags: string[]
  fingerprint: string
}

function lectureEleven(input: LectureElevenSeed): SeedInput {
  const roleLabel = input.role === 'example' ? '经典例题' : '课后习题'
  return {
    ...input,
    id: `zy30-verified-l11-${input.id}`,
    kind: 'problem',
    source: ZY30_SOURCE,
    tags: ['高等数学', '第11讲', roleLabel, 'PDF逐页核验', ...input.tags],
    methodFingerprint: `zy30-verified:l11:${input.fingerprint}`
  }
}

export const foundation30Lecture11ExpansionSeeds: SeedInput[] = [
  lectureEleven({
    id: 'example-11-1a-weighted-integral-mean', role: 'example', page: 'PDF 288 · 书页 283 · 例 11.1(1)',
    fingerprint: 'integral-equality:weighted-mean-nonchanging-sign-cauchy-mvt',
    title: '例 11.1(1) · 不变号权函数的积分中值等式',
    statement: raw`设 $f(x),g(x)$ 在 $[a,b]$ 上连续，且 $g(x)$ 在 $[a,b]$ 上不变号。证明：存在 $\xi\in(a,b)$，使

$$\int_a^b f(x)g(x)\,dx=f(\xi)\int_a^b g(x)\,dx.$$`,
    tags: ['积分等式', '积分中值定理', '正权'],
    coreMethod: raw`把 $\int fg$ 与 $\int g$ 构造成两个变上限积分，再用柯西中值定理；若 $g$ 恒为零则单独处理。`,
    mistakes: raw`只写“由中值定理”却不检查 $g$ 不变号；若 $\int_a^b g=0$，必须先说明此时 $g\equiv0$。`,
    answerText: raw`存在 $\xi\in(a,b)$ 使所给等式成立。`,
    solutionMethods: [
      { title: '方法一 · 柯西中值定理', content: raw`若 $g\equiv0$，结论显然。否则不妨设 $g>0$。令
$$F(x)=\int_a^x f(t)g(t)dt,\qquad G(x)=\int_a^x g(t)dt.$$
由柯西中值定理，存在 $\xi\in(a,b)$ 使
$$\frac{F(b)-F(a)}{G(b)-G(a)}=\frac{F'(\xi)}{G'(\xi)}=f(\xi),$$
移项即得结论；$g<0$ 时同理。` },
      { title: '方法二 · 最值夹逼与介值性', content: raw`设 $m\le f(x)\le M$。当 $g\ge0$ 时，
$$m\int_a^b g\le\int_a^bfg\le M\int_a^bg.$$
若 $\int g>0$，积分比值落在 $[m,M]$，由 $f$ 的连续性可取为 $f(\xi)$；$g\le0$ 时同时乘以 $-1$ 即可。` }
    ]
  }),
  lectureEleven({
    id: 'example-11-1b-exponential-kernel-limit', role: 'example', page: 'PDF 288 · 书页 283 · 例 11.1(2)',
    fingerprint: 'integral-limit:superexponential-kernel-weighted-mean-squeeze',
    title: '例 11.1(2) · 超快衰减核下的积分极限',
    statement: raw`设 $f$ 在 $[1,2]$ 上连续，计算
$$\lim_{n\to\infty}\int_1^2 f(x)e^{-x^n}\,dx.$$`,
    tags: ['积分极限', '夹逼准则', '积分中值定理'],
    coreMethod: raw`先用积分中值定理把有界因子 $f$ 提出，再证明核积分 $\int_1^2e^{-x^n}dx$ 趋于零。`,
    mistakes: raw`把中值点误认为与 $n$ 无关，直接写 $f(\xi)\to f(1)$；本题只需利用 $f(\xi_n)$ 有界。`,
    answerText: raw`$$0.$$`,
    solutionMethods: [
      { title: '方法一 · 中值定理与夹逼', content: raw`存在 $\xi_n\in(1,2)$ 使原积分等于
$$f(\xi_n)\int_1^2e^{-x^n}dx.$$
$f$ 在闭区间有界。又 $e^{x^n}>x^n+1$，故
$$0<\int_1^2e^{-x^n}dx<\int_1^2x^{-n}dx=\frac{2^{1-n}-1}{1-n}\to0,$$
所以极限为零。` },
      { title: '方法二 · 分段控制', content: raw`设 $|f|\le M$。任取 $\delta\in(0,1)$，把区间分成 $[1,1+\delta]$ 与 $[1+\delta,2]$：
$$\left|\int_1^2fe^{-x^n}dx\right|\le M\delta+M e^{-(1+\delta)^n}.$$
先令 $n\to\infty$，再令 $\delta\downarrow0$，得到极限为零。` }
    ]
  }),
  lectureEleven({
    id: 'example-11-2-negative-second-derivative', role: 'example', page: 'PDF 289 · 书页 284 · 例 11.2',
    fingerprint: 'existence:weighted-mean-equal-value-three-point-second-derivative-negative',
    title: '例 11.2 · 由加权平均构造负二阶导数点',
    statement: raw`设 $f$ 在 $[0,\pi/2]$ 上有二阶导数，且
$$f(0)=2,\qquad f(\pi/2)=1,\qquad \int_0^{\pi/2}f(x)e^{\sin x}\cos x\,dx=2(e-1).$$
证明：存在 $\xi\in(0,\pi/2)$，使 $f''(\xi)<0$。`,
    tags: ['存在性证明', '积分中值定理', '拉格朗日中值定理'],
    coreMethod: raw`正权中值定理先构造一个内部点 $\eta$ 满足 $f(\eta)=f(0)$，再比较左右割线斜率并对 $f'$ 使用中值定理。`,
    mistakes: raw`只由 $f(0)=f(\eta)$ 得到一个 $f'=0$ 点还不够；还要在右侧构造负斜率，才能推出 $f''<0$。`,
    answerText: raw`存在 $\xi\in(0,\pi/2)$ 使 $f''(\xi)<0$。`,
    solutionMethods: [
      { title: '方法一 · 三次中值定理', content: raw`因 $\int_0^{\pi/2}e^{\sin x}\cos xdx=e-1$，正权中值定理给出 $\eta\in(0,\pi/2)$，使 $f(\eta)=2$。由 $f(0)=f(\eta)$，存在 $\xi_1\in(0,\eta)$ 使 $f'(\xi_1)=0$。又
$$\frac{f(\pi/2)-f(\eta)}{\pi/2-\eta}<0,$$
故存在 $\xi_2\in(\eta,\pi/2)$ 使 $f'(\xi_2)<0$。对 $f'$ 在 $[\xi_1,\xi_2]$ 用中值定理，得某 $\xi$ 满足 $f''(\xi)<0$。` },
      { title: '方法二 · 反证单调导数', content: raw`仍由加权中值得到 $\eta$ 且 $f(\eta)=f(0)=2$。若处处 $f''\ge0$，则 $f'$ 单调不减。左段的零割线斜率与右段的负割线斜率分别等于某两个导数值，且右侧点更大，这与 $f'$ 单调不减矛盾。因此必有一点 $f''<0$。` }
    ]
  }),
  lectureEleven({
    id: 'example-11-3-beta-kernel-limit', role: 'example', page: 'PDF 290 · 书页 285 · 例 11.3',
    fingerprint: 'integral-limit:beta-kernel-concentrates-at-one-integration-by-parts',
    title: '例 11.3 · 幂核集中到端点的积分极限',
    statement: raw`计算
$$\lim_{n\to\infty}\int_0^1(n+1)x^n\ln(1+x)\,dx.$$`,
    tags: ['积分极限', '分部积分', '选择题'],
    coreMethod: raw`识别 $(n+1)x^n$ 是总质量为 $1$、向 $x=1$ 集中的核；也可分部积分后夹逼余项。`,
    mistakes: raw`把 $x^n\to0$ 直接移入积分，忽略前面的 $n+1$；该核的总积分始终为 $1$。`,
    answerText: raw`正确选项为 A，极限为 $\ln2$。`,
    questionFormat: 'single-choice',
    options: ['$\\ln2$', '$1$', '$e^2$', '$+\\infty$'],
    correctOptionIds: ['A'],
    solutionMethods: [
      { title: '方法一 · 分部积分与夹逼', content: raw`分部积分得
$$\int_0^1(n+1)x^n\ln(1+x)dx=\ln2-\int_0^1\frac{x^{n+1}}{1+x}dx.$$
而
$$0\le\int_0^1\frac{x^{n+1}}{1+x}dx\le\frac1{n+2}\to0,$$
故极限为 $\ln2$。` },
      { title: '方法二 · 集中核', content: raw`令 $w_n=(n+1)x^n$，则 $\int_0^1w_n=1$。对任意 $\delta>0$，$[0,1-\delta]$ 上的质量为 $(1-\delta)^{n+1}\to0$；而 $\ln(1+x)$ 在 $x=1$ 连续。因此加权平均趋于端点值 $\ln2$。` }
    ]
  }),
  lectureEleven({
    id: 'example-11-4-logarithmic-squeeze', role: 'example', page: 'PDF 290 · 书页 285 · 例 11.4',
    fingerprint: 'integral-limit:log-one-plus-t-power-squeezed-by-t-power',
    title: '例 11.4 · 对数幂积分的比较与极限',
    statement: raw`对 $n=1,2,\ldots$，比较
$$A_n=\int_0^1|\ln t|[\ln(1+t)]^n\,dt,\qquad B_n=\int_0^1t^n|\ln t|\,dt,$$
并求 $\lim_{n\to\infty}A_n$。`,
    tags: ['积分极限', '保号性', '夹逼准则'],
    coreMethod: raw`在 $[0,1]$ 上使用 $0\le\ln(1+t)\le t$，再精确计算 $\int_0^1t^n|\ln t|dt$。`,
    mistakes: raw`忘记 $|\ln t|=-\ln t\ge0$，只有乘子非负时才能保留点态不等号方向。`,
    answerText: raw`$$0\le A_n\le B_n=\frac1{(n+1)^2},\qquad \lim_{n\to\infty}A_n=0.$$`,
    solutionMethods: [
      { title: '方法一 · 与幂函数比较', content: raw`由 $\ln(1+t)\le t$，
$$0\le A_n\le B_n.$$
分部积分可得
$$B_n=-\int_0^1t^n\ln t\,dt=\frac1{(n+1)^2}\to0,$$
故 $A_n\to0$。` },
      { title: '方法二 · 一致指数衰减', content: raw`在 $[0,1]$ 上有 $0\le\ln(1+t)\le\ln2<1$，因此
$$0\le A_n\le(\ln2)^n\int_0^1|\ln t|dt=(\ln2)^n.$$
右端指数趋于零，也得到 $A_n\to0$。` }
    ]
  }),
  lectureEleven({
    id: 'example-11-5-fractional-part-average', role: 'example', page: 'PDF 291 · 书页 286 · 例 11.5',
    fingerprint: 'periodic-average:fractional-part-cesaro-limit-complete-periods',
    title: '例 11.5 · 小数部分函数的长期平均',
    statement: raw`设 $f(x)=x-[x]$，其中 $[x]$ 表示不超过 $x$ 的最大整数。计算
$$\lim_{x\to+\infty}\frac1x\int_0^xf(t)\,dt.$$`,
    tags: ['周期函数', '积分平均', '夹逼准则'],
    coreMethod: raw`按单位区间分组；每个完整周期的积分均为 $1/2$，末尾不足一个周期的贡献有界。`,
    mistakes: raw`直接使用洛必达法则；$f$ 在整数处跳跃，且分子并非处处可导。`,
    answerText: raw`$$\frac12.$$`,
    solutionMethods: [
      { title: '方法一 · 整周期夹逼', content: raw`取整数 $n\le x<n+1$。因 $\int_k^{k+1}(t-k)dt=1/2$，
$$\frac n2\le\int_0^xf(t)dt\le\frac{n+1}{2}.$$
再结合 $n\le x<n+1$ 得
$$\frac{n}{2(n+1)}\le\frac1x\int_0^xf\le\frac{n+1}{2n},$$
两端都趋于 $1/2$。` },
      { title: '方法二 · 写出精确余项', content: raw`令 $x=n+r$，$n=[x]$、$0\le r<1$。则
$$\int_0^xf(t)dt=\frac n2+\int_0^rudu=\frac n2+\frac{r^2}{2}.$$
除以 $x=n+r$ 后，余项一致有界，极限为 $1/2$。` }
    ]
  }),
  lectureEleven({
    id: 'example-11-6a-second-derivative-identity', role: 'example', page: 'PDF 291-292 · 书页 286-287 · 例 11.6(1)',
    fingerprint: 'integral-identity:two-integration-by-parts-endpoint-zero-peano-kernel',
    title: '例 11.6(1) · 二阶导数核表示积分',
    statement: raw`设 $f''$ 在 $[0,1]$ 上连续，且 $f(0)=f(1)=0$。证明
$$\int_0^1f(x)\,dx=\frac12\int_0^1x(x-1)f''(x)\,dx.$$`,
    tags: ['积分等式', '分部积分', '二阶导数'],
    coreMethod: raw`把 $x(x-1)$ 与 $f''$ 连续做两次分部积分，利用端点处核函数和 $f$ 的零值消去边界项。`,
    mistakes: raw`第二次分部积分漏掉负号，或只使用 $f(0)=f(1)=0$ 却错误假设 $f'(0)=f'(1)=0$。`,
    answerText: raw`所给积分等式成立。`,
    solutionMethods: [
      { title: '方法一 · 两次分部积分', content: raw`记右端为 $R$。第一次分部积分：
$$R=-\frac12\int_0^1(2x-1)f'(x)dx.$$
再次分部积分，边界项为
$$-\frac12[(2x-1)f(x)]_0^1=0,$$
剩余项正好是 $\int_0^1f(x)dx$。` },
      { title: '方法二 · Green 核表示', content: raw`由端点条件可把 $f$ 写为
$$f(x)=-(1-x)\int_0^xtf''(t)dt-x\int_x^1(1-t)f''(t)dt.$$
对 $x\in[0,1]$ 积分并交换次序，两部分合并为
$$-\frac12\int_0^1t(1-t)f''(t)dt=\frac12\int_0^1t(t-1)f''(t)dt.$$` }
    ]
  }),
  lectureEleven({
    id: 'example-11-6b-second-derivative-bound', role: 'example', page: 'PDF 291-292 · 书页 286-287 · 例 11.6(2)',
    fingerprint: 'integral-inequality:peano-kernel-l1-norm-one-twelfth',
    title: '例 11.6(2) · 端点为零时的二阶导数积分估计',
    statement: raw`设 $f''$ 在 $[0,1]$ 上连续，且 $f(0)=f(1)=0$。记
$$M=\max_{0\le x\le1}|f''(x)|.$$
证明
$$\left|\int_0^1f(x)\,dx\right|\le\frac{M}{12}.$$`,
    tags: ['积分不等式', '二阶导数', 'Peano核'],
    coreMethod: raw`使用例 11.6(1) 的核表示，并计算非负核 $x(1-x)/2$ 的积分。`,
    mistakes: raw`把 $\int|x(x-1)|dx$ 算成 $1/3$；还要保留等式前面的系数 $1/2$。`,
    answerText: raw`$$\left|\int_0^1f(x)dx\right|\le\frac M{12}.$$`,
    solutionMethods: [
      { title: '方法一 · 核的绝对值积分', content: raw`由例 11.6(1)，
$$\left|\int_0^1f\right|\le\frac M2\int_0^1x(1-x)dx
=\frac M2\left(\frac12-\frac13\right)=\frac M{12}.$$` },
      { title: '方法二 · Green 核交换积分', content: raw`使用
$$f(x)=-(1-x)\int_0^xtf''(t)dt-x\int_x^1(1-t)f''(t)dt.$$
先对 $x$ 积分再交换次序，两个核的总 $L^1$ 质量为 $1/12$，从而
$$\left|\int_0^1f(x)dx\right|\le M\cdot\frac1{12}.$$` }
    ]
  }),
  lectureEleven({
    id: 'example-11-7-monotone-rearrangement', role: 'example', page: 'PDF 292-293 · 书页 287-288 · 例 11.7',
    fingerprint: 'integral-inequality:monotone-function-mass-rearrangement-bathtub',
    title: '例 11.7 · 单调函数下的质量左移不等式',
    statement: raw`设 $f,g$ 在 $[a,b]$ 上连续，$f$ 单调增加，且 $0\le g(x)\le1$。证明：
$$0\le\int_a^xg(t)dt\le x-a,\qquad x\in[a,b],$$
以及
$$\int_a^{\,a+\int_a^bg(t)dt}f(x)dx\le\int_a^bf(x)g(x)dx.$$`,
    tags: ['积分不等式', '单调性', '重排思想'],
    coreMethod: raw`把 $g$ 看成总质量固定的密度；对递增函数，质量尽量放在左端时积分最小。`,
    mistakes: raw`辅助函数的上限本身含 $\int_a^xg$，求导时漏掉链式法则中的 $g(x)$。`,
    answerText: raw`两条不等式均成立。`,
    solutionMethods: [
      { title: '方法一 · 构造单调辅助函数', content: raw`第一式由 $0\le g\le1$ 直接积分。令
$$F(x)=\int_a^{\,a+\int_a^xg(u)du}f(t)dt-\int_a^xf(t)g(t)dt.$$
由第一式，$a+\int_a^xg\le x$。求导得
$$F'(x)=\left[f\!\left(a+\int_a^xg\right)-f(x)\right]g(x)\le0.$$
$F(a)=0$，故 $F(b)\le0$，即得第二式。` },
      { title: '方法二 · 左端区间重排', content: raw`记 $m=\int_a^bg$。比较密度 $g$ 与左端区间指示函数 $\mathbf1_{[a,a+m]}$。二者总质量相同，而
$$g-\mathbf1_{[a,a+m]}\le0\quad(x<a+m),\qquad
g-\mathbf1_{[a,a+m]}\ge0\quad(x>a+m).$$
乘以递增的 $f(x)-f(a+m)$ 后积分非负，整理即得结论。` }
    ]
  }),
  lectureEleven({
    id: 'example-11-8-endpoint-zero-first-derivative-bound', role: 'example', page: 'PDF 293 · 书页 288 · 例 11.8',
    fingerprint: 'integral-inequality:endpoint-zero-lipschitz-tent-envelope-one-fourth',
    title: '例 11.8 · 两端为零函数的尖顶包络估计',
    statement: raw`设 $f$ 在 $[0,1]$ 上有连续一阶导数，且 $f(0)=f(1)=0$。记
$$M=\max_{0\le x\le1}|f'(x)|.$$
证明
$$\left|\int_0^1f(x)dx\right|\le\frac M4.$$`,
    tags: ['积分不等式', '拉格朗日中值定理', 'Lipschitz估计'],
    coreMethod: raw`分别从左右端点控制 $|f(x)|$，得到尖顶包络 $M\min(x,1-x)$，再积分。`,
    mistakes: raw`只用左端点得到 $|f(x)|\le Mx$ 会给出较松的 $M/2$；必须同时使用右端点条件。`,
    answerText: raw`$$\left|\int_0^1f(x)dx\right|\le\frac M4.$$`,
    solutionMethods: [
      { title: '方法一 · 尖顶包络', content: raw`由中值定理，
$$|f(x)|\le Mx,\qquad |f(x)|\le M(1-x).$$
因此
$$\left|\int_0^1f\right|\le M\int_0^1\min(x,1-x)dx
=2M\int_0^{1/2}x\,dx=\frac M4.$$` },
      { title: '方法二 · 在中点拆分', content: raw`写成
$$\int_0^1f=\int_0^{1/2}f+\int_{1/2}^1f.$$
左半段用 $|f(x)|\le Mx$，右半段用 $|f(x)|\le M(1-x)$，于是两段分别不超过 $M/8$，相加得到 $M/4$。` }
    ]
  }),
  lectureEleven({
    id: 'example-11-9-centered-taylor-bound', role: 'example', page: 'PDF 293-294 · 书页 288-289 · 例 11.9',
    fingerprint: 'integral-inequality:centered-taylor-linear-term-cancels-one-third',
    title: '例 11.9 · 中心展开后的积分估计',
    statement: raw`设 $f''$ 在 $[0,2]$ 上连续，且 $f(1)=0$。记
$$M=\max_{0\le x\le2}|f''(x)|.$$
证明
$$\left|\int_0^2f(x)dx\right|\le\frac M3.$$`,
    tags: ['积分不等式', 'Taylor公式', '对称区间'],
    coreMethod: raw`在区间中心 $x=1$ 展开，常数项为零，一次项在对称区间上的积分也为零，只剩二阶余项。`,
    mistakes: raw`在端点展开会留下无法控制的 $f'(0)$ 项；必须利用区间关于 $1$ 对称。`,
    answerText: raw`$$\left|\int_0^2f(x)dx\right|\le\frac M3.$$`,
    solutionMethods: [
      { title: '方法一 · 中心 Taylor 展开', content: raw`对每个 $x$，有
$$f(x)=f'(1)(x-1)+\frac12f''(\xi_x)(x-1)^2.$$
第一项在 $[0,2]$ 上积分为零，故
$$\left|\int_0^2f\right|\le\frac M2\int_0^2(x-1)^2dx=\frac M3.$$` },
      { title: '方法二 · 对称配对', content: raw`令 $x=1\pm u$。Taylor 公式相加后一次项抵消，并有
$$|f(1+u)+f(1-u)|\le Mu^2.$$
于是
$$\left|\int_0^2f(x)dx\right|
\le\int_0^1Mu^2du=\frac M3.$$` }
    ]
  }),
  lectureEleven({
    id: 'example-11-10-oscillatory-sine-bound', role: 'example', page: 'PDF 294 · 书页 289 · 例 11.10',
    fingerprint: 'integral-inequality:oscillatory-sine-integration-by-parts-monotone-variation',
    title: '例 11.10 · 单调函数的振荡积分估计',
    statement: raw`设 $f$ 在 $[0,2\pi]$ 上有连续一阶导数，且 $f'(x)\ge0$。证明：对任意正整数 $n$，
$$\left|\int_0^{2\pi}f(x)\sin(nx)dx\right|
\le\frac2n[f(2\pi)-f(0)].$$`,
    tags: ['积分不等式', '振荡积分', '分部积分'],
    coreMethod: raw`对 $\sin(nx)$ 反求原函数做分部积分，再用 $f'\ge0$ 把总变差化为端点差。`,
    mistakes: raw`忘记 $\cos(2n\pi)=\cos0=1$，或把 $\int|f'|$ 错写为 $|f(2\pi)-f(0)|$ 而未使用单调性。`,
    answerText: raw`所给估计成立。`,
    solutionMethods: [
      { title: '方法一 · 分部积分', content: raw`分部积分得
$$\int_0^{2\pi}f\sin(nx)dx
=-\frac{f(2\pi)-f(0)}n+\frac1n\int_0^{2\pi}f'(x)\cos(nx)dx.$$
取绝对值并用 $|\cos(nx)|\le1$、$\int f'=f(2\pi)-f(0)$，即得右端 $2[f(2\pi)-f(0)]/n$。` },
      { title: '方法二 · 半周期配对', content: raw`把区间按长度 $\pi/n$ 分段，相邻半周期中的正弦符号相反。将后一段平移 $\pi/n$ 与前一段配对，每一对只留下
$$[f(x+\pi/n)-f(x)]|\sin(nx)|.$$
这些非负增量的总和不超过两次总变差，且换元带来因子 $1/n$，故得到同一上界。` }
    ]
  }),
  lectureEleven({
    id: 'example-11-11-total-variation-pointwise-bound', role: 'example', page: 'PDF 294-295 · 书页 289-290 · 例 11.11',
    fingerprint: 'integral-inequality:endpoint-zero-total-variation-half-bound',
    title: '例 11.11 · 端点为零时的全变差控制',
    statement: raw`设 $f'$ 在 $[a,b]$ 上连续，且 $f(a)=f(b)=0$。证明：对任意 $x\in[a,b]$，
$$|f(x)|\le\frac12\int_a^b|f'(t)|dt.$$`,
    tags: ['积分不等式', 'Newton-Leibniz公式', '全变差'],
    coreMethod: raw`分别从左右端点表示 $f(x)$，得到两条路径长度上界，再相加除以二。`,
    mistakes: raw`只从一个端点积分只能得到部分区间上的变差，无法出现系数 $1/2$。`,
    answerText: raw`所给逐点估计成立。`,
    solutionMethods: [
      { title: '方法一 · 左右两式相加', content: raw`由两端点条件，
$$|f(x)|=\left|\int_a^xf'(t)dt\right|\le\int_a^x|f'(t)|dt,$$
$$|f(x)|=\left|\int_x^bf'(t)dt\right|\le\int_x^b|f'(t)|dt.$$
两式相加即得 $2|f(x)|\le\int_a^b|f'|$。` },
      { title: '方法二 · 正负变差平衡', content: raw`因 $\int_a^bf'=f(b)-f(a)=0$，$f'$ 的正变差与负变差相等，且各为总变差的一半。从 $a$ 走到任意 $x$ 时，函数高度的绝对值不可能超过已经累积的全部正变差或负变差，故至多为 $\frac12\int_a^b|f'|$。` }
    ]
  }),
  lectureEleven({
    id: 'exercise-11-1-second-derivative-existence', role: 'exercise', page: 'PDF 295-296 · 书页 290-291 · 习题 11.1',
    fingerprint: 'existence:integral-mean-left-positive-right-negative-slopes-second-derivative',
    title: '习题 11.1 · 由积分平均值制造负二阶导数',
    statement: raw`函数 $\varphi$ 具有二阶导数，且
$$\varphi(2)>\varphi(1),\qquad \varphi(2)>\int_2^3\varphi(x)dx.$$
证明：至少存在一点 $\xi\in(1,3)$，使 $\varphi''(\xi)<0$。`,
    tags: ['课后习题', '存在性证明', '积分中值定理'],
    coreMethod: raw`积分中值定理在 $(2,3)$ 产生一个低于 $\varphi(2)$ 的函数值，再与左侧较低值共同构造先正后负的导数值。`,
    mistakes: raw`把 $\int_2^3\varphi$ 直接当成 $\varphi(3)$；中值点只保证存在于 $(2,3)$。`,
    answerText: raw`存在 $\xi\in(1,3)$ 使 $\varphi''(\xi)<0$。`,
    solutionMethods: [
      { title: '方法一 · 三段中值定理', content: raw`由积分中值定理，存在 $\eta\in(2,3)$ 使
$$\varphi(\eta)=\int_2^3\varphi(x)dx<\varphi(2).$$
在 $[1,2]$ 与 $[2,\eta]$ 上分别用中值定理，得到 $\varphi'(\xi_1)>0$、$\varphi'(\xi_2)<0$，其中 $\xi_1<\xi_2$。再对 $\varphi'$ 用中值定理，得某 $\xi$ 满足 $\varphi''(\xi)<0$。` },
      { title: '方法二 · 反证凸性', content: raw`若 $\varphi''\ge0$，则 $\varphi'$ 单调不减。左侧割线斜率
$$\frac{\varphi(2)-\varphi(1)}{1}>0,$$
而由中值点 $\eta$ 得右侧割线斜率
$$\frac{\varphi(\eta)-\varphi(2)}{\eta-2}<0.$$
凸函数的后段斜率不可能小于前段斜率，矛盾。` }
    ]
  }),
  lectureEleven({
    id: 'exercise-11-2-trigonometric-weight-comparison', role: 'exercise', page: 'PDF 295-296 · 书页 290-291 · 习题 11.2',
    fingerprint: 'integral-inequality:split-reflect-trigonometric-numerator-weight-denominator',
    title: '习题 11.2 · 三角权积分的反射比较',
    statement: raw`证明
$$\int_0^{\pi/2}\frac{\cos x}{1+x^2}dx
\ge\int_0^{\pi/2}\frac{\sin x}{1+x^2}dx.$$`,
    tags: ['课后习题', '积分不等式', '区间反射'],
    coreMethod: raw`把差积分在 $\pi/4$ 处分段，将右半段反射到左半段，使两个同号因子显现。`,
    mistakes: raw`只看 $\cos x-\sin x$ 在全区间变号就放弃；分母权重并不关于 $\pi/4$ 对称，必须配对。`,
    answerText: raw`不等式成立。`,
    solutionMethods: [
      { title: '方法一 · 右半段反射', content: raw`记差为 $I$。将 $[\pi/4,\pi/2]$ 作 $x=\pi/2-t$，得
$$I=\int_0^{\pi/4}(\cos x-\sin x)
\left[\frac1{1+x^2}-\frac1{1+(\pi/2-x)^2}\right]dx.$$
在该区间两个括号均非负，故 $I\ge0$。` },
      { title: '方法二 · 分段积分中值', content: raw`在两半区间分别对正函数 $1/(1+x^2)$ 用积分中值定理。存在 $\xi\in[0,\pi/4]$、$\eta\in[\pi/4,\pi/2]$ 使
$$I=(\sqrt2-1)\left(\frac1{1+\xi^2}-\frac1{1+\eta^2}\right)\ge0,$$
因为 $\xi\le\eta$。` }
    ]
  }),
  lectureEleven({
    id: 'exercise-11-3-inverse-function-nested-integral', role: 'exercise', page: 'PDF 295、297 · 书页 290、292 · 习题 11.3',
    fingerprint: 'integral-identity:inverse-function-inner-primitive-integration-by-parts',
    title: '习题 11.3 · 反函数嵌套积分恒等式',
    statement: raw`设 $\varphi$ 是可微函数 $f$ 的反函数，且 $f(1)=0$。证明
$$\int_0^1\left[\int_0^{f(x)}\varphi(t)dt\right]dx
=2\int_0^1x f(x)dx.$$`,
    tags: ['课后习题', '积分等式', '反函数'],
    coreMethod: raw`令内层积分为 $H(f(x))$；求导时利用 $\varphi(f(x))=x$，再做分部积分。`,
    mistakes: raw`把 $\varphi$ 看成 $f$ 的原函数；这里是反函数，关键关系是 $\varphi(f(x))=x$。`,
    answerText: raw`所给积分等式成立。`,
    solutionMethods: [
      { title: '方法一 · 外层分部积分', content: raw`令 $H(y)=\int_0^y\varphi(t)dt$。则
$$\frac d{dx}H(f(x))=\varphi(f(x))f'(x)=x f'(x).$$
对 $\int_0^1H(f(x))dx$ 分部积分，因 $f(1)=0$ 使边界项为零：
$$-\int_0^1x^2f'(x)dx
=-[x^2f(x)]_0^1+2\int_0^1xf(x)dx.$$` },
      { title: '方法二 · 反函数面积公式', content: raw`因 $\varphi(0)=1$，反函数积分公式给出
$$\int_0^{f(x)}\varphi(t)dt=x f(x)-\int_1^xf(s)ds.$$
再对 $x\in[0,1]$ 积分。交换第二项的积分次序：
$$-\int_0^1\int_1^xf(s)dsdx=\int_0^1s f(s)ds.$$
与第一项相加即得 $2\int_0^1xf(x)dx$。` }
    ]
  }),
  lectureEleven({
    id: 'exercise-11-4-strict-chebyshev', role: 'exercise', page: 'PDF 295、297 · 书页 290、292 · 习题 11.4',
    fingerprint: 'integral-inequality:strict-chebyshev-increasing-with-identity',
    title: '习题 11.4 · 严格递增函数的积分重心右移',
    statement: raw`设 $f$ 在 $[a,b]$ 上连续且严格单调增加。证明
$$ (a+b)\int_a^bf(x)dx<2\int_a^bxf(x)dx.$$`,
    tags: ['课后习题', '积分不等式', 'Chebyshev不等式'],
    coreMethod: raw`把结论看成 $x$ 与 $f(x)$ 的正协方差；严格同向单调使不等号严格。`,
    mistakes: raw`使用普通 Chebyshev 只得到非严格不等式后没有解释为何不能取等。`,
    answerText: raw`所给严格不等式成立。`,
    solutionMethods: [
      { title: '方法一 · 单调辅助函数', content: raw`令
$$F(t)=(a+t)\int_a^tf(x)dx-2\int_a^txf(x)dx.$$
则
$$F'(t)=\int_a^t[f(x)-f(t)]dx<0\quad(t>a).$$
$F(a)=0$，所以 $F(b)<0$，整理即为待证式。` },
      { title: '方法二 · 双重积分协方差', content: raw`因 $x$ 与 $f(x)$ 严格同向增加，
$$\int_a^b\int_a^b(x-y)[f(x)-f(y)]dxdy>0.$$
展开并整理得
$$2(b-a)\int_a^bxf(x)dx
-2\left(\int_a^bxdx\right)\left(\int_a^bf(x)dx\right)>0.$$
代入 $\int_a^b xdx=(a+b)(b-a)/2$ 即得结论。` }
    ]
  }),
  lectureEleven({
    id: 'exercise-11-5-one-endpoint-derivative-bound', role: 'exercise', page: 'PDF 295、297 · 书页 290、292 · 习题 11.5',
    fingerprint: 'integral-inequality:one-endpoint-zero-first-derivative-triangle-area',
    title: '习题 11.5 · 单端点为零的导数估计',
    statement: raw`设 $f'$ 在 $[0,a]$ 上连续，且 $f(0)=0$。记
$$M=\max_{0\le x\le a}|f'(x)|.$$
证明
$$\left|\int_0^af(x)dx\right|\le\frac{Ma^2}{2}.$$`,
    tags: ['课后习题', '积分不等式', '导数上界'],
    coreMethod: raw`由 $f(0)=0$ 得到点态估计 $|f(x)|\le Mx$，再积分三角形包络。`,
    mistakes: raw`把 $\int_0^aMx\,dx$ 算成 $Ma$，遗漏长度量纲中的第二个 $a$。`,
    answerText: raw`$$\left|\int_0^af(x)dx\right|\le\frac{Ma^2}{2}.$$`,
    solutionMethods: [
      { title: '方法一 · 微分中值定理', content: raw`对任意 $x\in[0,a]$，存在 $\xi_x\in(0,x)$ 使
$$f(x)=f'(\xi_x)x.$$
故 $|f(x)|\le Mx$，于是
$$\left|\int_0^af\right|\le\int_0^a|f(x)|dx\le M\int_0^axdx=\frac{Ma^2}{2}.$$` },
      { title: '方法二 · Newton-Leibniz 与换序', content: raw`由
$$f(x)=\int_0^xf'(t)dt,$$
有
$$\left|\int_0^af(x)dx\right|
\le\int_0^a\int_0^x|f'(t)|dtdx
\le M\int_0^a\int_0^x dtdx=\frac{Ma^2}{2}.$$` }
    ]
  }),
  lectureEleven({
    id: 'exercise-11-6-convex-midpoint-lower-bound', role: 'exercise', page: 'PDF 295、298 · 书页 290、293 · 习题 11.6',
    fingerprint: 'integral-inequality:strict-convex-midpoint-tangent-strict-lower-bound',
    title: '习题 11.6 · 凸函数的中点积分下界',
    statement: raw`设 $f$ 在 $[0,1]$ 上有二阶导数，且
$$f(1/2)=1,\qquad f''(x)>0.$$
证明
$$\int_0^1f(x)dx>1.$$`,
    tags: ['课后习题', '积分不等式', '凸函数'],
    coreMethod: raw`严格凸函数位于任一点切线之上；取中点切线后，一次项在对称区间上的积分为零。`,
    mistakes: raw`把凸函数与弦线、切线的位置关系写反；凸函数在弦线下方、在切线的上方。`,
    answerText: raw`$$\int_0^1f(x)dx>1.$$`,
    solutionMethods: [
      { title: '方法一 · 中点切线', content: raw`Taylor 公式给出
$$f(x)=f(1/2)+f'(1/2)(x-1/2)+\frac12f''(\xi_x)(x-1/2)^2
>1+f'(1/2)(x-1/2)\qquad(x\ne1/2).$$
两边积分，一次项为零，故积分严格大于 $1$。` },
      { title: '方法二 · 对称点配对', content: raw`对 $0\le u\le1/2$，严格凸性给出
$$\frac{f(1/2-u)+f(1/2+u)}2>f(1/2)=1\qquad(u>0).$$
对 $u$ 从 $0$ 到 $1/2$ 积分，左端恰为 $\frac12\int_0^1f(x)dx$，因此原积分严格大于 $1$。` }
    ]
  })
]
