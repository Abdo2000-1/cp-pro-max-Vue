<template>
  <div class="space-y-6 max-w-4xl mx-auto">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Notifications Feed
        </h1>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Real-time alerts, prescription dispatches, and clinical changes.
        </p>
      </div>

      <button
        v-if="store.unreadNotificationsCount > 0"
        type="button"
        @click="store.markAllNotificationsRead()"
        class="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
      >
        Mark all as read
      </button>
    </div>

    <!-- Notifications List -->
    <div class="rounded-3xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 shadow-sm divide-y divide-slate-100 dark:divide-slate-800/80 overflow-hidden">
      <div
        v-for="n in store.notifications"
        :key="n.id"
        @click="store.markNotificationRead(n.id); sound.playPop()"
        :class="[
          'p-4 sm:p-5 flex items-start gap-4 transition-colors cursor-pointer select-none',
          n.read ? 'opacity-70 hover:bg-slate-50 dark:hover:bg-slate-800/40' : 'bg-emerald-500/5 hover:bg-emerald-500/10'
        ]"
      >
        <div class="p-2.5 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shrink-0">
          <Activity class="w-5 h-5" />
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between mb-1">
            <h3 class="font-bold text-sm text-slate-900 dark:text-white truncate">{{ n.title }}</h3>
            <span class="text-xs text-slate-400 shrink-0 font-mono">{{ timeAgo(n.createdAt) }}</span>
          </div>
          <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{{ n.message }}</p>
        </div>

        <span
          v-if="!n.read"
          class="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 mt-2"
        />
      </div>

      <div
        v-if="store.notifications.length === 0"
        class="py-16 text-center text-xs text-slate-400"
      >
        No active notifications.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Activity } from 'lucide-vue-next';
import { useDentalStore } from '@/stores/dental';
import { timeAgo } from '@/utils/format';
import { sound } from '@/utils/sound';

const store = useDentalStore();
</script>
