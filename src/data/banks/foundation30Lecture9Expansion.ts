import type { SeedInput } from './types'

const raw = String.raw
const ZY30_SOURCE = '何耀焜私人整理 · 张宇《基础30讲》高数 · 第9讲逐页核验'

type LectureNineSeed = Omit<SeedInput, 'id' | 'kind' | 'tags' | 'methodFingerprint' | 'source'> & {
  id: string
  role: 'example' | 'exercise'
  tags: string[]
  fingerprint: string
}

function lectureNine(input: LectureNineSeed): SeedInput {
  const roleLabel = input.role === 'example' ? '经典例题' : '课后习题'
  return {
    ...input,
    id: `zy30-verified-l09-${input.id}`,
    kind: 'problem',
    source: ZY30_SOURCE,
    tags: ['高等数学', '第9讲', roleLabel, 'PDF逐页核验', ...input.tags],
    methodFingerprint: `zy30-verified:l09:${input.fingerprint}`
  }
}

export const foundation30Lecture9ExpansionSeeds: SeedInput[] = [
  lectureNine({
    id: 'example-9-1-radical-chain-substitution', role: 'example', page: 'PDF 238-239 · 书页 233-234 · 例 9.1',
    fingerprint: 'substitution:x-to-three-halves-arcsine-kernel',
    title: '例 9.1 · 根式积分中的三次幂凑微分',
    statement: raw`求不定积分

$$\int\frac{\sqrt{x}}{\sqrt{4-x^3}}\,dx.$$`,
    tags: ['不定积分', '凑微分', '根式换元'],
    coreMethod: raw`把 $\sqrt{x}\,dx$ 看作 $x^{3/2}$ 的微分，并把分母配成反正弦标准型。`,
    mistakes: raw`只令 $u=x^3$ 会留下 $x^{-3/2}$；正确的中间量应直接覆盖分子中的 $x^{1/2}dx$。`,
    answerText: raw`$$\frac23\arcsin\frac{x^{3/2}}2+C.$$`,
    solutionMethods: [
      { title: '方法一 · 直接凑微分', content: raw`令 $u=x^{3/2}/2$，则 $du=3\sqrt{x}\,dx/4$，且 $\sqrt{4-x^3}=2\sqrt{1-u^2}$。因此原式化为

$$\frac23\int\frac{du}{\sqrt{1-u^2}}=\frac23\arcsin u+C.$$` },
      { title: '方法二 · 三角换元复核', content: raw`令 $x^{3/2}=2\sin t$，则 $\sqrt{x}\,dx=\frac43\cos t\,dt$，分母为 $2\cos t$。在对应单调区间内积分得到 $2t/3+C$，再以 $t=\arcsin(x^{3/2}/2)$ 回代。` }
    ]
  }),
  lectureNine({
    id: 'exercise-9-10-crossing-tangent-branch', role: 'exercise', page: 'PDF 261、264 · 书页 256、259 · 习题 9.10',
    fingerprint: 'definite-integral:split-across-tangent-antiderivative-branch',
    title: '习题 9.10 · 跨过正切间断点时分段使用原函数',
    statement: raw`计算

$$\int_0^{3\pi/4}\frac{dx}{1+\cos^2x}.$$`,
    tags: ['定积分', '分段积分', '反正切分支'],
    coreMethod: raw`令 $t=\tan x$ 得到的原函数在 $x=\pi/2$ 处无定义，因此必须把原积分分成两段分别取极限。`,
    mistakes: raw`直接把 $F(x)=\frac1{\sqrt2}\arctan(\tan x/\sqrt2)$ 在 $0$ 与 $3\pi/4$ 代值，会因反正切主值分支得到负数。`,
    answerText: raw`$$\frac\pi{\sqrt2}-\frac1{\sqrt2}\arctan\frac1{\sqrt2}.$$`,
    solutionMethods: [
      { title: '方法一 · 在间断点处分段', content: raw`先化为
$$\int\frac{\sec^2x}{2+\tan^2x}dx=\frac1{\sqrt2}\arctan\frac{\tan x}{\sqrt2}.$$
分别在 $[0,\pi/2)$ 与 $(\pi/2,3\pi/4]$ 取极限，两侧各贡献正确的分支增量，合并得到答案。` },
      { title: '方法二 · 周期对称', content: raw`被积函数以 $\pi$ 为周期且关于 $\pi/2$ 对称，故
$$\int_0^{3\pi/4}g=\int_0^{\pi/2}g+\int_{\pi/2}^{3\pi/4}g
=2\int_0^{\pi/2}g-\int_0^{\pi/4}g.$$
前者为 $\pi/\sqrt2$，后者为 $\arctan(1/\sqrt2)/\sqrt2$。` }
    ]
  }),
  lectureNine({
    id: 'exercise-9-11-by-parts-self-cancellation', role: 'exercise', page: 'PDF 261、264 · 书页 256、259 · 习题 9.11',
    fingerprint: 'definite-integral:integration-by-parts-identical-integral-cancels',
    title: '习题 9.11 · 分部积分后同一积分自消',
    statement: raw`计算

$$\int_{-\pi/4}^{\pi/4}e^{x/2}\frac{\cos x-\sin x}{\sqrt{\cos x}}\,dx.$$`,
    tags: ['定积分', '分部积分', '自消结构'],
    coreMethod: raw`拆成含 $e^{x/2}\sqrt{\cos x}$ 的积分与 $d(\sqrt{\cos x})$ 项，分部积分后未知积分抵消。`,
    mistakes: raw`$d(\sqrt{\cos x})=-\sin x\,dx/(2\sqrt{\cos x})$，负号与系数 $2$ 都决定是否能自消。`,
    answerText: raw`$$\sqrt[4]{8}\left(e^{\pi/8}-e^{-\pi/8}\right).$$`,
    solutionMethods: [
      { title: '方法一 · 构造全微分', content: raw`把被积函数写成
$$e^{x/2}\sqrt{\cos x}\,dx+2e^{x/2}d(\sqrt{\cos x}).$$
第二项分部积分后产生边界项 $2e^{x/2}\sqrt{\cos x}$，并减去第一项，使未知积分抵消。代入两端 $\cos(\pi/4)=\sqrt2/2$ 即得。` },
      { title: '方法二 · 识别乘积导数', content: raw`直接计算
$$\frac d{dx}\left(2e^{x/2}\sqrt{\cos x}\right)
=e^{x/2}\frac{\cos x-\sin x}{\sqrt{\cos x}}.$$
因此定积分只需代上下限，化简为所给四次根表达式。` }
    ]
  }),
  lectureNine({
    id: 'exercise-9-12-reflected-weight-integral', role: 'exercise', page: 'PDF 261、264-265 · 书页 256、259-260 · 习题 9.12',
    fingerprint: 'definite-integral:reflection-linear-weight-sine-over-one-plus-cos-square',
    title: '习题 9.12 · 区间反射消去线性权重',
    statement: raw`计算

$$I=\int_0^\pi\frac{x\sin x}{1+\cos^2x}\,dx.$$`,
    tags: ['定积分', '区间反射', '反正切'],
    coreMethod: raw`反射 $x\mapsto\pi-x$ 后分母与正弦不变，权重变为 $\pi-x$，与原式相加即可去掉 $x$。`,
    mistakes: raw`$\cos(\pi-x)=-\cos x$，但平方后不变；若忘记平方会错判符号。`,
    answerText: raw`$$\frac{\pi^2}{4}.$$`,
    solutionMethods: [
      { title: '方法一 · 区间反射', content: raw`反射后
$$I=\int_0^\pi\frac{(\pi-x)\sin x}{1+\cos^2x}dx.$$
两式相加得
$$2I=\pi\int_0^\pi\frac{\sin x}{1+\cos^2x}dx
=\pi\left[-\arctan(\cos x)\right]_0^\pi=\frac{\pi^2}{2}.$$` },
      { title: '方法二 · 对称核加权公式', content: raw`核 $g(x)=\sin x/(1+\cos^2x)$ 满足 $g(\pi-x)=g(x)$。因此其关于 $\pi/2$ 的一阶中心矩为零，直接有 $\int_0^\pi xg(x)dx=(\pi/2)\int_0^\pi g(x)dx$，后一个积分为 $\pi/2$。` }
    ]
  }),
  lectureNine({
    id: 'exercise-9-13-odd-even-cube-root', role: 'exercise', page: 'PDF 261、265 · 书页 256、260 · 习题 9.13',
    fingerprint: 'definite-integral:odd-even-split-cube-root-of-x-squared',
    title: '习题 9.13 · 先拆奇偶再处理立方根',
    statement: raw`计算

$$\int_{-1}^{1}\frac{x+1}{1+\sqrt[3]{x^2}}\,dx.$$`,
    tags: ['定积分', '奇偶性', '根式换元'],
    coreMethod: raw`分子中的 $x$ 部分构成奇函数积分为零，常数部分为偶函数，再在半区间令 $u=\sqrt[3]{x^2}$。`,
    mistakes: raw`$\sqrt[3]{x^2}=|x|^{2/3}$ 是偶函数；不要把它误写成 $x^{2/3}$ 后在负半轴随意换元。`,
    answerText: raw`$$6-\frac{3\pi}{2}.$$`,
    solutionMethods: [
      { title: '方法一 · 奇偶分解', content: raw`原积分中 $x/(1+\sqrt[3]{x^2})$ 为奇函数，积分为零；剩余为
$$2\int_0^1\frac{dx}{1+x^{2/3}}.$$
令 $u=x^{1/3}$，得 $6\int_0^1u^2/(1+u^2)du=6-3\pi/2$。` },
      { title: '方法二 · 正负半轴配对', content: raw`把负半轴令 $x=-t$，与正半轴相加后分子 $(1-t)+(1+t)=2$，分母相同，直接得到上述两倍半区间积分，再完成根式换元。` }
    ]
  }),
  lectureNine({
    id: 'exercise-9-14-piecewise-definite-integral', role: 'exercise', page: 'PDF 261、265 · 书页 256、260 · 习题 9.14',
    fingerprint: 'definite-integral:piecewise-logistic-and-trig-rationalization',
    title: '习题 9.14 · 分段函数跨零点的定积分',
    statement: raw`设
$$f(x)=\begin{cases}
\dfrac1{1+\sin x},&x\ge0,\\
\dfrac1{1+e^x},&x<0,
\end{cases}$$
求 $\int_{-1}^{\pi/4}f(x)dx$。`,
    tags: ['定积分', '分段函数', '有理化'],
    coreMethod: raw`在 $x=0$ 分段：指数段令 $t=e^x$，三角段用 $(1-\sin x)/\cos^2x$ 有理化。`,
    mistakes: raw`分段点虽不影响积分值，但两种表达式的原函数不同，不能跨零点套用同一个原函数。`,
    answerText: raw`$$-\ln2+\ln(1+e)+2-\sqrt2.$$`,
    solutionMethods: [
      { title: '方法一 · 两段分别计算', content: raw`指数段
$$\int_{-1}^0\frac{dx}{1+e^x}=\ln(1+e)-\ln2.$$
三角段把 $1/(1+\sin x)$ 化为 $\sec^2x-\sec x\tan x$，积分值为 $[\tan x-\sec x]_0^{\pi/4}=2-\sqrt2$。` },
      { title: '方法二 · 对称变形复核', content: raw`指数段也可写 $1/(1+e^x)=1-e^x/(1+e^x)$，原函数为 $x-\ln(1+e^x)$；三角段利用 $1/(1+\sin x)=(1-\sin x)/\cos^2x$。分别代端点后得到同一和式。` }
    ]
  }),
  lectureNine({
    id: 'exercise-9-15-moving-absolute-value', role: 'exercise', page: 'PDF 261、265 · 书页 256、260 · 习题 9.15',
    fingerprint: 'absolute-integral:split-by-parameter-location-over-fixed-interval',
    title: '习题 9.15 · 移动分点绝对值积分',
    statement: raw`设 $x\ge-1$，求

$$F(x)=\int_{-1}^{x}(1-|t|)dt.$$`,
    tags: ['变限积分', '绝对值', '分段函数'],
    coreMethod: raw`积分路径是否跨过 $t=0$ 决定表达式；分别讨论 $-1\le x<0$ 与 $x\ge0$。`,
    mistakes: raw`绝对值的符号由积分变量 $t$ 决定，不是由外部参数 $x$ 决定。`,
    answerText: raw`$$F(x)=\begin{cases}
\dfrac12(1+x)^2,&-1\le x<0,\\
1-\dfrac12(1-x)^2,&x\ge0.
\end{cases}$$`,
    solutionMethods: [
      { title: '方法一 · 按路径分段', content: raw`当 $x<0$ 时 $1-|t|=1+t$，直接积分得 $(1+x)^2/2$。当 $x\ge0$ 时先积 $[-1,0]$ 的 $1+t$，再积 $[0,x]$ 的 $1-t$，得到 $1-(1-x)^2/2$。` },
      { title: '方法二 · 由导数重建', content: raw`基本定理给出 $F'(x)=1-|x|$，且 $F(-1)=0$。分别在负半轴与正半轴积分这一导数，并用 $F(0)=1/2$ 拼接，即得同一分段式。` }
    ]
  }),
  lectureNine({
    id: 'exercise-9-16-integral-functional-equation', role: 'exercise', page: 'PDF 261、266 · 书页 256、261 · 习题 9.16',
    fingerprint: 'integral-equation:scale-tx-substitution-and-differentiate',
    title: '习题 9.16 · 缩放上限积分方程',
    statement: raw`求连续函数 $f$，使

$$\int_0^1f(tx)dt=f(x)+x\sin x.$$`,
    tags: ['积分方程', '变限积分', '函数求解'],
    coreMethod: raw`当 $x\ne0$ 时令 $u=tx$，把左端化为 $x^{-1}\int_0^xf(u)du$，再求导得到 $f'$。`,
    mistakes: raw`不能把 $\int_0^1f(tx)dt$ 误认为关于 $x$ 的定积分常数；$x=0$ 最后用连续性单独核验。`,
    answerText: raw`$$f(x)=\cos x-x\sin x+C.$$`,
    solutionMethods: [
      { title: '方法一 · 缩放换元后求导', content: raw`对 $x\ne0$，题设等价于
$$\int_0^xf(u)du=xf(x)+x^2\sin x.$$
两端求导并消去 $f(x)$，得 $f'(x)=-2\sin x-x\cos x$。积分得到 $f=\cos x-x\sin x+C$，在 $x=0$ 也满足原式。` },
      { title: '方法二 · 代回验证常数自由度', content: raw`把候选写成 $f=g+C$。常数部分在左端积分后仍为 $C$，右端也为 $C$，故常数任意。对 $g=\cos x-x\sin x=(x\cos x)'$，有
$$\int_0^1g(tx)dt=\frac1x[t x\cos(tx)]_0^1=\cos x,$$
而 $g(x)+x\sin x=\cos x$。` }
    ]
  }),
  lectureNine({
    id: 'exercise-9-17-absolute-convolution-derivative', role: 'exercise', page: 'PDF 261、266-267 · 书页 256、261-262 · 习题 9.17',
    fingerprint: 'absolute-integral:parameter-crossing-piecewise-derivative',
    title: '习题 9.17 · 含参数绝对值积分的分段求导',
    statement: raw`设
$$f(x)=\int_0^1t|t-x|dt,$$
求 $f'(x)$。`,
    tags: ['含参积分', '绝对值', '分段求导'],
    coreMethod: raw`参数 $x$ 相对固定区间 $[0,1]$ 的位置有三种：$x<0$、$0\le x<1$、$x\ge1$。`,
    mistakes: raw`只在 $0<x<1$ 处分段而漏掉区间外两种情形；还需检查 $x=0,1$ 左右导数相等。`,
    answerText: raw`$$f'(x)=\begin{cases}
-\dfrac12,&x<0,\\
x^2-\dfrac12,&0\le x<1,\\
\dfrac12,&x\ge1.
\end{cases}$$`,
    solutionMethods: [
      { title: '方法一 · 显式分段积分', content: raw`区间外时绝对值符号固定，分别得 $f=1/3-x/2$ 与 $f=x/2-1/3$。区间内在 $t=x$ 处分开，化简为 $f=1/3-x/2+x^3/3$。逐段求导并检查边界，得到答案。` },
      { title: '方法二 · 符号函数积分', content: raw`对不在端点的 $x$，可写
$$f'(x)=-\int_0^1t\,\operatorname{sgn}(t-x)dt.$$
当 $x<0$、$0<x<1$、$x>1$ 时分别计算该符号积分，得到 $-1/2$、$x^2-1/2$、$1/2$；端点由左右极限补入。` }
    ]
  }),
  lectureNine({
    id: 'example-9-26-internal-improper-point', role: 'example', page: 'PDF 258 · 书页 253 · 例 9.26',
    fingerprint: 'improper-integral:absolute-radical-split-at-internal-singularity',
    title: '例 9.26 · 含绝对值根式的内部瑕点分段',
    statement: raw`计算反常积分

$$\int_{1/2}^{3/2}\frac{dx}{\sqrt{|x-x^2|}}.$$`,
    tags: ['反常积分', '内部瑕点', '分段积分'],
    coreMethod: raw`$x=1$ 既是绝对值变号点又是无穷间断点，必须在此处分成两个独立反常积分。`,
    mistakes: raw`把绝对值整体当成同一符号，或使用跨过 $x=1$ 无定义的原函数直接代上下限。`,
    answerText: raw`$$\frac\pi2+\ln(2+\sqrt3).$$`,
    solutionMethods: [
      { title: '方法一 · 瑕点处分段', content: raw`分成
$$\int_{1/2}^1\frac{dx}{\sqrt{x-x^2}}+\int_1^{3/2}\frac{dx}{\sqrt{x^2-x}}.$$
前者配方后为 $\arcsin(2x-1)|_{1/2}^1=\pi/2$；后者令 $u=2x-1$ 或用双曲型原函数，值为 $\ln(2+\sqrt3)$。` },
      { title: '方法二 · 两种标准换元', content: raw`在 $(0,1)$ 令 $x=(1+\sin t)/2$，被积函数化为 $dt$；在 $(1,+\infty)$ 令 $2x-1=\cosh u$，被积函数也化为 $du$。对应端点分别给出 $\pi/2$ 与 $\operatorname{arcosh}2=\ln(2+\sqrt3)$。` }
    ]
  }),
  lectureNine({
    id: 'example-9-27-tail-radical-substitution', role: 'example', page: 'PDF 258-259 · 书页 253-254 · 例 9.27',
    fingerprint: 'improper-integral:secant-substitution-rational-tail',
    title: '例 9.27 · 平移后正割换元计算无穷尾积分',
    statement: raw`计算

$$\int_3^{+\infty}\frac{dx}{(x-1)^4\sqrt{x^2-2x}}.$$`,
    tags: ['反常积分', '三角换元', '无穷区间'],
    coreMethod: raw`先识别 $x^2-2x=(x-1)^2-1$，再令 $x-1=\sec\theta$，根式与微分同时消去。`,
    mistakes: raw`换元下限 $x=3$ 对应 $\sec\theta=2$，即 $\theta=\pi/3$；无穷远对应 $\pi/2$。`,
    answerText: raw`$$\frac23-\frac{3\sqrt3}{8}.$$`,
    solutionMethods: [
      { title: '方法一 · 正割换元', content: raw`令 $x-1=\sec\theta$，则 $dx=\sec\theta\tan\theta d\theta$、$\sqrt{x^2-2x}=\tan\theta$。原式为
$$\int_{\pi/3}^{\pi/2}\cos^3\theta d\theta
=\left(\sin\theta-\frac13\sin^3\theta\right)_{\pi/3}^{\pi/2},$$
化简得答案。` },
      { title: '方法二 · 倒数换元', content: raw`令 $u=1/(x-1)$，则根式为 $\sqrt{1-u^2}/u$，积分化为
$$\int_0^{1/2}\frac{u^2}{\sqrt{1-u^2}}du.$$
再令 $u=\sin t$，计算 $\int_0^{\pi/6}\sin^2t dt$，与方法一结果一致。` }
    ]
  }),
  lectureNine({
    id: 'example-9-28-gamma-factorial', role: 'example', page: 'PDF 259 · 书页 254 · 例 9.28',
    fingerprint: 'gamma-integral:integer-factorial-recursion',
    title: '例 9.28 · Gamma 型积分的阶乘递推',
    statement: raw`设 $n$ 为非负整数，计算

$$I_n=\int_0^{+\infty}x^ne^{-x}dx.$$`,
    tags: ['反常积分', 'Gamma函数', '递推'],
    coreMethod: raw`分部积分建立 $I_n=nI_{n-1}$，同时严格检查无穷远边界项 $x^ne^{-x}$ 为零。`,
    mistakes: raw`直接写递推却没有验证边界项；指数衰减快于任意固定次幂是递推成立的关键。`,
    answerText: raw`$$I_n=n!.$$`,
    solutionMethods: [
      { title: '方法一 · 分部积分递推', content: raw`取 $u=x^n$、$dv=e^{-x}dx$，边界项 $[-x^ne^{-x}]_0^{+\infty}=0$，故 $I_n=nI_{n-1}$。又 $I_0=1$，递推得到 $I_n=n!$。` },
      { title: '方法二 · Gamma 函数', content: raw`按定义
$$\Gamma(a)=\int_0^{+\infty}x^{a-1}e^{-x}dx.$$
本题 $I_n=\Gamma(n+1)$，而 $\Gamma(n+1)=n\Gamma(n)=\cdots=n!\Gamma(1)=n!$。` }
    ]
  }),
  lectureNine({
    id: 'example-9-29-gaussian-moment', role: 'example', page: 'PDF 260 · 书页 255 · 例 9.29',
    fingerprint: 'gamma-integral:scaled-gaussian-fourth-moment',
    title: '例 9.29 · 标准化密度的二阶矩',
    statement: raw`设 $a>0$，
$$f(x)=\begin{cases}
\dfrac{4x^2}{a^3\sqrt\pi}e^{-x^2/a^2},&x>0,\\
0,&x\le0.
\end{cases}$$
计算 $\int_0^{+\infty}x^2f(x)dx$。`,
    tags: ['反常积分', 'Gamma函数', '高斯矩'],
    coreMethod: raw`先令 $u=x/a$ 提出尺度 $a^2$，剩余积分转成 $\Gamma(5/2)$。`,
    mistakes: raw`缩放时 $x^4dx$ 一共带出 $a^5$，再与分母 $a^3$ 抵消后才留下 $a^2$。`,
    answerText: raw`$$\frac32a^2.$$`,
    solutionMethods: [
      { title: '方法一 · Gamma 换元', content: raw`代入 $f$ 并令 $u=(x/a)^2$，可得
$$\int_0^\infty x^2f(x)dx=\frac{2a^2}{\sqrt\pi}\Gamma(5/2).$$
由 $\Gamma(5/2)=\frac32\cdot\frac12\sqrt\pi$，结果为 $3a^2/2$。` },
      { title: '方法二 · 高斯矩递推', content: raw`先令 $y=x/a$，积分化为 $(4a^2/\sqrt\pi)\int_0^\infty y^4e^{-y^2}dy$。分部积分给出
$$\int_0^\infty y^4e^{-y^2}dy=\frac32\int_0^\infty y^2e^{-y^2}dy=\frac{3\sqrt\pi}{8},$$
故仍得 $3a^2/2$。` }
    ]
  }),
  lectureNine({
    id: 'exercise-9-1-recover-xf', role: 'exercise', page: 'PDF 260-261 · 书页 255-256 · 习题 9.1',
    fingerprint: 'functional-recovery:antiderivative-of-x-f-then-reciprocal',
    title: '习题 9.1 · 由 $xf(x)$ 的原函数计算倒数积分',
    statement: raw`若
$$\int xf(x)dx=\arcsin x+C,$$
求 $\int dx/f(x)$。`,
    tags: ['不定积分', '函数恢复', '凑微分'],
    coreMethod: raw`先对题设求导得到 $xf(x)=1/\sqrt{1-x^2}$，再取倒数并直接凑 $1-x^2$ 的微分。`,
    mistakes: raw`题设给的是 $xf(x)$ 而不是 $f(x)$；漏掉因子 $x$ 会把所求错化成半圆面积积分。`,
    answerText: raw`$$-\frac13(1-x^2)^{3/2}+C.$$`,
    solutionMethods: [
      { title: '方法一 · 求导恢复', content: raw`由题设 $xf(x)=1/\sqrt{1-x^2}$，所以 $1/f(x)=x\sqrt{1-x^2}$。令 $u=1-x^2$，即得
$$-\frac12\int u^{1/2}du=-\frac13u^{3/2}+C.$$` },
      { title: '方法二 · 候选求导', content: raw`直接求导 $-(1-x^2)^{3/2}/3$，得到 $x\sqrt{1-x^2}$。而由题设恢复的 $1/f(x)$ 正是该式，故答案闭合。` }
    ]
  }),
  lectureNine({
    id: 'exercise-9-2-integral-self-consistency', role: 'exercise', page: 'PDF 260-262 · 书页 255-257 · 习题 9.2',
    fingerprint: 'integral-equation:scalar-definite-integral-self-consistency',
    title: '习题 9.2 · 把定积分整体视为常数求解',
    statement: raw`若
$$f(x)=\frac1{1+x^2}+x^3\int_0^1f(x)dx,$$
求 $\int_0^1f(x)dx$。`,
    tags: ['积分方程', '定积分', '待定常数'],
    coreMethod: raw`把 $A=\int_0^1f$ 视为与外部自变量无关的常数，对题设两端在 $[0,1]$ 积分。`,
    mistakes: raw`积分号内的 $x$ 是哑变量，最好改写为 $\int_0^1f(t)dt$，避免与题设外部的 $x$ 混淆。`,
    answerText: raw`$$\int_0^1f(x)dx=\frac\pi3.$$`,
    solutionMethods: [
      { title: '方法一 · 整体设元', content: raw`令 $A=\int_0^1f(t)dt$。两端积分得
$$A=\int_0^1\frac{dx}{1+x^2}+A\int_0^1x^3dx=\frac\pi4+\frac A4.$$
解得 $A=\pi/3$。` },
      { title: '方法二 · 先写显式函数', content: raw`题设已经给出 $f(x)=1/(1+x^2)+Ax^3$。对它积分后必须满足定义 $A=\pi/4+A/4$；该线性自洽方程只有唯一解 $\pi/3$，代回即可验证。` }
    ]
  }),
  lectureNine({
    id: 'exercise-9-3-exponential-limit', role: 'exercise', page: 'PDF 260、262 · 书页 255、257 · 习题 9.3',
    fingerprint: 'limit:one-minus-reciprocal-power-times-exponential-ratio',
    title: '习题 9.3 · 重要极限与指数尺度分离',
    statement: raw`计算
$$\lim_{x\to+\infty}\frac{\displaystyle\int_e^x\left(1-\frac1t\right)^t e^{et}dt}{e^{ex}}.$$`,
    tags: ['变限积分', '极限', '洛必达法则'],
    coreMethod: raw`分子、分母都趋于无穷，使用洛必达后只剩 $(1-1/x)^x$ 与一个指数比值。`,
    mistakes: raw`分母 $e^{ex}$ 中的指数是常数 $e$ 与 $x$ 的乘积，求导后会多出系数 $e$。`,
    answerText: raw`极限为 $e^{-2}$。`,
    solutionMethods: [
      { title: '方法一 · 洛必达', content: raw`分子、分母都趋于正无穷。由变限积分求导与链式法则，原极限等于
$$\lim_{x\to\infty}\frac{(1-1/x)^xe^{ex}}{e\,e^{ex}}
=\frac1e\lim_{x\to\infty}(1-1/x)^x=e^{-2}.$$` },
      { title: '方法二 · 端点主导', content: raw`被积函数为 $(1-1/t)^t e^{et}$，其中前因子趋于 $e^{-1}$。因此其一个渐近原函数为 $(e^{-1}/e)e^{et}=e^{-2}e^{et}$，积分下端相对上端可忽略，故与分母 $e^{ex}$ 的商趋于 $e^{-2}$。` }
    ]
  }),
  lectureNine({
    id: 'exercise-9-4-antiderivative-and-by-parts', role: 'exercise', page: 'PDF 261-262 · 书页 256-257 · 习题 9.4',
    fingerprint: 'integration-by-parts:recover-f-from-log-squared-antiderivative',
    title: '习题 9.4 · 已知原函数时积分 $xf\prime(x)$',
    statement: raw`设 $f(x)$ 的一个原函数为 $\ln^2x$，求
$$\int xf'(x)dx.$$`,
    tags: ['不定积分', '分部积分', '原函数'],
    coreMethod: raw`由原函数先得到 $f(x)=2\ln x/x$，同时利用 $\int xf'=xf-\int f$。`,
    mistakes: raw`“$f$ 的原函数为 $\ln^2x$”表示 $(\ln^2x)'=f(x)$，不是 $f(x)=\ln^2x$。`,
    answerText: raw`$$2\ln x-\ln^2x+C.$$`,
    solutionMethods: [
      { title: '方法一 · 分部积分', content: raw`有 $f(x)=2\ln x/x$。由
$$\int xf'(x)dx=xf(x)-\int f(x)dx,$$
得到 $2\ln x-\ln^2x+C$。` },
      { title: '方法二 · 显式求导后积分', content: raw`先算 $f'(x)=2(1-\ln x)/x^2$，所以 $xf'(x)=2(1-\ln x)/x$。分成 $2/x-2\ln x/x$ 两项积分，同样得到答案。` }
    ]
  }),
  lectureNine({
    id: 'exercise-9-5-arcsine-square-root', role: 'exercise', page: 'PDF 261-262 · 书页 256-257 · 习题 9.5',
    fingerprint: 'substitution:square-root-removes-denominator-before-arcsine-by-parts',
    title: '习题 9.5 · 先去根号再对反正弦分部积分',
    statement: raw`求

$$\int\frac{\arcsin\sqrt{x}}{\sqrt{x}}dx.$$`,
    tags: ['不定积分', '根式换元', '分部积分'],
    coreMethod: raw`令 $t=\sqrt{x}$ 后分母与 $dx$ 抵消，化为标准的 $2\int\arcsin tdt$。`,
    mistakes: raw`换元后 $dx=2t\,dt$，原分母正好消去；不要多留或少留一个 $t$。`,
    answerText: raw`$$2\sqrt{x}\arcsin\sqrt{x}+2\sqrt{1-x}+C.$$`,
    solutionMethods: [
      { title: '方法一 · 根式换元', content: raw`令 $t=\sqrt{x}$，原式为 $2\int\arcsin tdt$。分部积分得
$$2[t\arcsin t+\sqrt{1-t^2}]+C,$$
回代即得。` },
      { title: '方法二 · 候选求导', content: raw`求导 $2\sqrt{x}\arcsin\sqrt{x}$ 会产生目标项和 $1/\sqrt{1-x}$；后者恰被 $2\sqrt{1-x}$ 的导数抵消，只留下题设被积函数。` }
    ]
  }),
  lectureNine({
    id: 'exercise-9-6-improper-root-rational', role: 'exercise', page: 'PDF 261-262 · 书页 256-257 · 习题 9.6',
    fingerprint: 'improper-integral:square-root-shift-to-arctangent-tail',
    title: '习题 9.6 · 根式换元后的反正切尾积分',
    statement: raw`计算

$$\int_2^{+\infty}\frac{dx}{(x+7)\sqrt{x-2}}.$$`,
    tags: ['反常积分', '根式换元', '反正切'],
    coreMethod: raw`令 $t=\sqrt{x-2}$，则 $x+7=t^2+9$，直接化成标准反正切积分。`,
    mistakes: raw`无穷上限换元后仍为无穷；应保留极限写法而不是把 $+\infty$ 当普通数代入。`,
    answerText: raw`$$\frac\pi3.$$`,
    solutionMethods: [
      { title: '方法一 · 根式换元', content: raw`令 $x=t^2+2$、$dx=2t dt$，则
$$\int_0^{\infty}\frac{2dt}{t^2+9}=\frac23\arctan\frac t3\Big|_0^\infty=\frac\pi3.$$` },
      { title: '方法二 · 三角换元', content: raw`直接令 $\sqrt{x-2}=3\tan\theta$，则 $x+7=9\sec^2\theta$，微分也含 $\sec^2\theta$，积分化为 $2d\theta/3$。端点 $0$ 到 $\pi/2$ 给出同一结果。` }
    ]
  }),
  lectureNine({
    id: 'exercise-9-7-arcsine-rational-root', role: 'exercise', page: 'PDF 261-262 · 书页 256-257 · 习题 9.7',
    fingerprint: 'integration-by-parts:arcsine-root-ratio-to-tangent-squared',
    title: '习题 9.7 · 反正弦根式整体作新变量',
    statement: raw`设 $a>0$，计算

$$\int\arcsin\sqrt{\frac{x}{a+x}}\,dx.$$`,
    tags: ['不定积分', '反三角换元', '分部积分'],
    coreMethod: raw`直接令整个反正弦为 $t$，由 $x=a\tan^2t$ 把 $dx$ 与积分同时化为三角有理式。`,
    mistakes: raw`从 $\sin^2t=x/(a+x)$ 解 $x$ 时漏掉分母，正确结果是 $x=a\tan^2t$。`,
    answerText: raw`$$(a+x)\arcsin\sqrt{\frac{x}{a+x}}-\sqrt{ax}+C.$$`,
    solutionMethods: [
      { title: '方法一 · 整体换元', content: raw`令 $t=\arcsin\sqrt{x/(a+x)}$，则 $x=a\tan^2t$。原式
$$\int t\,d(a\tan^2t)=at\tan^2t-a\int\tan^2t dt.$$
用 $\int\tan^2t dt=\tan t-t$，回代后化简为答案。` },
      { title: '方法二 · 直接分部积分', content: raw`取反正弦为 $u$、$dv=dx$。算得
$$du=\frac{\sqrt a}{2\sqrt x(a+x)}dx.$$
于是 $xdu=\frac{\sqrt{ax}}{2(a+x)}dx$；令 $x=a\tan^2t$ 即可完成剩余积分并得到同一式。` }
    ]
  }),
  lectureNine({
    id: 'exercise-9-8-arctangent-exponential-by-parts', role: 'exercise', page: 'PDF 261、263 · 书页 256、258 · 习题 9.8',
    fingerprint: 'integration-by-parts:e-minus-x-times-arctan-e-x',
    title: '习题 9.8 · 指数倒数与反正切的分部积分',
    statement: raw`求

$$\int\frac{\arctan e^x}{e^x}dx.$$`,
    tags: ['不定积分', '分部积分', '指数换元'],
    coreMethod: raw`不满足直接凑微分，取 $dv=e^{-x}dx$，反正切求导后得到可拆分的 Logistic 型积分。`,
    mistakes: raw`对 $\arctan e^x$ 求导应为 $e^x/(1+e^{2x})$；与 $e^{-x}$ 相乘后才简化。`,
    answerText: raw`$$-e^{-x}\arctan e^x+x-\frac12\ln(1+e^{2x})+C.$$`,
    solutionMethods: [
      { title: '方法一 · 直接分部积分', content: raw`取 $u=\arctan e^x$、$dv=e^{-x}dx$，得
$$-e^{-x}\arctan e^x+\int\frac{dx}{1+e^{2x}}.$$
再写 $1/(1+e^{2x})=1-e^{2x}/(1+e^{2x})$，即可积分得到答案。` },
      { title: '方法二 · 先令 $t=e^x$', content: raw`原式化为 $\int\arctan t\,dt/t^2$。分部积分取 $dv=dt/t^2$，剩余为 $\int dt/[t(1+t^2)]$，拆成 $1/t-t/(1+t^2)$ 后积分并回代。` }
    ]
  }),
  lectureNine({
    id: 'exercise-9-9-piecewise-max-antiderivative', role: 'exercise', page: 'PDF 261、263 · 书页 256、258 · 习题 9.9',
    fingerprint: 'piecewise-antiderivative:max-one-absolute-x-continuity-matching',
    title: '习题 9.9 · 最大值函数的分段原函数拼接',
    statement: raw`求

$$\int\max\{1,|x|\}\,dx.$$`,
    tags: ['不定积分', '分段函数', '连续拼接'],
    coreMethod: raw`先按 $x=-1,1$ 分段写出被积函数，再分别积分并用原函数连续性匹配常数。`,
    mistakes: raw`各段随意使用互不相关的积分常数，会得到在分界点跳跃、从而不可能处处可导的函数。`,
    answerText: raw`可取
$$F(x)=\begin{cases}
-x^2/2+C,&x<-1,\\
x+1/2+C,&-1\le x\le1,\\
x^2/2+1+C,&x>1.
\end{cases}$$`,
    solutionMethods: [
      { title: '方法一 · 分段积分配常数', content: raw`被积函数为 $-x$、$1$、$x$ 三段。分别积分后令左中两段在 $-1$ 相等、中右两段在 $1$ 相等，可将三个常数统一为题给形式。逐段求导均恢复原函数。` },
      { title: '方法二 · 从零点积分构造', content: raw`直接定义 $F(x)=\int_0^x\max\{1,|t|\}dt$。按积分路径是否越过 $\pm1$ 计算，得到中段 $x$、右段 $x^2/2+1/2$、左段 $-x^2/2-1/2$；再整体加常数并等价改写即可。` }
    ]
  }),
  lectureNine({
    id: 'example-9-11-recover-integrand-from-composition', role: 'example', page: 'PDF 248-249 · 书页 243-244 · 例 9.11',
    fingerprint: 'functional-recovery:x-plus-reciprocal-composition-definite-integral',
    title: '例 9.11 · 由复合自变量反求被积函数',
    statement: raw`已知
$$f\left(x+\frac1x\right)=\frac{x+x^3}{1+x^4},$$
计算
$$\int_2^{2\sqrt2}f(x)\,dx.$$`,
    tags: ['定积分', '函数关系', '换元'],
    coreMethod: raw`先把右端改写成关于 $u=x+1/x$ 的函数，再在积分区间上直接使用恢复后的 $f(u)$。`,
    mistakes: raw`没有先确认 $u=x+1/x$ 的值域；本题积分自变量从 $2$ 起，正好落在可恢复的区间内。`,
    answerText: raw`$$\frac12\ln3.$$`,
    solutionMethods: [
      { title: '方法一 · 代数消元', content: raw`有
$$\frac{x+x^3}{1+x^4}=\frac{x(x^2+1)}{(x^2+1)^2-2x^2}
=\frac{x+1/x}{(x+1/x)^2-2}.$$
因此当 $u\ge2$ 时 $f(u)=u/(u^2-2)$。直接积分得 $\frac12\ln(u^2-2)\big|_2^{2\sqrt2}=\frac12\ln3$。` },
      { title: '方法二 · 反函数区间复核', content: raw`对 $x\ge1$，映射 $u=x+1/x$ 取值为 $[2,+\infty)$，足以覆盖积分区间。把 $u=2$ 与 $u=2\sqrt2$ 代入原式恢复的 $f(u)$，端点均合法，积分结果不存在分支歧义。` }
    ]
  }),
  lectureNine({
    id: 'example-9-12-logarithmic-riemann-reflection', role: 'example', page: 'PDF 250-251 · 书页 245-246 · 例 9.12',
    fingerprint: 'riemann-sum:log-ratio-antisymmetry',
    title: '例 9.12 · 对数黎曼和的区间反射消去',
    statement: raw`计算极限

$$\lim_{n\to\infty}\frac1n\sum_{i=1}^n
[\ln(3n-2i)-\ln(n+2i)].$$`,
    tags: ['黎曼和', '区间反射', '奇函数'],
    coreMethod: raw`把每项中的 $n$ 约去，识别为 $[0,1]$ 上 $\ln[(3-2x)/(1+2x)]$ 的黎曼和，再利用中点反射。`,
    mistakes: raw`把两个对数和分别看成发散量；应先合并比值，公共的 $\ln n$ 会完全抵消。`,
    answerText: raw`极限为 $0$。`,
    solutionMethods: [
      { title: '方法一 · 黎曼和与反射', content: raw`极限为
$$I=\int_0^1\ln\frac{3-2x}{1+2x}dx.$$
令 $x=1/2-t$，区间变为对称的 $[-1/2,1/2]$，被积函数化为 $\ln[(1-t)/(1+t)]$，它是奇函数，故积分为零。` },
      { title: '方法二 · 配对积分', content: raw`记 $g(x)=\ln[(3-2x)/(1+2x)]$。直接验证 $g(1-x)=-g(x)$，于是
$$2I=\int_0^1[g(x)+g(1-x)]dx=0.$$` }
    ]
  }),
  lectureNine({
    id: 'example-9-13-even-radical-definite-integral', role: 'example', page: 'PDF 251 · 书页 246 · 例 9.13',
    fingerprint: 'definite-integral:even-semicircle-fourth-power-reduction',
    title: '例 9.13 · 偶函数化半区间并降幂',
    statement: raw`计算

$$\int_{-1}^{1}x^2\sqrt{1-x^2}\,dx.$$`,
    tags: ['定积分', '偶函数', '三角换元'],
    coreMethod: raw`先用偶性化为两倍半区间积分，再令 $x=\sin t$，最后用幂次积分公式或倍角公式。`,
    mistakes: raw`换元后 $\sqrt{1-\sin^2t}=\cos t$ 依赖于 $t\in[0,\pi/2]$；若在全区间直接换元容易漏绝对值。`,
    answerText: raw`$$\frac\pi8.$$`,
    solutionMethods: [
      { title: '方法一 · 正弦换元', content: raw`原式为 $2\int_0^1x^2\sqrt{1-x^2}dx$。令 $x=\sin t$，得
$$2\int_0^{\pi/2}\sin^2t\cos^2t\,dt
=\frac14\int_0^{\pi/2}(1-\cos4t)dt=\frac\pi8.$$` },
      { title: '方法二 · Beta 积分', content: raw`令 $u=x^2$，半区间积分为
$$\frac12\int_0^1u^{1/2}(1-u)^{1/2}du=\frac12B(3/2,3/2).$$
再乘偶性因子 $2$，得到 $B(3/2,3/2)=\pi/8$。` }
    ]
  }),
  lectureNine({
    id: 'example-9-14-arcsine-radical-definite', role: 'example', page: 'PDF 251-252 · 书页 246-247 · 例 9.14',
    fingerprint: 'definite-integral:arcsine-semicircle-by-parts',
    title: '例 9.14 · 反正弦根式积分的分部化简',
    statement: raw`计算

$$\int_0^1\arcsin\sqrt{1-x^2}\,dx.$$`,
    tags: ['定积分', '分部积分', '三角换元'],
    coreMethod: raw`反三角函数适合作为分部积分中求导的一侧；求导后根式恰好抵消为基本积分。`,
    mistakes: raw`忽略 $x\in[0,1]$ 时 $\arcsin\sqrt{1-x^2}=\arccos x$，会把换元区间与符号写乱。`,
    answerText: raw`积分值为 $1$。`,
    solutionMethods: [
      { title: '方法一 · 分部积分', content: raw`取 $u=\arcsin\sqrt{1-x^2}$、$dv=dx$。端点项为零，且 $du=-dx/\sqrt{1-x^2}$，故
$$I=\int_0^1\frac{x}{\sqrt{1-x^2}}dx=1.$$` },
      { title: '方法二 · 化为反余弦', content: raw`在所给区间 $\sqrt{1-x^2}=\sin(\arccos x)$，所以被积函数为 $\arccos x$。标准原函数
$$x\arccos x-\sqrt{1-x^2}$$
在 $0,1$ 代入后同样给出 $1$。` }
    ]
  }),
  lectureNine({
    id: 'example-9-15-symmetric-arcsine-radical', role: 'example', page: 'PDF 252 · 书页 247 · 例 9.15',
    fingerprint: 'definite-integral:centered-reflection-eliminates-linear-weight',
    title: '例 9.15 · 中心换元消去一次权重',
    statement: raw`计算

$$\int_0^1x\arcsin\sqrt{4x-4x^2}\,dx.$$`,
    tags: ['定积分', '中心对称', '反三角函数'],
    coreMethod: raw`令 $t=1-2x$，把根式化为 $\sqrt{1-t^2}$；线性权重分成偶、奇两部分，奇部在对称区间积分为零。`,
    mistakes: raw`换元时忘记积分限由 $1$ 变为 $-1$，以及 $dx=-dt/2$，会同时造成符号和系数错误。`,
    answerText: raw`积分值为 $1/2$。`,
    solutionMethods: [
      { title: '方法一 · 中心平移', content: raw`令 $t=1-2x$，则
$$I=\frac14\int_{-1}^1(1-t)\arcsin\sqrt{1-t^2}dt.$$
第二项为奇函数积分，第一项由偶性等于 $\frac12\int_0^1\arcsin\sqrt{1-t^2}dt=1/2$。` },
      { title: '方法二 · 对称配对', content: raw`记 $g(x)=\arcsin\sqrt{4x(1-x)}$，则 $g(1-x)=g(x)$。由区间反射
$$I=\int_0^1(1-x)g(x)dx.$$
两式相加得 $2I=\int_0^1g(x)dx$；再作 $t=1-2x$ 并用例 9.14，得到 $2I=1$。` }
    ]
  }),
  lectureNine({
    id: 'example-9-16-periodic-integral-invariance', role: 'example', page: 'PDF 252 · 书页 247 · 例 9.16',
    fingerprint: 'periodic-integral:any-one-period-has-same-value',
    title: '例 9.16 · 任意完整周期上的积分不变',
    statement: raw`设连续函数 $f$ 以 $T$ 为周期。证明对任意实数 $a$，

$$\int_a^{a+T}f(x)\,dx=\int_0^Tf(x)\,dx.$$`,
    tags: ['定积分', '周期函数', '证明题'],
    coreMethod: raw`把区间在 $0$ 与 $T$ 处分割，再用周期换元把越过周期边界的一段平移回来。`,
    mistakes: raw`只凭图像说面积相同而没有处理 $a$ 可为任意实数；分割与周期平移能给出严格证明。`,
    answerText: raw`任意长度为 $T$ 的积分区间都有相同积分值。`,
    solutionMethods: [
      { title: '方法一 · 分割后周期平移', content: raw`先将 $a$ 按周期平移到 $[0,T)$。分割
$$\int_a^{a+T}f=\int_a^Tf+\int_T^{a+T}f.$$
第二项令 $u=x-T$，由 $f(u+T)=f(u)$ 得 $\int_0^af(u)du$，两段合并即为 $\int_0^Tf$。` },
      { title: '方法二 · 对起点求导', content: raw`令 $G(a)=\int_a^{a+T}f(x)dx$。由变限积分求导
$$G'(a)=f(a+T)-f(a)=0.$$
因此 $G$ 为常数，取 $a=0$ 即得结论。` }
    ]
  }),
  lectureNine({
    id: 'example-9-17-interval-reflection-identity', role: 'example', page: 'PDF 252-253 · 书页 247-248 · 例 9.17',
    fingerprint: 'definite-integral:interval-reflection-identity',
    title: '例 9.17 · 定积分的区间再现公式',
    statement: raw`设 $f$ 连续，证明

$$\int_a^bf(x)\,dx=\int_a^bf(a+b-x)\,dx.$$`,
    tags: ['定积分', '区间反射', '证明题'],
    coreMethod: raw`使用关于区间中点的反射换元 $x=a+b-t$，同时处理上下限反转与负微分。`,
    mistakes: raw`换元后上下限从 $b$ 到 $a$，若漏掉 $dx=-dt$ 会多出一个错误负号。`,
    answerText: raw`两积分相等；进而可用二者平均来化简复杂被积函数。`,
    solutionMethods: [
      { title: '方法一 · 反射换元', content: raw`令 $x=a+b-t$，则 $dx=-dt$，当 $x=a,b$ 时 $t=b,a$。于是
$$\int_a^bf(x)dx=\int_b^af(a+b-t)(-dt)=\int_a^bf(a+b-t)dt.$$` },
      { title: '方法二 · 中点平移', content: raw`令 $m=(a+b)/2$、$x=m+u$，原积分成为 $\int_{-(b-a)/2}^{(b-a)/2}f(m+u)du$。再令 $u=-v$ 即变为 $\int f(m-v)dv$，而 $m-v=a+b-(m+v)$，所以得到同一反射式。` }
    ]
  }),
  lectureNine({
    id: 'example-9-18-weighted-sine-power', role: 'example', page: 'PDF 253 · 书页 248 · 例 9.18',
    fingerprint: 'definite-integral:reflection-linear-weight-times-symmetric-kernel',
    title: '例 9.18 · 线性权重与对称核的反射降维',
    statement: raw`设 $f$ 在 $[0,1]$ 上连续，证明
$$\int_0^\pi x f(\sin x)dx=\frac\pi2\int_0^\pi f(\sin x)dx,$$
并计算 $\int_0^\pi x\sin^9x\,dx$。`,
    tags: ['定积分', '区间反射', '华里士公式'],
    coreMethod: raw`反射 $x\mapsto\pi-x$ 后核 $f(\sin x)$ 不变，线性权重与原式相加变成常数 $\pi$。`,
    mistakes: raw`把 $\sin(\pi-x)$ 写成 $-\sin x$；在 $[0,\pi]$ 的反射下正弦保持不变。`,
    answerText: raw`$$\int_0^\pi x\sin^9x\,dx=\frac{128\pi}{315}.$$`,
    solutionMethods: [
      { title: '方法一 · 区间反射', content: raw`记左端为 $I$。反射后
$$I=\int_0^\pi(\pi-x)f(\sin x)dx.$$
两式相加得 $2I=\pi\int_0^\pi f(\sin x)dx$。取 $f(u)=u^9$，并用 $\int_0^\pi\sin^9x dx=256/315$，即得答案。` },
      { title: '方法二 · 关于中点的奇偶分解', content: raw`写 $x=\pi/2+(x-\pi/2)$。核 $f(\sin x)$ 关于 $\pi/2$ 对称，而 $(x-\pi/2)$ 反对称，所以后者乘积积分为零，只留下 $(\pi/2)\int f(\sin x)$。再用正弦幂递推计算。` }
    ]
  }),
  lectureNine({
    id: 'example-9-19-variable-limit-weighted-integral', role: 'example', page: 'PDF 253-254 · 书页 248-249 · 例 9.19',
    fingerprint: 'variable-upper-integral:weighted-by-x-and-integration-by-parts',
    title: '例 9.19 · 不能显式积分时先求端值与导数',
    statement: raw`设
$$f(x)=\int_1^{x^2}e^{-t^2}dt,$$
则 $\int_0^1xf(x)dx$ 等于（ ）。`,
    tags: ['变限积分', '分部积分', '选择题'],
    coreMethod: raw`把 $x$ 积成 $x^2/2$，只需知道 $f(1)$ 和 $f'(x)$，不必求 $f$ 的初等表达式。`,
    mistakes: raw`把积分变量 $t$ 与求导变量 $x$ 混淆；$f'(x)=2xe^{-x^4}$ 而不是 $e^{-x^2}$。`,
    answerText: raw`正确选项为 B，即 $(e^{-1}-1)/4$。`,
    questionFormat: 'single-choice',
    options: [raw`$\dfrac14(e^{-1}+1)$`, raw`$\dfrac14(e^{-1}-1)$`, raw`$\dfrac14(e+1)$`, raw`$\dfrac14(e-1)$`],
    correctOptionIds: ['B'],
    solutionMethods: [
      { title: '方法一 · 分部积分', content: raw`有 $f(1)=0$、$f'(x)=2xe^{-x^4}$。因此
$$\int_0^1xf(x)dx=\left.\frac{x^2}2f(x)\right|_0^1-\int_0^1\frac{x^2}2f'(x)dx
=-\int_0^1x^3e^{-x^4}dx=\frac14(e^{-1}-1).$$` },
      { title: '方法二 · 交换积分次序', content: raw`因 $0\le x\le1$ 时 $f(x)=-\int_{x^2}^1e^{-t^2}dt$，可在区域 $0\le x\le\sqrt t\le1$ 上换序：
$$-\int_0^1e^{-t^2}\int_0^{\sqrt t}x\,dxdt=-\frac12\int_0^1te^{-t^2}dt,$$
结果相同。` }
    ]
  }),
  lectureNine({
    id: 'example-9-20-normal-line-variable-integral', role: 'example', page: 'PDF 254 · 书页 249 · 例 9.20',
    fingerprint: 'variable-upper-integral:curve-normal-at-origin',
    title: '例 9.20 · 变限积分曲线的法线',
    statement: raw`曲线
$$y=\int_0^{\sin x}e^{t^2}dt$$
在点 $(0,0)$ 处的法线方程是（ ）。`,
    tags: ['变限积分', '切线法线', '选择题'],
    coreMethod: raw`先核对给定点在曲线上，再由链式法则求切线斜率，法线斜率取负倒数。`,
    mistakes: raw`把上限 $\sin x$ 的导数漏掉；或把切线方程 $y=x$ 误当作法线。`,
    answerText: raw`正确选项为 D，即 $y=-x$。`,
    questionFormat: 'single-choice',
    options: [raw`$y=\dfrac12x$`, raw`$y=-\dfrac12x$`, raw`$y=x$`, raw`$y=-x$`],
    correctOptionIds: ['D'],
    solutionMethods: [
      { title: '方法一 · 基本定理与链式法则', content: raw`有
$$y'=e^{\sin^2x}\cos x,$$
所以 $y'(0)=1$。切线斜率为 $1$，法线斜率为 $-1$，且通过原点，故法线为 $y=-x$。` },
      { title: '方法二 · 局部展开', content: raw`当 $x\to0$ 时，上限 $\sin x=x+o(x)$，被积函数 $e^{t^2}=1+o(1)$，故 $y=x+o(x)$。因此曲线在原点的一阶主部斜率为 $1$，法线同样为 $y=-x$。` }
    ]
  }),
  lectureNine({
    id: 'example-9-21-absolute-integral-taylor', role: 'example', page: 'PDF 254-255 · 书页 249-250 · 例 9.21',
    fingerprint: 'absolute-integral:split-moving-sign-point-and-taylor-coefficients',
    title: '例 9.21 · 含绝对值积分的右侧 Taylor 系数',
    statement: raw`设
$$F(x)=\int_0^{\pi/2}|\sin x-\sin t|dt\quad(x\ge0).$$
当 $x\to0^+$ 时，$F(x)=a+bx+cx^2+o(x^2)$，求 $abc$。`,
    tags: ['绝对值积分', 'Taylor展开', '变限积分'],
    coreMethod: raw`对小的正 $x$，符号在 $t=x$ 处改变；先分段去绝对值，再展开或直接求右导数。`,
    mistakes: raw`把 $x=0$ 两侧混用；题目只要求右侧展开，移动分点为 $t=x$。`,
    answerText: raw`$$abc=-\frac\pi2.$$`,
    solutionMethods: [
      { title: '方法一 · 分段后展开', content: raw`当 $x\to0^+$ 时
$$F=\int_0^x(\sin x-\sin t)dt+\int_x^{\pi/2}(\sin t-\sin x)dt
=(2x-\pi/2)\sin x+2\cos x-1.$$
展开得 $F=1-(\pi/2)x+x^2+o(x^2)$，故 $abc=-\pi/2$。` },
      { title: '方法二 · 右导数定系数', content: raw`由显式式子可得 $F(0)=1$、$F'_+(0)=-\pi/2$、$F''_+(0)=2$。Taylor 系数为 $a=F(0)=1$、$b=F'_+(0)$、$c=F''_+(0)/2=1$，乘积即答案。` }
    ]
  }),
  lectureNine({
    id: 'example-9-22-integral-transform-extremum', role: 'example', page: 'PDF 255-256 · 书页 250-251 · 例 9.22',
    fingerprint: 'integral-transform:quadratic-substitution-second-derivative-extremum',
    title: '例 9.22 · 先换掉积分中的求导变量再判极值',
    statement: raw`设 $f$ 可导，且 $f(x)<-2xf'(x)$。令
$$F(x)=\int_0^xtf(x^2-t^2)dt.$$
判断曲线 $y=F(x)$ 在原点附近的性质。`,
    tags: ['变限积分', '极值', '换元'],
    coreMethod: raw`令 $u=x^2-t^2$ 把积分化为只含上限 $x^2$ 的标准变限积分，再用给定不等式判二阶导数符号。`,
    mistakes: raw`直接对原积分求导会同时出现端点项和含参被积函数项，计算很长且容易漏项。`,
    answerText: raw`$F$ 在 $x=0$ 处取得极大值，正确选项为 A。`,
    questionFormat: 'single-choice',
    options: ['在 $x=0$ 处取极大值', '在 $x=0$ 处取极小值', '拐点是 $(0,0)$', '原点既非极值点也非拐点'],
    correctOptionIds: ['A'],
    solutionMethods: [
      { title: '方法一 · 换元后二阶导', content: raw`令 $u=x^2-t^2$，则
$$F(x)=\frac12\int_0^{x^2}f(u)du.$$
于是 $F'=xf(x^2)$，$F''=f(x^2)+2x^2f'(x^2)<0$。又 $F'(0)=0$，故原点为严格极大值点。` },
      { title: '方法二 · 一阶导数变号', content: raw`给定不等式在 $x=0$ 给出 $f(0)<0$。由连续性，原点邻域内 $f(x^2)<0$，所以 $F'(x)=xf(x^2)$ 在左侧为正、右侧为负，直接判定 $x=0$ 为极大值点。` }
    ]
  }),
  lectureNine({
    id: 'example-9-2-hidden-composite-derivative', role: 'example', page: 'PDF 239 · 书页 234 · 例 9.2',
    fingerprint: 'hidden-derivative:sin-over-cos-plus-sin-composite-exponential',
    title: '例 9.2 · 先识别隐藏导数再整体凑微分',
    statement: raw`求不定积分

$$\int e^{\frac{\sin\theta}{\cos\theta+\sin\theta}}
\frac{d\theta}{(\cos\theta+\sin\theta)^2}.$$`,
    tags: ['不定积分', '复合函数', '凑微分'],
    coreMethod: raw`先对复杂分式 $\sin\theta/(\cos\theta+\sin\theta)$ 求导，发现剩余因子恰好是它的微分。`,
    mistakes: raw`盲目展开三角函数或把指数整体求导时漏掉分母平方；先验算中间函数的导数最稳。`,
    answerText: raw`$$e^{\frac{\sin\theta}{\cos\theta+\sin\theta}}+C.$$`,
    solutionMethods: [
      { title: '方法一 · 商式直接求导', content: raw`设
$$u=\frac{\sin\theta}{\cos\theta+\sin\theta}.$$
商法则给出 $du=d\theta/(\cos\theta+\sin\theta)^2$，故原式就是 $\int e^u du=e^u+C$。` },
      { title: '方法二 · 结果求导核验', content: raw`把候选原函数记为 $G=e^u$。由链式法则 $G'=e^u u'$，而 $u'$ 的分子为 $\cos\theta(\cos\theta+\sin\theta)-\sin\theta(-\sin\theta+\cos\theta)=1$，与原被积函数完全一致。` }
    ]
  }),
  lectureNine({
    id: 'example-9-3-semicircle-antiderivative', role: 'example', page: 'PDF 240-241 · 书页 235-236 · 例 9.3',
    fingerprint: 'trig-substitution:semicircle-antiderivative',
    title: '例 9.3 · 半圆根式的三角换元',
    statement: raw`设 $a>0$，求

$$\int\sqrt{a^2-x^2}\,dx.$$`,
    tags: ['不定积分', '三角换元', '圆弓面积'],
    coreMethod: raw`对 $\sqrt{a^2-x^2}$ 令 $x=a\sin t$，同时限制 $t\in[-\pi/2,\pi/2]$ 以消去绝对值。`,
    mistakes: raw`把 $\sqrt{1-\sin^2t}$ 直接写成 $\cos t$ 却没有说明换元区间；一般情况下它应为 $|\cos t|$。`,
    answerText: raw`$$\frac{a^2}{2}\arcsin\frac xa+\frac{x}{2}\sqrt{a^2-x^2}+C.$$`,
    solutionMethods: [
      { title: '方法一 · 正弦换元', content: raw`令 $x=a\sin t$，则 $dx=a\cos t\,dt$，原式为
$$a^2\int\cos^2t\,dt=\frac{a^2}{2}(t+\sin t\cos t)+C.$$
由 $t=\arcsin(x/a)$、$\cos t=\sqrt{a^2-x^2}/a$ 得结论。` },
      { title: '方法二 · 分部积分递推', content: raw`记 $I=\int\sqrt{a^2-x^2}dx$。分部积分取 $u=\sqrt{a^2-x^2}$、$dv=dx$，可得
$$I=x\sqrt{a^2-x^2}+\int\frac{x^2}{\sqrt{a^2-x^2}}dx.$$
用 $x^2=a^2-(a^2-x^2)$ 化简并移项，得到 $2I=x\sqrt{a^2-x^2}+a^2\arcsin(x/a)$。` }
    ]
  }),
  lectureNine({
    id: 'example-9-4-exponential-radical-by-parts', role: 'example', page: 'PDF 243 · 书页 238 · 例 9.4',
    fingerprint: 'substitution:root-e-x-minus-one-then-log-by-parts',
    title: '例 9.4 · 指数根式换元后分部积分',
    statement: raw`求不定积分

$$\int\frac{x e^x}{\sqrt{e^x-1}}\,dx.$$`,
    tags: ['不定积分', '指数换元', '分部积分'],
    coreMethod: raw`令 $u=\sqrt{e^x-1}$ 同时消去指数与根式，再对出现的 $\ln(1+u^2)$ 分部积分。`,
    mistakes: raw`只令 $e^x=t$ 后仍留下 $x=\ln t$ 与根式；进一步开根换元才能把结构彻底有理化。`,
    answerText: raw`$$2x\sqrt{e^x-1}-4\sqrt{e^x-1}+4\arctan\sqrt{e^x-1}+C.$$`,
    solutionMethods: [
      { title: '方法一 · 根式整体换元', content: raw`令 $u=\sqrt{e^x-1}$，则 $e^x=1+u^2$、$x=\ln(1+u^2)$、$dx=2u\,du/(1+u^2)$。原式变为 $2\int\ln(1+u^2)du$。分部积分后
$$2u\ln(1+u^2)-4u+4\arctan u+C,$$
回代即得。` },
      { title: '方法二 · 对答案求导', content: raw`设 $u=\sqrt{e^x-1}$，则 $u'=e^x/(2u)$。分别求导答案的三项，$2u$ 与 $-4u$、$4\arctan u$ 产生的非 $x$ 项正好抵消，只留下 $xe^x/u$，从而闭合核验。` }
    ]
  }),
  lectureNine({
    id: 'example-9-5-arctangent-exponential-loop', role: 'example', page: 'PDF 243 · 书页 238 · 例 9.5',
    fingerprint: 'trig-substitution:arctan-exponential-sine-loop',
    title: '例 9.5 · 反正切换元后的循环分部积分',
    statement: raw`求不定积分

$$\int\frac{x e^{\arctan x}}{(1+x^2)^{3/2}}\,dx.$$`,
    tags: ['不定积分', '三角换元', '循环分部积分'],
    coreMethod: raw`令 $x=\tan t$ 消去 $(1+x^2)^{3/2}$，把原式化成标准的 $\int e^t\sin t\,dt$。`,
    mistakes: raw`换元后 $(1+\tan^2t)^{3/2}=\sec^3t$，若漏掉 $dx=\sec^2t\,dt$ 会把正弦误成正切。`,
    answerText: raw`$$\frac{(x-1)e^{\arctan x}}{2\sqrt{1+x^2}}+C.$$`,
    solutionMethods: [
      { title: '方法一 · 正切换元', content: raw`令 $x=\tan t$，取 $t=\arctan x$，则原式为 $\int e^t\sin t\,dt$。两次分部积分或标准公式给出
$$\frac12e^t(\sin t-\cos t)+C.$$
再用 $\sin t=x/\sqrt{1+x^2}$、$\cos t=1/\sqrt{1+x^2}$ 回代。` },
      { title: '方法二 · 复指数复核', content: raw`利用 $\int e^t\sin tdt=\operatorname{Im}\int e^{(1+i)t}dt$，得到 $e^t(\sin t-\cos t)/2$。这一方法直接解释了循环分部积分中分母 $1^2+1^2$ 的来源。` }
    ]
  }),
  lectureNine({
    id: 'example-9-6-recover-function-before-integrating', role: 'example', page: 'PDF 244 · 书页 239 · 例 9.6',
    fingerprint: 'functional-recovery:f-log-x-then-integration-by-parts',
    title: '例 9.6 · 从复合关系恢复函数再积分',
    statement: raw`已知
$$f(\ln x)=\frac{\ln(1+x)}x,$$
计算 $\int f(x)\,dx$。`,
    tags: ['不定积分', '函数关系', '分部积分'],
    coreMethod: raw`先令 $x=e^t$ 求出 $f(t)$，再对 $e^{-x}\ln(1+e^x)$ 分部积分。`,
    mistakes: raw`直接把题设右端当成 $f(x)$；题设自变量是 $\ln x$，必须先完成变量替换。`,
    answerText: raw`$$x-(1+e^{-x})\ln(1+e^x)+C.$$`,
    solutionMethods: [
      { title: '方法一 · 先反解函数', content: raw`令 $t=\ln x$，得 $f(t)=e^{-t}\ln(1+e^t)$。于是
$$\int f(x)dx=-\int\ln(1+e^x)d(e^{-x}).$$
分部积分并使用 $1/(1+e^x)=1-e^x/(1+e^x)$，化简得到答案。` },
      { title: '方法二 · 答案求导核验', content: raw`对 $x-(1+e^{-x})\ln(1+e^x)$ 求导。$1$ 与对数求导产生的 $-(1+e^{-x})e^x/(1+e^x)=-1$ 抵消，剩下 $e^{-x}\ln(1+e^x)=f(x)$。` }
    ]
  }),
  lectureNine({
    id: 'example-9-7-exponential-tangent-cancellation', role: 'example', page: 'PDF 244 · 书页 239 · 例 9.7',
    fingerprint: 'integration-by-parts:exponential-tangent-self-cancellation',
    title: '例 9.7 · 正负同类积分的自消结构',
    statement: raw`计算

$$\int e^{2x}(\tan x+1)^2\,dx.$$`,
    tags: ['不定积分', '三角恒等式', '分部积分'],
    coreMethod: raw`先用 $(\tan x+1)^2=\sec^2x+2\tan x$，再对 $e^{2x}\sec^2x$ 作分部积分，未知积分会自行抵消。`,
    mistakes: raw`把 $(\tan x+1)^2$ 错展开为 $\sec^2x+\tan x$；交叉项系数必须为 $2$。`,
    answerText: raw`$$e^{2x}\tan x+C.$$`,
    solutionMethods: [
      { title: '方法一 · 分部积分消元', content: raw`展开后令 $J=\int e^{2x}\tan xdx$。有
$$\int e^{2x}\sec^2x dx=e^{2x}\tan x-2J.$$
原积分为上述结果再加 $2J$，故未知积分抵消，只剩 $e^{2x}\tan x+C$。` },
      { title: '方法二 · 识别乘积导数', content: raw`直接求导
$$\frac d{dx}(e^{2x}\tan x)=e^{2x}(2\tan x+\sec^2x)=e^{2x}(\tan x+1)^2,$$
因为 $\sec^2x=1+\tan^2x$。` }
    ]
  }),
  lectureNine({
    id: 'example-9-8-repeated-linear-partial-fractions', role: 'example', page: 'PDF 245-246 · 书页 240-241 · 例 9.8',
    fingerprint: 'partial-fractions:linear-and-repeated-linear-factors',
    title: '例 9.8 · 重复一次因式的部分分式',
    statement: raw`求

$$\int\frac{4x^2-6x-1}{(x+1)(2x-1)^2}\,dx.$$`,
    tags: ['不定积分', '有理函数', '部分分式'],
    coreMethod: raw`分母含一次因式 $x+1$ 和二重因式 $(2x-1)^2$，必须为后者保留一阶与二阶两项。`,
    mistakes: raw`只写 $A/(x+1)+B/(2x-1)^2$ 会漏掉 $1/(2x-1)$ 项；即使其系数最终为零，也应从完整分解出发。`,
    answerText: raw`$$\ln|x+1|+\frac1{2x-1}+C.$$`,
    solutionMethods: [
      { title: '方法一 · 特值法求系数', content: raw`设
$$\frac{4x^2-6x-1}{(x+1)(2x-1)^2}=\frac A{x+1}+\frac B{2x-1}+\frac C{(2x-1)^2}.$$
依次取 $x=-1,1/2,0$ 得 $A=1,C=-2,B=0$。逐项积分即得答案。` },
      { title: '方法二 · 通分求导复核', content: raw`对答案求导得 $1/(x+1)-2/(2x-1)^2$。通分后的分子为 $(2x-1)^2-2(x+1)=4x^2-6x-1$，恰好恢复原式。` }
    ]
  }),
  lectureNine({
    id: 'example-9-9-linear-quadratic-partial-fractions', role: 'example', page: 'PDF 246-247 · 书页 241-242 · 例 9.9',
    fingerprint: 'partial-fractions:linear-times-irreducible-quadratic',
    title: '例 9.9 · 一次因式与不可约二次因式拆分',
    statement: raw`求

$$\int\frac{x}{x^3-x^2+x-1}\,dx.$$`,
    tags: ['不定积分', '有理函数', '部分分式'],
    coreMethod: raw`先因式分解 $x^3-x^2+x-1=(x-1)(x^2+1)$，二次因式上的分子必须设为一次式。`,
    mistakes: raw`把不可约二次因式的分子只设成常数，或对 $\int x/(x^2+1)dx$ 漏掉 $1/2$。`,
    answerText: raw`$$\frac14\ln\frac{(x-1)^2}{x^2+1}+\frac12\arctan x+C.$$`,
    solutionMethods: [
      { title: '方法一 · 最简有理式分解', content: raw`设
$$\frac{x}{(x-1)(x^2+1)}=\frac A{x-1}+\frac{Bx+C}{x^2+1}.$$
比较系数得 $A=C=1/2,B=-1/2$。逐项积分并合并对数即可。` },
      { title: '方法二 · 答案求导复核', content: raw`答案的导数为
$$\frac1{2(x-1)}-\frac{x}{2(x^2+1)}+\frac1{2(x^2+1)}.$$
通分后分子为 $x$，分母为 $(x-1)(x^2+1)$，因此结果闭合。` }
    ]
  }),
  lectureNine({
    id: 'example-9-10-complete-square-arctangent', role: 'example', page: 'PDF 247-248 · 书页 242-243 · 例 9.10',
    fingerprint: 'rational-integral:derivative-plus-completed-square-arctangent',
    title: '例 9.10 · 分子拆成分母导数与常数',
    statement: raw`求

$$\int\frac{2x+3}{x^2-x+1}\,dx.$$`,
    tags: ['不定积分', '配方', '反正切'],
    coreMethod: raw`把 $2x+3$ 写成分母导数 $2x-1$ 加常数 $4$，再对剩余二次式配方。`,
    mistakes: raw`配方时应有 $x^2-x+1=(x-1/2)^2+3/4$；常数项写错会使反正切系数整体错误。`,
    answerText: raw`$$\ln(x^2-x+1)+\frac{8\sqrt3}{3}\arctan\frac{2x-1}{\sqrt3}+C.$$`,
    solutionMethods: [
      { title: '方法一 · 导数加常数', content: raw`原式拆成
$$\int\frac{2x-1}{x^2-x+1}dx+4\int\frac{dx}{(x-1/2)^2+3/4}.$$
第一项为对数，第二项按反正切标准公式计算，得到所给答案。` },
      { title: '方法二 · 平移变量', content: raw`令 $u=x-1/2$，则分母为 $u^2+3/4$，分子为 $2u+4$。奇的 $2u$ 部分给出 $\ln(u^2+3/4)$，偶的常数部分给出反正切；回代与方法一一致。` }
    ]
  })
]
