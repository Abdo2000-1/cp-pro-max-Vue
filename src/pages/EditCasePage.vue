<template>
  <div class="space-y-4 w-full min-w-0">
    
    <!-- 1. Header & Controls -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#0b101d] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
      <div class="flex items-center gap-3">
        <button
          type="button"
          @click="router.push('/flow')"
          class="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
          title="Back to Production Flow"
        >
          <ArrowLeft class="w-4 h-4" />
        </button>
        <div>
          <div class="flex items-center gap-2">
            <span class="p-1.5 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
              <FileEdit class="w-4.5 h-4.5" />
            </span>
            <h1 class="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Edit Case #{{ thisID }}
            </h1>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/25">
              ?task=EditCase&thisID={{ thisID }}
            </span>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Prescription modifier • Adjust Co-Diagnostix parameters, tooth sites & internal comments
          </p>
        </div>
      </div>

      <!-- State Switcher & Controls -->
      <div class="flex items-center gap-2">
        <UIStateSwitcher
          :state="uiState"
          @change="(s) => uiState = s"
          label="Edit State"
        />

        <button
          type="button"
          @click="handleSave"
          class="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20 cursor-pointer"
        >
          <Save class="w-3.5 h-3.5" />
          <span>Save Modifications</span>
        </button>
      </div>
    </div>

    <!-- Save Success Alert -->
    <Transition name="fade">
      <div
        v-if="saveSuccess"
        class="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-between"
      >
        <div class="flex items-center gap-2">
          <CheckCircle2 class="w-4 h-4" />
          <span>Changes successfully written to 3DDX database for Case #{{ thisID }}!</span>
        </div>
        <button type="button" @click="router.push('/flow')" class="underline cursor-pointer">View in Flow →</button>
      </div>
    </Transition>

    <!-- Simulated States -->
    <div v-if="uiState === 'loading'" class="bg-white dark:bg-[#0b101d] rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
      <LoadingState :text="`Retrieving Master Prescription Records for Case #${thisID}...`" />
    </div>

    <div v-else-if="uiState === 'error'" class="bg-white dark:bg-[#0b101d] rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
      <ErrorState
        title="Lock Collision (409 Conflict)"
        :message="`Case #${thisID} is currently open in exclusive edit mode by Operator 'Alex M.' in Co-Diagnostix.`"
        code="ERR_CASE_LOCK_CONFLICT_409"
        @retry="uiState = 'normal'"
      />
    </div>

    <div v-else-if="uiState === 'empty'" class="bg-white dark:bg-[#0b101d] rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
      <EmptyState
        title="Record Purged from Database"
        description="The requested case was archived and purged."
      >
        <template #action>
          <button
            @click="uiState = 'normal'"
            class="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
          >
            Reload Default Case #523486
          </button>
        </template>
      </EmptyState>
    </div>

    <!-- Normal Live State -->
    <form v-else @submit.prevent="handleSave" class="space-y-4">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        <!-- Left 2 Cols: Form Parameters -->
        <div class="lg:col-span-2 space-y-4">
          <!-- Doctor & Patient -->
          <div class="bg-white dark:bg-[#0b101d] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-3 text-xs">
            <h3 class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Patient & Clinician Prescription Identity
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label class="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  Patient Full Name
                </label>
                <input
                  type="text"
                  v-model="patientName"
                  class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
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
                  Treating Clinician
                </label>
                <input
                  type="text"
                  v-model="doctorName"
                  class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label class="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  Scan Center Facility
                </label>
                <input
                  type="text"
                  v-model="scanCenter"
                  class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <!-- Tooth Chart 1-32 -->
          <div class="bg-white dark:bg-[#0b101d] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-3">
            <div class="flex justify-between items-center">
              <h3 class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Interactive Tooth Chart (1 - 32)
              </h3>
              <span class="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-bold">
                Sites: {{ selectedTeeth.sort((a,b)=>a-b).join(', ') || 'None' }}
              </span>
            </div>

            <div class="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <TeethChart
                v-model="selectedTeeth"
                @clear-all="selectedTeeth = []"
              />
            </div>
          </div>

          <!-- Internal History & Instructions -->
          <div class="bg-white dark:bg-[#0b101d] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-3 text-xs">
            <h3 class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <MessageSquare class="w-4 h-4 text-cyan-500" />
              <span>Internal Prescription Instructions & Revision Log</span>
            </h3>

            <textarea
              rows="4"
              v-model="internalNotes"
              class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
            />
          </div>
        </div>

        <!-- Right Col: Production Stage & Operator Controls -->
        <div class="space-y-4 text-xs">
          <div class="bg-white dark:bg-[#0b101d] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-3">
            <h3 class="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Production Workflow Status
            </h3>

            <div>
              <label class="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                Current Stage
              </label>
              <select
                v-model="status"
                class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-bold"
              >
                <option value="New">New Prescription</option>
                <option value="Review">Radiology & DICOM Review</option>
                <option value="Design">Co-Diagnostix Treatment Plan</option>
                <option value="Production">CAM 3D Guide Printing</option>
                <option value="Quality Check">Final QC Inspection</option>
                <option value="Completed">Dispatched / Shipped</option>
              </select>
            </div>

            <div>
              <label class="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                Assigned Senior Operator
              </label>
              <select
                v-model="operator"
                class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
              >
                <option>Alex M. (Senior CAD)</option>
                <option>Sarah K. (Planner)</option>
                <option>Omar H. (QC Lead)</option>
                <option>Jessica L. (CAM Specialist)</option>
              </select>
            </div>

            <div class="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="rushCase"
                v-model="isRush"
                class="w-4 h-4 rounded text-cyan-500"
              />
              <label for="rushCase" class="text-amber-500 font-bold flex items-center gap-1 cursor-pointer">
                <Zap class="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>Mark as Rush Priority (12h TAT)</span>
              </label>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="bg-white dark:bg-[#0b101d] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-2">
            <button
              type="submit"
              class="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              Save & Apply Changes
            </button>
            <button
              type="button"
              @click="router.push('/flow')"
              class="w-full py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              Cancel & Return to Flow
            </button>
          </div>
        </div>

      </div>
    </form>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  FileEdit, ArrowLeft, Save, CheckCircle2, Zap, MessageSquare
} from 'lucide-vue-next';
import TeethChart from '@/components/ui/TeethChart.vue';
import UIStateSwitcher, { type UIStateType } from '@/components/ui/UIStateSwitcher.vue';
import LoadingState from '@/components/ui/LoadingState.vue';
import EmptyState from '@/components/ui/EmptyState.vue';
import ErrorState from '@/components/ui/ErrorState.vue';
import { sound } from '@/utils/sound';

const route = useRoute();
const router = useRouter();

const thisID = ref((route.query.thisID as string) || '523486');
const uiState = ref<UIStateType>('normal');
const saveSuccess = ref(false);

const doctorName = ref('Dr. Marcus Vance (NY Smile Center)');
const scanCenter = ref('Align Chicago Scanning Lab');
const patientName = ref('Christopher Walken');
const patientDob = ref('1976-11-20');
const selectedTeeth = ref<number[]>([3, 4, 5, 12, 13]);
const isRush = ref(true);
const status = ref('Design');
const operator = ref('Alex M. (Senior CAD)');
const internalNotes = ref(
  'Doctor requested 1.5mm offset on tooth #4 implant site for Straumann BLX 4.2mm sleeve. Cross-sections verified.'
);

const handleSave = () => {
  saveSuccess.value = true;
  sound.playClick(950);
  setTimeout(() => {
    saveSuccess.value = false;
  }, 2500);
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
