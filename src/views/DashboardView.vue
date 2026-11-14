<script setup lang="ts">
import { computed, getCurrentInstance, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import VChart from 'vue-echarts'
import { BarChart as EBarChart, LineChart } from 'echarts/charts'
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import FilterBar from '../components/FilterBar.vue'
import PageTabs from '../components/PageTabs.vue'
import ProTable from '../components/ProTable.vue'
import StatusTag from '../components/StatusTag.vue'
import VxeUI from 'vxe-pc-ui'
import VXETable from 'vxe-table'
import 'vxe-pc-ui/lib/style.css'
import 'vxe-table/lib/style.css'
import { BarChart3, Bell, Boxes, ChevronDown, ChevronRight, CircleHelp, ClipboardList, Command, Download, Filter, LayoutDashboard, LogOut, Menu, MoreHorizontal, Search, Settings2, Sparkles, Store, TableProperties, UsersRound } from 'lucide-vue-next'
import { useAuthStore } from '../stores/auth'

use([CanvasRenderer, LineChart, EBarChart, GridComponent, TooltipComponent, LegendComponent])
getCurrentInstance()?.appContext.app.use(VxeUI).use(VXETable)

const router = useRouter()
const auth = useAuthStore()
const isMenuOpen = ref(false)
const range = ref('最近 7 天')
const selectedStore = ref('全部店铺')
const selectedSite = ref('全部站点')
const selectedTeam = ref('全部部门')
const selectedOperator = ref('全部运营员')
const activeTab = ref('weekly')
const search = ref('')
const rows = [
  { asin: 'B0D8K2M41P', sku: 'KSA-HM-001', product: '多功能厨房收纳架', store: 'Dune Market', site: '沙特', department: '运营一部', owner: '运营员 A', sales: 128, revenue: 6184, change: 18.4, spend: 722, acos: 21.6, returnRate: 2.3, stock: 184, status: '表现增长' },
  { asin: 'B0C9R4V8QT', sku: 'UAE-LT-017', product: '户外太阳能庭院灯', store: 'Palm House', site: '阿联酋', department: '运营二部', owner: '运营员 B', sales: 96, revenue: 4795, change: 8.2, spend: 596, acos: 24.8, returnRate: 3.1, stock: 72, status: '关注广告' },
  { asin: 'B0B7N3F2LX', sku: 'KSA-PT-044', product: '宠物慢食硅胶垫', store: 'Desert Living', site: '沙特', department: '运营一部', owner: '运营员 C', sales: 75, revenue: 2678, change: -12.6, spend: 448, acos: 31.2, returnRate: 5.8, stock: 28, status: '销售下滑' },
  { asin: 'B0F1A6W9KC', sku: 'UAE-OR-052', product: '可折叠收纳周转箱', store: 'Palm House', site: '阿联酋', department: '运营一部', owner: '运营员 A', sales: 64, revenue: 3892, change: 22.1, spend: 381, acos: 18.7, returnRate: 1.6, stock: 214, status: '表现增长' },
  { asin: 'B0A4J7P3DM', sku: 'KSA-BT-109', product: '浴室免打孔置物架', store: 'Oasis Home', site: '沙特', department: '运营二部', owner: '运营员 B', sales: 42, revenue: 1954, change: -4.8, spend: 377, acos: 29.4, returnRate: 7.1, stock: 96, status: '关注退货' },
]
const pageTabs = [{ id: 'weekly', label: 'ASIN 周表现' }]

const filteredRows = computed(() => rows.filter((row) => {
  const matchesText = `${row.asin} ${row.product} ${row.sku}`.toLowerCase().includes(search.value.toLowerCase())
  return matchesText
    && (selectedSite.value === '全部站点' || row.site === selectedSite.value)
    && (selectedStore.value === '全部店铺' || row.store === selectedStore.value)
    && (selectedTeam.value === '全部部门' || row.department === selectedTeam.value)
    && (selectedOperator.value === '全部运营员' || row.owner === selectedOperator.value)
}))
const storeOptions = computed(() => [...new Set(rows
  .filter((row) => selectedSite.value === '全部站点' || row.site === selectedSite.value)
  .map((row) => row.store))])
const teamOptions = computed(() => [...new Set(rows
  .filter((row) => (selectedSite.value === '全部站点' || row.site === selectedSite.value)
    && (selectedStore.value === '全部店铺' || row.store === selectedStore.value))
  .map((row) => row.department))])
const operatorOptions = computed(() => [...new Set(rows
  .filter((row) => (selectedSite.value === '全部站点' || row.site === selectedSite.value)
    && (selectedStore.value === '全部店铺' || row.store === selectedStore.value)
    && (selectedTeam.value === '全部部门' || row.department === selectedTeam.value))
  .map((row) => row.owner))])

watch(selectedSite, () => {
  selectedStore.value = '全部店铺'
  selectedTeam.value = '全部部门'
  selectedOperator.value = '全部运营员'
})
watch(selectedStore, () => {
  selectedTeam.value = '全部部门'
  selectedOperator.value = '全部运营员'
})
watch(selectedTeam, () => { selectedOperator.value = '全部运营员' })
const chartOption = {
  animation: false,
  color: ['#168c88', '#f0a44b'],
  grid: { left: 36, right: 12, top: 24, bottom: 24 },
  tooltip: { trigger: 'axis' },
  legend: { top: 0, right: 0, itemWidth: 8, itemHeight: 8, textStyle: { color: '#7b8794', fontSize: 11 } },
  xAxis: { type: 'category', boundaryGap: false, data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'], axisLine: { lineStyle: { color: '#e9edf0' } }, axisTick: { show: false }, axisLabel: { color: '#909ba6', fontSize: 11 } },
  yAxis: { type: 'value', splitLine: { lineStyle: { color: '#f0f2f4' } }, axisLabel: { color: '#909ba6', fontSize: 10 } },
  series: [
    { name: '销售额', type: 'line', smooth: true, symbol: 'circle', symbolSize: 5, data: [8120, 9050, 8760, 10880, 9940, 12060, 13740], areaStyle: { color: 'rgba(22,140,136,.08)' }, lineStyle: { width: 2.5 } },
    { name: '广告花费', type: 'line', smooth: true, symbol: 'none', data: [1520, 1760, 1640, 1980, 1890, 2210, 2390], lineStyle: { width: 2, type: 'dashed' } },
  ],
}

async function exit() {
  await auth.signOut()
  await router.push('/login')
}
</script>

<template>
  <div class="app-shell">
    <aside class="sidebar" :class="{ expanded: isMenuOpen }">
      <div class="sidebar-brand">
        <div class="brand-mark"><span class="mark-bars"><i></i><i></i><i></i></span></div>
        <div><strong>运营数据</strong><small>OPERATIONS BI</small></div>
        <button class="mobile-menu icon-button" aria-label="收起菜单" @click="isMenuOpen = false"><Menu :size="17" /></button>
      </div>
      <div class="workspace-switch"><span class="workspace-avatar">O</span><span class="workspace-name">运营团队空间<small>团队版</small></span><ChevronDown :size="14" /></div>
      <nav class="side-nav" aria-label="主导航">
        <span class="nav-section-label">工作空间</span>
        <RouterLink to="/preview" class="nav-item active"><LayoutDashboard :size="17" /><span>周表现</span><span class="nav-count">01</span></RouterLink>
        <a class="nav-item muted" href="#tasks"><ClipboardList :size="17" /><span>优化事项</span><span class="nav-soon">规划中</span></a>
        <a class="nav-item muted" href="#ai"><Sparkles :size="17" /><span>AI 分析</span><span class="nav-soon">规划中</span></a>
        <span class="nav-section-label nav-section-spaced">数据管理</span>
        <a class="nav-item muted" href="#stores"><Store :size="17" /><span>店铺与站点</span></a>
        <a class="nav-item muted" href="#team"><UsersRound :size="17" /><span>团队与人员</span></a>
        <a class="nav-item muted" href="#products"><Boxes :size="17" /><span>商品目录</span></a>
      </nav>
      <div class="sidebar-bottom">
        <a class="nav-item muted" href="#settings"><Settings2 :size="17" /><span>系统设置</span></a>
        <div class="sidebar-help"><span class="help-icon"><CircleHelp :size="15" /></span><span>需要帮助？<small>查看使用指南</small></span><ChevronRight :size="14" /></div>
        <button class="user-profile" @click="auth.user ? exit() : router.push('/login')">
          <span class="profile-avatar">{{ auth.user?.email?.[0]?.toUpperCase() ?? 'O' }}</span>
          <span class="profile-info">{{ auth.user?.email ?? '团队预览' }}<small>{{ auth.user ? '已登录' : '预览模式' }}</small></span>
          <LogOut v-if="auth.user" :size="15" /><MoreHorizontal v-else :size="17" />
        </button>
      </div>
    </aside>

    <main class="main-area">
      <header class="topbar">
        <button class="mobile-menu icon-button" aria-label="打开菜单" @click="isMenuOpen = !isMenuOpen"><Menu :size="18" /></button>
        <div class="breadcrumb"><span>工作空间</span><ChevronRight :size="14" /><strong>ASIN 周表现</strong></div>
        <div class="topbar-actions">
          <span class="demo-badge"><i></i> 界面预览 · 示例数据</span>
          <button class="icon-button" aria-label="快捷搜索"><Search :size="17" /></button>
          <button class="icon-button notification" aria-label="通知"><Bell :size="17" /><i></i></button>
          <span class="top-divider"></span>
          <button class="account-button" @click="auth.user ? exit() : router.push('/login')"><span class="profile-avatar small">{{ auth.user?.email?.[0]?.toUpperCase() ?? 'O' }}</span><ChevronDown :size="13" /></button>
        </div>
      </header>
      <PageTabs v-model="activeTab" :items="pageTabs">
        <template #icon><TableProperties :size="14" /></template>
        <template #add><button class="add-tab" aria-label="添加页面">+</button></template>
        <template #tools><button class="tab-tools"><Command :size="14" /> 快捷操作</button></template>
      </PageTabs>

      <section class="page-content">
        <div class="page-heading">
          <div><div class="heading-kicker">业务分析 <span>/</span> 商品表现</div><h1>ASIN 周表现</h1><p>跨店铺查看商品关键指标，快速发现变化与机会。</p></div>
          <div class="heading-actions"><span class="updated-label">最近更新 <strong>今天 09:42</strong></span><el-button :icon="Download" plain>导出报表</el-button></div>
        </div>

        <FilterBar>
          <div class="filter-leading"><Filter :size="15" /><span>筛选</span><span class="filter-divider"></span></div>
          <el-select v-model="range" aria-label="统计周期" size="default"><el-option label="最近 7 天" value="最近 7 天" /><el-option label="最近 14 天" value="最近 14 天" /><el-option label="最近 30 天" value="最近 30 天" /></el-select>
          <span class="filter-pipe"></span>
          <el-select v-model="selectedSite" aria-label="站点筛选" size="default"><el-option label="全部站点" value="全部站点" /><el-option label="沙特" value="沙特" /><el-option label="阿联酋" value="阿联酋" /></el-select>
          <el-select v-model="selectedStore" aria-label="店铺筛选" size="default"><el-option label="全部店铺" value="全部店铺" /><el-option v-for="store in storeOptions" :key="store" :label="store" :value="store" /></el-select>
          <el-select v-model="selectedTeam" aria-label="部门筛选" size="default"><el-option label="全部部门" value="全部部门" /><el-option v-for="team in teamOptions" :key="team" :label="team" :value="team" /></el-select>
          <el-select v-model="selectedOperator" aria-label="运营员筛选" size="default"><el-option label="全部运营员" value="全部运营员" /><el-option v-for="operator in operatorOptions" :key="operator" :label="operator" :value="operator" /></el-select>
          <el-button text>更多条件 <ChevronDown :size="14" /></el-button>
          <div class="filter-spacer"></div>
          <el-input v-model="search" class="table-search" placeholder="搜索 ASIN、SKU、商品" :prefix-icon="Search" clearable />
        </FilterBar>

        <div class="summary-grid">
          <article class="summary-card sales-card"><div class="summary-top"><span>商品总销售额</span><span class="summary-icon teal"><BarChart :size="16" /></span></div><div class="summary-value">AED 286,430 <span class="trend up">↑ 12.8%</span></div><div class="summary-caption">较前一周期 <span>+ AED 32,540</span></div><div class="sparkline"><i v-for="(h, i) in [17,22,19,31,27,38,34,50,41,59,53,72,62,85,76,93]" :key="i" :style="{ height: `${h}%` }"></i></div></article>
          <article class="summary-card"><div class="summary-top"><span>总销量</span><span class="summary-icon blue"><BarChart3 :size="16" /></span></div><div class="summary-value">4,682 <span class="unit">件</span><span class="trend up">↑ 8.4%</span></div><div class="summary-caption">覆盖商品 <span>1,286 个 ASIN</span></div><div class="mini-bars"><i v-for="(h, i) in [32,49,38,64,51,75,58,88,69,96,78,84]" :key="i" :style="{ height: `${h}%` }"></i></div></article>
          <article class="summary-card"><div class="summary-top"><span>广告花费</span><span class="summary-icon orange"><Sparkles :size="16" /></span></div><div class="summary-value">AED 48,920 <span class="trend down">↑ 4.2%</span></div><div class="summary-caption">平均 ACOS <span>24.6%</span></div><div class="mini-bars orange-bars"><i v-for="(h, i) in [43,55,39,74,58,68,47,80,62,72,51,91]" :key="i" :style="{ height: `${h}%` }"></i></div></article>
          <article class="summary-card"><div class="summary-top"><span>需关注商品</span><span class="summary-icon coral"><ClipboardList :size="16" /></span></div><div class="summary-value">38 <span class="unit">个 ASIN</span></div><div class="summary-caption"><span class="dot coral-dot"></span> 销量下滑 21 <span class="dot gold-dot"></span> 高退货 17</div><div class="attention-line"><i style="width:55%"></i><i style="width:45%"></i></div></article>
        </div>

        <div class="insight-grid">
          <section class="panel trend-panel"><div class="panel-heading"><div><h2>销售与广告趋势</h2><p>最近 7 天 · 汇总所有已选店铺</p></div><el-button text :icon="MoreHorizontal" aria-label="更多趋势选项" /></div><div class="chart-wrap"><VChart class="trend-chart" :option="chartOption" autoresize /></div></section>
          <section class="panel focus-panel"><div class="panel-heading"><div><h2>本周关注</h2><p>需要团队进一步查看的信号</p></div><span class="focus-count">3</span></div><div class="focus-list"><div class="focus-item"><span class="focus-marker decline">↘</span><div><strong>销量下滑商品</strong><small>21 个 ASIN 环比下降超过 15%</small></div><ChevronRight :size="15" /></div><div class="focus-item"><span class="focus-marker return">!</span><div><strong>退货率偏高</strong><small>17 个 ASIN 退货率高于 5%</small></div><ChevronRight :size="15" /></div><div class="focus-item"><span class="focus-marker stock">⌁</span><div><strong>库存即将不足</strong><small>9 个 ASIN 预计可售天数低于 14 天</small></div><ChevronRight :size="15" /></div></div><button class="focus-link">查看全部关注商品 <ChevronRight :size="14" /></button></section>
        </div>

        <section class="panel table-panel">
          <div class="table-header"><div><h2>商品表现明细</h2><p>按 ASIN 查看销售、广告、退货和库存表现 <span class="record-count">1,286 个商品</span></p></div><div class="table-actions"><button class="table-tool" aria-label="配置列" title="配置列"><Settings2 :size="16" /></button><button class="table-tool" aria-label="筛选" title="筛选"><Filter :size="16" /></button><el-button size="small" type="primary" plain>批量建事项</el-button></div></div>
          <ProTable class="performance-table" :data="filteredRows" height="330" stripe border="inner" show-overflow>
            <vxe-column type="checkbox" width="40" fixed="left" />
            <vxe-column title="商品信息" min-width="220" fixed="left">
              <template #default="{ row }"><div class="product-cell"><div class="product-thumb"><Boxes :size="18" /></div><div><strong>{{ row.product }}</strong><small>{{ row.asin }} <span>·</span> {{ row.sku }}</small></div></div></template>
            </vxe-column>
            <vxe-column field="site" title="站点 / 店铺" min-width="130"><template #default="{ row }"><span class="site-label">{{ row.site }}</span><small class="store-name">{{ row.store }}</small></template></vxe-column>
            <vxe-column field="owner" title="运营员" width="105" />
            <vxe-column field="department" title="运营部门" width="105" />
            <vxe-column field="sales" title="销量" width="100" align="right" sortable><template #default="{ row }"><strong>{{ row.sales }}</strong><small class="cell-unit">件</small></template></vxe-column>
            <vxe-column field="revenue" title="销售额" width="125" align="right" sortable><template #default="{ row }">AED {{ row.revenue.toLocaleString() }}</template></vxe-column>
            <vxe-column field="change" title="销量环比" width="110" align="right" sortable><template #default="{ row }"><span :class="row.change > 0 ? 'positive' : 'negative'">{{ row.change > 0 ? '+' : '' }}{{ row.change }}%</span></template></vxe-column>
            <vxe-column field="spend" title="广告花费" width="120" align="right"><template #default="{ row }">AED {{ row.spend }}</template></vxe-column>
            <vxe-column field="acos" title="ACOS" width="90" align="right"><template #default="{ row }">{{ row.acos }}%</template></vxe-column>
            <vxe-column field="returnRate" title="退货率" width="90" align="right"><template #default="{ row }"><span :class="row.returnRate > 5 ? 'negative' : ''">{{ row.returnRate }}%</span></template></vxe-column>
            <vxe-column field="stock" title="FBA 可售" width="95" align="right" />
            <vxe-column field="status" title="状态" width="115" fixed="right"><template #default="{ row }"><StatusTag :label="row.status" :tone="row.status === '表现增长' ? 'positive' : row.status === '关注广告' ? 'warning' : 'danger'" /></template></vxe-column>
          </ProTable>
          <div class="table-footer"><span>显示 <strong>{{ filteredRows.length }}</strong> 条示例记录 <span class="demo-note">· 预览数据，非实时业务数据</span></span><div class="pagination"><button disabled>‹</button><button class="current">1</button><button>2</button><button>3</button><span>…</span><button>129</button><button>›</button><span class="page-size">20 条/页 <ChevronDown :size="12" /></span></div></div>
        </section>
        <footer class="page-footer"><span>数据预览 · 真实店铺数据需完成 Supabase 连接与导入规则确认</span><span>Saudi Arabia / United Arab Emirates <span class="footer-dot">·</span> UTC+3 / UTC+4</span></footer>
      </section>
    </main>
  </div>
</template>
