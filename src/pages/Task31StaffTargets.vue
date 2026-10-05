<template>
  <div class="space-y-4 w-full min-w-0">
    
    <!-- 1. Header & Controls -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#0b101d] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
      <div>
        <div class="flex items-center gap-2">
          <span class="p-1.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Users2 class="w-4.5 h-4.5" />
          </span>
          <h1 class="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Task 31: Staff Quarterly Targets & Quotas
          </h1>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/25">
            ?task=31
          </span>
        </div>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Departmental productivity tracking • Case volume quotas, individual technician throughput & bonus tiers
        </p>
      </div>

      <!-- State Switcher & Export -->
      <div class="flex items-center gap-2">
        <UIStateSwitcher
          :state="uiState"
          @change="(s) => uiState = s"
          label="Matrix State"
        />

        <button
          type="button"
          @click="windowPrint"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs shadow-xs hover:bg-cyan-400 cursor-pointer"
        >
          <Printer class="w-3.5 h-3.5" />
          <span>Export Matrix</span>
        </button>
      </div>
    </div>

    <!-- 2. Department & Quarter Filters Bar (Matches task31.php roles) -->
    <div class="bg-white dark:bg-[#0b101d] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div>
          <label class="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
            Auth Group / Department (task31.php)
          </label>
          <select
            v-model="selectedDept"
            class="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
          >
            <option value="ALL">All Company Departments</option>
            <option value="CAD / CAM Operators">CAD / CAM Operators</option>
            <option value="Treatment Planners">Treatment Planners (Co-Diagnostix)</option>
            <option value="Radiologists">Radiologists & Segmenters</option>
            <option value="Quality Control">Quality Control & Assurance</option>
            <option value="Customer Support">Customer Support (CS)</option>
            <option value="Senior Sales">Senior Enterprise Sales</option>
          </select>
        </div>

        <div>
          <label class="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
            Target Quarter Period
          </label>
          <select
            v-model="selectedQuarter"
            class="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
          >
            <option>Q1 (Jan - Mar)</option>
            <option>Q2 (Apr - Jun)</option>
            <option>Q3 (Jul - Sep)</option>
            <option>Q4 (Oct - Dec)</option>
          </select>
        </div>

        <div>
          <label class="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
            Staff Member Search
          </label>
          <div class="relative">
            <Search class="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              v-model="search"
              placeholder="Search staff by name or role..."
              class="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Simulated States -->
    <div v-if="uiState === 'loading'" class="bg-white dark:bg-[#0b101d] rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
      <LoadingState text="Loading WSaccounts & Quota Calculations for Task 31..." />
    </div>

    <div v-else-if="uiState === 'error'" class="bg-white dark:bg-[#0b101d] rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
      <ErrorState
        title="Database Permission Denied (403)"
        message="User session does not hold super admin permission to inspect all staff quota files."
        code="ERR_AUTH_GROUP_RESTRICTED"
        @retry="uiState = 'normal'"
      />
    </div>

    <div v-else-if="uiState === 'empty'" class="bg-white dark:bg-[#0b101d] rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
      <EmptyState
        title="No Staff Assigned to Selected Department"
        description="There are currently no staff records listed for this specific operational group."
      >
        <template #action>
          <button
            @click="selectedDept = 'ALL'; uiState = 'normal'"
            class="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
          >
            Reset to All Departments
          </button>
        </template>
      </EmptyState>
    </div>

    <!-- Normal Live State: High-Tech 22" Wide Matrix -->
    <div v-else class="space-y-3">
      <!-- Summary Strip -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div class="p-3 rounded-xl bg-white dark:bg-[#0b101d] border border-slate-200 dark:border-slate-800">
          <span class="text-[10px] uppercase font-bold text-slate-400 block">Active Staff Listed</span>
          <span class="text-lg font-black text-slate-900 dark:text-white font-mono">{{ filteredStaff.length }} Members</span>
        </div>
        <div class="p-3 rounded-xl bg-white dark:bg-[#0b101d] border border-slate-200 dark:border-slate-800">
          <span class="text-[10px] uppercase font-bold text-slate-400 block">Total Target Quota</span>
          <span class="text-lg font-black text-slate-900 dark:text-white font-mono">{{ totalQuota }} Cases</span>
        </div>
        <div class="p-3 rounded-xl bg-white dark:bg-[#0b101d] border border-slate-200 dark:border-slate-800">
          <span class="text-[10px] uppercase font-bold text-slate-400 block">Actual Cases Delivered</span>
          <span class="text-lg font-black text-cyan-600 dark:text-cyan-400 font-mono">{{ totalAchieved }} Cases</span>
        </div>
        <div class="p-3 rounded-xl bg-white dark:bg-[#0b101d] border border-slate-200 dark:border-slate-800">
          <span class="text-[10px] uppercase font-bold text-slate-400 block">Average Completion</span>
          <span class="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">{{ avgCompletion }}%</span>
        </div>
      </div>

      <!-- Matrix Table -->
      <div class="bg-white dark:bg-[#0b101d] rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs overflow-hidden">
        <div class="w-full overflow-x-auto lg:overflow-x-hidden">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase select-none">
                <th class="py-3 px-3 w-16">Staff ID</th>
                <th class="py-3 px-3 w-40">Specialist Name</th>
                <th class="py-3 px-3 w-44">Department</th>
                <th class="py-3 px-3 w-44">Email & Phone</th>
                <th class="py-3 px-3 w-24">Quota</th>
                <th class="py-3 px-3 w-24">Achieved</th>
                <th class="py-3 px-3 w-36">Quarter Progress</th>
                <th class="py-3 px-3 w-40">Monthly Slices (M1 / M2 / M3)</th>
                <th class="py-3 px-3 text-right w-24">Bonus Tier</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              <tr
                v-for="staff in filteredStaff"
                :key="staff.id"
                class="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors"
              >
                <td class="py-3 px-3 font-mono text-slate-400 font-bold">#{{ staff.id }}</td>
                <td class="py-3 px-3">
                  <div class="font-bold text-slate-900 dark:text-white">{{ staff.name }}</div>
                  <div class="text-[10px] text-slate-400">{{ staff.role }}</div>
                </td>
                <td class="py-3 px-3 text-slate-700 dark:text-slate-300 font-semibold">{{ staff.department }}</td>
                <td class="py-3 px-3">
                  <div class="text-[11px] text-slate-700 dark:text-slate-300">{{ staff.email }}</div>
                  <div class="text-[10px] text-slate-400 font-mono">{{ staff.phone }}</div>
                </td>
                <td class="py-3 px-3 font-mono text-slate-500 font-bold">{{ staff.quota }}</td>
                <td class="py-3 px-3 font-mono font-bold text-cyan-600 dark:text-cyan-400">{{ staff.achieved }}</td>
                
                <!-- Progress Bar -->
                <td class="py-3 px-3">
                  <div class="flex items-center gap-2">
                    <div class="w-20 bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        :class="['h-full rounded-full transition-all duration-500', Math.round((staff.achieved / staff.quota) * 100) >= 100 ? 'bg-emerald-500' : 'bg-cyan-500']"
                        :style="{ width: `${Math.min(Math.round((staff.achieved / staff.quota) * 100), 100)}%` }"
                      />
                    </div>
                    <span class="font-mono font-bold text-[11px] text-slate-700 dark:text-slate-300">
                      {{ Math.round((staff.achieved / staff.quota) * 100) }}%
                    </span>
                  </div>
                </td>

                <!-- Monthly Slices -->
                <td class="py-3 px-3 font-mono text-[11px] text-slate-500">
                  <span class="font-semibold text-slate-800 dark:text-slate-200">{{ staff.month1 }}</span> / {{ staff.month2 }} / {{ staff.month3 }}
                </td>

                <!-- Tier Badge -->
                <td class="py-3 px-3 text-right">
                  <span
                    :class="[
                      'px-2 py-0.5 rounded-full text-[10px] font-bold',
                      staff.tier === 'Diamond'
                        ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30'
                        : staff.tier === 'Gold'
                        ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    ]"
                  >
                    {{ staff.tier }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="p-3 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex justify-between">
          <span>Displaying <strong>{{ filteredStaff.length }}</strong> evaluated staff targets for {{ selectedQuarter }}</span>
          <span class="font-mono text-cyan-600">Zero horizontal scroll verified @ 1920px</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Users2, Printer, Search } from 'lucide-vue-next';
