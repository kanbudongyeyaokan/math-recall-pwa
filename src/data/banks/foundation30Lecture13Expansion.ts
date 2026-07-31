import type { SeedInput } from './types'

const raw = String.raw
const ZY30_SOURCE = '何耀焜私人整理 · 张宇《基础30讲》高数 · 第13讲逐页核验'

type LectureThirteenSeed = Omit<SeedInput, 'id' | 'kind' | 'tags' | 'methodFingerprint' | 'source' | 'solutionMethods'> & {
  id: string
  role: 'example' | 'exercise'
  tags: string[]
  fingerprint: string
  methodOne: string
  methodTwo: string
}

function lectureThirteen(input: LectureThirteenSeed): SeedInput {
  const { id, role, tags, fingerprint, methodOne, methodTwo, ...seed } = input
  return {
    ...seed,
    id: `zy30-verified-l13-${id}`,
    kind: 'problem',
    source: ZY30_SOURCE,
    tags: ['高等数学', '第13讲', ...tags, role === 'example' ? '经典例题' : '课后习题', 'PDF逐页核验'],
    methodFingerprint: `zy30-verified:l13:${fingerprint}`,
    solutionMethods: [
      { title: '方法一 · 主线推导', content: methodOne },
      { title: '方法二 · 结构复核', content: methodTwo }
    ]
  }
}

