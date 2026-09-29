<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { 
  ArrowLeft, 
  Download, 
  Trash2, 
  FileCode, 
  FileText, 
  Plus
} from 'lucide-vue-next';
import Button from '@/components/ui/Button.vue';
import { useDentalStore } from '@/stores/dental';
import { formatDate } from '@/utils/format';
import { sound } from '@/utils/sound';

interface OrderFileEntry {
  id: string;
  name: string;
  type: 'STL' | 'PLY' | 'PDF' | 'IMAGE';
  size: string;
  uploadedAt: string;
  uploadedBy: string;
  category: 'Scans' | 'Designs' | 'Prescriptions';
}

const INITIAL_FILES: OrderFileEntry[] = [
  { id: 'f1', name: 'upper_arch_maxilla_scan.stl', type: 'STL', size: '14.2 MB', uploadedAt: '2025-02-12T10:30:00Z', uploadedBy: 'Dr. Marcus Webb', category: 'Scans' },
  { id: 'f2', name: 'lower_arch_mandible_scan.stl', type: 'STL', size: '12.8 MB', uploadedAt: '2025-02-12T10:31:00Z', uploadedBy: 'Dr. Marcus Webb', category: 'Scans' },
  { id: 'f3', name: 'bite_registration_scan.ply', type: 'PLY', size: '4.5 MB', uploadedAt: '2025-02-12T10:32:00Z', uploadedBy: 'Dr. Marcus Webb', category: 'Scans' },
  { id: 'f4', name: 'cad_crown_design_v2.stl', type: 'STL', size: '8.1 MB', uploadedAt: '2025-02-13T14:15:00Z', uploadedBy: 'T. Anderson (CAD Lead)', category: 'Designs' },
  { id: 'f5', name: 'clinical_rx_prescription_signed.pdf', type: 'PDF', size: '420 KB', uploadedAt: '2025-02-12T09:45:00Z', uploadedBy: 'Clinic Reception', category: 'Prescriptions' },
];

const route = useRoute();
const router = useRouter();
const dentalStore = useDentalStore();

const orderId = computed(() => route.params.orderId as string);
const order = computed(() => dentalStore.getOrderById(orderId.value));

const files = ref<OrderFileEntry[]>(INITIAL_FILES);
const filterCategory = ref<string>('all');
const isUploading = ref(false);
const uploadProgress = ref(0);

const filteredFiles = computed(() => {
  if (filterCategory.value === 'all') return files.value;
  return files.value.filter((f) => f.category === filterCategory.value);
});

function handleDownload(file: OrderFileEntry) {
  sound.click();
  const dummyContent = `// 3DDX Dental CAD Model File: ${file.name}\n// Order ID: ${order.value?.orderNumber}\n// Generated: ${new Date().toISOString()}`;
  const blob = new Blob([dummyContent], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = file.name;
  a.click();
}

function handleDelete(id: string) {
  sound.click();
  files.value = files.value.filter((f) => f.id !== id);
}

function handleFileUpload(e: Event) {
  const target = e.target as HTMLInputElement;
  if (!target.files?.length) return;
  const uploaded = Array.from(target.files);
  isUploading.value = true;
  uploadProgress.value = 10;
  sound.pop();

  const interval = setInterval(() => {
    uploadProgress.value += 25;
    if (uploadProgress.value >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        const newEntries: OrderFileEntry[] = uploaded.map((f, i) => ({
          id: `f-${Date.now()}-${i}`,
          name: f.name,
          type: f.name.endsWith('.stl') ? 'STL' : f.name.endsWith('.ply') ? 'PLY' : 'PDF',
          size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
          uploadedAt: new Date().toISOString(),
          uploadedBy: 'Current Operator',
          category: f.name.endsWith('.pdf') ? 'Prescriptions' : 'Scans',
        }));
        files.value = [...newEntries, ...files.value];
        isUploading.value = false;
        uploadProgress.value = 0;
        sound.pop();
      }, 400);
    }
  }, 150);
}
</script>

<template>
  <div v-if="order" class="space-y-6 max-w-5xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div class="flex items-center gap-3">
        <Button variant="ghost" size="sm" @click="router.push(`/orders/${order.id}`)">
          <ArrowLeft class="w-4 h-4 mr-1" />
          Back
        </Button>
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            Digital Assets & 3D Models: {{ order.orderNumber }}
          </h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Intraoral scans, CAD design outputs, and laboratory documentation
          </p>
        </div>
      </div>

      <label class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold cursor-pointer shadow-sm transition-colors">
        <Plus class="w-4 h-4" />
        <span>Upload New Assets</span>
        <input type="file" multiple @change="handleFileUpload" class="hidden" />
      </label>
    </div>

    <!-- Uploading Status Bar -->
    <div v-if="isUploading" class="bg-white dark:bg-gray-800 p-4 rounded-xl border border-emerald-200 dark:border-emerald-900 shadow-sm">
      <div class="flex justify-between items-center text-xs font-semibold text-emerald-700 dark:text-emerald-300 mb-2">
        <span>Uploading digital scan file(s)...</span>
        <span>{{ uploadProgress }}%</span>
      </div>
      <div class="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
        <div 
          class="bg-emerald-600 h-2 rounded-full transition-all duration-200"
          :style="{ width: `${uploadProgress}%` }"
        />
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="flex gap-2 border-b border-gray-200 dark:border-gray-800">
      <button
        v-for="tab in [
          { id: 'all', label: 'All Assets', count: files.length },
          { id: 'Scans', label: 'Intraoral Scans (.STL/.PLY)', count: files.filter(f => f.category === 'Scans').length },
          { id: 'Designs', label: 'CAD Designs', count: files.filter(f => f.category === 'Designs').length },
          { id: 'Prescriptions', label: 'Prescriptions & PDFs', count: files.filter(f => f.category === 'Prescriptions').length },
        ]"
        :key="tab.id"
        @click="filterCategory = tab.id"
        :class="[
          'flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors',
          filterCategory === tab.id
            ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
        ]"
      >
        <span>{{ tab.label }}</span>
        <span class="px-1.5 py-0.5 rounded-full text-[11px] bg-gray-100 dark:bg-gray-800">
          {{ tab.count }}
        </span>
      </button>
    </div>

    <!-- File List -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="divide-y divide-gray-100 dark:divide-gray-800">
        <div 
          v-for="file in filteredFiles" 
          :key="file.id" 
          class="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
        >
          <div class="flex items-center gap-3">
            <div class="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
              <FileText v-if="file.type === 'PDF'" class="w-5 h-5" />
              <FileCode v-else class="w-5 h-5" />
            </div>
            <div>
              <div class="font-mono text-sm font-semibold text-gray-900 dark:text-white">
                {{ file.name }}
              </div>
              <div class="text-xs text-gray-400 mt-0.5 flex items-center gap-2">
                <span class="font-medium text-gray-600 dark:text-gray-300">{{ file.size }}</span>
                <span>•</span>
                <span>Uploaded by {{ file.uploadedBy }}</span>
                <span>•</span>
                <span>{{ formatDate(file.uploadedAt) }}</span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button 
              size="sm" 
              variant="outline" 
              @click="handleDownload(file)"
              class="gap-1.5 text-xs"
            >
              <Download class="w-3.5 h-3.5" />
              Download
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              @click="handleDelete(file.id)"
              class="text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs"
            >
              <Trash2 class="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="p-8 text-center bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
    <h2 class="text-xl font-bold text-gray-900 dark:text-white">Order Not Found</h2>
    <Button class="mt-4" @click="router.push('/orders')">Return to Orders</Button>
  </div>
</template>
