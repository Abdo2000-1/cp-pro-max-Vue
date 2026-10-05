<template>
  <div>
    <!-- ========================================== -->
    <!-- 1. HORIZONTAL BAR (TOP OR BOTTOM)          -->
    <!-- ========================================== -->
    <header
      v-if="!isVertical"
      :class="[
        'w-full border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-[#070b14]/95 backdrop-blur-md shadow-xs select-none transition-all duration-200 z-40',
        position === 'top' ? 'sticky top-0 border-b' : 'fixed bottom-0 left-0 right-0 border-t shadow-2xl'
      ]"
    >
      <div class="w-full max-w-[1920px] mx-auto px-3 sm:px-5 lg:px-6 h-16 flex items-center justify-between gap-2 lg:gap-4">
        
        <!-- Left: Drag Handle, 4-Way Dock Quick Picker & Brand Logo -->
        <div class="flex items-center gap-2 shrink-0">
          <!-- Hand Drag Handle -->
          <div
            draggable="true"
            @dragstart="handleDragStart"
            @dragend="handleDragEnd"
            @pointerdown="handlePointerDownDrag"
            :title="t('action.dragHandle', 'Click & drag with hand/mouse to dock at any edge (Top / Left / Right / Bottom)')"
            class="flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-sky-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-grab active:cursor-grabbing transition-colors group"
          >
            <GripVertical class="w-5 h-5 group-hover:scale-110 transition-transform text-sky-600 dark:text-sky-400" />
          </div>

          <!-- 4-Way Docking Quick Selector -->
          <div class="relative" ref="dockPickerRef">
            <button
              type="button"
              @click="dockPickerOpen = !dockPickerOpen"
              class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-950/40 border border-slate-200/80 dark:border-slate-800 transition-colors"
              title="Snap Navigation Dock"
            >
              <Compass class="w-3.5 h-3.5 text-amber-500" />
              <span class="capitalize hidden md:inline">{{ position }}</span>
              <ChevronDown class="w-3 h-3 text-slate-400" />
            </button>

            <!-- Dock Dropdown Menu -->
            <div
              v-if="dockPickerOpen"
              class="absolute top-10 left-0 w-48 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-1.5 z-50 text-xs font-bold"
            >
              <div class="text-[10px] text-slate-400 uppercase tracking-wider px-2 py-1">
                Snap Dock Position
              </div>
              <button
                type="button"
                @click="changePos('top')"
                :class="['w-full flex items-center gap-2 p-2 rounded-lg text-left', position === 'top' ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-600' : 'hover:bg-slate-100 dark:hover:bg-slate-800']"
              >
                <PanelTopClose class="w-3.5 h-3.5" />
                <span>Top Navbar</span>
              </button>
              <button
                type="button"
                @click="changePos('bottom')"
                :class="['w-full flex items-center gap-2 p-2 rounded-lg text-left', position === 'bottom' ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-600' : 'hover:bg-slate-100 dark:hover:bg-slate-800']"
              >
                <PanelBottomClose class="w-3.5 h-3.5" />
                <span>Bottom Dock</span>
              </button>
              <button
                type="button"
                @click="changePos('left')"
                :class="['w-full flex items-center gap-2 p-2 rounded-lg text-left', position === 'left' ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-600' : 'hover:bg-slate-100 dark:hover:bg-slate-800']"
              >
                <PanelLeftClose class="w-3.5 h-3.5" />
                <span>Left Sidebar</span>
              </button>
              <button
                type="button"
                @click="changePos('right')"
                :class="['w-full flex items-center gap-2 p-2 rounded-lg text-left', position === 'right' ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-600' : 'hover:bg-slate-100 dark:hover:bg-slate-800']"
              >
                <PanelRightClose class="w-3.5 h-3.5" />
                <span>Right Sidebar</span>
              </button>
            </div>
          </div>

          <!-- Brand Logo -->
          <router-link to="/flow" class="flex items-center gap-2.5 group">
            <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <Layers class="w-5 h-5" />
            </div>
            <div class="flex flex-col">
              <span class="font-black text-slate-900 dark:text-white text-base tracking-tight leading-none group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                3DDX
              </span>
              <span class="text-[9px] font-mono font-bold text-sky-600 dark:text-sky-400 tracking-wider">
                CP PRO MAX
              </span>
            </div>
          </router-link>
        </div>

        <!-- Center: The 8 Target Modernized Pages Navigation Items -->
        <nav class="hidden md:flex items-center gap-1 overflow-x-auto py-1 scrollbar-none">
          <router-link
            v-for="item in targetNavItems"
            :key="item.id"
            :to="item.path"
            @click="sound.playClick(620)"
            :class="[
              'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap',
              isActiveRoute(item.path)
                ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/30 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
            ]"
          >
            <component :is="item.icon" class="w-3.5 h-3.5 shrink-0" />
            <span>{{ item.label }}</span>
          </router-link>
        </nav>

        <!-- Right: Language, Theme, & User Profile -->
        <div class="flex items-center gap-1.5 shrink-0">
          
          <!-- Language Selector -->
          <div class="relative" ref="langRef">
            <button
              type="button"
              @click="langDropdownOpen = !langDropdownOpen"
              class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold border border-slate-200/80 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <span>{{ currentOption.flag }}</span>
              <span class="hidden sm:inline font-mono">{{ currentOption.code.toUpperCase() }}</span>
              <ChevronDown class="w-3 h-3 text-slate-400" />
            </button>

            <div
              v-if="langDropdownOpen"
              class="absolute right-0 mt-1 w-40 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-1.5 z-50 text-xs font-bold"
            >
              <button
                v-for="lang in languages"
                :key="lang.code"
                type="button"
                @click="setLanguage(lang.code); langDropdownOpen = false"
                :class="[
                  'w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors',
                  language === lang.code ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-600' : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                ]"
              >
                <div class="flex items-center gap-2">
                  <span>{{ lang.flag }}</span>
                  <span>{{ lang.label }}</span>
                </div>
                <Check v-if="language === lang.code" class="w-3.5 h-3.5 text-sky-600" />
              </button>
            </div>
          </div>

          <!-- Theme Toggle -->
          <button
            type="button"
            @click="store.toggleTheme()"
            class="p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Toggle Light/Dark Theme"
          >
            <Sun v-if="store.theme === 'dark'" class="w-4 h-4 text-amber-400" />
            <Moon v-else class="w-4 h-4 text-slate-700" />
          </button>

          <!-- User Profile Link -->
          <router-link
            to="/profile"
            class="flex items-center gap-2 p-1 pl-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors"
          >
            <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
              {{ store.profile?.avatarInitials || 'AA' }}
            </div>
          </router-link>

        </div>

      </div>
    </header>

    <!-- ========================================== -->
    <!-- 2. VERTICAL SIDEBAR (LEFT OR RIGHT DOCK)    -->
    <!-- ========================================== -->
    <aside
      v-else
      :class="[
        'fixed top-0 bottom-0 z-40 bg-white/95 dark:bg-[#070b14]/95 backdrop-blur-md border-slate-200/80 dark:border-slate-800/80 select-none flex flex-col transition-all duration-300 shadow-2xl',
        position === 'left' ? 'left-0 border-r' : 'right-0 border-l',
        collapsed ? 'w-20' : 'w-64'
      ]"
    >
      <!-- Sidebar Header -->
      <div class="h-16 flex items-center justify-between px-3.5 border-b border-slate-100 dark:border-slate-800/80 shrink-0">
        <!-- Drag Handle & Logo -->
        <div class="flex items-center gap-2">
          <div
            draggable="true"
            @dragstart="handleDragStart"
            @dragend="handleDragEnd"
            @pointerdown="handlePointerDownDrag"
            :title="t('action.dragHandle')"
            class="p-1.5 rounded-lg text-slate-400 hover:text-sky-500 cursor-grab active:cursor-grabbing"
          >
            <GripVertical class="w-4 h-4 text-sky-600 dark:text-sky-400" />
          </div>

          <router-link to="/flow" class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-xs">
              <Layers class="w-4 h-4" />
            </div>
            <span v-if="!collapsed" class="font-black text-slate-900 dark:text-white text-sm tracking-tight truncate">
              3DDX CP
            </span>
          </router-link>
        </div>

        <!-- Collapse Toggle Button -->
        <button
          type="button"
          @click="$emit('toggle-collapse')"
          class="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          :title="collapsed ? 'Expand' : 'Collapse'"
        >
          <ChevronRight v-if="collapsed" class="w-4 h-4" />
          <ChevronLeft v-else class="w-4 h-4" />
        </button>
      </div>

      <!-- Navigation Items (The 8 Target Pages) -->
      <nav class="flex-1 overflow-y-auto px-2 py-3 space-y-1">
        <router-link
          v-for="item in targetNavItems"
          :key="item.id"
          :to="item.path"
          @click="sound.playClick(620)"
          :class="[
            'flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer select-none',
            isActiveRoute(item.path)
              ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/30 font-black shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white',
            collapsed ? 'justify-center px-0' : ''
          ]"
          :title="collapsed ? item.label : undefined"
        >
          <component :is="item.icon" class="w-4 h-4 shrink-0" />
          <span v-if="!collapsed" class="truncate flex-1 text-left">{{ item.label }}</span>
        </router-link>
      </nav>

      <!-- Bottom Dock Bar with Compass & Theme -->
      <div class="p-3 border-t border-slate-100 dark:border-slate-800/80 shrink-0 space-y-2">
        <div class="flex items-center justify-between">
          <!-- Snap Dock Picker -->
          <button
            type="button"
            @click="changePos('top')"
            class="p-2 rounded-xl text-slate-400 hover:text-sky-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Dock to Top Navbar"
          >
            <PanelTopClose class="w-4 h-4 text-amber-500" />
          </button>

          <!-- Theme -->
          <button
            type="button"
            @click="store.toggleTheme()"
            class="p-2 rounded-xl text-slate-400 hover:text-sky-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Sun v-if="store.theme === 'dark'" class="w-4 h-4 text-amber-400" />
            <Moon v-else class="w-4 h-4 text-slate-700" />
          </button>

          <!-- Profile -->
          <router-link
            to="/profile"
            class="w-7 h-7 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 text-white font-bold text-[10px] flex items-center justify-center"
          >
            {{ store.profile?.avatarInitials || 'AA' }}
          </router-link>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  Layers, FilePlus2, FileText, TrendingUp, Boxes, LayoutDashboard,
  Users2, FileEdit, GripVertical, ChevronLeft, ChevronRight, Sun, Moon,
  PanelLeftClose, PanelRightClose, PanelTopClose, PanelBottomClose,
  Check, ChevronDown, Compass
} from 'lucide-vue-next';
import { useDentalStore } from '@/stores/dental';
import { useLanguage } from '@/composables/useLanguage';
import { sound } from '@/utils/sound';

