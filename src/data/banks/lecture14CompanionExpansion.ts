import type { SeedInput } from './types'

const raw = String.raw
const ZY1000_SOURCE = '何耀焜私人整理 · 张宇《1000题》数一解析册 · 第14章逐页核验'

type CompanionSeed = Omit<SeedInput, 'id' | 'kind' | 'tags' | 'methodFingerprint' | 'source' | 'solutionMethods'> & {
  id: string
  tags: string[]
  fingerprint: string
  methodOne: string
  methodTwo: string
}

function companion(input: CompanionSeed): SeedInput {
  const { id, tags, fingerprint, methodOne, methodTwo, ...seed } = input
  return {
    ...seed,
    id: `zy1000-verified-l14-${id}`,
    kind: 'problem',
    source: ZY1000_SOURCE,
    tags: ['高等数学', '第14讲', ...tags, '强化题', 'PDF逐页核验'],
    methodFingerprint: `zy1000-verified:l14:${fingerprint}`,
    solutionMethods: [
      { title: '方法一 · 解析册主线', content: methodOne },
      { title: '方法二 · 独立复核', content: methodTwo }
    ]
  }
}

export const lecture14CompanionExpansionSeeds: SeedInput[] = [
  companion({
    id: 'advanced-4-convolution-parameter', page: '解析 PDF 318-319 · 书页 312-313 · 强化篇第 4 题',
    fingerprint: 'functional-integral:convolution-square-mean-parameter',
    title: '1000题强化篇第 4 题 · 卷积型积分方程确定参数',
    statement: raw`设 $f$ 在 $[0,1]$ 上连续，且
$$\int_0^1f(x)dx=\frac12,$$
$$f(x)=1+a\int_x^1f(y)f(y-x)dy.$$
求参数 $a$。`,
    tags: ['积分方程', '卷积积分'],
    coreMethod: raw`对第二式在 $[0,1]$ 上积分，把三角区域中的卷积积分交换次序并化为 $\frac12(\int_0^1f)^2$。`,
    mistakes: '交换次序后内层变量代换要保留三角域；卷积二重积分只占正方形对应对称区域的一半。',
    answerText: raw`$$a=-4.$$`,
    methodOne: raw`记 $\bar f=\int_0^1f=1/2$。两边积分：
$$\bar f=1+a\int_0^1dx\int_x^1f(y)f(y-x)dydx.$$
交换次序并令 $t=y-x$，三角区域的积分为
$$\frac12\left(\int_0^1f(t)dt\right)^2=\frac12\bar f^2.$$
故 $1/2=1+a/8$，解得 $a=-4$。`,
    methodTwo: raw`记三角卷积量为 $C$，利用被积函数在变量对换后的对称分割可得 $C=\bar f^2/2=1/8$。于是 $1/2=1+aC=1+a/8$，故 $a=-4$。`
  }),
  companion({
    id: 'advanced-7-quarter-disk-transform', page: '解析 PDF 320 · 书页 314 · 强化篇第 7 题',
    fingerprint: 'change-variables:quarter-disk-u-x-minus-y-v-x-plus-y-exponential',
    title: '1000题强化篇第 7 题 · 四分之一圆上的线性换元',
    statement: raw`设
$$D=\{(x,y)\mid x^2+y^2\le1,\ x\ge0,y\ge0\}.$$
计算
$$\iint_De^{(x+y)^2}(x^2-y^2)dxdy.$$`,
    tags: ['二重积分换元', '极坐标'],
    coreMethod: '识别 $x^2-y^2=(x-y)(x+y)$，令 $u=x-y,v=x+y$ 可同时简化指数和代数因子。',
    mistakes: raw`线性换元的 Jacobian 为 $1/2$；新区域是 $u^2+v^2\le2$ 且 $v\ge|u|$。`,
    answerText: raw`$$\frac{(e-1)^2}{8}.$$`,
    methodOne: raw`令 $u=x-y,v=x+y$，则 $dxdy=\frac12dudv$，被积函数为 $uve^{v^2}$。按新区域先对 $u$ 积分，可化为
$$\frac14\int_0^{\sqrt2}e^{v^2}\left(\text{关于 }v\text{ 的边界平方差}\right)dv,$$
计算后得到 $(e-1)^2/8$。`,
    methodTwo: raw`用极坐标：
$$I=\int_0^{\pi/4}\int_0^1e^{r^2(\sin\theta+\cos\theta)^2}r^3(\cos^2\theta-\sin^2\theta)drd\theta.$$
注意角向部分正好是 $(\sin\theta+\cos\theta)^2$ 的导数结构，先对 $\theta$ 积分再对 $r$ 积分，得到同一答案。`
  }),
  companion({
    id: 'advanced-9-ratio-exponential', page: '解析 PDF 321 · 书页 315 · 强化篇第 9 题',
    fingerprint: 'inner-substitution:y-over-x-wedge-between-lines',
    title: '1000题强化篇第 9 题 · 楔形区域内层作比值换元',
    statement: raw`计算
$$I=\int_1^2dx\int_{x/\sqrt3}^{\sqrt3x}y e^{y/x}dy.$$`,
    tags: ['累次积分', '比值换元'],
    coreMethod: '固定 $x$，令 $u=y/x$；内层上下限立即变为常数。',
    mistakes: raw`$y=ux,dy=xdu$，所以 $y\,dy=u x^2du$，不能漏掉 $x^2$。`,
    answerText: raw`$$\frac73(\sqrt3-1)\left(e^{\sqrt3}+\frac1{\sqrt3}e^{1/\sqrt3}\right).$$`,
    methodOne: raw`令 $u=y/x$，则
$$I=\int_1^2x^2dx\int_{1/\sqrt3}^{\sqrt3}u e^u du.$$
内层原函数为 $ue^u-e^u$，代端点并乘 $\int_1^2x^2dx=7/3$，得到答案。`,
    methodTwo: raw`区域也可写成极坐标
$$\frac\pi6\le\theta\le\frac\pi3,\quad \frac1{\cos\theta}\le r\le\frac2{\cos\theta}.$$
令 $u=\tan\theta$，径向积分先给出 $7/3$ 的尺度因子，再对 $u\in[1/\sqrt3,\sqrt3]$ 计算，结果一致。`
  }),
  companion({
    id: 'advanced-10-reverse-improper-looking', page: '解析 PDF 321 · 书页 315 · 强化篇第 10 题',
    fingerprint: 'reverse-order:oriented-inner-limit-tan-y-over-y',
    title: '1000题强化篇第 10 题 · 反向上下限的交换次序',
    statement: raw`计算
$$\int_0^1dx\int_1^x\frac{\tan y}{y}dy.$$`,
    tags: ['交换积分次序', '反向积分'],
    coreMethod: raw`先将 $\int_1^x$ 改成 $-\int_x^1$，区域变为 $0\le x\le y\le1$。`,
    mistakes: raw`反转内层上下限必须提出负号；交换后固定 $y$ 时 $x\in[0,y]$。`,
    answerText: raw`$$\ln(\cos1).$$`,
    methodOne: raw`有
$$I=-\int_0^1dx\int_x^1\frac{\tan y}{y}dy
=-\int_0^1\frac{\tan y}{y}\left(\int_0^ydx\right)dy
=-\int_0^1\tan y\,dy=\ln(\cos1).$$`,
    methodTwo: raw`把积分看成三角区域 $0<x<y<1$ 上函数 $\tan y/y$ 的负积分。按横截面长度 $y$ 直接加权，得到 $-\int_0^1\tan y,dy$。`
  }),
  companion({
    id: 'advanced-13-diamond-radial-ratio', page: '解析 PDF 323 · 书页 317 · 强化篇第 13 题',
    fingerprint: 'polar:diamond-radial-over-l1-norm',
    title: '1000题强化篇第 13 题 · 菱形区域上的径向比值积分',
    statement: raw`设
$$D=\{(x,y)\mid |x|+|y|\le2\}.$$
计算
$$\iint_D\frac{x^2+y^2}{|x|+|y|}dxdy.$$`,
    tags: ['绝对值区域', '极坐标'],
    coreMethod: raw`利用四象限对称性只算第一象限；菱形边界为 $r(\cos\theta+\sin\theta)=2$。`,
    mistakes: '被积函数在原点的可去奇点不影响积分；极坐标后还要乘 Jacobian $r$。',
    answerText: raw`$$\frac{56}{9}.$$`,
    methodOne: raw`取第一象限乘 $4$：
$$I=4\int_0^{\pi/2}\int_0^{2/(\cos\theta+\sin\theta)}
\frac{r}{\cos\theta+\sin\theta}rdrd\theta.$$
径向积分后为
$$\frac{32}{3}\int_0^{\pi/2}\frac{d\theta}{(\cos\theta+\sin\theta)^4}=\frac{56}{9}.$$`,
    methodTwo: raw`在第一象限令 $u=x+y,v=x-y$，区域变成 $0\le u\le2,-u\le v\le u$，且 $x^2+y^2=(u^2+v^2)/2$、$dxdy=dudv/2$。积分变为多项式，直接计算后乘 $4$ 得 $56/9$。`
  }),
  companion({
    id: 'advanced-15-curvilinear-strip', page: '解析 PDF 324 · 书页 318 · 强化篇第 15 题',
    fingerprint: 'order-integration:between-y-x-square-and-y-square-two-minus-x-cube',
    title: '1000题强化篇第 15 题 · 两条代数曲线间的累次积分',
    statement: raw`计算
$$\int_{-1}^{1}dx\int_{x^2}^{\sqrt{2-x^2}}(x+1)y\,dy.$$`,
    tags: ['累次积分', '代数化简'],
    coreMethod: '被积函数与 $y$ 无关，先对 $y$ 积分，再利用区间对称性消去奇函数项。',
    mistakes: '先对 $y$ 积分会出现上下限的平方；利用 $x$ 与 $-x$ 配对可消去系数中的奇函数部分。',
    answerText: raw`$$\frac{22}{15}.$$`,
    methodOne: raw`把 $x$ 与 $-x$ 两条竖截面配对，系数中的 $x$ 项相消，于是原积分化为
$$\int_0^1(2-x^2-x^4)dx=2-\frac13-\frac15=\frac{22}{15}.$$`,
    methodTwo: raw`先对 $y$ 积分：
$$\frac12\int_{-1}^1(x+1)(2-x^2-x^4)dx.$$
括号是偶函数，乘 $x$ 的部分在对称区间为零，因此剩下 $\int_0^1(2-x^2-x^4)dx$。`
  }),
  companion({
    id: 'advanced-18-square-absolute-product', page: '解析 PDF 325 · 书页 319 · 强化篇第 18 题',
    fingerprint: 'absolute-value:square-split-by-hyperbola-xy-one',
    title: '1000题强化篇第 18 题 · 正方形内按双曲线分割绝对值积分',
    statement: raw`设 $D=[0,2]\times[0,2]$，计算
$$\iint_D|xy-1|dxdy.$$`,
    tags: ['绝对值分区', '双曲线边界'],
    coreMethod: '用 $xy=1$ 与 $x=1/2$ 把正方形分成三块，分别去绝对值。',
    mistakes: raw`当 $0<x<1/2$ 时整个竖截面都有 $xy<1$；只有 $x\ge1/2$ 才与双曲线相交。`,
    answerText: raw`$$\frac32+2\ln2.$$`,
    methodOne: raw`分成
$$0\le x\le\frac12,\quad \frac12\le x\le2,\ 0\le y\le1/x,
\quad \frac12\le x\le2,\ 1/x\le y\le2.$$
分别积 $1-xy,1-xy,xy-1$，得
$$\frac32+2\ln2.$$`,
    methodTwo: raw`先算无绝对值积分 $\iint_D(xy-1)dA=0$。因此绝对值积分等于负区贡献绝对值的两倍。负区为 $xy<1$，其面积与 $xy$ 积分都可按 $x=1/2$ 分段，计算更短。`
  }),
  companion({
    id: 'advanced-21-max-sine-square', page: '解析 PDF 326 · 书页 320 · 强化篇第 21 题',
    fingerprint: 'symmetry:square-sine-of-max-x2-y2',
    title: '1000题强化篇第 21 题 · 正方形内最大值函数积分',
    statement: raw`设 $D=[0,\sqrt\pi]\times[0,\sqrt\pi]$，计算
$$\iint_D\sin\bigl(\max\{x^2,y^2\}\bigr)dxdy.$$`,
    tags: ['分区函数', '对称性'],
    coreMethod: '按对角线 $y=x$ 分成全等两块；一块上最大值恒为 $x^2$。',
    mistakes: raw`上限是 $\sqrt\pi$ 而非 $\pi$；对角线面积为零，可忽略。`,
    answerText: raw`$$2.$$`,
    methodOne: raw`利用对称性，
$$I=2\int_0^{\sqrt\pi}dx\int_0^x\sin(x^2)dy
=2\int_0^{\sqrt\pi}x\sin(x^2)dx=2.$$`,
    methodTwo: raw`令 $u=\max\{x,y\}$。水平集外框从边长 $u$ 的正方形增长，面积微元为 $d(u^2)=2u,du$，故
$$I=\int_0^{\sqrt\pi}\sin(u^2)2u,du=2.$$`
  }),
  companion({
    id: 'advanced-24-semidisk-minus-disk', page: '解析 PDF 327-328 · 书页 321-322 · 强化篇第 24 题',
    fingerprint: 'polar:upper-semidisk-excluding-tangent-disk-polynomial',
    title: '1000题强化篇第 24 题 · 半圆挖去相切圆后的积分',
    statement: raw`设
$$D=\{x^2+y^2\le4,\ y\ge0\}\setminus
\{(x-1)^2+y^2<1,\ y\ge0\}.$$
计算
$$\iint_D(xy+y^2)dxdy.$$`,
    tags: ['复合区域', '极坐标'],
    coreMethod: raw`外半圆写成 $0\le r\le2$；挖去圆 $(x-1)^2+y^2<1$ 在极坐标下为 $0\le r<2\cos\theta$。`,
    mistakes: raw`内圆只在 $-\pi/2\le\theta\le\pi/2$ 有径向范围；题目又限制 $y\ge0$。`,
    answerText: raw`$$\frac{15\pi}{8}-\frac23.$$`,
    methodOne: raw`把 $D$ 分为 $\pi/2\le\theta\le\pi$ 的完整径向段与 $0\le\theta\le\pi/2$ 中 $2\cos\theta\le r\le2$ 的部分。代入
$$xy+y^2=r^2(\sin\theta\cos\theta+\sin^2\theta)$$
并乘 $r$ 积分，化简得 $15\pi/8-2/3$。`,
    methodTwo: raw`先算外半圆上的积分，再减内半圆上的积分。外半圆中 $xy$ 因关于 $y$ 轴反对称积分为零，$y^2$ 用轮换矩计算；内圆平移 $x=u+1$ 后分别计算 $uy,y,y^2$，得到同一差值。`
  }),
  companion({
    id: 'advanced-26-diamond-exponential-ratio', page: '解析 PDF 328-329 · 书页 322-323 · 强化篇第 26 题',
    fingerprint: 'absolute-symmetry:diamond-exp-y-over-x-plus-y',
    title: '1000题强化篇第 26 题 · 菱形区域上的指数比值',
    statement: raw`设 $D=\{(x,y)\mid |x|+|y|\le1\}$，计算
$$\iint_D\exp\left(\frac{|y|}{|x|+|y|}\right)dxdy.$$`,
    tags: ['绝对值对称性', '极坐标'],
    coreMethod: '由四象限对称性只算第一象限；角向比值与径向变量无关。',
    mistakes: raw`第一象限菱形边界为 $r=1/(\cos\theta+\sin\theta)$，不是单位圆。`,
    answerText: raw`$$2(e-1).$$`,
    methodOne: raw`取第一象限乘 $4$：
$$I=4\int_0^{\pi/2}\int_0^{1/(\cos\theta+\sin\theta)}
e^{\sin\theta/(\cos\theta+\sin\theta)}rdrd\theta.$$
径向积分后令
$$u=\frac{\sin\theta}{\cos\theta+\sin\theta},$$
其微分正好消去分母平方，得到 $2\int_0^1e^udu=2(e-1)$。`,
    methodTwo: raw`第一象限作线性换元 $u=x+y,v=y$，则 $0\le v\le u\le1$、Jacobian 为 $1$。积分为
$$4\int_0^1du\int_0^ue^{v/u}dv=4\int_0^1u(e-1)du=2(e-1).$$`
  }),
  companion({
    id: 'advanced-28-parameter-domain', page: '解析 PDF 329 · 书页 323 · 强化篇第 28 题',
    fingerprint: 'parameter-double-integral:reverse-order-differentiate-upper-t-square',
    title: '1000题强化篇第 28 题 · 含参曲边域积分求导',
    statement: raw`当 $t>1$ 时，设
$$f(t)=\int_1^{t^2}dx\int_{\sqrt x}^{t}e^{x/y}dy.$$
求 $f'(\pi)$。`,
    tags: ['含参二重积分', '交换积分次序'],
    coreMethod: raw`区域可改写为 $1\le y\le t,1\le x\le y^2$，这样参数只出现在一个外上限。`,
    mistakes: raw`原式的上角区域由 $x\le y^2$ 决定；交换后 $x$ 的上限是 $y^2$。`,
    answerText: raw`$$f'(\pi)=-\pi\left(e^\pi-e^{1/\pi}\right).$$`,
    methodOne: raw`交换次序：
$$f(t)=-\int_1^tdy\int_1^{y^2}e^{x/y}dx
=-\int_1^ty(e^y-e^{1/y})dy.$$
故
$$f'(t)=-t(e^t-e^{1/t}),$$
代 $t=\pi$ 即得。`,
    methodTwo: raw`直接用变域积分的边界速度。上边界 $y=t$ 增加的水平薄条贡献为 $-\int_1^{t^2}e^{x/t}dx=-t(e^t-e^{1/t})$；曲线端点的竖边退化为一点，无额外面积贡献。`
  }),
  companion({
    id: 'advanced-30-absolute-rectangle', page: '解析 PDF 330 · 书页 324 · 强化篇第 30 题',
    fingerprint: 'absolute-value:rectangle-split-y-exp-x-over-x',
    title: '1000题强化篇第 30 题 · 矩形中指数曲线分割绝对值积分',
    statement: raw`设 $D=[0,1]\times[0,2e]$，计算
$$\iint_Dx|y-e^x|dxdy.$$`,
    tags: ['绝对值分区', '指数边界'],
    coreMethod: '零点曲线为 $y=e^x$；按这条曲线把矩形分成上下两部分后分别去绝对值。',
    mistakes: '在 $x=0$ 处需取极限理解边界；去绝对值前必须核对两侧符号。',
    answerText: raw`$$\frac54e^2-2e+\frac14.$$`,
    methodOne: raw`按解析册图示将区域沿分界曲线拆成正负两部分，分别积分 $xy-e^x$ 与 $e^x-xy$。整理为
$$\int_0^1\left(2e^2x-2e^{x+1}+\frac12e^{2x}\right)dx
+\int_0^1\frac12e^{2x}dx,$$
计算得到答案。`,
    methodTwo: raw`先计算无绝对值积分，再加上负区被翻转所增加的两倍绝对贡献。这样只需对分界线一侧积分，可减少一次重复展开，结果仍为 $5e^2/4-2e+1/4$。`
  }),
  companion({
    id: 'advanced-31-piecewise-radius', page: '解析 PDF 330-331 · 书页 324-325 · 强化篇第 31 题',
    fingerprint: 'piecewise:max-radius-one-triangle-y-one-absx',
    title: '1000题强化篇第 31 题 · 三角域内半径与常数的最大值',
    statement: raw`设
$$D=\{(x,y)\mid |x|\le y\le1\},\qquad
f(x,y)=\max\{\sqrt{x^2+y^2},1\}.$$
计算 $\iint_Df(x,y)dxdy$。`,
    tags: ['分段函数', '极坐标'],
    coreMethod: raw`用单位圆把三角域分成 $r<1$ 与 $r\ge1$ 两部分；前者积常数，后者积 $r$。`,
    mistakes: raw`三角域角度为 $\pi/4\le\theta\le3\pi/4$，顶边 $y=1$ 对应 $r=1/\sin\theta$。`,
    answerText: raw`$$\frac{\sqrt2}{3}+\frac12\ln(\sqrt2+1)+\frac\pi{12}.$$`,
    methodOne: raw`分成单位圆内的 $D_3$ 与两侧 $D_1,D_2$。有
$$\iint_Df=\int_{\pi/4}^{3\pi/4}\int_1^{1/\sin\theta}r^2drd\theta+\frac\pi4.$$
化简 $\int\csc^3\theta d\theta$ 后得到
$$\frac{\sqrt2}{3}+\frac12\ln(\sqrt2+1)+\frac\pi{12}.$$`,
    methodTwo: raw`用“积分层”思路：先算整个三角域上的 $r$，再把单位圆内 $r$ 替换为 $1$，即加上 $\iint_{D\cap\{r<1\}}(1-r)dA$。两个积分都只含极坐标单一边界，整理后与主线一致。`
  }),
  companion({
    id: 'advanced-34-symmetric-fixed-point', page: '解析 PDF 333 · 书页 327 · 强化篇第 34 题',
    fingerprint: 'symmetry:unit-disk-fixed-point-integral-parameter',
    title: '1000题强化篇第 34 题 · 圆域轮换对称解积分自洽参数',
    statement: raw`设 $D=\{x^2+y^2\le1\}$，$f(x,y)=e^{x^2+y^2}-a$，且
$$a=\iint_D\frac{(2x^2+1)f(x,y)}{x^2+y^2+1}dxdy.$$
求 $a$。`,
    tags: ['轮换对称性', '积分方程'],
    coreMethod: '交换 $x,y$ 后写出同一个 $a$，两式相加使分子恰好成为分母的两倍。',
    mistakes: '$f$ 只依赖 $x^2+y^2$，所以交换变量后不变；最后 $a$ 还出现在 $f$ 内。',
    answerText: raw`$$a=\frac{(e-1)\pi}{\pi+1}.$$`,
    methodOne: raw`轮换 $x,y$ 后有
$$a=\iint_D\frac{(2y^2+1)f}{x^2+y^2+1}dA.$$
两式相加得 $2a=2\iint_Df$，故
$$a=\iint_D(e^{r^2}-a)dA=\pi(e-1)-a\pi.$$
解得 $a=(e-1)\pi/(\pi+1)$。`,
    methodTwo: raw`在极坐标中先做角积分：$\int_0^{2\pi}(2r^2\cos^2\theta+1)d\theta=2\pi(r^2+1)$，恰好消去分母。于是原自洽方程直接化成 $a=\pi(e-1)-a\pi$。`
  }),
  companion({
    id: 'advanced-35-parabola-lines-transform', page: '解析 PDF 333-334 · 书页 327-328 · 强化篇第 35 题',
    fingerprint: 'change-variables:parabola-y-over-sqrtx-and-lines-x-plus-y',
    title: '1000题强化篇第 35 题 · 抛物线与平行线围域的专门换元',
    statement: raw`区域 $D$ 由
$$y^2=2x,\qquad x+y=4,\qquad x+y=12$$
围成。计算
$$\iint_D\frac{2x+y}{x^{3/2}}dxdy.$$`,
    tags: ['二重积分换元', '曲边区域'],
    coreMethod: raw`令 $\xi=y/\sqrt x,\eta=x+y$，三条边界都变成常数线，且 Jacobian 与被积函数精确抵消。`,
    mistakes: raw`由 $y^2=2x$ 得 $\xi=\pm\sqrt2$；两条直线给出 $4\le\eta\le12$。`,
    answerText: raw`$$32\sqrt2.$$`,
    methodOne: raw`令
$$\xi=\frac y{\sqrt x},\qquad\eta=x+y.$$
新区域为 $-\sqrt2\le\xi\le\sqrt2,4\le\eta\le12$。逆 Jacobian 为
$$\left|\frac{\partial(x,y)}{\partial(\xi,\eta)}\right|=\frac{2x^{3/2}}{2x+y}.$$
因此被积函数乘 Jacobian 恒为 $2$，积分等于 $2\cdot2\sqrt2\cdot8=32\sqrt2$。`,
    methodTwo: raw`先沿每条 $x+y=\eta$ 的截线积分。用 $\xi=y/\sqrt x$ 参数化该截线，线性变化因子与 $(2x+y)/x^{3/2}$ 合并成常数 $2$。随后只剩矩形面积，得到同样结果。`
  }),
  companion({
    id: 'advanced-39-hyperbolic-grid-log', page: '解析 PDF 336-337 · 书页 330-331 · 强化篇第 39 题',
    fingerprint: 'change-variables:xy-and-y-over-x-hyperbolic-grid-log',
    title: '1000题强化篇第 39 题 · 双曲线与射线网格上的对数积分',
    statement: raw`第一象限区域 $D$ 由
$$xy=1,\quad xy=2,\quad y=x,\quad y=4x$$
围成。计算
$$\iint_D\ln(xy)dxdy.$$`,
    tags: ['双曲线区域', '二重积分换元'],
    coreMethod: '令 $u=xy,v=y/x$，四条边界全部化为矩形边界，且 Jacobian 为 $1/(2v)$。',
    mistakes: raw`新变量 $v$ 的范围是 $1\le v\le4$；Jacobian 不能误写成常数。`,
    answerText: raw`$$\ln2\,(2\ln2-1).$$`,
    methodOne: raw`令 $u=xy,v=y/x$，则
$$x=\sqrt{u/v},\quad y=\sqrt{uv},\quad
\left|\frac{\partial(x,y)}{\partial(u,v)}\right|=\frac1{2v}.$$
区域变为 $1\le u\le2,1\le v\le4$，故
$$I=\int_1^2\ln u\,du\int_1^4\frac{dv}{2v}
=(2\ln2-1)\ln2.$$`,
    methodTwo: raw`按 $x$ 分段作常规累次积分也可：交点横坐标为 $1/2,1/\sqrt2,1,\sqrt2$。每段先算 $\int\ln(xy)dy=y\ln(xy)-y$，三段合并后同样得到 $\ln2(2\ln2-1)$。`
  })
]
