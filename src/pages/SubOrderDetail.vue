<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { 
  ArrowLeft, 
  CheckCircle2, 
  FileText, 
  Layers, 
  Activity, 
  Save, 
  Scan
} from 'lucide-vue-next';
import Button from '@/components/ui/Button.vue';
import StatusBadge from '@/components/ui/StatusBadge.vue';
import PriorityBadge from '@/components/ui/PriorityBadge.vue';
import TeethChart from '@/components/ui/TeethChart.vue';
import { formatDate } from '@/utils/format';
import { useDentalStore } from '@/stores/dental';
import { sound } from '@/utils/sound';

type SubOrderTab = 'overview' | 'forms' | 'scans' | 'activity';

const route = useRoute();
const router = useRouter();
const dentalStore = useDentalStore();

const orderId = computed(() => route.params.orderId as string);
const subOrderId = computed(() => route.params.subOrderId as string);
const order = computed(() => dentalStore.getOrderById(orderId.value));

const activeTab = ref<SubOrderTab>('overview');
const selectedTeeth = ref<number[]>([14, 15]);
const occlusalContact = ref('Light contact');
const marginType = ref('Chamfer');
const material = ref('Zirconia (Multilayer)');
const shade = ref('A2');
const clinicalNotes = ref('Ensure tight proximal contact on distal aspect.');
const savedSuccess = ref(false);

function handleSaveSpecs() {
  sound.pop();
  savedSuccess.value = true;
  setTimeout(() => {
    savedSuccess.value = false;
  }, 2500);
}
</script>

