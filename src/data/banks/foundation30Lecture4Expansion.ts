import type { SeedInput } from './types'

const ZY30_SOURCE = '何耀焜私人整理 · 张宇《基础30讲》高数 · 第4讲逐页核验'
const WZX_SOURCE = '何耀焜私人整理 · 武忠祥《高数基础篇做题本》· 导数与微分逐页核验'

type LectureFourSeed = Omit<SeedInput, 'id' | 'kind' | 'tags' | 'methodFingerprint'> & {
  id: string
  source: string
  role: 'example' | 'exercise'
  tags: string[]
  fingerprint: string
}

function lectureFour(input: LectureFourSeed): SeedInput {
  const roleLabel = input.role === 'example' ? '经典例题' : '课后习题'
  return {
    ...input,
    id: `zy30-verified-l04-${input.id}`,
    kind: 'problem',
    tags: ['高等数学', '第4讲', roleLabel, 'PDF逐页核验', ...input.tags],
    methodFingerprint: `zy30-verified:l04:${input.fingerprint}`
  }
}

export const foundation30Lecture4ExpansionSeeds: SeedInput[] = [
  lectureFour({
    id: 'zy30-example-4-2', source: ZY30_SOURCE, role: 'example', page: 'PDF 127 · 书页 122 · 例 4.2',
    fingerprint: 'composite-log-radical:derivative-at-zero-absolute-parameter',
    title: '例 4.2 · 含参对数根式在零点的导数',
    statement: '设 $y=\\ln\\left(x+\\sqrt{x^2+a^2}\\right)$，其中 $a\\ne0$，求 $y\\prime(0)$。',
    tags: ['复合函数', '链式法则', '参数绝对值'],
    coreMethod: '先按链式法则求出一般点导数并化简为根式的倒数，再在零点使用 $\\sqrt{a^2}=|a|$。',
    mistakes: '把 $\\sqrt{a^2}$ 直接写成 $a$，会在 $a<0$ 时得到错误符号；也不要漏掉根式内层的导数。',
    answerText: '$$y\\prime(0)=\\frac1{|a|}.$$',
    solutionMethods: [
      { title: '方法一 · 链式求导后约分', content: `直接求导得
$$y\\prime=\\frac{1+\\dfrac{x}{\\sqrt{x^2+a^2}}}{x+\\sqrt{x^2+a^2}}=\\frac1{\\sqrt{x^2+a^2}}.$$
令 $x=0$，由 $\\sqrt{a^2}=|a|$ 得 $y\\prime(0)=1/|a|$。` },
      { title: '方法二 · 共轭恒等式复核', content: `利用
$$\\left(x+\\sqrt{x^2+a^2}\\right)\\left(\\sqrt{x^2+a^2}-x\\right)=a^2,$$
可把原函数改写为常数减去 $\\ln(\\sqrt{x^2+a^2}-x)$。对后一形式求导并代入 $x=0$，同样得到 $1/|a|$。` }
    ]
  }),
  lectureFour({
    id: 'zy30-example-4-3', source: ZY30_SOURCE, role: 'example', page: 'PDF 127-128 · 书页 122-123 · 例 4.3',
    fingerprint: 'piecewise-self-composition:pointwise-chain-with-branch-values',
    title: '例 4.3 · 分段函数自复合的点导数',
    statement: `设
$$f(x)=\\begin{cases}\\ln\\sqrt{x},&x\\ge1,\\\\2x-1,&x<1,\\end{cases}\\qquad y=f[f(x)].$$
求 $\\left.\\dfrac{dy}{dx}\\right|_{x=e}$。`,
    tags: ['分段函数', '复合函数', '链式法则'],
    coreMethod: '只追踪 $x=e$ 时外层和内层分别落在哪个分段，再在对应点使用链式法则，无需先写出完整复合函数。',
    mistakes: '误把外层导数也代在 $x=e$；外层的自变量是 $f(e)=1/2$，因此使用线性分支。',
    answerText: '$$\\left.\\frac{dy}{dx}\\right|_{x=e}=\\frac1e.$$',
    solutionMethods: [
      { title: '方法一 · 点值链式法则', content: '有 $f(e)=\\ln\\sqrt e=1/2<1$，故 $f\\prime[f(e)]=2$；又 $f\\prime(e)=1/(2e)$。于是 $y\\prime(e)=f\\prime[f(e)]f\\prime(e)=2\\cdot1/(2e)=1/e$。' },
      { title: '方法二 · 局部分段展开', content: '在 $e$ 的充分小邻域内，内层仍取 $f(x)=\\tfrac12\\ln x$，且其值仍小于 $1$，所以 $y=2f(x)-1=\\ln x-1$。直接求导也得 $y\\prime(e)=1/e$。' }
    ]
  }),
  lectureFour({
    id: 'zy30-example-4-4', source: ZY30_SOURCE, role: 'example', page: 'PDF 128 · 书页 123 · 例 4.4',
    fingerprint: 'nested-exponential-sine-log:differential-chain',
    title: '例 4.4 · 三层复合函数的微分',
    statement: '设 $y=e^{\\sin(\\ln x)}$，求 $dy$ 与 $dy/dx$。',
    tags: ['微分', '复合函数', '链式法则'],
    coreMethod: '按“指数、正弦、对数”由外向内逐层相乘导数，最后乘以 $dx$ 即得微分。',
    mistakes: '容易漏掉最内层 $(\\ln x)\\prime=1/x$，或把 $dy$ 和 $dy/dx$ 写成同一个量。',
    answerText: '$$\\frac{dy}{dx}=\\frac{e^{\\sin(\\ln x)}\\cos(\\ln x)}x,\\qquad dy=\\frac{e^{\\sin(\\ln x)}\\cos(\\ln x)}x\\,dx.$$',
    solutionMethods: [
      { title: '方法一 · 链式法则', content: '令 $u=\\ln x$、$v=\\sin u$，则 $y=e^v$。因此 $dy=e^v\\cos u\\,du=e^{\\sin(\\ln x)}\\cos(\\ln x)\\,dx/x$，除以 $dx$ 即得导数。' },
      { title: '方法二 · 对数微分复核', content: '两边取对数得 $\\ln y=\\sin(\\ln x)$。微分后有 $dy/y=\\cos(\\ln x)\\,dx/x$，再乘回 $y=e^{\\sin(\\ln x)}$，结果一致。' }
    ]
  }),
  lectureFour({
    id: 'zy30-example-4-5', source: ZY30_SOURCE, role: 'example', page: 'PDF 129 · 书页 124 · 例 4.5',
    fingerprint: 'absolute-log:piecewise-derivative-nonzero-domain',
    title: '例 4.5 · 对数绝对值的分段求导',
    statement: '设 $y=\\ln|x|$，$x\\ne0$，求 $y\\prime$。',
    tags: ['绝对值', '分段函数', '对数求导'],
    coreMethod: '把绝对值按 $x>0$ 与 $x<0$ 展开，两段分别求导后合并。',
    mistakes: '$x=0$ 不在定义域；不能把结论误写成 $1/|x|$。',
    answerText: '$$y\\prime=\\frac1x\\qquad(x\\ne0).$$',
    solutionMethods: [
      { title: '方法一 · 分段求导', content: '当 $x>0$ 时 $y=\\ln x$，导数为 $1/x$；当 $x<0$ 时 $y=\\ln(-x)$，导数为 $(-1)/(-x)=1/x$。两段合并即得结论。' },
      { title: '方法二 · 平方恒等式', content: '对 $x\\ne0$，有 $\\ln|x|=\\tfrac12\\ln(x^2)$。求导得到 $\\tfrac12\\cdot2x/x^2=1/x$，同时定义域仍须保留 $x\\ne0$。' }
    ]
  }),
  lectureFour({
    id: 'zy30-example-4-6', source: ZY30_SOURCE, role: 'example', page: 'PDF 129-130 · 书页 124-125 · 例 4.6',
    fingerprint: 'absolute-x-exponential:second-derivative-piecewise-cusp',
    title: '例 4.6 · 含绝对值乘积的二阶导数',
    statement: '设 $y=|xe^{-x}|$，求 $y\\prime\\prime$。',
    tags: ['绝对值', '分段函数', '二阶导数'],
    coreMethod: '因 $e^{-x}>0$，绝对值只取决于 $x$ 的符号；先分段，再判断分界点的一阶可导性。',
    mistakes: '直接写 $|x|e^{-x}$ 后在 $x=0$ 套乘积公式；原函数在零点不可导，因此更不存在二阶导数。',
    answerText: `$$y\\prime\\prime=\\begin{cases}e^{-x}(2-x),&x<0,\\\\e^{-x}(x-2),&x>0,\\end{cases}$$
且 $x=0$ 处不存在。`,
    solutionMethods: [
      { title: '方法一 · 完整分段', content: `当 $x<0$ 时 $y=-xe^{-x}$，故 $y\\prime=e^{-x}(x-1)$、$y\\prime\\prime=e^{-x}(2-x)$；当 $x>0$ 时 $y=xe^{-x}$，故 $y\\prime=e^{-x}(1-x)$、$y\\prime\\prime=e^{-x}(x-2)$。左右一阶导数在零点分别为 $-1$ 与 $1$，所以零点不可导。` },
      { title: '方法二 · 符号函数复核', content: '在 $x\\ne0$ 时可写 $y=\\operatorname{sgn}(x)xe^{-x}$，符号在每个半轴上是常数，连续求导两次即可得到上述两段。再单独用导数定义检查 $x=0$，确认尖点不能并入公式。' }
    ]
  }),
  lectureFour({
    id: 'zy30-example-4-7', source: ZY30_SOURCE, role: 'example', page: 'PDF 131 · 书页 126 · 例 4.7',
    fingerprint: 'inverse-second-derivative:value-mapping-at-three-plus-e',
    title: '例 4.7 · 反函数二阶导数的定点计算',
    statement: '当 $x>0$ 时，设 $y=f(x)=3x^2+e^x$ 有反函数 $x=\\varphi(y)$，求 $\\varphi\\prime\\prime(3+e)$。',
    tags: ['反函数', '二阶导数', '定点映射'],
    coreMethod: '先由 $f(1)=3+e$ 找到对应原变量，再套用反函数二阶导数公式。',
    mistakes: '把 $3+e$ 直接代入 $f\\prime$；反函数的自变量值必须先映射回 $x=1$。',
    answerText: '$$\\varphi\\prime\\prime(3+e)=-\\frac1{(6+e)^2}.$$',
    solutionMethods: [
      { title: '方法一 · 反函数公式', content: '由 $f(1)=3+e$，计算 $f\\prime(1)=6+e$、$f\\prime\\prime(1)=6+e$。使用 $\\varphi\\prime\\prime(y)=-f\\prime\\prime(x)/[f\\prime(x)]^3$，得 $-1/(6+e)^2$。' },
      { title: '方法二 · 隐式连求两次', content: '从 $y=3\\varphi(y)^2+e^{\\varphi(y)}$ 求导得 $1=(6x+e^x)\\varphi\\prime$。再求导并在 $x=1$ 处代入 $\\varphi\\prime=1/(6+e)$，整理得到同一答案。' }
    ]
  }),
  lectureFour({
    id: 'zy30-example-4-8', source: ZY30_SOURCE, role: 'example', page: 'PDF 131 · 书页 126 · 例 4.8',
    fingerprint: 'implicit-cubic:branch-selection-zero-first-derivative-second',
    title: '例 4.8 · 隐函数先定点再求二阶导数',
    statement: '设函数 $y=y(x)$ 由 $y^3+xy^2+x^2y+6=0$ 确定，且 $y\\prime(1)=0$，求 $y\\prime\\prime(1)$。',
    tags: ['隐函数', '二阶导数', '分支选择'],
    coreMethod: '先用原方程与已知的一阶导数确定 $y(1)$，再对隐式方程连续求导两次。',
    mistakes: '一阶求导得到两个候选值后，必须回代原方程排除 $y(1)=0$；二阶求导不能漏掉乘积项。',
    answerText: '$$y\\prime\\prime(1)=\\frac49.$$',
    solutionMethods: [
      { title: '方法一 · 两次隐式求导', content: `一阶求导为
$$3y^2y\\prime+y^2+2xyy\\prime+2xy+x^2y\\prime=0.$$
令 $x=1$、$y\\prime(1)=0$ 得 $y^2+2y=0$；结合原方程知 $y(1)=-2$。再次求导并代入 $(1,-2,0)$，得到 $9y\\prime\\prime-4=0$，故 $y\\prime\\prime(1)=4/9$。` },
      { title: '方法二 · 隐函数二阶公式', content: '令 $F(x,y)=y^3+xy^2+x^2y+6$。有 $y\\prime=-F_x/F_y$，已知 $y\\prime=0$ 意味着 $F_x=0$；与 $F=0$ 联立得点 $(1,-2)$。再用 $y\\prime\\prime=-(F_{xx}+2F_{xy}y\\prime+F_{yy}y\\prime^2)/F_y$，代入即得 $4/9$。' }
    ]
  }),
  lectureFour({
    id: 'zy30-example-4-9', source: ZY30_SOURCE, role: 'example', page: 'PDF 132 · 书页 127 · 例 4.9',
    fingerprint: 'parametric-second-derivative:sin-t-tsin-plus-cos',
    title: '例 4.9 · 参数曲线的二阶导数定点值',
    statement: `曲线由
$$x=\\sin t,\\qquad y=t\\sin t+\\cos t$$
确定，求 $\\left.\\dfrac{d^2y}{dx^2}\\right|_{t=\\pi/4}$。`,
    tags: ['参数方程', '二阶导数', '定点计算'],
    coreMethod: '先算 $dy/dx=(dy/dt)/(dx/dt)$，再对所得结果关于 $t$ 求导并除以 $dx/dt$。',
    mistakes: '不能把二阶导数写成 $y\\prime\\prime(t)/x\\prime\\prime(t)$；第二次仍要除以 $dx/dt$。',
    answerText: '$$\\left.\\frac{d^2y}{dx^2}\\right|_{t=\\pi/4}=\\sqrt2.$$',
    solutionMethods: [
      { title: '方法一 · 参数求导链', content: '$dx/dt=\\cos t$，$dy/dt=t\\cos t$，故 $dy/dx=t$。再求一次得 $d^2y/dx^2=(dt/dx)=1/\\cos t$，在 $t=\\pi/4$ 处为 $\\sqrt2$。' },
      { title: '方法二 · 标准二阶参数公式', content: '使用 $d^2y/dx^2=(y\\prime\\prime x\\prime-y\\prime x\\prime\\prime)/(x\\prime)^3$。代入 $x\\prime=\\cos t$、$x\\prime\\prime=-\\sin t$、$y\\prime=t\\cos t$、$y\\prime\\prime=\\cos t-t\\sin t$，化简仍为 $1/\\cos t$。' }
    ]
  }),
  lectureFour({
    id: 'zy30-example-4-10', source: ZY30_SOURCE, role: 'example', page: 'PDF 132-133 · 书页 127-128 · 例 4.10',
    fingerprint: 'parametric-implicit-y:arctan-t-quadratic-equation',
    title: '例 4.10 · 参数与隐函数混合求导',
    statement: `函数由
$$x=\\arctan t,\\qquad 2y-ty^2+e^t=5$$
确定，求 $dy/dx$。`,
    tags: ['参数方程', '隐函数', '复合求导'],
    coreMethod: '先对含 $y(t)$ 的隐式方程求 $dy/dt$，再除以 $dx/dt$。',
    mistakes: '对 $ty^2$ 求导时漏掉 $2tyy\\prime$，或把 $dy/dx$ 与 $dy/dt$ 混为一谈。',
    answerText: '$$\\frac{dy}{dx}=\\frac{(y^2-e^t)(1+t^2)}{2(1-ty)}.$$',
    solutionMethods: [
      { title: '方法一 · 先隐后参', content: '对第二式关于 $t$ 求导得 $2y_t-y^2-2tyy_t+e^t=0$，所以 $y_t=(y^2-e^t)/[2(1-ty)]$。又 $x_t=1/(1+t^2)$，相除即得答案。' },
      { title: '方法二 · 微分形式', content: '对两式写微分：$dx=dt/(1+t^2)$，$2dy-y^2dt-2ty\\,dy+e^tdt=0$。从第二式解出 $dy/dt$，再用 $dy/dx=(dy/dt)/(dx/dt)$，结果相同。' }
    ]
  }),
  lectureFour({
    id: 'zy30-example-4-11', source: ZY30_SOURCE, role: 'example', page: 'PDF 133 · 书页 128 · 例 4.11',
    fingerprint: 'log-transform-implicit:second-derivative-with-f-of-y',
    title: '例 4.11 · 取对数化简复合隐函数',
    statement: '设函数 $y=y(x)$ 由 $xe^{f(y)}=e^y\\ln2$ 确定，其中 $f$ 具有二阶导数且 $f\\prime(y)\\ne1$，求 $d^2y/dx^2$。',
    tags: ['隐函数', '对数求导', '二阶导数'],
    coreMethod: '先对方程取对数，将乘积与指数化为 $\\ln x+f(y)=y+\\ln(\\ln2)$，再连续求导。',
    mistakes: '原式两边直接连续求导会产生大量乘积项；二次求导时要保留 $f\\prime\\prime(y)(y\\prime)^2$。',
    answerText: '$$y\\prime\\prime=-\\frac{[1-f\\prime(y)]^2-f\\prime\\prime(y)}{x^2[1-f\\prime(y)]^3}.$$',
    solutionMethods: [
      { title: '方法一 · 取对数后连求两次', content: '取对数得 $\\ln x+f(y)=y+\\ln(\\ln2)$，故 $y\\prime=1/[x(1-f\\prime)]$。再次求导并整理得 $y\\prime\\prime=\\{f\\prime\\prime-[1-f\\prime]^2\\}/\\{x^2[1-f\\prime]^3\\}$。' },
      { title: '方法二 · 一阶关系隐式复核', content: '由 $1/x+f\\prime(y)y\\prime=y\\prime$ 得 $x[1-f\\prime(y)]y\\prime=1$。对这一乘积恒等式求导，再代回 $y\\prime=1/[x(1-f\\prime)]$，即可化到题给答案。' }
    ]
  }),
  lectureFour({
    id: 'zy30-example-4-12', source: ZY30_SOURCE, role: 'example', page: 'PDF 134 · 书页 129 · 例 4.12',
    fingerprint: 'variable-base-power:x-to-x-logarithmic-derivative',
    title: '例 4.12 · 幂指函数 $x^x$ 的导数',
    statement: '求函数 $y=x^x$（$x>0$）的导数。',
    tags: ['幂指函数', '对数求导', '导数计算'],
    coreMethod: '把变量同时出现在底数和指数的式子改写为 $e^{x\\ln x}$，再使用链式法则。',
    mistakes: '误套幂函数公式写成 $xx^{x-1}$，或误套指数函数公式只保留 $x^x\\ln x$。',
    answerText: '$$y\\prime=x^x(1+\\ln x).$$',
    solutionMethods: [
      { title: '方法一 · 指数化', content: '由 $x^x=e^{x\\ln x}$，求导得 $y\\prime=e^{x\\ln x}(x\\ln x)\\prime=x^x(1+\\ln x)$。' },
      { title: '方法二 · 对数微分', content: '取对数得 $\\ln y=x\\ln x$。两边求导为 $y\\prime/y=1+\\ln x$，再乘回 $y=x^x$ 即得结论。' }
    ]
  }),
  lectureFour({
    id: 'zy30-example-4-13', source: ZY30_SOURCE, role: 'example', page: 'PDF 134 · 书页 129 · 例 4.13',
    fingerprint: 'variable-base-power:x-to-reciprocal-x-logarithmic-derivative',
    title: '例 4.13 · 幂指函数 $x^{1/x}$ 的导数',
    statement: '求函数 $y=x^{1/x}$（$x>0$）的导数。',
    tags: ['幂指函数', '对数求导', '复合函数'],
    coreMethod: '指数化为 $e^{(\\ln x)/x}$，关键是正确求出商 $\\ln x/x$ 的导数。',
    mistakes: '把 $(1/x)\\prime$ 的负号漏掉，或把最后的 $x^{1/x}$ 因子遗漏。',
    answerText: '$$y\\prime=x^{1/x-2}(1-\\ln x).$$',
    solutionMethods: [
      { title: '方法一 · 指数化', content: '写成 $y=e^{(\\ln x)/x}$。因为 $[(\\ln x)/x]\\prime=(1-\\ln x)/x^2$，所以 $y\\prime=x^{1/x}(1-\\ln x)/x^2=x^{1/x-2}(1-\\ln x)$。' },
      { title: '方法二 · 对数微分', content: '由 $\\ln y=(\\ln x)/x$，直接得到 $y\\prime/y=(1-\\ln x)/x^2$。代入 $y=x^{1/x}$ 后化简，答案一致。' }
    ]
  }),
  lectureFour({
    id: 'zy30-example-4-14', source: ZY30_SOURCE, role: 'example', page: 'PDF 134-135 · 书页 129-130 · 例 4.14',
    fingerprint: 'trigonometric-high-derivative:phase-shift-sine-n',
    title: '例 4.14 · 正弦函数的 $n$ 阶导数',
    statement: '求 $y=\\sin x$ 的 $n$ 阶导数。',
    tags: ['高阶导数', '三角函数', '周期规律'],
    coreMethod: '把每次求导看成相位增加 $\\pi/2$，从而统一四步循环。',
    mistakes: '只背四种余数情形而在 $n$ 的起点上错位；应先用 $n=1$ 检查公式是否给出 $\\cos x$。',
    answerText: '$$y^{(n)}=\\sin\\left(x+\\frac{n\\pi}{2}\\right).$$',
    solutionMethods: [
      { title: '方法一 · 逐阶观察', content: '$\\sin x$ 的导数依次为 $\\cos x,-\\sin x,-\\cos x,\\sin x$，每四阶循环一次；这些函数统一写成 $\\sin(x+n\\pi/2)$。' },
      { title: '方法二 · 复指数复核', content: '由 $\\sin x=\\operatorname{Im}(e^{ix})$，有 $y^{(n)}=\\operatorname{Im}(i^ne^{ix})=\\operatorname{Im}(e^{i(x+n\\pi/2)})$，即所求公式。' }
    ]
  }),
  lectureFour({
    id: 'zy30-example-4-15', source: ZY30_SOURCE, role: 'example', page: 'PDF 135-136 · 书页 130-131 · 例 4.15',
    fingerprint: 'rational-high-derivative:rewrite-one-plus-x-reciprocal-at-zero',
    title: '例 4.15 · 有理函数在零点的高阶导数',
    statement: '设 $y=(1-x)/(1+x)$，求 $y^{(n)}(0)$。',
    tags: ['高阶导数', '有理函数', '选择题'],
    coreMethod: '先恒等变形为 $-1+2/(1+x)$，把高阶导数归结为常见倒数函数。',
    mistakes: '常数项只在零阶保留；对 $n\\ge1$ 求导时不要把 $-1$ 计入。',
    answerText: '正确选项为 A，$$y^{(n)}(0)=(-1)^n2n!.$$',
    questionFormat: 'single-choice',
    options: ['$(-1)^n2n!$', '$-2^n n!$', '$2^n(n-1)!$', '$-2^n(n-1)!$'],
    correctOptionIds: ['A'],
    solutionMethods: [
      { title: '方法一 · 恒等变形', content: '由 $(1-x)/(1+x)=-1+2(1+x)^{-1}$。当 $n\\ge1$ 时，$y^{(n)}=2(-1)^nn!(1+x)^{-n-1}$，令 $x=0$ 得答案。' },
      { title: '方法二 · 幂级数系数', content: '在 $|x|<1$ 内，$y=1-2x+2x^2-2x^3+\\cdots$，其中 $x^n$ 的系数为 $2(-1)^n$。乘以 $n!$ 即得 $y^{(n)}(0)=2(-1)^nn!$。' }
    ]
  }),
  lectureFour({
    id: 'zy30-example-4-16', source: ZY30_SOURCE, role: 'example', page: 'PDF 136 · 书页 131 · 例 4.16',
    fingerprint: 'differential-recurrence:f-prime-equals-f-squared-induction',
    title: '例 4.16 · 由微分关系递推高阶导数',
    statement: '已知函数 $f(x)$ 具有任意阶导数，且 $f\\prime(x)=[f(x)]^2$。求 $f^{(n)}(x)$。',
    tags: ['高阶导数', '递推关系', '数学归纳法'],
    coreMethod: '从给定微分关系逐次求导观察阶乘与幂次规律，再用归纳法闭合。',
    mistakes: '只写出前几阶就当作证明；通式中幂次应为 $n+1$，系数应为 $n!$。',
    answerText: '$$f^{(n)}(x)=n![f(x)]^{n+1}.$$',
    solutionMethods: [
      { title: '方法一 · 递推归纳', content: '由 $f\\prime=f^2$ 得 $f\\prime\\prime=2f^3$、$f^{(3)}=2\\cdot3f^4$。若 $f^{(k)}=k!f^{k+1}$，求导得 $f^{(k+1)}=k!(k+1)f^kf\\prime=(k+1)!f^{k+2}$，归纳完成。' },
      { title: '方法二 · 解微分方程复核', content: '在不恒为零的区间上，$f\\prime=f^2$ 给出 $f(x)=-1/(x+C)$。对这一倒数函数求 $n$ 阶导数得到 $n!/(x+C)^{n+1}=n!f^{n+1}$；零解也满足同一公式。' }
    ]
  }),
  lectureFour({
    id: 'zy30-example-4-17', source: ZY30_SOURCE, role: 'example', page: 'PDF 137 · 书页 132 · 例 4.17',
    fingerprint: 'leibniz-high-derivative:x-times-exponential-two-surviving-terms',
    title: '例 4.17 · 莱布尼茨公式只保留两项',
    statement: '设 $f(x)=xe^x$，求 $f^{(n)}(x)$。',
    tags: ['高阶导数', '莱布尼茨公式', '乘积求导'],
    coreMethod: '$x$ 的二阶及以上导数为零，因此莱布尼茨展开只剩两项。',
    mistakes: '把组合系数 $C_n^1=n$ 漏掉，或误认为结果仍是 $xe^x$。',
    answerText: '$$f^{(n)}(x)=(x+n)e^x.$$',
    solutionMethods: [
      { title: '方法一 · 莱布尼茨公式', content: '展开 $(xe^x)^{(n)}$ 时只有 $x(e^x)^{(n)}+C_n^1x\\prime(e^x)^{(n-1)}$ 非零，故结果为 $xe^x+ne^x=(x+n)e^x$。' },
      { title: '方法二 · 归纳递推', content: '一阶导数为 $(x+1)e^x$。若第 $n$ 阶为 $(x+n)e^x$，再求导得到 $[1+x+n]e^x=(x+n+1)e^x$，从而通式成立。' }
    ]
  }),
  lectureFour({
    id: 'zy30-example-4-18', source: ZY30_SOURCE, role: 'example', page: 'PDF 138-139 · 书页 133-134 · 例 4.18',
    fingerprint: 'taylor-coefficient:x-squared-log-one-minus-x-at-zero',
    title: '例 4.18 · Taylor 系数求零点高阶导数',
    statement: '设 $f(x)=x^2\\ln(1-x)$，当 $n\\ge3$ 时求 $f^{(n)}(0)$。',
    tags: ['高阶导数', 'Taylor展开', '系数比较'],
    coreMethod: '把 $\\ln(1-x)$ 展开后乘 $x^2$，读取 $x^n$ 的系数并乘以 $n!$。',
    mistakes: '漏掉 $\\ln(1-x)$ 展开的整体负号；指标平移后分母是 $n-2$。',
    answerText: '$$f^{(n)}(0)=-\\frac{n!}{n-2}\\qquad(n\\ge3).$$',
    solutionMethods: [
      { title: '方法一 · Taylor 系数', content: '由 $\\ln(1-x)=-\\sum_{k=1}^{\\infty}x^k/k$，得 $f(x)=-\\sum_{k=1}^{\\infty}x^{k+2}/k$。令 $n=k+2$，$x^n$ 系数为 $-1/(n-2)$，故导数值为该系数乘 $n!$。' },
      { title: '方法二 · 莱布尼茨公式', content: '对 $x^2\\ln(1-x)$ 求 $n$ 阶导数，因 $x^2$ 只有零至二阶导数，代入 $x=0$ 后仅 $C_n^2\\cdot2\\cdot[\\ln(1-x)]^{(n-2)}|_0$ 存活。使用后者为 $-(n-3)!$，化简得 $-n!/(n-2)$。' }
    ]
  }),
  lectureFour({
    id: 'zy30-example-4-19', source: ZY30_SOURCE, role: 'example', page: 'PDF 139 · 书页 134 · 例 4.19',
    fingerprint: 'taylor-or-leibniz:x-squared-two-to-x-high-derivative-zero',
    title: '例 4.19 · $x^22^x$ 在零点的高阶导数',
    statement: '设 $f(x)=x^22^x$，求 $f^{(n)}(0)$。',
    tags: ['高阶导数', 'Taylor展开', '莱布尼茨公式'],
    coreMethod: '利用 $2^x=e^{x\\ln2}$ 的展开读取系数，或在莱布尼茨公式中只保留 $x^2$ 的二阶导数项。',
    mistakes: '通式对 $n=1$ 应单独说明为零；对 $n\\ge2$ 才直接使用 $(\\ln2)^{n-2}$。',
    answerText: '$$f\\prime(0)=0,\\qquad f^{(n)}(0)=n(n-1)(\\ln2)^{n-2}\\quad(n\\ge2).$$',
    solutionMethods: [
      { title: '方法一 · Taylor 系数', content: '由 $2^x=\\sum_{k=0}^{\\infty}(\\ln2)^kx^k/k!$，乘以 $x^2$ 后，$x^n$ 的系数为 $(\\ln2)^{n-2}/(n-2)!$。乘 $n!$ 得 $n(n-1)(\\ln2)^{n-2}$；一阶导数单独为零。' },
      { title: '方法二 · 莱布尼茨公式', content: '在 $(x^22^x)^{(n)}$ 中代入 $x=0$，含 $x^2$ 或 $2x$ 的项消失，只剩 $C_n^2\\cdot2\\cdot(2^x)^{(n-2)}|_0$，即 $n(n-1)(\\ln2)^{n-2}$。' }
    ]
  }),
  lectureFour({
    id: 'zy30-exercise-4-1', source: ZY30_SOURCE, role: 'exercise', page: 'PDF 140-141 · 书页 135-136 · 习题 4.1',
    fingerprint: 'composite-exponential:recover-inner-value-from-derivative',
    title: '习题 4.1 · 由复合函数导数反求内层点值',
    statement: '设 $g(x)$ 可微，$h(x)=e^{1+g(x)}$，且 $h\\prime(1)=1$、$g\\prime(1)=2$，求 $g(1)$。',
    tags: ['复合函数', '链式法则', '选择题'],
    coreMethod: '对复合指数函数求导，在 $x=1$ 处代入已知导数，再取对数反解 $g(1)$。',
    mistakes: '容易漏掉外层指数中的常数 $1$，或忘记乘内层导数 $g\\prime(1)=2$。',
    answerText: '正确选项为 C，$$g(1)=-\\ln2-1.$$',
    questionFormat: 'single-choice',
    options: ['$\\ln3-1$', '$-\\ln3-1$', '$-\\ln2-1$', '$\\ln2-1$'],
    correctOptionIds: ['C'],
    solutionMethods: [
      { title: '方法一 · 直接链式求导', content: '$h\\prime(x)=e^{1+g(x)}g\\prime(x)$。代入 $x=1$ 得 $1=2e^{1+g(1)}$，所以 $1+g(1)=\\ln(1/2)=-\\ln2$，即 $g(1)=-\\ln2-1$。' },
      { title: '方法二 · 对数微分', content: '由 $\\ln h=1+g$ 得 $h\\prime/h=g\\prime$。在 $1$ 处有 $h(1)=h\\prime(1)/g\\prime(1)=1/2$；再用 $h(1)=e^{1+g(1)}$ 反解，结论相同。' }
    ]
  }),
  lectureFour({
    id: 'zy30-exercise-4-2', source: ZY30_SOURCE, role: 'exercise', page: 'PDF 140-141 · 书页 135-136 · 习题 4.2',
    fingerprint: 'parameter-limit-to-exponential:function-then-derivative',
    title: '习题 4.2 · 先化参数极限再求导',
    statement: '设 $f(x)=\\lim_{t\\to0}x(1-2t)^{-x/t}$，求 $f\\prime(x)$。',
    tags: ['重要极限', '指数函数', '导数计算'],
    coreMethod: '先把关于 $t$ 的极限化为 $e^{2x}$，得到显式函数后再求导。',
    mistakes: '极限变量是 $t$ 而 $x$ 是常量；不要在尚未求出 $f(x)$ 时对极限式机械求导。',
    answerText: '$$f\\prime(x)=(1+2x)e^{2x}.$$',
    solutionMethods: [
      { title: '方法一 · 重要极限', content: '有 $(1-2t)^{-x/t}=[(1-2t)^{-1/(2t)}]^{2x}\\to e^{2x}$，故 $f(x)=xe^{2x}$。用乘积法则得 $f\\prime=(1+2x)e^{2x}$。' },
      { title: '方法二 · 对数极限', content: '对幂式取对数：$(-x/t)\\ln(1-2t)\\to2x$，所以幂式趋于 $e^{2x}$。还原并求导，同样得到 $(1+2x)e^{2x}$。' }
    ]
  }),
  lectureFour({
    id: 'zy30-exercise-4-3', source: ZY30_SOURCE, role: 'exercise', page: 'PDF 140-141 · 书页 135-136 · 习题 4.3',
    fingerprint: 'inverse-second-derivative:given-a-exponential-first-derivative',
    title: '习题 4.3 · 已知原函数导数求反函数二阶导数',
    statement: '已知 $f\\prime(x)=Ae^x$，其中 $A>0$，求 $f(x)$ 的反函数在对应点的二阶导数。',
    tags: ['反函数', '二阶导数', '指数函数'],
    coreMethod: '套用反函数二阶导数公式 $d^2x/dy^2=-f\\prime\\prime(x)/[f\\prime(x)]^3$。',
    mistakes: '题目中的结果仍以原变量 $x$ 表示；分母是原函数一阶导数的三次方。',
    answerText: '$$\\frac{d^2x}{dy^2}=-\\frac1{A^2e^{2x}}.$$',
    solutionMethods: [
      { title: '方法一 · 反函数公式', content: '由 $f\\prime(x)=Ae^x$ 得 $f\\prime\\prime(x)=Ae^x$。于是反函数二阶导数为 $-Ae^x/(Ae^x)^3=-1/(A^2e^{2x})$。' },
      { title: '方法二 · 倒数导数再求一次', content: '反函数一阶导数为 $dx/dy=1/(Ae^x)$。对 $y$ 求导，并用 $dx/dy=1/(Ae^x)$ 作链式替换，得到 $d^2x/dy^2=-1/(A^2e^{2x})$。' }
    ]
  }),
  lectureFour({
    id: 'zy30-exercise-4-5', source: ZY30_SOURCE, role: 'exercise', page: 'PDF 140、142 · 书页 135、137 · 习题 4.5',
    fingerprint: 'differential-recurrence:f-prime-e-to-f-point-two',
    title: '习题 4.5 · $f\\prime=e^f$ 的高阶导数点值',
    statement: '设 $f(x)$ 在 $x=2$ 的某邻域内具有任意阶导数，且 $f\\prime(x)=e^{f(x)}$、$f(2)=1$。当 $n\\ge1$ 时求 $f^{(n)}(2)$。',
    tags: ['高阶导数', '递推关系', '点值计算'],
    coreMethod: '连续求导观察 $f^{(n)}=(n-1)!e^{nf}$，再代入 $f(2)=1$。',
    mistakes: '指数中的倍数随阶数增长；不能把所有阶导数都误写成 $e^{f(x)}$。',
    answerText: '$$f^{(n)}(2)=(n-1)!e^n.$$',
    solutionMethods: [
      { title: '方法一 · 逐阶归纳', content: '由 $f\\prime=e^f$，得 $f\\prime\\prime=e^{2f}$、$f^{(3)}=2e^{3f}$。若 $f^{(n)}=(n-1)!e^{nf}$，求导后为 $n!e^{nf}f\\prime=n!e^{(n+1)f}$，归纳成立。代 $f(2)=1$ 即得答案。' },
      { title: '方法二 · 解方程复核', content: '微分方程给出 $(e^{-f})\\prime=-1$，故局部有 $e^{-f}=C-x$。于是 $f=-\\ln(C-x)$，其 $n$ 阶导数为 $(n-1)!/(C-x)^n=(n-1)!e^{nf}$，在 $x=2$ 处得 $(n-1)!e^n$。' }
    ]
  }),
  lectureFour({
    id: 'zy30-exercise-4-6', source: ZY30_SOURCE, role: 'exercise', page: 'PDF 140、142 · 书页 135、137 · 习题 4.6',
    fingerprint: 'implicit-sine-log:solve-point-then-first-derivative-at-zero',
    title: '习题 4.6 · 含对数隐函数先定点后求导',
    statement: '设 $y=y(x)$ 由 $\\sin(xy)=\\ln\\dfrac{x+e}{y}+1$ 确定，求 $y\\prime(0)$。',
    tags: ['隐函数', '对数函数', '点值求导'],
    coreMethod: '先令 $x=0$ 由原方程求出 $y(0)=e^2$，再对两边求导。',
    mistakes: '若不先求 $y(0)$，导数方程无法定值；对 $\\ln y$ 求导须带 $y\\prime/y$。',
    answerText: '$$y\\prime(0)=e-e^4.$$',
    solutionMethods: [
      { title: '方法一 · 隐式求导', content: '令 $x=0$，有 $0=\\ln(e/y(0))+1$，得 $y(0)=e^2$。求导得 $\\cos(xy)(y+xy\\prime)=1/(x+e)-y\\prime/y$。代入 $x=0,y=e^2$，解得 $y\\prime=e-e^4$。' },
      { title: '方法二 · 偏导公式', content: '令 $F(x,y)=\\sin(xy)-\\ln(x+e)+\\ln y-1$，则 $y\\prime=-F_x/F_y$。在 $(0,e^2)$ 处，$F_x=e^2-1/e$、$F_y=e^{-2}$，故 $y\\prime=-(e^2-1/e)e^2=e-e^4$。' }
    ]
  }),
  lectureFour({
    id: 'zy30-exercise-4-7', source: ZY30_SOURCE, role: 'exercise', page: 'PDF 140、142 · 书页 135、137 · 习题 4.7',
    fingerprint: 'quotient-extension:g-over-x-derivative-continuity-from-second-derivative',
    title: '习题 4.7 · 商函数补点后导函数连续性证明',
    statement: `已知 $g(x)$ 在 $x=0$ 处二阶可导，且 $g(0)=g\\prime(0)=0$。设
$$f(x)=\\begin{cases}\\dfrac{g(x)}x,&x\\ne0,\\\\0,&x=0.\\end{cases}$$
证明：$f\\prime(x)$ 在 $x=0$ 处连续。`,
    tags: ['导数定义', '二阶可导', '连续性证明'],
    coreMethod: '先由导数定义求 $f\\prime(0)=g\\prime\\prime(0)/2$，再计算 $x\\ne0$ 时的导数并取极限。',
    mistakes: '二阶可导只保证在零点的二阶差商极限，证明中应把每一步写成可用的极限，不能直接假设 $g\\prime\\prime$ 邻域连续。',
    answerText: '$$f\\prime(0)=\\frac12g\\prime\\prime(0),\\qquad \\lim_{x\\to0}f\\prime(x)=f\\prime(0).$$',
    solutionMethods: [
      { title: '方法一 · 两层导数定义', content: `由定义
$$f\\prime(0)=\\lim_{x\\to0}\\frac{g(x)}{x^2}=\\frac12\\lim_{x\\to0}\\frac{g\\prime(x)-g\\prime(0)}x=\\frac12g\\prime\\prime(0).$$
当 $x\\ne0$ 时 $f\\prime=(xg\\prime-g)/x^2$。把极限拆成 $g\\prime(x)/x-g(x)/x^2$，两项分别趋于 $g\\prime\\prime(0)$ 与 $g\\prime\\prime(0)/2$，故极限等于 $f\\prime(0)$。` },
      { title: '方法二 · Peano 展开', content: '二阶可导且 $g(0)=g\\prime(0)=0$ 给出 $g(x)=\\tfrac12g\\prime\\prime(0)x^2+o(x^2)$，同时 $g\\prime(x)=g\\prime\\prime(0)x+o(x)$。因此 $f\\prime(x)=[xg\\prime(x)-g(x)]/x^2=\\tfrac12g\\prime\\prime(0)+o(1)$，与 $f\\prime(0)$ 相等。' }
    ]
  }),
  lectureFour({
    id: 'wzx-p46-example-4', source: WZX_SOURCE, role: 'example', page: 'PDF 25 · 书内 P46 · 例 4',
    fingerprint: 'tangent-perpendicular:log-curve-slope-negative-reciprocal',
    title: '武忠祥 P46 例 4 · 与给定直线垂直的切线',
    statement: '求曲线 $y=\\ln x$ 上与直线 $x+y=1$ 垂直的切线方程。',
    tags: ['导数应用', '切线', '垂直斜率'],
    coreMethod: '给定直线斜率为 $-1$，垂直切线斜率应为 $1$；用 $y\\prime=1/x$ 确定切点。',
    mistakes: '把“垂直”误读成平行而仍取斜率 $-1$；曲线定义域要求 $x>0$。',
    answerText: '$$y=x-1.$$',
    solutionMethods: [
      { title: '方法一 · 斜率对应', content: '直线 $x+y=1$ 的斜率为 $-1$，故所求切线斜率为 $1$。令 $1/x_0=1$ 得 $x_0=1$，切点为 $(1,0)$，所以切线为 $y=x-1$。' },
      { title: '方法二 · 一般切线族', content: '$y=\\ln x$ 在 $x=a>0$ 处的切线为 $y-\\ln a=(x-a)/a$。要求它与斜率 $-1$ 的直线垂直，即 $1/a=1$，从而 $a=1$ 并得到同一方程。' }
    ]
  }),
  lectureFour({
    id: 'wzx-p49-example-9', source: WZX_SOURCE, role: 'example', page: 'PDF 26 · 书内 P49 · 例 9',
    fingerprint: 'second-derivative:symmetric-exponential-of-sine-at-period-point',
    title: '武忠祥 P49 例 9 · 对称指数复合函数的二阶导数',
    statement: '已知 $f(x)=e^{\\sin x}+e^{-\\sin x}$，求 $f\\prime\\prime(2\\pi)$。',
    tags: ['二阶导数', '复合函数', '定点计算'],
    coreMethod: '先保持 $e^{\\sin x}\\pm e^{-\\sin x}$ 的对称结构求导，再利用 $2\\pi$ 处正弦为零、余弦为一。',
    mistakes: '第二次求导时既要对 $\\cos x$ 求导，也要对指数差求导；漏项会得到零。',
    answerText: '$$f\\prime\\prime(2\\pi)=2.$$',
    solutionMethods: [
      { title: '方法一 · 直接求导', content: '$f\\prime=\\cos x(e^{\\sin x}-e^{-\\sin x})$，故 $f\\prime\\prime=-\\sin x(e^{\\sin x}-e^{-\\sin x})+\\cos^2x(e^{\\sin x}+e^{-\\sin x})$。代入 $2\\pi$ 得 $2$。' },
      { title: '方法二 · 局部展开', content: '在 $x=2\\pi+h$ 附近，$f=2\\cosh(\\sin h)$。由 $\\sin h=h+O(h^3)$、$\\cosh u=1+u^2/2+O(u^4)$，得 $f=2+h^2+O(h^4)$，因此二阶导数为 $2$。' }
    ]
  }),
  lectureFour({
    id: 'wzx-p50-example-13', source: WZX_SOURCE, role: 'example', page: 'PDF 28 · 书内 P50 · 例 13',
    fingerprint: 'differential:variable-base-power-one-plus-sine-at-pi',
    title: '武忠祥 P50 例 13 · 幂指函数在 $\\pi$ 点的微分',
    statement: '设 $y=(1+\\sin x)^x$，求 $\\left.dy\\right|_{x=\\pi}$。',
    tags: ['微分', '幂指函数', '对数求导'],
    coreMethod: '先取对数求一般导数，再利用 $x=\\pi$ 时底数为一、余弦为负一。',
    mistakes: '不能分别套幂函数或指数函数公式；微分答案最后必须带 $dx$。',
    answerText: '$$\\left.dy\\right|_{x=\\pi}=-\\pi\\,dx.$$',
    solutionMethods: [
      { title: '方法一 · 对数求导', content: '由 $\\ln y=x\\ln(1+\\sin x)$，有 $y\\prime/y=\\ln(1+\\sin x)+x\\cos x/(1+\\sin x)$。在 $x=\\pi$ 时 $y=1$，故 $y\\prime=-\\pi$，所以 $dy=-\\pi\\,dx$。' },
      { title: '方法二 · 指数化复核', content: '写成 $y=e^{x\\ln(1+\\sin x)}$。指数内函数在 $\\pi$ 处的导数为 $0+\\pi(-1)=-\\pi$，外层指数值为 $1$，相乘后仍得微分 $-\\pi\\,dx$。' }
    ]
  }),
  lectureFour({
    id: 'wzx-p52-example-16', source: WZX_SOURCE, role: 'example', page: 'PDF 29 · 书内 P52 · 例 16',
    fingerprint: 'leibniz-high-derivative:x-squared-times-cosine-three-terms',
    title: '武忠祥 P52 例 16 · $x^2\\cos x$ 的 $n$ 阶导数',
    statement: '设 $y=x^2\\cos x$，求 $y^{(n)}$。',
    tags: ['高阶导数', '莱布尼茨公式', '三角函数'],
    coreMethod: '$x^2$ 的三阶及以上导数为零，莱布尼茨展开只保留零、一、二阶对应的三项。',
    mistakes: '第二项系数是 $2nx$，第三项系数是 $n(n-1)$；三角相位阶数也要同步减一、减二。',
    answerText: `$$y^{(n)}=x^2\\cos\\left(x+\\frac{n\\pi}{2}\\right)+2nx\\cos\\left(x+\\frac{(n-1)\\pi}{2}\\right)+n(n-1)\\cos\\left(x+\\frac{(n-2)\\pi}{2}\\right).$$`,
    solutionMethods: [
      { title: '方法一 · 莱布尼茨公式', content: '在 $(x^2\\cos x)^{(n)}$ 中只保留 $k=0,1,2$ 三项：$x^2(\\cos x)^{(n)}+C_n^1(2x)(\\cos x)^{(n-1)}+C_n^2(2)(\\cos x)^{(n-2)}$，代入余弦高阶导数即得。' },
      { title: '方法二 · 复指数复核', content: '把 $x^2\\cos x$ 看作 $\\operatorname{Re}(x^2e^{ix})$。对 $x^2e^{ix}$ 用莱布尼茨公式只保留三项，再取实部，会得到完全相同的三个相位项。' }
    ]
  }),
  lectureFour({
    id: 'wzx-p55-example-23', source: WZX_SOURCE, role: 'example', page: 'PDF 31 · 书内 P55 · 例 23',
    fingerprint: 'implicit-second-derivative:x-square-plus-xy-plus-y-cube',
    title: '武忠祥 P55 例 23 · 三次隐函数的二阶导数',
    statement: '函数 $y=y(x)$ 由 $x^2+xy+y^3=3$ 确定，求 $y\\prime\\prime(1)$。',
    tags: ['隐函数', '二阶导数', '真题'],
    coreMethod: '先由原方程确定 $y(1)=1$，再连续求导并逐层代入点值。',
    mistakes: '求 $y(1)$ 时不能跳过方程的唯一实根判断；第二次求导要保留 $6y(y\\prime)^2$。',
    answerText: '$$y\\prime\\prime(1)=-\\frac{31}{32}.$$',
    solutionMethods: [
      { title: '方法一 · 两次隐式求导', content: '令 $x=1$，由 $y^3+y-2=0$ 得 $y=1$。一阶求导为 $2x+y+(x+3y^2)y\\prime=0$，故 $y\\prime(1)=-3/4$。再求导得 $2+2y\\prime+(x+3y^2)y\\prime\\prime+6y(y\\prime)^2=0$，代入即得 $-31/32$。' },
      { title: '方法二 · 偏导公式', content: '令 $F=x^2+xy+y^3-3$。在 $(1,1)$ 处，$y\\prime=-F_x/F_y=-3/4$；再用 $y\\prime\\prime=-(F_{xx}+2F_{xy}y\\prime+F_{yy}y\\prime^2)/F_y$，代入 $F_{xx}=2,F_{xy}=1,F_{yy}=6,F_y=4$，得到 $-31/32$。' }
    ]
  }),
  lectureFour({
    id: 'wzx-p55-example-25', source: WZX_SOURCE, role: 'example', page: 'PDF 32 · 书内 P55 · 例 25',
    fingerprint: 'rational-high-derivative:linear-denominator-at-zero',
    title: '武忠祥 P55 例 25 · 线性分母函数的高阶导数',
    statement: '设 $y=1/(2x+3)$，求 $y^{(n)}(0)$。',
    tags: ['高阶导数', '有理函数', '真题'],
    coreMethod: '把函数写成 $(2x+3)^{-1}$ 连续求导，或展开成几何级数读取系数。',
    mistakes: '每求一阶不仅增加阶乘，还会多出一个链式系数 $2$；分母幂次为 $n+1$。',
    answerText: '$$y^{(n)}(0)=(-1)^n\\frac{n!2^n}{3^{n+1}}.$$',
    solutionMethods: [
      { title: '方法一 · 通式求导', content: '$[(2x+3)^{-1}]^{(n)}=(-1)^nn!2^n(2x+3)^{-n-1}$。令 $x=0$，得到 $(-1)^nn!2^n/3^{n+1}$。' },
      { title: '方法二 · 几何级数', content: '在零点附近，$1/(2x+3)=\\tfrac13[1+(2x/3)]^{-1}=\\sum_{n=0}^{\\infty}(-1)^n2^nx^n/3^{n+1}$。$x^n$ 系数乘 $n!$ 即为答案。' }
    ]
  }),
  lectureFour({
    id: 'wzx-p57-example-27', source: WZX_SOURCE, role: 'example', page: 'PDF 32 · 书内 P57 · 例 27',
    fingerprint: 'implicit-tangent:tan-x-plus-y-pi-four-e-to-y-origin',
    title: '武忠祥 P57 例 27 · 三角指数隐函数的切线',
    statement: '求曲线 $\\tan(x+y+\\pi/4)=e^y$ 在点 $(0,0)$ 处的切线方程。',
    tags: ['隐函数', '切线', '导数应用'],
    coreMethod: '对方程两边求导，在原点利用 $\\sec^2(\\pi/4)=2$ 解出切线斜率。',
    mistakes: '左边是复合函数，导数含 $(1+y\\prime)$；右边导数为 $e^yy\\prime$。',
    answerText: '$$2x+y=0.$$',
    solutionMethods: [
      { title: '方法一 · 隐式求导', content: '求导得 $\\sec^2(x+y+\\pi/4)(1+y\\prime)=e^yy\\prime$。在原点为 $2(1+y\\prime)=y\\prime$，所以 $y\\prime=-2$，切线为 $y=-2x$。' },
      { title: '方法二 · 隐函数偏导', content: '令 $F=\\tan(x+y+\\pi/4)-e^y$，则 $y\\prime=-F_x/F_y$。原点处 $F_x=2$、$F_y=2-1=1$，故斜率为 $-2$，方程仍为 $2x+y=0$。' }
    ]
  }),
  lectureFour({
    id: 'wzx-p57-example-29', source: WZX_SOURCE, role: 'example', page: 'PDF 33 · 书内 P57 · 例 29',
    fingerprint: 'polar-tangent:logarithmic-spiral-at-pi-over-two',
    title: '武忠祥 P57 例 29 · 对数螺线的直角坐标切线',
    statement: '对数螺线 $r=e^\\theta$ 在 $(r,\\theta)=(e^{\\pi/2},\\pi/2)$ 处的切线直角坐标方程是什么？',
    tags: ['极坐标', '参数方程', '切线'],
    coreMethod: '将极坐标曲线参数化为 $x=r\\cos\\theta$、$y=r\\sin\\theta$，用参数求导算斜率。',
    mistakes: '切点的直角坐标是 $(0,e^{\\pi/2})$；不能把极坐标中的 $r$ 直接当作横坐标。',
    answerText: '$$x+y=e^{\\pi/2}.$$',
    solutionMethods: [
      { title: '方法一 · 参数求导', content: '因 $r\\prime=r$，有 $dx/d\\theta=r\\cos\\theta-r\\sin\\theta$，$dy/d\\theta=r\\sin\\theta+r\\cos\\theta$。在 $\\theta=\\pi/2$ 处斜率为 $-1$，切点为 $(0,e^{\\pi/2})$，故 $x+y=e^{\\pi/2}$。' },
      { title: '方法二 · 局部微分向量', content: '在目标点，切向量为 $(dx/d\\theta,dy/d\\theta)=(-r,r)$，法向量可取 $(1,1)$。通过 $(0,r)$ 的直线满足 $x+(y-r)=0$，代 $r=e^{\\pi/2}$ 即得答案。' }
    ]
  }),
  lectureFour({
    id: 'wzx-p58-example-30', source: WZX_SOURCE, role: 'example', page: 'PDF 33 · 书内 P58 · 例 30',
    fingerprint: 'related-rates:distance-origin-point-on-cubic-at-one',
    title: '武忠祥 P58 例 30 · 三次曲线上动点的距离变化率',
    statement: '动点 $P$ 在曲线 $y=x^3$ 上运动，原点到 $P$ 的距离为 $l$。若 $dx/dt=v_0$ 为常数，求点 $P$ 到达 $(1,1)$ 时的 $dl/dt$。',
    tags: ['相关变化率', '导数应用', '真题'],
    coreMethod: '由距离平方 $l^2=x^2+y^2=x^2+x^6$ 建立关于时间的恒等式，再求导。',
    mistakes: '不能把 $dy/dt$ 也当成 $v_0$；它应由 $dy/dt=3x^2dx/dt$ 得到。',
    answerText: '$$\\frac{dl}{dt}=2\\sqrt2\\,v_0.$$',
    solutionMethods: [
      { title: '方法一 · 距离平方求导', content: '由 $l^2=x^2+x^6$，对 $t$ 求导得 $2l\\,dl/dt=(2x+6x^5)dx/dt$。在 $x=1,l=\\sqrt2$ 处，$dl/dt=8v_0/(2\\sqrt2)=2\\sqrt2v_0$。' },
      { title: '方法二 · 速度投影', content: '点的速度为 $(dx/dt,dy/dt)=(v_0,3x^2v_0)$。距离变化率等于速度在径向单位向量 $(x,y)/l$ 上的投影；在 $(1,1)$ 处为 $(v_0+3v_0)/\\sqrt2=2\\sqrt2v_0$。' }
    ]
  })
]
