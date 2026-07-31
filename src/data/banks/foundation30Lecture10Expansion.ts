import type { SeedInput } from './types'

const raw = String.raw
const ZY30_SOURCE = '何耀焜私人整理 · 张宇《基础30讲》高数 · 第10讲逐页核验'

type LectureTenSeed = Omit<SeedInput, 'id' | 'kind' | 'tags' | 'methodFingerprint' | 'source'> & {
  id: string
  role: 'example' | 'exercise'
  tags: string[]
  fingerprint: string
}

function lectureTen(input: LectureTenSeed): SeedInput {
  const roleLabel = input.role === 'example' ? '经典例题' : '课后习题'
  return {
    ...input,
    id: `zy30-verified-l10-${input.id}`,
    kind: 'problem',
    source: ZY30_SOURCE,
    tags: ['高等数学', '第10讲', roleLabel, 'PDF逐页核验', ...input.tags],
    methodFingerprint: `zy30-verified:l10:${input.fingerprint}`
  }
}

export const foundation30Lecture10ExpansionSeeds: SeedInput[] = [
  lectureTen({
    id: 'example-10-1-adjacent-power-area-limit', role: 'example', page: 'PDF 269-270 · 书页 264-265 · 例 10.1',
    fingerprint: 'plane-area:adjacent-power-telescoping-sum-exponential-limit',
    title: '例 10.1 · 相邻幂函数面积和的指数极限',
    statement: raw`设 $A_n$ 是曲线 $y=x^n$ 与 $y=x^{n+1}$（$n=1,2,\ldots$）所围区域的面积，求

$$\lim_{n\to\infty}\left(2\sum_{k=1}^{n}A_k\right)^n.$$`,
    tags: ['平面面积', '裂项求和', '指数极限'],
    coreMethod: raw`先在 $[0,1]$ 上积分求出 $A_k$，再将面积和裂项化简为 $1-2/(n+2)$，最后使用 $(1+u_n)^n$ 型极限。`,
    mistakes: raw`漏掉两曲线还在 $x=0,1$ 相交，或把 $x^k-x^{k+1}$ 的上下顺序写反；指数极限还要保留一阶等价量。`,
    answerText: raw`$$e^{-2}.$$`,
    solutionMethods: [
      { title: '方法一 · 面积积分与裂项', content: raw`在 $0<x<1$ 上有 $x^k>x^{k+1}$，故
$$A_k=\int_0^1(x^k-x^{k+1})dx=\frac1{k+1}-\frac1{k+2}.$$
于是 $2\sum_{k=1}^nA_k=1-2/(n+2)$，从而
$$\left(1-\frac2{n+2}\right)^n\longrightarrow e^{-2}.$$` },
      { title: '方法二 · 取对数复核', content: raw`令 $L_n=(1-2/(n+2))^n$。则
$$\ln L_n=n\ln\left(1-\frac2{n+2}\right)=-\frac{2n}{n+2}+o(1)\to-2.$$
指数化得到 $L_n\to e^{-2}$，同时排除了把底数极限 $1$ 直接代入的错误。` }
    ]
  }),
  lectureTen({
    id: 'example-10-2-cycloid-arch-area', role: 'example', page: 'PDF 270-271 · 书页 265-266 · 例 10.2',
    fingerprint: 'plane-area:parametric-cycloid-arch-y-dx',
    title: '例 10.2 · 摆线一拱的参数面积',
    statement: raw`求摆线一拱
$$x=a(t-\sin t),\qquad y=a(1-\cos t),\qquad 0\le t\le2\pi,$$
与 $x$ 轴所围平面图形的面积，其中 $a>0$。`,
    tags: ['参数方程', '平面面积', '摆线'],
    coreMethod: raw`参数曲线下的面积仍是 $\int y\,dx$，把 $dx=x'(t)dt$ 与 $y(t)$ 同时换成参数表达式。`,
    mistakes: raw`把面积误写为 $\int y(t)dt$；还应先确认 $x'(t)=a(1-\cos t)\ge0$，一拱不会被反向重复描绘。`,
    answerText: raw`$$3\pi a^2.$$`,
    solutionMethods: [
      { title: '方法一 · 参数面积公式', content: raw`由 $x'(t)=a(1-\cos t)$，有
$$S=\int_0^{2\pi}y(t)x'(t)dt=a^2\int_0^{2\pi}(1-\cos t)^2dt.$$
展开并利用整周期积分，得到 $2\pi a^2+\pi a^2=3\pi a^2$。` },
      { title: '方法二 · 对称半拱', content: raw`摆线关于 $x=\pi a$ 对称，可计算 $0\le t\le\pi$ 的半拱再乘 $2$：
$$S=2a^2\int_0^\pi(1-\cos t)^2dt
=2a^2\left(\pi+\frac\pi2\right)=3\pi a^2.$$` }
    ]
  }),
  lectureTen({
    id: 'example-10-3-lemniscate-total-area', role: 'example', page: 'PDF 271 · 书页 266 · 例 10.3',
    fingerprint: 'polar-area:lemniscate-fourfold-symmetry-total',
    title: '例 10.3 · 伯努利双纽线的总面积',
    statement: raw`伯努利双纽线
$$r^2=a^2\cos2\theta$$
围成的图形面积为多少？`,
    tags: ['极坐标', '平面面积', '对称性'],
    coreMethod: raw`由 $r^2\ge0$ 确定一个半瓣的角区间 $0\le\theta\le\pi/4$，再利用四重对称性恢复整幅图形。`,
    mistakes: raw`直接在 $[0,2\pi]$ 积分会跨入 $r^2<0$ 的无实点区间，并重复描绘两个叶瓣。`,
    answerText: raw`$$a^2.$$`,
    solutionMethods: [
      { title: '方法一 · 四分区域积分', content: raw`第一象限半瓣面积为
$$\frac12\int_0^{\pi/4}a^2\cos2\theta\,d\theta=\frac{a^2}{4}.$$
图形关于两坐标轴对称，乘 $4$ 得总面积 $a^2$。` },
      { title: '方法二 · 两个完整叶瓣', content: raw`右叶对应 $-\pi/4\le\theta\le\pi/4$，其面积为
$$\frac12\int_{-\pi/4}^{\pi/4}a^2\cos2\theta\,d\theta=\frac{a^2}{2}.$$
左右两叶面积相等，所以总面积为 $a^2$。` }
    ]
  }),
  lectureTen({
    id: 'example-10-4-damped-sine-total-area', role: 'example', page: 'PDF 271-272 · 书页 266-267 · 例 10.4',
    fingerprint: 'plane-area:damped-sine-absolute-value-geometric-series',
    title: '例 10.4 · 衰减正弦曲线的无穷总面积',
    statement: raw`求曲线
$$y=e^{-x}\sin x\qquad(x\ge0)$$
与 $x$ 轴所围全部平面图形的面积。`,
    tags: ['反常积分', '绝对值', '等比级数'],
    coreMethod: raw`几何面积必须积分 $e^{-x}|\sin x|$；按每个长度为 $\pi$ 的波瓣分段后，各瓣面积构成公比 $e^{-\pi}$ 的等比级数。`,
    mistakes: raw`直接计算 $\int_0^\infty e^{-x}\sin xdx$ 得到的是带符号积分，不是各波瓣绝对面积之和。`,
    answerText: raw`$$\frac{1+e^{-\pi}}{2(1-e^{-\pi})}.$$`,
    solutionMethods: [
      { title: '方法一 · 分瓣求和', content: raw`第 $k$ 个波瓣的面积为
$$\left|\int_{k\pi}^{(k+1)\pi}e^{-x}\sin xdx\right|
=\frac{1+e^{-\pi}}2e^{-k\pi}.$$
从 $k=0$ 起求等比级数，得到所给结果。` },
      { title: '方法二 · 平移缩放', content: raw`记首瓣面积 $A=\int_0^\pi e^{-x}\sin xdx=(1+e^{-\pi})/2$。每向右平移 $\pi$，绝对值波形相同而指数因子乘 $e^{-\pi}$，故总面积为
$$A(1+e^{-\pi}+e^{-2\pi}+\cdots)=\frac{A}{1-e^{-\pi}}.$$` }
    ]
  }),
  lectureTen({
    id: 'example-10-5-domain-limited-volume', role: 'example', page: 'PDF 272-273 · 书页 267-268 · 例 10.5',
    fingerprint: 'volume:domain-restriction-exponential-sine-disc',
    title: '例 10.5 · 先判定义域再求旋转体体积',
    statement: raw`曲线
$$y=e^{-x/2}\sqrt{\sin x}$$
在 $[0,2\pi]$ 内与 $x$ 轴围成的平面图形绕 $x$ 轴旋转一周，求所得旋转体体积。`,
    tags: ['旋转体', '定义域', '圆盘法'],
    coreMethod: raw`先由 $\sin x\ge0$ 把有效区间缩为 $[0,\pi]$，再用 $V=\pi\int y^2dx$ 消去根号。`,
    mistakes: raw`未经定义域判断就把积分上限写成 $2\pi$；根号在 $(\pi,2\pi)$ 内没有实数意义。`,
    answerText: raw`$$\frac\pi2(1+e^{-\pi}).$$`,
    solutionMethods: [
      { title: '方法一 · 圆盘法', content: raw`曲线只在 $[0,\pi]$ 上有定义，因此
$$V=\pi\int_0^\pi e^{-x}\sin xdx
=\pi\left[-\frac12e^{-x}(\sin x+\cos x)\right]_0^\pi
=\frac\pi2(1+e^{-\pi}).$$` },
      { title: '方法二 · 引用首瓣积分', content: raw`例 10.4 的第一波瓣恰为 $\int_0^\pi e^{-x}\sin xdx=(1+e^{-\pi})/2$。本题平方半径后正好得到同一积分，再乘圆盘面积系数 $\pi$ 即可。` }
    ]
  }),
  lectureTen({
    id: 'example-10-6-functional-equation-volume', role: 'example', page: 'PDF 273-274 · 书页 268-269 · 例 10.6',
    fingerprint: 'volume:functional-equation-reciprocal-recovery-horizontal-shell',
    title: '例 10.6 · 由倒数型函数方程反求曲线并求体积',
    statement: raw`函数 $f$ 的定义域为 $(0,+\infty)$，且
$$2f(x)+x^2f\left(\frac1x\right)=\frac{x^2+2x}{\sqrt{1+x^2}}.$$
求 $f(x)$，并求曲线 $y=f(x)$、直线 $y=1/2$、$y=\sqrt3/2$ 与 $y$ 轴所围图形绕 $x$ 轴旋转一周的体积。`,
    tags: ['函数方程', '反函数', '旋转体'],
    coreMethod: raw`把 $x$ 换成 $1/x$ 得到第二个方程，联立求 $f$；随后反解 $x=y/\sqrt{1-y^2}$，按水平圆柱壳积分。`,
    mistakes: raw`只解出 $f$ 而忽略体积中更适合用 $y$ 作自变量；反解时还要保留 $x>0$ 对应的正根。`,
    answerText: raw`$$f(x)=\frac{x}{\sqrt{1+x^2}},\qquad V=\frac{\pi^2}{6}.$$`,
    solutionMethods: [
      { title: '方法一 · 联立后用水平壳', content: raw`将 $x$ 换成 $1/x$ 并乘以 $x^2$，与原式联立可得 $f(x)=x/\sqrt{1+x^2}$。反解为 $x=y/\sqrt{1-y^2}$，故
$$V=2\pi\int_{1/2}^{\sqrt3/2}y\frac{y}{\sqrt{1-y^2}}dy=\frac{\pi^2}{6}.$$` },
      { title: '方法二 · 角参数计算', content: raw`令 $y=\sin t$，则 $x=\tan t$，而 $y\in[1/2,\sqrt3/2]$ 对应 $t\in[\pi/6,\pi/3]$。水平壳公式化为
$$2\pi\int_{\pi/6}^{\pi/3}\sin^2t\,dt=\frac{\pi^2}{6},$$
其中端点的正弦项相消。` }
    ]
  }),
  lectureTen({
    id: 'example-10-7-exponential-tangent-region', role: 'example', page: 'PDF 275-276 · 书页 270-271 · 例 10.7',
    fingerprint: 'tangent-geometry:exponential-origin-tangent-area-offset-axis-volume',
    title: '例 10.7 · 过原点的指数曲线切线与旋转体',
    statement: raw`过原点作曲线 $y=e^x$ 的切线。该切线与曲线 $y=e^x$ 及 $x$ 轴负半轴围成无界平面图形 $D$。求：

1. $D$ 的面积；
2. $D$ 绕直线 $x=1$ 旋转一周所得旋转体体积。`,
    tags: ['切线', '反常积分', '旋转体'],
    coreMethod: raw`设切点并利用“切线过原点”确定切点为 $(1,e)$、切线为 $y=ex$；面积和体积均需按曲线边界分段。`,
    mistakes: raw`把过原点误解为在原点处作切线；$e^x$ 不经过原点。旋转体还必须区分 $x<0$ 与 $0<x<1$ 的内外半径。`,
    answerText: raw`$$A=\frac e2,\qquad V=\frac{5\pi e}{3}.$$`,
    solutionMethods: [
      { title: '方法一 · 反函数水平切片', content: raw`切线为 $y=ex$。对 $0<y<e$，区域横向介于 $x=\ln y$ 与 $x=y/e$。因此
$$A=\int_0^e\left(\frac ye-\ln y\right)dy=\frac e2.$$
绕 $x=1$ 用垫片法：
$$V=\pi\int_0^e\left[(1-\ln y)^2-(1-y/e)^2\right]dy=\frac{5\pi e}{3}.$$` },
      { title: '方法二 · 绕任意直线公式', content: raw`对曲线段直接使用绕 $Ax+By+C=0$ 的体积公式，并将 $y=e^x$ 与 $y=ex$ 对 $x=1$ 的贡献相减，可化为
$$\pi\int_{-\infty}^{1}(x-1)^2e^x dx-\pi\int_0^1(x-1)^2e\,dx,$$
分部积分后同样得到 $5\pi e/3$。` }
    ]
  }),
  lectureTen({
    id: 'example-10-8-average-from-shift-difference', role: 'example', page: 'PDF 276-277 · 书页 271-272 · 例 10.8',
    fingerprint: 'average-value:shift-difference-variable-window-antiderivative',
    title: '例 10.8 · 平移差条件决定区间平均值',
    statement: raw`设 $f$ 连续，且
$$f(x+2)-f(x)=x,\qquad \int_0^2f(x)dx=0.$$
求 $f$ 在 $[1,3]$ 上的平均值。`,
    tags: ['函数平均值', '平移差', '变上限积分'],
    coreMethod: raw`构造滑动窗口 $F(x)=\int_x^{x+2}f(t)dt$，其导数正好等于题设给出的平移差。`,
    mistakes: raw`把 $f(x+2)-f(x)=x$ 当成周期性；它描述的是差分增长，不是 $f(x+2)=f(x)$。`,
    answerText: raw`$$\frac14.$$`,
    solutionMethods: [
      { title: '方法一 · 滑动窗口求导', content: raw`令 $F(x)=\int_x^{x+2}f(t)dt$，则
$$F'(x)=f(x+2)-f(x)=x.$$
由 $F(0)=0$ 得 $F(x)=x^2/2$，所以 $\int_1^3f=F(1)=1/2$。除以区间长度 $2$，平均值为 $1/4$。` },
      { title: '方法二 · 直接积分差分式', content: raw`在 $x\in[0,1]$ 上积分：
$$\int_0^1[f(x+2)-f(x)]dx=\frac12.$$
结合 $\int_0^2f=0$，左侧整理为 $\int_1^3f$，故该积分为 $1/2$，平均值仍为 $1/4$。` }
    ]
  }),
  lectureTen({
    id: 'example-10-9-centroid-log-polynomial', role: 'example', page: 'PDF 277-278 · 书页 272-273 · 例 10.9',
    fingerprint: 'centroid:x-coordinate-log-polynomial-moment-ratio',
    title: '例 10.9 · 对数多项式曲边梯形的形心横坐标',
    statement: raw`曲线
$$y=\frac14x^2-\frac12\ln x,\qquad 1\le x\le e,$$
与直线 $x=1$、$x=e$ 及 $x$ 轴围成平面图形 $D$。求 $D$ 的形心横坐标。`,
    tags: ['形心', '一阶矩', '分部积分'],
    coreMethod: raw`形心横坐标是关于 $y$ 轴的一阶矩与面积之比，即 $\bar x=\int xy\,dx/\int y\,dx$。`,
    mistakes: raw`把横坐标形心公式写成含 $y^2/2$ 的表达式；后者计算的是纵坐标。`,
    answerText: raw`$$\bar x=\frac{3(e^2+1)(e^2-3)}{4(e^3-7)}.$$`,
    solutionMethods: [
      { title: '方法一 · 面积与矩分别积分', content: raw`计算得
$$\int_1^e xy\,dx=\frac1{16}(e^2+1)(e^2-3),$$
$$\int_1^e y\,dx=\frac1{12}(e^3-7).$$
二者相除即得所给形心横坐标。` },
      { title: '方法二 · 分项构造原函数', content: raw`对分子使用
$$\int x\ln xdx=\frac{x^2}{2}\ln x-\frac{x^2}{4},$$
对分母使用 $\int\ln xdx=x\ln x-x$。分别代入 $1,e$ 后化为上述两个闭式，能同时检查端点常数项。` }
    ]
  }),
  lectureTen({
    id: 'example-10-10-log-curve-arc-length', role: 'example', page: 'PDF 278-279 · 书页 273-274 · 例 10.10',
    fingerprint: 'arc-length:log-one-minus-square-perfect-rational-square',
    title: '例 10.10 · 对数曲线弧长中的完全平方',
    statement: raw`求曲线
$$y=\ln(1-x^2),\qquad 0\le x\le\frac12$$
对应弧段的长度。`,
    tags: ['弧长', '完全平方', '有理积分'],
    coreMethod: raw`代入 $y'=-2x/(1-x^2)$ 后，把根式内配成 $[(1+x^2)/(1-x^2)]^2$。`,
    mistakes: raw`开平方时忽略区间符号；本题 $0\le x\le1/2$，所以 $1-x^2>0$，可直接取正值。`,
    answerText: raw`$$\ln3-\frac12.$$`,
    solutionMethods: [
      { title: '方法一 · 弧长公式', content: raw`有
$$\sqrt{1+(y')^2}=\frac{1+x^2}{1-x^2}=\frac2{1-x^2}-1.$$
故
$$s=\int_0^{1/2}\left(\frac1{1+x}+\frac1{1-x}-1\right)dx=\ln3-\frac12.$$` },
      { title: '方法二 · 双曲函数换元', content: raw`令 $x=\tanh u$，则 $(1+x^2)/(1-x^2)\,dx=(1+\tanh^2u)du$。端点为 $u=0$ 与 $u=\operatorname{artanh}(1/2)=\frac12\ln3$，积分化简后仍为 $\ln3-1/2$。` }
    ]
  }),
  lectureTen({
    id: 'example-10-11-archimedean-spiral-arc', role: 'example', page: 'PDF 279 · 书页 274 · 例 10.11',
    fingerprint: 'arc-length:polar-archimedean-spiral-root-quadratic',
    title: '例 10.11 · 阿基米德螺线一周弧长',
    statement: raw`求阿基米德螺线
$$r=\theta,\qquad 0\le\theta\le2\pi$$
对应弧段的长度。`,
    tags: ['弧长', '极坐标', '根式积分'],
    coreMethod: raw`使用极坐标弧长公式 $s=\int\sqrt{r^2+(r')^2}\,d\theta$，归结为 $\int\sqrt{1+\theta^2}d\theta$。`,
    mistakes: raw`把极坐标弧长误写成 $\int r\,d\theta$；那只在圆弧半径恒定时成立。`,
    answerText: raw`$$\pi\sqrt{1+4\pi^2}+\frac12\ln\left(2\pi+\sqrt{1+4\pi^2}\right).$$`,
    solutionMethods: [
      { title: '方法一 · 标准根式原函数', content: raw`由 $r'=1$，
$$s=\int_0^{2\pi}\sqrt{1+\theta^2}d\theta.$$
使用
$$\int\sqrt{1+u^2}du=\frac12\left(u\sqrt{1+u^2}+\ln(u+\sqrt{1+u^2})\right)$$
并代入端点即得答案。` },
      { title: '方法二 · 双曲换元', content: raw`令 $\theta=\sinh u$，则根式为 $\cosh u$、$d\theta=\cosh udu$。积分成为 $\int\cosh^2u\,du$，用倍角公式积分并以 $u=\operatorname{arsinh}(2\pi)$ 回代，得到同一闭式。` }
    ]
  }),
  lectureTen({
    id: 'example-10-12-radical-surface-area', role: 'example', page: 'PDF 279-280 · 书页 274-275 · 例 10.12',
    fingerprint: 'surface-area:radical-curve-direct-power-substitution',
    title: '例 10.12 · 根式曲线绕轴的旋转曲面面积',
    statement: raw`曲线
$$y=\sqrt{x-1},\qquad 1\le x\le2$$
绕 $x$ 轴旋转一周，求所得旋转曲面的表面积。`,
    tags: ['旋转曲面', '表面积', '根式函数'],
    coreMethod: raw`代入 $S=2\pi\int y\sqrt{1+(y')^2}dx$ 后，$y$ 会与导数分母配合，把被积式化为 $\pi\sqrt{4x-3}$。`,
    mistakes: raw`使用了旋转体体积公式 $\pi\int y^2dx$；表面积还包含弧长伸缩因子 $\sqrt{1+(y')^2}$。`,
    answerText: raw`$$\frac\pi6(5\sqrt5-1).$$`,
    solutionMethods: [
      { title: '方法一 · 直接代公式', content: raw`$y'=1/(2\sqrt{x-1})$，所以
$$2\pi y\sqrt{1+(y')^2}=\pi\sqrt{4x-3}.$$
于是
$$S=\pi\int_1^2\sqrt{4x-3}dx=\frac\pi6(5\sqrt5-1).$$` },
      { title: '方法二 · 以半径为参数', content: raw`令 $t=y=\sqrt{x-1}$，则 $x=t^2+1$、$0\le t\le1$，弧长元为 $ds=\sqrt{1+4t^2}dt$。因此
$$S=2\pi\int_0^1t\sqrt{1+4t^2}dt=\frac\pi6(5\sqrt5-1).$$` }
    ]
  }),
  lectureTen({
    id: 'example-10-13-astroid-surface-area', role: 'example', page: 'PDF 280 · 书页 275 · 例 10.13',
    fingerprint: 'surface-area:parametric-astroid-half-by-symmetry',
    title: '例 10.13 · 星形线绕轴的旋转曲面面积',
    statement: raw`星形线
$$x=2\cos^3t,\qquad y=2\sin^3t$$
绕 $x$ 轴旋转一周，求所得旋转体的表面积。`,
    tags: ['参数方程', '旋转曲面', '对称性'],
    coreMethod: raw`只计算 $y\ge0$ 的上半支，避免旋转后重复生成同一曲面；再利用左右对称把第一象限结果乘 $2$。`,
    mistakes: raw`把整条闭合曲线从 $0$ 到 $2\pi$ 代入表面积公式，会把同一旋转曲面重复计算两次。`,
    answerText: raw`$$\frac{48\pi}{5}.$$`,
    solutionMethods: [
      { title: '方法一 · 第一象限乘二', content: raw`在 $0\le t\le\pi/2$，
$$\sqrt{(x')^2+(y')^2}=6\sin t\cos t.$$
故
$$S=2\cdot2\pi\int_0^{\pi/2}2\sin^3t\cdot6\sin t\cos tdt
=48\pi\int_0^{\pi/2}\sin^4t\cos tdt=\frac{48\pi}{5}.$$` },
      { title: '方法二 · 上半支整体积分', content: raw`在 $0\le t\le\pi$ 使用 $|\sin t\cos t|$ 作为速度模，直接写
$$S=2\pi\int_0^\pi |2\sin^3t|\,6|\sin t\cos t|dt.$$
关于 $\pi/2$ 对称后仍化为两倍第一象限积分，结果一致。` }
    ]
  }),
  lectureTen({
    id: 'example-10-14-oblique-axis-volume', role: 'example', page: 'PDF 280-281 · 书页 275-276 · 例 10.14',
    fingerprint: 'volume:oblique-axis-perpendicular-cross-sections-distance-squared',
    title: '例 10.14 · 曲边区域绕斜线旋转的截面体积',
    statement: raw`曲线 $y=\sqrt x$ 与 $y=x$ 所围平面有界区域绕直线 $y=x$ 旋转一周，求所得旋转体体积。`,
    tags: ['斜轴旋转', '平行截面', '点线距离'],
    coreMethod: raw`在 $0\le x\le1$ 上，曲线点到旋转轴的距离为 $(\sqrt x-x)/\sqrt2$；垂直于轴的切片厚度为 $du=\sqrt2\,dx$。`,
    mistakes: raw`仍沿 $x$ 方向直接套 $\pi r^2dx$，忽略切片必须垂直于斜旋转轴，厚度不是 $dx$。`,
    answerText: raw`$$\frac{\sqrt2\pi}{60}.$$`,
    solutionMethods: [
      { title: '方法一 · 垂直截面', content: raw`截面半径
$$r(x)=\frac{\sqrt x-x}{\sqrt2},$$
而沿轴方向的厚度为 $du=\sqrt2dx$。故
$$V=\int_0^1\pi r^2du=\frac\pi{\sqrt2}\int_0^1(x-2x^{3/2}+x^2)dx=\frac{\sqrt2\pi}{60}.$$` },
      { title: '方法二 · 旋转坐标', content: raw`作正交变换 $u=(x+y)/\sqrt2$、$v=(y-x)/\sqrt2$，旋转轴变成 $v=0$。每个固定 $u$ 的截面是半径 $|v|$ 的圆盘，积分 $\pi v(u)^2du$；沿曲线参数化后得到与方法一相同的 $x$ 积分。` }
    ]
  }),
  lectureTen({
    id: 'exercise-10-1-infinite-solid-volume', role: 'exercise', page: 'PDF 282-283 · 书页 277-278 · 习题 10.1',
    fingerprint: 'volume:infinite-region-disc-arctangent-limit',
    title: '习题 10.1 · 无界曲边区域的有限旋转体体积',
    statement: raw`位于曲线
$$y=\frac1{\sqrt{1+x^2}},\qquad 0\le x<+\infty$$
下方且在 $x$ 轴上方的无界区域绕 $x$ 轴旋转一周，求所得旋转体体积。`,
    tags: ['旋转体', '反常积分', '圆盘法'],
    coreMethod: raw`旋转后的圆盘面积为 $\pi/(1+x^2)$，体积是收敛的反常积分。`,
    mistakes: raw`看到原区域无界就直接判断体积无穷；区域无界与体积积分是否收敛是两回事。`,
    answerText: raw`$$\frac{\pi^2}{2}.$$`,
    solutionMethods: [
      { title: '方法一 · 反常圆盘积分', content: raw`$$V=\pi\int_0^{+\infty}\frac{dx}{1+x^2}
=\pi\lim_{b\to\infty}\arctan b=\frac{\pi^2}{2}.$$` },
      { title: '方法二 · 三角换元', content: raw`令 $x=\tan t$，$0\le t<\pi/2$。则 $dx=\sec^2t\,dt$，分母 $1+x^2=\sec^2t$，体积化为 $\pi\int_0^{\pi/2}dt=\pi^2/2$。` }
    ]
  }),
  lectureTen({
    id: 'exercise-10-2-offset-disk-volume', role: 'exercise', page: 'PDF 282-283 · 书页 277-278 · 习题 10.2',
    fingerprint: 'volume:offset-disk-axis-washers-cross-term',
    title: '习题 10.2 · 偏心圆盘绕坐标轴的旋转体积',
    statement: raw`圆域
$$x^2+(y-b)^2\le k^2,\qquad 0<k<b,$$
绕 $x$ 轴旋转一周，求所得旋转体体积。`,
    tags: ['旋转体', '圆域', '垫片法'],
    coreMethod: raw`固定 $x$ 时，上下边界为 $b\pm\sqrt{k^2-x^2}$，用外圆面积减内圆面积，平方差只留下交叉项。`,
    mistakes: raw`把截面当作实心圆盘；由于 $b>k$，旋转体每个截面都有内孔，应使用垫片。`,
    answerText: raw`$$2\pi^2k^2b.$$`,
    solutionMethods: [
      { title: '方法一 · 垫片积分', content: raw`令 $u=\sqrt{k^2-x^2}$，则
$$dV=\pi[(b+u)^2-(b-u)^2]dx=4\pi b\sqrt{k^2-x^2}dx.$$
在 $[-k,k]$ 积分，并用半径 $k$ 的圆面积，得 $V=4\pi b\cdot\pi k^2/2=2\pi^2k^2b$。` },
      { title: '方法二 · 形心轨迹公式', content: raw`圆盘面积为 $\pi k^2$，形心到 $x$ 轴的距离为 $b$，旋转一周走过长度 $2\pi b$。由 Pappus 体积定理，
$$V=(\pi k^2)(2\pi b)=2\pi^2k^2b.$$` }
    ]
  }),
  lectureTen({
    id: 'exercise-10-3-inverse-variable-arc-length', role: 'exercise', page: 'PDF 282、284 · 书页 277、279 · 习题 10.3',
    fingerprint: 'arc-length:x-as-function-of-y-perfect-square',
    title: '习题 10.3 · 以纵坐标为参数的弧长完全平方',
    statement: raw`求曲线
$$x=\frac14y^2-\frac12\ln y,\qquad 1\le y\le e$$
对应弧段的长度。`,
    tags: ['弧长', '反函数表示', '完全平方'],
    coreMethod: raw`曲线已写成 $x=x(y)$，直接使用 $s=\int\sqrt{1+(dx/dy)^2}dy$，根式可配成 $(y+1/y)/2$。`,
    mistakes: raw`强行反解 $y(x)$ 增加复杂度；还要注意 $y>0$，开平方后无需绝对值分段。`,
    answerText: raw`$$\frac{e^2+1}{4}.$$`,
    solutionMethods: [
      { title: '方法一 · 纵变量弧长', content: raw`$$\frac{dx}{dy}=\frac y2-\frac1{2y},$$
故
$$\sqrt{1+(dx/dy)^2}=\frac12\left(y+\frac1y\right).$$
于是 $s=\frac12\int_1^e(y+1/y)dy=(e^2+1)/4$。` },
      { title: '方法二 · 双曲结构复核', content: raw`令 $y=e^t$，$0\le t\le1$，则 $dx/dt=(e^{2t}-1)/2$、$dy/dt=e^t$。速度模为 $(e^{2t}+1)/2$，积分得 $[e^{2t}/4+t/2]_0^1=(e^2+1)/4$。` }
    ]
  }),
  lectureTen({
    id: 'exercise-10-4-unit-astroid-perimeter', role: 'exercise', page: 'PDF 282、284 · 书页 277、279 · 习题 10.4',
    fingerprint: 'arc-length:unit-astroid-quadrant-symmetry',
    title: '习题 10.4 · 单位星形线的周长',
    statement: raw`求星形线
$$x=\cos^3t,\qquad y=\sin^3t,\qquad 0\le t\le2\pi$$
的弧长。`,
    tags: ['参数方程', '弧长', '对称性'],
    coreMethod: raw`利用四象限对称性只算 $0\le t\le\pi/2$，该区间速度模化为 $3\sin t\cos t$。`,
    mistakes: raw`在整个 $[0,2\pi]$ 直接把速度模写成 $3\sin t\cos t$，忘记其余象限需要绝对值。`,
    answerText: raw`$$6.$$`,
    solutionMethods: [
      { title: '方法一 · 第一象限乘四', content: raw`第一象限内
$$\sqrt{(-3\cos^2t\sin t)^2+(3\sin^2t\cos t)^2}=3\sin t\cos t.$$
故总长 $s=4\int_0^{\pi/2}3\sin t\cos tdt=6$。` },
      { title: '方法二 · 分象限积分', content: raw`全参数区间的速度模为 $3|\sin t\cos t|$。它以 $\pi/2$ 为重复周期，因此
$$s=3\cdot4\int_0^{\pi/2}\sin t\cos tdt=6.$$` }
    ]
  }),
  lectureTen({
    id: 'exercise-10-5-average-rational-radical', role: 'exercise', page: 'PDF 282、284 · 书页 277、279 · 习题 10.5',
    fingerprint: 'average-value:trig-substitution-x-squared-over-circle-root',
    title: '习题 10.5 · 根式分母函数的区间平均值',
    statement: raw`求函数
$$y=\frac{x^2}{\sqrt{1-x^2}}$$
在区间 $[1/2,\sqrt3/2]$ 上的平均值。`,
    tags: ['函数平均值', '三角换元', '定积分'],
    coreMethod: raw`平均值等于定积分除以区间长度；令 $x=\sin\theta$ 后，被积式直接化为 $\sin^2\theta$。`,
    mistakes: raw`只算积分而忘记除以区间长度 $(\sqrt3-1)/2$；换元后的端点应为 $\pi/6$ 与 $\pi/3$。`,
    answerText: raw`$$\frac{(\sqrt3+1)\pi}{12}.$$`,
    solutionMethods: [
      { title: '方法一 · 三角换元', content: raw`令 $x=\sin\theta$，则
$$\int_{1/2}^{\sqrt3/2}\frac{x^2}{\sqrt{1-x^2}}dx
=\int_{\pi/6}^{\pi/3}\sin^2\theta d\theta=\frac\pi{12}.$$
再除以 $(\sqrt3-1)/2$，有理化后得到答案。` },
      { title: '方法二 · 拆成标准原函数', content: raw`写 $x^2=1-(1-x^2)$，则被积式为
$$\frac1{\sqrt{1-x^2}}-\sqrt{1-x^2}.$$
分别使用反正弦与圆弓面积原函数，代入两端得到积分 $\pi/12$，再完成平均值计算。` }
    ]
  }),
  lectureTen({
    id: 'exercise-10-6-minimum-tangent-area', role: 'exercise', page: 'PDF 282、284-285 · 书页 277、279-280 · 习题 10.6',
    fingerprint: 'optimization:tangent-to-square-root-minimum-enclosed-area',
    title: '习题 10.6 · 根式曲线切线的最小围成面积',
    statement: raw`求曲线 $y=\sqrt x$ 的一条切线 $l$，使该曲线、切线 $l$ 及直线 $x=0$、$x=2$ 所围成图形的面积最小。`,
    tags: ['切线', '面积最值', '参数优化'],
    coreMethod: raw`设切点为 $(t,\sqrt t)$，把切线写成含 $t$ 的式子，再将两曲线间面积构造成一元函数 $S(t)$ 求最小值。`,
    mistakes: raw`切线位于凹函数 $\sqrt x$ 的上方，面积应取“切线减曲线”；若上下顺序写反会得到负值。`,
    answerText: raw`切线为
$$l:\ y=\frac{x+1}{2},$$
最小面积为 $2-4\sqrt2/3$。`,
    solutionMethods: [
      { title: '方法一 · 切点参数求导', content: raw`切线为
$$y=\frac{x}{2\sqrt t}+\frac{\sqrt t}{2}.$$
面积
$$S(t)=\int_0^2\left(\frac{x}{2\sqrt t}+\frac{\sqrt t}{2}-\sqrt x\right)dx
=\frac1{\sqrt t}+\sqrt t-\frac{4\sqrt2}{3}.$$
$S'(t)=0$ 给出 $t=1$，故切线与最小面积如答案。` },
      { title: '方法二 · AM-GM 判最小', content: raw`面积中的变量部分满足
$$\frac1{\sqrt t}+\sqrt t\ge2,$$
等号当且仅当 $t=1$。因此无需二阶导数即可确定全局最小点，代回切线式得到 $y=(x+1)/2$。` }
    ]
  }),
  lectureTen({
    id: 'exercise-10-7-two-solids-maximum', role: 'exercise', page: 'PDF 282-283、285 · 书页 277-278、280 · 习题 10.7',
    fingerprint: 'optimization:sum-of-two-parabolic-solid-volumes',
    title: '习题 10.7 · 两个抛物线区域旋转体体积和最大值',
    statement: raw`区域 $D_1$ 由 $y=2x^2$、$x=a$、$x=2$、$y=0$ 围成；区域 $D_2$ 由 $y=2x^2$、$y=0$、$x=a$ 围成，其中 $0<a<2$。

1. 求 $D_1$ 绕 $x$ 轴的体积 $V_1$ 与 $D_2$ 绕 $y$ 轴的体积 $V_2$；
2. 求 $V_1+V_2$ 的最大值。`,
    tags: ['旋转体', '圆盘法', '体积最值'],
    coreMethod: raw`$D_1$ 用圆盘法，$D_2$ 用外圆柱减去曲线内侧空缺体积；把体积和化成 $a$ 的函数后求极值。`,
    mistakes: raw`$D_2$ 绕 $y$ 轴时只算半径为 $a$ 的圆柱，忘记减去抛物线左侧未被区域占据的部分。`,
    answerText: raw`$$V_1=\frac{4\pi}{5}(32-a^5),\qquad V_2=\pi a^4.$$
当 $a=1$ 时体积和最大，最大值为 $129\pi/5$。`,
    solutionMethods: [
      { title: '方法一 · 分别建模后求导', content: raw`圆盘法给出
$$V_1=\pi\int_a^2(2x^2)^2dx=\frac{4\pi}{5}(32-a^5).$$
对 $D_2$ 用水平垫片可得 $V_2=\pi a^4$。于是
$$V'(a)=4\pi a^3(1-a),$$
结合端点趋势知 $a=1$ 为唯一最大点。` },
      { title: '方法二 · 柱壳复核第二体积', content: raw`$D_2$ 用竖直壳：半径 $x$、高度 $2a^2-2x^2$，
$$V_2=2\pi\int_0^a x(2a^2-2x^2)dx=\pi a^4.$$
代回体积和并比较驻点与开区间两端极限，仍得到 $a=1$、$V_{\max}=129\pi/5$。` }
    ]
  }),
  lectureTen({
    id: 'exercise-10-8-cycloid-y-axis-volume', role: 'exercise', page: 'PDF 283、285-286 · 书页 278、280-281 · 习题 10.8',
    fingerprint: 'volume:cycloid-arch-about-y-axis-two-methods',
    title: '习题 10.8 · 摆线一拱绕纵轴的旋转体积',
    statement: raw`摆线一拱
$$x=a(t-\sin t),\qquad y=a(1-\cos t),\qquad 0\le t\le2\pi,$$
与 $x$ 轴围成平面图形。求该图形绕 $y$ 轴旋转一周所得旋转体体积。`,
    tags: ['摆线', '旋转体', '柱壳法'],
    coreMethod: raw`用柱壳法时壳半径为 $x(t)$、壳高为 $y(t)$、厚度为 $dx=x'(t)dt$；也可改用水平垫片处理左右支。`,
    mistakes: raw`把绕 $y$ 轴的体积误写成 $\pi\int y^2dx$，那是绕 $x$ 轴的圆盘公式。`,
    answerText: raw`$$6\pi^3a^3.$$`,
    solutionMethods: [
      { title: '方法一 · 柱壳法', content: raw`$$V=2\pi\int_0^{2\pi}x(t)y(t)x'(t)dt
=2\pi a^3\int_0^{2\pi}(t-\sin t)(1-\cos t)^2dt.$$
利用关于 $\pi$ 的对称配对或分部积分，括号积分为 $3\pi^2$，故 $V=6\pi^3a^3$。` },
      { title: '方法二 · 水平垫片', content: raw`同一高度 $0<y<2a$ 对应左右参数 $t$ 与 $2\pi-t$。外、内半径分别为 $a(2\pi-t+\sin t)$ 与 $a(t-\sin t)$。积分
$$\pi\int_0^{2a}(R^2-r^2)dy$$
并令 $y=a(1-\cos t)$，化简后同样得到 $6\pi^3a^3$。` }
    ]
  }),
  lectureTen({
    id: 'exercise-10-9-absolute-parabola-volume', role: 'exercise', page: 'PDF 283、286 · 书页 278、281 · 习题 10.9',
    fingerprint: 'volume:absolute-parabola-piecewise-about-horizontal-line',
    title: '习题 10.9 · 绝对值抛物线区域绕水平线旋转',
    statement: raw`曲线
$$y=3-|x^2-1|$$
与 $x$ 轴围成的封闭图形绕直线 $y=3$ 旋转一周，求所得旋转体体积。`,
    tags: ['绝对值', '分段曲线', '旋转体'],
    coreMethod: raw`在 $|x|=1$ 处分段，并利用关于 $y$ 轴的对称性；每个截面是外半径 $3$、内半径 $3-y$ 的垫片。`,
    mistakes: raw`只积分 $0\le x\le2$ 后忘记乘左右对称系数，或把内半径误写成曲线高度 $y$。`,
    answerText: raw`$$\frac{448\pi}{15}.$$`,
    solutionMethods: [
      { title: '方法一 · 分段垫片', content: raw`在 $0\le x\le1$，$y=x^2+2$；在 $1\le x\le2$，$y=4-x^2$。两段都有
$$dV=\pi[3^2-(3-y)^2]dx=\pi(8+2x^2-x^4)dx.$$
乘左右对称系数 $2$ 后在 $[0,2]$ 积分，得 $448\pi/15$。` },
      { title: '方法二 · 绝对值统一', content: raw`内半径为 $|x^2-1|$，平方后绝对值消失，因此可直接写
$$V=\pi\int_{-2}^{2}[9-(x^2-1)^2]dx.$$
被积函数为偶函数，化为 $2\pi\int_0^2(8+2x^2-x^4)dx=448\pi/15$。` }
    ]
  })
]
