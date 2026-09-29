<template>
  <div :class="['bg-white dark:bg-[#070b14] rounded-3xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-xl shadow-emerald-950/5 select-none transition-colors duration-200', className]">
    
    <!-- 1. HEADER TOOLBAR -->
    <div v-if="showToolbar" class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
      <div>
        <div class="flex items-center gap-2">
          <span class="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/25">
            <Activity class="w-4 h-4" />
          </span>
          <h3 class="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white tracking-tight">
            Anatomical Dental Odontogram (Vue 3 Engine)
          </h3>
          <span class="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            {{ selectedTeeth.length }} Selected
          </span>
        </div>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Universal Numbering System (1–32) • Reactive Clinical 4-Quadrant Dental Arch.
        </p>
      </div>

      <div class="flex items-center gap-2 self-stretch md:self-auto justify-between md:justify-end">
        <!-- Numbering System Switcher -->
        <div class="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            @click="system = 'universal'"
            :class="[
              'px-3 py-1 text-xs font-bold rounded-lg transition-all',
              system === 'universal'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            ]"
          >
            Universal (1-32)
          </button>
          <button
            type="button"
            @click="system = 'fdi'"
            :class="[
              'px-3 py-1 text-xs font-bold rounded-lg transition-all',
              system === 'fdi'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            ]"
          >
            FDI (11-48)
          </button>
        </div>

        <!-- Clear All -->
        <button
          v-if="!readonly && selectedTeeth.length > 0"
          type="button"
          @click="handleSelectBatch('clear')"
          class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors border border-rose-200 dark:border-rose-900/30"
        >
          <RotateCcw class="w-3.5 h-3.5" /> Clear All
        </button>
      </div>
    </div>

    <!-- 2. PROCEDURE BRUSHES & BATCH ACTIONS -->
    <div v-if="!readonly && showToolbar" class="py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80">
      <!-- Active Tool Selection -->
      <div class="flex items-center gap-1.5 flex-wrap">
        <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
          <Zap class="w-3 h-3 text-emerald-500" /> Active Tool:
        </span>
        <button
          v-for="res in RESTORATION_TYPES"
          :key="res.id"
          type="button"
          @click="selectedTool = res.id; sound.playClick()"
          :class="[
            'flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold border transition-all',
            selectedTool === res.id
              ? `${res.bgColor} ${res.borderColor} ${res.textColor} shadow-xs ring-1 ring-current`
              : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          ]"
        >
          <span class="text-sm">{{ res.icon }}</span>
          <span>{{ res.label }}</span>
        </button>
      </div>

      <!-- Quick Presets -->
      <div class="flex items-center gap-1.5 flex-wrap">
        <button
          type="button"
          @click="handleSelectBatch('upper')"
          class="px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
        >
          + Upper (1-16)
        </button>
        <button
          type="button"
          @click="handleSelectBatch('lower')"
          class="px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
        >
          + Lower (17-32)
        </button>
        <button
          type="button"
          @click="handleSelectBatch('smile')"
          class="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800/40 transition-colors"
        >
          <Smile class="w-3.5 h-3.5" /> Smile Zone
        </button>
        <button
          type="button"
          @click="handleSelectBatch('posteriors')"
          class="px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
        >
          + Posteriors
        </button>
      </div>
    </div>

    <!-- 3. THE 4-QUADRANT DENTAL ARCH GRID (1:1 Reference Match) -->
    <div class="py-6 overflow-x-auto">
      <div class="min-w-[700px] max-w-4xl mx-auto space-y-3">
        
        <!-- Top Quadrant Badges -->
        <div class="grid grid-cols-[1fr_auto_1fr] items-center text-xs font-bold text-slate-600 dark:text-slate-300 px-2 pb-1">
          <div class="flex items-center justify-between pr-4">
            <span class="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[11px] border border-emerald-500/20">
              UR • Maxillary Right
            </span>
            <span class="text-[10px] font-mono text-slate-400">#1 ➔ #8</span>
          </div>
          <div class="w-8 flex justify-center text-slate-400 font-mono text-xs">│</div>
          <div class="flex items-center justify-between pl-4">
            <span class="text-[10px] font-mono text-slate-400">#9 ➔ #16</span>
            <span class="px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-600 dark:text-teal-400 font-mono text-[11px] border border-teal-500/20">
              UL • Maxillary Left
            </span>
          </div>
        </div>

        <!-- Cross Canvas Container -->
        <div class="relative border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 bg-slate-50/50 dark:bg-slate-900/40 shadow-inner">
          
          <!-- UPPER TEETH (Roots UP, crowns pointing DOWN towards numbers) -->
          <div class="grid grid-cols-[1fr_auto_1fr] items-end pb-2">
            <div class="grid grid-cols-8 gap-0.5 sm:gap-1">
              <div
                v-for="tooth in upperRight"
                :key="tooth.universal"
                @click="handleToothClick(tooth)"
                @mouseenter="hoveredTooth = tooth; sound.playChartTick()"
                @mouseleave="hoveredTooth = null"
                :class="[
                  'group relative flex flex-col items-center justify-between p-1 rounded-xl cursor-pointer transition-all duration-150 select-none',
                  isToothSelected(tooth.universal)
                    ? 'bg-emerald-500/10 dark:bg-emerald-500/15 ring-2 ring-emerald-400 shadow-md shadow-emerald-500/20'
                    : 'hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                ]"
              >
                <div class="w-8 sm:w-10 h-22 sm:h-26 flex items-center justify-center transition-transform group-hover:scale-105">
                  <component
                    :is="renderToothSVG(tooth.universal, isToothSelected(tooth.universal), getToothRestoration(tooth.universal))"
                  />
                </div>
                <span
                  :class="[
                    'text-[12px] font-mono font-bold px-1.5 py-0.5 mt-0.5 rounded transition-colors',
                    isToothSelected(tooth.universal)
                      ? 'bg-emerald-500 text-slate-950 font-black shadow-xs'
                      : 'text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400'
                  ]"
                >
                  {{ system === 'universal' ? tooth.universal : tooth.fdi }}
                </span>
              </div>
            </div>

            <!-- Top Midline Divider -->
            <div class="w-8 h-full flex items-center justify-center">
              <div class="w-[1.5px] h-full bg-slate-900 dark:bg-slate-200 rounded-full" />
            </div>

            <div class="grid grid-cols-8 gap-0.5 sm:gap-1">
              <div
                v-for="tooth in upperLeft"
                :key="tooth.universal"
                @click="handleToothClick(tooth)"
                @mouseenter="hoveredTooth = tooth; sound.playChartTick()"
                @mouseleave="hoveredTooth = null"
                :class="[
                  'group relative flex flex-col items-center justify-between p-1 rounded-xl cursor-pointer transition-all duration-150 select-none',
                  isToothSelected(tooth.universal)
                    ? 'bg-emerald-500/10 dark:bg-emerald-500/15 ring-2 ring-emerald-400 shadow-md shadow-emerald-500/20'
                    : 'hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                ]"
              >
                <div class="w-8 sm:w-10 h-22 sm:h-26 flex items-center justify-center transition-transform group-hover:scale-105">
                  <component
                    :is="renderToothSVG(tooth.universal, isToothSelected(tooth.universal), getToothRestoration(tooth.universal))"
                  />
                </div>
                <span
                  :class="[
                    'text-[12px] font-mono font-bold px-1.5 py-0.5 mt-0.5 rounded transition-colors',
                    isToothSelected(tooth.universal)
                      ? 'bg-emerald-500 text-slate-950 font-black shadow-xs'
                      : 'text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400'
                  ]"
                >
                  {{ system === 'universal' ? tooth.universal : tooth.fdi }}
                </span>
              </div>
            </div>
          </div>

          <!-- SOLID HORIZONTAL OCCLUSAL CROSS LINE WITH 'Right' AND 'Left' -->
          <div class="relative flex items-center justify-between my-2">
            <span class="text-sm font-semibold text-slate-900 dark:text-white pl-1 shrink-0 select-none">
              Right
            </span>
            <div class="flex-1 h-[1.5px] bg-slate-900 dark:bg-slate-200 mx-3 relative flex items-center justify-center">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-slate-900" />
            </div>
            <span class="text-sm font-semibold text-slate-900 dark:text-white pr-1 shrink-0 select-none">
              Left
            </span>
          </div>

          <!-- LOWER TEETH (Numbers on top, crowns pointing UP towards numbers, roots reach DOWN) -->
          <div class="grid grid-cols-[1fr_auto_1fr] items-start pt-2">
            <div class="grid grid-cols-8 gap-0.5 sm:gap-1">
              <div
                v-for="tooth in lowerRight"
                :key="tooth.universal"
                @click="handleToothClick(tooth)"
                @mouseenter="hoveredTooth = tooth; sound.playChartTick()"
                @mouseleave="hoveredTooth = null"
                :class="[
                  'group relative flex flex-col items-center justify-between p-1 rounded-xl cursor-pointer transition-all duration-150 select-none',
                  isToothSelected(tooth.universal)
                    ? 'bg-emerald-500/10 dark:bg-emerald-500/15 ring-2 ring-emerald-400 shadow-md shadow-emerald-500/20'
                    : 'hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                ]"
              >
                <span
                  :class="[
                    'text-[12px] font-mono font-bold px-1.5 py-0.5 mb-0.5 rounded transition-colors',
                    isToothSelected(tooth.universal)
                      ? 'bg-teal-500 text-white font-black shadow-xs'
                      : 'text-slate-800 dark:text-slate-200 group-hover:text-teal-600 dark:group-hover:text-teal-400'
                  ]"
                >
                  {{ system === 'universal' ? tooth.universal : tooth.fdi }}
                </span>
                <div class="w-8 sm:w-10 h-22 sm:h-26 flex items-center justify-center transition-transform group-hover:scale-105">
                  <component
                    :is="renderToothSVG(tooth.universal, isToothSelected(tooth.universal), getToothRestoration(tooth.universal))"
                  />
                </div>
              </div>
            </div>

            <!-- Bottom Midline Divider -->
            <div class="w-8 h-full flex items-center justify-center">
              <div class="w-[1.5px] h-full bg-slate-900 dark:bg-slate-200 rounded-full" />
            </div>

            <div class="grid grid-cols-8 gap-0.5 sm:gap-1">
              <div
                v-for="tooth in lowerLeft"
                :key="tooth.universal"
                @click="handleToothClick(tooth)"
                @mouseenter="hoveredTooth = tooth; sound.playChartTick()"
                @mouseleave="hoveredTooth = null"
                :class="[
                  'group relative flex flex-col items-center justify-between p-1 rounded-xl cursor-pointer transition-all duration-150 select-none',
                  isToothSelected(tooth.universal)
                    ? 'bg-emerald-500/10 dark:bg-emerald-500/15 ring-2 ring-emerald-400 shadow-md shadow-emerald-500/20'
                    : 'hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                ]"
              >
                <span
                  :class="[
                    'text-[12px] font-mono font-bold px-1.5 py-0.5 mb-0.5 rounded transition-colors',
                    isToothSelected(tooth.universal)
                      ? 'bg-teal-500 text-white font-black shadow-xs'
                      : 'text-slate-800 dark:text-slate-200 group-hover:text-teal-600 dark:group-hover:text-teal-400'
                  ]"
                >
                  {{ system === 'universal' ? tooth.universal : tooth.fdi }}
                </span>
                <div class="w-8 sm:w-10 h-22 sm:h-26 flex items-center justify-center transition-transform group-hover:scale-105">
                  <component
                    :is="renderToothSVG(tooth.universal, isToothSelected(tooth.universal), getToothRestoration(tooth.universal))"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Bottom Quadrant Badges -->
        <div class="grid grid-cols-[1fr_auto_1fr] items-center text-xs font-bold text-slate-600 dark:text-slate-300 px-2 pt-1">
          <div class="flex items-center justify-between pr-4">
            <span class="px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-600 dark:text-teal-400 font-mono text-[11px] border border-teal-500/20">
              LR • Mandibular Right
            </span>
            <span class="text-[10px] font-mono text-slate-400">#32 ➔ #25</span>
          </div>
          <div class="w-8 flex justify-center text-slate-400 font-mono text-xs">│</div>
          <div class="flex items-center justify-between pl-4">
            <span class="text-[10px] font-mono text-slate-400">#24 ➔ #17</span>
            <span class="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[11px] border border-emerald-500/20">
              LL • Mandibular Left
            </span>
          </div>
        </div>

      </div>
    </div>

    <!-- 4. LIVE HOVER INSPECTOR BAR -->
    <div class="h-9 flex items-center justify-between px-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 text-xs text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800">
      <div v-if="hoveredTooth" class="flex items-center gap-2 truncate">
        <span class="font-extrabold text-slate-900 dark:text-white">
          {{ hoveredTooth.name }}
        </span>
        <span class="text-slate-400">•</span>
        <span class="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
          Universal #{{ hoveredTooth.universal }} (FDI {{ hoveredTooth.fdi }})
        </span>
        <span class="text-slate-400">•</span>
        <span class="text-slate-500 dark:text-slate-400 font-medium">
          Quadrant {{ hoveredTooth.quadrant }} • {{ hoveredTooth.isAnterior ? 'Anterior Unit' : 'Posterior Unit' }}
        </span>
      </div>
      <span v-else class="text-slate-400 dark:text-slate-500 flex items-center gap-2">
        <Info class="w-4 h-4 text-emerald-500" />
        Hover over any tooth to view anatomical root structure, quadrant position, and restoration status
      </span>

      <span v-if="hoveredTooth && isToothSelected(hoveredTooth.universal)" class="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5 shrink-0">
        <Check class="w-4 h-4 stroke-[3]" /> Assigned: {{ getToothRestoration(hoveredTooth.universal) || selectedTool }}
      </span>
    </div>

    <!-- 5. SELECTED RESTORATION UNITS SUMMARY TAGS -->
    <div v-if="selectedTeeth.length > 0" class="mt-4 pt-3.5 border-t border-slate-200 dark:border-slate-800 flex flex-wrap justify-between items-center gap-3 text-xs">
      <div class="flex flex-wrap items-center gap-2">
        <span class="font-extrabold text-slate-700 dark:text-slate-300">Selected Units:</span>
        <div class="flex flex-wrap gap-1.5">
          <span
            v-for="num in sortedSelectedTeeth"
            :key="num"
            class="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 font-mono font-bold border border-emerald-200 dark:border-emerald-800 shadow-2xs"
          >
            <span>{{ system === 'universal' ? `#${num}` : `FDI ${getFdiNumber(num)}` }}</span>
            <span class="text-[10px] text-emerald-600 dark:text-emerald-400 font-sans font-medium">
              ({{ getRestorationLabel(getToothRestoration(num) || selectedTool) }})
            </span>
            <button
              v-if="!readonly"
              type="button"
              @click.stop="toggleTooth(num)"
              class="hover:text-rose-500 ml-1 transition-colors"
              title="Remove selection"
            >
              <X class="w-3 h-3" />
            </button>
          </span>
        </div>
      </div>

      <div class="text-slate-500 font-medium font-mono text-xs">
        Total units for fabrication: <strong class="text-emerald-600 dark:text-emerald-400 font-black text-sm">{{ selectedTeeth.length }}</strong>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
