<template>
  <div class="space-y-4 w-full min-w-0 pb-12 select-none">
    
    <!-- 1. Header Bar: Title, Live Stats, Sound Feedback, and New Case -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#0b101d] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
      <div>
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-md shadow-emerald-500/20">
            <Layers class="w-4 h-4" />
          </div>
          <h1 class="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Today's Flow
          </h1>
          <span class="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            Vue 3 Composition API
          </span>
        </div>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Real-time Master Clinical Orders & Multi-Service Dispatch Pipeline (3DDX Engine)
        </p>
      </div>

      <!-- Quick Metrics & Actions -->
      <div class="flex items-center gap-2 flex-wrap">
        <div class="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center gap-2">
          <Clock class="w-3.5 h-3.5 text-amber-500" />
          <span class="text-xs font-bold text-slate-700 dark:text-slate-300">
            {{ filteredOrders.length }} Cases Active
          </span>
        </div>

        <button
          type="button"
          @click="toggleAllRows"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-emerald-500 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all cursor-pointer bg-transparent"
        >
          <component :is="expandedOrders.size > 0 ? ChevronUp : ChevronDown" class="w-3.5 h-3.5 text-emerald-500" />
          <span>{{ expandedOrders.size > 0 ? 'Collapse All' : 'Expand All' }}</span>
        </button>

        <router-link
          to="/orders/create"
          class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-emerald-500/70 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs transition-all cursor-pointer bg-transparent"
        >
          <Zap class="w-3.5 h-3.5" />
          <span>New Case</span>
        </router-link>
      </div>
    </div>

    <!-- 2. Service Modules Filter Bar (13 Filters in 4 Groups) -->
    <div class="bg-white dark:bg-[#0b101d] p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-3">
      <div class="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
        <div class="flex items-center gap-2">
          <SlidersHorizontal class="w-4 h-4 text-emerald-500" />
          <span class="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
            Service Modules Filter
          </span>
          <span class="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 bg-transparent">
            {{ activeServicesCount }}/13 Active
          </span>
        </div>

        <div class="flex items-center gap-2 text-xs">
          <button
            type="button"
            @click="setAllServices(true)"
            class="text-emerald-600 dark:text-emerald-400 hover:underline font-bold text-[11px] cursor-pointer"
          >
            Select All
          </button>
          <span class="text-slate-300 dark:text-slate-700">|</span>
          <button
            type="button"
            @click="setAllServices(false)"
            class="text-slate-500 hover:underline font-bold text-[11px] cursor-pointer"
          >
            Clear All
          </button>
        </div>
      </div>

      <!-- 4 Categorized Module Columns -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div v-for="grp in SERVICE_GROUPS" :key="grp.category" class="p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800/80 space-y-1.5 bg-transparent">
          <div class="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            {{ grp.category }}
          </div>
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="item in grp.items"
              :key="item.key"
              type="button"
              @click="toggleService(item.key)"
              :class="[
                'flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer',
                servicesFilter[item.key]
                  ? 'border-emerald-500/70 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 shadow-xs'
                  : 'border-slate-300 dark:border-slate-700 text-slate-400 opacity-60 hover:opacity-100 bg-transparent'
              ]"
            >
              <span class="w-1.5 h-1.5 rounded-full" :class="servicesFilter[item.key] ? 'bg-emerald-500' : 'bg-slate-400'" />
              <span>{{ item.label }}</span>
              <span class="text-[9px] font-mono opacity-80">({{ item.code }})</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. Table Toolbar: Search, Column Visibility Dropdown, and Filter Chips -->
    <div class="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-[#0b101d] p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 text-xs">
      
      <!-- Search Input -->
      <div class="flex items-center gap-2 flex-1 max-w-md">
        <div class="relative w-full">
          <Search class="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Search Order #, Doctor, Patient, Scan Center..."
            class="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <button
            v-if="searchTerm"
            @click="searchTerm = ''"
            class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X class="w-3 h-3" />
          </button>
        </div>
      </div>

      <!-- Column Selector & Presets Dropdown -->
      <div class="relative" ref="columnPickerRef">
        <button
          type="button"
          @click="showColumnPicker = !showColumnPicker"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-emerald-500 text-slate-800 dark:text-slate-200 font-extrabold text-xs transition-all cursor-pointer bg-transparent"
        >
          <Columns class="w-3.5 h-3.5 text-emerald-500" />
          <span>Columns ({{ visibleColumns.size }}/22)</span>
          <ChevronDown class="w-3 h-3 text-slate-400" />
        </button>

        <!-- Dropdown Menu -->
        <Transition name="fade">
          <div
            v-if="showColumnPicker"
            class="absolute right-0 mt-2 w-72 p-3 rounded-2xl bg-white dark:bg-[#0b101d] border border-slate-200 dark:border-slate-800 shadow-2xl z-40 space-y-2.5 text-xs"
          >
            <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 font-extrabold text-slate-900 dark:text-white">
              <span>Display Columns</span>
              <span class="text-[10px] text-slate-400 font-mono">{{ visibleColumns.size }} active</span>
            </div>

            <!-- Quick Presets -->
            <div class="grid grid-cols-3 gap-1">
              <button
                type="button"
                @click="setColumnPreset('all')"
                class="px-2 py-1 rounded-lg text-[10px] font-bold border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-slate-700 dark:text-slate-300"
              >
                All (22)
              </button>
              <button
                type="button"
                @click="setColumnPreset('clinical')"
                class="px-2 py-1 rounded-lg text-[10px] font-bold border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-slate-700 dark:text-slate-300"
              >
                Clinical (10)
              </button>
              <button
                type="button"
                @click="setColumnPreset('compact')"
                class="px-2 py-1 rounded-lg text-[10px] font-bold border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-slate-700 dark:text-slate-300"
              >
                Minimal (6)
              </button>
            </div>

            <!-- Checkbox List -->
            <div class="max-h-56 overflow-y-auto space-y-1 pr-1">
              <label
                v-for="col in ALL_COLUMNS"
                :key="col.key"
                class="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer text-[11px]"
              >
                <div class="flex items-center gap-2">
                  <input
                    type="checkbox"
                    :checked="visibleColumns.has(col.key)"
                    @change="toggleColumn(col.key)"
                    class="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span class="font-bold text-slate-700 dark:text-slate-300">{{ col.label }}</span>
                </div>
                <span class="text-[9px] text-slate-400 uppercase font-mono">{{ col.category }}</span>
              </label>
            </div>
          </div>
        </Transition>
      </div>

    </div>

    <!-- 4. MASTER WORKFLOW TABLE: STRICT 100% WIDTH - ZERO HORIZONTAL SCROLL -->
    <div class="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0b101d] overflow-hidden shadow-xs">
      <table class="w-full table-fixed border-collapse text-left select-none text-[11px]">
        <thead>
          <tr class="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 font-extrabold uppercase text-[10px] tracking-wider">
            <th
              v-for="col in activeVisibleColumns"
              :key="col.key"
              :style="{ width: getColWidth(col) }"
              :class="['py-2.5 px-1.5 truncate', col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left']"
            >
              {{ col.label }}
            </th>
          </tr>
        </thead>

        <tbody class="divide-y divide-slate-100 dark:divide-slate-800/80">
          <template v-for="order in paginatedOrders" :key="order.id">
            <!-- Master Stationary Row -->
            <tr
              @click="toggleOrderExpand(order.id)"
              :class="[
                'group transition-colors cursor-pointer font-medium border-b border-slate-200 dark:border-slate-800',
                expandedOrders.has(order.id)
                  ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-l-4 border-l-emerald-500'
                  : 'hover:bg-slate-50/80 dark:hover:bg-slate-900/50'
              ]"
            >
              <!-- 1. # tl -->
              <td v-if="visibleColumns.has('tl')" class="py-2.5 px-1.5 text-center">
                <div class="flex items-center gap-1 justify-center">
                  <span
                    :class="[
                      'p-0.5 rounded transition-transform duration-200 cursor-pointer',
                      expandedOrders.has(order.id) ? 'text-emerald-500 rotate-90' : 'text-slate-400 group-hover:text-emerald-500'
                    ]"
                  >
                    <ChevronRight class="w-3.5 h-3.5 stroke-[3]" />
                  </span>
                  <div class="flex flex-col items-start">
                    <span class="font-mono font-black text-amber-600 dark:text-amber-500 text-[11px]">
                      {{ order.orderNum }}
                    </span>
                    <span :class="['inline-block px-1 py-0.5 rounded text-[8px] tracking-wider uppercase', getSourceBadgeStyle(order.source)]">
                      {{ order.source }}
                    </span>
                  </div>
                </div>
              </td>

              <!-- 2. Scan Center tl -->
              <td v-if="visibleColumns.has('scanCenter')" class="py-2.5 px-1.5 font-bold text-slate-800 dark:text-slate-200 truncate text-[11px]" :title="order.scanCenter">
                {{ order.scanCenter }}
              </td>

              <!-- 3. Doctor tl -->
              <td v-if="visibleColumns.has('doctor')" class="py-2.5 px-1.5 text-[11px]">
                <div class="font-bold text-slate-800 dark:text-slate-200 truncate" :title="order.doctorName">
                  {{ order.doctorName }}
                </div>
                <div class="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold truncate">
                  {{ order.doctorSub }}
                </div>
              </td>

              <!-- 4. Patient Name tl -->
              <td v-if="visibleColumns.has('patient')" class="py-2.5 px-1.5 text-[11px]">
                <div class="font-bold text-slate-900 dark:text-white truncate" :title="order.patientName">
                  {{ order.patientName }}
                </div>
                <div class="text-[9px] text-slate-400 truncate">
                  {{ order.patientSub }}
                </div>
              </td>

              <!-- 5. Is Locked -->
              <td v-if="visibleColumns.has('lock')" class="py-2.5 px-1 text-center">
                <span
                  :class="[
                    'px-1.5 py-0.5 rounded text-[8px] font-bold border bg-transparent',
                    order.isLocked ? 'border-emerald-500/50 text-emerald-600 dark:text-emerald-400' : 'border-rose-500/50 text-rose-600 dark:text-rose-400'
                  ]"
                >
                  {{ order.isLocked ? 'Lock' : 'Sales' }}
                </span>
              </td>

              <!-- 6. Notes -->
              <td v-if="visibleColumns.has('notes')" class="py-2.5 px-1 text-center text-[10px] text-slate-700 dark:text-slate-300 font-medium">
                <span class="underline cursor-pointer truncate block" :title="order.notes">
                  {{ order.notes }}
                </span>
              </td>

              <!-- 7. Archive Date -->
              <td v-if="visibleColumns.has('archive')" class="py-2.5 px-1 text-center text-[10px] font-mono text-slate-600 dark:text-slate-400">
                <div class="flex items-center justify-center gap-0.5">
                  <span>{{ order.archiveDate }}</span>
                  <ShoppingCart class="w-2.5 h-2.5 text-emerald-500 inline" />
                </div>
              </td>

              <!-- 8. More Options -->
              <td v-if="visibleColumns.has('more')" class="py-2.5 px-0.5 text-center" @click.stop="$router.push(`/order-details?ID=${order.orderNum}`)">
                <MoreHorizontal class="w-3.5 h-3.5 text-slate-400 hover:text-emerald-500 mx-auto cursor-pointer" />
              </td>

              <!-- 9. Order (Service Badges with Hover Tooltip) -->
              <td v-if="visibleColumns.has('order')" class="py-2.5 px-1.5">
                <div class="flex items-center gap-1 flex-wrap">
                  <div
                    v-for="(sub, sIdx) in order.services"
                    :key="sub.id || sIdx"
                    class="relative inline-block"
                    @mouseenter="handleServiceHover(sub, $event)"
                    @mouseleave="handleServiceLeave"
                  >
                    <span
                      :class="[
                        'px-1.5 py-0.5 rounded text-[9px] font-black tracking-tight border bg-transparent cursor-pointer transition-all hover:scale-105 inline-block',
                        getServiceTagStyle(sub.typeCode)
                      ]"
                    >
                      {{ sub.typeCode }}
                    </span>
                  </div>
                </div>
              </td>

              <!-- 10. Max. -->
              <td v-if="visibleColumns.has('max')" class="py-2.5 px-1 text-center text-[10px] font-bold text-slate-700 dark:text-slate-300">
                {{ order.services[0]?.maxilla || 'None' }}
              </td>

              <!-- 11. Mand. -->
              <td v-if="visibleColumns.has('mand')" class="py-2.5 px-1 text-center text-[10px] font-bold text-slate-700 dark:text-slate-300">
                {{ order.services[0]?.mandible || 'None' }}
              </td>

              <!-- 12. Format -->
              <td v-if="visibleColumns.has('format')" class="py-2.5 px-1 text-center font-bold text-[10px] text-slate-700 dark:text-slate-300 truncate">
                {{ order.services[0]?.format || 'None' }}
              </td>

              <!-- 13. Amount -->
              <td v-if="visibleColumns.has('amount')" class="py-2.5 px-1.5 text-right font-mono font-bold text-[11px] text-emerald-600 dark:text-emerald-400">
                ${{ order.services.reduce((acc, s) => acc + s.amount, 0) }}.00
              </td>

              <!-- 14. Voucher -->
              <td v-if="visibleColumns.has('vouch')" class="py-2.5 px-1 text-center text-[10px] text-slate-400">
                {{ order.services[0]?.vouchers || '-' }}
              </td>

              <!-- 15. Received -->
              <td v-if="visibleColumns.has('received')" class="py-2.5 px-1 font-mono text-[9.5px] text-slate-600 dark:text-slate-400 truncate">
                {{ order.services[0]?.receivedTime || '-' }}
              </td>

              <!-- 16. Sent -->
              <td v-if="visibleColumns.has('sent')" class="py-2.5 px-1 text-center font-mono text-[10px] text-slate-500">
                {{ order.services[0]?.sentTime || '-' }}
              </td>

              <!-- 17. Update -->
              <td v-if="visibleColumns.has('update')" class="py-2.5 px-1 text-center font-mono text-[10px] text-slate-500">
                {{ order.services[0]?.updateTime || '-' }}
              </td>

              <!-- 18. Charged -->
              <td v-if="visibleColumns.has('charged')" class="py-2.5 px-1 text-center font-mono text-[10px] text-slate-500">
                {{ order.services[0]?.chargedOn || '-' }}
              </td>

              <!-- 19. Action Status Badge -->
              <td v-if="visibleColumns.has('action')" class="py-2.5 px-1 text-center" @click.stop>
                <button
                  type="button"
                  @click="$router.push(`/order-details?ID=${order.orderNum}`)"
                  :class="[
                    'px-2 py-0.5 rounded-full text-[10px] font-extrabold border bg-transparent transition-all cursor-pointer',
                    order.services.some(s => s.hasActionAlert)
                      ? 'border-amber-500/70 text-amber-700 dark:text-amber-400 hover:bg-amber-500/10'
                      : 'border-emerald-500/70 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10'
                  ]"
                >
                  {{ order.services[0]?.actionLabel || 'In Progress' }}
                </button>
              </td>

              <!-- 20. CR -->
              <td v-if="visibleColumns.has('cr')" class="py-2.5 px-1 text-center font-mono text-[10px] text-rose-600 font-bold">
                {{ order.services[0]?.changeRequest || '-' }}
              </td>

              <!-- 21. CS Task -->
              <td v-if="visibleColumns.has('csTask')" class="py-2.5 px-1 text-center" @click.stop>
                <span class="text-slate-600 dark:text-slate-400 font-bold text-[10px] hover:text-emerald-500 cursor-pointer">
                  {{ order.services[0]?.csTask?.assignee || 'Assign' }}
                </span>
              </td>
            </tr>

            <!-- Accordion Expanded Row -->
            <tr v-if="expandedOrders.has(order.id)" class="bg-slate-50/50 dark:bg-slate-950/40 border-b border-emerald-500/30">
              <td :colspan="visibleColumns.size" class="p-0">
                <div class="p-3.5 space-y-3 bg-slate-50/30 dark:bg-slate-900/30 border-l-4 border-l-emerald-500">
                  <div class="flex items-center justify-between text-xs">
                    <span class="font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">
                      Case #{{ order.orderNum }} Breakdown ({{ order.services.length }} Sub-Orders)
                    </span>
                    <button
                      type="button"
                      @click="$router.push(`/order-details?ID=${order.orderNum}`)"
                      class="text-emerald-600 dark:text-emerald-400 font-bold text-xs hover:underline flex items-center gap-1"
                    >
                      <span>Open Full Prescription Workflow</span>
                      <ExternalLink class="w-3 h-3" />
                    </button>
                  </div>

                  <!-- Sub Services Table -->
                  <div class="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b101d] overflow-hidden">
                    <table class="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr class="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-500">
                          <th class="py-2 px-3">Service Code</th>
                          <th class="py-2 px-3">Module Name</th>
                          <th class="py-2 px-3">Format</th>
                          <th class="py-2 px-3">Maxilla / Mandible</th>
                          <th class="py-2 px-3">Bill To Account</th>
                          <th class="py-2 px-3 text-right">Fee</th>
                          <th class="py-2 px-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                        <tr v-for="sub in order.services" :key="sub.id" class="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                          <td class="py-2 px-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">{{ sub.typeCode }}</td>
                          <td class="py-2 px-3 font-bold text-slate-800 dark:text-slate-200">{{ sub.title }}</td>
                          <td class="py-2 px-3 font-mono text-slate-600 dark:text-slate-400">{{ sub.format }}</td>
                          <td class="py-2 px-3 text-slate-600 dark:text-slate-400">Max: {{ sub.maxilla }} | Mand: {{ sub.mandible }}</td>
                          <td class="py-2 px-3 truncate max-w-xs text-slate-600 dark:text-slate-400">{{ sub.billTo }}</td>
                          <td class="py-2 px-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">${{ sub.amount }}.00</td>
                          <td class="py-2 px-3 text-center">
                            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-transparent">
                              {{ sub.actionLabel }}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>

      <!-- Empty State -->
      <div v-if="paginatedOrders.length === 0" class="p-8 text-center text-slate-400 space-y-2">
        <Layers class="w-8 h-8 mx-auto text-slate-400 opacity-60" />
        <p class="font-bold text-sm text-slate-600 dark:text-slate-300">No cases match the selected service module filters</p>
        <button
          type="button"
          @click="setAllServices(true)"
          class="px-4 py-1.5 rounded-xl border border-emerald-500 text-emerald-600 font-bold text-xs hover:bg-emerald-500/10 cursor-pointer"
        >
          Reset All Filters
        </button>
      </div>

      <!-- Pagination Footer -->
      <div class="p-3 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <span class="text-slate-500 font-medium">
          Showing {{ paginatedOrders.length }} of {{ filteredOrders.length }} clinical orders
        </span>

        <div class="flex items-center gap-2">
          <button
            type="button"
            :disabled="currentPage <= 1"
            @click="currentPage--"
            class="px-3 py-1 rounded-lg border border-slate-300 dark:border-slate-700 disabled:opacity-40 font-bold"
          >
            Previous
          </button>
          <span class="px-2 font-mono font-bold text-emerald-600 dark:text-emerald-400">
            Page {{ currentPage }} of {{ Math.max(1, Math.ceil(filteredOrders.length / pageSize)) }}
          </span>
          <button
            type="button"
            :disabled="currentPage >= Math.ceil(filteredOrders.length / pageSize)"
            @click="currentPage++"
            class="px-3 py-1 rounded-lg border border-slate-300 dark:border-slate-700 disabled:opacity-40 font-bold"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- 5. FLOATING TOOLTIP FOR HOVERED SERVICE TAG (VUE TELEPORT PORTAL) -->
    <Teleport to="body">
      <Transition name="tooltip-fade">
        <div
          v-if="hoveredService"
          class="fixed z-50 pointer-events-none p-4 rounded-2xl bg-white/95 dark:bg-[#0c1322]/95 text-slate-800 dark:text-slate-100 border border-slate-200/90 dark:border-slate-700/80 shadow-2xl shadow-emerald-950/15 dark:shadow-black/70 backdrop-blur-md w-84 sm:w-[340px] space-y-2.5 text-xs"
          :style="tooltipStyle"
        >
          <!-- Header: Service Badge + Full Title -->
          <div class="flex items-start justify-between gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <div class="flex items-center gap-2 min-w-0">
              <span :class="['px-2 py-0.5 rounded-lg font-black text-[10px] tracking-tight border bg-transparent shrink-0', getServiceTagStyle(hoveredService.service.typeCode)]">
                {{ hoveredService.service.typeCode }}
              </span>
              <div class="min-w-0">
                <h4 class="font-extrabold text-slate-900 dark:text-white text-xs truncate leading-snug">
                  {{ hoveredService.service.title }}
                </h4>
                <span v-if="hoveredService.service.subtitle" class="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                  {{ hoveredService.service.subtitle }}
                </span>
              </div>
            </div>

            <span class="font-mono font-black text-emerald-600 dark:text-emerald-400 text-xs shrink-0">
              ${{ hoveredService.service.amount }}.00
            </span>
          </div>

          <!-- Technical & Anatomical Grid -->
          <div class="grid grid-cols-2 gap-2 text-[11px]">
            <div class="p-2 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/80 space-y-0.5">
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Format</span>
              <span class="font-bold text-slate-800 dark:text-slate-200 truncate block">
                {{ hoveredService.service.format || 'Standard CAD' }}
              </span>
            </div>

            <div class="p-2 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/80 space-y-0.5">
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Anatomical Site</span>
              <div class="flex items-center gap-1 font-bold text-[10.5px]">
                <span :class="hoveredService.service.maxilla !== 'None' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'">
                  Max: {{ hoveredService.service.maxilla }}
                </span>
                <span class="text-slate-300 dark:text-slate-600">•</span>
                <span :class="hoveredService.service.mandible !== 'None' ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400'">
                  Mand: {{ hoveredService.service.mandible }}
                </span>
              </div>
            </div>
          </div>

          <!-- Bill To -->
          <div class="text-[11px] p-2 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/80 space-y-0.5">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Bill To Account</span>
            <span class="text-slate-700 dark:text-slate-300 font-semibold truncate block">
              {{ hoveredService.service.billTo }}
            </span>
          </div>

          <!-- Status Footer -->
          <div class="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
            <span class="text-slate-500 dark:text-slate-400 font-bold">Clinical Status:</span>
            <span
              :class="[
                'px-2 py-0.5 rounded-full text-[10px] font-extrabold border bg-transparent flex items-center gap-1.5',
                hoveredService.service.hasActionAlert ? 'border-amber-500/50 text-amber-700 dark:text-amber-400' : 'border-emerald-500/50 text-emerald-700 dark:text-emerald-400'
              ]"
            >
              <span class="w-1.5 h-1.5 rounded-full" :class="hoveredService.service.hasActionAlert ? 'bg-amber-500' : 'bg-emerald-500'" />
              <span>{{ hoveredService.service.actionLabel }}</span>
            </span>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  Layers, Search, SlidersHorizontal, ChevronDown, ChevronUp, ChevronRight,
  Zap, Clock, X, Columns, ShoppingCart, MoreHorizontal, ExternalLink
} from 'lucide-vue-next';
import { MASTER_WORKFLOW_ORDERS, type MasterWorkflowOrder, type SubServiceItem } from '@/data/flowMockData';
import { sound } from '@/utils/sound';

