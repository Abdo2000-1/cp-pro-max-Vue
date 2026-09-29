<template>
  <div v-if="order" class="space-y-6 max-w-5xl mx-auto">
    <!-- Header with Back Button -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div class="flex items-center gap-3">
        <router-link
          to="/orders"
          class="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft class="w-4 h-4" />
        </router-link>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Order #{{ order.orderNumber }}
            </h1>
            <StatusBadge :status="order.status" />
            <PriorityBadge :priority="order.priority" />
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Prescribed for {{ order.patientName }} by {{ order.doctorName }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2 self-stretch sm:self-auto">
        <router-link
          :to="`/orders/${order.id}/edit`"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl transition-colors"
        >
          <Edit3 class="w-3.5 h-3.5" />
          <span>Edit</span>
        </router-link>
        <button
          type="button"
          @click="advanceWorkflow"
          class="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 rounded-xl shadow-md shadow-emerald-500/25 active:scale-95 transition-all"
        >
          <CheckCircle2 class="w-4 h-4" />
          <span>Advance to {{ nextStatusLabel }}</span>
        </button>
      </div>
    </div>

    <!-- Workflow Stage Progress Tracker -->
    <div class="p-6 rounded-3xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
      <h3 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Laboratory Workflow Progression</h3>
      <div class="flex items-center justify-between min-w-[620px] gap-2">
        <div
          v-for="(st, idx) in WORKFLOW_STAGES"
          :key="st"
          class="flex-1 flex flex-col items-center gap-2 text-center relative"
        >
          <!-- Connecting Line -->
          <div
            v-if="idx < WORKFLOW_STAGES.length - 1"
            class="absolute top-4 left-1/2 w-full h-0.5"
            :class="isStagePassed(st) ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'"
          />

          <!-- Circle Indicator -->
          <div
            class="relative z-10 w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all"
            :class="[
              order.status === st
                ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/25 shadow-md shadow-emerald-500/30'
                : isStagePassed(st)
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
            ]"
          >
            <Check v-if="isStagePassed(st) && order.status !== st" class="w-4 h-4 stroke-[3]" />
            <span v-else>{{ idx + 1 }}</span>
          </div>

          <span
            :class="[
              'text-[11px] font-bold truncate max-w-[90px]',
              order.status === st ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'
            ]"
          >
            {{ st }}
          </span>
        </div>
      </div>
    </div>

    <!-- Main Grid: Teeth & Specs -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Left: Teeth Odontogram -->
      <div class="lg:col-span-2 space-y-6">
        <div class="p-6 rounded-3xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
            <div>
              <h3 class="font-bold text-base text-slate-900 dark:text-white">Odontogram & Prescription Map</h3>
              <p class="text-xs text-slate-500">Universal 1–32 mapped teeth units for this clinical case.</p>
            </div>
            <span class="text-xs font-mono font-bold px-2.5 py-1 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              {{ order.units }} Unit(s)
            </span>
          </div>

          <!-- Readonly TeethChart Component -->
          <TeethChart
            :model-value="[8, 9]"
            :readonly="true"
            :show-toolbar="false"
          />
        </div>

        <!-- Clinical Notes -->
        <div class="p-6 rounded-3xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h3 class="font-bold text-sm text-slate-900 dark:text-white">Prescription & Lab Instructions</h3>
          <p class="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 leading-relaxed font-mono">
            {{ order.notes || 'Full anatomical contour with light occlusal contact (12μm) and high gloss glaze finish. Verify margin fit on digital dye.' }}
          </p>
        </div>
      </div>

      <!-- Right: Technical Details Card -->
      <div class="space-y-6">
        <div class="p-6 rounded-3xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 class="font-bold text-sm text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800/80 pb-3">
            Case Parameters
          </h3>

          <div class="space-y-3 text-xs">
            <div class="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span class="text-slate-400">Restoration Type</span>
              <strong class="text-slate-900 dark:text-white">{{ order.restoration }}</strong>
            </div>

            <div class="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span class="text-slate-400">VITA Shade</span>
              <strong class="font-mono text-emerald-600 dark:text-emerald-400">{{ order.shade || 'A2' }}</strong>
            </div>

            <div class="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span class="text-slate-400">Arch</span>
              <strong class="text-slate-900 dark:text-white">{{ order.arch }}</strong>
            </div>

            <div class="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span class="text-slate-400">Scan Format</span>
              <strong class="text-slate-900 dark:text-white">{{ order.format }}</strong>
            </div>

            <div class="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span class="text-slate-400">Clinic</span>
              <strong class="text-slate-900 dark:text-white truncate max-w-[160px]">{{ order.clinicName }}</strong>
            </div>

            <div class="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span class="text-slate-400">Prescribing Doctor</span>
              <strong class="text-slate-900 dark:text-white">{{ order.doctorName }}</strong>
            </div>

            <div class="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
              <span class="text-slate-400">Due Date</span>
              <strong class="font-mono text-slate-900 dark:text-white">{{ formatDate(order.dueDate) }}</strong>
            </div>

            <div class="flex items-center justify-between py-1">
              <span class="text-slate-400">Fabrication Cost</span>
              <strong class="font-mono text-base font-black text-emerald-600 dark:text-emerald-400">
                {{ formatCurrency(order.amount) }}
              </strong>
            </div>
          </div>
        </div>

        <!-- Scan Center & Files -->
        <div class="p-6 rounded-3xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 text-xs">
          <h3 class="font-bold text-sm text-slate-900 dark:text-white">Associated Files</h3>
          <div class="space-y-2">
            <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div class="flex items-center gap-2 truncate">
                <FileText class="w-4 h-4 text-emerald-500 shrink-0" />
                <span class="font-mono truncate">Intraoral_Maxilla_Prep.stl</span>
              </div>
              <span class="text-[10px] text-slate-400">14 MB</span>
            </div>
            <div class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div class="flex items-center gap-2 truncate">
                <FileText class="w-4 h-4 text-emerald-500 shrink-0" />
                <span class="font-mono truncate">Antagonist_Bite.ply</span>
              </div>
              <span class="text-[10px] text-slate-400">8 MB</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>

  <div v-else class="py-20 text-center text-slate-400">
    Order not found.
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { ArrowLeft, Edit3, CheckCircle2, Check, FileText } from 'lucide-vue-next';
import { useDentalStore } from '@/stores/dental';
import type { OrderStatus } from '@/types';
import StatusBadge from '@/components/ui/StatusBadge.vue';
import PriorityBadge from '@/components/ui/PriorityBadge.vue';
import TeethChart from '@/components/ui/TeethChart.vue';
import { formatCurrency, formatDate } from '@/utils/format';
import { sound } from '@/utils/sound';

