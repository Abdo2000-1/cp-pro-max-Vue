<template>
  <div class="relative w-full">
    <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
      <Calendar class="w-4 h-4" />
    </div>

    <input
      type="date"
      :value="modelValue"
      @input="handleInput"
      :disabled="disabled"
      :min="min"
      :max="max"
      :class="[
        'w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl transition-all duration-150',
        'bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800',
        'text-slate-900 dark:text-white',
        'focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500',
        disabled ? 'opacity-50 cursor-not-allowed' : '',
        className
      ]"
    />
  </div>
</template>

<script setup lang="ts">
import { Calendar } from 'lucide-vue-next';

withDefaults(defineProps<{
  modelValue?: string;
  disabled?: boolean;
  min?: string;
  max?: string;
  className?: string;
}>(), {
  modelValue: '',
  disabled: false,
  className: '',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const handleInput = (e: Event) => {
  emit('update:modelValue', (e.target as HTMLInputElement).value);
};
</script>
