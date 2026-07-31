import type { SeedInput } from './types'

const raw = String.raw
const WZX_SOURCE = '何耀焜私人整理 · 武忠祥《高数基础篇做题本》· 定积分与反常积分逐页核验'

type WuSeed = Omit<SeedInput, 'id' | 'kind' | 'tags' | 'methodFingerprint' | 'source'> & {
  id: string
  tags: string[]
  fingerprint: string
}

function wuProblem(input: WuSeed): SeedInput {
  return {
    ...input,
    id: `wzx-verified-l11-${input.id}`,
    kind: 'problem',
    source: WZX_SOURCE,
    tags: ['高等数学', '第11讲', '经典例题', 'PDF逐页核验', ...input.tags],
    methodFingerprint: `wzx-verified:l11:${input.fingerprint}`
  }
}

export const wuLecture11ExpansionSeeds: SeedInput[] = [
  wuProblem({
    id: 'p96-example-6-convex-quadrature-order', page: 'PDF 54 · 书页 96 · 例 6',
    fingerprint: 'integral-order:positive-decreasing-convex-right-rectangle-integral-trapezoid',
    title: '武忠祥 P96 例 6 · 递减凸函数的三种面积估计',
    statement: raw`设在区间 $[a,b]$ 上
$$f(x)>0,\qquad f'(x)<0,\qquad f''(x)>0.$$
令
$$S_1=\int_a^bf(x)dx,\qquad S_2=f(b)(b-a),$$
$$S_3=\frac12[f(a)+f(b)](b-a).$$
则 $S_1,S_2,S_3$ 的大小关系为（　）。`,
    questionFormat: 'single-choice',
    options: ['$S_1<S_2<S_3$', '$S_2<S_1<S_3$', '$S_3<S_1<S_2$', '$S_2<S_3<S_1$'],
    correctOptionIds: ['B'],
    tags: ['选择题', '凸函数', '积分估计'],
    coreMethod: raw`递减性把曲边面积夹在左右矩形之间；凸性说明图像在端点弦线下方，从而小于梯形面积。`,
    mistakes: raw`凸函数图像位于弦线下方、切线之上，容易把这两个位置关系写反。`,
    answerText: raw`正确选项为 B：
$$S_2<S_1<S_3.$$`,
    solutionMethods: [
      { title: '方法一 · 矩形与弦线', content: raw`因 $f$ 严格递减，对 $a<x<b$ 有 $f(x)>f(b)$，故
$$S_1>f(b)(b-a)=S_2.$$
又因 $f''>0$，图像严格位于端点弦线下方。弦线下的面积是梯形面积 $S_3$，故 $S_1<S_3$。` },
      { title: '方法二 · 两个积分差', content: raw`第一组差为
$$S_1-S_2=\int_a^b[f(x)-f(b)]dx>0.$$
设端点弦线为
$$\ell(x)=f(a)+\frac{f(b)-f(a)}{b-a}(x-a).$$
凸性给出 $f(x)<\ell(x)$，而 $\int_a^b\ell(x)dx=S_3$，所以 $S_3-S_1>0$。` }
    ]
  }),
  wuProblem({
    id: 'p96-example-7-log-integral-order', page: 'PDF 54 · 书页 96 · 例 7',
    fingerprint: 'integral-order:log-sine-log-cosine-log-cotangent-quarter-pi',
    title: '武忠祥 P96 例 7 · 三个对数三角积分的大小关系',
    statement: raw`设
$$I=\int_0^{\pi/4}\ln(\sin x)dx,\qquad
J=\int_0^{\pi/4}\ln(\cot x)dx,$$
$$K=\int_0^{\pi/4}\ln(\cos x)dx.$$
则 $I,J,K$ 的大小关系为（　）。`,
    questionFormat: 'single-choice',
    options: ['$I<J<K$', '$I<K<J$', '$J<I<K$', '$K<J<I$'],
    correctOptionIds: ['B'],
    tags: ['选择题', '积分比较', '对数三角函数'],
    coreMethod: raw`先由 $0<\sin x<\cos x<1$ 得到 $I<K<0$，再使用 $J=K-I$ 比较 $J$ 与 $K$。`,
    mistakes: raw`$ln(\sin x)$ 与 $\ln(\cos x)$ 都为负；比较 $J=K-I$ 时不能按正数直觉判断。`,
    answerText: raw`正确选项为 B：
$$I<K<J.$$`,
    solutionMethods: [
      { title: '方法一 · 点态比较与恒等式', content: raw`在 $(0,\pi/4)$ 上，$0<\sin x<\cos x<1$，故
$$I<K<0.$$
又
$$J=\int_0^{\pi/4}[\ln(\cos x)-\ln(\sin x)]dx=K-I.$$
由于 $I<0$，有 $J>K$，所以 $I<K<J$。` },
      { title: '方法二 · 分别比较差值', content: raw`直接写
$$K-I=\int_0^{\pi/4}\ln(\cot x)dx=J>0,$$
故 $K>I$。另一方面
$$J-K=-I>0,$$
因为 $\ln(\sin x)<0$ 导致 $I<0$。两式合并仍得 $I<K<J$。` }
    ]
  }),
  wuProblem({
    id: 'p96-example-8-convex-integral-sign', page: 'PDF 54 · 书页 96 · 例 8',
    fingerprint: 'integral-sign:strict-convex-three-fixed-values-piecewise-chord',
    title: '武忠祥 P96 例 8 · 三点定值凸函数的积分符号',
    statement: raw`设二阶可导函数 $f$ 满足
$$f(1)=f(-1)=1,\qquad f(0)=-1,\qquad f''(x)>0.$$
则下列结论正确的是（　）。`,
    questionFormat: 'single-choice',
    options: [
      '$\int_{-1}^1f(x)dx>0$',
      '$\int_{-1}^1f(x)dx<0$',
      '$\int_{-1}^0f(x)dx>\int_0^1f(x)dx$',
      '$\int_{-1}^0f(x)dx<\int_0^1f(x)dx$'
    ],
    correctOptionIds: ['B'],
    tags: ['选择题', '凸函数', '积分符号'],
    coreMethod: raw`分别在 $[-1,0]$ 与 $[0,1]$ 上用端点弦线控制函数，两条弦线的总积分恰为零，而严格凸性给出严格小于。`,
    mistakes: raw`题设没有偶函数条件，左右两半积分无法直接比较，因此 C、D 都不能由已知条件确定。`,
    answerText: raw`正确选项为 B：
$$\int_{-1}^1f(x)dx<0.$$`,
    solutionMethods: [
      { title: '方法一 · 分段弦线', content: raw`严格凸函数位于弦线下方。在 $[-1,0]$ 上弦线为 $-2x-1$，在 $[0,1]$ 上弦线为 $2x-1$。因此
$$\int_{-1}^1f(x)dx
<\int_{-1}^0(-2x-1)dx+\int_0^1(2x-1)dx=0.$$` },
      { title: '方法二 · 对称点配对', content: raw`对 $0<x<1$，严格凸性给出
$$f(-x)<2x-1,\qquad f(x)<2x-1.$$
故
$$f(-x)+f(x)<4x-2.$$
从 $0$ 到 $1$ 积分，右端积分为零，左端正好等于 $\int_{-1}^1f$，所以该积分严格小于零。` }
    ]
  }),
  wuProblem({
    id: 'p97-example-9-rolle-from-integral-mean', page: 'PDF 55 · 书页 97 · 例 9',
    fingerprint: 'existence:integral-mean-value-equal-endpoint-rolle-stationary-point',
    title: '武忠祥 P97 例 9 · 由局部积分均值构造驻点',
    statement: raw`设函数 $f$ 在 $[0,1]$ 上连续，在 $(0,1)$ 内可导，且
$$3\int_{2/3}^1f(x)dx=f(0).$$
证明在 $(0,1)$ 内存在一点 $c$，使 $f'(c)=0$。`,
    tags: ['存在性证明', '积分中值定理', 'Rolle定理'],
    coreMethod: raw`区间 $[2/3,1]$ 的长度是 $1/3$；积分中值定理把左端化成某个函数值，恰好与 $f(0)$ 相等。`,
    mistakes: raw`积分中值定理给出的是 $\int_{2/3}^1f=f(\xi)/3$；漏掉区间长度会得不到相等函数值。`,
    answerText: raw`存在 $c\in(0,1)$ 使 $f'(c)=0$。`,
    solutionMethods: [
      { title: '方法一 · 积分中值加 Rolle', content: raw`由积分中值定理，存在 $\xi\in(2/3,1)$ 使
$$\int_{2/3}^1f(x)dx=\frac13f(\xi).$$
题设于是给出 $f(\xi)=f(0)$。在 $[0,\xi]$ 上使用 Rolle 定理，得到某个 $c\in(0,\xi)\subset(0,1)$ 满足 $f'(c)=0$。` },
      { title: '方法二 · 反证严格单调', content: raw`若 $f'$ 在 $(0,1)$ 从不为零，由导数的 Darboux 性质，$f'$ 只能恒正或恒负，因此 $f$ 严格单调。但 $3\int_{2/3}^1f$ 是该小区间上函数值的平均值，严格位于 $f(2/3)$ 与 $f(1)$ 之间，不可能等于区间外端点值 $f(0)$。矛盾，故必有驻点。` }
    ]
  })
]