const route = useRoute();
const store = useDentalStore();

const orderId = computed(() => route.params.id as string);
const order = computed(() => store.orders.find(o => o.id === orderId.value));

const WORKFLOW_STAGES: OrderStatus[] = [
  'New', 'Review', 'Design', 'Production', 'Quality Check', 'Ready', 'Completed'
];

const nextStatusLabel = computed(() => {
  if (!order.value) return '';
  const idx = WORKFLOW_STAGES.indexOf(order.value.status);
  if (idx < WORKFLOW_STAGES.length - 1) {
    return WORKFLOW_STAGES[idx + 1];
  }
  return 'Completed';
});

const isStagePassed = (st: OrderStatus) => {
  if (!order.value) return false;
  const currentIdx = WORKFLOW_STAGES.indexOf(order.value.status);
  const targetIdx = WORKFLOW_STAGES.indexOf(st);
  return targetIdx <= currentIdx;
};

const advanceWorkflow = () => {
  if (!order.value) return;
  const idx = WORKFLOW_STAGES.indexOf(order.value.status);
  if (idx < WORKFLOW_STAGES.length - 1) {
    const nextSt = WORKFLOW_STAGES[idx + 1];
    store.updateOrderStatus(order.value.id, nextSt);
    sound.playSuccess();
  }
};
</script>
