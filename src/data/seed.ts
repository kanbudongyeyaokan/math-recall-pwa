import type { Problem } from '../types'
import { foundationConclusionSeeds } from './foundationConclusionSeeds'
import type { SeedInput } from './banks/types'
import { curatedQuestionSeeds } from './banks/curatedBank'

export type { SeedInput } from './banks/types'

const legacyAlternateMethods: Record<string, { title: string; content: string }> = {
  '三阶小量的极限': {
    title: '方法二 · 连续洛必达',
    content: '原式为 0/0 型。第一次求导得 x sin x/(3x²)=sin x/(3x)；再由基本极限 sin x/x→1，结果为 1/3。这里一次求导已经把三阶抵消结构显露出来，不必机械地求三次导。'
  },
  '补点后的连续与可导': {
    title: '方法二 · 泰勒统一处理',
    content: 'eˣ−1=x+x²/2+o(x²)，所以 x≠0 时 f(x)=1+x/2+o(x)。令 a=1 后，f(x)−f(0)=x/2+o(x)，既得到连续，也直接得到 f′(0)=1/2。'
  },
  '分部积分与有理化拆分': {
    title: '方法二 · 交换积分次序',
    content: '写成 arctan x=∫₀ˣdt/(1+t²)。于是 I=∫₀¹∫₀ˣx/(1+t²)dtdx=∫₀¹[∫ₜ¹x dx]/(1+t²)dt=(1/2)∫₀¹(1−t²)/(1+t²)dt=π/4−1/2。'
  },
  '一阶线性微分方程': {
    title: '方法二 · 齐次解加特解',
    content: '齐次方程 y′−2y=0 给出 yₕ=Ce²ˣ。对右端 eˣ 设特解 yₚ=Aeˣ，代入得 −Aeˣ=eˣ，故 A=−1。于是 y=Ce²ˣ−eˣ，由 y(0)=0 得 C=1。'
  },
  '交错级数的绝对与条件收敛': {
    title: '方法二 · Dirichlet 与极限比较',
    content: '数列 (−1)ⁿ⁻¹ 的部分和有界，而 n/(n²+1) 单调趋于 0，由 Dirichlet 判别原级数收敛。另一方面 lim[n/(n²+1)]/(1/n)=1，绝对值级数与调和级数同敛散，故发散，结论仍为条件收敛。'
  },
  '圆域上的极坐标积分': {
    title: '方法二 · 对称性与截面',
    content: '由对称性，∬ᴅ(x²+y²)dA=2∬ᴅx²dA=4∫₀¹x²√(1−x²)dx。令 x=sin t，得到 4∫₀^{π/2}sin²t cos²t dt=π/2。'
  },
  '含参数矩阵的秩': {
    title: '方法二 · 初等行变换',
    content: '作 R₃←R₃−R₁，得到第三行为 (0,a−1,1)，再作 R₃←R₃−(a−1)R₂，第三行为 (0,0,2−a)。a≠2 时有三个主元；a=2 时只有前两行两个主元，故秩为 2。'
  },
  '实对称矩阵的正交对角化': {
    title: '方法二 · 直接旋转变量',
    content: '令 y₁=(x₁+x₂)/√2，y₂=(x₁−x₂)/√2，则 x₁=(y₁+y₂)/√2，x₂=(y₁−y₂)/√2。代入 2x₁²+2x₁x₂+2x₂²，直接化为 3y₁²+y₂²，对应的变换矩阵正是单位特征向量组成的正交矩阵。'
  }
}

