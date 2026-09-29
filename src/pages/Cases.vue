<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Clinical Cases
        </h1>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Folder-level diagnostic packages containing prescriptions, 3D scans, and treatment plans.
        </p>
      </div>

      <div class="w-full sm:w-72">
        <SearchInput v-model="searchQuery" placeholder="Search cases by title, patient, doctor..." />
      </div>
    </div>

    <!-- Cases List -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="c in filteredCases"
        :key="c.id"
        class="p-5 rounded-3xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/40 hover:shadow-md transition-all flex flex-col justify-between"
      >
        <div>
          <div class="flex items-center justify-between mb-3">
            <span class="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
              #{{ c.caseNumber }}
            </span>
            <PriorityBadge :priority="c.priority" />
          </div>

          <h3 class="font-bold text-base text-slate-900 dark:text-white mb-1">
            {{ c.title }}
          </h3>
          <p class="text-xs text-slate-500 mb-3 truncate">
            Patient: <strong class="text-slate-800 dark:text-slate-200">{{ c.patientName }}</strong>
          </p>

          <div class="py-2.5 px-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1 mb-4">
            <div class="text-slate-500">{{ c.doctorName }} • {{ c.clinicName }}</div>
            <div class="text-[11px] text-slate-400">{{ c.ordersCount }} Orders • {{ c.filesCount }} 3D Scan Files</div>
          </div>
        </div>

        <div class="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
          <StatusBadge :status="c.status" size="sm" />
          <router-link
            :to="`/cases/${c.id}`"
            class="font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>View Case</span>
            <ChevronRight class="w-3.5 h-3.5" />
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ChevronRight } from 'lucide-vue-next';
import { useDentalStore } from '@/stores/dental';
import StatusBadge from '@/components/ui/StatusBadge.vue';
import PriorityBadge from '@/components/ui/PriorityBadge.vue';
import SearchInput from '@/components/ui/SearchInput.vue';

const store = useDentalStore();
const searchQuery = ref('');

const filteredCases = computed(() => {
  if (!searchQuery.value.trim()) return store.cases;
  const q = searchQuery.value.toLowerCase();
  return store.cases.filter(c =>
    c.title.toLowerCase().includes(q) ||
    c.caseNumber.toLowerCase().includes(q) ||
    c.patientName.toLowerCase().includes(q) ||
    c.doctorName.toLowerCase().includes(q)
  );
});
</script>
