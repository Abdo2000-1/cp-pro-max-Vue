<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Partner Clinics
        </h1>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Dental practices and dental networks integrated with the laboratory.
        </p>
      </div>

      <div class="w-full sm:w-72">
        <SearchInput v-model="searchQuery" placeholder="Search clinics by name, city..." />
      </div>
    </div>

    <!-- Clinics Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="c in filteredClinics"
        :key="c.id"
        class="p-5 rounded-3xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/40 hover:shadow-md transition-all flex flex-col justify-between"
      >
        <div>
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <span class="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Building2 class="w-6 h-6" />
              </span>
              <div>
                <h3 class="font-bold text-sm text-slate-900 dark:text-white">{{ c.name }}</h3>
                <span class="text-xs text-slate-400">{{ c.city }}</span>
              </div>
            </div>
            <StatusBadge :status="c.status" size="sm" />
          </div>

          <div class="space-y-2 text-xs text-slate-600 dark:text-slate-300 py-3 border-y border-slate-100 dark:border-slate-800/80">
            <div class="flex items-center gap-2">
              <MapPin class="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{{ c.address }}, {{ c.city }}</span>
            </div>
            <div class="flex items-center gap-2">
              <Phone class="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span class="font-mono">{{ c.phone }}</span>
            </div>
            <div class="flex items-center gap-2">
              <Users class="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{{ c.doctorsCount }} Doctors • {{ c.patientsCount }} Patients</span>
            </div>
          </div>
        </div>

        <div class="mt-4 pt-3 flex items-center justify-between text-xs">
          <span class="font-bold text-slate-500 dark:text-slate-400">
            {{ c.ordersCount }} Total Prescriptions
          </span>
          <router-link
            :to="`/clinics/${c.id}`"
            class="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            <span>Clinic Details</span>
            <ChevronRight class="w-3.5 h-3.5" />
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Building2, MapPin, Phone, Users, ChevronRight } from 'lucide-vue-next';
import { useDentalStore } from '@/stores/dental';
import StatusBadge from '@/components/ui/StatusBadge.vue';
import SearchInput from '@/components/ui/SearchInput.vue';

const store = useDentalStore();
const searchQuery = ref('');

const filteredClinics = computed(() => {
  if (!searchQuery.value.trim()) return store.clinics;
  const q = searchQuery.value.toLowerCase();
  return store.clinics.filter(c =>
    c.name.toLowerCase().includes(q) ||
    c.city.toLowerCase().includes(q) ||
    c.address.toLowerCase().includes(q)
  );
});
</script>
