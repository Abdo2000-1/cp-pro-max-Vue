<template>
  <div class="inline-flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/80 text-xs shadow-inner">
    <span class="text-[10px] font-bold text-slate-400 px-2 uppercase tracking-wider hidden sm:inline-block">
      View State:
    </span>

    <button
      v-for="s in states"
      :key="s.id"
      type="button"
      @click="selectState(s.id)"
      :class="[
        'flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-semibold transition-all duration-150',
        modelValue === s.id
          ? `${s.activeBg} ${s.activeText} shadow-xs font-bold scale-[1.02]`
          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50'
      ]"
    >
      <span class="w-1.5 h-1.5 rounded-full" :class="s.dotColor" />
      <span>{{ s.label }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { OrdersViewState } from '@/types';
import { sound } from '@/utils/sound';

const props = withDefaults(defineProps<{
  modelValue: OrdersViewState;
}>(), {
  modelValue: 'normal',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: OrdersViewState): void;
}>();

const states: { id: OrdersViewState; label: string; activeBg: string; activeText: string; dotColor: string }[] = [
  { id: 'normal', label: 'Live Data', activeBg: 'bg-white dark:bg-slate-700', activeText: 'text-slate-900 dark:text-white', dotColor: 'bg-emerald-500' },
  { id: 'loading', label: 'Loading', activeBg: 'bg-emerald-500/15 dark:bg-emerald-950/40', activeText: 'text-emerald-700 dark:text-emerald-300', dotColor: 'bg-emerald-500 animate-ping' },
  { id: 'empty', label: 'Empty State', activeBg: 'bg-slate-200 dark:bg-slate-700', activeText: 'text-slate-800 dark:text-slate-200', dotColor: 'bg-slate-400' },
  { id: 'error', label: 'Error', activeBg: 'bg-rose-500/15 dark:bg-rose-950/40', activeText: 'text-rose-700 dark:text-rose-300', dotColor: 'bg-rose-500' },
];

const selectState = (val: OrdersViewState) => {
  emit('update:modelValue', val);
  sound.playClick(640);
};
</script>
