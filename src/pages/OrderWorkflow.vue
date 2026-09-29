<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { 
  ArrowLeft, 
  Check, 
  ArrowRight,
  User
} from 'lucide-vue-next';
import Button from '@/components/ui/Button.vue';
import StatusBadge from '@/components/ui/StatusBadge.vue';
import PriorityBadge from '@/components/ui/PriorityBadge.vue';
import { formatDate } from '@/utils/format';
import { useDentalStore } from '@/stores/dental';
import type { OrderStatus } from '@/types';
import { sound } from '@/utils/sound';

interface WorkflowStageConfig {
  status: OrderStatus;
  label: string;
  owner: string;
  role: string;
  description: string;
  tasks: string[];
}

const STAGES: WorkflowStageConfig[] = [
  {
    status: 'New',
    label: 'Order Intake',
    owner: 'Sarah Jenkins',
    role: 'Intake Coordinator',
    description: 'Initial intake, digital impression verification, and order prescription routing.',
    tasks: ['Verify intraoral scan completeness', 'Confirm patient prescription and shade', 'Register billing voucher']
  },
  {
    status: 'Review',
    label: 'Technical Review',
    owner: 'Dr. Robert Miller',
    role: 'Lead Lab Technician',
    description: 'Validate preparation margins, occlusal clearance, and clinical feasibility.',
    tasks: ['Check preparation margin clearance (min 0.5mm)', 'Evaluate opposing arch articulation', 'Confirm material substrate compatibility']
  },
  {
    status: 'Design',
    label: 'CAD Modeling',
    owner: 'Thomas Anderson',
    role: 'Senior Dental Designer',
    description: '3D CAD digital crown design, emergence profile, and contact point calibration.',
    tasks: ['Generate anatomical 3D proposal in 3Shape/Exocad', 'Refine contact areas and marginal fit', 'Export CAM manufacturing files (.stl/.nc)']
  },
  {
    status: 'Production',
    label: 'CAM Fabrication',
    owner: 'Milling Department',
    role: 'Milling Specialist',
    description: 'Nesting, 5-axis wet/dry milling of zirconia disc, and high-temp sintering furnace cycle.',
    tasks: ['Nest design in multi-layer disc', 'Execute 5-axis precision milling cycle', 'Run 8-hour sintering program at 1530°C']
  },
  {
    status: 'Quality Check',
    label: 'Finishing & QC',
    owner: 'Elena Rostova',
    role: 'Master Ceramist',
    description: 'Glazing, characterization staining, microscopic marginal fit inspection on 3D printed die.',
    tasks: ['Manual surface texture characterization', 'Glaze firing and high-gloss polish', 'Microscopic marginal inspection (50x magnification)']
  },
  {
    status: 'Ready',
    label: 'Dispatch Packaging',
    owner: 'Logistics Desk',
    role: 'Fulfillment Lead',
    description: 'Disinfection, protective blister pack sealing, final invoice generation, and courier scheduling.',
    tasks: ['Ultrasonic disinfection and sealing', 'Print case certificate and delivery note', 'Attach courier dispatch label']
  },
  {
    status: 'Completed',
    label: 'Delivered & Closed',
    owner: 'Courier & Clinic',
    role: 'Delivery Confirmation',
    description: 'Handover to dental clinic, clinician acceptance sign-off, and transaction completion.',
    tasks: ['Clinic reception handover confirmed', 'Doctor clinical seating completed', 'Invoice marked for settlement']
  }
];

const route = useRoute();
const router = useRouter();
const dentalStore = useDentalStore();

const orderId = computed(() => route.params.orderId as string);
const order = computed(() => dentalStore.getOrderById(orderId.value));

const completedTasks = ref<Record<string, boolean>>({});

const currentStageIndex = computed(() => {
  if (!order.value) return 0;
  return STAGES.findIndex((s) => s.status === order.value!.status);
});

function handleSetStage(targetStatus: OrderStatus) {
  if (!order.value) return;
  dentalStore.updateOrderStatus(order.value.id, targetStatus);
  sound.pop();
  dentalStore.createNotification({
    type: 'workflow',
    title: `Stage Updated: ${order.value.orderNumber}`,
    message: `Prescription advanced to stage: ${targetStatus}`,
    relatedId: order.value.id
  });
}

function toggleTask(taskId: string) {
  sound.click();
  completedTasks.value[taskId] = !completedTasks.value[taskId];
}
</script>

