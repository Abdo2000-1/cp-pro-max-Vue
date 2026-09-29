<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Documents & 3D Scan Assets
        </h1>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Intraoral STL scans, patient photos, lab prescriptions, and CBCT datasets.
        </p>
      </div>
    </div>

    <!-- Documents Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="d in documents"
        :key="d.id"
        class="p-5 rounded-3xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between gap-3"
      >
        <div class="flex items-start gap-3 truncate">
          <div class="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
            <FileText class="w-6 h-6" />
          </div>
          <div class="truncate">
            <h3 class="font-bold text-sm text-slate-900 dark:text-white truncate">{{ d.name }}</h3>
            <span class="text-xs text-slate-400 block">{{ d.category }} • {{ d.size }}</span>
            <span class="text-[11px] text-slate-500 mt-1 block">{{ d.doctor }} • {{ d.date }}</span>
          </div>
        </div>

        <button
          type="button"
          @click="downloadDoc(d.name)"
          class="p-2 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
          title="Download File"
        >
          <Download class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { FileText, Download } from 'lucide-vue-next';
import { sound } from '@/utils/sound';

const documents = ref([
  { id: 'doc-1', name: 'Maxilla_FullArch_Scan.stl', category: 'Scan Files', size: '14.8 MB', date: '2026-09-28', doctor: 'Dr. Allison Park' },
  { id: 'doc-2', name: 'Mandible_Antagonist.ply', category: 'Scan Files', size: '9.2 MB', date: '2026-09-28', doctor: 'Dr. Allison Park' },
  { id: 'doc-3', name: 'Digital_Rx_Prescription_#1042.pdf', category: 'Prescriptions', size: '1.4 MB', date: '2026-09-27', doctor: 'Dr. Marcus Webb' },
  { id: 'doc-4', name: 'CBCT_SurgicalGuide_DICOM.zip', category: 'Scan Files', size: '142 MB', date: '2026-09-25', doctor: 'Dr. Kevin Murphy' },
  { id: 'doc-5', name: 'Smile_Aesthetic_Photo_Front.jpg', category: 'Patient Photos', size: '3.6 MB', date: '2026-09-24', doctor: 'Dr. Sophia Lin' },
  { id: 'doc-6', name: 'Lab_Invoice_INV-1039.pdf', category: 'Invoices', size: '280 KB', date: '2026-09-22', doctor: 'Dr. Allison Park' },
]);

const downloadDoc = (name: string) => {
  sound.playClick();
  alert(`Downloading document: ${name}`);
};
</script>
