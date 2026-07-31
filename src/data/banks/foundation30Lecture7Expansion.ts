import type { SeedInput } from './types'

const ZY30_SOURCE = '何耀焜私人整理 · 张宇《基础30讲》高数 · 第7讲逐页核验'

type LectureSevenSeed = Omit<SeedInput, 'id' | 'kind' | 'tags' | 'methodFingerprint' | 'source'> & {
  id: string
  role: 'example' | 'exercise'
  tags: string[]
  fingerprint: string
}

function lectureSeven(input: LectureSevenSeed): SeedInput {
  const roleLabel = input.role === 'example' ? '经典例题' : '课后习题'
  return {
    ...input,
    id: `zy30-verified-l07-${input.id}`,
    kind: 'problem',
    source: ZY30_SOURCE,
    tags: ['高等数学', '第7讲', roleLabel, 'PDF逐页核验', ...input.tags],
    methodFingerprint: `zy30-verified:l07:${input.fingerprint}`
  }
}

export const foundation30Lecture7ExpansionSeeds: SeedInput[] = [
  lectureSeven({
    id: 'example-7-1-cubic-distance-rate', role: 'example', page: 'PDF 193 · 书页 188 · 例 7.1',
    fingerprint: 'related-rate:cubic-curve-origin-distance-horizontal-speed',
    title: '例 7.1 · 三次曲线上动点到原点距离的变化率',
    statement: `动点 $P$ 在曲线 $y=x^3$ 上运动，记坐标原点 $O$ 与点 $P$ 之间的距离为 $l$。若点 $P$ 的横坐标对时间的变化率为常数 $v_0$，求点 $P$ 运动到 $(1,1)$ 时 $l$ 对时间的变化率。`,
    tags: ['相关变化率', '链式法则', '速度'],
    coreMethod: '先把距离写成横坐标的函数，再对时间求导；也可直接把横、纵速度合成到径向方向。',
    mistakes: '题目问的是到原点的直线距离变化率，不是沿曲线的弧长速率；二者公式不同。',
    answerText: `$$\\left.\\frac{dl}{dt}\\right|_{(1,1)}=2\\sqrt2\\,v_0.$$`,
    solutionMethods: [
      { title: '方法一 · 距离函数链式求导', content: `由 $y=x^3$，

$$l=\\sqrt{x^2+y^2}=\\sqrt{x^2+x^6}.$$

因此

$$\\frac{dl}{dt}=\\frac{x+3x^5}{\\sqrt{x^2+x^6}}\\frac{dx}{dt}.$$

在 $x=1$ 且 $dx/dt=v_0$ 时，得到 $dl/dt=4v_0/\\sqrt2=2\\sqrt2\\,v_0$。` },
      { title: '方法二 · 隐式关系与速度投影', content: `由 $l^2=x^2+y^2$ 对时间求导，

$$l\\frac{dl}{dt}=x\\frac{dx}{dt}+y\\frac{dy}{dt}.$$

又 $dy/dt=3x^2dx/dt$。在 $(x,y)=(1,1)$ 时，$l=\\sqrt2$、$dy/dt=3v_0$，故 $dl/dt=(v_0+3v_0)/\\sqrt2=2\\sqrt2\\,v_0$。` }
    ]
  }),
  lectureSeven({
    id: 'example-7-2-wine-present-value', role: 'example', page: 'PDF 193-194 · 书页 188-189 · 例 7.2',
    fingerprint: 'economic-optimization:continuous-discount-wine-value-square-root-growth',
    title: '例 7.2 · 陈酿增值与连续复利下的最佳窖藏期',
    statement: `某酒厂有一批新酿的好酒。若现在售出，总收入为 $R_0$ 元；若窖藏 $t$ 年后按逐渐提高的价格售出，届时总收入为

$$R(t)=R_0e^{\\frac25\\sqrt t}.$$

银行年利率为 $r>0$，按连续复利计息。求使售出收入现值最大的窖藏时间；并计算 $r=6\\%$ 时的近似年数。`,
    tags: ['连续复利', '现值', '最优化'],
    coreMethod: '先把未来收入折现为现值函数，再对指数部分求极值；指数函数单调，最大化现值等价于最大化指数。',
    mistakes: '只最大化未来售价 $R(t)$ 而漏掉折现因子 $e^{-rt}$；或把 $6\\%$ 错代成 $6$。',
    answerText: `最佳窖藏时间为

$$t_0=\\frac1{25r^2}.$$

当 $r=0.06$ 时，$t_0=100/9\\approx11.1$ 年。`,
    solutionMethods: [
      { title: '方法一 · 现值函数求导', content: `窖藏 $t$ 年后的收入现值为

$$A(t)=R(t)e^{-rt}=R_0e^{\\frac25\\sqrt t-rt}.$$

对数求导得

$$\\frac{A'(t)}{A(t)}=\\frac1{5\\sqrt t}-r.$$

令其为零，得 $\\sqrt{t_0}=1/(5r)$，即 $t_0=1/(25r^2)$。导数在 $t_0$ 前正、后负，所以该点给出唯一最大值。` },
      { title: '方法二 · 指数配方', content: `令 $u=\\sqrt t\\ge0$，则现值的指数为

$$\\frac25u-ru^2=-r\\left(u-\\frac1{5r}\\right)^2+\\frac1{25r}.$$

平方项最小时指数最大，因此 $u=1/(5r)$，仍得 $t_0=1/(25r^2)$。` }
    ]
  }),
  lectureSeven({
    id: 'example-7-3-marginal-profit', role: 'example', page: 'PDF 196-197 · 书页 191-192 · 例 7.3',
    fingerprint: 'marginal-profit:linear-price-fixed-variable-cost-optimal-price',
    title: '例 7.3 · 边际利润的经济含义与最大利润售价',
    statement: `生产某商品的固定成本为 $60\\,000$ 元，可变成本为 $20$ 元/件，价格函数为

$$p=60-\\frac{Q}{1000},$$

其中 $p$ 为单价、$Q$ 为销量。已知产销平衡，求：

1. 边际利润函数；
2. 当 $p=50$ 元时的边际利润及其经济含义；
3. 使利润最大的单价。`,
    tags: ['边际利润', '价格函数', '最大利润'],
    coreMethod: '由价格函数先写收益，再用利润等于收益减成本；边际利润是利润关于销量的导数。',
    mistakes: '收益应为 $pQ$，不能把单价函数本身当收益；求最大利润后还要把最优销量代回价格函数。',
    answerText: `边际利润为

$$L'(Q)=40-\\frac{Q}{500}.$$

当 $p=50$ 时 $Q=10\\,000$，边际利润为 $20$ 元/件；利润最大时 $Q=20\\,000$，对应单价 $p=40$ 元。`,
    solutionMethods: [
      { title: '方法一 · 利润函数直接求导', content: `成本、收益和利润分别为

$$C(Q)=60\\,000+20Q,\\qquad R(Q)=60Q-\\frac{Q^2}{1000},$$

$$L(Q)=40Q-\\frac{Q^2}{1000}-60\\,000.$$

故 $L'(Q)=40-Q/500$。当 $p=50$ 时 $Q=10\\,000$，所以 $L'=20$。令 $L'=0$ 得 $Q=20\\,000$；又 $L''=-1/500<0$，该点为最大值点，代回得 $p=40$。` },
      { title: '方法二 · 边际收益等于边际成本', content: `边际收益为

$$R'(Q)=60-\\frac{Q}{500},$$

边际成本恒为 $C'(Q)=20$，所以边际利润为二者之差。最优内部产量满足 $R'=C'$，即 $60-Q/500=20$，得到 $Q=20\\,000$ 和 $p=40$。` }
    ]
  }),
  lectureSeven({
    id: 'example-7-4-revenue-elasticity', role: 'example', page: 'PDF 197 · 书页 192 · 例 7.4',
    fingerprint: 'elasticity:revenue-derivative-and-revenue-price-elasticity',
    title: '例 7.4 · 由需求弹性推出收益变化率',
    statement: `某商品需求量 $Q=Q(p)$ 是价格 $p$ 的单调减少函数，其需求弹性为

$$\\eta=\\frac{2p^2}{192-p^2}>0.$$

设总收益 $R(p)=pQ(p)$。

1. 证明 $dR/dp=Q(1-\\eta)$；
2. 当 $p=6$ 时，求总收益对价格的弹性并说明其经济含义。`,
    tags: ['需求弹性', '收益弹性', '边际分析'],
    coreMethod: `把需求弹性定义中的 $pQ'/Q$ 代入乘积导数，并把收益的相对变化率继续化简。`,
    mistakes: `本题把需求弹性取为正值 $\\eta=-pQ'/Q$；漏掉负号会把收益变化方向完全判反。`,
    answerText: `有 $R'(p)=Q(1-\\eta)$。当 $p=6$ 时，总收益对价格的弹性为

$$\\frac{p}{R}\\frac{dR}{dp}=\\frac7{13}\\approx0.54.$$

价格小幅上涨 $1\\%$ 时，总收益约上涨 $0.54\\%$。`,
    solutionMethods: [
      { title: '方法一 · 乘积求导代入弹性', content: `由 $\\eta=-pQ'/Q$，有 $pQ'=-\\eta Q$。于是

$$\\frac{dR}{dp}=\\frac{d(pQ)}{dp}=Q+pQ'=Q(1-\\eta).$$

收益对价格的弹性为

$$\\frac{p}{R}R'=\\frac{p}{pQ}Q(1-\\eta)=1-\\eta.$$

当 $p=6$ 时，$\\eta=72/156=6/13$，故结果为 $1-6/13=7/13$。` },
      { title: '方法二 · 对数微分', content: `由 $R=pQ$，相对微分满足

$$\\frac{dR}{R}=\\frac{dp}{p}+\\frac{dQ}{Q}.$$

需求弹性给出 $dQ/Q=-\\eta\\,dp/p$，所以 $dR/R=(1-\\eta)dp/p$。代入 $p=6$ 后同样得到收益相对变化约为价格相对变化的 $7/13$。` }
    ]
  }),
  lectureSeven({
    id: 'example-7-5-elasticity-direction-selection', role: 'example', page: 'PDF 197-198 · 书页 192-193 · 例 7.5',
    fingerprint: 'elasticity-choice:price-change-revenue-direction-by-unit-threshold',
    title: '例 7.5 · 弹性阈值决定提价后的收益方向',
    statement: `设某商品需求量 $Q$ 对价格 $p$ 的弹性为 $\\eta>0$，收益为 $R=pQ$。下列判断正确的是（ ）。`,
    tags: ['需求弹性', '收益变化', '选择题'],
    coreMethod: '利用 $dR/dp=Q(1-\\eta)$ 判断价格微小变化与收益变化的同向或反向关系。',
    mistakes: '只看价格提高就断言收益增加；销量的相对下降幅度可能超过价格的相对上升幅度。',
    answerText: '正确选项为 A。需求缺乏弹性时，小幅提价会使总收益增加。',
    questionFormat: 'single-choice',
    options: [
      '当 $\\eta<1$、$\\Delta p>0$ 时，$\\Delta R>0$',
      '当 $\\eta<1$、$\\Delta p<0$ 时，$\\Delta R>0$',
      '当 $\\eta>1$、$\\Delta p>0$ 时，$\\Delta R>0$',
      '当 $\\eta>1$、$\\Delta p<0$ 时，$\\Delta R<0$'
    ],
    correctOptionIds: ['A'],
    solutionMethods: [
      { title: '方法一 · 收益导数判号', content: `由 $R'(p)=Q(1-\\eta)$ 且 $Q>0$。当 $\\eta<1$ 时 $R'(p)>0$，所以小幅提价 $\\Delta p>0$ 会带来 $\\Delta R>0$，A 正确。其余三项与导数符号不符。` },
      { title: '方法二 · 相对变化量解释', content: `一阶近似下

$$\\frac{\\Delta R}{R}\\approx(1-\\eta)\\frac{\\Delta p}{p}.$$

当 $\\eta<1$ 时系数为正，收益与价格同向变化；当 $\\eta>1$ 时系数为负，二者反向变化。因此只有 A 成立。` }
    ]
  }),
  lectureSeven({
    id: 'exercise-7-2-output-from-elasticities', role: 'exercise', page: 'PDF 198-199 · 书页 193-194 · 习题 7.2',
    fingerprint: 'elasticity-inversion:recover-output-from-demand-and-marginal-revenue',
    title: '习题 7.2 · 由需求弹性和边际收益反求产量',
    statement: `设某产品的需求函数为 $Q=Q(p)$，需求价格弹性为 $\\varepsilon$，且 $0<\\varepsilon<1$。已知产品收益 $R=pQ$ 对价格的边际为 $s$，并且产销平衡。用 $\\varepsilon,s$ 表示产品产量。`,
    tags: ['需求弹性', '边际收益', '反求产量'],
    coreMethod: `把 $R=pQ$ 对价格求导，再用需求弹性替换 $pQ'$，得到只含 $Q,\\varepsilon$ 的关系。`,
    mistakes: '本题的边际 $s$ 是 $dR/dp$，不是 $dR/dQ$；先确认自变量才能使用正确公式。',
    answerText: `$$Q=\\frac{s}{1-\\varepsilon}.$$`,
    solutionMethods: [
      { title: '方法一 · 乘积导数', content: `需求弹性满足

$$\\varepsilon=-\\frac{pQ'(p)}{Q(p)},$$

故 $pQ'=-\\varepsilon Q$。由题意

$$s=\\frac{dR}{dp}=Q+pQ'=Q(1-\\varepsilon).$$

因为 $0<\\varepsilon<1$，可除以 $1-\\varepsilon$，得到结论。` },
      { title: '方法二 · 相对微分', content: `由 $R=pQ$ 有

$$\\frac{dR}{R}=(1-\\varepsilon)\\frac{dp}{p}.$$

两边同除以 $dp$，再用 $R/p=Q$，得到 $dR/dp=Q(1-\\varepsilon)=s$，所以 $Q=s/(1-\\varepsilon)$。` }
    ]
  }),
  lectureSeven({
    id: 'exercise-7-3-two-cars-distance-rate', role: 'exercise', page: 'PDF 198-199 · 书页 193-194 · 习题 7.3',
    fingerprint: 'related-rate:perpendicular-cars-offset-start-distance-after-one-hour',
    title: '习题 7.3 · 两车沿垂直道路行驶时的距离变化率',
    statement: `甲车以 $24\\,\\mathrm{km/h}$ 的速度向北行驶；同时，位于其正东 $10\\,\\mathrm{km}$ 处的乙车以 $20\\,\\mathrm{km/h}$ 的速度向东行驶。从这一时刻起经过 $1$ 小时，求两车间距离对时间的变化率。`,
    tags: ['相关变化率', '勾股关系', '两车距离'],
    coreMethod: '用两个相互垂直的位移分量建立勾股关系，对时间求导后再代入同一时刻的数据。',
    mistakes: '乙车在开始时已经比甲车向东偏移 $10$ 千米，所以一小时后的横向距离是 $30$ 而不是 $20$。',
    answerText: `一小时后两车距离的增长率为

$$\\frac{196}{\\sqrt{41}}\\,\\mathrm{km/h}\\approx30.6\\,\\mathrm{km/h}.$$`,
    solutionMethods: [
      { title: '方法一 · 勾股关系求导', content: `设甲车北向位移为 $x=24t$，乙车相对初始竖线的东向距离为 $y+10=20t+10$。两车距离 $s$ 满足

$$s^2=x^2+(y+10)^2.$$

求导得

$$s\\frac{ds}{dt}=x\\frac{dx}{dt}+(y+10)\\frac{dy}{dt}.$$

当 $t=1$ 时，$x=24,y+10=30,s=6\\sqrt{41}$，故 $ds/dt=(24^2+30\\cdot20)/(6\\sqrt{41})=196/\\sqrt{41}$。` },
      { title: '方法二 · 相对速度投影', content: `一小时后从甲车指向乙车的相对位置向量可写为 $(30,-24)$，长度为 $6\\sqrt{41}$；相对速度为 $(20,-24)$。距离增长率等于相对速度在连线方向上的投影：

$$\\frac{(30,-24)\\cdot(20,-24)}{6\\sqrt{41}}=\\frac{1176}{6\\sqrt{41}}=\\frac{196}{\\sqrt{41}}.$$` }
    ]
  })
]
