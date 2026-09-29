<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Laboratory Analytics & Reports
        </h1>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Financial performance, fabrication volume, and clinical turnaround metrics.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          @click="exportCSV"
          class="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors shadow-2xs"
        >
          <Download class="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>
      </div>
    </div>

    <!-- KPI Summary Row -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="p-5 rounded-2xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 shadow-sm">
        <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Revenue</span>
        <div class="text-2xl font-black text-slate-900 dark:text-white font-mono">$128,450</div>
        <span class="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-1 inline-block">+18.5% YoY</span>
      </div>

      <div class="p-5 rounded-2xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 shadow-sm">
        <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Average Turnaround</span>
        <div class="text-2xl font-black text-slate-900 dark:text-white font-mono">3.4 Days</div>
        <span class="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-1 inline-block">-0.8d faster</span>
      </div>

      <div class="p-5 rounded-2xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 shadow-sm">
        <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Digital Remake Rate</span>
        <div class="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">0.6%</div>
        <span class="text-xs text-slate-400 font-medium mt-1 inline-block">Industry avg: 2.8%</span>
      </div>

      <div class="p-5 rounded-2xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 shadow-sm">
        <span class="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Active Partner Clinics</span>
        <div class="text-2xl font-black text-slate-900 dark:text-white font-mono">48 Clinics</div>
        <span class="text-xs text-teal-600 dark:text-teal-400 font-bold mt-1 inline-block">+6 this quarter</span>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <!-- Monthly Revenue Curve -->
      <div class="p-6 rounded-3xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-bold text-base text-slate-900 dark:text-white">Revenue Performance Curve</h3>
            <p class="text-xs text-slate-500">Monthly billing trends across all digital restoration types</p>
          </div>
          <span class="text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            USD ($)
          </span>
        </div>

        <!-- Pure Reactive SVG Smooth Curve -->
        <div
          class="relative h-60 w-full pt-4"
          @mousemove="sound.playChartTick()"
        >
          <svg viewBox="0 0 500 200" class="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="vueRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#42b883" stop-opacity="0.35" />
                <stop offset="100%" stop-color="#42b883" stop-opacity="0.0" />
              </linearGradient>
            </defs>

            <!-- Grid Lines -->
            <line x1="0" y1="40" x2="500" y2="40" stroke="currentColor" stroke-opacity="0.06" />
            <line x1="0" y1="90" x2="500" y2="90" stroke="currentColor" stroke-opacity="0.06" />
            <line x1="0" y1="140" x2="500" y2="140" stroke="currentColor" stroke-opacity="0.06" />
            <line x1="0" y1="190" x2="500" y2="190" stroke="currentColor" stroke-opacity="0.1" />

            <!-- Area Fill -->
            <path
              d="M 10 160 C 80 150, 140 120, 200 100 C 260 80, 320 95, 380 50 C 430 20, 480 30, 490 25 L 490 190 L 10 190 Z"
              fill="url(#vueRevenueGrad)"
            />

            <!-- Smooth Spline Line -->
            <path
              d="M 10 160 C 80 150, 140 120, 200 100 C 260 80, 320 95, 380 50 C 430 20, 480 30, 490 25"
              fill="none"
              stroke="#42b883"
              stroke-width="3.5"
              stroke-linecap="round"
            />

            <!-- Interactive Hotspots -->
            <circle cx="10" cy="160" r="4.5" fill="#42b883" class="hover:r-7 transition-all cursor-pointer" />
            <circle cx="200" cy="100" r="4.5" fill="#42b883" class="hover:r-7 transition-all cursor-pointer" />
            <circle cx="380" cy="50" r="4.5" fill="#42b883" class="hover:r-7 transition-all cursor-pointer" />
            <circle cx="490" cy="25" r="5.5" fill="#00dc82" stroke="#ffffff" stroke-width="2" class="hover:r-8 transition-all cursor-pointer shadow-lg" />
          </svg>

          <!-- X Axis Labels -->
          <div class="flex justify-between text-[11px] font-mono text-slate-400 pt-2 px-1">
            <span>Jan</span>
            <span>Mar</span>
            <span>May</span>
            <span>Jul</span>
            <span>Sep</span>
            <span>Nov</span>
          </div>
        </div>
      </div>

      <!-- Service Share Breakdown -->
      <div class="p-6 rounded-3xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
        <div>
          <h3 class="font-bold text-base text-slate-900 dark:text-white">Restoration Type Share</h3>
          <p class="text-xs text-slate-500 mb-6">Percentage distribution of prescribed clinical materials</p>

          <div class="space-y-3.5">
            <div
              v-for="item in serviceShares"
              :key="item.name"
              class="space-y-1.5"
              @mouseenter="sound.playChartTick()"
            >
              <div class="flex items-center justify-between text-xs">
                <span class="font-bold text-slate-800 dark:text-slate-200">{{ item.name }}</span>
                <span class="font-mono font-bold text-slate-900 dark:text-white">{{ item.percent }}% ({{ formatCurrency(item.revenue) }})</span>
              </div>
              <div class="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-700"
                  :class="item.barColor"
                  :style="{ width: `${item.percent}%` }"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <span>Target Margin Efficiency</span>
          <strong class="text-emerald-600 dark:text-emerald-400 font-mono">94.8%</strong>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { Download } from 'lucide-vue-next';
import { formatCurrency } from '@/utils/format';
import { sound } from '@/utils/sound';

const serviceShares = [
  { name: 'Monolithic Zirconia Crowns', percent: 45, revenue: 57800, barColor: 'bg-emerald-500' },
  { name: 'IPS e.max Lithium Disilicate', percent: 25, revenue: 32100, barColor: 'bg-teal-500' },
  { name: 'Full-Arch Surgical Guides', percent: 15, revenue: 19275, barColor: 'bg-indigo-500' },
  { name: 'Custom Titanium Abutments', percent: 10, revenue: 12845, barColor: 'bg-amber-500' },
  { name: 'Digital Occlusal Guards', percent: 5, revenue: 6430, barColor: 'bg-purple-500' },
];

const exportCSV = () => {
  sound.playSuccess();
  alert('Exporting clinical financial report as CSV...');
};
</script>
