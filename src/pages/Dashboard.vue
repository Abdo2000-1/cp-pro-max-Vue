<template>
  <div class="space-y-6">
    <!-- Top Welcome Banner -->
    <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#18222d] via-[#1f2d3d] to-[#0f1726] p-6 sm:p-8 text-white border border-slate-800 shadow-xl shadow-emerald-950/10">
      <div class="absolute -right-8 -bottom-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div class="absolute right-12 top-6 opacity-10 pointer-events-none hidden lg:block">
        <svg viewBox="0 0 261.76 226.69" class="w-44 h-44">
          <path d="M 161.096 0 L 130.88 52.338 L 100.664 0 L 0 0 L 130.88 226.69 L 261.76 0 Z" fill="#42b883" />
          <path d="M 161.096 0 L 130.88 52.338 L 100.664 0 L 52.246 0 L 130.88 136.196 L 209.514 0 Z" fill="#ffffff" />
        </svg>
      </div>

      <div class="relative z-10 max-w-2xl">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30 mb-3">
          <Sparkles class="w-3.5 h-3.5" />
          <span>Vue 3.5 Engine Active</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
          Welcome back, {{ store.profile.firstName }}!
        </h1>
        <p class="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
          DentaVue digital lab operations are active. You have <strong class="text-emerald-400">{{ store.dashboardStats.inProgress }} cases in production</strong> and <strong class="text-amber-400">{{ store.dashboardStats.urgentCount }} urgent cases</strong> requiring verification today.
        </p>

        <div class="flex items-center gap-3 flex-wrap">
          <router-link
            to="/orders/create"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all active:scale-95"
          >
            <Plus class="w-4 h-4 stroke-[2.5]" />
            <span>Create New Case</span>
          </router-link>
          <router-link
            to="/workflow-board"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all"
          >
            <GitBranch class="w-4 h-4" />
            <span>Workflow Kanban</span>
          </router-link>
          <router-link
            to="/reports"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all"
          >
            <BarChart3 class="w-4 h-4" />
            <span>View Analytics</span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Metric Stat Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Orders -->
      <div class="p-5 rounded-2xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/40 transition-colors">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Orders</span>
          <span class="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Package class="w-5 h-5" />
          </span>
        </div>
        <div class="text-2xl font-black text-slate-900 dark:text-white mb-1">
          {{ store.dashboardStats.totalOrders }}
        </div>
        <div class="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
          <TrendingUp class="w-3.5 h-3.5" />
          <span>+14.2% from last month</span>
        </div>
      </div>

      <!-- In Progress -->
      <div class="p-5 rounded-2xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 shadow-sm hover:border-teal-500/40 transition-colors">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">In CAD Production</span>
          <span class="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
            <Activity class="w-5 h-5" />
          </span>
        </div>
        <div class="text-2xl font-black text-slate-900 dark:text-white mb-1">
          {{ store.dashboardStats.inProgress }}
        </div>
        <div class="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <Clock class="w-3.5 h-3.5" />
          <span>Avg. turnaround {{ store.dashboardStats.avgTurnaroundDays }} days</span>
        </div>
      </div>

      <!-- Urgent Priority -->
      <div class="p-5 rounded-2xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 shadow-sm hover:border-rose-500/40 transition-colors">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Urgent Attention</span>
          <span class="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <AlertTriangle class="w-5 h-5" />
          </span>
        </div>
        <div class="text-2xl font-black text-rose-600 dark:text-rose-400 mb-1">
          {{ store.dashboardStats.urgentCount }}
        </div>
        <div class="text-xs text-rose-500/80 font-medium">
          Priority turnaround required
        </div>
      </div>

      <!-- Total Revenue -->
      <div class="p-5 rounded-2xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/40 transition-colors">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Fabrication Revenue</span>
          <span class="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <DollarSign class="w-5 h-5" />
          </span>
        </div>
        <div class="text-2xl font-black text-slate-900 dark:text-white mb-1">
          {{ formatCurrency(store.dashboardStats.revenue) }}
        </div>
        <div class="text-xs text-slate-500 dark:text-slate-400">
          {{ store.dashboardStats.pendingBills }} invoices pending
        </div>
      </div>
    </div>

    <!-- Charts & Workflow Overview -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Interactive Monthly Volume Bar Graph -->
      <div class="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="font-bold text-base text-slate-900 dark:text-white">Monthly Case Production Volume</h3>
            <p class="text-xs text-slate-500 dark:text-slate-400">Milled crowns, 3D printed arches, and surgical guides</p>
          </div>
          <span class="text-xs font-mono font-bold px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            2026 Volume
          </span>
        </div>

        <!-- Pure Vue Reactive Bar Chart -->
        <div class="h-56 flex items-end justify-between gap-2 pt-6 px-2">
          <div
            v-for="(bar, idx) in monthlyData"
            :key="bar.month"
            class="flex-1 flex flex-col items-center gap-2 group cursor-pointer"
            @mouseenter="sound.playChartTick()"
          >
            <!-- Tooltip pill -->
            <div class="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs pointer-events-none mb-1">
              {{ bar.orders }} cases
            </div>

            <!-- Bar -->
            <div class="w-full max-w-[36px] bg-slate-100 dark:bg-slate-800/80 rounded-xl overflow-hidden flex flex-col justify-end p-0.5 h-40">
              <div
                class="w-full rounded-lg bg-gradient-to-t from-emerald-600 to-teal-400 group-hover:from-emerald-500 group-hover:to-teal-300 transition-all duration-300 shadow-sm"
                :style="{ height: `${(bar.orders / maxMonthlyOrders) * 100}%` }"
              />
            </div>

            <span class="text-[11px] font-bold text-slate-400 group-hover:text-emerald-500 transition-colors">
              {{ bar.month }}
            </span>
          </div>
        </div>
      </div>

      <!-- Quick Workflow Stage Breakdown -->
      <div class="p-6 rounded-3xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
        <div>
          <h3 class="font-bold text-base text-slate-900 dark:text-white mb-1">Stage Distribution</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 mb-6">Real-time status breakdown across lab benches</p>

          <div class="space-y-3.5">
            <div v-for="stage in stageBreakdown" :key="stage.name" class="space-y-1">
              <div class="flex items-center justify-between text-xs">
                <span class="font-semibold text-slate-700 dark:text-slate-300">{{ stage.name }}</span>
                <span class="font-mono font-bold text-slate-900 dark:text-white">{{ stage.count }} ({{ stage.percent }}%)</span>
              </div>
              <div class="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-500"
                  :class="stage.color"
                  :style="{ width: `${stage.percent}%` }"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          <router-link
            to="/workflow-board"
            class="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-xl transition-colors"
          >
            <span>Open Workflow Kanban</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </router-link>
        </div>
      </div>

    </div>

    <!-- Live Odontogram Telemetry Bento Widget -->
    <div class="p-6 rounded-3xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <div class="flex items-center gap-2">
            <span class="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-500">
              <Zap class="w-4 h-4" />
            </span>
            <h3 class="font-extrabold text-base text-slate-900 dark:text-white tracking-tight">
              Live Odontogram Monitor (Universal 1–32)
            </h3>
            <span class="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Vue 3 Reactive Canvas
            </span>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time anatomical workload distribution across maxillary and mandibular dental arches
          </p>
        </div>

        <router-link
          to="/orders/create"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 text-xs font-bold transition-all border border-slate-200 dark:border-slate-700"
        >
          <span>Open Full Odontogram Lab</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </router-link>
      </div>

      <!-- Quick Interactive Teeth Strip -->
      <div class="bg-slate-50/70 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800/80 mb-4 overflow-x-auto">
        <div class="min-w-[640px]">
          <div class="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            <span>Maxillary Arch (Upper 1 ➔ 16)</span>
            <span class="font-mono text-emerald-500">Right (UR) ⟷ Left (UL)</span>
          </div>
          <div class="grid grid-cols-16 gap-1 mb-3">
            <button
              v-for="tooth in 16"
              :key="tooth"
              @mouseenter="activeDashboardTooth = tooth; sound.playChartTick()"
              @click="router.push(`/orders/create?tooth=${tooth}`)"
              :class="[
                'h-10 rounded-lg flex flex-col items-center justify-center font-mono text-xs font-bold transition-all cursor-pointer',
                activeDashboardTooth === tooth
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30 scale-110 z-10'
                  : 'bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:border-emerald-400'
              ]"
            >
              <span class="text-[10px]">#{{ tooth }}</span>
            </button>
          </div>

          <div class="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            <span>Mandibular Arch (Lower 32 ⟵ 17)</span>
            <span class="font-mono text-emerald-500">Right (LR) ⟷ Left (LL)</span>
          </div>
          <div class="grid grid-cols-16 gap-1">
            <button
              v-for="tooth in [32,31,30,29,28,27,26,25,24,23,22,21,20,19,18,17]"
              :key="tooth"
              @mouseenter="activeDashboardTooth = tooth; sound.playChartTick()"
              @click="router.push(`/orders/create?tooth=${tooth}`)"
              :class="[
                'h-10 rounded-lg flex flex-col items-center justify-center font-mono text-xs font-bold transition-all cursor-pointer',
                activeDashboardTooth === tooth
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30 scale-110 z-10'
                  : 'bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:border-emerald-400'
              ]"
            >
              <span class="text-[10px]">#{{ tooth }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Live Tooth Telemetry Display -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 font-black font-mono flex items-center justify-center text-sm shadow-xs">
            #{{ activeDashboardTooth }}
          </div>
          <div>
            <div class="font-bold text-slate-900 dark:text-white">
              {{ getToothName(activeDashboardTooth) }}
            </div>
            <div class="text-[11px] text-slate-500 dark:text-slate-400">
              Quadrant: <strong class="text-emerald-600 dark:text-emerald-400 font-semibold">{{ getToothQuadrant(activeDashboardTooth) }}</strong> • FDI Notation: <strong class="font-mono">{{ getFdi(activeDashboardTooth) }}</strong>
            </div>
          </div>
        </div>

        <button
          @click="router.push(`/orders/create?tooth=${activeDashboardTooth}`)"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
        >
          <span>Prescribe Tooth #{{ activeDashboardTooth }}</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>

    <!-- Recent Orders Table Preview -->
    <div class="p-4 sm:p-6 rounded-3xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 shadow-sm">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="font-bold text-base text-slate-900 dark:text-white">Recent Lab Cases</h3>
          <p class="text-xs text-slate-500 dark:text-slate-400">Latest orders submitted for digital dental design</p>
        </div>
        <router-link
          to="/orders"
          class="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
        >
          <span>View All Orders</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </router-link>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full min-w-[700px] text-left text-xs">
          <thead>
            <tr class="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
              <th class="py-3 px-3">Order #</th>
              <th class="py-3 px-3">Patient</th>
              <th class="py-3 px-3">Doctor / Clinic</th>
              <th class="py-3 px-3">Restoration</th>
              <th class="py-3 px-3">Status</th>
              <th class="py-3 px-3">Priority</th>
              <th class="py-3 px-3">Due Date</th>
              <th class="py-3 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
            <tr
              v-for="order in store.orders.slice(0, 5)"
              :key="order.id"
              class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
            >
              <td class="py-3 px-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                #{{ order.orderNumber }}
              </td>
              <td class="py-3 px-3 font-bold text-slate-900 dark:text-white">
                {{ order.patientName }}
              </td>
              <td class="py-3 px-3 text-slate-500 dark:text-slate-400">
                <div class="text-slate-900 dark:text-white font-semibold">{{ order.doctorName }}</div>
                <div class="text-[11px]">{{ order.clinicName }}</div>
              </td>
              <td class="py-3 px-3">
                <span class="font-semibold text-slate-800 dark:text-slate-200">{{ order.restoration }}</span>
                <span class="text-slate-400 block text-[11px]">{{ order.units }} Unit(s) • {{ order.shade }}</span>
              </td>
              <td class="py-3 px-3">
                <StatusBadge :status="order.status" size="sm" />
              </td>
              <td class="py-3 px-3">
                <PriorityBadge :priority="order.priority" />
              </td>
              <td class="py-3 px-3 text-slate-500 font-mono">
                {{ formatDate(order.dueDate) }}
              </td>
              <td class="py-3 px-3 text-right">
                <router-link
                  :to="`/orders/${order.id}`"
                  class="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
                >
                  <Eye class="w-3.5 h-3.5" />
                  <span>View</span>
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { 
  Sparkles, Plus, GitBranch, BarChart3, Package, 
  Activity, AlertTriangle, DollarSign, TrendingUp, 
  Clock, ArrowRight, Eye, Zap 
} from 'lucide-vue-next';
import { useDentalStore } from '@/stores/dental';
import StatusBadge from '@/components/ui/StatusBadge.vue';
import PriorityBadge from '@/components/ui/PriorityBadge.vue';
import { formatCurrency, formatDate } from '@/utils/format';
import { sound } from '@/utils/sound';

