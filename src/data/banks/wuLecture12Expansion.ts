import type { SeedInput } from './types'

const raw = String.raw
const WZX_SOURCE = '何耀焜私人整理 · 武忠祥《高数基础篇做题本》 · 定积分应用逐页核验'

type WuSeed = Omit<SeedInput, 'id' | 'kind' | 'tags' | 'methodFingerprint' | 'source'> & {
  id: string
  tags: string[]
  fingerprint: string
}

function wuProblem(input: WuSeed): SeedInput {
  return {
    ...input,
    id: `wzx-verified-l12-${input.id}`,
    kind: 'problem',
    source: WZX_SOURCE,
    tags: ['高等数学', '第12讲', '经典例题', 'PDF逐页核验', ...input.tags],
    methodFingerprint: `wzx-verified:l12:${input.fingerprint}`
  }
}

export const wuLecture12ExpansionSeeds: SeedInput[] = [
  wuProblem({
    id: 'p115-example-6-parabolic-gate', page: 'PDF 67 · 书中 P115 · 例 6',
    fingerprint: 'hydrostatic-pressure:rectangle-over-parabolic-gate-pressure-ratio-solve-height',
    title: '武忠祥 P115 例 6 · 矩形与抛物线组合闸门的压力比',
    statement: raw`一块关于 $y$ 轴对称的铅直闸门，上部是宽 $2\,\mathrm m$、高 $h$ 的矩形，下部由抛物线 $y=x^2$ 与线段 $y=1$ 围成。水面与闸门上端相平。若矩形部分承受的水压力与下部承受的水压力之比为 $5:4$，求 $h$。`,
    tags: ['静水压力', '抛物线', '参数方程'],
    coreMethod: raw`以抛物线顶点为高度原点，水面位于 $y=h+1$；矩形宽度恒为 $2$，下部在高度 $y$ 的宽度为 $2\sqrt y$。`,
    mistakes: raw`压强中的深度是 $h+1-y$，不是坐标 $y$；下部横条宽度来自 $x=\pm\sqrt y$，应为 $2\sqrt y$。`,
    answerText: raw`$$h=2\ \mathrm m.$$`,
    solutionMethods: [
      { title: '方法一 · 两部分分别积分', content: raw`设液体容重为 $r$。矩形部分压力为
$$P_1=2r\int_1^{h+1}(h+1-y)dy=rh^2.$$
抛物线部分压力为
$$P_2=2r\int_0^1(h+1-y)\sqrt y\,dy
=r\left(\frac{4h}{3}+\frac8{15}\right).$$
由 $P_1:P_2=5:4$ 得 $3h^2-5h-2=0$。舍去负根，得到 $h=2$。` },
      { title: '方法二 · 面积与形心深度', content: raw`矩形面积为 $2h$，形心深度为 $h/2$，故 $P_1=rh^2$。下部面积
$$A_2=\int_0^12\sqrt y\,dy=\frac43,$$
其形心高度
$$\bar y=\frac{\int_0^1y\,2\sqrt y\,dy}{A_2}=\frac35.$$
因此形心深度为 $h+1-3/5=h+2/5$，
$$P_2=rA_2\left(h+\frac25\right)=r\left(\frac{4h}{3}+\frac8{15}\right).$$
再用压力比求得 $h=2$。` }
    ]
  }),
  wuProblem({
    id: 'p115-example-7-two-sphere-vessel', page: 'PDF 68 · 书中 P115 · 例 7',
    fingerprint: 'pumping-work:joined-spherical-vessel-piecewise-cross-sections-centroid-symmetry',
    title: '武忠祥 P115 例 7 · 双球面拼接容器的容积与抽水功',
    statement: raw`一容器内壁由两段球面绕 $y$ 轴旋转形成：
$$x^2+y^2=2y\quad\left(y\ge\frac12\right),$$
$$x^2+y^2=1\quad\left(y\le\frac12\right).$$

1. 求容器容积；
2. 容器内装满密度为 $\rho$ 的水，重力加速度为 $g$，把水全部从顶部抽出至少需要做多少功？`,
    tags: ['抽水做功', '球面容器', '分段积分'],
    coreMethod: raw`容器在 $y=1/2$ 处拼接；下段截面积为 $\pi(1-y^2)$，上段截面积为 $\pi[1-(y-1)^2]$，顶部高度是 $2$。`,
    mistakes: raw`把两球的完整体积相加会把被截去的部分也算入；抽水提升距离统一为 $2-y$，但截面积必须在 $y=1/2$ 处分段。`,
    answerText: raw`$$V=\frac{9\pi}{4},\qquad W=\frac{27\pi}{8}\rho g.$$`,
    solutionMethods: [
      { title: '方法一 · 分段截面积积分', content: raw`容积为
$$V=\pi\int_{-1}^{1/2}(1-y^2)dy
+\pi\int_{1/2}^{2}[1-(y-1)^2]dy
=\frac{9\pi}{4}.$$
抽水功为
$$W=\rho g\pi\int_{-1}^{1/2}(2-y)(1-y^2)dy
+\rho g\pi\int_{1/2}^{2}(2-y)[1-(y-1)^2]dy
=\frac{27\pi}{8}\rho g.$$` },
      { title: '方法二 · 对称形心法', content: raw`容器关于平面 $y=1/2$ 对称，因此装满的均匀水体形心高度为 $\bar y=1/2$。由分段体积积分得 $V=9\pi/4$，平均提升距离为 $2-1/2=3/2$。所以
$$W=\rho gV\frac32
=\rho g\frac{9\pi}{4}\frac32
=\frac{27\pi}{8}\rho g.$$` }
    ]
  }),
  wuProblem({
    id: 'p116-example-8-two-point-masses', page: 'PDF 68 · 书中 P116 · 例 8',
    fingerprint: 'gravity-work:two-unit-point-masses-horizontal-motion-force-projection-choice',
    title: '武忠祥 P116 例 8 · 两单位质点引力做功的分力投影',
    statement: raw`单位质点 $P,Q$ 分别位于 $(0,0)$ 与 $(0,1)$。质点 $P$ 从原点沿 $x$ 轴正向移动到 $(l,0)$。引力常数为 $G$，克服质点 $Q$ 的引力所做功为（　）。`,
    questionFormat: 'single-choice',
    options: [
      raw`$\displaystyle\int_0^l\frac{G}{x^2+1}\,dx$`,
      raw`$\displaystyle\int_0^l\frac{Gx}{(x^2+1)^{3/2}}\,dx$`,
      raw`$\displaystyle\int_0^l\frac{G}{(x^2+1)^{3/2}}\,dx$`,
      raw`$\displaystyle\int_0^l\frac{G(x+1)}{(x^2+1)^{3/2}}\,dx$`
    ],
    correctOptionIds: ['B'],
    tags: ['选择题', '万有引力', '分力投影'],
    coreMethod: raw`两质点距离为 $r=\sqrt{x^2+1}$，引力大小为 $G/r^2$；沿运动方向的分量还要乘投影因子 $x/r$。`,
    mistakes: raw`只写引力大小 $G/(x^2+1)$，却没有取沿 $x$ 轴的分量；做功只由力在位移方向上的分量决定。`,
    answerText: raw`正确选项为 B：
$$W=\int_0^l\frac{Gx}{(x^2+1)^{3/2}}\,dx.$$`,
    solutionMethods: [
      { title: '方法一 · 力的投影', content: raw`质点间距离为 $r=\sqrt{x^2+1}$，引力大小为 $G/r^2$。引力与负 $x$ 方向的夹角余弦为 $x/r$，所以克服引力所需外力的水平分量大小为
$$\frac{G}{r^2}\frac{x}{r}=\frac{Gx}{(x^2+1)^{3/2}}.$$
沿 $x$ 从 $0$ 积到 $l$，得到选项 B。` },
      { title: '方法二 · 势能变化', content: raw`两单位质点的引力势能为
$$U(x)=-\frac{G}{\sqrt{x^2+1}}.$$
缓慢移动时外力功等于势能增量，故
$$W=U(l)-U(0)=G\left(1-\frac1{\sqrt{l^2+1}}\right).$$
而选项 B 的积分恰好等于该闭式，因此选 B。` }
    ]
  }),
  wuProblem({
    id: 'p116-example-9-variable-density-rod-centroid', page: 'PDF 69 · 书中 P116 · 例 9',
    fingerprint: 'centroid:unit-rod-quadratic-linear-density-moment-ratio',
    title: '武忠祥 P116 例 9 · 二次线密度细杆的质心',
    statement: raw`一根长为 $1$ 的细杆位于 $x$ 轴区间 $[0,1]$ 上，线密度为
$$\rho(x)=-x^2+2x+1.$$
求细杆的质心坐标 $\bar x$。`,
    tags: ['质心', '线密度', '一阶矩'],
    coreMethod: raw`质心横坐标等于关于原点的一阶矩与总质量之比，即 $\bar x=\int x\rho(x)dx/\int\rho(x)dx$。`,
    mistakes: raw`把几何中点 $1/2$ 当作质心；本题密度向右增大，质心应位于 $1/2$ 的右侧。`,
    answerText: raw`$$\bar x=\frac{11}{20}.$$`,
    solutionMethods: [
      { title: '方法一 · 质量矩直接积分', content: raw`总质量
$$M=\int_0^1(-x^2+2x+1)dx=\frac53.$$
关于原点的一阶矩
$$M_0=\int_0^1x(-x^2+2x+1)dx=\frac{11}{12}.$$
所以 $\bar x=M_0/M=(11/12)/(5/3)=11/20$。` },
      { title: '方法二 · 分解为三种标准密度', content: raw`把密度写成 $1+2x-x^2$。三部分质量分别为 $1,1,-1/3$，一阶矩分别为 $1/2,2/3,-1/4$。因此
$$M=1+1-\frac13=\frac53,$$
$$M_0=\frac12+\frac23-\frac14=\frac{11}{12},$$
相除仍得 $11/20$，且结果大于中点 $1/2$，符合密度右重的直觉。` }
    ]
  })
]
