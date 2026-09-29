<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Billing & Invoicing
        </h1>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Track clinical statements, paid vouchers, and pending lab invoices.
        </p>
      </div>

      <button
        type="button"
        @click="generateStatement"
        class="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-xl shadow-md transition-all active:scale-95"
      >
        <Receipt class="w-4 h-4" />
        <span>Generate Statement</span>
      </button>
    </div>

    <!-- Billing Table -->
    <div class="rounded-3xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-slate-400 font-bold uppercase tracking-wider">
              <th class="py-3.5 px-4">Invoice #</th>
              <th class="py-3.5 px-4">Order Ref</th>
              <th class="py-3.5 px-4">Clinic / Doctor</th>
              <th class="py-3.5 px-4">Amount</th>
              <th class="py-3.5 px-4">Status</th>
              <th class="py-3.5 px-4">Due Date</th>
              <th class="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
            <tr
              v-for="b in store.billing"
              :key="b.id"
              class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
            >
              <td class="py-3.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {{ b.invoiceNumber || `INV-${b.orderNumber}` }}
              </td>
              <td class="py-3.5 px-4 font-mono text-slate-500">
                #{{ b.orderNumber }}
              </td>
              <td class="py-3.5 px-4">
                <div class="font-bold text-slate-900 dark:text-white">{{ b.clinicName }}</div>
                <div class="text-[11px] text-slate-400">{{ b.doctorName }}</div>
              </td>
              <td class="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                {{ formatCurrency(b.amount) }}
              </td>
              <td class="py-3.5 px-4">
                <StatusBadge :status="b.status" size="sm" />
              </td>
              <td class="py-3.5 px-4 font-mono text-slate-500">
                {{ formatDate(b.dueDate) }}
              </td>
              <td class="py-3.5 px-4 text-right">
                <button
                  type="button"
                  @click="downloadInvoice(b.orderNumber)"
                  class="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                  title="Download Invoice PDF"
                >
                  <Download class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Receipt, Download } from 'lucide-vue-next';
import { useDentalStore } from '@/stores/dental';
import StatusBadge from '@/components/ui/StatusBadge.vue';
import { formatCurrency, formatDate } from '@/utils/format';
import { sound } from '@/utils/sound';

const store = useDentalStore();

const generateStatement = () => {
  sound.playSuccess();
  alert('Statement generated for active billing cycle.');
};

const downloadInvoice = (orderNumber: string) => {
  sound.playClick();
  alert(`Downloading PDF Invoice for Order #${orderNumber}`);
};
</script>
