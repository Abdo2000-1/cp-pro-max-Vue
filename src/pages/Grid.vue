<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { 
  Layers, 
  Clock, 
  Activity, 
  AlertCircle, 
  ChevronDown, 
  ChevronRight, 
  ArrowUpRight,
  Download
} from 'lucide-vue-next';
import Button from '@/components/ui/Button.vue';
import SearchInput from '@/components/ui/SearchInput.vue';
import Select from '@/components/ui/Select.vue';
import StatusBadge from '@/components/ui/StatusBadge.vue';
import PriorityBadge from '@/components/ui/PriorityBadge.vue';
import Pagination from '@/components/ui/Pagination.vue';
import { formatDate } from '@/utils/format';
import { useDentalStore } from '@/stores/dental';

const router = useRouter();
const dentalStore = useDentalStore();

type GridTab = 'orders' | 'patients' | 'services' | 'workflow';

interface ServiceGridRow {
  id: string;
  serviceName: string;
  category: string;
  orders: number;
  completedToday: number;
  utilization: number;
  owner: string;
  status: 'Active' | 'Under Review' | 'Paused';
  updated: string;
}

const SERVICES_DATA: ServiceGridRow[] = [
  { id: 'srv-1', serviceName: 'Zirconia Monolithic Crown', category: 'Crown & Bridge', orders: 48, completedToday: 14, utilization: 85, owner: 'CAD Dept', status: 'Active', updated: '2025-02-14' },
  { id: 'srv-2', serviceName: 'E-max Aesthetic Veneer', category: 'Aesthetic', orders: 22, completedToday: 8, utilization: 64, owner: 'Ceramics Dept', status: 'Active', updated: '2025-02-15' },
  { id: 'srv-3', serviceName: 'Titanium Custom Abutment', category: 'Implantology', orders: 19, completedToday: 5, utilization: 72, owner: 'Milling Team', status: 'Active', updated: '2025-02-13' },
  { id: 'srv-4', serviceName: 'Full Arch Surgical Guide', category: 'Guided Surgery', orders: 11, completedToday: 3, utilization: 90, owner: 'Planning Lab', status: 'Active', updated: '2025-02-16' },
  { id: 'srv-5', serviceName: 'Clear Aligner Treatment Plan', category: 'Orthodontics', orders: 34, completedToday: 11, utilization: 58, owner: 'Ortho Studio', status: 'Active', updated: '2025-02-12' },
  { id: 'srv-6', serviceName: 'PMMA Long-term Provisional', category: 'Provisional', orders: 15, completedToday: 7, utilization: 45, owner: 'Milling Team', status: 'Paused', updated: '2025-02-10' },
];

const activeTab = ref<GridTab>('orders');
const searchTerm = ref('');
const statusFilter = ref('all');
const expandedWorkflows = ref<Record<string, boolean>>({ 'ord-1': true });
const page = ref(1);
const pageSize = 8;

const orders = computed(() => dentalStore.getOrders());
const patients = computed(() => dentalStore.getPatients());

// Metrics
const totalOrders = computed(() => orders.value.length);
const highPriorityCount = computed(() => orders.value.filter((o) => o.priority === 'High' || o.priority === 'Urgent').length);
const activeServicesCount = computed(() => SERVICES_DATA.filter((s) => s.status === 'Active').length);
const attentionCount = computed(() => orders.value.filter((o) => o.status === 'Review' || o.priority === 'Urgent').length);

// Filter Orders
const filteredOrders = computed(() => {
  return orders.value.filter((o) => {
    const term = searchTerm.value.toLowerCase();
    const matchesSearch = 
      o.orderNumber.toLowerCase().includes(term) ||
      o.patientName.toLowerCase().includes(term) ||
      o.doctorName.toLowerCase().includes(term) ||
      o.restoration.toLowerCase().includes(term);
    const matchesStatus = statusFilter.value === 'all' || o.status === statusFilter.value;
    return matchesSearch && matchesStatus;
  });
});

