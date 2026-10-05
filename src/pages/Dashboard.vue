<template>
  <div class="space-y-6 w-full min-w-0 pb-12 select-none">
    
    <!-- 1. Top Executive Welcome & Command Bar -->
    <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#111c24] via-[#162533] to-[#0a131f] p-6 sm:p-8 text-white border border-slate-800 shadow-xl shadow-emerald-950/20">
      <div class="absolute -right-12 -bottom-12 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div class="absolute right-12 top-6 opacity-10 pointer-events-none hidden lg:block">
        <svg viewBox="0 0 261.76 226.69" class="w-48 h-48">
          <path d="M 161.096 0 L 130.88 52.338 L 100.664 0 L 0 0 L 130.88 226.69 L 261.76 0 Z" fill="#42b883" />
          <path d="M 161.096 0 L 130.88 52.338 L 100.664 0 L 52.246 0 L 130.88 136.196 L 209.514 0 Z" fill="#ffffff" />
        </svg>
      </div>

      <div class="relative z-10 max-w-3xl">
        <div class="flex items-center gap-2 mb-3">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30">
            <Sparkles class="w-3.5 h-3.5" />
            <span>Vue 3.5 Reactive Hub</span>
          </span>
          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-800/80 text-slate-300 text-xs font-mono font-bold border border-slate-700">
            <Clock class="w-3 h-3 text-emerald-400" />
            <span>Live Sync Active</span>
          </span>
        </div>

        <h1 class="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white mb-2">
          3DDX Dental Lab Command
        </h1>
        <p class="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
          Real-time operations cockpit monitoring CAD/CAM queue velocity, Power BI quarterly quotas, and surgical guide dispatch pipelines.
          Currently <strong class="text-emerald-400">{{ store.dashboardStats.inProgress }} cases in production</strong> and <strong class="text-rose-400">{{ urgentOrders.length }} urgent cases</strong> requiring verification.
        </p>

        <!-- Command Shortcuts -->
        <div class="flex items-center gap-2.5 flex-wrap">
          <router-link
            to="/orders/create"
            @click="sound.playClick(620)"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition-all active:scale-95 cursor-pointer"
          >
            <Plus class="w-4 h-4 stroke-[2.5]" />
            <span>New Clinical Case</span>
          </router-link>

          <router-link
            to="/flow"
            @click="sound.playClick(580)"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 hover:border-emerald-500/50 transition-all cursor-pointer"
          >
            <Layers class="w-4 h-4 text-emerald-400" />
            <span>Master Flow (22 Cols)</span>
          </router-link>

          <button
            type="button"
            @click="triggerRefresh"
            class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs border border-slate-700 transition-all cursor-pointer"
          >
            <RefreshCw class="w-3.5 h-3.5" :class="{ 'animate-spin': isRefreshing }" />
            <span>{{ isRefreshing ? 'Refreshing...' : 'Live Telemetry' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 2. Four Master KPI Metric Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Orders -->
      <div class="p-5 rounded-2xl bg-white dark:bg-[#070b14] border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:border-emerald-500/40 transition-all group">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Orders</span>
          <span class="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
            <Package class="w-5 h-5" />
          </span>
        </div>
        <div class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-1">
          {{ store.dashboardStats.totalOrders }}
        </div>
        <div class="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
          <TrendingUp class="w-3.5 h-3.5" />
          <span>+14.8% growth vs Q3</span>
        </div>
      </div>

      <!-- In Production -->
      <div class="p-5 rounded-2xl bg-white dark:bg-[#070b14] border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:border-teal-500/40 transition-all group">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">In CAD Production</span>
          <span class="p-2.5 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform">
            <Activity class="w-5 h-5" />
          </span>
        </div>
        <div class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-1">
          {{ store.dashboardStats.inProgress }}
        </div>
        <div class="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <Clock class="w-3.5 h-3.5 text-teal-500" />
          <span>Avg turnaround: {{ store.dashboardStats.avgTurnaroundDays }} days</span>
        </div>
      </div>

      <!-- Urgent Priority -->
      <div class="p-5 rounded-2xl bg-white dark:bg-[#070b14] border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:border-rose-500/40 transition-all group">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Urgent Attention</span>
          <span class="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform">
            <AlertTriangle class="w-5 h-5" />
          </span>
        </div>
        <div class="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400 mb-1">
          {{ urgentOrders.length }}
        </div>
        <div class="text-xs text-rose-500 font-semibold flex items-center gap-1">
          <span class="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <span>Priority surgical dispatch required</span>
        </div>
      </div>

      <!-- Total Fabrication Revenue -->
      <div class="p-5 rounded-2xl bg-white dark:bg-[#070b14] border border-slate-200/80 dark:border-slate-800/80 shadow-xs hover:border-emerald-500/40 transition-all group">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Fabrication Revenue</span>
          <span class="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
            <DollarSign class="w-5 h-5" />
          </span>
        </div>
        <div class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-1">
          {{ formatCurrency(store.dashboardStats.revenue) }}
        </div>
        <div class="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span>Invoiced & Collected</span>
          <span class="font-mono text-emerald-600 font-bold">98.2% Paid</span>
        </div>
      </div>
    </div>

    <!-- 3. Power BI Interactive Quarterly Telemetry Engine -->
    <div class="p-6 rounded-3xl bg-white dark:bg-[#070b14] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-6">
      
      <!-- Power BI Header & Quarter Selector -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <BarChart3 class="w-4 h-4" />
            </div>
            <h2 class="text-lg font-black text-slate-900 dark:text-white tracking-tight">
              Power BI Quarterly Performance & Production Quotas
            </h2>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              Interactive Model
            </span>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Toggle quarters to recalculate revenue realization, surgical guide quotas, and turnaround SLA metrics.
          </p>
        </div>

        <!-- Quarter Switcher + Chart Type Toggle -->
        <div class="flex items-center gap-2 flex-wrap">
          <div class="flex items-center p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <button
              v-for="q in (['Q1', 'Q2', 'Q3', 'Q4', 'ALL'] as const)"
              :key="q"
              type="button"
              @click="setQuarter(q)"
              :class="[
                'px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer',
                selectedQuarter === q
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              ]"
            >
              {{ q }}
            </button>
          </div>

          <div class="flex items-center p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <button
              type="button"
              @click="chartView = 'bar'"
              :class="[
                'p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer',
                chartView === 'bar' ? 'bg-white dark:bg-slate-800 text-emerald-600 shadow-xs' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              ]"
              title="Bar Chart Mode"
            >
              <BarChart3 class="w-4 h-4" />
            </button>
            <button
              type="button"
              @click="chartView = 'area'"
              :class="[
                'p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer',
                chartView === 'area' ? 'bg-white dark:bg-slate-800 text-emerald-600 shadow-xs' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              ]"
              title="Area Curve Mode"
            >
              <TrendingUp class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Quarter Micro-KPIs Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div class="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60">
          <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Attainment</div>
          <div class="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {{ activeQuarterData.attainment }}%
          </div>
          <div class="text-[10px] text-slate-500 font-medium">YoY {{ activeQuarterData.yoy }}</div>
        </div>

        <div class="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60">
          <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Actual Rev</div>
          <div class="text-xl font-black text-slate-900 dark:text-white font-mono">
            {{ activeQuarterData.actualRev }}
          </div>
          <div class="text-[10px] text-slate-500 font-medium">Target: {{ activeQuarterData.targetRev }}</div>
        </div>

        <div class="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60">
          <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">SG Guides Quota</div>
          <div class="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {{ activeQuarterData.sgUnits }}
          </div>
          <div class="text-[10px] text-slate-500 font-medium">Quota: {{ activeQuarterData.sgQuota }} ({{ activeQuarterData.sgPercent }}%)</div>
        </div>

        <div class="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60">
          <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">TP Planning Quota</div>
          <div class="text-xl font-black text-teal-600 dark:text-teal-400 font-mono">
            {{ activeQuarterData.tpUnits }}
          </div>
          <div class="text-[10px] text-slate-500 font-medium">Quota: {{ activeQuarterData.tpQuota }} ({{ activeQuarterData.tpPercent }}%)</div>
        </div>

        <div class="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60">
          <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Turnaround</div>
          <div class="text-xl font-black text-slate-900 dark:text-white font-mono">
            {{ activeQuarterData.turnaround }}
          </div>
          <div class="text-[10px] text-slate-500 font-medium">Industry standard 4.5d</div>
        </div>

        <div class="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60">
          <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">SLA Pass Rate</div>
          <div class="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {{ activeQuarterData.slaPass }}
          </div>
          <div class="text-[10px] text-slate-500 font-medium">On-time clinical delivery</div>
        </div>
      </div>

      <!-- Main Visual Graph & Breakdown Split -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        
        <!-- Left: Pure Vue Reactive Visual Chart (Area or Bar) -->
        <div class="lg:col-span-2 p-5 rounded-2xl bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/80 space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <h4 class="font-extrabold text-sm text-slate-900 dark:text-white">
                {{ activeQuarterData.name }} Revenue & Case Output Velocity
              </h4>
              <p class="text-[11px] text-slate-500 dark:text-slate-400">Actual fabrication revenue ($) vs targeted clinical output</p>
            </div>
            <div class="flex items-center gap-3 text-xs">
              <span class="flex items-center gap-1.5 font-bold text-slate-600 dark:text-slate-300">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Actual Rev</span>
              </span>
              <span class="flex items-center gap-1.5 font-bold text-slate-600 dark:text-slate-300">
                <span class="w-2.5 h-2.5 rounded-full bg-teal-400" />
                <span>Target Rev</span>
              </span>
            </div>
          </div>

          <!-- Dynamic SVG Chart Canvas -->
          <div class="h-64 w-full flex flex-col justify-end pt-4">
            <!-- Mode 1: Interactive Bar Mode -->
            <div v-if="chartView === 'bar'" class="h-56 flex items-end justify-around gap-2 px-2">
              <div
                v-for="item in activeQuarterData.chartData"
                :key="item.month"
                class="flex-1 max-w-[80px] flex flex-col items-center gap-2 group cursor-pointer"
                @mouseenter="hoveredBar = item; sound.playChartTick()"
                @mouseleave="hoveredBar = null"
              >
                <!-- Tooltip floating above bar -->
                <div class="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono font-bold px-2 py-1 rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-lg pointer-events-none mb-1 text-center whitespace-nowrap z-20">
                  <div>${{ (item.actualRevenue / 1000).toFixed(0) }}k / ${{ (item.targetRevenue / 1000).toFixed(0) }}k</div>
                  <div class="text-emerald-400 dark:text-emerald-600 font-extrabold">{{ item.attainment }}% target</div>
                </div>

                <!-- Dual Columns: Actual vs Target -->
                <div class="w-full flex items-end justify-center gap-1.5 h-44 bg-slate-100 dark:bg-slate-800/50 rounded-xl p-1">
                  <!-- Target Column -->
                  <div
                    class="w-1/2 rounded-md bg-slate-300 dark:bg-slate-700 transition-all duration-300 group-hover:bg-slate-400"
                    :style="{ height: `${Math.min(100, (item.targetRevenue / maxChartRevenue) * 100)}%` }"
                  />
                  <!-- Actual Column -->
                  <div
                    class="w-1/2 rounded-md bg-gradient-to-t from-emerald-600 to-teal-400 group-hover:from-emerald-500 group-hover:to-teal-300 transition-all duration-300 shadow-xs"
                    :style="{ height: `${Math.min(100, (item.actualRevenue / maxChartRevenue) * 100)}%` }"
                  />
                </div>

                <span class="text-xs font-bold text-slate-500 dark:text-slate-400 group-hover:text-emerald-500 transition-colors">
                  {{ item.month }}
                </span>
              </div>
            </div>

            <!-- Mode 2: Area / Curve SVG Chart -->
            <div v-else class="h-56 w-full relative flex items-center justify-center">
              <svg viewBox="0 0 600 200" class="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="vueEmeraldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#10b981" stop-opacity="0.45" />
                    <stop offset="100%" stop-color="#10b981" stop-opacity="0.0" />
                  </linearGradient>
                  <linearGradient id="vueTealGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stop-color="#14b8a6" stop-opacity="0.3" />
                    <stop offset="100%" stop-color="#14b8a6" stop-opacity="0.0" />
                  </linearGradient>
                </defs>

                <!-- Grid lines -->
                <line x1="0" y1="40" x2="600" y2="40" stroke="currentColor" class="text-slate-200 dark:text-slate-800" stroke-dasharray="3 3" />
                <line x1="0" y1="100" x2="600" y2="100" stroke="currentColor" class="text-slate-200 dark:text-slate-800" stroke-dasharray="3 3" />
                <line x1="0" y1="160" x2="600" y2="160" stroke="currentColor" class="text-slate-200 dark:text-slate-800" stroke-dasharray="3 3" />

                <!-- Filled Area -->
                <path :d="svgAreaPath" fill="url(#vueEmeraldGrad)" />

                <!-- Stroke Line -->
                <path :d="svgLinePath" fill="none" stroke="#10b981" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" />

                <!-- Data point nodes -->
                <circle
                  v-for="(pt, idx) in svgPoints"
                  :key="idx"
                  :cx="pt.x"
                  :cy="pt.y"
                  r="5"
                  class="fill-white dark:fill-slate-900 stroke-emerald-500 stroke-[3] hover:scale-125 transition-transform cursor-pointer"
                />
              </svg>

              <!-- Month labels row below curve -->
              <div class="absolute -bottom-5 left-0 right-0 flex justify-around text-xs font-bold text-slate-400">
                <span v-for="item in activeQuarterData.chartData" :key="item.month">{{ item.month }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Clinical Service Quota Distribution Breakdown -->
        <div class="p-5 rounded-2xl bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/80 flex flex-col justify-between space-y-4">
          <div>
            <h4 class="font-extrabold text-sm text-slate-900 dark:text-white mb-1">
              Production Share Breakdown
            </h4>
            <p class="text-[11px] text-slate-500 dark:text-slate-400 mb-4">Unit volume and revenue generation per service line</p>

            <div class="space-y-3.5">
              <div v-for="dist in activeQuarterData.distribution" :key="dist.name" class="space-y-1">
                <div class="flex items-center justify-between text-xs">
                  <span class="font-bold text-slate-700 dark:text-slate-300 truncate max-w-[170px]">{{ dist.name }}</span>
                  <span class="font-mono font-bold text-slate-900 dark:text-white">{{ dist.units }} units ({{ dist.share }})</span>
                </div>
                <div class="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    class="h-full rounded-full transition-all duration-500"
                    :style="{ width: dist.share, backgroundColor: dist.color }"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="pt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
            <span class="text-slate-500 font-medium">Power BI Live Sync:</span>
            <router-link
              to="/powerbi"
              class="font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>Full Analytics Suite</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </router-link>
          </div>
        </div>

      </div>
    </div>

    <!-- 4. Urgent Attention Clinical Carousel -->
    <div v-if="urgentOrders.length > 0" class="p-6 rounded-3xl bg-rose-500/5 dark:bg-rose-950/20 border border-rose-500/30 shadow-xs space-y-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="p-2 rounded-xl bg-rose-500 text-white font-bold animate-pulse">
            <AlertTriangle class="w-4 h-4" />
          </div>
          <div>
            <h3 class="font-black text-base text-rose-900 dark:text-rose-100 tracking-tight">
              Urgent Clinical Cases Requiring Immediate Verification ({{ urgentOrders.length }})
            </h3>
            <p class="text-xs text-rose-700 dark:text-rose-300">
              Immediate turnaround commitments. Verify CBCT scans and STL alignment.
            </p>
          </div>
        </div>

        <router-link
          to="/flow"
          class="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
        >
          <span>View all in Flow</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </router-link>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <div
          v-for="uCase in urgentOrders.slice(0, 3)"
          :key="uCase.id"
          class="p-4 rounded-2xl bg-white dark:bg-[#070b14] border border-rose-200 dark:border-rose-900/60 shadow-xs flex flex-col justify-between space-y-3"
        >
          <div class="flex items-start justify-between">
            <div>
              <span class="font-mono text-xs font-black text-rose-600 dark:text-rose-400">
                #{{ uCase.orderNumber }}
              </span>
              <h4 class="font-bold text-sm text-slate-900 dark:text-white">
                {{ uCase.patientName }}
              </h4>
              <p class="text-xs text-slate-500 dark:text-slate-400">Dr. {{ uCase.doctorName }}</p>
            </div>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 border border-rose-500/30">
              {{ uCase.status }}
            </span>
          </div>

          <div class="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span class="text-slate-500 font-mono text-[11px]">Due: {{ formatDate(uCase.dueDate) }}</span>
            <router-link
              :to="`/order-details?ID=${uCase.orderNumber}`"
              class="px-2.5 py-1 rounded-lg bg-rose-500 hover:bg-rose-600 text-white font-bold text-[11px] transition-colors"
            >
              Verify Now
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- 5. Real-Time Production Queue & Stage Distribution -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Left: Recent Master Orders -->
      <div class="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-[#070b14] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-extrabold text-base text-slate-900 dark:text-white">
              Recent Clinical Cases & Sub-Orders
            </h3>
            <p class="text-xs text-slate-500 dark:text-slate-400">Live feed from 3DDX digital intake and lab pipeline</p>
          </div>
          <router-link
            to="/flow"
            class="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>View 22-Col Flow</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </router-link>
        </div>

        <div class="divide-y divide-slate-100 dark:divide-slate-800/80 overflow-x-auto">
          <div
            v-for="order in recentOrders"
            :key="order.id"
            @click="router.push(`/order-details?ID=${order.orderNumber}`)"
            class="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/80 dark:hover:bg-slate-900/40 px-2 rounded-xl transition-colors cursor-pointer group"
          >
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-mono font-bold text-xs shrink-0 group-hover:scale-105 transition-transform">
                #{{ order.orderNumber.slice(-3) }}
              </div>
              <div class="min-w-0">
                <div class="flex items-center gap-2">
                  <span class="font-bold text-xs text-slate-900 dark:text-white truncate">
                    {{ order.patientName }}
                  </span>
                  <span class="text-[10px] font-mono text-slate-400">#{{ order.orderNumber }}</span>
                </div>
                <div class="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  Dr. {{ order.doctorName }} • {{ order.restoration }} ({{ order.units }} units) • Due {{ formatDate(order.dueDate) }}
                </div>
              </div>
            </div>

            <div class="flex items-center gap-2 shrink-0">
              <StatusBadge :status="order.status" />
              <PriorityBadge :priority="order.priority" />
              <ArrowRight class="w-4 h-4 text-slate-300 dark:text-slate-700 group-hover:text-emerald-500 transition-colors" />
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Stage Distribution Benches -->
      <div class="p-6 rounded-3xl bg-white dark:bg-[#070b14] border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col justify-between space-y-4">
        <div>
          <h3 class="font-extrabold text-base text-slate-900 dark:text-white mb-1">
            Active Bench Distribution
          </h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 mb-6">Workload balancing across CAD, CAM, QA, and Boston Dispatch</p>

          <div class="space-y-4">
            <div v-for="stage in stageBreakdown" :key="stage.name" class="space-y-1.5">
              <div class="flex items-center justify-between text-xs">
                <span class="font-semibold text-slate-700 dark:text-slate-300">{{ stage.name }}</span>
                <span class="font-mono font-bold text-slate-900 dark:text-white">{{ stage.count }} ({{ stage.percent }}%)</span>
              </div>
              <div class="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-500"
                  :class="stage.color"
                  :style="{ width: `${stage.percent}%` }"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="pt-4 border-t border-slate-100 dark:border-slate-800">
          <router-link
            to="/workflow-board"
            class="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-xl transition-colors border border-emerald-500/20"
          >
            <span>Open Interactive Kanban Board</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </router-link>
        </div>
      </div>

    </div>

    <!-- 6. Odontogram Telemetry Strip Bento -->
    <div class="p-6 rounded-3xl bg-white dark:bg-[#070b14] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div class="flex items-center gap-2">
            <span class="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-500">
              <Zap class="w-4 h-4" />
            </span>
            <h3 class="font-black text-base text-slate-900 dark:text-white tracking-tight">
              Odontogram Clinical Telemetry (Universal 1–32 / FDI)
            </h3>
            <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Anatomical Map
            </span>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Selected: <strong class="text-emerald-600 dark:text-emerald-400">Tooth #{{ activeDashboardTooth }} ({{ getToothName(activeDashboardTooth) }})</strong> • {{ getToothQuadrant(activeDashboardTooth) }} • FDI {{ getFdi(activeDashboardTooth) }}
          </p>
        </div>

        <router-link
          to="/teeth-chart"
          class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 text-xs font-bold transition-all border border-slate-200 dark:border-slate-700"
        >
          <span>Open Full Teeth Chart</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </router-link>
      </div>

      <!-- Quick Interactive Teeth Strip -->
      <div class="bg-slate-50/70 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800/80 overflow-x-auto">
        <div class="min-w-[640px] space-y-3">
          <!-- Upper Arches 1 to 16 -->
          <div>
            <div class="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              <span>Maxillary Arch (Upper 1 ➔ 16)</span>
              <span class="font-mono text-emerald-500 text-[10px]">Right (UR) ⟷ Left (UL)</span>
            </div>
            <div class="grid grid-cols-16 gap-1">
              <button
                v-for="tooth in 16"
                :key="tooth"
                type="button"
                @mouseenter="activeDashboardTooth = tooth; sound.playChartTick()"
                @click="router.push(`/orders/create?tooth=${tooth}`)"
                :class="[
                  'h-10 rounded-lg flex flex-col items-center justify-center font-mono text-xs font-bold transition-all cursor-pointer',
                  activeDashboardTooth === tooth
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30 scale-110 z-10 font-black'
                    : 'bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:border-emerald-400'
                ]"
              >
                <span class="text-[10px]">#{{ tooth }}</span>
              </button>
            </div>
          </div>

          <!-- Lower Arches 32 down to 17 -->
          <div>
            <div class="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              <span>Mandibular Arch (Lower 32 ➔ 17)</span>
              <span class="font-mono text-teal-500 text-[10px]">Right (LR) ⟷ Left (LL)</span>
            </div>
            <div class="grid grid-cols-16 gap-1">
              <button
                v-for="tooth in lowerTeethOrder"
                :key="tooth"
                type="button"
                @mouseenter="activeDashboardTooth = tooth; sound.playChartTick()"
                @click="router.push(`/orders/create?tooth=${tooth}`)"
                :class="[
                  'h-10 rounded-lg flex flex-col items-center justify-center font-mono text-xs font-bold transition-all cursor-pointer',
                  activeDashboardTooth === tooth
                    ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/30 scale-110 z-10 font-black'
                    : 'bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:border-teal-400'
                ]"
              >
                <span class="text-[10px]">#{{ tooth }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { 
  Sparkles, Plus, Layers, BarChart3, Package, 
  Activity, AlertTriangle, DollarSign, TrendingUp, 
  Clock, ArrowRight, RefreshCw, Zap
} from 'lucide-vue-next';
import { useDentalStore } from '@/stores/dental';
import StatusBadge from '@/components/ui/StatusBadge.vue';
import PriorityBadge from '@/components/ui/PriorityBadge.vue';
import { formatCurrency, formatDate } from '@/utils/format';
import { sound } from '@/utils/sound';

