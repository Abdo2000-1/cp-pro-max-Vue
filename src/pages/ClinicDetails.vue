<template>
  <div v-if="clinic" class="space-y-6 max-w-4xl mx-auto">
    <div class="flex items-center gap-3">
      <router-link
        to="/clinics"
        class="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition-colors"
      >
        <ArrowLeft class="w-4 h-4" />
      </router-link>
      <div>
        <h1 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          {{ clinic.name }}
        </h1>
        <p class="text-xs text-slate-500 dark:text-slate-400">
          {{ clinic.address }}, {{ clinic.city }}
        </p>
      </div>
    </div>

    <!-- Clinic Card -->
    <div class="p-6 rounded-3xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-6">
      <span class="p-4 rounded-3xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
        <Building2 class="w-10 h-10" />
      </span>
      <div class="space-y-1 text-xs">
        <h3 class="font-extrabold text-base text-slate-900 dark:text-white">{{ clinic.name }}</h3>
        <span class="text-slate-500 block">{{ clinic.address }}, {{ clinic.city }}</span>
        <div class="text-slate-500 font-mono">{{ clinic.email }} • {{ clinic.phone }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { ArrowLeft, Building2 } from 'lucide-vue-next';
import { useDentalStore } from '@/stores/dental';

const route = useRoute();
const store = useDentalStore();
const clinicId = computed(() => route.params.id as string);
const clinic = computed(() => store.clinics.find(c => c.id === clinicId.value));
</script>
