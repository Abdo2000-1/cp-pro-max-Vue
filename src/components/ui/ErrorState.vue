<template>
  <div class="flex flex-col items-center justify-center py-16 px-4 text-center select-none">
    <div class="w-16 h-16 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center justify-center text-rose-500 mb-4 shadow-sm shadow-rose-500/10">
      <AlertTriangle class="w-8 h-8 stroke-[1.8]" />
    </div>

    <h3 class="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">
      {{ title }}
    </h3>
    <p class="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-6">
      {{ description }}
    </p>

    <button
      v-if="showRetry"
      type="button"
      @click="$emit('retry')"
      class="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors border border-slate-300 dark:border-slate-700"
    >
      <RefreshCw class="w-3.5 h-3.5" />
      Retry Action
    </button>
  </div>
</template>

<script setup lang="ts">
import { AlertTriangle, RefreshCw } from 'lucide-vue-next';

withDefaults(defineProps<{
  title?: string;
  description?: string;
  showRetry?: boolean;
}>(), {
  title: 'Failed to retrieve data',
  description: 'An unexpected connection or validation glitch interrupted the process.',
  showRetry: true,
});

defineEmits<{
  (e: 'retry'): void;
}>();
</script>
