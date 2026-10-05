<template>
  <div class="space-y-6 w-full max-w-5xl mx-auto min-w-0 select-none pb-12">
    
    <!-- Toast Notification -->
    <Transition name="fade">
      <div
        v-if="toastMessage"
        class="fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-2xl shadow-emerald-900/40 border border-emerald-400"
      >
        <CheckCircle2 class="w-4 h-4" />
        <span>{{ toastMessage }}</span>
      </div>
    </Transition>

    <!-- Header Banner -->
    <div class="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070b14] shadow-sm">
      <div class="h-36 bg-gradient-to-r from-[#0284c7] via-[#0369a1] to-[#ea580c] relative p-6 flex items-end justify-between">
        <div class="flex items-center gap-2">
          <span class="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-white/20 backdrop-blur-md text-white border border-white/20">
            CP PRO MAX • Master Specialist Profile
          </span>
        </div>
        <span class="text-[11px] font-mono text-white/80 font-bold hidden sm:inline">
          UUID: 3DDX-USER-9941
        </span>
      </div>

      <!-- Avatar & Bio Header -->
      <div class="px-6 pb-6 pt-0 relative flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-12">
        <div class="flex items-end gap-4">
          <div class="w-24 h-24 rounded-3xl bg-slate-900 border-4 border-white dark:border-[#070b14] shadow-xl flex items-center justify-center text-white text-3xl font-black bg-gradient-to-tr from-sky-600 to-indigo-600">
            {{ initials }}
          </div>
          <div class="mb-1">
            <h1 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>{{ firstName }} {{ lastName }}</span>
              <span class="p-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20" title="Verified Specialist">
                <Check class="w-3.5 h-3.5 stroke-[3]" />
              </span>
            </h1>
            <p class="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {{ role }} • <span class="font-mono text-sky-600 dark:text-sky-400">{{ license }}</span>
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2 self-stretch sm:self-auto">
          <button
            type="button"
            @click="handleSave"
            class="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#0284c7] hover:bg-sky-600 text-white font-bold text-xs shadow-md shadow-sky-500/20 transition-all cursor-pointer"
          >
            <Save class="w-3.5 h-3.5" />
            <span>Save Preferences</span>
          </button>
          <button
            type="button"
            @click="handleLogout"
            class="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-bold text-xs transition-colors cursor-pointer"
            title="Log Out"
          >
            <LogOut class="w-3.5 h-3.5" />
            <span class="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      <!-- Tab Switcher -->
      <div class="flex items-center gap-2 px-6 border-t border-slate-100 dark:border-slate-800/80 overflow-x-auto scrollbar-none py-2 text-xs font-bold">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          @click="activeTab = tab.id; sound.playClick(600)"
          :class="[
            'flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap',
            activeTab === tab.id
              ? 'bg-[#0284c7]/10 text-[#0284c7] dark:text-sky-400 border border-[#0284c7]/30'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          ]"
        >
          <component :is="tab.icon" class="w-4 h-4" />
          <span>{{ tab.label }}</span>
        </button>
      </div>
    </div>

    <!-- TAB CONTENT -->
    <div class="bg-white dark:bg-[#070b14] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      
      <!-- PROFILE TAB -->
      <div v-if="activeTab === 'profile'" class="space-y-6">
        <div class="border-b border-slate-100 dark:border-slate-800 pb-3">
          <h2 class="text-base font-bold text-slate-900 dark:text-white">Professional Identity & Credentials</h2>
          <p class="text-xs text-slate-500">Your digital lab identity reflected across Co-Diagnostix planning and delivery sign-offs.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label class="block text-slate-600 dark:text-slate-400 font-semibold mb-1">First Name</label>
            <input
              type="text"
              v-model="firstName"
              class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
            />
          </div>

          <div>
            <label class="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Last Name</label>
            <input
              type="text"
              v-model="lastName"
              class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
            />
          </div>

          <div>
            <label class="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Work Email</label>
            <input
              type="email"
              v-model="email"
              class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
            />
          </div>

          <div>
            <label class="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Direct Telephone / Extension</label>
            <input
              type="text"
              v-model="phone"
              class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
            />
          </div>

          <div class="md:col-span-2">
            <label class="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Professional Bio & Specialization</label>
            <textarea
              rows="3"
              v-model="bio"
              class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      <!-- APPEARANCE & NAVIGATION TAB -->
      <div v-else-if="activeTab === 'appearance'" class="space-y-6">
        <div class="border-b border-slate-100 dark:border-slate-800 pb-3">
          <h2 class="text-base font-bold text-slate-900 dark:text-white">Workspace Personalization & Convertible Navigation</h2>
          <p class="text-xs text-slate-500">Configure your 4-way movable docking navigation and theme aesthetics.</p>
        </div>

        <div class="space-y-4 text-xs">
          <div>
            <label class="block font-bold text-slate-700 dark:text-slate-300 mb-2">Convertible Navigation Dock Position</label>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                v-for="pos in (['top', 'bottom', 'left', 'right'] as const)"
                :key="pos"
                type="button"
                @click="dockPos = pos; updateDock(pos)"
                :class="[
                  'p-3 rounded-2xl border font-bold capitalize flex flex-col items-center gap-1.5 transition-all cursor-pointer',
                  dockPos === pos
                    ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-600 border-sky-500 ring-2 ring-sky-400'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900'
                ]"
              >
                <Compass class="w-5 h-5 text-amber-500" />
                <span>{{ pos }} Dock</span>
              </button>
            </div>
          </div>

          <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span class="font-bold text-slate-900 dark:text-white block">Acoustic Audio Feedback</span>
              <span class="text-slate-400">Tactile audio feedback on odontogram clicks and order status transitions.</span>
            </div>
            <button
              type="button"
              @click="soundEnabled = !soundEnabled"
              :class="[
                'p-2 rounded-xl border transition-colors cursor-pointer',
                soundEnabled ? 'bg-sky-50 dark:bg-sky-950/40 text-sky-600 border-sky-400' : 'border-slate-200 text-slate-400'
              ]"
            >
              <Volume2 v-if="soundEnabled" class="w-5 h-5" />
              <VolumeX v-else class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <!-- PACS & WORKFLOW TAB -->
      <div v-else-if="activeTab === 'pacs'" class="space-y-4 text-xs">
        <div class="border-b border-slate-100 dark:border-slate-800 pb-3">
          <h2 class="text-base font-bold text-slate-900 dark:text-white">PACS & Telemetry Synchronization</h2>
          <p class="text-xs text-slate-500">Live background sync interval with 3DDX Boston Radiology Hub.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <span class="font-bold text-slate-900 dark:text-white">Background Auto-Sync</span>
            <p class="text-slate-400">Keep order statuses synchronized in realtime with CS Maestro and Co-Diagnostix stations.</p>
            <div class="pt-2">
              <span class="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
                Active • 15s Heartbeat
              </span>
            </div>
          </div>

          <div class="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <span class="font-bold text-slate-900 dark:text-white">Co-Diagnostix Integration Server</span>
            <p class="text-slate-400">BSB Local Server: <span class="font-mono text-sky-600 dark:text-sky-400">\\3DDX-STORAGE\Pt_Folders\</span></p>
            <div class="pt-2">
              <span class="px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold border border-sky-500/20">
                Connected • Latency 4ms
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- SECURITY TAB -->
      <div v-else class="space-y-4 text-xs">
        <div class="border-b border-slate-100 dark:border-slate-800 pb-3">
          <h2 class="text-base font-bold text-slate-900 dark:text-white">Security & 2-Factor Authentication</h2>
          <p class="text-xs text-slate-500">Manage role tokens and clinical authorization keys.</p>
        </div>

        <div class="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span class="font-bold text-slate-900 dark:text-white block">Two-Factor Hardware Token</span>
            <span class="text-slate-400">FIDO2 / YubiKey physical token registered for order price modification approvals.</span>
          </div>
          <span class="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
            Enforced
          </span>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  User, Sliders, Database, Shield, CheckCircle2, Check,
  Save, LogOut, Compass, Volume2, VolumeX
} from 'lucide-vue-next';
import { useDentalStore } from '@/stores/dental';
import { sound } from '@/utils/sound';

