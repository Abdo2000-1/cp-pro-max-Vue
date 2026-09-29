<template>
  <div v-if="caseItem" class="space-y-6 max-w-4xl mx-auto">
    <div class="flex items-center gap-3">
      <router-link
        to="/cases"
        class="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition-colors"
      >
        <ArrowLeft class="w-4 h-4" />
      </router-link>
      <div>
        <div class="flex items-center gap-2">
          <h1 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Case #{{ caseItem.caseNumber }}
          </h1>
          <StatusBadge :status="caseItem.status" />
          <PriorityBadge :priority="caseItem.priority" />
        </div>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {{ caseItem.title }} • {{ caseItem.patientName }}
        </p>
      </div>
    </div>

    <!-- Case Card -->
    <div class="p-6 rounded-3xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <h3 class="font-bold text-base text-slate-900 dark:text-white">Case Overview</h3>
      <p class="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 leading-relaxed font-mono">
        {{ caseItem.notes || 'Full diagnostic workup requested with aesthetic smile simulation and CAD surgical guide fabrication.' }}
      </p>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 py-3 border-t border-slate-100 dark:border-slate-800 text-xs">
        <div>
          <span class="text-slate-400 block text-[10px] uppercase font-bold">Doctor</span>
          <strong class="text-slate-900 dark:text-white">{{ caseItem.doctorName }}</strong>
        </div>
        <div>
          <span class="text-slate-400 block text-[10px] uppercase font-bold">Clinic</span>
          <strong class="text-slate-900 dark:text-white truncate block">{{ caseItem.clinicName }}</strong>
        </div>
        <div>
          <span class="text-slate-400 block text-[10px] uppercase font-bold">Created</span>
          <strong class="text-slate-900 dark:text-white font-mono">{{ formatDate(caseItem.createdAt) }}</strong>
        </div>
        <div>
          <span class="text-slate-400 block text-[10px] uppercase font-bold">Orders Linked</span>
          <strong class="text-emerald-600 dark:text-emerald-400 font-mono">{{ caseItem.ordersCount }}</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { ArrowLeft } from 'lucide-vue-next';
import { useDentalStore } from '@/stores/dental';
import StatusBadge from '@/components/ui/StatusBadge.vue';
import PriorityBadge from '@/components/ui/PriorityBadge.vue';
import { formatDate } from '@/utils/format';

const route = useRoute();
const store = useDentalStore();
const caseId = computed(() => route.params.id as string);
const caseItem = computed(() => store.cases.find(c => c.id === caseId.value));
</script>
