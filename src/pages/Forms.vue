<script setup lang="ts">
import { ref } from 'vue';
import { 
  User, 
  FileText, 
  Stethoscope, 
  Receipt, 
  RefreshCw, 
  Scan, 
  CheckCircle, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  Eye,
  EyeOff,
  Save
} from 'lucide-vue-next';
import Button from '@/components/ui/Button.vue';
import LoadingState from '@/components/ui/LoadingState.vue';
import EmptyState from '@/components/ui/EmptyState.vue';
import ErrorState from '@/components/ui/ErrorState.vue';
import UIStateSwitcher from '@/components/ui/UIStateSwitcher.vue';
import { sound } from '@/utils/sound';
import { useDentalStore } from '@/stores/dental';

const dentalStore = useDentalStore();

type FormsSectionId = 'patient' | 'restoration' | 'doctor' | 'billing' | 'changeRequest' | 'scan' | 'validation' | 'states';

const activeSection = ref<FormsSectionId | null>('patient');
const toastMessage = ref<string | null>(null);
const uiStateDemo = ref<'normal' | 'loading' | 'empty' | 'error'>('loading');

// Patient Form State
const ptName = ref('Sarah Connor');
const ptDob = ref('1988-06-15');
const ptGender = ref<'M' | 'F'>('F');
const ptPhone = ref('+1 (555) 392-1084');
const ptEmail = ref('sarah.c@sky.net');
const ptClinic = ref('Bright Smile Dental');

// Restoration Form State
const restorationType = ref('Crown');
const arch = ref<'Upper' | 'Lower' | 'Both'>('Both');
const material = ref('Zirconia (Multilayer)');
const shade = ref('A2');
const units = ref(1);

// Doctor Form State
const docName = ref('Dr. Marcus Webb');
const docLicense = ref('DDS-89241-CA');
const docSpecialty = ref('Prosthodontics');
const docNotify = ref(true);

// Billing Config State
const billingTier = ref('Volume Discount (Tier 2)');
const currency = ref('USD ($)');
const autoInvoice = ref(true);
const paymentTerms = ref('Net 30');

// Change Request State
const crOrder = ref('DL-024001');
const crSeverity = ref('Medium');
const crNotes = ref('Please adjust interproximal contact on distal side of tooth #19.');

// Scan Info State
const scanFiles = ref<string[]>([
  'UpperArch_Maxilla_scan_01.stl',
  'LowerArch_Mandible_scan_02.stl',
  'BiteRegistration_scan_03.ply'
]);
const scannerModel = ref('3Shape TRIOS 5');

// Validation States Demo
const validInput = ref('valid.user@dentalcloud.com');
const invalidInput = ref('invalid-email-address');
const password = ref('Secret12345!');
const showPassword = ref(false);

function showToast(msg: string) {
  toastMessage.value = msg;
  sound.pop();
  setTimeout(() => {
    toastMessage.value = null;
  }, 3500);
}

function toggleSection(id: FormsSectionId) {
  sound.click();
  activeSection.value = activeSection.value === id ? null : id;
}

function handleSavePatient() {
  dentalStore.createPatient({
    name: ptName.value,
    dob: ptDob.value,
    gender: ptGender.value,
    phone: ptPhone.value,
    email: ptEmail.value,
    clinicName: ptClinic.value,
    status: 'Active'
  });
  showToast('Patient record saved successfully!');
}

function handleSaveDoctor() {
  dentalStore.createDoctor({
    name: docName.value,
    email: 'm.webb@example.com',
    phone: '+1 555-0199',
    specialty: docSpecialty.value,
    clinicName: 'Metropolitan Dental Lab',
    activeCases: 5,
    status: 'Active'
  });
  showToast('Doctor profile updated!');
}
</script>

