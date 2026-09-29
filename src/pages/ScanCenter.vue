<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Digital Scan Center
        </h1>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Monitor intraoral 3D scanners, CBCT scanners, and live digital ingestion pipelines.
        </p>
      </div>
    </div>

    <!-- Scan Centers Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="sc in store.scanCenters"
        :key="sc.id"
        class="p-5 rounded-3xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <span class="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ScanLine class="w-5 h-5" />
            </span>
            <div>
              <h3 class="font-bold text-sm text-slate-900 dark:text-white">{{ sc.name }}</h3>
              <span class="text-[11px] text-slate-400">{{ sc.location }}</span>
            </div>
          </div>
          <StatusBadge :status="sc.status" size="sm" />
        </div>

        <div class="grid grid-cols-2 gap-3 py-3 border-y border-slate-100 dark:border-slate-800 text-xs">
          <div>
            <span class="text-slate-400 text-[10px] uppercase font-bold block">Operator</span>
            <strong class="text-slate-900 dark:text-white">{{ sc.operator }}</strong>
          </div>
          <div>
            <span class="text-slate-400 text-[10px] uppercase font-bold block">Active Devices</span>
            <strong class="text-slate-900 dark:text-white font-mono">{{ sc.devices }} Scanners</strong>
          </div>
          <div>
            <span class="text-slate-400 text-[10px] uppercase font-bold block">Queue Ingestion</span>
            <strong class="text-emerald-600 dark:text-emerald-400 font-mono">{{ sc.activeOrders }} In Flight</strong>
          </div>
          <div>
            <span class="text-slate-400 text-[10px] uppercase font-bold block">Completed Today</span>
            <strong class="text-teal-600 dark:text-teal-400 font-mono">{{ sc.completedToday }} Scans</strong>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ScanLine } from 'lucide-vue-next';
import { useDentalStore } from '@/stores/dental';
import StatusBadge from '@/components/ui/StatusBadge.vue';

const store = useDentalStore();
</script>