const router = useRouter();
const store = useDentalStore();

const activeTab = ref<'profile' | 'appearance' | 'pacs' | 'security'>('profile');
const toastMessage = ref<string | null>(null);

const firstName = ref(store.profile?.firstName || 'Abdo');
const lastName = ref(store.profile?.lastName || 'Mohamed');
const email = ref('a.aladawy@3ddx.com');
const phone = ref('+1 (555) 749-3821');
const role = ref('Lead CAD/CAM Engineer & Co-Diagnostix Director');
const license = ref('CAD-DL-89421');
const bio = ref('Specialist in digital dental prosthetics, coDiagnostiX surgical guide planning, and 3D intraoral scan segmentation.');

const dockPos = ref<string>(localStorage.getItem('3ddx-cp-nav-position') || 'top');
const soundEnabled = ref(true);

const initials = computed(() => {
  return `${firstName.value.charAt(0)}${lastName.value.charAt(0)}`.toUpperCase();
});

const tabs = [
  { id: 'profile' as const, label: 'Profile Details', icon: User },
  { id: 'appearance' as const, label: 'Appearance & Docking', icon: Sliders },
  { id: 'pacs' as const, label: 'PACS Telemetry', icon: Database },
  { id: 'security' as const, label: 'Security & Auth', icon: Shield },
];

const showToast = (msg: string) => {
  toastMessage.value = msg;
  sound.playClick(900);
  setTimeout(() => (toastMessage.value = null), 3000);
};

const updateDock = (pos: string) => {
  localStorage.setItem('3ddx-cp-nav-position', pos);
  window.dispatchEvent(new Event('storage'));
  sound.playClick(700);
};

const handleSave = () => {
  localStorage.setItem('3ddx-cp-nav-position', dockPos.value);
  window.dispatchEvent(new Event('storage'));
  showToast('Preferences saved successfully!');
};

const handleLogout = () => {
  store.logout();
  router.push('/login');
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
