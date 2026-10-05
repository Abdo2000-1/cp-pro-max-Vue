<template>
  <div :class="['space-y-2.5', props.class]">
    <!-- Main Toolbar Container -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-xs flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between transition-all">
      
      <!-- Left Side: Search + Advanced Filters -->
      <div class="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
        <!-- Live Search Box -->
        <div class="relative min-w-[220px] max-w-sm flex-1">
          <Search class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            :value="searchTerm"
            @input="onSearchInput"
            :placeholder="searchPlaceholder"
            class="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all font-medium"
          />
          <button
            v-if="searchTerm"
            type="button"
            @click="clearSearch"
            class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors"
            title="Clear search"
          >
            <X class="w-3.5 h-3.5" />
          </button>
        </div>

        <!-- Filter Dropdowns -->
        <div v-if="filters.length > 0" class="flex flex-wrap items-center gap-2">
          <div
            v-for="flt in filters"
            :key="flt.id"
            class="relative inline-flex items-center"
          >
            <select
              :value="flt.value"
              @change="flt.onChange(($event.target as HTMLSelectElement).value)"
              :class="[
                'appearance-none pl-3 pr-7 py-2 text-xs rounded-xl border font-medium cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/30',
                flt.value !== 'all'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-semibold'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              ]"
            >
              <option
                v-for="opt in flt.options"
                :key="opt.value"
                :value="opt.value"
                class="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
              >
                {{ opt.label }}
              </option>
            </select>
            <ChevronDown class="w-3.5 h-3.5 text-slate-400 absolute right-2.5 pointer-events-none" />
          </div>

          <!-- Reset Filters Button -->
          <button
            v-if="isFiltered"
            type="button"
            @click="onResetFilters"
            class="inline-flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors border border-rose-200 dark:border-rose-900/40"
            title="Reset search and filters"
          >
            <RotateCcw class="w-3.5 h-3.5" />
            <span class="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      <!-- Right Side: Column Selector & Extra Actions -->
      <div class="flex items-center gap-2 self-end lg:self-center shrink-0">
        <!-- Extra Actions Slot / Right Actions -->
        <slot name="extraActions"></slot>
        <slot name="rightActions"></slot>

        <!-- Columns Visibility Popover Button -->
        <div v-if="columns.length > 0" class="relative" ref="popoverRef">
          <button
            type="button"
            @click="showColumnsPopover = !showColumnsPopover"
            :class="[
              'inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer',
              showColumnsPopover
                ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white ring-2 ring-emerald-500/20'
                : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            ]"
            title="Configure table columns"
          >
            <Columns3 class="w-3.5 h-3.5 text-slate-500" />
            <span>Columns</span>
            <span class="px-1.5 py-0.5 rounded-md text-[10px] bg-slate-200 dark:bg-slate-700 font-mono font-bold text-slate-700 dark:text-slate-300">
              {{ visibleCount }}/{{ columns.length }}
            </span>
            <ChevronDown class="w-3 h-3 text-slate-400 transition-transform" :class="{ 'rotate-180': showColumnsPopover }" />
          </button>

          <!-- Popover Modal -->
          <div
            v-if="showColumnsPopover"
            class="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 p-3 space-y-2.5 animate-in fade-in zoom-in-95 duration-100"
          >
            <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 text-xs">
              <span class="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <SlidersHorizontal class="w-3.5 h-3.5 text-emerald-500" />
                Visible Columns
              </span>
              <div class="flex items-center gap-1.5 text-[11px]">
                <button
                  type="button"
                  @click="onSelectAllColumns"
                  class="text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                >
                  All
                </button>
                <span class="text-slate-300 dark:text-slate-700">•</span>
                <button
                  type="button"
                  @click="onResetColumns"
                  class="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-medium"
                >
                  Reset
                </button>
              </div>
            </div>

            <!-- List of columns with toggles -->
            <div class="max-h-60 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
              <label
                v-for="col in columns"
                :key="col.id"
                class="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer select-none text-xs transition-colors"
              >
                <input
                  type="checkbox"
                  :checked="col.visible !== false"
                  @change="onToggleColumn(col.id)"
                  class="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:border-slate-700 dark:bg-slate-800 cursor-pointer"
                />
                <span
                  :class="[
                    'truncate font-medium',
                    col.visible !== false
                      ? 'text-slate-800 dark:text-slate-200'
                      : 'text-slate-400 dark:text-slate-500 line-through'
                  ]"
                >
                  {{ col.label }}
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Feedback / Results Counter Strip (optional) -->
    <div
      v-if="totalItems !== undefined"
      class="flex items-center justify-between px-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium"
    >
      <div class="flex items-center gap-2">
        <span>Showing <strong>{{ filteredItems ?? totalItems }}</strong> of <strong>{{ totalItems }}</strong> records</span>
        <span v-if="isFiltered" class="text-emerald-600 dark:text-emerald-400 font-semibold">• Filters Active</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { 
  Search, 
  X, 
  Columns3, 
  ChevronDown, 
  RotateCcw, 
  SlidersHorizontal 
} from 'lucide-vue-next';

