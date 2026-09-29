<template>
  <div class="max-w-4xl mx-auto space-y-6">
    
    <!-- Header with Wizard Steps -->
    <div class="rounded-3xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
        <div>
          <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Step {{ step }} of 5
          </span>
          <h1 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {{ currentStepTitle }}
          </h1>
        </div>

        <div class="text-xs text-slate-500 font-mono">
          Case Ref: <strong class="text-slate-800 dark:text-slate-200">#ORD-{{ autoOrderNumber }}</strong>
        </div>
      </div>

      <!-- Step Progress Bar -->
      <div class="grid grid-cols-5 gap-2">
        <div
          v-for="(st, idx) in steps"
          :key="st.id"
          class="flex flex-col gap-1.5"
        >
          <div
            class="h-1.5 rounded-full transition-all duration-300"
            :class="[
              step > st.id ? 'bg-emerald-500' :
              step === st.id ? 'bg-emerald-500 ring-2 ring-emerald-500/30' :
              'bg-slate-200 dark:bg-slate-800'
            ]"
          />
          <span
            :class="[
              'text-[11px] font-bold truncate transition-colors text-center hidden sm:block',
              step === st.id ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'
            ]"
          >
            {{ st.label }}
          </span>
        </div>
      </div>
    </div>

    <!-- STEP 1: PATIENT, CLINIC, DOCTOR -->
    <div
      v-if="step === 1"
      class="p-6 rounded-3xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6"
    >
      <div class="border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <h2 class="text-base font-bold text-slate-900 dark:text-white">Patient & Clinical Assignment</h2>
        <p class="text-xs text-slate-500 dark:text-slate-400">Select clinical records to link the restoration.</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <!-- Patient Select -->
        <div class="sm:col-span-2">
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Select Patient <span class="text-rose-500">*</span>
          </label>
          <Select
            v-model="form.patientId"
            :options="patientOptions"
            placeholder="Search and choose patient..."
            searchable
          />
        </div>

        <!-- Clinic Select -->
        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Associated Clinic <span class="text-rose-500">*</span>
          </label>
          <Select
            v-model="form.clinicId"
            :options="clinicOptions"
            placeholder="Select dental clinic..."
          />
        </div>

        <!-- Doctor Select -->
        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Prescribing Doctor <span class="text-rose-500">*</span>
          </label>
          <Select
            v-model="form.doctorId"
            :options="doctorOptions"
            placeholder="Select doctor..."
          />
        </div>

        <!-- Priority Select -->
        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Priority Tier
          </label>
          <Select
            v-model="form.priority"
            :options="[
              { value: 'Normal', label: 'Normal (Standard Turnaround)', badge: 'Normal', badgeColor: 'bg-emerald-100 text-emerald-800' },
              { value: 'High', label: 'High (Expedited 48h)', badge: '48h', badgeColor: 'bg-amber-100 text-amber-800' },
              { value: 'Urgent', label: 'Urgent (Emergency 24h)', badge: 'Urgent 24h', badgeColor: 'bg-rose-100 text-rose-800' },
            ]"
          />
        </div>

        <!-- Due Date -->
        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Required Delivery Date
          </label>
          <DateInput v-model="form.dueDate" />
        </div>
      </div>
    </div>

    <!-- STEP 2: SERVICE SELECTION -->
    <div
      v-else-if="step === 2"
      class="p-6 rounded-3xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6"
    >
      <div class="border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <h2 class="text-base font-bold text-slate-900 dark:text-white">Select Dental Services</h2>
        <p class="text-xs text-slate-500 dark:text-slate-400">Choose restoration techniques required for this prescription.</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div
          v-for="svc in AVAILABLE_SERVICES"
          :key="svc.id"
          @click="toggleService(svc.name)"
          :class="[
            'p-4 rounded-2xl border cursor-pointer transition-all duration-150 select-none flex items-start gap-3.5',
            form.selectedServices.includes(svc.name)
              ? 'bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
              : 'bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          ]"
        >
          <span class="text-2xl p-2 rounded-xl bg-white dark:bg-slate-800 shadow-xs shrink-0">
            {{ svc.icon }}
          </span>
          <div class="flex-1 truncate">
            <div class="flex items-center justify-between mb-1">
              <span class="font-bold text-sm text-slate-900 dark:text-white truncate">
                {{ svc.name }}
              </span>
              <span class="font-mono font-black text-xs text-emerald-600 dark:text-emerald-400">
                {{ formatCurrency(svc.price) }}
              </span>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {{ svc.description }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- STEP 3: TEETH CHART MORPHOLOGY -->
    <div
      v-else-if="step === 3"
      class="space-y-4"
    >
      <div class="p-4 rounded-2xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800">
        <h3 class="font-bold text-sm text-slate-900 dark:text-white mb-0.5">
          Interactive Teeth Morphology & Restoration Mapping
        </h3>
        <p class="text-xs text-slate-500 dark:text-slate-400">
          Click teeth to select and apply active restoration brushes (Crown, Bridge, Veneer, Implant, Inlay, Extraction).
        </p>
      </div>

      <!-- Vue 3 TeethChart Component -->
      <TeethChart
        v-model="form.selectedTeeth"
        v-model:tooth-restorations="form.toothRestorations"
      />
    </div>

    <!-- STEP 4: TECHNICAL SPECIFICATIONS & FILES -->
    <div
      v-else-if="step === 4"
      class="p-6 rounded-3xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6"
    >
      <div class="border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <h2 class="text-base font-bold text-slate-900 dark:text-white">Technical Specifications & Scans</h2>
        <p class="text-xs text-slate-500 dark:text-slate-400">Define aesthetic parameters and simulate file attachments.</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <!-- Shade -->
        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            VITA Classical Shade
          </label>
          <Select
            v-model="form.shade"
            :options="SHADES.map(s => ({ value: s, label: `Shade ${s}` }))"
          />
        </div>

        <!-- Material -->
        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Fabrication Material
          </label>
          <Select
            v-model="form.material"
            :options="[
              { value: 'Zirconia Multilayer High Translucency', label: 'Zirconia Multilayer (600-1100 MPa)' },
              { value: 'Lithium Disilicate (IPS e.max CAD)', label: 'Lithium Disilicate (IPS e.max)' },
              { value: 'Titanium Custom Abutment + Zirconia', label: 'Titanium Abutment + Zirconia' },
              { value: 'PMMA High-Density Long-term', label: 'PMMA Interim Long-term' },
            ]"
          />
        </div>

        <!-- Margin Type -->
        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Margin Design
          </label>
          <Select
            v-model="form.margin"
            :options="[
              { value: 'Chamfer (0.8mm - 1.0mm)', label: 'Chamfer (0.8mm - 1.0mm)' },
              { value: 'Deep Shoulder (1.2mm)', label: 'Deep Shoulder (1.2mm)' },
              { value: 'Feather Edge', label: 'Feather Edge' },
              { value: 'Subgingival (0.5mm)', label: 'Subgingival (0.5mm)' },
            ]"
          />
        </div>

        <!-- Arch Selection -->
        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            Arch Selection
          </label>
          <Select
            v-model="form.arch"
            :options="[
              { value: 'Upper', label: 'Upper Maxilla' },
              { value: 'Lower', label: 'Lower Mandible' },
              { value: 'Both', label: 'Both Arches' },
            ]"
          />
        </div>
      </div>

      <!-- File Upload Simulation Box -->
      <div class="p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center bg-slate-50/50 dark:bg-slate-900/50">
        <Upload class="w-8 h-8 text-emerald-500 mx-auto mb-2" />
        <h4 class="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
          Attach STL / PLY / DICOM Scans
        </h4>
        <p class="text-xs text-slate-400 mb-4">Drag and drop intraoral scans or simulate attachment</p>
        <button
          type="button"
          @click="addMockFile"
          class="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 transition-colors"
        >
          + Add Simulated Digital Scan File
        </button>

        <div v-if="form.files.length > 0" class="mt-4 space-y-1.5 text-left max-w-md mx-auto">
          <div
            v-for="(f, i) in form.files"
            :key="i"
            class="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs"
          >
            <div class="flex items-center gap-2 truncate">
              <FileText class="w-4 h-4 text-emerald-500 shrink-0" />
              <span class="truncate font-mono">{{ f.name }} ({{ f.size }})</span>
            </div>
            <button
              type="button"
              @click="form.files.splice(i, 1)"
              class="text-rose-500 hover:text-rose-600 p-1"
            >
              <X class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- STEP 5: REVIEW & SUBMIT -->
    <div
      v-else-if="step === 5"
      class="p-6 rounded-3xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6"
    >
      <div class="border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <h2 class="text-base font-bold text-slate-900 dark:text-white">Order Summary & Confirmation</h2>
        <p class="text-xs text-slate-500 dark:text-slate-400">Review clinical parameters before sending to production bench.</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <!-- Patient Summary -->
        <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <span class="text-slate-400 uppercase font-bold text-[10px]">Patient Info</span>
          <div class="text-sm font-extrabold text-slate-900 dark:text-white">{{ selectedPatient?.name || 'Selected Patient' }}</div>
          <div class="text-slate-500">{{ selectedClinic?.name }} • {{ selectedDoctor?.name }}</div>
        </div>

        <!-- Priority & Turnaround -->
        <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <span class="text-slate-400 uppercase font-bold text-[10px]">Turnaround</span>
          <div class="text-sm font-extrabold text-slate-900 dark:text-white">{{ form.priority }} Priority</div>
          <div class="text-slate-500">Target Delivery: {{ formatDate(form.dueDate) }}</div>
        </div>

        <!-- Teeth Summary -->
        <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <span class="text-slate-400 uppercase font-bold text-[10px]">Selected Teeth ({{ form.selectedTeeth.length }} Units)</span>
          <div class="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 truncate">
            {{ form.selectedTeeth.sort((a,b)=>a-b).map(t => `#${t}`).join(', ') }}
          </div>
          <div class="text-slate-500">Shade: {{ form.shade }} • Arch: {{ form.arch }}</div>
        </div>

        <!-- Fabrication Material -->
        <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
          <span class="text-slate-400 uppercase font-bold text-[10px]">Material</span>
          <div class="text-xs font-bold text-slate-900 dark:text-white truncate">{{ form.material }}</div>
          <div class="text-slate-500">{{ form.files.length }} Digital Scans Attached</div>
        </div>
      </div>

      <!-- Pricing Summary -->
      <div class="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
        <div>
          <span class="text-xs font-bold text-emerald-800 dark:text-emerald-200">Estimated Total Fabrication Cost</span>
          <div class="text-xs text-emerald-600 dark:text-emerald-400">Includes CAD design, 5-axis milling, and glazing</div>
        </div>
        <div class="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
          {{ formatCurrency(calculatedTotal) }}
        </div>
      </div>
    </div>

    <!-- Navigation Buttons -->
    <div class="flex items-center justify-between p-4 rounded-3xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 shadow-sm">
      <button
        v-if="step > 1"
        type="button"
        @click="prevStep"
        class="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors border border-slate-300 dark:border-slate-700"
      >
        <ChevronLeft class="w-4 h-4" />
        <span>Previous</span>
      </button>
      <div v-else />

      <button
        v-if="step < 5"
        type="button"
        :disabled="!canProceed"
        @click="nextStep"
        class="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 rounded-xl shadow-md shadow-emerald-500/20 disabled:opacity-50 disabled:pointer-events-none transition-all active:scale-95"
      >
        <span>Continue</span>
        <ChevronRight class="w-4 h-4" />
      </button>

      <button
        v-else
        type="button"
        :disabled="isSubmitting"
        @click="submitOrder"
        class="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 rounded-xl shadow-xl shadow-emerald-500/25 disabled:opacity-50 transition-all active:scale-95"
      >
        <Sparkles class="w-4 h-4" />
        <span>{{ isSubmitting ? 'Transmitting Case...' : 'Submit Digital Case' }}</span>
      </button>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { 
  ChevronRight, ChevronLeft, Upload, FileText, X, Sparkles 
} from 'lucide-vue-next';
import confetti from 'canvas-confetti';
import { useDentalStore } from '@/stores/dental';
import Select from '@/components/ui/Select.vue';
import DateInput from '@/components/ui/DateInput.vue';
import TeethChart, { type RestorationType } from '@/components/ui/TeethChart.vue';
import { formatCurrency, formatDate } from '@/utils/format';
import { sound } from '@/utils/sound';

