<script setup lang="ts">
import { onMounted } from 'vue';
import { useDentalStore } from '@/stores/dental';

const dentalStore = useDentalStore();

onMounted(() => {
  dentalStore.init();
});
</script>

<template>
  <router-view />
</template>

<style>
/* Global page transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
