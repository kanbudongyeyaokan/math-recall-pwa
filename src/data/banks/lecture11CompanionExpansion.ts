import type { SeedInput } from './types'

const raw = String.raw
const ZY1000_SOURCE = '何耀焜私人整理 · 张宇《1000题》数一解析册 · 第11章逐页核验'

type CompanionSeed = Omit<SeedInput, 'id' | 'kind' | 'tags' | 'methodFingerprint' | 'source'> & {
  id: string
  tags: string[]
  fingerprint: string
}

function companion(input: CompanionSeed): SeedInput {
  return {
    ...input,
    id: `zy1000-verified-l11-${input.id}`,
    kind: 'problem',
    source: ZY1000_SOURCE,
    tags: ['高等数学', '第11讲', '经典例题', 'PDF逐页核验', ...input.tags],
    methodFingerprint: `zy1000-verified:l11:${input.fingerprint}`
  }
}

export const lecture11CompanionExpansionSeeds: SeedInput[] = [
  companion({
    id: 'problem-1-riccati-integral-bound', page: '解析 PDF 296 · 书页 290 · 第 1 题',
    fingerprint: 'integral-inequality:riccati-fpp-plus-f-square-integrating-factor-log-ratio',
    title: '1000题第 1 题 · Riccati 型微分不等式的积分下界',
    statement: raw`设 $f$ 在 $[0,1]$ 上可导，$f(0)>0$，且
$$f'(x)+f^2(x)\ge0.$$
证明 $f(1)>0$，并且
$$\int_0^1f(x)\,dx\ge\ln\frac{f(0)}{f(1)}.$$`,
    tags: ['积分不等式', '微分不等式', '构造辅助函数'],
    coreMethod: raw`逆向观察 $f''+f^2$，给 $f$ 乘以指数积分因子 $e^{\int_0^x f}$，使其导数恰好出现题设中的非负量。`,
    mistakes: raw`在尚未证明 $f(1)>0$ 前直接取对数；还要注意指数积分因子恒正，因此不会改变不等号方向。`,
    answerText: raw`$$f(1)>0,\qquad \int_0^1f(x)dx\ge\ln\frac{f(0)}{f(1)}.$$`,
    solutionMethods: [
      { title: '方法一 · 积分因子构造', content: raw`令
$$F(x)=f(x)e^{\int_0^x f(t)dt}.$$
则
$$F'(x)=e^{\int_0^x f(t)dt}[f'(x)+f^2(x)]\ge0.$$
故 $F(1)\ge F(0)=f(0)>0$，从而 $f(1)>0$。再由
$$f(1)e^{\int_0^1f(x)dx}\ge f(0)$$
两边取对数，即得结论。` },
      { title: '方法二 · 对数势函数', content: raw`在 $f>0$ 的区间上考察
$$H(x)=\ln f(x)+\int_0^x f(t)dt.$$
有
$$H'(x)=\frac{f'(x)+f^2(x)}{f(x)}\ge0.$$
积分因子法已经保证右端不会先穿过零点，因此可把单调性延伸到 $[0,1]$。于是 $H(1)\ge H(0)$，整理得到同一积分下界。` }
    ]
  }),
  companion({
    id: 'problem-2-nested-integral-reduction', page: '解析 PDF 296 · 书页 290 · 第 2 题',
    fingerprint: 'nested-integral:integration-by-parts-variable-limits-x-square-square-root',
    title: '1000题第 2 题 · 二重嵌套积分化为单积分',
    statement: raw`设 $f$ 连续，化简
$$\int_0^1\left[\int_{x^2}^{\sqrt{x}}f(t)dt\right]dx.$$`,
    tags: ['积分等式', '分部积分', '变上限积分'],
    coreMethod: raw`把内层积分视为一个整体对外层做分部积分；其导数由两个变限端点共同贡献。`,
    mistakes: raw`求导 $\int_{x^2}^{\sqrt{x}}f(t)dt$ 时漏掉下限项的负号，或漏掉 $2x$、$1/(2\sqrt x)$。`,
    answerText: raw`$$\int_0^1(\sqrt{x}-x^2)f(x)dx.$$`,
    solutionMethods: [
      { title: '方法一 · 外层分部积分', content: raw`令 $G(x)=\int_{x^2}^{\sqrt{x}}f(t)dt$。边界处 $xG(x)$ 均为零，故
$$\int_0^1G(x)dx=-\int_0^1xG'(x)dx.$$
代入
$$G'(x)=\frac{f(\sqrt x)}{2\sqrt x}-2xf(x^2),$$
再分别作 $u=\sqrt x$ 与 $v=x^2$，得到
$$\int_0^1(\sqrt t-t^2)f(t)dt.$$` },
      { title: '方法二 · 交换积分次序', content: raw`积分区域为
$$0\le x\le1,\qquad x^2\le t\le\sqrt x.$$
固定 $t\in[0,1]$ 后，不等式等价于 $t^2\le x\le\sqrt t$。因此
$$\int_0^1\int_{x^2}^{\sqrt x}f(t)dtdx
=\int_0^1\int_{t^2}^{\sqrt t}f(t)dxdt
=\int_0^1(\sqrt t-t^2)f(t)dt.$$` }
    ]
  }),
  companion({
    id: 'problem-3-derivative-strip-integral-range', page: '解析 PDF 296 · 书页 290 · 第 3 题',
    fingerprint: 'integral-range:endpoints-one-derivative-absolute-less-than-one-diamond-envelope',
    title: '1000题第 3 题 · 导数约束下的积分范围',
    statement: raw`设 $f$ 在 $[0,1]$ 上可导，满足
$$f(0)=f(1)=1,\qquad |f'(x)|<1.$$
则 $\int_0^1f(x)dx$ 的取值范围是（　）。`,
    questionFormat: 'single-choice',
    options: [
      '$\dfrac12<\int_0^1f(x)dx<\dfrac32$',
      '$0<\int_0^1f(x)dx<2$',
      '$\dfrac34<\int_0^1f(x)dx<\dfrac54$',
      '$\dfrac23<\int_0^1f(x)dx<\dfrac43$'
    ],
    correctOptionIds: ['C'],
    tags: ['选择题', '积分范围', '拉格朗日中值定理'],
    coreMethod: raw`从两个端点分别使用 $|f'|<1$，取上下包络的交集，得到以 $x=1/2$ 为分界的菱形带。`,
    mistakes: raw`只从 $x=0$ 一个端点估计会得到过宽区间；上下界都必须同时利用 $f(0)=f(1)=1$。`,
    answerText: raw`正确选项为 C：
$$\frac34<\int_0^1f(x)dx<\frac54.$$`,
    solutionMethods: [
      { title: '方法一 · 四条直线包络', content: raw`由中值定理，$0<x<1$ 时
$$1-x<f(x)<1+x,\qquad x<f(x)<2-x.$$
故
$$\max(1-x,x)<f(x)<\min(1+x,2-x).$$
在 $x=1/2$ 分段积分两侧包络，得到
$$\frac34<\int_0^1f(x)dx<\frac54.$$` },
      { title: '方法二 · 中点对称配对', content: raw`对 $0\le x\le1/2$，分别比较 $f(x)$、$f(1-x)$ 与两端点，得
$$2-2x<f(x)+f(1-x)<2+2x.$$
把 $x$ 从 $0$ 积到 $1/2$，左端正好是 $\int_0^1f$，两侧积分分别为 $3/4$ 与 $5/4$。` }
    ]
  }),
  companion({
    id: 'problem-4-sine-kernel-nested-integral', page: '解析 PDF 297 · 书页 291 · 第 4 题',
    fingerprint: 'nested-integral:sin-t-over-t-square-root-upper-limit-parts',
    title: '1000题第 4 题 · 正弦积分核的嵌套积分',
    statement: raw`计算
$$\int_0^1\left(\int_x^{\sqrt{x}}\frac{\sin t}{t}dt\right)dx.$$`,
    tags: ['积分计算', '分部积分', '嵌套积分'],
    coreMethod: raw`外层分部积分后，两个变限导数分别通过平方换元和根号换元化为普通正弦积分。`,
    mistakes: raw`$t=0$ 处的 $\sin t/t$ 是可去间断点；计算边界项时不能把它误判为发散。`,
    answerText: raw`$$1-\sin1.$$`,
    solutionMethods: [
      { title: '方法一 · 分部积分', content: raw`令 $G(x)=\int_x^{\sqrt x}\sin t/t\,dt$。则边界项为零，且
$$\int_0^1G(x)dx=-\int_0^1xG'(x)dx
=\int_0^1\left(\sin x-\frac{\sin\sqrt x}{2}\right)dx.$$
第二项令 $t=\sqrt x$，得到
$$\int_0^1\sin xdx-\int_0^1t\sin tdt=1-\sin1.$$` },
      { title: '方法二 · 交换次序', content: raw`区域 $0\le x\le1$、$x\le t\le\sqrt x$ 等价于 $0\le t\le1$、$t^2\le x\le t$。故原式为
$$\int_0^1(t-t^2)\frac{\sin t}{t}dt
=\int_0^1(1-t)\sin tdt=1-\sin1.$$` }
    ]
  }),
  companion({
    id: 'problem-5-cumulative-dominance-first-moment', page: '解析 PDF 297 · 书页 291 · 第 5 题',
    fingerprint: 'integral-inequality:cumulative-dominance-equal-mass-reverses-first-moment',
    title: '1000题第 5 题 · 累积积分占优推出一阶矩反向',
    statement: raw`设 $f,g$ 在 $[a,b]$ 上连续，且对任意 $x\in[a,b]$ 有
$$\int_a^xf(t)dt\ge\int_a^xg(t)dt,$$
并且
$$\int_a^bf(t)dt=\int_a^bg(t)dt.$$
证明
$$\int_a^bxf(x)dx\le\int_a^bxg(x)dx.$$`,
    tags: ['积分不等式', '累积占优', '分部积分'],
    coreMethod: raw`令累计差 $G(x)=\int_a^x(f-g)$；题设给出 $G\ge0$ 且两端为零，对一阶矩差分部积分即可。`,
    mistakes: raw`如果漏掉总积分相等条件，分部积分的边界项 $bG(b)$ 不会消失，结论一般不成立。`,
    answerText: raw`所给一阶矩不等式成立。`,
    solutionMethods: [
      { title: '方法一 · 累积差分部积分', content: raw`令
$$G(x)=\int_a^x[f(t)-g(t)]dt.$$
则 $G(x)\ge0$，且 $G(a)=G(b)=0$。因此
$$\int_a^bx[f(x)-g(x)]dx
=[xG(x)]_a^b-\int_a^bG(x)dx\le0,$$
移项即得结论。` },
      { title: '方法二 · 层蛋糕式解释', content: raw`把 $f-g$ 看作总质量为零的有符号密度。$G(x)\ge0$ 表示正质量更靠左、负质量更靠右。写
$$x=a+\int_a^x1\,ds$$
并交换积分次序，常数项因总质量为零而消失，剩余项正好为 $-\int_a^bG(s)ds\le0$。` }
    ]
  }),
  companion({
    id: 'problem-6-cauchy-derivative-energy', page: '解析 PDF 297-298 · 书页 291-292 · 第 6 题',
    fingerprint: 'integral-inequality:cauchy-derivative-energy-one-endpoint-poincare',
    title: '1000题第 6 题 · 由导数能量控制函数平方积分',
    statement: raw`设 $f$ 在 $[a,b]$ 上具有连续一阶导数，且 $f(a)=0$。证明
$$\int_a^bf^2(x)dx\le\frac{(b-a)^2}{2}\int_a^b[f'(x)]^2dx.$$`,
    tags: ['积分不等式', 'Cauchy不等式', '能量估计'],
    coreMethod: raw`先对 $f(t)=\int_a^tf'$ 使用 Cauchy 不等式得到点态估计，再对 $t$ 积分。`,
    mistakes: raw`点态 Cauchy 上界中的区间长度是 $t-a$，不是固定的 $b-a$；保留它才能得到系数 $1/2$。`,
    answerText: raw`$$\int_a^bf^2(x)dx\le\frac{(b-a)^2}{2}\int_a^b[f'(x)]^2dx.$$`,
    solutionMethods: [
      { title: '方法一 · 点态 Cauchy 后积分', content: raw`对 $a\le t\le b$，
$$f^2(t)=\left(\int_a^tf'(x)dx\right)^2
\le(t-a)\int_a^t[f'(x)]^2dx
\le(t-a)\int_a^b[f'(x)]^2dx.$$
再对 $t$ 积分，利用 $\int_a^b(t-a)dt=(b-a)^2/2$ 即得。` },
      { title: '方法二 · 双重积分换序', content: raw`由 $f(t)=\int_a^tf'(x)dx$ 及 Cauchy，先保留局部能量：
$$f^2(t)\le(t-a)\int_a^t[f'(x)]^2dx.$$
对 $t$ 积分并交换次序后，内层权重为
$$\int_x^b(t-a)dt\le\frac{(b-a)^2}{2},$$
从而得到同一全局上界。` }
    ]
  }),
  companion({
    id: 'problem-7-monotone-gaussian-kernel', page: '解析 PDF 298 · 书页 292 · 第 7 题',
    fingerprint: 'integral-inequality:increasing-function-gaussian-kernel-mass-left-rearrangement',
    title: '1000题第 7 题 · 单调函数与高斯核的质量比较',
    statement: raw`设 $f$ 在 $[0,1]$ 上连续且单调递增。比较
$$A=\int_0^{\int_0^1e^{-t^2}dt}f(x)dx,
\qquad B=\int_0^1f(x)e^{-x^2}dx.$$`,
    tags: ['积分不等式', '单调性', '高斯核'],
    coreMethod: raw`两个权重的总质量相同；对递增函数，把这部分质量集中到左端区间会使积分更小。`,
    mistakes: raw`不能由 $e^{-x^2}\le1$ 直接比较，因为两边的积分区间不同；必须利用总质量相等和单调性。`,
    answerText: raw`$$A\le B.$$`,
    solutionMethods: [
      { title: '方法一 · 构造变上限差', content: raw`令
$$F(x)=\int_0^{\int_0^xe^{-t^2}dt}f(u)du-\int_0^xf(t)e^{-t^2}dt.$$
则
$$F'(x)=e^{-x^2}\left[f\!\left(\int_0^xe^{-t^2}dt\right)-f(x)\right]\le0,$$
因为 $\int_0^xe^{-t^2}dt\le x$ 且 $f$ 递增。$F(0)=0$，故 $F(1)\le0$。` },
      { title: '方法二 · 左端质量重排', content: raw`记 $m=\int_0^1e^{-t^2}dt$。比较密度 $\mathbf1_{[0,m]}$ 与 $e^{-x^2}$：两者总质量相同，前者在左端拥有更多累计质量。对递增的 $f$，分部积分或单调重排原理给出
$$\int_0^mf(x)dx\le\int_0^1f(x)e^{-x^2}dx.$$` }
    ]
  }),
  companion({
    id: 'problem-8-sine-integral-positive', page: '解析 PDF 298 · 书页 292 · 第 8 题(1)',
    fingerprint: 'integral-sign:sine-over-t-three-half-pi-reflection-positive-pairing',
    title: '1000题第 8 题(1) · 正弦积分在 $3\pi/2$ 处的正性',
    statement: raw`证明
$$\int_0^{3\pi/2}\frac{\sin t}{t}dt>0.$$`,
    tags: ['积分符号', '区间配对', '正弦积分'],
    coreMethod: raw`把负半波反射到正半波，并利用更靠右时分母更大，使正贡献严格占优。`,
    mistakes: raw`仅说“正区间更长”并不能证明带权积分为正；关键是把同相位的正负半波逐点比较。`,
    answerText: raw`$$\int_0^{3\pi/2}\frac{\sin t}{t}dt>0.$$`,
    solutionMethods: [
      { title: '方法一 · 平移配对', content: raw`把积分拆成 $[0,\pi/2]$、$[\pi/2,\pi]$、$[\pi,3\pi/2]$，并在第三段令 $t=u+\pi$。则第一段与第三段合并为
$$\int_0^{\pi/2}\left(\frac1u-\frac1{u+\pi}\right)\sin u\,du>0,$$
而 $[\pi/2,\pi]$ 上的积分也为正，故总和为正。` },
      { title: '方法二 · 先保留一个正半波', content: raw`写成
$$\int_0^\pi\frac{\sin t}{t}dt+
\int_\pi^{3\pi/2}\frac{\sin t}{t}dt.$$
把后一段平移 $\pi$ 后，与前一积分的 $[0,\pi/2]$ 部分配对；因为 $1/t>1/(t+\pi)$，配对和为正，前一积分剩余的 $[\pi/2,\pi]$ 部分仍为正。` }
    ]
  }),
  companion({
    id: 'problem-8b-sine-integral-equation-roots', page: '解析 PDF 299 · 书页 293 · 第 8 题(2)',
    fingerprint: 'equation-roots:sine-integral-minus-two-log-absolute-monotonic-branches',
    title: '1000题第 8 题(2) · 含正弦积分方程恰有两根',
    statement: raw`证明方程
$$\int_1^x\frac{\sin t}{t}dt=2\ln|x|$$
恰有两个实根。`,
    tags: ['方程根数', '单调性', '正弦积分'],
    coreMethod: raw`构造左右两端之差，在正、负半轴分别研究单调性与端点符号；每个半轴至多一根，再各证明至少一根。`,
    mistakes: raw`求导时 $\ln|x|$ 在 $x\ne0$ 上的导数均为 $1/x$；负半轴还必须另找一个函数值为负的点。`,
    answerText: raw`方程在 $(0,+\infty)$ 与 $(-\infty,0)$ 上各有且仅有一个实根，共两个。`,
    solutionMethods: [
      { title: '方法一 · 分半轴单调性', content: raw`令
$$F(x)=\int_1^x\frac{\sin t}{t}dt-2\ln|x|.$$
则 $F'(x)=(\sin x-2)/x$。在 $(0,+\infty)$ 上 $F'<0$，且 $F(1)=0$，故正根唯一。负半轴上 $F'>0$，且 $x\to0^-$ 时 $F(x)\to+\infty$。又由第(1)问可验证 $F(-3\pi/2)<0$，故负半轴恰有一根。` },
      { title: '方法二 · 负根用 $-\pi$ 定位', content: raw`正半轴仍由严格递减和 $F(1)=0$ 得唯一正根。对负半轴，$F$ 严格递增，且 $F(0^-)=+\infty$。另一方面
$$F(-\pi)=-\int_{-\pi}^1\frac{\sin t}{t}dt-2\ln\pi<0,$$
因此介值定理给出唯一负根。两半轴合计恰有两个实根。` }
    ]
  }),
  companion({
    id: 'problem-9-concave-arc-length', page: '解析 PDF 299 · 书页 293 · 第 9 题',
    fingerprint: 'arc-length:strict-concavity-endpoint-zero-height-bound-split-at-maximum',
    title: '1000题第 9 题 · 凹函数图像的弧长上界',
    statement: raw`设 $f$ 在 $[0,1]$ 上二阶可导，满足
$$f(0)=f(1)=0,\qquad f''(x)<0,\qquad f(x)\le1.$$
证明其图像弧长满足
$$\int_0^1\sqrt{1+[f'(x)]^2}dx<3.$$`,
    tags: ['弧长', '凹函数', '区间分割'],
    coreMethod: raw`严格凹性使导数严格递减，唯一最高点把曲线分成递增、递减两段；分别使用 $\sqrt{1+u^2}<1+|u|$。`,
    mistakes: raw`直接在整个区间把 $|f'|$ 去掉会出错；必须先在 $f'$ 变号点处分段。`,
    answerText: raw`$$\int_0^1\sqrt{1+[f'(x)]^2}dx<3.$$`,
    solutionMethods: [
      { title: '方法一 · 最高点处分段', content: raw`由 Rolle 定理存在 $\xi\in(0,1)$ 使 $f'(\xi)=0$。因 $f''<0$，$f'$ 严格递减，故左段 $f'>0$、右段 $f'<0$。于是
$$\begin{aligned}
L&<\int_0^\xi(1+f')dx+\int_\xi^1(1-f')dx\\
&=1+2f(\xi)\le3.
\end{aligned}$$` },
      { title: '方法二 · 总变差', content: raw`使用逐点严格不等式
$$\sqrt{1+[f'(x)]^2}<1+|f'(x)|.$$
严格凹且两端为零，函数先增后减，所以总变差为 $2\max f=2f(\xi)\le2$。因此
$$L<1+\int_0^1|f'(x)|dx=1+2f(\xi)\le3.$$` }
    ]
  })
]