<template>
  <div class="space-y-6 max-w-5xl mx-auto pb-12">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <div class="flex items-center gap-2">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Forms & Controls Lab</h1>
          <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
            Vue 3 Reactive Forms
          </span>
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Interactive showcase of all design system inputs, validation behaviors, and UI simulation states
        </p>
      </div>
    </div>

    <!-- Toast Notification -->
    <Transition name="fade">
      <div 
        v-if="toastMessage" 
        class="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-emerald-600 text-white rounded-xl shadow-lg border border-emerald-500 text-sm font-medium animate-bounce"
      >
        <CheckCircle class="w-5 h-5 text-white" />
        <span>{{ toastMessage }}</span>
      </div>
    </Transition>

    <!-- Sections Accordion -->
    <div class="space-y-4">
      <!-- 1. Patient Intake Form -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <button 
          @click="toggleSection('patient')"
          class="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
        >
          <div class="flex items-center gap-3">
            <div class="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <User class="w-5 h-5" />
            </div>
            <div>
              <div class="text-base font-semibold text-gray-900 dark:text-white">Patient Demographics Form</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">Personal info, birthdate, clinic association</div>
            </div>
          </div>
          <ChevronUp v-if="activeSection === 'patient'" class="w-5 h-5 text-gray-400" />
          <ChevronDown v-else class="w-5 h-5 text-gray-400" />
        </button>

        <div v-if="activeSection === 'patient'" class="p-6 border-t border-gray-100 dark:border-gray-700 space-y-4">
          <form @submit.prevent="handleSavePatient" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <input 
                  v-model="ptName" 
                  type="text" 
                  required 
                  class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Date of Birth</label>
                <input 
                  v-model="ptDob" 
                  type="date" 
                  required 
                  class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Gender</label>
                <div class="flex gap-4 mt-2">
                  <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                    <input type="radio" value="F" v-model="ptGender" class="text-emerald-600 focus:ring-emerald-500" />
                    Female
                  </label>
                  <label class="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                    <input type="radio" value="M" v-model="ptGender" class="text-emerald-600 focus:ring-emerald-500" />
                    Male
                  </label>
                </div>
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Clinic Name</label>
                <input 
                  v-model="ptClinic" 
                  type="text" 
                  required 
                  class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                <input 
                  v-model="ptEmail" 
                  type="email" 
                  class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                <input 
                  v-model="ptPhone" 
                  type="tel" 
                  class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
            <div class="flex justify-end gap-2 pt-2">
              <Button type="submit" class="gap-2">
                <Save class="w-4 h-4" />
                Save Patient Data
              </Button>
            </div>
          </form>
        </div>
      </div>

      <!-- 2. Restoration & Lab Specifications Form -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <button 
          @click="toggleSection('restoration')"
          class="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
        >
          <div class="flex items-center gap-3">
            <div class="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <FileText class="w-5 h-5" />
            </div>
            <div>
              <div class="text-base font-semibold text-gray-900 dark:text-white">Restoration & Lab Specs</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">Material selection, shade guides, unit counts</div>
            </div>
          </div>
          <ChevronUp v-if="activeSection === 'restoration'" class="w-5 h-5 text-gray-400" />
          <ChevronDown v-else class="w-5 h-5 text-gray-400" />
        </button>

        <div v-if="activeSection === 'restoration'" class="p-6 border-t border-gray-100 dark:border-gray-700 space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Restoration Type</label>
              <select 
                v-model="restorationType" 
                class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option>Crown</option>
                <option>Bridge</option>
                <option>Implant Abutment</option>
                <option>Veneer</option>
                <option>Surgical Guide</option>
                <option>Inlay / Onlay</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Material</label>
              <select 
                v-model="material" 
                class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option>Zirconia (Multilayer)</option>
                <option>E-max Lithium Disilicate</option>
                <option>Titanium Grade 5</option>
                <option>PMMA Temp</option>
                <option>Composite Hybrid</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">VITA Classical Shade</label>
              <select 
                v-model="shade" 
                class="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option>A1</option>
                <option>A2</option>
                <option>A3</option>
                <option>B1</option>
                <option>B2</option>
                <option>BL1 (Bleach)</option>
              </select>
            </div>
          </div>
          <div class="flex justify-end gap-2 pt-2">
            <Button @click="showToast('Restoration specifications updated')">
              Save Specifications
            </Button>
          </div>
        </div>
      </div>

      <!-- 3. Validation Feedback Showcase -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <button 
          @click="toggleSection('validation')"
          class="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
        >
          <div class="flex items-center gap-3">
            <div class="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <CheckCircle class="w-5 h-5" />
            </div>
            <div>
              <div class="text-base font-semibold text-gray-900 dark:text-white">Validation Feedback & States</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">Success hints, error borders, togglable secret credentials</div>
            </div>
          </div>
          <ChevronUp v-if="activeSection === 'validation'" class="w-5 h-5 text-gray-400" />
          <ChevronDown v-else class="w-5 h-5 text-gray-400" />
        </button>

        <div v-if="activeSection === 'validation'" class="p-6 border-t border-gray-100 dark:border-gray-700 space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Valid Field -->
            <div>
              <label class="block text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1 flex items-center gap-1">
                <CheckCircle class="w-3.5 h-3.5" /> Valid Field
              </label>
              <input 
                v-model="validInput" 
                type="text" 
                class="w-full px-3 py-2 text-sm rounded-lg border border-emerald-500 bg-emerald-50/20 dark:bg-emerald-900/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <p class="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Username is verified and available.</p>
            </div>

            <!-- Error Field -->
            <div>
              <label class="block text-xs font-semibold text-rose-600 dark:text-rose-400 mb-1 flex items-center gap-1">
                <AlertCircle class="w-3.5 h-3.5" /> Error Field
              </label>
              <input 
                v-model="invalidInput" 
                type="text" 
                class="w-full px-3 py-2 text-sm rounded-lg border border-rose-500 bg-rose-50/20 dark:bg-rose-900/10 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <p class="text-xs text-rose-600 dark:text-rose-400 mt-1">Please enter a valid RFC-compliant email address.</p>
            </div>

            <!-- Password Toggle Field -->
            <div class="sm:col-span-2">
              <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Encrypted Lab API Key</label>
              <div class="relative">
                <input 
                  :type="showPassword ? 'text' : 'password'" 
                  v-model="password" 
                  class="w-full px-3 py-2 pr-10 text-sm font-mono rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button 
                  type="button" 
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <EyeOff v-if="showPassword" class="w-4 h-4" />
                  <Eye v-else class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 4. UI State Simulation Demo -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <button 
          @click="toggleSection('states')"
          class="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left"
        >
          <div class="flex items-center gap-3">
            <div class="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <RefreshCw class="w-5 h-5" />
            </div>
            <div>
              <div class="text-base font-semibold text-gray-900 dark:text-white">UI Simulation States Gallery</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">Live preview of Loading, Empty, and Error states</div>
            </div>
          </div>
          <ChevronUp v-if="activeSection === 'states'" class="w-5 h-5 text-gray-400" />
          <ChevronDown v-else class="w-5 h-5 text-gray-400" />
        </button>

        <div v-if="activeSection === 'states'" class="p-6 border-t border-gray-100 dark:border-gray-700 space-y-6">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Switch Component State:</span>
            <UIStateSwitcher v-model="uiStateDemo" />
          </div>

          <div class="min-h-[260px] p-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center">
            <LoadingState 
              v-if="uiStateDemo === 'loading'" 
              message="Simulating Dental Case Synchronization..." 
            />
            <EmptyState 
              v-else-if="uiStateDemo === 'empty'" 
              title="No Dental Orders Found" 
              description="There are currently no active lab fabrications in this department."
              action-label="+ Create First Order"
              @action="showToast('Create Order Action clicked!')"
            />
            <ErrorState 
              v-else-if="uiStateDemo === 'error'" 
              title="Database Sync Timeout" 
              message="Unable to reach cloud telemetry service. Please verify network credentials."
              action-label="Retry Connection"
              @retry="uiStateDemo = 'normal'"
            />
            <div v-else class="text-center">
              <CheckCircle class="w-12 h-12 text-emerald-500 mx-auto mb-2" />
              <div class="text-base font-semibold text-gray-900 dark:text-white">Normal Operational State</div>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">All lab services, scanners, and 3D printing pipelines online.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
