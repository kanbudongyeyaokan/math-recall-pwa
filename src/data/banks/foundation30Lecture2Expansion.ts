import type { SeedInput } from './types'

const SOURCE = '何耀焜私人整理 · 张宇《基础30讲》高数 · 第2讲逐页核验扩充'

type LectureTwoSeed = Omit<SeedInput, 'id' | 'kind' | 'source' | 'tags' | 'methodFingerprint'> & {
  number: string
  role: 'example' | 'exercise'
  page: string
  tags: string[]
  fingerprint: string
}

function lectureTwo(input: LectureTwoSeed): SeedInput {
  const roleLabel = input.role === 'example' ? '经典例题' : '课后习题'
  return {
    ...input,
    id: 'zy30-verified-l02-' + input.role + '-' + input.number.replace('.', '-'),
    kind: 'problem',
    source: SOURCE,
    tags: ['高等数学', '第2讲', roleLabel, 'PDF逐页核验', ...input.tags],
    methodFingerprint: 'zy30-verified:l02:' + input.fingerprint
  }
}

export const foundation30Lecture2ExpansionSeeds: SeedInput[] = [
  lectureTwo({
    role: 'example',
    number: '2.1',
    page: 'PDF 84 · 书页 79',
    fingerprint: 'recurrence:amgm-uniform-bound',
    title: '例 2.1 · 根式递推数列的有界性',
    statement: '设 $0<x_1<3$，且\n\n$$x_{n+1}=\\sqrt{x_n(3-x_n)},\\qquad n=1,2,\\ldots$$\n\n证明数列 $\\{x_n\\}$ 有界。',
    tags: ['数列极限', '递推数列', '有界性', '均值不等式', '证明题'],
    coreMethod: '先由初值保证根号内两因子为正，再用 $\\sqrt{ab}\\le(a+b)/2$ 建立与 $n$ 无关的统一上界，并以数学归纳法闭合。',
    mistakes: '只验证 $x_2\\le3/2$，却没有说明这个范围会被递推保持；或使用均值不等式前遗漏 $x_n>0$ 与 $3-x_n>0$。',
    answerText: '对所有 $n>1$，均有 $0<x_n\\le3/2$，再结合有限的首项 $x_1$，故数列有界。',
    solutionMethods: [
      {
        title: '方法一 · 均值不等式与归纳',
        content: '由 $0<x_1<3$，有\n\n$$0<x_2=\\sqrt{x_1(3-x_1)}\\le\\frac{x_1+3-x_1}{2}=\\frac32.$$\n\n若 $0<x_k\\le3/2$，则 $3-x_k>0$，并且\n\n$$0<x_{k+1}=\\sqrt{x_k(3-x_k)}\\le\\frac{x_k+3-x_k}{2}=\\frac32.$$\n\n由归纳法，$n>1$ 时恒有 $0<x_n\\le3/2$。'
      },
      {
        title: '方法二 · 二次函数值域复核',
        content: '令 $g(x)=x(3-x)=9/4-(x-3/2)^2$。在 $0<x<3$ 上有 $0<g(x)\\le9/4$，故一次递推后 $0<x_2\\le3/2$。区间 $(0,3/2]$ 又被映射回 $(0,3/2]$，因此后续各项统一落在该有界区间内。'
      }
    ]
  }),
  lectureTwo({
    role: 'example',
    number: '2.2',
    page: 'PDF 85 · 书页 80',
    fingerprint: 'limit:absolute-value:reverse-triangle',
    title: '例 2.2 · 由数列收敛推出绝对值收敛',
    statement: '证明：若\n\n$$\\lim_{n\\to\\infty}a_n=A,$$\n\n则\n\n$$\\lim_{n\\to\\infty}|a_n|=|A|.$$',
    tags: ['数列极限', '绝对值', '反三角不等式', '证明题'],
    coreMethod: '把目标差 $\\bigl||a_n|-|A|\\bigr|$ 与已知差 $|a_n-A|$ 联系起来，使用反三角不等式。',
    mistakes: '误把逆命题也当成真；例如 $a_n=(-1)^n$ 满足 $|a_n|\\to1$，但 $a_n$ 本身不收敛。',
    answerText: '由 $\\bigl||a_n|-|A|\\bigr|\\le|a_n-A|\\to0$，可得 $|a_n|\\to|A|$。',
    solutionMethods: [
      {
        title: '方法一 · 反三角不等式',
        content: '任取 $\\varepsilon>0$。由 $a_n\\to A$，存在正整数 $N$，使 $n>N$ 时 $|a_n-A|<\\varepsilon$。又\n\n$$\\bigl||a_n|-|A|\\bigr|\\le|a_n-A|<\\varepsilon,$$\n\n所以 $|a_n|\\to|A|$。'
      },
      {
        title: '方法二 · 连续映射复核',
        content: '绝对值函数在全实数域连续。收敛数列在连续函数下保持极限，因此\n\n$$\\lim_{n\\to\\infty}|a_n|=\\left|\\lim_{n\\to\\infty}a_n\\right|=|A|.$$\n\n这一路线更简洁，但其底层定量依据仍是反三角不等式。'
      }
    ]
  }),
  lectureTwo({
    role: 'example',
    number: '2.3',
    page: 'PDF 86 · 书页 81',
    fingerprint: 'divergence:unbounded-subsequence',
    title: '例 2.3 · 用发散子列证明原数列无极限',
    statement: '证明数列\n\n$$a_n=n^{(-1)^n}$$\n\n的极限不存在。',
    tags: ['数列极限', '子列', '发散判定', '证明题'],
    coreMethod: '从原数列中选取奇数项与偶数项子列；只要有一个子列发散，或两个子列极限不同，原数列就不可能收敛。',
    mistakes: '看到奇数项子列收敛于 $0$ 就误判原数列收敛；收敛要求所有子列都收敛到同一极限。',
    answerText: '偶数项子列 $a_{2k}=2k\\to+\\infty$，故原数列不可能收敛。',
    solutionMethods: [
      {
        title: '方法一 · 发散子列',
        content: '偶数项满足\n\n$$a_{2k}=(2k)^1=2k\\to+\\infty.$$\n\n若原数列收敛，则它的每个子列都应收敛到同一个有限极限；偶数项子列发散，与之矛盾，所以原数列极限不存在。'
      },
      {
        title: '方法二 · 奇偶子列对照',
        content: '奇数项为\n\n$$a_{2k-1}=(2k-1)^{-1}\\to0,$$\n\n偶数项却趋于 $+\\infty$。两条子列的行为完全不同，因而原数列既不收敛，也不趋于同一个无穷方向。'
      }
    ]
  }),
  lectureTwo({
    role: 'example',
    number: '2.4',
    page: 'PDF 86-87 · 书页 81-82',
    fingerprint: 'sequence-type:odd-even-zero-infinity',
    title: '例 2.4 · 奇偶项分裂的数列类型',
    statement: '设\n\n$$x_n=\\begin{cases}\\dfrac{n^2+\\sqrt n}{n},&n\\text{ 为正奇数},\\\\[4pt]\\dfrac1n,&n\\text{ 为正偶数}.\\end{cases}$$\n\n当 $n\\to\\infty$ 时，数列 $\\{x_n\\}$ 是（　）。',
    tags: ['数列极限', '奇偶子列', '无界性', '选择题'],
    coreMethod: '分别计算奇数项和偶数项子列：一支趋于 $+\\infty$，另一支趋于 $0$，据此区分“无界”与“无穷大量”。',
    mistakes: '只看奇数项越来越大便说原数列是无穷大量；无穷大量要求尾部所有项的绝对值都超过任意给定正数。',
    answerText: '正确选项为 D：数列无界，但不是无穷大量。',
    questionFormat: 'single-choice',
    options: ['无穷大量', '无穷小量', '有界变量但不是无穷小量', '无界变量但不是无穷大量'],
    correctOptionIds: ['D'],
    solutionMethods: [
      {
        title: '方法一 · 奇偶子列判定',
        content: '偶数项满足 $x_{2k}=1/(2k)\\to0$；奇数项满足\n\n$$x_{2k-1}=2k-1+\\frac1{\\sqrt{2k-1}}\\to+\\infty.$$\n\n奇数项说明原数列无界，偶数项说明它不可能成为无穷大量，故选择 D。'
      },
      {
        title: '方法二 · 按定义排除',
        content: '若它是无穷大量，取 $M=1$，则应存在 $N$ 使 $n>N$ 时恒有 $|x_n|>1$。但任取这样的 $N$，都能找到偶数 $2k>N$ 且 $x_{2k}<1$，矛盾。另一方面奇数项可超过任意上界，所以它确实无界。'
      }
    ]
  }),
  lectureTwo({
    role: 'example',
    number: '2.5',
    page: 'PDF 87 · 书页 82',
    fingerprint: 'extrema:convergent-tail-finite-head',
    title: '例 2.5 · 收敛尾项与有限首项确定最值',
    statement: '已知\n\n$$a_n=1-\\frac{(-1)^n}{n},\\qquad n=1,2,\\ldots$$\n\n则数列 $\\{a_n\\}$（　）。',
    tags: ['数列极限', '最大值', '最小值', '选择题'],
    coreMethod: '先算极限，再比较前两项与充分靠后的尾项；收敛性可把所有极端值限制在有限个首项中。',
    mistakes: '把上确界或下确界直接当成能取到的最大值或最小值；本题必须验证具体项确实取到边界。',
    answerText: '正确选项为 A：有最大值，也有最小值。',
    questionFormat: 'single-choice',
    options: ['有最大值，有最小值', '有最大值，没有最小值', '没有最大值，有最小值', '没有最大值，没有最小值'],
    correctOptionIds: ['A'],
    solutionMethods: [
      {
        title: '方法一 · 分奇偶项直接比较',
        content: '奇数项\n\n$$a_{2k-1}=1+\\frac1{2k-1}$$\n\n随 $k$ 增大而减小，最大值是 $a_1=2$；偶数项\n\n$$a_{2k}=1-\\frac1{2k}$$\n\n随 $k$ 增大而增加，最小值是 $a_2=1/2$。故最大值与最小值都存在。'
      },
      {
        title: '方法二 · 收敛尾部锁定',
        content: '$a_n\\to1$。因为 $a_1=2>1$、$a_2=1/2<1$，收敛的尾部最终同时落在 $a_2$ 与 $a_1$ 之间；剩余有限项也必能比较出最大、最小，而直接观察可知二者恰由 $a_1$、$a_2$ 取得。'
      }
    ]
  }),
  lectureTwo({
    role: 'example',
    number: '2.6',
    page: 'PDF 88 · 书页 83',
    fingerprint: 'limit-linear-system:sum-difference',
    title: '例 2.6 · 由和差极限反求两个数列极限',
    statement: '设\n\n$$\\lim_{n\\to\\infty}(a_n+b_n)=1,\\qquad \\lim_{n\\to\\infty}(a_n-b_n)=3,$$\n\n则（　）。',
    tags: ['数列极限', '四则运算', '线性消元', '选择题'],
    coreMethod: '把已知的和、差看成两个新数列，再用线性组合还原 $a_n$ 与 $b_n$。',
    mistakes: '误以为“和有极限”就能单独推出两个数列都有极限；本题能推出，是因为同时给出了线性独立的和与差。',
    answerText: '正确选项为 B：$\\{a_n\\}$ 与 $\\{b_n\\}$ 的极限都存在，且分别为 $2$、$-1$。',
    questionFormat: 'single-choice',
    options: [
      '$\\{a_n\\}$ 极限存在，$\\{b_n\\}$ 极限不存在',
      '$\\{a_n\\}$ 极限存在，$\\{b_n\\}$ 极限存在',
      '$\\{a_n\\}$ 极限不存在，$\\{b_n\\}$ 极限不存在',
      '$\\{a_n\\}$ 极限不存在，$\\{b_n\\}$ 极限存在'
    ],
    correctOptionIds: ['B'],
    solutionMethods: [
      {
        title: '方法一 · 和差消元',
        content: '令 $u_n=a_n+b_n$、$v_n=a_n-b_n$，则 $u_n\\to1$、$v_n\\to3$。由\n\n$$a_n=\\frac{u_n+v_n}{2},\\qquad b_n=\\frac{u_n-v_n}{2},$$\n\n得 $a_n\\to2$，$b_n\\to-1$，故两者极限都存在。'
      },
      {
        title: '方法二 · 矩阵逆变换复核',
        content: '写成\n\n$$\\begin{pmatrix}u_n\\\\v_n\\end{pmatrix}=\\begin{pmatrix}1&1\\\\1&-1\\end{pmatrix}\\begin{pmatrix}a_n\\\\b_n\\end{pmatrix}.$$\n\n系数矩阵行列式为 $-2\\ne0$，故可逆；对极限向量 $(1,3)^T$ 作逆变换，得到 $(2,-1)^T$。'
      }
    ]
  }),
  lectureTwo({
    role: 'example',
    number: '2.7',
    page: 'PDF 89 · 书页 84',
    fingerprint: 'function-limit:oscillatory-unbounded-not-infinite',
    title: '例 2.7 · 振荡放大函数的极限类型',
    statement: '当 $x\\to0$ 时，\n\n$$\\frac1x\\sin\\frac1x$$\n\n是（　）。',
    tags: ['函数极限', '归结原则', '无界性', '振荡', '选择题'],
    coreMethod: '构造两列趋于 $0$ 的自变量：一列让正弦为 $0$，另一列让正弦为 $1$，从而同时证明极限不存在且函数无界。',
    mistakes: '把“无界”与“无穷大量”混为一谈；存在任意大的函数值并不表示所有足够靠近零点的函数值都很大。',
    answerText: '正确选项为 B：无界，但不是无穷大量。',
    questionFormat: 'single-choice',
    options: ['无穷大量', '无界量，但不是无穷大量', '有界量，但不是无穷小量', '无穷小量'],
    correctOptionIds: ['B'],
    solutionMethods: [
      {
        title: '方法一 · 两条趋近数列',
        content: '取 $x_n=1/(n\\pi)\\to0$，则函数值恒为 $0$。再取\n\n$$y_n=\\frac1{(2n+1/2)\\pi}\\to0,$$\n\n则 $\\sin(1/y_n)=1$，函数值为 $(2n+1/2)\\pi\\to+\\infty$。因此函数无界，但不满足无穷大量的尾部条件。'
      },
      {
        title: '方法二 · 变量代换复核',
        content: '令 $t=1/x$，则问题化为 $t\\sin t$ 在 $|t|\\to\\infty$ 时的行为。沿 $t=n\\pi$ 时值为 $0$，沿 $t=\\pi/2+2n\\pi$ 时值趋于 $+\\infty$，所以没有统一的无穷趋势，却能取得任意大的绝对值。'
      }
    ]
  }),
  lectureTwo({
    role: 'example',
    number: '2.8',
    page: 'PDF 90 · 书页 85',
    fingerprint: 'one-power:log-cos-second-order',
    title: '例 2.8 · 余弦底数的一次方型极限',
    statement: '求\n\n$$\\lim_{n\\to\\infty}\\left(\\cos\\frac1{\\sqrt n}\\right)^{n^2}.$$',
    tags: ['数列极限', '幂指型极限', '对数等价'],
    coreMethod: '把幂指型写成指数函数，计算 $n^2\\ln(\\cos(1/\\sqrt n))$ 的极限；关键是保留余弦对数的二阶主项。',
    mistakes: '把指数误看成 $n$；若忽略 $n^2$，会得到完全不同的结果。还要注意 $\\ln(\\cos t)\\sim-t^2/2$。',
    answerText: '极限为 $0$。',
    solutionMethods: [
      {
        title: '方法一 · 对数等价',
        content: '令原式为 $e^{L_n}$，其中\n\n$$L_n=n^2\\ln\\left(\\cos\\frac1{\\sqrt n}\\right).$$\n\n由 $\\ln(\\cos t)\\sim-t^2/2$，有 $L_n\\sim-n/2\\to-\\infty$。因此原式趋于 $e^{-\\infty}=0$。'
      },
      {
        title: '方法二 · 拆成标准极限',
        content: '写成\n\n$$\\left[\\left(\\cos\\frac1{\\sqrt n}\\right)^n\\right]^n.$$\n\n括号内因 $n\\ln(\\cos(1/\\sqrt n))\\to-1/2$ 而趋于 $e^{-1/2}<1$。从某项起它被一个固定的 $q<1$ 控制，所以整体不超过 $q^n\\to0$。'
      }
    ]
  }),
  lectureTwo({
    role: 'example',
    number: '2.9',
    page: 'PDF 92-93 · 书页 87-88',
    fingerprint: 'sum-limit:squeeze-varying-denominators',
    title: '例 2.9 · 变分母有限和的夹逼极限',
    statement: '求\n\n$$\\lim_{n\\to\\infty}\\left(\\frac1{n^2+n+1}+\\frac2{n^2+n+2}+\\cdots+\\frac n{n^2+n+n}\\right).$$',
    tags: ['数列极限', '有限和', '夹逼准则'],
    coreMethod: '把不同分母统一夹在最小分母与最大分母之间，同时保持分子和 $1+2+\\cdots+n$ 不变。',
    mistakes: '逐项直接用 $n^2$ 替换分母而不控制累计误差；含有 $n$ 项时，必须对全体项作统一估计。',
    answerText: '极限为 $1/2$。',
    solutionMethods: [
      {
        title: '方法一 · 统一分母夹逼',
        content: '对 $1\\le i\\le n$，有 $n^2+n+1\\le n^2+n+i\\le n^2+2n$。因此\n\n$$\\frac{n(n+1)}{2(n^2+2n)}\\le\\sum_{i=1}^n\\frac{i}{n^2+n+i}\\le\\frac{n(n+1)}{2(n^2+n+1)}.$$\n\n左右两端都趋于 $1/2$，故原极限为 $1/2$。'
      },
      {
        title: '方法二 · 一致误差复核',
        content: '写成\n\n$$\\frac1n\\sum_{i=1}^n\\frac{i/n}{1+1/n+i/n^2}.$$\n\n分母在全体 $1\\le i\\le n$ 上一致趋于 $1$，因此该式与 $(1/n)\\sum_{i=1}^n i/n$ 的差趋于 $0$；后者趋于 $\\int_0^1x\\,dx=1/2$。'
      }
    ]
  }),
  lectureTwo({
    role: 'example',
    number: '2.10',
    page: 'PDF 93 · 书页 88',
    fingerprint: 'nth-root:max-dominant-term',
    title: '例 2.10 · 有限个指数项的最大底数原则',
    statement: '设 $a_i\\ge0$（$i=1,2,\\ldots,m$），求\n\n$$\\lim_{n\\to\\infty}\\sqrt[n]{a_1^n+a_2^n+\\cdots+a_m^n}.$$',
    tags: ['数列极限', '根式极限', '最大项', '夹逼准则'],
    coreMethod: '令 $a=\\max(a_1,\\ldots,a_m)$，用最大项从下方控制总和，再用 $m$ 个最大项从上方控制。',
    mistakes: '把结果写成所有 $a_i$ 的和或平均数；当 $n$ 次幂再开 $n$ 次根时，有限个较小底数最终都被最大底数压制。',
    answerText: '$$\\max(a_1,a_2,\\ldots,a_m).$$',
    solutionMethods: [
      {
        title: '方法一 · 最大项夹逼',
        content: '令 $a=\\max(a_1,\\ldots,a_m)$。至少有一项等于 $a$，且每项不超过 $a$，故\n\n$$a^n\\le a_1^n+\\cdots+a_m^n\\le ma^n.$$\n\n开 $n$ 次根得\n\n$$a\\le\\sqrt[n]{a_1^n+\\cdots+a_m^n}\\le a\\sqrt[n]m.$$\n\n因 $\\sqrt[n]m\\to1$，极限为 $a$。'
      },
      {
        title: '方法二 · 提取主导底数',
        content: '若 $a>0$，原式可写成\n\n$$a\\sqrt[n]{\\left(\\frac{a_1}{a}\\right)^n+\\cdots+\\left(\\frac{a_m}{a}\\right)^n}.$$\n\n括号内至少有一项为 $1$，总和介于 $1$ 与 $m$ 之间，开 $n$ 次根趋于 $1$。若 $a=0$，所有 $a_i$ 均为零，结论同样成立。'
      }
    ]
  }),
  lectureTwo({
    role: 'example',
    number: '2.11',
    page: 'PDF 93-94 · 书页 88-89',
    fingerprint: 'implicit-sequences:cos-difference-equivalent',
    title: '例 2.11 · 余弦约束下的两列极限与收敛速度',
    statement: '设\n\n$$0<a_n<\\frac\\pi2,\\qquad 0<b_n<\\frac\\pi2,$$\n\n且\n\n$$\\cos a_n-a_n=\\cos b_n,\\qquad \\lim_{n\\to\\infty}b_n=0.$$\n\n求 $\\lim a_n$ 与 $\\displaystyle\\lim a_n/b_n^2$。',
    tags: ['数列极限', '夹逼准则', '等价无穷小', '隐式关系'],
    coreMethod: '先由余弦在 $(0,\\pi/2)$ 上严格递减比较 $a_n$ 与 $b_n$，得到 $a_n\\to0$；再把关系式改写成 $a_n=\\cos a_n-\\cos b_n$ 并提取二阶主部。',
    mistakes: '没有先证明 $a_n\\to0$ 就直接套用 $1-\\cos x\\sim x^2/2$；或忽略 $a_n<b_n$ 导致 $a_n^2$ 与 $b_n^2$ 的相对量级无法控制。',
    answerText: '$$\\lim_{n\\to\\infty}a_n=0,\\qquad \\lim_{n\\to\\infty}\\frac{a_n}{b_n^2}=\\frac12.$$',
    solutionMethods: [
      {
        title: '方法一 · 比较与等价无穷小',
        content: '由 $\\cos a_n-\\cos b_n=a_n>0$，得 $\\cos a_n>\\cos b_n$。余弦在给定区间递减，所以 $0<a_n<b_n\\to0$，故 $a_n\\to0$。同时\n\n$$0<a_n=\\cos a_n-\\cos b_n\\le1-\\cos b_n=O(b_n^2),$$\n\n所以 $a_n/b_n\\to0$。再由\n\n$$a_n=(1-\\cos b_n)-(1-\\cos a_n),$$\n\n两边除以 $b_n^2$：\n\n$$\\frac{a_n}{b_n^2}=\\frac{1-\\cos b_n}{b_n^2}-\\frac{1-\\cos a_n}{a_n^2}\\frac{a_n^2}{b_n^2}.$$\n\n第一项趋于 $1/2$，第二项趋于 $0$，故极限为 $1/2$。'
      },
      {
        title: '方法二 · Taylor 量级闭环',
        content: '因 $a_n,b_n\\to0$，题设化为\n\n$$a_n=\\frac{b_n^2-a_n^2}{2}+o(b_n^2+a_n^2).$$\n\n又 $a_n<b_n$，所以右端为 $O(b_n^2)$，先得 $a_n=O(b_n^2)$，进而 $a_n^2=o(b_n^2)$。代回上式即得 $a_n=b_n^2/2+o(b_n^2)$，故比值趋于 $1/2$。'
      }
    ]
  }),
  lectureTwo({
    role: 'example',
    number: '2.12',
    page: 'PDF 95 · 书页 90',
    fingerprint: 'recurrence:monotone-bounded-fixed-point',
    title: '例 2.12 · 根式递推数列的单调有界极限',
    statement: '设 $0<x_1<3$，且\n\n$$x_{n+1}=\\sqrt{x_n(3-x_n)},\\qquad n=1,2,\\ldots$$\n\n证明数列极限存在，并求该极限。',
    tags: ['数列极限', '递推数列', '单调有界', '不动点', '证明题'],
    coreMethod: '先复用有界性结论，再证明从第二项起单调增加；只有完成收敛性证明后，才能对递推式两端取极限。',
    mistakes: '直接设极限为 $A$ 并解 $A=\\sqrt{A(3-A)}$，这只能得到候选值，不能证明极限存在。',
    answerText: '$$\\lim_{n\\to\\infty}x_n=\\frac32.$$',
    solutionMethods: [
      {
        title: '方法一 · 单调有界准则',
        content: '由例 2.1，$n>1$ 时 $0<x_n\\le3/2$。于是\n\n$$x_{n+1}-x_n=\\sqrt{x_n}\\,\\frac{3-2x_n}{\\sqrt{3-x_n}+\\sqrt{x_n}}\\ge0,$$\n\n故从第二项起单调增加且有上界，极限存在。设极限为 $A>0$，对递推式取极限得\n\n$$A=\\sqrt{A(3-A)},$$\n\n即 $A=0$ 或 $A=3/2$；结合 $A>0$，得到 $A=3/2$。'
      },
      {
        title: '方法二 · 与不动点比较复核',
        content: '在 $(0,3/2]$ 上，$g(x)=\\sqrt{x(3-x)}$ 满足 $g(x)\\ge x$，且等号只在 $x=3/2$ 处成立。递推从第二项起被困在该区间并不断向右移动，所以只能逼近区间内唯一的正不动点 $3/2$。'
      }
    ]
  }),
  lectureTwo({
    role: 'example',
    number: '2.13',
    page: 'PDF 96 · 书页 91',
    fingerprint: 'recurrence-monotonicity:increasing-map-preserves-order',
    title: '例 2.13 · 递推映射单调性与数列单调性',
    statement: '设 $x_{n+1}=f(x_n)$，则以下命题正确的是（　）。\n\n① 若 $f$ 单调增加，且 $x_1<x_2$，则 $\\{x_n\\}$ 单调增加；\n\n② 若 $f$ 单调增加，且 $x_1>x_2$，则 $\\{x_n\\}$ 单调减少；\n\n③ 若 $f$ 单调减少，且 $x_1<x_2$，则 $\\{x_n\\}$ 单调增加；\n\n④ 若 $f$ 单调减少，且 $x_1>x_2$，则 $\\{x_n\\}$ 单调减少。',
    tags: ['递推数列', '单调性', '函数迭代', '选择题'],
    coreMethod: '递增映射保持相邻两项的不等号方向，可连续归纳；递减映射会翻转不等号，通常造成交替振荡。',
    mistakes: '只根据 $x_1$ 与 $x_2$ 的一次比较就判断全部项；必须检查映射把相邻不等式保持还是翻转。',
    answerText: '正确选项为 A，即 ①②。',
    questionFormat: 'single-choice',
    options: ['①②', '①③', '②③', '②④'],
    correctOptionIds: ['A'],
    solutionMethods: [
      {
        title: '方法一 · 逐项归纳',
        content: '若 $f$ 递增且 $x_1<x_2$，则 $x_2=f(x_1)<f(x_2)=x_3$，继续归纳得 $x_1<x_2<x_3<\\cdots$，故 ① 正确。同理，$x_1>x_2$ 时不等号方向被保持，得到单调减少，故 ② 正确。'
      },
      {
        title: '方法二 · 反例排除递减映射',
        content: '递减映射会把 $x_1<x_2$ 变为 $x_2=f(x_1)>f(x_2)=x_3$，下一次又可能反转，因此通常形成摆动。取 $f(x)=-x$、$x_1=1$ 即得 $1,-1,1,-1,\\ldots$，直接否定把 ③④ 当作一般结论。'
      }
    ]
  }),
  lectureTwo({
    role: 'example',
    number: '2.14',
    page: 'PDF 96-97 · 书页 91-92',
    fingerprint: 'recurrence:log-fixed-point-unique-monotone',
    title: '例 2.14 · 对数递推与唯一正不动点',
    statement: '（1）证明方程\n\n$$x=2\\ln(1+x)$$\n\n在 $(0,+\\infty)$ 内有唯一实根 $\\xi$；\n\n（2）任取 $x_1>\\xi$，定义\n\n$$x_{n+1}=2\\ln(1+x_n),\\qquad n=1,2,\\ldots$$\n\n证明 $\\lim x_n$ 存在，并求其值。',
    tags: ['数列极限', '递推数列', '方程根', '单调有界', '证明题'],
    coreMethod: '先用导数和端点符号确定正不动点唯一；再证明递推数列始终大于该不动点且单调减少。',
    mistakes: '忽略 $x=0$ 也是原方程的根；题目要求的是 $(0,+\\infty)$ 内唯一正根。递推部分还必须用 $x_1>\\xi$ 保证所选极限分支。',
    answerText: '方程在 $(0,+\\infty)$ 内有唯一实根 $\\xi$，且递推数列满足 $x_n\\downarrow\\xi$，所以 $\\lim x_n=\\xi$。',
    solutionMethods: [
      {
        title: '方法一 · 辅助函数与单调有界',
        content: '令 $F(x)=x-2\\ln(1+x)$。有 $F(0)=0$、$F(1)=1-2\\ln2<0$，且 $F(x)\\to+\\infty$。又\n\n$$F\\prime(x)=\\frac{x-1}{1+x},$$\n\n所以 $F$ 在 $(0,1)$ 递减、在 $(1,+\\infty)$ 递增，因而除 $0$ 外恰有一个正根 $\\xi>1$。若 $x_k>\\xi$，则由 $F(x_k)>0$ 得 $x_{k+1}<x_k$；又对数函数递增，$x_{k+1}>2\\ln(1+\\xi)=\\xi$。故 $x_n$ 递减且以下界 $\\xi$ 有界，极限存在。取极限后仍满足不动点方程，结合区间得极限为 $\\xi$。'
      },
      {
        title: '方法二 · 图像迭代复核',
        content: '比较曲线 $y=x$ 与 $y=2\\ln(1+x)$。在 $x>\\xi$ 区域，对数曲线位于直线下方，所以一次迭代向左移动；但因映射递增，$x>\\xi$ 又推出 $2\\ln(1+x)>\\xi$。因此每次迭代都停留在 $\\xi$ 右侧并靠近交点，只能收敛到该唯一正交点。'
      }
    ]
  }),
  lectureTwo({
    role: 'example',
    number: '2.15',
    page: 'PDF 98-99 · 书页 93-94',
    fingerprint: 'recurrence:cos-contraction-fixed-point',
    title: '例 2.15 · 余弦迭代的压缩收敛',
    statement: '（1）证明方程 $x=\\cos x$ 在 $(0,\\pi/3)$ 内有唯一实根 $a$；\n\n（2）设 $-1\\le x_1\\le1$，定义\n\n$$x_{n+1}=\\cos x_n,\\qquad n=1,2,\\ldots$$\n\n证明 $\\lim x_n$ 存在，且极限就是（1）中的 $a$。',
    tags: ['数列极限', '递推数列', '压缩映射', '中值定理', '证明题'],
    coreMethod: '先由介值定理和严格单调性确定不动点；再把误差 $|x_{n+1}-a|$ 用中值定理压缩为不超过固定比例的 $|x_n-a|$。',
    mistakes: '因为 $\\cos x$ 递减就强行证明原数列单调；余弦迭代通常左右摆动，应直接估计到不动点的距离。',
    answerText: '方程在 $(0,\\pi/3)$ 内有唯一根 $a$，且对任意 $-1\\le x_1\\le1$，均有 $x_n\\to a$。',
    solutionMethods: [
      {
        title: '方法一 · 中值定理压缩误差',
        content: '令 $F(x)=\\cos x-x$。有 $F(0)=1>0$、$F(\\pi/3)=1/2-\\pi/3<0$，且 $F\\prime(x)=-\\sin x-1<0$，所以唯一根 $a\\in(0,\\pi/3)$。由初值范围可知 $n>1$ 时 $0<x_n\\le1<\\pi/3$。对某个介于 $x_n$ 与 $a$ 之间的 $\\xi_n$，\n\n$$|x_{n+1}-a|=|\\cos x_n-\\cos a|=|\\sin\\xi_n|\\,|x_n-a|\\le\\frac{\\sqrt3}{2}|x_n-a|.$$\n\n迭代得 $|x_{n+1}-a|\\le(\\sqrt3/2)^n|x_1-a|\\to0$，故 $x_n\\to a$。'
      },
      {
        title: '方法二 · 两步映射复核',
        content: '虽然 $\\cos x$ 递减会导致单步迭代摆动，但两步映射 $g(x)=\\cos(\\cos x)$ 在 $[0,1]$ 上递增，且\n\n$$|g\\prime(x)|=|\\sin(\\cos x)\\sin x|<1.$$\n\n因此奇、偶两个子列都被压向同一不动点。它们的共同极限必须满足 $a=\\cos a$，由唯一性即为（1）中的 $a$。'
      }
    ]
  }),
  lectureTwo({
    role: 'exercise',
    number: '2.1',
    page: 'PDF 101-102 · 书页 96-97',
    fingerprint: 'limit-properties:eventual-order-product',
    title: '习题 2.1 · 两个收敛数列的必然结论',
    statement: '设\n\n$$\\lim_{n\\to\\infty}a_n=0,\\qquad \\lim_{n\\to\\infty}b_n=1,$$\n\n则（　）。',
    tags: ['数列极限', '保号性', '四则运算', '选择题'],
    coreMethod: '利用极限保号性得到两数列最终的大小关系，再用乘积极限和商极限的适用条件逐项排除。',
    mistakes: '把“最终成立”误写成“对任意 $n$ 成立”；极限只控制充分靠后的项，不能限制有限个首项。',
    answerText: '正确选项为 B：存在正整数 $N$，当 $n>N$ 时总有 $a_n<b_n$。',
    questionFormat: 'single-choice',
    options: [
      '对任意 $n$，$a_n<b_n$ 成立',
      '存在正整数 $N$，当 $n>N$ 时，总有 $a_n<b_n$',
      '$\\displaystyle\\lim_{n\\to\\infty}\\frac{b_n}{a_n}$ 必存在',
      '$\\displaystyle\\lim_{n\\to\\infty}a_nb_n$ 可能不存在'
    ],
    correctOptionIds: ['B'],
    solutionMethods: [
      {
        title: '方法一 · 极限保号与四则运算',
        content: '$b_n-a_n\\to1>0$，由极限保号性，存在 $N$ 使 $n>N$ 时 $b_n-a_n>0$，故 B 正确。A 无法控制有限首项；C 的分母趋于零，不能套商法则；D 中 $a_nb_n\\to0\\cdot1=0$，所以必存在。'
      },
      {
        title: '方法二 · 定量邻域复核',
        content: '取误差 $1/4$。充分大的 $n$ 满足 $|a_n|<1/4$ 且 $|b_n-1|<1/4$，于是\n\n$$a_n<\\frac14<\\frac34<b_n.$$\n\n这直接给出最终的严格次序，也说明结论不涉及前面有限项。'
      }
    ]
  }),
  lectureTwo({
    role: 'exercise',
    number: '2.2',
    page: 'PDF 101-102 · 书页 96-97',
    fingerprint: 'ratio-limit:positive-geometric-decay',
    title: '习题 2.2 · 相邻项比值锁定数列极限',
    statement: '设数列 $\\{x_n\\}$ 满足 $x_n>0$，且\n\n$$\\lim_{n\\to\\infty}\\frac{x_{n+1}}{x_n}=\\frac12,$$\n\n则（　）。',
    tags: ['数列极限', '比值极限', '单调有界', '选择题'],
    coreMethod: '比值最终小于某个固定的 $q<1$，所以数列最终按几何速度衰减；也可先证极限存在，再排除非零极限。',
    mistakes: '直接把 $x_{n+1}/x_n$ 的极限写成 $L/L$；在尚未证明 $x_n$ 收敛且 $L\\ne0$ 前，这一步没有依据。',
    answerText: '正确选项为 A：$\\lim_{n\\to\\infty}x_n=0$。',
    questionFormat: 'single-choice',
    options: [
      '$\\displaystyle\\lim_{n\\to\\infty}x_n=0$',
      '$\\displaystyle\\lim_{n\\to\\infty}x_n$ 存在，但不为零',
      '$\\displaystyle\\lim_{n\\to\\infty}x_n$ 不存在',
      '$\\displaystyle\\lim_{n\\to\\infty}x_n$ 可能存在，也可能不存在'
    ],
    correctOptionIds: ['A'],
    solutionMethods: [
      {
        title: '方法一 · 几何衰减估计',
        content: '取 $q=3/4$。由比值极限，存在 $N$，使 $n>N$ 时\n\n$$0<\\frac{x_{n+1}}{x_n}<q.$$\n\n于是对 $k\\ge1$，$0<x_{N+k}<x_Nq^k$。右端趋于 $0$，由夹逼准则得 $x_n\\to0$。'
      },
      {
        title: '方法二 · 单调有界后反证非零极限',
        content: '比值最终小于 $1$，所以正数列最终单调减少且以下界 $0$ 有界，极限 $A\\ge0$ 存在。若 $A>0$，则 $x_{n+1}/x_n\\to A/A=1$，与题设的 $1/2$ 矛盾，故只能有 $A=0$。'
      }
    ]
  }),
  lectureTwo({
    role: 'exercise',
    number: '2.3',
    page: 'PDF 101-102 · 书页 96-97',
    fingerprint: 'radical-difference:conjugate-leading-scale',
    title: '习题 2.3 · 双根式差的共轭极限',
    statement: '求\n\n$$\\lim_{n\\to\\infty}\\left(\\sqrt{n+\\sqrt n}-\\sqrt{n-\\sqrt n}\\right).$$',
    tags: ['数列极限', '根式差', '有理化'],
    coreMethod: '对根式差乘以共轭式，把“无穷减无穷”转化为分子 $2\\sqrt n$ 与同阶分母的比值。',
    mistakes: '分别把两个根式都近似为 $\\sqrt n$ 后直接相减，首项会抵消，必须保留下一阶信息或先有理化。',
    answerText: '极限为 $1$。',
    solutionMethods: [
      {
        title: '方法一 · 共轭有理化',
        content: '原式等于\n\n$$\\frac{2\\sqrt n}{\\sqrt{n+\\sqrt n}+\\sqrt{n-\\sqrt n}}=\\frac2{\\sqrt{1+1/\\sqrt n}+\\sqrt{1-1/\\sqrt n}}.$$\n\n分母趋于 $2$，故极限为 $1$。'
      },
      {
        title: '方法二 · Taylor 展开复核',
        content: '利用 $\\sqrt{1+t}=1+t/2+O(t^2)$，有\n\n$$\\sqrt{n\\pm\\sqrt n}=\\sqrt n\\left(1\\pm\\frac1{2\\sqrt n}+O\\left(\\frac1n\\right)\\right)=\\sqrt n\\pm\\frac12+O(n^{-1/2}).$$\n\n两式相减得到 $1+O(n^{-1/2})$，极限为 $1$。'
      }
    ]
  }),
  lectureTwo({
    role: 'exercise',
    number: '2.4',
    page: 'PDF 101-102 · 书页 96-97',
    fingerprint: 'parameter-limit:power-difference-nonzero',
    title: '习题 2.4 · 幂差极限反求参数',
    statement: '若\n\n$$\\lim_{n\\to\\infty}\\frac{n^{99}}{n^k-(n-1)^k}$$\n\n存在且不为零，求常数 $k$。',
    tags: ['数列极限', '参数确定', '幂差', '等价无穷小'],
    coreMethod: '提取 $n^k$，再对 $(1-1/n)^k$ 作一阶展开；分母主阶为 $kn^{k-1}$，与分子次数匹配。',
    mistakes: '把 $n^k-(n-1)^k$ 误判为常数 $1$；只有 $k=1$ 时如此，一般主阶是 $kn^{k-1}$。',
    answerText: '$$k=100.$$',
    solutionMethods: [
      {
        title: '方法一 · 一阶展开匹配次数',
        content: '有\n\n$$n^k-(n-1)^k=n^k\\left[1-\\left(1-\\frac1n\\right)^k\\right]\\sim n^k\\frac{k}{n}=kn^{k-1}.$$\n\n因此原式等价于 $n^{100-k}/k$。要使极限有限且非零，必须 $100-k=0$，即 $k=100$。'
      },
      {
        title: '方法二 · 中值定理复核',
        content: '对 $f(x)=x^k$ 在 $[n-1,n]$ 上使用 Lagrange 中值定理，存在 $\\xi_n\\in(n-1,n)$ 使\n\n$$n^k-(n-1)^k=k\\xi_n^{k-1}.$$\n\n又 $\\xi_n/n\\to1$，原式与 $n^{99}/(kn^{k-1})$ 同阶，故仍由次数平衡得到 $k=100$。'
      }
    ]
  }),
  lectureTwo({
    role: 'exercise',
    number: '2.5',
    page: 'PDF 101-102 · 书页 96-97',
    fingerprint: 'root-sum:squeeze-uniform-denominator',
    title: '习题 2.5 · 根式分母有限和的统一夹逼',
    statement: '求\n\n$$\\lim_{n\\to\\infty}\\left(\\frac1{\\sqrt{n^2+1}}+\\frac1{\\sqrt{n^2+2}}+\\cdots+\\frac1{\\sqrt{n^2+n}}\\right).$$',
    tags: ['数列极限', '有限和', '夹逼准则'],
    coreMethod: '对所有 $1\\le k\\le n$ 统一比较分母，得到每项统一的上下界，再乘以项数 $n$。',
    mistakes: '仅写每一项都趋于 $0$ 便断言总和趋于 $0$；项数也随 $n$ 增长，必须整体估计。',
    answerText: '极限为 $1$。',
    solutionMethods: [
      {
        title: '方法一 · 整体夹逼',
        content: '因 $n^2+1\\le n^2+k\\le n^2+n$，所以\n\n$$\\frac n{\\sqrt{n^2+n}}\\le\\sum_{k=1}^n\\frac1{\\sqrt{n^2+k}}\\le\\frac n{\\sqrt{n^2+1}}.$$\n\n左右两端都趋于 $1$，故原极限为 $1$。'
      },
      {
        title: '方法二 · 一致收敛视角',
        content: '原式可写成\n\n$$\\frac1n\\sum_{k=1}^n\\frac1{\\sqrt{1+k/n^2}}.$$\n\n因为 $0<k/n^2\\le1/n$，括号内函数值对全部 $k$ 一致趋于 $1$；它们的算术平均也趋于 $1$。'
      }
    ]
  }),
  lectureTwo({
    role: 'exercise',
    number: '2.6',
    page: 'PDF 101-103 · 书页 96-98',
    fingerprint: 'nth-root:harmonic-sum-subexponential',
    title: '习题 2.6 · 调和部分和的 n 次根极限',
    statement: '求\n\n$$\\lim_{n\\to\\infty}\\sqrt[n]{1+\\frac12+\\frac13+\\cdots+\\frac1n}.$$',
    tags: ['数列极限', '调和和', 'n次根', '夹逼准则'],
    coreMethod: '不必精确估计调和和，只需用 $1\\le H_n\\le n$ 说明它至多按多项式增长，开 $n$ 次根后趋于 $1$。',
    mistakes: '因调和和发散就误判其 $n$ 次根也发散；开高次根会压平任何次指数增长。',
    answerText: '极限为 $1$。',
    solutionMethods: [
      {
        title: '方法一 · 粗界夹逼',
        content: '调和部分和满足\n\n$$1\\le1+\\frac12+\\cdots+\\frac1n\\le n.$$\n\n开 $n$ 次根得\n\n$$1\\le\\sqrt[n]{1+\\frac12+\\cdots+\\frac1n}\\le\\sqrt[n]n.$$\n\n而 $\\sqrt[n]n\\to1$，故原极限为 $1$。'
      },
      {
        title: '方法二 · 对数增长复核',
        content: '由 $H_n\\le1+\\ln n$，有\n\n$$0\\le\\frac{\\ln H_n}{n}\\le\\frac{\\ln(1+\\ln n)}n\\to0.$$\n\n因此 $H_n^{1/n}=\\exp[(\\ln H_n)/n]\\to e^0=1$。'
      }
    ]
  }),
  lectureTwo({
    role: 'exercise',
    number: '2.7',
    page: 'PDF 101-103 · 书页 96-98',
    fingerprint: 'nth-root:bounded-positive-average',
    title: '习题 2.7 · 连续函数指数平均的 n 次根',
    statement: '设函数 $f(x)$ 在 $[a,b]$ 上连续，$x_1,x_2,\\ldots,x_n$ 是 $[a,b]$ 上的点列，求\n\n$$\\lim_{n\\to\\infty}\\sqrt[n]{\\frac1n\\sum_{k=1}^n e^{f(x_k)}}.$$',
    tags: ['数列极限', '连续函数', '最值定理', '夹逼准则'],
    coreMethod: '连续函数在闭区间上有最大、最小值，因此 $e^{f(x_k)}$ 的算术平均始终被两个固定正数夹住；固定正数的 $n$ 次根都趋于 $1$。',
    mistakes: '试图求 $x_k$ 的分布或把和当黎曼和；题目没有给出点列规律，也完全不需要这些信息。',
    answerText: '极限为 $1$。',
    solutionMethods: [
      {
        title: '方法一 · 最值定理夹逼',
        content: '由连续性，$e^{f(x)}$ 在 $[a,b]$ 上存在正的最小值 $m$ 与最大值 $M$。于是\n\n$$0<m\\le\\frac1n\\sum_{k=1}^ne^{f(x_k)}\\le M.$$\n\n开 $n$ 次根得 $\\sqrt[n]m\\le$ 原式 $\\le\\sqrt[n]M$，两端都趋于 $1$，故极限为 $1$。'
      },
      {
        title: '方法二 · 对数有界复核',
        content: '记平均值为 $A_n$。由 $m\\le A_n\\le M$，可知 $|\\ln A_n|$ 被一个与 $n$ 无关的常数控制。因此\n\n$$\\ln(A_n^{1/n})=\\frac{\\ln A_n}{n}\\to0,$$\n\n再取指数即得 $A_n^{1/n}\\to1$。'
      }
    ]
  }),
  lectureTwo({
    role: 'exercise',
    number: '2.8',
    page: 'PDF 102-103 · 书页 97-98',
    fingerprint: 'recurrence:rational-map-monotone-bounded',
    title: '习题 2.8 · 隐式递推数列的单调有界极限',
    statement: '设 $x_1=2$，且\n\n$$x_n+(x_n-4)x_{n-1}=3,\\qquad n=2,3,\\ldots$$\n\n证明 $\\lim_{n\\to\\infty}x_n$ 存在，并求其值。',
    tags: ['数列极限', '递推数列', '单调有界', '不动点', '证明题'],
    coreMethod: '先把隐式递推解成 $x_n=(3+4x_{n-1})/(1+x_{n-1})$，再比较相邻两项并建立固定上界，最后求正不动点。',
    mistakes: '在没有证明收敛前直接对原递推取极限；二次方程会给出一正一负两个候选根，必须结合数列正性筛选。',
    answerText: '$$\\lim_{n\\to\\infty}x_n=\\frac{3+\\sqrt{21}}2.$$',
    solutionMethods: [
      {
        title: '方法一 · 单调有界准则',
        content: '递推式化为\n\n$$x_n=\\frac{3+4x_{n-1}}{1+x_{n-1}}=3+\\frac{x_{n-1}}{1+x_{n-1}}.$$\n\n由 $x_1=2$ 得 $x_2=11/3>x_1>0$。若 $x_k>x_{k-1}>0$，则\n\n$$x_{k+1}-x_k=\\frac{x_k-x_{k-1}}{(1+x_k)(1+x_{k-1})}>0,$$\n\n故数列递增。又 $x_n=3+x_{n-1}/(1+x_{n-1})<4$，所以有上界，极限存在。设极限为 $A>0$，则 $A=(3+4A)/(1+A)$，即 $A^2-3A-3=0$，取正根得到 $(3+\\sqrt{21})/2$。'
      },
      {
        title: '方法二 · 不动点误差复核',
        content: '令 $g(x)=(3+4x)/(1+x)$，正不动点为 $A=(3+\\sqrt{21})/2$。对 $x>0$，\n\n$$g\\prime(x)=\\frac1{(1+x)^2}\\in(0,1).$$\n\n因此 $g$ 在正半轴递增且为压缩映射；递推保持正性，并把相邻差按小于 $1$ 的比例压缩。结合已证的有界单调性，极限只能是唯一正不动点 $A$。'
      }
    ]
  })
]
