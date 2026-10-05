<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Patients Directory
        </h1>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Search patient records, view past prescriptions, and track active cases.
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
      searchPlaceholder="Search patients by name, email, phone, doctor, clinic..."
    />

    <!-- Empty State -->
    <EmptyState
      v-if="table.filteredData.value.length === 0"
      title="No patients found"
      description="No patient profiles match your current search or filter criteria."
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
                  v-if="table.isColVisible('name')"
                  field="name"
                  label="Patient Name"
                  :sortField="table.sortField.value"
                  :sortDirection="table.sortDirection.value"
                  @sort="table.handleSort"
                  class="py-3.5 px-4"
                />
                <SortTh
                  v-if="table.isColVisible('gender')"
                  field="gender"
                  label="Gender / DOB"
                  :sortField="table.sortField.value"
                  :sortDirection="table.sortDirection.value"
                  @sort="table.handleSort"
                  class="py-3.5 px-4"
                />
                <SortTh
                  v-if="table.isColVisible('clinicName')"
                  field="clinicName"
                  label="Clinic"
                  :sortField="table.sortField.value"
                  :sortDirection="table.sortDirection.value"
                  @sort="table.handleSort"
                  class="py-3.5 px-4"
                />
                <SortTh
                  v-if="table.isColVisible('doctorName')"
                  field="doctorName"
                  label="Doctor"
                  :sortField="table.sortField.value"
                  :sortDirection="table.sortDirection.value"
                  @sort="table.handleSort"
                  class="py-3.5 px-4"
                />
                <SortTh
                  v-if="table.isColVisible('phone')"
                  field="phone"
                  label="Phone / Email"
                  :sortField="table.sortField.value"
                  :sortDirection="table.sortDirection.value"
                  @sort="table.handleSort"
                  class="py-3.5 px-4"
                />
                <SortTh
                  v-if="table.isColVisible('ordersCount')"
                  field="ordersCount"
                  label="Total Cases"
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
                <th v-if="table.isColVisible('actions')" class="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              <tr
                v-for="p in table.paginatedData.value"
                :key="p.id"
                class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <td v-if="table.isColVisible('name')" class="py-3.5 px-4">
                  <div class="flex items-center gap-2.5">
                    <Avatar :name="p.name" size="sm" status="online" />
                    <span class="font-bold text-slate-900 dark:text-white">{{ p.name }}</span>
                  </div>
                </td>
                <td v-if="table.isColVisible('gender')" class="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                  <span>{{ p.gender === 'F' ? 'Female' : 'Male' }}</span>
                  <span class="text-slate-400 block text-[11px] font-mono">DOB: {{ p.dob }}</span>
                </td>
                <td v-if="table.isColVisible('clinicName')" class="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                  {{ p.clinicName }}
                </td>
                <td v-if="table.isColVisible('doctorName')" class="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                  {{ p.doctorName }}
                </td>
                <td v-if="table.isColVisible('phone')" class="py-3.5 px-4 font-mono text-slate-500">
                  <div>{{ p.phone }}</div>
                  <div class="text-[11px] text-slate-400">{{ p.email }}</div>
                </td>
                <td v-if="table.isColVisible('ordersCount')" class="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                  {{ p.ordersCount }}
                </td>
                <td v-if="table.isColVisible('status')" class="py-3.5 px-4">
                  <StatusBadge :status="p.status" size="sm" />
                </td>
                <td v-if="table.isColVisible('actions')" class="py-3.5 px-4 text-right">
                  <router-link
                    :to="`/patients/${p.id}`"
                    class="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    <span>Profile</span>
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
            v-for="p in table.paginatedData.value"
            :key="p.id"
            class="p-5 rounded-3xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/40 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                  <Avatar :name="p.name" size="md" status="online" />
                  <div>
                    <h3 class="font-bold text-sm text-slate-900 dark:text-white">{{ p.name }}</h3>
                    <span class="text-xs text-slate-400">{{ p.gender === 'F' ? 'Female' : 'Male' }} • Born {{ p.dob }}</span>
                  </div>
                </div>
                <StatusBadge :status="p.status" size="sm" />
              </div>

              <div class="space-y-2 text-xs text-slate-600 dark:text-slate-300 py-3 border-y border-slate-100 dark:border-slate-800/80">
                <div class="flex items-center gap-2 truncate">
                  <Building2 class="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span class="truncate">{{ p.clinicName }}</span>
                </div>
                <div class="flex items-center gap-2 truncate">
                  <Stethoscope class="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span class="truncate">{{ p.doctorName }}</span>
                </div>
                <div class="flex items-center gap-2 truncate">
                  <Phone class="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span class="truncate font-mono">{{ p.phone }}</span>
                </div>
              </div>
            </div>

            <div class="mt-4 pt-3 flex items-center justify-between text-xs">
              <span class="font-bold text-slate-500 dark:text-slate-400">
                {{ p.ordersCount }} Total Case(s)
              </span>
              <router-link
                :to="`/patients/${p.id}`"
                class="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                <span>View Profile</span>
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
import { Building2, Stethoscope, Phone, ChevronRight, List, LayoutGrid } from 'lucide-vue-next';
import { useDentalStore } from '@/stores/dental';
import Avatar from '@/components/ui/Avatar.vue';
import StatusBadge from '@/components/ui/StatusBadge.vue';
import EmptyState from '@/components/ui/EmptyState.vue';
import Pagination from '@/components/ui/Pagination.vue';
import TableTools from '@/components/ui/TableTools.vue';
import SortTh from '@/components/ui/SortTh.vue';
import { useAdvancedTable, type ColumnConfig } from '@/composables/useAdvancedTable';

const store = useDentalStore();
const viewMode = ref<'table' | 'grid'>('table');

const PATIENT_COLUMNS: ColumnConfig[] = [
  { id: 'name', label: 'Patient Name', defaultVisible: true },
  { id: 'gender', label: 'Gender / DOB', defaultVisible: true },
  { id: 'clinicName', label: 'Clinic', defaultVisible: true },
  { id: 'doctorName', label: 'Doctor', defaultVisible: true },
  { id: 'phone', label: 'Phone / Email', defaultVisible: true },
  { id: 'ordersCount', label: 'Total Cases', defaultVisible: true },
  { id: 'status', label: 'Status', defaultVisible: true },
  { id: 'actions', label: 'Actions', defaultVisible: true },
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' },
];

const allPatients = computed(() => store.patients);

const table = useAdvancedTable({
  data: allPatients,
  columns: PATIENT_COLUMNS,
  searchFields: ['name', 'email', 'phone', 'clinicName', 'doctorName'],
  filterConfigs: [
    { key: 'status', label: 'Status', options: STATUS_OPTIONS, defaultValue: 'all' },
  ],
  initialSortField: 'name',
  initialSortDirection: 'asc',
  pageSize: 9,
});
</script>