export type ToothSystem = 'universal' | 'fdi';
export type RestorationType = 'crown' | 'bridge' | 'veneer' | 'implant' | 'inlay' | 'extraction';

export interface ToothOdontoData {
  universal: number;
  fdi: number;
  code: string;
  name: string;
  category: 'molar' | 'premolar' | 'canine' | 'incisor_lat' | 'incisor_cen';
  arch: 'upper' | 'lower';
  quadrant: 'UR' | 'UL' | 'LL' | 'LR';
  isAnterior: boolean;
}

export const ODONTO_DATABASE: ToothOdontoData[] = [
  // Upper Right (UR: 1 to 8)
  { universal: 1,  fdi: 18, code: '18', name: 'Upper Right 3rd Molar (Wisdom)', category: 'molar', arch: 'upper', quadrant: 'UR', isAnterior: false },
  { universal: 2,  fdi: 17, code: '17', name: 'Upper Right 2nd Molar', category: 'molar', arch: 'upper', quadrant: 'UR', isAnterior: false },
  { universal: 3,  fdi: 16, code: '16', name: 'Upper Right 1st Molar', category: 'molar', arch: 'upper', quadrant: 'UR', isAnterior: false },
  { universal: 4,  fdi: 15, code: '15', name: 'Upper Right 2nd Premolar', category: 'premolar', arch: 'upper', quadrant: 'UR', isAnterior: false },
  { universal: 5,  fdi: 14, code: '14', name: 'Upper Right 1st Premolar', category: 'premolar', arch: 'upper', quadrant: 'UR', isAnterior: false },
  { universal: 6,  fdi: 13, code: '13', name: 'Upper Right Canine (Cuspid)', category: 'canine', arch: 'upper', quadrant: 'UR', isAnterior: true },
  { universal: 7,  fdi: 12, code: '12', name: 'Upper Right Lateral Incisor', category: 'incisor_lat', arch: 'upper', quadrant: 'UR', isAnterior: true },
  { universal: 8,  fdi: 11, code: '11', name: 'Upper Right Central Incisor', category: 'incisor_cen', arch: 'upper', quadrant: 'UR', isAnterior: true },

  // Upper Left (UL: 9 to 16)
  { universal: 9,  fdi: 21, code: '21', name: 'Upper Left Central Incisor', category: 'incisor_cen', arch: 'upper', quadrant: 'UL', isAnterior: true },
  { universal: 10, fdi: 22, code: '22', name: 'Upper Left Lateral Incisor', category: 'incisor_lat', arch: 'upper', quadrant: 'UL', isAnterior: true },
  { universal: 11, fdi: 23, code: '23', name: 'Upper Left Canine (Cuspid)', category: 'canine', arch: 'upper', quadrant: 'UL', isAnterior: true },
  { universal: 12, fdi: 24, code: '24', name: 'Upper Left 1st Premolar', category: 'premolar', arch: 'upper', quadrant: 'UL', isAnterior: false },
  { universal: 13, fdi: 25, code: '25', name: 'Upper Left 2nd Premolar', category: 'premolar', arch: 'upper', quadrant: 'UL', isAnterior: false },
  { universal: 14, fdi: 26, code: '26', name: 'Upper Left 1st Molar', category: 'molar', arch: 'upper', quadrant: 'UL', isAnterior: false },
  { universal: 15, fdi: 27, code: '27', name: 'Upper Left 2nd Molar', category: 'molar', arch: 'upper', quadrant: 'UL', isAnterior: false },
  { universal: 16, fdi: 28, code: '28', name: 'Upper Left 3rd Molar (Wisdom)', category: 'molar', arch: 'upper', quadrant: 'UL', isAnterior: false },

  // Lower Right (LR: 32 to 25)
  { universal: 32, fdi: 48, code: '48', name: 'Lower Right 3rd Molar (Wisdom)', category: 'molar', arch: 'lower', quadrant: 'LR', isAnterior: false },
  { universal: 31, fdi: 47, code: '47', name: 'Lower Right 2nd Molar', category: 'molar', arch: 'lower', quadrant: 'LR', isAnterior: false },
  { universal: 30, fdi: 46, code: '46', name: 'Lower Right 1st Molar', category: 'molar', arch: 'lower', quadrant: 'LR', isAnterior: false },
  { universal: 29, fdi: 45, code: '45', name: 'Lower Right 2nd Premolar', category: 'premolar', arch: 'lower', quadrant: 'LR', isAnterior: false },
  { universal: 28, fdi: 44, code: '44', name: 'Lower Right 1st Premolar', category: 'premolar', arch: 'lower', quadrant: 'LR', isAnterior: false },
  { universal: 27, fdi: 43, code: '43', name: 'Lower Right Canine (Cuspid)', category: 'canine', arch: 'lower', quadrant: 'LR', isAnterior: true },
  { universal: 26, fdi: 42, code: '42', name: 'Lower Right Lateral Incisor', category: 'incisor_lat', arch: 'lower', quadrant: 'LR', isAnterior: true },
  { universal: 25, fdi: 41, code: '41', name: 'Lower Right Central Incisor', category: 'incisor_cen', arch: 'lower', quadrant: 'LR', isAnterior: true },

  // Lower Left (LL: 24 to 17)
  { universal: 24, fdi: 31, code: '31', name: 'Lower Left Central Incisor', category: 'incisor_cen', arch: 'lower', quadrant: 'LL', isAnterior: true },
  { universal: 23, fdi: 32, code: '32', name: 'Lower Left Lateral Incisor', category: 'incisor_lat', arch: 'lower', quadrant: 'LL', isAnterior: true },
  { universal: 22, fdi: 33, code: '33', name: 'Lower Left Canine (Cuspid)', category: 'canine', arch: 'lower', quadrant: 'LL', isAnterior: true },
  { universal: 21, fdi: 34, code: '34', name: 'Lower Left 1st Premolar', category: 'premolar', arch: 'lower', quadrant: 'LL', isAnterior: false },
  { universal: 20, fdi: 35, code: '35', name: 'Lower Left 2nd Premolar', category: 'premolar', arch: 'lower', quadrant: 'LL', isAnterior: false },
  { universal: 19, fdi: 36, code: '36', name: 'Lower Left 1st Molar', category: 'molar', arch: 'lower', quadrant: 'LL', isAnterior: false },
  { universal: 18, fdi: 37, code: '37', name: 'Lower Left 2nd Molar', category: 'molar', arch: 'lower', quadrant: 'LL', isAnterior: false },
  { universal: 17, fdi: 38, code: '38', name: 'Lower Left 3rd Molar (Wisdom)', category: 'molar', arch: 'lower', quadrant: 'LL', isAnterior: false },
];

