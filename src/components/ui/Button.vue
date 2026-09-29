<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    @click="handleClick"
    :class="[
      'relative inline-flex items-center justify-center font-semibold transition-all duration-150 select-none active:scale-[0.98]',
      sizeClasses,
      variantClasses,
      (disabled || loading) ? 'opacity-60 cursor-not-allowed pointer-events-none' : 'cursor-pointer',
      rounded ? 'rounded-full' : 'rounded-xl',
      className
    ]"
  >
    <!-- Loading spinner -->
    <svg
      v-if="loading"
      class="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>

    <slot name="icon-left" />
    <slot />
    <slot name="icon-right" />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { sound } from '@/utils/sound';

const props = withDefaults(defineProps<{
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'vue';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  rounded?: boolean;
  withSound?: boolean;
  className?: string;
}>(), {
  type: 'button',
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  rounded: false,
  withSound: true,
  className: '',
});

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();

const handleClick = (e: MouseEvent) => {
  if (props.disabled || props.loading) return;
  if (props.withSound) {
    if (props.variant === 'danger') {
      sound.playClick(350);
    } else {
      sound.playClick(620);
    }
  }
  emit('click', e);
};

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'xs': return 'px-2.5 py-1 text-xs gap-1.5';
    case 'sm': return 'px-3 py-1.5 text-xs gap-1.5';
    case 'lg': return 'px-6 py-3 text-base gap-2.5 shadow-md';
    default:   return 'px-4 py-2 text-sm gap-2 shadow-xs';
  }
});

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
    case 'vue':
      return 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-emerald-500/25 border border-emerald-400/30';
    case 'secondary':
      return 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700';
    case 'outline':
      return 'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700';
    case 'ghost':
      return 'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-300';
    case 'danger':
      return 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/20 border border-rose-500/30';
    case 'success':
      return 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20';
    default:
      return 'bg-emerald-500 hover:bg-emerald-600 text-white';
  }
});
</script>
