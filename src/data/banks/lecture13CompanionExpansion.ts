import type { SeedInput } from './types'

const raw = String.raw
const ZY1000_SOURCE = '何耀焜私人整理 · 张宇《1000题》数一解析册 · 第13章逐页核验'

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
    id: `zy1000-verified-l13-${id}`,
    kind: 'problem',
    source: ZY1000_SOURCE,
    tags: ['高等数学', '第13讲', ...tags, '经典例题', 'PDF逐页核验'],
    methodFingerprint: `zy1000-verified:l13:${fingerprint}`,
    solutionMethods: [
      { title: '方法一 · 解析册主线', content: methodOne },
      { title: '方法二 · 独立复核', content: methodTwo }
    ]
  }
}

export const lecture13CompanionExpansionSeeds: SeedInput[] = [
  companion({
    id: 'advanced-3-best-quadratic-fit', page: '解析 PDF 302-303 · 书页 296-297 · 强化篇第 3 题',
    fingerprint: 'integral-parameter-minimum:least-squares-quadratic-on-zero-one',
    title: '1000题强化篇第 3 题 · 含参积分的唯一最小值',
    statement: raw`设
$$F(a,b)=\int_0^{\pi/2}\bigl(a\sin x-\sin^2x+b\bigr)^2\cos x\,dx.$$
求 $F(a,b)$ 的最小值点。`,
    tags: ['含参积分最值', '最小二乘'],
    coreMethod: raw`令 $t=\sin x$ 把问题化为 $\int_0^1(at-t^2+b)^2dt$，再令两个参数偏导为零并检查 Hessian 正定。`,
    mistakes: '对参数求偏导后积分号内要乘以括号整体的导数；只解一阶方程还不足以说明是唯一最小值。',
    answerText: raw`唯一最小值点为 $$(a,b)=\left(1,-\frac16\right).$$`,
    methodOne: raw`令 $t=\sin x$，则
$$F=\int_0^1(at-t^2+b)^2dt.$$
由
$$F_a=2\int_0^1(at-t^2+b)t\,dt=0,\quad F_b=2\int_0^1(at-t^2+b)dt=0$$
解得 $a=1,b=-1/6$。又 $F_{aa}=2/3,F_{ab}=1,F_{bb}=2$，故 $F_{aa}F_{bb}-F_{ab}^2=1/3>0$，为唯一最小值点。`,
    methodTwo: raw`这是把 $t^2$ 在 $L^2[0,1]$ 中投影到 $\operatorname{span}\{t,1\}$。最优误差 $t^2-at-b$ 必须分别与 $t$、$1$ 正交：
$$\int_0^1(t^2-at-b)t\,dt=0,\qquad \int_0^1(t^2-at-b)dt=0.$$
正规方程同样给出 $a=1,b=-1/6$；平方范数严格凸，因此解唯一。`
  }),
  companion({
    id: 'advanced-6-ratio-harmonic-function', page: '解析 PDF 304 · 书页 298 · 强化篇第 6 题',
    fingerprint: 'pde-reduction:harmonic-function-of-y-over-x-arctangent',
    title: '1000题强化篇第 6 题 · 只依赖比值的调和函数',
    statement: raw`设 $x>0$，$z=f(y/x)$ 具有二阶连续偏导，并满足
$$z_{xx}+z_{yy}=0.$$
求 $f$ 的一般形式。`,
    tags: ['偏微分方程降阶', '比值代换'],
    coreMethod: raw`令 $u=y/x$，用链式法则把 Laplace 方程化为关于 $f(u)$ 的常微分方程。`,
    mistakes: raw`$u_x=-u/x,u_y=1/x$；计算二阶偏导时不能漏掉对这些系数再次求导的项。`,
    answerText: raw`$$f(u)=C_1\arctan u+C_2,$$
即 $z=C_1\arctan(y/x)+C_2$。`,
    methodOne: raw`计算得
$$z_{xx}+z_{yy}=\frac1{x^2}\left[(1+u^2)f''(u)+2uf'(u)\right].$$
故 $(1+u^2)f''+2uf'=0$，即 $[(1+u^2)f']'=0$。于是 $f'=C_1/(1+u^2)$，积分得结论。`,
    methodTwo: raw`在 $x>0$ 的极坐标中，$u=y/x=\tan\theta$，所以 $f(y/x)$ 只依赖角度。二维 Laplace 算子对纯角函数给出 $\Delta z=r^{-2}z_{\theta\theta}$，故调和条件要求 $z$ 关于 $\theta$ 为一次函数：$z=C_1\theta+C_2$。代回 $\theta=\arctan(y/x)$。`
  }),
  companion({
    id: 'advanced-7-limit-implies-differential', page: '解析 PDF 304 · 书页 298 · 强化篇第 7 题',
    fingerprint: 'differentiability:second-order-limit-identifies-linear-differential',
    title: '1000题强化篇第 7 题 · 由二阶小量极限识别全微分',
    statement: raw`设 $f$ 在 $(1,0)$ 的邻域有定义，且
$$\lim_{(x,y)\to(1,0)}\frac{f(x,y)-3x+y}{(x-1)^2+y^2}=\frac14.$$
求 $df\big|_{(1,0)}$。`,
    tags: ['极限识别全微分', '可微性'],
    coreMethod: '有限极限说明分子在点处为零，并且相对于距离的一阶项只能来自 $3(x-1)-y$。',
    mistakes: raw`先由极限存在推出 $f(1,0)=3$；分母是 $\rho^2$，因此剩余误差是 $O(\rho^2)=o(\rho)$。`,
    answerText: raw`$$df\big|_{(1,0)}=3dx-dy.$$`,
    methodOne: raw`记 $\rho^2=(x-1)^2+y^2$。题设给出
$$f(x,y)-3x+y=\frac14\rho^2+o(\rho^2).$$
故 $f(1,0)=3$，并且
$$f(x,y)-f(1,0)=3(x-1)-y+o(\rho),$$
所以全微分为 $3dx-dy$。`,
    methodTwo: raw`沿 $y=0$ 有
$$f(x,0)=3x+O((x-1)^2),$$
故 $f_x(1,0)=3$；沿 $x=1$ 有 $f(1,y)=3-y+O(y^2)$，故 $f_y(1,0)=-1$。原二维余项被 $C\rho^2$ 控制，保证可微，因此 $df=3dx-dy$。`
  }),
  companion({
    id: 'advanced-8-recover-outer-partials', page: '解析 PDF 304 · 书页 298 · 强化篇第 8 题',
    fingerprint: 'chain-rule:recover-outer-gradient-from-two-inner-directional-derivatives',
    title: '1000题强化篇第 8 题 · 由复合函数偏导反求外函数梯度',
    statement: raw`设 $z=f(xy,x+y)$，且
$$z_x(2,3)=6,\qquad z_y(2,3)=5.$$
求 $f_1'(6,5)+f_2'(6,5)$。`,
    tags: ['复合函数反求偏导', '线性方程组'],
    coreMethod: '在指定点写出两条链式法则，视外函数两个偏导为未知量解二元线性方程组。',
    mistakes: raw`在 $(2,3)$ 处外函数的取值点是 $(xy,x+y)=(6,5)$；$z_x$ 的系数是 $(y,1)$，$z_y$ 的系数是 $(x,1)$。`,
    answerText: raw`$$f_1'(6,5)+f_2'(6,5)=4.$$`,
    methodOne: raw`链式法则给出
$$z_x=yf_1'+f_2',\qquad z_y=xf_1'+f_2'.$$
代入 $(2,3)$ 得 $3f_1'+f_2'=6,2f_1'+f_2'=5$，故 $f_1'=1,f_2'=3$，所求为 $4$。`,
    methodTwo: raw`两个内变量的 Jacobian 在该点为
$$J=\begin{pmatrix}3&1\\2&1\end{pmatrix}.$$
外梯度满足 $J\nabla f=(6,5)^T$。逆矩阵求得 $\nabla f=(1,3)^T$，分量和为 $4$。`
  }),
  companion({
    id: 'advanced-11-implicit-mixed-derivative', page: '解析 PDF 305 · 书页 299 · 强化篇第 11 题',
    fingerprint: 'implicit-second-derivative:z-plus-expz-equals-xy-at-zero',
    title: '1000题强化篇第 11 题 · 指数隐函数的混合二阶偏导',
    statement: raw`由
$$z+e^z=xy$$
确定 $z=z(x,y)$。在 $z=0$ 的点求 $z_{xy}$。`,
    tags: ['隐函数二阶偏导', '指数方程'],
    coreMethod: '先由 $z=0$ 得 $xy=1$，求出一阶偏导，再对其中一个继续求导并代回。',
    mistakes: raw`满足 $z=0$ 的点不是唯一点，但都有 $xy=1$；最终结果只依赖乘积，因此是同一个常数。`,
    answerText: raw`$$z_{xy}=\frac38.$$`,
    methodOne: raw`由
$$z_x=\frac{y}{1+e^z},\qquad z_y=\frac{x}{1+e^z}.$$
再对 $z_x$ 关于 $y$ 求导：
$$z_{xy}=\frac1{1+e^z}-\frac{ye^z z_y}{(1+e^z)^2}.$$
当 $z=0$ 时 $xy=1$，故 $z_{xy}=1/2-1/8=3/8$。`,
    methodTwo: raw`把方程看成 $h(z)=xy$，其中 $h(z)=z+e^z$。反函数在 $xy=1$ 附近满足
$$z=\phi(xy),\quad \phi'(1)=1/2,\quad \phi''(1)=-1/8.$$
于是 $z_{xy}=\phi'(xy)+xy\phi''(xy)$，在 $xy=1$ 处为 $1/2-1/8=3/8$。`
  }),
  companion({
    id: 'advanced-13-exactness-parameter', page: '解析 PDF 306 · 书页 300 · 强化篇第 13 题',
    fingerprint: 'exact-differential:rational-one-form-parameter-cross-partials',
    title: '1000题强化篇第 13 题 · 有理式微分形式的参数',
    statement: raw`设
$$P(x,y)=\frac{x}{x^2+y^2-1},\qquad Q(x,y)=\frac{ay}{x^2+y^2-1}.$$
若 $P\,dx+Q\,dy$ 在定义域内为某函数的全微分，求 $a$。`,
    tags: ['全微分有理式', '参数匹配'],
    coreMethod: raw`在分母非零且偏导连续的区域比较 $P_y$ 与 $Q_x$。`,
    mistakes: '两个偏导都有分母平方和负号，约去公因子前不要丢掉 $x,y$。',
    answerText: raw`$$a=1.$$`,
    methodOne: raw`$$P_y=-\frac{2xy}{(x^2+y^2-1)^2},\qquad Q_x=-\frac{2axy}{(x^2+y^2-1)^2}.$$
在定义域内恒有 $P_y=Q_x$，所以 $a=1$。`,
    methodTwo: raw`当 $a=1$ 时
$$P\,dx+Q\,dy=\frac{x\,dx+y\,dy}{x^2+y^2-1}=\frac12d\ln|x^2+y^2-1|,$$
确为全微分；若 $a\ne1$，混合偏导不相等，故不可能。`
  }),
  companion({
    id: 'advanced-14-implicit-integral-differential', page: '解析 PDF 306 · 书页 300 · 强化篇第 14 题',
    fingerprint: 'implicit-differential:sine-difference-plus-gaussian-integral-at-origin',
    title: '1000题强化篇第 14 题 · 三角函数与积分隐式方程的全微分',
    statement: raw`由方程
$$\sin(x-y)+\int_1^z e^{-t^2}\,dt=0$$
确定 $z=z(x,y)$，求 $dz\big|_{(0,0)}$。`,
    tags: ['积分隐函数全微分', '变上限积分'],
    coreMethod: '先由原方程求出目标点对应的 $z=1$，再整体全微分并解出 $dz$。',
    mistakes: raw`变上限积分的微分是 $e^{-z^2}dz$；在 $(0,0)$ 处不能误取 $z=0$。`,
    answerText: raw`$$dz\big|_{(0,0)}=-e\,dx+e\,dy.$$`,
    methodOne: raw`当 $x=y=0$ 时，积分必须为零，故 $z=1$。全微分得
$$\cos(x-y)(dx-dy)+e^{-z^2}dz=0.$$
代入 $(0,0,1)$，有 $dx-dy+e^{-1}dz=0$，所以 $dz=-e\,dx+e\,dy$。`,
    methodTwo: raw`令 $F(x,y,z)=\sin(x-y)+\int_1^ze^{-t^2}dt$。在目标点
$$F_x=1,\quad F_y=-1,\quad F_z=e^{-1}\ne0.$$
故 $z_x=-F_x/F_z=-e,z_y=-F_y/F_z=e$，合成全微分。`
  }),
  companion({
    id: 'advanced-18-implicit-second-x', page: '解析 PDF 307 · 书页 301 · 强化篇第 18 题',
    fingerprint: 'implicit-second-derivative:polynomial-surface-origin-z-one',
    title: '1000题强化篇第 18 题 · 多项式隐函数的二阶偏导',
    statement: raw`由
$$3x+xyz+z^3=1$$
确定满足 $z(0,0)=1$ 的分支 $z=z(x,y)$，求 $z_{xx}(0,0)$。`,
    tags: ['隐函数二阶偏导', '多项式方程'],
    coreMethod: '先求目标点的函数值，再从一阶隐式偏导公式继续对 $x$ 求导。',
    mistakes: raw`在原点方程有 $z=\pm1$ 两支；解析册所取连续分支为 $z(0,0)=1$，题卡明确沿该分支计算。`,
    answerText: raw`在 $z(0,0)=1$ 的分支上，$$z_{xx}(0,0)=-2.$$`,
    methodOne: raw`令 $F=3x+xyz+z^3-1$。在 $(0,0,z=1)$，
$$z_x=-\frac{F_x}{F_z}=-\frac{3+yz}{xy+3z^2}=-1.$$
对 $F_x+F_zz_x=0$ 再关于 $x$ 求导：
$$F_{xx}+2F_{xz}z_x+F_{zz}z_x^2+F_zz_{xx}=0.$$
代点得 $0+0+6+3z_{xx}=0$，故 $z_{xx}=-2$。`,
    methodTwo: raw`直接在 $y=0$ 的截线上，方程退化为 $3x+z^3=1$，所取分支为
$$z=(1-3x)^{1/3}.$$
两次求导并代 $x=0$，得到 $z_{xx}(0)=-2$。`
  }),
  companion({
    id: 'advanced-19-integral-implicit-mixed', page: '解析 PDF 307 · 书页 301 · 强化篇第 19 题',
    fingerprint: 'implicit-mixed-derivative:variable-endpoint-sine-integral-at-one-one',
    title: '1000题强化篇第 19 题 · 双变上限积分隐函数的混合偏导',
    statement: raw`由
$$2z-e^z+1+\int_y^{x^2}\sin(t^2)\,dt=0$$
确定 $z=z(x,y)$，求 $z_{xy}(1,1)$。`,
    tags: ['积分隐函数混合偏导', '变上限积分'],
    coreMethod: '先由原方程确定 $z(1,1)=0$，分别求 $z_x,z_y$，再对其中一个求混合偏导。',
    mistakes: raw`下限 $y$ 的导数带负号；$2-e^z$ 对变量求导还会产生 $-e^zz_y$。`,
    answerText: raw`$$z_{xy}(1,1)=-2\sin^2 1.$$`,
    methodOne: raw`令 $F=2z-e^z+1+\int_y^x\sin(t^2)dt$。在 $(1,1)$ 有 $z=0$。由
$$z_x=-\frac{2x\sin(x^4)}{2-e^z},\qquad z_y=\frac{\sin(y^2)}{2-e^z}.$$
再对 $z_x$ 关于 $y$ 求导并代 $z=0,z_y=\sin1$，得 $z_{xy}=-2\sin^21$。`,
    methodTwo: raw`把方程写成 $h(z)=-I(x,y)$，其中 $h(z)=2z-e^z+1$，$I=\int_y^{x^2}\sin(t^2)dt$。在 $z=0$ 时 $h'(0)=1,h''(0)=-1$，且 $I_x=2\sin1,I_y=-\sin1,I_{xy}=0$。反函数二阶链式法则给出 $z_{xy}=-2\sin^21$。`
  }),
  companion({
    id: 'advanced-22-cusp-curve-distance', page: '解析 PDF 308-309 · 书页 302-303 · 强化篇第 22 题',
    fingerprint: 'distance-extremum:cusp-curve-unbounded-lagrange-failure-check',
    title: '1000题强化篇第 22 题 · 半立方抛物线到原点的距离',
    statement: raw`在曲线
$$ (x-1)^3=y^2$$
上求点到原点距离的最大值与最小值。`,
    tags: ['曲线距离极值', '非正则约束'],
    coreMethod: '先观察曲线无界，因此不存在最大距离；最小距离不能只依赖拉格朗日方程，还要检查尖点。',
    mistakes: raw`尖点 $(1,0)$ 处约束梯度为零，常规拉格朗日乘子条件会失效，但它恰是最小值候选。`,
    answerText: raw`不存在最大距离；最小距离为 $1$，在 $(1,0)$ 处取得。`,
    methodOne: raw`参数化 $x=1+t^2,y=t^3$。距离平方为
$$d^2=(1+t^2)^2+t^6=1+2t^2+t^4+t^6\ge1,$$
等号仅在 $t=0$，即 $(1,0)$。当 $|t|\to\infty$ 时距离趋于无穷，所以无最大值。`,
    methodTwo: raw`曲线满足 $x\ge1$，故任一点到原点的距离 $d\ge|x|\ge1$；点 $(1,0)$ 在曲线上并达到等号。又曲线向无穷延伸，距离无上界。`
  }),
  companion({
    id: 'advanced-23-reconstruct-and-classify', page: '解析 PDF 309 · 书页 303 · 强化篇第 23 题',
    fingerprint: 'reconstruct-function:first-partial-boundary-then-stationary-classification',
    title: '1000题强化篇第 23 题 · 由偏导恢复函数并判定极值',
    statement: raw`已知
$$f_x(x,y)=y(1+x)e^{x-y},\qquad f(1,y)=ye^{1-y}.$$
求 $f(x,y)$，并判断其驻点的极值性质。`,
    tags: ['由偏导恢复函数', '驻点分类'],
    coreMethod: '先对 $x$ 积分并用边界函数确定任意函数，再联立两个一阶偏导并分类。',
    mistakes: raw`由 $f_x$ 对 $x$ 积分时，$y$ 是常量；驻点 $(-1,1)$ 的两个坐标异号，容易抄错。`,
    answerText: raw`$$f(x,y)=xye^{x-y}.$$
$(0,0)$ 不是极值点；$(-1,1)$ 是严格极小值点，极小值为 $-e^{-2}$。`,
    methodOne: raw`因 $\partial(xe^x)/\partial x=(1+x)e^x$，
$$f=xye^{x-y}+C(y).$$
由 $f(1,y)=ye^{1-y}$ 得 $C(y)=0$。再由
$$f_x=y(1+x)e^{x-y},\qquad f_y=x(1-y)e^{x-y}$$
得到驻点 $(0,0),(-1,1)$。Hessian 判定：原点行列式小于零，是鞍点；$(-1,1)$ 处正定，为严格极小值。`,
    methodTwo: raw`函数符号由 $xy$ 决定。原点任意小邻域同时有正值和负值，故不是极值。对 $(-1,1)$，令 $x=-1+u,y=1+v$，二阶展开的二次型为 $e^{-2}(u^2+v^2)/2$ 加高阶项，故严格极小，函数值 $-e^{-2}$。`
  }),
  companion({
    id: 'advanced-26-surface-height-extrema', page: '解析 PDF 310 · 书页 304 · 强化篇第 26 题',
    fingerprint: 'implicit-surface:local-extrema-of-height-two-branches-hessian',
    title: '1000题强化篇第 26 题 · 隐式曲面高度的两个局部极值',
    statement: raw`曲面
$$2x^2+2y^2+z^2+8xz-z+8=0$$
在何处使 $z=z(x,y)$ 取得局部极值？`,
    tags: ['隐式曲面高度极值', 'Hessian判定'],
    coreMethod: raw`令 $F=0$，驻点需 $F_x=F_y=0$ 且 $F_z\ne0$；解出候选后用隐函数二阶偏导判定。`,
    mistakes: '局部极大值的数值可以小于局部极小值，因为它们位于不同局部分支；不要按数值大小否定分类。',
    answerText: raw`在 $(-2,0)$ 处分支值 $z=1$ 为局部极小；在 $(16/7,0)$ 处分支值 $z=-8/7$ 为局部极大。`,
    methodOne: raw`有 $F_x=4x+8z,F_y=4y$。驻点满足 $y=0,x=-2z$，代回曲面得到 $z=1$ 或 $z=-8/7$，对应两点。用 $z_i=-F_i/F_z$ 继续求二阶偏导，第一点 Hessian 正定，第二点负定，故分别为局部极小和局部极大。`,
    methodTwo: raw`在 $y=0$ 截面上把方程看作关于 $x,z$ 的二次曲线，驻高点满足切线水平，即 $F_x=0$；关于 $y$ 的对称性给出 $F_y=0$。解得同样两点。再比较各点附近的二次展开，系数在 $(-2,0,1)$ 为正、在 $(16/7,0,-8/7)$ 为负。`
  }),
  companion({
    id: 'advanced-28-cone-plane-z-range', page: '解析 PDF 311 · 书页 305 · 强化篇第 28 题',
    fingerprint: 'two-constraint-extremum:elliptic-cone-plane-absolute-z-range',
    title: '1000题强化篇第 28 题 · 锥面与平面交线上的高度范围',
    statement: raw`在交线
$$x^2+9y^2-2z^2=0,\qquad x+3y+3z-5=0$$
上求 $|z|$ 的最大值与最小值。`,
    tags: ['双约束条件极值', '拉格朗日乘子'],
    coreMethod: raw`$|z|$ 与 $z^2$ 的极值点一致，对 $z^2$ 使用两个乘子建立五元方程组。`,
    mistakes: '目标用 $z^2$ 可避免绝对值不可导；求出候选后要把 $z^2$ 开方并取非负值。',
    answerText: raw`$$\min|z|=1,\qquad \max|z|=5.$$`,
    methodOne: raw`构造
$$L=z^2+\lambda(x^2+9y^2-2z^2)+\mu(x+3y+3z-5).$$
解 $\nabla L=0$ 与两约束，得到 $(1,1/3,1)$、$(-5,-5/3,5)$。因此 $|z|$ 分别为 $1,5$，即最小与最大。`,
    methodTwo: raw`令 $X=x,Y=3y$，锥面为 $X^2+Y^2=2z^2$，平面为 $X+Y=5-3z$。由 Cauchy 不等式，在存在实数 $X,Y$ 时必须且只需
$$(5-3z)^2\le2(X^2+Y^2)=4z^2.$$
解得允许的 $z$ 区间端点对应 $z=1,5$，故 $|z|$ 的范围为 $[1,5]$。`
  }),
  companion({
    id: 'advanced-31-curve-axis-area', page: '解析 PDF 312 · 书页 306 · 强化篇第 31 题',
    fingerprint: 'implicit-curve:axis-intercepts-tangent-triangle-area-minimum',
    title: '1000题强化篇第 31 题 · 隐曲线切线与坐标轴围成面积',
    statement: raw`在第一象限曲线
$$x^2-xy+y^2=1$$
上取点 $P(x,y)$，过 $P$ 作曲线切线。求该切线与两坐标轴围成三角形面积的最小值。`,
    tags: ['隐曲线切线面积', '约束极值'],
    coreMethod: '隐式求导写切线，求两轴截距后把面积化成 $x,y$ 的函数，再用曲线约束求最小值。',
    mistakes: raw`切线斜率 $y'=(y-2x)/(2y-x)$；求截距时应分别令 $X=0$ 与 $Y=0$，不要把曲线上点的 $x,y$ 当截距。`,
    answerText: raw`最小面积为 $2$，在切点 $(1,1)$ 处取得。`,
    methodOne: raw`隐式求导得 $y'=(y-2x)/(2y-x)$。切线的两轴截距相乘整理后，三角形面积为
$$S=\frac{2}{(y-2x)(x-2y)}.$$
在约束 $x^2-xy+y^2=1$、$x,y>0$ 下求分母最大值，得 $x=y=1$，故 $S_{\min}=2$。`,
    methodTwo: raw`曲线与面积表达式关于 $x,y$ 对称，内部极值必在 $x=y$；联立约束得 $x=y=1$。边界趋近坐标轴时切线三角形面积不小于该值，因此对称点给出全局最小值 $2$。`
  }),
  companion({
    id: 'advanced-34-reconstruct-quadratic-constrained', page: '解析 PDF 313-314 · 书页 307-308 · 强化篇第 34 题',
    fingerprint: 'reconstruct-function:constant-second-y-derivative-boundary-data-ellipse-extrema',
    title: '1000题强化篇第 34 题 · 恢复二次函数并求椭圆约束极值',
    statement: raw`已知
$$f_{yy}(x,y)=4,\qquad f(x,0)=x^2,\qquad f_y(x,0)=\sqrt2x.$$
求 $f$ 在椭圆 $x^2+2y^2=4$ 上的最大值与最小值。`,
    tags: ['由二阶偏导恢复函数', '椭圆约束极值'],
    coreMethod: '对 $y$ 连续积分两次并用两条边界数据确定函数，再对二次型做约束极值。',
    mistakes: raw`两次积分分别引入 $\phi(x),\psi(x)$；椭圆约束下还要比较所有四个驻点。`,
    answerText: raw`$$f_{\max}=6,\qquad f_{\min}=2.$$
最大值在 $(\sqrt2,1)$ 处取得，最小值在 $(\sqrt2,-1)$ 处取得。`,
    methodOne: raw`积分得
$$f=2y^2+\phi(x)y+\psi(x).$$
由边界条件得 $\phi(x)=\sqrt2x,\psi(x)=x^2$，故 $f=x^2+\sqrt2xy+2y^2$。对约束使用乘子，候选为 $(\pm\sqrt2,\pm1)$；代入比较得最大 $6$、最小 $2$。`,
    methodTwo: raw`令 $X=x,Y=\sqrt2y$，约束变成 $X^2+Y^2=4$，而
$$f=X^2+XY+Y^2.$$
其矩阵特征值为 $3/2,1/2$，在半径 $2$ 的圆上极值为 $4\cdot3/2=6$ 与 $4\cdot1/2=2$；对应特征方向还原即得取值点。`
  }),
  companion({
    id: 'advanced-36-triangle-global-extrema', page: '解析 PDF 315 · 书页 309 · 强化篇第 36 题',
    fingerprint: 'closed-region-extremum:separable-cubic-on-triangle-check-all-boundaries',
    title: '1000题强化篇第 36 题 · 三角形闭区域上的全局极值',
    statement: raw`设
$$f_x=6x^2-6,\qquad f_y=6y^2-6,\qquad f(0,0)=5.$$
在闭区域
$$D=\{(x,y):x\ge0,\ y\ge0,\ x+y\le3\}$$
上求 $f$ 的最大值与最小值。`,
    tags: ['闭区域全局极值', '边界分类'],
    coreMethod: '先恢复函数，求内部驻点；再逐条检查三角形的三条边，最后统一比较候选值。',
    mistakes: '闭区域极值不能只检查内部驻点；斜边 $x+y=3$ 需要代入一元化。',
    answerText: raw`$$\max_D f=41,\qquad \min_D f=-3.$$
最大值在 $(3,0),(0,3)$ 处取得，最小值在 $(1,1)$ 处取得。`,
    methodOne: raw`积分并用初值得
$$f=2x^3+2y^3-6x-6y+5.$$
内部驻点为 $(1,1)$，值为 $-3$。在 $y=0$ 与 $x=0$ 上比较端点和驻点；在斜边 $x+y=3$ 上一元化比较。所有候选中最大值为 $41$，在 $(3,0),(0,3)$；最小值为 $-3$。`,
    methodTwo: raw`利用对称性，先检查内部对称点 $(1,1)$。斜边上令 $y=3-x$，得到关于 $x$ 的对称三次组合，其极值不超过两个端点值 $41$。两条坐标边也由一元三次函数 $2t^3-6t+5$ 控制；比较 $t=0,1,3$ 与内部点，得到同一结论。`
  })
]
