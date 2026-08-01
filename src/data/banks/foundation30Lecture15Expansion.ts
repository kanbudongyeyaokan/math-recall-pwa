import type { SeedInput } from './types'

const raw = String.raw
const ZY30_SOURCE = '何耀焜私人整理 · 张宇《基础30讲》高数 · 第15讲逐页核验'

type LectureFifteenSeed = Omit<SeedInput, 'id' | 'kind' | 'tags' | 'methodFingerprint' | 'source' | 'solutionMethods'> & {
  id: string
  role: 'example' | 'exercise'
  tags: string[]
  fingerprint: string
  methodOne: string
  methodTwo: string
}

function lectureFifteen(input: LectureFifteenSeed): SeedInput {
  const { id, role, tags, fingerprint, methodOne, methodTwo, ...seed } = input
  return {
    ...seed,
    id: `zy30-verified-l15-${id}`,
    kind: 'problem',
    source: ZY30_SOURCE,
    tags: ['高等数学', '第15讲', ...tags, role === 'example' ? '经典例题' : '课后习题', 'PDF逐页核验'],
    methodFingerprint: `zy30-verified:l15:${fingerprint}`,
    solutionMethods: [
      { title: '方法一 · 原书主线', content: methodOne },
      { title: '方法二 · 独立复核', content: methodTwo }
    ]
  }
}

