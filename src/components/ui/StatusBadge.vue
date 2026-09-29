<template>
  <span
    :class="[
      'inline-flex items-center gap-1.5 font-semibold transition-colors',
      pill ? 'rounded-full' : 'rounded-lg',
      size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs',
      styles.bg,
      styles.text,
      'border border-current/15'
    ]"
  >
    <span
      v-if="dot"
      class="w-1.5 h-1.5 rounded-full bg-current opacity-80"
    />
    <span>{{ status }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getStatusStyles } from '@/utils/status-styles';

const props = withDefaults(defineProps<{
  status: string;
  pill?: boolean;
  dot?: boolean;
  size?: 'sm' | 'md';
}>(), {
  pill: true,
  dot: true,
  size: 'md',
});

const styles = computed(() => getStatusStyles(props.status));
</script>
