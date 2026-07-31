import type { SeedInput } from './types'

const raw = String.raw
const ZY30_SOURCE = '何耀焜私人整理 · 张宇《基础30讲》高数 · 第12讲逐页核验'

type LectureTwelveSeed = Omit<SeedInput, 'id' | 'kind' | 'tags' | 'methodFingerprint' | 'source'> & {
  id: string
  role: 'example' | 'exercise'
  tags: string[]
  fingerprint: string
}

function lectureTwelve(input: LectureTwelveSeed): SeedInput {
  const roleLabel = input.role === 'example' ? '经典例题' : '课后习题'
  return {
    ...input,
    id: `zy30-verified-l12-${input.id}`,
    kind: 'problem',
    source: ZY30_SOURCE,
    tags: ['高等数学', '第12讲', roleLabel, 'PDF逐页核验', ...input.tags],
    methodFingerprint: `zy30-verified:l12:${input.fingerprint}`
  }
}

export const foundation30Lecture12ExpansionSeeds: SeedInput[] = [
  lectureTwelve({
    id: 'example-12-1-equal-hammer-work', role: 'example', page: 'PDF 300 · 书页 295 · 例 12.1',
    fingerprint: 'variable-work:nail-linear-resistance-equal-work-successive-depth',
    title: '例 12.1 · 等功锤击下铁钉的第二次入木深度',
    statement: raw`用铁锤将一枚铁钉打入木板，木板对铁钉的阻力与铁钉进入木板的深度成正比。第一次锤击把铁钉打入木板 $1\,\mathrm{cm}$。若铁锤每次打击所做的功相等，求第二次锤击还能把铁钉打入多深。`,
    tags: ['变力做功', '线性阻力', '物理应用'],
    coreMethod: raw`设阻力为 $F(x)=kx$，分别对第一锤的区间 $[0,1]$ 和第二锤的区间 $[1,x_2]$ 积分，再令两次功相等。`,
    mistakes: raw`第二锤的积分下限是已经进入的深度 $1$，不是重新从 $0$ 开始；题目所求是新增深度 $x_2-1$，不是第二锤后的总深度。`,
    answerText: raw`第二次锤击的入木深度为
$$\sqrt2-1\ \mathrm{cm}.$$`,
    solutionMethods: [
      { title: '方法一 · 分段计算变力功', content: raw`第一次锤击做功
$$W_1=\int_0^1kx\,dx=\frac k2.$$
设第二锤后总深度为 $x_2$，则
$$W_2=\int_1^{x_2}kx\,dx=\frac k2(x_2^2-1).$$
由 $W_2=W_1$ 得 $x_2^2=2$，故新增深度为 $x_2-1=\sqrt2-1$。` },
      { title: '方法二 · 功与深度平方成正比', content: raw`从木板表面打到总深度 $x$ 所需的累计功为
$$W(x)=\frac12kx^2.$$
每锤做功都是 $k/2$，两锤后的累计功是 $k$，所以总深度满足 $kx_2^2/2=k$，即 $x_2=\sqrt2$。扣除第一锤的 $1\,\mathrm{cm}$ 即得答案。` }
    ]
  }),
  lectureTwelve({
    id: 'example-12-2-inverted-cone-pumping', role: 'example', page: 'PDF 301 · 书页 296 · 例 12.2',
    fingerprint: 'pumping-work:full-inverted-cone-similar-slices-centroid',
    title: '例 12.2 · 倒圆锥容器抽水到顶部所做的功',
    statement: raw`一倒圆锥形容器高为 $a$，上底半径为 $b$，容器内装满密度为 $\rho$ 的水。重力加速度为 $g$，求把全部水抽到容器顶部所做的功。`,
    tags: ['抽水做功', '圆锥', '旋转体'],
    coreMethod: raw`从锥尖向上取高度 $y$ 的水平薄片，利用相似三角形写出截面半径 $by/a$，再乘薄片重量与提升距离 $a-y$。`,
    mistakes: raw`把所有水都按同一高度 $a$ 提升；实际每层水的提升距离随高度变化。还要保留截面半径平方带来的 $y^2$。`,
    answerText: raw`$$W=\frac1{12}\rho g\pi a^2b^2.$$`,
    solutionMethods: [
      { title: '方法一 · 水平薄片积分', content: raw`高度 $y$ 处的截面半径为 $by/a$，薄片体积为 $\pi b^2y^2a^{-2}dy$，需提升 $a-y$。因此
$$W=\frac{\rho g\pi b^2}{a^2}\int_0^ay^2(a-y)dy
=\frac1{12}\rho g\pi a^2b^2.$$` },
      { title: '方法二 · 水体重心', content: raw`水的总体积为 $V=\pi b^2a/3$。均匀实心圆锥的重心距锥尖 $3a/4$，所以水的平均提升距离为 $a/4$。于是
$$W=\rho gV\cdot\frac a4
=\rho g\frac{\pi b^2a}{3}\frac a4
=\frac1{12}\rho g\pi a^2b^2.$$` }
    ]
  }),
  lectureTwelve({
    id: 'example-12-3-triangular-plate-pressure', role: 'example', page: 'PDF 302 · 书页 297 · 例 12.3',
    fingerprint: 'hydrostatic-pressure:isosceles-right-triangle-hypotenuse-at-surface-centroid',
    title: '例 12.3 · 斜边贴水面的等腰直角三角板压力',
    statement: raw`斜边长为 $2a$ 的等腰直角三角形平板铅直地沉没在水中，且斜边与水面相齐。水的密度为 $\rho$，重力加速度为 $g$。求平板一侧所受的水压力。`,
    tags: ['静水压力', '三角形', '形心'],
    coreMethod: raw`距水面深度为 $y$ 的横条宽度为 $2(a-y)$，压强为 $\rho gy$；也可直接用总压力等于形心深度处压强乘面积。`,
    mistakes: raw`把板的斜边 $2a$ 当成竖直高度；该等腰直角三角形对斜边的高为 $a$，形心距斜边只有 $a/3$。`,
    answerText: raw`$$P=\frac13\rho ga^3.$$`,
    solutionMethods: [
      { title: '方法一 · 横条压强积分', content: raw`在深度 $0\le y\le a$ 处，横条宽度为 $2(a-y)$。故
$$P=\int_0^a\rho gy\cdot2(a-y)dy
=2\rho g\left(\frac{a^3}{2}-\frac{a^3}{3}\right)
=\frac13\rho ga^3.$$` },
      { title: '方法二 · 面积与形心深度', content: raw`三角板面积为
$$A=\frac12(2a)a=a^2,$$
形心距作为底边的斜边深度为 $a/3$。静水总压力等于 $\rho gA\bar y$，所以
$$P=\rho g\,a^2\frac a3=\frac13\rho ga^3.$$` }
    ]
  }),
  lectureTwelve({
    id: 'example-12-4-profit-elasticity', role: 'example', page: 'PDF 306 · 书页 301 · 例 12.4',
    fingerprint: 'economic-profit:marginal-cost-demand-elasticity-recover-linear-demand-optimize',
    title: '例 12.4 · 由需求弹性恢复价格并求最大利润',
    statement: raw`某产品的边际成本为
$$C'(x)=4+\frac x4\quad(\text{万元/单位}),$$
固定成本为 $1$ 万元。产品对价格 $p$ 的需求弹性为
$$\eta=-\frac{p}{x}\frac{dx}{dp}=\frac{p}{8-p},\qquad p>0,$$
产品最大需求量为 $8$。其中 $x$ 表示产量，$p$ 表示价格。求产品利润最大时的产量和价格。`,
    tags: ['经济应用', '需求弹性', '利润最值'],
    coreMethod: raw`先由边际成本积分得到总成本，再由弹性微分方程和 $x(0)=8$ 恢复线性需求 $x=8-p$，最后把利润写成 $x$ 的二次函数。`,
    mistakes: raw`弹性定义前有负号；积分 $dx/x=dp/(p-8)$ 时要结合最大需求量确定常数。收入应为 $R=px$，不能把价格直接当总收入。`,
    answerText: raw`利润最大时
$$x=\frac{16}{9},\qquad p=\frac{56}{9}\ \text{万元}.$$`,
    solutionMethods: [
      { title: '方法一 · 恢复需求后求导', content: raw`由 $C(0)=1$，
$$C(x)=4x+\frac{x^2}{8}+1.$$
弹性方程给出 $dx/x=dp/(p-8)$，结合 $x(0)=8$ 得 $x=8-p$，即 $p=8-x$。于是
$$L(x)=x(8-x)-C(x)=-\frac98x^2+4x-1.$$
令 $L'(x)=4-9x/4=0$，得 $x=16/9$。因 $L''=-9/4<0$，这是最大值点，价格为 $8-16/9=56/9$。` },
      { title: '方法二 · 二次函数配方', content: raw`完成同样的成本与需求恢复后，直接配方：
$$L(x)=-\frac98\left(x-\frac{16}{9}\right)^2+\frac{23}{9}.$$
故利润在 $x=16/9$ 时达到全局最大。再由 $p=8-x$ 得 $p=56/9$。` }
    ]
  }),
  lectureTwelve({
    id: 'exercise-12-1-general-plate-pressure', role: 'exercise', page: 'PDF 307 · 书页 302 · 习题 12.1',
    fingerprint: 'hydrostatic-pressure:general-horizontal-strip-depth-times-width-choice',
    title: '习题 12.1 · 曲边平面板的液体压力公式选择',
    statement: raw`由曲线 $y=f_1(x)$、$y=f_2(x)$ 及直线 $x=a$、$x=b$（$a<b$）围成的平面板铅直地浸入容重为 $r$ 的液体中。$x$ 轴铅直向下，液面与 $y$ 轴重合，且图示中 $f_2(x)>f_1(x)$。平面板所受液体压力为（　）。`,
    questionFormat: 'single-choice',
    options: [
      raw`$\displaystyle\int_a^b x[f_2(x)-f_1(x)]\,dx$`,
      raw`$\displaystyle\int_a^b rx[f_1(x)-f_2(x)]\,dx$`,
      raw`$\displaystyle\int_a^b r[f_2(x)-f_1(x)]\,dx$`,
      raw`$\displaystyle\int_a^b rx[f_2(x)-f_1(x)]\,dx$`
    ],
    correctOptionIds: ['D'],
    tags: ['选择题', '静水压力', '微元法'],
    coreMethod: raw`深度 $x$ 处压强为 $rx$，横条宽度为 $f_2(x)-f_1(x)$，压力微元是二者与 $dx$ 的乘积。`,
    mistakes: raw`漏掉深度因子 $x$，或把右边界减左边界的宽度写反；$r$ 已是单位体积液体的重量，不需再乘 $g$。`,
    answerText: raw`正确选项为 D：
$$P=\int_a^b rx[f_2(x)-f_1(x)]\,dx.$$`,
    solutionMethods: [
      { title: '方法一 · 横条压力微元', content: raw`在 $[x,x+dx]$ 内取横条。该处压强为 $rx$，横条面积为 $[f_2(x)-f_1(x)]dx$，所以
$$dP=rx[f_2(x)-f_1(x)]dx.$$
从 $a$ 到 $b$ 累加即得选项 D。` },
      { title: '方法二 · 量纲与符号复核', content: raw`压力必须含“容重 $×$ 深度 $×$ 面积”，所以没有 $r$ 或没有 $x$ 的 A、C 可先排除。又图中水平宽度为右边界 $f_2$ 减左边界 $f_1$，故 B 的符号错误，只剩 D。` }
    ]
  }),
  lectureTwelve({
    id: 'exercise-12-2-average-unit-revenue', role: 'exercise', page: 'PDF 307-308 · 书页 302-303 · 习题 12.2',
    fingerprint: 'economic-revenue:linear-marginal-revenue-integrate-average-two-thousand',
    title: '习题 12.2 · 由边际收入求平均单位收入',
    statement: raw`某商品销售量为 $a$ 时，边际收入为
$$R'(a)=200-\frac a{50}.$$
求销售量为 $2000$ 时的平均单位收入。`,
    tags: ['经济应用', '边际收入', '平均值'],
    coreMethod: raw`由零销量时总收入为零，先积分边际收入得到 $R(2000)$，再除以销售量。`,
    mistakes: raw`把 $R'(2000)=160$ 当成平均单位收入；边际量是端点处新增一单位的近似收入，平均量要用总收入除以总销量。`,
    answerText: raw`平均单位收入为
$$180.$$`,
    solutionMethods: [
      { title: '方法一 · 积分恢复总收入', content: raw`由 $R(0)=0$，
$$R(2000)=\int_0^{2000}\left(200-\frac a{50}\right)da
=400000-40000=360000.$$
所以平均单位收入为 $360000/2000=180$。` },
      { title: '方法二 · 线性函数平均值', content: raw`边际收入在 $[0,2000]$ 上是线性函数，其区间平均值等于两端值的算术平均：
$$\frac{R'(0)+R'(2000)}2=\frac{200+160}{2}=180.$$
而 $R(2000)/2000$ 正是边际收入在该区间上的平均值。` }
    ]
  }),
  lectureTwelve({
    id: 'exercise-12-3-hemisphere-pumping', role: 'exercise', page: 'PDF 307-308 · 书页 302-303 · 习题 12.3',
    fingerprint: 'pumping-work:full-hemisphere-lift-six-meters-above-rim-centroid',
    title: '习题 12.3 · 半球形水池抽水到高位水箱',
    statement: raw`半径为 $4\,\mathrm m$ 的半球形水池装满水，要把水全部抽到距水池原水面 $6\,\mathrm m$ 高的水箱中。已知水的密度 $\rho=1000\,\mathrm{kg/m^3}$，重力加速度 $g=9.8\,\mathrm{m/s^2}$，取 $\pi=3.14$，求所做的功。`,
    tags: ['抽水做功', '半球', '数值计算'],
    coreMethod: raw`以原水面为 $y=0$，水池占 $-4\le y\le0$；薄片面积为 $\pi(16-y^2)$，提升距离为 $6-y$。`,
    mistakes: raw`把所有水都只提升 $6$ 米；池底水比水面处的水还要多提升 $4$ 米。数值答案要把焦耳换算成千焦。`,
    answerText: raw`$$W=320\pi\rho g\ \mathrm J\approx9847\ \mathrm{kJ}.$$`,
    solutionMethods: [
      { title: '方法一 · 水平薄片积分', content: raw`在高度 $y\in[-4,0]$ 处，截面面积为 $\pi(16-y^2)$，提升距离为 $6-y$。因此
$$W=\rho g\pi\int_{-4}^0(6-y)(16-y^2)dy
=320\pi\rho g.$$
代入数据并除以 $1000$，得到约 $9847\,\mathrm{kJ}$。` },
      { title: '方法二 · 半球水体重心', content: raw`半球体积为 $V=128\pi/3$，其形心在球心下方 $3R/8=1.5$ 米处，所以平均提升距离为 $6+1.5=7.5$ 米。于是
$$W=\rho gV\cdot7.5
=\rho g\frac{128\pi}{3}\frac{15}{2}
=320\pi\rho g,$$
与薄片积分一致。` }
    ]
  }),
  lectureTwelve({
    id: 'exercise-12-4-demand-elasticity-marginal-revenue', role: 'exercise', page: 'PDF 307-308 · 书页 302-303 · 习题 12.4',
    fingerprint: 'economic-elasticity:maximum-demand-linear-demand-marginal-revenue-at-price',
    title: '习题 12.4 · 由需求弹性求需求函数与边际收益',
    statement: raw`某商品的最大需求量为 $1200$ 件，需求函数为 $Q=Q(p)$，需求弹性为
$$\eta=-\frac pQ\frac{dQ}{dp}=\frac{p}{120-p},\qquad \eta>0,$$
其中 $p$ 为单价，单位为万元。

1. 求需求函数；
2. 求 $p=100$ 万元时的边际收益，并说明其经济意义。`,
    tags: ['经济应用', '需求弹性', '边际收益'],
    coreMethod: raw`把弹性式化为 $dQ/Q=-dp/(120-p)$，用 $Q(0)=1200$ 定常数；随后把总收益写成销量 $Q$ 的函数再求边际收益。`,
    mistakes: raw`边际收益是 $dR/dQ$，不是 $dR/dp$；在 $p=100$ 时还要先由需求函数求出对应销量 $Q=200$。`,
    answerText: raw`$$Q(p)=1200-10p.$$
当 $p=100$ 时，$Q=200$，边际收益为
$$R'(200)=80\ \text{万元/件}.$$`,
    solutionMethods: [
      { title: '方法一 · 分离变量与收益求导', content: raw`弹性式给出
$$\frac{dQ}{Q}=-\frac{dp}{120-p}.$$
积分并用 $Q(0)=1200$，得到 $Q=10(120-p)=1200-10p$。反解 $p=120-Q/10$，故
$$R(Q)=pQ=120Q-\frac{Q^2}{10},\qquad R'(Q)=120-\frac Q5.$$
$p=100$ 时 $Q=200$，所以 $R'(200)=80$。这表示在当前销量附近多销售一件，总收益约增加 $80$ 万元。` },
      { title: '方法二 · 弹性与边际收益公式', content: raw`总收益 $R=pQ$，对 $Q$ 求导有
$$\frac{dR}{dQ}=p+Q\frac{dp}{dQ}=p\left(1-\frac1\eta\right).$$
当 $p=100$ 时，$\eta=100/(120-100)=5$，因此
$$\frac{dR}{dQ}=100\left(1-\frac15\right)=80.$$
需求函数仍由分离变量和最大需求量得到 $Q=1200-10p$。` }
    ]
  })
]
