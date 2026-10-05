<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Billing & Invoicing
        </h1>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Track clinical statements, paid vouchers, and pending lab invoices.
        </p>
      </div>

      <button
        type="button"
        @click="generateStatement"
        class="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-xl shadow-md transition-all active:scale-95"
      >
        <Receipt class="w-4 h-4" />
        <span>Generate Statement</span>
      </button>
    </div>

    <!-- Table Tools: Search, Advanced Status Filter, Column Visibility -->
    <TableTools
      :table="table"
      searchPlaceholder="Search invoices by invoice #, order #, clinic, doctor..."
    />

    <!-- Billing Table -->
    <div class="rounded-3xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <!-- Empty State -->
      <EmptyState
        v-if="table.filteredData.value.length === 0"
        title="No invoices found"
        description="No billing records match your current filter or search criteria."
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

      <div v-else class="overflow-x-auto">
        <table class="w-full min-w-[650px] text-left text-xs">
          <thead>
            <tr class="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-slate-400 font-bold uppercase tracking-wider">
              <SortTh
                v-if="table.isColVisible('invoiceNumber')"
                field="invoiceNumber"
                label="Invoice #"
                :sortField="table.sortField.value"
                :sortDirection="table.sortDirection.value"
                @sort="table.handleSort"
                class="py-3.5 px-4"
              />
              <SortTh
                v-if="table.isColVisible('orderNumber')"
                field="orderNumber"
                label="Order Ref"
                :sortField="table.sortField.value"
                :sortDirection="table.sortDirection.value"
                @sort="table.handleSort"
                class="py-3.5 px-4"
              />
              <SortTh
                v-if="table.isColVisible('clinicName')"
                field="clinicName"
                label="Clinic / Doctor"
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
                v-if="table.isColVisible('status')"
                field="status"
                label="Status"
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
              v-for="b in table.paginatedData.value"
              :key="b.id"
              class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
            >
              <td v-if="table.isColVisible('invoiceNumber')" class="py-3.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {{ b.invoiceNumber || `INV-${b.orderNumber}` }}
              </td>
              <td v-if="table.isColVisible('orderNumber')" class="py-3.5 px-4 font-mono text-slate-500">
                #{{ b.orderNumber }}
              </td>
              <td v-if="table.isColVisible('clinicName')" class="py-3.5 px-4">
                <div class="font-bold text-slate-900 dark:text-white">{{ b.clinicName }}</div>
                <div class="text-[11px] text-slate-400">{{ b.doctorName }}</div>
              </td>
              <td v-if="table.isColVisible('amount')" class="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                {{ formatCurrency(b.amount) }}
              </td>
              <td v-if="table.isColVisible('status')" class="py-3.5 px-4">
                <StatusBadge :status="b.status" size="sm" />
              </td>
              <td v-if="table.isColVisible('dueDate')" class="py-3.5 px-4 font-mono text-slate-500">
                {{ formatDate(b.dueDate) }}
              </td>
              <td v-if="table.isColVisible('actions')" class="py-3.5 px-4 text-right">
                <button
                  type="button"
                  @click="downloadInvoice(b.orderNumber)"
                  class="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                  title="Download Invoice PDF"
                >
                  <Download class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>

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
import { computed } from 'vue';
import { Receipt, Download } from 'lucide-vue-next';
import { useDentalStore } from '@/stores/dental';
import StatusBadge from '@/components/ui/StatusBadge.vue';
import EmptyState from '@/components/ui/EmptyState.vue';
import Pagination from '@/components/ui/Pagination.vue';
import TableTools from '@/components/ui/TableTools.vue';
import SortTh from '@/components/ui/SortTh.vue';
import { useAdvancedTable, type ColumnConfig } from '@/composables/useAdvancedTable';
import { formatCurrency, formatDate } from '@/utils/format';
import { sound } from '@/utils/sound';

const store = useDentalStore();

const BILLING_COLUMNS: ColumnConfig[] = [
  { id: 'invoiceNumber', label: 'Invoice #', defaultVisible: true },
  { id: 'orderNumber', label: 'Order Ref', defaultVisible: true },
  { id: 'clinicName', label: 'Clinic / Doctor', defaultVisible: true },
  { id: 'amount', label: 'Amount', defaultVisible: true },
  { id: 'status', label: 'Status', defaultVisible: true },
  { id: 'dueDate', label: 'Due Date', defaultVisible: true },
  { id: 'actions', label: 'Actions', defaultVisible: true },
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Invoices' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Invoiced', label: 'Invoiced' },
  { value: 'Paid', label: 'Paid' },
  { value: 'Overdue', label: 'Overdue' },
];

const billingRecords = computed(() => store.billing);

const table = useAdvancedTable({
  data: billingRecords,
  columns: BILLING_COLUMNS,
  searchFields: ['invoiceNumber', 'orderNumber', 'clinicName', 'doctorName', 'patientName'],
  filterConfigs: [
    { key: 'status', label: 'Status', options: STATUS_OPTIONS, defaultValue: 'all' }
  ],
  initialSortField: 'dueDate',
  initialSortDirection: 'asc',
  pageSize: 10,
});

const generateStatement = () => {
  sound.playSuccess();
  alert('Statement generated for active billing cycle.');
};

const downloadInvoice = (orderNumber: string) => {
  sound.playClick();
  alert(`Downloading PDF Invoice for Order #${orderNumber}`);
};
</script>