// Filter Patients
const filteredPatients = computed(() => {
  return patients.value.filter((p) => {
    const term = searchTerm.value.toLowerCase();
    const matchesSearch = 
      p.name.toLowerCase().includes(term) ||
      p.doctorName.toLowerCase().includes(term) ||
      p.clinicName.toLowerCase().includes(term) ||
      (p.email || '').toLowerCase().includes(term);
    const matchesStatus = statusFilter.value === 'all' || p.status === statusFilter.value;
    return matchesSearch && matchesStatus;
  });
});

// Filter Services
const filteredServices = computed(() => {
  return SERVICES_DATA.filter((s) => {
    const term = searchTerm.value.toLowerCase();
    const matchesSearch = 
      s.serviceName.toLowerCase().includes(term) ||
      s.category.toLowerCase().includes(term) ||
      s.owner.toLowerCase().includes(term);
    const matchesStatus = statusFilter.value === 'all' || s.status === statusFilter.value;
    return matchesSearch && matchesStatus;
  });
});

function toggleWorkflowExpand(orderId: string) {
  expandedWorkflows.value[orderId] = !expandedWorkflows.value[orderId];
}

function exportTab() {
  const csv = `Entity Grid Export - ${activeTab.value.toUpperCase()}\nGenerated: ${new Date().toISOString()}`;
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `grid_${activeTab.value}_export.csv`;
  a.click();
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <div class="flex items-center gap-2">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Enterprise Grid Hub</h1>
          <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
            Vue 3 Dynamic Grid
          </span>
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Unified reactive data grid with cross-entity navigation, expandable matrices, and multi-view synchronization
        </p>
      </div>
      <div class="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          class="gap-2"
          @click="exportTab"
        >
          <Download class="w-4 h-4" />
          Export Tab
        </Button>
        <Button size="sm" @click="router.push('/orders/create')">
          + New Order
        </Button>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div>
          <div class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Work Orders</div>
          <div class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ totalOrders }}</div>
          <div class="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5 font-medium">All active workflows</div>
        </div>
        <div class="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400">
          <Layers class="w-6 h-6" />
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div>
          <div class="text-xs font-medium text-gray-500 dark:text-gray-400">High Priority Orders</div>
          <div class="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{{ highPriorityCount }}</div>
          <div class="text-xs text-amber-600 dark:text-amber-400 mt-0.5 font-medium">Expedited production</div>
        </div>
        <div class="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-xl text-amber-600 dark:text-amber-400">
          <Clock class="w-6 h-6" />
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div>
          <div class="text-xs font-medium text-gray-500 dark:text-gray-400">Active Lab Services</div>
          <div class="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{{ activeServicesCount }}</div>
          <div class="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5 font-medium">Across all departments</div>
        </div>
        <div class="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400">
          <Activity class="w-6 h-6" />
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div>
          <div class="text-xs font-medium text-gray-500 dark:text-gray-400">Requires Review</div>
          <div class="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">{{ attentionCount }}</div>
          <div class="text-xs text-rose-500 mt-0.5 font-medium">Pending technician sign-off</div>
        </div>
        <div class="p-3 bg-rose-50 dark:bg-rose-900/30 rounded-xl text-rose-600 dark:text-rose-400">
          <AlertCircle class="w-6 h-6" />
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex border-b border-gray-200 dark:border-gray-800 gap-2">
      <button
        v-for="tab in [
          { id: 'orders', label: 'Orders Grid', count: filteredOrders.length },
          { id: 'patients', label: 'Patients Directory', count: filteredPatients.length },
          { id: 'services', label: 'Services Catalog', count: filteredServices.length },
          { id: 'workflow', label: 'Workflow Matrix', count: orders.length }
        ]"
        :key="tab.id"
        @click="activeTab = tab.id as GridTab; page = 1"
        :class="[
          'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
          activeTab === tab.id
            ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
            : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
        ]"
      >
        <span>{{ tab.label }}</span>
        <span :class="[
          'px-2 py-0.5 rounded-full text-xs',
          activeTab === tab.id
            ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-semibold'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
        ]">
          {{ tab.count }}
        </span>
      </button>
    </div>

    <!-- Filter and Search -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 flex flex-col sm:flex-row gap-4">
      <SearchInput
        v-model="searchTerm"
        :placeholder="`Search ${activeTab}...`"
        class="flex-1"
      />
      <Select
        v-if="activeTab === 'orders'"
        v-model="statusFilter"
        :options="[
          { value: 'all', label: 'All Stages' },
          { value: 'New', label: 'New' },
          { value: 'Review', label: 'Review' },
          { value: 'Design', label: 'Design' },
          { value: 'Production', label: 'Production' },
          { value: 'Quality Check', label: 'Quality Check' },
          { value: 'Completed', label: 'Completed' },
        ]"
        class="w-full sm:w-48"
      />
    </div>

    <!-- Tab 1: Orders Grid -->
    <div v-if="activeTab === 'orders'" class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <table class="w-full text-left text-xs text-gray-500 dark:text-gray-400">
        <thead class="text-[11px] uppercase bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-800">
          <tr>
            <th class="px-3.5 py-3 font-semibold">Order #</th>
            <th class="px-3.5 py-3 font-semibold">Patient</th>
            <th class="px-3.5 py-3 font-semibold hidden md:table-cell">Doctor & Clinic</th>
            <th class="px-3.5 py-3 font-semibold hidden sm:table-cell">Service</th>
            <th class="px-3.5 py-3 font-semibold">Stage</th>
            <th class="px-3.5 py-3 font-semibold hidden sm:table-cell">Priority</th>
            <th class="px-3.5 py-3 font-semibold hidden lg:table-cell">Due Date</th>
            <th class="px-3.5 py-3 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
          <tr 
            v-for="order in filteredOrders.slice((page - 1) * pageSize, page * pageSize)" 
            :key="order.id" 
            class="hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
          >
            <td 
              class="px-3.5 py-3 font-mono font-medium text-emerald-600 dark:text-emerald-400 cursor-pointer hover:underline"
              @click="router.push(`/orders/${order.id}`)"
            >
              {{ order.orderNumber }}
            </td>
            <td class="px-3.5 py-3 font-semibold text-gray-900 dark:text-white">
              {{ order.patientName }}
            </td>
            <td class="px-3.5 py-3 hidden md:table-cell">
              <div class="text-gray-900 dark:text-gray-200 font-medium">{{ order.doctorName }}</div>
              <div class="text-[10px] text-gray-400">{{ order.clinicName }}</div>
            </td>
            <td class="px-3.5 py-3 hidden sm:table-cell">
              <span class="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-[11px] font-medium">
                {{ order.restoration }} ({{ order.units }}u)
              </span>
            </td>
            <td class="px-3.5 py-3">
              <StatusBadge :status="order.status" />
            </td>
            <td class="px-3.5 py-3 hidden sm:table-cell">
              <PriorityBadge :priority="order.priority" />
            </td>
            <td class="px-3.5 py-3 hidden lg:table-cell text-gray-500">
              {{ formatDate(order.dueDate) }}
            </td>
            <td class="px-3.5 py-3 text-right">
              <Button size="sm" variant="ghost" @click="router.push(`/orders/${order.id}`)">
                View
                <ArrowUpRight class="w-3.5 h-3.5 ml-1" />
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Tab 2: Patients Directory -->
    <div v-if="activeTab === 'patients'" class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <table class="w-full text-left text-xs text-gray-500 dark:text-gray-400">
        <thead class="text-[11px] uppercase bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-800">
          <tr>
            <th class="px-3.5 py-3 font-semibold">Patient Name</th>
            <th class="px-3.5 py-3 font-semibold hidden sm:table-cell">Doctor</th>
            <th class="px-3.5 py-3 font-semibold hidden md:table-cell">Clinic</th>
            <th class="px-3.5 py-3 font-semibold hidden lg:table-cell">Contact</th>
            <th class="px-3.5 py-3 font-semibold">Status</th>
            <th class="px-3.5 py-3 font-semibold hidden sm:table-cell">Orders</th>
            <th class="px-3.5 py-3 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
          <tr 
            v-for="pt in filteredPatients.slice((page - 1) * pageSize, page * pageSize)" 
            :key="pt.id" 
            class="hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
          >
            <td class="px-3.5 py-3">
              <div 
                class="font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-emerald-600"
                @click="router.push(`/patients/${pt.id}`)"
              >
                {{ pt.name }}
              </div>
              <div class="text-[10px] text-gray-400">DOB: {{ pt.dob }} ({{ pt.gender }})</div>
            </td>
            <td class="px-3.5 py-3 hidden sm:table-cell text-gray-900 dark:text-gray-200 font-medium">
              {{ pt.doctorName?.replace('Dr. ', '') }}
            </td>
            <td class="px-3.5 py-3 hidden md:table-cell text-gray-600 dark:text-gray-300">
              {{ pt.clinicName }}
            </td>
            <td class="px-3.5 py-3 hidden lg:table-cell text-[11px]">
              <div>{{ pt.email || 'No email' }}</div>
              <div class="text-gray-400">{{ pt.phone || 'No phone' }}</div>
            </td>
            <td class="px-3.5 py-3">
              <span :class="[
                'px-2 py-0.5 rounded-full text-[10px] font-medium',
                pt.status === 'Active' 
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              ]">
                {{ pt.status }}
              </span>
            </td>
            <td class="px-3.5 py-3 hidden sm:table-cell font-medium text-gray-900 dark:text-white">
              {{ pt.ordersCount || 0 }}
            </td>
            <td class="px-3.5 py-3 text-right">
              <Button size="sm" variant="ghost" @click="router.push(`/patients/${pt.id}`)">
                Details
              </Button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Tab 3: Services Catalog -->
    <div v-if="activeTab === 'services'" class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <table class="w-full text-left text-xs text-gray-500 dark:text-gray-400">
        <thead class="text-[11px] uppercase bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-800">
          <tr>
            <th class="px-3.5 py-3 font-semibold">Service Name</th>
            <th class="px-3.5 py-3 font-semibold hidden sm:table-cell">Category</th>
            <th class="px-3.5 py-3 font-semibold">Active</th>
            <th class="px-3.5 py-3 font-semibold text-emerald-600">Done</th>
            <th class="px-3.5 py-3 font-semibold hidden md:table-cell">Utilization</th>
            <th class="px-3.5 py-3 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
          <tr 
            v-for="srv in filteredServices" 
            :key="srv.id" 
            class="hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
          >
            <td class="px-3.5 py-3 font-semibold text-gray-900 dark:text-white">
              {{ srv.serviceName }}
            </td>
            <td class="px-3.5 py-3 hidden sm:table-cell text-gray-600 dark:text-gray-300">
              {{ srv.category }}
            </td>
            <td class="px-3.5 py-3 font-bold text-gray-900 dark:text-white">
              {{ srv.orders }}
            </td>
            <td class="px-3.5 py-3 text-emerald-600 dark:text-emerald-400 font-bold">
              +{{ srv.completedToday }}
            </td>
            <td class="px-3.5 py-3 hidden md:table-cell">
              <div class="flex items-center gap-2">
                <div class="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div 
                    class="h-1.5 rounded-full"
                    :class="srv.utilization > 80 ? 'bg-amber-500' : 'bg-emerald-600'"
                    :style="{ width: `${srv.utilization}%` }"
                  />
                </div>
                <span class="text-[10px] text-gray-500">{{ srv.utilization }}%</span>
              </div>
            </td>
            <td class="px-3.5 py-3">
              <span :class="[
                'px-2 py-0.5 rounded-full text-[10px] font-medium',
                srv.status === 'Active'
                  ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                  : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
              ]">
                {{ srv.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Tab 4: Workflow Matrix -->
    <div v-if="activeTab === 'workflow'" class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <table class="w-full text-left text-xs text-gray-500 dark:text-gray-400">
        <thead class="text-[11px] uppercase bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-800">
          <tr>
            <th class="px-2 py-3 w-8"></th>
            <th class="px-3 py-3 font-semibold">Order #</th>
            <th class="px-3 py-3 font-semibold">Patient</th>
            <th class="px-3 py-3 font-semibold hidden md:table-cell">Assigned Tech</th>
            <th class="px-3 py-3 font-semibold">Stage</th>
            <th class="px-3 py-3 font-semibold hidden sm:table-cell">Priority</th>
            <th class="px-3 py-3 font-semibold hidden lg:table-cell">Pipeline Health</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
          <template v-for="order in orders" :key="order.id">
            <tr 
              class="hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors cursor-pointer select-none"
              @click="toggleWorkflowExpand(order.id)"
            >
              <td class="px-2 py-3 text-center text-gray-400">
                <ChevronDown v-if="expandedWorkflows[order.id]" class="w-4 h-4 text-emerald-600" />
                <ChevronRight v-else class="w-4 h-4" />
              </td>
              <td class="px-3 py-3 font-semibold text-emerald-600 dark:text-emerald-400">
                {{ order.orderNumber }}
              </td>
              <td class="px-3 py-3 font-medium text-gray-900 dark:text-white">
                {{ order.patientName }}
              </td>
              <td class="px-3 py-3 hidden md:table-cell text-gray-700 dark:text-gray-300 text-[11px]">
                T. Anderson (Lead Tech)
              </td>
              <td class="px-3 py-3">
                <StatusBadge :status="order.status" />
              </td>
              <td class="px-3 py-3 hidden sm:table-cell">
                <PriorityBadge :priority="order.priority" />
              </td>
              <td class="px-3 py-3 hidden lg:table-cell">
                <span :class="[
                  'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium',
                  order.priority === 'Urgent'
                    ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300'
                    : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                ]">
                  {{ order.priority === 'Urgent' ? 'Attention' : 'On Track' }}
                </span>
              </td>
            </tr>

            <!-- Expandable Sub-Orders Subtable -->
            <tr v-if="expandedWorkflows[order.id]" class="bg-emerald-50/40 dark:bg-emerald-950/20 border-b border-gray-200 dark:border-gray-800">
              <td colspan="7" class="p-4 pl-12">
                <div class="bg-white dark:bg-gray-800/80 rounded-lg p-3 border border-emerald-100 dark:border-emerald-900/40">
                  <div class="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center justify-between">
                    <span>Sub-Order Deliverables for {{ order.orderNumber }}</span>
                    <button 
                      @click.stop="router.push(`/orders/${order.id}`)"
                      class="text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      View Full Order Specs →
                    </button>
                  </div>
                  <table class="w-full text-xs text-left">
                    <thead class="text-gray-500 uppercase bg-gray-50 dark:bg-gray-900/60">
                      <tr>
                        <th class="py-2 px-3">Item #</th>
                        <th class="py-2 px-3">Service Type</th>
                        <th class="py-2 px-3">Shade / Material</th>
                        <th class="py-2 px-3">Sub-Stage</th>
                        <th class="py-2 px-3">Target ETA</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                      <tr>
                        <td class="py-2 px-3 font-mono font-medium text-gray-900 dark:text-white">SO-101</td>
                        <td class="py-2 px-3">{{ order.restoration }} Design Model</td>
                        <td class="py-2 px-3">{{ order.shade || 'A2' }} • Zirconia</td>
                        <td class="py-2 px-3 text-emerald-600 font-medium">Completed</td>
                        <td class="py-2 px-3 text-gray-500">Dec 12, 14:00</td>
                      </tr>
                      <tr>
                        <td class="py-2 px-3 font-mono font-medium text-gray-900 dark:text-white">SO-102</td>
                        <td class="py-2 px-3">Milling & Sintering Block</td>
                        <td class="py-2 px-3">{{ order.shade || 'A2' }} • Multi-layered</td>
                        <td class="py-2 px-3 text-emerald-600 font-medium">In Production</td>
                        <td class="py-2 px-3 text-gray-500">Dec 14, 18:00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="activeTab === 'orders' && filteredOrders.length > pageSize">
      <Pagination
        :current-page="page"
        :total-items="filteredOrders.length"
        :page-size="pageSize"
        @update:current-page="(p: number) => page = p"
      />
    </div>
  </div>
</template>