const router = useRouter();

// 22 Master Columns Definition
type ColumnKey =
  | 'tl' | 'scanCenter' | 'doctor' | 'patient' | 'lock' | 'notes' | 'archive' | 'more'
  | 'order' | 'max' | 'mand' | 'format' | 'amount' | 'vouch'
  | 'received' | 'sent' | 'update' | 'charged' | 'action' | 'cr' | 'csTask';

interface ColumnDef {
  key: ColumnKey;
  label: string;
  baseWidth: number;
  category: string;
  align?: 'left' | 'center' | 'right';
}

const ALL_COLUMNS: ColumnDef[] = [
  { key: 'tl', label: '# tl', baseWidth: 5.5, category: 'Identity', align: 'center' },
  { key: 'scanCenter', label: 'Scan Center tl', baseWidth: 8.5, category: 'Clinical' },
  { key: 'doctor', label: 'Doctor tl', baseWidth: 7.5, category: 'Clinical' },
  { key: 'patient', label: 'Patient Name tl', baseWidth: 7.5, category: 'Clinical' },
  { key: 'lock', label: 'Lock', baseWidth: 3.5, category: 'Status', align: 'center' },
  { key: 'notes', label: 'Notes', baseWidth: 4.5, category: 'Clinical', align: 'center' },
  { key: 'archive', label: 'Archive', baseWidth: 4.5, category: 'Timeline', align: 'center' },
  { key: 'more', label: '...', baseWidth: 2.0, category: 'Action', align: 'center' },
  { key: 'order', label: 'Order (Services)', baseWidth: 9.0, category: 'Order & Services' },
  { key: 'max', label: 'Max.', baseWidth: 3.0, category: 'Anatomy', align: 'center' },
  { key: 'mand', label: 'Mand.', baseWidth: 3.0, category: 'Anatomy', align: 'center' },
  { key: 'format', label: 'Format', baseWidth: 4.0, category: 'Technical', align: 'center' },
  { key: 'amount', label: 'Amount', baseWidth: 4.5, category: 'Financial', align: 'right' },
  { key: 'vouch', label: 'Vouch.', baseWidth: 3.0, category: 'Financial', align: 'center' },
  { key: 'received', label: 'Received', baseWidth: 6.0, category: 'Timeline' },
  { key: 'sent', label: 'Sent', baseWidth: 4.5, category: 'Timeline', align: 'center' },
  { key: 'update', label: 'Update', baseWidth: 4.5, category: 'Timeline', align: 'center' },
  { key: 'charged', label: 'Charged', baseWidth: 4.5, category: 'Financial', align: 'center' },
  { key: 'action', label: 'Action', baseWidth: 7.5, category: 'Status', align: 'center' },
  { key: 'cr', label: 'CR', baseWidth: 3.5, category: 'Status', align: 'center' },
  { key: 'csTask', label: 'CS-Task', baseWidth: 5.0, category: 'Status', align: 'center' },
];

