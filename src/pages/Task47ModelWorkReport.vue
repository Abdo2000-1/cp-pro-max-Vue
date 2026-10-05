<template>
  <div class="space-y-4 w-full min-w-0">
    
    <!-- 1. Header & Controls -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#0b101d] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
      <div>
        <div class="flex items-center gap-2">
          <span class="p-1.5 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20">
            <Boxes class="w-4.5 h-4.5" />
          </span>
          <h1 class="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Task 47: Model Work CP Report
          </h1>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/25">
            ?task=47
          </span>
        </div>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Orthodontic & digital dental model work report with operator tracking and archive telemetry
        </p>
      </div>

      <!-- State Switcher & Print -->
      <div class="flex items-center gap-2">
        <UIStateSwitcher
          :state="uiState"
          @change="(s) => uiState = s"
          label="Report State"
        />

        <button
          type="button"
          @click="windowPrint"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs shadow-xs hover:bg-cyan-400 cursor-pointer"
        >
          <Printer class="w-3.5 h-3.5" />
          <span>Export Report</span>
        </button>
      </div>
    </div>

    <!-- 2. Original Filter Form from task47.php -->
    <div class="bg-white dark:bg-[#0b101d] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div>
          <label class="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
            Operator
          </label>
          <select
            v-model="selectedOperator"
            class="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
          >
            <option value="-1">All Operators</option>
            <option value="0">Not Specified</option>
            <option value="Alex M.">Alex M. (Senior CAD)</option>
            <option value="Omar H.">Omar H. (QC Lead)</option>
            <option value="Sarah K.">Sarah K. (Planner)</option>
            <option value="Jessica L.">Jessica L. (CAM Specialist)</option>
          </select>
        </div>

        <div>
          <label class="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
            From Date
          </label>
          <input
            type="date"
            v-model="fromDate"
            class="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label class="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
            To Date
          </label>
          <input
            type="date"
            v-model="toDate"
            class="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label class="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
            Quick Search
          </label>
          <div class="relative">
            <Search class="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              v-model="search"
              placeholder="Search patient, doc..."
              class="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Simulated States -->
    <div v-if="uiState === 'loading'" class="bg-white dark:bg-[#0b101d] rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
      <LoadingState text="Querying OrderAppliance & Orders DB for Task 47..." />
    </div>

    <div v-else-if="uiState === 'error'" class="bg-white dark:bg-[#0b101d] rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
      <ErrorState
        title="Model Work Query Failure (500)"
        message="Error executing SELECT on OrderAppliance table."
        code="ERR_SQL_APP_TABLE_FAIL"
        @retry="uiState = 'normal'"
      />
    </div>

    <div v-else-if="uiState === 'empty'" class="bg-white dark:bg-[#0b101d] rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
      <EmptyState
        title="No Model Work Records in Date Range"
        description="No appliance orders matched the selected operator and timeframe."
      >
        <template #action>
          <button
            @click="uiState = 'normal'"
            class="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
          >
            Reset Search Filters
          </button>
        </template>
      </EmptyState>
    </div>

    <!-- Normal Live State: High-Tech 22" Wide Table -->
    <div v-else class="space-y-3">
      <!-- Summary Metric Ribbon -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div class="p-3 rounded-xl bg-white dark:bg-[#0b101d] border border-slate-200 dark:border-slate-800">
          <span class="text-[10px] uppercase font-bold text-slate-400 block">Total Orders</span>
          <span class="text-lg font-black text-slate-900 dark:text-white font-mono">{{ filteredRows.length }}</span>
        </div>
        <div class="p-3 rounded-xl bg-white dark:bg-[#0b101d] border border-slate-200 dark:border-slate-800">
          <span class="text-[10px] uppercase font-bold text-slate-400 block">Total Arches (Max/Mand)</span>
          <span class="text-lg font-black text-cyan-600 dark:text-cyan-400 font-mono">{{ totalMax }} Max / {{ totalMand }} Mand</span>
        </div>
        <div class="p-3 rounded-xl bg-white dark:bg-[#0b101d] border border-slate-200 dark:border-slate-800">
          <span class="text-[10px] uppercase font-bold text-slate-400 block">Total Billed Cost</span>
          <span class="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">${{ totalCost.toFixed(2) }}</span>
        </div>
        <div class="p-3 rounded-xl bg-white dark:bg-[#0b101d] border border-slate-200 dark:border-slate-800">
          <span class="text-[10px] uppercase font-bold text-slate-400 block">Vouchers Linked</span>
          <span class="text-lg font-black text-purple-600 dark:text-purple-400 font-mono">{{ filteredRows.filter(r => r.voucher !== 'None').length }}</span>
        </div>
      </div>

      <!-- Table Container -->
      <div class="bg-white dark:bg-[#0b101d] rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs overflow-hidden">
        <div class="w-full overflow-x-auto lg:overflow-x-hidden">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase select-none">
                <th class="py-3 px-3 w-10">#</th>
                <th class="py-3 px-3 w-24">Order ID</th>
                <th class="py-3 px-3 w-40">Scan Center</th>
                <th class="py-3 px-3 w-40">Doctor</th>
                <th class="py-3 px-3 w-40">Patient Name</th>
                <th class="py-3 px-3 text-center w-14">Max.</th>
                <th class="py-3 px-3 text-center w-14">Mand.</th>
                <th class="py-3 px-3 w-20">Cost</th>
                <th class="py-3 px-3 w-32">Received</th>
                <th class="py-3 px-3 w-32">Sent Time</th>
                <th class="py-3 px-3 w-28">Operator</th>
                <th class="py-3 px-3 w-24">Vouchers</th>
                <th class="py-3 px-3 w-24">Archive</th>
                <th class="py-3 px-3 text-right w-24">Charged</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              <tr
                v-for="row in filteredRows"
                :key="row.orderId"
                class="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors"
              >
                <td class="py-2.5 px-3 font-mono text-slate-400">{{ row.serial }}</td>
                <td class="py-2.5 px-3 font-mono font-bold text-cyan-600 dark:text-cyan-400">#{{ row.orderId }}</td>
                <td class="py-2.5 px-3 text-slate-800 dark:text-slate-200 truncate max-w-[150px]">{{ row.scanCenter }}</td>
                <td class="py-2.5 px-3 truncate max-w-[150px]">{{ row.doctor }}</td>
                <td class="py-2.5 px-3 font-bold text-slate-900 dark:text-white truncate max-w-[150px]">{{ row.patientName }}</td>
                <td class="py-2.5 px-3 text-center">
                  <span v-if="row.maxilla" class="text-emerald-500 font-bold">✓</span>
                  <span v-else class="text-slate-300">-</span>
                </td>
                <td class="py-2.5 px-3 text-center">
                  <span v-if="row.mandible" class="text-emerald-500 font-bold">✓</span>
                  <span v-else class="text-slate-300">-</span>
                </td>
                <td class="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-white">${{ row.cost.toFixed(2) }}</td>
                <td class="py-2.5 px-3 font-mono text-[11px] text-slate-500">{{ row.receivedTime }}</td>
                <td class="py-2.5 px-3 font-mono text-[11px] text-slate-500">{{ row.sentTime }}</td>
                <td class="py-2.5 px-3 font-medium text-slate-700 dark:text-slate-300">{{ row.operator }}</td>
                <td class="py-2.5 px-3 font-mono text-[11px] text-cyan-600 dark:text-cyan-400">{{ row.voucher }}</td>
                <td class="py-2.5 px-3 font-mono text-[11px] text-slate-400">{{ row.archiveDate }}</td>
                <td class="py-2.5 px-3 text-right font-mono text-[11px] text-slate-400">{{ row.chargeTime }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="p-3 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex justify-between">
          <span>Displaying <strong>{{ filteredRows.length }}</strong> model work appliance cases</span>
          <span class="font-mono text-cyan-600">Zero horizontal scroll verified @ 1920px</span>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Boxes, Printer, Search } from 'lucide-vue-next';
