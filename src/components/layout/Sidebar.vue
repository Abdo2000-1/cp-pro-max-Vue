<template>
  <div>
    <!-- Desktop Sidebar -->
    <aside
      :class="[
        'hidden md:flex flex-col h-screen fixed inset-y-0 left-0 z-30 transition-all duration-300 ease-in-out select-none',
        'bg-white dark:bg-[#070b14] border-r border-slate-200/80 dark:border-slate-800/80',
        collapsed ? 'w-20' : 'w-64'
      ]"
    >
      <!-- Brand Header -->
      <div
        :class="[
          'flex h-16 items-center border-b border-slate-100 dark:border-slate-800/80 shrink-0 relative px-4',
          collapsed ? 'justify-center' : 'justify-between'
        ]"
      >
        <router-link to="/dashboard" class="flex items-center gap-3 group">
          <!-- Vue 3 Iconic Animated Logo -->
          <div class="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#35495e] via-[#42b883] to-[#00dc82] p-0.5 shadow-md shadow-emerald-500/25 transition-transform group-hover:scale-105 active:scale-95">
            <div class="w-full h-full bg-[#0a0f1d] rounded-[10px] flex items-center justify-center relative overflow-hidden">
              <svg viewBox="0 0 261.76 226.69" class="w-6 h-6 transition-transform group-hover:rotate-6">
                <path d="M 161.096 0 L 130.88 52.338 L 100.664 0 L 0 0 L 130.88 226.69 L 261.76 0 Z" fill="#42b883" />
                <path d="M 161.096 0 L 130.88 52.338 L 100.664 0 L 52.246 0 L 130.88 136.196 L 209.514 0 Z" fill="#35495e" />
              </svg>
            </div>
          </div>

          <div v-if="!collapsed" class="flex flex-col truncate">
            <div class="flex items-center gap-1.5">
              <span class="font-black text-slate-900 dark:text-white text-base tracking-tight group-hover:text-emerald-500 transition-colors">
                DentaVue
              </span>
              <span class="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                v3.5
              </span>
            </div>
            <span class="text-[10px] font-semibold text-slate-400 dark:text-slate-500 tracking-wider uppercase">
              Dental CAD SaaS
            </span>
          </div>
        </router-link>

        <button
          type="button"
          @click="toggleCollapse"
          class="hidden md:flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          :title="collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'"
        >
          <ChevronLeft v-if="!collapsed" class="w-4 h-4" />
          <ChevronRight v-else class="w-4 h-4" />
        </button>
      </div>

      <!-- Navigation Links -->
      <nav class="flex-1 overflow-y-auto px-3 py-3 space-y-1" aria-label="Main Navigation">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          @click="sound.playClick(620)"
          :class="[
            'group relative flex items-center rounded-xl py-2.5 text-sm font-medium transition-all duration-200 select-none',
            collapsed ? 'justify-center px-0' : 'gap-3 px-3',
            isActiveRoute(item.path)
              ? 'bg-gradient-to-r from-emerald-500/15 to-teal-600/10 text-emerald-700 dark:text-emerald-300 font-semibold border-l-2 border-emerald-500 shadow-xs shadow-emerald-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
          ]"
          :title="collapsed ? item.label : undefined"
        >
          <component
            :is="item.icon"
            :class="[
              'w-5 h-5 shrink-0 transition-colors',
              isActiveRoute(item.path)
                ? 'text-emerald-600 dark:text-emerald-400 drop-shadow-[0_0_8px_rgba(66,184,131,0.5)]'
                : 'text-slate-400 dark:text-slate-500 group-hover:text-emerald-500'
            ]"
          />

          <span v-if="!collapsed" class="truncate flex-1 text-left">
            {{ item.label }}
          </span>

          <!-- Badge counter -->
          <span
            v-if="!collapsed && getBadgeCount(item)"
            :class="[
              'px-2 py-0.5 text-xs font-bold rounded-full',
              isActiveRoute(item.path) ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-rose-500 text-white'
            ]"
          >
            {{ getBadgeCount(item) }}
          </span>

          <span
            v-if="collapsed && getBadgeCount(item)"
            class="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#42b883]"
          />
        </router-link>
      </nav>

      <!-- Bottom Profile Bar -->
      <div class="p-3 border-t border-slate-100 dark:border-slate-800/80 shrink-0">
        <router-link
          to="/settings"
          :class="[
            'flex items-center rounded-2xl p-2 transition-all hover:bg-slate-100 dark:hover:bg-slate-800/60',
            collapsed ? 'justify-center' : 'gap-3'
          ]"
        >
          <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-700 flex items-center justify-center text-white font-bold text-xs shadow-md shadow-emerald-500/20 shrink-0">
            {{ store.profile.avatarInitials }}
          </div>
          <div v-if="!collapsed" class="flex flex-col truncate">
            <span class="text-xs font-bold text-slate-900 dark:text-white truncate">
              {{ store.profile.firstName }} {{ store.profile.lastName }}
            </span>
            <span class="text-[10px] text-slate-500 dark:text-slate-400 truncate">
              {{ store.profile.role }}
            </span>
          </div>
        </router-link>
      </div>
    </aside>

    <!-- Mobile Drawer Overlay -->
    <Transition name="fade">
      <div
        v-if="mobileOpen"
        class="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs md:hidden"
        @click="$emit('mobile-close')"
      />
    </Transition>

    <!-- Mobile Drawer -->
    <Transition name="drawer">
      <aside
        v-if="mobileOpen"
        class="fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-[#070b14] border-r border-slate-200 dark:border-slate-800 flex flex-col md:hidden select-none"
      >
        <div class="flex h-16 items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950">
              <svg viewBox="0 0 261.76 226.69" class="w-5 h-5">
                <path d="M 161.096 0 L 130.88 52.338 L 100.664 0 L 0 0 L 130.88 226.69 L 261.76 0 Z" fill="#ffffff" />
              </svg>
            </div>
            <span class="font-black text-slate-900 dark:text-white text-base">DentaVue</span>
          </div>
          <button
            type="button"
            @click="$emit('mobile-close')"
            class="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <nav class="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            @click="$emit('mobile-close'); sound.playClick()"
            :class="[
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
              isActiveRoute(item.path)
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold border-l-2 border-emerald-500'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            ]"
          >
            <component :is="item.icon" class="w-5 h-5" />
            <span class="flex-1">{{ item.label }}</span>
            <span
              v-if="getBadgeCount(item)"
              class="px-2 py-0.5 text-xs font-bold rounded-full bg-emerald-500 text-slate-950"
            >
              {{ getBadgeCount(item) }}
            </span>
          </router-link>
        </nav>
      </aside>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { 
  LayoutDashboard, Package, FolderOpen, GitBranch, ScanLine, 
  Users, Stethoscope, Building2, FileText, Receipt, RefreshCcw, 
  BarChart3, Bell, Settings, TableProperties, FormInput, 
  ChevronLeft, ChevronRight, X 
} from 'lucide-vue-next';
import { useDentalStore } from '@/stores/dental';
import { sound } from '@/utils/sound';

