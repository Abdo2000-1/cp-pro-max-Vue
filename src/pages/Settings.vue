<template>
  <div class="space-y-6 max-w-4xl mx-auto">
    <!-- Header -->
    <div>
      <h1 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
        Settings & Preferences
      </h1>
      <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
        Manage appearance themes, audio micro-haptics, laboratory profile, and notifications.
      </p>
    </div>

    <!-- 1. APPEARANCE & THEME SWITCHER (Light, Dark, Crimson, System) -->
    <div class="p-6 rounded-3xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div class="border-b border-slate-100 dark:border-slate-800/80 pb-3">
        <h3 class="font-bold text-base text-slate-900 dark:text-white">Interface Appearance</h3>
        <p class="text-xs text-slate-500">Choose your preferred visual theme for the laboratory dashboard.</p>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <!-- Light Theme -->
        <button
          type="button"
          @click="store.setTheme('light')"
          :class="[
            'p-4 rounded-2xl border text-left cursor-pointer transition-all duration-150 select-none flex flex-col justify-between gap-3',
            store.theme === 'light'
              ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/20 shadow-sm'
              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
          ]"
        >
          <div class="flex items-center justify-between">
            <span class="p-2 rounded-xl bg-amber-100 text-amber-600">
              <Sun class="w-4 h-4" />
            </span>
            <Check v-if="store.theme === 'light'" class="w-4 h-4 text-emerald-500 stroke-[3]" />
          </div>
          <div>
            <div class="font-bold text-xs text-slate-900 dark:text-white">Clean Light</div>
            <span class="text-[10px] text-slate-400">Mint & Slate</span>
          </div>
        </button>

        <!-- Dark Theme (Vue Emerald) -->
        <button
          type="button"
          @click="store.setTheme('dark')"
          :class="[
            'p-4 rounded-2xl border text-left cursor-pointer transition-all duration-150 select-none flex flex-col justify-between gap-3',
            store.theme === 'dark'
              ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-500/10 shadow-sm'
              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
          ]"
        >
          <div class="flex items-center justify-between">
            <span class="p-2 rounded-xl bg-slate-800 text-emerald-400">
              <Moon class="w-4 h-4" />
            </span>
            <Check v-if="store.theme === 'dark'" class="w-4 h-4 text-emerald-500 stroke-[3]" />
          </div>
          <div>
            <div class="font-bold text-xs text-slate-900 dark:text-white">Vue Obsidian</div>
            <span class="text-[10px] text-slate-400">Emerald Dark</span>
          </div>
        </button>

        <!-- Crimson Theme -->
        <button
          type="button"
          @click="store.setTheme('crimson')"
          :class="[
            'p-4 rounded-2xl border text-left cursor-pointer transition-all duration-150 select-none flex flex-col justify-between gap-3',
            store.theme === 'crimson'
              ? 'border-rose-500 ring-2 ring-rose-500/20 bg-rose-500/10 shadow-sm'
              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
          ]"
        >
          <div class="flex items-center justify-between">
            <span class="p-2 rounded-xl bg-rose-950 text-rose-400">
              <Palette class="w-4 h-4" />
            </span>
            <Check v-if="store.theme === 'crimson'" class="w-4 h-4 text-rose-500 stroke-[3]" />
          </div>
          <div>
            <div class="font-bold text-xs text-slate-900 dark:text-white">Ruby Crimson</div>
            <span class="text-[10px] text-slate-400">Deep Velvet</span>
          </div>
        </button>

        <!-- System Theme -->
        <button
          type="button"
          @click="store.setTheme('system')"
          :class="[
            'p-4 rounded-2xl border text-left cursor-pointer transition-all duration-150 select-none flex flex-col justify-between gap-3',
            store.theme === 'system'
              ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-500/10 shadow-sm'
              : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
          ]"
        >
          <div class="flex items-center justify-between">
            <span class="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              <Laptop class="w-4 h-4" />
            </span>
            <Check v-if="store.theme === 'system'" class="w-4 h-4 text-emerald-500 stroke-[3]" />
          </div>
          <div>
            <div class="font-bold text-xs text-slate-900 dark:text-white">System Auto</div>
            <span class="text-[10px] text-slate-400">Match OS</span>
          </div>
        </button>
      </div>
    </div>

    <!-- 2. AUDIO & HAPTICS SETTINGS -->
    <div class="p-6 rounded-3xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div class="border-b border-slate-100 dark:border-slate-800/80 pb-3 flex items-center justify-between">
        <div>
          <h3 class="font-bold text-base text-slate-900 dark:text-white">Audio Micro-Haptics</h3>
          <p class="text-xs text-slate-500">Subtle web-audio clicks and chord feedback for dental CAD actions.</p>
        </div>
        <button
          type="button"
          @click="store.toggleSound"
          :class="[
            'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
            store.soundEnabled ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
          ]"
        >
          <span
            :class="[
              'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
              store.soundEnabled ? 'translate-x-5' : 'translate-x-0'
            ]"
          />
        </button>
      </div>

      <div class="flex items-center gap-3 pt-2">
        <button
          type="button"
          @click="sound.playClick(); sound.playPop()"
          class="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors border border-slate-200 dark:border-slate-700"
        >
          Test Click & Pop Sound
        </button>
        <button
          type="button"
          @click="sound.playSuccess()"
          class="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 transition-colors border border-emerald-500/30"
        >
          Test Success Chord
        </button>
      </div>
    </div>

    <!-- 3. PROFILE SETTINGS -->
    <div class="p-6 rounded-3xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div class="border-b border-slate-100 dark:border-slate-800/80 pb-3">
        <h3 class="font-bold text-base text-slate-900 dark:text-white">Laboratory User Profile</h3>
        <p class="text-xs text-slate-500">Contact information and certification credentials.</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div>
          <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">First Name</label>
          <input
            v-model="profileForm.firstName"
            type="text"
            class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        <div>
          <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Last Name</label>
          <input
            v-model="profileForm.lastName"
            type="text"
            class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        <div>
          <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
          <input
            v-model="profileForm.email"
            type="email"
            class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        <div>
          <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Phone Number</label>
          <input
            v-model="profileForm.phone"
            type="text"
            class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        <div>
          <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Professional Role</label>
          <input
            v-model="profileForm.role"
            type="text"
            class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        <div>
          <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">CAD License / Cert #</label>
          <input
            v-model="profileForm.licenseNumber"
            type="text"
            class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>
      </div>

      <div class="pt-3 flex justify-end">
        <button
          type="button"
          @click="saveProfile"
          class="px-5 py-2 text-xs font-bold text-slate-950 bg-emerald-500 hover:bg-emerald-400 rounded-xl shadow-md shadow-emerald-500/20 transition-all active:scale-95"
        >
          Save Profile Changes
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Sun, Moon, Palette, Laptop, Check } from 'lucide-vue-next';
import { useDentalStore } from '@/stores/dental';
import { sound } from '@/utils/sound';

const store = useDentalStore();

const profileForm = ref({
  firstName: store.profile.firstName,
  lastName: store.profile.lastName,
  email: store.profile.email,
  phone: store.profile.phone,
  role: store.profile.role,
  licenseNumber: store.profile.licenseNumber,
});

const saveProfile = () => {
  store.updateProfile(profileForm.value);
  sound.playSuccess();
  alert('Profile updated successfully!');
};
</script>
