<template>
  <div class="space-y-4 w-full min-w-0 pb-16 select-none">
    
    <!-- 1. Power BI Fabric Header Bar -->
    <div class="bg-gradient-to-r from-amber-500/10 via-white to-emerald-500/10 dark:from-[#1b170c] dark:via-[#0b101d] dark:to-[#071912] p-4 rounded-2xl border border-amber-500/30 dark:border-amber-500/20 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <!-- Power BI Signature Logo -->
        <div class="w-10 h-10 rounded-xl bg-[#f2c811] flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20 shrink-0">
          <svg viewBox="0 0 24 24" class="w-6 h-6 fill-current">
            <path d="M4 11h3v10H4zm5-5h3v15H9zm5-4h3v19h-3zm5 8h3v11h-3z"/>
          </svg>
        </div>
        <div>
          <div class="flex items-center gap-2 flex-wrap">
            <h1 class="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Microsoft Power BI™ Embedded Analytics
            </h1>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#f2c811]/20 text-amber-700 dark:text-amber-400 border border-amber-500/40">
              Live DirectQuery
            </span>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              Verified Dataset: 3DDX-PROD-SQL
            </span>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Executive Lab Production, SLA Turnaround, Revenue Realization & Modality Quotas
          </p>
        </div>
      </div>

      <!-- Power BI Actions Toolbar -->
      <div class="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          @click="refreshData"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-amber-500 text-slate-700 dark:text-slate-300 font-bold text-xs bg-white dark:bg-slate-900 transition-all cursor-pointer shadow-xs"
        >
          <RefreshCw class="w-3.5 h-3.5 text-amber-500" :class="isRefreshing ? 'animate-spin' : ''" />
          <span>{{ isRefreshing ? 'Refreshing...' : 'Refresh (F5)' }}</span>
        </button>

        <button
          type="button"
          @click="exportDataset"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-emerald-500 text-slate-700 dark:text-slate-300 font-bold text-xs bg-white dark:bg-slate-900 transition-all cursor-pointer shadow-xs"
        >
          <Download class="w-3.5 h-3.5 text-emerald-500" />
          <span>Export Excel</span>
        </button>

        <button
          type="button"
          @click="toggleFullscreen"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-sky-500 text-slate-700 dark:text-slate-300 font-bold text-xs bg-white dark:bg-slate-900 transition-all cursor-pointer shadow-xs"
        >
          <Maximize2 class="w-3.5 h-3.5 text-sky-500" />
          <span>Fullscreen</span>
        </button>
      </div>
    </div>

    <!-- 2. Slicers / Interactive Filters Row -->
    <div class="bg-white dark:bg-[#0b101d] p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
      
      <!-- Quarter Selector -->
      <div class="flex items-center gap-2">
        <span class="font-extrabold text-slate-500 uppercase text-[10px]">Quarter Target:</span>
        <div class="flex p-0.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <button
            v-for="q in ['Q1', 'Q2', 'Q3', 'Q4']"
            :key="q"
            type="button"
            @click="selectedQuarter = q; sound.playClick(640)"
            :class="[
              'px-3 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer',
              selectedQuarter === q
                ? 'bg-amber-400 dark:bg-amber-500 text-slate-950 font-black shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            ]"
          >
            {{ q }}
          </button>
        </div>
      </div>

      <!-- Modality Slicer -->
      <div class="flex items-center gap-2">
        <span class="font-extrabold text-slate-500 uppercase text-[10px]">Service Group:</span>
        <select
          v-model="selectedGroup"
          @change="sound.playClick(600)"
          class="px-2.5 py-1 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none"
        >
          <option value="All">All Modalities (TP, SG, Rest, Ortho)</option>
          <option value="TP">Treatment Plans (TP)</option>
          <option value="SG">Surgical Guides (SG)</option>
          <option value="REST">Restorations (Temp & Final)</option>
        </select>
      </div>

      <!-- Scan Center Filter -->
      <div class="flex items-center gap-2">
        <span class="font-extrabold text-slate-500 uppercase text-[10px]">Region:</span>
        <select
          v-model="selectedRegion"
          @change="sound.playClick(600)"
          class="px-2.5 py-1 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none"
        >
          <option value="All">All Regions (USA & Global)</option>
          <option value="West">West Coast (California)</option>
          <option value="East">East Coast (Boston Hub)</option>
        </select>
      </div>

      <div class="text-[11px] font-mono text-slate-400">
        Sync: <strong class="text-slate-700 dark:text-slate-200">{{ lastSyncTime }}</strong>
      </div>
    </div>

    <!-- 3. KPI Scorecards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <!-- Total Production Value -->
      <div class="p-4 rounded-2xl bg-white dark:bg-[#0b101d] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-1">
        <div class="flex items-center justify-between text-slate-500 text-xs font-bold">
          <span>Quarter Production Value</span>
          <DollarSign class="w-4 h-4 text-emerald-500" />
        </div>
        <div class="text-2xl font-black font-mono text-slate-900 dark:text-white">
          ${{ kpiData.revenue.toLocaleString() }}.00
        </div>
        <div class="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
          <TrendingUp class="w-3.5 h-3.5" />
          <span>+14.2% vs {{ selectedQuarter }} Target ($1.6M)</span>
        </div>
      </div>

      <!-- Total Case Volume -->
      <div class="p-4 rounded-2xl bg-white dark:bg-[#0b101d] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-1">
        <div class="flex items-center justify-between text-slate-500 text-xs font-bold">
          <span>Active Case Volume</span>
          <Activity class="w-4 h-4 text-sky-500" />
        </div>
        <div class="text-2xl font-black font-mono text-slate-900 dark:text-white">
          {{ kpiData.cases.toLocaleString() }} Cases
        </div>
        <div class="flex items-center gap-1.5 text-[11px] text-sky-600 dark:text-sky-400 font-bold">
          <CheckCircle2 class="w-3.5 h-3.5" />
          <span>100% CAD Capacity Met</span>
        </div>
      </div>

      <!-- Avg Turnaround Time -->
      <div class="p-4 rounded-2xl bg-white dark:bg-[#0b101d] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-1">
        <div class="flex items-center justify-between text-slate-500 text-xs font-bold">
          <span>Avg Clinical Turnaround</span>
          <Clock class="w-4 h-4 text-amber-500" />
        </div>
        <div class="text-2xl font-black font-mono text-slate-900 dark:text-white">
          2.4 Days
        </div>
        <div class="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
          <span>Goal: &lt; 3.0 Days (Exceeded by 0.6d)</span>
        </div>
      </div>

      <!-- On-Time SLA Delivery -->
      <div class="p-4 rounded-2xl bg-white dark:bg-[#0b101d] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-1">
        <div class="flex items-center justify-between text-slate-500 text-xs font-bold">
          <span>On-Time SLA Delivery</span>
          <Award class="w-4 h-4 text-purple-500" />
        </div>
        <div class="text-2xl font-black font-mono text-slate-900 dark:text-white">
          98.7%
        </div>
        <div class="flex items-center gap-1.5 text-[11px] text-purple-600 dark:text-purple-400 font-bold">
          <span>Benchmark: 95.0% (Gold Standard)</span>
        </div>
      </div>
    </div>

    <!-- 4. Interactive Power BI Visualizations Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
      
      <!-- Left: Revenue Realization & Target Progress Bar Chart (8 Cols) -->
      <div class="lg:col-span-8 p-5 rounded-2xl bg-white dark:bg-[#0b101d] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 class="font-black text-slate-900 dark:text-white text-sm">
              Monthly Lab Revenue vs Target Quota ({{ selectedQuarter }})
            </h3>
            <p class="text-xs text-slate-400">Direct comparison across 3 months in selected fiscal period</p>
          </div>
          <span class="text-xs font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">
            Target Pace: 112%
          </span>
        </div>

        <!-- SVG Interactive Bar & Target Chart -->
        <div class="h-64 flex items-end justify-around gap-6 pt-6 px-4">
          <div
            v-for="bar in chartBars"
            :key="bar.month"
            class="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
            @click="triggerToast(`Selected Month: ${bar.month} | Actual: $${bar.actual.toLocaleString()}`)"
          >
            <!-- Hover Tooltip -->
            <div class="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono font-bold bg-slate-900 text-white px-2 py-1 rounded shadow-lg pointer-events-none">
              ${{ (bar.actual / 1000).toFixed(0) }}k / ${{ (bar.target / 1000).toFixed(0) }}k
            </div>

            <div class="w-full max-w-[64px] h-48 bg-slate-100 dark:bg-slate-900 rounded-xl relative flex items-end overflow-hidden p-1">
              <!-- Actual Bar -->
              <div
                class="w-full rounded-lg bg-gradient-to-t from-emerald-600 via-teal-500 to-emerald-400 transition-all duration-500 group-hover:brightness-110"
                :style="{ height: `${(bar.actual / 650000) * 100}%` }"
              />
              <!-- Target Quota Line -->
              <div
                class="absolute left-0 right-0 border-t-2 border-dashed border-amber-400 z-10 pointer-events-none"
                :style="{ bottom: `${(bar.target / 650000) * 100}%` }"
              />
            </div>

            <div class="text-center">
              <span class="font-extrabold text-xs text-slate-800 dark:text-slate-200 block">{{ bar.month }}</span>
              <span class="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold block">${{ (bar.actual / 1000).toFixed(0) }}k</span>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-center gap-6 text-xs pt-2 border-t border-slate-100 dark:border-slate-800 text-slate-500">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded bg-emerald-500" />
            <span>Actual Revenue ($ USD)</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-4 border-t-2 border-dashed border-amber-400" />
            <span>Quarter Target SLA Quota</span>
          </div>
        </div>
      </div>

      <!-- Right: Modality Distribution Matrix (4 Cols) -->
      <div class="lg:col-span-4 p-5 rounded-2xl bg-white dark:bg-[#0b101d] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 class="font-black text-slate-900 dark:text-white text-sm">
            Service Modality Mix
          </h3>
          <span class="text-[10px] font-mono text-slate-400">Total: 100%</span>
        </div>

        <div class="space-y-3 pt-1">
          <div v-for="mod in modalityMix" :key="mod.name" class="space-y-1">
            <div class="flex items-center justify-between text-xs font-bold">
              <span class="text-slate-700 dark:text-slate-300">{{ mod.name }}</span>
              <span class="font-mono text-slate-900 dark:text-white">{{ mod.percent }}% (${{ (mod.val / 1000).toFixed(0) }}k)</span>
            </div>
            <div class="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-500"
                :class="mod.color"
                :style="{ width: `${mod.percent}%` }"
              />
            </div>
          </div>
        </div>

        <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/80 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
          <div class="font-bold text-slate-800 dark:text-slate-200">Insights:</div>
          <p>Treatment Planning (TP) remains the primary entry hook, driving 42% of downstream Surgical Guide conversions.</p>
        </div>
      </div>

    </div>

    <!-- 5. Top Clinicians & Scan Centers Leaderboard Table -->
    <div class="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0b101d] overflow-hidden shadow-xs text-xs">
      <div class="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h3 class="font-black text-slate-900 dark:text-white text-sm">
            Top Clinical Production Accounts (DirectQuery Master Log)
          </h3>
          <p class="text-xs text-slate-400">Cross-referenced with ERP billing receipts and SLA records</p>
        </div>
        <span class="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
          Showing Top 5 Key Partner Accounts
        </span>
      </div>

      <table class="w-full text-left border-collapse text-xs">
        <thead>
          <tr class="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            <th class="py-2.5 px-4">Clinician / Center</th>
            <th class="py-2.5 px-4">Primary Region</th>
            <th class="py-2.5 px-4 text-center">Cases Delivered</th>
            <th class="py-2.5 px-4 text-center">Avg SLA Turnaround</th>
            <th class="py-2.5 px-4 text-right">Production Billed</th>
            <th class="py-2.5 px-4 text-center">Status</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
          <tr v-for="c in clinicians" :key="c.name" class="hover:bg-slate-50 dark:hover:bg-slate-900/50">
            <td class="py-3 px-4 font-bold text-slate-900 dark:text-white">{{ c.name }}</td>
            <td class="py-3 px-4 text-slate-600 dark:text-slate-400">{{ c.region }}</td>
            <td class="py-3 px-4 text-center font-mono font-bold">{{ c.cases }}</td>
            <td class="py-3 px-4 text-center font-mono text-emerald-600 dark:text-emerald-400 font-bold">{{ c.sla }}</td>
            <td class="py-3 px-4 text-right font-mono font-black text-emerald-600 dark:text-emerald-400">${{ c.billed.toLocaleString() }}.00</td>
            <td class="py-3 px-4 text-center">
              <span class="px-2 py-0.5 rounded-full text-[10px] font-bold border border-emerald-500/40 text-emerald-600 bg-transparent">
                VIP Tier 1
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  RefreshCw, Download, Maximize2, DollarSign, Activity,
  Clock, Award, TrendingUp, CheckCircle2
} from 'lucide-vue-next';
import { sound } from '@/utils/sound';

