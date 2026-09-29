<template>
  <header class="sticky top-0 z-20 h-16 bg-white/80 dark:bg-[#070b14]/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between px-4 sm:px-6 select-none transition-colors duration-200">
    
    <!-- Left Section: Mobile toggle & Search -->
    <div class="flex items-center gap-3 flex-1 max-w-md">
      <button
        type="button"
        @click="$emit('mobile-toggle')"
        class="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        aria-label="Open navigation menu"
      >
        <Menu class="w-5 h-5" />
      </button>

      <div class="relative w-full max-w-sm hidden sm:block">
        <Search class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Quick search cases, scans, teeth (⌘K)..."
          @keydown.enter="handleSearch"
          class="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        />
      </div>
    </div>

    <!-- Right Actions -->
    <div class="flex items-center gap-2 sm:gap-3">
      <!-- Quick Action: Create Order -->
      <router-link
        to="/orders/create"
        @click="sound.playClick(680)"
        class="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 rounded-xl shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
      >
        <Plus class="w-3.5 h-3.5 stroke-[3]" />
        <span>New Order</span>
      </router-link>

      <!-- Theme Switcher Pill (Light, Dark, Crimson) -->
      <div class="flex items-center p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80">
        <button
          type="button"
          @click="store.setTheme('light')"
          :class="[
            'p-1.5 rounded-lg transition-all',
            store.theme === 'light' ? 'bg-white text-amber-500 shadow-xs' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          ]"
          title="Light Mode"
        >
          <Sun class="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          @click="store.setTheme('dark')"
          :class="[
            'p-1.5 rounded-lg transition-all',
            store.theme === 'dark' ? 'bg-slate-700 text-emerald-400 shadow-xs' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          ]"
          title="Dark Mode"
        >
          <Moon class="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          @click="store.setTheme('crimson')"
          :class="[
            'p-1.5 rounded-lg transition-all',
            store.theme === 'crimson' ? 'bg-rose-950 text-rose-400 shadow-xs' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          ]"
          title="Crimson Theme"
        >
          <Palette class="w-3.5 h-3.5" />
        </button>
      </div>

      <!-- Sound Toggle -->
      <button
        type="button"
        @click="store.toggleSound"
        :class="[
          'p-2 rounded-xl border transition-all',
          store.soundEnabled
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
            : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
        ]"
        :title="store.soundEnabled ? 'Micro-haptics Audio: On' : 'Micro-haptics Audio: Muted'"
      >
        <Volume2 v-if="store.soundEnabled" class="w-4 h-4" />
        <VolumeX v-else class="w-4 h-4" />
      </button>

      <!-- Notifications Dropdown -->
      <div class="relative" ref="notifDropdownRef">
        <button
          type="button"
          @click="notifOpen = !notifOpen; sound.playClick(560)"
          class="relative p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          title="Notifications"
        >
          <Bell class="w-4 h-4" />
          <span
            v-if="store.unreadNotificationsCount > 0"
            class="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white shadow-xs animate-bounce"
          >
            {{ store.unreadNotificationsCount }}
          </span>
        </button>

        <!-- Dropdown Popover -->
        <Transition name="dropdown">
          <div
            v-if="notifOpen"
            class="absolute right-0 mt-2 w-[calc(100vw-2rem)] max-w-sm sm:w-96 sm:max-w-none rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl shadow-emerald-950/20 overflow-hidden z-50 flex flex-col"
          >
            <div class="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
              <div class="flex items-center gap-2">
                <span class="font-extrabold text-sm text-slate-900 dark:text-white">Notifications</span>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  {{ store.unreadNotificationsCount }} new
                </span>
              </div>
              <button
                type="button"
                @click="store.markAllNotificationsRead()"
                class="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Mark all read
              </button>
            </div>

            <!-- List -->
            <div class="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
              <div
                v-for="n in store.notifications.slice(0, 6)"
                :key="n.id"
                @click="store.markNotificationRead(n.id); sound.playPop()"
                :class="[
                  'p-3.5 transition-colors cursor-pointer flex gap-3',
                  n.read ? 'opacity-70 hover:bg-slate-50 dark:hover:bg-slate-800/40' : 'bg-emerald-500/5 hover:bg-emerald-500/10'
                ]"
              >
                <div class="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Activity class="w-4 h-4" />
                </div>
                <div class="flex-1 truncate">
                  <div class="flex items-center justify-between mb-0.5">
                    <span class="text-xs font-bold text-slate-900 dark:text-white truncate">{{ n.title }}</span>
                    <span class="text-[10px] text-slate-400">{{ timeAgo(n.createdAt) }}</span>
                  </div>
                  <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {{ n.message }}
                  </p>
                </div>
              </div>

              <div v-if="store.notifications.length === 0" class="py-8 text-center text-xs text-slate-400">
                No notifications right now
              </div>
            </div>

            <div class="p-2 border-t border-slate-100 dark:border-slate-800 text-center">
              <router-link
                to="/notifications"
                @click="notifOpen = false"
                class="block py-1 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-500"
              >
                View all notifications →
              </router-link>
            </div>
          </div>
        </Transition>
      </div>

      <!-- User Profile Link -->
      <router-link
        to="/settings"
        class="flex items-center gap-2 pl-1 group"
        title="Settings & Profile"
      >
        <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-700 flex items-center justify-center text-white font-extrabold text-xs shadow-md shadow-emerald-500/25 group-hover:ring-2 group-hover:ring-emerald-400 transition-all">
          {{ store.profile.avatarInitials }}
        </div>
      </router-link>
    </div>

  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { 
  Menu, Search, Plus, Sun, Moon, Palette, 
  Volume2, VolumeX, Bell, Activity 
} from 'lucide-vue-next';
import { useDentalStore } from '@/stores/dental';
import { sound } from '@/utils/sound';
import { timeAgo } from '@/utils/format';

defineEmits<{
  (e: 'mobile-toggle'): void;
}>();

const router = useRouter();
const store = useDentalStore();

const searchQuery = ref('');
const notifOpen = ref(false);
const notifDropdownRef = ref<HTMLElement | null>(null);

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push(`/orders?search=${encodeURIComponent(searchQuery.value)}`);
    sound.playClick(650);
  }
};

const handleClickOutside = (e: MouseEvent) => {
  if (notifDropdownRef.value && !notifDropdownRef.value.contains(e.target as Node)) {
    notifOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.97);
}
</style>
