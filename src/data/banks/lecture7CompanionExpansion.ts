import type { SeedInput } from './types'

const ZY1000_SOURCE = '何耀焜私人整理 · 张宇《1000题》数一解析册 · 第7章逐页核验'

type CompanionSeed = Omit<SeedInput, 'id' | 'kind' | 'tags' | 'methodFingerprint' | 'source'> & {
  id: string
  tags: string[]
  fingerprint: string
}

function companion(input: CompanionSeed): SeedInput {
  return {
    ...input,
    id: `zy1000-verified-l07-${input.id}`,
    kind: 'problem',
    source: ZY1000_SOURCE,
    tags: ['高等数学', '第7讲', '经典例题', 'PDF逐页核验', ...input.tags],
    methodFingerprint: `zy1000-verified:l07:${input.fingerprint}`
  }
}

export const lecture7CompanionExpansionSeeds: SeedInput[] = [
  companion({
    id: 'problem-2-heartbeat-rate-monotonicity', page: '解析 PDF 48 · 书页 42 · 第 2 题',
    fingerprint: 'motion-interpretation:cumulative-heartbeats-concavity-controls-rate',
    title: '1000题第 2 题 · 由累计心跳曲线判断心率变化',
    statement: `设 $f(t)$ 表示从观察开始到时刻 $t$ 的累计心跳次数。已知 $f$ 在 $(0,3)$ 上为凹函数，在 $(7,10)$ 上为凸函数。分别判断心跳次数对时间的变化率在这两个区间上的单调性。`,
    tags: ['速度', '凹凸性', '物理应用'],
    coreMethod: '累计量的一阶导数是瞬时心率，曲线的凹凸性则决定这一阶导数是递减还是递增。',
    mistakes: `把累计心跳次数 $f(t)$ 的增减与心率 $f'(t)$ 的增减混为一谈；本题问的是导数的单调性。`,
    answerText: `$f'(t)$ 在 $(0,3)$ 上单调递减，在 $(7,10)$ 上单调递增。`,
    solutionMethods: [
      { title: '方法一 · 二阶导数判号', content: `在可二阶求导的情形，凹函数满足 $f''(t)<0$，所以 $f'(t)$ 在 $(0,3)$ 上递减；凸函数满足 $f''(t)>0$，所以 $f'(t)$ 在 $(7,10)$ 上递增。$f'(t)$ 正是累计心跳次数的瞬时增长率。` },
      { title: '方法二 · 切线斜率比较', content: `凹曲线从左向右的切线斜率逐渐减小，因此心率下降；凸曲线的切线斜率逐渐增大，因此心率上升。该解释不需要先写出 $f$ 的具体表达式。` }
    ]
  }),
  companion({
    id: 'problem-3-conical-depth-rate', page: '解析 PDF 48 · 书页 42 · 第 3 题',
    fingerprint: 'related-rate:volume-depth-quadratic-conical-container',
    title: '1000题第 3 题 · 已知注入体积速率求液面上升速度',
    statement: `某容器中液体体积 $V$ 与液面深度 $y$ 满足

$$V=\\frac{\\pi}{2}y^2.$$

若液体以 $dV/dt=1\\,\\mathrm{m^3/min}$ 的速率注入，求液面深度为 $y=1\\,\\mathrm m$ 时的上升速度。`,
    tags: ['相关变化率', '体积', '液面速度'],
    coreMethod: '把体积看成深度的复合函数，用 $dV/dt=(dV/dy)(dy/dt)$ 连接已知速率和未知速率。',
    mistakes: '直接把 $dV/dt$ 当作 $dy/dt$；两者量纲不同，中间必须乘上截面积因子 $dV/dy$。',
    answerText: `$$\\left.\\frac{dy}{dt}\\right|_{y=1}=\\frac1\\pi\\,\\mathrm{m/min}.$$`,
    solutionMethods: [
      { title: '方法一 · 链式法则', content: `对 $V=\\pi y^2/2$ 关于时间求导，

$$\\frac{dV}{dt}=\\pi y\\frac{dy}{dt}.$$

代入 $dV/dt=1$ 与 $y=1$，得到 $dy/dt=1/\\pi$。` },
      { title: '方法二 · 瞬时截面积解释', content: `体积对深度的导数为 $dV/dy=\\pi y$，它就是深度为 $y$ 时的水平截面积。液面速度等于体积流量除以该截面积，因此在 $y=1$ 时为 $1/\\pi$。` }
    ]
  }),
  companion({
    id: 'problem-4-cylinder-coupled-rates', page: '解析 PDF 48 · 书页 42 · 第 4 题',
    fingerprint: 'related-rate:cylinder-volume-surface-two-equation-system',
    title: '1000题第 4 题 · 圆柱体积与表面积的耦合变化率',
    statement: `某圆柱体在变化过程中，底面半径为 $r\\,\\mathrm{cm}$，高为 $h\\,\\mathrm{cm}$，体积与表面积分别为

$$V=\\pi r^2h,\\qquad S=2\\pi rh+2\\pi r^2.$$

某时刻满足

$$\\frac{dr}{dt}=2,\\qquad \\frac{dh}{dt}=-3,\\qquad \\frac{dV}{dt}=-100\\pi,\\qquad \\frac{dS}{dt}=40\\pi.$$

求该时刻的 $r,h$。`,
    tags: ['相关变化率', '圆柱', '方程组'],
    coreMethod: '分别对体积和表面积公式关于时间求导，得到关于当时半径、高度的两个代数方程，再筛掉非物理解。',
    mistakes: '表面积包含侧面积和两个底面；漏掉 $2\\pi r^2$ 会使第二个方程错误。',
    answerText: `$$r=10\\,\\mathrm{cm},\\qquad h=5\\,\\mathrm{cm}.$$`,
    solutionMethods: [
      { title: '方法一 · 两式同时求导', content: `由体积公式，

$$-100\\pi=2\\pi rh\\cdot2+\\pi r^2(-3),$$

即 $4rh-3r^2=-100$。由表面积公式，

$$40\\pi=2\\pi\\left(h\\cdot2+r(-3)\\right)+4\\pi r\\cdot2,$$

即 $2h+r=20$。消去 $h$ 得 $r^2-8r-20=0$，正根为 $r=10$，从而 $h=5$。` },
      { title: '方法二 · 先由表面积锁定线性关系', content: `表面积变化式先整理为 $h=(20-r)/2$。代入体积变化式得

$$4r\\frac{20-r}{2}-3r^2=-100,$$

即 $(r-10)(r+2)=0$。半径必须为正，故只取 $r=10$，再由线性关系得到 $h=5$。` }
    ]
  }),
  companion({
    id: 'problem-5-observer-angle-rate', page: '解析 PDF 48 · 书页 42 · 第 5 题',
    fingerprint: 'related-rate:observer-angle-fixed-horizontal-distance-height-speed',
    title: '1000题第 5 题 · 由仰角变化率反求竖直速度',
    statement: `观测者与物体竖直运动路线的水平距离恒为 $10\\,\\mathrm m$。设物体离地高度为 $h(t)$，观测仰角为 $\\theta(t)$。当 $h=20\\,\\mathrm m$ 时，测得

$$\\frac{d\\theta}{dt}=\\frac1{10}\\,\\mathrm{rad/s}.$$

求此时物体的竖直速度 $dh/dt$。`,
    tags: ['相关变化率', '三角函数', '仰角'],
    coreMethod: '先由直角三角形建立 $\\tan\\theta=h/10$，再对时间求导；也可直接对 $\\arctan(h/10)$ 求导。',
    mistakes: '把 $\\tan\\theta$ 的导数错写成 $\\tan\\theta$，或漏掉 $h/10$ 的内层系数 $1/10$。',
    answerText: `$$\\frac{dh}{dt}=5\\,\\mathrm{m/s}.$$`,
    solutionMethods: [
      { title: '方法一 · 正切关系求导', content: `由 $\\tan\\theta=h/10$，

$$\\sec^2\\theta\\frac{d\\theta}{dt}=\\frac1{10}\\frac{dh}{dt}.$$

当 $h=20$ 时 $\\tan\\theta=2$，故 $\\sec^2\\theta=1+2^2=5$。代入 $d\\theta/dt=1/10$，得到 $dh/dt=5$。` },
      { title: '方法二 · 反正切复合求导', content: `写成 $\\theta=\\arctan(h/10)$，则

$$\\frac{d\\theta}{dt}=\\frac{1/10}{1+(h/10)^2}\\frac{dh}{dt}.$$

在 $h=20$ 时前面的系数为 $1/50$，所以 $(1/10)=(1/50)dh/dt$，仍得 $dh/dt=5$。` }
    ]
  }),
  companion({
    id: 'problem-2-sphere-surface-volume-rates', page: '解析 PDF 267 · 书页 261 · 第 2 题',
    fingerprint: 'related-rate:sphere-radius-surface-and-volume-growth',
    title: '1000题第 2 题 · 球半径增长时表面积与体积的变化率',
    statement: `一个球的半径以 $5\\,\\mathrm{cm/s}$ 的速率增长。求半径为 $50\\,\\mathrm{cm}$ 时，球的表面积和体积对时间的变化率。`,
    tags: ['相关变化率', '球体', '表面积', '体积'],
    coreMethod: '分别对球的表面积与体积公式关于时间求导，再在同一时刻代入半径和半径变化率。',
    mistakes: '先代入 $r=50$ 把表面积或体积变成常数再求导，会错误地得到零。',
    answerText: `$$\\frac{dS}{dt}=2000\\pi\\,\\mathrm{cm^2/s},\\qquad \\frac{dV}{dt}=50\\,000\\pi\\,\\mathrm{cm^3/s}.$$`,
    solutionMethods: [
      { title: '方法一 · 两个公式直接求导', content: `由

$$S=4\\pi r^2,\\qquad V=\\frac43\\pi r^3,$$

可得

$$\\frac{dS}{dt}=8\\pi r\\frac{dr}{dt},\\qquad \\frac{dV}{dt}=4\\pi r^2\\frac{dr}{dt}.$$

代入 $r=50,dr/dt=5$，得到 $2000\\pi$ 与 $50\\,000\\pi$。` },
      { title: '方法二 · 几何微元复核', content: `半径增加 $dr$ 时，体积增量主部是表面积乘厚度，即 $dV\\approx4\\pi r^2dr$；表面积增量主部为 $dS\\approx8\\pi r\\,dr$。两式同除以 $dt$ 后代入数据，得到相同结果。` }
    ]
  })
]