const router = useRouter();
const store = useDentalStore();

const step = ref(1);
const isSubmitting = ref(false);
const autoOrderNumber = Math.floor(1000 + Math.random() * 9000);

const steps = [
  { id: 1, label: 'Patient & Clinic' },
  { id: 2, label: 'Services' },
  { id: 3, label: 'Teeth Selection' },
  { id: 4, label: 'Technical Details' },
  { id: 5, label: 'Review & Submit' },
];

const AVAILABLE_SERVICES = [
  { id: 'final-restoration', name: 'Final Restoration', description: 'Definitive crowns, bridges, veneers, or full-arch restorations.', icon: '👑', price: 320 },
  { id: 'surgical-guide', name: 'Surgical Guide', description: 'Precision-guided implant surgery planning with pilot sleeves.', icon: '🔩', price: 450 },
  { id: 'gfmr', name: 'GFMR Full Arch', description: 'Guided functional full-mouth rehabilitation with anatomical verification.', icon: '⚙️', price: 1200 },
  { id: 'treatment-plan', name: 'Treatment Plan', description: 'Comprehensive digital smile design with diagnostic mockups.', icon: '📋', price: 180 },
  { id: 'temp-restoration', name: 'Temporary PMMA', description: 'High-strength PMMA interim restorations for aesthetic trials.', icon: '🛡️', price: 120 },
  { id: 'night-guard', name: 'Night Guard / Splint', description: '3D printed precision occlusal guard for bruxism therapy.', icon: '💎', price: 160 },
];

