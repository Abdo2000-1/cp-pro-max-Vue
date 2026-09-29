<template>
  <div class="flex flex-col items-center justify-center py-20 px-4 text-center select-none">
    <!-- Vue 3 Signature Glowing Spinner -->
    <div class="relative w-16 h-16 mb-5">
      <div class="absolute inset-0 rounded-full border-4 border-emerald-500/20 animate-ping opacity-30" />
      <div class="w-16 h-16 rounded-full border-4 border-slate-200 dark:border-slate-800 border-t-emerald-500 dark:border-t-emerald-400 animate-spin" />
      <div class="absolute inset-0 flex items-center justify-center">
        <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
      </div>
    </div>

    <h3 class="text-sm font-extrabold text-slate-800 dark:text-slate-200 tracking-tight mb-1">
      {{ title }}
    </h3>
    <p class="text-xs text-slate-500 dark:text-slate-400 max-w-xs animate-pulse">
      {{ message }}
    </p>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title?: string;
  message?: string;
}>(), {
  title: 'Loading Data...',
  message: 'Synchronizing reactive records with Pinia state engine.',
});
</script>
