<template>
  <div v-if="order" class="space-y-6 max-w-3xl mx-auto">
    <!-- Header -->
    <div class="flex items-center gap-3">
      <router-link
        :to="`/orders/${order.id}`"
        class="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition-colors"
      >
        <ArrowLeft class="w-4 h-4" />
      </router-link>
      <div>
        <h1 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Edit Order #{{ order.orderNumber }}
        </h1>
        <p class="text-xs text-slate-500 dark:text-slate-400">
          Update restoration shade, priority, notes, or target delivery.
        </p>
      </div>
    </div>

    <!-- Edit Form Card -->
    <div class="p-6 rounded-3xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div>
          <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Priority</label>
          <Select
            v-model="editForm.priority"
            :options="[
              { value: 'Normal', label: 'Normal' },
              { value: 'High', label: 'High' },
              { value: 'Urgent', label: 'Urgent' },
            ]"
          />
        </div>

        <div>
          <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Status</label>
          <Select
            v-model="editForm.status"
            :options="[
              { value: 'New', label: 'New' },
              { value: 'Review', label: 'Review' },
              { value: 'Design', label: 'Design' },
              { value: 'Production', label: 'Production' },
              { value: 'Quality Check', label: 'Quality Check' },
              { value: 'Ready', label: 'Ready' },
              { value: 'Completed', label: 'Completed' },
            ]"
          />
        </div>

        <div>
          <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">VITA Shade</label>
          <Select
            v-model="editForm.shade"
            :options="['A1', 'A2', 'A3', 'A3.5', 'B1', 'B2', 'BL1'].map(s => ({ value: s, label: `Shade ${s}` }))"
          />
        </div>

        <div>
          <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Due Date</label>
          <DateInput v-model="editForm.dueDate" />
        </div>

        <div class="sm:col-span-2">
          <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Prescription Notes</label>
          <textarea
            v-model="editForm.notes"
            rows="4"
            class="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono text-xs"
          />
        </div>
      </div>

      <div class="pt-3 flex justify-end gap-2">
        <router-link
          :to="`/orders/${order.id}`"
          class="px-4 py-2 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          Cancel
        </router-link>
        <button
          type="button"
          @click="saveChanges"
          class="px-5 py-2 text-xs font-bold rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md transition-all active:scale-95"
        >
          Save Order Changes
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowLeft } from 'lucide-vue-next';
import { useDentalStore } from '@/stores/dental';
import Select from '@/components/ui/Select.vue';
import DateInput from '@/components/ui/DateInput.vue';
import { sound } from '@/utils/sound';

const route = useRoute();
const router = useRouter();
const store = useDentalStore();

const orderId = computed(() => route.params.id as string);
const order = computed(() => store.orders.find(o => o.id === orderId.value));

const editForm = ref({
  priority: order.value?.priority || 'Normal',
  status: order.value?.status || 'New',
  shade: order.value?.shade || 'A2',
  dueDate: order.value?.dueDate || '',
  notes: order.value?.notes || '',
});

const saveChanges = () => {
  if (!order.value) return;
  store.updateOrder(order.value.id, editForm.value);
  sound.playSuccess();
  router.push(`/orders/${order.value.id}`);
};
</script>
