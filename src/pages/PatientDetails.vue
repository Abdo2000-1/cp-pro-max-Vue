<template>
  <div v-if="patient" class="space-y-6 max-w-4xl mx-auto">
    <!-- Header -->
    <div class="flex items-center gap-3">
      <router-link
        to="/patients"
        class="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition-colors"
      >
        <ArrowLeft class="w-4 h-4" />
      </router-link>
      <div>
        <h1 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          {{ patient.name }}
        </h1>
        <p class="text-xs text-slate-500 dark:text-slate-400">
          Patient Profile • {{ patient.clinicName }}
        </p>
      </div>
    </div>

    <!-- Info Card -->
    <div class="p-6 rounded-3xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-6">
      <Avatar :name="patient.name" size="xl" status="online" />
      <div class="space-y-2 flex-1 text-xs">
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 py-2 border-y border-slate-100 dark:border-slate-800">
          <div>
            <span class="text-slate-400 block text-[10px] uppercase font-bold">Gender</span>
            <strong class="text-slate-900 dark:text-white">{{ patient.gender === 'F' ? 'Female' : 'Male' }}</strong>
          </div>
          <div>
            <span class="text-slate-400 block text-[10px] uppercase font-bold">Birth Date</span>
            <strong class="text-slate-900 dark:text-white font-mono">{{ patient.dob }}</strong>
          </div>
          <div>
            <span class="text-slate-400 block text-[10px] uppercase font-bold">Phone</span>
            <strong class="text-slate-900 dark:text-white font-mono">{{ patient.phone }}</strong>
          </div>
          <div>
            <span class="text-slate-400 block text-[10px] uppercase font-bold">Doctor</span>
            <strong class="text-slate-900 dark:text-white">{{ patient.doctorName }}</strong>
          </div>
        </div>
      </div>
    </div>

    <!-- Patient Past Orders -->
    <div class="p-6 rounded-3xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <h3 class="font-bold text-base text-slate-900 dark:text-white">Prescription & Order History</h3>
      <div class="space-y-2">
        <div
          v-for="order in patientOrders"
          :key="order.id"
          class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
        >
          <div>
            <div class="font-mono font-bold text-emerald-600 dark:text-emerald-400 mb-0.5">
              #{{ order.orderNumber }} - {{ order.restoration }}
            </div>
            <span class="text-slate-400">{{ order.units }} Units • Shade {{ order.shade }}</span>
          </div>
          <div class="flex items-center gap-3">
            <StatusBadge :status="order.status" size="sm" />
            <router-link
              :to="`/orders/${order.id}`"
              class="font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Details →
            </router-link>
          </div>
        </div>

        <div v-if="patientOrders.length === 0" class="py-8 text-center text-xs text-slate-400">
          No past orders recorded for this patient.
        </div>
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
import StatusBadge from '@/components/ui/StatusBadge.vue';

const route = useRoute();
const store = useDentalStore();

const patientId = computed(() => route.params.id as string);
const patient = computed(() => store.patients.find(p => p.id === patientId.value));
const patientOrders = computed(() => store.orders.filter(o => o.patientId === patientId.value || o.patientName === patient.value?.name));
</script>