<template>
  <div v-if="order" class="space-y-6 max-w-5xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div class="flex items-center gap-3">
        <Button variant="ghost" size="sm" @click="router.push(`/orders/${order.id}`)">
          <ArrowLeft class="w-4 h-4 mr-1" />
          Back
        </Button>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              Workflow Matrix: {{ order.orderNumber }}
            </h1>
            <StatusBadge :status="order.status" />
            <PriorityBadge :priority="order.priority" />
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {{ order.patientName }} • {{ order.restoration }} ({{ order.units }} unit) • Due {{ formatDate(order.dueDate) }}
          </p>
        </div>
      </div>

      <Button @click="router.push(`/orders/${order.id}/files`)" variant="outline" size="sm">
        Attached 3D Files →
      </Button>
    </div>

    <!-- Pipeline Visual Stepper Bar -->
    <div class="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 overflow-x-auto">
      <div class="flex items-center justify-between min-w-[650px] relative">
        <div class="absolute top-4 left-6 right-6 h-0.5 bg-gray-200 dark:bg-gray-700 -z-0" />
        <div 
          v-for="(st, idx) in STAGES" 
          :key="st.status"
          @click="handleSetStage(st.status)"
          class="flex flex-col items-center relative z-10 cursor-pointer group"
        >
          <div :class="[
            'w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-transform group-hover:scale-110',
            idx < currentStageIndex 
              ? 'bg-emerald-600 text-white shadow-sm'
              : idx === currentStageIndex
                ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 dark:ring-emerald-900/40 animate-pulse'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
          ]">
            <Check v-if="idx < currentStageIndex" class="w-4 h-4" />
            <span v-else>{{ idx + 1 }}</span>
          </div>
          <span :class="[
            'text-xs mt-2 font-medium',
            idx === currentStageIndex ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-gray-600 dark:text-gray-400'
          ]">
            {{ st.status }}
          </span>
        </div>
      </div>
    </div>

    <!-- Stage Detail Cards -->
    <div class="space-y-4">
      <div 
        v-for="(st, idx) in STAGES" 
        :key="st.status"
        :class="[
          'rounded-xl border transition-all p-5',
          idx === currentStageIndex 
            ? 'bg-white dark:bg-gray-800 border-emerald-500 shadow-md ring-1 ring-emerald-500/20'
            : idx < currentStageIndex
              ? 'bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700'
              : 'bg-gray-50 dark:bg-gray-900/40 border-gray-200 dark:border-gray-800 opacity-70'
        ]"
      >
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
          <div class="flex items-center gap-3">
            <div :class="[
              'w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold',
              idx < currentStageIndex 
                ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                : idx === currentStageIndex
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            ]">
              {{ idx + 1 }}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="font-semibold text-gray-900 dark:text-white text-base">
                  {{ st.label }} ({{ st.status }})
                </h3>
                <span 
                  v-if="idx === currentStageIndex" 
                  class="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 uppercase"
                >
                  Active Stage
                </span>
                <span 
                  v-if="idx < currentStageIndex" 
                  class="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 flex items-center gap-1"
                >
                  <Check class="w-3 h-3" /> Done
                </span>
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
                <User class="w-3.5 h-3.5" />
                <span>{{ st.owner }} • {{ st.role }}</span>
              </div>
            </div>
          </div>

          <div>
            <Button 
              v-if="idx !== currentStageIndex"
              size="sm" 
              :variant="idx < currentStageIndex ? 'ghost' : 'outline'"
              @click="handleSetStage(st.status)"
              class="text-xs gap-1"
            >
              <span>Move to this stage</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </Button>
            <Button 
              v-else-if="idx < STAGES.length - 1"
              size="sm" 
              @click="handleSetStage(STAGES[idx + 1].status)"
              class="gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
            >
              <span>Advance to {{ STAGES[idx + 1].status }}</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        <p class="text-xs text-gray-600 dark:text-gray-300 mb-3">
          {{ st.description }}
        </p>

        <!-- Checklist -->
        <div class="bg-gray-50 dark:bg-gray-900/60 rounded-lg p-3 border border-gray-100 dark:border-gray-800">
          <div class="text-[11px] font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">
            Quality Checklist & Requirements
          </div>
          <div class="space-y-1.5">
            <label 
              v-for="(task, tIdx) in st.tasks" 
              :key="tIdx"
              class="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300 cursor-pointer hover:text-gray-900 dark:hover:text-white"
            >
              <input
                type="checkbox"
                :checked="idx < currentStageIndex || Boolean(completedTasks[`${st.status}-${tIdx}`])"
                @change="toggleTask(`${st.status}-${tIdx}`)"
                class="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
              />
              <span :class="{ 'line-through text-gray-400 dark:text-gray-500': idx < currentStageIndex || Boolean(completedTasks[`${st.status}-${tIdx}`]) }">
                {{ task }}
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="p-8 text-center bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
    <h2 class="text-xl font-bold text-gray-900 dark:text-white">Order Not Found</h2>
    <Button class="mt-4" @click="router.push('/orders')">Return to Orders</Button>
  </div>
</template>