const visibleColumns = ref<Set<ColumnKey>>(new Set(ALL_COLUMNS.map(c => c.key)));
const showColumnPicker = ref(false);
const columnPickerRef = ref<HTMLElement | null>(null);

const activeVisibleColumns = computed(() => {
  return ALL_COLUMNS.filter(c => visibleColumns.value.has(c.key));
});

const totalVisibleBaseWidth = computed(() => {
  return activeVisibleColumns.value.reduce((sum, c) => sum + c.baseWidth, 0);
});

const getColWidth = (col: ColumnDef) => {
  return `${((col.baseWidth / totalVisibleBaseWidth.value) * 100).toFixed(2)}%`;
};

const toggleColumn = (key: ColumnKey) => {
  if (visibleColumns.value.has(key)) {
    if (visibleColumns.value.size > 3) visibleColumns.value.delete(key);
  } else {
    visibleColumns.value.add(key);
  }
};

const setColumnPreset = (preset: 'all' | 'clinical' | 'compact') => {
  if (preset === 'all') {
    visibleColumns.value = new Set(ALL_COLUMNS.map(c => c.key));
  } else if (preset === 'clinical') {
    visibleColumns.value = new Set(['tl', 'doctor', 'patient', 'order', 'max', 'mand', 'format', 'received', 'action', 'csTask']);
  } else {
    visibleColumns.value = new Set(['tl', 'doctor', 'patient', 'order', 'amount', 'action']);
  }
  showColumnPicker.value = false;
};