const SHADES = ['A1', 'A2', 'A3', 'A3.5', 'A4', 'B1', 'B2', 'B3', 'C1', 'D2', 'BL1', 'BL2'];

// Form State
const form = ref({
  patientId: '',
  clinicId: '',
  doctorId: '',
  priority: 'Normal' as any,
  dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  selectedServices: ['Final Restoration'],
  selectedTeeth: [8, 9],
  toothRestorations: { 8: 'crown', 9: 'crown' } as Record<number, RestorationType>,
  shade: 'A2',
  material: 'Zirconia Multilayer High Translucency',
  margin: 'Chamfer (0.8mm - 1.0mm)',
  arch: 'Both' as any,
  files: [
    { name: 'Intraoral_Maxilla_Scan.stl', size: '14.2 MB' },
    { name: 'Intraoral_Mandible_Scan.stl', size: '12.8 MB' },
  ]
});

const patientOptions = computed(() => {
  return store.patients.map(p => ({
    value: p.id,
    label: p.name,
    subtitle: `${p.clinicName} • Phone: ${p.phone}`,
    badge: 'Verified',
  }));
});

const clinicOptions = computed(() => {
  return store.clinics.map(c => ({
    value: c.id,
    label: c.name,
    subtitle: `${c.city} • Phone: ${c.phone}`,
    badge: 'Active Lab Link',
  }));
});