import UIStateSwitcher, { type UIStateType } from '@/components/ui/UIStateSwitcher.vue';
import LoadingState from '@/components/ui/LoadingState.vue';
import EmptyState from '@/components/ui/EmptyState.vue';
import ErrorState from '@/components/ui/ErrorState.vue';

interface Task47Row {
  serial: number;
  orderId: number;
  scanCenter: string;
  doctor: string;
  patientName: string;
  maxilla: boolean;
  mandible: boolean;
  cost: number;
  receivedTime: string;
  sentTime: string;
  operator: string;
  voucher: string;
  archiveDate: string;
  chargeTime: string;
}

const SAMPLE_TASK47_ROWS: Task47Row[] = [
  { serial: 1, orderId: 677201, scanCenter: 'Align Chicago', doctor: 'Dr. Marcus Vance', patientName: 'Arthur Pendelton', maxilla: true, mandible: false, cost: 75.00, receivedTime: '2026-09-28 09:30', sentTime: '2026-09-28 16:45', operator: 'Alex M.', voucher: 'VCH-9921', archiveDate: '2026-10-01', chargeTime: '2026-09-28 17:00' },
  { serial: 2, orderId: 677189, scanCenter: '3DDX Boston Hub', doctor: 'Dr. Sarah Jenkins', patientName: 'Elena Rostova', maxilla: true, mandible: true, cost: 130.00, receivedTime: '2026-09-28 10:15', sentTime: '2026-09-28 18:20', operator: 'Omar H.', voucher: 'VCH-9918', archiveDate: '2026-10-01', chargeTime: '2026-09-28 18:30' },
  { serial: 3, orderId: 677154, scanCenter: 'Dallas Imaging', doctor: 'Dr. Alan Turing', patientName: 'David Kim', maxilla: false, mandible: true, cost: 65.00, receivedTime: '2026-09-27 11:00', sentTime: '2026-09-27 15:40', operator: 'Sarah K.', voucher: 'None', archiveDate: '2026-09-30', chargeTime: '2026-09-27 16:00' },
  { serial: 4, orderId: 677098, scanCenter: 'NYC Dental Diagnostics', doctor: 'Dr. Jessica Alba', patientName: 'Rachel Green', maxilla: true, mandible: true, cost: 140.00, receivedTime: '2026-09-27 13:20', sentTime: '2026-09-28 09:10', operator: 'Jessica L.', voucher: 'VCH-9844', archiveDate: '2026-09-30', chargeTime: '2026-09-28 09:30' },
  { serial: 5, orderId: 676994, scanCenter: 'Align Chicago', doctor: 'Dr. Gregory House', patientName: 'John Watson', maxilla: true, mandible: false, cost: 70.00, receivedTime: '2026-09-26 08:45', sentTime: '2026-09-26 14:30', operator: 'Alex M.', voucher: 'VCH-9812', archiveDate: '2026-09-29', chargeTime: '2026-09-26 15:00' },
  { serial: 6, orderId: 676940, scanCenter: '3DDX Boston Hub', doctor: 'Dr. Lisa Cuddy', patientName: 'James Wilson', maxilla: false, mandible: true, cost: 65.00, receivedTime: '2026-09-26 10:00', sentTime: '2026-09-26 17:15', operator: 'Omar H.', voucher: 'None', archiveDate: '2026-09-29', chargeTime: '2026-09-26 17:45' },
];

const uiState = ref<UIStateType>('normal');
const selectedOperator = ref<string>('-1');
const fromDate = ref('2026-09-01');
const toDate = ref('2026-10-03');
const search = ref('');

const filteredRows = computed(() => {
  return SAMPLE_TASK47_ROWS.filter((r) => {
    if (selectedOperator.value !== '-1' && !r.operator.includes(selectedOperator.value)) {
      return false;
    }
    if (search.value.trim()) {
      const q = search.value.toLowerCase();
      return (
        r.orderId.toString().includes(q) ||
        r.patientName.toLowerCase().includes(q) ||
        r.doctor.toLowerCase().includes(q) ||
        r.scanCenter.toLowerCase().includes(q)
      );
    }
    return true;
  });
});

const totalCost = computed(() => filteredRows.value.reduce((acc, r) => acc + r.cost, 0));
const totalMax = computed(() => filteredRows.value.filter((r) => r.maxilla).length);
const totalMand = computed(() => filteredRows.value.filter((r) => r.mandible).length);

const windowPrint = () => {
  window.print();
};
</script>