// 13 Services Filter Groups
const SERVICE_GROUPS = [
  {
    category: 'Planning & Scans',
    items: [
      { key: 'tp', label: 'Treatment Plan', code: 'TP' },
      { key: 'rep', label: 'Radiology Report', code: 'RAD' },
      { key: 'mod', label: 'Model Creation', code: 'MOD' },
      { key: 'conv', label: 'Conversion', code: 'CONV' }
    ]
  },
  {
    category: 'Surgical Guides',
    items: [
      { key: 'sg', label: 'Surgical Guide', code: 'SG' },
      { key: 'soft', label: 'Software Guide', code: 'SOFT' },
      { key: 'vr', label: 'Virtual Plan', code: 'VR' }
    ]
  },
  {
    category: 'Restorations',
    items: [
      { key: 'restTemp', label: 'Temp Restoration', code: 'TEMP' },
      { key: 'restFinal', label: 'Final Restoration', code: 'FINAL' },
      { key: 'FMP', label: 'Full Mouth Prep', code: 'FMP' }
    ]
  },
  {
    category: 'Special Lab & Ortho',
    items: [
      { key: 'GFMR', label: 'Guided Fixed Mandible', code: 'GFMR' },
      { key: 'misc', label: 'Misc Clinical', code: 'MISC' },
      { key: 'other', label: 'Custom Protocol', code: 'OTHER' }
    ]
  }
];