export const foundation30Lecture15ExpansionSeeds: SeedInput[] = [
  lectureFifteen({
    id: 'example-15-1-extremum-from-ode', role: 'example', page: 'PDF 384 · 书页 379 · 例 15.1',
    fingerprint: 'linear-ode:stationary-point-second-derivative-sign',
    title: '例 15.1 · 由微分方程判断驻点类型',
    statement: raw`设 $y=f(x)$ 是方程
$$y''-2y'+4y=0$$
的一个解。若 $f(x_0)>0$ 且 $f'(x_0)=0$，则函数 $f(x)$ 在 $x_0$ 处（ ）。`,
    questionFormat: 'single-choice', options: ['取得极大值', '取得极小值', '某个邻域内单调增加', '某个邻域内单调减少'], correctOptionIds: ['A'],
    tags: ['二阶微分方程', '极值', '选择题'],
    coreMethod: '把驻点条件代回微分方程，直接得到二阶导数的符号，再使用极值的充分条件。',
    mistakes: '只看到一阶导数为零就判断极值；必须继续确定二阶导数非零且符号正确。',
    answerText: '正确选项为 A，$x_0$ 是 $f(x)$ 的极大值点。',
    methodOne: raw`在 $x=x_0$ 处代入方程：
$$f''(x_0)=2f'(x_0)-4f(x_0)=-4f(x_0)<0.$$
结合 $f'(x_0)=0$，由二阶充分条件知 $f$ 在 $x_0$ 处取得极大值。`,
    methodTwo: raw`把方程写成 $f''=2f'-4f$。驻点处切线水平，而函数值为正，所以曲率严格向下。连续性保证 $x_0$ 邻域内 $f''<0$，从而 $f'$ 由正变负，结论仍为极大值。`
  }),
  lectureFifteen({
    id: 'example-15-2-limit-without-solving', role: 'example', page: 'PDF 385 · 书页 380 · 例 15.2',
    fingerprint: 'linear-ode:initial-derivatives-lhopital-limit',
    title: '例 15.2 · 不求特解计算初值解极限',
    statement: raw`设 $y=y(x)$ 是二阶常系数线性方程
$$y''+py'+qy=e^{-2x}$$
满足 $y(0)=y'(0)=0$ 的特解，求
$$\lim_{x\to0}\frac{\ln(1+x^2)}{y(x)}.$$`,
    tags: ['初值问题', '洛必达法则'],
    coreMethod: raw`不必求出解；由方程和初值求 $y''(0)$，再对分子分母连续使用洛必达法则。`,
    mistakes: '误以为未知参数会影响结果；在 $x=0$ 处含 $p,q$ 的两项都被初值消去。',
    answerText: raw`$$2.$$`,
    methodOne: raw`由初值和方程得
$$y''(0)+p\,y'(0)+q\,y(0)=1,$$
故 $y''(0)=1$。连续两次使用洛必达法则：
$$\lim_{x\to0}\frac{\ln(1+x^2)}{y(x)}
=\lim_{x\to0}\frac{2/(1+x^2)-4x^2/(1+x^2)^2}{y''(x)}=2.$$`,
    methodTwo: raw`Taylor 展开更直接：$\ln(1+x^2)=x^2+o(x^2)$；而 $y(0)=y'(0)=0,y''(0)=1$，所以
$$y(x)=\frac12x^2+o(x^2).$$
两式相比即得极限为 $2$。`
  }),
  lectureFifteen({
    id: 'example-15-3-curve-from-slope', role: 'example', page: 'PDF 385-386 · 书页 380-381 · 例 15.3',
    fingerprint: 'separable-ode:recover-curve-from-tangent-slope-and-point',
    title: '例 15.3 · 由切线斜率与过点条件确定曲线',
    statement: raw`已知曲线 $y=f(x)$ 过点 $\left(0,-\frac12\right)$，且曲线上任一点 $(x,y)$ 处的切线斜率为
$$x\ln(1+x^2).$$
求 $f(x)$。`,
    tags: ['可分离变量', '曲线方程'],
    coreMethod: raw`把切线斜率直接写成 $y'=x\ln(1+x^2)$，积分后用过点条件确定常数。`,
    mistakes: raw`积分时不能漏掉分部积分项；所得原函数在 $x=0$ 处必须等于 $-1/2$。`,
    answerText: raw`$$f(x)=\frac12(1+x^2)\bigl[\ln(1+x^2)-1\bigr].$$`,
    methodOne: raw`由题意
$$dy=x\ln(1+x^2)dx.$$
令 $u=1+x^2$，则
$$y=\frac12\int\ln u\,du=\frac12[u\ln u-u]+C.$$
代入 $f(0)=-1/2$ 得 $C=0$，于是得到答案。`,
    methodTwo: raw`先对候选函数求导：
$$\frac d{dx}\left\{\frac12(1+x^2)[\ln(1+x^2)-1]\right\}=x\ln(1+x^2).$$
再代入 $x=0$ 得 $-1/2$，斜率与过点条件同时满足。`
  }),
  lectureFifteen({
    id: 'example-15-4-separable-implicit', role: 'example', page: 'PDF 386 · 书页 381 · 例 15.4',
    fingerprint: 'separable-ode:rational-logarithms-combine-implicit',
    title: '例 15.4 · 有理式分离变量方程的隐式通解',
    statement: raw`求微分方程
$$\frac{y\,dy}{1+y^2}=\frac{dx}{x(1+x^2)}$$
的通解。`,
    tags: ['可分离变量', '隐式通解'],
    coreMethod: '两边分别积分，将对数式合并为不含对数的隐式关系，并注意常数的取值范围。',
    mistakes: raw`$1/[x(1+x^2)]=1/x-x/(1+x^2)$；合并对数时不要丢掉平方与正值常数。`,
    answerText: raw`$$(1+x^2)(1+y^2)=Cx^2,$$
其中 $C>1$。`,
    methodOne: raw`分别积分：
$$\frac12\ln(1+y^2)=\ln|x|-\frac12\ln(1+x^2)+C_1.$$
两边乘 $2$ 并指数化，得到
$$\ln[(1+x^2)(1+y^2)]=\ln(Cx^2),$$
即所求隐式通解。`,
    methodTwo: raw`对隐式式取对数并求微分：
$$\frac{2x}{1+x^2}dx+\frac{2y}{1+y^2}dy=\frac{2}{x}dx.$$
整理即还原原方程；又因左侧除以 $x^2$ 恒大于 $1$，故 $C>1$。`
  }),
  lectureFifteen({
    id: 'example-15-5-shifted-variable', role: 'example', page: 'PDF 386-387 · 书页 381-382 · 例 15.5',
    fingerprint: 'shifted-variable:u-x-plus-y-trigonometric-separation',
    title: '例 15.5 · 换元后可分离的正弦方程',
    statement: raw`求微分方程
$$dy=\sin(x+y+100)\,dx$$
的通解。`,
    tags: ['换元后可分离', '三角积分'],
    coreMethod: '令 $u=x+y+100$，把含 $x+y$ 的方程化为关于 $u$ 的可分离变量方程。',
    mistakes: raw`$u'=1+y'$，不能把 $du$ 直接当成 $dy$；全局通解还包含被除去的常值相位分支。`,
    answerText: raw`$$\tan(x+y+100)-\sec(x+y+100)=x+C.$$`,
    methodOne: raw`令 $u=x+y+100$，则 $du/dx=1+\sin u$，所以
$$\frac{du}{1+\sin u}=dx.$$
利用
$$\frac1{1+\sin u}=\sec^2u-\tan u\sec u,$$
积分得 $\tan u-\sec u=x+C$，代回即得。`,
    methodTwo: raw`对答案两边求导，左侧关于 $u$ 的导数为
$$\sec^2u-\sec u\tan u=\frac1{1+\sin u}.$$
故 $u'/(1+\sin u)=1$，即 $1+y'=1+\sin u$，准确还原原方程。`
  }),
  lectureFifteen({
    id: 'example-15-6-tangent-intercept-locus', role: 'example', page: 'PDF 387 · 书页 382 · 例 15.6',
    fingerprint: 'homogeneous-ode:tangent-intercept-equals-distance-locus',
    title: '例 15.6 · 切线截距与到原点距离相等的轨迹',
    statement: raw`曲线在任一点 $P(x,y)$（$y<0$）到原点的距离，等于该点切线在 $y$ 轴上的截距。若曲线经过 $\left(\frac12,0\right)$，求曲线方程。`,
    tags: ['齐次方程', '几何应用'],
    coreMethod: '用点斜式写出切线的纵截距，把几何距离条件翻译为只含 $y/x$ 的齐次微分方程。',
    mistakes: raw`纵截距是 $y-xy'$；开方和最后取支必须结合 $x>0$、曲线位置判断。`,
    answerText: raw`$$y=\frac14-x^2,\qquad x>0.$$`,
    methodOne: raw`切线纵截距为 $y-xy'$。由题意
$$\sqrt{x^2+y^2}=y-xy'.$$
整理并令 $u=y/x$，可化为
$$\frac{du}{\sqrt{1+u^2}}=-\frac{dx}{x}.$$
积分得到 $y+\sqrt{x^2+y^2}=C$。代入 $(1/2,0)$ 得 $C=1/2$，化简为 $y=1/4-x^2$。`,
    methodTwo: raw`直接验证候选曲线：$y'= -2x$，切线纵截距
$$y-xy'=\frac14+x^2.$$
而
$$\sqrt{x^2+(1/4-x^2)^2}=x^2+\frac14$$
在 $x>0$ 上成立，且曲线通过指定点。`
  }),
  lectureFifteen({
    id: 'example-15-7-damped-sine-area', role: 'example', page: 'PDF 388-389 · 书页 383-384 · 例 15.7',
    fingerprint: 'first-order-linear:damped-sine-total-lobe-area-geometric-series',
    title: '例 15.7 · 阻尼正弦解与无穷图形面积',
    statement: raw`设 $y=y(x)$ 满足
$$y'+y=e^{-x}\cos x,\qquad y(0)=0.$$
求 $y(x)$，并求曲线 $y=y(x)$ 与 $x$ 轴在 $[0,+\infty)$ 上围成的图形总面积。`,
    tags: ['一阶线性方程', '无穷面积'],
    coreMethod: '先用积分因子求出阻尼正弦解；面积要对绝对值积分，再利用相邻波瓣构成等比数列。',
    mistakes: '图形面积不是有向积分；若直接积分 $e^{-x}\sin x$，正负波瓣会相互抵消。',
    answerText: raw`$$y=e^{-x}\sin x,\qquad S=\frac{1+e^{-\pi}}{2(1-e^{-\pi})}.$$`,
    methodOne: raw`乘积分因子 $e^x$ 得 $(e^xy)'=\cos x$，由初值得 $e^xy=\sin x$。首个波瓣面积为
$$S_0=\int_0^\pi e^{-x}\sin x\,dx=\frac{1+e^{-\pi}}2.$$
以后每个波瓣都是前一个的 $e^{-\pi}$ 倍，故 $S=S_0/(1-e^{-\pi})$。`,
    methodTwo: raw`将总面积写成
$$\sum_{k=0}^{\infty}\int_{k\pi}^{(k+1)\pi}e^{-x}|\sin x|dx.$$
令 $x=k\pi+t$，每项等于 $e^{-k\pi}\int_0^\pi e^{-t}\sin tdt$，直接求和得到同一结果。`
  }),
  lectureFifteen({
    id: 'example-15-8-swap-dependent-variable', role: 'example', page: 'PDF 389 · 书页 384 · 例 15.8',
    fingerprint: 'swap-variables:linear-equation-for-x-as-function-of-y',
    title: '例 15.8 · 交换自变量与因变量求初值解',
    statement: raw`微分方程
$$x\,dx+(x-3y^2)\,dy=0$$
满足 $y(1)=1$ 的解为多少？`,
    tags: ['交换变量', '一阶线性方程'],
    coreMethod: '原式对 $y(x)$ 不便计算，改把 $x$ 视为 $y$ 的函数，即可得到关于 $x(y)$ 的一阶线性方程。',
    mistakes: '交换角色后初值应写为 $x(1)=1$；最后还要依据初值选择平方根的正支。',
    answerText: raw`$$y=\sqrt{x}.$$`,
    methodOne: raw`把 $x$ 看成 $y$ 的函数：
$$x\frac{dx}{dy}+x-3y^2=0,\qquad \frac{dx}{dy}+\frac1y x=3y.$$
积分因子为 $y$，所以 $(xy)'=3y^2$，得
$$x=y^2+\frac Cy.$$
由 $x(1)=1$ 得 $C=0$，结合初值取 $y=\sqrt x$。`,
    methodTwo: raw`直接代入验证：对 $y=\sqrt x$ 有 $x=y^2$ 且 $dx=2y\,dy$。原式左端为
$$y^2(2y\,dy)+(y^2-3y^2)dy=0,$$
同时 $y(1)=1$，故答案成立。`
  }),
  lectureFifteen({
    id: 'example-15-9-linear-limit', role: 'example', page: 'PDF 389-390 · 书页 384-385 · 例 15.9',
    fingerprint: 'first-order-linear:improper-integral-asymptotic-ratio-limit',
    title: '例 15.9 · 一阶线性方程解的无穷远极限',
    statement: raw`设函数 $y=\varphi(x)$ 是微分方程
$$y'+ey=\left(1-\frac1x\right)^x$$
的一个解，求 $\displaystyle\lim_{x\to+\infty}\varphi(x)$。`,
    questionFormat: 'single-choice', options: ['$e$', '$e^2$', '$1/e$', '$1/e^2$'], correctOptionIds: ['D'],
    tags: ['一阶线性方程', '无穷远极限', '选择题'],
    coreMethod: '写出常系数线性方程的积分表达式，再对分子分母使用洛必达法则；任意积分常数不影响极限。',
    mistakes: raw`方程中 $e$ 是常数而不是 $e^x$；右端极限为 $e^{-1}$，还要除以方程的稳定系数 $e$。`,
    answerText: raw`正确选项为 D，即 $$\lim_{x\to+\infty}\varphi(x)=\frac1{e^2}.$$`,
    methodOne: raw`积分因子为 $e^{ex}$，故对任意固定 $x_0>1$，
$$y=e^{-ex}\left[\int_{x_0}^x\left(1-\frac1t\right)^t e^{et}dt+C\right].$$
分子分母同趋无穷，洛必达得
$$\lim y=\lim\frac{(1-1/x)^xe^{ex}}{e\,e^{ex}}=\frac{e^{-1}}e=e^{-2}.$$`,
    methodTwo: raw`记 $L=e^{-2}$，令 $z=y-L$。则
$$z'+ez=\left(1-\frac1x\right)^x-e^{-1}\longrightarrow0.$$
稳定的一阶线性系统会把趋零外力的响应压到零，而齐次项 $Ce^{-ex}$ 也衰减，故 $z\to0$，即 $y\to e^{-2}$。`
  }),
  lectureFifteen({
    id: 'example-15-10-bounded-solution', role: 'example', page: 'PDF 390 · 书页 385 · 例 15.10',
    fingerprint: 'first-order-linear:bounded-forcing-convolution-bound',
    title: '例 15.10 · 有界外力下一阶线性方程解的有界性',
    statement: raw`设 $a>0$，函数 $f(x)$ 在 $[0,+\infty)$ 上连续有界。证明微分方程
$$y'+ay=f(x)$$
的每个解都在 $[0,+\infty)$ 上有界。`,
    tags: ['一阶线性方程', '有界性证明'],
    coreMethod: '把解写成指数衰减的初值项与有界外力的卷积，再对两部分分别估计。',
    mistakes: raw`仅说 $e^{-ax}$ 有界还不够；必须控制积分项，且结论依赖 $a>0$。`,
    answerText: raw`若 $|f(x)|\le M$，则任一解满足
$$|y(x)|\le |y(0)|+\frac Ma,$$
因而在 $[0,+\infty)$ 上有界。`,
    methodOne: raw`由常数变易公式
$$y(x)=e^{-ax}y(0)+\int_0^xe^{-a(x-t)}f(t)dt.$$
若 $|f|\le M$，则
$$|y(x)|\le |y(0)|+M\int_0^xe^{-a(x-t)}dt
\le |y(0)|+\frac Ma.$$`,
    methodTwo: raw`乘积分因子得 $y=e^{-ax}[\int_0^xf(t)e^{at}dt+C]$。估计积分绝对值不超过
$$M\frac{e^{ax}-1}{a}.$$
再乘 $e^{-ax}$ 得不超过 $M/a$，常数项也随指数衰减，故全体解有界。`
  }),
  lectureFifteen({
    id: 'example-15-11-bernoulli-swap', role: 'example', page: 'PDF 390-391 · 书页 385-386 · 例 15.11',
    fingerprint: 'bernoulli-swap:variables-inverted-reciprocal-linearization',
    title: '例 15.11 · 交换变量后的 Bernoulli 方程',
    statement: raw`求微分方程
$$y\,dx=x(1+x\ln y)\,dy,\qquad y>0$$
的通解。`,
    tags: ['Bernoulli方程', '交换变量'],
    coreMethod: '将 $x$ 看成 $y$ 的函数，得到关于 $x(y)$ 的 Bernoulli 方程，再令 $z=1/x$ 线性化。',
    mistakes: '若仍把 $y$ 当未知函数会很难识别结构；倒数代换求导必须带负号。',
    answerText: raw`$$\frac1x=1-\ln y+\frac Cy,\qquad y>0.$$`,
    methodOne: raw`原式化为
$$\frac{dx}{dy}-\frac xy=\frac{\ln y}{y}x^2.$$
令 $z=x^{-1}$，则
$$z'+\frac1y z=-\frac{\ln y}{y}.$$
积分因子为 $y$，故 $(yz)'=-\ln y$，积分得到
$$z=1-\ln y+\frac Cy.$$`,
    methodTwo: raw`由答案写成 $yz=y-y\ln y+C$，求导得
$$z+yz'=-\ln y.$$
代入 $z=1/x,z'=-x'/x^2$ 并整理，恰得
$$x'-x/y=(\ln y)x^2/y,$$
从而复核原方程。`
  }),
  lectureFifteen({
    id: 'example-15-12-reduced-order-slope', role: 'example', page: 'PDF 391-392 · 书页 386-387 · 例 15.12',
    fingerprint: 'order-reduction:p-y-prime-autonomous-separable-two-stages',
    title: '例 15.12 · 不显含未知函数的二阶方程降阶',
    statement: raw`求初值问题
$$y''=y'[1+(y')^2],\qquad y(0)=0,\quad y'(0)=1$$
的特解。`,
    tags: ['二阶降阶', '初值问题'],
    coreMethod: raw`令 $p=y'$ 先解关于 $p(x)$ 的可分离方程，再积分一次并使用两个初值。`,
    mistakes: raw`第一阶段积分后就停止；还需由 $p=y'$ 再积分，并检查根号与反三角函数的定义域。`,
    answerText: raw`$$y=\arcsin\frac{e^x}{\sqrt2}-\frac\pi4.$$`,
    methodOne: raw`令 $p=y'$，则
$$p'=p(1+p^2),\qquad \frac{dp}{p(1+p^2)}=dx.$$
由 $p(0)=1$ 得
$$p=\frac{e^x/\sqrt2}{\sqrt{1-e^{2x}/2}}.$$
再积分 $y'=p$，得到 $y=\arcsin(e^x/\sqrt2)+C$；由 $y(0)=0$ 得 $C=-\pi/4$。`,
    methodTwo: raw`对候选解求导：令 $u=e^x/\sqrt2$，则
$$y'=\frac{u}{\sqrt{1-u^2}},\qquad y''=\frac{u}{(1-u^2)^{3/2}}.$$
而 $y'[1+(y')^2]$ 正好等于同一表达式；在 $x=0$ 处两个初值也成立。`
  }),
  lectureFifteen({
    id: 'example-15-13-reduced-order-power', role: 'example', page: 'PDF 392-393 · 书页 387-388 · 例 15.13',
    fingerprint: 'order-reduction:p-of-y-power-law-family-through-origin',
    title: '例 15.13 · 不显含自变量的二阶方程降阶',
    statement: raw`求微分方程
$$yy''-\frac23(y')^2=0$$
满足 $y(0)=0$ 的解。`,
    tags: ['二阶降阶', '幂函数解族'],
    coreMethod: raw`令 $p=p(y)=y'$，使用 $y''=p\,dp/dy$ 把二阶方程降为一阶可分离方程。`,
    mistakes: '约去 $p$ 或 $y$ 时会漏掉零解；最终应用初值时常数项必须重新检查。',
    answerText: raw`$$y=Cx^3,$$
其中 $C$ 为任意常数。`,
    methodOne: raw`令 $p(y)=y'$，则 $y''=p\,dp/dy$，方程化为
$$yp\frac{dp}{dy}-\frac23p^2=0.$$
非零分支给出 $dp/p=(2/3)dy/y$，故 $p=C_0y^{2/3}$。再由 $dy/y^{2/3}=C_0dx$ 积分并用 $y(0)=0$，得 $y=Cx^3$；$C=0$ 包含零解。`,
    methodTwo: raw`直接设满足过原点条件的幂函数 $y=Cx^m$。代入后非零系数满足
$$m(m-1)-\frac23m^2=0,$$
即 $m(m-3)=0$。非常值过原点分支为 $m=3$，再补入 $C=0$，得到同一解族。`
  }),
  lectureFifteen({
    id: 'example-15-14-exact-equation', role: 'example', page: 'PDF 393 · 书页 388 · 例 15.14',
    fingerprint: 'exact-equation:determine-unknown-coefficient-function',
    title: '例 15.14 · 由全微分条件反求未知函数',
    statement: raw`求满足 $f(0)=0$ 的具有一阶连续导数的函数 $f(x)$，使
$$[y f'(x)+y^2]dx+(x^2+2xy)dy=0$$
为全微分方程，并求其通解。`,
    tags: ['全微分方程', '反求函数'],
    coreMethod: '比较微分形式两个系数的交叉偏导，先由恰当性条件求 $f$，再构造势函数。',
    mistakes: '全微分条件比较的是 $P_y$ 与 $Q_x$；求出 $f$ 后还必须利用 $f(0)=0$ 确定积分常数。',
    answerText: raw`$$f(x)=x^2,\qquad x^2y+xy^2=C.$$`,
    methodOne: raw`令 $P=yf'(x)+y^2,Q=x^2+2xy$。全微分条件给出
$$P_y=f'(x)+2y=Q_x=2x+2y,$$
故 $f'(x)=2x$。结合 $f(0)=0$ 得 $f=x^2$。此时
$$Pdx+Qdy=d(x^2y+xy^2),$$
所以通解为 $x^2y+xy^2=C$。`,
    methodTwo: raw`先由 $Q$ 对 $y$ 积分构造势函数
$$U=x^2y+xy^2+h(x).$$
要求 $U_x=2xy+y^2+h'(x)=yf'(x)+y^2$，对所有 $y$ 成立便得 $f'(x)=2x,h'=0$，结果与原书一致。`
  }),
  lectureFifteen({
    id: 'example-15-15-extreme-value-initials', role: 'example', page: 'PDF 394 · 书页 389 · 例 15.15',
    fingerprint: 'second-order-homogeneous:extremum-value-as-initial-data',
    title: '例 15.15 · 用极值条件确定二阶方程常数',
    statement: raw`设 $y=y(x)$ 是微分方程
$$y''+y'-2y=0$$
的解，且在 $x=0$ 处取得极值 $3$，求 $y(x)$。`,
    tags: ['二阶常系数', '初值定常数'],
    coreMethod: raw`把“在零点取得极值3”翻译成 $y(0)=3,y'(0)=0$，再求解齐次方程。`,
    mistakes: '只代入函数值而忘记极值点的一阶导数为零；求出解后应确认二阶导数不为零。',
    answerText: raw`$$y=e^{-2x}+2e^x.$$`,
    methodOne: raw`特征方程 $r^2+r-2=0$ 的根为 $-2,1$，故
$$y=C_1e^{-2x}+C_2e^x.$$
由 $C_1+C_2=3$、$-2C_1+C_2=0$ 得 $C_1=1,C_2=2$。`,
    methodTwo: raw`对答案求导得 $y'=-2e^{-2x}+2e^x$，故 $y(0)=3,y'(0)=0$；再有 $y''(0)=6>0$，所以零点确为极小值点，且代回方程左端恒为零。`
  }),
  lectureFifteen({
    id: 'example-15-16-complex-roots-initials', role: 'example', page: 'PDF 394 · 书页 389 · 例 15.16',
    fingerprint: 'second-order-homogeneous:complex-roots-two-initial-values',
    title: '例 15.16 · 共轭复根初值问题',
    statement: raw`设函数 $y=f(x)$ 满足
$$y''+2y'+5y=0,\qquad f(0)=1,\quad f'(0)=-1.$$
求 $f(x)$。`,
    tags: ['二阶常系数', '复特征根'],
    coreMethod: '由共轭复根写成指数乘正余弦的实解形式，再利用两个初值确定系数。',
    mistakes: '特征根实部为 $-1$，指数因子应是 $e^{-x}$；对乘积求导时不能漏掉指数项。',
    answerText: raw`$$f(x)=e^{-x}\cos2x.$$`,
    methodOne: raw`特征根为 $-1\pm2i$，故
$$f=e^{-x}(C_1\cos2x+C_2\sin2x).$$
$f(0)=1$ 给出 $C_1=1$；$f'(0)=-C_1+2C_2=-1$ 给出 $C_2=0$。`,
    methodTwo: raw`令 $f=e^{-x}u$，代入原方程可消去一阶项并得到 $u''+4u=0$。初值变为 $u(0)=1,u'(0)=0$，故 $u=\cos2x$，立即得到答案。`
  }),
  lectureFifteen({
    id: 'example-15-17-nonhomogeneous-two-methods', role: 'example', page: 'PDF 399-400 · 书页 394-395 · 例 15.17',
    fingerprint: 'second-order-nonhomogeneous:exponential-trigonometric-shift',
    title: '例 15.17 · 指数三角型非齐次方程',
    statement: raw`求微分方程
$$y''-3y'+2y=2e^{-x}\cos x$$
的通解。`,
    tags: ['二阶非齐次', '待定系数法'],
    coreMethod: '齐次部分用特征根；特解可设为 $e^{-x}(A\cos x+B\sin x)$，也可用微分算子平移。',
    mistakes: '右端带 $e^{-x}$，试探式必须保留指数因子；算子平移时应把 $D$ 替换为 $D-1$。',
    answerText: raw`$$y=C_1e^x+C_2e^{2x}+\frac15e^{-x}(\cos x-\sin x).$$`,
    methodOne: raw`齐次特征根为 $1,2$。设
$$y_p=e^{-x}(A\cos x+B\sin x),$$
代入比较正余弦系数，得 $A=1/5,B=-1/5$。与齐次通解相加即得答案。`,
    methodTwo: raw`用算子记号
$$y_p=2e^{-x}\frac1{(D-1)^2-3(D-1)+2}\cos x
=2e^{-x}\frac1{D^2-5D+6}\cos x.$$
在 $D^2=-1$ 下化简得到 $e^{-x}(\cos x-\sin x)/5$，与待定系数法一致。`
  }),
  lectureFifteen({
    id: 'example-15-18-infer-equation-from-particular', role: 'example', page: 'PDF 400-401 · 书页 395-396 · 例 15.18',
    fingerprint: 'inverse-ode:infer-characteristic-roots-and-forcing-from-particular-solution',
    title: '例 15.18 · 由一个特解反推方程参数',
    statement: raw`二阶常系数线性方程
$$y''+\alpha y'+\beta y=\gamma e^x$$
有一个特解
$$y^*=e^{2x}+(1+x)e^x.$$
确定 $\alpha,\beta,\gamma$，并求方程通解。`,
    tags: ['反推微分方程', '共振'],
    coreMethod: '利用特解各组成项判断齐次特征根及重数，再代入剩余的 $xe^x$ 项确定右端系数。',
    mistakes: '$e^{2x}$ 出现在给定特解中但右端不含该指数，说明它必须属于齐次解；$e^x$ 与 $xe^x$ 同时出现意味着根1的共振结构。',
    answerText: raw`$$\alpha=-3,\quad\beta=2,\quad\gamma=-1,$$
$$y=C_1e^x+C_2e^{2x}-xe^x.$$`,
    methodOne: raw`$e^{2x}$ 必为齐次解，故 $r=2$ 是特征根。又 $e^x+xe^x$ 为特解且 $e^x$ 可并入齐次项，所以 $r=1$ 也是特征根。于是
$$r^2+\alpha r+\beta=(r-1)(r-2),$$
得 $\alpha=-3,\beta=2$。代入 $xe^x$ 得右端系数 $\gamma=-1$。`,
    methodTwo: raw`直接计算算子 $L=D^2-3D+2=(D-1)(D-2)$。有 $L[e^{2x}]=L[e^x]=0$，而
$$L[xe^x]=-e^x.$$
因此给定函数确使 $L[y^*]=-e^x$。一般解为齐次通解加特解 $-xe^x$。`
  }),
  lectureFifteen({
    id: 'example-15-19-reconstruct-fourth-order', role: 'example', page: 'PDF 401-402 · 书页 396-397 · 例 15.19',
    fingerprint: 'higher-order-homogeneous:reconstruct-characteristic-polynomial-from-solutions',
    title: '例 15.19 · 由已知解重构四阶齐次方程',
    statement: raw`某四阶常系数齐次线性微分方程有解
$$y_1=e^x\cos2x,\qquad y_2=x,$$
且方程中 $y^{(4)}$ 的系数为 $1$。求该方程。`,
    tags: ['高阶常系数', '特征根重构'],
    coreMethod: '从指数三角解识别共轭根，从多项式解识别零根及其最低重数，再相乘展开特征多项式。',
    mistakes: '$x$ 是解不仅说明 $r=0$，还说明常数函数也必须是解，因此零根至少为二重根。',
    answerText: raw`$$y^{(4)}-2y^{(3)}+5y''=0.$$`,
    methodOne: raw`$e^x\cos2x$ 对应根 $1\pm2i$；$x$ 对应零根至少二重。四阶方程恰有四个根，故
$$P(r)=r^2[(r-1)^2+4]=r^4-2r^3+5r^2.$$
首项系数为1，立即得到方程。`,
    methodTwo: raw`对候选方程分别代入：$y=x$ 时二阶以上导数全为零；对 $e^{(1+2i)x}$，特征值满足
$$r^2(r^2-2r+5)=0.$$
取实部即验证 $e^x\cos2x$ 也是解，且阶数与首项系数符合题意。`
  }),
  lectureFifteen({
    id: 'example-15-20-euler-equation', role: 'example', page: 'PDF 402-403 · 书页 397-398 · 例 15.20',
    fingerprint: 'euler-equation:logarithmic-independent-variable-transform',
    title: '例 15.20 · Euler 方程的对数换元',
    statement: raw`求 Euler 方程
$$x^2y''+4xy'+2y=0,\qquad x>0$$
的通解。`,
    tags: ['Euler方程', '二阶齐次'],
    coreMethod: '令 $x=e^t$，利用链式法则把变系数 Euler 方程化为常系数方程。',
    mistakes: raw`$y_x=y_t/x$，而 $y_{xx}=(y_{tt}-y_t)/x^2$；二阶链式关系最容易漏掉减项。`,
    answerText: raw`$$y=\frac{C_1}{x}+\frac{C_2}{x^2}.$$`,
    methodOne: raw`令 $x=e^t$。则
$$y_x=\frac1x y_t,qquad y_{xx}=\frac1{x^2}(y_{tt}-y_t).$$
代入得
$$y_{tt}+3y_t+2y=0.$$
特征根为 $-1,-2$，故 $y=C_1e^{-t}+C_2e^{-2t}$，换回 $t=\ln x$ 即得。`,
    methodTwo: raw`直接试幂函数 $y=x^m$。代入得到指标方程
$$m(m-1)+4m+2=(m+1)(m+2)=0.$$
两个不同根给出 $x^{-1},x^{-2}$ 两个线性无关解。`
  }),
  lectureFifteen({
    id: 'example-15-21-bicycle-track', role: 'example', page: 'PDF 403-404 · 书页 398-399 · 例 15.21',
    fingerprint: 'geometric-ode:bicycle-rear-wheel-tangent-constraint',
    title: '例 15.21 · 自行车前后轮约束的轨迹方程',
    statement: raw`自行车前、后轮与地面的接触点分别为 $P,Q$，且 $|PQ|=1$。初始时 $P$ 在原点、$Q$ 在 $(1,0)$，随后前轮沿 $y$ 轴正方向前进。求后轮接触点 $Q$ 的运动轨迹。`,
    tags: ['微分方程几何应用', '轨迹'],
    coreMethod: '后轮瞬时运动方向沿车架方向，因此车架 $PQ$ 是轨迹切线；再结合车架长度建立斜率方程。',
    mistakes: '前后轮轨迹不能互换；积分后要用 $Q(1,0)$ 定常数，并依据运动方向选择支路。',
    answerText: raw`$$y=\ln\frac{1+\sqrt{1-x^2}}x-\sqrt{1-x^2},\qquad 0<x\le1.$$`,
    methodOne: raw`设 $Q=(x,y)$，前轮 $P=(0,Y)$。由 $|PQ|=1$ 得 $Y-y=\sqrt{1-x^2}$。车架为后轮轨迹切线，所以
$$y'=\frac{y-Y}{x}=-\frac{\sqrt{1-x^2}}x.$$
令 $x=\sin t$ 积分，并用 $y(1)=0$，得到所列轨迹。`,
    methodTwo: raw`对答案求导可得
$$y'=-\frac{\sqrt{1-x^2}}x.$$
令 $Y=y+\sqrt{1-x^2}$，则 $(0,Y)$ 与 $(x,y)$ 的距离恒为1，且连线斜率等于 $y'$；这同时复核长度与切向约束。`
  }),
  lectureFifteen({
    id: 'example-15-22-airplane-drag', role: 'example', page: 'PDF 404-405 · 书页 399-400 · 例 15.22',
    fingerprint: 'physical-ode:linear-drag-eliminate-time-displacement-speed',
    title: '例 15.22 · 线性阻力下滑行位移与速度',
    statement: raw`质量为 $m$ 的飞机着陆后关闭发动机，所受阻力大小与速度成正比，比例系数为 $k>0$。从开始减速计时，位移为 $x(t)$、速度为 $v(t)$。下列关系正确的是（ ）。`,
    questionFormat: 'single-choice',
    options: ['$x(t)=\dfrac m k[v(0)-v(t)]$', '$x(t)=\dfrac m k[v(t)-v(0)]$', '$x(t)=km[v(0)-v(t)]$', '$x(t)=km[v(t)-v(0)]$'], correctOptionIds: ['A'],
    tags: ['物理应用', '阻力模型', '选择题'],
    coreMethod: '由 Newton 第二定律得到 $m\,dv/dt=-kv$，再利用 $dx/dt=v$ 消去时间。',
    mistakes: '阻力方向与速度相反，符号必须是负号；位移应随速度下降而保持非负。',
    answerText: raw`正确选项为 A，即 $$x(t)=\frac m k[v(0)-v(t)].$$`,
    methodOne: raw`由
$$m\frac{dv}{dt}=-kv,\qquad \frac{dx}{dt}=v$$
可得
$$dx=vdt=-\frac m k\,dv.$$
从初态积分到时刻 $t$，得 $x(t)=\frac m k[v(0)-v(t)]$。`,
    methodTwo: raw`先解得 $v(t)=v(0)e^{-kt/m}$，再积分速度：
$$x(t)=\int_0^tv(s)ds=\frac{mv(0)}k(1-e^{-kt/m})
=\frac m k[v(0)-v(t)].$$`
  }),
  lectureFifteen({
    id: 'example-15-23-newton-cooling', role: 'example', page: 'PDF 405-406 · 书页 400-401 · 例 15.23',
    fingerprint: 'physical-ode:newton-cooling-determine-rate-from-one-observation',
    title: '例 15.23 · Newton 冷却模型',
    statement: raw`物体在 $20^\circ\mathrm C$ 的恒温介质中冷却，降温速率与温差 $T-20$ 成正比。已知初温为 $120^\circ\mathrm C$，30 min 后降到 $30^\circ\mathrm C$。求温度函数 $T(t)$。`,
    tags: ['物理应用', '冷却定律'],
    coreMethod: raw`建立 $T'=-k(T-20)$，先用初温确定振幅，再用30分钟的观测值确定衰减率。`,
    mistakes: '比例常数 $k$ 取正但方程前有负号；平衡温度是20而不是0。',
    answerText: raw`$$T(t)=100e^{-t\ln10/30}+20.$$`,
    methodOne: raw`方程为
$$\frac{dT}{dt}=-k(T-20).$$
其解为 $T=Ce^{-kt}+20$。由 $T(0)=120$ 得 $C=100$；由 $T(30)=30$ 得 $e^{-30k}=1/10$，故 $k=\ln10/30$。`,
    methodTwo: raw`令温差 $u=T-20$，则 $u'=-ku$，所以每30分钟温差缩小到原来的 $1/10$。因此
$$u(t)=100\cdot10^{-t/30}=100e^{-t\ln10/30},$$
再加环境温度20。`
  }),
  lectureFifteen({
    id: 'example-15-24-first-order-difference', role: 'example', page: 'PDF 407 · 书页 402 · 例 15.24',
    fingerprint: 'difference-equation:first-order-sum-linear-forcing',
    title: '例 15.24 · 一阶差分方程的通解',
    statement: raw`求一阶差分方程
$$\Delta y_t=t$$
的通解。`,
    tags: ['差分方程', '离散求和'],
    coreMethod: '齐次解为常数；非齐次特解可设二次多项式，也可直接对增量逐项求和。',
    mistakes: raw`$\Delta y_t=y_{t+1}-y_t$；$t(t-1)/2$ 与 $t(t+1)/2$ 的下标约定不能混用。`,
    answerText: raw`$$y_t=\frac12t(t-1)+C.$$`,
    methodOne: raw`齐次方程 $\Delta y_t=0$ 的通解为常数。设特解 $y_t^*=at^2+bt$，则
$$\Delta y_t^*=2at+a+b.$$
与 $t$ 比较得 $a=1/2,b=-1/2$，故通解如答案。`,
    methodTwo: raw`由 $y_{t+1}-y_t=t$，从 $0$ 到 $t-1$ 求和：
$$y_t-y_0=\sum_{j=0}^{t-1}j=\frac12t(t-1).$$
把 $y_0$ 记作任意常数 $C$ 即得。`
  }),
  lectureFifteen({
    id: 'example-15-25-trigonometric-difference', role: 'example', page: 'PDF 407-408 · 书页 402-403 · 例 15.25',
    fingerprint: 'difference-equation:sinusoidal-forcing-undetermined-coefficients',
    title: '例 15.25 · 三角型非齐次差分方程',
    statement: raw`求一阶差分方程
$$y_{t+1}-y_t=4\cos\frac{\pi t}{3}$$
的通解。`,
    tags: ['差分方程', '三角型特解'],
    coreMethod: '齐次解为常数；对余弦外力设正弦与余弦的线性组合，并比较系数。',
    mistakes: '离散平移会让正弦和余弦互相混合，不能只设一个余弦项。',
    answerText: raw`$$y_t=A-2\cos\frac{\pi t}{3}+2\sqrt3\sin\frac{\pi t}{3},$$
其中 $A$ 为任意常数。`,
    methodOne: raw`设特解
$$y_t^*=B_0\cos\frac{\pi t}{3}+B_1\sin\frac{\pi t}{3}.$$
用加角公式展开 $y_{t+1}^*-y_t^*$，比较正余弦系数，解得 $B_0=-2,B_1=2\sqrt3$。再加齐次常数 $A$。`,
    methodTwo: raw`用复数法求 $z_{t+1}-z_t=4e^{i\pi t/3}$。取
$$z_t=\frac4{e^{i\pi/3}-1}e^{i\pi t/3},$$
化简系数并取实部，得到 $-2\cos(\pi t/3)+2\sqrt3\sin(\pi t/3)$。`
  }),
  lectureFifteen({
    id: 'exercise-15-1-particular-form', role: 'exercise', page: 'PDF 408-409 · 书页 403-404 · 习题 15.1',
    fingerprint: 'undetermined-coefficients:polynomial-plus-resonant-exponential-form',
    title: '习题 15.1 · 多项式与二重共振项的特解形式',
    statement: raw`微分方程
$$y''-4y'+4y=x^2+8e^{2x}$$
的一个特解应具有下列哪种形式？`,
    questionFormat: 'single-choice',
    options: ['$ax^2+bx+ce^{2x}$', '$ax^2+bx+c+dx^2e^{2x}$', '$ax^2+bx+cxe^{2x}$', '$ax^2+(bx^2+cx)e^{2x}$'], correctOptionIds: ['B'],
    tags: ['待定系数法', '共振', '选择题'],
    coreMethod: '多项式外力按同次数多项式设特解；指数外力对应特征方程二重根时须额外乘 $x^2$。',
    mistakes: '两类右端应分别判断再相加；$r=2$ 是二重根，不是单根。',
    answerText: raw`正确选项为 B，即可设 $$y_p=ax^2+bx+c+dx^2e^{2x}.$$`,
    methodOne: raw`特征方程为
$$r^2-4r+4=(r-2)^2.$$
$x^2$ 对应一般二次多项式 $ax^2+bx+c$；$e^{2x}$ 的指数2是二重特征根，试探式必须乘 $x^2$，故另一部分为 $dx^2e^{2x}$。`,
    methodTwo: raw`令算子 $L=(D-2)^2$。对 $e^{2x}v$ 有 $L[e^{2x}v]=e^{2x}v''$，要产生常数倍 $e^{2x}$，$v$ 最低需取二次式，所以选择 $v=dx^2$。`
  }),
  lectureFifteen({
    id: 'exercise-15-2-combine-particular-solutions', role: 'exercise', page: 'PDF 408-409 · 书页 403-404 · 习题 15.2',
    fingerprint: 'linear-superposition:subtract-particular-solutions-to-find-homogeneous-basis',
    title: '习题 15.2 · 由三个特解提取齐次基底',
    statement: raw`已知
$$y_1=e^{3x}-xe^{2x},\quad y_2=e^x-xe^{2x},\quad y_3=-xe^{2x}$$
是同一二阶常系数非齐次线性方程的三个解。求满足
$$y(0)=0,qquad y'(0)=1$$
的特解。`,
    tags: ['线性叠加原理', '初值问题'],
    coreMethod: '任意两个非齐次特解之差都是齐次解；从三解之差构造齐次基底，再用其中一个作特解。',
    mistakes: '三个非齐次解本身不能任意线性组合；只有系数和为1的仿射组合仍是原方程的解。',
    answerText: raw`$$y=e^{3x}-e^x-xe^{2x}.$$`,
    methodOne: raw`有
$$\bar y_1=y_1-y_3=e^{3x},\qquad \bar y_2=y_2-y_3=e^x,$$
它们线性无关，故通解可写成
$$y=C_1e^{3x}+C_2e^x-xe^{2x}.$$
由初值得 $C_1=1,C_2=-1$。`,
    methodTwo: raw`直接取仿射组合 $y=y_1-y_2+y_3$，三个系数之和为1，因此仍是同一非齐次方程的解。化简即
$$y=e^{3x}-e^x-xe^{2x},$$
代入零点可验得 $y(0)=0,y'(0)=1$。`
  }),
  lectureFifteen({
    id: 'exercise-15-3-log-separable', role: 'exercise', page: 'PDF 408-410 · 书页 403-405 · 习题 15.3',
    fingerprint: 'separable-ode:log-y-over-y-trigonometric-ratio',
    title: '习题 15.3 · 含 $\ln y$ 的分离变量方程',
    statement: raw`求微分方程
$$y'\tan x=y\ln y$$
的通解。`,
    tags: ['可分离变量', '对数换元'],
    coreMethod: raw`分离为 $dy/(y\ln y)=\cot x\,dx$，两边积分后再指数化。`,
    mistakes: raw`左侧积分是 $\ln|\ln y|$，不是 $(\ln y)^2/2$；实值讨论需注意 $y>0$。`,
    answerText: raw`$$\ln y=C\sin x,$$
等价地 $$y=e^{C\sin x}.$$`,
    methodOne: raw`分离变量得
$$\frac{dy}{y\ln y}=\frac{\cos x}{\sin x}dx.$$
积分为 $\ln|\ln y|=\ln|\sin x|+C_1$，吸收符号与指数常数后写成 $\ln y=C\sin x$。`,
    methodTwo: raw`对 $y=e^{C\sin x}$ 求导，得
$$y'=C\cos x\,y,\qquad y'\tan x=C\sin x\,y=y\ln y,$$
故解族准确满足原方程，并包含 $C=0$ 对应的常值解 $y=1$。`
  }),
  lectureFifteen({
    id: 'exercise-15-4-homogeneous-arctangent', role: 'exercise', page: 'PDF 408-410 · 书页 403-405 · 习题 15.4',
    fingerprint: 'homogeneous-ode:u-y-over-x-arctangent-integral',
    title: '习题 15.4 · 含反正切因子的齐次方程',
    statement: raw`求微分方程
$$\left(x\frac{dy}{dx}-y\right)\arctan\frac yx=x$$
的通解。`,
    tags: ['齐次方程', '反三角积分'],
    coreMethod: raw`令 $u=y/x$，利用 $xy'-y=x^2u'$，方程立即化为可分离变量形式。`,
    mistakes: raw`$y=xu$ 时 $xy'-y=x^2u'$；积分 $u\arctan u$ 需要分部积分。`,
    answerText: raw`$$C\sqrt{x^2+y^2}=e^{(y/x)\arctan(y/x)},\qquad C>0.$$`,
    methodOne: raw`令 $u=y/x$，则 $xy'-y=x^2u'$，故
$$u\arctan u\,du=\frac{dx}{x}.$$
分部积分得
$$u\arctan u-\frac12\ln(1+u^2)=\ln|x|+C_1.$$
指数化并代回 $u=y/x$，整理得答案。`,
    methodTwo: raw`对对数形式
$$\ln C+\tfrac12\ln(x^2+y^2)=\frac yx\arctan\frac yx$$
作全微分，令 $u=y/x$ 后消去公共项，可还原 $u\arctan u\,du=dx/x$，从而复核原方程。`
  }),
  lectureFifteen({
    id: 'exercise-15-5-exponential-substitution', role: 'exercise', page: 'PDF 408-410 · 书页 403-405 · 习题 15.5',
    fingerprint: 'nonlinear-first-order:z-exp-y-linearization',
    title: '习题 15.5 · 指数代换化为线性方程',
    statement: raw`求微分方程
$$y'+1=e^{-y}\sin x$$
的通解。`,
    tags: ['指数代换', '一阶线性方程'],
    coreMethod: raw`两边乘 $e^y$ 并令 $z=e^y$，利用 $z'=e^yy'$ 化为关于 $z$ 的线性方程。`,
    mistakes: raw`乘 $e^y$ 后左端是 $(e^y)'+e^y$；最后必须保证 $e^y>0$ 才有实解。`,
    answerText: raw`$$e^y=e^{-x}\left[\frac12e^x(\sin x-\cos x)+C\right].$$`,
    methodOne: raw`令 $z=e^y$。原方程乘 $e^y$ 得
$$z'+z=\sin x.$$
乘积分因子 $e^x$：
$$z=e^{-x}\left(\int e^x\sin x\,dx+C\right)
=e^{-x}\left[\frac12e^x(\sin x-\cos x)+C\right].$$`,
    methodTwo: raw`将答案写成 $z=(\sin x-\cos x)/2+Ce^{-x}$，直接求导有
$$z'+z=\sin x.$$
再用 $z=e^y,z'=e^yy'$ 除以 $e^y$，即可还原原方程。`
  }),
  lectureFifteen({
    id: 'exercise-15-6-reduction-missing-y', role: 'exercise', page: 'PDF 408-410 · 书页 403-405 · 习题 15.6',
    fingerprint: 'order-reduction:xy-second-plus-three-first',
    title: '习题 15.6 · 不显含 $y$ 的二阶方程降阶',
    statement: raw`求微分方程
$$xy''+3y'=0$$
的通解。`,
    tags: ['二阶降阶', '变系数方程'],
    coreMethod: raw`令 $p=y'$，先解一阶线性齐次方程 $xp'+3p=0$，再积分一次。`,
    mistakes: '降阶求出 $p$ 后还要积分；积分 $x^{-3}$ 会产生 $x^{-2}$ 与一个新的常数。',
    answerText: raw`$$y=C_1+\frac{C_2}{x^2},\qquad x\ne0.$$`,
    methodOne: raw`令 $p=y'$，则
$$xp'+3p=0,qquad \frac{dp}{p}=-3\frac{dx}{x}.$$
故 $p=Cx^{-3}$。再积分得 $y=C_1+C_2x^{-2}$，常数已重新命名。`,
    methodTwo: raw`观察 Euler 型试解 $y=x^m$，代入得
$$m(m-1)+3m=m(m+2)=0.$$
指标根为 $0,-2$，因此两个基本解是 $1,x^{-2}$，线性组合即为通解。`
  }),
  lectureFifteen({
    id: 'exercise-15-7-resonant-exponential', role: 'exercise', page: 'PDF 408-411 · 书页 403-406 · 习题 15.7',
    fingerprint: 'second-order-nonhomogeneous:simple-exponential-resonance',
    title: '习题 15.7 · 指数外力的一阶共振',
    statement: raw`求微分方程
$$y''-4y=e^{2x}$$
的通解。`,
    tags: ['二阶非齐次', '共振'],
    coreMethod: '齐次根为 $\pm2$；右端指数2与单根重合，因此特解需在 $e^{2x}$ 前乘一次 $x$。',
    mistakes: raw`若直接设 $Ae^{2x}$ 会被算子消去；共振阶数只是一重，所以乘 $x$ 而不是 $x^2$。`,
    answerText: raw`$$y=C_1e^{-2x}+C_2e^{2x}+\frac14xe^{2x}.$$`,
    methodOne: raw`齐次解为 $C_1e^{-2x}+C_2e^{2x}$。设 $y_p=Axe^{2x}$，代入
$$y_p''-4y_p=4Ae^{2x}.$$
比较右端得 $A=1/4$。`,
    methodTwo: raw`令 $y=e^{2x}v$，则
$$y''-4y=e^{2x}(v''+4v').$$
取简单特解 $v=x/4$ 即有 $v''+4v'=1$，故得到 $y_p=xe^{2x}/4$。`
  }),
  lectureFifteen({
    id: 'exercise-15-8-euler-nonhomogeneous', role: 'exercise', page: 'PDF 408-411 · 书页 403-406 · 习题 15.8',
    fingerprint: 'euler-equation:nonhomogeneous-resonant-polynomial-log-absolute',
    title: '习题 15.8 · 非齐次 Euler 方程与对数共振',
    statement: raw`求微分方程
$$x^2y''-2y=x^2$$
的通解。`,
    tags: ['Euler方程', '非齐次方程'],
    coreMethod: '在 $x>0$ 与 $x<0$ 的固定符号区间作对数换元；右端指数与齐次根共振会产生 $x^2\ln|x|$。',
    mistakes: '不能只写 $\ln x$ 而忽略负半轴；$x^2$ 已是齐次解，特解必须乘对数。',
    answerText: raw`$$y=C_1x^2+\frac{C_2}{|x|}+\frac13x^2\ln|x|,\qquad x\ne0.$$`,
    methodOne: raw`先试齐次幂函数，指标方程 $m(m-1)-2=0$，根为 $2,-1$。对右端 $x^2$ 与根2共振，设
$$y_p=Ax^2\ln|x|.$$
代入得 $x^2y_p''-2y_p=3Ax^2$，故 $A=1/3$。`,
    methodTwo: raw`在固定符号区间令 $t=\ln|x|$，方程化为
$$Y''-Y'-2Y=e^{2t}.$$
齐次根为 $2,-1$，右端与根2共振，取 $Y_p=te^{2t}/3$。换回即为 $x^2\ln|x|/3$。`
  }),
  lectureFifteen({
    id: 'exercise-15-9-recover-nonhomogeneous-equation', role: 'exercise', page: 'PDF 408-412 · 书页 403-407 · 习题 15.9',
    fingerprint: 'inverse-ode:particular-difference-reveals-double-root-and-forcing',
    title: '习题 15.9 · 由两个特解反求非齐次方程',
    statement: raw`已知
$$y_1=xe^x+e^{-x}$$
是某二阶常系数非齐次线性方程的特解，且
$$y_2=(x+1)e^x$$
是对应齐次方程的特解。求该非齐次方程。`,
    tags: ['反推微分方程', '线性叠加'],
    coreMethod: '由齐次特解的结构确定重根，再利用非齐次特解减去齐次部分提取真正外力。',
    mistakes: raw`$(x+1)e^x$ 是齐次解，说明 $e^x$ 与 $xe^x$ 都在齐次空间中；不能只判断单根。`,
    answerText: raw`$$y''-2y'+y=4e^{-x}.$$`,
    methodOne: raw`$y_2=(x+1)e^x$ 为齐次解，故 $r=1$ 是二重根，对应齐次算子 $(D-1)^2$。在 $y_1$ 中，$xe^x$ 属于齐次解，只需计算
$$ (D-1)^2[e^{-x}]=4e^{-x}.$$
故方程如答案。`,
    methodTwo: raw`直接对 $y_1$ 求导并代入候选左端：$xe^x$ 部分完全抵消，$e^{-x}$ 部分给出
$$e^{-x}+2e^{-x}+e^{-x}=4e^{-x}.$$
同时 $y_2$ 代入左端为零，两个条件均满足。`
  }),
  lectureFifteen({
    id: 'exercise-15-10-integral-equation', role: 'exercise', page: 'PDF 409-412 · 书页 404-407 · 习题 15.10',
    fingerprint: 'integral-equation:radial-double-integral-differentiate-to-linear-ode',
    title: '习题 15.10 · 径向二重积分方程化为微分方程',
    statement: raw`设函数 $f(t)$ 在 $[0,+\infty)$ 上连续，且满足
$$f(t)=e^{4\pi t^2}+\iint_{x^2+y^2\le4t^2}f\!\left(\frac12\sqrt{x^2+y^2}\right)dxdy.$$
求 $f(t)$。`,
    tags: ['积分方程', '极坐标', '一阶线性方程'],
    coreMethod: '把圆域二重积分化为径向一重积分，再对参数求导，得到关于 $f$ 的一阶线性方程。',
    mistakes: '极坐标面积元要乘 $r$；上限是 $2t$，链式求导会额外产生系数。',
    answerText: raw`$$f(t)=(4\pi t^2+1)e^{4\pi t^2}.$$`,
    methodOne: raw`极坐标下
$$f(t)=e^{4\pi t^2}+2\pi\int_0^{2t}r f(r/2)dr.$$
故 $f(0)=1$，对 $t$ 求导得
$$f'(t)=8\pi t e^{4\pi t^2}+8\pi t f(t).$$
解此线性方程并用初值，得到答案。`,
    methodTwo: raw`直接把候选式代入右侧。令 $u=r/2$，积分项为
$$8\pi\int_0^t u(4\pi u^2+1)e^{4\pi u^2}du
=4\pi t^2e^{4\pi t^2}.$$
再加首项 $e^{4\pi t^2}$，恰回到 $f(t)$。`
  }),
  lectureFifteen({
    id: 'exercise-15-11-higher-order-infinitesimal', role: 'exercise', page: 'PDF 409-412 · 书页 404-407 · 习题 15.11',
    fingerprint: 'higher-order-ode:construct-third-order-infinitesimal-solution',
    title: '习题 15.11 · 构造三阶无穷小解',
    statement: raw`设四阶常系数齐次线性方程
$$y^{(4)}-y^{(3)}+y''-y'=0.$$
求通解，并求 $x\to0$ 时是 $x$ 的三阶无穷小的非零解。`,
    tags: ['高阶常系数', '无穷小阶数'],
    coreMethod: '先由特征根写通解，再在零点作 Taylor 展开，令常数项、一次项和二次项消失而三次项非零。',
    mistakes: '“三阶无穷小”要求与 $x^3$ 同阶，不能把三次项也消去；常数参数需保留非零条件。',
    answerText: raw`通解为
$$y=C_1+C_2e^x+C_3\cos x+C_4\sin x.$$
所求解可写为
$$y=2C-Ce^x-C\cos x+C\sin x,\qquad C\ne0.$$`,
    methodOne: raw`特征多项式
$$r^4-r^3+r^2-r=r(r-1)(r^2+1),$$
故先得通解。将各基本解在零点展开，要求 $x^0,x^1,x^2$ 系数为零且 $x^3$ 系数非零，解得
$$C_1=2C,\ C_2=C_3=-C,\ C_4=C,$$
其中 $C\ne0$。`,
    methodTwo: raw`对候选解直接求零点导数：
$$y(0)=y'(0)=y''(0)=0,\qquad y^{(3)}(0)=-2C\ne0.$$
因此 $y\sim-y^{(3)}(0)x^3/6$ 与 $x^3$ 同阶；每个组成项又都是原方程基本解。`
  }),
  lectureFifteen({
    id: 'exercise-15-12-geometric-tangent-angle', role: 'exercise', page: 'PDF 409、412-413 · 书页 404、407-408 · 习题 15.12',
    fingerprint: 'geometric-ode:tangent-angle-derivative-equals-slope',
    title: '习题 15.12 · 切线倾角条件确定曲线',
    statement: raw`设函数 $y(x)$ 具有二阶导数，曲线 $y=y(x)$ 与直线 $y=x$ 相切于原点。记 $\alpha$ 为曲线在 $(x,y)$ 处切线的倾角，且
$$\frac{d\alpha}{dx}=\frac{dy}{dx}.$$
求 $y(x)$。`,
    tags: ['微分方程几何应用', '切线倾角'],
    coreMethod: raw`由 $y'=\tan\alpha$ 得 $d\alpha/dx=y''/[1+(y')^2]$，把几何条件转成二阶方程；相切条件给出两个初值。`,
    mistakes: raw`与 $y=x$ 在原点相切同时意味着 $y(0)=0,y'(0)=1$；只用过点条件不足以定解。`,
    answerText: raw`$$y=\arcsin\frac{e^x}{\sqrt2}-\frac\pi4.$$`,
    methodOne: raw`由 $\alpha=\arctan y'$，
$$\frac{d\alpha}{dx}=\frac{y''}{1+(y')^2}=y'.$$
故 $y''=y'[1+(y')^2]$。相切条件给出 $y(0)=0,y'(0)=1$，解该初值问题得到答案。`,
    methodTwo: raw`先对答案求导并验证
$$\frac{y''}{1+(y')^2}=y'.$$
在 $x=0$ 处有 $y=0,y'=1$，所以曲线确经过原点且切线为 $y=x$，几何条件全部闭合。`
  }),
  lectureFifteen({
    id: 'exercise-15-13-tangent-triangle-area', role: 'exercise', page: 'PDF 409、413 · 书页 404、408 · 习题 15.13',
    fingerprint: 'geometric-ode:tangent-intercepts-triangle-area-ratio',
    title: '习题 15.13 · 切线截距三角形的面积比轨迹',
    statement: raw`设 $f$ 可导且 $f'(x)>0$。曲线 $y=f(x)$（$x\ge0$）过原点，在点 $M(x,y)$ 的切线与 $x$ 轴交于 $T$，垂线 $MP$ 交 $x$ 轴于 $P$。若直线 $MP$、$x$ 轴与曲线围成图形的面积，与三角形 $MTP$ 的面积之比恒为 $3:2$，求曲线方程。`,
    tags: ['微分方程几何应用', '面积约束'],
    coreMethod: '用切线方程求横截距 $T$，把面积比写成积分等式，再对 $x$ 求导得到二阶方程。',
    mistakes: raw`切线横截距为 $x-y/y'$；面积关系含变上限积分，求导时要用乘积与商的链式法则。`,
    answerText: raw`$$y=Cx^3,\qquad C>0.$$`,
    methodOne: raw`切线横截距为 $x-y/y'$，故
$$\frac12\frac{y^2}{y'}=\frac23\int_0^x y(t)dt.$$
两边求导并整理得
$$yy''-\frac23(y')^2=0.$$
结合过原点、$x\ge0$ 与 $f'>0$，解得 $y=Cx^3,C>0$。`,
    methodTwo: raw`对 $y=Cx^3$ 直接验算：
$$\int_0^xCt^3dt=\frac C4x^4.$$
切线横截距为 $2x/3$，三角形面积为 $Cx^4/6$，所以曲线围成面积与三角形面积之比为 $(Cx^4/4):(Cx^4/6)=3:2$。`
  }),
  lectureFifteen({
    id: 'exercise-15-14-constant-difference', role: 'exercise', page: 'PDF 409、413 · 书页 404、408 · 习题 15.14',
    fingerprint: 'difference-equation:constant-forcing-initial-value',
    title: '习题 15.14 · 常量外力的一阶差分初值问题',
    statement: raw`求一阶非齐次线性差分方程
$$\Delta y_n=3,qquad y_0=2$$
的特解。`,
    tags: ['差分方程', '初值问题'],
    coreMethod: '对常量增量直接累加，或设一次多项式特解；初值用于确定齐次常数。',
    mistakes: '不要把连续方程的导数解法照搬；这里每前进一步，函数值增加3。',
    answerText: raw`$$y_n=2+3n.$$`,
    methodOne: raw`由 $y_{n+1}-y_n=3$，从 $0$ 到 $n-1$ 累加得
$$y_n-y_0=\sum_{k=0}^{n-1}3=3n.$$
代入 $y_0=2$ 即得答案。`,
    methodTwo: raw`齐次方程的解为常数 $C$。设特解 $y_n^*=An$，则
$$\Delta y_n^*=A=3.$$
故通解为 $C+3n$，由初值定出 $C=2$。`
  }),
  lectureFifteen({
    id: 'exercise-15-15-geometric-difference', role: 'exercise', page: 'PDF 409、413 · 书页 404、408 · 习题 15.15',
    fingerprint: 'difference-equation:geometric-homogeneous-plus-two-particular-forcings',
    title: '习题 15.15 · 几何型齐次解与复合外力',
    statement: raw`求差分方程
$$y_{n+1}-3y_n=2^n-1,qquad y_0=1$$
的特解。`,
    tags: ['差分方程', '待定系数'],
    coreMethod: '齐次解为 $A3^n$；对 $2^n$ 与常数外力分别设同型特解，再由初值确定 $A$。',
    mistakes: '右端有两个线性独立部分，必须分别设特解；常数项的符号容易算反。',
    answerText: raw`$$y_n=\frac12\,3^{n+1}-2^n+\frac12.$$`,
    methodOne: raw`齐次解为 $A3^n$。对 $2^n$ 设 $B2^n$，代入得 $-B2^n=2^n$，故 $B=-1$；对 $-1$ 设常数 $C$，得 $-2C=-1$，故 $C=1/2$。由 $y_0=1$ 得 $A=3/2$。`,
    methodTwo: raw`把方程迭代：
$$y_n=3^ny_0+\sum_{k=0}^{n-1}3^{n-1-k}(2^k-1).$$
分别求两个有限几何级数并化简，得到
$$y_n=\frac12\,3^{n+1}-2^n+\frac12.$$`
  })
]
