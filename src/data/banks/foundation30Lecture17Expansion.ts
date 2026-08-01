import type { SeedInput } from './types'

const raw = String.raw
const ZY30_SOURCE = '何耀焜私人整理 · 张宇《基础30讲》高数 · 第17讲逐页核验'

type LectureSeventeenSeed = Omit<SeedInput, 'id' | 'kind' | 'tags' | 'methodFingerprint' | 'source' | 'solutionMethods'> & {
  id: string
  role: 'example' | 'exercise'
  tags: string[]
  fingerprint: string
  methodOne: string
  methodTwo: string
}

function lectureSeventeen(input: LectureSeventeenSeed): SeedInput {
  const { id, role, tags, fingerprint, methodOne, methodTwo, ...seed } = input
  return {
    ...seed,
    id: `zy30-verified-l17-${id}`,
    kind: 'problem',
    source: ZY30_SOURCE,
    tags: ['高等数学', '第17讲', ...tags, role === 'example' ? '经典例题' : '课后习题', 'PDF逐页核验'],
    methodFingerprint: `zy30-verified:l17:${fingerprint}`,
    solutionMethods: [
      { title: '方法一 · 原书主线', content: methodOne },
      { title: '方法二 · 独立复核', content: methodTwo }
    ]
  }
}

export const foundation30Lecture17ExpansionSeeds: SeedInput[] = [
  lectureSeventeen({
    id: 'example-17-1-differentiable-remainder', role: 'example', page: 'PDF 472 · 书页 467 · 例 17.1',
    fingerprint: 'vector:differentiable-graph-normal-dot-position-over-radius',
    title: '例 17.1 · 可微曲面的法向量余项极限',
    statement: raw`设函数 $f(x,y)$ 在点 $(0,0)$ 处可微，且 $f(0,0)=0$。记
$$\boldsymbol n=\left.(f_x,f_y,-1)\right|_{(0,0)},$$
求
$$\lim_{(x,y)\to(0,0)}\frac{\boldsymbol n\cdot(x,y,f(x,y))}{\sqrt{x^2+y^2}}.$$`,
    tags: ['可微线性主部', '向量点积', '极限计算'],
    coreMethod: raw`把点积展开后，分子恰为可微定义中的线性主部减函数增量，即 $o(\rho)$。`,
    mistakes: '偏导存在不足以推出结论；必须使用题设“可微”，并保留法向量第三分量的负号。',
    answerText: '极限为 $0$。',
    methodOne: raw`令 $\rho=\sqrt{x^2+y^2}$。可微给出
$$f(x,y)=f_x(0,0)x+f_y(0,0)y+o(\rho).$$
而
$$\boldsymbol n\cdot(x,y,f)=f_x(0,0)x+f_y(0,0)y-f(x,y)=o(\rho),$$
所以除以 $\rho$ 后极限为 $0$。`,
    methodTwo: raw`曲面 $z=f(x,y)$ 在原点的切平面线性化为
$$z=f_x(0,0)x+f_y(0,0)y.$$
向量 $\boldsymbol n$ 与曲面点位置向量的点积，正是实际曲面相对切平面的法向误差。可微保证该误差相对于水平位移长度 $\rho$ 为高阶小量，故极限为 $0$。`
  }),
  lectureSeventeen({
    id: 'example-17-2-plane-parallel-two-lines', role: 'example', page: 'PDF 476 · 书页 471 · 例 17.2',
    fingerprint: 'plane:through-origin-parallel-two-lines-cross-directions',
    title: '例 17.2 · 过原点且平行于两条直线的平面',
    statement: raw`求过原点且与下列两直线都平行的平面方程：
$$L_1:\begin{cases}x=1,\\y=-1+t,\\z=2+t,
\end{cases}\qquad
L_2:\frac{x+1}{1}=\frac{y+2}{2}=\frac{z-1}{1}.$$`,
    tags: ['平面方程', '叉积', '空间直线'],
    coreMethod: '两直线的方向向量都位于所求平面内，因此它们的叉积可作为平面法向量。',
    mistakes: '不能把任一条直线的方向向量直接当作平面法向量；平面还必须经过原点。',
    answerText: '$$x-y+z=0.$$ ',
    methodOne: raw`两直线的方向向量分别为
$$\boldsymbol \tau_1=(0,1,1),\qquad \boldsymbol \tau_2=(1,2,1).$$
所求平面的法向量可取
$$\boldsymbol n=\boldsymbol \tau_1\times\boldsymbol \tau_2=(-1,1,-1).$$
平面过原点，故方程为 $-x+y-z=0$，等价地写成 $x-y+z=0$。`,
    methodTwo: raw`设平面为 $Ax+By+Cz=0$。平行于两直线要求
$$B+C=0,\qquad A+2B+C=0.$$
解得 $(A,B,C)$ 可取 $(1,-1,1)$，因此仍得 $x-y+z=0$。`
  }),
  lectureSeventeen({
    id: 'example-17-3-line-projection-on-plane', role: 'example', page: 'PDF 476 · 书页 471 · 例 17.3',
    fingerprint: 'projection:line-plane-bundle-perpendicular-projection-plane',
    title: '例 17.3 · 空间直线在平面上的投影',
    statement: raw`直线 $L$ 由
$$\begin{cases}2x-z-3=0,\\y-2z+4=0\end{cases}$$
给出。求 $L$ 在平面 $x+y-z=5$ 上的投影直线方程。`,
    tags: ['投影直线', '平面束', '空间解析几何'],
    coreMethod: '在经过原直线的平面束中，选出与投影平面垂直的平面；它与投影平面的交线就是投影。',
    mistakes: '投影直线必须位于给定平面上，不能只投影方向向量而漏掉直线的位置条件。',
    answerText: raw`$$\begin{cases}2x-y+z-7=0,\\x+y-z=5.\end{cases}$$`,
    methodOne: raw`经过 $L$ 的平面束为
$$2x-z-3+\lambda(y-2z+4)=0,$$
法向量为 $(2,\lambda,-1-2\lambda)$。它与投影平面法向量 $(1,1,-1)$ 垂直，故
$$2+\lambda+1+2\lambda=0,$$
解得 $\lambda=-1$。所得垂直平面为 $2x-y+z-7=0$，再与 $x+y-z=5$ 联立即得投影直线。`,
    methodTwo: raw`原直线方向为
$$\boldsymbol d=(2,0,-1)\times(0,1,-2)=(1,4,2).$$
把 $\boldsymbol d$ 向平面 $x+y-z=5$ 投影，再结合原直线上任一点的正交投影，可得到投影线的一个点和方向。将其化为两平面交式，仍为
$$2x-y+z-7=0,\qquad x+y-z=5.$$`
  }),
  lectureSeventeen({
    id: 'example-17-4-angle-between-lines', role: 'example', page: 'PDF 476-477 · 书页 471-472 · 例 17.4',
    fingerprint: 'angle:line-symmetric-form-versus-two-plane-intersection-cross-product',
    title: '例 17.4 · 对称式直线与两平面交线的夹角',
    statement: raw`设
$$L_1:\frac{x-1}{1}=\frac{y-5}{-2}=\frac{z+8}{1},\qquad
L_2:\begin{cases}x-y=6,\\2y+z=3.\end{cases}$$
则 $L_1$ 与 $L_2$ 的夹角为（ ）。`,
    questionFormat: 'single-choice',
    options: [raw`$\dfrac{\pi}{6}$`, raw`$\dfrac{\pi}{4}$`, raw`$\dfrac{\pi}{3}$`, raw`$\dfrac{\pi}{2}$`],
    correctOptionIds: ['C'],
    tags: ['空间直线夹角', '叉积', '选择题'],
    coreMethod: '从对称式直接读出第一条方向向量；第二条直线的方向向量是两个平面法向量的叉积。',
    mistakes: '直线夹角取锐角或直角，因此点积要取绝对值；不能用两平面的任一法向量代替交线方向。',
    answerText: raw`正确选项为 C，夹角为 $\pi/3$。`,
    methodOne: raw`取
$$\boldsymbol \tau_1=(1,-2,1),\qquad
\boldsymbol \tau_2=(1,-1,0)\times(0,2,1)=(-1,-1,2).$$
于是
$$\cos\theta=\frac{|\boldsymbol \tau_1\cdot\boldsymbol \tau_2|}{|\boldsymbol \tau_1||\boldsymbol \tau_2|}
=\frac{3}{\sqrt6\sqrt6}=\frac12,$$
故 $\theta=\pi/3$。`,
    methodTwo: raw`设 $L_2$ 的方向为 $(a,b,c)$。它同时满足 $a-b=0$ 与 $2b+c=0$，可取 $(1,1,-2)$。与 $(1,-2,1)$ 点积为 $-3$，两者模均为 $\sqrt6$；取锐角余弦的绝对值后仍为 $1/2$。`
  }),
  lectureSeventeen({
    id: 'example-17-5-rotating-line-intersection-projection', role: 'example', page: 'PDF 481-482 · 书页 476-477 · 例 17.5',
    fingerprint: 'surface:line-rotate-z-axis-cone-intersect-parabolic-cylinder-project',
    title: '例 17.5 · 旋转曲面交线的坐标面投影',
    statement: raw`直线 $L$ 过点 $(0,-1,1)$ 与 $(0,0,0)$。$L$ 绕 $z$ 轴旋转一周所得旋转曲面取 $z\ge0$ 的部分，记为 $\Sigma_1$；另有曲面 $\Sigma_2:z^2=2x$。求两曲面交线在 $xOy$ 面上的投影曲线方程。`,
    tags: ['旋转曲面', '投影曲线', '消元'],
    coreMethod: '先由母线的轴向高度与到旋转轴距离相等写出圆锥面，再与第二曲面消去 $z$。',
    mistakes: '旋转后不能保留母线上的条件 $x=0$；投影到 $xOy$ 面是消去 $z$，并附上 $z=0$。',
    answerText: raw`投影曲线为
$$\begin{cases}x^2+y^2=2x,\\z=0.
\end{cases}$$`,
    methodOne: raw`母线可参数化为 $(0,-t,t)$，$t\ge0$，故点到 $z$ 轴的距离等于高度 $z$。旋转面为
$$x^2+y^2=z^2,\qquad z\ge0.$$
与 $z^2=2x$ 联立并消去 $z$，得到 $x^2+y^2=2x$。所以在 $xOy$ 面上的投影还应写 $z=0$。`,
    methodTwo: raw`对交线上任一点，第一曲面给出径向平方 $r^2=x^2+y^2=z^2$，第二曲面给出 $z^2=2x$，故直接有 $r^2=2x$。反过来，投影圆上 $2x\ge0$，可取 $z=\sqrt{2x}$ 恢复交线点，所以消元没有引入多余投影点。`
  }),
  lectureSeventeen({
    id: 'example-17-6-parametric-curve-tangent', role: 'example', page: 'PDF 483 · 书页 478 · 例 17.6',
    fingerprint: 'curve:parametric-integral-trig-exponential-tangent-at-zero',
    title: '例 17.6 · 含变上限积分的空间曲线切线',
    statement: raw`空间曲线
$$\Gamma:\begin{cases}
x=\displaystyle\int_0^t e^u\cos u\,du,\\
y=2\sin t+\cos t,\\
z=1+e^{3t}
\end{cases}$$
在 $t=0$ 处的切线方程为多少？`,
    tags: ['空间曲线切线', '参数方程', '变上限积分'],
    coreMethod: '先把参数值代入得到切点，再分别求导；三维速度向量就是切线方向向量。',
    mistakes: '变上限积分求导后为被积函数在上限处的值；不要漏掉 $z=1+e^{3t}$ 中指数的系数 $3$。',
    answerText: raw`$$\frac{x}{1}=\frac{y-1}{2}=\frac{z-2}{3}.$$`,
    methodOne: raw`当 $t=0$ 时，曲线点为 $(0,1,2)$。由微积分基本定理，
$$x'(0)=e^0\cos0=1,$$
并且 $y'(0)=2\cos0-\sin0=2$、$z'(0)=3e^0=3$。故切线以 $(0,1,2)$ 为一点、以 $(1,2,3)$ 为方向，得到答案。`,
    methodTwo: raw`在 $t=0$ 附近作一阶展开：
$$x=t+o(t),\quad y=1+2t+o(t),\quad z=2+3t+o(t).$$
曲线增量的一阶主部为 $t(1,2,3)$，所以切线方向仍是 $(1,2,3)$。`
  }),
  lectureSeventeen({
    id: 'example-17-7-curve-normal-plane', role: 'example', page: 'PDF 483-484 · 书页 478-479 · 例 17.7',
    fingerprint: 'curve:intersection-graph-y-zero-normal-plane-from-parametric-tangent',
    title: '例 17.7 · 曲面截线在指定点的法平面',
    statement: raw`函数 $z=f(x,y)$ 在点 $(0,0)$ 附近有定义，且 $f_x(0,0)=3$。求曲线
$$\begin{cases}z=f(x,y),\\y=0\end{cases}$$
在点 $(0,0,f(0,0))$ 处的法平面方程。`,
    tags: ['曲线法平面', '参数化', '偏导数'],
    coreMethod: '令 $x=t,y=0,z=f(t,0)$ 参数化截线；曲线切向量就是法平面的法向量。',
    mistakes: '题目求的是曲线的法平面，不是曲面 $z=f(x,y)$ 的切平面；两者的法向量来源不同。',
    answerText: raw`$$x+3z-3f(0,0)=0.$$`,
    methodOne: raw`曲线可写为
$$\boldsymbol r(t)=(t,0,f(t,0)).$$
在 $t=0$ 处
$$\boldsymbol r'(0)=(1,0,f_x(0,0))=(1,0,3).$$
法平面垂直于曲线切线，故以 $(1,0,3)$ 为法向量并过给定点，得到
$$x+3[z-f(0,0)]=0.$$`,
    methodTwo: raw`截线同时位于平面 $y=0$ 与曲面 $F(x,y,z)=f(x,y)-z=0$ 上。两曲面法向量分别为 $(0,1,0)$ 与 $(3,f_y,-1)$，叉积给出与 $(1,0,3)$ 平行的切向量。用该切向量作法平面的法向量，结论相同。`
  }),
  lectureSeventeen({
    id: 'example-17-8-implicit-surface-tangent-plane', role: 'example', page: 'PDF 484 · 书页 479 · 例 17.8',
    fingerprint: 'surface:implicit-z-minus-expz-plus-2xy-tangent-plane-degenerate-z-component',
    title: '例 17.8 · 隐式曲面切平面中的分量消失',
    statement: raw`求曲面
$$z-e^z+2xy=3$$
在点 $(1,2,0)$ 处的切平面方程。`,
    tags: ['隐式曲面', '切平面', '梯度'],
    coreMethod: '移项得到等值面 $F=0$，在给定点计算梯度；该点的 $z$ 分量恰为 $1-e^0=0$。',
    mistakes: '对 $-e^z$ 求导时漏掉负号；梯度第三分量为零不代表整个梯度为零。',
    answerText: raw`$$2x+y-4=0.$$`,
    methodOne: raw`令 $F=z-e^z+2xy-3$，则
$$\nabla F=(2y,2x,1-e^z).$$
在 $(1,2,0)$ 处为 $(4,2,0)$。切平面为
$$4(x-1)+2(y-2)=0,$$
约简得 $2x+y-4=0$。`,
    methodTwo: raw`把曲面作全微分：
$$(1-e^z)dz+2y\,dx+2x\,dy=0.$$
在给定点化为 $4dx+2dy=0$。用 $dx=x-1,dy=y-2$ 还原切平面，仍得到 $2x+y-4=0$。`
  }),
  lectureSeventeen({
    id: 'example-17-9-cylinder-direction', role: 'example', page: 'PDF 484 · 书页 479 · 例 17.9',
    fingerprint: 'surface:arbitrary-function-level-surface-common-tangent-cylinder-direction',
    title: '例 17.9 · 含任意函数曲面的柱面判定',
    statement: raw`设 $f$ 可微，则曲面
$$e^{2x-z}=f(\pi y-\sqrt2z)$$
是（ ）。`,
    questionFormat: 'single-choice',
    options: ['旋转抛物面', '双叶双曲面', '单叶双曲面', '柱面'],
    correctOptionIds: ['D'],
    tags: ['柱面判定', '任意函数', '选择题'],
    coreMethod: '寻找一个与曲面各点法向量恒垂直的固定方向；该方向就是曲面的直母线方向。',
    mistakes: '不能根据指数或根式的外观猜曲面类型；关键是法向量是否恒与某个固定向量垂直。',
    answerText: '正确选项为 D，该曲面是柱面。',
    methodOne: raw`令
$$F=f(\pi y-\sqrt2z)-e^{2x-z}.$$
其法向量为
$$\boldsymbol n=(-2e^{2x-z},\pi f',-\sqrt2f'+e^{2x-z}).$$
取固定向量
$$\boldsymbol \tau=\left(\frac12,\frac{\sqrt2}{\pi},1\right),$$
则 $\boldsymbol n\cdot\boldsymbol \tau=0$ 对任意点恒成立。故曲面沿固定方向 $\boldsymbol \tau$ 延伸，是柱面。`,
    methodTwo: raw`沿直线
$$x=x_0+\frac t2,\qquad y=y_0+\frac{\sqrt2}{\pi}t,\qquad z=z_0+t$$
移动时，$2x-z$ 与 $\pi y-\sqrt2z$ 都保持不变。因此若起点在曲面上，整条直线都在曲面上；所有母线方向固定，故为柱面。`
  }),
  lectureSeventeen({
    id: 'example-17-10-directional-derivative', role: 'example', page: 'PDF 486-487 · 书页 481-482 · 例 17.10',
    fingerprint: 'directional-derivative:normalize-given-vector-dot-gradient-polynomial',
    title: '例 17.10 · 沿非单位向量方向的方向导数',
    statement: raw`函数 $f(x,y,z)=x^2y+z^2$ 在点 $(1,2,0)$ 处沿向量 $\boldsymbol n=(1,2,2)$ 方向的方向导数为（ ）。`,
    questionFormat: 'single-choice', options: ['12', '6', '4', '2'], correctOptionIds: ['D'],
    tags: ['方向导数', '单位方向向量', '选择题'],
    coreMethod: '先将题给方向向量单位化，再与该点梯度作点积。',
    mistakes: '若直接用 $(1,2,2)$ 与梯度点积会得到 $6$；方向导数公式使用的是单位向量。',
    answerText: '正确选项为 D，方向导数为 $2$。',
    methodOne: raw`有
$$\nabla f=(2xy,x^2,2z),\qquad \nabla f(1,2,0)=(4,1,0).$$
而 $|\boldsymbol n|=3$，对应单位向量为 $(1/3,2/3,2/3)$。所以
$$D_{\boldsymbol n}f=(4,1,0)\cdot\left(\frac13,\frac23,\frac23\right)=2.$$`,
    methodTwo: raw`沿单位速度曲线
$$\boldsymbol r(s)=(1,2,0)+s\left(\frac13,\frac23,\frac23\right)$$
代入 $f$ 并对 $s$ 求导。在 $s=0$ 处由链式法则得到 $4/3+2/3=2$，与梯度法一致。`
  }),
  lectureSeventeen({
    id: 'example-17-11-gradient-maximum-parameters', role: 'example', page: 'PDF 487 · 书页 482 · 例 17.11',
    fingerprint: 'gradient:max-direction-and-value-determine-quadratic-parameters',
    title: '例 17.11 · 由最大方向导数反求参数',
    statement: raw`设 $a,b$ 为实数，函数
$$z=2+ax^2+by^2$$
在点 $(3,4)$ 处的方向导数中，沿方向 $\boldsymbol l=-3\boldsymbol i-4\boldsymbol j$ 的方向导数最大，最大值为 $10$。求 $a,b$。`,
    questionFormat: 'single-choice', options: ['$-1,-1$', '$-1,1$', '$1,-1$', '$1,1$'], correctOptionIds: ['A'],
    tags: ['梯度最大方向', '参数反求', '选择题'],
    coreMethod: '最大方向导数方向与梯度同向，最大值等于梯度模；先把给定方向单位化即可直接还原梯度。',
    mistakes: '给定的是方向而非长度为 $5$ 的速度；应先单位化为 $(-3/5,-4/5)$。',
    answerText: '正确选项为 A，$a=-1,b=-1$。',
    methodOne: raw`给定方向的单位向量为 $(-3/5,-4/5)$。最大方向导数为 $10$，所以
$$\nabla z(3,4)=10\left(-\frac35,-\frac45\right)=(-6,-8).$$
另一方面 $\nabla z(3,4)=(6a,8b)$，比较分量得 $a=b=-1$。`,
    methodTwo: raw`由“沿 $\boldsymbol l$ 最大”可设
$$6a=-3k,\qquad 8b=-4k,\qquad k>0.$$
再用 $\sqrt{36a^2+64b^2}=10$，解得 $k=2$，从而 $a=-1,b=-1$。`
  }),
  lectureSeventeen({
    id: 'example-17-12-recover-gradient', role: 'example', page: 'PDF 487 · 书页 482 · 例 17.12',
    fingerprint: 'gradient:recover-two-components-from-two-noncollinear-directional-derivatives',
    title: '例 17.12 · 由两个方向导数恢复梯度模',
    statement: raw`函数 $z=f(x,y)$ 可微。在 $P_0(1,2)$ 处，沿 $P_0P_1$ 方向的方向导数为 $2\sqrt2$，其中 $P_1(2,3)$；沿 $P_0P_2$ 方向的方向导数为 $-3$，其中 $P_2(1,0)$。求 $z$ 在 $P_0$ 处的最大方向导数。`,
    tags: ['方向导数', '梯度恢复', '线性方程组'],
    coreMethod: '两个不共线的单位方向给出关于 $f_x,f_y$ 的二元一次方程组，解出梯度后取模。',
    mistakes: '必须用 $P_0$ 指向 $P_1,P_2$ 的单位向量；把坐标差直接代入会改变方向导数数值。',
    answerText: raw`最大方向导数为 $\sqrt{10}$。`,
    methodOne: raw`两单位方向为
$$\boldsymbol l_1=\left(\frac1{\sqrt2},\frac1{\sqrt2}\right),\qquad
\boldsymbol l_2=(0,-1).$$
设梯度为 $(f_x,f_y)$，则
$$\frac{f_x+f_y}{\sqrt2}=2\sqrt2,\qquad -f_y=-3.$$
解得 $f_x=1,f_y=3$，故最大方向导数为 $|\nabla f|=\sqrt{10}$。`,
    methodTwo: raw`第二个方向立即给出 $f_y=3$。第一个方向与两坐标轴夹角相同，故方向导数是 $(f_x+3)/\sqrt2$；令其等于 $2\sqrt2$ 得 $f_x=1$。最大增长率是梯度模，所以结果为 $\sqrt{1^2+3^2}$。`
  }),
  lectureSeventeen({
    id: 'example-17-13-curl-at-point', role: 'example', page: 'PDF 488 · 书页 483 · 例 17.13',
    fingerprint: 'curl:polynomial-vector-field-determinant-at-point',
    title: '例 17.13 · 三元向量场在指定点的旋度',
    statement: raw`设
$$\boldsymbol F(x,y,z)=xy\boldsymbol i-yz\boldsymbol j+zx\boldsymbol k,$$
求 $\operatorname{rot}\boldsymbol F(1,1,0)$。`,
    tags: ['旋度计算', '向量场', '偏导数'],
    coreMethod: '按 $(R_y-Q_z, P_z-R_x, Q_x-P_y)$ 的分量公式计算，再代入指定点。',
    mistakes: '旋度三个分量的减法次序容易写反；第二分量在行列式展开时自带负号。',
    answerText: raw`$$\operatorname{rot}\boldsymbol F(1,1,0)=\boldsymbol i-\boldsymbol k.$$`,
    methodOne: raw`记 $P=xy,Q=-yz,R=zx$，则
$$\operatorname{rot}\boldsymbol F=(R_y-Q_z,\ P_z-R_x,\ Q_x-P_y)=(y,-z,-x).$$
代入 $(1,1,0)$ 得 $(1,0,-1)=\boldsymbol i-\boldsymbol k$。`,
    methodTwo: raw`用形式行列式
$$\begin{vmatrix}\boldsymbol i&\boldsymbol j&\boldsymbol k\\
\partial_x&\partial_y&\partial_z\\xy&-yz&zx\end{vmatrix}$$
展开得到 $y\boldsymbol i-z\boldsymbol j-x\boldsymbol k$，代点后仍为 $\boldsymbol i-\boldsymbol k$。`
  }),
  lectureSeventeen({
    id: 'exercise-17-1-line-plane-position', role: 'exercise', page: 'PDF 489-490 · 书页 484-485 · 习题 17.1',
    fingerprint: 'exercise:intersection-line-direction-parallel-third-plane-normal-perpendicular',
    title: '习题 17.1 · 两平面交线与第三平面的位置关系',
    statement: raw`直线 $L$ 是两平面
$$x+y-z+1=0,\qquad x-y+3z=0$$
的交线。设平面 $\pi:x-2y-z+3=0$，则直线 $L$（ ）。`,
    questionFormat: 'single-choice', options: [raw`$L\parallel\pi$`, raw`$L$ 在 $\pi$ 上`, raw`$L\perp\pi$`, raw`$L$ 与 $\pi$ 相交但不垂直`], correctOptionIds: ['C'],
    tags: ['线面位置关系', '交线方向', '选择题'],
    coreMethod: '前两平面法向量的叉积给出交线方向；若该方向平行于第三平面的法向量，则直线垂直于平面。',
    mistakes: '“方向向量与法向量平行”对应线面垂直，不是线面平行。',
    answerText: raw`正确选项为 C，$L\perp\pi$。`,
    methodOne: raw`前两平面法向量为 $(1,1,-1)$、$(1,-1,3)$，故
$$\boldsymbol d=(1,1,-1)\times(1,-1,3)=(2,-4,-2)=2(1,-2,-1).$$
它平行于 $\pi$ 的法向量 $(1,-2,-1)$，所以 $L\perp\pi$。`,
    methodTwo: raw`联立前两平面可将 $L$ 化为点向式
$$\frac{x+2}{-1}=\frac{y-1}{2}=\frac z1,$$
方向向量 $(-1,2,1)$ 与 $\pi$ 的法向量反向平行，因此结论仍为垂直。`
  }),
  lectureSeventeen({
    id: 'exercise-17-2-tangents-parallel-plane', role: 'exercise', page: 'PDF 489-490 · 书页 484-485 · 习题 17.2',
    fingerprint: 'exercise:parametric-cubic-curve-tangent-parallel-plane-count-roots-and-location',
    title: '习题 17.2 · 与给定平面平行的曲线切线条数',
    statement: raw`曲线
$$x=t,\qquad y=-t^2,\qquad z=t^3$$
的所有切线中，与平面 $x+2y+z=4$ 平行的切线有（ ）。`,
    questionFormat: 'single-choice', options: ['只有 1 条', '只有 2 条', '至少有 3 条', '不存在'], correctOptionIds: ['B'],
    tags: ['空间曲线切线', '线面平行', '选择题'],
    coreMethod: '切向量与平面法向量点积为零，先解参数；再检查切点不在平面上，以区分平行与直线在平面内。',
    mistakes: '只解出点积为零还不够；若切点在平面上，切线会落在平面内而非严格平行。',
    answerText: '正确选项为 B，共有 2 条。',
    methodOne: raw`在参数 $t_0$ 处的切向量为
$$\boldsymbol \tau=(1,-2t_0,3t_0^2).$$
与平面法向量 $(1,2,1)$ 垂直要求
$$1-4t_0+3t_0^2=0,$$
解得 $t_0=1$ 或 $t_0=1/3$。两切点代入平面左端均不等于 $4$，所以两条切线都与平面严格平行。`,
    methodTwo: raw`令切线参数为
$$\boldsymbol r=\boldsymbol r(t_0)+s\boldsymbol r'(t_0).$$
把它代入平面方程，$s$ 的系数为 $1-4t_0+3t_0^2$。要使整条直线与平面没有交点，该系数须为零且常数项不为 $4$；恰在 $t_0=1,1/3$ 得到两条。`
  }),
  lectureSeventeen({
    id: 'exercise-17-3-parallel-tangent-plane-point', role: 'exercise', page: 'PDF 489-490 · 书页 484-485 · 习题 17.3',
    fingerprint: 'exercise:paraboloid-tangent-plane-parallel-given-plane-recover-point',
    title: '习题 17.3 · 切平面平行条件确定曲面点',
    statement: raw`曲面
$$z=4-x^2-y^2$$
上点 $P$ 处的切平面平行于平面 $2x+2y+z-1=0$，则点 $P$ 为（ ）。`,
    questionFormat: 'single-choice', options: ['$(1,-1,2)$', '$(-1,1,2)$', '$(1,1,2)$', '$(-1,-1,2)$'], correctOptionIds: ['C'],
    tags: ['切平面平行', '曲面点', '选择题'],
    coreMethod: '把曲面写成等值面，令其在未知点的梯度与给定平面法向量平行，再代回曲面。',
    mistakes: '梯度可与给定法向量成任意非零倍数；由于第三分量均为 $1$，本题倍数才被固定为 $1$。',
    answerText: '正确选项为 C，$P=(1,1,2)$。',
    methodOne: raw`令 $F=x^2+y^2+z-4$，则曲面在 $(x_0,y_0,z_0)$ 的法向量为 $(2x_0,2y_0,1)$。它与 $(2,2,1)$ 平行；比较第三分量知比例为 $1$，所以 $x_0=y_0=1$。代回曲面得 $z_0=2$。`,
    methodTwo: raw`显式曲面 $z=f(x,y)$ 的切平面法向量可取 $(-f_x,-f_y,1)=(2x,2y,1)$。要与题给平面平行，两法向量同向，立即得到 $x=y=1$，再由 $z=4-1-1=2$ 复核。`
  }),
  lectureSeventeen({
    id: 'exercise-17-4-equal-vector-norms', role: 'exercise', page: 'PDF 489-490 · 书页 484-485 · 习题 17.4',
    fingerprint: 'exercise:equal-norm-sum-difference-equivalent-orthogonality-solve-coordinate',
    title: '习题 17.4 · 向量和差等模反求坐标',
    statement: raw`设
$$|\boldsymbol a+\boldsymbol b|=|\boldsymbol a-\boldsymbol b|,$$
其中 $\boldsymbol a=(3,-5,8)$、$\boldsymbol b=(-1,1,z)$。求 $z$。`,
    tags: ['向量模', '正交条件', '计算题'],
    coreMethod: raw`两边平方并相减，和差等模等价于 $\boldsymbol a\cdot\boldsymbol b=0$。`,
    mistakes: '开平方后直接逐分量相等是错误的；向量模相等不代表两个向量相等。',
    answerText: '$$z=1.$$ ',
    methodOne: raw`由
$$|\boldsymbol a+\boldsymbol b|^2-|\boldsymbol a-\boldsymbol b|^2=4\boldsymbol a\cdot\boldsymbol b$$
知题设等价于 $\boldsymbol a\cdot\boldsymbol b=0$。于是
$$3(-1)+(-5)(1)+8z=0,$$
解得 $z=1$。`,
    methodTwo: raw`直接计算
$$|\boldsymbol a+\boldsymbol b|^2=20+(8+z)^2,$$
$$|\boldsymbol a-\boldsymbol b|^2=52+(8-z)^2.$$
令二者相等，展开后得到 $32z=32$，故 $z=1$。`
  }),
  lectureSeventeen({
    id: 'exercise-17-5-line-projection', role: 'exercise', page: 'PDF 489-491 · 书页 484-486 · 习题 17.5',
    fingerprint: 'exercise:symmetric-line-project-onto-plane-via-containing-perpendicular-plane',
    title: '习题 17.5 · 直线在给定平面上的投影方程',
    statement: raw`直线
$$L:\frac{x-1}{1}=\frac y1=\frac{z-1}{-1}$$
在平面 $\pi:3x-y+3z=5$ 上的投影直线 $L_0$ 的方程是什么？`,
    tags: ['投影直线', '平面束', '空间直线'],
    coreMethod: '先把直线写成两平面交式，再在过该直线的平面束中选取与投影平面垂直的平面。',
    mistakes: '答案必须同时包含投影平面本身；只写辅助垂直平面并不能唯一确定投影直线。',
    answerText: raw`$$L_0:\begin{cases}
3x-y+3z=5,\\
x-3y-2z+1=0.
\end{cases}$$`,
    methodOne: raw`原直线可写成
$$x+z-2=0,\qquad y+z-1=0.$$
过 $L$ 的平面束为
$$x+z-2+\lambda(y+z-1)=0,$$
法向量 $(1,\lambda,1+\lambda)$。与 $\pi$ 的法向量 $(3,-1,3)$ 垂直，得
$$3-\lambda+3(1+\lambda)=0,$$
故 $\lambda=-3$。辅助平面为 $x-3y-2z+1=0$，与 $\pi$ 联立即得答案。`,
    methodTwo: raw`原直线方向为 $(1,1,-1)$。将其向 $\pi$ 投影后得到投影方向，再把直线上一点 $(1,0,1)$ 沿法向投影到 $\pi$ 上，即可写出投影线点向式。把点向式化为两平面交式，结果仍是
$$3x-y+3z=5,\qquad x-3y-2z+1=0.$$`
  }),
  lectureSeventeen({
    id: 'exercise-17-6-line-rotate-z-axis', role: 'exercise', page: 'PDF 489-491 · 书页 484-486 · 习题 17.6',
    fingerprint: 'exercise:line-through-two-points-rotate-z-axis-eliminate-parameter',
    title: '习题 17.6 · 直线绕坐标轴旋转所得曲面',
    statement: raw`过点 $A(1,0,0)$ 与 $B(0,1,1)$ 的直线绕 $z$ 轴旋转一周，求所生成曲面的方程。`,
    tags: ['旋转曲面', '参数消元', '空间曲面'],
    coreMethod: '母线上点的 $z$ 坐标在旋转中不变，到 $z$ 轴距离平方由 $x^2+y^2$ 表示。',
    mistakes: '绕 $z$ 轴旋转后，原母线的 $x,y$ 坐标不再固定；应保留的是半径 $x^2+y^2$。',
    answerText: raw`$$x^2+y^2-2z^2+2z-1=0.$$`,
    methodOne: raw`直线可参数化为
$$x=1-t,\qquad y=t,\qquad z=t.$$
在高度 $z=t$ 处，母线点到 $z$ 轴的距离平方为
$$r^2=(1-t)^2+t^2=(1-z)^2+z^2.$$
旋转后 $r^2=x^2+y^2$，整理得
$$x^2+y^2-2z^2+2z-1=0.$$`,
    methodTwo: raw`采用等价参数 $x=1+s,y=-s,z=-s$，有
$$x^2+y^2=(1+s)^2+s^2=(1-z)^2+z^2.$$
这说明结果与直线参数方向无关；展开后仍为题给二次曲面方程。`
  }),
  lectureSeventeen({
    id: 'exercise-17-7-log-directional-derivative', role: 'exercise', page: 'PDF 489-491 · 书页 484-486 · 习题 17.7',
    fingerprint: 'exercise:log-x-plus-radial-yz-gradient-along-two-point-direction',
    title: '习题 17.7 · 对数复合函数沿两点方向的方向导数',
    statement: raw`函数
$$u=\ln\left(x+\sqrt{y^2+z^2}\right)$$
在点 $A(1,0,1)$ 处沿 $A$ 指向 $B(3,-2,2)$ 的方向导数是多少？`,
    tags: ['方向导数', '复合函数偏导', '两点方向'],
    coreMethod: raw`先求三元梯度，再将向量 $\overrightarrow{AB}$ 单位化并作点积。`,
    mistakes: raw`方向是从 $A$ 指向 $B$，不能反向；根式对 $y,z$ 求导时还要除以 $\sqrt{y^2+z^2}$。`,
    answerText: raw`$$\dfrac12.$$`,
    methodOne: raw`在 $A$ 点，$\sqrt{y^2+z^2}=1$，故
$$\nabla u(A)=\left(\frac12,0,\frac12\right).$$
而
$$\overrightarrow{AB}=(2,-2,1),\qquad \boldsymbol e_{AB}=\left(\frac23,-\frac23,\frac13\right).$$
所以
$$D_{AB}u=\nabla u(A)\cdot\boldsymbol e_{AB}=\frac13+\frac16=\frac12.$$`,
    methodTwo: raw`沿单位速度路径
$$x=1+\frac{2s}{3},\quad y=-\frac{2s}{3},\quad z=1+\frac s3$$
代入 $u$。对 $s$ 求导并在 $s=0$ 代入，外层对数给出因子 $1/(1+1)=1/2$，内层导数为 $1$，因此结果为 $1/2$。`
  }),
  lectureSeventeen({
    id: 'exercise-17-8-implicit-gradient-maximum', role: 'exercise', page: 'PDF 489、491-492 · 书页 484、486-487 · 习题 17.8',
    fingerprint: 'exercise:implicit-u-of-xyz-gradient-via-three-partials-max-directional-derivative',
    title: '习题 17.8 · 四元隐式方程确定函数的最大方向导数',
    statement: raw`设 $u=u(x,y,z)$ 由方程
$$e^{z+u}-xy-yz-zu=0$$
确定。求 $u$ 在点 $P(1,1,0)$ 处方向导数的最大值。`,
    tags: ['隐函数偏导', '梯度模', '最大方向导数'],
    coreMethod: '先由原方程确定点处 $u$ 值，再分别对 $x,y,z$ 隐式求偏导，最后取梯度模。',
    mistakes: '对 $z$ 求偏导时，$e^{z+u}$ 同时含显式的 $z$ 和隐式的 $u$；必须出现因子 $1+u_z$。',
    answerText: raw`最大方向导数为 $\sqrt2$。`,
    methodOne: raw`代入 $(1,1,0)$ 得 $e^u-1=0$，故 $u=0$。分别求偏导，在该点有
$$u_x=1,\qquad u_y=1,\qquad u_z=0.$$
因此
$$\nabla u(P)=(1,1,0),\qquad \max D_{\boldsymbol l}u=|\nabla u(P)|=\sqrt2.$$`,
    methodTwo: raw`令 $G=e^{z+u}-xy-yz-zu$。把 $u$ 看成第四个变量，则
$$u_x=-\frac{G_x}{G_u},\qquad u_y=-\frac{G_y}{G_u},\qquad u_z=-\frac{G_z}{G_u}.$$
在 $(x,y,z,u)=(1,1,0,0)$ 处，$G_u=1$，而 $(G_x,G_y,G_z)=(-1,-1,0)$，故梯度仍为 $(1,1,0)$，模为 $\sqrt2$。`
  }),
  lectureSeventeen({
    id: 'exercise-17-9-divergence', role: 'exercise', page: 'PDF 489、492 · 书页 484、487 · 习题 17.9',
    fingerprint: 'exercise:divergence-cubic-coordinate-field-at-point',
    title: '习题 17.9 · 坐标三次型向量场的散度',
    statement: raw`已知
$$\boldsymbol F=x^3\boldsymbol i+y^3\boldsymbol j+z^3\boldsymbol k,$$
求 $\operatorname{div}\boldsymbol F$ 在点 $(1,0,-1)$ 处的值。`,
    tags: ['散度计算', '向量场', '偏导数'],
    coreMethod: '散度只取每个分量对对应坐标的偏导并相加。',
    mistakes: '不要把散度与旋度混淆；$z=-1$ 代入的是 $z^2$，因此该项仍为正。',
    answerText: '$$6.$$ ',
    methodOne: raw`由
$$\operatorname{div}\boldsymbol F=\frac{\partial x^3}{\partial x}+\frac{\partial y^3}{\partial y}+\frac{\partial z^3}{\partial z}=3x^2+3y^2+3z^2,$$
代入 $(1,0,-1)$ 得 $3+0+3=6$。`,
    methodTwo: raw`在该点三个坐标方向的局部伸缩率分别为 $3,0,3$。散度是三者之和，因此为 $6$；负的 $z$ 坐标经平方后不会带来负号。`
  }),
  lectureSeventeen({
    id: 'exercise-17-10-curl-linear-field', role: 'exercise', page: 'PDF 489、492 · 书页 484、487 · 习题 17.10',
    fingerprint: 'exercise:curl-linear-cyclic-vector-field-component-formula',
    title: '习题 17.10 · 线性向量场的旋度',
    statement: raw`向量场
$$\boldsymbol A=(z,3x,2y)$$
的旋度 $\operatorname{rot}\boldsymbol A$ 是多少？`,
    tags: ['旋度计算', '线性向量场', '计算题'],
    coreMethod: '按旋度分量公式逐项求偏导；线性场的旋度为常向量。',
    mistakes: raw`第二分量应为 $P_z-R_x$，或在行列式展开时保留 $\boldsymbol j$ 项前的负号。`,
    answerText: raw`$$\operatorname{rot}\boldsymbol A=2\boldsymbol i+\boldsymbol j+3\boldsymbol k.$$`,
    methodOne: raw`记 $P=z,Q=3x,R=2y$，则
$$\operatorname{rot}\boldsymbol A=(R_y-Q_z,\ P_z-R_x,\ Q_x-P_y)=(2,1,3).$$
因此结果为 $2\boldsymbol i+\boldsymbol j+3\boldsymbol k$。`,
    methodTwo: raw`用行列式
$$\begin{vmatrix}\boldsymbol i&\boldsymbol j&\boldsymbol k\\
\partial_x&\partial_y&\partial_z\\z&3x&2y\end{vmatrix}$$
展开：$\boldsymbol i$ 分量为 $2$，$\boldsymbol j$ 分量为 $-(-1)=1$，$\boldsymbol k$ 分量为 $3$，与分量公式一致。`
  })
]
