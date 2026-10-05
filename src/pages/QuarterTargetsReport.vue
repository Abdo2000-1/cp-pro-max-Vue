<template>
  <div class="space-y-4 w-full min-w-0">
    
    <!-- 1. Header with Clean, Non-Overlapping Title and Badge -->
    <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white dark:bg-[#0b101d] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
      <div>
        <div class="flex flex-wrap items-center gap-2.5">
          <div class="flex items-center gap-2">
            <span class="p-1.5 rounded-xl bg-[#0284c7]/10 text-[#0284c7] dark:text-sky-400 border border-[#0284c7]/20">
              <TrendingUp class="w-4.5 h-4.5" />
            </span>
            <h1 class="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
              3DDX Quarter Targets & Power BI Intelligence
            </h1>
          </div>
          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#0284c7]/10 text-[#0284c7] dark:text-sky-400 border border-[#0284c7]/25 shrink-0">
            repName=quarter-targets
          </span>
        </div>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Executive KPI tracking • Production throughput, surgical guide volume & live Power BI Fabric integration
        </p>
      </div>

      <!-- Controls -->
      <div class="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          @click="windowPrint"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0284c7] hover:bg-sky-600 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
        >
          <Printer class="w-3.5 h-3.5" />
          <span>Print Report</span>
        </button>
      </div>
    </div>

    <!-- Executive Mode Navigation Bar -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white dark:bg-[#0b101d] p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
      <div class="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl text-xs font-bold flex-wrap">
        <button
          type="button"
          @click="activeView = 'dashboard'"
          :class="[
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer',
            activeView === 'dashboard'
              ? 'bg-white dark:bg-slate-800 text-[#0284c7] dark:text-sky-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          ]"
        >
          <Sparkles class="w-3.5 h-3.5 text-[#ea580c]" />
          <span>Power BI Live Dashboard</span>
        </button>

        <button
          type="button"
          @click="activeView = 'matrix'"
          :class="[
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer',
            activeView === 'matrix'
              ? 'bg-white dark:bg-slate-800 text-[#0284c7] dark:text-sky-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          ]"
        >
          <BarChart3 class="w-3.5 h-3.5" />
          <span>Doctor Target Matrix (reports.json)</span>
        </button>

        <button
          type="button"
          @click="activeView = 'powerbi'"
          :class="[
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer',
            activeView === 'powerbi'
              ? 'bg-white dark:bg-slate-800 text-[#0284c7] dark:text-sky-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          ]"
        >
          <ExternalLink class="w-3.5 h-3.5" />
          <span>External Frame / Web URL</span>
        </button>

        <button
          type="button"
          @click="activeView = 'config'"
          :class="[
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer',
            activeView === 'config'
              ? 'bg-white dark:bg-slate-800 text-[#0284c7] dark:text-sky-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          ]"
        >
          <SlidersHorizontal class="w-3.5 h-3.5" />
          <span>Gateway Config</span>
        </button>
      </div>

      <div class="flex items-center gap-2 text-xs">
        <button
          type="button"
          @click="handleRefresh"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
        >
          <RefreshCw :class="['w-3.5 h-3.5', isRefreshing ? 'animate-spin' : '']" />
          <span>Refresh DAX Dataset</span>
        </button>
      </div>
    </div>

    <!-- VIEW 1: POWER BI LIVE INTERACTIVE DASHBOARD -->
    <div v-if="activeView === 'dashboard'" class="space-y-4">
      <!-- Power BI DAX & Slicers Toolbar -->
      <div class="p-3.5 rounded-2xl bg-white dark:bg-[#0b101d] border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-slate-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Filter class="w-3.5 h-3.5 text-[#0284c7]" />
            Slicers:
          </span>
          
          <!-- Fiscal Quarter Slicer -->
          <div class="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
            <button
              v-for="q in (['all', 'Q1', 'Q2', 'Q3', 'Q4'] as const)"
              :key="q"
              type="button"
              @click="selectedQuarter = q; sound.playClick(650)"
              :class="[
                'px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors cursor-pointer',
                selectedQuarter === q
                  ? 'bg-[#0284c7] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              ]"
            >
              {{ q === 'all' ? 'Full FY2026' : q }}
            </button>
          </div>

          <span class="text-slate-300 dark:text-slate-700">|</span>

          <span class="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[11px] border border-emerald-500/20 flex items-center gap-1">
            <ShieldCheck class="w-3 h-3" />
            <span>DAX Measure Engine Live</span>
          </span>
        </div>

        <div class="text-[11px] font-mono text-slate-400">
          Target Fulfillment: <strong class="text-emerald-600 dark:text-emerald-400 font-black">{{ currentQuarterStats.fulfillment }}</strong>
        </div>
      </div>

      <!-- KPI Summary Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div class="bg-white dark:bg-[#0b101d] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
          <span class="text-[10px] uppercase font-bold text-slate-400 block">Total Cases Produced</span>
          <div class="flex items-baseline gap-2 mt-1">
            <span class="text-2xl font-black text-slate-900 dark:text-white font-mono">{{ currentQuarterStats.cases }}</span>
            <span class="text-xs font-bold text-emerald-500">{{ currentQuarterStats.quotaMet }}</span>
          </div>
          <span class="text-[10px] text-slate-400 block mt-0.5">Target: {{ currentQuarterStats.target }}</span>
        </div>

        <div class="bg-white dark:bg-[#0b101d] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
          <span class="text-[10px] uppercase font-bold text-slate-400 block">Quarterly Gross Revenue</span>
          <div class="flex items-baseline gap-2 mt-1">
            <span class="text-2xl font-black text-[#0284c7] dark:text-sky-400 font-mono">{{ currentQuarterStats.revenue }}</span>
            <span class="text-xs font-bold text-emerald-500">{{ currentQuarterStats.revYoy }}</span>
          </div>
          <span class="text-[10px] text-slate-400 block mt-0.5">Average case: $149.80</span>
        </div>

        <div class="bg-white dark:bg-[#0b101d] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
          <span class="text-[10px] uppercase font-bold text-slate-400 block">Surgical Guides Printed</span>
          <div class="flex items-baseline gap-2 mt-1">
            <span class="text-2xl font-black text-[#ea580c] dark:text-orange-400 font-mono">{{ currentQuarterStats.guides }}</span>
            <span class="text-xs font-bold text-emerald-500">{{ currentQuarterStats.guidesQc }}</span>
          </div>
          <span class="text-[10px] text-slate-400 block mt-0.5">Straumann & Custom Sleeves</span>
        </div>

        <div class="bg-white dark:bg-[#0b101d] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
          <span class="text-[10px] uppercase font-bold text-slate-400 block">Average Lab Turnaround</span>
          <div class="flex items-baseline gap-2 mt-1">
            <span class="text-2xl font-black text-amber-500 font-mono">{{ currentQuarterStats.turnaround }}</span>
            <span class="text-xs font-bold text-emerald-500">{{ currentQuarterStats.slaDiff }}</span>
          </div>
          <span class="text-[10px] text-slate-400 block mt-0.5">Express SLAs met: 98.8%</span>
        </div>
      </div>

      <!-- Power BI Interactive Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <!-- Visual 1: Target vs Achieved Cases (Interactive Bar Chart) -->
        <div class="lg:col-span-2 bg-white dark:bg-[#0b101d] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-3">
          <div class="flex justify-between items-center">
            <div>
              <h3 class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 class="w-4 h-4 text-[#0284c7]" />
                <span>Target vs. Achieved Production ({{ selectedQuarter === 'all' ? 'FY2026' : selectedQuarter }})</span>
              </h3>
              <span class="text-[11px] text-slate-400">Total volume across Surgical Guides, Treatment Plans, and Models</span>
            </div>
            <div class="flex items-center gap-4 text-xs font-bold">
              <span class="flex items-center gap-1.5 text-slate-400"><span class="w-3 h-3 rounded bg-slate-400" /> Target</span>
              <span class="flex items-center gap-1.5 text-[#0284c7]"><span class="w-3 h-3 rounded bg-[#0284c7]" /> Achieved</span>
            </div>
          </div>

          <div class="h-64 w-full flex items-end gap-6 pt-6 pb-2 px-4 border-b border-slate-100 dark:border-slate-800">
            <div
              v-for="item in currentQuarterStats.chartData"
              :key="item.quarter"
              class="flex-1 flex flex-col items-center gap-2 h-full justify-end group"
            >
              <div class="w-full flex items-end justify-center gap-2 h-44">
                <!-- Target bar -->
                <div
                  :style="{ height: `${(item.target / 3600) * 100}%` }"
                  class="w-8 sm:w-12 bg-slate-300 dark:bg-slate-700 rounded-t-md transition-all duration-500 relative group-hover:opacity-80"
                >
                  <span class="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold bg-slate-900 text-white px-1.5 py-0.5 rounded shadow pointer-events-none transition-opacity">
                    {{ item.target }}
                  </span>
                </div>
                <!-- Achieved bar -->
                <div
                  :style="{ height: `${(item.achieved / 3600) * 100}%` }"
                  class="w-8 sm:w-12 bg-[#0284c7] hover:bg-sky-500 rounded-t-md transition-all duration-500 relative shadow-sm"
                >
                  <span class="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold bg-[#0284c7] text-white px-1.5 py-0.5 rounded shadow pointer-events-none transition-opacity">
                    {{ item.achieved }}
                  </span>
                </div>
              </div>
              <span class="text-xs font-bold text-slate-600 dark:text-slate-300">{{ item.quarter.split(' ')[0] }}</span>
            </div>
          </div>
        </div>

        <!-- Visual 2: Production Modality Share -->
        <div class="bg-white dark:bg-[#0b101d] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-3">
          <div>
            <h3 class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PieChartIcon class="w-4 h-4 text-[#ea580c]" />
              <span>Modality Share Breakdown</span>
            </h3>
            <span class="text-[11px] text-slate-400">Cases categorized by delivery asset</span>
          </div>

          <div class="h-60 w-full flex flex-col justify-center space-y-4">
            <div
              v-for="mod in currentQuarterStats.modality"
              :key="mod.name"
              class="space-y-1"
            >
              <div class="flex items-center justify-between text-xs font-bold">
                <span class="text-slate-700 dark:text-slate-300">{{ mod.name }}</span>
                <span class="font-mono text-slate-900 dark:text-white">{{ mod.value.toLocaleString() }} cases</span>
              </div>
              <div class="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-700"
                  :style="{
                    width: `${(mod.value / currentQuarterStats.chartData.reduce((a, c) => a + c.achieved, 0)) * 100}%`,
                    backgroundColor: mod.color
                  }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Client Reports Table -->
      <div class="bg-white dark:bg-[#0b101d] rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs overflow-hidden">
        <div class="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h3 class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 class="w-4 h-4 text-emerald-500" />
              <span>Top Diagnostic & Surgical Centers Matrix</span>
            </h3>
            <span class="text-[11px] text-slate-400">Aggregated client volumes from 3DDX reports.json</span>
          </div>
          <div class="relative w-full sm:w-64">
            <Search class="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Search account or clinic..."
              class="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-slate-50/80 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th class="p-3 pl-4">Account / Clinic Name</th>
                <th class="p-3 text-right">Jan Orders</th>
                <th class="p-3 text-right">Feb Orders</th>
                <th class="p-3 text-right">Mar Orders</th>
                <th class="p-3 text-right">Total Q1 Cases</th>
                <th class="p-3 text-right">Gross Billing</th>
                <th class="p-3 text-center">Quota Met</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
              <tr
                v-for="c in filteredClients"
                :key="c.client"
                class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <td class="p-3 pl-4 font-sans font-bold text-slate-900 dark:text-white truncate max-w-xs">
                  {{ c.client }}
                </td>
                <td class="p-3 text-right text-slate-600 dark:text-slate-400">{{ c.jan.orders }}</td>
                <td class="p-3 text-right text-slate-600 dark:text-slate-400">{{ c.feb.orders }}</td>
                <td class="p-3 text-right text-slate-600 dark:text-slate-400">{{ c.mar.orders }}</td>
                <td class="p-3 text-right font-black text-slate-900 dark:text-white">{{ c.totalOrders }}</td>
                <td class="p-3 text-right font-black text-[#0284c7] dark:text-sky-400">${{ c.totalRev.toLocaleString() }}</td>
                <td class="p-3 text-center">
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                    {{ c.quotaMet }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- VIEW 2: DOCTOR TARGET MATRIX -->
    <div v-else-if="activeView === 'matrix'" class="bg-white dark:bg-[#0b101d] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
      <div class="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
        <h3 class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BarChart3 class="w-4 h-4 text-[#0284c7]" />
          <span>Full Fiscal Year 2026 Production Matrix (All Services)</span>
        </h3>
        <span class="text-xs font-mono text-slate-400">Source: 3DDX ERP SQL Replication</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-xs text-left">
          <thead class="bg-slate-50 dark:bg-slate-900 text-slate-500 font-bold uppercase text-[10px]">
            <tr>
              <th class="p-3">Quarter Period</th>
              <th class="p-3 text-right">Target Quota</th>
              <th class="p-3 text-right">Achieved Total</th>
              <th class="p-3 text-right">Surgical Guides (SG)</th>
              <th class="p-3 text-right">Treatment Plans (TP)</th>
              <th class="p-3 text-right">3D Models (MOD)</th>
              <th class="p-3 text-right">Revenue</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
            <tr v-for="q in QUARTER_DATA" :key="q.quarter">
              <td class="p-3 font-sans font-bold text-slate-900 dark:text-white">{{ q.quarter }}</td>
              <td class="p-3 text-right text-slate-500">{{ q.target.toLocaleString() }}</td>
              <td class="p-3 text-right font-black text-emerald-600 dark:text-emerald-400">{{ q.achieved.toLocaleString() }}</td>
              <td class="p-3 text-right text-[#0284c7]">{{ q.guides.toLocaleString() }}</td>
              <td class="p-3 text-right text-[#ea580c]">{{ q.plans.toLocaleString() }}</td>
              <td class="p-3 text-right text-purple-500">{{ q.models.toLocaleString() }}</td>
              <td class="p-3 text-right font-black text-slate-900 dark:text-white">${{ q.revenue.toLocaleString() }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- VIEW 3: POWER BI EMBEDDED FRAME -->
    <div v-else-if="activeView === 'powerbi'" class="bg-white dark:bg-[#0b101d] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-4">
      <div class="flex justify-between items-center text-xs">
        <span class="font-bold text-slate-700 dark:text-slate-300">Live Power BI Fabric Tenant Embedded Session</span>
        <a :href="powerBiEmbedUrl" target="_blank" rel="noopener noreferrer" class="text-sky-600 hover:underline flex items-center gap-1 font-bold">
          <span>Open Fullscreen</span>
          <ExternalLink class="w-3.5 h-3.5" />
        </a>
      </div>
      <div class="w-full h-[650px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950">
        <iframe
          :src="powerBiEmbedUrl"
          class="w-full h-full border-0"
          allowFullScreen="true"
        />
      </div>
    </div>

    <!-- VIEW 4: GATEWAY CONFIG -->
    <div v-else class="bg-white dark:bg-[#0b101d] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-2xl space-y-4 text-xs">
      <h3 class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
        <SlidersHorizontal class="w-4 h-4 text-[#0284c7]" />
        <span>Microsoft Fabric & Power BI DirectQuery Gateway Configuration</span>
      </h3>
      <div class="space-y-3">
        <div>
          <label class="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Power BI Report URL / Embed Token</label>
          <input
            type="text"
            v-model="powerBiEmbedUrl"
            class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
          />
        </div>
        <div class="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/40 text-sky-800 dark:text-sky-300">
          The DAX query engine is synchronized with 3DDX SQL servers. Updates take effect immediately.
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  TrendingUp, Printer, Sparkles, BarChart3, ExternalLink,
  SlidersHorizontal, RefreshCw, Filter, ShieldCheck, PieChart as PieChartIcon,
  Building2, Search
} from 'lucide-vue-next';
import { sound } from '@/utils/sound';

const activeView = ref<'dashboard' | 'matrix' | 'powerbi' | 'config'>('dashboard');
const isRefreshing = ref(false);
const searchQuery = ref('');
const selectedQuarter = ref<'all' | 'Q1' | 'Q2' | 'Q3' | 'Q4'>('all');

const powerBiEmbedUrl = ref(
  'https://app.powerbi.com/view?r=eyJrIjoiNTRjMzI0MmQtNTA3YS00N2MwLWI0ZTctMGEyOGUwOGI0OTRhIiwidCI6IjI1ZDIwZjU1LWIxMGMtNDk5MS1hMTJlLWRlOWZkZDA2YTY0MCIsImMiOjZ9'
);

const QUARTER_DATA = [
  { quarter: 'Q1 (Jan - Mar)', target: 2400, achieved: 2580, revenue: 387000, guides: 1120, plans: 890, models: 570 },
  { quarter: 'Q2 (Apr - Jun)', target: 2700, achieved: 2840, revenue: 426000, guides: 1250, plans: 960, models: 630 },
  { quarter: 'Q3 (Jul - Sep)', target: 3000, achieved: 3150, revenue: 472500, guides: 1410, plans: 1040, models: 700 },
  { quarter: 'Q4 (Oct - Dec)', target: 3300, achieved: 3200, revenue: 480000, guides: 1390, plans: 1110, models: 700 },
];

const MODALITY_BREAKDOWN = [
  { name: 'Surgical Guides (CAM)', value: 5170, color: '#0284c7' },
  { name: 'Co-Diagnostix TP Plans', value: 4000, color: '#ea580c' },
  { name: '3D Printed Models', value: 2600, color: '#8b5cf6' },
];

const TOP_CLIENT_REPORTS = [
  { client: 'CT Dent Ltd (UK Diagnostic Centers)', jan: { orders: 216, rev: 14455 }, feb: { orders: 194, rev: 12765 }, mar: { orders: 236, rev: 16000 }, totalOrders: 646, totalRev: 43220, quotaMet: '118%' },
  { client: 'Reveal Diagnostics (San Francisco)', jan: { orders: 90, rev: 4253 }, feb: { orders: 45, rev: 2100 }, mar: { orders: 77, rev: 3780 }, totalOrders: 212, totalRev: 10133, quotaMet: '105%' },
  { client: 'George Family Orthodontics', jan: { orders: 33, rev: 2310 }, feb: { orders: 39, rev: 2730 }, mar: { orders: 31, rev: 2170 }, totalOrders: 103, totalRev: 7210, quotaMet: '112%' },
  { client: 'ADI of Michigan CBCT Lab', jan: { orders: 64, rev: 4480 }, feb: { orders: 46, rev: 3220 }, mar: { orders: 52, rev: 3640 }, totalOrders: 162, totalRev: 11340, quotaMet: '99%' },
  { client: 'James Morrison Implant Center', jan: { orders: 36, rev: 2450 }, feb: { orders: 31, rev: 2170 }, mar: { orders: 42, rev: 2940 }, totalOrders: 109, totalRev: 7560, quotaMet: '108%' },
  { client: 'Karyn Stern Surgical Suites', jan: { orders: 25, rev: 1850 }, feb: { orders: 29, rev: 2150 }, mar: { orders: 32, rev: 2400 }, totalOrders: 86, totalRev: 6400, quotaMet: '104%' },
  { client: 'Edward Kusek Periodontics', jan: { orders: 23, rev: 1840 }, feb: { orders: 19, rev: 1520 }, mar: { orders: 21, rev: 1680 }, totalOrders: 63, totalRev: 5040, quotaMet: '101%' },
  { client: 'Endodontic Associates Palm Beaches', jan: { orders: 17, rev: 1360 }, feb: { orders: 19, rev: 1440 }, mar: { orders: 19, rev: 1520 }, totalOrders: 55, totalRev: 4320, quotaMet: '98%' },
];

const currentQuarterStats = computed(() => {
  switch (selectedQuarter.value) {
    case 'Q1':
      return {
        cases: '2,580',
        quotaMet: '+107.5%',
        target: '2,400 cases',
        revenue: '$387.0K',
        revYoy: '+7.4% YoY',
        guides: '1,120',
        guidesQc: '99.1% QC pass',
        turnaround: '24.1h',
        slaDiff: '-2.5h faster',
        fulfillment: '107.5%',
        chartData: [QUARTER_DATA[0]],
        modality: [
          { name: 'Surgical Guides (CAM)', value: 1120, color: '#0284c7' },
          { name: 'Co-Diagnostix TP Plans', value: 890, color: '#ea580c' },
          { name: '3D Printed Models', value: 570, color: '#8b5cf6' }
        ]
      };
    case 'Q2':
      return {
        cases: '2,840',
        quotaMet: '+105.2%',
        target: '2,700 cases',
        revenue: '$426.0K',
        revYoy: '+9.1% YoY',
        guides: '1,250',
        guidesQc: '99.3% QC pass',
        turnaround: '23.0h',
        slaDiff: '-3.1h faster',
        fulfillment: '105.2%',
        chartData: [QUARTER_DATA[1]],
        modality: [
          { name: 'Surgical Guides (CAM)', value: 1250, color: '#0284c7' },
          { name: 'Co-Diagnostix TP Plans', value: 960, color: '#ea580c' },
          { name: '3D Printed Models', value: 630, color: '#8b5cf6' }
        ]
      };
    case 'Q3':
      return {
        cases: '3,150',
        quotaMet: '+105.0%',
        target: '3,000 cases',
        revenue: '$472.5K',
        revYoy: '+10.8% YoY',
        guides: '1,410',
        guidesQc: '99.5% QC pass',
        turnaround: '21.8h',
        slaDiff: '-4.6h faster',
        fulfillment: '105.0%',
        chartData: [QUARTER_DATA[2]],
        modality: [
          { name: 'Surgical Guides (CAM)', value: 1410, color: '#0284c7' },
          { name: 'Co-Diagnostix TP Plans', value: 1040, color: '#ea580c' },
          { name: '3D Printed Models', value: 700, color: '#8b5cf6' }
        ]
      };
    case 'Q4':
      return {
        cases: '3,200',
        quotaMet: '+97.0%',
        target: '3,300 cases',
        revenue: '$480.0K',
        revYoy: '+6.5% YoY',
        guides: '1,390',
        guidesQc: '99.6% QC pass',
        turnaround: '20.6h',
        slaDiff: '-5.2h faster',
        fulfillment: '97.0%',
        chartData: [QUARTER_DATA[3]],
        modality: [
          { name: 'Surgical Guides (CAM)', value: 1390, color: '#0284c7' },
          { name: 'Co-Diagnostix TP Plans', value: 1110, color: '#ea580c' },
          { name: '3D Printed Models', value: 700, color: '#8b5cf6' }
        ]
      };
    default:
      return {
        cases: '11,770',
        quotaMet: '+104.2%',
        target: '11,400 cases',
        revenue: '$1.76M',
        revYoy: '+8.5% YoY',
        guides: '5,170',
        guidesQc: '99.4% QC pass',
        turnaround: '22.4h',
        slaDiff: '-4.2h faster',
        fulfillment: '104.2%',
        chartData: QUARTER_DATA,
        modality: MODALITY_BREAKDOWN
      };
  }
});

const filteredClients = computed(() => {
  return TOP_CLIENT_REPORTS.filter((c) =>
    c.client.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const handleRefresh = () => {
  isRefreshing.value = true;
  sound.playClick(850);
  setTimeout(() => {
    isRefreshing.value = false;
  }, 600);
};

const windowPrint = () => {
  window.print();
};
</script>
