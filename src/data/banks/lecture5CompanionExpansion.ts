import type { SeedInput } from './types'

const WZX_SOURCE = '何耀焜私人整理 · 武忠祥《高数基础篇做题本》· 微分中值定理及导数应用逐页核验'
const ZY1000_SOURCE = '何耀焜私人整理 · 张宇《1000题》数一解析册 · 一元函数微分学应用逐页核验'

type LectureFiveCompanionSeed = Omit<SeedInput, 'id' | 'kind' | 'tags' | 'methodFingerprint'> & {
  id: string
  source: string
  role: 'example' | 'exercise'
  tags: string[]
  fingerprint: string
}

function lectureFiveCompanion(input: LectureFiveCompanionSeed): SeedInput {
  return {
    ...input,
    id: `zy30-verified-l05-${input.id}`,
    kind: 'problem',
    tags: [
      '高等数学',
      '第5讲',
      input.role === 'example' ? '经典例题' : '课后习题',
      'PDF逐页核验',
      ...input.tags
    ],
    methodFingerprint: `zy30-verified:l05:${input.fingerprint}`
  }
}

export const lecture5CompanionExpansionSeeds: SeedInput[] = [
  lectureFiveCompanion({
    id: 'wzx-example-6', source: WZX_SOURCE, role: 'example', page: 'PDF 34 · 书页 66 · 例 6',
    fingerprint: 'local-minimum:positive-equivalent-one-minus-cosine-at-zero',
    title: '武忠祥例 6 · 等价无穷小锁定零点极小值',
    statement: '已知 $f(x)$ 在 $x=0$ 的某个邻域内连续，且 $$f(0)=0,\\qquad \\lim_{x\\to0}\\frac{f(x)}{1-\\cos x}=2.$$ 则 $f(x)$ 在 $x=0$ 处（　）。',
    tags: ['极值', '等价无穷小', '选择题'],
    questionFormat: 'single-choice',
    options: ['不可导', '可导且 $f\\prime(0)\\ne0$', '取得极大值', '取得极小值'],
    correctOptionIds: ['D'],
    coreMethod: '把极限为正转化为邻域内的同号关系，再利用 $1-\\cos x>0$ 判断 $f(x)$ 在零点两侧均为正。',
    mistakes: '极限条件不仅能判断极值，还能推出 $f(x)=O(x^2)$；但题目最直接、最稳妥的结论是零点为极小值点。',
    answerText: '正确选项为 D：$x=0$ 是 $f(x)$ 的极小值点。',
    solutionMethods: [
      { title: '方法一 · 同号邻域', content: '极限为正数 $2$，故在充分小的去心邻域内，$f(x)$ 与 $1-\\cos x$ 同号。又当 $x\\ne0$ 且充分接近零时 $1-\\cos x>0$，所以 $f(x)>0=f(0)$，零点为严格局部极小值点。' },
      { title: '方法二 · 等价无穷小', content: '由 $1-\\cos x\\sim x^2/2$，有 $f(x)\\sim x^2$。因此零点两侧的函数值都高于 $f(0)=0$。同时 $f\\prime(0)=\\lim f(x)/x=0$，也排除了“导数非零”的选项。' }
    ]
  }),
  lectureFiveCompanion({
    id: 'wzx-example-7', source: WZX_SOURCE, role: 'example', page: 'PDF 34 · 书页 67 · 例 7',
    fingerprint: 'piecewise-derivative:exponential-difference-quotient-at-zero',
    title: '武忠祥例 7 · 指数差商在零点的可导性',
    statement: `设
$$f(x)=\\begin{cases}\\dfrac{e^x-1}{x},&x\\ne0,\\\\1,&x=0.\\end{cases}$$
则 $f(x)$ 在 $x=0$ 处（　）。`,
    tags: ['分段函数', '导数定义', '选择题'],
    questionFormat: 'single-choice',
    options: ['连续且取得极大值', '连续且取得极小值', '可导且导数为 $0$', '可导且导数不为 $0$'],
    correctOptionIds: ['D'],
    coreMethod: '按导数定义把二重差商化简，或展开 $e^x$ 到二阶项，保留决定零点导数的线性项。',
    mistakes: '只用 $(e^x-1)/x\\to1$ 只能证明连续；要判断导数还必须再除一次 $x$。',
    answerText: '正确选项为 D，且 $$f\\prime(0)=\\frac12.$$ ',
    solutionMethods: [
      { title: '方法一 · 导数定义', content: '$$f\\prime(0)=\\lim_{x\\to0}\\frac{(e^x-1)/x-1}{x}=\\lim_{x\\to0}\\frac{e^x-1-x}{x^2}=\\frac12.$$ 因而函数在零点可导，导数不为零。' },
      { title: '方法二 · Taylor 展开', content: '由 $e^x=1+x+x^2/2+o(x^2)$，得 $$f(x)=1+\\frac{x}{2}+o(x).$$ 与 $f(0)=1$ 比较，线性项系数就是 $f\\prime(0)=1/2$。' }
    ]
  }),
  lectureFiveCompanion({
    id: 'wzx-example-8', source: WZX_SOURCE, role: 'example', page: 'PDF 35 · 书页 67 · 例 8',
    fingerprint: 'solid-optimization:cone-inscribed-in-sphere-height-parameter',
    title: '武忠祥例 8 · 球内接直圆锥的最大体积',
    statement: '在半径为 $R$ 的球中内接一个直圆锥，求该圆锥的最大体积。',
    tags: ['最值应用', '空间几何', '直圆锥'],
    coreMethod: '以圆锥高 $h$ 为单变量，通过球截面关系写出底面半径平方，再在 $0<h<2R$ 上求体积最大值。',
    mistakes: '圆锥底面不一定经过球心；底面半径满足 $r^2=R^2-(R-h)^2$，不能直接取 $r=R$。',
    answerText: '当圆锥高 $h=4R/3$ 时体积最大，且 $$V_{\\max}=\\frac{32\\pi R^3}{81}.$$ ',
    solutionMethods: [
      { title: '方法一 · 高度单变量化', content: '设圆锥高为 $h$，则 $r^2=R^2-(R-h)^2=2Rh-h^2$。因此 $$V(h)=\\frac{\\pi}{3}h^2(2R-h),\\qquad 0<h<2R.$$ 求导得 $V\\prime(h)=\\pi h(4R-3h)/3$，唯一内部极大点为 $h=4R/3$，代入得 $32\\pi R^3/81$。' },
      { title: '方法二 · 无量纲化', content: '令 $t=h/R$，则 $$V=\\frac{\\pi R^3}{3}t^2(2-t),\\qquad 0<t<2.$$ 只需最大化 $t^2(2-t)$，导数为 $t(4-3t)$，故 $t=4/3$，结果同样为 $32\\pi R^3/81$。' }
    ]
  }),
  lectureFiveCompanion({
    id: 'wzx-example-9', source: WZX_SOURCE, role: 'example', page: 'PDF 35 · 书页 68 · 例 9',
    fingerprint: 'inflection-tangent:x-square-plus-two-log-x',
    title: '武忠祥例 9 · 对数曲线拐点处的切线',
    statement: '求曲线 $$y=x^2+2\\ln x$$ 在其拐点处的切线方程。',
    tags: ['拐点', '切线', '对数函数'],
    coreMethod: '先用二阶导数的变号确定拐点，再把该点及一阶导数代入点斜式。',
    mistakes: '只解 $y^{(2)}=0$ 不检查变号；还要注意定义域为 $x>0$。',
    answerText: '$$y=4x-3.$$ ',
    solutionMethods: [
      { title: '方法一 · 二阶导数判拐点', content: '$y\\prime=2x+2/x$，$y^{(2)}=2-2/x^2$。在定义域内唯一候选点为 $x=1$，且二阶导数在其两侧由负变正，故拐点为 $(1,1)$。此时斜率 $y\\prime(1)=4$，切线为 $y-1=4(x-1)$。' },
      { title: '方法二 · 凹凸区间表', content: '在 $(0,1)$ 上有 $y^{(2)}<0$，在 $(1,+\\infty)$ 上有 $y^{(2)}>0$，所以凹凸性只在 $x=1$ 改变。代入函数值与导数后得到同一切线 $y=4x-3$。' }
    ]
  }),
  lectureFiveCompanion({
    id: 'wzx-example-10', source: WZX_SOURCE, role: 'example', page: 'PDF 36 · 书页 68 · 例 10',
    fingerprint: 'nonsmooth-extremum-inflection:absolute-x-times-one-minus-x-at-zero',
    title: '武忠祥例 10 · 绝对值尖点同时成为极值点与拐点',
    statement: '设 $f(x)=|x(1-x)|$，则关于 $x=0$ 与点 $(0,0)$ 的结论正确的是（　）。',
    tags: ['绝对值', '极值', '拐点', '选择题'],
    questionFormat: 'single-choice',
    options: [
      '$x=0$ 是极值点，但 $(0,0)$ 不是拐点',
      '$x=0$ 不是极值点，但 $(0,0)$ 是拐点',
      '$x=0$ 是极值点，且 $(0,0)$ 是拐点',
      '$x=0$ 不是极值点，且 $(0,0)$ 不是拐点'
    ],
    correctOptionIds: ['C'],
    coreMethod: '在零点左右分别去绝对值：同时比较函数值判断极值，并比较二阶导数符号判断凹凸性。',
    mistakes: '拐点不要求一阶导数存在；零点虽然是尖点，只要曲线连续且凹凸性改变，仍可成为拐点。',
    answerText: '正确选项为 C：$x=0$ 是极小值点，$(0,0)$ 也是拐点。',
    solutionMethods: [
      { title: '方法一 · 分段展开', content: '在零点附近，$x<0$ 时 $f=x^2-x$，$x>0$ 时 $f=x-x^2$。两侧都有 $f(x)>f(0)=0$，故零点为极小值点；左右二阶导数分别为 $2$ 与 $-2$，凹凸性改变，所以 $(0,0)$ 是拐点。' },
      { title: '方法二 · 图像局部结构', content: '因 $x(1-x)$ 在零点穿过横轴，取绝对值会把左侧负值翻到横轴上方，形成谷底；翻折后左支开口向上、右支开口向下，因此该尖点兼具极小与拐点两种性质。' }
    ]
  }),
  lectureFiveCompanion({
    id: 'wzx-example-11', source: WZX_SOURCE, role: 'example', page: 'PDF 36 · 书页 68 · 例 11',
    fingerprint: 'asymptote-existence:linear-plus-sine-one-over-x',
    title: '武忠祥例 11 · 从四条曲线中筛选渐近线',
    statement: '下列曲线中存在渐近线的是（　）。',
    tags: ['渐近线', '无穷远极限', '选择题'],
    questionFormat: 'single-choice',
    options: ['$y=x+\\sin x$', '$y=x^2+\\sin x$', '$y=x+\\sin(1/x)$', '$y=x^2+\\sin(1/x)$'],
    correctOptionIds: ['C'],
    coreMethod: '对候选斜渐近线先比较最高阶增长，再检查函数与直线之差是否真正趋于零。',
    mistakes: '$x+\\sin x$ 与 $y=x$ 的差持续振荡，并不趋零；“差有界”不足以构成渐近线。',
    answerText: '正确选项为 C，其斜渐近线是 $y=x$。',
    solutionMethods: [
      { title: '方法一 · 差值极限', content: '对选项 C，有 $$[x+\\sin(1/x)]-x=\\sin(1/x)\\to0\\qquad(x\\to\\pm\\infty),$$ 故 $y=x$ 是斜渐近线。其余选项或差值不收敛，或具有二次增长，均不可能靠近某条直线。' },
      { title: '方法二 · 斜率截距检验', content: '选项 C 满足 $a=\\lim y/x=1$，$b=\\lim(y-x)=0$。选项 A 的第二个极限不存在，B、D 的 $y/x$ 发散，所以只有 C 通过两步检验。' }
    ]
  }),
  lectureFiveCompanion({
    id: 'wzx-example-13', source: WZX_SOURCE, role: 'example', page: 'PDF 37 · 书页 69 · 例 13',
    fingerprint: 'slant-asymptote:x-times-one-plus-arcsine-two-over-x',
    title: '武忠祥例 13 · 反正弦微扰的斜渐近线',
    statement: '求曲线 $$y=x\\left(1+\\arcsin\\frac{2}{x}\\right)$$ 在无穷远处的斜渐近线。',
    tags: ['渐近线', '反三角函数', '等价无穷小'],
    coreMethod: '把主线性项 $x$ 分离，用 $\\arcsin u\\sim u$ 计算剩余常数截距。',
    mistakes: '定义域为 $|x|\\ge2$，但两端无穷远得到同一条斜渐近线；不要漏掉截距 $2$。',
    answerText: '$$y=x+2.$$ ',
    solutionMethods: [
      { title: '方法一 · 差值极限', content: '$$y-(x+2)=x\\arcsin\\frac2x-2=2\\left(\\frac{\\arcsin(2/x)}{2/x}-1\\right)\\to0.$$ 因而在 $x\\to+\\infty$ 与 $x\\to-\\infty$ 两个方向，曲线都趋近于 $y=x+2$。' },
      { title: '方法二 · 斜率截距公式', content: '$a=\\lim y/x=1$，且 $$b=\\lim(y-x)=\\lim x\\arcsin(2/x)=2.$$ 所以斜渐近线方程为 $y=x+2$。' }
    ]
  }),
  lectureFiveCompanion({
    id: 'zy1000-exercise-1', source: ZY1000_SOURCE, role: 'exercise', page: 'PDF 33 · 书页 27 · 第 1 题',
    fingerprint: 'global-minimum:exponential-plus-half-reciprocal-exponential',
    title: '1000 题第 1 题 · 两个指数项的全局最小值',
    statement: '求函数 $$y=e^x+\\frac{e^{-x}}2$$ 的最小值。',
    tags: ['最值', '指数函数', '不等式'],
    coreMethod: '两个正项的乘积为常数，可直接使用均值不等式；也可求导定位唯一极小点。',
    mistakes: '均值不等式的等号要求两项相等，即 $e^x=e^{-x}/2$，不能误取 $x=0$。',
    answerText: '最小值为 $\\sqrt2$，在 $x=-\\tfrac12\\ln2$ 处取得。',
    solutionMethods: [
      { title: '方法一 · 均值不等式', content: '$$e^x+\\frac{e^{-x}}2\\ge2\\sqrt{e^x\\cdot\\frac{e^{-x}}2}=\\sqrt2.$$ 当 $e^x=e^{-x}/2$，即 $x=-\\tfrac12\\ln2$ 时等号成立。' },
      { title: '方法二 · 一阶导数', content: '$y\\prime=e^x-e^{-x}/2$，唯一驻点满足 $e^{2x}=1/2$。又 $y^{(2)}=e^x+e^{-x}/2>0$，所以该驻点给出全局最小值，代入为 $\\sqrt2$。' }
    ]
  }),
  lectureFiveCompanion({
    id: 'zy1000-exercise-4', source: ZY1000_SOURCE, role: 'exercise', page: 'PDF 34 · 书页 28 · 第 4 题',
    fingerprint: 'parameter-inequality:quintic-plus-a-dominates-ten-thirds-cubic-positive-x',
    title: '1000 题第 4 题 · 恒成立多项式不等式的参数范围',
    statement: '若对一切 $x>0$，不等式 $$x^5+a\\ge\\frac{10}{3}x^3$$ 恒成立，求参数 $a$ 的取值范围。',
    tags: ['恒成立问题', '最值', '参数范围'],
    coreMethod: '把含参不等式移项为 $a\\ge10x^3/3-x^5$，问题转化为求右端在正半轴的最大值。',
    mistakes: '极值点只有 $x=\\sqrt2$ 属于正半轴；最终应写成参数区间，而不是只写临界值。',
    answerText: '$$a\\in\\left[\\frac{8\\sqrt2}{3},+\\infty\\right).$$ ',
    solutionMethods: [
      { title: '方法一 · 辅助函数求最大值', content: '令 $g(x)=10x^3/3-x^5$。则 $$g\\prime(x)=5x^2(2-x^2),$$ 所以 $g$ 在 $(0,\\sqrt2)$ 增加、在 $(\\sqrt2,+\\infty)$ 减少，最大值为 $g(\\sqrt2)=8\\sqrt2/3$。故 $a$ 至少等于该值。' },
      { title: '方法二 · 无量纲配方复核', content: '令 $u=x^2>0$，右端写成 $x^3(10/3-u)$。求其对数导数或直接对 $u^{3/2}(10/3-u)$ 求导，唯一最大点仍为 $u=2$，从而得到同一临界参数。' }
    ]
  }),
  lectureFiveCompanion({
    id: 'zy1000-exercise-9', source: ZY1000_SOURCE, role: 'exercise', page: 'PDF 35 · 书页 29 · 第 9 题',
    fingerprint: 'implicit-curvature:x-square-minus-xy-plus-y-square-one-at-one-one',
    title: '1000 题第 9 题 · 隐式曲线在指定点的曲率',
    statement: '求曲线 $$x^2-xy+y^2=1$$ 在点 $(1,1)$ 处的曲率。',
    tags: ['曲率', '隐函数', '二阶导数'],
    coreMethod: '连续做两次隐式求导，在指定点先求 $y\\prime$，再求 $y^{(2)}$ 并代入曲率公式。',
    mistakes: '二次求导时 $xy\\prime$ 同时含有 $x$ 与 $y\\prime$；不要漏掉乘积法则产生的两项。',
    answerText: '$$k=\\frac{3\\sqrt2}{2}.$$ ',
    solutionMethods: [
      { title: '方法一 · 两次隐式求导', content: '一阶求导得 $2x-y-xy\\prime+2yy\\prime=0$，代入 $(1,1)$ 得 $y\\prime=-1$。再求导并代回该点得到 $y^{(2)}=-6$，故 $$k=\\frac{|y^{(2)}|}{[1+(y\\prime)^2]^{3/2}}=\\frac6{2\\sqrt2}=\\frac{3\\sqrt2}{2}.$$' },
      { title: '方法二 · 隐函数偏导公式', content: '令 $F=x^2-xy+y^2-1$。由 $y\\prime=-F_x/F_y$ 得 $y\\prime(1)=-1$；再用 $$y^{(2)}=-\\frac{F_{xx}+2F_{xy}y\\prime+F_{yy}(y\\prime)^2}{F_y}$$ 得 $-6$，代入曲率公式结论相同。' }
    ]
  }),
  lectureFiveCompanion({
    id: 'zy1000-exercise-10', source: ZY1000_SOURCE, role: 'exercise', page: 'PDF 35 · 书页 29 · 第 10 题',
    fingerprint: 'tangent-circle:taylor-coefficients-at-zero-first-second-derivatives',
    title: '1000 题第 10 题 · 由相切圆确定 Taylor 系数',
    statement: '曲线 $y=f(x)$ 与圆 $$(x-1)^2+y^2=2$$ 在点 $(0,1)$ 相切，且当 $x\\to0$ 时 $$f(x)=a+bx+cx^2+o(x^2).$$ 求 $a,b,c$。',
    tags: ['Taylor 公式', '相切曲线', '二阶导数'],
    coreMethod: '由相切点读出函数值，再对圆方程两次隐式求导，依次取得一阶、二阶 Taylor 系数。',
    mistakes: '$x^2$ 的系数是 $f^{(2)}(0)/2$，不是 $f^{(2)}(0)$；相切条件本身只确保同点同斜率。',
    answerText: '$$a=1,\\qquad b=1,\\qquad c=-1.$$ ',
    solutionMethods: [
      { title: '方法一 · 圆方程隐式求导', content: '相切点给出 $f(0)=1$。由 $2(x-1)+2yy\\prime=0$ 得 $f\\prime(0)=1$；再次求导得 $2+2(y\\prime)^2+2yy^{(2)}=0$，故 $f^{(2)}(0)=-2$。Taylor 公式给出 $a=1,b=1,c=-1$。' },
      { title: '方法二 · 显式支路展开', content: '点 $(0,1)$ 附近取圆的上支 $$y=\\sqrt{2-(x-1)^2}=\\sqrt{1+2x-x^2}.$$ 对根式作二阶展开得 $y=1+x-x^2+o(x^2)$，直接读出三个系数。' }
    ]
  }),
  lectureFiveCompanion({
    id: 'zy1000-exercise-19', source: ZY1000_SOURCE, role: 'exercise', page: 'PDF 38 · 书页 32 · 第 19 题',
    fingerprint: 'maximum-limit:n-times-x-times-one-minus-x-power-n-unit-interval',
    title: '1000 题第 19 题 · 含参数函数最大值的极限',
    statement: '设 $$M_n=\\max_{0\\le x\\le1}\\left[nx(1-x)^n\\right].$$ 求 $\\lim_{n\\to\\infty}M_n$。',
    tags: ['最值', '数列极限', '参数函数'],
    coreMethod: '对固定 $n$ 先在闭区间内求最大值点，再把最大值写成标准的 $e$ 型极限。',
    mistakes: '不能先固定 $x$ 再令 $n\\to\\infty$；最大值点本身随 $n$ 变化。',
    answerText: '$$\\lim_{n\\to\\infty}M_n=\\frac1e.$$ ',
    solutionMethods: [
      { title: '方法一 · 先求最大值再取极限', content: '令 $f_n(x)=nx(1-x)^n$，则 $$f_n\\prime(x)=n(1-x)^{n-1}[1-(n+1)x].$$ 最大值在 $x=1/(n+1)$ 取得，故 $$M_n=\\left(\\frac{n}{n+1}\\right)^{n+1}\\to e^{-1}.$$' },
      { title: '方法二 · 对数极限', content: '由同一最大点得到 $\\ln M_n=(n+1)\\ln[n/(n+1)]=-(n+1)\\ln(1+1/n)$。右端趋于 $-1$，指数化即得 $M_n\\to1/e$。' }
    ]
  }),
  lectureFiveCompanion({
    id: 'zy1000-exercise-24', source: ZY1000_SOURCE, role: 'exercise', page: 'PDF 40 · 书页 34 · 第 24 题',
    fingerprint: 'osculating-circle:parabola-x-square-equals-y-plus-one-at-vertex',
    title: '1000 题第 24 题 · 抛物线顶点处的曲率圆',
    statement: '求曲线 $$x^2=y+1$$ 在点 $(0,-1)$ 处的曲率圆方程。',
    tags: ['曲率圆', '抛物线', '曲率'],
    coreMethod: '由显式函数求出顶点曲率及曲率半径，再沿凹侧法线确定圆心。',
    mistakes: '曲率半径只有大小，圆心方向还要根据曲线开口方向判断；本题圆心在顶点上方。',
    answerText: '$$x^2+\\left(y+\\frac12\\right)^2=\\frac14.$$ ',
    solutionMethods: [
      { title: '方法一 · 曲率与法向量', content: '写成 $y=x^2-1$，在 $x=0$ 有 $y\\prime=0$、$y^{(2)}=2$，故曲率 $k=2$、半径 $R=1/2$。曲线开口向上，曲率圆心位于顶点正上方，即 $(0,-1/2)$，方程如答案。' },
      { title: '方法二 · 二阶接触展开', content: '设圆心为 $(0,c)$、半径为 $r$。圆的下支在零点附近展开为 $y=c-r+x^2/(2r)+o(x^2)$。与 $y=-1+x^2$ 比较得 $c-r=-1$、$1/(2r)=1$，所以 $r=1/2,c=-1/2$。' }
    ]
  })
]