export type NavPosition = 'top' | 'left' | 'right' | 'bottom';

const props = defineProps<{
  position: NavPosition;
  collapsed: boolean;
}>();

const emit = defineEmits<{
  (e: 'change-position', pos: NavPosition): void;
  (e: 'toggle-collapse'): void;
  (e: 'drag-start'): void;
  (e: 'drag-end'): void;
}>();

const route = useRoute();
const router = useRouter();
const store = useDentalStore();
const { language, setLanguage, currentOption, t, languages } = useLanguage();

const langDropdownOpen = ref(false);
const dockPickerOpen = ref(false);
const langRef = ref<HTMLElement | null>(null);
const dockPickerRef = ref<HTMLElement | null>(null);

const isVertical = computed(() => props.position === 'left' || props.position === 'right');

// Exact 8 Target Pages from 3DDX CP
const targetNavItems = computed(() => [
  { id: 'dashboard', label: t('nav.dashboard', 'Dashboard'), path: '/dashboard', icon: LayoutDashboard },
  { id: 'flow', label: t('nav.flow', 'Master Orders Flow'), path: '/flow', icon: Layers },
  { id: 'addCase', label: t('nav.addCase', 'Add New Case'), path: '/add-case', icon: FilePlus2 },
  { id: 'orderDetails', label: t('nav.orderDetails', 'Order Details'), path: '/order-details', icon: FileText },
  { id: 'quarterTargets', label: t('nav.quarterTargets', 'Quarter Targets'), path: '/quarter-targets', icon: TrendingUp },
  { id: 'task47', label: t('nav.task47', 'Model Work Report'), path: '/task-47', icon: Boxes },
  { id: 'task31', label: t('nav.task31', 'Staff Targets'), path: '/task-31', icon: Users2 },
  { id: 'editCase', label: t('nav.editCase', 'Edit Case Form'), path: '/edit-case', icon: FileEdit },
]);

