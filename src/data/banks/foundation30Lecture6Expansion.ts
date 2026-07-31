import type { SeedInput } from './types'

const ZY30_SOURCE = '何耀焜私人整理 · 张宇《基础30讲》高数 · 第6讲逐页核验'
type LectureSixSeed = Omit<SeedInput, 'id' | 'kind' | 'tags' | 'methodFingerprint' | 'source'> & {
  id: string
  role: 'example' | 'exercise'
  tags: string[]
  fingerprint: string
}

function lectureSix(input: LectureSixSeed): SeedInput {
  const roleLabel = input.role === 'example' ? '经典例题' : '课后习题'
  return {
    ...input,
    id: `zy30-verified-l06-${input.id}`,
    kind: 'problem',
    source: ZY30_SOURCE,
    tags: ['高等数学', '第6讲', roleLabel, 'PDF逐页核验', ...input.tags],
    methodFingerprint: `zy30-verified:l06:${input.fingerprint}`
  }
}

export const foundation30Lecture6ExpansionSeeds: SeedInput[] = [
  lectureSix({
    id: 'example-6-2', role: 'example', page: 'PDF 171 · 书页 166 · 例 6.2',
    fingerprint: 'root-existence:positive-endpoint-negative-right-limit-ratio',
    title: '例 6.2 · 由零点附近的差商符号寻找实根',
    statement: `设函数 $f(x)$ 在 $[0,1]$ 上连续，且

$$f(1)>0,\\qquad \\lim_{x\\to0^+}\\frac{f(x)}x<0.$$

证明：方程 $f(x)=0$ 在 $(0,1)$ 内至少有一个实根。`,
    tags: ['零点定理', '极限保号性', '证明题'],
    coreMethod: '先用极限的保号性在零点右侧找到一个函数值为负的点，再与正端点配对使用零点定理。',
    mistakes: '极限给出的是充分靠近零点时商的符号；因为此时 $x>0$，才能进一步推出 $f(x)<0$。',
    answerText: '方程在 $(0,1)$ 内至少有一个实根。',
    solutionMethods: [
      { title: '方法一 · 极限保号与零点定理', content: `由极限小于零，存在 $a\\in(0,1)$，使

$$\\frac{f(a)}a<0.$$

因为 $a>0$，故 $f(a)<0$。又 $f(1)>0$ 且 $f$ 在 $[a,1]$ 上连续，由零点定理，存在 $\\xi\\in(a,1)\\subset(0,1)$ 使 $f(\\xi)=0$。` },
      { title: '方法二 · 反证锁定符号变化', content: `若 $(0,1)$ 内没有零点，则连续函数在连通区间 $(0,1]$ 上不能改变符号。可是极限条件保证零点右侧存在 $f(a)<0$，而题设又有 $f(1)>0$，两点函数值异号，矛盾。` }
    ]
  }),
  lectureSix({
    id: 'example-6-3', role: 'example', page: 'PDF 172 · 书页 167 · 例 6.3',
    fingerprint: 'derivative-zero:endpoint-one-sided-derivatives-opposite-sign',
    title: '例 6.3 · 端点单侧导数异号推出内部导数为零',
    statement: `设 $f(x)$ 在 $[a,b]$ 上可导，并满足

$$f_+^{(1)}(a)\\,f_-^{(1)}(b)<0.$$

证明：存在 $\\xi\\in(a,b)$，使 $f^{(1)}(\\xi)=0$。`,
    tags: ['费马定理', '导数介值性', '证明题'],
    coreMethod: '端点单侧导数异号会把某个全局极值排除在两个端点之外，从而由费马定理得到内部驻点。',
    mistakes: '端点处使用的是单侧导数；不能把端点直接当作开区间内的费马点。',
    answerText: `存在 $\\xi\\in(a,b)$ 使 $f^{(1)}(\\xi)=0$。`,
    solutionMethods: [
      { title: '方法一 · 全局极值与费马定理', content: `不妨设 $f_+^{(1)}(a)>0$、$f_-^{(1)}(b)<0$。于是靠近 $a$ 的右侧有 $f(x)>f(a)$，靠近 $b$ 的左侧有 $f(x)>f(b)$，所以 $a,b$ 都不是 $f$ 在 $[a,b]$ 上的最大值点。连续函数必取得最大值，该点只能位于 $(a,b)$。由费马定理，其导数为零。另一种异号次序改取最小值，结论相同。` },
      { title: '方法二 · 两段中值定理与 Darboux 性', content: `在端点附近各取一点，由单侧导数的保号性可得到一条正割线和一条负割线。分别使用 Lagrange 中值定理，得到内部两点 $u,v$ 满足 $f^{(1)}(u)>0$、$f^{(1)}(v)<0$。导函数具有 Darboux 介值性，因此在 $u,v$ 之间必取到零。` }
    ]
  }),
  lectureSix({
    id: 'example-6-4', role: 'example', page: 'PDF 174 · 书页 169 · 例 6.4',
    fingerprint: 'rolle:three-values-average-equals-fourth-value',
    title: '例 6.4 · 三个函数值的平均数制造 Rolle 端点',
    statement: `设 $f(x)$ 在 $[0,3]$ 上连续、在 $(0,3)$ 内可导，且

$$f(0)+f(1)+f(2)=3,\\qquad f(3)=1.$$

证明：存在 $\\xi\\in(0,3)$，使 $f^{(1)}(\\xi)=0$。`,
    tags: ['介值定理', 'Rolle定理', '证明题'],
    coreMethod: '先由三个函数值的算术平均落在最小值与最大值之间，找到函数值等于 1 的内部点，再与 $x=3$ 配对使用 Rolle 定理。',
    mistakes: '不能从三个函数值之和为 3 直接断言其中某一项等于 1；需要连续函数的介值性补上这一步。',
    answerText: `存在 $\\xi\\in(0,3)$ 使 $f^{(1)}(\\xi)=0$。`,
    solutionMethods: [
      { title: '方法一 · 平均值落点', content: `令 $m,M$ 分别为 $f$ 在 $[0,2]$ 上的最小值和最大值，则

$$m\\le \\frac{f(0)+f(1)+f(2)}3=1\\le M.$$

由连续函数的介值性，存在 $c\\in[0,2]$ 使 $f(c)=1=f(3)$。在 $[c,3]$ 上使用 Rolle 定理，得到某个 $\\xi\\in(c,3)\\subset(0,3)$ 满足 $f^{(1)}(\\xi)=0$。` },
      { title: '方法二 · 函数值同侧反证', content: `若 $f(x)>1$ 在 $[0,2]$ 上恒成立，则 $f(0)+f(1)+f(2)>3$；若恒有 $f(x)<1$，则该和小于 3。因此连续曲线在 $[0,2]$ 上必触及水平线 $y=1$。再把该交点与 $(3,1)$ 连接，Rolle 定理给出水平切线。` }
    ]
  }),
  lectureSix({
    id: 'example-6-5', role: 'example', page: 'PDF 174 · 书页 169 · 例 6.5',
    fingerprint: 'rolle:power-weight-b-minus-x-integrating-factor',
    title: '例 6.5 · 幂权辅助函数制造微分等式',
    statement: `设 $f(x)$ 在 $[a,b]$ 上连续、在 $(a,b)$ 内可导，$f(a)=0$，且参数 $a>0$。证明：存在 $\\xi\\in(a,b)$，使

$$f(\\xi)=\\frac{b-\\xi}{a}f^{(1)}(\\xi).$$`,
    tags: ['Rolle定理', '辅助函数', '微分等式', '证明题'],
    coreMethod: '把目标式整理成乘积求导为零的形式，构造 $F(x)=f(x)(b-x)^a$，使两端函数值同时为零。',
    mistakes: '题中的 $a$ 同时是左端点和正参数；$a>0$ 保证 $(b-x)^a$ 在靠近 $b$ 时趋零。',
    answerText: `存在 $\\xi\\in(a,b)$ 满足 $a f(\\xi)=(b-\\xi)f^{(1)}(\\xi)$。`,
    solutionMethods: [
      { title: '方法一 · 乘积型辅助函数', content: `令

$$F(x)=f(x)(b-x)^a.$$

由 $f(a)=0$ 得 $F(a)=0$，又因 $a>0$ 得 $F(b)=0$。$F$ 满足 Rolle 定理条件，所以存在 $\\xi\\in(a,b)$ 使

$$0=F^{(1)}(\\xi)=(b-\\xi)^{a-1}\\big[(b-\\xi)f^{(1)}(\\xi)-a f(\\xi)\\big].$$

去掉非零因子即得结论。` },
      { title: '方法二 · 一阶线性方程识别', content: `目标式等价于

$$f^{(1)}(\\xi)-\\frac{a}{b-\\xi}f(\\xi)=0.$$

对应的一阶线性方程积分因子为 $(b-x)^a$，故左端正是 $[(b-x)^a f(x)]^{(1)}$ 除以 $(b-x)^a$。端点同值后使用 Rolle 定理，得到同一 $\\xi$。` }
    ]
  }),
  lectureSix({
    id: 'example-6-6', role: 'example', page: 'PDF 175 · 书页 170 · 例 6.6',
    fingerprint: 'second-derivative-zero:curve-secant-three-intersections',
    title: '例 6.6 · 曲线与割线三交点推出二阶导数为零',
    statement: `设 $f(x)$ 在 $[0,1]$ 上连续、在 $(0,1)$ 内二阶可导。过 $A(0,f(0))$ 与 $B(1,f(1))$ 的直线又与曲线 $y=f(x)$ 相交于 $C(c,f(c))$，其中 $0<c<1$。证明：存在 $\\xi\\in(0,1)$，使

$$f^{(2)}(\\xi)=0.$$`,
    tags: ['Rolle定理', '二阶导数', '几何交点', '证明题'],
    coreMethod: '减去经过两个端点的割线，使辅助函数在三个横坐标处为零，再连续使用两次 Rolle 定理。',
    mistakes: '第二次 Rolle 定理作用在辅助函数的一阶导数上；必须先从三个零点得到两个不同的一阶导数零点。',
    answerText: `存在 $\\xi\\in(0,1)$ 使 $f^{(2)}(\\xi)=0$。`,
    solutionMethods: [
      { title: '方法一 · 减去割线', content: `割线为

$$\\ell(x)=[f(1)-f(0)]x+f(0).$$

令 $F(x)=f(x)-\\ell(x)$，则 $F(0)=F(c)=F(1)=0$。分别在 $[0,c]$、$[c,1]$ 上使用 Rolle 定理，得到 $u\\in(0,c)$、$v\\in(c,1)$ 使 $F^{(1)}(u)=F^{(1)}(v)=0$。再在 $[u,v]$ 上使用 Rolle 定理，存在 $\\xi$ 使 $F^{(2)}(\\xi)=0$。因 $\\ell^{(2)}=0$，故 $f^{(2)}(\\xi)=0$。` },
      { title: '方法二 · 二阶差商', content: `三个点共线意味着二阶差商 $f[0,c,1]=0$。广义中值定理给出某个 $\\xi\\in(0,1)$，使

$$f[0,c,1]=\\frac{f^{(2)}(\\xi)}{2!}.$$

因此 $f^{(2)}(\\xi)=0$。该广义中值定理本身正是两次 Rolle 定理的压缩写法。` }
    ]
  }),
  lectureSix({
    id: 'example-6-7', role: 'example', page: 'PDF 175 · 书页 170 · 例 6.7',
    fingerprint: 'two-roots:product-f-fprime-three-zeros-rolle',
    title: '例 6.7 · 三个乘积零点逼出两个微分方程根',
    statement: `设 $f(x)$ 在 $[0,1]$ 上二阶可导，且

$$f(1)>0,\\qquad \\lim_{x\\to0^+}\\frac{f(x)}x<0.$$

证明：方程

$$f(x)f^{(2)}(x)+[f^{(1)}(x)]^2=0$$

在 $(0,1)$ 内至少有两个不同实根。`,
    tags: ['Rolle定理', '乘积求导', '根的个数', '证明题'],
    coreMethod: '先由零点定理得到 $f$ 的一个内部零点，同时由极限确定 $f(0)=0$；再让 $F=ff^{(1)}$ 在三个点取零。',
    mistakes: '目标左端是 $[f f^{(1)}]^{(1)}$，不是 $[f^2]^{(2)}$；三个零点还必须按顺序落在区间内。',
    answerText: '目标方程在 $(0,1)$ 内至少有两个不同实根。',
    solutionMethods: [
      { title: '方法一 · 三零点两次 Rolle', content: `有限极限与二阶可导性给出 $f(0)=0$。由例 6.2 的符号论证，存在 $b\\in(0,1)$ 使 $f(b)=0$。又在 $[0,b]$ 上使用 Rolle 定理，存在 $c\\in(0,b)$ 使 $f^{(1)}(c)=0$。令

$$F(x)=f(x)f^{(1)}(x).$$

则 $F(0)=F(c)=F(b)=0$。在 $[0,c]$ 与 $[c,b]$ 上分别使用 Rolle 定理，得到两个不同点 $\\xi,\\eta$，并有

$$F^{(1)}=f f^{(2)}+[f^{(1)}]^2=0.$$` },
      { title: '方法二 · 先看平方函数', content: `令 $G(x)=f^2(x)/2$，则 $G^{(1)}=ff^{(1)}$、$G^{(2)}=f f^{(2)}+[f^{(1)}]^2$。$G$ 在 $0,b$ 处同为零，且由 Rolle 定理存在内部驻点 $c$。因此 $G^{(1)}$ 在 $0,c,b$ 三点为零，再对 $G^{(1)}$ 的相邻零点使用 Rolle 定理，就得到两个 $G^{(2)}$ 的零点。` }
    ]
  }),
  lectureSix({
    id: 'example-6-8', role: 'example', page: 'PDF 176 · 书页 171 · 例 6.8',
    fingerprint: 'bounded-function:bounded-derivative-lagrange-anchor-point',
    title: '例 6.8 · 导数有界推出开区间内函数有界',
    statement: `若 $f(x)$ 在 $(a,b)$ 内可导，且 $f^{(1)}(x)$ 在 $(a,b)$ 内有界，证明：$f(x)$ 在 $(a,b)$ 内有界。`,
    tags: ['Lagrange中值定理', '有界性', '证明题'],
    coreMethod: '固定一个锚点，用 Lagrange 中值定理把任意函数值与锚点值之差控制在导数上界乘区间长度以内。',
    mistakes: '区间端点不一定属于定义域，所以不能直接使用 $f(a)$ 或 $f(b)$；应选择内部固定点。',
    answerText: `若存在 $K>0$ 使 $|f^{(1)}(x)|\\le K$，则任取 $x_0\\in(a,b)$，有

$$|f(x)|\\le |f(x_0)|+K(b-a).$$`,
    solutionMethods: [
      { title: '方法一 · 固定内部锚点', content: `取固定 $x_0\\in(a,b)$。对任意 $x\\ne x_0$，在 $x,x_0$ 之间使用 Lagrange 中值定理，存在 $\\xi$ 使

$$f(x)-f(x_0)=f^{(1)}(\\xi)(x-x_0).$$

若 $|f^{(1)}|\\le K$，则

$$|f(x)|\\le |f(x_0)|+K|x-x_0|\\le |f(x_0)|+K(b-a),$$

故 $f$ 有界。` },
      { title: '方法二 · Lipschitz 视角', content: `同一中值定理直接给出

$$|f(x)-f(y)|\\le K|x-y|$$

对任意 $x,y\\in(a,b)$ 成立，即 $f$ 是 Lipschitz 函数。把 $y$ 固定为任一内部点后，右侧在有限区间上有统一上界，因此函数值不可能发散。` }
    ]
  }),
  lectureSix({
    id: 'example-6-9', role: 'example', page: 'PDF 176 · 书页 171 · 例 6.9',
    fingerprint: 'positive-product:f-nonnegative-not-zero-square-lagrange',
    title: '例 6.9 · 非负函数必有同号函数值与导数',
    statement: `设 $f(x)$ 在 $[0,1]$ 上连续、在 $(0,1)$ 内可导，$f(0)=0$，且 $f$ 在 $[0,1]$ 上非负但不恒为零。证明：存在 $\\xi\\in(0,1)$，使

$$f(\\xi)f^{(1)}(\\xi)>0.$$`,
    tags: ['Lagrange中值定理', '辅助函数', '正值存在性', '证明题'],
    coreMethod: '平方辅助函数把目标乘积变成导数，再在零点与一个正值点之间使用 Lagrange 中值定理。',
    mistakes: '非负且不恒为零只保证存在正值点，不保证原函数在整个区间单调。',
    answerText: `存在 $\\xi\\in(0,1)$ 满足 $f(\\xi)f^{(1)}(\\xi)>0$。`,
    solutionMethods: [
      { title: '方法一 · 平方辅助函数', content: `令 $F(x)=f^2(x)/2$。由不恒为零且非负，存在 $a\\in(0,1]$ 使 $f(a)>0$，于是 $F(a)>F(0)=0$。在 $[0,a]$ 上使用 Lagrange 中值定理，存在 $\\xi\\in(0,a)$ 使

$$F^{(1)}(\\xi)=\\frac{F(a)-F(0)}a>0.$$

而 $F^{(1)}=f f^{(1)}$，结论成立。` },
      { title: '方法二 · 首次上升段', content: `取一点 $a$ 使 $f(a)>0$。对 $f$ 在 $[0,a]$ 使用 Lagrange 中值定理，得到 $c\\in(0,a)$ 使 $f^{(1)}(c)=f(a)/a>0$。若恰有 $f(c)>0$，立即完成；若 $f(c)=0$，则在 $[c,a]$ 上再次使用中值定理可取到导数为正且函数值已经为正的内部点，从而得到所需乘积。` }
    ]
  }),
  lectureSix({
    id: 'example-6-10', role: 'example', page: 'PDF 176-177 · 书页 171-172 · 例 6.10',
    fingerprint: 'choice-convex-negative-function:xf-and-f-over-x-monotonicity',
    title: '例 6.10 · 负函数的凸性锁定两个缩放比较',
    statement: `设函数 $f$ 满足 $f(0)=0$，且当 $x>0$ 时

$$f(x)<0,\\qquad f^{(1)}(x)<0,\\qquad f^{(2)}(x)>0.$$

当 $0<a<x<b$ 时，下列结论正确的是（　）。`,
    tags: ['凸性', '单调性', '选择题'],
    questionFormat: 'single-choice',
    options: ['$x f(x)>a f(a)$', '$b f(b)>x f(x)$', '$x f(a)>a f(x)$', '$x f(b)>b f(x)$'],
    correctOptionIds: ['D'],
    coreMethod: '分别研究 $g(x)=xf(x)$ 与 $h(x)=f(x)/x$ 的单调性；前者排除 A、B，后者利用凸性决定 C、D。',
    mistakes: '所有函数值均为负，交叉相乘和比较大小时很容易凭直觉把方向写反。',
    answerText: '正确选项为 D，即 $x f(b)>b f(x)$。',
    solutionMethods: [
      { title: '方法一 · 两个辅助函数', content: `令 $g(t)=t f(t)$，则

$$g^{(1)}(t)=f(t)+t f^{(1)}(t)<0,$$

故 $g(b)<g(x)<g(a)$，A、B 均错误。再令 $h(t)=f(t)/t$。由 Lagrange 中值定理，存在 $\\xi\\in(0,t)$ 使 $f(t)=t f^{(1)}(\\xi)$，于是

$$h^{(1)}(t)=\\frac{t f^{(1)}(t)-f(t)}{t^2}=\\frac{f^{(1)}(t)-f^{(1)}(\\xi)}t>0$$

因为 $f^{(2)}>0$。所以 $h(x)<h(b)$，即 $f(x)/x<f(b)/b$，等价于 $x f(b)>b f(x)$。` },
      { title: '方法二 · 凸函数割线斜率', content: `由 $f^{(2)}>0$，$f$ 严格凸。又 $f(0)=0$，所以从原点到 $(t,f(t))$ 的割线斜率 $f(t)/t$ 随 $t>0$ 严格增加。$x<b$ 给出

$$\\frac{f(x)}x<\\frac{f(b)}b,$$

同乘正数 $bx$ 即得 D。` }
    ]
  }),
  lectureSix({
    id: 'example-6-11', role: 'example', page: 'PDF 177 · 书页 172 · 例 6.11',
    fingerprint: 'cauchy-mean-value:logarithmic-coordinate-increment',
    title: '例 6.11 · 对数坐标下的 Cauchy 中值等式',
    statement: `设 $f(x)$ 在 $[a,b]$ 上连续、在 $(a,b)$ 内可导，且 $0<a<b$。证明：至少存在一点 $\\xi\\in(a,b)$，使

$$f(b)-f(a)=\\xi\\ln\\frac ba\\,f^{(1)}(\\xi).$$`,
    tags: ['Cauchy中值定理', '对数函数', '微分等式', '证明题'],
    coreMethod: '把 $f$ 与 $g(x)=\\ln x$ 配对使用 Cauchy 中值定理，分母导数 $1/x$ 会产生目标中的因子 $\\xi$。',
    mistakes: '必须有 $0<a<b$ 才能保证对数在闭区间上有定义且 $g^{(1)}(x)=1/x$ 不为零。',
    answerText: `存在 $\\xi\\in(a,b)$ 满足 $f(b)-f(a)=\\xi\\ln(b/a)f^{(1)}(\\xi)$。`,
    solutionMethods: [
      { title: '方法一 · Cauchy 中值定理', content: `在 $[a,b]$ 上取 $g(x)=\\ln x$。两函数满足 Cauchy 中值定理条件，且 $g^{(1)}(x)=1/x\\ne0$，故存在 $\\xi\\in(a,b)$ 使

$$\\frac{f(b)-f(a)}{\\ln b-\\ln a}=\\frac{f^{(1)}(\\xi)}{1/\\xi}=\\xi f^{(1)}(\\xi).$$

移项即得结论。` },
      { title: '方法二 · 对数换元', content: `令 $t=\\ln x$，并设 $F(t)=f(e^t)$。在 $[\\ln a,\\ln b]$ 上对 $F$ 使用 Lagrange 中值定理，存在 $\\eta$ 使

$$f(b)-f(a)=F^{(1)}(\\eta)(\\ln b-\\ln a).$$

而 $F^{(1)}(\\eta)=e^\\eta f^{(1)}(e^\\eta)$。令 $\\xi=e^\\eta\\in(a,b)$，得到同一等式。` }
    ]
  }),
  lectureSix({
    id: 'example-6-12', role: 'example', page: 'PDF 179 · 书页 174 · 例 6.12',
    fingerprint: 'integral-zero-convexity:midpoint-value-sign-taylor',
    title: '例 6.12 · 积分为零时由凸性判断中点函数值',
    statement: `设函数 $f(x)$ 在 $[0,1]$ 上二阶可导，且

$$\\int_0^1 f(x)\\,dx=0.$$

下列结论正确的是（　）。`,
    tags: ['Taylor公式', '凸性', '定积分', '选择题'],
    questionFormat: 'single-choice',
    options: [
      '当 $f^{(1)}(x)<0$ 时，$f(1/2)<0$',
      '当 $f^{(2)}(x)<0$ 时，$f(1/2)<0$',
      '当 $f^{(1)}(x)>0$ 时，$f(1/2)<0$',
      '当 $f^{(2)}(x)>0$ 时，$f(1/2)<0$'
    ],
    correctOptionIds: ['D'],
    coreMethod: '以中点为展开点写带 Lagrange 余项的二阶 Taylor 公式，积分后一次项因对称性消失，二阶项决定中点值的符号。',
    mistakes: '余项中的中间点随 $x$ 变化，但当 $f^{(2)}$ 在整个区间恒正时，带正权积分的符号仍然确定。',
    answerText: '正确选项为 D：若 $f^{(2)}(x)>0$，则 $f(1/2)<0$。',
    solutionMethods: [
      { title: '方法一 · 中点 Taylor 公式积分', content: `对每个 $x\\in[0,1]$，存在介于 $x$ 与 $1/2$ 之间的 $\\xi_x$，使

$$f(x)=f\\left(\\frac12\\right)+f^{(1)}\\left(\\frac12\\right)\\left(x-\\frac12\\right)+\\frac12f^{(2)}(\\xi_x)\\left(x-\\frac12\\right)^2.$$

在 $[0,1]$ 上积分，线性项积分为零。若 $f^{(2)}>0$，则最后一项积分严格为正，因此

$$0=\\int_0^1f(x)\\,dx>f\\left(\\frac12\\right),$$

故选 D。` },
      { title: '方法二 · 凸函数位于切线上方', content: `若 $f^{(2)}>0$，则 $f$ 严格凸，并满足

$$f(x)>f(1/2)+f^{(1)}(1/2)(x-1/2)\\quad(x\\ne1/2).$$

两边在 $[0,1]$ 上积分，右侧线性项的积分为零，得到 $0>f(1/2)$。这与 Taylor 路线同源，但无需显式追踪余项点。` }
    ]
  }),
  lectureSix({
    id: 'example-6-13', role: 'example', page: 'PDF 179-180 · 书页 174-175 · 例 6.13',
    fingerprint: 'third-derivative-value:endpoint-taylor-average-continuity',
    title: '例 6.13 · 两端 Taylor 余项锁定三阶导数值',
    statement: `设 $f(x)$ 在 $[-1,1]$ 上具有三阶连续导数，且

$$f(-1)=0,\\qquad f(1)=1,\\qquad f^{(1)}(0)=0.$$

证明：在 $(-1,1)$ 内至少存在一点 $\\xi$，使 $f^{(3)}(\\xi)=3$。`,
    tags: ['Taylor公式', '连续函数介值性', '三阶导数', '证明题'],
    coreMethod: '分别在 $x=-1$ 与 $x=1$ 处写以零点为中心的二阶 Taylor 公式，相减得到两个三阶导数值的平均数为 3。',
    mistakes: '展开到二阶时余项必须含三阶导数；两个端点对应的余项点一般不同。',
    answerText: `存在 $\\xi\\in(-1,1)$ 使 $f^{(3)}(\\xi)=3$。`,
    solutionMethods: [
      { title: '方法一 · 两端 Taylor 公式', content: `以 $0$ 为展开点，分别令 $x=-1,1$，存在 $\\eta_1\\in(-1,0)$、$\\eta_2\\in(0,1)$ 使

$$0=f(0)+\\frac12f^{(2)}(0)-\\frac16f^{(3)}(\\eta_1),$$

$$1=f(0)+\\frac12f^{(2)}(0)+\\frac16f^{(3)}(\\eta_2).$$

两式相减得

$$f^{(3)}(\\eta_1)+f^{(3)}(\\eta_2)=6.$$

数值 3 位于这两个函数值之间。由 $f^{(3)}$ 连续，存在 $\\xi$ 使 $f^{(3)}(\\xi)=3$。` },
      { title: '方法二 · 平均值与最值夹逼', content: `由上面的端点展开可得两个三阶导数值的算术平均为 3。设 $m,M$ 是 $f^{(3)}$ 在连接 $\\eta_1,\\eta_2$ 的闭区间上的最小值与最大值，则

$$m\\le \\frac{f^{(3)}(\\eta_1)+f^{(3)}(\\eta_2)}2=3\\le M.$$

连续函数取遍 $[m,M]$ 中的值，因此必取到 3。` }
    ]
  }),
  lectureSix({
    id: 'example-6-14', role: 'example', page: 'PDF 181-182 · 书页 176-177 · 例 6.14',
    fingerprint: 'root-count:even-absolute-power-plus-cosine-monotone-positive-side',
    title: '例 6.14 · 偶函数方程的实根个数',
    statement: `方程

$$|x|^{1/4}+|x|^{1/2}-\\cos x=0$$

在 $(-\\infty,+\\infty)$ 内有多少个实根（　）。`,
    tags: ['方程根的个数', '偶函数', '单调性', '选择题'],
    questionFormat: 'single-choice',
    options: ['没有实根', '有且仅有一个实根', '有且仅有两个实根', '有无穷多个实根'],
    correctOptionIds: ['C'],
    coreMethod: '利用偶性只研究正半轴；先把根限制在 $(0,1)$，再用严格单调性证明正根唯一。',
    mistakes: '$x=0$ 不是根，因为左端函数值为 $-1$；得到一个正根后还要用偶性补出对应负根。',
    answerText: '正确选项为 C：共有两个实根，且互为相反数。',
    solutionMethods: [
      { title: '方法一 · 正半轴单调性', content: `令

$$F(x)=|x|^{1/4}+|x|^{1/2}-\\cos x.$$

$F$ 为偶函数。对 $x\\ge1$，有 $x^{1/4}+x^{1/2}\\ge2>\\cos x$，故无根。在 $[0,1]$ 上，$F(0)=-1<0$、$F(1)=2-\\cos1>0$，所以至少有一个正根。且对 $0<x<1$，

$$F^{(1)}(x)=\\frac14x^{-3/4}+\\frac12x^{-1/2}+\\sin x>0,$$

故正根唯一。由偶性共有两个实根。` },
      { title: '方法二 · 交点视角', content: `在 $x>0$ 上，$x^{1/4}+x^{1/2}$ 严格增加，而在 $(0,1)$ 上 $\\cos x$ 严格减少，两图像至多相交一次；端点处前者由小于后者变为大于后者，所以恰相交一次。负半轴由对称性再产生一个交点。` }
    ]
  }),
  lectureSix({
    id: 'example-6-15', role: 'example', page: 'PDF 182 · 书页 177 · 例 6.15',
    fingerprint: 'unique-real-root:quintic-derivative-quadratic-discriminant-negative',
    title: '例 6.15 · 判别式控制五次方程唯一实根',
    statement: `若 $3a^2-5b<0$，则方程

$$x^5+2ax^3+3bx+4c=0$$

有几个不同实根（　）。`,
    tags: ['方程根的个数', '多项式', '判别式', '选择题'],
    questionFormat: 'single-choice',
    options: ['没有实根', '有唯一实根', '有三个不同实根', '有五个不同实根'],
    correctOptionIds: ['B'],
    coreMethod: '奇次多项式保证至少一个实根；再把导数视为关于 $x^2$ 的二次式，用判别式证明导数处处为正。',
    mistakes: '仅由五次多项式得出“至少一根”，不能推出唯一；唯一性来自严格单调。',
    answerText: '正确选项为 B：方程有且仅有一个实根。',
    solutionMethods: [
      { title: '方法一 · 导数判别式', content: `令 $F(x)=x^5+2ax^3+3bx+4c$。奇次首项为正，故 $F(-\\infty)=-\\infty$、$F(+\\infty)=+\\infty$，至少有一根。又

$$F^{(1)}(x)=5x^4+6ax^2+3b.$$

视为 $u=x^2$ 的二次式，其判别式为

$$\\Delta=36a^2-60b=12(3a^2-5b)<0.$$

首项系数为正，所以 $F^{(1)}(x)>0$ 对所有 $x$ 成立。$F$ 严格增加，实根唯一。` },
      { title: '方法二 · 完全平方下界', content: `由 $b>3a^2/5$，有

$$F^{(1)}(x)>5x^4+6ax^2+\\frac95a^2=5\\left(x^2+\\frac{3a}{5}\\right)^2\\ge0.$$

实际上不等号严格成立，因此 $F$ 严格增加。再结合两端无穷极限，零点恰有一个。` }
    ]
  }),
  lectureSix({
    id: 'example-6-16', role: 'example', page: 'PDF 182 · 书页 177 · 例 6.16',
    fingerprint: 'exactly-three-roots:two-power-minus-square-derivative-root-bound',
    title: '例 6.16 · 证明指数与二次函数恰有三个交点',
    statement: `证明方程

$$2^x-x^2-1=0$$

有且仅有三个实根。`,
    tags: ['方程根的个数', '指数函数', 'Rolle定理', '证明题'],
    coreMethod: '先直接找到两个根并用零点定理得到第三根；再用高阶导数的零点个数逐级限制原函数最多有三个零点。',
    mistakes: '证明“至少三个”之后还必须证明“至多三个”；只画草图不能排除更远处的额外根。',
    answerText: '方程恰有三个实根：$0$、$1$，以及区间 $(2,5)$ 内的一个根。',
    solutionMethods: [
      { title: '方法一 · 存在性加高阶零点计数', content: `令 $F(x)=2^x-x^2-1$。有 $F(0)=F(1)=0$，且 $F(2)=-1<0$、$F(5)=6>0$，故 $(2,5)$ 内还有一根，所以至少三根。

另一方面，

$$F^{(1)}(x)=2^x\\ln2-2x,\\quad F^{(2)}(x)=2^x(\\ln2)^2-2,\\quad F^{(3)}(x)=2^x(\\ln2)^3>0.$$

$F^{(2)}$ 严格增加，至多一根；由 Rolle 定理的零点递推，$F^{(1)}$ 至多两根，$F$ 至多三根。因此恰有三根。` },
      { title: '方法二 · 凸性分段', content: `$F^{(2)}$ 只有一个零点，所以 $F^{(1)}$ 先减后增，最多穿过横轴两次；于是 $F$ 最多有三个单调区间，每个区间至多一个零点。再结合已经找到的 $0,1$ 与 $(2,5)$ 内根，三个单调区间的零点名额已经用完。` }
    ]
  }),
  lectureSix({
    id: 'example-6-17', role: 'example', page: 'PDF 182-183 · 书页 177-178 · 例 6.17',
    fingerprint: 'parameter-unique-root:exponential-equals-kx-tangent-and-negative-slope',
    title: '例 6.17 · 指数方程唯一实根的参数范围',
    statement: `已知方程

$$e^x=kx$$

有且仅有一个实根，求 $k$ 的取值范围。`,
    tags: ['参数方程', '根的个数', '切线'],
    coreMethod: '按 $k$ 的符号研究 $F(x)=e^x-kx$ 的单调性与最小值；正参数出现唯一根只可能是相切情形。',
    mistakes: '$k=0$ 时方程无解；$k>0$ 时最小值等于零才是唯一根，小于零会产生两个根。',
    answerText: `$$k<0\\quad\\text{或}\\quad k=e.$$`,
    solutionMethods: [
      { title: '方法一 · 最小值分类', content: `令 $F(x)=e^x-kx$。若 $k<0$，则 $F^{(1)}=e^x-k>0$，且 $F(-\\infty)=-\\infty$、$F(+\\infty)=+\\infty$，故唯一根。若 $k=0$，无根。

若 $k>0$，唯一驻点为 $x=\\ln k$，且是全局最小点。唯一实根要求最小值恰为零：

$$F(\\ln k)=k-k\\ln k=k(1-\\ln k)=0,$$

故 $k=e$。` },
      { title: '方法二 · 分离变量看交点', content: `对 $x\\ne0$ 写成

$$k=\\frac{e^x}{x}.$$

在 $(-\\infty,0)$ 上，该函数严格为负并从 $0^-$ 下降到 $-\\infty$，每个 $k<0$ 对应一个交点。在 $(0,+\\infty)$ 上，它在 $x=1$ 处取得唯一最小值 $e$；水平线仅在 $k=e$ 时相切一次，$k>e$ 时交两次，$0<k<e$ 时不相交。` }
    ]
  }),
  lectureSix({
    id: 'example-6-18', role: 'example', page: 'PDF 183 · 书页 178 · 例 6.18',
    fingerprint: 'unique-positive-root:x-power-plus-nx-minus-one-monotone',
    title: '例 6.18 · 含正整数参数的方程唯一正根',
    statement: `已知方程

$$x^n+nx-1=0,$$

其中 $n$ 为正整数。证明：此方程存在唯一正实根 $x_n$，且 $0<x_n<1$。`,
    tags: ['参数方程', '单调性', '零点定理', '证明题'],
    coreMethod: '在非负半轴上证明函数严格增加，再用端点异号同时给出存在性、唯一性和根的区间。',
    mistakes: '解不出显式根不影响证明唯一性；不要把“设极限”或数值试根当作严格论证。',
    answerText: `方程在 $(0,1)$ 内有且仅有一个正实根 $x_n$。`,
    solutionMethods: [
      { title: '方法一 · 严格单调与零点定理', content: `令 $F_n(x)=x^n+nx-1$。当 $x>0$ 时

$$F_n^{(1)}(x)=n x^{n-1}+n>0,$$

所以 $F_n$ 在 $[0,+\\infty)$ 上严格增加。又 $F_n(0)=-1<0$、$F_n(1)=n>0$，由零点定理在 $(0,1)$ 内至少有一根；严格单调保证至多一根。` },
      { title: '方法二 · 两侧函数交点', content: `原方程等价于

$$x^n=1-nx.$$

在 $[0,1/n]$ 上，左侧从 0 严格增加，右侧从 1 严格减少，因此至多一个交点；端点处大小关系从 $0<1$ 变为 $(1/n)^n>0$，连续性保证恰有一个交点，且它自然属于 $(0,1/n)\\subset(0,1)$。` }
    ]
  }),
  lectureSix({
    id: 'example-6-19', role: 'example', page: 'PDF 184-185 · 书页 179-180 · 例 6.19',
    fingerprint: 'sine-chord-inequality:concavity-on-zero-half-pi',
    title: '例 6.19 · 正弦曲线高于端点弦线',
    statement: `证明：当 $0<x<\\pi/2$ 时，

$$\\sin x>\\frac{2x}{\\pi}.$$`,
    tags: ['微分不等式', '凹函数', '单调性', '证明题'],
    coreMethod: '把右端看成连接 $(0,0)$ 与 $(\\pi/2,1)$ 的弦线，利用正弦函数严格凹或辅助函数的端点零值完成证明。',
    mistakes: '严格不等式只在开区间成立；两个端点都取等号。',
    answerText: `对所有 $0<x<\\pi/2$，均有 $\\sin x>2x/\\pi$。`,
    solutionMethods: [
      { title: '方法一 · 严格凹性', content: `令

$$F(x)=\\sin x-\\frac{2x}{\\pi}.$$

在 $(0,\\pi/2)$ 上 $F^{(2)}(x)=-\\sin x<0$，故 $F$ 严格凹。又 $F(0)=F(\\pi/2)=0$，严格凹函数在两个端点连线的内部严格高于弦线，因此 $F(x)>0$。` },
      { title: '方法二 · 比值单调性', content: `研究 $G(x)=\\sin x/x$。有

$$G^{(1)}(x)=\\frac{x\\cos x-\\sin x}{x^2}.$$

令 $H(x)=x\\cos x-\\sin x$，则 $H^{(1)}(x)=-x\\sin x<0$ 且 $H(0)=0$，故 $G$ 严格减少。于是对 $0<x<\\pi/2$，

$$\\frac{\\sin x}{x}>\\frac{\\sin(\\pi/2)}{\\pi/2}=\\frac2\\pi.$$` }
    ]
  }),
  lectureSix({
    id: 'example-6-20', role: 'example', page: 'PDF 185 · 书页 180 · 例 6.20',
    fingerprint: 'log-square-inequality:nested-monotonicity-positive-gap',
    title: '例 6.20 · 对数差的平方上界',
    statement: `证明：对任意 $x>0$，

$$\\left(\\ln\\frac{1+x}{x}-\\frac1{1+x}\\right)^2<\\frac1{x(1+x)^2}.$$`,
    tags: ['微分不等式', '对数函数', '嵌套辅助函数', '证明题'],
    coreMethod: '先证明括号内为正，再证明它小于右端平方根；两个方向分别使用单调性与无穷远极限。',
    mistakes: '对平方不等式开方前必须先确认左侧括号内的符号。',
    answerText: '不等式对一切 $x>0$ 严格成立。',
    solutionMethods: [
      { title: '方法一 · 两个单调辅助函数', content: `令

$$F(x)=\\ln\\frac{1+x}{x}-\\frac1{1+x}.$$

则

$$F^{(1)}(x)=-\\frac1{x(1+x)^2}<0,\\qquad \\lim_{x\\to+\\infty}F(x)=0,$$

故 $F(x)>0$。再令

$$G(x)=F(x)-\\frac1{\\sqrt{x}(1+x)}.$$

求导并通分可得

$$G^{(1)}(x)=\\frac{1+3x-2\\sqrt{x}}{2x^2(1+x)^2}>0,$$

因为 $1+3x-2\\sqrt{x}$ 的最小值为 $2/3$。又 $G(+\\infty)=0$，故 $G(x)<0$。于是 $0<F(x)<1/[\\sqrt{x}(1+x)]$，平方即得结论。` },
      { title: '方法二 · 积分表示与 Cauchy-Schwarz', content: `注意

$$F(x)=\\int_x^{x+1}\\frac{dt}{t}-\\frac1{x+1}=\\int_x^{x+1}\\left(\\frac1t-\\frac1{x+1}\\right)dt
=\\int_x^{x+1}\\frac{x+1-t}{t(x+1)}dt>0.$$

再用加权 Cauchy-Schwarz 或直接比较 $t>x$，可将该积分严格控制在 $1/[\\sqrt{x}(1+x)]$ 以下，从而得到平方上界；等号不可能出现，因为积分区间内部比较严格。` }
    ]
  }),
  lectureSix({
    id: 'example-6-21', role: 'example', page: 'PDF 186 · 书页 181 · 例 6.21',
    fingerprint: 'two-sided-log-slope:mean-value-and-auxiliary-function',
    title: '例 6.21 · 对数割线斜率的双边估计',
    statement: `设 $0<a<b$，证明

$$\\frac{2a}{a^2+b^2}<\\frac{\\ln b-\\ln a}{b-a}<\\frac1{\\sqrt{ab}}.$$`,
    tags: ['Lagrange中值定理', '对数函数', '双边不等式', '证明题'],
    coreMethod: '右界把常数变量化构造辅助函数，左界用 Lagrange 中值定理把对数割线斜率写成某个中间点的倒数。',
    mistakes: '中值点满足 $a<\\xi<b$；比较 $1/\\xi$ 时要注意倒数函数递减。',
    answerText: '所给双边严格不等式成立。',
    solutionMethods: [
      { title: '方法一 · 分别处理两侧', content: `先证右侧。令

$$\\varphi(x)=\\ln x-\\ln a-\\frac{x-a}{\\sqrt{ax}},\\qquad x>a.$$

求导可化为

$$\\varphi^{(1)}(x)=-\\frac{(\\sqrt{x}-\\sqrt{a})^2}{2x\\sqrt{ax}}<0,$$

且 $\\varphi(a)=0$，故令 $x=b$ 得右侧。

再由 Lagrange 中值定理，存在 $\\xi\\in(a,b)$ 使

$$\\frac{\\ln b-\\ln a}{b-a}=\\frac1\\xi>\\frac1b.$$

而 $a^2+b^2>2ab$ 给出 $1/b>2a/(a^2+b^2)$，从而得到左侧。` },
      { title: '方法二 · Cauchy 中值与均值链', content: `对 $\\ln x$ 使用 Lagrange 中值定理得到割线斜率 $1/\\xi$。右界可由对数平均数

$$L(a,b)=\\frac{b-a}{\\ln b-\\ln a}$$

严格大于几何平均数 $\\sqrt{ab}$ 推出；左界等价于 $L(a,b)< (a^2+b^2)/(2a)$，而 $L(a,b)<b<(a^2+b^2)/(2a)$。两条严格均值比较合并即得。` }
    ]
  }),
  lectureSix({
    id: 'exercise-6-1', role: 'exercise', page: 'PDF 187-188 · 书页 182-183 · 习题 6.1',
    fingerprint: 'root-count:log-minus-linear-vertical-shift-two-roots',
    title: '习题 6.1 · 对数函数减线性项的零点个数',
    statement: `设常数 $k>0$，函数

$$f(x)=\\ln x-\\frac{x}{e}+k$$

在 $(0,+\\infty)$ 内的零点个数为（　）。`,
    tags: ['方程根的个数', '最值', '选择题'],
    questionFormat: 'single-choice',
    options: ['$3$', '$2$', '$1$', '$0$'],
    correctOptionIds: ['B'],
    coreMethod: '函数在 $x=e$ 处取得唯一最大值，且最大值为正、两端都趋于负无穷，因此最大点两侧各有一个零点。',
    mistakes: '必须同时证明每一侧至多一个零点；仅凭两端极限和最大值只能得到至少两个。',
    answerText: '正确选项为 B：共有两个零点。',
    solutionMethods: [
      { title: '方法一 · 单调区间与零点定理', content: `有

$$f^{(1)}(x)=\\frac1x-\\frac1e.$$

所以 $f$ 在 $(0,e)$ 上严格增加、在 $(e,+\\infty)$ 上严格减少，两个区间各至多一个零点。又

$$f(e)=k>0,\\qquad \\lim_{x\\to0^+}f(x)=-\\infty,\\qquad \\lim_{x\\to+\\infty}f(x)=-\\infty.$$

由零点定理，最大点两侧各恰有一个零点。` },
      { title: '方法二 · 凹函数图像', content: `$f^{(2)}(x)=-1/x^2<0$，故图像严格凹，至多与横轴相交两次。唯一最高点 $(e,k)$ 在横轴上方，而图像向定义域两端都下降到负无穷，所以横轴必被穿过两次。` }
    ]
  }),
  lectureSix({
    id: 'exercise-6-2', role: 'exercise', page: 'PDF 187-188 · 书页 182-183 · 习题 6.2',
    fingerprint: 'continuity-all-real:reciprocal-denominator-x-exp-minus-a-no-zero',
    title: '习题 6.2 · 分母无零点决定全实轴连续参数',
    statement: `若函数

$$f(x)=\\frac1{xe^{-x}-a}$$

在 $(-\\infty,+\\infty)$ 内处处连续，则常数 $a$ 的取值范围为（　）。`,
    tags: ['参数范围', '连续性', '最值', '选择题'],
    questionFormat: 'single-choice',
    options: ['$a<0$', '$a>e^{-1}$', '$a<e^{-1}$', '$0<a<e^{-1}$'],
    correctOptionIds: ['B'],
    coreMethod: '处处连续等价于分母永不为零；研究 $g(x)=xe^{-x}-a$ 的全局最大值即可。',
    mistakes: '只检查驻点而不检查无穷远极限会漏掉参数为负时的零点。',
    answerText: '正确选项为 B：$a>e^{-1}$。',
    solutionMethods: [
      { title: '方法一 · 分母函数最大值', content: `令 $g(x)=xe^{-x}-a$。有

$$g^{(1)}(x)=e^{-x}(1-x),$$

所以 $g$ 在 $x=1$ 处取得全局最大值

$$g(1)=e^{-1}-a.$$

要使 $g$ 在全实轴没有零点，只能令这个最大值严格小于零，即 $a>e^{-1}$。若最大值等于零，分母在 $x=1$ 为零；若最大值大于零，结合两端行为必出现零点。` },
      { title: '方法二 · 值域法', content: `函数 $h(x)=xe^{-x}$ 的值域为 $(-\\infty,e^{-1}]$：它在 $x=1$ 取得最大值 $e^{-1}$，向负无穷时趋于负无穷。分母无零点等价于 $a$ 不属于该值域，因此 $a\\in(e^{-1},+\\infty)$。` }
    ]
  }),
  lectureSix({
    id: 'exercise-6-3', role: 'exercise', page: 'PDF 187-188 · 书页 182-183 · 习题 6.3',
    fingerprint: 'polynomial-root:coefficient-weighted-sum-primitive-rolle',
    title: '习题 6.3 · 系数加权和为零推出多项式内部根',
    statement: `设实数 $a_0,a_1,\\ldots,a_n$ 满足

$$a_0+\\frac{a_1}{2}+\\frac{a_2}{3}+\\cdots+\\frac{a_n}{n+1}=0.$$

证明：方程

$$a_0+a_1x+a_2x^2+\\cdots+a_nx^n=0$$

在 $(0,1)$ 内至少有一个根。`,
    tags: ['Rolle定理', '多项式', '构造原函数', '证明题'],
    coreMethod: '系数分母 $1,2,\\ldots,n+1$ 暗示逐项积分，构造原函数后让两个端点函数值相等。',
    mistakes: '辅助函数必须从零次项积分开始；若仍保留常数 $a_0$，端点条件不会自动闭合。',
    answerText: '目标多项式在 $(0,1)$ 内至少有一个实根。',
    solutionMethods: [
      { title: '方法一 · 构造原函数用 Rolle', content: `令

$$F(x)=a_0x+\\frac{a_1}{2}x^2+\\cdots+\\frac{a_n}{n+1}x^{n+1}.$$

则 $F(0)=0$，而题设正好给出 $F(1)=0$。由 Rolle 定理，存在 $\\xi\\in(0,1)$ 使

$$F^{(1)}(\\xi)=a_0+a_1\\xi+\\cdots+a_n\\xi^n=0.$$` },
      { title: '方法二 · 积分平均值反证', content: `记 $P(x)=a_0+a_1x+\\cdots+a_nx^n$。题设等价于

$$\\int_0^1P(x)\\,dx=0.$$

若 $P$ 在 $(0,1)$ 内没有零点，连续性使其在整个区间内部保持严格同号，积分就不可能为零，矛盾。因此必有内部零点。` }
    ]
  }),
  lectureSix({
    id: 'exercise-6-4', role: 'exercise', page: 'PDF 187-188 · 书页 182-183 · 习题 6.4',
    fingerprint: 'two-rolle-identities:endpoint-zero-polynomial-and-exponential-weights',
    title: '习题 6.4 · 两种权函数制造不同微分等式',
    statement: `设函数 $f(x)$ 在 $[a,b]$ 上连续、在 $(a,b)$ 内可导，且 $f(a)=f(b)=0$。证明：

1. 存在 $\\xi\\in(a,b)$，使 $f(\\xi)+\\xi f^{(1)}(\\xi)=0$；
2. 存在 $\\eta\\in(a,b)$，使 $\\eta f(\\eta)+f^{(1)}(\\eta)=0$。`,
    tags: ['Rolle定理', '乘积求导', '微分等式', '证明题'],
    coreMethod: '第一式识别为 $[xf(x)]^{(1)}=0$，第二式识别为 $[e^{x^2/2}f(x)]^{(1)}=0$；两个辅助函数都继承端点零值。',
    mistakes: '两小问的权函数不同；第二式的指数必须是 $x^2/2$ 才会在求导后产生系数 $x$。',
    answerText: `存在 $\\xi,\\eta\\in(a,b)$ 分别满足两条目标等式。`,
    solutionMethods: [
      { title: '方法一 · 分别构造乘积', content: `令 $F(x)=xf(x)$，则 $F(a)=F(b)=0$。由 Rolle 定理，存在 $\\xi$ 使

$$F^{(1)}(\\xi)=f(\\xi)+\\xi f^{(1)}(\\xi)=0.$$

再令 $G(x)=e^{x^2/2}f(x)$，同样有 $G(a)=G(b)=0$。故存在 $\\eta$ 使

$$0=G^{(1)}(\\eta)=e^{\\eta^2/2}[f^{(1)}(\\eta)+\\eta f(\\eta)],$$

去掉正因子即得第二式。` },
      { title: '方法二 · 从线性微分结构反推权函数', content: `目标均为 $f^{(1)}+p(x)f=0$。积分因子通式为 $\\mu(x)=e^{\\int p(x)dx}$：第一式除以 $x$ 后可直接用权 $x$，第二式中 $p(x)=x$，得到权 $e^{x^2/2}$。端点同为零使加权函数满足 Rolle 定理。` }
    ]
  }),
  lectureSix({
    id: 'exercise-6-5', role: 'exercise', page: 'PDF 187-189 · 书页 182-184 · 习题 6.5',
    fingerprint: 'lagrange:derivative-of-x-cube-times-f',
    title: '习题 6.5 · 乘积导数与区间增量等式',
    statement: `设 $f(x)$ 在 $[0,1]$ 上连续、在 $(0,1)$ 内可导。证明：至少存在一点 $\\xi\\in(0,1)$，使

$$f(1)=3\\xi^2f(\\xi)+\\xi^3f^{(1)}(\\xi).$$`,
    tags: ['Lagrange中值定理', '乘积求导', '证明题'],
    coreMethod: '右端正是 $F(x)=x^3f(x)$ 的导数，且 $F(1)-F(0)=f(1)$，直接使用 Lagrange 中值定理。',
    mistakes: '$F(0)=0$ 来自因子 $x^3$，不需要额外假设 $f(0)=0$。',
    answerText: `存在 $\\xi\\in(0,1)$ 使目标等式成立。`,
    solutionMethods: [
      { title: '方法一 · 识别完整乘积导数', content: `令 $F(x)=x^3f(x)$。则 $F$ 在 $[0,1]$ 连续、在 $(0,1)$ 可导，并且

$$F(1)-F(0)=f(1).$$

由 Lagrange 中值定理，存在 $\\xi\\in(0,1)$ 使

$$f(1)=F^{(1)}(\\xi)=3\\xi^2f(\\xi)+\\xi^3f^{(1)}(\\xi).$$` },
      { title: '方法二 · 积分形式复核', content: `由微积分基本定理的结构可写

$$f(1)=F(1)-F(0)=\\int_0^1F^{(1)}(x)\\,dx.$$

若 $F^{(1)}$ 连续，积分中值定理直接给出某个 $\\xi$ 使积分等于 $F^{(1)}(\\xi)$；一般可导情形则回到 Lagrange 中值定理，结论不需要导数连续。` }
    ]
  }),
  lectureSix({
    id: 'exercise-6-6a', role: 'exercise', page: 'PDF 187-189 · 书页 182-184 · 习题 6.6（1）',
    fingerprint: 'root-existence:f-zero-one-endpoints-complementary-value',
    title: '习题 6.6（1）· 端点条件推出互补函数值',
    statement: `已知 $f(x)$ 在 $[0,1]$ 上连续、在 $(0,1)$ 内可导，且 $f(0)=0$、$f(1)=1$。证明：存在 $\\xi\\in(0,1)$，使

$$f(\\xi)=1-\\xi.$$`,
    tags: ['零点定理', '不动点变式', '证明题'],
    coreMethod: '把目标移项为 $f(x)+x-1=0$，辅助函数在两个端点严格异号。',
    mistakes: '这一步只需要连续性，题设中的可导性将在下一小问使用。',
    answerText: `存在 $\\xi\\in(0,1)$ 满足 $f(\\xi)=1-\\xi$。`,
    solutionMethods: [
      { title: '方法一 · 零点定理', content: `令 $F(x)=f(x)+x-1$。则

$$F(0)=-1<0,\\qquad F(1)=1>0.$$

$F$ 在 $[0,1]$ 连续，所以存在 $\\xi\\in(0,1)$ 使 $F(\\xi)=0$，即 $f(\\xi)=1-\\xi$。` },
      { title: '方法二 · 两条曲线交点', content: `连续曲线 $y=f(x)$ 从 $(0,0)$ 到 $(1,1)$，而直线 $y=1-x$ 从 $(0,1)$ 到 $(1,0)$。两条曲线在左右端点的上下关系相反，连续性保证它们在开区间内至少相交一次。` }
    ]
  }),
  lectureSix({
    id: 'exercise-6-6b', role: 'exercise', page: 'PDF 187-189 · 书页 182-184 · 习题 6.6（2）',
    fingerprint: 'two-derivatives-product-one:split-at-complementary-value-point',
    title: '习题 6.6（2）· 分段中值定理制造导数乘积为一',
    statement: `在习题 6.6（1）的条件下，证明：存在两个不同点 $\\eta,\\tau\\in(0,1)$，使

$$f^{(1)}(\\eta)f^{(1)}(\\tau)=1.$$`,
    tags: ['Lagrange中值定理', '导数乘积', '证明题'],
    coreMethod: '先取上一小问的交点 $\\xi$，再分别在 $[0,\\xi]$ 与 $[\\xi,1]$ 上使用中值定理，两条割线斜率恰好互为倒数。',
    mistakes: '两个中值点分处 $\\xi$ 两侧，因此天然不同；不要只在整个 $[0,1]$ 上使用一次中值定理。',
    answerText: `存在 $\\eta\\in(0,\\xi)$、$\\tau\\in(\\xi,1)$，满足 $f^{(1)}(\\eta)f^{(1)}(\\tau)=1$。`,
    solutionMethods: [
      { title: '方法一 · 在交点两侧分别取斜率', content: `由上一小问取 $\\xi\\in(0,1)$ 使 $f(\\xi)=1-\\xi$。在 $[0,\\xi]$ 上使用 Lagrange 中值定理，存在 $\\eta\\in(0,\\xi)$ 使

$$f^{(1)}(\\eta)=\\frac{f(\\xi)-f(0)}\\xi=\\frac{1-\\xi}{\\xi}.$$

在 $[\\xi,1]$ 上同理，存在 $\\tau\\in(\\xi,1)$ 使

$$f^{(1)}(\\tau)=\\frac{f(1)-f(\\xi)}{1-\\xi}=\\frac{\\xi}{1-\\xi}.$$

二者相乘为 1，且 $\\eta\\ne\\tau$。` },
      { title: '方法二 · 互补割线几何', content: `交点条件把左段纵增量变为 $1-\\xi$、右段纵增量变为 $\\xi$，而两段横长度恰好分别是 $\\xi$ 与 $1-\\xi$。因此两条割线斜率互为倒数；中值定理把它们分别搬到两段内部的切线斜率上。` }
    ]
  }),
  lectureSix({
    id: 'exercise-6-7', role: 'exercise', page: 'PDF 187-189 · 书页 182-184 · 习题 6.7',
    fingerprint: 'two-mean-value-points:linear-and-square-coordinate-slopes',
    title: '习题 6.7 · 两种中值定理配对比较导数',
    statement: `设函数 $f(x)$ 在 $[a,b]$ 上连续、在 $(a,b)$ 内可导，$0<a<b$，且 $f(a)\\ne f(b)$。证明：存在 $\\xi,\\eta\\in(a,b)$，使

$$\\frac{f^{(1)}(\\xi)}{2\\xi}=\\frac{f^{(1)}(\\eta)}{b+a}.$$`,
    tags: ['Lagrange中值定理', 'Cauchy中值定理', '微分等式', '证明题'],
    coreMethod: '同一个函数增量分别与 $x$、$x^2$ 的增量配对，两条中值等式消去 $f(b)-f(a)$。',
    mistakes: 'Cauchy 中值定理中的分母函数应选 $g(x)=x^2$；条件 $a>0$ 保证 $g^{(1)}=2x$ 不为零。',
    answerText: `存在 $\\xi,\\eta\\in(a,b)$ 满足目标等式。`,
    solutionMethods: [
      { title: '方法一 · Lagrange 与 Cauchy 配对', content: `由 Lagrange 中值定理，存在 $\\eta\\in(a,b)$ 使

$$f(b)-f(a)=f^{(1)}(\\eta)(b-a).$$

对 $f(x)$ 与 $g(x)=x^2$ 使用 Cauchy 中值定理，存在 $\\xi\\in(a,b)$ 使

$$\\frac{f(b)-f(a)}{b^2-a^2}=\\frac{f^{(1)}(\\xi)}{2\\xi}.$$

代入第一式并用 $b^2-a^2=(b-a)(b+a)$，即得结论。` },
      { title: '方法二 · 两种坐标下的割线斜率', content: `在普通坐标 $x$ 下，割线斜率被某点导数 $f^{(1)}(\\eta)$ 取得；把横坐标改为 $u=x^2$ 后，同一纵增量的割线斜率被 $f^{(1)}(\\xi)/(2\\xi)$ 取得。两个横增量之比为

$$\\frac{b-a}{b^2-a^2}=\\frac1{a+b},$$

故得到目标比例。` }
    ]
  }),
  lectureSix({
    id: 'exercise-6-8', role: 'exercise', page: 'PDF 187-189 · 书页 182-184 · 习题 6.8',
    fingerprint: 'derivative-bound:function-and-second-derivative-bounds-two-endpoint-taylor',
    title: '习题 6.8 · 函数值与二阶导数共同控制一阶导数',
    statement: `设 $f(x)$ 在 $[0,1]$ 上具有二阶导数，并满足

$$|f(x)|\\le a,\\qquad |f^{(2)}(x)|\\le b,$$

其中 $a,b\\ge0$。证明：对任意 $x\\in(0,1)$，

$$|f^{(1)}(x)|\\le 2a+\\frac b2.$$`,
    tags: ['Taylor公式', '导数估计', '证明题'],
    coreMethod: '以任意内部点为中心，分别向两个端点写一阶 Taylor 公式并相减；端点函数值控制主差，两个余项平方和不超过 1。',
    mistakes: '只向一个端点展开会得到依赖 $1/x$ 或 $1/(1-x)$ 的不稳定上界；必须同时利用两个端点。',
    answerText: `对所有 $x\\in(0,1)$，均有 $|f^{(1)}(x)|\\le2a+b/2$。`,
    solutionMethods: [
      { title: '方法一 · 两端 Taylor 公式相减', content: `固定 $c\\in(0,1)$。分别在 $c$ 处向 $0,1$ 展开，存在 $\\xi_0,\\xi_1\\in(0,1)$ 使

$$f(0)=f(c)-c f^{(1)}(c)+\\frac12c^2f^{(2)}(\\xi_0),$$

$$f(1)=f(c)+(1-c)f^{(1)}(c)+\\frac12(1-c)^2f^{(2)}(\\xi_1).$$

两式相减并估计绝对值：

$$|f^{(1)}(c)|\\le |f(1)|+|f(0)|+\\frac b2[(1-c)^2+c^2]\\le2a+\\frac b2,$$

因为 $(1-c)^2+c^2\\le1$。` },
      { title: '方法二 · 导数与其平均值比较', content: `由 $|f^{(2)}|\\le b$，$f^{(1)}$ 是 Lipschitz 函数。注意

$$\\int_0^1f^{(1)}(t)dt=f(1)-f(0).$$

于是

$$\\left|f^{(1)}(c)-[f(1)-f(0)]\\right|\\le\\int_0^1|f^{(1)}(c)-f^{(1)}(t)|dt
\\le b\\int_0^1|c-t|dt\\le\\frac b2.$$

再用 $|f(1)-f(0)|\\le2a$ 即得。` }
    ]
  }),
  lectureSix({
    id: 'exercise-6-9', role: 'exercise', page: 'PDF 188-189 · 书页 183-184 · 习题 6.9',
    fingerprint: 'tangent-chord-inequality:tan-below-endpoint-chord-convexity',
    title: '习题 6.9 · 正切函数低于端点弦线',
    statement: `证明：当 $0<x<\\pi/4$ 时，

$$\\tan x<\\frac{4x}{\\pi}.$$`,
    tags: ['微分不等式', '凸函数', '证明题'],
    coreMethod: '把右端看成连接 $(0,0)$ 与 $(\\pi/4,1)$ 的弦线；正切函数在该区间严格凸，因此图像严格位于弦线下方。',
    mistakes: '凸函数位于弦线下方、切线上方；不要与凹函数的方向混淆。',
    answerText: `对所有 $0<x<\\pi/4$，都有 $\\tan x<4x/\\pi$。`,
    solutionMethods: [
      { title: '方法一 · 严格凸性与弦线', content: `令

$$F(x)=\\tan x-\\frac{4x}{\\pi}.$$

在 $(0,\\pi/4)$ 上

$$F^{(2)}(x)=2\\sec^2x\\tan x>0,$$

故 $F$ 严格凸。又 $F(0)=F(\\pi/4)=0$，严格凸函数在端点弦线内部严格低于弦线，因此 $F(x)<0$。` },
      { title: '方法二 · 比值单调与端点比较', content: `研究 $G(x)=\\tan x/x$。有

$$G^{(1)}(x)=\\frac{x\\sec^2x-\\tan x}{x^2}.$$

分子 $H(x)=x\\sec^2x-\\tan x$ 满足 $H(0)=0$、$H^{(1)}(x)=2x\\sec^2x\\tan x>0$，故 $G$ 严格增加。因此

$$\\frac{\\tan x}{x}<\\frac{\\tan(\\pi/4)}{\\pi/4}=\\frac4\\pi.$$` }
    ]
  }),
  lectureSix({
    id: 'exercise-6-10', role: 'exercise', page: 'PDF 188-189 · 书页 183-184 · 习题 6.10',
    fingerprint: 'young-inequality:conjugate-exponents-one-variable-minimum',
    title: '习题 6.10 · 共轭指数下的 Young 不等式特例',
    statement: `设 $p,q>1$，且

$$\\frac1p+\\frac1q=1.$$

证明：对任意 $x>0$，

$$\\frac{x^p}{p}+\\frac1q\\ge x.$$`,
    tags: ['Young不等式', '最值', '证明题'],
    coreMethod: '把两边移项构造单变量函数，唯一驻点 $x=1$ 是全局最小点；也可直接套加权 AM-GM。',
    mistakes: '共轭条件给出 $1/q=1-1/p$；等号只在 $x=1$ 时成立。',
    answerText: `不等式成立，且当且仅当 $x=1$ 时取等号。`,
    solutionMethods: [
      { title: '方法一 · 单变量最小值', content: `令

$$F(x)=\\frac{x^p}{p}+\\frac1q-x.$$

则

$$F^{(1)}(x)=x^{p-1}-1,\\qquad F^{(2)}(x)=(p-1)x^{p-2}>0.$$

因此 $x=1$ 是唯一全局最小点。又

$$F(1)=\\frac1p+\\frac1q-1=0,$$

故 $F(x)\\ge0$。` },
      { title: '方法二 · 加权 AM-GM', content: `对正数 $x^p$ 与 $1$，使用权重 $1/p$ 与 $1/q$ 的加权 AM-GM：

$$\\frac1p x^p+\\frac1q\\cdot1\\ge (x^p)^{1/p}\\cdot1^{1/q}=x.$$

两项相等的条件为 $x^p=1$，即 $x=1$。` }
    ]
  })
]