export const RESTORATION_TYPES: {
  id: RestorationType;
  label: string;
  icon: string;
  color: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
}[] = [
  { id: 'crown', label: 'Crown', icon: '👑', color: '#10b981', textColor: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-50 dark:bg-emerald-950/40', borderColor: 'border-emerald-500' },
  { id: 'bridge', label: 'Bridge Unit', icon: '🌉', color: '#6366f1', textColor: 'text-indigo-600 dark:text-indigo-400', bgColor: 'bg-indigo-50 dark:bg-indigo-950/40', borderColor: 'border-indigo-500' },
  { id: 'veneer', label: 'Veneer', icon: '✨', color: '#a855f7', textColor: 'text-purple-600 dark:text-purple-400', bgColor: 'bg-purple-50 dark:bg-purple-950/40', borderColor: 'border-purple-500' },
  { id: 'implant', label: 'Implant', icon: '🔩', color: '#f59e0b', textColor: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-50 dark:bg-amber-950/40', borderColor: 'border-amber-500' },
  { id: 'inlay', label: 'Inlay / Onlay', icon: '💎', color: '#06b6d4', textColor: 'text-cyan-600 dark:text-cyan-400', bgColor: 'bg-cyan-50 dark:bg-cyan-950/40', borderColor: 'border-cyan-500' },
  { id: 'extraction', label: 'Missing / Pontic', icon: '❌', color: '#f43f5e', textColor: 'text-rose-600 dark:text-rose-400', bgColor: 'bg-rose-50 dark:bg-rose-950/40', borderColor: 'border-rose-500' },
];
</script>

<script setup lang="ts">
import { ref, computed, h } from 'vue';
import { Check, RotateCcw, Smile, Zap, Info, X, Activity } from 'lucide-vue-next';
import { sound } from '@/utils/sound';

// PROPS & V-MODEL
const props = withDefaults(defineProps<{
  modelValue?: number[];
  toothRestorations?: Record<number, RestorationType>;
  readonly?: boolean;
  showToolbar?: boolean;
  className?: string;
}>(), {
  modelValue: () => [],
  toothRestorations: () => ({}),
  readonly: false,
  showToolbar: true,
  className: '',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: number[]): void;
  (e: 'update:toothRestorations', value: Record<number, RestorationType>): void;
  (e: 'toggle', tooth: number): void;
  (e: 'assign', tooth: number, type: RestorationType): void;
  (e: 'clear'): void;
}>();

const selectedTeeth = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

const restorations = computed({
  get: () => props.toothRestorations,
  set: (val) => emit('update:toothRestorations', val)
});

const system = ref<ToothSystem>('universal');
const selectedTool = ref<RestorationType>('crown');
const hoveredTooth = ref<ToothOdontoData | null>(null);

const upperRight = ODONTO_DATABASE.filter(t => t.quadrant === 'UR');
const upperLeft  = ODONTO_DATABASE.filter(t => t.quadrant === 'UL');
const lowerRight = ODONTO_DATABASE.filter(t => t.quadrant === 'LR');
const lowerLeft  = ODONTO_DATABASE.filter(t => t.quadrant === 'LL');

const sortedSelectedTeeth = computed(() => {
  return [...selectedTeeth.value].sort((a, b) => a - b);
});

const isToothSelected = (num: number) => selectedTeeth.value.includes(num);
const getToothRestoration = (num: number) => restorations.value[num];
const getFdiNumber = (num: number) => ODONTO_DATABASE.find(t => t.universal === num)?.fdi || num;
const getRestorationLabel = (type: RestorationType) => RESTORATION_TYPES.find(r => r.id === type)?.label || type;

const toggleTooth = (num: number) => {
  if (props.readonly) return;
  const isSelected = selectedTeeth.value.includes(num);
  let updatedList: number[];
  const updatedRestos = { ...restorations.value };

  if (isSelected) {
    updatedList = selectedTeeth.value.filter(n => n !== num);
    delete updatedRestos[num];
    sound.playClick(500);
  } else {
    updatedList = [...selectedTeeth.value, num];
    updatedRestos[num] = selectedTool.value;
    sound.playPop();
  }

  emit('update:modelValue', updatedList);
  emit('update:toothRestorations', updatedRestos);
  emit('toggle', num);
  if (!isSelected) {
    emit('assign', num, selectedTool.value);
  }
};

const handleToothClick = (tooth: ToothOdontoData) => {
  toggleTooth(tooth.universal);
};

const handleSelectBatch = (type: 'all' | 'upper' | 'lower' | 'smile' | 'posteriors' | 'clear') => {
  if (props.readonly) return;

  if (type === 'clear') {
    emit('update:modelValue', []);
    emit('update:toothRestorations', {});
    emit('clear');
    sound.playClick(400);
    return;
  }

  let targets: ToothOdontoData[] = [];
  if (type === 'all') targets = ODONTO_DATABASE;
  if (type === 'upper') targets = ODONTO_DATABASE.filter(t => t.arch === 'upper');
  if (type === 'lower') targets = ODONTO_DATABASE.filter(t => t.arch === 'lower');
  if (type === 'smile') targets = ODONTO_DATABASE.filter(t => t.isAnterior);
  if (type === 'posteriors') targets = ODONTO_DATABASE.filter(t => !t.isAnterior);

  const newSelected = new Set(selectedTeeth.value);
  const newRestos = { ...restorations.value };

  targets.forEach(t => {
    newSelected.add(t.universal);
    if (!newRestos[t.universal]) {
      newRestos[t.universal] = selectedTool.value;
    }
  });

  emit('update:modelValue', Array.from(newSelected));
  emit('update:toothRestorations', newRestos);
  sound.playSuccess();
};

/**
 * Maps tooth 1..32 to its master anatomical base shape
 */
function getBaseToothNumber(num: number): number {
  if (num >= 1 && num <= 8) return num;
  if (num >= 9 && num <= 16) return 17 - num; // 9->8, 10->7, ... 16->1
  if (num >= 25 && num <= 32) return num;
  if (num >= 17 && num <= 24) return 49 - num; // 24->25, 23->26, ... 17->32
  return 8;
}

/**
 * Pure Vue 3 Virtual DOM Render Function for Tooth SVG
 * Guarantees zero rendering latency, crisp lines, and exact 1:1 medical illustration
 */
function renderToothSVG(toothNumber: number, isSelected: boolean, restoration?: RestorationType) {
  const resInfo = RESTORATION_TYPES.find(r => r.id === restoration);
  const strokeColor = isSelected ? (resInfo?.color || '#10b981') : 'currentColor';
  const crownFill = isSelected ? (resInfo ? `${resInfo.color}25` : 'rgba(16,185,129,0.18)') : 'none';
  const isImplant = Boolean(isSelected && restoration === 'implant');
  const isExtraction = Boolean(isSelected && restoration === 'extraction');

  const isUpper = toothNumber >= 1 && toothNumber <= 16;
  const isLeftQuadrant = (toothNumber >= 9 && toothNumber <= 16) || (toothNumber >= 17 && toothNumber <= 24);
  const baseNumber = getBaseToothNumber(toothNumber);

  return () => {
    const renderAnatomy = () => {
      switch (baseNumber) {
        // --- UPPER TEETH (Crown points DOWN towards midline, Roots reach UP) ---
        case 8: // Central Incisor
          return [
            !isImplant ? h('path', { d: 'M 15 52 C 16 38, 20 24, 24 14 C 25 12, 26 12, 27 14 C 31 24, 34 38, 35 52', stroke: strokeColor, strokeWidth: isSelected ? '2' : '1.5', fill: 'none' }) : null,
            h('path', { d: 'M 15 52 C 20 49, 30 49, 35 52', stroke: strokeColor, strokeWidth: '1.2', opacity: '0.8', fill: 'none' }),
            h('path', { d: 'M 15 52 C 13 62, 13 74, 15 82 C 17 84, 33 84, 35 82 C 37 74, 37 62, 35 52 Z', stroke: strokeColor, strokeWidth: isSelected ? '2.2' : '1.6', fill: crownFill })
          ];
        case 7: // Lateral Incisor
          return [
            !isImplant ? h('path', { d: 'M 17 52 C 17 40, 18 28, 21 16 C 22 14, 25 14, 27 17 C 29 28, 32 40, 33 52', stroke: strokeColor, strokeWidth: isSelected ? '2' : '1.5', fill: 'none' }) : null,
            h('path', { d: 'M 17 52 C 21 49, 29 49, 33 52', stroke: strokeColor, strokeWidth: '1.2', opacity: '0.8', fill: 'none' }),
            h('path', { d: 'M 17 52 C 15 62, 15 74, 17 82 C 19 84, 31 84, 33 82 C 35 74, 35 62, 33 52 Z', stroke: strokeColor, strokeWidth: isSelected ? '2.2' : '1.6', fill: crownFill })
          ];
        case 6: // Canine
          return [
            !isImplant ? h('path', { d: 'M 16 50 C 18 34, 21 16, 24 4 C 25 3, 26 3, 27 4 C 30 16, 33 34, 34 50', stroke: strokeColor, strokeWidth: isSelected ? '2' : '1.5', fill: 'none' }) : null,
            h('path', { d: 'M 16 50 C 21 47, 29 47, 34 50', stroke: strokeColor, strokeWidth: '1.2', opacity: '0.8', fill: 'none' }),
            h('path', { d: 'M 16 50 C 14 62, 15 72, 25 84 C 35 72, 36 62, 34 50 Z', stroke: strokeColor, strokeWidth: isSelected ? '2.2' : '1.6', fill: crownFill }),
            h('line', { x1: '25', y1: '52', x2: '25', y2: '80', stroke: strokeColor, strokeWidth: '0.8', opacity: '0.4' })
          ];
        case 5:
        case 4: // Premolars
          return [
            !isImplant ? h('path', { d: 'M 16 52 C 15 40, 17 26, 22 16 C 24 14, 27 14, 29 17 C 31 26, 33 40, 34 52', stroke: strokeColor, strokeWidth: isSelected ? '2' : '1.5', fill: 'none' }) : null,
            h('path', { d: 'M 16 52 C 21 49, 29 49, 34 52', stroke: strokeColor, strokeWidth: '1.2', opacity: '0.8', fill: 'none' }),
            h('path', { d: 'M 15 52 C 12 62, 13 74, 18 82 C 21 84, 29 84, 32 82 C 37 74, 38 62, 35 52 Z', stroke: strokeColor, strokeWidth: isSelected ? '2.2' : '1.6', fill: crownFill })
          ];
        case 3: // 1st Molar (3 roots)
          return [
            !isImplant ? h('g', { stroke: strokeColor, strokeWidth: isSelected ? '2' : '1.5', fill: 'none' }, [
              h('path', { d: 'M 21 42 C 22 26, 24 12, 25.5 10 C 27 12, 29 26, 30 42' }),
              h('path', { d: 'M 8 52 C 7 38, 9 24, 12 16 C 14 16, 16 22, 17 34 C 18 42, 20 46, 22 48' }),
              h('path', { d: 'M 29 48 C 31 46, 33 42, 34 34 C 35 22, 37 16, 39 16 C 42 24, 44 38, 43 52' }),
            ]) : null,
            h('path', { d: 'M 8 52 C 18 49, 33 49, 43 52', stroke: strokeColor, strokeWidth: '1.2', opacity: '0.8', fill: 'none' }),
            h('path', { d: 'M 8 52 C 6 63, 8 75, 14 82 C 17 84, 22 82, 25.5 78 C 29 82, 34 84, 37 82 C 43 75, 45 63, 43 52 Z', stroke: strokeColor, strokeWidth: isSelected ? '2.2' : '1.6', fill: crownFill }),
            h('line', { x1: '25.5', y1: '68', x2: '25.5', y2: '78', stroke: strokeColor, strokeWidth: '1', strokeLinecap: 'round' })
          ];
        case 2: // 2nd Molar
          return [
            !isImplant ? h('g', { stroke: strokeColor, strokeWidth: isSelected ? '2' : '1.5', fill: 'none' }, [
              h('path', { d: 'M 21 42 C 22 28, 24 14, 25.5 12 C 27 14, 29 28, 30 42' }),
              h('path', { d: 'M 9 52 C 8 39, 10 25, 13 18 C 15 18, 17 24, 18 35 C 19 42, 20 46, 22 48' }),
              h('path', { d: 'M 29 48 C 31 46, 32 42, 33 35 C 34 24, 36 18, 38 18 C 41 25, 43 39, 42 52' }),
            ]) : null,
            h('path', { d: 'M 9 52 C 19 49, 32 49, 42 52', stroke: strokeColor, strokeWidth: '1.2', opacity: '0.8', fill: 'none' }),
            h('path', { d: 'M 9 52 C 7 63, 9 75, 15 82 C 18 84, 22 82, 25.5 78 C 29 82, 33 84, 36 82 C 42 75, 44 63, 42 52 Z', stroke: strokeColor, strokeWidth: isSelected ? '2.2' : '1.6', fill: crownFill }),
            h('line', { x1: '25.5', y1: '68', x2: '25.5', y2: '78', stroke: strokeColor, strokeWidth: '1', strokeLinecap: 'round' })
          ];
        case 1: // 3rd Molar
          return [
            !isImplant ? h('path', { d: 'M 11 52 C 10 40, 12 26, 16 18 C 18 18, 20 26, 22 36 C 24 42, 27 42, 29 36 C 31 26, 33 18, 35 18 C 39 26, 41 40, 40 52', stroke: strokeColor, strokeWidth: isSelected ? '2' : '1.5', fill: 'none' }) : null,
            h('path', { d: 'M 11 52 C 20 49, 31 49, 40 52', stroke: strokeColor, strokeWidth: '1.2', opacity: '0.8', fill: 'none' }),
            h('path', { d: 'M 11 52 C 9 63, 11 74, 16 81 C 19 83, 23 81, 25.5 78 C 28 81, 32 83, 35 81 C 40 74, 42 63, 40 52 Z', stroke: strokeColor, strokeWidth: isSelected ? '2.2' : '1.6', fill: crownFill })
          ];

        // --- LOWER TEETH (Crown at top facing midline, Roots reach DOWN) ---
        case 25: // Central Incisor
          return [
            h('path', { d: 'M 18 44 C 17 34, 17 24, 19 16 C 20 14, 30 14, 31 16 C 33 24, 33 34, 32 44 Z', stroke: strokeColor, strokeWidth: isSelected ? '2.2' : '1.6', fill: crownFill }),
            h('path', { d: 'M 18 44 C 22 47, 28 47, 32 44', stroke: strokeColor, strokeWidth: '1.2', opacity: '0.8', fill: 'none' }),
            !isImplant ? h('path', { d: 'M 18 44 C 18 58, 21 73, 24 85 C 25 86, 26 86, 27 85 C 29 73, 32 58, 32 44', stroke: strokeColor, strokeWidth: isSelected ? '2' : '1.5', fill: 'none' }) : null
          ];
        case 26: // Lateral Incisor
          return [
            h('path', { d: 'M 17 44 C 16 34, 16 23, 18 15 C 19 13, 31 13, 32 15 C 34 23, 34 34, 33 44 Z', stroke: strokeColor, strokeWidth: isSelected ? '2.2' : '1.6', fill: crownFill }),
            h('path', { d: 'M 17 44 C 22 47, 28 47, 33 44', stroke: strokeColor, strokeWidth: '1.2', opacity: '0.8', fill: 'none' }),
            !isImplant ? h('path', { d: 'M 17 44 C 17 58, 20 74, 24 87 C 25 88, 26 88, 27 87 C 30 74, 33 58, 33 44', stroke: strokeColor, strokeWidth: isSelected ? '2' : '1.5', fill: 'none' }) : null
          ];
        case 27: // Canine (Deepest lower root)
          return [
            h('path', { d: 'M 16 44 C 14 33, 16 22, 25 8 C 34 22, 36 33, 34 44 Z', stroke: strokeColor, strokeWidth: isSelected ? '2.2' : '1.6', fill: crownFill }),
            h('line', { x1: '25', y1: '10', x2: '25', y2: '40', stroke: strokeColor, strokeWidth: '0.8', opacity: '0.4' }),
            h('path', { d: 'M 16 44 C 21 47, 29 47, 34 44', stroke: strokeColor, strokeWidth: '1.2', opacity: '0.8', fill: 'none' }),
            !isImplant ? h('path', { d: 'M 16 44 C 17 60, 21 80, 24 95 C 25 96, 26 96, 27 95 C 29 80, 33 60, 34 44', stroke: strokeColor, strokeWidth: isSelected ? '2' : '1.5', fill: 'none' }) : null
          ];
        case 28:
        case 29: // Premolars
          return [
            h('path', { d: 'M 15 44 C 12 34, 14 22, 19 16 C 22 14, 28 14, 31 16 C 36 22, 38 34, 35 44 Z', stroke: strokeColor, strokeWidth: isSelected ? '2.2' : '1.6', fill: crownFill }),
            h('path', { d: 'M 15 44 C 20 47, 29 47, 35 44', stroke: strokeColor, strokeWidth: '1.2', opacity: '0.8', fill: 'none' }),
            !isImplant ? h('path', { d: 'M 15 44 C 16 57, 19 72, 24 82 C 25 83, 26 83, 27 82 C 31 72, 34 57, 35 44', stroke: strokeColor, strokeWidth: isSelected ? '2' : '1.5', fill: 'none' }) : null
          ];
        case 30: // 1st Molar (2 bifurcated wishbone roots with U-furcation)
          return [
            h('path', { d: 'M 8 44 C 6 34, 7 22, 13 16 C 17 12, 21 14, 25 17 C 28 14, 32 12, 36 16 C 42 22, 43 34, 41 44 Z', stroke: strokeColor, strokeWidth: isSelected ? '2.2' : '1.6', fill: crownFill }),
            h('path', { d: 'M 25 17 L 25 26 C 21 26, 16 29, 14 32 M 25 26 C 29 26, 34 29, 36 32', stroke: strokeColor, strokeWidth: '1', strokeLinecap: 'round', fill: 'none' }),
            h('path', { d: 'M 8 44 C 18 47, 31 47, 41 44', stroke: strokeColor, strokeWidth: '1.2', opacity: '0.8', fill: 'none' }),
            !isImplant ? h('path', { d: 'M 8 44 C 8 58, 10 72, 13 84 C 15 85, 17 84, 18 80 C 19 72, 21 62, 22 54 C 23 50, 27 50, 28 54 C 29 62, 31 72, 32 80 C 33 84, 35 85, 37 84 C 40 72, 41 58, 41 44', stroke: strokeColor, strokeWidth: isSelected ? '2' : '1.5', fill: 'none' }) : null
          ];
        case 31: // 2nd Molar
          return [
            h('path', { d: 'M 9 44 C 7 34, 8 22, 14 16 C 18 13, 21 15, 25 17 C 28 15, 31 13, 35 16 C 41 22, 42 34, 40 44 Z', stroke: strokeColor, strokeWidth: isSelected ? '2.2' : '1.6', fill: crownFill }),
            h('path', { d: 'M 25 17 L 25 26 C 21 26, 17 29, 15 32 M 25 26 C 29 26, 33 29, 35 32', stroke: strokeColor, strokeWidth: '1', strokeLinecap: 'round', fill: 'none' }),
            h('path', { d: 'M 9 44 C 19 47, 30 47, 40 44', stroke: strokeColor, strokeWidth: '1.2', opacity: '0.8', fill: 'none' }),
            !isImplant ? h('path', { d: 'M 9 44 C 9 58, 11 71, 14 83 C 16 84, 17 83, 18 79 C 19 71, 21 61, 22 54 C 23 51, 27 51, 28 54 C 29 61, 31 71, 32 79 C 33 83, 34 84, 36 83 C 38 71, 40 58, 40 44', stroke: strokeColor, strokeWidth: isSelected ? '2' : '1.5', fill: 'none' }) : null
          ];
        case 32: // 3rd Molar
          return [
            h('path', { d: 'M 11 44 C 9 34, 10 23, 16 17 C 19 15, 22 16, 25 18 C 27 16, 30 15, 33 17 C 39 23, 40 34, 38 44 Z', stroke: strokeColor, strokeWidth: isSelected ? '2.2' : '1.6', fill: crownFill }),
            h('path', { d: 'M 11 44 C 20 47, 29 47, 38 44', stroke: strokeColor, strokeWidth: '1.2', opacity: '0.8', fill: 'none' }),
            !isImplant ? h('path', { d: 'M 11 44 C 10 56, 11 69, 14 78 C 16 79, 18 78, 19 74 C 20 66, 21 58, 22 54 C 23 52, 27 52, 28 54 C 29 58, 30 66, 31 74 C 32 78, 34 79, 36 78 C 38 69, 39 56, 38 44', stroke: strokeColor, strokeWidth: isSelected ? '2' : '1.5', fill: 'none' }) : null
          ];
        default:
          return [];
      }
    };

    const anatomyChildren = renderAnatomy();
    const toothGroup = isLeftQuadrant
      ? h('g', { transform: 'translate(50, 0) scale(-1, 1)' }, anatomyChildren)
      : h('g', null, anatomyChildren);

    // Implant Fixture
    let implantNode = null;
    if (isImplant) {
      if (isUpper) {
        implantNode = h('g', { stroke: '#f59e0b', strokeWidth: '1.8', fill: 'none' }, [
          h('path', { d: 'M 22 10 L 28 10 L 29 50 L 21 50 Z', fill: '#f59e0b', fillOpacity: '0.15' }),
          h('line', { x1: '25', y1: '8', x2: '25', y2: '50', stroke: '#f59e0b', strokeWidth: '2.5' }),
          h('line', { x1: '18', y1: '16', x2: '32', y2: '19', strokeWidth: '2', strokeLinecap: 'round' }),
          h('line', { x1: '18', y1: '23', x2: '32', y2: '26', strokeWidth: '2', strokeLinecap: 'round' }),
          h('line', { x1: '18', y1: '30', x2: '32', y2: '33', strokeWidth: '2', strokeLinecap: 'round' }),
          h('line', { x1: '18', y1: '37', x2: '32', y2: '40', strokeWidth: '2', strokeLinecap: 'round' }),
          h('line', { x1: '18', y1: '44', x2: '32', y2: '47', strokeWidth: '2', strokeLinecap: 'round' }),
          h('polygon', { points: '25,5 20,11 30,11', fill: '#f59e0b' }),
          h('rect', { x: '20', y: '48', width: '10', height: '4', rx: '1', fill: '#f59e0b' }),
        ]);
      } else {
        implantNode = h('g', { stroke: '#f59e0b', strokeWidth: '1.8', fill: 'none' }, [
          h('path', { d: 'M 21 46 L 29 46 L 28 88 L 22 88 Z', fill: '#f59e0b', fillOpacity: '0.15' }),
          h('line', { x1: '25', y1: '46', x2: '25', y2: '90', stroke: '#f59e0b', strokeWidth: '2.5' }),
          h('line', { x1: '18', y1: '52', x2: '32', y2: '49', strokeWidth: '2', strokeLinecap: 'round' }),
          h('line', { x1: '18', y1: '59', x2: '32', y2: '56', strokeWidth: '2', strokeLinecap: 'round' }),
          h('line', { x1: '18', y1: '66', x2: '32', y2: '63', strokeWidth: '2', strokeLinecap: 'round' }),
          h('line', { x1: '18', y1: '73', x2: '32', y2: '70', strokeWidth: '2', strokeLinecap: 'round' }),
          h('line', { x1: '18', y1: '80', x2: '32', y2: '77', strokeWidth: '2', strokeLinecap: 'round' }),
          h('polygon', { points: '25,95 20,89 30,89', fill: '#f59e0b' }),
          h('rect', { x: '20', y: '44', width: '10', height: '4', rx: '1', fill: '#f59e0b' }),
        ]);
      }
    }

    // Extraction Cross
    let extractionNode = null;
    if (isExtraction) {
      extractionNode = h('g', { stroke: '#f43f5e', strokeWidth: '3', strokeLinecap: 'round' }, [
        h('line', { x1: '8', y1: '12', x2: '42', y2: '88' }),
        h('line', { x1: '42', y1: '12', x2: '8', y2: '88' }),
      ]);
    }

    return h('svg', {
      viewBox: '0 0 50 100',
      class: 'w-full h-full overflow-visible text-slate-900 dark:text-slate-100',
      fill: 'none'
    }, [
      h('g', { opacity: isExtraction ? 0.35 : 1 }, [toothGroup, implantNode]),
      extractionNode
    ]);
  };
}
</script>