const isActiveRoute = (path: string) => {
  return route.path === path || route.path.startsWith(`${path}/`);
};

const changePos = (pos: NavPosition) => {
  emit('change-position', pos);
  dockPickerOpen.value = false;
  sound.playClick(650);
};

// Drag Handlers
const handleDragStart = (e: DragEvent) => {
  e.dataTransfer?.setData('text/plain', props.position);
  emit('drag-start');
};

const handleDragEnd = () => {
  emit('drag-end');
};

const handlePointerDownDrag = (e: PointerEvent) => {
  e.preventDefault();
  emit('drag-start');

  const onPointerMove = (moveEvt: PointerEvent) => {
    const clientX = moveEvt.clientX;
    const clientY = moveEvt.clientY;
    const winW = window.innerWidth;
    const winH = window.innerHeight;

    if (clientY < 80) {
      window.dispatchEvent(new CustomEvent('nav-hover-zone', { detail: 'top' }));
    } else if (clientY > winH - 80) {
      window.dispatchEvent(new CustomEvent('nav-hover-zone', { detail: 'bottom' }));
    } else if (clientX < 140) {
      window.dispatchEvent(new CustomEvent('nav-hover-zone', { detail: 'left' }));
    } else if (clientX > winW - 140) {
      window.dispatchEvent(new CustomEvent('nav-hover-zone', { detail: 'right' }));
    } else {
      window.dispatchEvent(new CustomEvent('nav-hover-zone', { detail: null }));
    }
  };

  const onPointerUp = (upEvt: PointerEvent) => {
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    emit('drag-end');

    const clientX = upEvt.clientX;
    const clientY = upEvt.clientY;
    const winW = window.innerWidth;
    const winH = window.innerHeight;

    if (clientY < 100) {
      changePos('top');
    } else if (clientY > winH - 100) {
      changePos('bottom');
    } else if (clientX < 160) {
      changePos('left');
    } else if (clientX > winW - 160) {
      changePos('right');
    }
    window.dispatchEvent(new CustomEvent('nav-hover-zone', { detail: null }));
  };

  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
};

const handleClickOutside = (e: MouseEvent) => {
  if (langRef.value && !langRef.value.contains(e.target as Node)) {
    langDropdownOpen.value = false;
  }
  if (dockPickerRef.value && !dockPickerRef.value.contains(e.target as Node)) {
    dockPickerOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});
</script>
