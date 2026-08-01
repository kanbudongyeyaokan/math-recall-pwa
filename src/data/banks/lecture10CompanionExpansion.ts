import type { SeedInput } from './types'

const raw = String.raw
const ZY1000_SOURCE = '何耀焜私人整理 · 张宇《1000题》数一解析册 · 第10章逐页核验'

type CompanionSeed = Omit<SeedInput, 'id' | 'kind' | 'tags' | 'methodFingerprint' | 'source'> & {
  id: string
  tags: string[]
  fingerprint: string
}

function companion(input: CompanionSeed): SeedInput {
  return {
    ...input,
    id: `zy1000-verified-l10-${input.id}`,
    kind: 'problem',
    source: ZY1000_SOURCE,
    tags: ['高等数学', '第10讲', '经典例题', 'PDF逐页核验', ...input.tags],
    methodFingerprint: `zy1000-verified:l10:${input.fingerprint}`
  }
}

export const lecture10CompanionExpansionSeeds: SeedInput[] = [
  companion({
    id: 'problem-1-implicit-tangent-triangle', page: '解析 PDF 285 · 书页 279 · 第 1 题',
    fingerprint: 'implicit-curve:tangent-at-axis-point-triangle-area',
    title: '1000题第 1 题 · 隐式曲线切线与坐标轴围成面积',
    statement: raw`曲线
$$e^y+xy+x^3=e$$
经过点 $(0,1)$。求该曲线在此点的切线与两坐标轴围成三角形的面积。`,
    tags: ['隐函数求导', '切线', '平面面积'],
    coreMethod: raw`对隐式方程两端关于 $x$ 求导，在 $(0,1)$ 处求出斜率，再由切线的两轴截距计算三角形面积。`,
    mistakes: raw`求导 $e^y$ 时漏掉 $y'$，或把 $xy$ 的导数只写成 $xy'$ 而漏掉 $y$。`,
    answerText: raw`$$\frac e2.$$`,
    solutionMethods: [
      { title: '方法一 · 隐函数求导', content: raw`求导得
$$e^yy'+y+xy'+3x^2=0.$$
代入 $(0,1)$，有 $ey'(0)+1=0$，故 $y'(0)=-1/e$。切线为 $y=1-x/e$，两轴截距为 $1,e$，面积为 $e/2$。` },
      { title: '方法二 · 一阶增量展开', content: raw`在 $(0,1)$ 附近令 $x=h$、$y=1+k$。保留一阶项：
$$e(1+k)+h+o(\sqrt{h^2+k^2})=e,$$
故 $ek+h=0$，切向关系为 $k=-h/e$。由此得到同一切线与面积。` }
    ]
  }),
  companion({
    id: 'problem-3-cardioid-area-parameter', page: '解析 PDF 285 · 书页 279 · 第 3 题',
    fingerprint: 'polar-area:cardioid-given-total-area-recover-scale',
    title: '1000题第 3 题 · 由心形线面积反求参数',
    statement: raw`心形线
$$r=a(1+\cos\theta),\qquad a>0$$
所围图形的面积为 $6\pi$。求 $a$。`,
    tags: ['极坐标', '心形线', '参数反求'],
    coreMethod: raw`利用关于极轴的对称性，只积 $0\le\theta\le\pi$ 再恢复全图，建立面积关于 $a^2$ 的方程。`,
    mistakes: raw`极坐标面积公式含系数 $1/2$ 和 $r^2$；利用上下对称后两者恰好抵消，不能重复乘倍数。`,
    answerText: raw`$$a=2.$$`,
    solutionMethods: [
      { title: '方法一 · 半图面积', content: raw`由对称性，
$$S=2\cdot\frac12\int_0^\pi a^2(1+\cos\theta)^2d\theta
=\frac32\pi a^2.$$
令其等于 $6\pi$，得 $a^2=4$；结合 $a>0$，有 $a=2$。` },
      { title: '方法二 · 整周期积分', content: raw`直接写
$$S=\frac12a^2\int_0^{2\pi}(1+2\cos\theta+\cos^2\theta)d\theta
=\frac12a^2(2\pi+\pi)=\frac32\pi a^2.$$
再解参数方程，结果相同。` }
    ]
  }),
  companion({
    id: 'problem-4-ode-region-area-volume', page: '解析 PDF 285-286 · 书页 279-280 · 第 4 题',
    fingerprint: 'ode-geometry:resonant-second-order-initial-limit-area-y-axis-volume',
    title: '1000题第 4 题 · 微分方程确定曲线后的面积与体积',
    statement: raw`函数 $y=y(x)$ 满足
$$y''+3y'+2y=e^{-x},$$
且在 $x=0$ 处连续，并满足
$$\lim_{x\to0}\frac{y(x)}x=1.$$
求曲线在 $x\ge0$ 部分与 $x$ 轴围成的面积，以及该区域绕 $y$ 轴旋转一周所得体积。`,
    tags: ['常系数微分方程', '反常积分', '旋转体'],
    coreMethod: raw`先由通解与极限条件确定 $y=xe^{-x}$，再分别计算 $\int ydx$ 与柱壳体积 $2\pi\int xydx$。`,
    mistakes: raw`非齐次项 $e^{-x}$ 与齐次根 $-1$ 共振，特解必须乘 $x$；极限条件同时给出 $y(0)=0$、$y'(0)=1$。`,
    answerText: raw`面积为 $1$，体积为 $4\pi$。`,
    solutionMethods: [
      { title: '方法一 · 通解与反常积分', content: raw`通解为
$$y=C_1e^{-x}+C_2e^{-2x}+xe^{-x}.$$
由 $y(0)=0$、$y'(0)=1$ 得 $C_1=C_2=0$。于是
$$S=\int_0^\infty xe^{-x}dx=1,$$
$$V=2\pi\int_0^\infty x^2e^{-x}dx=4\pi.$$` },
      { title: '方法二 · Gamma 积分复核', content: raw`确定曲线后，使用
$$\int_0^\infty x^ne^{-x}dx=n!.$$
面积对应 $n=1$，所以为 $1$；柱壳积分对应 $2\pi\cdot2!$，所以为 $4\pi$。该复核也确认无穷远端收敛。` }
    ]
  }),
  companion({
    id: 'problem-7-periodic-lobes-total-volume', page: '解析 PDF 287 · 书页 281 · 第 7 题',
    fingerprint: 'volume:periodic-positive-lobes-exponential-geometric-sum',
    title: '1000题第 7 题 · 周期波瓣旋转体的无穷体积和',
    statement: raw`曲线
$$y=e^{-x/2}\sqrt{\sin x}$$
在各区间 $[2k\pi,(2k+1)\pi]$（$k=0,1,2,\ldots$）与 $x$ 轴围成图形。将这些图形分别绕 $x$ 轴旋转一周，求所有旋转体体积之和。`,
    tags: ['旋转体', '周期波瓣', '等比级数'],
    coreMethod: raw`每个波瓣用圆盘法，平移 $2\pi$ 后平方半径多出固定因子 $e^{-2\pi}$，体积列成等比级数。`,
    mistakes: raw`把相邻负半周也纳入实函数定义域；根号要求 $\sin x\ge0$，有效波瓣相隔 $2\pi$。`,
    answerText: raw`$$\frac{\pi}{2(1-e^{-\pi})}.$$`,
    solutionMethods: [
      { title: '方法一 · 逐瓣积分', content: raw`第 $k$ 个体积为
$$V_k=\pi\int_{2k\pi}^{(2k+1)\pi}e^{-x}\sin xdx
=\frac\pi2(1+e^{-\pi})e^{-2k\pi}.$$
求和并用 $1-e^{-2\pi}=(1-e^{-\pi})(1+e^{-\pi})$，得到答案。` },
      { title: '方法二 · 首项与缩放比', content: raw`首瓣体积 $V_0=\pi(1+e^{-\pi})/2$。每向右平移 $2\pi$，$y^2$ 乘 $e^{-2\pi}$，故
$$V=\frac{V_0}{1-e^{-2\pi}}=\frac{\pi}{2(1-e^{-\pi})}.$$` }
    ]
  }),
  companion({
    id: 'problem-8-parabola-volume-maximum', page: '解析 PDF 287-288 · 书页 281-282 · 第 8 题',
    fingerprint: 'optimization:line-parabola-region-x-axis-volume-scale-parameter',
    title: '1000题第 8 题 · 直线与抛物线围成旋转体的最大体积',
    statement: raw`曲线 $y=ax^2$（$x\ge0$，$a>0$）与 $y=1-x^2$ 交于点 $A$。直线 $OA$ 与曲线 $y=ax^2$ 围成的区域绕 $x$ 轴旋转一周，求体积最大时的 $a$。`,
    tags: ['旋转体', '参数最值', '抛物线'],
    coreMethod: raw`先由交点求直线 $OA$，圆盘面积是“直线半径平方减抛物线半径平方”，积分后再对参数求极值。`,
    mistakes: raw`交点横坐标是 $1/\sqrt{1+a}$；若误写成 $1/(1+a)$，后续体积的幂次都会错误。`,
    answerText: raw`当 $a=4$ 时体积最大。`,
    solutionMethods: [
      { title: '方法一 · 体积函数求导', content: raw`交点
$$A\left(\frac1{\sqrt{1+a}},\frac a{1+a}\right),$$
故 $OA$ 为 $y=ax/\sqrt{1+a}$。体积为
$$V(a)=\pi\int_0^{1/\sqrt{1+a}}\left(\frac{a^2x^2}{1+a}-a^2x^4\right)dx
=\frac{2\pi a^2}{15(1+a)^{5/2}}.$$
求导得符号由 $4-a$ 决定，最大点为 $a=4$。` },
      { title: '方法二 · 对数导数', content: raw`忽略正常数，最大化 $a^2(1+a)^{-5/2}$。其对数导数为
$$\frac2a-\frac5{2(1+a)}=\frac{4-a}{2a(1+a)}.$$
它在 $a=4$ 前正、后负，因此该点是唯一全局最大点。` }
    ]
  }),
  companion({
    id: 'problem-9-absolute-integral-two-volumes', page: '解析 PDF 288 · 书页 282 · 第 9 题',
    fingerprint: 'volume:differential-quotient-absolute-integral-two-branches',
    title: '1000题第 9 题 · 含绝对值积分条件的两支旋转体体积',
    statement: raw`设 $f$ 在 $[0,1]$ 上连续、在 $(0,1]$ 上可导，并满足
$$\left[\frac{f(x)}x\right]'=1,\qquad \int_0^1|f(x)|dx=2.$$
求曲线 $y=f(x)$、直线 $x=0$、$x=1$ 与 $x$ 轴所围区域绕 $x$ 轴旋转一周时所有可能的体积。`,
    tags: ['绝对值积分', '微分方程', '旋转体'],
    coreMethod: raw`先积分得到 $f=x^2+Cx$，再按零点位置对 $\int|f|$ 分情况，最后把每个合法参数代入 $\pi\int f^2dx$。`,
    mistakes: raw`绝对值条件可能产生多支参数，不能默认 $f\ge0$；但 $-1<C<0$ 时函数在区间内部变号，必须分段核算。`,
    answerText: raw`共有两种可能：
$$V=\frac{752\pi}{135}\quad\text{或}\quad V=\frac{692\pi}{135}.$$`,
    solutionMethods: [
      { title: '方法一 · 参数分支讨论', content: raw`由条件得 $f=x^2+Cx$。若 $C\ge0$，绝对值可去掉并解得 $C=10/3$；若 $C\le-1$，有 $f\le0$ 并解得 $C=-14/3$；中间分支不满足积分值。分别计算
$$V=\pi\int_0^1(x^2+Cx)^2dx$$
即得两个答案。` },
      { title: '方法二 · 代数复核体积', content: raw`一般地
$$\pi\int_0^1(x^2+Cx)^2dx=\pi\left(\frac15+\frac C2+\frac{C^2}{3}\right).$$
代入 $C=10/3$ 与 $C=-14/3$，分别化为 $752\pi/135$ 与 $692\pi/135$，并且体积均为正。` }
    ]
  }),
  companion({
    id: 'problem-10-exponential-strip-area-sum', page: '解析 PDF 288 · 书页 282 · 第 10 题',
    fingerprint: 'plane-area:exponential-unit-strip-rectangle-minus-curve-geometric-sum',
    title: '1000题第 10 题 · 指数曲线单位条带面积总和',
    statement: raw`对每个非负整数 $k$，定义
$$S_k=e^{-2k}-\int_k^{k+1}e^{-2x}dx.$$
求所有单位条带面积之和 $\sum_{k=0}^{\infty}S_k$。`,
    tags: ['平面面积', '指数函数', '等比级数'],
    coreMethod: raw`把每个条带看成高为 $e^{-2k}$ 的单位矩形减去指数曲线下方面积，化成公比 $e^{-2}$ 的等比项。`,
    mistakes: raw`无限求和前应先化简单项；分别对两个无穷和操作容易漏掉共同的公比或系数 $1/2$。`,
    answerText: raw`$$\frac{e^2+1}{2(e^2-1)}.$$`,
    solutionMethods: [
      { title: '方法一 · 单项化简后求和', content: raw`$$S_k=e^{-2k}+\frac12e^{-2(k+1)}-\frac12e^{-2k}
=\left(\frac12+\frac1{2e^2}\right)e^{-2k}.$$
因此
$$\sum_{k=0}^{\infty}S_k=\left(\frac12+\frac1{2e^2}\right)\frac1{1-e^{-2}}
=\frac{e^2+1}{2(e^2-1)}.$$` },
      { title: '方法二 · 两个级数分别求和', content: raw`写成
$$\sum_{k=0}^\infty e^{-2k}-\int_0^\infty e^{-2x}dx.
$$
第一项为 $1/(1-e^{-2})$，第二项为 $1/2$。相减并通分，同样得到 $(e^2+1)/[2(e^2-1)]$。` }
    ]
  }),
  companion({
    id: 'problem-12-integral-equation-average', page: '解析 PDF 289 · 书页 283 · 第 12 题',
    fingerprint: 'average-value:nonlinear-convolution-integral-equation-antiderivative-square',
    title: '1000题第 12 题 · 非线性积分方程决定函数平均值',
    statement: raw`设 $f$ 在 $[0,\pi]$ 上连续且非负，并对 $0\le x\le\sqrt{\pi}$ 满足
$$\int_0^x t f(x^2)f(x^2-t^2)dt=\sin^2(x^2).$$
求 $f$ 在 $[0,\pi]$ 上的平均值。`,
    tags: ['积分方程', '函数平均值', '变上限积分'],
    coreMethod: raw`对内层令 $u=x^2-t^2$，再记 $F(v)=\int_0^vf(u)du$，原方程化为 $F(v)F'(v)=2\sin^2v$。`,
    mistakes: raw`换元时 $du=-2t\,dt$ 会交换上下限；由 $F(\pi)^2=2\pi$ 开方时还需使用 $f\ge0$ 确定正号。`,
    answerText: raw`$$\sqrt{\frac2\pi}.$$`,
    solutionMethods: [
      { title: '方法一 · 原函数平方', content: raw`令 $u=x^2-t^2$，原式成为
$$\frac12f(x^2)\int_0^{x^2}f(u)du=\sin^2(x^2).$$
置 $v=x^2$、$F(v)=\int_0^vf$，得 $F(v)F'(v)=2\sin^2v$。在 $[0,\pi]$ 积分：
$$\frac12F(\pi)^2=2\int_0^\pi\sin^2v,dv=\pi.$$
故 $F(\pi)=\sqrt{2\pi}$，除以 $\pi$ 即得平均值。` },
      { title: '方法二 · 直接求平方导数', content: raw`由 $F'F=2\sin^2v$，有
$$[F(v)^2]'=4\sin^2v=2-2\cos2v.$$
结合 $F(0)=0$，可得 $F(v)^2=2v-\sin2v$。代入 $v=\pi$ 并取非负根，仍得 $F(\pi)=\sqrt{2\pi}$。` }
    ]
  }),
  companion({
    id: 'problem-13-piecewise-antiderivative-average', page: '解析 PDF 290 · 书页 284 · 第 13 题',
    fingerprint: 'average-value:derivative-with-interior-singularity-piecewise-newton-leibniz',
    title: '1000题第 13 题 · 内点间断原函数导数的平均值',
    statement: raw`当 $x\ne0$ 时，设
$$f(x)=\left(\frac1{1+e^{1/x}}\right)'.$$
把 $x=0$ 视为反常积分的分点，求 $f$ 在 $[-1,1]$ 上的平均值。`,
    tags: ['函数平均值', '分段积分', '反常积分'],
    coreMethod: raw`原函数在 $x=0$ 两侧的极限不同，必须把积分拆成 $[-1,0)$ 与 $(0,1]$ 两段分别使用 Newton-Leibniz 公式。`,
    mistakes: raw`把跨越 $0$ 的两段直接用同一个端点差相消，会忽略原函数在间断点两侧分别趋于 $1$ 与 $0$。`,
    answerText: raw`$$\frac1{e+1}.$$`,
    solutionMethods: [
      { title: '方法一 · 两侧分别代端点', content: raw`记 $F(x)=1/(1+e^{1/x})$。则
$$\bar f=\frac12\left([F]_{-1}^{0^-}+[F]_{0^+}^{1}\right).$$
利用 $F(0^-)=1$、$F(0^+)=0$、$F(-1)=e/(e+1)$、$F(1)=1/(e+1)$，得到平均值 $1/(e+1)$。` },
      { title: '方法二 · 对称配对', content: raw`对 $x\ne0$ 有 $F(-x)=1-F(x)$，求导得 $f(-x)=f(x)$。故
$$\bar f=\int_0^1f(x)dx=F(1)-F(0^+)=\frac1{e+1}.$$` }
    ]
  }),
  companion({
    id: 'problem-14-variable-upper-average', page: '解析 PDF 290 · 书页 284 · 第 14 题',
    fingerprint: 'average-value:variable-upper-sine-kernel-recover-lower-limit-fubini',
    title: '1000题第 14 题 · 变上限积分的平均值与换序',
    statement: raw`设 $a\in[0,1]$，
$$f(x)=\int_a^x\frac{\sin\pi t}{t}dt,$$
且 $f(1)=0$。求 $f$ 在 $[0,1]$ 上的平均值。`,
    tags: ['函数平均值', '变上限积分', '交换积分次序'],
    coreMethod: raw`先利用 $(0,1)$ 内核函数严格为正确定 $a=1$，再将二重积分区域换序。`,
    mistakes: raw`内核在 $t=0$ 有可去奇点但极限有限；更关键的是 $f(1)=0$ 与正性共同迫使上下限相同。`,
    answerText: raw`$$-\frac2\pi.$$`,
    solutionMethods: [
      { title: '方法一 · 确定参数后换序', content: raw`因 $\sin(\pi t)/t>0$（$0<t<1$），$f(1)=0$ 只能有 $a=1$。于是
$$\int_0^1f(x)dx=\int_0^1dx\int_1^x\frac{\sin\pi t}{t}dt
=-\int_0^1dt\int_0^t\frac{\sin\pi t}{t}dx
=-\int_0^1\sin\pi tdt=-\frac2\pi.$$` },
      { title: '方法二 · 分部积分', content: raw`由 $a=1$，$f'(x)=\sin(\pi x)/x$ 且 $xf(x)|_0^1=0$。分部积分得
$$\int_0^1f(x)dx=[xf(x)]_0^1-\int_0^1xf'(x)dx
=-\int_0^1\sin(\pi x)dx=-\frac2\pi.$$` }
    ]
  }),
  companion({
    id: 'problem-17-triangular-region-average', page: '解析 PDF 291 · 书页 285 · 第 17 题',
    fingerprint: 'average-value:nested-integral-triangular-region-singularity-cancellation',
    title: '1000题第 17 题 · 三角积分区域换序求平均值',
    statement: raw`设
$$f(x)=\int_0^x\frac{\cos t}{2t-3\pi}dt,\qquad 0\le x\le\frac{3\pi}{2},$$
其中端点处按连续延拓理解。求 $f$ 在该区间上的平均值。`,
    tags: ['函数平均值', '交换积分次序', '可去奇点'],
    coreMethod: raw`平均值形成区域 $0\le t\le x\le3\pi/2$ 的二重积分；换序后长度因子恰好消去分母。`,
    mistakes: raw`看到 $2t-3\pi=0$ 就直接判发散；同时 $\cos(3\pi/2)=0$，商有有限极限。`,
    answerText: raw`$$\frac1{3\pi}.$$`,
    solutionMethods: [
      { title: '方法一 · 三角区域换序', content: raw`平均值为
$$\bar f=\frac2{3\pi}\int_0^{3\pi/2}dx\int_0^x\frac{\cos t}{2t-3\pi}dt.$$
换序后 $x$ 从 $t$ 到 $3\pi/2$，于是
$$\bar f=\frac2{3\pi}\int_0^{3\pi/2}\frac{(3\pi/2-t)\cos t}{2t-3\pi}dt
=-\frac1{3\pi}\int_0^{3\pi/2}\cos tdt=\frac1{3\pi}.$$` },
      { title: '方法二 · 分部积分', content: raw`设 $b=3\pi/2$。由 $f'(x)=\cos x/(2x-3\pi)$，且 $(b-x)f'(x)=-\cos x/2$。对 $\int_0^bf(x)dx$ 分部积分并把权重取为 $b-x$，边界项消失，直接得到积分值 $1/2$；再除以 $b$ 得 $1/(3\pi)$。` }
    ]
  }),
  companion({
    id: 'problem-18-odd-derivative-enclosed-area', page: '解析 PDF 291 · 书页 285 · 第 18 题',
    fingerprint: 'plane-area:odd-derivative-even-antiderivative-two-zeros',
    title: '1000题第 18 题 · 奇函数导数生成的对称封闭面积',
    statement: raw`函数 $f$ 满足
$$f'(x)=x|x|,\qquad f(-1)=f(1)=0.$$
求曲线 $y=f(x)$ 与 $x$ 轴围成的封闭图形面积。`,
    tags: ['平面面积', '奇偶性', '分段积分'],
    coreMethod: raw`$f'$ 为奇函数，因此满足端点条件的 $f$ 为偶函数；只需求负半轴或正半轴的一半面积再乘 $2$。`,
    mistakes: raw`定积分面积要取绝对值；在 $(-1,1)$ 内 $f(x)<0$，直接积分会得到负数。`,
    answerText: raw`$$\frac12.$$`,
    solutionMethods: [
      { title: '方法一 · 分段恢复函数', content: raw`当 $-1\le x\le0$ 时，$f'(x)=-x^2$，故
$$f(x)=\int_{-1}^x(-t^2)dt=-\frac{1+x^3}{3}.$$
由偶对称，
$$S=2\left|\int_{-1}^0f(x)dx\right|=\frac12.$$` },
      { title: '方法二 · 正半轴计算', content: raw`对 $0\le x\le1$，由 $f(1)=0$ 得
$$f(x)=-\int_x^1t^2dt=\frac{x^3-1}{3}.$$
因此 $S=2\int_0^1(1-x^3)/3\,dx=1/2$，并可直接看出只有 $x=\pm1$ 两个零点。` }
    ]
  }),
  companion({
    id: 'problem-19-coupled-ode-rotation-volume', page: '解析 PDF 291-292 · 书页 285-286 · 第 19 题',
    fingerprint: 'ode-geometry:two-first-order-equations-implicit-curve-offset-axis-volume',
    title: '1000题第 19 题 · 两个微分方程生成曲线并求旋转体积',
    statement: raw`函数 $f,g$ 分别满足
$$f'(x)=2\sqrt{f(x)},\qquad f(0)=1,$$
$$g'(x)=\frac{g(x)}{x-2}+\frac{x-2}{x},\qquad g(1)=0.$$
曲线由 $f(x)+g(y)=0$（$1\le y<2$）确定。求该曲线与直线 $x=-1$ 围成区域绕 $x=-1$ 旋转一周的体积。`,
    tags: ['微分方程', '隐式曲线', '旋转体'],
    coreMethod: raw`分别解出 $f(x)=(x+1)^2$、$g(y)=(y-2)\ln y$，再按 $y$ 作垫片，半径平方可直接由隐式关系替换。`,
    mistakes: raw`第二个方程是一阶线性方程；积分因子处理后还要用 $g(1)=0$。旋转半径是 $x+1$，不是 $x$。`,
    answerText: raw`$$\left(2\ln2-\frac54\right)\pi.$$`,
    solutionMethods: [
      { title: '方法一 · 解方程后水平垫片', content: raw`由第一式得 $f(x)=(x+1)^2$。第二式解得 $g(y)=(y-2)\ln y$。因此曲线满足
$$ (x+1)^2=(2-y)\ln y.$$
绕 $x=-1$ 的截面半径平方正好是右端，故
$$V=\pi\int_1^2(2-y)\ln y\,dy
=\left(2\ln2-\frac54\right)\pi.$$` },
      { title: '方法二 · 分部积分复核', content: raw`将体积积分拆为
$$2\int_1^2\ln y\,dy-\int_1^2y\ln y\,dy.$$
前者为 $4\ln2-2$，后者由分部积分得 $2\ln2-3/4$，两者相减为 $2\ln2-5/4$。` }
    ]
  }),
  companion({
    id: 'problem-20-tangent-cone-maximum', page: '解析 PDF 292 · 书页 286 · 第 20 题',
    fingerprint: 'optimization:implicit-root-curve-tangent-intercepts-cone-volume',
    title: '1000题第 20 题 · 根式曲线切线生成圆锥的最大体积',
    statement: raw`在曲线
$$\sqrt x+\sqrt y=1$$
上任取第一象限内一点作切线。该切线与两坐标轴围成三角形，将三角形绕 $y$ 轴旋转一周得到圆锥。求圆锥体积的最大值。`,
    tags: ['隐函数求导', '圆锥体积', '最值'],
    coreMethod: raw`以切点横坐标 $a$ 参数化切线，先求两轴截距，再用圆锥公式把体积化成 $a$ 的函数。`,
    mistakes: raw`切线的横截距是 $\sqrt a$、纵截距是 $1-\sqrt a$，并非切点坐标 $a$ 与 $(1-\sqrt a)^2$。`,
    answerText: raw`最大体积为
$$\frac{4\pi}{81},$$
在切点横坐标 $a=4/9$ 时取得。`,
    solutionMethods: [
      { title: '方法一 · 截距与圆锥公式', content: raw`切点为 $(a,(1-\sqrt a)^2)$，切线两轴截距为 $\sqrt a$ 与 $1-\sqrt a$。故
$$V(a)=\frac\pi3a(1-\sqrt a).$$
求导得 $V'(a)=\frac\pi3(1-3\sqrt a/2)$，驻点 $a=4/9$ 为最大点，代入得 $4\pi/81$。` },
      { title: '方法二 · 单变量代换', content: raw`令 $u=\sqrt a\in(0,1)$，则
$$V=\frac\pi3u^2(1-u).$$
由 $[u^2(1-u)]'=u(2-3u)$，最大点为 $u=2/3$，对应 $a=4/9$，体积为 $4\pi/81$。` }
    ]
  }),
  companion({
    id: 'problem-21-implicit-parametric-arc-maximum-x', page: '解析 PDF 293 · 书页 287 · 第 21 题',
    fingerprint: 'arc-length:differential-relation-perfect-square-and-maximum-abscissa',
    title: '1000题第 21 题 · 微分关系曲线的弧长与最大横坐标',
    statement: raw`曲线满足微分关系
$$4y^3dx=(4-y^6)dy,\qquad -2\le y\le-1,$$
并经过点 $(9/16,-1)$。求该弧段长度及其横坐标最大值。`,
    tags: ['弧长', '微分关系', '函数最值'],
    coreMethod: raw`以 $y$ 为参数求 $dx/dy=1/y^3-y^3/4$，弧长根式可配成 $-(1/y^3+y^3/4)$；积分恢复 $x(y)$ 后再求最大值。`,
    mistakes: raw`区间内 $y<0$，完全平方开根后的符号要取正值；不能直接去掉外层负号。`,
    answerText: raw`弧长为
$$\frac{21}{16},$$
横坐标最大值为
$$-\frac{3}{4^{4/3}}.$$`,
    solutionMethods: [
      { title: '方法一 · 以纵坐标参数化', content: raw`$$\frac{dx}{dy}=\frac1{y^3}-\frac14y^3,$$
且
$$\sqrt{1+(dx/dy)^2}=-\left(\frac1{y^3}+\frac14y^3\right)$$
在给定区间为正。积分 $y=-2$ 到 $-1$ 得弧长 $21/16$。再积分得
$$x(y)=-\frac1{2y^2}-\frac1{16}y^4.$$
令 $dx/dy=0$，得 $y=-\sqrt[6]4$，代回得到最大横坐标。` },
      { title: '方法二 · 平方恒等式复核', content: raw`设 $p=1/y^3-y^3/4$，则
$$1+p^2=\left(\frac1{y^3}+\frac14y^3\right)^2.$$
这一步解释了弧长根式为何可积。对 $x(y)$ 求二阶导数或比较 $dx/dy$ 在驻点两侧的正负，可确认该驻点确为横坐标最大点。` }
    ]
  }),
  companion({
    id: 'problem-23-scaled-integral-curve-arc', page: '解析 PDF 294 · 书页 288 · 第 23 题',
    fingerprint: 'arc-length:ode-generated-integral-family-perfect-trig-square',
    title: '1000题第 23 题 · 微分方程生成积分曲线族的弧长',
    statement: raw`函数 $y=y(x)$ 非负并满足
$$2yy'=\cos x,\qquad y(0)=0.$$
对正整数 $n$，定义
$$f_n(x)=n\int_0^{x/n}y(t)dt.$$
求曲线 $Y=f_n(x)$ 在 $0\le x\le n\pi$ 上的弧长。`,
    tags: ['微分方程', '变上限积分', '弧长'],
    coreMethod: raw`先解得 $y=\sqrt{\sin x}$，再由链式法则求 $f_n'(x)=\sqrt{\sin(x/n)}$，根式可用半角公式配成平方。`,
    mistakes: raw`求 $f_n'$ 时外面的 $n$ 与上限导数 $1/n$ 正好抵消；漏掉其中一个会使弧长多出错误倍数。`,
    answerText: raw`$$4n.$$`,
    solutionMethods: [
      { title: '方法一 · 解方程后配平方', content: raw`由 $2y\,dy=\cos x\,dx$ 与初值、非负性，得 $y=\sqrt{\sin x}$。于是
$$f_n'(x)=\sqrt{\sin(x/n)}.$$
弧长为
$$s_n=\int_0^{n\pi}\sqrt{1+\sin(x/n)}dx
=\int_0^{n\pi}\left(\sin\frac{x}{2n}+\cos\frac{x}{2n}\right)dx=4n.$$` },
      { title: '方法二 · 尺度换元', content: raw`令 $u=x/(2n)$，弧长直接化为
$$2n\int_0^{\pi/2}\sqrt{1+\sin2u}\,du.$$
在该区间 $\sqrt{1+\sin2u}=\sin u+\cos u$，积分值为 $2$，故结果为 $4n$。` }
    ]
  }),
  companion({
    id: 'problem-24-centroid-lower-bound', page: '解析 PDF 294-295 · 书页 288-289 · 第 24 题',
    fingerprint: 'centroid:strictly-convex-graph-horizontal-coordinate-lower-bound',
    title: '1000题第 24 题 · 严格凸曲边图形的形心位置估计',
    statement: raw`设 $f$ 在 $[0,a]$ 上二阶可导，满足
$$f(0)=0,\qquad f(x)>0\ (0<x\le a),\qquad f''(x)>0.$$
证明曲线 $y=f(x)$、$x$ 轴及直线 $x=a$ 所围图形的形心横坐标满足
$$\bar x>\frac{2a}{3}.$$`,
    tags: ['形心', '凸函数', '积分不等式'],
    coreMethod: raw`把待证比值改写为 $\int_0^a x f(x)dx-(2a/3)\int_0^a f(x)dx>0$，再构造变上限函数并研究单调性。`,
    mistakes: raw`仅凭图像直观声称形心偏右不构成证明；严格不等号需要使用 $f''>0$ 带来的导数严格递增。`,
    answerText: raw`$$\bar x>\frac{2a}{3}.$$`,
    solutionMethods: [
      { title: '方法一 · 构造辅助函数', content: raw`令
$$F(x)=\int_0^xtf(t)dt-\frac{2x}{3}\int_0^xf(t)dt.$$
有 $F(0)=F'(0)=0$，且
$$F''(x)=\frac13[xf'(x)-f(x)].$$
由中值定理 $f(x)=xf'(\xi)$（$0<\xi<x$）及 $f'$ 严格递增，得 $F''(x)>0$，继而 $F(a)>0$。除以正面积 $\int_0^af$ 即得结论。` },
      { title: '方法二 · 凸性比例比较', content: raw`严格凸且 $f(0)=0$ 意味着 $f(x)/x$ 在 $(0,a]$ 严格递增。写 $f(x)=xg(x)$，其中 $g$ 严格递增。Chebyshev 型配对说明以权重 $xg(x)$ 计算的 $x$ 平均值严格大于只以 $x$ 为权重的平均值
$$\frac{\int_0^ax^2dx}{\int_0^axdx}=\frac{2a}{3}.$$` }
    ]
  }),
  companion({
    id: 'problem-25-cycloid-x-axis-volume-surface', page: '解析 PDF 295 · 书页 289 · 第 25 题',
    fingerprint: 'cycloid:arch-x-axis-volume-and-surface-wallis-integrals',
    title: '1000题第 25 题 · 摆线一拱绕横轴的体积与表面积',
    statement: raw`摆线一拱
$$x=a(t-\sin t),\qquad y=a(1-\cos t),\qquad 0\le t\le2\pi$$
与 $x$ 轴围成区域。求该区域绕 $x$ 轴旋转一周所得旋转体的体积及其旋转曲面面积。`,
    tags: ['摆线', '旋转体', '旋转曲面'],
    coreMethod: raw`体积用 $\pi\int y^2dx$，曲面用 $2\pi\int y\,ds$；统一令 $t=2u$ 后化为 Wallis 型正弦幂积分。`,
    mistakes: raw`体积与表面积公式只差一个弧长因子却不能混用；表面积中的 $ds$ 是参数速度模，不是 $dx$。`,
    answerText: raw`体积与表面积分别为
$$V=5\pi^2a^3,\qquad S=\frac{64}{3}\pi a^2.$$`,
    solutionMethods: [
      { title: '方法一 · 参数公式直接计算', content: raw`由 $dx=a(1-\cos t)dt$，
$$V=\pi a^3\int_0^{2\pi}(1-\cos t)^3dt=5\pi^2a^3.$$
又有 $ds=a\sqrt{(1-\cos t)^2+\sin^2t}\,dt$，故
$$S=2\pi\int_0^{2\pi}y\,ds=\frac{64}{3}\pi a^2.$$` },
      { title: '方法二 · 半角与对称性', content: raw`使用 $1-\cos t=2\sin^2(t/2)$，并令 $u=t/2$。体积化为
$$16\pi a^3\int_0^\pi\sin^6u\,du,$$
表面积化为
$$16\pi a^2\int_0^\pi\sin^3u\,du.$$
代入 $\int_0^\pi\sin^6u\,du=5\pi/16$、$\int_0^\pi\sin^3u\,du=4/3$，得到答案。` }
    ]
  })
]
