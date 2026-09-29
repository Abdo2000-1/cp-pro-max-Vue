<template>
  <span
    :class="[
      'inline-flex items-center gap-1.5 font-semibold text-xs transition-colors',
      priority === 'Urgent'
        ? 'px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 font-bold animate-pulse'
        : priority === 'High'
        ? 'px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-medium'
        : priority === 'Normal'
        ? 'px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
        : 'px-2.5 py-0.5 rounded-full bg-slate-500/15 text-slate-600 dark:text-slate-400 border border-slate-500/30'
    ]"
  >
    <span
      class="w-1.5 h-1.5 rounded-full"
      :class="[
        priority === 'Urgent' ? 'bg-rose-500' :
        priority === 'High' ? 'bg-amber-500' :
        priority === 'Normal' ? 'bg-emerald-500' : 'bg-slate-400'
      ]"
    />
    <span>{{ priority }}</span>
  </span>
</template>

<script setup lang="ts">
import type { Priority } from '@/types';

defineProps<{
  priority: Priority | string;
}>();
</script>
