<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Prescribing Doctors
        </h1>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Directory of registered dental surgeons, prosthodontists, and orthodontists.
        </p>
      </div>

      <div class="w-full sm:w-72">
        <SearchInput v-model="searchQuery" placeholder="Search doctors by name or specialty..." />
      </div>
    </div>

    <!-- Doctors Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="d in filteredDoctors"
        :key="d.id"
        class="p-5 rounded-3xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/40 hover:shadow-md transition-all flex flex-col justify-between"
      >
        <div>
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <Avatar :name="d.name" size="md" status="online" />
              <div>
                <h3 class="font-bold text-sm text-slate-900 dark:text-white">{{ d.name }}</h3>
                <span class="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">{{ d.specialty }}</span>
              </div>
            </div>
            <StatusBadge :status="d.status" size="sm" />
          </div>

          <div class="space-y-2 text-xs text-slate-600 dark:text-slate-300 py-3 border-y border-slate-100 dark:border-slate-800/80">
            <div class="flex items-center gap-2 truncate">
              <Building2 class="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span class="truncate">{{ d.clinicName }}</span>
            </div>
            <div class="flex items-center gap-2 truncate">
              <Mail class="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span class="truncate font-mono">{{ d.email }}</span>
            </div>
            <div class="flex items-center gap-2 truncate">
              <Phone class="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span class="truncate font-mono">{{ d.phone }}</span>
            </div>
          </div>
        </div>

        <div class="mt-4 pt-3 flex items-center justify-between text-xs">
          <span class="font-bold text-slate-500 dark:text-slate-400">
            {{ d.ordersCount }} Active Cases
          </span>
          <router-link
            :to="`/doctors/${d.id}`"
            class="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            <span>Doctor Profile</span>
            <ChevronRight class="w-3.5 h-3.5" />
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Building2, Mail, Phone, ChevronRight } from 'lucide-vue-next';
import { useDentalStore } from '@/stores/dental';
import Avatar from '@/components/ui/Avatar.vue';
import StatusBadge from '@/components/ui/StatusBadge.vue';
import SearchInput from '@/components/ui/SearchInput.vue';

const store = useDentalStore();
const searchQuery = ref('');

const filteredDoctors = computed(() => {
  if (!searchQuery.value.trim()) return store.doctors;
  const q = searchQuery.value.toLowerCase();
  return store.doctors.filter(d =>
    d.name.toLowerCase().includes(q) ||
    d.specialty.toLowerCase().includes(q) ||
    d.clinicName.toLowerCase().includes(q)
  );
});
</script>
