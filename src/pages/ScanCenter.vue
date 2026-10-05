<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Digital Scan Center
        </h1>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Monitor intraoral 3D scanners, CBCT scanners, and live digital ingestion pipelines.
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
      searchPlaceholder="Search scan centers by name, location, operator..."
    />

    <!-- Empty State -->
    <EmptyState
      v-if="table.filteredData.value.length === 0"
      title="No scan centers found"
      description="No scan centers match your current filter or search criteria."
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
          <table class="w-full min-w-[650px] text-left text-xs">
            <thead>
              <tr class="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-slate-400 font-bold uppercase tracking-wider">
                <SortTh
                  v-if="table.isColVisible('name')"
                  field="name"
                  label="Scan Center"
                  :sortField="table.sortField.value"
                  :sortDirection="table.sortDirection.value"
                  @sort="table.handleSort"
                  class="py-3.5 px-4"
                />
                <SortTh
                  v-if="table.isColVisible('location')"
                  field="location"
                  label="Location"
                  :sortField="table.sortField.value"
                  :sortDirection="table.sortDirection.value"
                  @sort="table.handleSort"
                  class="py-3.5 px-4"
                />
                <SortTh
                  v-if="table.isColVisible('operator')"
                  field="operator"
                  label="Lead Operator"
                  :sortField="table.sortField.value"
                  :sortDirection="table.sortDirection.value"
                  @sort="table.handleSort"
                  class="py-3.5 px-4"
                />
                <SortTh
                  v-if="table.isColVisible('devices')"
                  field="devices"
                  label="Devices"
                  :sortField="table.sortField.value"
                  :sortDirection="table.sortDirection.value"
                  @sort="table.handleSort"
                  class="py-3.5 px-4"
                />
                <SortTh
                  v-if="table.isColVisible('activeOrders')"
                  field="activeOrders"
                  label="Active Queue"
                  :sortField="table.sortField.value"
                  :sortDirection="table.sortDirection.value"
                  @sort="table.handleSort"
                  class="py-3.5 px-4"
                />
                <SortTh
                  v-if="table.isColVisible('completedToday')"
                  field="completedToday"
                  label="Done Today"
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
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              <tr
                v-for="sc in table.paginatedData.value"
                :key="sc.id"
                class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <td v-if="table.isColVisible('name')" class="py-3.5 px-4">
                  <div class="flex items-center gap-2.5">
                    <span class="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <ScanLine class="w-4 h-4" />
                    </span>
                    <span class="font-bold text-slate-900 dark:text-white">{{ sc.name }}</span>
                  </div>
                </td>
                <td v-if="table.isColVisible('location')" class="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                  {{ sc.location }}
                </td>
                <td v-if="table.isColVisible('operator')" class="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                  {{ sc.operator }}
                </td>
                <td v-if="table.isColVisible('devices')" class="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400">
                  {{ sc.devices }} Scanners
                </td>
                <td v-if="table.isColVisible('activeOrders')" class="py-3.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {{ sc.activeOrders }}
                </td>
                <td v-if="table.isColVisible('completedToday')" class="py-3.5 px-4 font-mono font-bold text-teal-600 dark:text-teal-400">
                  {{ sc.completedToday }}
                </td>
                <td v-if="table.isColVisible('status')" class="py-3.5 px-4">
                  <StatusBadge :status="sc.status" size="sm" />
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
            v-for="sc in table.paginatedData.value"
            :key="sc.id"
            class="p-5 rounded-3xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <span class="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <ScanLine class="w-5 h-5" />
                </span>
                <div>
                  <h3 class="font-bold text-sm text-slate-900 dark:text-white">{{ sc.name }}</h3>
                  <span class="text-[11px] text-slate-400">{{ sc.location }}</span>
                </div>
              </div>
              <StatusBadge :status="sc.status" size="sm" />
            </div>

            <div class="grid grid-cols-2 gap-3 py-3 border-y border-slate-100 dark:border-slate-800 text-xs">
              <div>
                <span class="text-slate-400 text-[10px] uppercase font-bold block">Operator</span>
                <strong class="text-slate-900 dark:text-white">{{ sc.operator }}</strong>
              </div>
              <div>
                <span class="text-slate-400 text-[10px] uppercase font-bold block">Active Devices</span>
                <strong class="text-slate-900 dark:text-white font-mono">{{ sc.devices }} Scanners</strong>
              </div>
              <div>
                <span class="text-slate-400 text-[10px] uppercase font-bold block">Queue Ingestion</span>
                <strong class="text-emerald-600 dark:text-emerald-400 font-mono">{{ sc.activeOrders }} In Flight</strong>
              </div>
              <div>
                <span class="text-slate-400 text-[10px] uppercase font-bold block">Completed Today</span>
                <strong class="text-teal-600 dark:text-teal-400 font-mono">{{ sc.completedToday }} Scans</strong>
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
import { ScanLine, List, LayoutGrid } from 'lucide-vue-next';
import { useDentalStore } from '@/stores/dental';
import StatusBadge from '@/components/ui/StatusBadge.vue';
import EmptyState from '@/components/ui/EmptyState.vue';
import Pagination from '@/components/ui/Pagination.vue';
import TableTools from '@/components/ui/TableTools.vue';
import SortTh from '@/components/ui/SortTh.vue';
import { useAdvancedTable, type ColumnConfig } from '@/composables/useAdvancedTable';

const store = useDentalStore();
const viewMode = ref<'table' | 'grid'>('table');

const SCAN_COLUMNS: ColumnConfig[] = [
  { id: 'name', label: 'Scan Center', defaultVisible: true },
  { id: 'location', label: 'Location', defaultVisible: true },
  { id: 'operator', label: 'Lead Operator', defaultVisible: true },
  { id: 'devices', label: 'Devices', defaultVisible: true },
  { id: 'activeOrders', label: 'Active Queue', defaultVisible: true },
  { id: 'completedToday', label: 'Done Today', defaultVisible: true },
  { id: 'status', label: 'Status', defaultVisible: true },
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'Online', label: 'Online' },
  { value: 'Busy', label: 'Busy' },
  { value: 'Offline', label: 'Offline' },
];

const scanCenters = computed(() => store.scanCenters);

const table = useAdvancedTable({
  data: scanCenters,
  columns: SCAN_COLUMNS,
  searchFields: ['name', 'location', 'operator'],
  filterConfigs: [
    { key: 'status', label: 'Status', options: STATUS_OPTIONS, defaultValue: 'all' },
  ],
  initialSortField: 'name',
  initialSortDirection: 'asc',
  pageSize: 9,
});
</script>
