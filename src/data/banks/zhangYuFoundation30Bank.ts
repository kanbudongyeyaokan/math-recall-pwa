import type { SeedInput } from './types'

type FoundationQuestion = Omit<SeedInput, 'id' | 'kind' | 'source' | 'page' | 'tags'> & {
  slug: string
  lecture: number
  role: 'example' | 'exercise'
  page: string
  tags: string[]
}

const SOURCE = '何耀焜私人整理 · 张宇《基础30讲》高数（自购资料，题型等价改写）'

function buildSourceQuestion(question: FoundationQuestion): SeedInput {
  const roleTag = question.role === 'example' ? '经典例题' : '课后训练'
  return {
    ...question,
    id: `zy30-source-l${String(question.lecture).padStart(2, '0')}-${question.role}-${question.slug}`,
    kind: 'problem',
    tags: ['高等数学', `第${question.lecture}讲`, roleTag, ...question.tags],
    source: SOURCE,
    page: `PDF ${question.page}`
  }
}

const questions: FoundationQuestion[] = [
  {
    slug: 'removable-discontinuity-parameter', lecture: 1, role: 'example', page: '8 · 书页 3',
    title: '补点连续与参数确定',
    statement: `设

$$f(x)=\\begin{cases}\\dfrac{x^2-1}{x-1},&x\\ne1,\\\\a,&x=1.\\end{cases}$$

确定参数 $a$，使 $f$ 在 $x=1$ 处连续，并说明参数取其他值时的间断类型。`,
    tags: ['连续', '分段函数', '参数补点'],
    coreMethod: '先求去心极限，再与函数在该点的取值比较；补点只能改变点值，不能改变去心极限。',
    mistakes: '直接把 $x=1$ 代入原分式得到 $0/0$；或只算出极限，却没有核对它是否等于 $f(1)$。',
    answerText: `$a=2$ 时连续；$a\\ne2$ 时 $x=1$ 是可去间断点。`,
    solutionMethods: [
      { title: '方法一 · 因式分解求极限', content: `当 $x\\ne1$ 时，$f(x)=x+1$，所以

$$\\lim_{x\\to1}f(x)=\\lim_{x\\to1}(x+1)=2.$$

连续要求极限等于点值 $f(1)=a$，故 $a=2$。若 $a\\ne2$，去心极限仍存在且有限，只是与点值不等，因此是可去间断点。` },
      { title: '方法二 · 图像补点复核', content: `曲线 $y=x+1$ 在 $x=1$ 处的极限位置是 $(1,2)$。分段定义只决定 $x=1$ 处实际放置的点，只有把该点放在 $(1,2)$ 上才连续；放在其他高度都会留下一个可补的空点。` }
    ],
    methodFingerprint: 'zy30-source:l01:removable-discontinuity:limit-equals-point-value'
  },
  {
    slug: 'third-order-limit-recovery', lecture: 1, role: 'exercise', page: '73 · 书页 68',
    title: '从复合极限反推二阶主部',
    statement: `已知

$$\\lim_{x\\to0}\\frac{\\sin x+x f(x)}{x^3}=0,$$

求

$$\\lim_{x\\to0}\\frac{1+f(x)}{x^2}.$$
`,
    tags: ['极限计算', 'Taylor', '反推主部'],
    coreMethod: '把已知极限翻译成带 Peano 余项的等式，再将已知函数展开到题目所需的最低非零阶。',
    mistakes: '只使用 $\\sin x\\sim x$ 会丢失三阶项，无法确定所求的二阶系数。',
    answerText: `极限为 $\\dfrac16$。`,
    solutionMethods: [
      { title: '方法一 · Peano 余项', content: `已知条件等价于 $\\sin x+xf(x)=o(x^3)$。两边除以 $x$，得

$$f(x)=-\\frac{\\sin x}{x}+o(x^2).$$

由 $\\sin x/x=1-x^2/6+o(x^2)$，可得 $1+f(x)=x^2/6+o(x^2)$，故所求极限为 $1/6$。` },
      { title: '方法二 · 拆出标准极限', content: `由条件可写成

$$\\frac{1+f(x)}{x^2}=\\frac{x-\\sin x}{x^3}+\\frac{\\sin x+xf(x)}{x^3}.$$

第二项趋于 $0$；第一项由三阶 Taylor 展开或三次洛必达法则得到 $1/6$，所以总极限为 $1/6$。` }
    ],
    methodFingerprint: 'zy30-source:l01:recover-quadratic-principal-part:third-order-limit'
  },
  {
    slug: 'unbounded-not-infinite-sequence', lecture: 2, role: 'example', page: '86 · 书页 81',
    title: '无界数列与趋于无穷的区别',
    statement: `设数列

$$a_{2k}=\\frac1{2k},\\qquad a_{2k-1}=2k-1\\quad(k\\ge1).$$

判断该数列是否有界、是否趋于 $+\\infty$，并写出判断依据。`,
    tags: ['数列极限', '子列', '无界性'],
    coreMethod: '分别考察奇数子列与偶数子列；趋于正无穷要求尾部每一项都超过任意给定正数。',
    mistakes: '看到奇数项任意大，就误判整个数列趋于 $+\\infty$；无界只需要存在任意大的项，而趋于无穷要求全部尾项都大。',
    answerText: `数列无界，但不趋于 $+\\infty$，也不收敛。`,
    solutionMethods: [
      { title: '方法一 · 子列判定', content: `奇数子列 $a_{2k-1}=2k-1\\to+\\infty$，所以原数列无上界。偶数子列 $a_{2k}=1/(2k)\\to0$，因此对任何正数 $M$，尾部仍有偶数项小于 $M$，原数列不可能趋于 $+\\infty$。` },
      { title: '方法二 · 定义反证', content: `若 $a_n\\to+\\infty$，取 $M=1$，应存在 $N$ 使所有 $n>N$ 都有 $a_n>1$。但总能选取偶数 $2k>N$，且 $a_{2k}=1/(2k)<1$，与定义矛盾。` }
    ],
    methodFingerprint: 'zy30-source:l02:unbounded-versus-positive-infinity:subsequence-counterexample'
  },
  {
    slug: 'squeezed-root-sum', lecture: 2, role: 'exercise', page: '101 · 书页 96',
    title: '同阶根式和的夹逼极限',
    statement: `计算

$$\\lim_{n\\to\\infty}\\sum_{k=1}^{n}\\frac1{\\sqrt{n^2+k}}.$$
`,
    tags: ['数列极限', '夹逼', '黎曼和'],
    coreMethod: '统一比较每个根式分母的上下界；也可提出 $n$，把和改写成黎曼和。',
    mistakes: '把每一项直接当作 $1/n$ 后没有控制总误差；单项等价在有 $n$ 项累加时不能无条件逐项替换。',
    answerText: `极限为 $1$。`,
    solutionMethods: [
      { title: '方法一 · 整体夹逼', content: `对 $1\\le k\\le n$，有

$$n^2+1\\le n^2+k\\le n^2+n.$$

因此

$$\\frac{n}{\\sqrt{n^2+n}}\\le\\sum_{k=1}^{n}\\frac1{\\sqrt{n^2+k}}\\le\\frac{n}{\\sqrt{n^2+1}}.$$

左右两端都趋于 $1$，由夹逼定理，原极限为 $1$。` },
      { title: '方法二 · 黎曼和视角', content: `提出 $n$ 后原式为

$$\\frac1n\\sum_{k=1}^{n}\\frac1{\\sqrt{1+k/n^2}}.$$

区间内 $0\\le k/n^2\\le1/n$，被平均的函数值一致趋于 $1$；故整个平均值趋于 $1$。这也解释了为何必须控制一致误差。` }
    ],
    methodFingerprint: 'zy30-source:l02:uniform-root-sum:squeeze-uniform-error'
  },
  {
    slug: 'derivative-parity-periodicity', lecture: 3, role: 'example', page: '107 · 书页 102',
    title: '导函数的奇偶性与周期性',
    statement: `设 $f$ 在 $\\mathbb R$ 上可导。下列命题中正确的是（多选）：`,
    tags: ['导数定义', '奇偶性', '周期性', '多选题'],
    coreMethod: '从原函数的恒等式出发对等式两边求导，注意链式法则带来的负号；周期性要保持同一个周期平移。',
    mistakes: '对 $f(-x)$ 求导时漏掉内层导数 $-1$；或由导函数的奇偶性反推原函数时，忘记原函数还可以相差一个常数。',
    answerText: `正确选项为 A、B、C。D 错在忽略了原函数可以相差一个常数，例如 $f(x)=x+1$ 的导函数为偶函数，但 $f$ 不是奇函数。`,
    questionFormat: 'multiple-choice',
    options: [
      '若 $f$ 为偶函数，则 $f^{(1)} $ 为奇函数。',
      '若 $f$ 为奇函数，则 $f^{(1)} $ 为偶函数。',
      '若 $T$ 是 $f$ 的周期，则 $T$ 也是 $f^{(1)} $ 的周期。',
      '若 $f^{(1)}$ 为偶函数，则 $f$ 必为奇函数。'
    ],
    correctOptionIds: ['A', 'B', 'C'],
    solutionMethods: [
      { title: '方法一 · 恒等式求导', content: `偶函数满足 $f(-x)=f(x)$，求导得 $-f^{(1)}(-x)=f^{(1)}(x)$，故 $f^{(1)}$ 为奇函数。奇函数满足 $f(-x)=-f(x)$，求导得 $f^{(1)}(-x)=f^{(1)}(x)$。若 $f(x+T)=f(x)$，求导得 $f^{(1)}(x+T)=f^{(1)}(x)$。` },
      { title: '方法二 · 反例审查逆命题', content: `前三项都由定义恒等式直接推出。对 D，取 $f(x)=x+1$，则 $f^{(1)}(x)=1$ 是偶函数，但 $f(-x)\\ne-f(x)$。事实上只能推出 $f(x)-f(0)$ 为奇函数，不能擅自删掉常数项。` }
    ],
    methodFingerprint: 'zy30-source:l03:derivative-symmetry:identity-differentiation'
  },
  {
    slug: 'differentiable-derivative-discontinuous', lecture: 3, role: 'exercise', page: '120 · 书页 115',
    title: '原点可导但导函数不连续',
    statement: `设

$$f(x)=\\begin{cases}x^2\\sin\\dfrac1x,&x\\ne0,\\\\0,&x=0.\\end{cases}$$

判断 $f$ 在 $x=0$ 处是否可导，并判断 $f^{(1)}$ 在 $x=0$ 处是否连续。`,
    tags: ['导数定义', '分段函数', '振荡'],
    coreMethod: '点处可导必须使用差商定义；导函数连续则要先求邻域内导数，再考察其极限。',
    mistakes: '把 $x\\ne0$ 时的求导公式直接代入 $x=0$；或因函数含振荡项就误判原点不可导。',
    answerText: `$f^{(1)}(0)=0$，所以 $f$ 在原点可导；但 $f^{(1)}$ 在原点不连续。`,
    solutionMethods: [
      { title: '方法一 · 差商与邻域导数分开算', content: `由定义

$$f^{(1)}(0)=\\lim_{h\\to0}\\frac{h^2\\sin(1/h)}h=\\lim_{h\\to0}h\\sin(1/h)=0.$$

而 $x\\ne0$ 时

$$f^{(1)}(x)=2x\\sin(1/x)-\\cos(1/x).$$

后一项在 $x\\to0$ 时振荡，故 $f^{(1)}(x)$ 没有极限，导函数在原点不连续。` },
      { title: '方法二 · 两条数列复核', content: `差商绝对值不超过 $|h|$，故可导且导数为零。取 $x_n=1/(2n\\pi)$，有 $f^{(1)}(x_n)=-1$；取 $y_n=1/((2n+1)\\pi)$，有 $f^{(1)}(y_n)=1$。两子列极限不同，确认 $f^{(1)}$ 在零点不连续。` }
    ],
    methodFingerprint: 'zy30-source:l03:pointwise-differentiability:oscillatory-derivative-discontinuity'
  },
  {
    slug: 'product-high-order-derivative', lecture: 4, role: 'example', page: '126 · 书页 121',
    title: '乘积最低次项锁定高阶导数',
    statement: `设正整数 $n\\ge1$，

$$F(x)=\\prod_{k=1}^{n}\\tan\\frac{x}{k}.$$

求 $F^{(n)}(0)$。`,
    tags: ['高阶导数', 'Taylor', '乘积结构'],
    coreMethod: '求点处高阶导数时，只需锁定幂级数中对应次数的系数；乘积的最低次数由各因子的最低次数相加。',
    mistakes: '直接展开 Leibniz 多重求导，产生大量在零点为零的项；或忘记导数值等于系数乘以阶乘。',
    answerText: `$F^{(n)}(0)=1$。`,
    solutionMethods: [
      { title: '方法一 · 最低次 Taylor 项', content: `对每个 $k$，有 $\\tan(x/k)=x/k+O(x^3)$。因此

$$F(x)=\\frac{x^n}{1\\cdot2\\cdots n}+O(x^{n+2})=\\frac{x^n}{n!}+O(x^{n+2}).$$

$x^n$ 的系数是 $1/n!$，故 $F^{(n)}(0)=n!\\cdot(1/n!)=1$。` },
      { title: '方法二 · Leibniz 中唯一存活项', content: `每个因子在零点的函数值为零，而一阶导数为 $1/k$。对乘积求 $n$ 阶导数后，零点处只有“每个因子恰好求一次导”的项不为零。该项的多项式系数为 $n!$，所以结果为 $n!\\prod_{k=1}^{n}(1/k)=1$。` }
    ],
    methodFingerprint: 'zy30-source:l04:product-high-derivative:lowest-degree-coefficient'
  },
  {
    slug: 'parametric-second-derivative', lecture: 4, role: 'exercise', page: '140 · 书页 135',
    title: '参数方程二阶导数',
    statement: `曲线由

$$x=\\ln(1+t^2),\\qquad y=2\\arctan t\\qquad(t\\ne0)$$

给出，求 $d^2y/dx^2$。`,
    tags: ['参数方程', '二阶导数', '链式法则'],
    coreMethod: '先算 $dy/dx=(dy/dt)/(dx/dt)$，再对该结果关于 $t$ 求导并除以 $dx/dt$。',
    mistakes: '把 $d^2y/dx^2$ 错写成 $(d^2y/dt^2)/(d^2x/dt^2)$；二阶导数需要再次除以 $dx/dt$。',
    answerText: `$$\\frac{d^2y}{dx^2}=-\\frac{1+t^2}{2t^3}.$$`,
    solutionMethods: [
      { title: '方法一 · 参数求导公式', content: `有

$$\\frac{dx}{dt}=\\frac{2t}{1+t^2},\\qquad\\frac{dy}{dt}=\\frac2{1+t^2},$$

故 $dy/dx=1/t$。再算

$$\\frac{d^2y}{dx^2}=\\frac{d(1/t)/dt}{dx/dt}=\\frac{-1/t^2}{2t/(1+t^2)}=-\\frac{1+t^2}{2t^3}.$$` },
      { title: '方法二 · 消参复核', content: `由 $y=2\\arctan t$ 得 $t=\\tan(y/2)$，同时 $e^x=1+t^2=\\sec^2(y/2)$。对隐式关系 $e^x=\\sec^2(y/2)$ 求导可先得到 $y^{(1)}=1/t$，再沿参数求导，仍得 $y^{(2)}=-(1+t^2)/(2t^3)$。` }
    ],
    methodFingerprint: 'zy30-source:l04:parametric-second-derivative:divide-by-dxdt-twice'
  },
  {
    slug: 'first-nonzero-even-derivative', lecture: 5, role: 'example', page: '148 · 书页 143',
    title: '首个非零高阶导数判别极值',
    statement: `设 $f$ 在 $x_0$ 的邻域内具有 $2m$ 阶导数，并满足

$$f^{(1)}(x_0)=f^{(2)}(x_0)=\\cdots=f^{(2m-1)}(x_0)=0,\\qquad f^{(2m)}(x_0)<0.$$

判断 $x_0$ 是否为极值点，并给出严格理由。`,
    tags: ['极值', '高阶导数', 'Taylor'],
    coreMethod: '找到首个非零导数的阶数：偶数阶决定同侧符号，奇数阶决定穿越；再由系数正负判断极大或极小。',
    mistakes: '只看到前几阶导数为零就说无法判断；或漏掉首个非零阶必须是偶数这一关键条件。',
    answerText: `$x_0$ 是严格局部极大值点。`,
    solutionMethods: [
      { title: '方法一 · Taylor 展开', content: `在 $x_0$ 附近，

$$f(x)-f(x_0)=\\frac{f^{(2m)}(x_0)}{(2m)!}(x-x_0)^{2m}+o((x-x_0)^{2m}).$$

偶次幂在 $x\\ne x_0$ 时为正，首项系数为负；充分靠近 $x_0$ 时主项控制符号，所以 $f(x)<f(x_0)$。` },
      { title: '方法二 · 导函数变号', content: `对 $f^{(1)}$ 在 $x_0$ 展开，首个非零项为

$$\\frac{f^{(2m)}(x_0)}{(2m-1)!}(x-x_0)^{2m-1}.$$

系数为负且幂次为奇数，因此 $f^{(1)}$ 在左侧为正、右侧为负，函数先增后减，故 $x_0$ 为严格局部极大值点。` }
    ],
    methodFingerprint: 'zy30-source:l05:higher-derivative-extremum:first-nonzero-even-order'
  },
  {
    slug: 'endpoint-global-maximum', lecture: 5, role: 'exercise', page: '165 · 书页 160',
    title: '闭区间最值的完整比较',
    statement: `求函数

$$f(x)=x+2\\cos x$$

在区间 $[0,\\pi/2]$ 上的最大值及取值点。`,
    tags: ['最值', '单调区间', '闭区间'],
    coreMethod: '闭区间最值必须同时比较内部驻点与两个端点，不能只凭二阶导数找局部极值。',
    mistakes: '只求 $f^{(1)}(x)=0$ 而不核对端点；或把区间内的另一个三角方程解也带进来。',
    answerText: `最大值为 $\\dfrac\\pi6+\\sqrt3$，在 $x=\\dfrac\\pi6$ 处取得。`,
    solutionMethods: [
      { title: '方法一 · 候选点比较', content: `$f^{(1)}(x)=1-2\\sin x$，区间内唯一驻点为 $x=\\pi/6$。比较

$$f(0)=2,\\qquad f(\\pi/6)=\\frac\\pi6+\\sqrt3,\\qquad f(\\pi/2)=\\frac\\pi2.$$

其中 $f(\\pi/6)$ 最大。` },
      { title: '方法二 · 单调性锁定', content: `当 $0<x<\\pi/6$ 时 $f^{(1)}(x)>0$；当 $\\pi/6<x<\\pi/2$ 时 $f^{(1)}(x)<0$。所以函数在该点前递增、之后递减，直接得到全局最大值在 $x=\\pi/6$ 取得。` }
    ],
    methodFingerprint: 'zy30-source:l05:closed-interval-maximum:critical-and-endpoint-comparison'
  },
  {
    slug: 'fixed-point-intermediate-value', lecture: 6, role: 'example', page: '171 · 书页 166',
    title: '用零点定理寻找不动点',
    statement: `设连续函数 $f:[0,1]\\to[0,1]$ 满足 $f(1/2)=1$。证明：至少存在一点 $\\xi\\in(1/2,1]$，使 $f(\\xi)=\\xi$。`,
    tags: ['中值定理', '零点定理', '不动点'],
    coreMethod: '把目标等式移到一边构造辅助函数，并在两个端点制造异号或端点为零。',
    mistakes: '直接对 $f$ 使用中值定理，却没有构造与目标方程对应的函数；或忘记利用 $f$ 的值域限制。',
    answerText: `存在 $\\xi\\in(1/2,1]$ 满足 $f(\\xi)=\\xi$。`,
    solutionMethods: [
      { title: '方法一 · 构造差函数', content: `令 $F(x)=f(x)-x$。则 $F$ 在 $[1/2,1]$ 上连续，且

$$F(1/2)=\\frac12>0,\\qquad F(1)=f(1)-1\\le0,$$

其中第二个不等式来自 $f(1)\\in[0,1]$。由零点定理，存在 $\\xi\\in[1/2,1]$ 使 $F(\\xi)=0$；又 $F(1/2)>0$，故 $\\xi>1/2$。` },
      { title: '方法二 · 图像交点解释', content: `连续曲线 $y=f(x)$ 在 $x=1/2$ 时位于直线 $y=x$ 上方；到 $x=1$ 时，由值域约束它不高于该直线。连续性保证两条图像在这段区间至少相交一次，交点横坐标就是所求 $\\xi$。` }
    ],
    methodFingerprint: 'zy30-source:l06:fixed-point:intermediate-value-difference-function'
  },
  {
    slug: 'second-divided-difference', lecture: 6, role: 'exercise', page: '187 · 书页 182',
    title: '三点条件锁定二阶导数',
    statement: `设 $f$ 在 $[0,1]$ 上连续、在 $(0,1)$ 内二阶可导，且

$$f(0)=f(1)=0,\\qquad f(1/2)=1.$$

证明：存在 $\\xi\\in(0,1)$，使 $f^{(2)}(\\xi)=-8$。`,
    tags: ['Rolle', '二阶中值', '证明题'],
    coreMethod: '构造通过三个已知点的二次插值多项式，相减后得到三个零点，再连续使用两次 Rolle 定理。',
    mistakes: '两次分别使用拉格朗日中值定理只能得到两个一阶导数值，若不继续比较就无法精确得到 $-8$。',
    answerText: `存在 $\\xi\\in(0,1)$ 使 $f^{(2)}(\\xi)=-8$。`,
    solutionMethods: [
      { title: '方法一 · 插值多项式', content: `取 $p(x)=4x(1-x)$，它与 $f$ 在 $0,1/2,1$ 三点取值相同。令 $g=f-p$，则 $g$ 有三个零点。两次使用 Rolle 定理，可得某个 $\\xi\\in(0,1)$ 满足 $g^{(2)}(\\xi)=0$。而 $p^{(2)}=-8$，故 $f^{(2)}(\\xi)=-8$。` },
      { title: '方法二 · 二阶差商定理', content: `等距三点的二阶差分满足：存在 $\\xi\\in(0,1)$，使

$$f(0)-2f(1/2)+f(1)=\\left(\\frac12\\right)^2f^{(2)}(\\xi).$$

左边为 $-2$，所以 $f^{(2)}(\\xi)=-2/(1/4)=-8$。该公式本身也可由两次 Rolle 定理证明。` }
    ],
    methodFingerprint: 'zy30-source:l06:second-derivative-three-points:quadratic-interpolation-rolle'
  },
  {
    slug: 'parabola-arc-rate', lecture: 7, role: 'example', page: '193 · 书页 188',
    title: '抛物线上运动点的弧长变化率',
    statement: `动点 $P$ 沿抛物线 $y=x^2$ 运动，且横坐标满足 $dx/dt=v$，其中 $v>0$ 为常数。求点经过 $(1,1)$ 时，从原点到 $P$ 的弧长 $s$ 对时间的变化率。`,
    tags: ['相关变化率', '弧长', '速度'],
    coreMethod: '先写弧长微元 $ds/dx$，再用链式法则乘以已知的横坐标变化率。',
    mistakes: '把 $dy/dt$ 当作沿曲线运动的速率；实际弧长速率要同时包含横向和纵向分量。',
    answerText: `点经过 $(1,1)$ 时，$ds/dt=\\sqrt5\\,v$。`,
    solutionMethods: [
      { title: '方法一 · 弧长微元', content: `对 $y=x^2$，有 $dy/dx=2x$，故

$$\\frac{ds}{dx}=\\sqrt{1+\\left(\\frac{dy}{dx}\\right)^2}=\\sqrt{1+4x^2}.$$

由链式法则 $ds/dt=(ds/dx)(dx/dt)$。在 $x=1$ 时得到 $ds/dt=\\sqrt5\\,v$。` },
      { title: '方法二 · 速度向量', content: `速度向量为

$$\\left(\\frac{dx}{dt},\\frac{dy}{dt}\\right)=\\left(v,2xv\\right).$$

其模就是沿曲线的速率：$ds/dt=\\sqrt{v^2+4x^2v^2}$。代入 $x=1$，同样得到 $\\sqrt5\\,v$。` }
    ],
    methodFingerprint: 'zy30-source:l07:related-rate-parabola:arc-speed-chain-rule'
  },
  {
    slug: 'demand-elasticity-revenue', lecture: 7, role: 'exercise', page: '198 · 书页 193',
    title: '需求弹性与收益变化',
    statement: `某产品需求量与价格的关系为

$$Q(p)=1000e^{-0.02p}\\qquad(p>0).$$

求价格 $p=50$ 时的需求价格弹性，并判断此时小幅提价对销售收入 $R(p)=pQ(p)$ 的一阶影响。`,
    tags: ['经济', '弹性', '边际收益'],
    coreMethod: '需求价格弹性取 $E=-pQ^{(1)}(p)/Q(p)$；收入导数可整理为 $R^{(1)}=Q(1-E)$。',
    mistakes: '漏掉弹性定义中的负号；或只看需求量下降便断言收入一定下降，没有比较价格与销量的相对变化。',
    answerText: `$E(50)=1$；此时 $R^{(1)}(50)=0$，小幅提价对收入没有一阶影响。`,
    solutionMethods: [
      { title: '方法一 · 直接求弹性与收入导数', content: `$Q^{(1)}(p)=-20e^{-0.02p}=-0.02Q(p)$，所以 $E(p)=0.02p$，从而 $E(50)=1$。又

$$R^{(1)}(p)=Q(p)+pQ^{(1)}(p)=Q(p)(1-E(p)),$$

故 $R^{(1)}(50)=0$。` },
      { title: '方法二 · 对数微分', content: `由 $\\ln R=\\ln p+\\ln Q$，相对变化率满足

$$\\frac{dR}{R}=\\frac{dp}{p}+\\frac{dQ}{Q}=(1-E)\\frac{dp}{p}.$$

在 $p=50$ 时 $E=1$，价格上升的百分比与销量下降的百分比一阶抵消。` }
    ],
    methodFingerprint: 'zy30-source:l07:demand-elasticity:revenue-derivative-unit-elasticity'
  },
  {
    slug: 'derivative-darboux-screening', lecture: 8, role: 'example', page: '213 · 书页 208',
    title: '用介值性筛选可能的导函数',
    statement: `下列函数中，哪一个可能是某个区间上的导函数（ ）。`,
    tags: ['原函数', '导函数介值性', '选择题'],
    coreMethod: '导函数即使不连续，也必须满足 Darboux 介值性；先排除具有跳跃且越过中间值的候选。',
    mistakes: '误以为导函数一定连续；正确结论是导函数未必连续，但不能发生第一类跳跃。',
    answerText: `正确选项为 C。连续函数 $x^2$ 有原函数 $x^3/3$；其余候选都在零点发生跳跃或稠密振荡且缺失中间值。`,
    questionFormat: 'single-choice',
    options: [
      '$g(x)=\\begin{cases}-1,&x<0,\\\\1,&x\\ge0,\\end{cases}$',
      '$g(x)=\\begin{cases}0,&x\\le0,\\\\2,&x>0,\\end{cases}$',
      '$g(x)=x^2$',
      '$g(x)=\\begin{cases}0,&x\\in\\mathbb Q,\\\\1,&x\\notin\\mathbb Q.\\end{cases}$'
    ],
    correctOptionIds: ['C'],
    solutionMethods: [
      { title: '方法一 · Darboux 定理排除', content: `若导函数在两点分别取 $-1$ 与 $1$，它必须在中间取到 $0$；A 不满足。B 的跳跃同理。D 在任何区间只取 $0,1$，却不取二者之间的值，也不可能是导函数。C 连续，且确实是 $F(x)=x^3/3$ 的导数。` },
      { title: '方法二 · 构造与反证', content: `对 C 直接构造原函数即可确认。对 A、B、D，假设存在原函数，则对跨过零点或任取一有理点与一无理点的小区间应用导函数介值性，必然要求导函数取到被候选遗漏的中间值，产生矛盾。` }
    ],
    methodFingerprint: 'zy30-source:l08:derivative-darboux:screen-jump-discontinuities'
  },
  {
    slug: 'log-improper-integral', lecture: 8, role: 'exercise', page: '230 · 书页 225',
    title: '含对数因子的反常积分敛散性',
    statement: `讨论参数 $p$ 取何值时，反常积分

$$\\int_0^{+\\infty}\\frac{\\ln x}{(1+x)^p}\\,dx$$

收敛。`,
    tags: ['反常积分', '参数', '比较判别'],
    coreMethod: '把积分在普通点处分段，分别检查零点附近的对数型瑕点与无穷远端的幂次衰减。',
    mistakes: '只检查 $x\\to+\\infty$，忽略 $\\ln x$ 在零点无界；或看到零点无界便误判发散，没有使用 $\\int_0^1|\\ln x|dx<\\infty$。',
    answerText: `当且仅当 $p>1$ 时积分收敛。`,
    solutionMethods: [
      { title: '方法一 · 两端分别比较', content: `在 $(0,1]$ 上，$(1+x)^{-p}$ 有界且趋于 $1$，而 $\\int_0^1|\\ln x|dx$ 收敛，所以零点端总是绝对收敛。无穷远处

$$\\frac{\\ln x}{(1+x)^p}\\sim\\frac{\\ln x}{x^p}.$$

后者当且仅当 $p>1$ 时绝对可积，故结论为 $p>1$。` },
      { title: '方法二 · 指数换元复核尾部', content: `对尾部令 $x=e^t$，则主导积分化为

$$\\int_0^{+\\infty}t e^{-(p-1)t}\\,dt.$$

它在 $p>1$ 时收敛；$p=1$ 时成为 $\\int t\\,dt$，$p<1$ 时被积函数还会指数增长。结合零点端可积性，得到同一条件。` }
    ],
    methodFingerprint: 'zy30-source:l08:log-improper-integral:split-endpoint-tail'
  },
  {
    slug: 'sqrt-substitution-integral', lecture: 9, role: 'example', page: '238 · 书页 233',
    title: '根式换元后的有理积分',
    statement: `计算定积分

$$I=\\int_0^1\\frac{dx}{1+\\sqrt x}.$$
`,
    tags: ['换元积分', '根式', '定积分计算'],
    coreMethod: '含 $\\sqrt x$ 的有理式优先令 $t=\\sqrt x$，同时把 $dx$ 与积分限完整替换。',
    mistakes: '只把 $\\sqrt x$ 换成 $t$，漏掉 $dx=2t\\,dt$；或换元后仍沿用原来的积分限。',
    answerText: `$I=2-2\\ln2$。`,
    solutionMethods: [
      { title: '方法一 · 根式换元', content: `令 $t=\\sqrt x$，则 $x=t^2$、$dx=2t\\,dt$，积分限仍为 $0$ 到 $1$。于是

$$I=2\\int_0^1\\frac{t}{1+t}dt=2\\int_0^1\\left(1-\\frac1{1+t}\\right)dt=2-2\\ln2.$$` },
      { title: '方法二 · 分子有理化', content: `利用

$$\\frac1{1+\\sqrt x}=\\frac{1-\\sqrt x}{1-x},$$

再令 $u=1+\\sqrt x$ 或直接把分式拆成关于 $\\sqrt x$ 的常数项与简单倒数项，原函数可写为 $2\\sqrt x-2\\ln(1+\\sqrt x)$。代入 $0,1$ 同样得到 $2-2\\ln2$。` }
    ],
    methodFingerprint: 'zy30-source:l09:radical-rational-integral:square-root-substitution'
  },
  {
    slug: 'reciprocal-antiderivative', lecture: 9, role: 'exercise', page: '260 · 书页 255',
    title: '由原函数信息计算倒数积分',
    statement: `已知

$$\\int f(x)\\,dx=\\arcsin x+C\\qquad(|x|<1),$$

求 $\\int dx/f(x)$。`,
    tags: ['不定积分', '原函数', '三角换元'],
    coreMethod: '先对给定原函数求导恢复 $f$，再计算其倒数的积分；不能把“积分”和“取倒数”交换。',
    mistakes: '误写成 $\\int dx/f(x)=1/\\int f(x)dx$；不定积分等式首先给出的是导数关系。',
    answerText: `$$\\int\\frac{dx}{f(x)}=\\frac12\\left(x\\sqrt{1-x^2}+\\arcsin x\\right)+C.$$`,
    solutionMethods: [
      { title: '方法一 · 恢复被积函数', content: `由已知式两边求导，$f(x)=1/\\sqrt{1-x^2}$，故所求为 $\\int\\sqrt{1-x^2}\\,dx$。令 $x=\\sin t$，则积分为

$$\\int\\cos^2t\\,dt=\\frac12(t+\\sin t\\cos t)+C,$$

还原即得答案。` },
      { title: '方法二 · 几何公式复核', content: `$\\int\\sqrt{1-x^2}\\,dx$ 表示单位圆上半圆的变上限面积。标准圆弓面积由三角形面积 $x\\sqrt{1-x^2}/2$ 与扇形面积 $\\arcsin x/2$ 相加，故得到同一原函数。` }
    ],
    methodFingerprint: 'zy30-source:l09:reciprocal-integrand:recover-function-from-antiderivative'
  },
  {
    slug: 'vanishing-strip-area-limit', lecture: 10, role: 'example', page: '269 · 书页 264',
    title: '相邻幂函数间面积的缩放极限',
    statement: `设 $A_n$ 是曲线 $y=x^n$、$y=x^{n+1}$ 与直线 $x=0$、$x=1$ 围成的面积。计算

$$\\lim_{n\\to\\infty}n^2A_n.$$
`,
    tags: ['面积', '定积分应用', '极限'],
    coreMethod: '先判断两条曲线在区间内的上下关系，再用定积分精确表示面积，最后做有理式极限。',
    mistakes: '把上下曲线顺序写反导致面积为负；或只说面积趋于零，没有处理题目给出的 $n^2$ 缩放。',
    answerText: `极限为 $1$。`,
    solutionMethods: [
      { title: '方法一 · 精确积分', content: `在 $0<x<1$ 时 $x^n>x^{n+1}$，所以

$$A_n=\\int_0^1(x^n-x^{n+1})dx=\\frac1{n+1}-\\frac1{n+2}=\\frac1{(n+1)(n+2)}.$$

于是 $n^2A_n\\to1$。` },
      { title: '方法二 · Beta 积分结构', content: `面积也可写成

$$A_n=\\int_0^1x^n(1-x)dx=B(n+1,2)=\\frac{\\Gamma(n+1)\\Gamma(2)}{\\Gamma(n+3)}.$$

化简仍为 $1/[(n+1)(n+2)]$，从而缩放极限为 $1$。` }
    ],
    methodFingerprint: 'zy30-source:l10:adjacent-power-area:scaled-beta-limit'
  },
  {
    slug: 'semicircle-surface-of-revolution', lecture: 10, role: 'exercise', page: '282 · 书页 277',
    title: '半圆弧旋转曲面面积',
    statement: `曲线

$$y=\\sqrt{2x-x^2}\\qquad(0\\le x\\le2)$$

绕 $x$ 轴旋转一周，求所得旋转曲面的面积。`,
    tags: ['旋转曲面', '曲面面积', '几何识别'],
    coreMethod: '可先识别母线的几何形状；若使用公式，则计算 $2\\pi\\int y\\sqrt{1+(y^{(1)})^2}\\,dx$。',
    mistakes: '把旋转曲面面积与旋转体体积混淆；或在端点处看到 $y^{(1)}$ 无界就误判公式不可用。',
    answerText: `旋转曲面面积为 $4\\pi$。`,
    solutionMethods: [
      { title: '方法一 · 几何识别', content: `方程可改写为

$$ (x-1)^2+y^2=1,\\qquad y\\ge0.$$

它是半径为 $1$ 的上半圆，绕直径所在的 $x$ 轴旋转得到单位球面，因此面积为 $4\\pi$。` },
      { title: '方法二 · 旋转曲面公式', content: `由 $y^2=2x-x^2$ 得 $y^{(1)}=(1-x)/y$，从而

$$y\\sqrt{1+(y^{(1)})^2}=y\\sqrt{1+\\frac{(1-x)^2}{y^2}}=1.$$

故 $S=2\\pi\\int_0^2 1\\,dx=4\\pi$。端点的广义积分仍收敛。` }
    ],
    methodFingerprint: 'zy30-source:l10:surface-revolution-semicircle:sphere-recognition'
  },
  {
    slug: 'cauchy-weighted-quotient', lecture: 11, role: 'example', page: '288 · 书页 283',
    title: '积分比值中的 Cauchy 中值结构',
    statement: `设 $f,g$ 在 $[a,b]$ 上连续，且 $g(x)$ 在该区间上恒不为零。证明：存在 $\\xi\\in(a,b)$，使

$$\\frac{\\int_a^b f(x)g(x)\\,dx}{\\int_a^b g^2(x)\\,dx}=\\frac{f(\\xi)}{g(\\xi)}.$$
`,
    tags: ['积分等式', 'Cauchy', '正权平均', '证明题'],
    coreMethod: '把分子、分母分别构造成变上限积分，再对这两个函数应用 Cauchy 中值定理。',
    mistakes: '直接约掉积分号内的 $g$；或没有说明分母为正以及 Cauchy 中值定理所需的连续、可导条件。',
    answerText: `存在 $\\xi\\in(a,b)$ 使所给积分比值等于 $f(\\xi)/g(\\xi)$。`,
    solutionMethods: [
      { title: '方法一 · 变上限积分', content: `令

$$F(x)=\\int_a^x f(t)g(t)dt,\\qquad G(x)=\\int_a^x g^2(t)dt.$$

二者在 $[a,b]$ 连续、在 $(a,b)$ 可导，且 $G^{(1)}(x)=g^2(x)>0$。由 Cauchy 中值定理，存在 $\\xi$ 使

$$\\frac{F(b)-F(a)}{G(b)-G(a)}=\\frac{F^{(1)}(\\xi)}{G^{(1)}(\\xi)}=\\frac{f(\\xi)}{g(\\xi)}.$$` },
      { title: '方法二 · 加权平均', content: `写 $h=f/g$，则分子是 $\\int_a^b h(x)g^2(x)dx$。因为 $h$ 连续且权函数 $g^2$ 连续、严格为正，积分中值定理给出

$$\\int_a^b h g^2=h(\\xi)\\int_a^b g^2,$$

除以正分母即可。` }
    ],
    methodFingerprint: 'zy30-source:l11:cauchy-integral-ratio:variable-upper-limit'
  },
  {
    slug: 'reciprocal-integral-inequality', lecture: 11, role: 'exercise', page: '295 · 书页 290',
    title: '函数与倒数积分的乘积下界',
    statement: `设 $f$ 在 $[0,1]$ 上连续且 $f(x)>0$。证明

$$\\left(\\int_0^1 f(x)\\,dx\\right)\\left(\\int_0^1\\frac{dx}{f(x)}\\right)\\ge1,$$

并说明等号条件。`,
    tags: ['积分不等式', 'Cauchy', '等号条件', '证明题'],
    coreMethod: '把常数函数 $1$ 分解为 $\\sqrt f\\cdot1/\\sqrt f$ 后使用 Cauchy-Schwarz，并追踪等号条件。',
    mistakes: '只写出不等式而不说明等号何时成立；等号要求两个函数成比例，不是只在某一点相等。',
    answerText: `不等式成立；等号当且仅当 $f$ 在 $[0,1]$ 上为正常数。`,
    solutionMethods: [
      { title: '方法一 · Cauchy-Schwarz', content: `由连续性和正性，两积分存在。应用 Cauchy-Schwarz：

$$1=\\left(\\int_0^1\\sqrt{f(x)}\\frac1{\\sqrt{f(x)}}dx\\right)^2\\le\\left(\\int_0^1f(x)dx\\right)\\left(\\int_0^1\\frac{dx}{f(x)}\\right).$$

等号要求 $\\sqrt f$ 与 $1/\\sqrt f$ 成比例，即 $f$ 为正常数。` },
      { title: '方法二 · 双重积分对称化', content: `记乘积为 $P$。交换变量后取平均：

$$P=\\frac12\\int_0^1\\int_0^1\\left(\\frac{f(x)}{f(y)}+\\frac{f(y)}{f(x)}\\right)dxdy\\ge\\int_0^1\\int_0^1 1\\,dxdy=1.$$

这里使用 $u/u_0+u_0/u\\ge2$；处处取等要求 $f(x)=f(y)$，故 $f$ 为常数。` }
    ],
    methodFingerprint: 'zy30-source:l11:integral-reciprocal-product:cauchy-and-symmetrization'
  },
  {
    slug: 'conical-tank-pumping-work', lecture: 12, role: 'example', page: '301 · 书页 296',
    title: '倒圆锥水箱抽水做功',
    statement: `一倒置圆锥形水箱高为 $h$、上口半径为 $R$，箱内装满密度为 $\\rho$ 的水。忽略管道高度，把全部水抽到上口至少需要做多少功？重力加速度为 $g$。`,
    tags: ['功', '旋转体', '物理应用'],
    coreMethod: '按高度切水平薄片，用相似三角形表示截面半径，再用“薄片重量乘提升距离”积分。',
    mistakes: '把所有水都按提升高度 $h$ 计算；不同高度薄片到上口的距离是 $h-y$。',
    answerText: `最少做功

$$W=\\frac{\\rho g\\pi R^2h^2}{12}.$$`,
    solutionMethods: [
      { title: '方法一 · 水平薄片积分', content: `从锥尖向上取坐标 $y$。高度 $y$ 处截面半径为 $Ry/h$，薄片体积为 $\\pi R^2y^2h^{-2}dy$，需提升 $h-y$。所以

$$W=\\frac{\\rho g\\pi R^2}{h^2}\\int_0^h y^2(h-y)dy=\\frac{\\rho g\\pi R^2h^2}{12}.$$` },
      { title: '方法二 · 重心法复核', content: `全部水的体积为 $V=\\pi R^2h/3$，倒圆锥均匀液体的重心距锥尖为 $3h/4$，因此平均提升距离为 $h/4$。总重量为 $\\rho gV$，故

$$W=\\rho g\\frac{\\pi R^2h}{3}\\cdot\\frac h4=\\frac{\\rho g\\pi R^2h^2}{12}.$$` }
    ],
    methodFingerprint: 'zy30-source:l12:conical-tank-work:slice-lift-distance'
  },
  {
    slug: 'elasticity-recover-demand', lecture: 12, role: 'exercise', page: '307 · 书页 302',
    title: '由弹性函数恢复需求规律',
    statement: `某商品在 $0<p<120$ 时的需求价格弹性为

$$E(p)=\\frac{p}{120-p}.$$

已知 $E=-pQ^{(1)}(p)/Q(p)$。求需求函数 $Q(p)$ 的一般形式，并判断 $p=100$ 时小幅提价对销售收入的影响。`,
    tags: ['经济总量', '弹性', '微分方程'],
    coreMethod: '把弹性定义改写成 $Q^{(1)}/Q$ 的可分离方程；再用 $R^{(1)}=Q(1-E)$ 判断收入方向。',
    mistakes: '积分 $1/(120-p)$ 时漏掉负号；或只凭价格上涨判断收入上涨，忽略此时需求弹性。',
    answerText: `$Q(p)=C(120-p)$，其中 $C>0$。在 $p=100$ 时 $E=5>1$，小幅提价会使销售收入下降。`,
    solutionMethods: [
      { title: '方法一 · 分离变量', content: `由定义

$$-p\\frac{Q^{(1)}}Q=\\frac p{120-p},$$

消去 $p$ 得 $Q^{(1)}/Q=-1/(120-p)$。积分得 $\\ln Q=\\ln(120-p)+C_0$，故 $Q=C(120-p)$。又 $R^{(1)}=Q(1-E)$，在 $p=100$ 时为负。` },
      { title: '方法二 · 直接验证与收入二次式', content: `将 $Q=C(120-p)$ 代回可得 $-pQ^{(1)}/Q=p/(120-p)$，验证正确。此时

$$R(p)=Cp(120-p),\\qquad R^{(1)}(p)=C(120-2p).$$

代入 $p=100$ 得 $R^{(1)}<0$，所以提价会降低收入。` }
    ],
    methodFingerprint: 'zy30-source:l12:elasticity-inverse-demand:separable-equation'
  },
  {
    slug: 'two-multivariable-limits', lecture: 13, role: 'example', page: '311 · 书页 306',
    title: '多元极限的路径反例与统一估计',
    statement: `分别判断下列极限是否存在：

$$I_1=\\lim_{(x,y)\\to(0,0)}\\frac{xy}{x^2+y^2},\\qquad I_2=\\lim_{(x,y)\\to(0,0)}\\frac{x^2y}{x^2+y^2}.$$
`,
    tags: ['多元函数', '极限', '路径法', '夹逼'],
    coreMethod: '否定极限用两条路径给出不同结果；证明极限存在则需要与路径无关的统一上界。',
    mistakes: '只检查坐标轴就宣布极限存在；坐标轴只能用于发现反例，不能替代二维统一估计。',
    answerText: `$I_1$ 不存在，$I_2=0$。`,
    solutionMethods: [
      { title: '方法一 · 路径与夹逼分别处理', content: `对 $I_1$，沿 $y=x$ 得 $1/2$，沿 $y=-x$ 得 $-1/2$，故不存在。对 $I_2$，

$$\\left|\\frac{x^2y}{x^2+y^2}\\right|\\le |y|\\frac{x^2}{x^2+y^2}\\le|y|\\to0,$$

所以 $I_2=0$。` },
      { title: '方法二 · 极坐标复核', content: `令 $x=r\\cos\\theta,y=r\\sin\\theta$。第一式化为 $\\cos\\theta\\sin\\theta$，仍依赖方向 $\\theta$，所以无极限；第二式化为 $r\\cos^2\\theta\\sin\\theta$，其绝对值不超过 $r$，故一致趋于零。` }
    ],
    methodFingerprint: 'zy30-source:l13:multivariable-limit:path-counterexample-versus-uniform-bound'
  },
  {
    slug: 'complex-square-laplacian', lecture: 13, role: 'exercise', page: '336 · 书页 331',
    title: '复合变换下的 Laplace 算子',
    statement: `设 $f(u,v)$ 具有连续二阶偏导数，令

$$z(x,y)=f(x^2-y^2,2xy).$$

证明

$$z_{xx}+z_{yy}=4(x^2+y^2)(f_{uu}+f_{vv}),$$

其中右端偏导在 $(u,v)=(x^2-y^2,2xy)$ 处取值。`,
    tags: ['多元复合', '链式法则', '二阶偏导', '证明题'],
    coreMethod: '先写一阶链式法则，再求二阶；按 $f_{uu},f_{uv},f_{vv},f_u,f_v$ 分组，利用变换的正交结构消项。',
    mistakes: '二阶求导时漏掉 $u,v$ 自身的二阶偏导；或没有使用 $f_{uv}=f_{vu}$ 的连续性条件。',
    answerText: `恒等式成立。`,
    solutionMethods: [
      { title: '方法一 · 链式法则展开', content: `有 $u_x=2x,u_y=-2y,v_x=2y,v_y=2x$，且 $u_{xx}+u_{yy}=v_{xx}+v_{yy}=0$。展开 $z_{xx}+z_{yy}$ 后，混合项系数为

$$2(u_xv_x+u_yv_y)=2(4xy-4xy)=0,$$

而 $u_x^2+u_y^2=v_x^2+v_y^2=4(x^2+y^2)$，故得到结论。` },
      { title: '方法二 · Jacobian 正交结构', content: `变换的 Jacobian 为

$$J=2\\begin{pmatrix}x&-y\\\\y&x\\end{pmatrix},\\qquad JJ^{\\mathsf T}=4(x^2+y^2)I.$$

同时 $u,v$ 都是调和函数。复合函数 Laplace 算子的二阶型因此只留下 $4(x^2+y^2)$ 倍的 $f$ 关于 $u,v$ 的 Laplace 算子。` }
    ],
    methodFingerprint: 'zy30-source:l13:laplacian-under-complex-square:orthogonal-jacobian'
  },
  {
    slug: 'moving-disk-integral', lecture: 14, role: 'example', page: '347 · 书页 342',
    title: '变动圆域二重积分的导数',
    statement: `对 $t\\ge0$，设

$$F(t)=\\iint_{x^2+y^2\\le t^2}e^{x^2+y^2}\\,dx\\,dy.$$

求 $F^{(1)}(t)$。`,
    tags: ['二重积分', '极坐标', '变动区域'],
    coreMethod: '圆域与径向函数同时出现时先改用极坐标，把变动区域转化为变上限的一元积分。',
    mistakes: '极坐标换元漏掉 Jacobian $r$；或对变上限求导时忘记内函数 $t^2$ 的导数。',
    answerText: `$$F^{(1)}(t)=2\\pi t e^{t^2}.$$`,
    solutionMethods: [
      { title: '方法一 · 极坐标精确计算', content: `改用极坐标得

$$F(t)=\\int_0^{2\\pi}\\int_0^t e^{r^2}r\\,dr\\,d\\theta=\\pi(e^{t^2}-1).$$

对 $t$ 求导，得到 $F^{(1)}(t)=2\\pi t e^{t^2}$。` },
      { title: '方法二 · 薄圆环增量', content: `当半径由 $t$ 增加到 $t+\\Delta t$ 时，新增薄环面积主部为 $2\\pi t\\Delta t$，环上函数值主部为 $e^{t^2}$。因此

$$\\Delta F=2\\pi t e^{t^2}\\Delta t+o(\\Delta t),$$

直接读出同一导数。` }
    ],
    methodFingerprint: 'zy30-source:l14:moving-disk-integral:polar-radius-differentiation'
  },
  {
    slug: 'offset-disk-polar-moment', lecture: 14, role: 'exercise', page: '376 · 书页 371',
    title: '偏心圆域上的径向矩',
    statement: `设

$$D=\\{(x,y):x^2+y^2\\le2y\\}.$$

计算

$$\\iint_D(x^2+y^2)\\,dx\\,dy.$$
`,
    tags: ['二重积分', '极坐标', '圆域'],
    coreMethod: '先把圆域边界化成极坐标 $0\\le r\\le2\\sin\\theta$，再连同面积元中的 $r$ 一起积分。',
    mistakes: '把圆心误认在原点而写成常数半径；或把 $x^2+y^2$ 换成 $r^2$ 后漏掉面积元的 $r$。',
    answerText: `积分值为 $\\dfrac{3\\pi}{2}$。`,
    solutionMethods: [
      { title: '方法一 · 极坐标直接积分', content: `边界为 $r^2=2r\\sin\\theta$，故 $0\\le\\theta\\le\\pi$、$0\\le r\\le2\\sin\\theta$。于是

$$\\iint_Dr^2dA=\\int_0^\\pi\\int_0^{2\\sin\\theta}r^3drd\\theta=4\\int_0^\\pi\\sin^4\\theta d\\theta=\\frac{3\\pi}{2}.$$` },
      { title: '方法二 · 平移后的圆盘矩', content: `令 $u=x,v=y-1$，区域变为单位圆盘，且 $x^2+y^2=u^2+v^2+2v+1$。对称性使 $\\iint 2v\\,dA=0$；单位圆盘上 $\\iint(u^2+v^2)dA=\\pi/2$，面积为 $\\pi$，总和为 $3\\pi/2$。` }
    ],
    methodFingerprint: 'zy30-source:l14:offset-disk-radial-moment:polar-or-translation'
  },
  {
    slug: 'damped-oscillation-initial-value', lecture: 15, role: 'example', page: '384 · 书页 379',
    title: '二阶常系数方程的指数调制振荡解',
    statement: `求解初值问题

$$y^{(2)}-2y^{(1)}+5y=0,\\qquad y(0)=1,\\quad y^{(1)}(0)=1,$$

并求解在 $x>0$ 的第一个零点。`,
    tags: ['二阶常系数', '特征方程', '初值问题'],
    coreMethod: '由特征根写出指数乘三角函数的一般解，再利用初值确定系数；零点只需解三角因子。',
    mistakes: '复根 $1\\pm2i$ 对应的指数因子写成 $e^{-x}$；或确定常数时漏掉乘积求导产生的项。',
    answerText: `$y=e^x\\cos2x$；第一个正零点为 $x=\\pi/4$。`,
    solutionMethods: [
      { title: '方法一 · 特征方程', content: `特征方程 $r^2-2r+5=0$ 的根为 $1\\pm2i$，故

$$y=e^x(C_1\\cos2x+C_2\\sin2x).$$

$y(0)=1$ 给出 $C_1=1$；$y^{(1)}(0)=C_1+2C_2=1$ 给出 $C_2=0$。因此 $y=e^x\\cos2x$，首个正零点为 $2x=\\pi/2$。` },
      { title: '方法二 · 消去一阶项', content: `令 $y=e^xu$，代回原方程得到 $u^{(2)}+4u=0$。初值变为 $u(0)=1,u^{(1)}(0)=0$，所以 $u=\\cos2x$。指数因子不为零，故 $y$ 的零点正是余弦的零点。` }
    ],
    methodFingerprint: 'zy30-source:l15:second-order-complex-roots:remove-first-derivative'
  },
  {
    slug: 'bernoulli-initial-value', lecture: 15, role: 'exercise', page: '408 · 书页 403',
    title: 'Bernoulli 方程的倒数代换',
    statement: `求初值问题

$$y^{(1)}+y=xy^2,\\qquad y(0)=1$$

在包含 $x=0$ 的最大区间上的解。`,
    tags: ['一阶方程', 'Bernoulli', '初值问题'],
    coreMethod: '对 $y^2$ 型 Bernoulli 方程令 $v=1/y$，把非线性方程化为一阶线性方程。',
    mistakes: '代换后把 $v^{(1)}$ 错写成 $y^{(1)}/y^2$，正确关系是 $v^{(1)}=-y^{(1)}/y^2$；还需给出解的定义区间。',
    answerText: `$y=1/(x+1)$，包含 $0$ 的最大存在区间为 $(-1,+\\infty)$。`,
    solutionMethods: [
      { title: '方法一 · Bernoulli 代换', content: `初值非零，令 $v=1/y$。原方程除以 $y^2$ 后变为

$$-v^{(1)}+v=x,$$

即 $v^{(1)}-v=-x$。乘积分因子 $e^{-x}$，结合 $v(0)=1$ 可得 $v=x+1$，所以 $y=1/(x+1)$。离初值最近的奇点是 $x=-1$。` },
      { title: '方法二 · 猜解后唯一性复核', content: `观察右端含 $x$，尝试 $y=1/(x+c)$。代入后

$$y^{(1)}+y=\\frac{x+c-1}{(x+c)^2},\\qquad xy^2=\\frac{x}{(x+c)^2},$$

故 $c=1$，且初值也满足。方程右端在 $y$ 上局部 Lipschitz，因此初值解唯一。` }
    ],
    methodFingerprint: 'zy30-source:l15:bernoulli-reciprocal:linearization-and-maximal-interval'
  },
  {
    slug: 'alternating-log-series', lecture: 16, role: 'example', page: '419 · 书页 414',
    title: '交错对数级数的条件收敛',
    statement: `判断级数

$$\\sum_{n=1}^{\\infty}(-1)^{n-1}\\ln\\left(1+\\frac1n\\right)$$

是绝对收敛、条件收敛还是发散。`,
    tags: ['数项级数', '交错级数', '绝对收敛'],
    coreMethod: '先用 Leibniz 判别原级数，再单独考察绝对值级数；绝对值后的对数和可化成乘积的对数。',
    mistakes: '证明交错级数收敛后就直接说绝对收敛；条件收敛还必须验证绝对值级数发散。',
    answerText: `该级数条件收敛，不绝对收敛。`,
    solutionMethods: [
      { title: '方法一 · Leibniz 与对数望远镜', content: `$a_n=\\ln(1+1/n)$ 正且单调趋于零，所以原级数由 Leibniz 判别收敛。绝对值部分的前 $N$ 项和为

$$\\sum_{n=1}^N\\ln\\frac{n+1}{n}=\\ln(N+1)\\to+\\infty,$$

故不是绝对收敛。` },
      { title: '方法二 · 相邻配对', content: `将相邻两项配对：

$$\\ln2-\\ln\\frac32+\\ln\\frac43-\\ln\\frac54+\\cdots.$$

每组为正，且交错项幅递减趋零，部分和的奇偶子列收敛到同一极限。另一方面 $\\ln(1+1/n)\\sim1/n$，绝对值级数与调和级数同敛散，故发散。` }
    ],
    methodFingerprint: 'zy30-source:l16:alternating-log-series:leibniz-versus-telescoping-absolute'
  },
  {
    slug: 'power-series-sum-function', lecture: 16, role: 'exercise', page: '461 · 书页 456',
    title: '带 $n(n+1)$ 分母的幂级数和函数',
    statement: `求幂级数

$$S(x)=\\sum_{n=1}^{\\infty}\\frac{x^n}{n(n+1)}$$

的收敛区间与和函数。`,
    tags: ['幂级数', '和函数', '端点判别'],
    coreMethod: '先由系数判断收敛半径并单独检查端点；求和时用部分分式拆成已知对数级数。',
    mistakes: '只写 $|x|<1$ 而漏检端点；或在 $x=0$ 处直接代入含 $1/x$ 的和函数公式。',
    answerText: `收敛区间为 $[-1,1]$。当 $|x|<1$ 且 $x\\ne0$ 时，

$$S(x)=1+\\left(\\frac1x-1\\right)\\ln(1-x).$$

并有 $S(0)=0,S(1)=1,S(-1)=1-2\\ln2$。`,
    solutionMethods: [
      { title: '方法一 · 部分分式求和', content: `因 $1/[n(n+1)]=1/n-1/(n+1)$，结合 $\\sum_{n\\ge1}x^n/n=-\\ln(1-x)$，得到

$$S=-\\ln(1-x)-\\frac{-\\ln(1-x)-x}{x}=1+\\left(\\frac1x-1\\right)\\ln(1-x).$$

端点 $x=\\pm1$ 均绝对收敛，分别代回原级数得给定值。` },
      { title: '方法二 · 逐项求导后积分', content: `在 $|x|<1$ 内，

$$S^{(1)}(x)=\\sum_{n=1}^{\\infty}\\frac{x^{n-1}}{n+1}=\\frac{-\\ln(1-x)-x}{x^2}.$$

结合 $S(0)=0$ 积分也可得到同一公式。比值判别给出半径 $1$，再由与 $1/n^2$ 比较确认两个端点都绝对收敛。` }
    ],
    methodFingerprint: 'zy30-source:l16:power-series-nnplusone:partial-fraction-log-sum'
  },
  {
    slug: 'differentiability-remainder-limit', lecture: 17, role: 'example', page: '472 · 书页 467',
    title: '可微线性主部的标准极限',
    statement: `设 $f(x,y)$ 在 $(0,0)$ 可微且 $f(0,0)=0$。计算

$$\\lim_{(x,y)\\to(0,0)}\\frac{f(x,y)-f_x(0,0)x-f_y(0,0)y}{\\sqrt{x^2+y^2}}.$$
`,
    tags: ['可微', '全微分', '线性主部'],
    coreMethod: '直接识别可微定义中的线性主部与高阶无穷小余项；分母正是自变量增量的长度。',
    mistakes: '仅凭两个偏导存在就使用结论；题目成立的关键是函数在该点可微。',
    answerText: `极限为 $0$。`,
    solutionMethods: [
      { title: '方法一 · 可微定义', content: `可微意味着当 $\\rho=\\sqrt{x^2+y^2}\\to0$ 时，

$$f(x,y)-f(0,0)=f_x(0,0)x+f_y(0,0)y+o(\\rho).$$

又 $f(0,0)=0$，所以题目分子正是 $o(\\rho)$，除以 $\\rho$ 后趋于零。` },
      { title: '方法二 · 全微分误差解释', content: `线性函数 $L(x,y)=f_x(0,0)x+f_y(0,0)y$ 是 $f$ 在原点的最佳一阶近似。可微的等价表述是相对误差

$$\\frac{|f(x,y)-f(0,0)-L(x,y)|}{\\|(x,y)\\|}\\to0,$$

所求正是去掉绝对值后的同一误差比。` }
    ],
    methodFingerprint: 'zy30-source:l17:differentiability-remainder:linear-principal-part-ratio'
  },
  {
    slug: 'line-plane-position', lecture: 17, role: 'exercise', page: '489 · 书页 484',
    title: '两平面交线与第三平面的位置关系',
    statement: `直线 $L$ 是两平面

$$x+y-z+1=0,\\qquad x-y+3z=0$$

的交线。设平面

$$\\Pi:x-2y-z+3=0.$$

判断 $L$ 与 $\\Pi$ 的位置关系（ ）。`,
    tags: ['空间直线', '平面', '位置关系', '选择题'],
    coreMethod: '两平面的法向量叉乘得到交线方向向量，再与第三平面的法向量比较。',
    mistakes: '把交线方向误当成任一已知平面的法向量；或只看三个方程的常数项判断位置。',
    answerText: `$L$ 与 $\\Pi$ 垂直。`,
    questionFormat: 'single-choice',
    options: ['$L\\parallel\\Pi$', '$L\\subset\\Pi$', '$L\\perp\\Pi$', '$L$ 与 $\\Pi$ 相交但不垂直'],
    correctOptionIds: ['C'],
    solutionMethods: [
      { title: '方法一 · 法向量叉乘', content: `前两平面的法向量为 $\\boldsymbol n_1=(1,1,-1)$、$\\boldsymbol n_2=(1,-1,3)$。交线方向

$$\\boldsymbol d=\\boldsymbol n_1\\times\\boldsymbol n_2=(2,-4,-2)=2(1,-2,-1).$$

它与 $\\Pi$ 的法向量 $\\boldsymbol n=(1,-2,-1)$ 平行，因此 $L\\perp\\Pi$。` },
      { title: '方法二 · 方向向量代数验证', content: `令 $\\boldsymbol d=(a,b,c)$ 同时垂直于 $\\boldsymbol n_1,\\boldsymbol n_2$，解

$$a+b-c=0,\\qquad a-b+3c=0$$

可取 $(a,b,c)=(1,-2,-1)$。该向量恰是 $\\Pi$ 的法向量，所以直线方向沿平面法线，结论为垂直。` }
    ],
    methodFingerprint: 'zy30-source:l17:line-plane-position:intersection-direction-cross-normal'
  },
  {
    slug: 'simplex-linear-moment', lecture: 18, role: 'example', page: '503 · 书页 498',
    title: '标准四面体上线性函数的三重积分',
    statement: `设

$$\\Omega=\\{(x,y,z):x\\ge0,y\\ge0,z\\ge0,x+y+z\\le1\\}.$$

计算

$$\\iiint_\\Omega(x+2y+3z)\\,dV.$$
`,
    tags: ['三重积分', '四面体', '对称性'],
    coreMethod: '标准单纯形关于坐标置换对称，三个一阶矩相等；也可利用四面体体积与重心。',
    mistakes: '把截面上限写成彼此独立的 $1$；或只利用对称性说明三个积分相等，却没有计算公共值。',
    answerText: `积分值为 $1/4$。`,
    solutionMethods: [
      { title: '方法一 · 体积与重心', content: `$\\Omega$ 的体积为 $1/6$，重心为 $(1/4,1/4,1/4)$。线性函数在区域上的平均值等于其在重心处的值，因此

$$\\iiint_\\Omega(x+2y+3z)dV=\\frac16\\left(\\frac14+\\frac24+\\frac34\\right)=\\frac14.$$` },
      { title: '方法二 · 对称的一阶矩', content: `由坐标置换对称，$\\iiint x\\,dV=\\iiint y\\,dV=\\iiint z\\,dV$。直接计算一个：

$$\\iiint_\\Omega x\\,dV=\\int_0^1\\int_0^{1-x}\\int_0^{1-x-y}x\\,dz\\,dy\\,dx=\\frac1{24}.$$

故原积分为 $(1+2+3)/24=1/4$。` }
    ],
    methodFingerprint: 'zy30-source:l18:simplex-linear-moment:centroid-symmetry'
  },
  {
    slug: 'tilted-circle-line-integral', lecture: 18, role: 'exercise', page: '546 · 书页 541',
    title: '空间闭曲线积分降维',
    statement: `曲线 $C$ 是圆柱 $x^2+y^2=1$ 与平面 $z=x+y$ 的交线，方向规定为从 $z$ 轴正向看去逆时针。计算

$$\\oint_C z\\,dx+x\\,dy+y\\,dz.$$
`,
    tags: ['曲线积分', 'Green', '空间曲线'],
    coreMethod: '利用曲面约束消去 $z,dz$，把空间曲线积分投影为平面单位圆上的第二类曲线积分。',
    mistakes: '投影后忘记同时替换 $dz=dx+dy$；或没有核对投影方向仍为逆时针。',
    answerText: `积分值为 $-\\pi$。`,
    solutionMethods: [
      { title: '方法一 · 投影后用 Green 公式', content: `在 $C$ 上 $z=x+y$、$dz=dx+dy$，故积分化为

$$\\oint_{x^2+y^2=1}\\bigl[(x+2y)dx+(x+y)dy\\bigr].$$

投影方向为逆时针。由 Green 公式，积分为

$$\\iint_{x^2+y^2\\le1}\\left(\\frac{\\partial(x+y)}{\\partial x}-\\frac{\\partial(x+2y)}{\\partial y}\\right)dA=-\\iint_DdA=-\\pi.$$` },
      { title: '方法二 · 参数方程直接算', content: `取 $x=\\cos t,y=\\sin t,z=\\cos t+\\sin t$，$0\\le t\\le2\\pi$。代入后被积式化为

$$\\cos^2t-2\\sin^2t.$$

一个周期内 $\\int\\cos^2t\\,dt=\\pi$、$\\int\\sin^2t\\,dt=\\pi$，所以结果为 $\\pi-2\\pi=-\\pi$。` }
    ],
    methodFingerprint: 'zy30-source:l18:tilted-circle-line-integral:constraint-projection-green'
  }
]

export const zhangYuFoundationQuestionSeeds = questions.map(buildSourceQuestion)
