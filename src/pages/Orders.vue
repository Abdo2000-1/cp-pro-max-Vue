<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Lab Orders & Cases
        </h1>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Manage digital impressions, CAD restoration designs, and clinical turnaround.
        </p>
      </div>

      <div class="flex items-center gap-2.5 self-stretch sm:self-auto">
        <UIStateSwitcher v-model="viewState" />
        <router-link
          to="/orders/create"
          class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/25 transition-all active:scale-95"
        >
          <Plus class="w-4 h-4 stroke-[2.5]" />
          <span>New Order</span>
        </router-link>
      </div>
    </div>

    <!-- Status Tabs -->
    <div class="flex items-center gap-1 overflow-x-auto w-full p-1.5 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
      <button
        v-for="tab in statusTabs"
        :key="tab.id"
        type="button"
        @click="activeTab = tab.id; sound.playClick()"
        :class="[
          'px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0',
          activeTab === tab.id
            ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        ]"
      >
        <span>{{ tab.label }}</span>
        <span
          v-if="tab.count !== undefined"
          class="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
        >
          {{ tab.count }}
        </span>
      </button>
    </div>

    <!-- Table Tools: Search, Filters, Column Visibility -->
    <TableTools
      :table="table"
      searchPlaceholder="Search by patient, doctor, order #, restoration..."
    />

    <!-- Content Card -->
    <div class="rounded-3xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      
      <!-- 1. LOADING STATE SIMULATION -->
      <LoadingState
        v-if="viewState === 'loading'"
        title="Loading Lab Orders..."
        message="Querying digital laboratory database and active CAD stages."
      />

      <!-- 2. ERROR STATE SIMULATION -->
      <ErrorState
        v-else-if="viewState === 'error'"
        title="Failed to Load Lab Orders"
        description="Unable to sync with dental database. Please check connection and retry."
        @retry="viewState = 'normal'"
      />

      <!-- 3. EMPTY STATE SIMULATION / NO RESULTS -->
      <EmptyState
        v-else-if="viewState === 'empty' || table.filteredData.value.length === 0"
        title="No orders found"
        description="No digital lab orders match your current search or status filter."
      >
        <template #action>
          <button
            type="button"
            @click="table.resetAllFilters(); activeTab = 'all'; viewState = 'normal'"
            class="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors border border-slate-300 dark:border-slate-700"
          >
            Reset Filters
          </button>
        </template>
      </EmptyState>

      <!-- 4. LIVE ORDERS TABLE -->
      <div v-else>
        <div class="overflow-x-auto">
          <table class="w-full min-w-[760px] text-left text-xs">
            <thead>
              <tr class="border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 text-slate-400 font-bold uppercase tracking-wider">
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
                  v-if="table.isColVisible('doctorName')"
                  field="doctorName"
                  label="Doctor / Clinic"
                  :sortField="table.sortField.value"
                  :sortDirection="table.sortDirection.value"
                  @sort="table.handleSort"
                  class="py-3.5 px-4"
                />
                <SortTh
                  v-if="table.isColVisible('restoration')"
                  field="restoration"
                  label="Restoration"
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
                <SortTh
                  v-if="table.isColVisible('amount')"
                  field="amount"
                  label="Amount"
                  :sortField="table.sortField.value"
                  :sortDirection="table.sortDirection.value"
                  @sort="table.handleSort"
                  class="py-3.5 px-4"
                />
                <SortTh
                  v-if="table.isColVisible('dueDate')"
                  field="dueDate"
                  label="Due Date"
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
                v-for="order in table.paginatedData.value"
                :key="order.id"
                class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group"
              >
                <!-- Order Number -->
                <td v-if="table.isColVisible('orderNumber')" class="py-3.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  <router-link :to="`/orders/${order.id}`" class="hover:underline">
                    #{{ order.orderNumber }}
                  </router-link>
                </td>

                <!-- Patient -->
                <td v-if="table.isColVisible('patientName')" class="py-3.5 px-4">
                  <div class="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>{{ order.patientName }}</span>
                    <span v-if="order.isLocked" class="text-amber-500" title="Order Locked">
                      <Lock class="w-3 h-3" />
                    </span>
                  </div>
                  <span class="text-[11px] text-slate-400 font-mono">ID: {{ order.patientId }}</span>
                </td>

                <!-- Doctor / Clinic -->
                <td v-if="table.isColVisible('doctorName')" class="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                  <div class="font-semibold text-slate-900 dark:text-white">{{ order.doctorName }}</div>
                  <div class="text-[11px] text-slate-400">{{ order.clinicName }}</div>
                </td>

                <!-- Restoration & Shade -->
                <td v-if="table.isColVisible('restoration')" class="py-3.5 px-4">
                  <div class="font-bold text-slate-800 dark:text-slate-200">{{ order.restoration }}</div>
                  <div class="text-[11px] text-slate-400">
                    {{ order.units }} Unit(s) • Shade {{ order.shade }}
                  </div>
                </td>

                <!-- Status Badge -->
                <td v-if="table.isColVisible('status')" class="py-3.5 px-4">
                  <StatusBadge :status="order.status" size="sm" />
                </td>

                <!-- Priority Badge -->
                <td v-if="table.isColVisible('priority')" class="py-3.5 px-4">
                  <PriorityBadge :priority="order.priority" />
                </td>

                <!-- Amount -->
                <td v-if="table.isColVisible('amount')" class="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                  {{ formatCurrency(order.amount) }}
                </td>

                <!-- Due Date -->
                <td v-if="table.isColVisible('dueDate')" class="py-3.5 px-4 font-mono text-slate-500">
                  {{ formatDate(order.dueDate) }}
                </td>

                <!-- Actions -->
                <td v-if="table.isColVisible('actions')" class="py-3.5 px-4 text-right">
                  <div class="flex items-center justify-end gap-1">
                    <router-link
                      :to="`/orders/${order.id}`"
                      class="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                      title="View Details"
                    >
                      <Eye class="w-4 h-4" />
                    </router-link>
                    <router-link
                      :to="`/orders/${order.id}/edit`"
                      class="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                      title="Edit Order"
                    >
                      <Edit3 class="w-4 h-4" />
                    </router-link>
                    <button
                      type="button"
                      @click="deleteOrder(order.id)"
                      class="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Delete Order"
                    >
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
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
import { ref, computed, watch } from 'vue';
import { Plus, Eye, Edit3, Trash2, Lock } from 'lucide-vue-next';
import { useDentalStore } from '@/stores/dental';
import type { OrdersViewState } from '@/types';
import StatusBadge from '@/components/ui/StatusBadge.vue';
import PriorityBadge from '@/components/ui/PriorityBadge.vue';
import Pagination from '@/components/ui/Pagination.vue';
import LoadingState from '@/components/ui/LoadingState.vue';
import ErrorState from '@/components/ui/ErrorState.vue';
import EmptyState from '@/components/ui/EmptyState.vue';
import UIStateSwitcher from '@/components/ui/UIStateSwitcher.vue';
import TableTools from '@/components/ui/TableTools.vue';
import SortTh from '@/components/ui/SortTh.vue';
import { useAdvancedTable, type ColumnConfig } from '@/composables/useAdvancedTable';
import { formatCurrency, formatDate } from '@/utils/format';
import { sound } from '@/utils/sound';