const router = useRouter();
const store = useDentalStore();

const isRefreshing = ref(false);
const activeDashboardTooth = ref<number>(14);
const selectedQuarter = ref<'Q1' | 'Q2' | 'Q3' | 'Q4' | 'ALL'>('Q4');
const chartView = ref<'bar' | 'area'>('bar');
const hoveredBar = ref<any>(null);

const lowerTeethOrder = [32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17];

const triggerRefresh = () => {
  isRefreshing.value = true;
  sound.playPop();
  setTimeout(() => {
    isRefreshing.value = false;
  }, 600);
};

const setQuarter = (q: 'Q1' | 'Q2' | 'Q3' | 'Q4' | 'ALL') => {
  selectedQuarter.value = q;
  sound.playClick(640);
};

// Power BI Quarterly Datasets with 100% reactive state
const QUARTER_DATA_MAP = {
  Q1: {
    name: 'Q1 (Jan - Mar)',
    attainment: 96.8,
    yoy: '+8.2%',
    actualRev: '$695,000',
    targetRev: '$718,000',
    sgUnits: '2,890',
    sgQuota: '3,000',
    sgPercent: 96.3,
    tpUnits: '1,540',
    tpQuota: '1,600',
    tpPercent: 96.2,
    turnaround: '2.3 Days',
    slaPass: '98.8%',
    chartData: [
      { month: 'Jan', actualRevenue: 220000, targetRevenue: 235000, attainment: 93.6 },
      { month: 'Feb', actualRevenue: 232000, targetRevenue: 238000, attainment: 97.4 },
      { month: 'Mar', actualRevenue: 243000, targetRevenue: 245000, attainment: 99.1 }
    ],
    distribution: [
      { name: 'Surgical Guides (SG)', units: 2890, share: '46%', color: '#10b981' },
      { name: 'Treatment Planning (TP)', units: 1540, share: '30%', color: '#14b8a6' },
      { name: 'Model Work (MOD)', units: 780, share: '14%', color: '#0ea5e9' },
      { name: 'Restorations (PMMA)', units: 480, share: '10%', color: '#f59e0b' },
    ]
  },
  Q2: {
    name: 'Q2 (Apr - Jun)',
    attainment: 98.4,
    yoy: '+11.5%',
    actualRev: '$782,000',
    targetRev: '$795,000',
    sgUnits: '3,210',
    sgQuota: '3,250',
    sgPercent: 98.7,
    tpUnits: '1,720',
    tpQuota: '1,750',
    tpPercent: 98.2,
    turnaround: '2.1 Days',
    slaPass: '99.1%',
    chartData: [
      { month: 'Apr', actualRevenue: 254000, targetRevenue: 260000, attainment: 97.6 },
      { month: 'May', actualRevenue: 261000, targetRevenue: 265000, attainment: 98.4 },
      { month: 'Jun', actualRevenue: 267000, targetRevenue: 270000, attainment: 98.8 }
    ],
    distribution: [
      { name: 'Surgical Guides (SG)', units: 3210, share: '47%', color: '#10b981' },
      { name: 'Treatment Planning (TP)', units: 1720, share: '29%', color: '#14b8a6' },
      { name: 'Model Work (MOD)', units: 840, share: '14%', color: '#0ea5e9' },
      { name: 'Restorations (PMMA)', units: 530, share: '10%', color: '#f59e0b' },
    ]
  },
  Q3: {
    name: 'Q3 (Jul - Sep)',
    attainment: 95.2,
    yoy: '+6.4%',
    actualRev: '$745,000',
    targetRev: '$782,000',
    sgUnits: '3,050',
    sgQuota: '3,200',
    sgPercent: 95.3,
    tpUnits: '1,630',
    tpQuota: '1,700',
    tpPercent: 95.8,
    turnaround: '2.4 Days',
    slaPass: '98.4%',
    chartData: [
      { month: 'Jul', actualRevenue: 242000, targetRevenue: 258000, attainment: 93.7 },
      { month: 'Aug', actualRevenue: 248000, targetRevenue: 260000, attainment: 95.3 },
      { month: 'Sep', actualRevenue: 255000, targetRevenue: 264000, attainment: 96.5 }
    ],
    distribution: [
      { name: 'Surgical Guides (SG)', units: 3050, share: '45%', color: '#10b981' },
      { name: 'Treatment Planning (TP)', units: 1630, share: '31%', color: '#14b8a6' },
      { name: 'Model Work (MOD)', units: 790, share: '14%', color: '#0ea5e9' },
      { name: 'Restorations (PMMA)', units: 490, share: '10%', color: '#f59e0b' },
    ]
  },
  Q4: {
    name: 'Q4 (Oct - Dec)',
    attainment: 102.3,
    yoy: '+14.8%',
    actualRev: '$890,000',
    targetRev: '$870,000',
    sgUnits: '3,650',
    sgQuota: '3,500',
    sgPercent: 104.2,
    tpUnits: '1,980',
    tpQuota: '1,900',
    tpPercent: 104.2,
    turnaround: '1.9 Days',
    slaPass: '99.6%',
    chartData: [
      { month: 'Oct', actualRevenue: 288000, targetRevenue: 285000, attainment: 101.0 },
      { month: 'Nov', actualRevenue: 297000, targetRevenue: 290000, attainment: 102.4 },
      { month: 'Dec', actualRevenue: 305000, targetRevenue: 295000, attainment: 103.3 }
    ],
    distribution: [
      { name: 'Surgical Guides (SG)', units: 3650, share: '48%', color: '#10b981' },
      { name: 'Treatment Planning (TP)', units: 1980, share: '29%', color: '#14b8a6' },
      { name: 'Model Work (MOD)', units: 980, share: '13%', color: '#0ea5e9' },
      { name: 'Restorations (PMMA)', units: 620, share: '10%', color: '#f59e0b' },
    ]
  },
  ALL: {
    name: 'Full Fiscal Year 2026',
    attainment: 98.3,
    yoy: '+11.2%',
    actualRev: '$3,112,000',
    targetRev: '$3,165,000',
    sgUnits: '12,800',
    sgQuota: '12,950',
    sgPercent: 98.8,
    tpUnits: '6,870',
    tpQuota: '6,950',
    tpPercent: 98.8,
    turnaround: '2.1 Days',
    slaPass: '99.0%',
    chartData: [
      { month: 'Q1', actualRevenue: 695000, targetRevenue: 718000, attainment: 96.8 },
      { month: 'Q2', actualRevenue: 782000, targetRevenue: 795000, attainment: 98.4 },
      { month: 'Q3', actualRevenue: 745000, targetRevenue: 782000, attainment: 95.2 },
      { month: 'Q4', actualRevenue: 890000, targetRevenue: 870000, attainment: 102.3 }
    ],
    distribution: [
      { name: 'Surgical Guides (SG)', units: 12800, share: '47%', color: '#10b981' },
      { name: 'Treatment Planning (TP)', units: 6870, share: '30%', color: '#14b8a6' },
      { name: 'Model Work (MOD)', units: 3390, share: '13%', color: '#0ea5e9' },
      { name: 'Restorations (PMMA)', units: 2120, share: '10%', color: '#f59e0b' },
    ]
  }
};