const originalSeeds: SeedInput[] = [
  {
    kind: 'problem',
    title: '三阶小量的极限',
    statement: '计算：lim(x→0) [sin x − x cos x] / x³。',
    tags: ['高等数学', '极限', '泰勒公式'],
    coreMethod: '分子前两阶恰好抵消，展开到 x³；也可连续使用洛必达法则。',
    mistakes: '只使用 sin x ~ x 会把决定结果的三阶项全部丢掉。等价无穷小不能在减法中逐项替换。',
    answerText: 'sin x = x − x³/6 + o(x³)，x cos x = x − x³/2 + o(x³)，相减得 x³/3 + o(x³)，所以极限为 1/3。'
  },
  {
    kind: 'problem',
    title: '补点后的连续与可导',
    statement: '设 f(x)=(eˣ−1)/x（x≠0），f(0)=a。确定 a 使 f 在 0 连续，并判断此时是否可导。',
    tags: ['高等数学', '连续', '导数定义'],
    coreMethod: '先用极限补连续，再严格代入导数定义，而不是直接对 x≠0 的表达式求导后代 0。',
    mistakes: '连续只决定函数值；判断可导还要研究 [f(x)−f(0)]/x 的极限。',
    answerText: '连续要求 a=lim(x→0)(eˣ−1)/x=1。此时 [f(x)−1]/x=(eˣ−1−x)/x²→1/2，因此 f 在 0 可导且 f′(0)=1/2。'
  },
  {
    kind: 'concept',
    title: '等价无穷小：允许替换的边界',
    statement: '什么叫等价无穷小？在极限运算中，哪些位置可以直接替换，哪些位置最危险？',
    tags: ['高等数学', '定义', '极限'],
    coreMethod: '把“等价”还原成比值趋于 1，并优先在乘除结构中使用。',
    mistakes: '加减法中直接替换可能抹去高阶主项；遇到差式应先通分、因式分解或展开。',
    answerText: '当 x→x₀ 时，若 α/β→1，则称 α 与 β 等价，记作 α~β。乘积或商中的因子通常可替换；和、差中的项一般不能分别替换，除非能证明替换后的误差相对整体仍是高阶小量。'
  },
  {
    kind: 'concept',
    title: '可导、连续与可微的关系',
    statement: '一元函数与多元函数中，“可导、连续、可微”分别有哪些必然关系？',
    tags: ['高等数学', '定义', '微分'],
    coreMethod: '一元与多元分开记：一元可导等价于可微；多元偏导存在远弱于可微。',
    mistakes: '多元函数各偏导存在不推出连续，更不推出可微；偏导连续只是可微的充分条件之一。',
    answerText: '一元：某点可导 ⇔ 该点可微 ⇒ 该点连续，反向通常不成立。多元：某点可微 ⇒ 连续且各偏导存在；各偏导在该点邻域存在并在该点连续 ⇒ 该点可微，但这只是充分条件。'
  },
  {
    kind: 'problem',
    title: '分部积分与有理化拆分',
    statement: '计算 I=∫₀¹ x·arctan(x) dx。',
    tags: ['高等数学', '定积分', '分部积分'],
    coreMethod: '令 arctan x 为需要求导的部分，x dx 为容易积分的部分；再把 x²/(1+x²) 拆成 1−1/(1+x²)。',
    mistakes: '分部积分后的上下限项容易漏掉；arctan 1=π/4。',
    answerText: 'I=[x² arctan x/2]₀¹−(1/2)∫₀¹x²/(1+x²)dx=π/8−(1/2)(1−π/4)=π/4−1/2。'
  },
  {
    kind: 'problem',
    title: '一阶线性微分方程',
    statement: '求初值问题 y′−2y=eˣ，y(0)=0。',
    tags: ['高等数学', '微分方程', '一阶线性'],
    coreMethod: '积分因子为 e⁻²ˣ，先把左端写成 (ye⁻²ˣ)′。',
    mistakes: '标准型 y′+P(x)y=Q(x) 的积分因子是 e^{∫Pdx}；本题符号是负号。',
    answerText: '(ye⁻²ˣ)′=e⁻ˣ。由 0 积到 x：ye⁻²ˣ=1−e⁻ˣ，所以 y=e²ˣ−eˣ。代入 y(0)=0 验证成立。'
  },
  {
    kind: 'problem',
    title: '交错级数的绝对与条件收敛',
    statement: '判断级数 Σ(n=1→∞) (−1)ⁿ⁻¹·n/(n²+1) 的敛散性。',
    tags: ['高等数学', '无穷级数', '审敛法'],
    coreMethod: '先用莱布尼茨判别原级数，再与调和级数比较检查绝对收敛。',
    mistakes: '证明交错收敛后就停止，会漏掉“条件收敛还是绝对收敛”的判断。',
    answerText: 'aₙ=n/(n²+1)>0，最终单调递减且趋于 0，所以交错级数收敛。又 aₙ~1/n，故 Σaₙ 发散。因此原级数条件收敛，不绝对收敛。'
  },
  {
    kind: 'problem',
    title: '圆域上的极坐标积分',
    statement: 'D={(x,y)|x²+y²≤1}，计算 ∬ᴅ(x²+y²)dA。',
    tags: ['高等数学', '二重积分', '极坐标'],
    coreMethod: '圆域与被积函数都具有径向结构，直接令 x²+y²=r²，dA=rdrdθ。',
    mistakes: '极坐标换元时漏掉雅可比因子 r。',
    answerText: '积分为 ∫₀²π∫₀¹ r²·r drdθ=2π·(1/4)=π/2。'
  },
  {
    kind: 'concept',
    title: '拉格朗日中值定理',
    statement: '准确说出拉格朗日中值定理的条件和结论，并解释它为什么是“有限增量公式”。',
    tags: ['高等数学', '定义', '中值定理'],
    coreMethod: '记忆顺序：闭区间连续、开区间可导、存在一个开区间内的点。',
    mistakes: '把闭区间上的可导当作条件；或忘记 ξ 必须属于 (a,b)。',
    answerText: '若 f 在 [a,b] 上连续、在 (a,b) 内可导，则至少存在 ξ∈(a,b)，使 f(b)−f(a)=f′(ξ)(b−a)。它把有限区间上的函数增量表示为某点导数与自变量增量的乘积。'
  },
  {
    kind: 'problem',
    title: '含参数矩阵的秩',
    statement: 'A=[[1,1,0],[0,1,1],[1,a,1]]。讨论参数 a 取何值时 A 的秩小于 3，并求此时的秩。',
    tags: ['线性代数', '矩阵秩', '行列式'],
    coreMethod: '方阵先用行列式锁定降秩参数，再用非零二阶子式确定实际秩。',
    mistakes: 'det(A)=0 只能说明秩小于 3，不能直接断言秩为 2。',
    answerText: 'det(A)=2−a，所以仅当 a=2 时秩小于 3。此时第三行等于第一、二行之和，而前两行线性无关，故 rank(A)=2。'
  },
  {
    kind: 'problem',
    title: '实对称矩阵的正交对角化',
    statement: '将 A=[[2,1],[1,2]] 正交对角化，并写出对应二次型的标准形。',
    tags: ['线性代数', '特征值', '二次型'],
    coreMethod: '实对称矩阵先求互相正交的特征向量，再单位化组成正交矩阵。',
    mistakes: '只求特征向量但不单位化；或把 P⁻¹AP 与 PᵀAP 混淆。',
    answerText: '特征值为 3、1，对应单位特征向量可取 (1,1)/√2、(1,−1)/√2。以它们为列组成 P，则 PᵀAP=diag(3,1)，标准形为 3y₁²+y₂²。'
  },
  {
    kind: 'concept',
    title: '线性无关的四种等价语言',
    statement: '如何用“线性组合、齐次方程、秩、表示唯一性”描述向量组线性无关？',
    tags: ['线性代数', '定义', '线性无关'],
    coreMethod: '围绕列向量矩阵 A：Ax=0 只有零解 ⇔ 列满秩。',
    mistakes: '“每个向量都不能由其余向量表示”需要向量组非空；零向量出现时必线性相关。',
    answerText: '向量组 α₁,…,αₘ 线性无关 ⇔ k₁α₁+…+kₘαₘ=0 只有全零系数 ⇔ 以它们为列的矩阵列满秩 m ⇔ 它们张成空间中的每个向量若可表示，则表示系数唯一。'
  },
  {
    kind: 'concept',
    title: '正定二次型的判定链',
    statement: '实二次型 xᵀAx 正定有哪些常用等价判据？使用顺序怎样更高效？',
    tags: ['线性代数', '定义', '正定'],
    coreMethod: '根据题面选入口：给顺序主子式用 Sylvester，给特征值用谱判据，给合同变换看标准形。',
    mistakes: 'Sylvester 判据要求所有“顺序”主子式为正，不是任意挑几个主子式。',
    answerText: '对实对称 A：xᵀAx 正定 ⇔ 所有特征值均为正 ⇔ 正惯性指数为 n ⇔ 存在可逆 C 使 A=CᵀC ⇔ A 的各阶顺序主子式全为正。'
  },
  {
    kind: 'concept',
    title: '反常积分 p 判据',
    statement: '分别写出 ∫₁^∞1/xᵖ dx 与 ∫₀¹1/xᵖ dx 的收敛条件。为什么端点不同会“反过来”？',
    tags: ['高等数学', '定义', '反常积分'],
    coreMethod: '无穷远看衰减够不够快；零点看爆炸是否太快。分界都是 p=1。',
    mistakes: '混淆两个区间的条件；p=1 对应对数发散，不能包含等号。',
    answerText: '∫₁^∞x⁻ᵖdx 当且仅当 p>1 收敛；∫₀¹x⁻ᵖdx 当且仅当 p<1 收敛。无穷远需要更快衰减，而零点附近指数越大，奇性越强。'
  },
  {
    kind: 'concept',
    title: '多元函数可微的定义式',
    statement: '二元函数 z=f(x,y) 在点 (x₀,y₀) 可微的定义式是什么？其中 o(ρ) 的真正含义是什么？',
    tags: ['高等数学', '定义', '多元微分'],
    coreMethod: '增量=线性主部+比距离更高阶的误差；线性主部必须同时逼近所有方向。',
    mistakes: '把沿每条直线的方向极限都存在误认为可微；定义要求二维整体趋近下统一成立。',
    answerText: '令 ρ=√(Δx²+Δy²)。若 Δz=AΔx+BΔy+o(ρ)，即 [Δz−AΔx−BΔy]/ρ→0，则 f 在该点可微；此时 A=fₓ(x₀,y₀)，B=fᵧ(x₀,y₀)。o(ρ) 表示误差与点的距离之比趋于 0。'
  },
  {
    kind: 'problem',
    title: '半角结构的极限选择',
    statement: 'lim(x→0) (1−cos x)/(x sin x) 等于（ ）。',
    tags: ['高等数学', '极限', '选择题'],
    coreMethod: '分子、分母同阶，优先用半角公式或二阶等价无穷小。',
    mistakes: '1−cos x 与 x 不是等价无穷小，而与 x²/2 等价。',
    answerText: '正确选项 B，极限为 1/2。',
    questionFormat: 'single-choice',
    options: ['0', '1/2', '1', '不存在'],
    correctOptionIds: ['B'],
    solutionMethods: [
      { title: '方法一 · 等价无穷小', content: '1−cos x~x²/2，sin x~x，所以原式~(x²/2)/x²=1/2。' },
      { title: '方法二 · 半角公式', content: '原式=[2sin²(x/2)]/[2x sin(x/2)cos(x/2)]=[sin(x/2)/(x/2)]/[2cos(x/2)]→1/2。' }
    ]
  },
  {
    kind: 'problem',
    title: 'x 的 x 次方最小值',
    statement: '函数 f(x)=xˣ（x>0）的最小值为（ ）。',
    tags: ['高等数学', '导数', '最值', '选择题'],
    coreMethod: '幂指函数先取对数，把乘方最值化为 x ln x 的最值。',
    mistakes: '驻点是 x=e⁻¹，最小值不是 e⁻¹，而是 (e⁻¹)^{e⁻¹}=e⁻¹ᐟᵉ。',
    answerText: '正确选项 C，最小值为 e⁻¹ᐟᵉ。',
    questionFormat: 'single-choice',
    options: ['0', 'e⁻¹', 'e⁻¹ᐟᵉ', '1'],
    correctOptionIds: ['C'],
    solutionMethods: [
      { title: '方法一 · 对数求导', content: 'ln f=x ln x，故 f′=xˣ(ln x+1)。f′ 在 (0,e⁻¹) 为负、在 (e⁻¹,+∞) 为正，所以 x=e⁻¹ 处取得全局最小值 e⁻¹ᐟᵉ。' },
      { title: '方法二 · 凸性判定', content: '令 g(x)=x ln x，则 g″(x)=1/x>0，g 为严格凸函数；唯一驻点 g′=ln x+1=0 即 x=e⁻¹，因此它是全局最小点。指数函数单调递增，f 与 g 在同一点取最小值。' }
    ]
  },
  {
    kind: 'problem',
    title: '定积分性质辨析',
    statement: '设 f 在 [0,1] 上连续，下列结论一定正确的是（多选）。',
    tags: ['高等数学', '定积分', '性质', '多选题'],
    coreMethod: '换元验证对称式，用积分中值定理或上下界估计处理大小关系。',
    mistakes: '积分为零只代表正负面积抵消；不能推出函数恒为零。',
    answerText: '正确选项 A、C。',
    questionFormat: 'multiple-choice',
    options: ['∫₀¹f(x)dx=∫₀¹f(1−x)dx', '若 ∫₀¹f(x)dx=0，则 f≡0', '若 f 单调递增，则 f(0)≤∫₀¹f(x)dx≤f(1)', '若 f(0)=f(1)，则 f 在 [0,1] 上为常数'],
    correctOptionIds: ['A', 'C'],
    solutionMethods: [
      { title: '方法一 · 逐项按定义验证', content: 'A 中令 u=1−x 即得等式。C 由 f(0)≤f(x)≤f(1) 两端积分得到。B 可取 f(x)=x−1/2 反驳；D 可取 f(x)=x(1−x) 反驳。' },
      { title: '方法二 · 中值定理与反例', content: '积分中值定理给出 ∫₀¹f(x)dx=f(ξ)，若 f 单调递增便落在端点值之间。其余命题用“先找最简单多项式反例”的策略检验，只有 A、C 无法被反驳。' }
    ]
  },
  {
    kind: 'problem',
    title: '圆域上的奇偶对称积分',
    statement: 'D={(x,y)|x²+y²≤1}，则 ∬ᴅ(x³+y²)dA 等于（ ）。',
    tags: ['高等数学', '二重积分', '对称性', '选择题'],
    coreMethod: '先消去关于 x 的奇函数项，再计算圆盘的二阶矩。',
    mistakes: '对称性只消去 x³，不会消去始终非负的 y²。',
    answerText: '正确选项 C，积分为 π/4。',
    questionFormat: 'single-choice',
    options: ['0', 'π/8', 'π/4', 'π/2'],
    correctOptionIds: ['C'],
    solutionMethods: [
      { title: '方法一 · 极坐标', content: '∬ᴅx³dA=0。其余部分为 ∫₀²π∫₀¹r²sin²θ·r drdθ=(1/4)∫₀²πsin²θdθ=π/4。' },
      { title: '方法二 · 旋转对称', content: '圆盘上 ∬x²dA=∬y²dA，且两者之和为 ∬(x²+y²)dA=π/2，所以每一项均为 π/4；x³ 项因关于 y 轴反对称而为 0。' }
    ]
  },
  {
    kind: 'problem',
    title: '二元二次函数的极小值',
    statement: '求 f(x,y)=x²+y²+xy−2x−2y 的极值。',
    tags: ['高等数学', '多元函数', '极值'],
    coreMethod: '解梯度方程定位驻点，再用 Hessian 或配方确认全局极小。',
    mistakes: '只求出驻点而不判定极值类型；二元二次型的交叉项系数对应 Hessian 的非对角元。',
    answerText: '唯一极值点为 (2/3,2/3)，取得全局最小值 −4/3。',
    solutionMethods: [
      { title: '方法一 · Hessian 判别', content: '由 fₓ=2x+y−2=0、fᵧ=x+2y−2=0 得 x=y=2/3。Hessian 为 [[2,1],[1,2]]，顺序主子式 2、3 均正，故严格正定，驻点是唯一全局极小点。代入得 −4/3。' },
      { title: '方法二 · 和差配方', content: '令 s=x+y、d=x−y，则 x²+y²+xy=(3s²+d²)/4。于是 f=3(s−4/3)²/4+d²/4−4/3，故 s=4/3、d=0 时最小，即 x=y=2/3。' }
    ]
  },
  {
    kind: 'problem',
    title: '幂级数的收敛区间',
    statement: '幂级数 Σ(n=1→∞) n(x/3)ⁿ 的收敛区间是（ ）。',
    tags: ['高等数学', '无穷级数', '幂级数', '选择题'],
    coreMethod: '先求收敛半径，再把两个端点逐个代回原级数。',
    mistakes: '得到半径 3 后直接写闭区间；端点处通项 n(±1)ⁿ 不趋于 0。',
    answerText: '正确选项 B，收敛区间为 (−3,3)。',
    questionFormat: 'single-choice',
    options: ['[−3,3]', '(−3,3)', '[−3,3)', '(−3,3]'],
    correctOptionIds: ['B'],
    solutionMethods: [
      { title: '方法一 · 比值判别', content: '对绝对值通项作比：|(n+1)(x/3)ⁿ⁺¹|/[n(x/3)ⁿ]→|x|/3，故 |x|<3 收敛。x=±3 时通项分别为 n、n(−1)ⁿ，均不趋于 0。' },
      { title: '方法二 · 已知母函数', content: 'Σntⁿ=t/(1−t)² 的成立域是 |t|<1。令 t=x/3 得 |x|<3；再单独检查 x=±3，端点都发散。' }
    ]
  },
  {
    kind: 'problem',
    title: '二阶常系数方程辨析',
    statement: '关于微分方程 y″−y=0，下列说法正确的是（多选）。',
    tags: ['高等数学', '微分方程', '多选题'],
    coreMethod: '特征根决定通解，初值只需解两个线性方程。',
    mistakes: '非零解不一定单调，例如 cosh x 先减后增。',
    answerText: '正确选项 A、B、D。',
    questionFormat: 'multiple-choice',
    options: ['特征根为 ±1', '满足 y(0)=0,y′(0)=2 的解是 2sinh x', '每个非零解都在 R 上单调', 'eˣ 与 e⁻ˣ 构成一个基本解组'],
    correctOptionIds: ['A', 'B', 'D'],
    solutionMethods: [
      { title: '方法一 · 特征方程', content: 'r²−1=0 给出 r=±1，通解 y=C₁eˣ+C₂e⁻ˣ，所以 A、D 正确。由 C₁+C₂=0、C₁−C₂=2 得 C₁=1,C₂=−1，即 y=2sinh x，B 正确。' },
      { title: '方法二 · 直接验证与反例', content: '逐项代回方程可验证 eˣ、e⁻ˣ 和 2sinh x。对 C 取 y=cosh x，它满足方程，但 y′=sinh x 在 0 两侧变号，故并非全轴单调。' }
    ]
  },
  {
    kind: 'concept',
    title: '隐函数存在定理的条件边界',
    statement: '方程 F(x,y)=0 在点 (x₀,y₀) 附近何时能确定 y=y(x)？导数公式是什么？',
    tags: ['高等数学', '定义', '隐函数'],
    coreMethod: '三项同时记：点在曲线上、偏导连续、对因变量的偏导非零。',
    mistakes: 'Fᵧ=0 不代表一定不存在隐函数，只代表这个定理不能直接保证；也可能改解 x=x(y)。',
    answerText: '若 F(x₀,y₀)=0，F 在该点邻域具有连续偏导，且 Fᵧ(x₀,y₀)≠0，则在该点附近唯一确定连续可导的 y=y(x)，并有 y′=−Fₓ/Fᵧ。'
  },
  {
    kind: 'problem',
    title: '含参向量组的线性无关',
    statement: '向量 α₁=(1,0,1)ᵀ，α₂=(0,1,1)ᵀ，α₃=(1,1,a)ᵀ 线性无关的条件是（ ）。',
    tags: ['线性代数', '线性无关', '参数题', '选择题'],
    coreMethod: '三个三维向量先组成方阵看行列式，也可直接尝试表示第三个向量。',
    mistakes: 'a=2 时恰有 α₃=α₁+α₂；不要把条件方向写反。',
    answerText: '正确选项 D，a≠2。',
    questionFormat: 'single-choice',
    options: ['a=0', 'a=1', 'a=2', 'a≠2'],
    correctOptionIds: ['D'],
    solutionMethods: [
      { title: '方法一 · 行列式', content: '以三个向量为列组成矩阵，行列式为 a−2。行列式非零当且仅当三列线性无关，所以 a≠2。' },
      { title: '方法二 · 表示唯一性', content: '若 α₃=c₁α₁+c₂α₂，前两个分量强制 c₁=c₂=1，此时第三分量必须为 2。因此仅 a=2 时 α₃ 可由前两个表示；其余情形无关。' }
    ]
  },
  {
    kind: 'problem',
    title: '秩与解空间维数',
    statement: 'A 是 3×4 矩阵且 r(A)=2，下列结论一定正确的是（多选）。',
    tags: ['线性代数', '线性方程组', '秩', '多选题'],
    coreMethod: '未知量个数减秩就是齐次解空间维数；非齐次是否有解还要看增广矩阵。',
    mistakes: '只知道系数矩阵的秩，不能断言任意 b 下 Ax=b 有解。',
    answerText: '正确选项 A、C。',
    questionFormat: 'multiple-choice',
    options: ['Ax=0 的基础解系含 2 个向量', '对任意 b，Ax=b 都有解', '若 Ax=b 有解，则通解含 2 个自由参数', 'Ax=0 只有零解'],
    correctOptionIds: ['A', 'C'],
    solutionMethods: [
      { title: '方法一 · 秩-零度定理', content: '零空间维数 n−r=4−2=2，所以 A 正确、D 错误。非齐次方程若相容，其通解等于一个特解加二维齐次解空间，故 C 正确。' },
      { title: '方法二 · 主元视角', content: '化为行最简形后只有 2 个主元列，4 个未知量中有 2 个自由变量。b 是否使方程相容取决于增广列，不能由 r(A)=2 单独决定，所以 B 不一定。' }
    ]
  },
  {
    kind: 'problem',
    title: 'Jordan 型二阶矩阵',
    statement: 'A=[[1,1],[0,1]]，下列结论正确的是（ ）。',
    tags: ['线性代数', '特征值', '相似对角化', '选择题'],
    coreMethod: '重特征值能否对角化，要看线性无关特征向量是否够两个。',
    mistakes: '有两个计重数的特征值，不等于有两个线性无关特征向量。',
    answerText: '正确选项 C，A 不能相似对角化。',
    questionFormat: 'single-choice',
    options: ['A 有两个不同特征值', 'A 是实对称矩阵', 'A 不能相似对角化', 'A²=A'],
    correctOptionIds: ['C'],
    solutionMethods: [
      { title: '方法一 · 特征空间维数', content: '|λI−A|=(λ−1)²，但 (A−I)x=0 只有 x₂=0，特征空间维数为 1，小于代数重数 2，所以不可对角化。' },
      { title: '方法二 · 最小多项式', content: '令 N=A−I，则 N≠0 且 N²=0，因此 A 的最小多项式为 (λ−1)²，含重根；矩阵可对角化当且仅当最小多项式无重根，故不可对角化。' }
    ]
  },
  {
    kind: 'problem',
    title: '含参二次型正定辨析',
    statement: 'q=x₁²+2ax₁x₂+x₂²，下列说法正确的是（多选）。',
    tags: ['线性代数', '二次型', '正定', '多选题'],
    coreMethod: '矩阵 [[1,a],[a,1]] 的顺序主子式或特征值都能给出完整分类。',
    mistakes: 'a=±1 时是半正定而非正定；正定条件必须是严格不等式。',
    answerText: '正确选项 A、B、C。',
    questionFormat: 'multiple-choice',
    options: ['a=0 时 q 正定', 'a=1 时 q 半正定', '|a|>1 时 q 不定', 'a=−1 时 q 负半定'],
    correctOptionIds: ['A', 'B', 'C'],
    solutionMethods: [
      { title: '方法一 · Sylvester 判据', content: '顺序主子式为 1 与 1−a²，所以 |a|<1 时正定。a=1 时 q=(x₁+x₂)²，a=−1 时 q=(x₁−x₂)²，均半正定；|a|>1 时行列式为负，二次型不定。' },
      { title: '方法二 · 特征值', content: '矩阵特征值为 1+a、1−a。两者同正等价于 |a|<1；a=±1 时一个为 0、另一个为 2；|a|>1 时一正一负。由此逐项判断 A、B、C 正确。' }
    ]
  },
  {
    kind: 'problem',
    title: '全一矩阵的秩与特征值',
    statement: '设 A 为三阶全一矩阵，求 r(A) 及全部特征值。',
    tags: ['线性代数', '矩阵秩', '特征值'],
    coreMethod: '全一矩阵是向量外积 eeᵀ，作用只保留沿 e=(1,1,1)ᵀ 的方向。',
    mistakes: '迹为 3 只给出特征值之和；还需利用秩为 1 确定零特征值的重数。',
    answerText: 'r(A)=1；特征值为 3、0、0。',
    solutionMethods: [
      { title: '方法一 · 外积与子空间', content: '令 e=(1,1,1)ᵀ，则 A=eeᵀ。Ae=3e，所以 3 是特征值；任意与 e 正交的二维子空间中的向量 x 都满足 Ax=e(eᵀx)=0，故另两个特征值为 0，秩为 1。' },
      { title: '方法二 · 行变换与迹', content: '三行完全相同且非零，所以 r(A)=1。零空间维数为 2，故 0 至少是几何重数 2 的特征值；三个特征值之和等于 tr(A)=3，剩余特征值只能是 3。' }
    ]
  },
  {
    kind: 'concept',
    title: '矩阵等价、相似与合同',
    statement: '矩阵等价、相似、合同分别保持哪些核心不变量？三者最常见的使用场景是什么？',
    tags: ['线性代数', '定义', '矩阵关系'],
    coreMethod: '等价看秩，相似看线性变换，合同看二次型。',
    mistakes: '相似必等价，但同秩只保证等价，不保证相似；合同一般不保持特征值。',
    answerText: 'A、B 等价指存在可逆 P,Q 使 B=PAQ，核心不变量是秩；相似指 B=P⁻¹AP，保持特征多项式、特征值、迹、行列式等；实对称矩阵合同指 B=PᵀAP，保持正负惯性指数与秩，用于二次型化标准形。'
  },
  {
    kind: 'problem',
    title: '均匀变量的指数变换',
    statement: 'X~U(0,1)，令 Y=−ln X，则 Y 的分布为（ ）。',
    tags: ['概率论', '随机变量函数', '分布', '选择题'],
    coreMethod: '单调变换优先写分布函数，注意 y<0 时概率为 0。',
    mistakes: 'Y 的取值范围是 [0,+∞)，不能沿用 X 的 (0,1)。',
    answerText: '正确选项 B，Y 服从参数为 1 的指数分布。',
    questionFormat: 'single-choice',
    options: ['U(0,1)', 'Exp(1)', 'N(0,1)', '参数为 1 的泊松分布'],
    correctOptionIds: ['B'],
    solutionMethods: [
      { title: '方法一 · 分布函数法', content: 'y≥0 时，Fᵧ(y)=P(−ln X≤y)=P(X≥e⁻ʸ)=1−e⁻ʸ；y<0 时为 0。这正是 Exp(1) 的分布函数。' },
      { title: '方法二 · 密度变换', content: '反函数 x=e⁻ʸ，|dx/dy|=e⁻ʸ。在 y>0 上 fᵧ(y)=fₓ(e⁻ʸ)e⁻ʸ=e⁻ʸ，其他位置为 0，故 Y~Exp(1)。' }
    ]
  },
  {
    kind: 'problem',
    title: '数字特征的线性变换',
    statement: '已知 E(X)=2，Var(X)=3，下列结论正确的是（多选）。',
    tags: ['概率论', '数学期望', '方差', '多选题'],
    coreMethod: '期望对线性变换整体线性；方差只让随机系数平方，常数平移不影响方差。',
    mistakes: 'Var(aX+b)=a²Var(X)，不是 aVar(X)+b。',
    answerText: '四个选项 A、B、C、D 都正确。',
    questionFormat: 'multiple-choice',
    options: ['E(2X−1)=3', 'Var(2X−1)=12', 'E(X²)=7', 'Var(X+5)=3'],
    correctOptionIds: ['A', 'B', 'C', 'D'],
    solutionMethods: [
      { title: '方法一 · 直接套性质', content: 'E(2X−1)=2E(X)−1=3；Var(2X−1)=4Var(X)=12；E(X²)=Var(X)+[E(X)]²=3+4=7；平移不改变方差。' },
      { title: '方法二 · 中心化定义', content: '令 Z=X−2，则 E(Z)=0、E(Z²)=3。把各式都写成 Z：2X−1=2Z+3，X²=(Z+2)²，利用 E(Z)=0 即可逐项得到同样结果。' }
    ]
  },
  {
    kind: 'problem',
    title: '二项分布的二阶阶乘矩',
    statement: '若 X~B(n,p)，则 E[X(X−1)] 等于（ ）。',
    tags: ['概率论', '二项分布', '数学期望', '选择题'],
    coreMethod: 'X(X−1) 统计有序成功对；也可对概率母函数求二阶导。',
    mistakes: '不要把 E[X(X−1)] 与 E(X²) 混为一谈，二者相差 E(X)。',
    answerText: '正确选项 C，E[X(X−1)]=n(n−1)p²。',
    questionFormat: 'single-choice',
    options: ['np', 'n²p²', 'n(n−1)p²', 'np(1−p)'],
    correctOptionIds: ['C'],
    solutionMethods: [
      { title: '方法一 · 指示变量', content: '写 X=ΣIᵢ，则 X(X−1)=Σ_{i≠j}IᵢIⱼ。共有 n(n−1) 个有序对，独立性给出 E(IᵢIⱼ)=p²，所以结果为 n(n−1)p²。' },
      { title: '方法二 · 概率母函数', content: '二项分布概率母函数 G(t)=(1−p+pt)ⁿ。因为 G″(1)=E[X(X−1)]，求导得 G″(1)=n(n−1)p²。' }
    ]
  },
  {
    kind: 'problem',
    title: '指数分布参数的最大似然估计',
    statement: '总体密度 f(x;λ)=λe⁻ˡᵃᵐᵇᵈᵃˣ（x>0，λ>0），样本为 X₁,…,Xₙ。求 λ 的最大似然估计。',
    tags: ['概率论', '参数估计', '最大似然'],
    coreMethod: '先写联合密度，再取对数；参数空间 λ>0 也要纳入最大值判断。',
    mistakes: '求得驻点后忘记检查二阶导为负；分母是样本均值而不是样本方差。',
    answerText: '最大似然估计为 λ̂=n/ΣXᵢ=1/X̄。',
    solutionMethods: [
      { title: '方法一 · 对数似然求导', content: 'L(λ)=λⁿexp(−λΣXᵢ)，ℓ(λ)=nlnλ−λΣXᵢ。令 ℓ′=n/λ−ΣXᵢ=0，得 λ̂=n/ΣXᵢ；且 ℓ″=−n/λ²<0，所以是唯一最大值。' },
      { title: '方法二 · 单峰比值判断', content: '对候选 λ̂=n/S（S=ΣXᵢ），令 t=λ/λ̂。则 L(λ)/L(λ̂)=tⁿe^{n(1−t)}。由 ln t≤t−1，此比值≤1，等号仅在 t=1，故 λ̂ 为全局最大点。' }
    ]
  },
  {
    kind: 'concept',
    title: '分布函数的四条硬条件',
    statement: '一个函数 F(x) 要成为某个随机变量的分布函数，必须满足哪些条件？跳跃点代表什么？',
    tags: ['概率论', '定义', '分布函数'],
    coreMethod: '单调不减、右连续、左端到 0、右端到 1。',
    mistakes: '分布函数要求右连续，不是左连续；连续型随机变量的 F 连续，但一般分布函数可以跳跃。',
    answerText: 'F 必须单调不减、右连续，并满足 lim(x→−∞)F(x)=0、lim(x→+∞)F(x)=1。点 x₀ 的跳跃量 F(x₀)−F(x₀−) 等于 P(X=x₀)，即该点的概率质量。'
  },
  {
    kind: 'problem',
    title: '两盒抽球的贝叶斯判断',
    statement: '等概率选择甲、乙两盒。甲盒有 2 红 1 蓝，乙盒有 1 红 2 蓝。抽到红球后，它来自甲盒的概率为（ ）。',
    tags: ['概率论', '条件概率', '贝叶斯', '选择题'],
    coreMethod: '后验概率=该路径联合概率÷所有能产生观测结果的路径总概率。',
    mistakes: '看到“等概率选盒”就直接回答 1/2，忽略两盒产生红球的似然不同。',
    answerText: '正确选项 C，概率为 2/3。',
    questionFormat: 'single-choice',
    options: ['1/3', '1/2', '2/3', '3/4'],
    correctOptionIds: ['C'],
    solutionMethods: [
      { title: '方法一 · 贝叶斯公式', content: 'P(甲|红)=[P(甲)P(红|甲)]/[P(甲)P(红|甲)+P(乙)P(红|乙)]=[(1/2)(2/3)]/[(1/2)(2/3)+(1/2)(1/3)]=2/3。' },
      { title: '方法二 · 等可能路径', content: '可把“先选盒再选球”看成 6 条等概率的标号球路径。产生红球的路径共有 3 条，其中甲盒贡献 2 条，因此条件概率为 2/3。' }
    ]
  },
  {
    kind: 'problem',
    title: '协方差与独立性辨析',
    statement: '设 X、Y 二阶矩存在，下列结论一定正确的是（多选）。',
    tags: ['概率论', '协方差', '独立性', '多选题'],
    coreMethod: '独立推出不相关，但不相关一般不能反推独立；方差展开式永远有效。',
    mistakes: '只有在联合正态等附加条件下，“不相关”才可推出独立。',
    answerText: '正确选项 A、C。',
    questionFormat: 'multiple-choice',
    options: ['X、Y 独立则 Cov(X,Y)=0', 'Cov(X,Y)=0 则 X、Y 独立', 'Var(X+Y)=Var(X)+Var(Y)+2Cov(X,Y)', 'Corr(X,Y)=0 对任意 X、Y 都成立'],
    correctOptionIds: ['A', 'C'],
    solutionMethods: [
      { title: '方法一 · 公式链', content: '独立时 E(XY)=E(X)E(Y)，所以协方差为 0，A 正确。把 X+Y 中心化并平方展开即可得到 C。B 的逆命题一般不成立，D 更不是恒等式。' },
      { title: '方法二 · 反例检验', content: '取 X 在 [−1,1] 上对称且 Y=X²，则 Cov(X,Y)=E(X³)−E(X)E(X²)=0，但 Y 完全由 X 决定，并不独立，从而直接否定 B。A、C 则由定义严格推出。' }
    ]
  },
  {
    kind: 'problem',
    title: '三阶 Vandermonde 行列式',
    statement: '行列式 |1 1 1; 1 2 4; 1 3 9| 的值为（ ）。',
    tags: ['线性代数', '行列式', '选择题'],
    coreMethod: '识别 Vandermonde 结构，或连续作行差把第一列清零。',
    mistakes: 'Vandermonde 乘积的因子顺序决定符号；这里节点按 1,2,3 排列。',
    answerText: '正确选项 C，行列式值为 2。',
    questionFormat: 'single-choice',
    options: ['−2', '1', '2', '6'],
    correctOptionIds: ['C'],
    solutionMethods: [
      { title: '方法一 · Vandermonde 公式', content: '节点为 1、2、3，行列式等于 (2−1)(3−1)(3−2)=2。' },
      { title: '方法二 · 行变换', content: '作 R₃←R₃−R₁、R₂←R₂−R₁，得到第一列下方为 0；余下二阶行列式为 |1 3;2 8|=8−6=2。' }
    ]
  },
  {
    kind: 'problem',
    title: '圆周上的 Green 公式',
    statement: 'C 为圆 x²+y²=R² 的正向边界，计算 ∮ᴄ(−y dx+x dy)。',
    tags: ['高等数学', '曲线积分', 'Green公式'],
    coreMethod: 'P=−y、Q=x，使 ∂Q/∂x−∂P/∂y 成为常数 2。',
    mistakes: '“正向”是逆时针；若改成顺时针，结果整体变号。',
    answerText: '积分为 2πR²。',
    solutionMethods: [
      { title: '方法一 · Green 公式', content: '∮ᴄPdx+Qdy=∬ᴅ(Qₓ−Pᵧ)dA=∬ᴅ[1−(−1)]dA=2·πR²。' },
      { title: '方法二 · 参数方程', content: '取 x=Rcos t、y=Rsin t，0≤t≤2π。则 −y dx+x dy=R²(sin²t+cos²t)dt=R²dt，积分为 2πR²。' }
    ]
  },
  {
    kind: 'problem',
    title: '多元可微命题辨析',
    statement: '设 z=f(x,y)，下列命题正确的是（多选）。',
    tags: ['高等数学', '多元微分', '定义', '多选题'],
    coreMethod: '牢牢记住两条单向链：可微推出连续和偏导存在；偏导邻域连续推出可微。',
    mistakes: '梯度为零只是极值的必要条件之一，不是充分条件。',
    answerText: '正确选项 A、D。',
    questionFormat: 'multiple-choice',
    options: ['在一点可微则在该点连续', '在一点两个偏导都存在则在该点可微', '在一点梯度为零则该点必为极值点', '两个偏导在该点邻域存在并在该点连续，则在该点可微'],
    correctOptionIds: ['A', 'D'],
    solutionMethods: [
      { title: '方法一 · 定理关系图', content: '可微的定义式直接令增量趋零即可推出连续，因此 A 真。偏导在邻域存在且在点处连续是可微的常用充分条件，D 真。B 缺少统一二维控制，C 可被鞍点反驳。' },
      { title: '方法二 · 典型反例', content: '对 B 可用 f=xy/√(x²+y²)（原点补 0）：原点偏导存在但沿 y=x 不满足可微。对 C 用 f=x²−y²，原点梯度为零却是鞍点。于是只剩 A、D。' }
    ]
  },
  {
    kind: 'problem',
    title: '正权积分的均值位置',
    statement: '设 f 在 [0,1] 上连续且 f(x)>0，则 [∫₀¹xf(x)dx]/[∫₀¹f(x)dx] 的取值范围是（ ）。',
    tags: ['高等数学', '定积分', '不等式', '选择题'],
    coreMethod: '把比值看作以 f 为正权的 x 的加权平均。',
    mistakes: '连续且严格正使等号不能在 0 或 1 处取得，所以是开区间。',
    answerText: '正确选项 B，该比值严格属于 (0,1)。',
    questionFormat: 'single-choice',
    options: ['[0,1]', '(0,1)', '[0,1)', '(0,+∞)'],
    correctOptionIds: ['B'],
    solutionMethods: [
      { title: '方法一 · 正权平均', content: '分母为正。因为 0<x<1 在区间内部成立且 f>0，故 0<∫₀¹xf(x)dx<∫₀¹f(x)dx，两端同除正分母即得比值在 (0,1)。' },
      { title: '方法二 · 积分中值定理', content: '加权积分中值定理给出存在 ξ∈(0,1)，使 ∫₀¹xf(x)dx=ξ∫₀¹f(x)dx，因此该比值正好等于某个 ξ∈(0,1)。' }
    ]
  }
]

