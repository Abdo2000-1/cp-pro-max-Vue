<template>
  <div class="space-y-4 w-full min-w-0">
    
    <!-- 1. Header Bar -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#0b101d] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
      <div>
        <div class="flex items-center gap-2">
          <span class="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <FilePlus2 class="w-4.5 h-4.5" />
          </span>
          <h1 class="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            3DDX Add New Case Prescription
          </h1>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/25">
            ?task=AddCase
          </span>
        </div>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Complete dental surgical guide, model work & Co-Diagnostix treatment plan prescription
        </p>
      </div>

      <!-- State Switcher -->
      <div class="flex items-center gap-2">
        <UIStateSwitcher
          :state="uiState"
          @change="(s) => uiState = s"
          label="View State"
        />
      </div>
    </div>

    <!-- Simulated States -->
    <div v-if="uiState === 'loading'" class="bg-white dark:bg-[#0b101d] rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
      <LoadingState text="Loading 3DDX Prescription Master Catalog..." />
    </div>

    <div v-else-if="uiState === 'error'" class="bg-white dark:bg-[#0b101d] rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
      <ErrorState
        title="Surgical Protocol Error"
        message="Failed to validate implant sleeve library against Co-Diagnostix database."
        code="ERR_SLEEVE_LIB_INVALID"
        @retry="uiState = 'normal'"
      />
    </div>

    <div v-else-if="uiState === 'empty'" class="bg-white dark:bg-[#0b101d] rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
      <EmptyState
        title="Form Reset State"
        description="The prescription form has no unsaved draft data."
        suggestion="Click start to begin entering patient and scan details."
      >
        <template #action>
          <button
            @click="uiState = 'normal'"
            class="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
          >
            Open Prescription Form
          </button>
        </template>
      </EmptyState>
    </div>

    <!-- Normal State: Interactive Add Case Form -->
    <div v-else class="space-y-4">
      <!-- Success confirmation card -->
      <div v-if="successCaseNumber" class="bg-white dark:bg-[#0b101d] p-8 rounded-2xl border border-emerald-500/30 text-center space-y-4">
        <div class="w-14 h-14 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
          <CheckCircle2 class="w-8 h-8" />
        </div>
        <h2 class="text-xl font-bold text-slate-900 dark:text-white">
          Case Successfully Created & Transmitted!
        </h2>
        <p class="text-xs text-slate-500 max-w-md mx-auto">
          Case <strong class="text-cyan-600 font-mono">{{ successCaseNumber }}</strong> has been routed to the <strong>{{ taskToGroup }}</strong> queue for Co-Diagnostix planning.
        </p>
        <div class="flex justify-center gap-3 pt-2">
          <button
            type="button"
            @click="router.push('/flow')"
            class="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md"
          >
            View in Production Flow
          </button>
          <button
            type="button"
            @click="resetForm"
            class="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            Create Another Case
          </button>
        </div>
      </div>

      <div v-else class="bg-white dark:bg-[#0b101d] rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs overflow-hidden">
        <!-- Stepper Progress Bar -->
        <div class="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
          <div class="grid grid-cols-4 gap-2">
            <button
              v-for="s in steps"
              :key="s.num"
              type="button"
              @click="currentStep = s.num"
              :class="[
                'flex items-center gap-2 p-2 rounded-xl text-left transition-colors cursor-pointer',
                currentStep === s.num
                  ? 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30'
                  : currentStep > s.num
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-400 opacity-60'
              ]"
            >
              <div
                :class="[
                  'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold',
                  currentStep === s.num
                    ? 'bg-cyan-500 text-slate-950'
                    : currentStep > s.num
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                ]"
              >
                {{ currentStep > s.num ? '✓' : s.num }}
              </div>
              <span class="text-xs font-bold hidden sm:inline">{{ s.title }}</span>
            </button>
          </div>
        </div>

        <!-- Form Content -->
        <form @submit.prevent class="p-5 space-y-6">
          
          <!-- STEP 1: Clinician & Patient Info -->
          <div v-if="currentStep === 1" class="space-y-4">
            <h3 class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Stethoscope class="w-4 h-4 text-cyan-500" />
              <span>Clinician & Scan Diagnostic Center</span>
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label class="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  Doctor / Treating Clinician *
                </label>
                <select
                  v-model="doctorName"
                  class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                >
                  <option>Dr. Marcus Vance (NY Smile Center)</option>
                  <option>Dr. Sarah Jenkins (Boston Maxillofacial)</option>
                  <option>Dr. Alan Turing (Advanced Implantology)</option>
                  <option>Dr. Elena Rostova (Chicago Dental Studio)</option>
                </select>
              </div>

              <div>
                <label class="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  Scan Center / Receiving Facility *
                </label>
                <select
                  v-model="scanCenter"
                  class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                >
                  <option>3DDX Boston Radiology Hub</option>
                  <option>Align Chicago Scanning Lab</option>
                  <option>Dallas Imaging & CAD Facility</option>
                  <option>NYC Dental Diagnostics Hub</option>
                </select>
              </div>
            </div>

            <h3 class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <User class="w-4 h-4 text-cyan-500" />
              <span>Patient Medical Record</span>
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label class="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  v-model="patientFirstName"
                  placeholder="e.g. Michael"
                  class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label class="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  required
                  v-model="patientLastName"
                  placeholder="e.g. Henderson"
                  class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label class="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  Patient Chart ID / PACS ID
                </label>
                <input
                  type="text"
                  v-model="patientChartId"
                  placeholder="e.g. PT-99210"
                  class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label class="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  v-model="patientDob"
                  class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label class="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  Gender
                </label>
                <select
                  v-model="patientGender"
                  class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>

              <div class="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="rush"
                  v-model="isRushExpress"
                  class="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-400"
                />
                <label for="rush" class="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 cursor-pointer">
                  <Zap class="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>Express Rush Case (12h TAT Priority)</span>
                </label>
              </div>
            </div>
          </div>

          <!-- STEP 2: Services & Surgical Guide Specs -->
          <div v-if="currentStep === 2" class="space-y-4">
            <h3 class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Layers class="w-4 h-4 text-cyan-500" />
              <span>Services Selection & Surgical Specs</span>
            </h3>

            <!-- Arch Selection -->
            <div>
              <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                Dental Arch Focus
              </label>
              <div class="grid grid-cols-3 gap-2">
                <button
                  v-for="arch in (['Maxilla', 'Mandible', 'Dual Arch'] as const)"
                  :key="arch"
                  type="button"
                  @click="archSelection = arch"
                  :class="[
                    'p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer',
                    archSelection === arch
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                  ]"
                >
                  {{ arch }}
                </button>
              </div>
            </div>

            <!-- Services Checkbox Grid -->
            <div>
              <label class="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                Prescribed 3DDX Services
              </label>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <label
                  v-for="srv in serviceList"
                  :key="srv.id"
                  :class="[
                    'flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer select-none transition-all',
                    services[srv.id]
                      ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-800 dark:text-cyan-200 font-bold'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  ]"
                >
                  <input
                    type="checkbox"
                    v-model="services[srv.id]"
                    class="w-3.5 h-3.5 text-cyan-600 rounded"
                  />
                  <span>{{ srv.label }}</span>
                </label>
              </div>
            </div>

            <!-- Surgical Guide Type -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs">
              <div>
                <label class="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  Guide Support Topology
                </label>
                <select
                  v-model="guideSupport"
                  class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                >
                  <option>Tooth-Supported</option>
                  <option>Bone-Supported</option>
                  <option>Mucosa-Supported</option>
                </select>
              </div>

              <div>
                <label class="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  Implant Sleeve Master Library
                </label>
                <select
                  v-model="sleeveBrand"
                  class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                >
                  <option>Straumann VeloGuide / Co-Diagnostix</option>
                  <option>Nobel Biocare Guided Surgery</option>
                  <option>BioHorizons Guided Surgery</option>
                  <option>Zimmer Biomet Navigator</option>
                  <option>Custom Universal Stepped Sleeves</option>
                </select>
              </div>
            </div>
          </div>

          <!-- STEP 3: Tooth Chart 1-32 -->
          <div v-if="currentStep === 3" class="space-y-4">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <h3 class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <span>Universal Dental Numbering (Teeth 1 - 32)</span>
              </h3>
              <span class="text-xs font-mono font-bold text-sky-600 dark:text-sky-400">
                {{ selectedTeeth.length }} Teeth Selected
              </span>
            </div>

            <p class="text-xs text-slate-600 dark:text-slate-400">
              Pick your active tool below (Crown, Implant, Missing, Bridge) and click on any tooth to assign. Clicking an assigned tooth with the same tool unselects it.
            </p>

            <!-- Visual Teeth Chart -->
            <div class="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <TeethChart
                v-model="selectedTeeth"
                @clear-all="selectedTeeth = []"
              />
            </div>

            <div class="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-xs font-mono flex items-center justify-between">
              <span>Selected Sites: <strong>{{ selectedTeeth.sort((a,b)=>a-b).join(', ') || 'None' }}</strong></span>
              <button
                type="button"
                @click="selectedTeeth = []"
                class="text-rose-500 hover:underline cursor-pointer"
              >
                Reset Teeth
              </button>
            </div>
          </div>

          <!-- STEP 4: Scans, Internal History Notes & Final Confirmation -->
          <div v-if="currentStep === 4" class="space-y-4 text-xs">
            <!-- Clinical Order Verification Summary -->
            <div class="p-4 rounded-xl bg-sky-50/70 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-800/40 space-y-2">
              <div class="flex items-center justify-between font-bold text-sky-800 dark:text-sky-300">
                <span class="flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                  <Sparkles class="w-3.5 h-3.5 text-sky-500" />
                  Final Clinical Case Review
                </span>
                <span class="font-mono text-xs">{{ selectedTeeth.length }} Teeth Selected</span>
              </div>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1 border-t border-sky-200/60 dark:border-sky-800/40">
                <div>
                  <span class="text-slate-500 dark:text-slate-400 block">Patient</span>
                  <strong class="text-slate-900 dark:text-white">{{ patientFirstName || 'Alex' }} {{ patientLastName || 'Morgan' }}</strong>
                </div>
                <div>
                  <span class="text-slate-500 dark:text-slate-400 block">Clinician</span>
                  <strong class="text-slate-900 dark:text-white truncate block">{{ doctorName.split('(')[0] }}</strong>
                </div>
                <div>
                  <span class="text-slate-500 dark:text-slate-400 block">Guide Support</span>
                  <strong class="text-slate-900 dark:text-white">{{ guideSupport }}</strong>
                </div>
                <div>
                  <span class="text-slate-500 dark:text-slate-400 block">Target Teeth</span>
                  <strong class="text-sky-600 font-mono">{{ selectedTeeth.sort((a,b)=>a-b).join(', ') || 'General / Non-Specific' }}</strong>
                </div>
              </div>
            </div>

            <h3 class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <UploadCloud class="w-4 h-4 text-sky-600" />
              <span>Diagnostic Scan Uploads & PACS Links</span>
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div class="p-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 text-center">
                <div class="font-bold text-slate-900 dark:text-white">DICOM CT Volume</div>
                <span class="text-[10px] text-cyan-600 font-mono block mt-1">{{ dicomFile }}</span>
                <button type="button" class="mt-2 text-[10px] text-slate-500 hover:text-cyan-500">Replace Scan</button>
              </div>

              <div class="p-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 text-center">
                <div class="font-bold text-slate-900 dark:text-white">Upper Optical Scan</div>
                <span class="text-[10px] text-emerald-600 font-mono block mt-1">{{ upperStl }}</span>
                <button type="button" class="mt-2 text-[10px] text-slate-500 hover:text-cyan-500">Replace STL</button>
              </div>

              <div class="p-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 text-center">
                <div class="font-bold text-slate-900 dark:text-white">Lower Optical Scan</div>
                <span class="text-[10px] text-emerald-600 font-mono block mt-1">{{ lowerStl }}</span>
                <button type="button" class="mt-2 text-[10px] text-slate-500 hover:text-cyan-500">Replace STL</button>
              </div>
            </div>

            <h3 class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <MessageSquare class="w-4 h-4 text-sky-600" />
              <span>Internal History & Task Delegation (taskAddCase.php)</span>
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  Assign Initial Task To Group
                </label>
                <select
                  v-model="taskToGroup"
                  class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                >
                  <option>Co-Diagnostix Senior Planning Group</option>
                  <option>DICOM Segmentation & Conversion Unit</option>
                  <option>CAM 3D Guide Printing Lab</option>
                  <option>Senior Radiologist Review Team</option>
                </select>
              </div>

              <div>
                <label class="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  Internal Prescription Instructions
                </label>
                <textarea
                  rows="3"
                  v-model="internalComment"
                  placeholder="Special anatomical considerations, sleeve offsets, prosthetic clearances..."
                  class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <!-- Stepper Footer Controls -->
          <div class="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              v-if="currentStep > 1"
              type="button"
              @click="currentStep--"
              class="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              <ArrowLeft class="w-3.5 h-3.5" />
              <span>Previous Step</span>
            </button>
            <div v-else />

            <button
              v-if="currentStep < 4"
              type="button"
              @click="currentStep++"
              class="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#0284c7] hover:bg-sky-600 text-white font-bold text-xs shadow-md shadow-sky-500/20 cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </button>
            <button
              v-else
              type="button"
              :disabled="submitting"
              @click="handleSubmit"
              class="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <Save class="w-4 h-4" />
              <span>{{ submitting ? 'Transmitting to 3DDX PACS...' : 'Submit & Transmit Case' }}</span>
            </button>
          </div>

        </form>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import {
  FilePlus2, User, Stethoscope, Layers, UploadCloud, CheckCircle2,
  Sparkles, Zap, ArrowRight, ArrowLeft, Save, MessageSquare
} from 'lucide-vue-next';
import TeethChart from '@/components/ui/TeethChart.vue';
import UIStateSwitcher, { type UIStateType } from '@/components/ui/UIStateSwitcher.vue';
import LoadingState from '@/components/ui/LoadingState.vue';
import EmptyState from '@/components/ui/EmptyState.vue';
import ErrorState from '@/components/ui/ErrorState.vue';
import { useDentalStore } from '@/stores/dental';
import { sound } from '@/utils/sound';

