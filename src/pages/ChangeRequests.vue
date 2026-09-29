<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Change & Redesign Requests
        </h1>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Doctor feedback, margin adjustments, shade modifications, and occlusal revisions.
        </p>
      </div>
    </div>

    <!-- Requests List -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="cr in store.changeRequests"
        :key="cr.id"
        class="p-5 rounded-3xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4"
      >
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
              #{{ cr.requestNumber }} • Order #{{ cr.orderNumber }}
            </span>
            <PriorityBadge :priority="cr.priority" />
          </div>

          <h3 class="font-bold text-sm text-slate-900 dark:text-white mb-1">
            {{ cr.patientName }} - Redesign Request
          </h3>
          <p class="text-xs text-slate-500 mb-3">
            Requested by {{ cr.requester }} • {{ formatDate(cr.createdAt) }}
          </p>

          <p class="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 leading-relaxed font-mono">
            {{ cr.description }}
          </p>
        </div>

        <div class="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          <StatusBadge :status="cr.status" size="sm" />
          <div class="flex items-center gap-2">
            <button
              type="button"
              @click="approveCR(cr.id)"
              class="px-3 py-1 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all active:scale-95"
            >
              Approve
            </button>
            <button
              type="button"
              @click="rejectCR(cr.id)"
              class="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold transition-all"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDentalStore } from '@/stores/dental';
import StatusBadge from '@/components/ui/StatusBadge.vue';
import PriorityBadge from '@/components/ui/PriorityBadge.vue';
import { formatDate } from '@/utils/format';
import { sound } from '@/utils/sound';

const store = useDentalStore();

const approveCR = (id: string) => {
  sound.playSuccess();
  alert(`Change request #${id} approved. Returning case to CAD design stage.`);
};

const rejectCR = (id: string) => {
  sound.playClick();
  alert(`Change request #${id} rejected.`);
};
</script>
