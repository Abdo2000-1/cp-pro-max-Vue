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

    <!-- Filters & Search Toolbar -->
    <div class="p-4 rounded-3xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
      <!-- Search -->
      <div class="w-full md:w-80">
        <SearchInput
          v-model="searchQuery"
          placeholder="Search by patient, doctor, order #..."
        />
      </div>

      <!-- Status Tabs -->
      <div class="flex items-center gap-1 overflow-x-auto w-full md:w-auto p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
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
    </div>

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
        v-else-if="viewState === 'empty' || filteredOrders.length === 0"
        title="No orders found"
        description="No digital lab orders match your current search or status filter."
      >
        <template #action>
          <button
            type="button"
            @click="searchQuery = ''; activeTab = 'all'; viewState = 'normal'"
            class="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors border border-slate-300 dark:border-slate-700"
          >
            Reset Filters
          </button>
        </template>
      </EmptyState>

      <!-- 4. LIVE ORDERS TABLE -->
      <div v-else>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 text-slate-400 font-bold uppercase tracking-wider">
                <th class="py-3.5 px-4">Order #</th>
                <th class="py-3.5 px-4">Patient</th>
                <th class="py-3.5 px-4">Doctor / Clinic</th>
                <th class="py-3.5 px-4">Restoration</th>
                <th class="py-3.5 px-4">Status</th>
                <th class="py-3.5 px-4">Priority</th>
                <th class="py-3.5 px-4">Amount</th>
                <th class="py-3.5 px-4">Due Date</th>
                <th class="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              <tr
                v-for="order in paginatedOrders"
                :key="order.id"
                class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group"
              >
                <!-- Order Number -->
                <td class="py-3.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  <router-link :to="`/orders/${order.id}`" class="hover:underline">
                    #{{ order.orderNumber }}
                  </router-link>
                </td>

                <!-- Patient -->
                <td class="py-3.5 px-4">
                  <div class="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>{{ order.patientName }}</span>
                    <span v-if="order.isLocked" class="text-amber-500" title="Order Locked">
                      <Lock class="w-3 h-3" />
                    </span>
                  </div>
                  <span class="text-[11px] text-slate-400 font-mono">ID: {{ order.patientId }}</span>
                </td>

                <!-- Doctor / Clinic -->
                <td class="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                  <div class="font-semibold text-slate-900 dark:text-white">{{ order.doctorName }}</div>
                  <div class="text-[11px] text-slate-400">{{ order.clinicName }}</div>
                </td>

                <!-- Restoration & Shade -->
                <td class="py-3.5 px-4">
                  <div class="font-bold text-slate-800 dark:text-slate-200">{{ order.restoration }}</div>
                  <div class="text-[11px] text-slate-400">
                    {{ order.units }} Unit(s) • Shade {{ order.shade }}
                  </div>
                </td>

                <!-- Status Badge -->
                <td class="py-3.5 px-4">
                  <StatusBadge :status="order.status" size="sm" />
                </td>

                <!-- Priority Badge -->
                <td class="py-3.5 px-4">
                  <PriorityBadge :priority="order.priority" />
                </td>

                <!-- Amount -->
                <td class="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                  {{ formatCurrency(order.amount) }}
                </td>

                <!-- Due Date -->
                <td class="py-3.5 px-4 font-mono text-slate-500">
                  {{ formatDate(order.dueDate) }}
                </td>

                <!-- Actions -->
                <td class="py-3.5 px-4 text-right">
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
          v-model:current-page="currentPage"
          :total-items="filteredOrders.length"
          :page-size="pageSize"
        />
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Plus, Eye, Edit3, Trash2, Lock } from 'lucide-vue-next';
import { useDentalStore } from '@/stores/dental';
import type { OrdersViewState } from '@/types';
import StatusBadge from '@/components/ui/StatusBadge.vue';
import PriorityBadge from '@/components/ui/PriorityBadge.vue';
import SearchInput from '@/components/ui/SearchInput.vue';
import Pagination from '@/components/ui/Pagination.vue';
import LoadingState from '@/components/ui/LoadingState.vue';
import ErrorState from '@/components/ui/ErrorState.vue';
import EmptyState from '@/components/ui/EmptyState.vue';
import UIStateSwitcher from '@/components/ui/UIStateSwitcher.vue';
import { formatCurrency, formatDate } from '@/utils/format';
import { sound } from '@/utils/sound';

const store = useDentalStore();

const searchQuery = ref('');
const activeTab = ref('all');
const viewState = ref<OrdersViewState>('normal');
const currentPage = ref(1);
const pageSize = 10;

const statusTabs = computed(() => [
  { id: 'all', label: 'All Cases', count: store.orders.length },
  { id: 'Review', label: 'Review', count: store.orders.filter(o => o.status === 'Review').length },
  { id: 'Design', label: 'Design', count: store.orders.filter(o => o.status === 'Design').length },
  { id: 'Production', label: 'Production', count: store.orders.filter(o => o.status === 'Production').length },
  { id: 'Quality Check', label: 'QC', count: store.orders.filter(o => o.status === 'Quality Check').length },
  { id: 'Ready', label: 'Ready', count: store.orders.filter(o => o.status === 'Ready').length },
  { id: 'Completed', label: 'Completed', count: store.orders.filter(o => o.status === 'Completed').length },
]);

const filteredOrders = computed(() => {
  return store.orders.filter(o => {
    // Status tab filter
    if (activeTab.value !== 'all' && o.status !== activeTab.value) return false;

    // Search query
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase();
      const match = 
        o.orderNumber.toLowerCase().includes(q) ||
        o.patientName.toLowerCase().includes(q) ||
        o.doctorName.toLowerCase().includes(q) ||
        o.clinicName.toLowerCase().includes(q) ||
        o.restoration.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });
});

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredOrders.value.slice(start, start + pageSize);
});

const deleteOrder = (id: string) => {
  if (confirm('Are you sure you want to delete this order?')) {
    store.deleteOrder(id);
  }
};
</script>