const router = useRouter();
const store = useDentalStore();

const uiState = ref<UIStateType>('normal');
const currentStep = ref(1);

const steps = [
  { num: 1, title: 'Clinician & Patient' },
  { num: 2, title: 'Services & Guide Specs' },
  { num: 3, title: 'Teeth Chart (1-32)' },
  { num: 4, title: 'Scans & Internal Notes' },
];

const doctorName = ref('Dr. Marcus Vance (NY Smile Center)');
const scanCenter = ref('3DDX Boston Radiology Hub');
const patientFirstName = ref('');
const patientLastName = ref('');
const patientChartId = ref('');
const patientDob = ref('1985-06-15');
const patientGender = ref('Male');

const archSelection = ref<'Maxilla' | 'Mandible' | 'Dual Arch'>('Dual Arch');
const isRushExpress = ref(false);

const services = reactive<Record<string, boolean>>({
  sg: true,
  tp: true,
  conv: true,
  mod: false,
  rep: false,
  restTemp: false,
  restFinal: false,
  vr: false,
});

const serviceList = [
  { id: 'sg', label: 'Surgical Guide (SG)' },
  { id: 'tp', label: 'Treatment Plan (TP)' },
  { id: 'conv', label: 'DICOM Conversion' },
  { id: 'mod', label: 'Model Work (MOD)' },
  { id: 'rep', label: 'Radiology Report' },
  { id: 'restTemp', label: 'Temp Restoration' },
  { id: 'restFinal', label: 'Final Restoration' },
  { id: 'vr', label: 'Virtual Reality VR' },
];