export interface TableColumnOption {
  id: string;
  label: string;
  visible?: boolean;
}

export interface TableFilterSelect {
  id: string;
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  icon?: any;
}

interface Props {
  table?: any;
  searchTerm?: string;
  searchPlaceholder?: string;
  filters?: TableFilterSelect[];
  columns?: TableColumnOption[];
  totalItems?: number;
  filteredItems?: number;
  activeFiltersCount?: number;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  searchPlaceholder: 'Search records...',
  class: '',
});

const emit = defineEmits<{
  (e: 'update:searchTerm', val: string): void;
  (e: 'search', val: string): void;
  (e: 'resetFilters'): void;
  (e: 'toggleColumn', id: string): void;
  (e: 'selectAllColumns'): void;
  (e: 'resetColumns'): void;
}>();

const showColumnsPopover = ref(false);
const popoverRef = ref<HTMLDivElement | null>(null);

const searchTerm = computed(() => props.searchTerm ?? props.table?.searchTerm?.value ?? '');
const filters = computed<TableFilterSelect[]>(() => props.filters ?? props.table?.filterSelects?.value ?? []);
const columns = computed<TableColumnOption[]>(() => props.columns ?? props.table?.columnsList?.value ?? []);
const totalItems = computed(() => props.totalItems ?? props.table?.totalItems?.value);
const filteredItems = computed(() => props.filteredItems ?? props.table?.filteredItems?.value);
const activeFiltersCount = computed(() => props.activeFiltersCount ?? props.table?.activeFiltersCount?.value ?? 0);

const visibleCount = computed(() => columns.value.filter(c => c.visible !== false).length);
const isFiltered = computed(() => Boolean(searchTerm.value || activeFiltersCount.value > 0));

const onSearchInput = (e: Event) => {
  const val = (e.target as HTMLInputElement).value;
  if (props.table) {
    props.table.searchTerm.value = val;
    props.table.currentPage.value = 1;
  }
  emit('update:searchTerm', val);
  emit('search', val);
};

const clearSearch = () => {
  if (props.table) {
    props.table.searchTerm.value = '';
    props.table.currentPage.value = 1;
  }
  emit('update:searchTerm', '');
  emit('search', '');
};

const onResetFilters = () => {
  if (props.table?.resetAllFilters) {
    props.table.resetAllFilters();
  }
  emit('resetFilters');
};

const onToggleColumn = (colId: string) => {
  if (props.table?.toggleColumn) {
    props.table.toggleColumn(colId);
  }
  emit('toggleColumn', colId);
};

const onSelectAllColumns = () => {
  if (props.table?.selectAllColumns) {
    props.table.selectAllColumns();
  }
  emit('selectAllColumns');
};

const onResetColumns = () => {
  if (props.table?.resetColumns) {
    props.table.resetColumns();
  }
  emit('resetColumns');
};

const handleClickOutside = (e: MouseEvent) => {
  if (popoverRef.value && !popoverRef.value.contains(e.target as Node)) {
    showColumnsPopover.value = false;
  }
};

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});
</script>
