<template>
  <div class="flex items-center justify-between px-2 py-3 border-t border-slate-200 dark:border-slate-800 text-xs select-none">
    <div class="text-slate-500 dark:text-slate-400">
      Showing <strong class="text-slate-900 dark:text-white">{{ fromIndex }}</strong> to <strong class="text-slate-900 dark:text-white">{{ toIndex }}</strong> of <strong class="text-slate-900 dark:text-white">{{ totalItems }}</strong> entries
    </div>

    <div class="flex items-center gap-1">
      <button
        type="button"
        :disabled="currentPage <= 1"
        @click="goToPage(currentPage - 1)"
        class="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
      >
        Previous
      </button>

      <div class="flex items-center gap-1">
        <button
          v-for="p in visiblePages"
          :key="p"
          type="button"
          @click="goToPage(p)"
          :class="[
            'w-7 h-7 rounded-lg text-xs font-bold transition-all',
            p === currentPage
              ? 'bg-emerald-500 text-slate-950 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          ]"
        >
          {{ p }}
        </button>
      </div>

      <button
        type="button"
        :disabled="currentPage >= totalPages"
        @click="goToPage(currentPage + 1)"
        class="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { sound } from '@/utils/sound';

const props = withDefaults(defineProps<{
  currentPage: number;
  totalItems: number;
  pageSize?: number;
}>(), {
  pageSize: 10,
});

const emit = defineEmits<{
  (e: 'update:currentPage', page: number): void;
  (e: 'change', page: number): void;
}>();

const totalPages = computed(() => Math.max(1, Math.ceil(props.totalItems / props.pageSize)));
const fromIndex = computed(() => props.totalItems === 0 ? 0 : (props.currentPage - 1) * props.pageSize + 1);
const toIndex = computed(() => Math.min(props.currentPage * props.pageSize, props.totalItems));

const visiblePages = computed(() => {
  const pages: number[] = [];
  const start = Math.max(1, props.currentPage - 2);
  const end = Math.min(totalPages.value, start + 4);
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
});

const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value || page === props.currentPage) return;
  emit('update:currentPage', page);
  emit('change', page);
  sound.playClick(600);
};
</script>
