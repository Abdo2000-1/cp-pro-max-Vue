<template>
  <th
    v-if="!field"
    :class="[
      'px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap',
      alignClass,
      props.class
    ]"
  >
    <slot>{{ label }}</slot>
  </th>

  <th
    v-else
    @click="emitSort"
    :class="[
      'px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap cursor-pointer select-none transition-colors group hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white',
      isSorted ? 'bg-sky-50/60 dark:bg-sky-950/20 text-sky-700 dark:text-sky-300' : '',
      alignClass,
      props.class
    ]"
    :title="`Click to sort by ${label || field} (Ascending / Descending)`"
  >
    <div :class="['inline-flex items-center gap-1.5 w-full', innerAlignClass]">
      <span><slot>{{ label }}</slot></span>
      <span class="inline-flex shrink-0">
        <ArrowUp
          v-if="isSorted && activeSortDirection === 'asc'"
          class="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 transition-transform"
        />
        <ArrowDown
          v-else-if="isSorted && activeSortDirection === 'desc'"
          class="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 transition-transform"
        />
        <ArrowUpDown
          v-else
          class="w-3 h-3 text-slate-400 opacity-40 group-hover:opacity-100 transition-opacity"
        />
      </span>
    </div>
  </th>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-vue-next';

interface Props {
  field?: string;
  label?: string;
  sortField?: string;
  currentSortField?: string;
  sortOrder?: 'asc' | 'desc';
  sortDirection?: 'asc' | 'desc';
  align?: 'left' | 'center' | 'right';
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  align: 'left',
  class: '',
});

const emit = defineEmits<{
  (e: 'sort', field: string): void;
}>();

const activeSortField = computed(() => props.sortField ?? props.currentSortField);
const activeSortDirection = computed(() => props.sortOrder ?? props.sortDirection ?? 'asc');
const isSorted = computed(() => Boolean(props.field && activeSortField.value === props.field));

const alignClass = computed(() => {
  if (props.align === 'center') return 'text-center';
  if (props.align === 'right') return 'text-right';
  return 'text-left';
});

const innerAlignClass = computed(() => {
  if (props.align === 'center') return 'justify-center';
  if (props.align === 'right') return 'justify-end';
  return 'justify-start';
});

const emitSort = () => {
  if (props.field) {
    emit('sort', props.field);
  }
};
</script>