<template>
  <div v-if="order" class="space-y-6 max-w-5xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div class="flex items-center gap-3">
        <Button variant="ghost" size="sm" @click="router.push(`/orders/${order.id}`)">
          <ArrowLeft class="w-4 h-4 mr-1" />
          Order {{ order.orderNumber }}
        </Button>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              Sub-Order: #{{ subOrderId || 'SO-101' }}
            </h1>
            <StatusBadge :status="order.status" />
            <PriorityBadge :priority="order.priority" />
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Parent Order: {{ order.orderNumber }} • Patient: {{ order.patientName }}
          </p>
        </div>
      </div>
    </div>

    <!-- Success Message -->
    <div v-if="savedSuccess" class="p-4 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 rounded-xl flex items-center gap-2 border border-emerald-200 dark:border-emerald-800">
      <CheckCircle2 class="w-5 h-5" />
      <span>Sub-order clinical specifications successfully updated!</span>
    </div>

    <!-- Tabs -->
    <div class="flex gap-2 border-b border-gray-200 dark:border-gray-800">
      <button
        v-for="tab in [
          { id: 'overview', label: 'Overview & Anatomy', icon: Layers },
          { id: 'forms', label: 'Clinical Specifications', icon: FileText },
          { id: 'scans', label: 'Target Scans', icon: Scan },
          { id: 'activity', label: 'Audit Trail', icon: Activity },
        ]"
        :key="tab.id"
        @click="activeTab = tab.id as SubOrderTab"
        :class="[
          'flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors',
          activeTab === tab.id
            ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
        ]"
      >
        <component :is="tab.icon" class="w-4 h-4" />
        <span>{{ tab.label }}</span>
      </button>
    </div>

    <!-- Tab 1: Overview & Teeth Anatomy -->
    <div v-if="activeTab === 'overview'" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <h2 class="text-base font-bold text-gray-900 dark:text-white">
          Anatomical FDI Teeth Selection
        </h2>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          Select or deselect teeth included in this specific restoration sub-unit:
        </p>
        <TeethChart
          v-model="selectedTeeth"
        />
        <div class="text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-700">
          Selected units ({{ selectedTeeth.length }}): {{ selectedTeeth.map(t => `#${t}`).join(', ') || 'None' }}
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-4">
        <h2 class="text-base font-bold text-gray-900 dark:text-white">
          Summary Card
        </h2>
        <div class="space-y-3 text-sm">
          <div class="flex justify-between py-1 border-b border-gray-100 dark:border-gray-700">
            <span class="text-gray-500">Sub-Order ID</span>
            <span class="font-mono font-medium text-gray-900 dark:text-white">#{{ subOrderId || 'SO-101' }}</span>
          </div>
          <div class="flex justify-between py-1 border-b border-gray-100 dark:border-gray-700">
            <span class="text-gray-500">Restoration</span>
            <span class="font-medium text-gray-900 dark:text-white">{{ order.restoration }}</span>
          </div>
          <div class="flex justify-between py-1 border-b border-gray-100 dark:border-gray-700">
            <span class="text-gray-500">Shade</span>
            <span class="font-medium text-gray-900 dark:text-white">{{ shade }}</span>
          </div>
          <div class="flex justify-between py-1 border-b border-gray-100 dark:border-gray-700">
            <span class="text-gray-500">Material</span>
            <span class="font-medium text-gray-900 dark:text-white">{{ material }}</span>
          </div>
          <div class="flex justify-between py-1 border-b border-gray-100 dark:border-gray-700">
            <span class="text-gray-500">Due Date</span>
            <span class="font-medium text-gray-900 dark:text-white">{{ formatDate(order.dueDate) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab 2: Clinical Specifications -->
    <form v-if="activeTab === 'forms'" @submit.prevent="handleSaveSpecs" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">
            Occlusal Contact Clearance
          </label>
          <select
            v-model="occlusalContact"
            class="w-full px-3.5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
          >
            <option value="Light contact">Light contact (40µm shimstock pull)</option>
            <option value="Full contact">Full anatomical contact</option>
            <option value="No contact">No contact / Out of occlusion</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">
            Margin Finishing Type
          </label>
          <select
            v-model="marginType"
            class="w-full px-3.5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
          >
            <option value="Chamfer">Chamfer (0.5mm)</option>
            <option value="Shoulder">Shoulder (90 degree)</option>
            <option value="Feather edge">Feather edge</option>
            <option value="Knife edge">Knife edge</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">
            Substrate Material
          </label>
          <select
            v-model="material"
            class="w-full px-3.5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
          >
            <option value="Zirconia (Multilayer)">Zirconia (Multilayer)</option>
            <option value="PFM">PFM</option>
            <option value="E-max">IPS e.max</option>
            <option value="PMMA">PMMA Temporary</option>
            <option value="Titanium">Titanium</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">
            Target Shade
          </label>
          <input
            type="text"
            v-model="shade"
            class="w-full px-3.5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
          />
        </div>
      </div>

      <div>
        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-1">
          Technician Fabrication Directive
        </label>
        <textarea
          rows="3"
          v-model="clinicalNotes"
          class="w-full px-3.5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
        />
      </div>

      <div class="flex justify-end pt-3">
        <Button type="submit" class="gap-2">
          <Save class="w-4 h-4" />
          Save Sub-Order Specs
        </Button>
      </div>
    </form>

    <!-- Tab 3: Target Scans -->
    <div v-if="activeTab === 'scans'" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-4">
      <h2 class="text-base font-bold text-gray-900 dark:text-white">
        3D Intraoral Scans Assigned to This Unit
      </h2>
      <div class="space-y-3">
        <div 
          v-for="(sc, i) in [
            { name: 'preparation_arch_scan.stl', size: '15.4 MB', date: 'Dec 10, 2024' },
            { name: 'opposing_dentition_scan.stl', size: '13.1 MB', date: 'Dec 10, 2024' },
            { name: 'buccal_bite_registration.ply', size: '3.9 MB', date: 'Dec 10, 2024' },
          ]" 
          :key="i" 
          class="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700"
        >
          <div class="flex items-center gap-3">
            <Scan class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <div>
              <div class="font-mono text-sm font-semibold text-gray-900 dark:text-white">{{ sc.name }}</div>
              <div class="text-xs text-gray-400">{{ sc.size }} • Captured {{ sc.date }}</div>
            </div>
          </div>
          <span class="px-2.5 py-1 text-xs font-semibold rounded bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
            Ready for CAD
          </span>
        </div>
      </div>
    </div>

    <!-- Tab 4: Audit Trail -->
    <div v-if="activeTab === 'activity'" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-4">
      <h2 class="text-base font-bold text-gray-900 dark:text-white">
        Chronological Audit History
      </h2>
      <div class="space-y-4 pl-4 border-l-2 border-emerald-500">
        <div class="relative">
          <div class="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Today, 10:15 AM</div>
          <div class="text-sm font-medium text-gray-900 dark:text-white">Margin clearance checked</div>
          <div class="text-xs text-gray-400">Verified by Lead Technician Dr. Robert Miller</div>
        </div>
        <div class="relative">
          <div class="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Yesterday, 16:30 PM</div>
          <div class="text-sm font-medium text-gray-900 dark:text-white">STL scans matched with clinical order</div>
          <div class="text-xs text-gray-400">Automated geometry alignment verified</div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="p-8 text-center bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
    <h2 class="text-xl font-bold text-gray-900 dark:text-white">Order Not Found</h2>
    <Button class="mt-4" @click="router.push('/orders')">Return to Orders</Button>
  </div>
</template>
