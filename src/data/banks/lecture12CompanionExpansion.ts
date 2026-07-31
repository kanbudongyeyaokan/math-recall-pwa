import type { SeedInput } from './types'

const raw = String.raw
const ZY1000_SOURCE = '何耀焜私人整理 · 张宇《1000题》数一解析册 · 第12章逐页核验'

type CompanionSeed = Omit<SeedInput, 'id' | 'kind' | 'tags' | 'methodFingerprint' | 'source'> & {
  id: string
  tags: string[]
  fingerprint: string
}

function companion(input: CompanionSeed): SeedInput {
  return {
    ...input,
    id: `zy1000-verified-l12-${input.id}`,
    kind: 'problem',
    source: ZY1000_SOURCE,
    tags: ['高等数学', '第12讲', '经典例题', 'PDF逐页核验', ...input.tags],
    methodFingerprint: `zy1000-verified:l12:${input.fingerprint}`
  }
}

export const lecture12CompanionExpansionSeeds: SeedInput[] = [
  companion({
    id: 'basic-3-earth-escape-work', page: '解析 PDF 87 · 书页 81 · 基础篇第 3 题',
    fingerprint: 'gravity-work:inverse-square-earth-surface-to-infinity-potential',
    title: '1000题基础篇第 3 题 · 把单位质量物体送到无穷远',
    statement: raw`设地球半径为 $R$、质量为 $M$，引力常数为 $G$。忽略其他天体影响，把质量为 $1$ 的物体从地球表面缓慢送到无穷远，克服地球引力至少需要做多少功？`,
    tags: ['万有引力', '反常积分', '变力做功'],
    coreMethod: raw`物体距地心 $x$ 时的引力大小为 $GM/x^2$，把从 $R$ 到 $+\infty$ 的变力功写成反常积分。`,
    mistakes: raw`把地球表面的引力 $GM/R^2$ 当作全过程恒力；随着距离增大，引力按距离平方反比衰减。`,
    answerText: raw`$$W=\frac{GM}{R}.$$`,
    solutionMethods: [
      { title: '方法一 · 反常积分', content: raw`先送到距地心 $R+a$ 处：
$$W(a)=\int_R^{R+a}\frac{GM}{x^2}dx
=GM\left(\frac1R-\frac1{R+a}\right).$$
令 $a\to+\infty$，得到 $W=GM/R$。` },
      { title: '方法二 · 引力势能', content: raw`单位质量物体在距地心 $r$ 处的引力势能为 $U(r)=-GM/r$，并取 $U(+\infty)=0$。缓慢搬运所需的最小外力功等于势能增量：
$$W=U(+\infty)-U(R)=0-\left(-\frac{GM}{R}\right)=\frac{GM}{R}.$$` }
    ]
  }),
  companion({
    id: 'basic-4-paraboloid-tank', page: '解析 PDF 87 · 书页 81 · 基础篇第 4 题',
    fingerprint: 'pumping-work:paraboloid-tank-volume-drain-time-centroid',
    title: '1000题基础篇第 4 题 · 抛物面水缸的容积、抽空时间与功',
    statement: raw`把抛物线
$$y=\frac{x^2}{a}\qquad(a>0)$$
绕 $y$ 轴旋转，取 $0\le y\le a$ 的部分作为水缸内壁。水缸装满密度为 $\rho$ 的水，重力加速度为 $g$。

1. 求水缸容积；若以每秒 $Q$ 立方米的速率抽水，求抽空所需时间；
2. 求把全部水抽到缸口所做的功。`,
    tags: ['抛物面', '抽水做功', '体积'],
    coreMethod: raw`高度 $y$ 处有 $x^2=ay$，故水平截面积是 $\pi ay$；体积直接积分，功再乘提升距离 $a-y$。`,
    mistakes: raw`把旋转截面积误写成 $\pi y^2$；半径是 $x=\sqrt{ay}$。抽水速率题用总体积除以体积流量。`,
    answerText: raw`$$V=\frac{\pi a^3}{2},\qquad T=\frac{\pi a^3}{2Q},\qquad W=\frac16\rho g\pi a^4.$$`,
    solutionMethods: [
      { title: '方法一 · 截面积逐层积分', content: raw`高度 $y$ 处截面积为 $A(y)=\pi x^2=\pi ay$。因此
$$V=\int_0^a\pi ay\,dy=\frac{\pi a^3}{2},\qquad T=\frac VQ.$$
水层需提升 $a-y$，所以
$$W=\rho g\pi a\int_0^ay(a-y)dy=\frac16\rho g\pi a^4.$$` },
      { title: '方法二 · 体积与重心复核', content: raw`水体体积仍为 $\pi a^3/2$。其形心高度为
$$\bar y=\frac{\int_0^ayA(y)dy}{V}
=\frac{\pi a\int_0^ay^2dy}{\pi a^3/2}=\frac{2a}{3}.$$
平均提升距离为 $a/3$，故 $W=\rho gV(a/3)=\rho g\pi a^4/6$。` }
    ]
  }),
  companion({
    id: 'basic-6-rod-attraction-work', page: '解析 PDF 88 · 书页 82 · 基础篇第 6 题',
    fingerprint: 'gravity-work:unit-uniform-rod-point-mass-finite-displacement-log-ratio',
    title: '1000题基础篇第 6 题 · 均匀细杆吸引质点所做的功',
    statement: raw`一根质量为 $1$、长度为 $1$ 的均匀细杆位于 $x$ 轴的 $[0,1]$ 上。质量为 $a$ 的质点位于细杆右侧延长线上。若质点在细杆引力作用下从 $x_0=3/2$ 移到 $x_0=4/3$，求引力所做功的大小。引力常数为 $G$。`,
    tags: ['万有引力', '均匀细杆', '变力做功'],
    coreMethod: raw`先对细杆位置 $x\in[0,1]$ 积分，得到质点位于 $x_0$ 时的合引力，再对质点位移积分。`,
    mistakes: raw`质点在向左移动，因此位移方向与引力同向；若用从 $3/2$ 到 $4/3$ 的有向积分，要同时处理力的负方向，最终功为正。`,
    answerText: raw`$$W=Ga\ln\frac43.$$`,
    solutionMethods: [
      { title: '方法一 · 先合力后做功', content: raw`细杆微元质量为 $dx$，质点距微元为 $x_0-x$。合引力大小为
$$F(x_0)=Ga\int_0^1\frac{dx}{(x_0-x)^2}
=Ga\left(\frac1{x_0-1}-\frac1{x_0}\right).$$
质点向左移动时引力做正功，其大小为
$$W=\left|\int_{3/2}^{4/3}F(x_0)dx_0\right|
=Ga\ln\frac43.$$` },
      { title: '方法二 · 势能差', content: raw`细杆在质点处产生的单位质量引力势为
$$\Phi(x_0)=-G\int_0^1\frac{dx}{x_0-x}
=-G\ln\frac{x_0}{x_0-1}.$$
质点势能为 $a\Phi$。引力功等于势能的减少量：
$$W=a\Phi(3/2)-a\Phi(4/3)
=-Ga\ln3-(-Ga\ln4)=Ga\ln\frac43.$$` }
    ]
  }),
  companion({
    id: 'basic-7-triangle-pressure-maximum', page: '解析 PDF 88 · 书页 82 · 基础篇第 7 题',
    fingerprint: 'hydrostatic-pressure:unit-right-triangle-inclination-maximize-cos-sin-squared',
    title: '1000题基础篇第 7 题 · 单位斜边三角板的最大水压力姿态',
    statement: raw`一块斜边长为 $1$ 的直角三角形薄板铅直浸在水中，斜边的上端位于水面，斜边与水面的夹角为 $\theta$，两条直角边分别水平、铅直。水的密度为 $\rho$，重力加速度为 $g$。求三角板所受水压力最大时的 $\theta$。`,
    tags: ['静水压力', '参数最值', '直角三角形'],
    coreMethod: raw`用深度 $x$ 作横条，写出横条长度 $\cos\theta-x\cot\theta$，积分后把压力化为 $\cos\theta\sin^2\theta$ 的一元最值。`,
    mistakes: raw`板的竖直深度为 $\sin\theta$、水平直角边为 $\cos\theta$；两者容易写反。端点姿态压力为零，也要纳入全局比较。`,
    answerText: raw`$$\theta=\arccos\frac1{\sqrt3}.$$`,
    solutionMethods: [
      { title: '方法一 · 压力积分后求导', content: raw`深度 $x\in[0,\sin\theta]$ 处横条长度为 $\cos\theta-x\cot\theta$，故
$$P(\theta)=\rho g\int_0^{\sin\theta}x(\cos\theta-x\cot\theta)dx
=\frac16\rho g\cos\theta\sin^2\theta.$$
求导得驻点条件 $2\cos^2\theta-sin^2\theta=0$，所以 $\cos\theta=1/\sqrt3$。结合端点压力为零，该点给出最大值。` },
      { title: '方法二 · 代数变量降维', content: raw`令 $u=\cos\theta\in[0,1]$，则
$$P\propto u(1-u^2).$$
其导数为 $1-3u^2$，唯一内部驻点为 $u=1/\sqrt3$，且二阶导数 $-6u<0$。因此 $\theta=\arccos(1/\sqrt3)$。` }
    ]
  }),
  companion({
    id: 'advanced-4-radial-density-semicircle-centroid', page: '解析 PDF 301 · 书页 295 · 强化篇第 4 题',
    fingerprint: 'centroid:upper-semicircle-density-proportional-radius-polar-rings',
    title: '1000题强化篇第 4 题 · 径向变密度半圆薄片的重心',
    statement: raw`半圆薄片占据
$$D=\{(x,y)\mid x^2+y^2\le a^2,\ y\ge0\},$$
面密度为
$$\rho(x,y)=k\sqrt{x^2+y^2},\qquad k>0.$$
求薄片的重心坐标。`,
    tags: ['重心', '极坐标', '变密度薄片'],
    coreMethod: raw`由关于 $y$ 轴对称先得 $\bar x=0$；质量和关于 $x$ 轴的一阶矩都用极坐标计算。`,
    mistakes: raw`极坐标面密度是 $kr$，面积元还要再乘 $r$；关于 $x$ 轴的一阶矩被积函数另有 $y=r\sin\theta$。`,
    answerText: raw`$$\left(\bar x,\bar y\right)=\left(0,\frac{3a}{2\pi}\right).$$`,
    solutionMethods: [
      { title: '方法一 · 极坐标质量矩', content: raw`由对称性 $\bar x=0$。质量为
$$M=k\int_0^\pi\int_0^a r^2drd\theta=\frac13k\pi a^3.$$
关于 $x$ 轴的一阶矩为
$$M_x=k\int_0^\pi\int_0^a(r\sin\theta)r^2drd\theta=\frac12ka^4.$$
故 $\bar y=M_x/M=3a/(2\pi)$。` },
      { title: '方法二 · 半圆环形心叠加', content: raw`半径为 $r$、厚度为 $dr$ 的半圆环质量为 $dM=kr\cdot\pi r\,dr=\pi kr^2dr$，其形心距圆心 $2r/\pi$。所以
$$M=\int_0^a\pi kr^2dr,\qquad M_x=\int_0^a\frac{2r}{\pi}dM.$$
分别积分得 $M=\pi ka^3/3$、$M_x=ka^4/2$，比值仍为 $3a/(2\pi)$。` }
    ]
  }),
  companion({
    id: 'advanced-5-exponential-region-centroid', page: '解析 PDF 301 · 书页 295 · 强化篇第 5 题',
    fingerprint: 'centroid:region-under-exponential-minus-one-to-one-strip-moments',
    title: '1000题强化篇第 5 题 · 指数曲边区域的形心',
    statement: raw`均匀平面区域
$$D=\{(x,y)\mid -1\le x\le1,\ 0\le y\le e^x\}$$
的形心坐标是多少？`,
    tags: ['形心', '指数函数', '一阶矩'],
    coreMethod: raw`纵条高度为 $e^x$；横坐标形心用 $\int xe^x dx$，纵坐标形心用每条纵条的一阶矩 $e^{2x}/2$。`,
    mistakes: raw`计算 $\bar y$ 时把纵条形心高度 $e^x/2$ 当作被积式，却漏乘纵条面积 $e^x dx$。`,
    answerText: raw`$$\left(\bar x,\bar y\right)=\left(\frac{2}{e^2-1},\frac{e^2+1}{4e}\right).$$`,
    solutionMethods: [
      { title: '方法一 · 纵条面积矩', content: raw`区域面积
$$A=\int_{-1}^1e^xdx=e-e^{-1}.$$
关于 $y$ 轴、$x$ 轴的一阶矩分别为
$$M_y=\int_{-1}^1xe^xdx=\frac2e,$$
$$M_x=\frac12\int_{-1}^1e^{2x}dx=\frac14(e^2-e^{-2}).$$
用 $\bar x=M_y/A$、$\bar y=M_x/A$ 化简即得答案。` },
      { title: '方法二 · 指数换元复核', content: raw`令 $u=e^x$，则 $dx=du/u$。纵条面积 $e^xdx$ 直接变成 $du$，所以
$$A=\int_{e^{-1}}^e du,
\qquad M_y=\int_{e^{-1}}^e\ln u\,du,
\qquad M_x=\frac12\int_{e^{-1}}^e u\,du.$$
代入端点分别得到 $e-e^{-1}$、$2/e$、$(e^2-e^{-2})/4$，形心与方法一一致。` }
    ]
  })
]