const doctorOptions = computed(() => {
  return store.doctors.map(d => ({
    value: d.id,
    label: d.name,
    subtitle: `${d.specialty} • ${d.clinicName}`,
    badge: 'Prescriber',
  }));
});

const selectedPatient = computed(() => store.patients.find(p => p.id === form.value.patientId));
const selectedClinic = computed(() => store.clinics.find(c => c.id === form.value.clinicId));
const selectedDoctor = computed(() => store.doctors.find(d => d.id === form.value.doctorId));

// Auto fill first option if empty
if (!form.value.patientId && store.patients.length > 0) form.value.patientId = store.patients[0].id;
if (!form.value.clinicId && store.clinics.length > 0) form.value.clinicId = store.clinics[0].id;
if (!form.value.doctorId && store.doctors.length > 0) form.value.doctorId = store.doctors[0].id;

const currentStepTitle = computed(() => {
  return steps.find(s => s.id === step.value)?.label || '';
});

const calculatedTotal = computed(() => {
  const units = Math.max(1, form.value.selectedTeeth.length);
  return units * 320;
});

const canProceed = computed(() => {
  if (step.value === 1) return Boolean(form.value.patientId && form.value.clinicId && form.value.doctorId);
  if (step.value === 2) return form.value.selectedServices.length > 0;
  if (step.value === 3) return form.value.selectedTeeth.length > 0;
  return true;
});

