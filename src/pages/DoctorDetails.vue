<template>
  <div v-if="doctor" class="space-y-6 max-w-4xl mx-auto">
    <div class="flex items-center gap-3">
      <router-link
        to="/doctors"
        class="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition-colors"
      >
        <ArrowLeft class="w-4 h-4" />
      </router-link>
      <div>
        <h1 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          {{ doctor.name }}
        </h1>
        <p class="text-xs text-slate-500 dark:text-slate-400">
          {{ doctor.specialty }} • {{ doctor.clinicName }}
        </p>
      </div>
    </div>

    <!-- Doctor Profile Card -->
    <div class="p-6 rounded-3xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-6">
      <Avatar :name="doctor.name" size="xl" status="online" />
      <div class="space-y-1 text-xs">
        <h3 class="font-extrabold text-base text-slate-900 dark:text-white">{{ doctor.name }}</h3>
        <span class="text-emerald-600 dark:text-emerald-400 font-bold block">{{ doctor.specialty }}</span>
        <div class="text-slate-500 font-mono">{{ doctor.email }} • {{ doctor.phone }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { ArrowLeft } from 'lucide-vue-next';
import { useDentalStore } from '@/stores/dental';
import Avatar from '@/components/ui/Avatar.vue';

const route = useRoute();
const store = useDentalStore();
const doctorId = computed(() => route.params.id as string);
const doctor = computed(() => store.doctors.find(d => d.id === doctorId.value));
</script>
