<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Patients Directory
        </h1>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Search patient records, view past prescriptions, and track active cases.
        </p>
      </div>

      <div class="w-full sm:w-72">
        <SearchInput v-model="searchQuery" placeholder="Search patients by name, email, phone..." />
      </div>
    </div>

    <!-- Patients Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="p in filteredPatients"
        :key="p.id"
        class="p-5 rounded-3xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/40 hover:shadow-md transition-all flex flex-col justify-between"
      >
        <div>
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <Avatar :name="p.name" size="md" status="online" />
              <div>
                <h3 class="font-bold text-sm text-slate-900 dark:text-white">{{ p.name }}</h3>
                <span class="text-xs text-slate-400">{{ p.gender === 'F' ? 'Female' : 'Male' }} • Born {{ p.dob }}</span>
              </div>
            </div>
            <StatusBadge :status="p.status" size="sm" />
          </div>

          <div class="space-y-2 text-xs text-slate-600 dark:text-slate-300 py-3 border-y border-slate-100 dark:border-slate-800/80">
            <div class="flex items-center gap-2 truncate">
              <Building2 class="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span class="truncate">{{ p.clinicName }}</span>
            </div>
            <div class="flex items-center gap-2 truncate">
              <Stethoscope class="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span class="truncate">{{ p.doctorName }}</span>
            </div>
            <div class="flex items-center gap-2 truncate">
              <Phone class="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span class="truncate font-mono">{{ p.phone }}</span>
            </div>
          </div>
        </div>

        <div class="mt-4 pt-3 flex items-center justify-between text-xs">
          <span class="font-bold text-slate-500 dark:text-slate-400">
            {{ p.ordersCount }} Total Case(s)
          </span>
          <router-link
            :to="`/patients/${p.id}`"
            class="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            <span>View Profile</span>
            <ChevronRight class="w-3.5 h-3.5" />
          </router-link>
        </div>
      </div>
    </div>

    <EmptyState
      v-if="filteredPatients.length === 0"
      title="No patients found"
      description="No patient profiles match your search criteria."
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Building2, Stethoscope, Phone, ChevronRight } from 'lucide-vue-next';
import { useDentalStore } from '@/stores/dental';
import Avatar from '@/components/ui/Avatar.vue';
import StatusBadge from '@/components/ui/StatusBadge.vue';
import SearchInput from '@/components/ui/SearchInput.vue';
import EmptyState from '@/components/ui/EmptyState.vue';

const store = useDentalStore();
const searchQuery = ref('');

const filteredPatients = computed(() => {
  if (!searchQuery.value.trim()) return store.patients;
  const q = searchQuery.value.toLowerCase();
  return store.patients.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.email.toLowerCase().includes(q) ||
    p.phone.includes(q) ||
    p.clinicName.toLowerCase().includes(q)
  );
});
</script>
