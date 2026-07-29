export interface TheoremKnowledgeEntry {
  id: string
  name: string
  aliases: string[]
  category: string
  summary: string
  conditions: string[]
  conclusion: string
  formulas: string[]
  intuition: string
  traps: string[]
  example: string
}

export interface TheoremTextSegment {
  type: 'text' | 'theorem'
  text: string
  theorem?: TheoremKnowledgeEntry
}

export const THEOREM_KNOWLEDGE: TheoremKnowledgeEntry[] = [
  {
    id: 'equivalent-infinitesimal',
    name: '等价无穷小',
    aliases: ['等价无穷小'],
    category: '极限',
    summary: '用比值趋于 $1$ 描述两个无穷小具有相同主阶，最适合替换乘除结构中的因子。',
    conditions: ['$\\alpha(x)\\to0$、$\\beta(x)\\to0$', '$\\alpha(x)/\\beta(x)\\to1$'],
    conclusion: '记作 $\\alpha\\sim\\beta$。在乘积或商中通常可以替换，但在和差中逐项替换可能抹掉首项。',
    formulas: ['\\alpha\\sim\\beta\\iff\\lim\\frac{\\alpha}{\\beta}=1'],
    intuition: '它只保证两者的第一主阶相同，并不保证相减后的高阶差异仍可忽略。',
    traps: ['不要在加减法中机械逐项替换。', '替换前确认分母在去心邻域内不为零。'],
    example: '$1-\\cos x\\sim x^2/2$，但在 $1-\\cos x$ 中把 $\\cos x$ 直接替成 $1$ 会丢失全部有效信息。'
  },
  {
    id: 'lhopital-rule',
    name: '洛必达法则',
    aliases: ['L’Hospital 法则', 'LHospital 法则', '洛必达法则', '洛必达'],
    category: '极限',
    summary: '把特定的未定式极限转化为分子、分母导数之比的极限。',
    conditions: ['原式为 $0/0$ 型或 $\\infty/\\infty$ 型', '分子、分母在去心邻域可导，且分母导数不为零', '$f^{(1)}(x)/g^{(1)}(x)$ 的极限存在或为无穷'],
    conclusion: '在条件成立时，$f/g$ 与 $f^{(1)}/g^{(1)}$ 具有相同极限。',
    formulas: ['\\lim\\frac{f(x)}{g(x)}=\\lim\\frac{f^{(1)}(x)}{g^{(1)}(x)}'],
    intuition: '分子和分母都接近零或同时变大时，局部变化率决定它们的相对速度。',
    traps: ['不是 $0/0$ 或 $\\infty/\\infty$ 型时不能直接使用。', '每使用一次都要重新检查新的未定式。'],
    example: '$\\lim_{x\\to0}(e^x-1)/x=\\lim_{x\\to0}e^x=1$。'
  },
  {
    id: 'taylor-formula',
    name: 'Taylor 公式',
    aliases: ['Taylor 公式', 'Taylor公式', '泰勒公式', 'Taylor 展开', '泰勒展开'],
    category: '微分',
    summary: '在展开点附近，用有限阶多项式加余项描述函数。',
    conditions: ['Peano 形式要求函数在展开点具有相应阶导数', 'Lagrange 余项形式要求连接区间上具有更高一阶导数'],
    conclusion: '多项式部分控制局部主阶，余项决定近似精度或严格误差界。',
    formulas: ['f(x)=\\sum_{k=0}^{n}\\frac{f^{(k)}(x_0)}{k!}(x-x_0)^k+o((x-x_0)^n)'],
    intuition: '可导函数在足够小的尺度下逐层接近直线、抛物线以及更高次多项式。',
    traps: ['需要几阶精度，就至少展开到首个不会抵消的阶。', '局部的 $o(x^n)$ 不能直接当作任意区间上的全局误差界。'],
    example: '$e^x=1+x+x^2/2+o(x^2)$，所以 $(e^x-1-x)/x^2\\to1/2$。'
  },
  {
    id: 'rolle-theorem',
    name: 'Rolle 定理',
    aliases: ['Rolle 定理', 'Rolle定理', '罗尔定理'],
    category: '中值定理',
    summary: '端点函数值相等时，区间内部至少出现一个水平切点。',
    conditions: ['$f$ 在 $[a,b]$ 上连续', '$f$ 在 $(a,b)$ 内可导', '$f(a)=f(b)$'],
    conclusion: '至少存在 $\\xi\\in(a,b)$，使 $f^{(1)}(\\xi)=0$。',
    formulas: ['f(a)=f(b)\\Longrightarrow\\exists\\xi\\in(a,b),\\ f^{(1)}(\\xi)=0'],
    intuition: '连续曲线从同一高度出发又回到同一高度，中间必有瞬时斜率为零的位置。',
    traps: ['缺少闭区间连续或开区间可导时结论可能失败。', '$\\xi$ 在开区间内，不是端点。'],
    example: '$f(x)=x^2-1$ 在 $[-1,1]$ 满足条件，$f^{(1)}(0)=0$。'
  },
  {
    id: 'lagrange-mean-value',
    name: 'Lagrange 中值定理',
    aliases: ['Lagrange 中值定理', 'Lagrange中值定理', '拉格朗日中值定理'],
    category: '中值定理',
    summary: '区间上的平均变化率等于某个内部点的瞬时变化率。',
    conditions: ['$f$ 在 $[a,b]$ 上连续', '$f$ 在 $(a,b)$ 内可导'],
    conclusion: '至少存在 $\\xi\\in(a,b)$，使函数增量等于该点导数乘区间长度。',
    formulas: ['f(b)-f(a)=f^{(1)}(\\xi)(b-a)'],
    intuition: '连接两端点的割线斜率，一定在内部某处被切线斜率取到。',
    traps: ['证明题中必须写出使用的具体区间。', '结论只保证至少存在一个 $\\xi$，通常不能确定其唯一性。'],
    example: '对 $f(x)=\\ln x$ 在 $[1,e]$ 使用定理，可得某个 $\\xi\\in(1,e)$ 满足 $1=(e-1)/\\xi$。'
  },
  {
    id: 'cauchy-mean-value',
    name: 'Cauchy 中值定理',
    aliases: ['Cauchy 中值定理', 'Cauchy中值定理', '柯西中值定理'],
    category: '中值定理',
    summary: '把两个函数的增量之比转化为某个中间点的导数之比。',
    conditions: ['$f,g$ 在 $[a,b]$ 上连续、在 $(a,b)$ 内可导', '$g(b)\\ne g(a)$，并确保相关分母不为零'],
    conclusion: '存在 $\\xi\\in(a,b)$，使两个函数的增量比等于导数比。',
    formulas: ['\\frac{f(b)-f(a)}{g(b)-g(a)}=\\frac{f^{(1)}(\\xi)}{g^{(1)}(\\xi)}'],
    intuition: '它是 Lagrange 中值定理的双函数版本，适合处理目标中天然出现的两个增量。',
    traps: ['不能只写“由中值定理”，要说明两个辅助函数。', '分母增量和分母导数的非零条件都要检查。'],
    example: '对 $f(t)=\\ln t$、$g(t)=t$ 在 $[1,x]$ 使用，可得 $\\ln x/(x-1)=1/\\xi$。'
  },
  {
    id: 'darboux-theorem',
    name: 'Darboux 定理',
    aliases: ['Darboux 定理', 'Darboux定理', '导函数的 Darboux 性质', '导函数介值性'],
    category: '导数',
    summary: '导函数即使不连续，也不会发生跳跃。',
    conditions: ['$F$ 在区间上可导'],
    conclusion: '$F^{(1)}$ 在任意两个导数值之间取得所有中间值。',
    formulas: ['F^{(1)}(x_1)<\\lambda<F^{(1)}(x_2)\\Longrightarrow\\exists\\xi,\\ F^{(1)}(\\xi)=\\lambda'],
    intuition: '导函数可能振荡，但从一个斜率变化到另一个斜率时不能跨过中间斜率。',
    traps: ['Darboux 性质不等于导函数连续。', '具有跳跃间断的函数不可能是某个函数的导函数。'],
    example: '只取 $-1$ 与 $1$、在原点跳跃的阶跃函数不可能在跨过原点的区间上拥有原函数。'
  },
  {
    id: 'newton-leibniz',
    name: 'Newton-Leibniz 公式',
    aliases: ['Newton-Leibniz 公式', 'Newton-Leibniz公式', '牛顿-莱布尼茨公式', '微积分基本定理'],
    category: '积分',
    summary: '用任一原函数在端点的增量计算连续函数的定积分。',
    conditions: ['$f$ 在 $[a,b]$ 上连续', '$F^{(1)}=f$'],
    conclusion: '定积分等于原函数在上限与下限处的函数值之差。',
    formulas: ['\\int_a^b f(x)\\,dx=F(b)-F(a)'],
    intuition: '积分累计量的瞬时变化率就是被积函数，因此累计量与原函数只差常数。',
    traps: ['上下限顺序不能颠倒。', '原函数中的积分常数会在相减时抵消。'],
    example: '$\\int_0^1 3x^2e^{x^3}dx=[e^{x^3}]_0^1=e-1$。'
  },
  {
    id: 'variable-limit-derivative',
    name: '变上限积分求导',
    aliases: ['变上限积分求导', '变限积分求导'],
    category: '积分',
    summary: '把积分上限的变化与被积函数在端点处的函数值联系起来。',
    conditions: ['$f$ 连续', '上限函数 $g(x)$ 可导'],
    conclusion: '先在变上限处取被积函数值，再乘上限函数的导数。',
    formulas: ['\\frac{d}{dx}\\int_a^{g(x)}f(t)\\,dt=f(g(x))g^{(1)}(x)'],
    intuition: '上限移动一小段时，新增面积约等于端点高度乘新增宽度。',
    traps: ['不要漏乘 $g^{(1)}(x)$。', '上下限都变化时，要分别求导并注意下限项的负号。'],
    example: '$F(x)=\\int_0^{x^2}e^{-t^2}dt$，则 $F^{(1)}(x)=2xe^{-x^4}$。'
  },
  {
    id: 'integral-mean-value',
    name: '积分中值定理',
    aliases: ['定积分中值定理', '积分中值定理'],
    category: '积分',
    summary: '连续函数在区间上的平均值，等于它在区间内某一点的函数值。',
    conditions: ['$f$ 在闭区间 $[a,b]$ 上连续'],
    conclusion: '存在 $\\xi\\in[a,b]$，使定积分等于函数值乘区间长度。',
    formulas: ['\\int_a^b f(x)\\,dx=f(\\xi)(b-a)'],
    intuition: '连续曲线的平均高度一定落在最低点与最高点之间，而连续函数会取得这个高度。',
    traps: ['只可积但不连续时，平均值未必能被函数真正取到。', '若函数严格单调，可把 $\\xi$ 进一步定位到 $(a,b)$。'],
    example: '$e^{-x^2}$ 在 $[0,1]$ 连续，所以存在 $\\xi\\in[0,1]$ 使 $\\int_0^1e^{-x^2}dx=e^{-\\xi^2}$。'
  },
  {
    id: 'weighted-integral-mean-value',
    name: '正权积分中值定理',
    aliases: ['正权积分中值定理', '加权积分中值定理', '正权中值定理'],
    category: '积分',
    summary: '用非负权函数形成加权平均，把带权积分化为某个函数值乘总权重。',
    conditions: ['$f$ 连续', '$g$ 可积且 $g(x)\\ge0$', '$\\int_a^bg(x)dx>0$'],
    conclusion: '存在 $\\xi\\in[a,b]$，使 $\\int fg=f(\\xi)\\int g$。',
    formulas: ['\\int_a^b f(x)g(x)\\,dx=f(\\xi)\\int_a^b g(x)\\,dx'],
    intuition: '权重越大的位置对平均值贡献越大，但正权平均仍不会跑出函数值的最小值与最大值之间。',
    traps: ['权函数变号时结论一般失效。', '总权重为零时不能除以 $\\int g$。'],
    example: '取 $g(x)=x$，可得某个 $\\xi\\in[0,1]$ 使 $\\int_0^1xf(x)dx=f(\\xi)/2$。'
  },
  {
    id: 'integral-cauchy-schwarz',
    name: '积分型 Cauchy-Schwarz 不等式',
    aliases: ['积分型 Cauchy-Schwarz 不等式', '积分型柯西不等式', '积分 Cauchy 不等式'],
    category: '积分不等式',
    summary: '函数空间中的内积满足柯西不等式。',
    conditions: ['$f,g$ 平方可积'],
    conclusion: '两个函数乘积积分的平方不超过各自平方积分的乘积。',
    formulas: ['\\left(\\int_a^b f(x)g(x)\\,dx\\right)^2\\le\\left(\\int_a^b f^2(x)\\,dx\\right)\\left(\\int_a^b g^2(x)\\,dx\\right)'],
    intuition: '它与向量点积不超过长度乘积完全同构。',
    traps: ['求最值时不能只写下界，还要检查等号条件。', '等号要求两个函数几乎处处成比例。'],
    example: '令 $g\\equiv1$，得到 $(\\int_a^bf)^2\\le(b-a)\\int_a^bf^2$。'
  },
  {
    id: 'leibniz-higher-derivative',
    name: 'Leibniz 高阶求导公式',
    aliases: ['Leibniz 高阶求导公式', 'Leibniz 公式', '莱布尼茨高阶求导公式'],
    category: '导数',
    summary: '乘积的 $n$ 阶导数按二项式系数分配到两个因子。',
    conditions: ['$u,v$ 都具有 $n$ 阶导数'],
    conclusion: '枚举 $k=0,1,\\ldots,n$，把 $k$ 阶导数分给第一个因子。',
    formulas: ['(uv)^{(n)}=\\sum_{k=0}^{n}\\binom nk u^{(k)}v^{(n-k)}'],
    intuition: '每求一次导，都有“导前一个”或“导后一个”两种选择，组合次数形成二项式系数。',
    traps: ['不要漏掉 $\\binom nk$。', '先筛掉高阶导数恒为零的项，可以显著减少计算。'],
    example: '对 $x^2e^x$，只有 $x^2$ 的零、一、二阶导数可能非零。'
  },
  {
    id: 'implicit-function-theorem',
    name: '隐函数定理',
    aliases: ['隐函数定理'],
    category: '多元微分',
    summary: '当目标变量对应的偏导不为零时，方程可在局部唯一确定该变量。',
    conditions: ['$F$ 在目标点附近连续可微', '$F(x_0,y_0)=0$', '$F_y(x_0,y_0)\\ne0$'],
    conclusion: '局部存在 $y=y(x)$，且 $y^{(1)}=-F_x/F_y$。',
    formulas: ['\\frac{dy}{dx}=-\\frac{F_x}{F_y}'],
    intuition: '$F_y\\ne0$ 表示沿 $y$ 方向可以有效调整函数值，从而把方程解成 $y$。',
    traps: ['使用公式前先检查被除偏导不为零。', '结论是局部的，不自动保证全局单值。'],
    example: '$x^2+y^2=1$ 在 $(0,1)$ 附近可确定上半圆，且 $y^{(1)}=-x/y$。'
  },
  {
    id: 'lagrange-multiplier',
    name: 'Lagrange 乘子法',
    aliases: ['Lagrange 乘子法', '拉格朗日乘子法'],
    category: '多元极值',
    summary: '约束曲面上的极值点处，目标函数梯度与约束梯度平行。',
    conditions: ['$f,g$ 可微', '约束为 $g(x,y)=0$', '候选点处 $\\nabla g\\ne0$'],
    conclusion: '候选点满足 $\\nabla f=\\lambda\\nabla g$ 与约束方程。',
    formulas: ['\\nabla f=\\lambda\\nabla g,\\qquad g=0'],
    intuition: '沿约束曲线的所有可行切向方向，目标函数的一阶变化都必须为零。',
    traps: ['解出候选点后仍要比较函数值或判定极值类型。', '约束梯度为零的奇异点必须单独检查。'],
    example: '在 $x^2+y^2=1$ 上求 $x+y$ 最大值，可得最大值 $\\sqrt2$。'
  },
  {
    id: 'green-formula',
    name: 'Green 公式',
    aliases: ['Green 公式', 'Green公式', '格林公式'],
    category: '曲线积分',
    summary: '把平面闭曲线上的第二类曲线积分转化为所围区域上的二重积分。',
    conditions: ['$D$ 是适当的平面区域，边界 $C$ 取正向', '$P,Q$ 在区域邻域内具有连续一阶偏导'],
    conclusion: '边界环流等于区域内旋度的总和。',
    formulas: ['\\oint_C P\\,dx+Q\\,dy=\\iint_D(Q_x-P_y)\\,dA'],
    intuition: '内部相邻小区域的公共边界贡献彼此抵消，只剩最外层边界。',
    traps: ['正向通常指沿边界行进时区域在左侧。', '有孔区域需要包含所有边界分支并统一方向。'],
    example: '单位圆正向边界上，$P=-y,Q=x$ 的环流为 $\\iint_D2dA=2\\pi$。'
  },
  {
    id: 'gauss-formula',
    name: 'Gauss 公式',
    aliases: ['Gauss 公式', 'Gauss公式', '高斯公式', '散度定理'],
    category: '曲面积分',
    summary: '把闭曲面的外向通量转化为内部区域上的散度三重积分。',
    conditions: ['曲面闭合并取外侧', '向量场在所围区域及边界附近光滑；奇点需挖去单独处理'],
    conclusion: '总外通量等于区域内部散度的体积分。',
    formulas: ['\\iint_{\\partial\\Omega}\\boldsymbol F\\cdot\\boldsymbol n\\,dS=\\iiint_{\\Omega}\\nabla\\cdot\\boldsymbol F\\,dV'],
    intuition: '散度描述单位体积内的源强，所有内部源的总量最终从边界流出。',
    traps: ['开放曲面要先补面再使用。', '区域内有奇点时不能直接套公式。'],
    example: '$\\boldsymbol F=(x,y,z)$ 穿出单位球面的通量为 $3\\cdot4\\pi/3=4\\pi$。'
  },
  {
    id: 'stokes-formula',
    name: 'Stokes 公式',
    aliases: ['Stokes 公式', 'Stokes公式', '斯托克斯公式'],
    category: '曲线曲面积分',
    summary: '把空间闭曲线环流转化为任一同边界定向曲面上的旋度通量。',
    conditions: ['向量场在曲面邻域内具有连续一阶偏导', '边界方向与曲面法向满足右手规则'],
    conclusion: '闭曲线环流等于旋度穿过曲面的通量。',
    formulas: ['\\oint_{\\partial S}\\boldsymbol F\\cdot d\\boldsymbol r=\\iint_S(\\nabla\\times\\boldsymbol F)\\cdot\\boldsymbol n\\,dS'],
    intuition: '它是 Green 公式在三维空间中的推广，可以自由选择最容易积分的同边界曲面。',
    traps: ['换曲面时边界必须完全相同。', '方向不匹配会使结果差一个负号。'],
    example: '$\\boldsymbol F=(-y,x,z)$ 沿单位圆逆时针的环流为旋度 $(0,0,2)$ 穿过单位圆盘的通量 $2\\pi$。'
  },
  {
    id: 'fourier-convergence',
    name: 'Fourier 收敛定理',
    aliases: ['Fourier 收敛定理', 'Dirichlet 收敛定理', '傅里叶收敛定理'],
    category: '无穷级数',
    summary: '分段光滑周期函数的 Fourier 级数在一点收敛到左右极限的平均值。',
    conditions: ['周期函数满足常用的 Dirichlet 条件，例如分段光滑', '目标点的左右极限存在'],
    conclusion: '连续点收敛到函数值；跳跃点收敛到左右极限平均值。',
    formulas: ['S(x)=\\frac{f(x^-)+f(x^+)}2'],
    intuition: '级数在跳跃处无法选择某一侧，于是取两侧的对称平均。',
    traps: ['间断点的和值通常不等于人为指定的 $f(x)$。', '先做周期延拓，再判断端点左右极限。'],
    example: '左右极限分别为 $-1$ 与 $1$ 的跳跃点，Fourier 级数和值为 $0$。'
  },
  {
    id: 'cauchy-condensation',
    name: 'Cauchy 凝聚判别',
    aliases: ['Cauchy 凝聚判别', '柯西凝聚判别', '凝聚判别'],
    category: '无穷级数',
    summary: '把缓慢衰减的单调正项级数压缩成指数位置上的新级数。',
    conditions: ['$a_n$ 为单调递减的非负数列'],
    conclusion: '$\\sum a_n$ 与 $\\sum 2^ka_{2^k}$ 同敛散。',
    formulas: ['\\sum_{n=1}^{\\infty}a_n\\text{ 与 }\\sum_{k=0}^{\\infty}2^ka_{2^k}\\text{ 同敛散}'],
    intuition: '把 $[2^k,2^{k+1})$ 内约 $2^k$ 个相近项打包成一个凝聚项。',
    traps: ['必须检查单调性与非负性。', '凝聚后的下标是 $2^k$，不要漏掉前面的块长度 $2^k$。'],
    example: '$a_n=1/[n(\\ln n)^p]$ 凝聚后与 $1/k^p$ 同阶，因此恰在 $p>1$ 时收敛。'
  }
]

const aliases = THEOREM_KNOWLEDGE
  .flatMap((theorem) => theorem.aliases.map((alias) => ({ alias, theorem })))
  .sort((left, right) => right.alias.length - left.alias.length)

const aliasPattern = new RegExp('(' + aliases.map(({ alias }) => alias.replace(/[.*+?^$()|[\]\\{}]/g, '\\$&')).join('|') + ')', 'g')
const theoremByAlias = new Map(aliases.map(({ alias, theorem }) => [alias, theorem]))

export function splitTheoremReferences(text: string): TheoremTextSegment[] {
  if (!text || !aliasPattern.source) return [{ type: 'text', text }]
  return text.split(aliasPattern).filter(Boolean).map((segment) => {
    const theorem = theoremByAlias.get(segment)
    return theorem ? { type: 'theorem', text: segment, theorem } : { type: 'text', text: segment }
  })
}