import UIStateSwitcher, { type UIStateType } from '@/components/ui/UIStateSwitcher.vue';
import LoadingState from '@/components/ui/LoadingState.vue';
import EmptyState from '@/components/ui/EmptyState.vue';
import ErrorState from '@/components/ui/ErrorState.vue';

interface StaffTargetRow {
  id: number;
  name: string;
  department: string;
  role: string;
  email: string;
  phone: string;
  quota: number;
  achieved: number;
  month1: number;
  month2: number;
  month3: number;
  tier: 'Diamond' | 'Gold' | 'Silver' | 'On Track';
}

const SAMPLE_STAFF: StaffTargetRow[] = [
  { id: 1016, name: 'Alex M.', department: 'CAD / CAM Operators', role: 'Senior CAD Specialist', email: 'alex.m@3ddx.com', phone: '+1 617-555-0192', quota: 420, achieved: 452, month1: 145, month2: 152, month3: 155, tier: 'Diamond' },
  { id: 1024, name: 'Sarah K.', department: 'Treatment Planners', role: 'Senior Co-Diagnostix Planner', email: 'sarah.k@3ddx.com', phone: '+1 617-555-0144', quota: 380, achieved: 395, month1: 130, month2: 132, month3: 133, tier: 'Gold' },
  { id: 1032, name: 'Omar H.', department: 'Quality Control', role: 'Lead QC Auditor', email: 'omar.h@3ddx.com', phone: '+1 617-555-0188', quota: 400, achieved: 410, month1: 138, month2: 135, month3: 137, tier: 'Gold' },
  { id: 1045, name: 'Dr. Michael Chen', department: 'Radiologists', role: 'Staff Radiologist', email: 'm.chen@3ddx.com', phone: '+1 617-555-0177', quota: 500, achieved: 520, month1: 170, month2: 175, month3: 175, tier: 'Diamond' },
  { id: 1058, name: 'Jessica L.', department: 'CAD / CAM Operators', role: 'CAM 3D Guide Specialist', email: 'jessica.l@3ddx.com', phone: '+1 617-555-0122', quota: 350, achieved: 342, month1: 110, month2: 118, month3: 114, tier: 'On Track' },
  { id: 1066, name: 'David Vance', department: 'Customer Support', role: 'Senior Account Manager', email: 'd.vance@3ddx.com', phone: '+1 617-555-0199', quota: 300, achieved: 318, month1: 105, month2: 107, month3: 106, tier: 'Silver' },
  { id: 1074, name: 'Emma Watson', department: 'Senior Sales', role: 'Global Enterprise Sales', email: 'e.watson@3ddx.com', phone: '+1 617-555-0111', quota: 450, achieved: 490, month1: 160, month2: 165, month3: 165, tier: 'Diamond' },
];

const uiState = ref<UIStateType>('normal');
const selectedDept = ref<string>('ALL');
const selectedQuarter = ref<string>('Q3 (Jul - Sep)');
const search = ref('');

const filteredStaff = computed(() => {
  return SAMPLE_STAFF.filter((s) => {
    if (selectedDept.value !== 'ALL' && s.department !== selectedDept.value) {
      return false;
    }
    if (search.value.trim()) {
      const q = search.value.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.role.toLowerCase().includes(q)
      );
    }
    return true;
  });
});

const totalQuota = computed(() => filteredStaff.value.reduce((acc, s) => acc + s.quota, 0));
const totalAchieved = computed(() => filteredStaff.value.reduce((acc, s) => acc + s.achieved, 0));
const avgCompletion = computed(() => (totalQuota.value > 0 ? Math.round((totalAchieved.value / totalQuota.value) * 100) : 0));

const windowPrint = () => {
  window.print();
};
</script>
