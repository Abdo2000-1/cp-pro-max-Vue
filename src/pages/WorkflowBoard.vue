<template>
  <div class="space-y-5 select-none">
    <!-- 1. HEADER & VIEW SWITCHER -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <div class="flex items-center gap-2">
          <h1 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            CAD/CAM Production Workflow
          </h1>
          <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            Zero-Scroll Hub
          </span>
        </div>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Panoramic 7-bench laboratory pipeline with adaptive accordion columns and multi-view synchronization.
        </p>
      </div>

      <div class="flex items-center gap-2.5 self-stretch sm:self-auto justify-between sm:justify-end flex-wrap">
        <!-- View Mode Switcher -->
        <div class="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700/80 text-xs font-bold">
          <button
            type="button"
            @click="viewMode = 'panoramic'; sound.playClick()"
            :class="[
              'px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer',
              viewMode === 'panoramic'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            ]"
            title="All 7 stages fit on screen with accordion rails"
          >
            <Columns3 class="w-3.5 h-3.5 text-emerald-500" />
            <span>Panoramic Grid</span>
          </button>

          <button
            type="button"
            @click="viewMode = 'station'; sound.playClick()"
            :class="[
              'px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer',
              viewMode === 'station'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            ]"
            title="Focus deeply on a single workstation bench"
          >
            <Focus class="w-3.5 h-3.5 text-amber-500" />
            <span>Workstation Focus</span>
          </button>

          <button
            type="button"
            @click="viewMode = 'matrix'; sound.playClick()"
            :class="[
              'px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer',
              viewMode === 'matrix'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            ]"
            title="High density pipeline matrix with multi-stage dots"
          >
            <Layers class="w-3.5 h-3.5 text-teal-500" />
            <span>Pipeline Matrix</span>
          </button>
        </div>

        <router-link
          to="/orders/create"
          class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
        >
          <Plus class="w-3.5 h-3.5 stroke-[3]" />
          <span>New Case</span>
        </router-link>
      </div>
    </div>

    <!-- 2. CONNECTED STAGE PIPELINE RIBBON (Fits 100% width, No Scrolling) -->
    <div class="bg-white dark:bg-[#070b14] rounded-2xl p-2.5 sm:p-3 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5">
        <button
          v-for="(col, idx) in columns"
          :key="col.id"
          type="button"
          @click="handleStageClick(col.id)"
          :class="[
            'p-2 rounded-xl text-left transition-all border relative overflow-hidden group cursor-pointer flex flex-col justify-between',
            focusedStation === col.id
              ? 'bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500 ring-1 ring-emerald-500/30 shadow-xs'
              : 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
          ]"
        >
          <div class="flex items-center justify-between mb-1">
            <div class="flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full" :class="col.dotColor" />
              <span class="text-[10px] font-mono text-slate-400 font-bold">#{{ idx + 1 }}</span>
            </div>
            <span
              :class="[
                'text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full',
                focusedStation === col.id
                  ? 'bg-emerald-500 text-slate-950 font-black'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              ]"
            >
              {{ getOrdersByStatus(col.id).length }}
            </span>
          </div>

          <div class="text-[11px] font-extrabold text-slate-900 dark:text-white truncate">
            {{ col.label }}
          </div>

          <!-- Urgent dot if contains high priority -->
          <div
            v-if="hasUrgentInStage(col.id)"
            class="text-[9px] font-semibold text-rose-500 flex items-center gap-1 mt-0.5"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
            <span>Urgent Case</span>
          </div>
          <div v-else class="text-[9px] text-slate-400 mt-0.5 truncate">
            {{ col.role }}
          </div>
        </button>
      </div>

      <!-- Quick Search & Priority Filters -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
        <div class="relative flex-1 max-w-sm">
          <Search class="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            v-model="searchTerm"
            placeholder="Filter cases by patient, doctor, order #..."
            class="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div class="flex items-center gap-1.5 text-xs">
          <span class="text-[11px] font-semibold text-slate-400 mr-1">Priority:</span>
          <button
            v-for="p in ['All', 'Urgent', 'High', 'Normal', 'Low'] as const"
            :key="p"
            type="button"
            @click="priorityFilter = p; sound.playClick()"
            :class="[
              'px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer',
              priorityFilter === p
                ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            ]"
          >
            {{ p }}
          </button>
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- VIEW MODE 1: PANORAMIC ACCORDION GRID (All 7 stages fit, Zero Scrollbar) -->
    <!-- ========================================================================= -->
    <div
      v-if="viewMode === 'panoramic'"
      class="w-full flex gap-2 h-[calc(100vh-270px)] min-h-[500px] overflow-x-auto pb-2"
    >
      <div
        v-for="col in columns"
        :key="col.id"
        @dragover.prevent="dragOverColumn = col.id"
        @dragleave="dragOverColumn = null"
        @drop="handleDrop(col.id)"
        :class="[
          'flex flex-col rounded-2xl transition-all duration-300 relative select-none',
          collapsedStages[col.id]
            ? 'w-10 shrink-0 bg-slate-100 dark:bg-[#070b14]/70 border border-slate-200 dark:border-slate-800 items-center py-3'
            : 'flex-1 min-w-[240px] md:min-w-0 bg-slate-50/80 dark:bg-[#070b14]/90 border border-slate-200/80 dark:border-slate-800 p-2.5',
          dragOverColumn === col.id
            ? 'bg-emerald-500/10 border-2 border-dashed border-emerald-500 ring-2 ring-emerald-500/20'
            : ''
        ]"
      >
        <!-- Collapsed Rail View -->
        <template v-if="collapsedStages[col.id]">
          <button
            type="button"
            @click="toggleCollapse(col.id)"
            class="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-emerald-500 mb-4 transition-colors"
            :title="`Expand ${col.label}`"
          >
            <ChevronRight class="w-4 h-4" />
          </button>
          
          <div class="flex-1 flex flex-col items-center justify-between py-2">
            <span class="w-2.5 h-2.5 rounded-full mb-3" :class="col.dotColor" />
            <span class="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 mb-4">
              {{ getFilteredOrders(col.id).length }}
            </span>
            <div class="[writing-mode:vertical-lr] rotate-180 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
              {{ col.label }}
            </div>
          </div>
        </template>

        <!-- Expanded Column View -->
        <template v-else>
          <!-- Column Header -->
          <div class="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/60 dark:border-slate-800/80">
            <div class="flex items-center gap-1.5 min-w-0">
              <span class="w-2 h-2 rounded-full shrink-0" :class="col.dotColor" />
              <h3 class="font-extrabold text-[11px] uppercase tracking-wider text-slate-800 dark:text-slate-200 truncate">
                {{ col.label }}
              </h3>
            </div>

            <div class="flex items-center gap-1 shrink-0">
              <span class="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-2xs">
                {{ getFilteredOrders(col.id).length }}
              </span>
              <button
                type="button"
                @click="toggleCollapse(col.id)"
                class="p-0.5 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                title="Collapse this bench rail"
              >
                <ChevronLeft class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <!-- Cards Scroll Area (Vertical only, perfectly constrained) -->
          <div class="flex-1 overflow-y-auto space-y-2 pr-0.5">
            <TransitionGroup name="kanban-card">
              <div
                v-for="order in getFilteredOrders(col.id)"
                :key="order.id"
                draggable="true"
                @dragstart="handleDragStart(order)"
                @dragend="draggedOrder = null; dragOverColumn = null"
                @click="router.push(`/orders/${order.id}`)"
                :class="[
                  'p-2.5 rounded-xl bg-white dark:bg-slate-900 border shadow-2xs transition-all cursor-grab active:cursor-grabbing group select-none text-xs',
                  draggedOrder?.id === order.id
                    ? 'opacity-40 border-dashed border-emerald-500 scale-95'
                    : 'border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/50 hover:shadow-md hover:shadow-emerald-500/10 hover:-translate-y-0.5'
                ]"
              >
                <!-- Order # and Priority -->
                <div class="flex items-center justify-between mb-1 gap-1">
                  <span class="font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400 truncate">
                    #{{ order.orderNumber }}
                  </span>
                  <span
                    :class="[
                      'px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase shrink-0',
                      order.priority === 'Urgent'
                        ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                        : order.priority === 'High'
                          ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    ]"
                  >
                    {{ order.priority }}
                  </span>
                </div>

                <!-- Patient Name -->
                <div class="font-bold text-xs text-slate-900 dark:text-white truncate mb-0.5">
                  {{ order.patientName }}
                </div>

                <!-- Restoration & Shade -->
                <div class="text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-between gap-1 mb-2">
                  <span class="truncate">{{ order.restoration }} ({{ order.units }}u)</span>
                  <span class="font-mono font-bold text-slate-700 dark:text-slate-300 shrink-0">{{ order.shade }}</span>
                </div>

                <!-- Stage Movers & Due Date -->
                <div class="pt-1.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px]">
                  <span class="text-slate-400 font-mono text-[9px]">
                    {{ formatDate(order.dueDate) }}
                  </span>

                  <div class="flex items-center gap-0.5 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button
                      v-if="canMoveBackward(col.id)"
                      type="button"
                      @click.stop="moveOrder(order, -1)"
                      class="p-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                      title="Move previous"
                    >
                      <ChevronLeft class="w-3 h-3" />
                    </button>
                    <button
                      v-if="canMoveForward(col.id)"
                      type="button"
                      @click.stop="moveOrder(order, 1)"
                      class="p-0.5 rounded hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 transition-colors"
                      title="Advance next"
                    >
                      <ChevronRight class="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </TransitionGroup>

            <div
              v-if="getFilteredOrders(col.id).length === 0"
              class="py-10 text-center text-[10px] text-slate-400 dark:text-slate-600 border border-dashed border-slate-200 dark:border-slate-800/80 rounded-xl"
            >
              Empty Bench
            </div>
          </div>
        </template>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- VIEW MODE 2: WORKSTATION FOCUS (Deep dive on single bench with rich bento) -->
    <!-- ========================================================================= -->
    <div v-else-if="viewMode === 'station'" class="space-y-4">
      <div class="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md" :class="getCurrentColConfig(focusedStation).dotColor">
            <Activity class="w-5 h-5" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-base font-extrabold text-slate-900 dark:text-white">
                Active Bench: {{ getCurrentColConfig(focusedStation).label }}
              </h2>
              <span class="px-2 py-0.5 text-xs font-mono font-bold rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                {{ getFilteredOrders(focusedStation).length }} active cases
              </span>
            </div>
            <p class="text-xs text-slate-500">
              Responsible: {{ getCurrentColConfig(focusedStation).role }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button
            v-if="canMoveBackward(focusedStation)"
            type="button"
            @click="jumpStation(-1)"
            class="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
          >
            <ChevronLeft class="w-4 h-4" /> Previous Bench
          </button>
          <button
            v-if="canMoveForward(focusedStation)"
            type="button"
            @click="jumpStation(1)"
            class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center gap-1 shadow-sm"
          >
            Next Bench <ChevronRight class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Bento Cards Grid for Station Cases -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="order in getFilteredOrders(focusedStation)"
          :key="order.id"
          class="p-5 rounded-3xl bg-white dark:bg-[#070b14] border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/5 transition-all flex flex-col justify-between"
        >
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                #{{ order.orderNumber }}
              </span>
              <PriorityBadge :priority="order.priority" />
            </div>

            <div class="font-black text-base text-slate-900 dark:text-white mb-1">
              {{ order.patientName }}
            </div>
            <div class="text-xs text-slate-500 dark:text-slate-400 mb-4">
              {{ order.doctorName }} • {{ order.clinicName }}
            </div>

            <div class="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
              <div class="flex justify-between">
                <span class="text-slate-500">Restoration:</span>
                <span class="font-bold text-slate-900 dark:text-white">{{ order.restoration }} ({{ order.units }} Unit)</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500">Target Shade:</span>
                <span class="font-mono font-bold text-slate-900 dark:text-white">{{ order.shade }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500">Target Delivery:</span>
                <span class="font-mono text-slate-700 dark:text-slate-300">{{ formatDate(order.dueDate) }}</span>
              </div>
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <router-link
              :to="`/orders/${order.id}`"
              class="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-500 flex items-center gap-1"
            >
              <span>View Specs</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </router-link>

            <div class="flex items-center gap-2">
              <button
                v-if="canMoveBackward(focusedStation)"
                type="button"
                @click="moveOrder(order, -1)"
                class="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              >
                ← Back
              </button>
              <button
                v-if="canMoveForward(focusedStation)"
                type="button"
                @click="moveOrder(order, 1)"
                class="px-3 py-1 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition-colors"
              >
                Advance →
              </button>
            </div>
          </div>
        </div>

        <div
          v-if="getFilteredOrders(focusedStation).length === 0"
          class="col-span-full py-16 text-center text-slate-400 bg-white dark:bg-[#070b14] border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl"
        >
          No active cases currently queued at {{ getCurrentColConfig(focusedStation).label }}.
        </div>
      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- VIEW MODE 3: PIPELINE MATRIX (High Density Unified List with 7-Step Nodes) -->
    <!-- ========================================================================= -->
    <div
      v-else-if="viewMode === 'matrix'"
      class="bg-white dark:bg-[#070b14] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
    >
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-slate-400 font-bold uppercase tracking-wider">
              <th class="py-3 px-4">Order #</th>
              <th class="py-3 px-4">Patient & Clinic</th>
              <th class="py-3 px-4">Restoration</th>
              <th class="py-3 px-4">Stage Progress (7 Benches)</th>
              <th class="py-3 px-4">Priority</th>
              <th class="py-3 px-4">Due Date</th>
              <th class="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
            <tr
              v-for="order in allFilteredOrders"
              :key="order.id"
              class="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
            >
              <td class="py-3 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                #{{ order.orderNumber }}
              </td>
              <td class="py-3 px-4">
                <div class="font-bold text-slate-900 dark:text-white">{{ order.patientName }}</div>
                <div class="text-[11px] text-slate-400">{{ order.clinicName }}</div>
              </td>
              <td class="py-3 px-4">
                <span class="font-semibold text-slate-900 dark:text-white">{{ order.restoration }}</span>
                <span class="text-slate-400 block text-[11px]">{{ order.units }}u • {{ order.shade }}</span>
              </td>

              <!-- 7-Step Interactive Progress Stepper -->
              <td class="py-3 px-4">
                <div class="flex items-center gap-1.5">
                  <div
                    v-for="(col, sIdx) in columns"
                    :key="col.id"
                    @click="setExactStage(order, col.id)"
                    :class="[
                      'h-5 px-2 rounded-md text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer',
                      order.status === col.id
                        ? 'bg-emerald-500 text-slate-950 shadow-xs ring-2 ring-emerald-500/30'
                        : getStageIndex(order.status) > sIdx
                          ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    ]"
                    :title="`Click to set stage to ${col.label}`"
                  >
                    <span>{{ sIdx + 1 }}</span>
                    <span v-if="order.status === col.id" class="hidden sm:inline">{{ col.id }}</span>
                  </div>
                </div>
              </td>

              <td class="py-3 px-4">
                <PriorityBadge :priority="order.priority" />
              </td>

              <td class="py-3 px-4 font-mono text-slate-500">
                {{ formatDate(order.dueDate) }}
              </td>

              <td class="py-3 px-4 text-right">
                <router-link
                  :to="`/orders/${order.id}`"
                  class="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
                >
                  <Eye class="w-3.5 h-3.5" />
                  <span>View</span>
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { 
  Plus, ChevronLeft, ChevronRight, Search, 
  Columns3, Focus, Layers, Activity, ArrowRight, Eye 
} from 'lucide-vue-next';
import { useDentalStore } from '@/stores/dental';
import type { Order, OrderStatus, Priority } from '@/types';
import PriorityBadge from '@/components/ui/PriorityBadge.vue';
import { formatDate } from '@/utils/format';
import { sound } from '@/utils/sound';

const router = useRouter();
const store = useDentalStore();

type ViewMode = 'panoramic' | 'station' | 'matrix';

const viewMode = ref<ViewMode>('panoramic');
const focusedStation = ref<OrderStatus>('Design');
const searchTerm = ref('');
const priorityFilter = ref<'All' | Priority>('All');

const draggedOrder = ref<Order | null>(null);
const dragOverColumn = ref<OrderStatus | null>(null);

// Collapsed stages map for accordion rails
const collapsedStages = ref<Record<string, boolean>>({
  'Delivered': true,
});

const columns: { id: OrderStatus; label: string; dotColor: string; role: string }[] = [
  { id: 'New', label: 'New Intake', dotColor: 'bg-slate-400', role: 'Digital Impression Verification' },
  { id: 'Review', label: 'Doctor Review', dotColor: 'bg-amber-500', role: 'Margin & Clearance Sign-off' },
  { id: 'Design', label: 'CAD Design', dotColor: 'bg-emerald-500', role: '3D Proposal Modeling' },
  { id: 'Production', label: '3D Print / Mill', dotColor: 'bg-teal-500', role: 'CAM 5-Axis Fabrication' },
  { id: 'Quality Check', label: 'QC Inspection', dotColor: 'bg-purple-500', role: 'Microscopic Fit & Glaze' },
  { id: 'Ready', label: 'Ready for Dispatch', dotColor: 'bg-blue-500', role: 'Packaging & Invoicing' },
  { id: 'Completed', label: 'Delivered', dotColor: 'bg-emerald-600', role: 'Clinic Receipt Handover' },
];

const stageOrder: OrderStatus[] = [
  'New', 'Review', 'Design', 'Production', 'Quality Check', 'Ready', 'Completed'
];

const getStageIndex = (st: OrderStatus) => stageOrder.indexOf(st);

const getCurrentColConfig = (status: OrderStatus) => {
  return columns.find(c => c.id === status) || columns[0];
};

const toggleCollapse = (status: OrderStatus) => {
  sound.playClick();
  collapsedStages.value[status] = !collapsedStages.value[status];
};

const handleStageClick = (status: OrderStatus) => {
  sound.playClick();
  focusedStation.value = status;
  if (viewMode.value === 'panoramic' && collapsedStages.value[status]) {
    collapsedStages.value[status] = false;
  }
};

const jumpStation = (delta: number) => {
  const currentIdx = stageOrder.indexOf(focusedStation.value);
  const targetIdx = currentIdx + delta;
  if (targetIdx >= 0 && targetIdx < stageOrder.length) {
    focusedStation.value = stageOrder[targetIdx];
    sound.playClick();
  }
};

const getOrdersByStatus = (status: OrderStatus) => {
  return store.orders.filter(o => o.status === status);
};

const hasUrgentInStage = (status: OrderStatus) => {
  return store.orders.some(o => o.status === status && (o.priority === 'Urgent' || o.priority === 'High'));
};

const getFilteredOrders = (status: OrderStatus) => {
  return store.orders.filter(o => {
    if (o.status !== status) return false;
    if (priorityFilter.value !== 'All' && o.priority !== priorityFilter.value) return false;
    if (searchTerm.value.trim()) {
      const q = searchTerm.value.toLowerCase();
      const match = o.orderNumber.toLowerCase().includes(q) ||
                    o.patientName.toLowerCase().includes(q) ||
                    o.doctorName.toLowerCase().includes(q) ||
                    o.clinicName.toLowerCase().includes(q) ||
                    o.restoration.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });
};

const allFilteredOrders = computed(() => {
  return store.orders.filter(o => {
    if (priorityFilter.value !== 'All' && o.priority !== priorityFilter.value) return false;
    if (searchTerm.value.trim()) {
      const q = searchTerm.value.toLowerCase();
      return o.orderNumber.toLowerCase().includes(q) ||
             o.patientName.toLowerCase().includes(q) ||
             o.doctorName.toLowerCase().includes(q) ||
             o.clinicName.toLowerCase().includes(q) ||
             o.restoration.toLowerCase().includes(q);
    }
    return true;
  });
});

const canMoveBackward = (current: OrderStatus) => {
  return stageOrder.indexOf(current) > 0;
};

const canMoveForward = (current: OrderStatus) => {
  return stageOrder.indexOf(current) < stageOrder.length - 1;
};

const moveOrder = (order: Order, delta: number) => {
  const currentIdx = stageOrder.indexOf(order.status);
  const targetIdx = currentIdx + delta;
  if (targetIdx >= 0 && targetIdx < stageOrder.length) {
    const newStatus = stageOrder[targetIdx];
    store.updateOrderStatus(order.id, newStatus);
    sound.playPop();
  }
};

const setExactStage = (order: Order, newStatus: OrderStatus) => {
  if (order.status !== newStatus) {
    store.updateOrderStatus(order.id, newStatus);
    sound.playPop();
  }
};

const handleDragStart = (order: Order) => {
  draggedOrder.value = order;
  sound.playClick();
};

const handleDrop = (targetStatus: OrderStatus) => {
  if (draggedOrder.value && draggedOrder.value.status !== targetStatus) {
    store.updateOrderStatus(draggedOrder.value.id, targetStatus);
    sound.playPop();
  }
  draggedOrder.value = null;
  dragOverColumn.value = null;
};
</script>
