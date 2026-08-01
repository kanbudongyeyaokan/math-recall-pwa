import type { SeedInput } from './types'

const raw = String.raw
const ZY30_SOURCE = '何耀焜私人整理 · 张宇《基础30讲》高数 · 第16讲逐页核验'

type LectureSixteenSeed = Omit<SeedInput, 'id' | 'kind' | 'tags' | 'methodFingerprint' | 'source' | 'solutionMethods'> & {
  id: string
  role: 'example' | 'exercise'
  tags: string[]
  fingerprint: string
  methodOne: string
  methodTwo: string
}

function lectureSixteen(input: LectureSixteenSeed): SeedInput {
  const { id, role, tags, fingerprint, methodOne, methodTwo, ...seed } = input
  return {
    ...seed,
    id: `zy30-verified-l16-${id}`,
    kind: 'problem',
    source: ZY30_SOURCE,
    tags: ['高等数学', '第16讲', ...tags, role === 'example' ? '经典例题' : '课后习题', 'PDF逐页核验'],
    methodFingerprint: `zy30-verified:l16:${fingerprint}`,
    solutionMethods: [
      { title: '方法一 · 原书主线', content: methodOne },
      { title: '方法二 · 独立复核', content: methodTwo }
    ]
  }
}

export const foundation30Lecture16ExpansionSeeds: SeedInput[] = [
  lectureSixteen({
    id: 'example-16-1-telescoping-difference', role: 'example', page: 'PDF 419 · 书页 414 · 例 16.1',
    fingerprint: 'series:successive-difference-telescoping-limit-equivalence',
    title: '例 16.1 · 相邻差级数与数列极限的等价关系',
    statement: raw`证明：
$$\sum_{n=1}^{\infty}(u_{n+1}-u_n)\text{ 收敛}\Longleftrightarrow \lim_{n\to\infty}u_n\text{ 存在}. $$`,
    tags: ['数项级数', '裂项相消', '证明题'],
    coreMethod: '直接写出前 $N$ 项部分和，所有中间项相消后只剩 $u_{N+1}-u_1$。',
    mistakes: '不能只说“看起来能相消”；必须把级数收敛转化为部分和数列存在有限极限。',
    answerText: '该命题成立，二者都等价于数列 $u_{N+1}-u_1$ 存在有限极限。',
    methodOne: raw`前 $N$ 项部分和为
$$S_N=\sum_{n=1}^{N}(u_{n+1}-u_n)=u_{N+1}-u_1.$$
因此 $S_N$ 存在有限极限，当且仅当 $u_{N+1}$ 存在有限极限，也就当且仅当 $u_n$ 收敛。`,
    methodTwo: raw`若 $u_n\to L$，则 $S_N=u_{N+1}-u_1\to L-u_1$，级数收敛；反之若 $S_N\to S$，由 $u_{N+1}=S_N+u_1$ 得 $u_{N+1}\to S+u_1$，故 $u_n$ 收敛。`
  }),
  lectureSixteen({
    id: 'example-16-2-even-partial-sums', role: 'example', page: 'PDF 419-420 · 书页 414-415 · 例 16.2',
    fingerprint: 'series:even-partial-sums-plus-term-zero-implies-full-convergence',
    title: '例 16.2 · 由偶数部分和推出级数收敛',
    statement: raw`设级数 $\sum_{n=1}^{\infty}u_n$ 的部分和为 $S_n$。若
$$\lim_{n\to\infty}u_n=0,\qquad \lim_{n\to\infty}S_{2n}=S,$$
证明 $\sum_{n=1}^{\infty}u_n=S$。`,
    tags: ['数项级数', '部分和子列', '证明题'],
    coreMethod: '偶数部分和已有极限，只需利用 $S_{2n+1}=S_{2n}+u_{2n+1}$ 控制奇数部分和。',
    mistakes: '仅有偶数部分和收敛并不足够；必须使用通项趋零，才能排除奇偶部分和极限不同。',
    answerText: '奇、偶部分和都趋于 $S$，所以完整部分和数列 $S_n\to S$。',
    methodOne: raw`由 $u_n\to0$ 得 $u_{2n+1}\to0$。于是
$$S_{2n+1}=S_{2n}+u_{2n+1}\longrightarrow S+0=S.$$
部分和的奇、偶子列同趋于 $S$，故 $S_n\to S$。`,
    methodTwo: raw`给定 $\varepsilon>0$，取充分大的 $N$，使 $|S_{2n}-S|<\varepsilon/2$ 且 $|u_{2n+1}|<\varepsilon/2$。偶数指标直接满足估计，奇数指标由三角不等式也有 $|S_{2n+1}-S|<\varepsilon$。`
  }),
  lectureSixteen({
    id: 'example-16-4-log-harmonic-convergence', role: 'example', page: 'PDF 421 · 书页 416 · 例 16.4',
    fingerprint: 'positive-series:log-telescoping-versus-harmonic-comparison-choice',
    title: '例 16.4 · 对数级数与调和级数的敛散判断',
    statement: raw`判断下列两级数的敛散性：
$$\sum_{n=1}^{\infty}\ln\left(1+\frac1n\right),\qquad \sum_{n=1}^{\infty}\frac1n.$$`,
    questionFormat: 'single-choice', options: ['两者都收敛', '前者收敛、后者发散', '前者发散、后者收敛', '两者都发散'], correctOptionIds: ['D'],
    tags: ['正项级数', '比较判别', '选择题'],
    coreMethod: raw`对数级数可把乘积化为和并望远镜相消，也可用 $\ln(1+x)<x$ 的方向配合比较判别。`,
    mistakes: raw`由 $\ln(1+1/n)<1/n$ 且调和级数发散，不能推出较小的级数发散。`,
    answerText: '正确选项为 D，两级数均发散。',
    methodOne: raw`对数级数的前 $N$ 项和为
$$\sum_{n=1}^{N}\ln\frac{n+1}{n}=\ln(N+1)\to+\infty,$$
故它发散；调和级数是标准发散级数，所以两者都发散。`,
    methodTwo: raw`由
$$\lim_{n\to\infty}\frac{\ln(1+1/n)}{1/n}=1$$
知前一正项级数与调和级数同敛散。调和级数发散，因此前者也发散。`
  }),
  lectureSixteen({
    id: 'example-16-5-square-series', role: 'example', page: 'PDF 422 · 书页 417 · 例 16.5',
    fingerprint: 'positive-series:convergence-implies-square-series-tail-comparison',
    title: '例 16.5 · 正项收敛级数的平方级数',
    statement: raw`设正项级数 $\sum_{n=1}^{\infty}a_n$ 收敛，证明级数
$$\sum_{n=1}^{\infty}a_n^2$$
也收敛。`,
    tags: ['正项级数', '比较判别', '证明题'],
    coreMethod: '收敛级数的通项趋零，因此尾部可令 $0<a_n<1$，从而 $a_n^2\le a_n$。',
    mistakes: '比较只需从某一项以后成立；有限个首项不会改变级数敛散性。',
    answerText: raw`级数 $\sum a_n^2$ 收敛。`,
    methodOne: raw`由 $\sum a_n$ 收敛得 $a_n\to0$。存在 $N$，当 $n\ge N$ 时 $0<a_n<1$，于是
$$0<a_n^2<a_n.$$
尾级数由比较判别收敛，加回有限个首项仍收敛。`,
    methodTwo: raw`收敛数列 $\{a_n\}$ 有界，设 $a_n\le M$。则 $a_n^2\le Ma_n$，而 $\sum Ma_n=M\sum a_n$ 收敛，故由比较判别得到结论。`
  }),
  lectureSixteen({
    id: 'example-16-6-product-series', role: 'example', page: 'PDF 422 · 书页 417 · 例 16.6',
    fingerprint: 'positive-series:geometric-mean-monotone-and-cauchy-product-bound',
    title: '例 16.6 · 正项级数乘积的两类收敛判定',
    statement: raw`证明：

1. 若 $\sum\sqrt{u_nu_{n+1}}$ 收敛且 $\{u_n\}$ 单调减少，则 $\sum u_n$ 收敛；
2. 若正项级数 $\sum u_n$ 与 $\sum v_n$ 都收敛，则 $\sum u_nv_n$ 收敛。`,
    tags: ['正项级数', '比较判别', '乘积级数'],
    coreMethod: '第一问利用单调性比较 $u_{n+1}$ 与几何平均；第二问用 $2uv\le u^2+v^2$ 或有界性比较。',
    mistakes: raw`第一问不能把 $u_n$ 直接与 $\sqrt{u_nu_{n+1}}$ 反向比较；应移动下标比较 $u_{n+1}$。`,
    answerText: '两项结论均成立。',
    methodOne: raw`单调减少给出 $u_{n+1}\le u_n$，故
$$u_{n+1}^2\le u_nu_{n+1},\qquad u_{n+1}\le\sqrt{u_nu_{n+1}},$$
所以第一问由比较判别成立。第二问中 $u_n,v_n\to0$，尾部均小于 $1$，故 $u_nv_n\le u_n$，从而收敛。`,
    methodTwo: raw`第一问对尾级数直接逐项比较。第二问由 $\sum u_n,\sum v_n$ 收敛可知 $\sum u_n^2,\sum v_n^2$ 收敛，再用
$$0<u_nv_n\le\frac{u_n^2+v_n^2}{2}$$
得到 $\sum u_nv_n$ 收敛。`
  }),
  lectureSixteen({
    id: 'example-16-7-root-defined-series', role: 'example', page: 'PDF 423 · 书页 418 · 例 16.7',
    fingerprint: 'positive-series:implicit-root-bound-by-one-over-n-p-series',
    title: '例 16.7 · 方程正根构成级数的比较判别',
    statement: raw`设 $x^n+nx-1=0$，其中 $n$ 为正整数。证明该方程存在唯一正实根 $x_n$，并证明当 $a>1$ 时
$$\sum_{n=1}^{\infty}x_n^a$$
收敛。`,
    tags: ['正项级数', '方程根', '比较判别'],
    coreMethod: '先用连续单调性确定正根唯一，再由方程得到 $0<x_n<1/n$。',
    mistakes: '只给出根存在而不证明唯一；或忽略参数条件 $a>1$，把所有幂次都判为收敛。',
    answerText: '正根唯一，且 $0<x_n<1/n$；因此 $a>1$ 时级数收敛。',
    methodOne: raw`令 $f_n(x)=x^n+nx-1$。在 $[0,1]$ 上 $f_n(0)=-1,f_n(1)=n>0$，且 $f_n'(x)=nx^{n-1}+n>0$，故唯一正根 $x_n\in(0,1)$。由方程
$$x_n=\frac{1-x_n^n}{n}<\frac1n,$$
故 $x_n^a<n^{-a}$，而 $a>1$ 时 $p$ 级数收敛。`,
    methodTwo: raw`函数严格递增保证零点唯一。把零点方程写成 $nx_n=1-x_n^n$，右端位于 $(0,1)$，立即得到 $0<x_n<1/n$；再用极限比较上界即可。`
  }),
  lectureSixteen({
    id: 'example-16-8-sine-log-parameter', role: 'example', page: 'PDF 423-424 · 书页 418-419 · 例 16.8',
    fingerprint: 'positive-series:sine-small-angle-log-over-n-alpha-threshold',
    title: '例 16.8 · 含参数正弦级数的收敛阈值',
    statement: raw`设 $\alpha>0$。讨论级数
$$\sum_{n=2}^{\infty}\sin\left(n^{-\alpha}\ln n\right)$$
的敛散性。`,
    questionFormat: 'single-choice', options: [raw`$\alpha\le1$ 时收敛`, raw`$\alpha<1$ 时收敛`, raw`$\alpha\ge1$ 时收敛`, raw`$\alpha>1$ 时收敛`], correctOptionIds: ['D'],
    tags: ['正项级数', '等价无穷小', '选择题'],
    coreMethod: raw`先确认角度最终为正且趋零，再用 $\sin t\sim t$ 化为 $\sum(\ln n)/n^\alpha$。`,
    mistakes: raw`边界 $\alpha=1$ 时 $\sum(\ln n)/n$ 发散，不能把等号包含在收敛范围。`,
    answerText: raw`正确选项为 D，当且仅当 $\alpha>1$ 时收敛。`,
    methodOne: raw`因 $(\ln n)/n^\alpha\to0$，有
$$\sin\left(\frac{\ln n}{n^\alpha}\right)\sim\frac{\ln n}{n^\alpha}.$$
当 $0<\alpha\le1$ 时它最终大于 $1/n$ 的常数倍而发散；当 $\alpha>1$ 时取 $0<\varepsilon<\alpha-1$，有 $\ln n=o(n^\varepsilon)$，故与收敛的 $p$ 级数比较。`,
    methodTwo: raw`对 $\sum(\ln n)/n^\alpha$ 使用积分判别：
$$\int_2^{\infty}\frac{\ln x}{x^\alpha}dx$$
当且仅当 $\alpha>1$ 收敛。小角等价保证原级数具有完全相同的敛散性。`
  }),
  lectureSixteen({
    id: 'example-16-9-limit-parameter', role: 'example', page: 'PDF 424 · 书页 419 · 例 16.9',
    fingerprint: 'positive-series:limit-condition-reduces-to-p-minus-one-series',
    title: '例 16.9 · 由极限条件反推参数范围',
    statement: raw`设 $a_n>0,p>1$，且
$$\lim_{n\to\infty}n^p\left(e^{1/n}-1\right)a_n=1.$$
若级数 $\sum_{n=1}^{\infty}a_n$ 收敛，求 $p$ 的取值范围。`,
    tags: ['正项级数', '极限比较', '参数题'],
    coreMethod: '利用 $e^{1/n}-1\sim1/n$，把 $a_n$ 与 $1/n^{p-1}$ 建立等价关系。',
    mistakes: raw`指数上要减去一阶：$n^p(e^{1/n}-1)\sim n^{p-1}$，不是 $n^p$。`,
    answerText: raw`$$p\in(2,+\infty).$$`,
    methodOne: raw`由 $e^{1/n}-1\sim1/n$ 得
$$n^{p-1}a_n\to1,$$
即 $a_n\sim1/n^{p-1}$。原级数收敛要求 $p-1>1$，所以 $p>2$。`,
    methodTwo: raw`计算极限
$$\lim_{n\to\infty}\frac{a_n}{n^{1-p}}=1.$$
由正项级数极限比较判别，$\sum a_n$ 与 $\sum n^{-(p-1)}$ 同敛散，因此仍得 $p>2$。`
  }),
  lectureSixteen({
    id: 'example-16-11-factorial-threshold', role: 'example', page: 'PDF 425-426 · 书页 420-421 · 例 16.11',
    fingerprint: 'ratio-test:factorial-over-n-power-critical-e',
    title: '例 16.11 · 阶乘型级数的临界参数',
    statement: raw`设 $a>0$，讨论级数
$$\sum_{n=1}^{\infty}\frac{a^n n!}{n^n}$$
的敛散性。`,
    questionFormat: 'single-choice', options: ['$0<a<e$ 收敛，$a\ge e$ 发散', '$0<a<e$ 发散，$a\ge e$ 收敛', '所有 $a>0$ 均收敛', '所有 $a>0$ 均发散'], correctOptionIds: ['A'],
    tags: ['正项级数', '比值判别', '选择题'],
    coreMethod: '比值极限为 $a/e$；临界点 $a=e$ 必须另用通项不趋零处理。',
    mistakes: '比值极限等于 $1$ 时判别法失效，不能直接把 $a=e$ 归入收敛。',
    answerText: '正确选项为 A：$0<a<e$ 时收敛，$a\ge e$ 时发散。',
    methodOne: raw`令 $u_n=a^nn!/n^n$，则
$$\frac{u_{n+1}}{u_n}=a\left(\frac{n}{n+1}\right)^n\to\frac ae.$$
故 $a<e$ 收敛、$a>e$ 发散。$a=e$ 时该比值最终大于 $1$，通项单调增加且不趋零，所以发散。`,
    methodTwo: raw`由 Stirling 公式
$$\frac{a^nn!}{n^n}\sim\sqrt{2\pi n}\left(\frac ae\right)^n.$$
$a<e$ 时指数衰减保证收敛；$a=e$ 时通项约为 $\sqrt{2\pi n}$，不趋零；$a>e$ 更发散。`
  }),
  lectureSixteen({
    id: 'example-16-12-root-test-combination', role: 'example', page: 'PDF 426-427 · 书页 421-422 · 例 16.12',
    fingerprint: 'positive-series:split-exponential-small-term-and-cosine-root-test',
    title: '例 16.12 · 指数小量与高次余弦的组合级数',
    statement: raw`设 $a>0$，判断级数
$$\sum_{n=1}^{\infty}\left[e^{\frac{\sin^2(an)}{n^2}}+\left(\cos\frac1{\sqrt n}\right)^{n^2}-1\right]$$
的敛散性。`,
    questionFormat: 'single-choice', options: ['收敛', '发散', '敛散性与 $a$ 有关', '无法判断'], correctOptionIds: ['A'],
    tags: ['正项级数', '根值判别', '选择题'],
    coreMethod: '拆成两个非负级数：指数小量与 $1/n^2$ 比较，高次余弦对整个通项使用根值判别。',
    mistakes: '括号中的两个量都非负，不能期待相互抵消；应分别证明它们可求和。',
    answerText: '正确选项为 A，级数收敛。',
    methodOne: raw`第一部分满足
$$e^{\sin^2(an)/n^2}-1\sim\frac{\sin^2(an)}{n^2}\le\frac1{n^2},$$
故收敛。第二部分令 $v_n=(\cos n^{-1/2})^{n^2}$，则
$$\sqrt[n]{v_n}=(\cos n^{-1/2})^n\to e^{-1/2}<1,$$
由根值判别收敛。`,
    methodTwo: raw`利用 $\cos t\le e^{-t^2/2}$ 在小邻域内成立，可得第二项最终不超过 $e^{-n/2}$；第一项用 $e^x-1\le2x$ 的局部估计控制为 $2/n^2$，两部分均被收敛级数控制。`
  }),
  lectureSixteen({
    id: 'example-16-13-loglog-series', role: 'example', page: 'PDF 427 · 书页 422 · 例 16.13',
    fingerprint: 'integral-test:one-over-n-log-n-divergence',
    title: '例 16.13 · 对数边界级数的积分判别',
    statement: raw`判断级数
$$\sum_{n=2}^{\infty}\frac1{n\ln n}$$
的敛散性。`,
    tags: ['正项级数', '积分判别', '对数级数'],
    coreMethod: '取 $f(x)=1/(x\ln x)$，验证其在尾部正、连续、单调递减，再计算反常积分。',
    mistakes: '它虽然比调和级数小，但仍然发散；不能用“较小”直接判收敛。',
    answerText: '该级数发散。',
    methodOne: raw`函数 $f(x)=1/(x\ln x)$ 在 $[2,+\infty)$ 上正且单调递减，而
$$\int_2^{R}\frac{dx}{x\ln x}=\ln\ln R-\ln\ln2\to+\infty.$$
由积分判别，原级数发散。`,
    methodTwo: raw`用 Cauchy 凝聚判别：
$$2^k\frac1{2^k\ln2^k}=\frac1{k\ln2}.$$
凝聚后的级数是调和级数的常数倍，故发散，原级数也发散。`
  }),
  lectureSixteen({
    id: 'example-16-15-alternating-radical-log', role: 'example', page: 'PDF 428-429 · 书页 423-424 · 例 16.15',
    fingerprint: 'alternating-series:radical-minus-log-monotone-function',
    title: '例 16.15 · 根式减对数分母的交错级数',
    statement: raw`判断级数
$$\sum_{n=1}^{\infty}\frac{(-1)^n}{\sqrt n-\ln n}$$
的敛散性。`,
    tags: ['交错级数', '莱布尼茨判别', '单调性'],
    coreMethod: '把绝对值通项延拓为函数，证明从某一点起单调趋零，再用莱布尼茨判别。',
    mistakes: raw`分母 $\sqrt n-\ln n$ 的单调性不能凭直觉判断，应对连续函数求导。`,
    answerText: raw`该级数收敛；绝对值级数与 $\sum1/\sqrt n$ 同阶而发散，因此是条件收敛。`,
    methodOne: raw`令 $f(x)=1/(\sqrt x-\ln x)$。有 $f(x)\to0$，且当 $x>4$ 时
$$f'(x)=-\frac{\frac1{2\sqrt x}-\frac1x}{(\sqrt x-\ln x)^2}<0.$$
故通项幅值最终单调趋零，由莱布尼茨判别原级数收敛。又 $\sqrt n-\ln n\sim\sqrt n$，绝对值级数发散。`,
    methodTwo: raw`因 $(\ln n)/\sqrt n\to0$，
$$\frac1{\sqrt n-\ln n}\sim\frac1{\sqrt n}.$$
原级数可用 Dirichlet 判别：$(-1)^n$ 的部分和有界，幅值最终单调趋零；绝对值部分由极限比较发散。`
  }),
  lectureSixteen({
    id: 'example-16-16-parity-rationalization', role: 'example', page: 'PDF 429 · 书页 424 · 例 16.16',
    fingerprint: 'alternating-looking-series:rationalize-parity-split-divergent-positive-part',
    title: '例 16.16 · 含奇偶扰动分母的级数拆解',
    statement: raw`判断级数
$$\sum_{n=2}^{\infty}\frac{(-1)^n}{\sqrt n+(-1)^n}$$
的敛散性。`,
    tags: ['任意项级数', '有理化', '奇偶拆分'],
    coreMethod: '分母含交错项时先有理化，把原通项拆成真正的交错项与正项。',
    mistakes: '通项带 $(-1)^n$ 不等于标准交错级数；其绝对值序列并不单调，不能直接套莱布尼茨判别。',
    answerText: '原级数发散。',
    methodOne: raw`有理化得
$$\frac{(-1)^n}{\sqrt n+(-1)^n}=(-1)^n\frac{\sqrt n}{n-1}-\frac1{n-1}.$$
第一部分是收敛的交错级数，第二部分是发散的调和型正项级数，故原级数发散。`,
    methodTwo: raw`分别配对偶数项与后一奇数项。每一对的和含一个量级为 $-c/n$ 的主项，配对级数与负调和级数同阶，部分和趋向 $-\infty$，因此原级数发散。`
  }),
  lectureSixteen({
    id: 'example-16-17-conditional-subseries', role: 'example', page: 'PDF 432 · 书页 427 · 例 16.17',
    fingerprint: 'conditional-alternating:positive-negative-subseries-force-divergent-combination',
    title: '例 16.17 · 条件收敛交错级数的子级数组合',
    statement: raw`已知 $u_n>0$ 且交错级数
$$\sum_{n=1}^{\infty}(-1)^{n-1}u_n$$
条件收敛。判断级数 $\sum_{n=1}^{\infty}(u_{2n}-2u_{2n-1})$ 的敛散性。`,
    questionFormat: 'single-choice', options: ['发散', '绝对收敛', '条件收敛', '无法判断'], correctOptionIds: ['A'],
    tags: ['条件收敛', '子级数', '选择题'],
    coreMethod: '条件收敛意味着正项子级数与负项幅值子级数都发散，再把目标级数拆成它们的线性组合。',
    mistakes: '原交错级数收敛，不代表奇数项和偶数项分别收敛；条件收敛恰恰意味着二者分别发散。',
    answerText: '正确选项为 A，目标级数发散。',
    methodOne: raw`条件收敛给出
$$\sum u_{2n-1}=+\infty,\qquad \sum u_{2n}=+\infty,$$
且 $\sum(u_{2n-1}-u_{2n})$ 收敛。于是
$$\sum(u_{2n}-2u_{2n-1})=-\sum(u_{2n-1}-u_{2n})-\sum u_{2n-1},$$
右端第二项发散到 $-\infty$。`,
    methodTwo: raw`设 $A_N=\sum_{n=1}^{N}(u_{2n-1}-u_{2n})$，则 $A_N$ 有限收敛；而 $P_N=\sum_{n=1}^{N}u_{2n-1}\to+\infty$。目标部分和为 $-A_N-P_N$，故趋于 $-\infty$。`
  }),
  lectureSixteen({
    id: 'example-16-18-oscillatory-telescoping', role: 'example', page: 'PDF 432-433 · 书页 427-428 · 例 16.18',
    fingerprint: 'absolute-series:telescoping-radical-difference-bounded-sine',
    title: '例 16.18 · 根式差与有界振荡因子的绝对收敛',
    statement: raw`设 $k$ 为常数，判断级数
$$\sum_{n=1}^{\infty}\left(\frac1{\sqrt n}-\frac1{\sqrt{n+1}}\right)\sin(n+k)$$
的敛散性。`,
    questionFormat: 'single-choice', options: ['绝对收敛', '条件收敛', '发散', '敛散性与 $k$ 有关'], correctOptionIds: ['A'],
    tags: ['绝对收敛', '裂项相消', '选择题'],
    coreMethod: raw`先用 $|\sin(n+k)|\le1$ 去掉振荡，再判断正项根式差级数。`,
    mistakes: raw`不需要研究 $\sin(n+k)$ 的周期或参数 $k$；它只提供统一的绝对值上界。`,
    answerText: '正确选项为 A，对任意常数 $k$ 均绝对收敛。',
    methodOne: raw`有
$$\left|\left(\frac1{\sqrt n}-\frac1{\sqrt{n+1}}\right)\sin(n+k)\right|\le\frac1{\sqrt n}-\frac1{\sqrt{n+1}}.$$
右侧前 $N$ 项和为 $1-1/\sqrt{N+1}$，故收敛，原级数绝对收敛。`,
    methodTwo: raw`有理化得
$$\frac1{\sqrt n}-\frac1{\sqrt{n+1}}=\frac1{\sqrt{n(n+1)}(\sqrt{n+1}+\sqrt n)}=O(n^{-3/2}).$$
乘以有界正弦后仍被收敛的 $p$ 级数控制。`
  }),
  lectureSixteen({
    id: 'example-16-19-product-absolute', role: 'example', page: 'PDF 433-434 · 书页 428-429 · 例 16.19',
    fingerprint: 'series-product:weighted-absolute-times-weighted-conditional-bounded-factor',
    title: '例 16.19 · 两个加权级数推出乘积绝对收敛',
    statement: raw`若 $\sum_{n=1}^{\infty}n u_n$ 绝对收敛，且 $\sum_{n=1}^{\infty}v_n/n$ 条件收敛，判断 $\sum u_nv_n$ 的敛散性。`,
    questionFormat: 'single-choice', options: ['条件收敛', '绝对收敛', raw`$\sum(u_n+v_n)$ 收敛`, raw`$\sum(u_n+v_n)$ 发散`], correctOptionIds: ['B'],
    tags: ['绝对收敛', '乘积级数', '选择题'],
    coreMethod: '把乘积改写为 $(nu_n)(v_n/n)$，利用收敛级数通项有界。',
    mistakes: raw`$\sum v_n/n$ 条件收敛仍能推出通项 $v_n/n\to0$，从而该因子序列有界。`,
    answerText: raw`正确选项为 B，级数 $\sum u_nv_n$ 绝对收敛。`,
    methodOne: raw`由 $\sum v_n/n$ 收敛知 $v_n/n\to0$，故存在 $M>0$ 使 $|v_n/n|\le M$。于是
$$|u_nv_n|=|nu_n|\left|\frac{v_n}{n}\right|\le M|nu_n|.$$
而 $\sum|nu_n|$ 收敛，所以目标级数绝对收敛。`,
    methodTwo: raw`设 $a_n=nu_n,b_n=v_n/n$。题设给出 $\sum|a_n|<\infty$ 且 $b_n$ 有界，因此序列乘法算子 $a_n\mapsto a_nb_n$ 保持 $\ell^1$，即 $\sum|a_nb_n|<\infty$。`
  }),
  lectureSixteen({
    id: 'example-16-20-necessary-convergent-transform', role: 'example', page: 'PDF 434 · 书页 429 · 例 16.20',
    fingerprint: 'convergent-series:adjacent-sum-partial-sum-identity-choice',
    title: '例 16.20 · 收敛级数的相邻项组合',
    statement: raw`若数项级数 $\sum_{n=1}^{\infty}u_n$ 收敛，则下列级数中必收敛的是（ ）。`,
    questionFormat: 'single-choice',
    options: [raw`$\sum_{n=1}^{\infty}(-1)^n\dfrac{u_n}{n}$`, raw`$\sum_{n=1}^{\infty}u_n^2$`, raw`$\sum_{n=1}^{\infty}(u_{2n-1}-u_{2n})$`, raw`$\sum_{n=1}^{\infty}(u_n+u_{n+1})$`],
    correctOptionIds: ['D'], tags: ['数项级数', '部分和', '选择题'],
    coreMethod: '对每个候选写部分和；相邻和级数可直接化成原级数部分和与一个趋零边界项。',
    mistakes: '一般收敛不保证绝对收敛，所以平方、抽取后改号等操作不能无条件保持收敛。',
    answerText: '正确选项为 D。',
    methodOne: raw`设原级数部分和 $S_N\to S$。D 的前 $N$ 项和为
$$\sum_{n=1}^{N}(u_n+u_{n+1})=2S_N-u_1+u_{N+1}.$$
因 $u_{N+1}\to0$，该式趋于 $2S-u_1$，故必收敛。其余选项可由条件收敛级数构造反例。`,
    methodTwo: raw`把 D 拆为 $\sum u_n+\sum u_{n+1}$；后一尾级数只是删除原级数首项，仍收敛，因此二者之和收敛。A、B、C 均涉及不能由普通收敛保证的重排或绝对值强度。`
  }),
  lectureSixteen({
    id: 'example-16-21-p-range-conditional', role: 'example', page: 'PDF 436 · 书页 431 · 例 16.21',
    fingerprint: 'alternating-series:radical-difference-over-n-p-conditional-range',
    title: '例 16.21 · 根式差交错级数的条件收敛区间',
    statement: raw`求级数
$$\sum_{n=1}^{\infty}(-1)^{n+1}\frac{\sqrt{n+1}-\sqrt n}{n^p}$$
条件收敛时参数 $p$ 的范围。`,
    tags: ['交错级数', '条件收敛', '参数题'],
    coreMethod: '先用等价量判断绝对收敛阈值，再检查交错幅值趋零与最终单调的范围。',
    mistakes: '条件收敛必须同时满足“原级数收敛”和“绝对值级数发散”，两个边界要分别处理。',
    answerText: raw`$$-\frac12<p\le\frac12.$$`,
    methodOne: raw`幅值
$$a_n=\frac1{n^p(\sqrt{n+1}+\sqrt n)}\sim\frac1{2n^{p+1/2}}.$$
绝对收敛当 $p>1/2$。当 $p>-1/2$ 时 $a_n\to0$ 且最终单调减少，交错级数收敛；当 $p\le-1/2$ 时通项不趋零。故条件收敛范围为 $-1/2<p\le1/2$。`,
    methodTwo: raw`对绝对值部分用极限比较得到 $p+1/2>1$ 的阈值。对交错部分令
$$f(x)=x^p(\sqrt{x+1}+\sqrt x),$$
当 $p>-1/2$ 时 $f$ 最终递增且趋于无穷，所以 $1/f(n)$ 单调趋零。两条件取交集即得答案。`
  }),
  lectureSixteen({
    id: 'example-16-22-harmonic-coefficient-radius', role: 'example', page: 'PDF 442-443 · 书页 437-438 · 例 16.22',
    fingerprint: 'power-series:harmonic-number-coefficients-root-radius-one',
    title: '例 16.22 · 调和数作系数的幂级数半径',
    statement: raw`设
$$a_n=\sum_{k=1}^{n}\frac1k.$$
求幂级数 $\sum_{n=1}^{\infty}a_nx^n$ 的收敛半径。`,
    tags: ['幂级数', '收敛半径', '根值判别'],
    coreMethod: raw`用 $1<a_n<n$ 夹逼 $\sqrt[n]{a_n}$，再套 Cauchy-Hadamard 公式。`,
    mistakes: '系数 $a_n$ 发散不代表幂级数半径为零；关键是系数的 $n$ 次根增长率。',
    answerText: raw`$$R=1.$$`,
    methodOne: raw`对 $n\ge2$ 有 $1<a_n<n$，故
$$1\le\sqrt[n]{a_n}\le\sqrt[n]n\to1.$$
因此 $\lim\sqrt[n]{a_n}=1$，由根值公式得收敛半径 $R=1$。`,
    methodTwo: raw`已知 $a_n=H_n=\ln n+\gamma+o(1)$，于是
$$\sqrt[n]{a_n}=\exp\left(\frac{\ln a_n}{n}\right)\to1.$$
故 Cauchy-Hadamard 公式同样给出 $R=1$。`
  }),
  lectureSixteen({
    id: 'example-16-23-even-power-domain', role: 'example', page: 'PDF 443 · 书页 438 · 例 16.23',
    fingerprint: 'power-series:even-powers-alternating-odd-denominator-closed-endpoints',
    title: '例 16.23 · 偶次幂交错级数的收敛域',
    statement: raw`求幂级数
$$\sum_{n=1}^{\infty}\frac{(-1)^{n-1}}{2n-1}x^{2n}$$
的收敛域。`,
    tags: ['幂级数', '收敛域', '端点判别'],
    coreMethod: '把 $x^2$ 看作新变量求开区间，再把 $x=\pm1$ 分别代回原级数。',
    mistakes: '比值判别只给出 $|x|<1$；端点处是交错级数，不能漏掉。',
    answerText: raw`$$[-1,1].$$`,
    methodOne: raw`通项比值的绝对值趋于 $x^2$，故 $|x|<1$ 收敛、$|x|>1$ 发散。当 $x=\pm1$ 时都化为
$$\sum_{n=1}^{\infty}\frac{(-1)^{n-1}}{2n-1},$$
由莱布尼茨判别收敛，所以收敛域为 $[-1,1]$。`,
    methodTwo: raw`令 $t=x^2$，得到关于 $t$ 的幂级数 $\sum(-1)^{n-1}t^n/(2n-1)$，半径为 $1$。$t=1$ 条件收敛，而实变量 $t=x^2$ 只有端点 $x=\pm1$，故两端都包含。`
  }),
  lectureSixteen({
    id: 'example-16-24-integration-domain', role: 'example', page: 'PDF 443-444 · 书页 438-439 · 例 16.24',
    fingerprint: 'power-series:termwise-integration-changes-one-endpoint',
    title: '例 16.24 · 逐项积分前后的收敛域变化',
    statement: raw`设
$$f(x)=\sum_{n=0}^{\infty}x^n,\qquad g(x)=\int_0^x f(t)dt.$$
判断 $f(x)$ 与 $g(x)$ 的收敛域。`,
    questionFormat: 'single-choice', options: ['均为 $(-1,1)$', '$(-1,1)$ 与 $[-1,1)$', '$[-1,1)$ 与 $(-1,1)$', '均为 $[-1,1)$'], correctOptionIds: ['B'],
    tags: ['幂级数', '逐项积分', '选择题'],
    coreMethod: '逐项积分保持半径但可能改变端点；必须把两个端点代入新级数。',
    mistakes: '“积分不改变收敛半径”不等于“积分不改变收敛域”，端点可能由发散变为收敛。',
    answerText: '正确选项为 B：$f$ 的收敛域为 $(-1,1)$，$g$ 的收敛域为 $[-1,1)$。',
    methodOne: raw`几何级数 $f$ 在 $|x|<1$ 收敛，两端均发散。逐项积分得
$$g(x)=\sum_{n=0}^{\infty}\frac{x^{n+1}}{n+1}.$$
$x=1$ 时为调和级数发散，$x=-1$ 时为交错调和级数收敛，故 $g$ 的收敛域为 $[-1,1)$。`,
    methodTwo: raw`在开区间内 $g(x)=-\ln(1-x)$。半径仍为 $1$；端点 $-1$ 处原级数给出 $-\ln2$ 的交错和，端点 $1$ 处函数具有对数发散，结论相同。`
  }),
  lectureSixteen({
    id: 'example-16-25-exponential-parameter-domain', role: 'example', page: 'PDF 444 · 书页 439 · 例 16.25',
    fingerprint: 'functional-series:factorial-over-nn-exponential-parameter-left-endpoint',
    title: '例 16.25 · 含指数参数级数的收敛区间',
    statement: raw`已知级数
$$\sum_{n=1}^{\infty}\frac{n!}{n^n}e^{-nx}$$
的收敛域为 $(a,+\infty)$，求 $a$。`,
    tags: ['函数项级数', '比值判别', '端点判别'],
    coreMethod: '对含 $x$ 的通项作比值判别得到开区间，再单独检查临界点。',
    mistakes: '比值极限等于 $1$ 的端点不能直接包含；本题端点通项不趋零。',
    answerText: raw`$$a=-1.$$`,
    methodOne: raw`设通项为 $u_n(x)$，则
$$\left|\frac{u_{n+1}}{u_n}\right|=\left(\frac n{n+1}\right)^ne^{-x}\to e^{-x-1}.$$
故 $x>-1$ 收敛、$x<-1$ 发散。$x=-1$ 时比值最终大于 $1$，通项不趋零，所以收敛域为 $(-1,+\infty)$。`,
    methodTwo: raw`由 Stirling 公式
$$\frac{n!}{n^n}e^{-nx}\sim\sqrt{2\pi n}\,e^{-n(x+1)}.$$
当 $x>-1$ 指数衰减，当 $x=-1$ 通项约为 $\sqrt{2\pi n}$，当 $x<-1$ 指数增长，因此左端点为 $-1$。`
  }),
  lectureSixteen({
    id: 'example-16-26-shift-derivative-radius', role: 'example', page: 'PDF 444-445 · 书页 439-440 · 例 16.26',
    fingerprint: 'power-series:center-shift-derivative-interior-absolute-convergence',
    title: '例 16.26 · 平移与逐项求导后的绝对收敛',
    statement: raw`若幂级数
$$\sum_{n=1}^{\infty}a_n(x+1)^n$$
在 $x=1$ 处条件收敛，判断级数 $\sum_{n=1}^{\infty}na_n(x-1)^n$ 在 $x=2$ 处的敛散性。`,
    questionFormat: 'single-choice', options: ['绝对收敛', '条件收敛', '发散', '无法判断'], correctOptionIds: ['A'],
    tags: ['幂级数', '逐项求导', '选择题'],
    coreMethod: '由条件收敛点确定半径，再把中心平移并逐项求导；半径保持不变。',
    mistakes: '平移中心会改变区间位置但不改变半径；逐项求导也不改变半径。',
    answerText: '正确选项为 A，在 $x=2$ 处绝对收敛。',
    methodOne: raw`原级数中心为 $-1$，在 $x=1$ 条件收敛，故半径 $R=2$。将中心平移到 $1$ 后，$\sum a_n(x-1)^n$ 的半径仍为 $2$；逐项求导再乘 $(x-1)$ 得 $\sum na_n(x-1)^n$，半径仍为 $2$。$x=2$ 距中心为 $1<2$，故绝对收敛。`,
    methodTwo: raw`条件收敛点必在原幂级数端点，因此 $R=|1-(-1)|=2$。所有有限次平移、逐项求导与乘一次 $(x-1)$ 都保持收敛半径；目标点严格位于新收敛圆内部，所以必绝对收敛。`
  }),
  lectureSixteen({
    id: 'example-16-27-sum-of-two-power-series', role: 'example', page: 'PDF 445 · 书页 440 · 例 16.27',
    fingerprint: 'power-series:intersection-of-logharmonic-and-geometric-radii-endpoints',
    title: '例 16.27 · 两个不同半径幂级数之和的收敛域',
    statement: raw`求幂级数
$$\sum_{n=2}^{\infty}\left(\frac1{n\ln n}+\frac1{2^n}\right)x^n$$
的收敛域。`,
    tags: ['幂级数', '收敛域', '端点判别'],
    coreMethod: '分别求两个幂级数的收敛域，再取交集；较小半径决定整体半径。',
    mistakes: '不能把系数和强行拆成一个简单极限后忽略端点；端点由半径较小的部分决定。',
    answerText: raw`$$[-1,1).$$`,
    methodOne: raw`第一部分 $\sum x^n/(n\ln n)$ 的半径为 $1$，在 $x=1$ 发散、$x=-1$ 由莱布尼茨判别收敛，收敛域为 $[-1,1)$。第二部分 $\sum(x/2)^n$ 的收敛域为 $(-2,2)$。取交集得 $[-1,1)$。`,
    methodTwo: raw`因 $2^{-n}=o(1/(n\ln n))$，总系数与 $1/(n\ln n)$ 等价，故半径为 $1$。在 $x=1$ 总项全正且第一部分发散；在 $x=-1$ 两部分分别收敛，所以答案相同。`
  }),
  lectureSixteen({
    id: 'example-16-28-harmonic-generating-function', role: 'example', page: 'PDF 449 · 书页 444 · 例 16.28',
    fingerprint: 'power-series:harmonic-numbers-cauchy-product-generating-function',
    title: '例 16.28 · 调和数幂级数的和函数',
    statement: raw`求幂级数
$$\sum_{n=1}^{\infty}\left(1+\frac12+\cdots+\frac1n\right)x^n$$
的和函数。`,
    tags: ['幂级数', '和函数', 'Cauchy乘积'],
    coreMethod: '把调和数识别成两个已知幂级数的 Cauchy 乘积系数。',
    mistakes: '调和数下标与乘积卷积下标容易错一位；最后还要注明 $|x|<1$。',
    answerText: raw`$$S(x)=\frac{-\ln(1-x)}{1-x},\qquad |x|<1.$$`,
    methodOne: raw`利用
$$-\ln(1-x)=\sum_{n=1}^{\infty}\frac{x^n}{n},\qquad \frac1{1-x}=\sum_{n=0}^{\infty}x^n.$$
两式作 Cauchy 乘积后，$x^n$ 的系数正是 $\sum_{k=1}^{n}1/k$，故得到答案。`,
    methodTwo: raw`设 $H_n=\sum_{k=1}^{n}1/k$，则 $H_n-H_{n-1}=1/n$。令 $S=\sum_{n\ge1}H_nx^n$，有
$$S-xS=\sum_{n\ge1}(H_n-H_{n-1})x^n=-\ln(1-x),$$
所以 $S=-\ln(1-x)/(1-x)$。`
  }),
  lectureSixteen({
    id: 'example-16-29-ode-tail-coefficients', role: 'example', page: 'PDF 449-450 · 书页 444-445 · 例 16.29',
    fingerprint: 'power-series:ode-solution-tail-integral-geometric-coefficient-sum',
    title: '例 16.29 · 微分方程解的积分尾项级数',
    statement: raw`设 $f$ 满足
$$f''+2f'+5f=0,\qquad f(0)=1,\quad f'(0)=-1.$$
令 $a_n=\int_{n\pi}^{+\infty}f(x)dx$，求 $\sum_{n=1}^{\infty}a_n$。`,
    tags: ['微分方程', '级数求和', '几何级数'],
    coreMethod: '先解常系数微分方程，再计算尾积分，把 $a_n$ 化为等比数列。',
    mistakes: '积分下限是 $n\pi$，代入三角函数时必须正确处理 $\cos2n\pi$ 与 $\sin2n\pi$。',
    answerText: raw`$$\sum_{n=1}^{\infty}a_n=\frac1{5(e^{\pi}-1)}.$$`,
    methodOne: raw`特征根为 $-1\pm2i$，由初值得 $f(x)=e^{-x}\cos2x$。计算
$$a_n=\int_{n\pi}^{\infty}e^{-x}\cos2x,dx=\frac{e^{-n\pi}}5.$$
因此
$$\sum_{n=1}^{\infty}a_n=\frac15\sum_{n=1}^{\infty}e^{-n\pi}=\frac1{5(e^\pi-1)}.$$`,
    methodTwo: raw`先求尾积分函数 $A(t)=\int_t^\infty f(x)dx=e^{-t}(\cos2t-2\sin2t)/5$。取 $t=n\pi$ 得 $A(n\pi)=e^{-n\pi}/5$，直接按首项 $e^{-\pi}/5$、公比 $e^{-\pi}$ 求和。`
  }),
  lectureSixteen({
    id: 'example-16-30-log-sum', role: 'example', page: 'PDF 450 · 书页 445 · 例 16.30',
    fingerprint: 'power-series:integrate-geometric-to-logarithm',
    title: raw`例 16.30 · $\sum x^n/n$ 的和函数`,
    statement: raw`求级数
$$\sum_{n=1}^{\infty}\frac{x^n}{n}$$
的和函数与收敛域。`,
    tags: ['幂级数', '逐项求导', '和函数'],
    coreMethod: '对和函数逐项求导，化为几何级数，再由 $S(0)=0$ 积分还原。',
    mistakes: '和函数公式只在对应收敛域内成立；$x=1$ 发散而 $x=-1$ 收敛。',
    answerText: raw`$$S(x)=-\ln(1-x),\qquad x\in[-1,1).$$`,
    methodOne: raw`在 $|x|<1$ 内
$$S'(x)=\sum_{n=1}^{\infty}x^{n-1}=\frac1{1-x}.$$
由 $S(0)=0$ 得 $S(x)=-\ln(1-x)$。端点 $x=-1$ 为交错调和级数，$x=1$ 为调和级数，故收敛域为 $[-1,1)$。`,
    methodTwo: raw`从几何级数 $1/(1-t)=\sum_{n=0}^\infty t^n$ 出发，在 $0$ 到 $x$ 上逐项积分：
$$\int_0^x\frac{dt}{1-t}=\sum_{n=0}^{\infty}\frac{x^{n+1}}{n+1}.$$
左侧为 $-\ln(1-x)$，再独立检查两个端点。`
  }),
  lectureSixteen({
    id: 'example-16-31-nx-power-sum', role: 'example', page: 'PDF 450 · 书页 445 · 例 16.31',
    fingerprint: 'power-series:differentiate-geometric-for-nx-n',
    title: raw`例 16.31 · $\sum nx^n$ 的和函数`,
    statement: raw`求级数
$$\sum_{n=1}^{\infty}nx^n$$
的和函数。`,
    tags: ['幂级数', '逐项求导', '和函数'],
    coreMethod: raw`系数 $n$ 在分子，先对几何级数求导，再乘回一个 $x$。`,
    mistakes: raw`对 $\sum x^n$ 求导得到的是 $\sum nx^{n-1}$，还需乘 $x$ 才与题目一致。`,
    answerText: raw`$$\sum_{n=1}^{\infty}nx^n=\frac{x}{(1-x)^2},\qquad |x|<1.$$`,
    methodOne: raw`在 $|x|<1$ 内
$$\sum_{n=0}^{\infty}x^n=\frac1{1-x}.$$
逐项求导得 $\sum_{n=1}^{\infty}nx^{n-1}=1/(1-x)^2$，两边乘 $x$ 即得结论。`,
    methodTwo: raw`设 $S=\sum_{n\ge1}nx^n$。则
$$S-xS=x+x^2+x^3+\cdots=\frac{x}{1-x},$$
所以 $(1-x)S=x/(1-x)$，从而 $S=x/(1-x)^2$。`
  }),
  lectureSixteen({
    id: 'example-16-32-arctan-sum', role: 'example', page: 'PDF 452 · 书页 447 · 例 16.32',
    fingerprint: 'power-series:odd-denominator-even-powers-arctangent',
    title: '例 16.32 · 奇数分母偶次幂级数的和函数',
    statement: raw`求幂级数
$$\sum_{n=1}^{\infty}\frac{(-1)^{n-1}}{2n-1}x^{2n}$$
的和函数。`,
    tags: ['幂级数', '反正切展开', '和函数'],
    coreMethod: '先提出一个 $x$，让剩余级数成为 $\arctan x$ 的标准展开。',
    mistakes: '原级数从 $x^{2n}$ 开始，答案是 $x\arctan x$，不能漏掉外面的 $x$。',
    answerText: raw`$$S(x)=x\arctan x,\qquad -1\le x\le1.$$`,
    methodOne: raw`由
$$\arctan x=\sum_{n=1}^{\infty}\frac{(-1)^{n-1}}{2n-1}x^{2n-1}$$
在 $[-1,1]$ 上成立，两边乘 $x$ 即得 $S(x)=x\arctan x$。`,
    methodTwo: raw`对 $S(x)/x$ 逐项求导可得
$$\left(\frac{S(x)}x\right)'=\sum_{n=1}^{\infty}(-1)^{n-1}x^{2n-2}=\frac1{1+x^2}.$$
结合 $S(x)/x\to0$ 得 $S(x)/x=\arctan x$。`
  }),
  lectureSixteen({
    id: 'example-16-33-recurrence-sum-ode', role: 'example', page: 'PDF 452-453 · 书页 447-448 · 例 16.33',
    fingerprint: 'power-series:coefficient-recurrence-build-first-order-ode',
    title: '例 16.33 · 系数递推关系构造和函数微分方程',
    statement: raw`数列 $\{a_n\}$ 满足
$$a_1=1,\qquad (n+1)a_{n+1}=\left(n+\frac12\right)a_n.$$
证明 $|x|<1$ 时 $\sum_{n=1}^{\infty}a_nx^n$ 收敛，并求其和函数。`,
    tags: ['幂级数', '递推数列', '微分方程法'],
    coreMethod: '先用系数比求半径，再对和函数逐项求导，把递推式翻译成一阶线性微分方程。',
    mistakes: '从递推式换下标时常漏掉首项 $a_1=1$，这会改变微分方程右端。',
    answerText: raw`$$S(x)=2\left(\frac1{\sqrt{1-x}}-1\right),\qquad |x|<1.$$`,
    methodOne: raw`由 $a_{n+1}/a_n=(n+1/2)/(n+1)\to1$，半径为 $1$。令 $S=\sum_{n\ge1}a_nx^n$，则
$$S'=1+\sum_{n\ge1}(n+1)a_{n+1}x^n=1+xS'+\frac12S.$$
解方程 $(1-x)S'-S/2=1$ 并用 $S(0)=0$，得答案。`,
    methodTwo: raw`递推可解为 $a_n=2\binom{2n}{n}/4^n$ 的等价系数形式。利用
$$\frac1{\sqrt{1-x}}=\sum_{n=0}^{\infty}\binom{2n}{n}\frac{x^n}{4^n}$$
并去掉常数项，得到同一和函数。`
  }),
  lectureSixteen({
    id: 'example-16-34-integral-ratio-sum', role: 'example', page: 'PDF 453-454 · 书页 448-449 · 例 16.34',
    fingerprint: 'series:beta-integral-recurrence-ratio-to-log-sum',
    title: '例 16.34 · 两类积分之比构成的交错级数',
    statement: raw`设
$$a_n=\int_0^1x^n\sqrt{1-x^2},dx,\qquad b_n=\int_0^{\pi/2}\sin^nt,dt.$$
计算 $\sum_{n=1}^{\infty}(-1)^n a_n/b_n$。`,
    tags: ['级数求和', 'Wallis公式', '积分换元'],
    coreMethod: raw`先用 $x=\sin t$ 和 Wallis 递推把积分比化为 $1/(n+2)$，再求交错有理级数。`,
    mistakes: raw`换元后 $\sqrt{1-x^2}dx$ 会产生 $\cos^2t$，不是只剩一个余弦因子。`,
    answerText: raw`$$\frac12-\ln2.$$`,
    methodOne: raw`令 $x=\sin t$，则
$$a_n=\int_0^{\pi/2}\sin^nt\cos^2t,dt=b_n-b_{n+2}.$$
由 Wallis 递推 $b_{n+2}=(n+1)b_n/(n+2)$，故 $a_n/b_n=1/(n+2)$。于是
$$\sum_{n=1}^{\infty}\frac{(-1)^n}{n+2}=\frac12-\ln2.$$`,
    methodTwo: raw`把目标级数下标平移为
$$\sum_{m=3}^{\infty}\frac{(-1)^m}{m}.$$
已知 $\sum_{m=1}^{\infty}(-1)^{m-1}/m=\ln2$，减去前两项并整理符号，得到 $1/2-\ln2$。`
  }),
  lectureSixteen({
    id: 'example-16-35-equivalent-infinitesimals', role: 'example', page: 'PDF 455 · 书页 450 · 例 16.35',
    fingerprint: 'power-series:integral-composite-versus-odd-series-leading-term-equivalence',
    title: '例 16.35 · 用首个非零幂次判断等价无穷小',
    statement: raw`设
$$f(x)=\int_0^{\sin x}\sin(t^2)dt,\qquad g(x)=\sum_{n=1}^{\infty}\frac{x^{2n+1}}{n^2+2}.$$
当 $x\to0$ 时，判断 $f(x)$ 与 $g(x)$ 的无穷小关系。`,
    questionFormat: 'single-choice', options: ['高阶无穷小', '低阶无穷小', '等价无穷小', '同阶但不等价'], correctOptionIds: ['C'],
    tags: ['函数展开', '等价无穷小', '选择题'],
    coreMethod: '只需找到两式的首个非零幂次及系数，再比较比值。',
    mistakes: raw`级数 $g$ 的首项从 $n=1$ 开始，是 $x^3/3$；积分上限的复合不能漏掉 $\sin x\sim x$。`,
    answerText: raw`正确选项为 C，$f(x)\sim g(x)\sim x^3/3$。`,
    methodOne: raw`因 $\sin(t^2)\sim t^2$ 且 $\sin x\sim x$，
$$f(x)\sim\int_0^{\sin x}t^2dt\sim\frac{x^3}{3}.$$
另一方面 $g(x)=x^3/3+O(x^5)$，所以 $f(x)/g(x)\to1$。`,
    methodTwo: raw`对比值使用洛必达：
$$\frac{f'(x)}{g'(x)}=\frac{\sin(\sin^2x)\cos x}{\sum_{n\ge1}(2n+1)x^{2n}/(n^2+2)}.$$
分子与分母都以 $x^2$ 为首项且系数为 $1$，故极限为 $1$。`
  }),
  lectureSixteen({
    id: 'example-16-36-log-factorization', role: 'example', page: 'PDF 455-456 · 书页 450-451 · 例 16.36',
    fingerprint: 'power-series:factor-one-plus-x-cubed-log-difference-expansion',
    title: '例 16.36 · 因式分解后的对数幂级数展开',
    statement: raw`把函数
$$f(x)=\ln(1-x+x^2)$$
展开成关于 $x$ 的幂级数。`,
    tags: ['函数展开', '对数级数', '因式分解'],
    coreMethod: raw`利用 $1+x^3=(1+x)(1-x+x^2)$，把目标对数化成两个标准 $\ln(1+u)$ 展开之差。`,
    mistakes: '题目要求按 $x$ 的幂展开，不能把 $-x+x^2$ 整体当成最终变量而不继续展开。',
    answerText: raw`$$\ln(1-x+x^2)=\sum_{n=1}^{\infty}(-1)^{n-1}\frac{x^{3n}-x^n}{n},\qquad -1<x\le1.$$`,
    methodOne: raw`由 $1+x^3=(1+x)(1-x+x^2)$，
$$\ln(1-x+x^2)=\ln(1+x^3)-\ln(1+x).$$
分别代入 $\ln(1+u)=\sum_{n\ge1}(-1)^{n-1}u^n/n$，相减即得展开式，并检查端点得 $-1<x\le1$。`,
    methodTwo: raw`先求导：
$$f'(x)=\frac{2x-1}{x^2-x+1}.$$
把分母利用三次根或几何级数分解后逐项积分，也会得到只有 $x^n$ 与 $x^{3n}$ 组合的同一系数；由 $f(0)=0$ 确定积分常数。`
  }),
  lectureSixteen({
    id: 'example-16-37-arctangent-transform', role: 'example', page: 'PDF 456-457 · 书页 451-452 · 例 16.37',
    fingerprint: 'power-series:arctangent-mobius-transform-differentiate-integrate',
    title: '例 16.37 · 分式复合反正切的幂级数展开',
    statement: raw`将函数
$$f(x)=\arctan\frac{1+x}{1-x}$$
展开为 $x$ 的幂级数。`,
    tags: ['函数展开', '反正切级数', '复合函数'],
    coreMethod: raw`直接展开不方便，先求导化为 $1/(1+x^2)$，逐项积分后用 $f(0)=\pi/4$ 定常数。`,
    mistakes: '在 $x=1$ 原函数无定义，即使形式级数在该点收敛也不能把展开区间延伸过去。',
    answerText: raw`$$\arctan\frac{1+x}{1-x}=\frac\pi4+\sum_{n=0}^{\infty}\frac{(-1)^n}{2n+1}x^{2n+1},\qquad -1\le x<1.$$`,
    methodOne: raw`求导并化简得
$$f'(x)=\frac1{1+x^2}=\sum_{n=0}^{\infty}(-1)^nx^{2n},\qquad |x|<1.$$
从 $0$ 到 $x$ 逐项积分，再用 $f(0)=\pi/4$，得到展开式；检查端点后为 $[-1,1)$。`,
    methodTwo: raw`在 $-1<x<1$ 上使用恒等式
$$\arctan\frac{1+x}{1-x}=\frac\pi4+\arctan x.$$
代入 $\arctan x$ 的标准展开，并利用 $x=-1$ 处右连续、$x=1$ 处原函数无定义，得到相同区间。`
  }),
  lectureSixteen({
    id: 'example-16-38-cosine-series-periodic-value', role: 'example', page: 'PDF 460 · 书页 455 · 例 16.38',
    fingerprint: 'fourier:cosine-even-extension-periodic-shift-jump-average',
    title: '例 16.38 · 余弦级数在周期延拓跳点的和值',
    statement: raw`设
$$f(x)=\begin{cases}x,&0\le x\le\frac12,\\2-2x,&\frac12<x\le1,
\end{cases}$$
且
$$S(x)=\frac{a_0}{2}+\sum_{n=1}^{\infty}a_n\cos(n\pi x),\qquad a_n=2\int_0^1f(x)\cos(n\pi x)dx.$$
求 $S(-5/2)$。`,
    tags: ['Fourier级数', '偶延拓', '间断点和值'],
    coreMethod: '余弦级数对应偶延拓再作周期为 $2$ 的延拓；先把自变量移回基本区间，再取左右极限平均。',
    mistakes: '不能把 $-5/2$ 直接代入原函数；必须先使用周期性与偶性定位对应跳点。',
    answerText: raw`$$S\left(-\frac52\right)=\frac34.$$`,
    methodOne: raw`$S$ 为周期 $2$ 的偶函数，故
$$S(-5/2)=S(-1/2)=S(1/2).$$
$x=1/2$ 是第一类间断点，左右极限分别为 $1/2$ 与 $1$，由狄利克雷收敛定理
$$S(1/2)=\frac{1/2+1}{2}=\frac34.$$`,
    methodTwo: raw`画出 $f$ 的偶延拓及周期延拓，$-5/2$ 与基本跳点 $1/2$ 同余。Fourier 级数在分段光滑函数的跳点收敛到两侧极限的算术平均，因此结果为 $3/4$。`
  }),
  lectureSixteen({
    id: 'example-16-39-cosine-series-sum', role: 'example', page: 'PDF 460-461 · 书页 455-456 · 例 16.39',
    fingerprint: 'fourier:cosine-expand-one-minus-x-square-evaluate-alternating-zeta-two',
    title: '例 16.39 · 余弦级数求交错平方倒数和',
    statement: raw`将 $f(x)=1-x^2 (0\le x\le\pi)$ 展开成余弦级数，并求
$$\sum_{n=1}^{\infty}\frac{(-1)^{n+1}}{n^2}.$$`,
    tags: ['Fourier级数', '余弦展开', '级数求和'],
    coreMethod: '作偶延拓，计算余弦系数；再选择 $x=0$ 代入展开式提取目标数值。',
    mistakes: '常数项是 $a_0/2$；两次分部积分后的系数符号与 $(-1)^n$ 容易写反。',
    answerText: raw`$$1-x^2=1-\frac{\pi^2}{3}+4\sum_{n=1}^{\infty}\frac{(-1)^{n+1}}{n^2}\cos nx,$$
且
$$\sum_{n=1}^{\infty}\frac{(-1)^{n+1}}{n^2}=\frac{\pi^2}{12}.$$`,
    methodOne: raw`偶延拓后 $b_n=0$，
$$a_0=\frac2\pi\int_0^\pi(1-x^2)dx=2\left(1-\frac{\pi^2}{3}\right),$$
两次分部积分得 $a_n=4(-1)^{n+1}/n^2$。取 $x=0$，由 $f(0)=1$ 解得目标和为 $\pi^2/12$。`,
    methodTwo: raw`已知 $\sum_{n\ge1}1/n^2=\pi^2/6$，偶数项和为 $\pi^2/24$，奇数项和为 $\pi^2/8$。交错和等于奇数项和减偶数项和，即 $\pi^2/12$，与 Fourier 展开复核一致。`
  }),
  lectureSixteen({
    id: 'exercise-16-2-square-product', role: 'exercise', page: 'PDF 461、463 · 书页 456、458 · 习题 16.2',
    fingerprint: 'exercise:two-square-summable-sequences-product-absolutely-convergent',
    title: '习题 16.2 · 两个平方可和数列的乘积级数',
    statement: raw`当级数 $\sum_{n=1}^{\infty}a_n^2$ 与 $\sum_{n=1}^{\infty}b_n^2$ 都收敛时，判断级数
$$\sum_{n=1}^{\infty}a_nb_n$$
的敛散性。`,
    questionFormat: 'single-choice', options: ['条件收敛', '绝对收敛', '发散', '敛散性不确定'], correctOptionIds: ['B'],
    tags: ['课后训练', '绝对收敛', 'Cauchy不等式'],
    coreMethod: raw`用 $2|a_nb_n|\le a_n^2+b_n^2$ 逐项控制绝对值级数。`,
    mistakes: '结论比普通收敛更强，是绝对收敛；不能只研究带符号的部分和。',
    answerText: raw`正确选项为 B，$\sum a_nb_n$ 绝对收敛。`,
    methodOne: raw`由基本不等式
$$|a_nb_n|\le\frac{a_n^2+b_n^2}{2}.$$
右端级数收敛，故 $\sum|a_nb_n|$ 由比较判别收敛，目标级数绝对收敛。`,
    methodTwo: raw`对任意 $N$，Cauchy-Schwarz 不等式给出
$$\sum_{n=1}^{N}|a_nb_n|\le\left(\sum_{n=1}^{N}a_n^2\right)^{1/2}\left(\sum_{n=1}^{N}b_n^2\right)^{1/2}.$$
右侧一致有界，非负部分和单调有界，故绝对收敛。`
  }),
  lectureSixteen({
    id: 'exercise-16-4-cancellation-parameter', role: 'exercise', page: 'PDF 461、463 · 书页 456、458 · 习题 16.4',
    fingerprint: 'exercise:asymptotic-cancellation-sine-log-parameter-harmonic-term',
    title: '习题 16.4 · 正弦与对数差中的参数消项',
    statement: raw`若级数
$$\sum_{n=2}^{\infty}\left[\sin\frac1n-k\ln\left(1-\frac1n\right)\right]$$
收敛，求 $k$。`,
    tags: ['课后训练', 'Taylor展开', '参数题'],
    coreMethod: '展开到 $1/n^2$，先令 $1/n$ 主项系数为零，才能满足通项可求和的必要条件。',
    mistakes: raw`$\ln(1-1/n)$ 的首项为 $-1/n$，前面还有 $-k$，符号容易连错。`,
    answerText: raw`$$k=-1.$$`,
    methodOne: raw`展开得
$$\sin\frac1n=\frac1n+O(n^{-3}),\qquad \ln\left(1-\frac1n\right)=-\frac1n-\frac1{2n^2}+O(n^{-3}).$$
通项首项为 $(1+k)/n$。收敛必须有 $1+k=0$，即 $k=-1$；此时余项为 $O(n^{-2})$，确实收敛。`,
    methodTwo: raw`先考察
$$\lim_{n\to\infty}n\left[\sin\frac1n-k\ln\left(1-\frac1n\right)\right]=1+k.$$
若不为零，原级数与调和级数同阶发散；取 $k=-1$ 后再乘 $n^2$ 得有限极限，故与 $1/n^2$ 比较收敛。`
  }),
  lectureSixteen({
    id: 'exercise-16-5-ode-taylor-parameter', role: 'exercise', page: 'PDF 461、463 · 书页 456、458 · 习题 16.5',
    fingerprint: 'exercise:ode-taylor-at-zero-discrete-sampling-cancellation',
    title: '习题 16.5 · 微分方程解在离散点的级数消项',
    statement: raw`若 $y$ 满足
$$y'=x+y,\qquad y(0)=1,$$
且级数
$$\sum_{n=1}^{\infty}\left[y\left(\frac1n\right)+k-\frac1n\right]$$
收敛，求 $k$。`,
    tags: ['课后训练', '微分方程', 'Taylor展开'],
    coreMethod: raw`由微分方程直接求 $y(0),y'(0),y''(0)$，在 $0$ 点作二阶 Taylor 展开即可。`,
    mistakes: '不必先完整求解微分方程；常数项和 $1/n$ 项必须同时消掉。',
    answerText: raw`$$k=-1.$$`,
    methodOne: raw`由方程得 $y'(0)=1$，再求导 $y''=1+y'$，故 $y''(0)=2$。于是
$$y(x)=1+x+x^2+o(x^2).$$
从而通项为 $1+k+1/n^2+o(n^{-2})$。收敛要求 $1+k=0$，故 $k=-1$，此时与 $1/n^2$ 同阶而收敛。`,
    methodTwo: raw`显式解得 $y(x)=2e^x-x-1$。代入 $x=1/n$：
$$y(1/n)-1/n=2e^{1/n}-1-2/n=1+1/n^2+O(n^{-3}).$$
所以只有 $k=-1$ 能消去常数项并使级数收敛。`
  }),
  lectureSixteen({
    id: 'exercise-16-6-centered-power-domain', role: 'exercise', page: 'PDF 462、464 · 书页 457、459 · 习题 16.6',
    fingerprint: 'exercise:centered-power-series-ratio-radius-three-open-endpoints',
    title: '习题 16.6 · 中心在 1 的幂级数收敛域',
    statement: raw`求幂级数
$$\sum_{n=1}^{\infty}\frac{n}{3^n}(x-1)^n$$
的收敛域。`,
    tags: ['课后训练', '幂级数', '收敛域'],
    coreMethod: '比值判别先求 $|x-1|<3$，再检查两个端点。',
    mistakes: '收敛区间以 $1$ 为中心；端点代入后通项分别为 $n$ 与 $(-1)^nn$，都不趋零。',
    answerText: raw`$$(-2,4).$$`,
    methodOne: raw`通项比值绝对值趋于 $|x-1|/3$，故开区间为 $|x-1|<3$。$x=4$ 时级数为 $\sum n$，$x=-2$ 时为 $\sum(-1)^nn$，两者通项都不趋零，故端点均不取。`,
    methodTwo: raw`系数 $a_n=n/3^n$ 满足 $\lim\sqrt[n]{|a_n|}=1/3$，故半径 $R=3$、中心为 $1$。端点必要条件失败，所以收敛域是 $(1-3,1+3)=(-2,4)$。`
  }),
  lectureSixteen({
    id: 'exercise-16-9-geometric-transform', role: 'exercise', page: 'PDF 462、464 · 书页 457、459 · 习题 16.9',
    fingerprint: 'exercise:alternating-convergent-decreasing-positive-to-geometric-transform',
    title: '习题 16.9 · 交错发散条件推出指数变换收敛',
    statement: raw`设正数列 $\{a_n\}$ 单调减少，且 $\sum_{n=1}^{\infty}(-1)^na_n$ 发散。判断级数
$$\sum_{n=1}^{\infty}\left(\frac1{a_n+1}\right)^n$$
是否收敛，并说明理由。`,
    tags: ['课后训练', '正项级数', '比较判别'],
    coreMethod: '单调正数列有非负极限；若极限为零则交错级数本应收敛，所以题设发散迫使极限严格为正。',
    mistakes: '关键条件是原交错级数“发散”；若误读成收敛，就会得到 $a_n\to0$ 并失去固定几何上界。',
    answerText: '该级数收敛。',
    methodOne: raw`因 $a_n>0$ 且单调减少，极限 $a\ge0$ 存在。若 $a=0$，则由莱布尼茨判别原交错级数应收敛，与题设矛盾，故 $a>0$。于是
$$0<\frac1{a_n+1}\le\frac1{a+1}<1,$$
目标级数被收敛的几何级数控制。`,
    methodTwo: raw`令 $u_n=(1/(a_n+1))^n$。由 $a_n\to a>0$，
$$\lim_{n\to\infty}\sqrt[n]{u_n}=\frac1{a+1}<1.$$
根值判别直接给出目标级数收敛。`
  }),
  lectureSixteen({
    id: 'exercise-16-10-infinite-product', role: 'exercise', page: 'PDF 462、464 · 书页 457、459 · 习题 16.10',
    fingerprint: 'exercise:infinite-product-log-transform-logn-over-n-alpha-threshold',
    title: '习题 16.10 · 含参数无穷乘积的敛散性',
    statement: raw`设 $\alpha>0$，判断无穷乘积
$$\prod_{n=2}^{\infty}2^{\frac{\ln n}{n^\alpha}}$$
的敛散性。`,
    tags: ['课后训练', '无穷乘积', '参数题'],
    coreMethod: raw`对正因子取对数，把无穷乘积的收敛问题化为 $\sum(\ln n)/n^\alpha$ 的收敛问题。`,
    mistakes: '乘积因子虽趋近于 $1$，仍不保证乘积收敛；必须研究对数级数。',
    answerText: raw`$\alpha>1$ 时乘积收敛，$0<\alpha\le1$ 时发散到 $+\infty$。`,
    methodOne: raw`部分乘积的对数为
$$\ln P_N=(\ln2)\sum_{n=2}^{N}\frac{\ln n}{n^\alpha}.$$
由积分判别，右侧级数当且仅当 $\alpha>1$ 收敛。因此 $\alpha>1$ 时乘积收敛到有限正数，否则趋于 $+\infty$。`,
    methodTwo: raw`若 $\alpha>1$，取 $0<\varepsilon<\alpha-1$，由 $\ln n=o(n^\varepsilon)$ 得对数项被 $1/n^{\alpha-\varepsilon}$ 控制。若 $\alpha\le1$，则 $(\ln n)/n^\alpha\ge1/n$ 最终成立，对数和发散。`
  }),
  lectureSixteen({
    id: 'exercise-16-11-log-alternating', role: 'exercise', page: 'PDF 462、464-465 · 书页 457、459-460 · 习题 16.11',
    fingerprint: 'exercise:log-one-plus-alternating-root-taylor-hidden-harmonic-drift',
    title: '习题 16.11 · 对数交错通项中的调和漂移',
    statement: raw`判断级数
$$\sum_{n=2}^{\infty}\ln\left(1+\frac{(-1)^n}{\sqrt n}\right)$$
的敛散性。`,
    tags: ['课后训练', 'Taylor展开', '任意项级数'],
    coreMethod: '把对数展开到二阶；一阶交错部分收敛，二阶产生固定负号的调和主项。',
    mistakes: raw`只保留 $(-1)^n/\sqrt n$ 会误判收敛；决定结果的是二阶项 $-1/(2n)$。`,
    answerText: raw`该级数发散，部分和趋于 $-\infty$。`,
    methodOne: raw`令 $z_n=(-1)^n/\sqrt n$。Taylor 展开给出
$$\ln(1+z_n)=\frac{(-1)^n}{\sqrt n}-\frac1{2n}+O(n^{-3/2}).$$
第一项构成收敛的交错级数，余项绝对收敛，而 $-\frac12\sum1/n$ 发散到 $-\infty$，故原级数发散。`,
    methodTwo: raw`把相邻奇偶两项配对：
$$\ln\left(1+\frac1{\sqrt{2k}}\right)+\ln\left(1-\frac1{\sqrt{2k+1}}\right).$$
配对后首阶交错量抵消，剩余主项为 $-c/k$，配对级数与负调和级数同阶，因而发散。`
  }),
  lectureSixteen({
    id: 'exercise-16-13-even-series-sum', role: 'exercise', page: 'PDF 462、466 · 书页 457、461 · 习题 16.13',
    fingerprint: 'exercise:even-power-one-over-odd-minus-one-sum-function',
    title: '习题 16.13 · 偶次幂级数的拆分与和函数',
    statement: raw`求幂级数
$$\sum_{n=1}^{\infty}\left(\frac1{2n+1}-1\right)x^{2n}$$
在 $(-1,1)$ 内的和函数 $S(x)$。`,
    tags: ['课后训练', '幂级数', '和函数'],
    coreMethod: '拆成奇数分母级数与几何级数；前者通过对 $xS_1(x)$ 求导还原。',
    mistakes: '公式中含 $1/x$，必须单独给出 $x=0$ 的连续延拓值。',
    answerText: raw`$$S(x)=\begin{cases}
\displaystyle\frac1{2x}\ln\frac{1+x}{1-x}-\frac1{1-x^2},&0<|x|<1,\\[6pt]
0,&x=0.
\end{cases}$$`,
    methodOne: raw`令
$$S_1=\sum_{n=1}^{\infty}\frac{x^{2n}}{2n+1},\qquad S_2=\sum_{n=1}^{\infty}x^{2n}=\frac{x^2}{1-x^2}.$$
由
$$[xS_1(x)]'=\frac{x^2}{1-x^2}$$
积分得 $S_1=-1+(2x)^{-1}\ln[(1+x)/(1-x)]$，再计算 $S=S_1-S_2$。`,
    methodTwo: raw`利用
$$\operatorname{artanh}x=\sum_{n=0}^{\infty}\frac{x^{2n+1}}{2n+1}=\frac12\ln\frac{1+x}{1-x}.$$
除以 $x$、去掉 $n=0$ 项，再减去 $\sum_{n\ge1}x^{2n}$，即可得到同一分段公式。`
  }),
  lectureSixteen({
    id: 'exercise-16-16-ode-coefficients', role: 'exercise', page: 'PDF 462、467-468 · 书页 457、462-463 · 习题 16.16',
    fingerprint: 'exercise:ode-exponential-solution-extract-exponential-generating-coefficients',
    title: '习题 16.16 · 微分方程解的指数型级数系数',
    statement: raw`设
$$f(x)=\sum_{n=0}^{\infty}\frac{a_n}{n!}x^n,$$
并满足
$$f''(x)-f'(x)-2f(x)=0,\qquad f(0)=0,\quad f'(0)=1.$$
求 $f(x)$ 与 $a_n$。`,
    tags: ['课后训练', '微分方程', '函数展开'],
    coreMethod: '先解常系数微分方程，再把指数函数展开成指数型生成函数并比较系数。',
    mistakes: '题目级数的基底是 $x^n/n!$，比较系数时不能再多除一次 $n!$。',
    answerText: raw`$$f(x)=\frac{e^{2x}-e^{-x}}3,\qquad a_n=\frac{2^n+(-1)^{n+1}}3.$$`,
    methodOne: raw`特征方程 $r^2-r-2=0$ 的根为 $-1,2$。由初值解得
$$f(x)=-\frac13e^{-x}+\frac13e^{2x}.$$
展开两指数并比较 $x^n/n!$ 的系数，得到
$$a_n=\frac{-(-1)^n+2^n}{3}=\frac{2^n+(-1)^{n+1}}3.$$`,
    methodTwo: raw`直接把级数代入微分方程可得递推
$$a_{n+2}-a_{n+1}-2a_n=0,\qquad a_0=0, a_1=1.$$
解线性递推的特征方程 $\lambda^2-\lambda-2=0$，得到相同的 $a_n$；再求和即还原 $f(x)$。`
  })
]
