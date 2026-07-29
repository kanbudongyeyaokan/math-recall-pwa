import type { QuestionFormat } from '../types'
import type { SeedInput } from './banks/types'

interface ConclusionInput {
  lecture: number
  title: string
  statement: string
  keywords: string[]
  coreMethod: string
  mistakes: string
  answerText: string
  options: string[]
  correctOptionIds: string[]
  methods: [string, string]
  format?: QuestionFormat
}

function conclusion(input: ConclusionInput): SeedInput {
  return {
    kind: 'concept',
    title: input.title,
    statement: input.statement,
    tags: ['高等数学', `第${input.lecture}讲`, '定义', ...input.keywords, input.format === 'multiple-choice' ? '多选题' : '选择题'],
    coreMethod: input.coreMethod,
    mistakes: input.mistakes,
    answerText: input.answerText,
    questionFormat: input.format || 'single-choice',
    options: input.options,
    correctOptionIds: input.correctOptionIds,
    solutionMethods: [
      { title: '路线一 · 定义与条件链', content: input.methods[0] },
      { title: '路线二 · 反例与结构检验', content: input.methods[1] }
    ],
    source: '斗破数学 · 基础结论原创训练'
  }
}

export const foundationConclusionSeeds: SeedInput[] = [
  conclusion({
    lecture: 1, title: '函数极限的局部保号性', keywords: ['极限定义', '极限性质'],
    statement: '若 $\\lim_{x\\to x_0}f(x)=A>0$，下列结论一定正确的是（ ）。',
    coreMethod: '正极限只能保证在某个去心邻域内保正，不能直接控制点值或整个定义域。',
    mistakes: '把“充分靠近 $x_0$”扩大成“任意 $x$”，或误以为极限会决定 $f(x_0)$。',
    answerText: '正确选项 B。存在 $\\delta>0$，当 $0<|x-x_0|<\\delta$ 时有 $f(x)>0$。',
    options: ['$f(x_0)>0$', '存在去心邻域使 $f(x)>0$', '对定义域内所有 $x$ 都有 $f(x)>0$', '$f$ 在 $x_0$ 连续'], correctOptionIds: ['B'],
    methods: ['在极限定义中取 $\\varepsilon=A/2$，则 $|f(x)-A|<A/2$，从而 $f(x)>A/2>0$。', '修改单点值不会改变极限，因此 A、D 不必成立；在远离 $x_0$ 处令函数取负即可否定 C。']
  }),
  conclusion({
    lecture: 1, title: '连续定义的等价表达', keywords: ['连续', '左右极限'], format: 'multiple-choice',
    statement: '设 $f$ 在 $x_0$ 的某邻域有定义。下列哪些条件与“$f$ 在 $x_0$ 连续”等价？（多选）',
    coreMethod: '连续的核心是“极限存在且等于点值”；左右极限版本必须同时相等。',
    mistakes: '仅有极限存在还不够，它可能不等于函数值；仅有左右极限之一也不够。',
    answerText: '正确选项 A、C。',
    options: ['$\\lim_{x\\to x_0}f(x)=f(x_0)$', '$\\lim_{x\\to x_0}f(x)$ 存在', '左、右极限都等于 $f(x_0)$', '$f(x_0)$ 有定义'], correctOptionIds: ['A', 'C'],
    methods: ['直接对照连续定义可得 A；双侧极限存在等价于左右极限存在且相等，所以 C 也等价。', '取 $f(x)=1$（$x\\ne0$）、$f(0)=0$，极限存在但不连续，否定 B；D 显然不足。']
  }),
  conclusion({
    lecture: 2, title: '收敛数列的必然性质', keywords: ['数列收敛', '收敛定义'], format: 'multiple-choice',
    statement: '若数列 $\\{a_n\\}$ 收敛于 $A$，下列结论一定正确的是（多选）。',
    coreMethod: '收敛推出有界、极限唯一，且任何子列收敛到同一极限。',
    mistakes: '收敛数列不一定单调，也不保证所有项都靠近极限，只保证充分靠后的项。',
    answerText: '正确选项 A、B、D。',
    options: ['$\\{a_n\\}$ 有界', '任一子列都收敛于 $A$', '$\\{a_n\\}$ 单调', '$\\lim_{n\\to\\infty}|a_n-A|=0$'], correctOptionIds: ['A', 'B', 'D'],
    methods: ['由收敛定义控制尾项，再把有限个前项纳入上界，得到有界；子列指标也趋于无穷，故继承同一极限。', '$a_n=(-1)^n/n$ 收敛于 0 却不单调，直接否定 C；D 是收敛定义的绝对值写法。']
  }),
  conclusion({
    lecture: 2, title: '单调有界定理的方向', keywords: ['单调有界', '递推'],
    statement: '关于实数数列的单调有界定理，下列说法正确的是（ ）。',
    coreMethod: '单调且有界是收敛的充分条件，不是必要条件。',
    mistakes: '把充分条件误背成充要条件；递推数列还要分别证明单调性和有界性。',
    answerText: '正确选项 C。单调递增且有上界的数列必收敛。',
    options: ['有界数列必收敛', '单调数列必收敛', '单调递增且有上界的数列必收敛', '收敛数列必单调'], correctOptionIds: ['C'],
    methods: ['单调递增数列的极限等于其值域上确界；有上界保证上确界是有限实数。', '$(-1)^n$ 有界但发散，$n$ 单调但无界发散，$(-1)^n/n$ 收敛但不单调，分别排除 A、B、D。']
  }),
  conclusion({
    lecture: 3, title: '一点可导的逻辑链', keywords: ['导数定义', '可导', '可微'], format: 'multiple-choice',
    statement: '一元函数 $f$ 在 $x_0$ 可导，则下列结论一定成立的是（多选）。',
    coreMethod: '一元函数在一点可导等价于可微，并必然连续；导函数在该点连续则是更强条件。',
    mistakes: '把“函数可导”误写成“导函数连续”，后者并非必然。',
    answerText: '正确选项 A、B、C。',
    options: ['$f$ 在 $x_0$ 连续', '$f$ 在 $x_0$ 可微', '左、右导数存在且相等', '$f\u2032$ 在 $x_0$ 连续'], correctOptionIds: ['A', 'B', 'C'],
    methods: ['差商存在可写成 $f(x_0+\\Delta x)-f(x_0)=f\u2032(x_0)\\Delta x+o(\\Delta x)$，同时推出可微和连续。', '存在导数不连续的可导函数，例如 $f(x)=x^2\\sin(1/x)$ 在原点补 0，故 D 不是必然。']
  }),
  conclusion({
    lecture: 3, title: '分段点导数的双侧判定', keywords: ['左右导数', '分段函数'],
    statement: '分段函数在分界点 $x_0$ 可导的充要条件是（ ）。',
    coreMethod: '先保证函数值统一，再检查左右差商极限存在且相等。',
    mistakes: '左右表达式分别可导，不代表它们在拼接点的函数值和斜率能接上。',
    answerText: '正确选项 D。左右导数都存在且相等，此时连续性也自动成立。',
    options: ['左右函数值都存在', '左右极限相等', '左右表达式在各自区间可导', '左、右导数存在且相等'], correctOptionIds: ['D'],
    methods: ['导数是双侧差商极限，存在当且仅当左右差商极限都存在且相等。', '$f(x)=|x|$ 在原点连续且两侧表达式均可导，但左右导数为 $-1$ 与 $1$，可排除 B、C。']
  }),
  conclusion({
    lecture: 4, title: '复合函数链式法则条件', keywords: ['复合', '链式法则'],
    statement: '设 $y=f(u)$、$u=g(x)$。保证 $f(g(x))$ 在 $x_0$ 可导的一组标准条件是（ ）。',
    coreMethod: '内函数在 $x_0$ 可导，外函数在对应点 $u_0=g(x_0)$ 可导。',
    mistakes: '外函数的可导点必须是 $g(x_0)$，不是机械写成 $x_0$。',
    answerText: '正确选项 B，且 $(f\\circ g)\u2032(x_0)=f\u2032(g(x_0))g\u2032(x_0)$。',
    options: ['$f,g$ 在 $x_0$ 连续', '$g$ 在 $x_0$ 可导且 $f$ 在 $g(x_0)$ 可导', '$f$ 在 $x_0$ 可导即可', '$g$ 在 $x_0$ 连续即可'], correctOptionIds: ['B'],
    methods: ['把两个函数的局部线性展开依次代入，主线性项相乘即得链式法则。', '只连续并不足以可导，例如内函数取 $g(x)=|x|$；只要求其中一个函数可导也无法控制另一个环节。']
  }),
  conclusion({
    lecture: 4, title: '反函数求导的非零条件', keywords: ['反函数', '导数计算'],
    statement: '若 $y=f(x)$ 在 $x_0$ 附近存在反函数，且 $f$ 在 $x_0$ 可导。要使用反函数求导公式，还需强调（ ）。',
    coreMethod: '分母 $f\u2032(x_0)$ 必须非零，反函数导数才由倒数公式给出。',
    mistakes: '函数严格单调并不自动保证导数处处非零，例如 $x^3$。',
    answerText: '正确选项 A。若 $f\u2032(x_0)\\ne0$，则 $(f^{-1})\u2032(y_0)=1/f\u2032(x_0)$。',
    options: ['$f\u2032(x_0)\\ne0$', '$f\u2032(x_0)=0$', '$f$ 为偶函数', '$x_0=0$'], correctOptionIds: ['A'],
    methods: ['由 $f^{-1}(f(x))=x$ 两边求导，得到 $(f^{-1})\u2032(y_0)f\u2032(x_0)=1$。', '$f(x)=x^3$ 虽严格单调且有反函数，但 $f\u2032(0)=0$，其反函数在 0 处导数不存在，说明非零条件不可删。']
  }),
  conclusion({
    lecture: 5, title: '费马定理不是充分条件', keywords: ['极值', 'Fermat'],
    statement: '若 $f$ 在内点 $x_0$ 可导且 $x_0$ 是局部极值点，则（ ）。',
    coreMethod: '可导内点极值必有一阶导数为零，但驻点不一定是极值点。',
    mistakes: '忽略“内点”和“可导”，或把必要条件反过来使用。',
    answerText: '正确选项 A，$f\u2032(x_0)=0$。',
    options: ['$f\u2032(x_0)=0$', '$f\u2032\u2032(x_0)>0$', '$x_0$ 必为全局最值点', '$f$ 在全区间单调'], correctOptionIds: ['A'],
    methods: ['极值点两侧差商符号受限，左右导数若相等只能同时为 0。', '$f(x)=x^3$ 在 0 处导数为 0 却无极值，说明驻点条件不能反推；$|x|$ 还说明不可导极值不受费马定理覆盖。']
  }),
  conclusion({
    lecture: 5, title: '拐点的必要检查', keywords: ['凹凸', '拐点'], format: 'multiple-choice',
    statement: '关于曲线 $y=f(x)$ 的拐点，下列说法正确的是（多选）。',
    coreMethod: '拐点看凹凸性是否改变；二阶导数为零或不存在只是候选点来源。',
    mistakes: '看到 $f\u2032\u2032(x_0)=0$ 就直接判拐点。',
    answerText: '正确选项 B、D。',
    options: ['$f\u2032\u2032(x_0)=0$ 就是拐点', '拐点两侧凹凸性应发生改变', '$f\u2032(x_0)=0$ 是拐点必要条件', '$f\u2032\u2032$ 变号可作为常用判据'], correctOptionIds: ['B', 'D'],
    methods: ['拐点按曲线凹凸性改变定义；若二阶导数在两侧存在并变号，就能确认凹凸性改变。', '$f(x)=x^4$ 在 0 处二阶导数为 0 但不变凹凸；$f(x)=x^3+x$ 在 0 处是拐点但一阶导数不为 0。']
  }),
  conclusion({
    lecture: 6, title: 'Rolle 定理条件清单', keywords: ['Rolle', '中值定理'],
    statement: '要由 Rolle 定理推出存在 $\\xi\\in(a,b)$ 使 $f\u2032(\\xi)=0$，标准条件是（ ）。',
    coreMethod: '闭区间连续、开区间可导、端点函数值相等，三项缺一不可。',
    mistakes: '把开闭区间条件写反，或漏掉 $f(a)=f(b)$。',
    answerText: '正确选项 C。',
    options: ['$(a,b)$ 连续即可', '$[a,b]$ 可导即可', '$[a,b]$ 连续、$(a,b)$ 可导且 $f(a)=f(b)$', '只需 $f(a)=f(b)$'], correctOptionIds: ['C'],
    methods: ['直接按 Rolle 定理逐项核对三条假设，结论点位于开区间。', '$f(x)=|x|$ 在 $[-1,1]$ 连续且端点值相等，却因原点不可导而不能得到所需驻点，说明可导条件不能删。']
  }),
  conclusion({
    lecture: 6, title: 'Peano 型 Taylor 公式', keywords: ['Taylor', '泰勒'],
    statement: '若 $f$ 在 $x_0$ 处 $n$ 阶可导，则 Peano 余项的 Taylor 公式为（ ）。',
    coreMethod: 'Peano 余项写成相对 $(x-x_0)^n$ 的高阶小量。',
    mistakes: '把 $o((x-x_0)^n)$ 与 $O((x-x_0)^{n+1})$ 混为一谈，后者需要更强光滑性。',
    answerText: '正确选项 B。',
    options: ['$f(x)=f(x_0)+o(1)$', '$f(x)=\\sum_{k=0}^n\\frac{f^{(k)}(x_0)}{k!}(x-x_0)^k+o((x-x_0)^n)$', '余项恒为零', '余项必为 $(x-x_0)^{n+1}$'], correctOptionIds: ['B'],
    methods: ['Peano 公式的定义就是用前 $n$ 阶导数构造多项式，并要求余项除以 $(x-x_0)^n$ 后趋于 0。', '仅有 $n$ 阶可导不能擅自声称存在有界的 $n+1$ 阶导数，因此 D 所暗示的更高阶余项不成立。']
  }),
  conclusion({
    lecture: 7, title: '边际量与弹性的定义', keywords: ['边际', '弹性', '经济'], format: 'multiple-choice',
    statement: '设总成本为 $C(q)>0$。关于边际成本和成本弹性，下列正确的是（多选）。',
    coreMethod: '边际量是导数，点弹性是“相对变化率之比”，因此是无量纲量。',
    mistakes: '把平均成本 $C(q)/q$ 当作边际成本，或漏掉弹性公式中的比例因子。',
    answerText: '正确选项 A、C。',
    options: ['边际成本为 $C\u2032(q)$', '边际成本为 $C(q)/q$', '成本弹性为 $qC\u2032(q)/C(q)$', '弹性必带有货币单位'], correctOptionIds: ['A', 'C'],
    methods: ['由增量比极限定义，单位产量的瞬时成本增量是 $C\u2032(q)$；相对成本变化除以相对产量变化得到弹性。', '平均成本和边际成本可在同一产量下不同；弹性是两个百分比之比，不带单位，排除 B、D。']
  }),
  conclusion({
    lecture: 7, title: '相关变化率的时间链', keywords: ['变化率', '链式法则'],
    statement: '若 $x=x(t)$ 且 $y=x^2$，则 $y$ 对时间的变化率是（ ）。',
    coreMethod: '先写变量之间的约束，再对时间 $t$ 整体求导。',
    mistakes: '只写 $dy/dx$，忘记乘上 $dx/dt$。',
    answerText: '正确选项 D：$dy/dt=2x\\,dx/dt$。',
    options: ['$dy/dt=2x$', '$dy/dt=(dx/dt)^2$', '$dy/dt=2t$', '$dy/dt=2x\\,dx/dt$'], correctOptionIds: ['D'],
    methods: ['把 $y(t)=[x(t)]^2$ 直接对 $t$ 用链式法则，得到 $2x(t)x\u2032(t)$。', '量纲检验：$2x$ 只有长度量纲，缺少“每单位时间”；乘 $dx/dt$ 后才与 $dy/dt$ 的量纲匹配。']
  }),
  conclusion({
    lecture: 8, title: '原函数存在的充分条件', keywords: ['原函数', '定积分'],
    statement: '下列哪一条件能保证 $f$ 在区间 $I$ 上存在原函数？（ ）。',
    coreMethod: '区间上连续是原函数存在的常用充分条件，但不是必要条件。',
    mistakes: '把“连续函数必有原函数”误背成“有原函数必连续”。',
    answerText: '正确选项 A。$f$ 在 $I$ 上连续即可由变上限积分构造原函数。',
    options: ['$f$ 在 $I$ 上连续', '$f$ 在一点有定义', '$f$ 在 $I$ 上有界', '$f$ 在 $I$ 上单调'], correctOptionIds: ['A'],
    methods: ['固定 $x_0\\in I$，令 $F(x)=\\int_{x_0}^x f(t)dt$，由微积分基本定理有 $F\u2032(x)=f(x)$。', '有界或单调函数可以有跳跃，而导函数具有 Darboux 性，跳跃函数不可能作为某个函数的导数，故 C、D 不足。']
  }),
  conclusion({
    lecture: 8, title: '反常积分 p 判据', keywords: ['反常积分', 'p判据'], format: 'multiple-choice',
    statement: '关于 $p$ 型反常积分，下列结论正确的是（多选）。',
    coreMethod: '无穷远处与零点附近的收敛条件方向相反。',
    mistakes: '把 $\\int_1^\\infty x^{-p}dx$ 与 $\\int_0^1 x^{-p}dx$ 的判据混用。',
    answerText: '正确选项 A、D。',
    options: ['$\\int_1^\\infty x^{-p}dx$ 在 $p>1$ 时收敛', '它在 $p=1$ 时收敛', '$\\int_0^1 x^{-p}dx$ 在 $p>1$ 时收敛', '$\\int_0^1 x^{-p}dx$ 在 $p<1$ 时收敛'], correctOptionIds: ['A', 'D'],
    methods: ['对 $p\\ne1$ 写原函数 $x^{1-p}/(1-p)$，分别考查上限无穷与下限趋零时的幂指数。', '$p=1$ 都化为对数发散；取 $p=2$ 可直观看出零点处发散而无穷远处收敛。']
  }),
  conclusion({
    lecture: 9, title: '定积分换元的端点方向', keywords: ['换元', '定积分计算'],
    statement: '在定积分换元 $x=\\varphi(t)$ 中，若新端点顺序与原方向相反，则（ ）。',
    coreMethod: '定积分换元后同时替换微分和上下限；端点倒序会带来负号。',
    mistakes: '换元后仍保留旧上下限，或把端点反向产生的符号漏掉。',
    answerText: '正确选项 C，应交换新上下限并补一个负号，或保留倒序积分。',
    options: ['忽略端点方向', '取绝对值', '交换上下限并变号', '只替换被积函数'], correctOptionIds: ['C'],
    methods: ['公式 $\\int_a^b f(x)dx=\\int_\\alpha^\\beta f(\\varphi(t))\\varphi\u2032(t)dt$ 已由导数符号记录方向，倒序与换限变号一致。', '用 $x=1-t$ 计算 $\\int_0^1x\\,dx$；若漏掉端点方向或微分负号，会得到 $-1/2$，与正面积矛盾。']
  }),
  conclusion({
    lecture: 9, title: '分部积分公式辨析', keywords: ['分部积分'],
    statement: '定积分的分部积分公式是（ ）。',
    coreMethod: '从乘积求导 $(uv)\u2032=u\u2032v+uv\u2032$ 积分得到公式。',
    mistakes: '漏写边界项，或把减号写成加号。',
    answerText: '正确选项 A：$\\int_a^b u\\,dv=[uv]_a^b-\\int_a^b v\\,du$。',
    options: ['$\\int_a^b u\\,dv=[uv]_a^b-\\int_a^b v\\,du$', '$\\int u\\,dv=uv+\\int v\\,du$', '$\\int u\\,dv=u/v$', '$\\int_a^b u\\,dv=\\int_a^b v\\,du$'], correctOptionIds: ['A'],
    methods: ['对乘积求导公式在 $[a,b]$ 上积分，再把其中一项移到等式另一侧。', '取 $u=x,dv=dx$ 在 $[0,1]$ 上检验：左端为 $1/2$，只有带边界项和减号的 A 能一致。']
  }),
  conclusion({
    lecture: 10, title: '平面曲线弧长公式', keywords: ['弧长', '几何应用'],
    statement: '若 $y=f(x)$ 在 $[a,b]$ 上连续可导，其弧长为（ ）。',
    coreMethod: '弧长微元来自勾股关系 $ds=\\sqrt{dx^2+dy^2}$。',
    mistakes: '把弧长误写为 $\\int|f\u2032(x)|dx$，那只是总变差的一部分。',
    answerText: '正确选项 B：$L=\\int_a^b\\sqrt{1+[f\u2032(x)]^2}\\,dx$。',
    options: ['$\\int_a^b|f\u2032(x)|dx$', '$\\int_a^b\\sqrt{1+[f\u2032(x)]^2}dx$', '$\\int_a^bf(x)dx$', '$f(b)-f(a)$'], correctOptionIds: ['B'],
    methods: ['在小区间上用直线段近似，长度约为 $\\sqrt{(\\Delta x)^2+(\\Delta y)^2}$，除出 $\\Delta x$ 后取极限。', '水平线 $f\u2032=0$ 的弧长应为 $b-a$；A 会给 0，B 给出正确长度。']
  }),
  conclusion({
    lecture: 10, title: '旋转体垫片与柱壳', keywords: ['旋转体', '体积'], format: 'multiple-choice',
    statement: '求绕坐标轴旋转所得体积时，下列说法正确的是（多选）。',
    coreMethod: '垫片法切片垂直于旋转轴，柱壳法切片平行于旋转轴。',
    mistakes: '半径、壳高和积分变量不匹配，或忘记内半径要平方后相减。',
    answerText: '正确选项 A、C。',
    options: ['垫片面积常写为 $\\pi(R^2-r^2)$', '柱壳周长为 $\\pi r$', '柱壳体积微元常为 $2\\pi r\\cdot h\\,dx$', '两种方法必须使用同一积分变量'], correctOptionIds: ['A', 'C'],
    methods: ['垫片是圆环面积乘厚度；柱壳是周长 $2\\pi r$ 乘高度与厚度。', '画一条切片观察其旋转：垂直轴形成垫片，平行轴形成薄壳；因此两种方法常恰好使用不同变量。']
  }),
  conclusion({
    lecture: 11, title: '积分中值定理的正权版本', keywords: ['积分中值', '正权'],
    statement: '若 $f$ 在 $[a,b]$ 连续，$g$ 可积且不变号，则存在 $\\xi\\in[a,b]$ 使（ ）。',
    coreMethod: '连续函数在区间有最值，不变号权函数使加权平均落在最值之间。',
    mistakes: '若权函数变号，加权平均可能跑出 $f$ 的值域。',
    answerText: '正确选项 D：$\\int_a^b f(x)g(x)dx=f(\\xi)\\int_a^b g(x)dx$。',
    options: ['$\\int fg=f(a)$', '$\\int fg=f(b)$', '$\\int fg=0$', '$\\int fg=f(\\xi)\\int g$'], correctOptionIds: ['D'],
    methods: ['设 $m\\le f\\le M$，权函数同号时积分不等式给出加权平均位于 $[m,M]$，再用连续函数介值性。', '若 $g$ 变号，分母可能为 0 或加权平均越界，因此“不变号”是核心条件而非装饰。']
  }),
  conclusion({
    lecture: 11, title: '积分 Cauchy 不等式', keywords: ['Cauchy', '积分不等式'],
    statement: '平方可积函数 $f,g$ 满足的积分型 Cauchy 不等式是（ ）。',
    coreMethod: '把积分看成函数空间内积，套用内积的 Cauchy-Schwarz 不等式。',
    mistakes: '右端两个平方积分还要相乘；左端整体需要平方或绝对值平方。',
    answerText: '正确选项 B。',
    options: ['$\\int fg\\le\\int f^2+\\int g^2$', '$(\\int fg)^2\\le(\\int f^2)(\\int g^2)$', '$\\int fg=(\\int f)(\\int g)$', '$\\int f^2\\le(\\int f)^2$'], correctOptionIds: ['B'],
    methods: ['令内积 $\\langle f,g\\rangle=\\int fg$，则 $|\\langle f,g\\rangle|^2\\le\\langle f,f\\rangle\\langle g,g\\rangle$。', '考查非负二次式 $\\int(f-tg)^2dx\\ge0$，其关于 $t$ 的判别式不大于 0，整理得到同一结论。']
  }),
  conclusion({
    lecture: 12, title: '变力做功的积分模型', keywords: ['功', '物理应用'],
    statement: '质点沿直线从 $x=a$ 移到 $x=b$，受同方向变力 $F(x)$，所做功为（ ）。',
    coreMethod: '把位移切成小段，每段用“局部恒力×位移”近似再求和取极限。',
    mistakes: '直接用某一点的力乘总位移，忽略力随位置变化。',
    answerText: '正确选项 C：$W=\\int_a^bF(x)dx$。',
    options: ['$W=F(a)$', '$W=F(b)(b-a)$', '$W=\\int_a^bF(x)dx$', '$W=F\u2032(x)$'], correctOptionIds: ['C'],
    methods: ['Riemann 和 $\\sum F(\\xi_i)\\Delta x_i$ 的极限正是定积分。', '量纲检验：力乘长度才是功，A、D 不合量纲；B 只有恒力时才普遍正确。']
  }),
  conclusion({
    lecture: 12, title: '线密度与质心公式', keywords: ['质量', '质心', '密度'],
    statement: '细杆位于 $[a,b]$，线密度 $\\rho(x)>0$。其质心横坐标为（ ）。',
    coreMethod: '质心等于一阶矩除以总质量，是以密度为权的加权平均。',
    mistakes: '漏除总质量，或在非均匀密度下直接取区间中点。',
    answerText: '正确选项 A：$\\bar x=\\frac{\\int_a^b x\\rho(x)dx}{\\int_a^b\\rho(x)dx}$。',
    options: ['$\\frac{\\int x\\rho dx}{\\int\\rho dx}$', '$(a+b)/2$ 恒成立', '$\\int\\rho dx$', '$\\int xdx$'], correctOptionIds: ['A'],
    methods: ['微元质量 $dm=\\rho(x)dx$，总质量 $M=\\int dm$，一阶矩为 $\\int x\\,dm$，两者相除。', '当密度向右端集中时质心应右移，固定中点公式显然失效；正权平均也保证质心落在 $[a,b]$。']
  }),
  conclusion({
    lecture: 13, title: '多元可微的必然结论', keywords: ['偏导', '全微分', '可微'], format: 'multiple-choice',
    statement: '若二元函数 $f$ 在点 $(x_0,y_0)$ 可微，则一定有（多选）。',
    coreMethod: '多元可微是统一的线性逼近，必推出连续和各偏导存在。',
    mistakes: '逆向不成立：偏导存在甚至方向导数都存在，也未必可微。',
    answerText: '正确选项 A、B、C。',
    options: ['$f$ 在该点连续', '两个偏导在该点存在', '全增量有线性主部', '两个偏导在邻域内必连续'], correctOptionIds: ['A', 'B', 'C'],
    methods: ['可微定义 $\\Delta f=A\\Delta x+B\\Delta y+o(\\rho)$ 令增量趋零推出连续；沿坐标轴取增量得到偏导。', '偏导在点处连续是常用充分条件而非可微的必要条件，因此 D 不一定。']
  }),
  conclusion({
    lecture: 13, title: '隐函数存在的关键偏导', keywords: ['隐函数', '多元复合'],
    statement: '由方程 $F(x,y)=0$ 在 $(x_0,y_0)$ 附近确定 $y=y(x)$ 的常用充分条件中，关键非退化条件是（ ）。',
    coreMethod: '要把 $y$ 解成 $x$ 的函数，需要 $F_y(x_0,y_0)\\ne0$。',
    mistakes: '若要求 $x=x(y)$，非零条件应相应改为 $F_x\\ne0$。',
    answerText: '正确选项 B，并有 $y\u2032=-F_x/F_y$。',
    options: ['$F_x=0$', '$F_y\\ne0$', '$F=1$', '$F_x=F_y=0$'], correctOptionIds: ['B'],
    methods: ['对 $F(x,y(x))=0$ 求导得 $F_x+F_yy\u2032=0$；只有 $F_y\\ne0$ 才能稳定解出 $y\u2032$。', '圆 $x^2+y^2=1$ 在点 $(1,0)$ 有 $F_y=0$，附近不能把整个圆唯一表示成 $y(x)$，显示非退化条件的几何意义。']
  }),
  conclusion({
    lecture: 14, title: '二重积分可积的常用保证', keywords: ['二重积分', '区域'],
    statement: '设闭有界区域 $D$ 的边界分片光滑。下列哪一条件可保证 $f$ 在 $D$ 上可积？（ ）。',
    coreMethod: '闭有界区域上的连续函数必有界且 Riemann 可积。',
    mistakes: '只在一点连续或只在区域内有定义，不能控制整体。',
    answerText: '正确选项 C：$f$ 在 $D$ 上连续。',
    options: ['$f$ 在一点连续', '$f$ 在 $D$ 上有定义', '$f$ 在 $D$ 上连续', '$f$ 在一点可导'], correctOptionIds: ['C'],
    methods: ['连续函数在紧集 $D$ 上一致连续且有界，分割足够细时上下和之差可任意小。', '在区域内构造无界函数即可否定“仅有定义”；局部一点的信息也无法约束其他位置。']
  }),
  conclusion({
    lecture: 14, title: '对称区域上的奇函数积分', keywords: ['对称性', '奇偶'], format: 'multiple-choice',
    statement: '区域 $D$ 关于 $y$ 轴对称，下列结论一定正确的是（多选）。',
    coreMethod: '关于 $y$ 轴对称意味着 $(x,y)$ 与 $(-x,y)$ 成对；对 $x$ 为奇的被积函数会抵消。',
    mistakes: '对称轴与奇偶变量必须对应；关于 $y$ 轴对称不能自动消掉关于 $y$ 的奇函数。',
    answerText: '正确选项 A、C。',
    options: ['$\\iint_D x\\,dA=0$', '任意函数积分都为 0', '若 $f(-x,y)=-f(x,y)$，则 $\\iint_Df\\,dA=0$', '$\\iint_Dy\\,dA=0$ 必成立'], correctOptionIds: ['A', 'C'],
    methods: ['作变换 $x\\mapsto-x$，区域与面积元不变，而被积函数变号，因此积分等于自身的相反数。', '取位于上半平面的左右对称区域，则 $y>0$，$\\iint_Dy\\,dA>0$，排除 D；B 显然过强。']
  }),
  conclusion({
    lecture: 15, title: '一阶线性方程积分因子', keywords: ['一阶线性', '积分因子'],
    statement: '一阶线性方程 $y\u2032+P(x)y=Q(x)$ 的标准积分因子是（ ）。',
    coreMethod: '选择 $\\mu$ 使 $(\\mu y)\u2032=\\mu(y\u2032+Py)$，因此 $\\mu\u2032/\\mu=P$。',
    mistakes: '积分因子的指数符号由方程中 $P$ 的符号决定，不能固定写负号。',
    answerText: '正确选项 A：$\\mu(x)=e^{\\int P(x)dx}$。',
    options: ['$e^{\\int Pdx}$', '$e^{\\int Qdx}$', '$P(x)$', '$1/Q(x)$'], correctOptionIds: ['A'],
    methods: ['比较乘积求导 $(\\mu y)\u2032=\\mu y\u2032+\\mu\u2032y$，要求 $\\mu\u2032=\\mu P$。', '代回检验：乘原方程后左端只有选 A 才能完整合并为一个乘积导数。']
  }),
  conclusion({
    lecture: 15, title: '二阶常系数齐次解型', keywords: ['二阶', '特征方程'],
    statement: '方程 $y\u2032\u2032+py\u2032+qy=0$ 的特征方程有一对共轭复根 $\\alpha\\pm i\\beta$（$\\beta\\ne0$），其实通解为（ ）。',
    coreMethod: '复指数的实部和虚部分别给出余弦、正弦两条实解。',
    mistakes: '漏掉指数因子 $e^{\\alpha x}$，或把频率写成 $\\alpha$。',
    answerText: '正确选项 D：$y=e^{\\alpha x}(C_1\\cos\\beta x+C_2\\sin\\beta x)$。',
    options: ['$C_1e^{\\alpha x}+C_2e^{\\beta x}$', '$(C_1+C_2x)e^{\\alpha x}$', '$C_1\\cos\\alpha x+C_2\\sin\\alpha x$', '$e^{\\alpha x}(C_1\\cos\\beta x+C_2\\sin\\beta x)$'], correctOptionIds: ['D'],
    methods: ['由 $e^{(\\alpha+i\\beta)x}=e^{\\alpha x}(\\cos\\beta x+i\\sin\\beta x)$ 取实部、虚部。', '把候选解代回时，振荡频率来自根的虚部 $\\beta$，增长衰减来自实部 $\\alpha$，只有 D 同时满足。']
  }),
  conclusion({
    lecture: 16, title: '级数收敛的必要条件', keywords: ['数项级数', '审敛'],
    statement: '若级数 $\\sum_{n=1}^{\\infty}a_n$ 收敛，则必有（ ）。',
    coreMethod: '通项等于相邻部分和之差，部分和收敛必使通项趋零。',
    mistakes: '$a_n\\to0$ 只是必要条件，不能反推级数收敛。',
    answerText: '正确选项 B：$a_n\\to0$。',
    options: ['$a_n>0$', '$a_n\\to0$', '$a_n$ 单调', '$\\sum|a_n|$ 收敛'], correctOptionIds: ['B'],
    methods: ['令部分和 $S_n\\to S$，则 $a_n=S_n-S_{n-1}\\to S-S=0$。', '调和级数满足 $1/n\\to0$ 却发散，说明该条件不能作为充分判据；条件收敛级数也否定 D。']
  }),
  conclusion({
    lecture: 16, title: '幂级数端点必须另判', keywords: ['幂级数', '收敛半径'], format: 'multiple-choice',
    statement: '幂级数 $\\sum a_n(x-x_0)^n$ 的收敛半径为 $R>0$，下列正确的是（多选）。',
    coreMethod: '半径内绝对收敛，半径外发散，两个端点各自单独判定。',
    mistakes: '由 $R$ 直接断言端点都收敛或都发散。',
    answerText: '正确选项 A、B、D。',
    options: ['$|x-x_0|<R$ 时绝对收敛', '$|x-x_0|>R$ 时发散', '两个端点敛散性必相同', '端点要分别代回原级数判断'], correctOptionIds: ['A', 'B', 'D'],
    methods: ['直接使用 Abel 定理给出的圆内绝对收敛、圆外发散结构；边界不由根值或比值极限决定。', '$\\sum x^n/n$ 在 $x=1$ 发散而在 $x=-1$ 收敛，直接否定“端点敛散必相同”。']
  }),
  conclusion({
    lecture: 17, title: '梯度与等值面的法向', keywords: ['梯度', '切平面'],
    statement: '若光滑曲面由 $F(x,y,z)=c$ 给出，且 $\\nabla F(P)\\ne0$，则在点 $P$ 的一个法向量是（ ）。',
    coreMethod: '沿曲面切向移动时 $F$ 保持不变，方向导数为零，所以梯度垂直所有切向量。',
    mistakes: '梯度是法向量，不是切向量；计算后还要在点 $P$ 代值。',
    answerText: '正确选项 C：$\\nabla F(P)$。',
    options: ['位置向量 $OP$', '任意坐标轴方向', '$\\nabla F(P)$', '$F(P)$'], correctOptionIds: ['C'],
    methods: ['对曲面上的参数曲线 $r(t)$ 求导：$F(r(t))=c$ 给出 $\\nabla F\\cdot r\u2032(t)=0$。', '球面 $x^2+y^2+z^2=R^2$ 的梯度为 $2(x,y,z)$，恰好沿半径法向，提供直观验证。']
  }),
  conclusion({
    lecture: 17, title: '平面法向与直线方向', keywords: ['空间直线', '平面', '夹角'], format: 'multiple-choice',
    statement: '平面 $Ax+By+Cz+D=0$ 的法向量为 $n=(A,B,C)$，直线方向向量为 $s$。下列正确的是（多选）。',
    coreMethod: '直线平行平面等价于方向向量垂直法向；直线垂直平面等价于方向向量平行法向。',
    mistakes: '把“平行平面”误写成方向向量与法向平行。',
    answerText: '正确选项 A、D。',
    options: ['若 $s\\cdot n=0$，直线方向平行于平面', '若 $s\\cdot n=0$，直线垂直于平面', '若 $s\\parallel n$，直线平行于平面', '若 $s\\parallel n$，直线垂直于平面'], correctOptionIds: ['A', 'D'],
    methods: ['平面内所有方向都与法向量正交，所以 $s\\cdot n=0$ 表示直线方向可落在平面方向族中。', '以水平面为例，法向竖直：水平方向与法向点积为 0，竖直方向与法向平行，直观排除 B、C。']
  }),
  conclusion({
    lecture: 18, title: '平面曲线积分与路径无关', keywords: ['曲线积分', 'Green'], format: 'multiple-choice',
    statement: '在单连通区域 $D$ 内，$P,Q$ 具有连续一阶偏导。下列能保证 $\\int Pdx+Qdy$ 与路径无关的是（多选）。',
    coreMethod: '单连通加旋度为零，等价于存在势函数，也等价于任意闭路积分为零。',
    mistakes: '漏掉区域单连通；有孔区域中旋度为零仍可能存在非零环流。',
    answerText: '正确选项 A、B、C。',
    options: ['$P_y=Q_x$ 在 $D$ 内成立', '存在 $u$ 使 $du=Pdx+Qdy$', '任意闭曲线积分为 0', '$P=Q$'], correctOptionIds: ['A', 'B', 'C'],
    methods: ['由 Green 公式，闭路积分等于区域上 $Q_x-P_y$ 的二重积分；单连通保证可把任意闭路围成的区域留在 $D$ 内。', '势函数存在时线积分只等于端点势函数之差；而 $P=Q$ 与偏导相容条件没有必然联系。']
  }),
  conclusion({
    lecture: 18, title: '三大公式的方向约定', keywords: ['Green', 'Gauss', 'Stokes'], format: 'multiple-choice',
    statement: '关于 Green、Gauss、Stokes 公式的方向约定，下列正确的是（多选）。',
    coreMethod: 'Green 用平面正向，Gauss 用封闭曲面外法向，Stokes 用右手规则协调边界与曲面法向。',
    mistakes: '只套公式不检查定向，答案会整体差一个负号。',
    answerText: '正确选项 A、C、D。',
    options: ['Green 正向通常指沿边界前进时区域在左侧', 'Gauss 默认使用内法向', 'Gauss 对封闭曲面通常取外法向', 'Stokes 的边界方向与法向按右手规则匹配'], correctOptionIds: ['A', 'C', 'D'],
    methods: ['逐一核对三大公式的标准定向：平面逆时针、封闭曲面外法向、空间边界与法向右手配对。', '单位圆边界用逆时针参数化可验证 Green 正号；球面通量用外法向为正，若改内法向结果整体变号。']
  })
]