const router = useRouter();
const store = useDentalStore();
const activeDashboardTooth = ref<number>(14);

const TOOTH_NAMES: Record<number, string> = {
  1: 'Upper Right 3rd Molar (Wisdom)', 2: 'Upper Right 2nd Molar', 3: 'Upper Right 1st Molar',
  4: 'Upper Right 2nd Premolar', 5: 'Upper Right 1st Premolar', 6: 'Upper Right Canine (Cuspid)',
  7: 'Upper Right Lateral Incisor', 8: 'Upper Right Central Incisor',
  9: 'Upper Left Central Incisor', 10: 'Upper Left Lateral Incisor', 11: 'Upper Left Canine (Cuspid)',
  12: 'Upper Left 1st Premolar', 13: 'Upper Left 2nd Premolar', 14: 'Upper Left 1st Molar',
  15: 'Upper Left 2nd Molar', 16: 'Upper Left 3rd Molar (Wisdom)',
  17: 'Lower Left 3rd Molar (Wisdom)', 18: 'Lower Left 2nd Molar', 19: 'Lower Left 1st Molar',
  20: 'Lower Left 2nd Premolar', 21: 'Lower Left 1st Premolar', 22: 'Lower Left Canine (Cuspid)',
  23: 'Lower Left Lateral Incisor', 24: 'Lower Left Central Incisor',
  25: 'Lower Right Central Incisor', 26: 'Lower Right Lateral Incisor', 27: 'Lower Right Canine (Cuspid)',
  28: 'Lower Right 1st Premolar', 29: 'Lower Right 2nd Premolar', 30: 'Lower Right 1st Molar',
  31: 'Lower Right 2nd Molar', 32: 'Lower Right 3rd Molar (Wisdom)'
};