const servicesFilter = ref<Record<string, boolean>>({
  tp: true, rep: true, mod: true, conv: true, sg: true, soft: true,
  vr: true, restTemp: true, restFinal: true, FMP: true, GFMR: true,
  misc: true, other: true
});

const activeServicesCount = computed(() => {
  return Object.values(servicesFilter.value).filter(Boolean).length;
});

const toggleService = (key: string) => {
  servicesFilter.value[key] = !servicesFilter.value[key];
  sound.playClick(600);
};

const setAllServices = (val: boolean) => {
  Object.keys(servicesFilter.value).forEach(k => {
    servicesFilter.value[k] = val;
  });
  sound.playClick(val ? 750 : 400);
};

// Search & Pagination
const searchTerm = ref('');
const currentPage = ref(1);
const pageSize = ref(12);

// Accordion Expand State
const expandedOrders = ref<Set<string>>(new Set());

const toggleOrderExpand = (orderId: string) => {
  if (expandedOrders.value.has(orderId)) {
    expandedOrders.value.delete(orderId);
  } else {
    expandedOrders.value.add(orderId);
  }
  sound.playClick(580);
};

const toggleAllRows = () => {
  if (expandedOrders.value.size > 0) {
    expandedOrders.value.clear();
  } else {
    filteredOrders.value.forEach(o => expandedOrders.value.add(o.id));
  }
  sound.playClick(650);
};