const activeQuarterData = computed(() => QUARTER_DATA_MAP[selectedQuarter.value]);

const maxChartRevenue = computed(() => {
  const values = activeQuarterData.value.chartData.flatMap(c => [c.actualRevenue, c.targetRevenue]);
  return Math.max(...values) * 1.15;
});

// SVG Curve Calculation for Area Mode
const svgPoints = computed(() => {
  const data = activeQuarterData.value.chartData;
  const max = maxChartRevenue.value;
  return data.map((d, i) => {
    const x = 50 + (i * (500 / Math.max(1, data.length - 1)));
    const y = 170 - (d.actualRevenue / max) * 130;
    return { x, y };
  });
});

const svgLinePath = computed(() => {
  const pts = svgPoints.value;
  if (!pts.length) return '';
  return pts.reduce((acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`), '');
});

const svgAreaPath = computed(() => {
  const pts = svgPoints.value;
  if (!pts.length) return '';
  const first = pts[0];
  const last = pts[pts.length - 1];
  return `${svgLinePath.value} L ${last.x} 180 L ${first.x} 180 Z`;
});

const urgentOrders = computed(() => {
  return store.orders.filter(o => o.priority === 'Urgent');
});

const recentOrders = computed(() => {
  return [...store.orders].slice(0, 5);
});

const stageBreakdown = computed(() => {
  const total = store.orders.length || 1;
  const countOf = (status: string) => store.orders.filter(o => o.status === status).length;

  return [
    { name: 'CAD Design & Review', count: countOf('Design') + countOf('Review'), percent: Math.round(((countOf('Design') + countOf('Review')) / total) * 100), color: 'bg-emerald-500' },
    { name: 'Milling & 3D Printing', count: countOf('Production'), percent: Math.round((countOf('Production') / total) * 100), color: 'bg-teal-500' },
    { name: 'Quality Inspection', count: countOf('Quality Check'), percent: Math.round((countOf('Quality Check') / total) * 100), color: 'bg-sky-500' },
    { name: 'Ready / Delivered', count: countOf('Ready') + countOf('Completed'), percent: Math.round(((countOf('Ready') + countOf('Completed')) / total) * 100), color: 'bg-indigo-500' },
  ];
});

// Odontogram labels
const TOOTH_NAMES: Record<number, string> = {
  1: 'Upper Right 3rd Molar', 2: 'Upper Right 2nd Molar', 3: 'Upper Right 1st Molar',
  4: 'Upper Right 2nd Premolar', 5: 'Upper Right 1st Premolar', 6: 'Upper Right Canine',
  7: 'Upper Right Lateral Incisor', 8: 'Upper Right Central Incisor',
  9: 'Upper Left Central Incisor', 10: 'Upper Left Lateral Incisor', 11: 'Upper Left Canine',
  12: 'Upper Left 1st Premolar', 13: 'Upper Left 2nd Premolar', 14: 'Upper Left 1st Molar',
  15: 'Upper Left 2nd Molar', 16: 'Upper Left 3rd Molar',
  17: 'Lower Left 3rd Molar', 18: 'Lower Left 2nd Molar', 19: 'Lower Left 1st Molar',
  20: 'Lower Left 2nd Premolar', 21: 'Lower Left 1st Premolar', 22: 'Lower Left Canine',
  23: 'Lower Left Lateral Incisor', 24: 'Lower Left Central Incisor',
  25: 'Lower Right Central Incisor', 26: 'Lower Right Lateral Incisor', 27: 'Lower Right Canine',
  28: 'Lower Right 1st Premolar', 29: 'Lower Right 2nd Premolar', 30: 'Lower Right 1st Molar',
  31: 'Lower Right 2nd Molar', 32: 'Lower Right 3rd Molar'
};

const getToothName = (num: number) => TOOTH_NAMES[num] || `Tooth #${num}`;
const getToothQuadrant = (num: number) => {
  if (num >= 1 && num <= 8) return 'Upper Right (UR)';
  if (num >= 9 && num <= 16) return 'Upper Left (UL)';
  if (num >= 17 && num <= 24) return 'Lower Left (LL)';
  return 'Lower Right (LR)';
};
const getFdi = (num: number) => {
  if (num >= 1 && num <= 8) return `${10 + (9 - num)}`;
  if (num >= 9 && num <= 16) return `${20 + (num - 8)}`;
  if (num >= 17 && num <= 24) return `${30 + (25 - num)}`;
  return `${40 + (num - 24)}`;
};
</script>
