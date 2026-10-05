<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Documents & 3D Scan Assets
        </h1>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Intraoral STL scans, patient photos, lab prescriptions, and CBCT datasets.
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
      searchPlaceholder="Search files by filename, category, doctor..."
    />

    <!-- Empty State -->
    <EmptyState
      v-if="table.filteredData.value.length === 0"
      title="No documents found"
      description="No file records match your current filter or search criteria."
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
                  label="Document Name"
                  :sortField="table.sortField.value"
                  :sortDirection="table.sortDirection.value"
                  @sort="table.handleSort"
                  class="py-3.5 px-4"
                />
                <SortTh
                  v-if="table.isColVisible('category')"
                  field="category"
                  label="Category"
                  :sortField="table.sortField.value"
                  :sortDirection="table.sortDirection.value"
                  @sort="table.handleSort"
                  class="py-3.5 px-4"
                />
                <SortTh
                  v-if="table.isColVisible('size')"
                  field="size"
                  label="File Size"
                  :sortField="table.sortField.value"
                  :sortDirection="table.sortDirection.value"
                  @sort="table.handleSort"
                  class="py-3.5 px-4"
                />
                <SortTh
                  v-if="table.isColVisible('doctor')"
                  field="doctor"
                  label="Doctor"
                  :sortField="table.sortField.value"
                  :sortDirection="table.sortDirection.value"
                  @sort="table.handleSort"
                  class="py-3.5 px-4"
                />
                <SortTh
                  v-if="table.isColVisible('date')"
                  field="date"
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
                v-for="d in table.paginatedData.value"
                :key="d.id"
                class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <td v-if="table.isColVisible('name')" class="py-3.5 px-4">
                  <div class="flex items-center gap-2.5">
                    <div class="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                      <FileText class="w-4 h-4" />
                    </div>
                    <span class="font-bold text-slate-900 dark:text-white">{{ d.name }}</span>
                  </div>
                </td>
                <td v-if="table.isColVisible('category')" class="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                  <span class="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
                    {{ d.category }}
                  </span>
                </td>
                <td v-if="table.isColVisible('size')" class="py-3.5 px-4 font-mono text-slate-500">
                  {{ d.size }}
                </td>
                <td v-if="table.isColVisible('doctor')" class="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                  {{ d.doctor }}
                </td>
                <td v-if="table.isColVisible('date')" class="py-3.5 px-4 font-mono text-slate-500">
                  {{ d.date }}
                </td>
                <td v-if="table.isColVisible('actions')" class="py-3.5 px-4 text-right">
                  <button
                    type="button"
                    @click="downloadDoc(d.name)"
                    class="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                    title="Download File"
                  >
                    <Download class="w-4 h-4" />
                  </button>
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
            v-for="d in table.paginatedData.value"
            :key="d.id"
            class="p-5 rounded-3xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between gap-3"
          >
            <div class="flex items-start gap-3 truncate">
              <div class="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                <FileText class="w-6 h-6" />
              </div>
              <div class="truncate">
                <h3 class="font-bold text-sm text-slate-900 dark:text-white truncate">{{ d.name }}</h3>
                <span class="text-xs text-slate-400 block">{{ d.category }} • {{ d.size }}</span>
                <span class="text-[11px] text-slate-500 mt-1 block">{{ d.doctor }} • {{ d.date }}</span>
              </div>
            </div>

            <button
              type="button"
              @click="downloadDoc(d.name)"
              class="p-2 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
              title="Download File"
            >
              <Download class="w-4 h-4" />
            </button>
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
import { ref } from 'vue';
import { FileText, Download, List, LayoutGrid } from 'lucide-vue-next';
import EmptyState from '@/components/ui/EmptyState.vue';
import Pagination from '@/components/ui/Pagination.vue';
import TableTools from '@/components/ui/TableTools.vue';
import SortTh from '@/components/ui/SortTh.vue';
import { useAdvancedTable, type ColumnConfig } from '@/composables/useAdvancedTable';
import { sound } from '@/utils/sound';

const viewMode = ref<'table' | 'grid'>('table');

const rawDocuments = ref([
  { id: 'doc-1', name: 'Maxilla_FullArch_Scan.stl', category: 'Scan Files', size: '14.8 MB', date: '2026-09-28', doctor: 'Dr. Allison Park' },
  { id: 'doc-2', name: 'Mandible_Antagonist.ply', category: 'Scan Files', size: '9.2 MB', date: '2026-09-28', doctor: 'Dr. Allison Park' },
  { id: 'doc-3', name: 'Digital_Rx_Prescription_#1042.pdf', category: 'Prescriptions', size: '1.4 MB', date: '2026-09-27', doctor: 'Dr. Marcus Webb' },
  { id: 'doc-4', name: 'CBCT_SurgicalGuide_DICOM.zip', category: 'Scan Files', size: '142 MB', date: '2026-09-25', doctor: 'Dr. Kevin Murphy' },
  { id: 'doc-5', name: 'Smile_Aesthetic_Photo_Front.jpg', category: 'Patient Photos', size: '3.6 MB', date: '2026-09-24', doctor: 'Dr. Sophia Lin' },
  { id: 'doc-6', name: 'Lab_Invoice_INV-1039.pdf', category: 'Invoices', size: '280 KB', date: '2026-09-22', doctor: 'Dr. Allison Park' },
]);

const DOC_COLUMNS: ColumnConfig[] = [
  { id: 'name', label: 'Document Name', defaultVisible: true },
  { id: 'category', label: 'Category', defaultVisible: true },
  { id: 'size', label: 'File Size', defaultVisible: true },
  { id: 'doctor', label: 'Doctor', defaultVisible: true },
  { id: 'date', label: 'Date', defaultVisible: true },
  { id: 'actions', label: 'Actions', defaultVisible: true },
];

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All Categories' },
  { value: 'Scan Files', label: 'Scan Files' },
  { value: 'Prescriptions', label: 'Prescriptions' },
  { value: 'Patient Photos', label: 'Patient Photos' },
  { value: 'Invoices', label: 'Invoices' },
];

const table = useAdvancedTable({
  data: rawDocuments,
  columns: DOC_COLUMNS,
  searchFields: ['name', 'category', 'doctor', 'date'],
  filterConfigs: [
    { key: 'category', label: 'Category', options: CATEGORY_OPTIONS, defaultValue: 'all' }
  ],
  initialSortField: 'date',
  initialSortDirection: 'desc',
  pageSize: 9,
});

const downloadDoc = (name: string) => {
  sound.playClick();
  alert(`Downloading document: ${name}`);
};
</script>