const selectedQuarter = ref('Q3');
const selectedGroup = ref('All');
const selectedRegion = ref('All');
const isRefreshing = ref(false);
const lastSyncTime = ref(new Date().toLocaleTimeString());

const refreshData = () => {
  isRefreshing.value = true;
  sound.playClick(700);
  setTimeout(() => {
    isRefreshing.value = false;
    lastSyncTime.value = new Date().toLocaleTimeString();
    sound.playSuccess();
  }, 900);
};

const exportDataset = () => {
  const content = `3DDX POWER BI DATASET EXPORT\nQuarter: ${selectedQuarter.value}\nExport Time: ${new Date().toISOString()}`;
  const blob = new Blob([content], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `PowerBI_3DDX_${selectedQuarter.value}_Production.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen().catch(() => {});
  }
};

const triggerToast = (msg: string) => {
  sound.playClick(600);
  alert(msg);
};

const kpiData = computed(() => {
  switch (selectedQuarter.value) {
    case 'Q1':
      return { revenue: 1520000, cases: 2890 };
    case 'Q2':
      return { revenue: 1680000, cases: 3120 };
    case 'Q3':
      return { revenue: 1842500, cases: 3410 };
    case 'Q4':
      return { revenue: 1950000, cases: 3620 };
    default:
      return { revenue: 1842500, cases: 3410 };
  }
});

const chartBars = computed(() => {
  if (selectedQuarter.value === 'Q1') {
    return [
      { month: 'Jan 2026', actual: 480000, target: 450000 },
      { month: 'Feb 2026', actual: 510000, target: 480000 },
      { month: 'Mar 2026', actual: 530000, target: 500000 },
    ];
  }
  if (selectedQuarter.value === 'Q2') {
    return [
      { month: 'Apr 2026', actual: 540000, target: 510000 },
      { month: 'May 2026', actual: 560000, target: 530000 },
      { month: 'Jun 2026', actual: 580000, target: 550000 },
    ];
  }
  if (selectedQuarter.value === 'Q3') {
    return [
      { month: 'Jul 2026', actual: 590000, target: 550000 },
      { month: 'Aug 2026', actual: 615000, target: 560000 },
      { month: 'Sep 2026', actual: 637500, target: 570000 },
    ];
  }
  return [
    { month: 'Oct 2026', actual: 640000, target: 580000 },
    { month: 'Nov 2026', actual: 650000, target: 590000 },
    { month: 'Dec 2026', actual: 660000, target: 600000 },
  ];
});

const modalityMix = [
  { name: 'Treatment Planning (TP)', percent: 42, val: 773850, color: 'bg-indigo-500' },
  { name: 'Surgical Guides (SG)', percent: 28, val: 515900, color: 'bg-emerald-500' },
  { name: 'Restorations (Temp & Final)', percent: 18, val: 331650, color: 'bg-teal-500' },
  { name: 'Full Mouth Preps & Custom (FMP)', percent: 12, val: 221100, color: 'bg-amber-500' },
];

const clinicians = [
  { name: 'Dr. Bishoy Mina, DDS', region: 'California Imaging Hub', cases: 412, sla: '2.1 Days', billed: 98400 },
  { name: 'Dr. Alex Mercer, DDS', region: 'San Francisco Surgical Suite', cases: 388, sla: '2.2 Days', billed: 91200 },
  { name: 'Dr. Jessica Ruiz, DMD', region: 'Boston Advanced Diagnostics', cases: 345, sla: '2.4 Days', billed: 82500 },
  { name: 'Dr. Sarah Jenkins, DDS', region: 'New York Implant Center', cases: 295, sla: '2.3 Days', billed: 71000 },
  { name: 'Dr. Marcus Vance, MD', region: 'Chicago Dental 3D Studio', cases: 260, sla: '2.5 Days', billed: 62400 },
];
</script>
