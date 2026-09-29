<template>
  <div class="flex flex-col items-center justify-center py-16 px-4 text-center select-none">
    <div class="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-4 shadow-sm animate-pulse">
      <slot name="icon">
        <Inbox class="w-8 h-8 stroke-[1.5]" />
      </slot>
    </div>

    <h3 class="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">
      {{ title }}
    </h3>
    <p class="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-6">
      {{ description }}
    </p>

    <div v-if="$slots.action" class="flex items-center gap-3">
      <slot name="action" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Inbox } from 'lucide-vue-next';

withDefaults(defineProps<{
  title?: string;
  description?: string;
}>(), {
  title: 'No records found',
  description: 'There are no active entries matching your current filters or query criteria.',
});
</script>