const getToothName = (num: number) => TOOTH_NAMES[num] || `Tooth #${num}`;

const getToothQuadrant = (num: number) => {
  if (num >= 1 && num <= 8) return 'Upper Right (UR)';
  if (num >= 9 && num <= 16) return 'Upper Left (UL)';
  if (num >= 17 && num <= 24) return 'Lower Left (LL)';
  return 'Lower Right (LR)';
};

const getFdi = (num: number) => {
  if (num >= 1 && num <= 8) return `${10 + (9 - num)}`;
  if (num >= 9 && num <= 16) return `${20 + (num - 8)}`;
  if (num >= 17 && num <= 24) return `${30 + (25 - num)}`;
  return `${40 + (num - 24)}`;
};

const monthlyData = computed(() => {
  if (store.volume && store.volume.length > 0) return store.volume;
  return [
    { month: 'Jan', orders: 48 },
    { month: 'Feb', orders: 62 },
    { month: 'Mar', orders: 74 },
    { month: 'Apr', orders: 58 },
    { month: 'May', orders: 86 },
    { month: 'Jun', orders: 95 },
    { month: 'Jul', orders: 110 },
    { month: 'Aug', orders: 104 },
    { month: 'Sep', orders: 122 },
  ];
});

const maxMonthlyOrders = computed(() => {
  return Math.max(...monthlyData.value.map(d => d.orders), 100);
});

const stageBreakdown = computed(() => {
  const total = store.orders.length || 1;
  const countOf = (status: string) => store.orders.filter(o => o.status === status).length;

  return [
    { name: 'CAD Design & Review', count: countOf('Design') + countOf('Review'), percent: Math.round(((countOf('Design') + countOf('Review')) / total) * 100), color: 'bg-emerald-500' },
    { name: 'Milling & 3D Printing', count: countOf('Production'), percent: Math.round((countOf('Production') / total) * 100), color: 'bg-teal-500' },
    { name: 'Quality Inspection', count: countOf('Quality Check'), percent: Math.round((countOf('Quality Check') / total) * 100), color: 'bg-purple-500' },
    { name: 'Ready / Delivered', count: countOf('Ready') + countOf('Completed'), percent: Math.round(((countOf('Ready') + countOf('Completed')) / total) * 100), color: 'bg-blue-500' },
  ];
});
</script>