// Filtered Orders Logic
const filteredOrders = computed(() => {
  return MASTER_WORKFLOW_ORDERS.filter(order => {
    // 1. Text Search
    if (searchTerm.value.trim()) {
      const q = searchTerm.value.toLowerCase();
      const match =
        order.orderNum.toLowerCase().includes(q) ||
        order.doctorName.toLowerCase().includes(q) ||
        order.patientName.toLowerCase().includes(q) ||
        order.scanCenter.toLowerCase().includes(q);
      if (!match) return false;
    }

    // 2. Services Filter
    const activeCodes = new Set<string>();
    if (servicesFilter.value.tp) activeCodes.add('TP');
    if (servicesFilter.value.sg) activeCodes.add('SG');
    if (servicesFilter.value.conv) activeCodes.add('CONV');
    if (servicesFilter.value.mod) activeCodes.add('MOD');
    if (servicesFilter.value.rep) activeCodes.add('RAD');
    if (servicesFilter.value.GFMR) activeCodes.add('GFMR');
    if (servicesFilter.value.FMP) activeCodes.add('FMP');
    if (servicesFilter.value.soft) activeCodes.add('SOFT');
    if (servicesFilter.value.vr) activeCodes.add('VR');
    if (servicesFilter.value.restTemp) activeCodes.add('TEMP');
    if (servicesFilter.value.restFinal) activeCodes.add('FINAL');
    if (servicesFilter.value.misc) activeCodes.add('MISC');
    if (servicesFilter.value.other) activeCodes.add('OTHER');
    activeCodes.add('IO'); // IO is always fundamental

    return order.services.some(s => activeCodes.has(s.typeCode));
  });
});

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredOrders.value.slice(start, start + pageSize.value);
});