defineProps<{
  collapsed: boolean;
  mobileOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'toggle'): void;
  (e: 'mobile-close'): void;
}>();

const route = useRoute();
const store = useDentalStore();

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Package, label: 'Orders', path: '/orders' },
  { icon: FolderOpen, label: 'Cases', path: '/cases' },
  { icon: GitBranch, label: 'Workflow', path: '/workflow-board' },
  { icon: ScanLine, label: 'Scan Center', path: '/scan-center' },
  { icon: Users, label: 'Patients', path: '/patients' },
  { icon: Stethoscope, label: 'Doctors', path: '/doctors' },
  { icon: Building2, label: 'Clinics', path: '/clinics' },
  { icon: FileText, label: 'Documents', path: '/documents' },
  { icon: Receipt, label: 'Billing', path: '/billing' },
  { icon: RefreshCcw, label: 'Change Requests', path: '/change-requests', badge: 4 },
  { icon: TableProperties, label: 'Grid', path: '/grid' },
  { icon: FormInput, label: 'Forms', path: '/forms' },
  { icon: BarChart3, label: 'Reports', path: '/reports' },
  { icon: Bell, label: 'Notifications', path: '/notifications' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const isActiveRoute = (path: string) => {
  return route.path.startsWith(path);
};

const getBadgeCount = (item: any) => {
  if (item.path === '/notifications') {
    return store.unreadNotificationsCount;
  }
  return item.badge;
};

const toggleCollapse = () => {
  emit('toggle');
  sound.playClick(580);
};
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

.drawer-enter-active,
.drawer-leave-active {
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.drawer-enter-from,
.drawer-leave-to {
  transform: translateX(-100%);
}
</style>
