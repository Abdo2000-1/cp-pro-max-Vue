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

      <!-- View Switcher (Table / Grid) -->
      <div class="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
        <button
          type="button"
          @click="viewMode = 'table'"
          :class="[
            'p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all',
            viewMode === 'table'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          ]"
          title="Table View"
        >
          <List class="w-4 h-4" />
          <span class="hidden sm:inline">Table</span>
        </button>
        <button
          type="button"
          @click="viewMode = 'grid'"
          :class="[
            'p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all',
            viewMode === 'grid'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
          ]"
          title="Grid View"
        >
          <LayoutGrid class="w-4 h-4" />
          <span class="hidden sm:inline">Grid</span>
        </button>
      </div>
    </div>

    <!-- Table Tools: Live Search, Filters, Column Visibility -->
    <TableTools
      :table="table"
      searchPlaceholder="Search cases by number, title, patient, doctor, clinic..."
    />

    <!-- Empty State -->
    <EmptyState
      v-if="table.filteredData.value.length === 0"
      title="No clinical cases found"
      description="No cases match your current filter or search criteria."
    >
      <template #action>
        <button
          type="button"
          @click="table.resetAllFilters()"
          class="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors border border-slate-300 dark:border-slate-700"
        >
          Reset Filters
        </button>
      </template>
    </EmptyState>

    <div v-else>
      <!-- Table View -->
      <div v-if="viewMode === 'table'" class="rounded-3xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full min-w-[720px] text-left text-xs">
            <thead>
              <tr class="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-slate-400 font-bold uppercase tracking-wider">
                <SortTh
                  v-if="table.isColVisible('caseNumber')"
                  field="caseNumber"
                  label="Case #"
                  :sortField="table.sortField.value"
                  :sortDirection="table.sortDirection.value"
                  @sort="table.handleSort"
                  class="py-3.5 px-4"
                />
                <SortTh
                  v-if="table.isColVisible('title')"
                  field="title"
                  label="Title"
                  :sortField="table.sortField.value"
                  :sortDirection="table.sortDirection.value"
                  @sort="table.handleSort"
                  class="py-3.5 px-4"
                />
                <SortTh
                  v-if="table.isColVisible('patientName')"
                  field="patientName"
                  label="Patient"
                  :sortField="table.sortField.value"
                  :sortDirection="table.sortDirection.value"
                  @sort="table.handleSort"
                  class="py-3.5 px-4"
                />
                <SortTh
                  v-if="table.isColVisible('doctorName')"
                  field="doctorName"
                  label="Doctor & Clinic"
                  :sortField="table.sortField.value"
                  :sortDirection="table.sortDirection.value"
                  @sort="table.handleSort"
                  class="py-3.5 px-4"
                />
                <SortTh
                  v-if="table.isColVisible('ordersCount')"
                  field="ordersCount"
                  label="Orders / Files"
                  :sortField="table.sortField.value"
                  :sortDirection="table.sortDirection.value"
                  @sort="table.handleSort"
                  class="py-3.5 px-4"
                />
                <SortTh
                  v-if="table.isColVisible('status')"
                  field="status"
                  label="Status"
                  :sortField="table.sortField.value"
                  :sortDirection="table.sortDirection.value"
                  @sort="table.handleSort"
                  class="py-3.5 px-4"
                />
                <SortTh
                  v-if="table.isColVisible('priority')"
                  field="priority"
                  label="Priority"
                  :sortField="table.sortField.value"
                  :sortDirection="table.sortDirection.value"
                  @sort="table.handleSort"
                  class="py-3.5 px-4"
                />
                <th v-if="table.isColVisible('actions')" class="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              <tr
                v-for="c in table.paginatedData.value"
                :key="c.id"
                class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <td v-if="table.isColVisible('caseNumber')" class="py-3.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  <router-link :to="`/cases/${c.id}`" class="hover:underline">
                    #{{ c.caseNumber }}
                  </router-link>
                </td>
                <td v-if="table.isColVisible('title')" class="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                  {{ c.title }}
                </td>
                <td v-if="table.isColVisible('patientName')" class="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                  {{ c.patientName }}
                </td>
                <td v-if="table.isColVisible('doctorName')" class="py-3.5 px-4">
                  <div class="text-slate-900 dark:text-white font-semibold">{{ c.doctorName }}</div>
                  <div class="text-[11px] text-slate-400">{{ c.clinicName }}</div>
                </td>
                <td v-if="table.isColVisible('ordersCount')" class="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400">
                  {{ c.ordersCount }} orders • {{ c.filesCount }} files
                </td>
                <td v-if="table.isColVisible('status')" class="py-3.5 px-4">
                  <StatusBadge :status="c.status" size="sm" />
                </td>
                <td v-if="table.isColVisible('priority')" class="py-3.5 px-4">
                  <PriorityBadge :priority="c.priority" />
                </td>
                <td v-if="table.isColVisible('actions')" class="py-3.5 px-4 text-right">
                  <router-link
                    :to="`/cases/${c.id}`"
                    class="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    <span>View</span>
                    <ChevronRight class="w-3.5 h-3.5" />
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <Pagination
          v-model:current-page="table.currentPage.value"
          :total-items="table.filteredData.value.length"
          :page-size="table.pageSize.value"
        />
      </div>

      <!-- Grid View -->
      <div v-else class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="c in table.paginatedData.value"
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

        <Pagination
          v-model:current-page="table.currentPage.value"
          :total-items="table.filteredData.value.length"
          :page-size="table.pageSize.value"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ChevronRight, List, LayoutGrid } from 'lucide-vue-next';