const store = useDentalStore();

const activeTab = ref('all');
const viewState = ref<OrdersViewState>('normal');

const ORDER_COLUMNS: ColumnConfig[] = [
  { id: 'orderNumber', label: 'Order #', defaultVisible: true },
  { id: 'patientName', label: 'Patient', defaultVisible: true },
  { id: 'doctorName', label: 'Doctor / Clinic', defaultVisible: true },
  { id: 'restoration', label: 'Restoration', defaultVisible: true },
  { id: 'status', label: 'Status', defaultVisible: true },
  { id: 'priority', label: 'Priority', defaultVisible: true },
  { id: 'amount', label: 'Amount', defaultVisible: true },
  { id: 'dueDate', label: 'Due Date', defaultVisible: true },
  { id: 'actions', label: 'Actions', defaultVisible: true },
];

const priorityOptions = [
  { value: 'all', label: 'All Priorities' },
  { value: 'Urgent', label: 'Urgent' },
  { value: 'High', label: 'High' },
  { value: 'Normal', label: 'Normal' },
  { value: 'Low', label: 'Low' },
];

const baseOrders = computed(() => {
  if (activeTab.value === 'all') return store.orders;
  return store.orders.filter(o => o.status === activeTab.value);
});

const table = useAdvancedTable({
  data: baseOrders,
  columns: ORDER_COLUMNS,
  searchFields: ['orderNumber', 'patientName', 'doctorName', 'clinicName', 'restoration', 'patientId'],
  filterConfigs: [
    { key: 'priority', label: 'Priority', options: priorityOptions, defaultValue: 'all' }
  ],
  initialSortField: 'orderNumber',
  initialSortDirection: 'desc',
  pageSize: 10,
});

// Reset table pagination when tab changes
watch(activeTab, () => {
  table.currentPage.value = 1;
});

const statusTabs = computed(() => [
  { id: 'all', label: 'All Cases', count: store.orders.length },
  { id: 'Review', label: 'Review', count: store.orders.filter(o => o.status === 'Review').length },
  { id: 'Design', label: 'Design', count: store.orders.filter(o => o.status === 'Design').length },
  { id: 'Production', label: 'Production', count: store.orders.filter(o => o.status === 'Production').length },
  { id: 'Quality Check', label: 'QC', count: store.orders.filter(o => o.status === 'Quality Check').length },
  { id: 'Ready', label: 'Ready', count: store.orders.filter(o => o.status === 'Ready').length },
  { id: 'Completed', label: 'Completed', count: store.orders.filter(o => o.status === 'Completed').length },
]);

const deleteOrder = (id: string) => {
  if (confirm('Are you sure you want to delete this order?')) {
    store.deleteOrder(id);
  }
};
</script>
