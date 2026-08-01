import type { SeedInput } from './types'

const raw = String.raw
const ZY30_SOURCE = '何耀焜私人整理 · 张宇《基础30讲》高数 · 第14讲逐页核验'

type LectureFourteenSeed = Omit<SeedInput, 'id' | 'kind' | 'tags' | 'methodFingerprint' | 'source' | 'solutionMethods'> & {
  id: string
  role: 'example' | 'exercise'
  tags: string[]
  fingerprint: string
  methodOne: string
  methodTwo: string
}

function lectureFourteen(input: LectureFourteenSeed): SeedInput {
  const { id, role, tags, fingerprint, methodOne, methodTwo, ...seed } = input
  return {
    ...seed,
    id: `zy30-verified-l14-${id}`,
    kind: 'problem',
    source: ZY30_SOURCE,
    tags: ['高等数学', '第14讲', ...tags, role === 'example' ? '经典例题' : '课后习题', 'PDF逐页核验'],
    methodFingerprint: `zy30-verified:l14:${fingerprint}`,
    solutionMethods: [
      { title: '方法一 · 原书主线', content: methodOne },
      { title: '方法二 · 独立复核', content: methodTwo }
    ]
  }
}

export const foundation30Lecture14ExpansionSeeds: SeedInput[] = [
  lectureFourteen({
    id: 'example-14-1-region-comparison', role: 'example', page: 'PDF 346-347 · 书页 341-342 · 例 14.1',
    fingerprint: 'double-integral:compare-regions-positive-core-negative-shells',
    title: '例 14.1 · 变号被积函数下的区域比较',
    statement: raw`平面闭区域 $D_i\ (i=1,2,3,4)$ 分别由
$$L_1:x^2+y^2=1,\quad L_2:x^2+y^2=2,$$
$$L_3:x^2+2y^2=2,\quad L_4:2x^2+y^2=2$$
围成。记
$$I_i=\iint_{D_i}\left(1-x^2-\frac12y^2\right)dxdy.$$
求 $\max\{I_1,I_2,I_3,I_4\}$。`,
    questionFormat: 'single-choice', options: ['$I_1$', '$I_2$', '$I_3$', '$I_4$'], correctOptionIds: ['D'],
    tags: ['二重积分比较', '变号函数', '选择题'],
    coreMethod: raw`先找被积函数的正区域 $2x^2+y^2<2$，再比较各区域多出或缺少的部分对积分的正负贡献。`,
    mistakes: '区域面积更大不代表积分更大；被积函数越过椭圆边界后会变成负值。',
    answerText: '正确选项为 D，即最大值为 $I_4$。',
    methodOne: raw`被积函数
$$f(x,y)=1-x^2-\frac12y^2$$
在 $D_4:2x^2+y^2\le2$ 内非负，在外部非正。$D_1,D_2,D_3$ 与 $D_4$ 比较时，要么漏掉 $D_4$ 内的正贡献，要么增添 $D_4$ 外的负贡献，因此均不可能超过 $I_4$。`,
    methodTwo: raw`逐一区域作差。例如
$$I_4-I_1=\iint_{D_4\setminus D_1}f\,dA-\iint_{D_1\setminus D_4}f\,dA.$$
第一项非负，第二个区域上 $f\le0$，故整个差非负。对 $D_2,D_3$ 同理，得到 $I_4$ 最大。`
  }),
  lectureFourteen({
    id: 'example-14-2-shrinking-ellipse-derivative', role: 'example', page: 'PDF 347-348 · 书页 342-343 · 例 14.2',
    fingerprint: 'shrinking-region:ellipse-mean-value-derivative-at-zero',
    title: '例 14.2 · 缩小椭圆域上的变限二重积分',
    statement: raw`设
$$D(t)=\{(x,y)\mid 2x^2+3y^2\le6t\},$$
$$f(x,y)=\begin{cases}
\displaystyle\frac{\sqrt[3]{1-(x^2+y^2)}-1}{e^{x^2+y^2}-1},&(x,y)\ne(0,0),\\
-\dfrac13,&(x,y)=(0,0).
\end{cases}$$
令 $F(t)=\iint_{D(t)}f(x,y)dxdy$，求 $F'(0)$。`,
    tags: ['变限二重积分', '积分中值定理'],
    coreMethod: '用二重积分中值定理把积分写成“区域面积乘区域内某点的函数值”，再计算面积对参数的一阶系数。',
    mistakes: '不能直接把 $t=0$ 代入积分后认定导数为零；导数取决于区域面积缩小的速度。',
    answerText: raw`$$F'(0)=-\frac{\sqrt6\pi}{3}.$$`,
    methodOne: raw`椭圆 $D(t)$ 的半轴为 $\sqrt{3t},\sqrt{2t}$，故面积
$$S(t)=\sqrt6\pi t.$$
由积分中值定理，存在 $(\xi_t,\eta_t)\in D(t)$ 使
$$F(t)=S(t)f(\xi_t,\eta_t).$$
当 $t\to0^+$ 时该点趋于原点，因此
$$F'(0)=\lim_{t\to0^+}\frac{F(t)}t=\sqrt6\pi f(0,0)=-\frac{\sqrt6\pi}{3}.$$`,
    methodTwo: raw`作线性换元 $x=\sqrt{3t}\,u,y=\sqrt{2t}\,v$，单位圆盘上的 Jacobian 为 $\sqrt6t$。于是
$$\frac{F(t)}t=\sqrt6\iint_{u^2+v^2\le1}f(\sqrt{3t}u,\sqrt{2t}v)dudv.$$
由连续性令 $t\to0$，结果为 $\sqrt6\pi(-1/3)$。`
  }),
  lectureFourteen({
    id: 'example-14-3-symmetry-ordering', role: 'example', page: 'PDF 350 · 书页 345 · 例 14.3',
    fingerprint: 'double-integral-order:antisymmetric-cuberoot-three-regions',
    title: '例 14.3 · 反对称函数在三个区域上的积分排序',
    statement: raw`设 $f(x,y)=\sqrt[3]{x-y}$，并令
$$D_1=\{0\le x\le1,\ 0\le y\le1\},$$
$$D_2=\{0\le x\le1,\ 0\le y\le\sqrt x\},$$
$$D_3=\{0\le x\le1,\ x^2\le y\le1\}.$$
记 $J_i=\iint_{D_i}f(x,y)dxdy$，比较 $J_1,J_2,J_3$ 的大小。`,
    questionFormat: 'single-choice', options: ['$J_1<J_2<J_3$', '$J_3<J_1<J_2$', '$J_2<J_1<J_3$', '$J_3<J_2<J_1$'], correctOptionIds: ['B'],
    tags: ['轮换对称性', '积分排序', '选择题'],
    coreMethod: '利用 $f(y,x)=-f(x,y)$；先在关于 $y=x$ 对称的区域上消去积分，再判断剩余区域中的符号。',
    mistakes: '不要把三个区域误认为彼此包含；应先按直线 $y=x$ 分割再判断。',
    answerText: '正确选项为 B，即 $J_3<J_1<J_2$。',
    methodOne: raw`正方形 $D_1$ 关于 $y=x$ 对称，而 $f(y,x)=-f(x,y)$，故 $J_1=0$。$D_2$ 中曲线 $y=\sqrt x$ 上方与对称部分抵消，余下部分满足 $x>y$，故 $J_2>0$。同理 $D_3$ 的未抵消部分满足 $x<y$，故 $J_3<0$。`,
    methodTwo: raw`注意 $D_3$ 恰是 $D_2$ 交换 $x,y$ 后的补形关系。直接作换元 $(x,y)\mapsto(y,x)$ 可得 $J_3=-J_2$；又 $J_1=0$，且 $D_2$ 中 $x>y$ 的净区域非空，所以 $J_2>0$。`
  }),
  lectureFourteen({
    id: 'example-14-4-rotation-symmetry', role: 'example', page: 'PDF 352 · 书页 347 · 例 14.4',
    fingerprint: 'rotation-symmetry:quarter-annulus-swap-u-v-log-radius',
    title: '例 14.4 · 轮换对称化简四分之一圆环积分',
    statement: raw`设
$$D(x)=\left\{(u,v)\mid \frac14\le u^2+v^2\le x^2,\ u>0,v>0\right\},\quad x>\frac12,$$
$$f(x)=\iint_{D(x)}\frac{v\ln\sqrt{u^2+v^2}}{u+v}\,dudv.$$
将 $f(x)$ 化为被积函数只含 $u^2+v^2$ 的二重积分。`,
    tags: ['轮换对称性', '圆环积分'],
    coreMethod: '交换 $u,v$ 后区域不变，将原式与交换后的式子相加。',
    mistakes: raw`$\ln\sqrt{u^2+v^2}=\frac12\ln(u^2+v^2)$，最后还要保留这一系数。`,
    answerText: raw`$$f(x)=\frac14\iint_{D(x)}\ln(u^2+v^2)\,dudv.$$`,
    methodOne: raw`交换 $u,v$ 得
$$f(x)=\iint_{D(x)}\frac{u\ln\sqrt{u^2+v^2}}{u+v}\,dudv.$$
两式相加：
$$2f(x)=\iint_{D(x)}\ln\sqrt{u^2+v^2}\,dudv
=\frac12\iint_{D(x)}\ln(u^2+v^2)\,dudv,$$
即得结论。`,
    methodTwo: raw`用极坐标 $u=r\cos\theta,v=r\sin\theta$。角向因子为
$$\frac{\sin\theta}{\cos\theta+\sin\theta}.$$
它与 $\theta\mapsto\pi/2-\theta$ 下的对应因子之和为 $1$，所以角积分等于区间长度的一半，得到同样的 $1/4$ 系数。`
  }),
  lectureFourteen({
    id: 'example-14-5-reverse-order-sine', role: 'example', page: 'PDF 353-354 · 书页 348-349 · 例 14.5',
    fingerprint: 'reverse-order:sine-boundary-pi-over-two-to-pi',
    title: '例 14.5 · 正弦边界区域交换积分次序',
    statement: raw`设 $f$ 连续，交换积分次序：
$$\int_{\pi/2}^{\pi}dx\int_{\sin x}^{1}f(x,y)dy.$$`,
    tags: ['交换积分次序', '正弦边界'],
    coreMethod: raw`先画出 $\pi/2<x<\pi$ 且 $\sin x<y<1$ 的区域，再用 $x=\pi-\arcsin y$ 表示左边界。`,
    mistakes: raw`在 $[\pi/2,\pi]$ 上由 $\sin x=y$ 解得的是 $x=\pi-\arcsin y$，不是 $\arcsin y$。`,
    answerText: raw`$$\int_0^1dy\int_{\pi-\arcsin y}^{\pi}f(x,y)dx.$$`,
    methodOne: raw`区域为
$$D=\{(x,y)\mid \pi/2<x<\pi,\ \sin x<y<1\}.$$
固定 $y\in[0,1]$ 时，水平线从曲线右支 $x=\pi-\arcsin y$ 到 $x=\pi$，故得到答案。`,
    methodTwo: raw`检查端点：$y=0$ 时 $x$ 从 $\pi$ 到 $\pi$；$y=1$ 时从 $\pi/2$ 到 $\pi$。这与原区域在底部收尖、顶部最宽的几何形状一致。`
  }),
  lectureFourteen({
    id: 'example-14-6-equivalent-infinitesimal', role: 'example', page: 'PDF 354 · 书页 349 · 例 14.6',
    fingerprint: 'reverse-order:sin-y-over-t-equivalent-infinitesimal',
    title: '例 14.6 · 交换次序求二重积分的等价无穷小',
    statement: raw`当 $x\to0^+$ 时，
$$f(x)=\int_0^{x^2}dy\int_x^{\sqrt y}\sin\frac yt\,dt$$
与 $g(x)=ax^b$ 是等价无穷小，求 $ab$。`,
    tags: ['交换积分次序', '等价无穷小'],
    coreMethod: '原积分上下限反向，先提出负号；交换次序后内层可直接对 $y$ 积分。',
    mistakes: raw`必须先处理 $\sqrt y\le x$ 导致的反向积分；忽略负号会把答案符号写反。`,
    answerText: raw`$$a=-\frac18,\quad b=4,\quad ab=-\frac12.$$`,
    methodOne: raw`先反向并交换次序：
$$f(x)=-\int_0^{x^2}dy\int_{\sqrt y}^{x}\sin\frac yt\,dt
=-\int_0^xdt\int_0^{t^2}\sin\frac yt\,dy.$$
内层积分为 $t(1-\cos t)$，故
$$f(x)=\int_0^x t(\cos t-1)dt\sim-\frac12\int_0^xt^3dt=-\frac18x^4.$$`,
    methodTwo: raw`由 $\cos t-1=-t^2/2+O(t^4)$，直接得到
$$f'(x)=x(\cos x-1)=-\frac12x^3+O(x^5).$$
结合 $f(0)=0$ 积分一次，得 $f(x)=-x^4/8+O(x^6)$，所以 $a=-1/8,b=4$。`
  }),
  lectureFourteen({
    id: 'example-14-7-arcsine-order', role: 'example', page: 'PDF 355 · 书页 350 · 例 14.7',
    fingerprint: 'reverse-order:triangular-arcsine-integrand-only-x',
    title: '例 14.7 · 被积函数只含横坐标时交换次序',
    statement: raw`计算
$$\int_0^1dy\int_y^1\arcsin\sqrt{4x-4x^2}\,dx.$$`,
    tags: ['交换积分次序', '反三角积分'],
    coreMethod: raw`区域是 $0\le y\le x\le1$；交换后先对 $y$ 积分即可消掉一层。`,
    mistakes: '交换后 $y$ 的上限是 $x$，不是 $1-x$；根式在 $[0,1]$ 上才为实数。',
    answerText: raw`$$\frac12.$$`,
    methodOne: raw`交换次序得
$$\int_0^1dx\int_0^x\arcsin\sqrt{4x-4x^2}\,dy
=\int_0^1x\arcsin\sqrt{4x-4x^2}\,dx=\frac12.$$`,
    methodTwo: raw`令 $x=(1+t)/2$，利用 $\sqrt{4x-4x^2}=\sqrt{1-t^2}$ 及关于 $t=0$ 的对称性。奇部分积分为零，剩余部分化为书中已知积分 $\int_0^1\arcsin\sqrt{1-t^2}\,dt=1$，最终仍为 $1/2$。`
  }),
  lectureFourteen({
    id: 'example-14-8-round-symmetry', role: 'example', page: 'PDF 356 · 书页 351 · 例 14.8',
    fingerprint: 'rotation-symmetry:disk-quadratic-moments',
    title: '例 14.8 · 圆域上的二次矩轮换对称',
    statement: raw`设 $D=\{(x,y)\mid x^2+y^2\le\sqrt2\}$，计算
$$\iint_D\left(x^2+\frac{y^2}{2}\right)dxdy.$$`,
    tags: ['轮换对称性', '极坐标'],
    coreMethod: raw`圆域上 $x,y$ 的地位相同，先把积分化为 $\iint_D(x^2+y^2)$ 的倍数。`,
    mistakes: raw`圆的半径满足 $R^2=\sqrt2$，即 $R=2^{1/4}$；极坐标径向上限不是 $\sqrt2$。`,
    answerText: raw`$$\frac{3\pi}{4}.$$`,
    methodOne: raw`记原积分为 $I$。交换 $x,y$ 得
$$I=\iint_D\left(y^2+\frac{x^2}{2}\right)dA.$$
相加得 $2I=\frac32\iint_D(x^2+y^2)dA$。极坐标下
$$I=\frac34\int_0^{2\pi}\int_0^{2^{1/4}}r^3drd\theta=\frac{3\pi}{4}.$$`,
    methodTwo: raw`圆域上 $\iint_Dx^2dA=\iint_Dy^2dA=\frac12\iint_Dr^2dA$。因此原式系数为 $(1+1/2)/2=3/4$，再用 $\iint_Dr^2dA=\pi R^4/2=\pi$ 即得。`
  }),
  lectureFourteen({
    id: 'example-14-9-nonstandard-annulus', role: 'example', page: 'PDF 356-357 · 书页 351-352 · 例 14.9',
    fingerprint: 'polar:quadratic-form-annular-sector-log-ratio',
    title: '例 14.9 · 二次型同心曲线间的极坐标积分',
    statement: raw`第一象限区域 $D$ 由
$$x^2+y^2-xy=1,\quad x^2+y^2-xy=2,\quad y=\sqrt3x,\quad y=0$$
围成。计算
$$\iint_D\frac1{3x^2+y^2}dxdy.$$`,
    tags: ['极坐标', '二次型区域'],
    coreMethod: raw`二次型边界在极坐标下给出两个同角度相关、比值恒定的径向边界，径向积分产生 $\ln2/2$。`,
    mistakes: raw`$x^2+y^2-xy=r^2(1-\sin\theta\cos\theta)$；直线 $y=\sqrt3x$ 对应 $\theta=\pi/3$。`,
    answerText: raw`$$\frac{\sqrt3\pi\ln2}{24}.$$`,
    methodOne: raw`区域满足 $0\le\theta\le\pi/3$，且
$$\frac1{\sqrt{1-\sin\theta\cos\theta}}\le r\le
\sqrt{\frac2{1-\sin\theta\cos\theta}}.$$
故径向积分给出 $\ln2/2$，从而
$$I=\frac{\ln2}{2}\int_0^{\pi/3}\frac{d\theta}{3\cos^2\theta+\sin^2\theta}
=\frac{\sqrt3\pi\ln2}{24}.$$`,
    methodTwo: raw`令 $t=\tan\theta$，角积分化为
$$\int_0^{\sqrt3}\frac{dt}{3+t^2}=\frac1{\sqrt3}\arctan\frac t{\sqrt3}\Big|_0^{\sqrt3}=\frac{\pi}{4\sqrt3}.$$
乘径向因子 $\ln2/2$ 即得相同结果。`
  }),
  lectureFourteen({
    id: 'example-14-10-inflection-integral', role: 'example', page: 'PDF 357-358 · 书页 352-353 · 例 14.10',
    fingerprint: 'variable-upper-integral:quarter-annulus-log-inflection',
    title: '例 14.10 · 圆环变域积分的拐点',
    statement: raw`设
$$f(x)=\iint_{D(x)}\frac{v\ln\sqrt{u^2+v^2}}{u+v}dudv,$$
其中 $D(x)=\{(u,v)\mid \frac14\le u^2+v^2\le x^2,u>0,v>0\}$。求曲线
$$y(x)=\int_1^xf(t)dt\quad\left(x>\frac12\right)$$
的拐点。`,
    tags: ['变限积分', '拐点', '轮换对称性'],
    coreMethod: raw`先用轮换对称化简 $f$，再由 $y''(x)=f'(x)$ 的符号变化判断拐点。`,
    mistakes: raw`拐点要求二阶导数变号，不只是令它等于零；这里应检查 $\ln x$ 两侧的符号。`,
    answerText: '拐点为 $(1,0)$。',
    methodOne: raw`由例 14.4，
$$f(x)=\frac14\iint_{D(x)}\ln(u^2+v^2)dudv
=\frac\pi4\int_{1/2}^xr\ln r\,dr.$$
所以 $y''(x)=f'(x)=\frac\pi4x\ln x$。在 $1/2<x<1$ 时为负，在 $x>1$ 时为正，且 $y(1)=0$，故拐点为 $(1,0)$。`,
    methodTwo: raw`不必求出 $f$ 的闭式。变上限积分的边界微分直接给出
$$f'(x)=\frac14\cdot\frac\pi2\cdot x\ln(x^2)=\frac\pi4x\ln x.$$
其唯一变号点为 $x=1$，再代入 $y(1)=0$。`
  }),
  lectureFourteen({
    id: 'example-14-11-gaussian', role: 'example', page: 'PDF 358 · 书页 353 · 例 14.11',
    fingerprint: 'gaussian-integral:square-to-quarter-plane-polar',
    title: '例 14.11 · 高斯积分的二重积分证明',
    statement: raw`计算
$$\int_0^{+\infty}e^{-x^2}dx.$$`,
    tags: ['高斯积分', '广义二重积分'],
    coreMethod: '设积分为 $I$，计算 $I^2$，把第一象限二重积分改用极坐标。',
    mistakes: raw`由 $I^2=\pi/4$ 后应利用积分为正取正根。`,
    answerText: raw`$$\frac{\sqrt\pi}{2}.$$`,
    methodOne: raw`令 $I=\int_0^\infty e^{-x^2}dx$，则
$$I^2=\iint_{x,y\ge0}e^{-(x^2+y^2)}dxdy
=\int_0^{\pi/2}\int_0^\infty e^{-r^2}rdrd\theta=\frac\pi4.$$
因 $I>0$，故 $I=\sqrt\pi/2$。`,
    methodTwo: raw`先在四分之一圆 $x^2+y^2\le R^2$ 上计算，得到
$$\int_0^{\pi/2}\int_0^Re^{-r^2}rdrd\theta=\frac\pi4(1-e^{-R^2}).$$
令 $R\to\infty$，再用单调收敛得到整个第一象限的值 $\pi/4$，取平方根。`
  }),
  lectureFourteen({
    id: 'example-14-12-gaussian-moment', role: 'example', page: 'PDF 359 · 书页 354 · 例 14.12',
    fingerprint: 'gaussian-moment:gamma-recurrence-even-extension',
    title: '例 14.12 · 高斯二阶矩',
    statement: raw`计算
$$\int_{-\infty}^{+\infty}x^2e^{-x^2}dx.$$`,
    tags: ['高斯积分', 'Gamma函数'],
    coreMethod: '利用偶性化到正半轴，再用 Gamma 函数递推或分部积分。',
    mistakes: '从半轴扩展到全轴要乘 $2$；分部积分的边界项在无穷远为零。',
    answerText: raw`$$\frac{\sqrt\pi}{2}.$$`,
    methodOne: raw`由偶性及 Gamma 函数，
$$2\int_0^\infty x^2e^{-x^2}dx
=\Gamma\left(\frac32\right)=\frac12\Gamma\left(\frac12\right)=\frac{\sqrt\pi}{2}.$$`,
    methodTwo: raw`在 $[0,\infty)$ 上分部积分：
$$\int_0^\infty x^2e^{-x^2}dx
=-\frac12\int_0^\infty x\,d(e^{-x^2})
=\frac12\int_0^\infty e^{-x^2}dx=\frac{\sqrt\pi}{4}.$$
再乘 $2$。`
  }),
  lectureFourteen({
    id: 'example-14-13-gaussian-tail-limit', role: 'example', page: 'PDF 359-360 · 书页 354-355 · 例 14.13',
    fingerprint: 'gaussian-tail:cancel-limit-constant-then-lhopital',
    title: '例 14.13 · 高斯尾量消去后的极限配参',
    statement: raw`已知
$$\lim_{x\to+\infty}\frac{\int_0^xt^2e^{-t^2}dt+ae^{x^2}}{x^b}=-\frac12,$$
求 $a,b$。`,
    tags: ['高斯积分', '极限配参'],
    coreMethod: '先把分子分母同除以 $e^{x^2}$，由分母趋零确定常数消去条件，再用洛必达法则求幂次。',
    mistakes: '题面中的 $ae^{x^2}$ 同除后变成常数 $a$；若不先消去极限常数，不能直接使用洛必达。',
    answerText: raw`$$a=-\frac{\sqrt\pi}{4},\qquad b=1.$$`,
    methodOne: raw`原式等于
$$\frac{\int_0^xt^2e^{-t^2}dt+a}{x^be^{-x^2}}.$$
分母趋零而极限有限非零，故分子必须趋零：
$$a=-\int_0^\infty t^2e^{-t^2}dt=-\frac{\sqrt\pi}{4}.$$
再洛必达，主导比值为 $x^2/(bx^{b-1}-2x^{b+1})$，要趋于 $-1/2$ 必有 $b=1$。`,
    methodTwo: raw`由高斯尾积分渐近式
$$\int_x^\infty t^2e^{-t^2}dt\sim\frac x2e^{-x^2}.$$
取 $a=-\sqrt\pi/4$ 后分子等于负的尾积分乘 $e^{x^2}$，渐近为 $-x/2$，因此除以 $x^b$ 要趋于 $-1/2$ 必须 $b=1$。`
  }),
  lectureFourteen({
    id: 'example-14-14-polar-circular-segment', role: 'example', page: 'PDF 360 · 书页 355 · 例 14.14',
    fingerprint: 'polar:circular-segment-x-plus-y-over-radius-square',
    title: '例 14.14 · 圆弓形区域上的奇异积分',
    statement: raw`计算
$$\int_0^1dx\int_{1-x}^{\sqrt{1-x^2}}\frac{x+y}{x^2+y^2}dy.$$`,
    tags: ['极坐标', '累次积分'],
    coreMethod: '区域位于第一象限单位圆内、直线 $x+y=1$ 外，极坐标边界最简。',
    mistakes: raw`直线 $x+y=1$ 在极坐标下为 $r=1/(\cos\theta+\sin\theta)$，它是径向下限。`,
    answerText: raw`$$2-\frac\pi2.$$`,
    methodOne: raw`区域满足 $0\le\theta\le\pi/2$，
$$\frac1{\cos\theta+\sin\theta}\le r\le1.$$
被积函数乘 Jacobian 后为 $\cos\theta+\sin\theta$，故
$$I=\int_0^{\pi/2}(\cos\theta+\sin\theta)
\left(1-\frac1{\cos\theta+\sin\theta}\right)d\theta=2-\frac\pi2.$$`,
    methodTwo: raw`把积分拆成 $x/(x^2+y^2)$ 与 $y/(x^2+y^2)$ 两部分。区域关于 $y=x$ 对称，两部分相等；再只算其中一项并作极坐标换元，同样得到每部分 $1-\pi/4$。`
  }),
  lectureFourteen({
    id: 'example-14-15-special-substitution', role: 'example', page: 'PDF 362 · 书页 357 · 例 14.15',
    fingerprint: 'change-variables:triangle-u-x-plus-y-v-y-exponential-ratio',
    title: '例 14.15 · 三角域上指数比值的换元',
    statement: raw`设 $D=\{(x,y)\mid0\le x\le1-y,\ 0\le y\le1\}$，计算
$$\iint_De^{y/(x+y)}dxdy.$$`,
    tags: ['二重积分换元', '三角区域'],
    coreMethod: raw`令 $u=x+y,v=y$，使指数变成 $v/u$，区域变为 $0\le v\le u\le1$。`,
    mistakes: '新区域不是矩形；固定 $u$ 时 $v$ 从 $0$ 到 $u$，Jacobian 为 $1$。',
    answerText: raw`$$\frac{e-1}{2}.$$`,
    methodOne: raw`令 $u=x+y,v=y$，则 $x=u-v$ 且 $|J|=1$，区域为 $0\le v\le u\le1$。因此
$$I=\int_0^1du\int_0^ue^{v/u}dv
=\int_0^1u(e-1)du=\frac{e-1}{2}.$$`,
    methodTwo: raw`在原三角形用极坐标，$0\le\theta\le\pi/2$，$0\le r\le1/(\cos\theta+\sin\theta)$。积分化为
$$\frac12\int_0^{\pi/2}\frac{e^{\sin\theta/(\cos\theta+\sin\theta)}}{(\cos\theta+\sin\theta)^2}d\theta.$$
令 $s=\sin\theta/(\cos\theta+\sin\theta)$，得到 $\frac12\int_0^1e^sds$。`
  }),
  lectureFourteen({
    id: 'example-14-16-guldinus', role: 'example', page: 'PDF 363-364 · 书页 358-359 · 例 14.16',
    fingerprint: 'guldinus:cycloid-area-rotate-about-oblique-line',
    title: '例 14.16 · 正弦拱形绕斜线旋转的体积',
    statement: raw`曲线 $y=\sin x\ (0\le x\le2\pi)$ 与 $x$ 轴所围平面区域 $D$ 绕直线 $y=-x$ 旋转一周，求旋转体体积。`,
    tags: ['古鲁金第二定理', '旋转体体积'],
    coreMethod: '用古鲁金第二定理：体积等于区域面积乘形心绕轴一周走过的路程。',
    mistakes: '区域包含一正一负两个拱形，但面积取绝对值；形心到斜线的距离必须用点到直线公式。',
    answerText: raw`$$4\sqrt2\pi^2.$$`,
    methodOne: raw`两个拱形总面积
$$S=\int_0^{2\pi}|\sin x|dx=4.$$
由中心对称性，形心为 $(\pi,0)$，到直线 $x+y=0$ 的距离为 $\pi/\sqrt2$。古鲁金第二定理给出
$$V=2\pi S\frac\pi{\sqrt2}=4\sqrt2\pi^2.$$`,
    methodTwo: raw`把区域分为 $[0,\pi]$ 与 $[\pi,2\pi]$ 两个全等部分，分别计算面积与一阶矩；合并后形心横坐标为 $\pi$、纵坐标为 $0$。再用 $V=\iint_D2\pi\,\mathrm{dist}((x,y),y=-x)dA$ 得同一结果。`
  }),
  lectureFourteen({
    id: 'example-14-17-centroid-semiannulus', role: 'example', page: 'PDF 364 · 书页 359 · 例 14.17',
    fingerprint: 'centroid:upper-semiannulus-difference-pappus',
    title: '例 14.17 · 两个偏心半圆之差的形心',
    statement: raw`区域 $D$ 是圆 $(x-2)^2+y^2=4$ 与圆 $(x-1)^2+y^2=1$ 及 $x$ 轴所围区域在第一象限的部分。求 $D$ 的形心 $(\bar x,\bar y)$。`,
    tags: ['形心', '古鲁金第二定理'],
    coreMethod: '把区域看成上半径为2的半圆减去上半径为1的半圆，分别计算面积与形心矩。',
    mistakes: raw`小半圆是挖去部分，一阶矩也要相减；求 $\bar y$ 时半圆形心距直径为 $4R/(3\pi)$。`,
    answerText: raw`$$\left(\bar x,\bar y\right)=\left(\frac73,\frac{28}{9\pi}\right).$$`,
    methodOne: raw`面积为
$$S=\frac12\pi\cdot2^2-\frac12\pi\cdot1^2=\frac{3\pi}{2}.$$
关于 $y$ 轴的一阶矩对应两半圆绕 $y$ 轴的体积差，得
$$\bar x=\frac{2\cdot(2\pi)-1\cdot(\pi/2)}{3\pi/2}=\frac73.$$
利用半圆形心 $\bar y_R=4R/(3\pi)$ 作面积加权相减，得 $\bar y=28/(9\pi)$。`,
    methodTwo: raw`直接极坐标平移计算两个半圆的一阶矩：半圆面积 $A_R=\pi R^2/2$，关于直径的一阶矩为
$$\int_0^\pi\int_0^R(r\sin\theta)rdrd\theta=\frac{2R^3}{3}.$$
大半圆减小半圆后，$\bar y=(16/3-2/3)/(3\pi/2)=28/(9\pi)$；$\bar x$ 用圆心水平坐标加权相减。`
  }),
  lectureFourteen({
    id: 'exercise-14-1-riemann-sum', role: 'exercise', page: 'PDF 376-378 · 书页 371-373 · 习题 14.1',
    fingerprint: 'riemann-sum:double-grid-n-over-n-square-plus-i-j',
    title: '习题 14.1 · 二重和极限还原二重积分',
    statement: raw`计算
$$\lim_{n\to\infty}\sum_{i=1}^n\sum_{j=1}^n
\frac{n}{(n+i)(n^2+j^2)}.$$`,
    questionFormat: 'single-choice', options: [
      raw`$\displaystyle\int_0^1dx\int_0^x\frac{dy}{(1+x)(1+y^2)}$`,
      raw`$\displaystyle\int_1^2dx\int_0^1\frac{dy}{(1+x)(1+y)}$`,
      raw`$\displaystyle\int_0^1dx\int_1^2\frac{dy}{(1+x)(1+y)}$`,
      raw`$\displaystyle\int_0^1dx\int_0^1\frac{dy}{(1+x)(1+y^2)}$`
    ], correctOptionIds: ['D'],
    tags: ['二重积分定义', '二重和极限', '选择题'],
    coreMethod: '把每项同时除以适当的 $n$ 次幂，识别网格点 $i/n,j/n$ 与面积元 $1/n^2$。',
    mistakes: '分母第二项对应 $1+(j/n)^2$，不是 $1+j/n$。',
    answerText: raw`对应
$$\int_0^1\int_0^1\frac{dxdy}{(1+x)(1+y^2)}
=\frac{\pi\ln2}{4}.$$`,
    methodOne: raw`改写为
$$\sum_{i,j}\frac1{(1+i/n)(1+(j/n)^2)}\frac1{n^2},$$
这是单位正方形上的二重积分和，故极限为
$$\int_0^1\frac{dx}{1+x}\int_0^1\frac{dy}{1+y^2}=\ln2\cdot\frac\pi4.$$`,
    methodTwo: raw`原双和可分离为两个一重和的乘积：
$$\left(\sum_i\frac1{n+i}\right)
\left(\sum_j\frac n{n^2+j^2}\right).$$
二者分别趋于 $\int_0^1(1+x)^{-1}dx$ 与 $\int_0^1(1+y^2)^{-1}dy$。`
  }),
  lectureFourteen({
    id: 'exercise-14-4-polar-sector', role: 'exercise', page: 'PDF 377,379 · 书页 372,374 · 习题 14.4',
    fingerprint: 'polar:sector-between-y-absx-and-circle',
    title: '习题 14.4 · 圆与两条射线围成区域的积分',
    statement: raw`计算
$$\int_{-1}^1dx\int_{|x|}^{\sqrt{2-x^2}}\sin(x^2+y^2)dy.$$`,
    tags: ['极坐标', '圆扇形'],
    coreMethod: raw`区域由 $y=|x|$ 与圆 $x^2+y^2=2$ 围成，极坐标角度为 $\pi/4\le\theta\le3\pi/4$。`,
    mistakes: raw`径向上限是 $\sqrt2$；角区间总长度为 $\pi/2$。`,
    answerText: raw`$$\frac\pi4(1-\cos2).$$`,
    methodOne: raw`极坐标下
$$I=\int_{\pi/4}^{3\pi/4}\int_0^{\sqrt2}\sin(r^2)rdrd\theta
=\frac\pi2\cdot\frac{1-\cos2}{2}=\frac\pi4(1-\cos2).$$`,
    methodTwo: raw`先按对称性取右半区域乘 $2$，令 $x=r\cos\theta,y=r\sin\theta$，此时 $\theta\in[\pi/4,\pi/2]$。角长为 $\pi/4$，乘 $2$ 后仍得到相同结果。`
  }),
  lectureFourteen({
    id: 'exercise-14-5-strip-product', role: 'exercise', page: 'PDF 377,379 · 书页 372,374 · 习题 14.5',
    fingerprint: 'piecewise-product:strip-between-y-x-and-y-x-plus-one',
    title: '习题 14.5 · 条带区域上的分段函数乘积',
    statement: raw`设 $a>0$，
$$f(x)=g(x)=\begin{cases}a,&0\le x\le1,\\0,&\text{其他}.
\end{cases}$$
$D$ 为全平面，计算
$$\iint_Df(x)g(y-x)dxdy.$$`,
    tags: ['分段函数', '积分区域识别'],
    coreMethod: raw`两个因子同时非零等价于 $0\le x\le1$ 且 $x\le y\le x+1$。`,
    mistakes: raw`不要把 $g(y-x)$ 的非零条件误写成 $0\le y\le1$。`,
    answerText: raw`$$a^2.$$`,
    methodOne: raw`非零区域为
$$D_1=\{0\le x\le1,\ x\le y\le x+1\},$$
其面积为 $1$，区域内乘积恒为 $a^2$，故积分为 $a^2$。`,
    methodTwo: raw`用换元 $u=x,v=y-x$，Jacobian 为 $1$。非零区域直接变成单位正方形 $0\le u,v\le1$，所以积分为 $\int_0^1\int_0^1a^2dudv=a^2$。`
  }),
  lectureFourteen({
    id: 'exercise-14-6-variable-triangle', role: 'exercise', page: 'PDF 377,379-380 · 书页 372,374-375 · 习题 14.6',
    fingerprint: 'variable-double-integral:triangle-leibniz-collapse',
    title: '习题 14.6 · 三角形变域积分求导',
    statement: raw`设 $f$ 连续，
$$F(t)=\int_1^tdy\int_y^tf(x)dx.$$
求 $F'(t)$。`,
    tags: ['变限二重积分', 'Leibniz法则'],
    coreMethod: '交换积分次序把三角形区域写成单层权函数积分，再求导。',
    mistakes: '外上限和内上限都含 $t$，直接逐层求导容易漏掉边界项。',
    answerText: raw`$$F'(t)=(t-1)f(t).$$`,
    methodOne: raw`交换次序：
$$F(t)=\int_1^tf(x)\left(\int_1^xdy\right)dx
=\int_1^t(x-1)f(x)dx.$$
由变上限积分求导公式，$F'(t)=(t-1)f(t)$。`,
    methodTwo: raw`按 Leibniz 法则，外层上限处内积分为零；对内积分的上限 $t$ 求导得到 $f(t)$，再对 $y\in[1,t]$ 积分：
$$F'(t)=\int_1^tf(t)dy=(t-1)f(t).$$`
  }),
  lectureFourteen({
    id: 'exercise-14-7-sine-cap', role: 'exercise', page: 'PDF 377,380 · 书页 372,375 · 习题 14.7',
    fingerprint: 'symmetry:sine-cap-odd-xy-cubic-plus-constant',
    title: '习题 14.7 · 正弦拱顶区域的对称积分',
    statement: raw`区域 $D$ 由曲线 $y=\sin x$、直线 $x=\pm\pi/2$ 与 $y=1$ 围成。计算
$$\iint_D(xy^3-1)dxdy.$$`,
    tags: ['对称性', '面积积分'],
    coreMethod: '区域关于 $y$ 轴对称，$xy^3$ 关于 $x$ 为奇函数，其积分为零。',
    mistakes: raw`剩余的 $-1$ 积分等于负面积；区域在 $y=\sin x$ 与 $y=1$ 之间。`,
    answerText: raw`$$-\pi.$$`,
    methodOne: raw`由对称性，$\iint_Dxy^3dA=0$。区域面积
$$S_D=\int_{-\pi/2}^{\pi/2}(1-\sin x)dx=\pi.$$
因此原积分为 $-S_D=-\pi$。`,
    methodTwo: raw`直接写成累次积分：
$$\int_{-\pi/2}^{\pi/2}\int_{\sin x}^{1}(xy^3-1)dydx.$$
把结果拆为关于 $x$ 的奇函数部分与常数面积部分，奇函数在对称区间积分为零。`
  }),
  lectureFourteen({
    id: 'exercise-14-10-polar-cosine', role: 'exercise', page: 'PDF 377,380 · 书页 372,375 · 习题 14.10',
    fingerprint: 'polar:sec-theta-triangle-sin-theta-sqrt-one-minus-r2cos2',
    title: '习题 14.10 · 极坐标积分转回直角区域',
    statement: raw`计算
$$I=\iint_Dr^2\sin\theta\sqrt{1-r^2\cos^2\theta}\,drd\theta,$$
其中
$$D=\{(r,\theta)\mid0\le r\le\sec\theta,\ 0\le\theta\le\pi/4\}.$$`,
    tags: ['极坐标转直角坐标', '三角积分'],
    coreMethod: raw`先识别 $r\cos\theta=x,r\sin\theta=y$，注意题面已有 $drd\theta$，需正确补偿 Jacobian。`,
    mistakes: '这里被积表达式不是标准极坐标面积元形式；改成 $dxdy$ 时要除以 $r$。',
    answerText: raw`$$\frac13-\frac\pi{16}.$$`,
    methodOne: raw`因为 $r\le\sec\theta$ 对应 $x\le1$，$0\le\theta\le\pi/4$ 对应 $0\le y\le x$，故
$$I=\iint_{0\le y\le x\le1}y\sqrt{1-x^2}\,dxdy.$$
先对 $y$ 积分：
$$I=\frac12\int_0^1x^2\sqrt{1-x^2}dx=\frac13-\frac\pi{16}.$$`,
    methodTwo: raw`保留极坐标，先对 $r$ 积分并令 $u=r\cos\theta$；再交换剩余积分次序，可化成同一个一重积分 $\frac12\int_0^1x^2\sqrt{1-x^2}dx$。`
  }),
  lectureFourteen({
    id: 'exercise-14-12-max-domain', role: 'exercise', page: 'PDF 377,381 · 书页 372,376 · 习题 14.12',
    fingerprint: 'domain-optimization:positive-set-ellipse-integrand',
    title: '习题 14.12 · 选择积分区域使二重积分最大',
    statement: raw`可在平面上任取区域 $D$。求使
$$\iint_D(1-2x^2-y^2)dxdy$$
达到最大值的区域，并求最大值。`,
    tags: ['积分区域优化', '椭圆换元'],
    coreMethod: '最大区域应恰好收集被积函数非负的全部点，不应漏掉正贡献或加入负贡献。',
    mistakes: '边界上函数为零，是否包含边界不影响积分；最优区域不是任意同面积区域。',
    answerText: raw`最优区域为
$$D=\{(x,y)\mid2x^2+y^2\le1\},$$
最大值为
$$\frac{\sqrt2\pi}{4}.$$`,
    methodOne: raw`被积函数在椭圆 $2x^2+y^2<1$ 内为正，外部为负，故最优区域就是该椭圆。令
$$x=\frac r{\sqrt2}\cos\theta,\quad y=r\sin\theta,$$
Jacobian 为 $r/\sqrt2$，于是
$$I=\frac1{\sqrt2}\int_0^{2\pi}\int_0^1(1-r^2)rdrd\theta=\frac{\sqrt2\pi}{4}.$$`,
    methodTwo: raw`对任何区域 $E$，记正集为 $P=\{1-2x^2-y^2>0\}$。则
$$\int_Pf-\int_Ef=\int_{P\setminus E}f-\int_{E\setminus P}f\ge0,$$
证明 $P$ 全局最优。再用椭圆面积缩放或极坐标计算其积分。`
  })
]