const toggleService = (name: string) => {
  const idx = form.value.selectedServices.indexOf(name);
  if (idx !== -1) {
    if (form.value.selectedServices.length > 1) {
      form.value.selectedServices.splice(idx, 1);
    }
  } else {
    form.value.selectedServices.push(name);
  }
  sound.playClick();
};

const addMockFile = () => {
  const ext = ['_pre-op.stl', '_prep.stl', '_bite.ply'][Math.floor(Math.random() * 3)];
  form.value.files.push({
    name: `Scan_Mesh_${Date.now().toString().slice(-4)}${ext}`,
    size: `${(Math.random() * 8 + 6).toFixed(1)} MB`
  });
  sound.playPop();
};

const nextStep = () => {
  if (step.value < 5) {
    step.value++;
    sound.playClick(680);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const prevStep = () => {
  if (step.value > 1) {
    step.value--;
    sound.playClick(500);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const submitOrder = async () => {
  isSubmitting.value = true;
  sound.playClick(720);

  // Confetti celebration!
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#42b883', '#00dc82', '#10b981', '#35495e']
    });
  } catch {}

  const newOrder = {
    id: `ord-${Date.now()}`,
    orderNumber: `${autoOrderNumber}`,
    patientId: form.value.patientId,
    patientName: selectedPatient.value?.name || 'Jane Doe',
    doctorId: form.value.doctorId,
    doctorName: selectedDoctor.value?.name || 'Dr. Allison Park',
    clinicId: form.value.clinicId,
    clinicName: selectedClinic.value?.name || 'Bright Smile Dental',
    scanCenterId: 'sc-1',
    scanCenterName: '3DDX Digital Scan Hub',
    status: 'New' as any,
    priority: form.value.priority,
    restoration: form.value.selectedServices[0] || 'Crown',
    arch: form.value.arch,
    format: 'Digital STL',
    shade: form.value.shade,
    units: form.value.selectedTeeth.length || 1,
    amount: calculatedTotal.value,
    billed: false,
    billTo: 'Clinic Direct',
    vouchers: 0,
    isLocked: false,
    hasNotes: false,
    notes: `Fabrication material: ${form.value.material}. Margin: ${form.value.margin}.`,
    receivedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    dueDate: form.value.dueDate,
  };

  setTimeout(() => {
    store.addOrder(newOrder);
    isSubmitting.value = false;
    router.push(`/orders/${newOrder.id}`);
  }, 600);
};
</script>
