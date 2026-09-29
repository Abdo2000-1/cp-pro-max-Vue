<template>
  <div class="relative inline-flex shrink-0">
    <div
      :class="[
        'flex items-center justify-center font-bold text-white rounded-full select-none shadow-xs',
        sizeClasses,
        colorClass
      ]"
    >
      <img
        v-if="src"
        :src="src"
        :alt="alt || name"
        class="w-full h-full object-cover rounded-full"
      />
      <span v-else>{{ initials }}</span>
    </div>

    <!-- Status badge indicator -->
    <span
      v-if="status"
      :class="[
        'absolute bottom-0 right-0 rounded-full ring-2 ring-white dark:ring-slate-900',
        status === 'online' ? 'bg-emerald-500' :
        status === 'busy' ? 'bg-amber-500' :
        status === 'offline' ? 'bg-slate-400' : 'bg-emerald-500',
        size === 'lg' ? 'w-3 h-3' : size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5'
      ]"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getInitials } from '@/utils/format';

const props = withDefaults(defineProps<{
  name?: string;
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  status?: 'online' | 'busy' | 'offline';
}>(), {
  name: 'User',
  size: 'md',
});

const initials = computed(() => getInitials(props.name));

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'xs': return 'w-6 h-6 text-[10px]';
    case 'sm': return 'w-8 h-8 text-xs';
    case 'lg': return 'w-12 h-12 text-base';
    case 'xl': return 'w-16 h-16 text-xl';
    default:   return 'w-10 h-10 text-sm';
  }
});

const colorClass = computed(() => {
  if (props.color) return props.color;
  // Deterministic gradient based on name characters
  const gradients = [
    'bg-gradient-to-tr from-emerald-500 to-teal-700',
    'bg-gradient-to-tr from-teal-500 to-emerald-700',
    'bg-gradient-to-tr from-indigo-500 to-purple-600',
    'bg-gradient-to-tr from-blue-500 to-cyan-600',
    'bg-gradient-to-tr from-amber-500 to-orange-600',
  ];
  let sum = 0;
  for (let i = 0; i < props.name.length; i++) sum += props.name.charCodeAt(i);
  return gradients[sum % gradients.length];
});
</script>
