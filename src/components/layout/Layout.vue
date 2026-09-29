<template>
  <div class="min-h-screen bg-slate-50 dark:bg-[#060911] vue-mesh-bg text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
    <!-- Sidebar -->
    <Sidebar
      :collapsed="sidebarCollapsed"
      :mobile-open="mobileOpen"
      @toggle="sidebarCollapsed = !sidebarCollapsed"
      @mobile-close="mobileOpen = false"
    />

    <!-- Main Content Area -->
    <div
      :class="[
        'flex-1 flex flex-col transition-all duration-300 ease-in-out min-w-0',
        sidebarCollapsed ? 'md:pl-20' : 'md:pl-64'
      ]"
    >
      <!-- Header -->
      <Header @mobile-toggle="mobileOpen = !mobileOpen" />

      <!-- Page Content with Vue Transition -->
      <main class="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto">
        <router-view v-slot="{ Component }">
          <Transition name="page" mode="out-in">
            <component :is="Component" />
          </Transition>
        </router-view>
      </main>

      <!-- Footer -->
      <footer class="py-4 px-6 border-t border-slate-200/80 dark:border-slate-800/80 text-xs text-slate-400 dark:text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <span class="inline-flex w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>DentaVue 3.5 Engine • Pure Vue 3 Composition Architecture</span>
        </div>
        <div class="flex items-center gap-4 text-[11px]">
          <span>Pinia State Management</span>
          <span>•</span>
          <span>Universal 1–32 Odontogram</span>
          <span>•</span>
          <span>Tailwind CSS v4</span>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Sidebar from './Sidebar.vue';
import Header from './Header.vue';
import { useDentalStore } from '@/stores/dental';

const store = useDentalStore();
const sidebarCollapsed = ref(false);
const mobileOpen = ref(false);

onMounted(() => {
  store.init();
});
</script>
