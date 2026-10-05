<template>
  <div
    :class="[
      'relative flex min-h-screen w-full bg-slate-50 dark:bg-[#060911] text-slate-900 dark:text-slate-100 transition-colors duration-200 overflow-x-hidden',
      isVertical ? 'flex-row' : 'flex-col'
    ]"
  >
    <!-- 1. Convertible Navigation (Top / Left / Right / Bottom) -->
    <ConvertibleNav
      :position="navPosition"
      :collapsed="sidebarCollapsed"
      @change-position="handlePositionChange"
      @toggle-collapse="sidebarCollapsed = !sidebarCollapsed"
      @drag-start="isDraggingNav = true"
      @drag-end="isDraggingNav = false"
    />

    <!-- 2. Interactive 4-Way Drop Target Zones (Visible when dragging the handle) -->
    <Transition name="fade">
      <div v-if="isDraggingNav" class="fixed inset-0 z-50 pointer-events-none">
        
        <!-- TOP DROP ZONE -->
        <div
          @click="handlePositionChange('top')"
          @dragover.prevent="handleDragOverZone($event, 'top')"
          @dragleave="hoveredDropZone = null"
          @drop.prevent="handleDropOnZone($event, 'top')"
          :class="[
            'pointer-events-auto absolute top-0 left-0 right-0 h-24 flex items-center justify-center border-b-4 border-dashed transition-all cursor-pointer',
            hoveredDropZone === 'top'
              ? 'bg-sky-500/30 border-sky-400 backdrop-blur-md'
              : 'bg-slate-950/80 border-sky-500/60 backdrop-blur-xs'
          ]"
        >
          <div class="flex items-center gap-2 text-white font-black text-xs uppercase tracking-wider">
            <ArrowUp class="w-5 h-5 text-sky-400 animate-bounce" />
            <span>Drop or Click Here to Dock as Top Navbar</span>
          </div>
        </div>

        <!-- BOTTOM DROP ZONE -->
        <div
          @click="handlePositionChange('bottom')"
          @dragover.prevent="handleDragOverZone($event, 'bottom')"
          @dragleave="hoveredDropZone = null"
          @drop.prevent="handleDropOnZone($event, 'bottom')"
          :class="[
            'pointer-events-auto absolute bottom-0 left-0 right-0 h-24 flex items-center justify-center border-t-4 border-dashed transition-all cursor-pointer',
            hoveredDropZone === 'bottom'
              ? 'bg-orange-500/30 border-orange-400 backdrop-blur-md'
              : 'bg-slate-950/80 border-orange-500/60 backdrop-blur-xs'
          ]"
        >
          <div class="flex items-center gap-2 text-white font-black text-xs uppercase tracking-wider">
            <ArrowDown class="w-5 h-5 text-orange-400 animate-bounce" />
            <span>Drop or Click Here to Dock as Bottom Taskbar</span>
          </div>
        </div>

        <!-- LEFT DROP ZONE -->
        <div
          @click="handlePositionChange('left')"
          @dragover.prevent="handleDragOverZone($event, 'left')"
          @dragleave="hoveredDropZone = null"
          @drop.prevent="handleDropOnZone($event, 'left')"
          :class="[
            'pointer-events-auto absolute top-24 bottom-24 left-0 w-36 flex flex-col items-center justify-center border-r-4 border-dashed transition-all cursor-pointer',
            hoveredDropZone === 'left'
              ? 'bg-sky-500/30 border-sky-400 backdrop-blur-md'
              : 'bg-slate-950/80 border-sky-500/60 backdrop-blur-xs'
          ]"
        >
          <div class="flex flex-col items-center text-center gap-2 text-white font-black text-xs uppercase tracking-wider p-2">
            <ArrowLeft class="w-5 h-5 text-sky-400 animate-bounce" />
            <span>Dock Left Sidebar (Collapsed)</span>
          </div>
        </div>

        <!-- RIGHT DROP ZONE -->
        <div
          @click="handlePositionChange('right')"
          @dragover.prevent="handleDragOverZone($event, 'right')"
          @dragleave="hoveredDropZone = null"
          @drop.prevent="handleDropOnZone($event, 'right')"
          :class="[
            'pointer-events-auto absolute top-24 bottom-24 right-0 w-36 flex flex-col items-center justify-center border-l-4 border-dashed transition-all cursor-pointer',
            hoveredDropZone === 'right'
              ? 'bg-orange-500/30 border-orange-400 backdrop-blur-md'
              : 'bg-slate-950/80 border-orange-500/60 backdrop-blur-xs'
          ]"
        >
          <div class="flex flex-col items-center text-center gap-2 text-white font-black text-xs uppercase tracking-wider p-2">
            <ArrowRight class="w-5 h-5 text-orange-400 animate-bounce" />
            <span>Dock Right Sidebar (Collapsed)</span>
          </div>
        </div>

      </div>
    </Transition>

    <!-- 3. Main Workspace Container - Full wide width without horizontal scroll -->
    <div
      :class="[
        'flex flex-1 flex-col min-w-0 h-full overflow-hidden transition-all duration-300',
        navPosition === 'left' ? (sidebarCollapsed ? 'pl-20' : 'pl-64') : '',
        navPosition === 'right' ? (sidebarCollapsed ? 'pr-20' : 'pr-64') : ''
      ]"
    >
      <main
        :class="[
          'flex-1 w-full overflow-x-hidden overflow-y-auto p-3 sm:p-5 lg:p-6 custom-scrollbar',
          navPosition === 'bottom' ? 'pb-24' : ''
        ]"
      >
        <div class="w-full max-w-[1920px] mx-auto min-w-0">
          <router-view v-slot="{ Component }">
            <Transition name="page" mode="out-in">
              <component :is="Component" />
            </Transition>
          </router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import ConvertibleNav, { type NavPosition } from './ConvertibleNav.vue';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from 'lucide-vue-next';
import { useDentalStore } from '@/stores/dental';

const store = useDentalStore();

const navPosition = ref<NavPosition>(
  (localStorage.getItem('3ddx-cp-nav-position') as NavPosition) || 'top'
);
const sidebarCollapsed = ref(true);
const isDraggingNav = ref(false);
const hoveredDropZone = ref<NavPosition | null>(null);

const isVertical = computed(() => navPosition.value === 'left' || navPosition.value === 'right');

const handlePositionChange = (newPos: NavPosition) => {
  navPosition.value = newPos;
  localStorage.setItem('3ddx-cp-nav-position', newPos);
  if (newPos === 'left' || newPos === 'right') {
    sidebarCollapsed.value = true;
  }
};

const handleDragOverZone = (e: DragEvent, zone: NavPosition) => {
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = 'move';
  }
  hoveredDropZone.value = zone;
};

const handleDropOnZone = (e: DragEvent, zone: NavPosition) => {
  isDraggingNav.value = false;
  hoveredDropZone.value = null;
  handlePositionChange(zone);
};

const handleZoneEvent = (e: Event) => {
  const custom = e as CustomEvent<NavPosition | null>;
  hoveredDropZone.value = custom.detail;
};

onMounted(() => {
  store.init();
  window.addEventListener('nav-hover-zone', handleZoneEvent);
});

onUnmounted(() => {
  window.removeEventListener('nav-hover-zone', handleZoneEvent);
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