export const foundation30Lecture13ExpansionSeeds: SeedInput[] = [
  lectureThirteen({
    id: 'example-13-1-two-path-limits', role: 'example', page: 'PDF 311-312 · 书页 306-307 · 例 13.1',
    fingerprint: 'multivariable-limit:path-upper-bound-versus-path-dependence',
    title: '例 13.1 · 两个二元极限的存在性',
    statement: raw`设
$$I_1=\lim_{(x,y)\to(0,0)}\frac{|xy|}{\sqrt{x^2+y^2}},\qquad
I_2=\lim_{(x,y)\to(0,0)}\frac{x|y|}{x^2+y^2}.$$
判断 $I_1,I_2$ 是否存在。`,
    questionFormat: 'single-choice', options: ['两者都存在', '$I_1$ 存在，$I_2$ 不存在', '$I_1$ 不存在，$I_2$ 存在', '两者都不存在'], correctOptionIds: ['B'],
    tags: ['二元极限路径判定', '夹逼准则', '选择题'],
    coreMethod: raw`对 $I_1$ 用 $2|xy|\le x^2+y^2$ 夹逼；对 $I_2$ 取 $y=kx$，检验极限是否随 $k$ 改变。`,
    mistakes: '只沿坐标轴代入会同时得到零，却不足以证明二元极限存在；否定极限存在只需找到两条结果不同的路径。',
    answerText: '正确选项为 B：$I_1=0$，而 $I_2$ 不存在。',
    methodOne: raw`由 $2|xy|\le x^2+y^2$，
$$0\le \frac{|xy|}{\sqrt{x^2+y^2}}\le\frac12\sqrt{x^2+y^2}\to0,$$
所以 $I_1=0$。对 $I_2$ 取 $y=kx$，得
$$\frac{x|y|}{x^2+y^2}=\frac{k}{1+k^2}\quad(k>0),$$
结果依赖 $k$，故 $I_2$ 不存在。`,
    methodTwo: raw`令 $x=r\cos\theta,y=r\sin\theta$。第一式化为
$$r|\sin\theta\cos\theta|,$$
其绝对值不超过 $r/2$，故趋于零；第二式化为 $\cos\theta|\sin\theta|$，仍依赖方向角，不能有唯一极限。`
  }),
  lectureThirteen({
    id: 'example-13-2-continuous-completion', role: 'example', page: 'PDF 313 · 书页 308 · 例 13.2',
    fingerprint: 'continuity:radial-removable-singularity-cuberoot-exponential-equivalent',
    title: '例 13.2 · 根式与指数型二元函数的连续补值',
    statement: raw`设
$$f(x,y)=\begin{cases}
\displaystyle\frac{\sqrt[3]{1-(x^2+y^2)}-1}{e^{x^2+y^2}-1},&x^2+y^2\ne0,\\
a,&x^2+y^2=0.
\end{cases}$$
若 $f$ 在原点连续，求 $a$。`,
    tags: ['二元函数连续补值', '等价无穷小'],
    coreMethod: raw`令 $u=x^2+y^2\to0$，把二元极限降为一元极限，再分别使用 $\sqrt[3]{1-u}-1\sim-u/3$ 与 $e^u-1\sim u$。`,
    mistakes: '分子的一阶项带负号；连续补值必须等于极限，而不是把原点直接代进分式。',
    answerText: raw`$$a=-\frac13.$$`,
    methodOne: raw`令 $u=x^2+y^2$，则
$$\lim_{u\to0}\frac{\sqrt[3]{1-u}-1}{e^u-1}
=\lim_{u\to0}\frac{-u/3+o(u)}{u+o(u)}=-\frac13.$$
连续要求 $a$ 等于该极限。`,
    methodTwo: raw`分子有理化为
$$\sqrt[3]{1-u}-1=\frac{-u}{(1-u)^{2/3}+(1-u)^{1/3}+1}.$$
于是原比值等于
$$-\frac{u}{e^u-1}\frac1{(1-u)^{2/3}+(1-u)^{1/3}+1}\to-\frac13.$$`
  }),
  lectureThirteen({
    id: 'example-13-3-partial-derivatives-absolute', role: 'example', page: 'PDF 314-315 · 书页 309-310 · 例 13.3',
    fingerprint: 'partial-derivative:absolute-x-sine-one-sided-failure-at-nonzero-y',
    title: '例 13.3 · 含绝对值函数在指定点的偏导数',
    statement: raw`设 $f(x,y)=\ln\bigl(y+|x\sin y|\bigr)$，判断 $f_x(0,1)$ 与 $f_y(0,1)$ 是否存在，并求存在者的值。`,
    tags: ['偏导数定义计算', '绝对值函数'],
    coreMethod: '分别固定另一个变量，直接按偏导数定义计算；对含绝对值的差商必须比较左右极限。',
    mistakes: raw`不能把 $|x|$ 在 $x=0$ 处机械写成导数 $0$；$f_x(0,1)$ 的左右差商符号相反。`,
    answerText: raw`$f_x(0,1)$ 不存在，$f_y(0,1)=1$。`,
    methodOne: raw`固定 $y=1$：
$$\frac{f(x,1)-f(0,1)}x=\frac{\ln(1+|x\sin1|)}x\sim\frac{|x|\,|\sin1|}{x},$$
左右极限相反，故 $f_x(0,1)$ 不存在。固定 $x=0$，$f(0,y)=\ln y$，所以 $f_y(0,1)=1$。`,
    methodTwo: raw`在 $y=1$ 的截线上，$x\mapsto\ln(1+c|x|)$（$c=|\sin1|>0$）在原点形成尖点，故横向偏导不存在；在 $x=0$ 的截线上函数就是 $\ln y$，纵向导数为 $1/y$，在 $y=1$ 处等于 $1$。`
  }),
  lectureThirteen({
    id: 'example-13-4-variable-integral-partials', role: 'example', page: 'PDF 315-316 · 书页 310-311 · 例 13.4',
    fingerprint: 'variable-integral:linear-kernel-moving-upper-limit-wave-identity',
    title: '例 13.4 · 含变上限积分的偏导关系',
    statement: raw`设 $f$ 连续，
$$F(x,y)=\int_0^{x-y}(x-y-t)f(t)\,dt.$$
判断 $F_x,F_y,F_{xx},F_{yy}$ 的关系。`,
    questionFormat: 'single-choice', options: [
      '$F_x=F_y,\ F_{xx}=F_{yy}$', '$F_x=F_y,\ F_{xx}=-F_{yy}$',
      '$F_x=-F_y,\ F_{xx}=F_{yy}$', '$F_x=-F_y,\ F_{xx}=-F_{yy}$'
    ], correctOptionIds: ['C'],
    tags: ['变上限积分偏导', '复合函数结构', '选择题'],
    coreMethod: raw`先识别 $F$ 只依赖 $u=x-y$；也可展开成 $u\int_0^u f(t)dt-\int_0^u tf(t)dt$ 后求导。`,
    mistakes: '对变上限积分求导时，端点项与核函数的偏导项都要处理；本题端点处核函数恰为零。',
    answerText: '正确选项为 C：$F_x=-F_y$，且 $F_{xx}=F_{yy}$。',
    methodOne: raw`令 $u=x-y$，记 $H(u)=\int_0^u(u-t)f(t)dt$，则 $F(x,y)=H(x-y)$。因此
$$F_x=H'(u),\quad F_y=-H'(u),\quad F_{xx}=F_{yy}=H''(u).$$`,
    methodTwo: raw`由 Leibniz 求导，
$$F_x=\int_0^{x-y}f(t)dt,\qquad F_y=-\int_0^{x-y}f(t)dt.$$
再求一次得
$$F_{xx}=f(x-y),\qquad F_{yy}=f(x-y),$$
关系与选项 C 一致。`
  }),
  lectureThirteen({
    id: 'example-13-5-gaussian-parameter-integral', role: 'example', page: 'PDF 316 · 书页 311 · 例 13.5',
    fingerprint: 'parameter-integral:gaussian-upper-infinity-scale-before-differentiate',
    title: '例 13.5 · 高斯型含参积分在无穷上限处的偏导',
    statement: raw`设
$$f(x,y)=\int_0^y e^{-xt^2}\,dt,$$
求 $f_x(1,+\infty)$。`,
    tags: ['含参积分偏导', '高斯积分'],
    coreMethod: raw`先算 $f(x,+\infty)$，用 $u=\sqrt{x}t$ 提取 $x^{-1/2}$，再对 $x$ 求导。`,
    mistakes: '若直接把偏导移入反常积分，必须同时确认积分收敛；先完成尺度变换更短且不易丢系数。',
    answerText: raw`$$f_x(1,+\infty)=-\frac{\sqrt\pi}{4}.$$`,
    methodOne: raw`当 $x>0$ 时，
$$f(x,+\infty)=\frac1{\sqrt{x}}\int_0^{+\infty}e^{-u^2}du
=\frac{\sqrt\pi}{2\sqrt{x}}.$$
因此
$$f_x(1,+\infty)=\left.-\frac{\sqrt\pi}{4x^{3/2}}\right|_{x=1}=-\frac{\sqrt\pi}{4}.$$`,
    methodTwo: raw`在收敛条件 $x>0$ 下对参数求导，
$$f_x(x,+\infty)=-\int_0^{+\infty}t^2e^{-xt^2}dt.$$
令 $u=\sqrt{x}t$，并由 $\int_0^{+\infty}u^2e^{-u^2}du=\sqrt\pi/4$，得到 $f_x=-\sqrt\pi/(4x^{3/2})$，代 $x=1$ 即得。`
  }),
  lectureThirteen({
    id: 'example-13-6-reconstruct-function-from-partials', role: 'example', page: 'PDF 317 · 书页 312 · 例 13.6',
    fingerprint: 'reconstruct-function:compatible-first-order-partials-initial-value',
    title: '例 13.6 · 由两个偏导方程恢复二元函数',
    statement: raw`设 $f$ 可微，且
$$f(0,0)=0,\qquad f_x=-f(x,y),\qquad f_y=e^{-x}\cos y.$$
求 $f(x,y)$。`,
    tags: ['由偏导恢复函数', '一阶微分方程'],
    coreMethod: '先对其中一个偏导积分，保留只依赖另一变量的积分“常数”，再用另一个偏导方程确定它。',
    mistakes: raw`对 $y$ 积分后的常数应写成 $\varphi(x)$，不能直接写成常数；最后还要使用 $f(0,0)=0$。`,
    answerText: raw`$$f(x,y)=e^{-x}\sin y.$$`,
    methodOne: raw`由 $f_y=e^{-x}\cos y$，
$$f=e^{-x}\sin y+\varphi(x).$$
代入 $f_x=-f$ 得 $\varphi'+\varphi=0$，故 $\varphi=Ce^{-x}$。再由 $f(0,0)=0$ 得 $C=0$。`,
    methodTwo: raw`固定 $y$，方程 $f_x=-f$ 给出 $f(x,y)=A(y)e^{-x}$。于是
$$A'(y)e^{-x}=e^{-x}\cos y,$$
所以 $A(y)=\sin y+C$。初值要求 $A(0)=0$，故 $C=0$。`
  }),
  lectureThirteen({
    id: 'example-13-7-exact-differential-parameters', role: 'example', page: 'PDF 320 · 书页 315 · 例 13.7',
    fingerprint: 'exact-differential:match-mixed-partials-polynomial-trigonometric-parameters',
    title: '例 13.7 · 由全微分确定参数',
    statement: raw`已知
$$\bigl(axy^3-y^2\cos x\bigr)dx+\bigl(1+by\sin x+3x^2y^2\bigr)dy$$
是某个二元函数 $u(x,y)$ 的全微分，求 $(a,b)$。`,
    questionFormat: 'single-choice', options: ['$(2,2)$', '$(2,-2)$', '$(-2,2)$', '$(-2,-2)$'], correctOptionIds: ['B'],
    tags: ['全微分参数匹配', '混合偏导', '选择题'],
    coreMethod: raw`令 $u_x=P,u_y=Q$，在偏导连续条件下使用 $P_y=Q_x$，再按 $xy^2$ 与 $y\cos x$ 的系数分别比较。`,
    mistakes: raw`$u_{xy}$ 是先对 $u_x$ 关于 $y$ 求导；$-y^2\cos x$ 对 $y$ 求导仍保留负号。`,
    answerText: '正确选项为 B：$a=2,b=-2$。',
    methodOne: raw`有
$$P_y=3axy^2-2y\cos x,\qquad Q_x=by\cos x+6xy^2.$$
恒等要求对应系数相等，故 $3a=6$ 且 $b=-2$，即 $(a,b)=(2,-2)$。`,
    methodTwo: raw`先对 $P$ 关于 $x$ 积分：
$$u=\frac a2x^2y^3-y^2\sin x+\phi(y).$$
于是 $u_y=\frac{3a}{2}x^2y^2-2y\sin x+\phi'(y)$。与题给 $Q$ 比较，得到 $a=2,b=-2,\phi'(y)=1$。`
  }),
  lectureThirteen({
    id: 'example-13-8-two-differentiability-tests', role: 'example', page: 'PDF 320-321 · 书页 315-316 · 例 13.8',
    fingerprint: 'differentiability:remainder-order-xy-versus-xabsy-over-radius',
    title: '例 13.8 · 两个零偏导函数在原点的可微性',
    statement: raw`设
$$z_1=|xy|,\qquad z_2=\begin{cases}\displaystyle\frac{x|y|}{\sqrt{x^2+y^2}},&(x,y)\ne(0,0),\\0,&(x,y)=(0,0).
\end{cases}$$
判断 $z_1,z_2$ 在原点是否可微。`,
    questionFormat: 'single-choice', options: ['两者均不可微', '$z_1$ 不可微、$z_2$ 可微', '$z_1$ 可微、$z_2$ 不可微', '两者均可微'], correctOptionIds: ['C'],
    tags: ['可微性余项判定', '选择题'],
    coreMethod: '先按定义求出原点两个偏导均为零，再把函数增量除以距离，判断余项是否为高阶无穷小。',
    mistakes: '偏导存在不等于可微；必须检验二维余项沿所有路径都趋于零。',
    answerText: '正确选项为 C：$z_1$ 在原点可微，$z_2$ 在原点不可微。',
    methodOne: raw`两函数在原点的偏导均为零。对 $z_1$，
$$\frac{|xy|}{\sqrt{x^2+y^2}}\le\frac12\sqrt{x^2+y^2}\to0,$$
故可微。对 $z_2$，余项比值为 $x|y|/(x^2+y^2)$；沿 $y=x>0$ 等于 $1/2$，故不可微。`,
    methodTwo: raw`用极坐标：$z_1=r^2|\sin\theta\cos\theta|=O(r^2)=o(r)$，满足可微定义；而 $z_2=r\cos\theta|\sin\theta|$，除以 $r$ 后一般不趋于零，因此不可微。`
  }),
  lectureThirteen({
    id: 'example-13-9-mixed-chain-derivative', role: 'example', page: 'PDF 322-323 · 书页 317-318 · 例 13.9',
    fingerprint: 'chain-rule:mixed-second-derivative-first-jet-cancellation-origin',
    title: '例 13.9 · 二元复合函数在原点的混合二阶偏导',
    statement: raw`设
$$z=f(e^x\sin y,x^2+y^2),$$
$f$ 有二阶连续偏导，且 $f_1'(0,0)=1,f_2'(0,0)=-1$。求 $z_{xy}(0,0)$。`,
    questionFormat: 'single-choice', options: ['0', '1', '2', '-1'], correctOptionIds: ['B'],
    tags: ['复合函数二阶偏导', '链式法则', '选择题'],
    coreMethod: '先写一阶链式法则，再对另一变量求导；到原点后大量含一阶内函数因子的项自动消失。',
    mistakes: raw`$f_1',f_2'$ 的下标表示对第几个自变量求偏导；不能把已知的 $f_2'(0,0)=-1$ 漏掉。`,
    answerText: '正确选项为 B：$z_{xy}(0,0)=1$。',
    methodOne: raw`令 $u=e^x\sin y,v=x^2+y^2$，则 $z_x=f_1u_x+f_2v_x$。再对 $y$ 求导并在原点代入：$u_x=0,v_x=0,u_y=1,v_y=0,u_{xy}=1,v_{xy}=0$，故所有含 $f_{ij}$ 的项消失，只剩
$$z_{xy}(0,0)=f_1(0,0)u_{xy}=1.$$`,
    methodTwo: raw`在原点附近，$u=y+xy+o(xy)+O(y^3)$，$v=x^2+y^2$。$f$ 的一阶展开为
$$f(u,v)=f(0,0)+u-v+O(u^2+v^2).$$
其中 $xy$ 项只来自 $u$，系数为 $1$，所以混合偏导为 $1$。`
  }),
  lectureThirteen({
    id: 'example-13-10-partial-on-curve', role: 'example', page: 'PDF 323 · 书页 318 · 例 13.10',
    fingerprint: 'chain-rule:known-trace-and-partial-along-exponential-curve',
    title: '例 13.10 · 由曲线上的函数值与偏导求另一偏导',
    statement: raw`设 $f(x,e^x)=x+e^x$，且
$$f_x(x,y)\big|_{y=e^x}=1+2e^x.$$
求 $f_y(x,y)\big|_{y=e^x}$。`,
    tags: ['沿曲线链式法则', '偏导反求'],
    coreMethod: raw`对恒等式 $f(x,e^x)=x+e^x$ 关于 $x$ 求全导数，把已知的 $f_x$ 代入后解 $f_y$。`,
    mistakes: raw`$d[f(x,e^x)]/dx$ 不是单独的 $f_x$，还包含 $f_y e^x$。`,
    answerText: raw`$$f_y(x,y)\big|_{y=e^x}=-1.$$`,
    methodOne: raw`沿曲线求导：
$$f_x(x,e^x)+e^x f_y(x,e^x)=1+e^x.$$
代入 $f_x(x,e^x)=1+2e^x$，得 $e^xf_y=-e^x$，故 $f_y=-1$。`,
    methodTwo: raw`令 $F(x)=f(x,e^x)-x-e^x\equiv0$，则
$$F'=f_x+e^xf_y-1-e^x=0.$$
在曲线上代入已知偏导，仍得 $e^x(f_y+1)=0$；因 $e^x>0$，所以 $f_y=-1$。`
  }),
  lectureThirteen({
    id: 'example-13-11-gradient-under-transform', role: 'example', page: 'PDF 323-324 · 书页 318-319 · 例 13.11',
    fingerprint: 'coordinate-transform:gradient-norm-hyperbolic-composite-coefficients',
    title: '例 13.11 · 变量代换后的梯度平方关系',
    statement: raw`设对任意 $x,y$ 有
$$f_x^2+f_y^2=4.$$
作代换 $x=uv, y=(u^2-v^2)/2$，令 $g(u,v)=f(x,y)$。若
$$a g_u^2-b g_v^2=u^2+v^2,$$
求 $a,b$。`,
    tags: ['变量代换梯度', '链式法则配系数'],
    coreMethod: '用链式法则写出 $g_u,g_v$，展开后利用原梯度平方恒等式比较系数。',
    mistakes: raw`$y_v=-v$ 带负号；目标式中本来就是 $a g_u^2-b g_v^2$，不要把 $b$ 的符号重复处理。`,
    answerText: raw`$$a=\frac14,\qquad b=-\frac14.$$`,
    methodOne: raw`有
$$g_u=vf_x+uf_y,\qquad g_v=uf_x-vf_y.$$
要消去交叉项需 $a+b=0$；此时
$$a g_u^2-b g_v^2=a(u^2+v^2)(f_x^2+f_y^2)=4a(u^2+v^2).$$
故 $a=1/4,b=-1/4$。`,
    methodTwo: raw`代换的 Jacobian 两列向量为 $(v,u)$ 与 $(u,-v)$，它们正交且模平方均为 $u^2+v^2$。因此
$$g_u^2+g_v^2=(u^2+v^2)(f_x^2+f_y^2)=4(u^2+v^2).$$
题式必须等于 $(g_u^2+g_v^2)/4$，故 $a=1/4,-b=1/4$。`
  }),
  lectureThirteen({
    id: 'example-13-12-implicit-total-differential', role: 'example', page: 'PDF 324 · 书页 319 · 例 13.12',
    fingerprint: 'implicit-differential:exponential-linear-form-plus-xyz-origin',
    title: '例 13.12 · 隐函数在原点的全微分',
    statement: raw`由方程
$$e^{x+2y+3z}+xyz=1$$
确定 $z=z(x,y)$，求 $dz\big|_{(0,0)}$。`,
    tags: ['隐函数全微分', '全微分形式不变性'],
    coreMethod: '先由原方程确定原点对应的 $z=0$，再对方程两边作全微分并代点。',
    mistakes: '不能漏掉 $xyz$ 的三个乘积微分项；代点必须在完成微分后进行。',
    answerText: raw`$$dz\big|_{(0,0)}=-\frac13dx-\frac23dy.$$`,
    methodOne: raw`在 $x=y=0$ 时方程给出 $e^{3z}=1$，故 $z=0$。全微分为
$$e^{x+2y+3z}(dx+2dy+3dz)+yz\,dx+xz\,dy+xy\,dz=0.$$
代入 $(0,0,0)$ 得 $dx+2dy+3dz=0$，解出结论。`,
    methodTwo: raw`令 $F=e^{x+2y+3z}+xyz-1$。在原点
$$F_x=1,\quad F_y=2,\quad F_z=3\ne0.$$
因此 $z_x=-F_x/F_z=-1/3,z_y=-F_y/F_z=-2/3$，故 $dz=z_xdx+z_ydy$。`
  }),
  lectureThirteen({
    id: 'example-13-16-implicit-composite-identity', role: 'example', page: 'PDF 327-328 · 书页 322-323 · 例 13.16',
    fingerprint: 'implicit-composite:two-invariants-eliminate-unknown-partials-euler-combination',
    title: '例 13.16 · 复合隐函数中的导数组合消元',
    statement: raw`函数 $z=z(x,y)$ 由
$$F\left(x+\frac zy,\ y+\frac zx\right)=0$$
确定，其中 $F$ 有连续偏导。求 $xz_x+yz_y$。`,
    tags: ['复合隐函数消元', '隐函数偏导'],
    coreMethod: '分别对 $x,y$ 求导得到含 $F_1,F_2$ 的两个方程，再构造 $xz_x+yz_y$ 使未知偏导组合消去。',
    mistakes: raw`对 $z/y$ 关于 $y$ 求导应为 $z_y/y-z/y^2$；对 $z/x$ 关于 $x$ 求导同样包含商的第二项。`,
    answerText: raw`$$xz_x+yz_y=z-xy.$$`,
    methodOne: raw`记 $u=x+z/y,v=y+z/x$。对原式分别求导并整理，可得
$$z_x=\frac{-xF_1+yF_2}{xF_1+yF_2}\frac zx-\frac{xyF_1}{xF_1+yF_2},$$
$$z_y=\frac{xF_1-yF_2}{xF_1+yF_2}\frac zy-\frac{xyF_2}{xF_1+yF_2}.$$
乘以 $x,y$ 后相加，含差的两项抵消，得到 $xz_x+yz_y=z-xy$。`,
    methodTwo: raw`沿尺度路径 $(x,y)\mapsto(tx,ty)$，令 $Z(t)=z(tx,ty)$。两内变量变为
$$tx+\frac{Z(t)}{ty},\qquad ty+\frac{Z(t)}{tx}.$$
在 $t=1$ 对隐式关系求导并消去 $F_1,F_2$，得到 $Z'(1)=z-xy$。而链式法则给出 $Z'(1)=xz_x+yz_y$。`
  }),
  lectureThirteen({
    id: 'example-13-19-implicit-strict-maximum', role: 'example', page: 'PDF 332 · 书页 327 · 例 13.19',
    fingerprint: 'implicit-extremum:stationary-solve-hessian-strict-maximum',
    title: '例 13.19 · 隐函数的驻点与严格极大值',
    statement: raw`已知 $z=z(x,y)$ 由
$$ (x^2+y^2)z+\ln z+2(x+y+1)=0\qquad(z>0)$$
确定，求 $z(x,y)$ 的极值。`,
    tags: ['隐函数极值', '二阶充分条件'],
    coreMethod: raw`由 $F_x=F_y=0$ 联立原方程求驻点，再利用 $F_z>0$ 把 $z$ 的二阶偏导符号转化为 $F$ 的二阶信息。`,
    mistakes: raw`必须保留定义域 $z>0$；求得驻点后还要判定 Hessian，而不能只凭 $z_x=z_y=0$ 下结论。`,
    answerText: raw`$z$ 在 $(-1,-1)$ 处取得严格极大值 $1$。`,
    methodOne: raw`令 $F=(x^2+y^2)z+\ln z+2(x+y+1)$。因
$$F_z=x^2+y^2+1/z>0,$$
驻点满足 $F_x=2xz+2=0,F_y=2yz+2=0$，即 $x=y=-1/z$。代回 $F=0$ 得 $z=1$，故点为 $(-1,-1)$。在该点 $z_{xx}=z_{yy}=-2/3,z_{xy}=0$，Hessian 负定，所以为严格极大值。`,
    methodTwo: raw`在驻点邻域由 $F_z>0$，固定 $(x,y)$ 时 $F$ 随 $z$ 严格增加。将 $z=1$ 代入，
$$F(x,y,1)=x^2+y^2+2x+2y+2=(x+1)^2+(y+1)^2\ge0.$$
而 $F(x,y,z(x,y))=0$，故邻域内 $z(x,y)\le1$，等号仅在 $(-1,-1)$，直接得到严格极大值。`
  }),
  lectureThirteen({
    id: 'example-13-20-constrained-parabolic-area', role: 'example', page: 'PDF 333 · 书页 328 · 例 13.20',
    fingerprint: 'constrained-extremum:parabola-line-enclosed-area-ellipse-parameters',
    title: '例 13.20 · 参数约束下抛物线与直线围成面积的最值',
    statement: raw`设 $a\le0,b\ge0$ 且
$$\int_a^b |x|\,dx=\frac12.$$
求曲线 $y=x^2+ax$ 与直线 $y=bx$ 所围区域面积的最大值与最小值。`,
    tags: ['约束极值面积', '拉格朗日乘子'],
    coreMethod: raw`先把积分约束化为 $a^2+b^2=1$，再算交点与面积 $S=(b-a)^3/6$，转为求 $b-a$ 的约束最值。`,
    mistakes: '题设 $a\le0\le b$ 使积分跨过原点；面积积分上下限由两曲线交点确定，边界情形也必须比较。',
    answerText: raw`面积最大值为 $\sqrt2/3$，最小值为 $1/6$。`,
    methodOne: raw`约束为
$$\frac{a^2+b^2}{2}=\frac12\Longrightarrow a^2+b^2=1.$$
两曲线交于 $x=0,b-a$，所围面积
$$S=\int_0^{b-a}\bigl[(b-a)x-x^2\bigr]dx=\frac{(b-a)^3}{6}.$$
由约束下 $1\le b-a\le\sqrt2$，得 $1/6\le S\le\sqrt2/3$。`,
    methodTwo: raw`令 $a=-\cos\theta,b=\sin\theta$，$0\le\theta\le\pi/2$。则 $b-a=\sin\theta+\cos\theta$，在 $\theta=\pi/4$ 取最大 $\sqrt2$，在端点取最小 $1$。代入 $S=(b-a)^3/6$ 即得。`
  }),
  lectureThirteen({
    id: 'example-13-21-nearest-point-parabola-line', role: 'example', page: 'PDF 334-335 · 书页 329-330 · 例 13.21',
    fingerprint: 'distance-extremum:parabola-to-line-tangency-lagrange',
    title: '例 13.21 · 抛物线到直线的最近点',
    statement: raw`求曲线
$$x^2+4y^2=4$$
上与直线 $2x+3y-6=0$ 距离最近的点，并求最短距离。`,
    tags: ['点到直线距离最值', '切线平行'],
    coreMethod: '把点到直线的距离化为约束下线性函数的最值；也可利用最近点处曲线切线与给定直线平行。',
    mistakes: raw`距离分母是法向量模 $\sqrt{13}$；在椭圆上既有最近点也有最远点，需根据 $|2x+3y-6|$ 选对。`,
    answerText: raw`最近点为 $\left(\frac85,\frac35\right)$，最短距离为 $1/\sqrt{13}$。`,
    methodOne: raw`在椭圆上最大化 $2x+3y$ 即可使其最接近 $6$。构造
$$L=2x+3y+\lambda(x^2+4y^2-4).$$
由 $2+2\lambda x=0,3+8\lambda y=0$ 与约束解得 $x=8/5,y=3/5$。此时 $2x+3y=5$，故距离为 $(6-5)/\sqrt{13}=1/\sqrt{13}$。`,
    methodTwo: raw`椭圆切线斜率为 $y'=-x/(4y)$，给定直线斜率为 $-2/3$。最近点处两切线平行，故 $x/(4y)=2/3$，即 $3x=8y$。联立 $x^2+4y^2=4$ 取靠近直线的一支，得到 $(8/5,3/5)$，再代距离公式。`
  }),
  lectureThirteen({
    id: 'exercise-13-1-continuous-candidate', role: 'exercise', page: 'PDF 336-337 · 书页 331-332 · 习题 13.1',
    fingerprint: 'continuity-choice:origin-rational-candidates-path-screening-and-bound',
    title: '习题 13.1 · 从四个候选式中识别原点连续函数',
    statement: raw`设 $f(0,0)=0$，且 $f$ 在原点连续。则当 $(x,y)\ne(0,0)$ 时，$f(x,y)$ 可能为哪一项？`,
    questionFormat: 'single-choice', options: [
      raw`$\displaystyle\frac{xy}{x^2+y^2}$`, raw`$\displaystyle\frac{x^2-y^2}{x^2+y^2}$`,
      raw`$\displaystyle\frac{x^2y}{x^2+y^2}$`, raw`$\displaystyle\frac{x^2y}{x^4+y^2}$`
    ], correctOptionIds: ['C'],
    tags: ['连续性候选筛选', '选择题'],
    coreMethod: '连续要求二元极限为零；对可疑项用直线路径或抛物线路径否定，对候选 C 用基本不等式作统一估计。',
    mistakes: '只代坐标轴会误判 A、B、D；分母含 $x^4$ 时应尝试 $y=kx^2$。',
    answerText: '正确选项为 C。',
    methodOne: raw`对 C，
$$\left|\frac{x^2y}{x^2+y^2}\right|\le\frac12|x|\to0,$$
故可连续补零。A、B 沿 $y=kx$ 得到依赖 $k$ 的结果；D 沿 $y=kx^2$ 得到 $k/(1+k^2)$，均不连续。`,
    methodTwo: raw`用极坐标，C 化为 $r\cos^2\theta\sin\theta$，绝对值被 $r$ 控制；A、B 的极坐标式不含 $r$。D 采用加权极坐标的等价路径 $y=kx^2$，同样暴露方向依赖。`
  }),
  lectureThirteen({
    id: 'exercise-13-4-chain-cancellation', role: 'exercise', page: 'PDF 336-338 · 书页 331-333 · 习题 13.4',
    fingerprint: 'chain-rule:euler-operator-cancel-product-invariant-second-component',
    title: '习题 13.4 · 用 Euler 型算子消去复合函数项',
    statement: raw`设 $f,g$ 可微，
$$z=f\bigl(xy,\ln x+g(xy)\bigr).$$
求 $xz_x-yz_y$。`,
    questionFormat: 'single-choice', options: ['$f_1\prime$', '$f_2\prime$', '$f_1\prime+f_2\prime$', '$f_1\prime-f_2\prime$'], correctOptionIds: ['B'],
    tags: ['Euler型链式消元', '选择题'],
    coreMethod: raw`分别求 $z_x,z_y$，再用算子 $x\partial_x-y\partial_y$；它会消去所有只依赖 $xy$ 的项，只留下 $\ln x$ 的贡献。`,
    mistakes: raw`答案中的 $f_2'$ 是 $f$ 对第二个位置变量的偏导，并非 $g'$。`,
    answerText: '正确选项为 B：$xz_x-yz_y=f_2\prime$。',
    methodOne: raw`记 $u=xy,v=\ln x+g(xy)$。则
$$z_x=f_1y+f_2(1/x+g'y),\qquad z_y=f_1x+f_2g'x.$$
故
$$xz_x-yz_y=f_2.$$`,
    methodTwo: raw`算子 $D=x\partial_x-y\partial_y$ 满足 $D(xy)=0$，且
$$D[\ln x+g(xy)]=1.$$
对 $z=f(u,v)$ 用链式法则，$Dz=f_1Du+f_2Dv=f_2$。`
  }),
  lectureThirteen({
    id: 'exercise-13-6-demand-elasticity', role: 'exercise', page: 'PDF 337-339 · 书页 332-334 · 习题 13.6',
    fingerprint: 'economic-elasticity:cross-price-demand-polynomial-at-specified-prices',
    title: '习题 13.6 · 双商品需求函数的自身价格弹性',
    statement: raw`商品 A 的需求函数为
$$Q_A=500-p_A^2-p_Ap_B+2p_B^2.$$
当 $p_A=10,p_B=20$ 时，求商品 A 对自身价格的弹性 $\eta_{AA}>0$。`,
    tags: ['需求弹性多元函数', '经济应用'],
    coreMethod: raw`使用自身价格弹性 $\eta_{AA}=-(p_A/Q_A)\,\partial Q_A/\partial p_A$，先算需求量与偏导再代点。`,
    mistakes: '需求价格弹性按约定带负号；$p_B$ 固定但交叉项 $-p_Ap_B$ 对 $p_A$ 的偏导不能丢。',
    answerText: raw`$$\eta_{AA}=0.4.$$`,
    methodOne: raw`有
$$Q_A(10,20)=500-100-200+800=1000,$$
$$\frac{\partial Q_A}{\partial p_A}=-2p_A-p_B=-40.$$
因此 $\eta_{AA}=-(10/1000)(-40)=0.4$。`,
    methodTwo: raw`价格增加一个相对量 $dp_A/p_A$ 时，需求的相对变化一阶近似为 $(Q_{A,p_A}dp_A)/Q_A$。取其相反数与价格相对变化之比，仍得
$$-\frac{p_AQ_{A,p_A}}{Q_A}=\frac{10\cdot40}{1000}=0.4.$$`
  }),
  lectureThirteen({
    id: 'exercise-13-7-ratio-square-differential', role: 'exercise', page: 'PDF 337-339 · 书页 332-334 · 习题 13.7',
    fingerprint: 'total-differential:one-plus-ratio-squared-at-one-one',
    title: '习题 13.7 · 比值复合函数的全微分',
    statement: raw`设
$$z=\left(1+\frac xy\right)^2,$$
求 $dz\big|_{(1,1)}$。`,
    tags: ['全微分直接计算', '比值复合'],
    coreMethod: raw`令 $u=x/y$，先求 $dz/du$ 与 $du$，再代入 $(1,1)$。`,
    mistakes: raw`$\partial(x/y)/\partial y=-x/y^2$ 带负号。`,
    answerText: raw`$$dz\big|_{(1,1)}=4(dx-dy).$$`,
    methodOne: raw`$$z_x=\frac2y\left(1+\frac xy\right),\qquad z_y=-\frac{2x}{y^2}\left(1+\frac xy\right).$$
在 $(1,1)$ 处分别为 $4,-4$，故 $dz=4dx-4dy$。`,
    methodTwo: raw`令 $u=x/y$，则 $dz=2(1+u)du$，且
$$du=\frac1y dx-\frac{x}{y^2}dy.$$
在 $(1,1)$ 处 $u=1,du=dx-dy$，所以 $dz=4(dx-dy)$。`
  }),
  lectureThirteen({
    id: 'exercise-13-8-composite-differential', role: 'exercise', page: 'PDF 337-339 · 书页 332-334 · 习题 13.8',
    fingerprint: 'total-differential:unknown-univariate-derivative-composed-quadratic-point',
    title: '习题 13.8 · 已知一元导数的二元复合全微分',
    statement: raw`设 $f$ 可微且 $f'(0)=1/2$，令
$$z=f(4x^2-y^2).$$
求 $dz\big|_{(1,2)}$。`,
    tags: ['一元复合全微分', '链式法则'],
    coreMethod: raw`内函数在 $(1,2)$ 处正好等于 $0$，所以所有外层导数都可替换为已知的 $f'(0)$。`,
    mistakes: '先确认外函数导数的取值点；不能把 $f\prime(0)$ 当作 $f(0)$。',
    answerText: raw`$$dz\big|_{(1,2)}=4dx-2dy.$$`,
    methodOne: raw`令 $u=4x^2-y^2$，则
$$dz=f'(u)(8x\,dx-2y\,dy).$$
在 $(1,2)$ 处 $u=0$，代入 $f'(0)=1/2$ 得 $dz=4dx-2dy$。`,
    methodTwo: raw`分别计算
$$z_x=8xf'(4x^2-y^2),\qquad z_y=-2yf'(4x^2-y^2).$$
在 $(1,2)$ 处得到 $z_x=4,z_y=-2$，故全微分如上。`
  }),
  lectureThirteen({
    id: 'exercise-13-9-power-implicit-derivative', role: 'exercise', page: 'PDF 337-340 · 书页 332-335 · 习题 13.9',
    fingerprint: 'implicit-derivative:variable-base-power-z-plus-y-to-x',
    title: '习题 13.9 · 变底数幂方程确定的隐函数偏导',
    statement: raw`设 $z=z(x,y)$ 由
$$ (z+y)^x=x^2$$
确定，求 $z_x(1,1)$。`,
    tags: ['变底数幂隐函数', '隐函数偏导'],
    coreMethod: '先由原方程确定目标点对应的 $z=0$，把方程写成零函数后使用隐函数偏导公式。',
    mistakes: raw`对 $(z+y)^x$ 关于 $x$ 求偏导时，既有 $\ln(z+y)$ 项，也有通过 $z$ 产生的项。`,
    answerText: raw`$$z_x(1,1)=2.$$`,
    methodOne: raw`令 $F=(z+y)^x-x^2$。在 $(x,y)=(1,1)$ 时原方程给出 $z=0$。偏导为
$$F_x=(z+y)^x\ln(z+y)-2x,\qquad F_z=x(z+y)^{x-1}.$$
故 $F_x=-2,F_z=1$，于是 $z_x=-F_x/F_z=2$。`,
    methodTwo: raw`对原式取对数：$x\ln(z+y)=2\ln x$。固定 $y$ 对 $x$ 求导，
$$\ln(z+y)+\frac{xz_x}{z+y}=\frac2x.$$
在 $(1,1,z=0)$ 代入，直接得到 $z_x=2$。`
  }),
  lectureThirteen({
    id: 'exercise-13-13-reconstruct-and-extremum', role: 'exercise', page: 'PDF 337,341 · 书页 332,336 · 习题 13.13',
    fingerprint: 'reconstruct-function:mixed-derivative-boundary-data-then-extremum',
    title: '习题 13.13 · 由混合偏导和边界数据求函数极值',
    statement: raw`已知
$$f_{xy}(x,y)=2(y+1)e^x,\qquad f_x(x,0)=(x+1)e^x,\qquad f(0,y)=y^2+2y.$$
求 $f(x,y)$ 的极值。`,
    tags: ['由混合偏导恢复函数', '二元极值'],
    coreMethod: '依次积分并使用两条边界数据消去任意函数，再解驻点并用 Hessian 判定。',
    mistakes: '对混合偏导积分会出现任意一元函数；两条边界条件分别负责确定不同的任意函数。',
    answerText: raw`$f$ 在 $(0,-1)$ 处取得严格极小值 $-1$。`,
    methodOne: raw`对 $y$ 积分得
$$f_x=(y+1)^2e^x+\phi(x).$$
由 $f_x(x,0)=(x+1)e^x$ 得 $\phi(x)=xe^x$。再对 $x$ 积分并用 $f(0,y)=y^2+2y$，得到
$$f=(y+1)^2e^x+(x-1)e^x-1.$$
解 $f_x=f_y=0$ 得 $(0,-1)$；该点 Hessian 正定，函数值为 $-1$。`,
    methodTwo: raw`把函数整理为
$$f(x,y)=e^x\bigl[(y+1)^2+x-1\bigr]-1.$$
由 $f_y=2(y+1)e^x=0$ 得 $y=-1$；再由 $f_x=e^x[(y+1)^2+x]=0$ 得 $x=0$。在该点 $f_{xx}=1,f_{yy}=2,f_{xy}=0$，故为严格极小值。`
  }),
  lectureThirteen({
    id: 'exercise-13-14-cubic-curve-distance', role: 'exercise', page: 'PDF 337,341-342 · 书页 332,336-337 · 习题 13.14',
    fingerprint: 'distance-extremum:first-quadrant-cubic-curve-lagrange-and-normal',
    title: '习题 13.14 · 第一象限三次曲线到原点的最远与最近距离',
    statement: raw`求曲线
$$x^3-xy+y^3=1\qquad(x\ge0,y\ge0)$$
上的点到原点的最短距离与最长距离。`,
    tags: ['曲线距离约束极值', '拉格朗日乘子'],
    coreMethod: raw`令目标函数为 $r^2=x^2+y^2$，与曲线约束建立拉格朗日方程；别忘记检查坐标轴端点。`,
    mistakes: '一阶条件只覆盖光滑内部点；本题还必须检查 $(1,0)$ 与 $(0,1)$ 两个边界点。',
    answerText: raw`最短距离为 $1$，最长距离为 $\sqrt2$。`,
    methodOne: raw`对 $F=x^2+y^2+\lambda(x^3-xy+y^3-1)$ 求驻点。内部点消元可得 $x=y$，代约束得 $x=y=1$，距离为 $\sqrt2$。轴上端点为 $(1,0),(0,1)$，距离均为 $1$。比较得最短 $1$、最长 $\sqrt2$。`,
    methodTwo: raw`最近点处圆 $x^2+y^2=r^2$ 与曲线相切，法向量满足
$$ (x,y)\parallel(3x^2-y,3y^2-x).$$
第一象限内部解给出 $x=y=1$；端点直接代入。曲线在第一象限的该支封闭于两端点与 $(1,1)$ 之间，比较三类候选即得结论。`
  })
]
