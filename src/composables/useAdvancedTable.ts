import { ref, computed, type Ref } from 'vue';

export interface ColumnConfig {
  id: string;
  label: string;
  defaultVisible?: boolean;
}

export interface TableFilterConfig {
  key: string;
  label: string;
  options: { value: string; label: string }[];
  defaultValue?: string;
  icon?: any;
}

export interface UseAdvancedTableOptions<T> {
  data: Ref<T[]> | T[];
  columns: ColumnConfig[];
  searchFields?: (keyof T | string)[];
  filterConfigs?: TableFilterConfig[];
  initialSortField?: string;
  initialSortDirection?: 'asc' | 'desc';
  itemsPerPage?: number;
  pageSize?: number;
}

export function useAdvancedTable<T = any>({
  data,
  columns: initialColumns,
  searchFields = [],
  filterConfigs = [],
  initialSortField = '',
  initialSortDirection = 'asc',
  itemsPerPage = 10,
  pageSize: optPageSize,
}: UseAdvancedTableOptions<T>) {
  // Search state
  const searchTerm = ref('');

  // Sorting state
  const sortField = ref<string>(initialSortField);
  const sortDirection = ref<'asc' | 'desc'>(initialSortDirection);

  // Pagination state
  const currentPage = ref(1);
  const pageSize = ref(optPageSize || itemsPerPage);

  // Custom filters state (e.g. { status: 'all', priority: 'all' })
  const initialFilters: Record<string, string> = {};
  filterConfigs.forEach(fc => {
    initialFilters[fc.key] = fc.defaultValue || 'all';
  });
  const filters = ref<Record<string, string>>({ ...initialFilters });

  const setFilterValue = (key: string, value: string) => {
    filters.value[key] = value;
    currentPage.value = 1;
  };

  const resetAllFilters = () => {
    searchTerm.value = '';
    const resetObj: Record<string, string> = {};
    filterConfigs.forEach(fc => {
      resetObj[fc.key] = fc.defaultValue || 'all';
    });
    filters.value = resetObj;
    currentPage.value = 1;
  };

  // Column Visibility state
  const visibleMap = ref<Record<string, boolean>>({});
  initialColumns.forEach(c => {
    visibleMap.value[c.id] = c.defaultVisible !== false;
  });

  const toggleColumn = (colId: string) => {
    const current = visibleMap.value[colId] !== false;
    const nextVal = !current;
    
    // Check if turning off leaves 0 visible
    if (!nextVal) {
      const activeCount = Object.entries(visibleMap.value).filter(([k, v]) => k !== colId && v).length;
      if (activeCount === 0) return;
    }
    visibleMap.value = { ...visibleMap.value, [colId]: nextVal };
  };

  const selectAllColumns = () => {
    const next: Record<string, boolean> = {};
    initialColumns.forEach(c => { next[c.id] = true; });
    visibleMap.value = next;
  };

  const resetColumns = () => {
    const next: Record<string, boolean> = {};
    initialColumns.forEach(c => { next[c.id] = c.defaultVisible !== false; });
    visibleMap.value = next;
  };

  const isColVisible = (colId: string) => {
    return visibleMap.value[colId] !== false;
  };

  const columnsList = computed(() => {
    return initialColumns.map(c => ({
      id: c.id,
      label: c.label,
      visible: visibleMap.value[c.id] !== false,
    }));
  });

  // Sorting handler
  const handleSort = (field: string) => {
    if (sortField.value === field) {
      sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
    } else {
      sortField.value = field;
      sortDirection.value = 'asc';
    }
    currentPage.value = 1;
  };

  // Data unwrap
  const rawData = computed<T[]>(() => {
    if ('value' in (data as any)) {
      return (data as Ref<T[]>).value || [];
    }
    return (data as T[]) || [];
  });

  // Active filters count
  const activeFiltersCount = computed(() => {
    return Object.entries(filters.value).filter(([_, val]) => val && val !== 'all').length;
  });

  // Filtered & Sorted items
  const filteredData = computed(() => {
    let result = [...rawData.value];

    // 1. Search filter
    const term = searchTerm.value.trim().toLowerCase();
    if (term) {
      result = result.filter(item => {
        if (!item) return false;
        if (searchFields.length > 0) {
          return searchFields.some(field => {
            const val = (item as any)[field];
            if (val === null || val === undefined) return false;
            return String(val).toLowerCase().includes(term);
          });
        }
        return Object.values(item as any).some(val => {
          if (val === null || val === undefined) return false;
          if (typeof val === 'object') return false;
          return String(val).toLowerCase().includes(term);
        });
      });
    }

    // 2. Custom filter selects
    Object.entries(filters.value).forEach(([key, filterVal]) => {
      if (!filterVal || filterVal === 'all') return;
      result = result.filter(item => {
        const itemVal = (item as any)[key];
        if (itemVal === undefined || itemVal === null) return false;
        return String(itemVal).toLowerCase() === String(filterVal).toLowerCase();
      });
    });

    // 3. Sorting
    if (sortField.value) {
      const field = sortField.value;
      const dirMultiplier = sortDirection.value === 'asc' ? 1 : -1;

      result.sort((a: any, b: any) => {
        const valA = a[field];
        const valB = b[field];

        if (valA === undefined || valA === null) return 1;
        if (valB === undefined || valB === null) return -1;

        if (typeof valA === 'number' && typeof valB === 'number') {
          return (valA - valB) * dirMultiplier;
        }

        const dateA = Date.parse(valA);
        const dateB = Date.parse(valB);
        if (!isNaN(dateA) && !isNaN(dateB) && typeof valA === 'string' && (valA.includes('-') || valA.includes('/'))) {
          return (dateA - dateB) * dirMultiplier;
        }

        return String(valA).localeCompare(String(valB), undefined, { numeric: true, sensitivity: 'base' }) * dirMultiplier;
      });
    }

    return result;
  });

  // Paginated items
  const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    return filteredData.value.slice(start, start + pageSize.value);
  });

  const totalPages = computed(() => {
    return Math.max(1, Math.ceil(filteredData.value.length / pageSize.value));
  });

  // Filter selects formatted for TableTools
  const filterSelects = computed(() => {
    return filterConfigs.map(fc => ({
      id: fc.key,
      label: fc.label,
      value: filters.value[fc.key] || 'all',
      onChange: (val: string) => setFilterValue(fc.key, val),
      options: fc.options,
      icon: fc.icon,
    }));
  });

  return {
    searchTerm,
    sortField,
    sortDirection,
    currentPage,
    pageSize,
    filters,
    setFilterValue,
    resetAllFilters,
    activeFiltersCount,
    toggleColumn,
    selectAllColumns,
    resetColumns,
    isColVisible,
    columnsList,
    handleSort,
    filteredData,
    paginatedData,
    totalPages,
    totalItems: computed(() => rawData.value.length),
    filteredItems: computed(() => filteredData.value.length),
    filterSelects,
  };
}