// Floating Tooltip State
const hoveredService = ref<{ service: SubServiceItem; x: number; y: number } | null>(null);

const handleServiceHover = (service: SubServiceItem, e: MouseEvent) => {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
  hoveredService.value = {
    service,
    x: rect.left + rect.width / 2,
    y: rect.top - 6
  };
};

const handleServiceLeave = () => {
  hoveredService.value = null;
};

const tooltipStyle = computed(() => {
  if (!hoveredService.value) return {};
  const tooltipWidth = 340;
  const tooltipHeight = 185;
  const xPos = Math.min(window.innerWidth - tooltipWidth - 16, Math.max(16, hoveredService.value.x - tooltipWidth / 2));
  const isNearTop = hoveredService.value.y < tooltipHeight + 20;
  const yPos = isNearTop ? hoveredService.value.y + 28 : hoveredService.value.y - tooltipHeight - 10;
  return {
    left: `${xPos}px`,
    top: `${yPos}px`
  };
});

// Styles Helpers
const getServiceTagStyle = (code: string) => {
  switch (code) {
    case 'IO':
      return 'border-sky-500/60 text-sky-600 dark:text-sky-400 hover:border-sky-400';
    case 'TP':
      return 'border-indigo-500/60 text-indigo-600 dark:text-indigo-400 hover:border-indigo-400';
    case 'SG':
      return 'border-purple-500/60 text-purple-600 dark:text-purple-400 hover:border-purple-400';
    case 'CONV':
      return 'border-emerald-500/60 text-emerald-600 dark:text-emerald-400 hover:border-emerald-400';
    case 'GFMR':
      return 'border-rose-500/60 text-rose-600 dark:text-rose-400 hover:border-rose-400';
    case 'FMP':
      return 'border-teal-500/60 text-teal-600 dark:text-teal-400 hover:border-teal-400';
    case 'MOD':
      return 'border-amber-500/60 text-amber-600 dark:text-amber-400 hover:border-amber-400';
    default:
      return 'border-slate-500/60 text-slate-600 dark:text-slate-400';
  }
};

const getSourceBadgeStyle = (source: string) => {
  if (source.includes('Connect')) return 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30';
  if (source.includes('CaseXchange')) return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30';
  if (source.includes('Prexion') || source.includes('Planmeca')) return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30';
  return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30';
};

// Click outside column picker
const handleClickOutside = (e: MouseEvent) => {
  if (columnPickerRef.value && !columnPickerRef.value.contains(e.target as Node)) {
    showColumnPicker.value = false;
  }
};

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});
</script>

<style scoped>
.tooltip-fade-enter-active,
.tooltip-fade-leave-active {
  transition: opacity 0.16s ease, transform 0.16s cubic-bezier(0.16, 1, 0.3, 1);
}
.tooltip-fade-enter-from,
.tooltip-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