const guideSupport = ref('Tooth-Supported');
const sleeveBrand = ref('Straumann VeloGuide / Co-Diagnostix');

const selectedTeeth = ref<number[]>([14, 15, 16]);

const dicomFile = ref('Patient_CT_Scan_Volume.zip');
const upperStl = ref('Upper_Arch_Intraoral.stl');
const lowerStl = ref('Lower_Arch_Intraoral.stl');

const taskToGroup = ref('Co-Diagnostix Senior Planning Group');
const internalComment = ref('Verify nerve canal distance at tooth #19 site. Please use 3.5mm Straumann BLX sleeves.');

const submitting = ref(false);
const successCaseNumber = ref<string | null>(null);

const handleSubmit = () => {
  if (submitting.value) return;
  submitting.value = true;
  sound.playClick(800);

  setTimeout(() => {
    const newOrderNum = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const fullName = `${patientFirstName.value || 'Alex'} ${patientLastName.value || 'Morgan'}`.trim();

    store.createOrder({
      orderNumber: newOrderNum,
      patientName: fullName,
      doctorName: doctorName.value.split('(')[0].trim(),
      clinicName: scanCenter.value,
      restoration: guideSupport.value,
      shade: 'Universal',
      status: 'New',
      priority: isRushExpress.value ? 'Urgent' : 'Normal',
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      amount: 485,
      notes: internalComment.value,
    });

    submitting.value = false;
    successCaseNumber.value = newOrderNum;
    sound.playClick(1000);
  }, 700);
};

const resetForm = () => {
  successCaseNumber.value = null;
  currentStep.value = 1;
};
</script>