import { useDentalStore } from '@/stores/dental';
import StatusBadge from '@/components/ui/StatusBadge.vue';
import PriorityBadge from '@/components/ui/PriorityBadge.vue';
import EmptyState from '@/components/ui/EmptyState.vue';
import Pagination from '@/components/ui/Pagination.vue';
import TableTools from '@/components/ui/TableTools.vue';
import SortTh from '@/components/ui/SortTh.vue';
import { useAdvancedTable, type ColumnConfig } from '@/composables/useAdvancedTable';

const store = useDentalStore();
const viewMode = ref<'table' | 'grid'>('table');

const CASE_COLUMNS: ColumnConfig[] = [
  { id: 'caseNumber', label: 'Case #', defaultVisible: true },
  { id: 'title', label: 'Title', defaultVisible: true },
  { id: 'patientName', label: 'Patient', defaultVisible: true },
  { id: 'doctorName', label: 'Doctor & Clinic', defaultVisible: true },
  { id: 'ordersCount', label: 'Orders / Files', defaultVisible: true },
  { id: 'status', label: 'Status', defaultVisible: true },
  { id: 'priority', label: 'Priority', defaultVisible: true },
  { id: 'actions', label: 'Actions', defaultVisible: true },
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'Open', label: 'Open' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Review', label: 'Review' },
  { value: 'Closed', label: 'Closed' },
];

const PRIORITY_OPTIONS = [
  { value: 'all', label: 'All Priorities' },
  { value: 'Urgent', label: 'Urgent' },
  { value: 'High', label: 'High' },
  { value: 'Normal', label: 'Normal' },
  { value: 'Low', label: 'Low' },
];

const allCases = computed(() => store.cases);

const table = useAdvancedTable({
  data: allCases,
  columns: CASE_COLUMNS,
  searchFields: ['caseNumber', 'title', 'patientName', 'doctorName', 'clinicName'],
  filterConfigs: [
    { key: 'status', label: 'Status', options: STATUS_OPTIONS, defaultValue: 'all' },
    { key: 'priority', label: 'Priority', options: PRIORITY_OPTIONS, defaultValue: 'all' },
  ],
  initialSortField: 'caseNumber',
  initialSortDirection: 'desc',
  pageSize: 9,
});
</script>
