import type { SeedInput } from './types'

const ZY30_SOURCE = '何耀焜个人整理 · 张宇《基础30讲》高数 · 第5讲逐页核验'

type LectureFiveSeed = Omit<SeedInput, 'id' | 'kind' | 'tags' | 'methodFingerprint'> & {
  id: string
  role: 'example' | 'exercise'
  tags: string[]
  fingerprint: string
}

function lectureFive(input: LectureFiveSeed): SeedInput {
  const roleLabel = input.role === 'example' ? '经典例题' : '课后习题'
  return {
    ...input,
    id: `zy30-verified-l05-${input.id}`,
    kind: 'problem',
    source: ZY30_SOURCE,
    tags: ['高等数学', '第5讲', roleLabel, 'PDF逐页核验', ...input.tags],
    methodFingerprint: `zy30-verified:l05:${input.fingerprint}`
  }
}

export const foundation30Lecture5ExpansionSeeds: SeedInput[] = [
  lectureFive({
    id: 'example-5-1', role: 'example', page: 'PDF 148-149 · 书页 143-144 · 例 5.1',
    fingerprint: 'monotone-square:product-f-fprime-positive-compare-absolute-values',
    title: '例 5.1 · 由 $f(x)f\\prime(x)>0$ 比较绝对值',
    statement: '设函数 $f(x)$ 可导，且对任意 $x$ 都有 $f(x)f\\prime(x)>0$。下列结论正确的是（　）。',
    tags: ['单调性', '复合函数', '选择题'],
    questionFormat: 'single-choice',
    options: ['$f(1)>f(-1)$', '$f(1)<f(-1)$', '$|f(1)|>|f(-1)|$', '$|f(1)|<|f(-1)|$'],
    correctOptionIds: ['C'],
    coreMethod: '把乘积识别为 $[f^2(x)]\\prime/2$，先确定平方函数值严格增加，再开算术平方根比较绝对值。',
    mistakes: '由 $f f\\prime>0$ 不能确定 $f$ 本身始终递增；开平方后比较的是绝对值，不是原函数值。',
    answerText: '正确选项为 C，即 $|f(1)|>|f(-1)|$。',
    solutionMethods: [
      { title: '方法一 · 构造平方函数', content: '令 $F(x)=f^2(x)$，则 $F\\prime(x)=2f(x)f\\prime(x)>0$，故 $F$ 严格增加。于是 $f^2(1)>f^2(-1)$，两边取算术平方根得到 $|f(1)|>|f(-1)|$。' },
      { title: '方法二 · 定积分比较', content: '由微积分基本定理，$$f^2(1)-f^2(-1)=2\\int_{-1}^{1}f(x)f\\prime(x)\\,dx>0.$$ 因此两个平方的大小已经确定，结论仍为选项 C。' }
    ]
  }),
  lectureFive({
    id: 'example-5-2', role: 'example', page: 'PDF 149 · 书页 144 · 例 5.2',
    fingerprint: 'twice-differentiable-local-maximum:second-derivative-nonpositive',
    title: '例 5.2 · 二阶可导极大值点的必要条件',
    statement: '设函数 $f(x)$ 二阶可导，且在 $x=x_0$ 处取得极大值，则必有（　）。',
    tags: ['极值', '二阶导数', '选择题'],
    questionFormat: 'single-choice',
    options: ['$f^{(2)}(x_0)<0$', '$f^{(2)}(x_0)\\le0$', '$f\\prime(x_0)>0$', '$f^{(2)}(x_0)>0$'],
    correctOptionIds: ['B'],
    coreMethod: '先用 Fermat 条件得到 $f\\prime(x_0)=0$，再由二阶差商在极大值点不可能为正推出 $f^{(2)}(x_0)\\le0$。',
    mistakes: '把充分条件 $f^{(2)}(x_0)<0$ 误当成必要条件；例如 $-x^4$ 在零点取极大值而二阶导数为零。',
    answerText: '正确选项为 B：$f^{(2)}(x_0)\\le0$。',
    solutionMethods: [
      { title: '方法一 · 二阶差商', content: '极大值点内点且函数可导，所以 $f\\prime(x_0)=0$。在 $x_0$ 附近有 $f(x)-f(x_0)\\le0$，故对 $h\\ne0$，$$\\frac{2[f(x_0+h)-f(x_0)-f\\prime(x_0)h]}{h^2}\\le0.$$ 令 $h\\to0$ 得 $f^{(2)}(x_0)\\le0$。' },
      { title: '方法二 · 排除严格负号', content: '$f^{(2)}(x_0)>0$ 会由二阶充分条件推出极小值，与题设矛盾，所以只能非正。又取 $f(x)=-x^4$，它在 $0$ 处取得极大值但 $f^{(2)}(0)=0$，说明不能加强为严格小于零。' }
    ]
  }),
  lectureFive({
    id: 'example-5-4', role: 'example', page: 'PDF 149-150 · 书页 144-145 · 例 5.4',
    fingerprint: 'high-derivative-extremum:x-times-exponential-nth-derivative',
    title: '例 5.4 · $xe^x$ 的 $n$ 阶导函数极值',
    statement: '设 $f(x)=xe^x$，求函数 $f^{(n)}(x)$ 的极值点和极值。',
    tags: ['高阶导数', '极值', '指数函数'],
    coreMethod: '先用莱布尼茨公式得到 $f^{(n)}(x)=(x+n)e^x$，再把 $f^{(n+1)}$ 作为目标函数的一阶导数。',
    mistakes: '驻点应由 $f^{(n+1)}(x)=0$ 求出；把 $x=-n$ 误当成驻点只是在求 $f^{(n)}$ 的零点。',
    answerText: '$f^{(n)}(x)$ 在 $x=-(n+1)$ 处取得极小值，极小值为 $-e^{-(n+1)}$。',
    solutionMethods: [
      { title: '方法一 · 高阶导数通式', content: '由莱布尼茨公式，$$f^{(n)}(x)=(x+n)e^x.$$ 对它求导得 $f^{(n+1)}(x)=(x+n+1)e^x$，唯一驻点为 $x=-(n+1)$。再有 $f^{(n+2)}[-(n+1)]=e^{-(n+1)}>0$，故为极小值点，代入得极小值 $-e^{-(n+1)}$。' },
      { title: '方法二 · 单调区间', content: '因 $e^x>0$，$f^{(n+1)}$ 的符号只由 $x+n+1$ 决定：驻点左侧为负、右侧为正。因此 $f^{(n)}$ 先减后增，直接锁定唯一极小值点及其函数值。' }
    ]
  }),
  lectureFive({
    id: 'example-5-5', role: 'example', page: 'PDF 153-154 · 书页 148-149 · 例 5.5',
    fingerprint: 'differential-equation-local-shape:f-second-plus-f-prime-square-sine',
    title: '例 5.5 · 微分关系锁定零点处的拐点',
    statement: '设函数 $f(x)$ 满足 $f^{(2)}(x)+[f\\prime(x)]^2=\\sin x$，且 $f\\prime(0)=0$，则（　）。',
    tags: ['拐点', '高阶导数', '选择题'],
    questionFormat: 'single-choice',
    options: ['$f(0)$ 是 $f(x)$ 的极大值', '$f(0)$ 是 $f(x)$ 的极小值', '点 $(0,f(0))$ 是曲线 $y=f(x)$ 的拐点', '$f(0)$ 不是极值且 $(0,f(0))$ 也不是拐点'],
    correctOptionIds: ['C'],
    coreMethod: '只需在零点连续追踪二阶、三阶导数：原式给出 $f^{(2)}(0)=0$，求导后得到首个非零高阶导数 $f^{(3)}(0)=1$。',
    mistakes: '看到 $f^{(2)}(0)=0$ 就立即判拐点；必须继续确认首个非零阶为奇数，或直接证明二阶导数变号。',
    answerText: '正确选项为 C：点 $(0,f(0))$ 是曲线的拐点。',
    solutionMethods: [
      { title: '方法一 · 首个非零高阶导数', content: '令 $x=0$，由原式与 $f\\prime(0)=0$ 得 $f^{(2)}(0)=0$。对原式求导，$$f^{(3)}(x)+2f\\prime(x)f^{(2)}(x)=\\cos x,$$ 代入零点得 $f^{(3)}(0)=1>0$。首个非零阶为三阶，故曲线在零点两侧凹凸性改变。' },
      { title: '方法二 · 局部展开', content: '由 $f\\prime(0)=f^{(2)}(0)=0$、$f^{(3)}(0)=1$，有 $$f(x)=f(0)+\\frac{x^3}{6}+o(x^3).$$ 增量在零点两侧异号，不构成极值；同时 $f^{(2)}(x)=x+o(x)$ 在两侧变号，所以该点为拐点。' }
    ]
  }),
  lectureFive({
    id: 'example-5-8', role: 'example', page: 'PDF 155-156 · 书页 150-151 · 例 5.8',
    fingerprint: 'polynomial-inflection-count:double-root-times-cubic-root',
    title: '例 5.8 · 重根结构确定拐点总数',
    statement: '曲线 $f(x)=(x-1)^2(x-3)^3$ 的拐点个数为（　）。',
    tags: ['拐点', '多项式', '选择题'],
    questionFormat: 'single-choice',
    options: ['$0$', '$1$', '$2$', '$3$'],
    correctOptionIds: ['D'],
    coreMethod: '完整因式分解二阶导数，检查每个实零点是否为奇重根；只有二阶导数变号的位置才是拐点。',
    mistakes: '只把原函数的重根当作拐点；拐点判断应研究 $f^{(2)}$，且还要核对候选点两侧符号。',
    answerText: '正确选项为 D，共有 $3$ 个拐点。',
    solutionMethods: [
      { title: '方法一 · 二阶导数因式分解', content: '先得 $f\\prime(x)=(x-1)(x-3)^2(5x-9)$，继续求导可化为 $$f^{(2)}(x)=4(x-3)(5x^2-18x+15).$$ 三个互异实根为 $3$ 与 $(9\\pm\\sqrt6)/5$，它们都是一重根，因此 $f^{(2)}$ 在每一点两侧都变号，共有三个拐点。' },
      { title: '方法二 · 符号表复核', content: '二次因子判别式为 $24>0$，且它的两个根都小于 $3$。按三个简单根从小到大排列，首项为正的三次式符号依次交替，故凹凸性发生三次改变，拐点总数为三。' }
    ]
  }),
  lectureFive({
    id: 'example-5-9', role: 'example', page: 'PDF 158-159 · 书页 153-154 · 例 5.9',
    fingerprint: 'asymptotes:reciprocal-plus-log-one-plus-exponential-three-directions',
    title: '例 5.9 · 同一曲线的铅直、水平与斜渐近线',
    statement: '求曲线 $$y=\\frac1x+\\ln(1+e^x)$$ 的全部渐近线。',
    tags: ['渐近线', '极限', '综合题'],
    coreMethod: '按有限间断点、$x\\to-\\infty$、$x\\to+\\infty$ 三个方向分别检查铅直、水平和斜渐近线。',
    mistakes: '渐近线可只在一个方向成立；不要因为负无穷方向存在水平线，就漏掉正无穷方向的斜渐近线。',
    answerText: '铅直渐近线为 $x=0$；当 $x\\to-\\infty$ 时水平渐近线为 $y=0$；当 $x\\to+\\infty$ 时斜渐近线为 $y=x$。',
    solutionMethods: [
      { title: '方法一 · 三方向极限', content: '当 $x\\to0$ 时 $1/x$ 发散而对数项有限，故 $x=0$ 为铅直渐近线。当 $x\\to-\\infty$ 时两项都趋零，得 $y=0$。当 $x\\to+\\infty$ 时 $$y-x=\\frac1x+\\ln(1+e^{-x})\\to0,$$ 所以斜渐近线为 $y=x$。' },
      { title: '方法二 · 主部拆分', content: '利用 $\\ln(1+e^x)=x+\\ln(1+e^{-x})$ 处理正无穷方向；利用 $\\ln(1+u)\\sim u$ 处理负无穷方向。再单独考察定义域断点 $x=0$，三类渐近线互不遗漏。' }
    ]
  }),
  lectureFive({
    id: 'example-5-10', role: 'example', page: 'PDF 160-161 · 书页 155-156 · 例 5.10',
    fingerprint: 'sequence-maximum:nth-root-n-continuous-extension',
    title: '例 5.10 · 数列 $\\sqrt[n]{n}$ 的最大项',
    statement: '求数列 $\\{\\sqrt[n]{n}\\}$ 的最大项。',
    tags: ['数列', '最值', '连续化'],
    coreMethod: '把离散项嵌入连续函数 $x^{1/x}$，先定位连续极大点 $e$，再比较相邻整数 $2$ 和 $3$。',
    mistakes: '$e$ 不是整数，不能直接把 $e^{1/e}$ 当作数列项；必须回到 $n=2,3$ 作离散比较。',
    answerText: '最大项为第 $3$ 项 $\\sqrt[3]{3}$。',
    solutionMethods: [
      { title: '方法一 · 连续函数单调性', content: '令 $g(x)=x^{1/x}$，$x>0$。有 $$g\\prime(x)=x^{1/x}\\frac{1-\\ln x}{x^2},$$ 故 $g$ 在 $(0,e)$ 递增、在 $(e,+\\infty)$ 递减。整数候选只剩 $2,3$；因 $(\\sqrt2)^6=8<9=(\\sqrt[3]3)^6$，最大项为 $\\sqrt[3]3$。' },
      { title: '方法二 · 对数序列', content: '比较 $a_n=n^{1/n}$ 等价于比较 $b_n=\\ln n/n$。连续函数 $\\ln x/x$ 在 $e$ 前增、$e$ 后减，所以 $n\\ge3$ 时序列递减；再验证 $a_3>a_2>a_1$，结论相同。' }
    ]
  }),
  lectureFive({
    id: 'example-5-11', role: 'example', page: 'PDF 161-162 · 书页 156-157 · 例 5.11',
    fingerprint: 'curve-sketch:implicit-y-square-one-minus-x-square-cubed',
    title: '例 5.11 · 隐式曲线 $y^2=(1-x^2)^3$ 作图',
    statement: '画出曲线 $$y^2=(1-x^2)^3$$ 的图像，并标出截距、单调区间与拐点。',
    tags: ['函数图像', '隐式曲线', '拐点'],
    coreMethod: '先由定义域和对称性缩小范围，再写成上下两支 $y=\\pm(1-x^2)^{3/2}$ 作导数表。',
    mistakes: '右端必须非负，所以 $|x|\\le1$；上下两支都要保留，拐点也应按对称性成组出现。',
    answerText: '图像关于两坐标轴对称，经过 $(\\pm1,0)$、$(0,\\pm1)$；四个拐点为 $\\left(\\pm\\frac1{\\sqrt2},\\pm\\frac1{2\\sqrt2}\\right)$，上下符号可独立组合。',
    solutionMethods: [
      { title: '方法一 · 分支导数表', content: '定义域为 $[-1,1]$。上支 $y=(1-x^2)^{3/2}$ 满足 $$y\\prime=-3x\\sqrt{1-x^2},\\qquad y^{(2)}=\\frac{3(2x^2-1)}{\\sqrt{1-x^2}}.$$ 因而上支在 $x=\\pm1/\\sqrt2$ 变凹凸；下支关于 $x$ 轴对称。结合横、纵轴对称即可画出闭合图形。' },
      { title: '方法二 · 参数化', content: '令 $x=\\sin t$、$y=\\cos^3t$，$0\\le t\\le2\\pi$，可一次描出整条曲线。对参数曲线求 $dy/dx$ 与二阶导数，得到同样的水平切线、单调方向和四个拐点。' }
    ]
  }),
  lectureFive({
    id: 'example-5-12', role: 'example', page: 'PDF 162-163 · 书页 157-158 · 例 5.12',
    fingerprint: 'curve-sketch:x-power-x-positive-domain',
    title: '例 5.12 · 幂指函数 $y=x^x$ 作图',
    statement: '画出函数 $y=x^x$（$x>0$）的图像，并说明端点极限、单调性、极值和凹凸性。',
    tags: ['函数图像', '幂指函数', '极值'],
    coreMethod: '指数化为 $e^{x\\ln x}$，用 $x\\ln x$ 控制端点与极值，再计算二阶导数排除拐点。',
    mistakes: '$x\\to0^+$ 时 $x^x\\to1$，但 $x=0$ 不在定义域；图上应画空心端点。',
    answerText: '$x\\to0^+$ 时 $y\\to1$；函数在 $(0,1/e)$ 递减、在 $(1/e,+\\infty)$ 递增，在 $x=1/e$ 处取极小值 $e^{-1/e}$，且全域严格凸。',
    solutionMethods: [
      { title: '方法一 · 对数求导', content: '写成 $y=e^{x\\ln x}$。有 $y\\prime=x^x(1+\\ln x)$，故唯一驻点为 $1/e$ 且先减后增。又 $$y^{(2)}=x^x\\left[(1+\\ln x)^2+\\frac1x\\right]>0,$$ 所以全域严格凸、无拐点；$x\\ln x\\to0$ 给出左端极限 $1$。' },
      { title: '方法二 · 先研究指数', content: '令 $g(x)=x\\ln x$，则 $g\\prime=1+\\ln x$、$g^{(2)}=1/x>0$，所以 $g$ 在 $1/e$ 处取得唯一最小值 $-1/e$。指数函数严格增加，故 $e^{g(x)}$ 具有相同的极值位置与单调区间。' }
    ]
  }),
  lectureFive({
    id: 'example-5-13', role: 'example', page: 'PDF 163 · 书页 158 · 例 5.13',
    fingerprint: 'curve-sketch:exponential-over-x-two-branches',
    title: '例 5.13 · $e^x/x$ 的双分支图像',
    statement: '画出函数 $$y=\\frac{e^x}{x}$$ 的图像，并求其极值、凹凸区间与渐近线。',
    tags: ['函数图像', '渐近线', '极值'],
    coreMethod: '定义域在零点分成两支；分别用一、二阶导数和三个方向的极限建立完整导数表。',
    mistakes: '$x=0$ 不在定义域，凹凸性在此改变不能把零点称为拐点。',
    answerText: '在 $(-\\infty,0)$ 与 $(0,1)$ 上递减，在 $(1,+\\infty)$ 上递增；$(1,e)$ 为极小点。负半轴凹，正半轴凸；渐近线为 $x=0$ 与负无穷方向的 $y=0$。',
    solutionMethods: [
      { title: '方法一 · 导数与极限表', content: '有 $$y\\prime=\\frac{e^x(x-1)}{x^2},\\qquad y^{(2)}=\\frac{e^x(x^2-2x+2)}{x^3}.$$ 二阶导数分子恒正，因此其符号由 $x$ 决定。再结合 $x\\to0^\\pm$、$x\\to-\\infty$ 和 $x\\to+\\infty$ 的极限，即得两支图像和渐近线。' },
      { title: '方法二 · 正支对数导数', content: '在正半轴，$\\ln y=x-\\ln x$，导数为 $1-1/x$，立刻得到 $x=1$ 的极小值。负半轴则直接观察 $e^x>0$、$x<0$ 与导数符号，再用 $e^x/x\\to0^-$ 完成图像。' }
    ]
  }),
  lectureFive({
    id: 'example-5-14', role: 'example', page: 'PDF 163-164 · 书页 158-159 · 例 5.14',
    fingerprint: 'polar-curve-sketch:r-equals-sine-squared-theta-upper-loop',
    title: '例 5.14 · 极坐标曲线 $r=\\sin^2\\theta$ 作图',
    statement: '画出极坐标曲线 $$r=\\sin^2\\theta\\qquad(0\\le\\theta\\le\\pi)$$ 的图像。',
    tags: ['极坐标', '函数图像', '参数曲线'],
    coreMethod: '利用关于 $\\theta=\\pi/2$ 的对称性和几个特殊角的半径值先描点，再追踪半径的增减。',
    mistakes: '半径始终非负且角度只覆盖 $[0,\\pi]$，图像位于上半平面，不应额外复制下半环。',
    answerText: '曲线从原点出发，经 $(0,1)$ 后回到原点，全部位于上半平面并关于 $y$ 轴对称，形成一个闭合上叶。',
    solutionMethods: [
      { title: '方法一 · 极坐标描点', content: '$r(0)=r(\\pi)=0$，$r(\\pi/2)=1$，且 $r(\\pi-\\theta)=r(\\theta)$。在 $[0,\\pi/2]$ 半径递增，在 $[\\pi/2,\\pi]$ 递减，连接特殊点即可得到关于 $y$ 轴对称的闭合上叶。' },
      { title: '方法二 · 直角坐标关系', content: '由 $\\sin\\theta=y/r$ 与 $r=\\sin^2\\theta$ 得 $r^3=y^2$，即 $$(x^2+y^2)^{3/2}=y^2,\\qquad y\\ge0.$$ 这个隐式方程直接给出上半平面与纵轴对称性，并确认原点和 $(0,1)$。' }
    ]
  }),
  lectureFive({
    id: 'example-5-15', role: 'example', page: 'PDF 164-165 · 书页 159-160 · 例 5.15',
    fingerprint: 'parametric-curvature:astroid-cos-cubed-sine-cubed-pi-four',
    title: '例 5.15 · 星形线在 $\\pi/4$ 处的曲率',
    statement: '曲线由 $$x=\\cos^3t,\\qquad y=\\sin^3t$$ 给出，求 $t=\\pi/4$ 对应点处的曲率。',
    tags: ['曲率', '参数方程', '星形线'],
    coreMethod: '用参数导数先求 $dy/dx$ 与 $d^2y/dx^2$，再代入曲率公式。',
    mistakes: '曲率分母是 $[1+(dy/dx)^2]^{3/2}$；二阶导数还需除以一次 $dx/dt$。',
    answerText: '$$k=\\frac23.$$ ',
    solutionMethods: [
      { title: '方法一 · 参数二阶导数', content: '有 $dy/dx=-\\tan t$，故 $$\\frac{d^2y}{dx^2}=\\frac{-\\sec^2t}{-3\\cos^2t\\sin t}=\\frac1{3\\cos^4t\\sin t}.$$ 在 $t=\\pi/4$ 处，$|y\\prime|=1$、$|y^{(2)}|=4\\sqrt2/3$，代入 $k=|y^{(2)}|/[1+(y\\prime)^2]^{3/2}$ 得 $2/3$。' },
      { title: '方法二 · 参数曲率公式', content: '直接用 $$k=\\frac{|x\\prime y^{(2)}-y\\prime x^{(2)}|}{[(x\\prime)^2+(y\\prime)^2]^{3/2}}.$$ 代入 $x=\\cos^3t$、$y=\\sin^3t$ 的一、二阶参数导数并令 $t=\\pi/4$，化简仍为 $2/3$。' }
    ]
  }),
  lectureFive({
    id: 'exercise-5-1', role: 'exercise', page: 'PDF 165-166 · 书页 160-161 · 习题 5.1',
    fingerprint: 'composite-extremum:sufficient-condition-outer-derivative-positive',
    title: '习题 5.1 · 复合函数在内层极大点取极大值',
    statement: '设 $f(x),g(x)$ 具有二阶导数，$g^{(2)}(x_0)<0$，且 $g(x_0)=a$ 是 $g(x)$ 的极值。若要保证 $f[g(x)]$ 在 $x_0$ 取得极大值，一个充分条件是（　）。',
    tags: ['复合函数', '极值', '选择题'],
    questionFormat: 'single-choice',
    options: ['$f\\prime(a)<0$', '$f\\prime(a)>0$', '$f^{(2)}(a)<0$', '$f^{(2)}(a)>0$'],
    correctOptionIds: ['B'],
    coreMethod: '内层在 $x_0$ 处满足 $g\\prime(x_0)=0$，复合函数二阶导数在该点只剩 $f\\prime(a)g^{(2)}(x_0)$。',
    mistakes: '外层的二阶导数项含 $[g\\prime(x_0)]^2$，在驻点处为零；真正决定符号的是 $f\\prime(a)$。',
    answerText: '正确选项为 B：$f\\prime(a)>0$。',
    solutionMethods: [
      { title: '方法一 · 二阶导数判别', content: '令 $h(x)=f[g(x)]$。有 $h\\prime(x_0)=f\\prime(a)g\\prime(x_0)=0$，且 $$h^{(2)}(x_0)=f^{(2)}(a)[g\\prime(x_0)]^2+f\\prime(a)g^{(2)}(x_0)=f\\prime(a)g^{(2)}(x_0).$$ 当 $f\\prime(a)>0$ 时该值小于零，故为极大值。' },
      { title: '方法二 · 局部单调映射', content: '$g^{(2)}(x_0)<0$ 说明 $g$ 在 $x_0$ 取严格极大值，邻近点满足 $g(x)<a$。若 $f\\prime(a)>0$，则 $f$ 在 $a$ 附近严格增加，从而 $f[g(x)]<f(a)$，同样得到复合函数的极大值。' }
    ]
  }),
  lectureFive({
    id: 'exercise-5-2', role: 'exercise', page: 'PDF 165-167 · 书页 160-162 · 习题 5.2',
    fingerprint: 'endpoint-extrema:one-sided-derivative-signs-min-a-max-b',
    title: '习题 5.2 · 闭区间端点极值的一侧导数',
    statement: '设 $f(x)$ 在 $[a,b]$ 上可导，且在 $x=a$ 处取最小值、在 $x=b$ 处取最大值，则（　）。',
    tags: ['端点导数', '最值', '选择题'],
    questionFormat: 'single-choice',
    options: ['$f\\prime_+(a)\\le0,\\ f\\prime_-(b)\\le0$', '$f\\prime_+(a)\\le0,\\ f\\prime_-(b)\\ge0$', '$f\\prime_+(a)\\ge0,\\ f\\prime_-(b)\\le0$', '$f\\prime_+(a)\\ge0,\\ f\\prime_-(b)\\ge0$'],
    correctOptionIds: ['D'],
    coreMethod: '端点只能从区间内部趋近；直接在一侧差商中同时检查分子与分母符号。',
    mistakes: '机械套用内点 Fermat 条件写成导数为零；端点最值一般只给出一侧导数的不等号。',
    answerText: '正确选项为 D：$f\\prime_+(a)\\ge0$ 且 $f\\prime_-(b)\\ge0$。',
    solutionMethods: [
      { title: '方法一 · 一侧差商', content: '对 $x>a$，有 $f(x)-f(a)\\ge0$ 且 $x-a>0$，故右导数 $f\\prime_+(a)\\ge0$。对 $x<b$，有 $f(x)-f(b)\\le0$ 且 $x-b<0$，商仍非负，所以 $f\\prime_-(b)\\ge0$。' },
      { title: '方法二 · 端点增量方向', content: '从左端点进入区间时函数不能立刻下降，因此初始右斜率非负；从区间内部接近右端最大值时函数不能在末段下降，因此左导数也非负。这个方向判断与差商计算一致。' }
    ]
  }),
  lectureFive({
    id: 'exercise-5-3', role: 'exercise', page: 'PDF 165-167 · 书页 160-162 · 习题 5.3',
    fingerprint: 'rational-asymptotes:cancel-minus-one-hole-plus-one-vertical-horizontal',
    title: '习题 5.3 · 有理函数的两条渐近线',
    statement: '求曲线 $$y=\\frac{x^2+x}{x^2-1}$$ 的渐近线条数及方程。',
    tags: ['渐近线', '有理函数', '极限'],
    coreMethod: '先约分识别可去点与真正极点，再比较分子分母最高次数确定无穷远方向。',
    mistakes: '$x=-1$ 约分后是可去间断点，不是铅直渐近线；只有 $x=1$ 使约分后的分母仍趋零。',
    answerText: '共有两条渐近线：$x=1$ 和 $y=1$。',
    solutionMethods: [
      { title: '方法一 · 约分与极限', content: '当 $x\\ne\\pm1$ 时，$$y=\\frac{x(x+1)}{(x-1)(x+1)}=\\frac{x}{x-1}.$$ 因而 $x\\to1$ 时函数发散，得到铅直线 $x=1$；$x\\to\\pm\\infty$ 时函数趋于 $1$，得到水平线 $y=1$。$x=-1$ 只是空点。' },
      { title: '方法二 · 多项式除法', content: '原式可写为 $1+(x+1)/(x^2-1)$。无穷远余项趋零，所以水平渐近线为 $y=1$。再检查分母零点，只有未被分子约掉的 $x=1$ 产生发散。' }
    ]
  }),
  lectureFive({
    id: 'exercise-5-5', role: 'exercise', page: 'PDF 165-167 · 书页 160-162 · 习题 5.5',
    fingerprint: 'fractional-power-inflection:x-minus-five-times-x-two-thirds',
    title: '习题 5.5 · 分数幂函数的非光滑拐点筛选',
    statement: '求曲线 $$y=(x-5)x^{2/3}$$ 的拐点坐标。',
    tags: ['拐点', '分数幂', '不可导点'],
    coreMethod: '在 $x\\ne0$ 处分解二阶导数并做符号表，同时把二阶导数不存在的 $x=0$ 单独检查。',
    mistakes: '把所有不可导点都当作拐点；$x=0$ 两侧二阶导数同号，凹凸性没有改变。',
    answerText: '唯一拐点为 $(-1,-6)$。',
    solutionMethods: [
      { title: '方法一 · 二阶导数符号', content: '写成 $y=x^{5/3}-5x^{2/3}$。对 $x\\ne0$，$$y^{(2)}=\\frac{10(x+1)}{9x^{4/3}}.$$ 分母恒正，因此只在 $x=-1$ 两侧变号；代入原函数得 $y(-1)=-6$。在 $x=0$ 两侧二阶导数都为正，不是拐点。' },
      { title: '方法二 · 凹凸区间', content: '由二阶导数符号，曲线在 $(-\\infty,-1)$ 上为一类凹凸，在 $(-1,0)$ 与 $(0,+\\infty)$ 上为另一类。只有 $x=-1$ 穿过时凹凸改变，所以拐点只有 $(-1,-6)$。' }
    ]
  }),
  lectureFive({
    id: 'exercise-5-7', role: 'exercise', page: 'PDF 165-168 · 书页 160-163 · 习题 5.7',
    fingerprint: 'slant-asymptote:two-x-minus-one-times-exp-one-over-x',
    title: '习题 5.7 · 指数微扰函数的斜渐近线',
    statement: '求曲线 $$y=(2x-1)e^{1/x}$$ 在 $x\\to\\infty$ 方向的斜渐近线。',
    tags: ['渐近线', '指数极限', '无穷远'],
    coreMethod: '分别计算斜率 $a=\\lim y/x$ 与截距 $b=\\lim(y-ax)$，截距中使用 $(e^u-1)/u\\to1$。',
    mistakes: '只求出斜率 $2$ 就停止；$e^{1/x}$ 的一阶微扰会对截距贡献常数。',
    answerText: '$$y=2x+1.$$ ',
    solutionMethods: [
      { title: '方法一 · 斜率截距极限', content: '有 $a=\\lim(2-1/x)e^{1/x}=2$。再算 $$b=\\lim[(2x-1)e^{1/x}-2x]=2\\lim x(e^{1/x}-1)-\\lim e^{1/x}=2-1=1.$$ 故渐近线为 $y=2x+1$。' },
      { title: '方法二 · 一阶展开', content: '$e^{1/x}=1+1/x+O(x^{-2})$，所以 $$(2x-1)e^{1/x}=2x+1+O(x^{-1}).$$ 与直线 $2x+1$ 的差趋零，结论相同。' }
    ]
  }),
  lectureFive({
    id: 'exercise-5-8', role: 'exercise', page: 'PDF 166-168 · 书页 161-163 · 习题 5.8',
    fingerprint: 'curvature-point:parabola-x-square-plus-x-negative-branch-given-curvature',
    title: '习题 5.8 · 由曲率反求抛物线上的点',
    statement: '在曲线 $y=x^2+x$ 的 $x<0$ 部分，求曲率等于 $\\sqrt2/2$ 的点。',
    tags: ['曲率', '抛物线', '反求坐标'],
    coreMethod: '把 $y\\prime=2x+1$、$y^{(2)}=2$ 代入曲率公式，先解斜率平方，再用 $x<0$ 筛根。',
    mistakes: '曲率方程只确定 $(2x+1)^2$，会产生两个代数根；必须使用题设 $x<0$。',
    answerText: '所求点为 $(-1,0)$。',
    solutionMethods: [
      { title: '方法一 · 曲率公式', content: '曲率为 $$k=\\frac2{[1+(2x+1)^2]^{3/2}}.$$ 令其等于 $\\sqrt2/2$，得 $[1+(2x+1)^2]^{3/2}=2\\sqrt2$，从而 $(2x+1)^2=1$。解得 $x=0$ 或 $x=-1$，结合 $x<0$ 取 $x=-1$，此时 $y=0$。' },
      { title: '方法二 · 切线斜率筛选', content: '目标曲率要求 $1+(y\\prime)^2=2$，故切线斜率为 $\\pm1$。抛物线左侧符合 $x<0$ 的对应点为 $2x+1=-1$，即 $x=-1$；代回得到 $(-1,0)$。' }
    ]
  }),
  lectureFive({
    id: 'exercise-5-9', role: 'exercise', page: 'PDF 166-168 · 书页 161-163 · 习题 5.9',
    fingerprint: 'implicit-stationary-point:two-y-cubed-minus-two-y-squared-plus-two-xy-minus-x-squared',
    title: '习题 5.9 · 隐函数驻点与极值判定',
    statement: '函数 $y=y(x)$ 由 $$2y^3-2y^2+2xy-x^2=1$$ 确定。求其驻点，并判断该点是否为极值点。',
    tags: ['隐函数', '驻点', '极值'],
    coreMethod: '隐式求导后令 $y\\prime=0$，先由导数方程得到 $y=x$，再回代原方程确定驻点。',
    mistakes: '只解 $y\\prime=0$ 而不回代原方程；判断极值还需要继续求二阶导数。',
    answerText: '唯一驻点为 $(1,1)$，且 $x=1$ 是 $y(x)$ 的极小值点。',
    solutionMethods: [
      { title: '方法一 · 两次隐式求导', content: '一阶求导得 $$3y^2y\\prime-2yy\\prime+xy\\prime+y-x=0.$$ 令 $y\\prime=0$ 得 $y=x$，回代原方程得 $2x^3-x^2=1$，唯一驻点为 $x=1,y=1$。再求导并代入 $(1,1,0)$，得到 $y^{(2)}(1)=1/2>0$，故为极小值。' },
      { title: '方法二 · 隐函数偏导', content: '令 $F=2y^3-2y^2+2xy-x^2-1$。驻点满足 $F=0$ 与 $F_x=2y-2x=0$，联立得 $(1,1)$。在该点 $F_y=4\\ne0$，且 $y^{(2)}=-F_{xx}/F_y=2/4=1/2>0$，所以是极小值点。' }
    ]
  })
]