originalSeeds.push(...foundationConclusionSeeds)

export const DEPRECATED_SEED_IDS = ['seed-56', 'seed-65'] as const

const allSeeds = [...originalSeeds, ...curatedQuestionSeeds]

function legacyFingerprint(seed: SeedInput, id: string) {
  const topic = seed.tags.filter((tag) => !/^第\\d+讲$/.test(tag)).slice(0, 3).join('.')
  return `legacy:${topic}:${seed.title}:${id}`
}

export function makeSeedProblems(now = Date.now()): Problem[] {
  return allSeeds.map((seed, index) => {
    const optionIds = ['A', 'B', 'C', 'D', 'E', 'F']
    const alternate = legacyAlternateMethods[seed.title]
    const methods = seed.solutionMethods
      || (seed.kind === 'problem'
        ? [
            { title: '方法一 · 主线推导', content: seed.answerText },
            alternate || { title: '方法二 · 结构复核', content: `${seed.coreMethod} 完成后再用定义、代回或边界情形复核结论。` }
          ]
        : [])

    const id = seed.id || `seed-${String(index + 1).padStart(2, '0')}`
    return {
      id,
      kind: seed.kind,
      title: seed.title,
      statement: seed.statement,
      tags: seed.tags,
      coreMethod: seed.coreMethod,
      mistakes: seed.mistakes,
      answerText: seed.answerText,
      questionFormat: seed.questionFormat || 'open',
      options: (seed.options || []).map((text, optionIndex) => ({ id: optionIds[optionIndex], text })),
      correctOptionIds: seed.correctOptionIds || [],
      solutionMethods: methods.map((method, methodIndex) => ({ id: `method-${methodIndex + 1}`, ...method })),
      methodFingerprint: seed.methodFingerprint || legacyFingerprint(seed, id),
      source: seed.source || '斗破数学 · 考纲原创同型',
      page: seed.page || '',
      createdAt: now - (allSeeds.length - index) * 1000,
      updatedAt: now - (allSeeds.length - index) * 1000,
      nextReviewAt: now - (allSeeds.length - index) * 1000,
      intervalIndex: -1,
      reviewCount: 0,
      isSeed: true,
      seedVersion: 4
    }
  }).filter((problem) => !DEPRECATED_SEED_IDS.includes(problem.id as typeof DEPRECATED_SEED_IDS[number]))
}
