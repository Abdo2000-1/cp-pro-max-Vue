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

      <!-- View Switcher -->
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
      searchPlaceholder="Search by request #, order #, patient, requester, reason..."
    />

    <!-- Empty State -->
    <EmptyState
      v-if="table.filteredData.value.length === 0"
      title="No change requests found"
      description="No redesign requests match your current search or filter criteria."
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
          <table class="w-full min-w-[760px] text-left text-xs">
            <thead>
              <tr class="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-slate-400 font-bold uppercase tracking-wider">
                <SortTh
                  v-if="table.isColVisible('requestNumber')"
                  field="requestNumber"
                  label="Request #"
                  :sortField="table.sortField.value"
                  :sortDirection="table.sortDirection.value"
                  @sort="table.handleSort"
                  class="py-3.5 px-4"
                />
                <SortTh
                  v-if="table.isColVisible('orderNumber')"
                  field="orderNumber"
                  label="Order #"
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
                  v-if="table.isColVisible('requester')"
                  field="requester"
                  label="Requester"
                  :sortField="table.sortField.value"
                  :sortDirection="table.sortDirection.value"
                  @sort="table.handleSort"
                  class="py-3.5 px-4"
                />
                <SortTh
                  v-if="table.isColVisible('description')"
                  field="description"
                  label="Description"
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
                  v-if="table.isColVisible('createdAt')"
                  field="createdAt"
                  label="Date"
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
                v-for="cr in table.paginatedData.value"
                :key="cr.id"
                class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <td v-if="table.isColVisible('requestNumber')" class="py-3.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  #{{ cr.requestNumber }}
                </td>
                <td v-if="table.isColVisible('orderNumber')" class="py-3.5 px-4 font-mono text-slate-500">
                  #{{ cr.orderNumber }}
                </td>
                <td v-if="table.isColVisible('patientName')" class="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                  {{ cr.patientName }}
                </td>
                <td v-if="table.isColVisible('requester')" class="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                  {{ cr.requester }}
                </td>
                <td v-if="table.isColVisible('description')" class="py-3.5 px-4 max-w-xs truncate text-slate-600 dark:text-slate-400">
                  {{ cr.description }}
                </td>
                <td v-if="table.isColVisible('priority')" class="py-3.5 px-4">
                  <PriorityBadge :priority="cr.priority" />
                </td>
                <td v-if="table.isColVisible('status')" class="py-3.5 px-4">
                  <StatusBadge :status="cr.status" size="sm" />
                </td>
                <td v-if="table.isColVisible('createdAt')" class="py-3.5 px-4 font-mono text-slate-500">
                  {{ formatDate(cr.createdAt) }}
                </td>
                <td v-if="table.isColVisible('actions')" class="py-3.5 px-4 text-right">
                  <div class="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      @click="approveCR(cr.id)"
                      class="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[11px] transition-all"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      @click="rejectCR(cr.id)"
                      class="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-[11px] transition-all"
                    >
                      Reject
                    </button>
                  </div>
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
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="cr in table.paginatedData.value"
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
import { List, LayoutGrid } from 'lucide-vue-next';
import { useDentalStore } from '@/stores/dental';
import StatusBadge from '@/components/ui/StatusBadge.vue';
import PriorityBadge from '@/components/ui/PriorityBadge.vue';
import EmptyState from '@/components/ui/EmptyState.vue';
import Pagination from '@/components/ui/Pagination.vue';
import TableTools from '@/components/ui/TableTools.vue';
import SortTh from '@/components/ui/SortTh.vue';
import { useAdvancedTable, type ColumnConfig } from '@/composables/useAdvancedTable';
import { formatDate } from '@/utils/format';
import { sound } from '@/utils/sound';

const store = useDentalStore();
const viewMode = ref<'table' | 'grid'>('table');

const CR_COLUMNS: ColumnConfig[] = [
  { id: 'requestNumber', label: 'Request #', defaultVisible: true },
  { id: 'orderNumber', label: 'Order #', defaultVisible: true },
  { id: 'patientName', label: 'Patient', defaultVisible: true },
  { id: 'requester', label: 'Requester', defaultVisible: true },
  { id: 'description', label: 'Description', defaultVisible: true },
  { id: 'priority', label: 'Priority', defaultVisible: true },
  { id: 'status', label: 'Status', defaultVisible: true },
  { id: 'createdAt', label: 'Date', defaultVisible: true },
  { id: 'actions', label: 'Actions', defaultVisible: true },
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'Pending', label: 'Pending' },
  { value: 'In Review', label: 'In Review' },
  { value: 'Approved', label: 'Approved' },
  { value: 'Rejected', label: 'Rejected' },
];

const PRIORITY_OPTIONS = [
  { value: 'all', label: 'All Priorities' },
  { value: 'Urgent', label: 'Urgent' },
  { value: 'High', label: 'High' },
  { value: 'Normal', label: 'Normal' },
  { value: 'Low', label: 'Low' },
];

const changeRequests = computed(() => store.changeRequests);

const table = useAdvancedTable({
  data: changeRequests,
  columns: CR_COLUMNS,
  searchFields: ['requestNumber', 'orderNumber', 'patientName', 'requester', 'description'],
  filterConfigs: [
    { key: 'status', label: 'Status', options: STATUS_OPTIONS, defaultValue: 'all' },
    { key: 'priority', label: 'Priority', options: PRIORITY_OPTIONS, defaultValue: 'all' },
  ],
  initialSortField: 'createdAt',
  initialSortDirection: 'desc',
  pageSize: 8,
});

const approveCR = (id: string) => {
  sound.playSuccess();
  alert(`Change request #${id} approved. Returning case to CAD design stage.`);
};

const rejectCR = (id: string) => {
  sound.playClick();
  alert(`Change request #${id} rejected.`);
};
</script>
