<template>
  <div class="space-y-4 w-full min-w-0 pb-16 select-none">
    <div class="flex items-center justify-between bg-white dark:bg-[#0b101d] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
      <div>
        <h1 class="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
          <span>Interactive Dental Odontogram & Arch Charting</span>
        </h1>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Select teeth to diagnose, plan implants, crowns, and surgical restoration protocols
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button
          type="button"
          @click="selectedTeeth = [14, 19, 30]"
          class="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold hover:border-emerald-500 cursor-pointer"
        >
          Preset Case (14, 19, 30)
        </button>
      </div>
    </div>

    <TeethChart
      v-model="selectedTeeth"
      :show-toolbar="true"
      :show-presets="true"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import TeethChart from '@/components/ui/TeethChart.vue';

const selectedTeeth = ref<number[]>([19]);
</script>
