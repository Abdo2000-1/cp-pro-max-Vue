<template>
  <div class="space-y-4 w-full min-w-0 pb-16 select-none">
    
    <!-- ------------------------------------------------------------- -->
    <!-- 1. PRIMARY EYE HOOK (اسم السيرفيس أول حاجة تيجي عليها العين) -->
    <!-- ------------------------------------------------------------- -->
    <div class="bg-gradient-to-r from-emerald-50/90 via-white to-teal-50/70 dark:from-emerald-950/40 dark:via-[#0b101d] dark:to-slate-900/60 p-5 rounded-2xl border border-emerald-200 dark:border-emerald-500/30 shadow-sm dark:shadow-xl space-y-3 transition-colors">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        <div class="space-y-2">
          <!-- Badges Bar -->
          <div class="flex items-center gap-2 flex-wrap">
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black border border-emerald-300 dark:border-emerald-500/50 text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-500/10">
              PRIMARY SERVICE HOOK
            </span>
            <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold border border-purple-300 dark:border-purple-500/50 text-purple-700 dark:text-purple-300 bg-purple-100/70 dark:bg-purple-500/10">
              {{ flowOrder.source || 'Via CP' }}
            </span>

            <!-- Status Selector -->
            <div class="flex items-center gap-1">
              <span class="text-[10px] font-bold text-slate-500 dark:text-slate-400">Status:</span>
              <select
                v-model="orderStatus"
                @change="triggerToast(`Order status updated to: ${orderStatus}`)"
                class="text-[11px] font-bold py-0.5 px-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="In Progress">In Progress</option>
                <option value="Revision Required">Revision Required</option>
                <option value="Ready for Manufacture">Ready for Manufacture</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
              </select>
            </div>

            <!-- RUSH Toggle -->
            <button
              type="button"
              @click="toggleRush"
              :class="[
                'px-2 py-0.5 rounded text-[10px] font-black border transition-all cursor-pointer flex items-center gap-1',
                isRushTask
                  ? 'border-rose-400 dark:border-rose-500 text-rose-700 dark:text-rose-400 bg-rose-100/80 dark:bg-rose-500/15 animate-pulse'
                  : 'border-slate-300 dark:border-slate-700 text-slate-500 hover:text-rose-600 bg-white/60 dark:bg-slate-900/40'
              ]"
            >
              <Zap class="w-3 h-3" :class="isRushTask ? 'text-rose-600 fill-current' : ''" />
              <span>{{ isRushTask ? '⚡ RUSH ORDER' : 'Normal Priority' }}</span>
            </button>
          </div>

          <!-- Giant Service Name Hook -->
          <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-baseline gap-2 flex-wrap">
            <span>{{ primaryService.title }}</span>
            <span class="text-emerald-600 dark:text-emerald-400 font-bold text-lg sm:text-xl">
              ({{ primaryService.format || 'coDiagnostiX™' }})
            </span>
          </h1>

          <!-- Modules Pills -->
          <div class="flex items-center gap-2 flex-wrap pt-0.5">
            <span class="text-xs font-bold text-slate-500 dark:text-slate-400">Included Modules:</span>
            <button
              v-for="(sub, sIdx) in flowOrder.services"
              :key="sub.id || sIdx"
              type="button"
              @click="triggerToast(`Module: ${sub.title} | Fee: $${sub.amount}`)"
              class="px-2.5 py-1 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 shadow-xs hover:border-emerald-400 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span class="text-emerald-600 dark:text-emerald-400 font-mono font-black text-[10px]">{{ sub.typeCode }}</span>
              <span>{{ sub.title }}</span>
              <span class="text-teal-600 dark:text-teal-400 font-mono text-[11px] font-extrabold">${{ sub.amount }}.00</span>
            </button>
          </div>
        </div>

        <!-- Right Side: Order ID & Actions -->
        <div class="flex flex-row lg:flex-col items-end justify-between lg:justify-center gap-2 shrink-0">
          <div class="text-right flex items-center lg:items-end gap-2 lg:gap-0 lg:flex-col">
            <div class="text-[11px] font-mono text-slate-500 dark:text-slate-400">Order Reference</div>
            <div class="flex items-center gap-1.5">
              <span class="text-2xl font-black font-mono text-amber-600 dark:text-amber-500">
                #{{ flowOrder.orderNum }}
              </span>
              <button
                type="button"
                @click="copyOrderId"
                class="p-1 rounded-lg text-slate-400 hover:text-amber-600 dark:hover:text-amber-400"
                title="Copy Order ID"
              >
                <Check v-if="isCopiedId" class="w-4 h-4 text-emerald-500" />
                <Copy v-else class="w-4 h-4" />
              </button>
            </div>
          </div>

          <div class="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              @click="printPrescription"
              class="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-emerald-500 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <Printer class="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              type="button"
              @click="exportSummary"
              class="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-emerald-500 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <Download class="w-3.5 h-3.5" />
              <span>Export</span>
            </button>

            <router-link
              to="/flow"
              class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-emerald-500 text-slate-800 dark:text-slate-200 text-xs font-extrabold transition-all cursor-pointer shadow-xs"
            >
              <ArrowLeft class="w-3.5 h-3.5" />
              <span>Back to Flow</span>
            </router-link>
          </div>
        </div>

      </div>
    </div>

    <!-- Feedback Toast -->
    <Transition name="fade">
      <div
        v-if="feedbackMessage"
        class="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-500/50 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-between shadow-sm"
      >
        <div class="flex items-center gap-2">
          <CheckCircle2 class="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{{ feedbackMessage }}</span>
        </div>
        <button type="button" @click="feedbackMessage = null" class="p-1 text-emerald-600">
          <X class="w-3.5 h-3.5" />
        </button>
      </div>
    </Transition>

    <!-- ------------------------------------------------------------- -->
    <!-- 2. NAVIGATION TABS                                            -->
    <!-- ------------------------------------------------------------- -->
    <div class="flex border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b101d] rounded-2xl p-1 gap-1 text-xs font-bold shadow-xs">
      <button
        type="button"
        @click="activeTab = 'prescription'"
        :class="[
          'flex items-center gap-2 py-2 px-4 rounded-xl transition-all cursor-pointer',
          activeTab === 'prescription'
            ? 'border border-emerald-400 dark:border-emerald-500/60 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/15 shadow-xs'
            : 'border border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        ]"
      >
        <FileText class="w-4 h-4" />
        <span>Official Prescription & Case Dispatch</span>
      </button>

      <button
        type="button"
        @click="activeTab = '3dviewer'"
        :class="[
          'flex items-center gap-2 py-2 px-4 rounded-xl transition-all cursor-pointer',
          activeTab === '3dviewer'
            ? 'border border-emerald-400 dark:border-emerald-500/60 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/15 shadow-xs'
            : 'border border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        ]"
      >
        <Box class="w-4 h-4" />
        <span>3D DICOM CAD & Co-Diagnostix™ Viewport</span>
      </button>

      <button
        type="button"
        @click="activeTab = 'suborders'"
        :class="[
          'flex items-center gap-2 py-2 px-4 rounded-xl transition-all cursor-pointer',
          activeTab === 'suborders'
            ? 'border border-emerald-400 dark:border-emerald-500/60 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/15 shadow-xs'
            : 'border border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        ]"
      >
        <Layers class="w-4 h-4" />
        <span>Sub-Orders Matrix ({{ flowOrder.services.length }})</span>
      </button>
    </div>

    <!-- ------------------------------------------------------------- -->
    <!-- TAB 1: EXACT IMAGE 1 PRESCRIPTION & DISPATCH WORKFLOW         -->
    <!-- ------------------------------------------------------------- -->
    <div v-if="activeTab === 'prescription'" class="space-y-4">

      <!-- A. Core Case Prescription Specification Table -->
      <div class="border border-slate-300 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-[#0b101d] shadow-sm text-xs">
        
        <!-- Header Cyan Banner Rows -->
        <div class="bg-[#bfe6f2] dark:bg-[#0d2838] border-b border-slate-300 dark:border-slate-700 divide-y divide-slate-300/80 dark:divide-slate-700/80">
          <div class="grid grid-cols-12 py-2.5 px-3.5 items-center">
            <div class="col-span-3 font-extrabold text-slate-800 dark:text-slate-200">Order ID</div>
            <div class="col-span-9 flex items-center justify-between font-mono font-black text-slate-900 dark:text-white">
              <span>{{ flowOrder.orderNum }}</span>
              <span class="text-[11px] font-sans font-bold text-teal-800 dark:text-teal-300 px-2 py-0.5 rounded bg-teal-100/60 dark:bg-teal-900/60">
                ModID: 288004 • XID: 1016
              </span>
            </div>
          </div>

          <div class="grid grid-cols-12 py-2.5 px-3.5 items-center">
            <div class="col-span-3 font-extrabold text-slate-800 dark:text-slate-200">Scanning Center</div>
            <div class="col-span-9 flex items-center justify-between">
              <span class="font-semibold text-slate-800 dark:text-slate-300">{{ scanCenter }}</span>
              <button type="button" @click="editField('Scanning Center', scanCenter, val => scanCenter = val)" class="p-1 rounded text-slate-500 hover:text-emerald-600">
                <Edit class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div class="grid grid-cols-12 py-2.5 px-3.5 items-center">
            <div class="col-span-3 font-extrabold text-slate-800 dark:text-slate-200">Doctor</div>
            <div class="col-span-9 flex items-center justify-between">
              <span class="font-bold text-slate-900 dark:text-white">{{ doctorName }}</span>
              <button type="button" @click="editField('Doctor Name', doctorName, val => doctorName = val)" class="p-1 rounded text-slate-500 hover:text-emerald-600">
                <Edit class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div class="grid grid-cols-12 py-2.5 px-3.5 items-center">
            <div class="col-span-3 font-extrabold text-slate-800 dark:text-slate-200">Patient Name</div>
            <div class="col-span-9 flex items-center justify-between">
              <span class="font-bold text-slate-900 dark:text-white">{{ patientName }}</span>
              <button type="button" @click="editField('Patient Name', patientName, val => patientName = val)" class="p-1 rounded text-slate-500 hover:text-emerald-600">
                <Edit class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        <!-- Form Fields -->
        <div class="divide-y divide-slate-200 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
          <!-- Dr Special Request -->
          <div class="grid grid-cols-12 py-2.5 px-3.5 items-center gap-2">
            <div class="col-span-3 font-extrabold text-slate-700 dark:text-slate-300">Dr. Special Request</div>
            <div class="col-span-9 flex items-center gap-2">
              <input
                v-model="drSpecialRequest"
                type="text"
                placeholder="Enter clinician specific surgical requests..."
                class="flex-1 px-3 py-1.5 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="button"
                @click="triggerToast('Dr. Special Request saved successfully!')"
                class="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-emerald-400 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 text-[11px] font-bold hover:bg-emerald-100 cursor-pointer shrink-0"
              >
                <Save class="w-3 h-3" />
                <span>Save</span>
              </button>
            </div>
          </div>

          <!-- Sc Special Request -->
          <div class="grid grid-cols-12 py-2.5 px-3.5 items-center gap-2">
            <div class="col-span-3 font-extrabold text-slate-700 dark:text-slate-300">Sc. Special Request</div>
            <div class="col-span-9 flex items-center gap-3 flex-wrap">
              <select
                v-model="scSpecialRequest"
                @change="triggerToast(`Sc. Special Request set to ${scSpecialRequest}`)"
                class="px-2.5 py-1 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold cursor-pointer"
              >
                <option value="General">General</option>
                <option value="Urgent Pre-Check">Urgent Pre-Check</option>
                <option value="High Density Mesh">High Density Mesh</option>
                <option value="Fast Track Delivery">Fast Track Delivery</option>
              </select>

              <span class="text-slate-400">|</span>

              <div class="flex items-center gap-1">
                <span class="text-[11px] text-slate-500">Value:</span>
                <input
                  v-model="scSpecialValue"
                  type="number"
                  class="w-16 px-2 py-1 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono font-bold text-center"
                />
              </div>
            </div>
          </div>

          <!-- Client Note -->
          <div class="grid grid-cols-12 py-2.5 px-3.5 items-center gap-2">
            <div class="col-span-3 font-extrabold text-slate-700 dark:text-slate-300">Client Note</div>
            <div class="col-span-9 flex items-center gap-2">
              <input
                v-model="clientNote"
                type="text"
                placeholder="Add client communication notes..."
                class="flex-1 px-3 py-1.5 text-xs border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="button"
                @click="triggerToast('Client Note saved to case file!')"
                class="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-emerald-400 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 text-[11px] font-bold hover:bg-emerald-100 cursor-pointer shrink-0"
              >
                <Save class="w-3 h-3" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      <!-- B. Internal Case Note(Old) Table -->
      <div class="border border-slate-300 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-[#0b101d] shadow-sm space-y-0 text-xs">
        <div class="p-3 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 font-extrabold text-slate-800 dark:text-slate-200 flex items-center justify-between">
          <span>Internal Case Note(Old)</span>
          <span class="text-[11px] font-mono text-slate-500 dark:text-slate-400">{{ oldNotes.length }} historical logs</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-black text-white font-extrabold text-[11px]">
                <th class="py-2.5 px-3 w-[12%]">By</th>
                <th class="py-2.5 px-3 w-[10%]">To</th>
                <th class="py-2.5 px-3 w-[22%]">Time Sent</th>
                <th class="py-2.5 px-3 w-[44%]">History</th>
                <th class="py-2.5 px-3 w-[12%] text-center">Attach</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 dark:divide-slate-800 text-xs font-medium">
              <tr v-for="n in oldNotes" :key="n.id" class="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                <td class="py-2 px-3 font-bold text-slate-900 dark:text-white">{{ n.by }}</td>
                <td class="py-2 px-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">{{ n.to }}</td>
                <td class="py-2 px-3 font-mono text-slate-600 dark:text-slate-400 text-[11px]">{{ n.timeSent }}</td>
                <td class="py-2 px-3 text-slate-800 dark:text-slate-200">{{ n.history }}</td>
                <td class="py-2 px-3 text-center">
                  <button
                    v-if="n.attach === 'View'"
                    type="button"
                    @click="previewDoc(n)"
                    class="px-2 py-0.5 rounded text-emerald-600 dark:text-emerald-400 font-extrabold hover:bg-emerald-50 cursor-pointer inline-flex items-center gap-1"
                  >
                    <Eye class="w-3 h-3" />
                    <span>View</span>
                  </button>
                  <span v-else class="text-slate-400">-</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- C. Internal Case Note & Task Dispatcher System -->
      <div class="border border-slate-300 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-[#0b101d] shadow-sm text-xs">
        <div class="p-3 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 font-extrabold text-slate-800 dark:text-slate-200 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Send class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Internal Case Note & Task Dispatcher</span>
          </div>
          <span class="text-[11px] text-slate-500">Live Team Routing</span>
        </div>

        <form @submit.prevent="handlePostNote" class="p-4 space-y-4">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            <!-- 1. Left: Textarea & Quick Templates -->
            <div class="lg:col-span-5 space-y-2">
              <div class="flex items-center justify-between">
                <label class="font-extrabold text-slate-700 dark:text-slate-300">Internal Case Note:</label>
                <span class="text-[11px] font-mono text-slate-400">{{ newInternalNote.length }} chars</span>
              </div>

              <textarea
                v-model="newInternalNote"
                rows="5"
                placeholder="Type internal case instruction, doctor phone notes, or lab coordination message..."
                class="w-full p-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/60 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none font-medium leading-relaxed"
              />

              <!-- Quick Templates -->
              <div class="space-y-1">
                <div class="text-[10px] font-bold text-slate-500 uppercase">Quick Action Templates:</div>
                <div class="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    @click="applyTemplate('Call doctor regarding screw-retained vs cement-retained')"
                    class="px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-[10px] hover:border-emerald-400"
                  >
                    📞 Call Doctor
                  </button>
                  <button
                    type="button"
                    @click="applyTemplate('DICOM artifact detected near #19 - requesting re-scan')"
                    class="px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-[10px] hover:border-emerald-400"
                  >
                    ⚠️ DICOM Artifact
                  </button>
                  <button
                    type="button"
                    @click="applyTemplate('Expedited turnaround approved by clinic manager')"
                    class="px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-[10px] hover:border-emerald-400"
                  >
                    🚀 Expedite
                  </button>
                </div>
              </div>
            </div>

            <!-- 2. Middle: Send mail to (Custom Modern Checkboxes) -->
            <div class="lg:col-span-4 border-l border-slate-200 dark:border-slate-800 pl-4 space-y-2">
              <div class="flex items-center justify-between">
                <span class="font-extrabold text-slate-700 dark:text-slate-300">
                  Send mail to ({{ mailToSelected.size }})
                </span>
                <div class="flex items-center gap-2">
                  <button type="button" @click="selectAllMail" class="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold hover:underline">All</button>
                  <span class="text-slate-300 dark:text-slate-700">•</span>
                  <button type="button" @click="clearAllMail" class="text-[10px] text-slate-500 hover:text-slate-800 dark:hover:text-slate-300">Clear</button>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-1.5 pt-1 text-[11px]">
                <button
                  v-for="dept in MAIL_DEPARTMENTS"
                  :key="dept"
                  type="button"
                  @click="toggleMailDept(dept)"
                  :class="[
                    'flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer',
                    mailToSelected.has(dept)
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-300 shadow-xs'
                      : 'bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  ]"
                >
                  <span class="truncate">{{ dept }}</span>
                  <CheckSquare v-if="mailToSelected.has(dept)" class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <Square v-else class="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </button>
              </div>
            </div>

            <!-- 3. Right: Send IH Task & Priority -->
            <div class="lg:col-span-3 border-l border-slate-200 dark:border-slate-800 pl-4 space-y-2">
              <div class="font-extrabold text-slate-700 dark:text-slate-300">Send IH task</div>
              
              <div class="grid grid-cols-1 gap-1 text-[11px] max-h-48 overflow-y-auto pr-1">
                <button
                  v-for="dept in IH_TASK_DEPARTMENTS"
                  :key="dept"
                  type="button"
                  @click="ihTaskSelected = dept"
                  :class="[
                    'flex items-center justify-between px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all cursor-pointer',
                    ihTaskSelected === dept
                      ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-500 text-teal-800 dark:text-teal-300 shadow-xs'
                      : 'bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  ]"
                >
                  <span class="truncate">{{ dept }}</span>
                  <CircleDot v-if="ihTaskSelected === dept" class="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
                  <Circle v-else class="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </button>
              </div>

              <!-- Priority Checkbox -->
              <div class="pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  @click="isRushTask = !isRushTask"
                  :class="[
                    'w-full p-2 rounded-xl border flex items-center justify-between transition-all cursor-pointer',
                    isRushTask
                      ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 animate-pulse'
                      : 'border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900/30 text-slate-600 dark:text-slate-400'
                  ]"
                >
                  <div class="flex items-center gap-1.5 font-black text-xs">
                    <Zap class="w-3.5 h-3.5 text-rose-600 fill-current" />
                    <span>RUSH task</span>
                  </div>
                  <CheckSquare v-if="isRushTask" class="w-4 h-4 text-rose-600" />
                  <Square v-else class="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>

          </div>

          <div class="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="submit"
              class="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-emerald-500/70 hover:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-extrabold text-xs transition-all cursor-pointer bg-transparent shadow-xs active:scale-95"
            >
              <Send class="w-3.5 h-3.5" />
              <span>Dispatch Note & Notify Departments</span>
            </button>
          </div>
        </form>
      </div>

      <!-- D. Special Pre Shipping Instructions -->
      <div class="border border-slate-300 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-[#0b101d] shadow-sm p-4 space-y-3 text-xs">
        <div>
          <div class="font-extrabold text-slate-700 dark:text-slate-300">Special Pre Shipping Instruction (Old) :</div>
          <div class="p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/40 mt-1 font-mono leading-relaxed">
            {{ specialPreShippingOld }}
          </div>
        </div>

        <div class="space-y-1.5">
          <div class="font-extrabold text-slate-700 dark:text-slate-300">Special Pre Shipping Instruction (New) :</div>
          <textarea
            v-model="specialPreShippingNew"
            rows="3"
            placeholder="Specify sterile packaging instructions, delivery constraints..."
            class="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/60 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none font-medium mt-1"
          />
          <div class="flex justify-end pt-1">
            <button
              type="button"
              @click="saveShippingInstruction"
              class="flex items-center gap-1.5 px-4 py-1.5 rounded-xl border border-emerald-400 text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 text-xs font-bold hover:bg-emerald-100 cursor-pointer"
            >
              <Save class="w-3.5 h-3.5" />
              <span>Save Shipping Instructions</span>
            </button>
          </div>
        </div>
      </div>

      <!-- E. Registration Type -->
      <div class="border border-slate-300 dark:border-slate-800 rounded-2xl p-4 bg-white dark:bg-[#0b101d] shadow-sm text-xs space-y-2">
        <span class="font-extrabold text-slate-700 dark:text-slate-300 block">Registration Type :</span>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            @click="registrationType = 'option1'; triggerToast('Set to Option 1: Direct Surface Matching')"
            :class="[
              'p-3 rounded-xl border text-left transition-all cursor-pointer',
              registrationType === 'option1'
                ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 shadow-xs'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 text-slate-600 dark:text-slate-400'
            ]"
          >
            <div class="flex items-center justify-between">
              <span class="font-bold text-xs">Option 1</span>
              <CircleDot v-if="registrationType === 'option1'" class="w-4 h-4 text-emerald-600" />
              <Circle v-else class="w-4 h-4 text-slate-400" />
            </div>
            <div class="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Direct Surface Matching (Crown & Soft-tissue optical scan alignment)
            </div>
          </button>

          <button
            type="button"
            @click="registrationType = 'option2'; triggerToast('Set to Option 2: Radiographic Marker Co-registration')"
            :class="[
              'p-3 rounded-xl border text-left transition-all cursor-pointer',
              registrationType === 'option2'
                ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 shadow-xs'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 text-slate-600 dark:text-slate-400'
            ]"
          >
            <div class="flex items-center justify-between">
              <span class="font-bold text-xs">Option 2</span>
              <CircleDot v-if="registrationType === 'option2'" class="w-4 h-4 text-emerald-600" />
              <Circle v-else class="w-4 h-4 text-slate-400" />
            </div>
            <div class="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Dual Scan Radiographic Marker Co-registration (Edentulous protocol)
            </div>
          </button>
        </div>
      </div>

      <!-- F. Uploading Files Section (100% Functional) -->
      <div class="border border-slate-300 dark:border-slate-800 rounded-2xl p-4 bg-white dark:bg-[#0b101d] shadow-sm text-xs space-y-4">
        <form @submit.prevent="handleUploadFile" class="space-y-3">
          <div class="flex flex-col sm:flex-row sm:items-center gap-3">
            <span class="font-extrabold text-slate-900 dark:text-white shrink-0">* Uploading Files:</span>
            
            <input type="file" ref="fileInputRef" class="hidden" @change="onFileSelected" />
            
            <div class="flex-1 flex items-center gap-2">
              <input
                v-model="selectedFileName"
                type="text"
                placeholder="Select a File or enter file name..."
                class="flex-1 px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              />
              <button
                type="button"
                @click="browseFiles"
                class="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:border-emerald-500 cursor-pointer shrink-0"
              >
                Browse Files
              </button>
            </div>
          </div>

          <!-- Progress Bar -->
          <div v-if="isUploading" class="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
            <div class="bg-emerald-500 h-full transition-all duration-150" :style="{ width: `${uploadProgress}%` }" />
          </div>

          <div class="text-center pt-2">
            <button
              type="submit"
              :disabled="isUploading"
              class="px-7 py-2.5 rounded-xl bg-[#2e7d32] hover:bg-[#1b5e20] text-white font-extrabold text-xs shadow-md cursor-pointer transition-all active:scale-95 disabled:opacity-50"
            >
              {{ isUploading ? 'Uploading...' : 'Upload File' }}
            </button>
          </div>
        </form>

        <!-- Uploaded Files Grid -->
        <div class="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <div class="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">
            <span>Linked Archive Files ({{ uploadedFilesList.length }})</span>
            <span>Click icon to download</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            <div
              v-for="f in uploadedFilesList"
              :key="f.id"
              class="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 flex items-center justify-between hover:border-emerald-400 transition-all"
            >
              <div class="min-w-0 pr-2">
                <div class="font-bold text-slate-800 dark:text-slate-200 truncate">{{ f.name }}</div>
                <div class="text-[10px] text-slate-400 font-mono mt-0.5">{{ f.type }} • {{ f.size }}</div>
              </div>
              <div class="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  @click="downloadFile(f.name)"
                  class="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50"
                  title="Download file"
                >
                  <Download class="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  @click="deleteFile(f.id, f.name)"
                  class="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                  title="Delete file"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- ------------------------------------------------------------- -->
    <!-- TAB 2: CLINICAL 3D DICOM CAD VIEWPORT                         -->
    <!-- ------------------------------------------------------------- -->
    <div v-if="activeTab === '3dviewer'" class="border border-slate-300 dark:border-slate-800 rounded-2xl p-5 bg-white dark:bg-[#0b101d] space-y-4 text-xs">
      <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <h3 class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Box class="w-4 h-4 text-emerald-500" />
            <span>Interactive 3-Plane Multi-Planar Reconstruction (DICOM MPR)</span>
          </h3>
          <p class="text-xs text-slate-400">CoDiagnostiX™ CAD Surgical Guide Verification</p>
        </div>
        <span class="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/30">
          Implant Site: Tooth #19
        </span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
        <!-- Axial -->
        <div class="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 text-white space-y-2">
          <div class="flex items-center justify-between text-[11px] font-bold text-emerald-400">
            <span>Axial Plane (Z: 42.5mm)</span>
            <span class="font-mono text-[10px]">512x512</span>
          </div>
          <div class="aspect-square bg-slate-900 rounded-lg flex items-center justify-center border border-slate-800 relative overflow-hidden">
            <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-700 via-slate-900 to-black opacity-80" />
            <div class="relative z-10 text-center font-mono text-[10px] text-emerald-400/80">
              [Mandibular Canal Cross-Section]
            </div>
          </div>
        </div>

        <!-- Coronal -->
        <div class="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 text-white space-y-2">
          <div class="flex items-center justify-between text-[11px] font-bold text-teal-400">
            <span>Coronal Plane (Y: 18.2mm)</span>
            <span class="font-mono text-[10px]">0.15mm Voxel</span>
          </div>
          <div class="aspect-square bg-slate-900 rounded-lg flex items-center justify-center border border-slate-800 relative overflow-hidden">
            <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-600 via-slate-900 to-black opacity-80" />
            <div class="relative z-10 text-center font-mono text-[10px] text-teal-400/80">
              [Straumann BLT Ø4.1mm Trajectory]
            </div>
          </div>
        </div>

        <!-- Sagittal -->
        <div class="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 text-white space-y-2">
          <div class="flex items-center justify-between text-[11px] font-bold text-sky-400">
            <span>Sagittal Plane (X: 28.0mm)</span>
            <span class="font-mono text-[10px]">Nerve Clearance: 3.2mm</span>
          </div>
          <div class="aspect-square bg-slate-900 rounded-lg flex items-center justify-center border border-slate-800 relative overflow-hidden">
            <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-700 via-slate-900 to-black opacity-80" />
            <div class="relative z-10 text-center font-mono text-[10px] text-sky-400/80">
              [Cortical Bone Height: 12.8mm]
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ------------------------------------------------------------- -->
    <!-- TAB 3: SUB-ORDERS MATRIX                                      -->
    <!-- ------------------------------------------------------------- -->
    <div v-if="activeTab === 'suborders'" class="border border-slate-300 dark:border-slate-800 rounded-2xl p-5 bg-white dark:bg-[#0b101d] space-y-4 text-xs shadow-sm">
      <div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <h3 class="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
            Case #{{ flowOrder.orderNum }} Sub-Orders Matrix
          </h3>
          <p class="text-xs text-slate-400">All services billed and tracked under this master order</p>
        </div>
        <span class="font-mono text-xs font-black text-emerald-600 dark:text-emerald-400">
          Total: ${{ flowOrder.services.reduce((a, s) => a + s.amount, 0) }}.00 USD
        </span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <div
          v-for="(sub, srvIdx) in flowOrder.services"
          :key="sub.id || srvIdx"
          class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 bg-slate-50/50 dark:bg-slate-900/40"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-1.5">
              <span class="px-2 py-0.5 rounded text-[10px] font-mono font-black border border-emerald-400 text-emerald-700 dark:text-emerald-400 bg-transparent">
                {{ sub.typeCode }}
              </span>
              <span class="font-bold text-xs text-slate-900 dark:text-white">{{ sub.title }}</span>
            </div>
            <span class="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400">${{ sub.amount }}.00</span>
          </div>

          <div class="text-[11px] text-slate-500 space-y-1">
            <div>Format: <strong class="text-slate-700 dark:text-slate-300">{{ sub.format }}</strong></div>
            <div>Jaws: <strong class="text-slate-700 dark:text-slate-300">Max: {{ sub.maxilla }} • Mand: {{ sub.mandible }}</strong></div>
            <div>Bill To: <span class="text-slate-700 dark:text-slate-300 truncate block">{{ sub.billTo }}</span></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Attachment Preview Modal -->
    <Teleport to="body">
      <div v-if="activePreviewDoc" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <div class="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
          <div class="p-4 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <FileText class="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span class="font-bold text-sm text-slate-900 dark:text-white truncate">{{ activePreviewDoc.title }}</span>
            </div>
            <button type="button" @click="activePreviewDoc = null" class="p-1 rounded-lg text-slate-400 hover:text-slate-700">
              <X class="w-4 h-4" />
            </button>
          </div>

          <div class="p-5 text-xs">
            <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
              {{ activePreviewDoc.content }}
            </div>
          </div>

          <div class="p-3 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2 text-xs">
            <button
              type="button"
              @click="downloadFile('Attachment_Report.txt'); activePreviewDoc = null"
              class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
            >
              Download Attachment
            </button>
            <button
              type="button"
              @click="activePreviewDoc = null"
              class="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  FileText, CheckCircle2, Clock, ArrowLeft, Edit, Eye, Box,
  Send, Zap, Check, Printer, Mail, Paperclip, CheckSquare, Square,
  Circle, CircleDot, Trash2, X, Copy, Save, Download, Layers
} from 'lucide-vue-next';
import { MASTER_WORKFLOW_ORDERS } from '@/data/flowMockData';
import { sound } from '@/utils/sound';

const route = useRoute();
const router = useRouter();

const paramId = (route.query.ID as string) || (route.query.id as string) || '504901';

const flowOrder = computed(() => {
  return (
    MASTER_WORKFLOW_ORDERS.find(
      o => o.orderNum === paramId || o.id === paramId || paramId.includes(o.orderNum)
    ) || MASTER_WORKFLOW_ORDERS[0]
  );
});

const primaryService = computed(() => {
  return flowOrder.value.services[0] || {
    title: 'Treatment Plan & Surgical Guide',
    format: 'coDiagnostiX',
    typeCode: 'TP',
    actionLabel: 'IN PROGRESS',
    amount: 200,
    billTo: 'California Diagnostics CC: Master, 9903'
  };
});

const activeTab = ref<'prescription' | '3dviewer' | 'suborders'>('prescription');
const orderStatus = ref('In Progress');
const isRushTask = ref(false);
const isCopiedId = ref(false);
const feedbackMessage = ref<string | null>(null);

const doctorName = ref(flowOrder.value.doctorName || 'Dr. Alex Mercer, DDS');
const patientName = ref(flowOrder.value.patientName || 'Sarah Jenkins');
const scanCenter = ref(flowOrder.value.scanCenter || 'San Francisco Imaging Hub');
const drSpecialRequest = ref('Immediate implant placement planned on site #19. Ensure 2mm safety margin from mandibular canal.');
const scSpecialRequest = ref('General');
const scSpecialValue = ref('0');
const clientNote = ref('Please send digital STL plan approval link before milling guide.');
const registrationType = ref<'option1' | 'option2'>('option1');
const specialPreShippingOld = ref('Standard courier delivery to main clinic address. Signature required on receipt.');
const specialPreShippingNew = ref('');

// Notes
const oldNotes = ref([
  {
    id: 1,
    by: 'shrouk',
    to: 'CS',
    timeSent: '2026/Sep/28 02:14',
    history: '@cs please call the dr to check for the office working hours',
    attach: 'View',
    attachContent: 'Doctor Office Hours Verification Report:\nOffice is open Mon-Thu 08:00 AM - 05:00 PM.'
  },
  {
    id: 2,
    by: 'shrouk',
    to: 'CS',
    timeSent: '2026/Sep/28 02:13',
    history: 'test add IH',
    attach: '-'
  },
  {
    id: 3,
    by: 'Marcus Vance',
    to: 'TP',
    timeSent: '2026/Sep/27 18:40',
    history: 'CBCT DICOM series aligned with optical intra-oral maxilla STL. Nerve tracing confirmed.',
    attach: 'View',
    attachContent: 'CAD Alignment Log:\nCBCT FOV: 8x8 cm\nVoxel size: 0.15 mm\nMesh Deviation: < 0.08 mm.'
  }
]);

const newInternalNote = ref('');
const mailToSelected = ref<Set<string>>(new Set(['CS', 'TP']));
const ihTaskSelected = ref('CS');

const MAIL_DEPARTMENTS = [
  'CS', 'Sales', 'TP', 'Ops', 'Finance', 'Guides',
  'Restorations', 'Production', 'Boston', 'Scanning Techs', 'CAD/CAM', 'QMS'
];

const IH_TASK_DEPARTMENTS = [
  'CS', 'Sales', 'TP', 'Ops', 'Finance', 'Guides assembly',
  'Restorations EG', 'Production', 'Boston', 'Scanning Techs', 'CAD/CAM'
];

const activePreviewDoc = ref<{ title: string; content: string } | null>(null);

// Files Upload State
const fileInputRef = ref<HTMLInputElement | null>(null);
const selectedFileName = ref('');
const isUploading = ref(false);
const uploadProgress = ref(0);

const uploadedFilesList = ref([
  { id: 'f-1', name: `${flowOrder.value.patientName.replace(/\s+/g, '_')}_CBCT_Raw.zip`, size: '142 MB', type: 'DICOM Archive' },
  { id: 'f-2', name: 'Maxilla_Optical_Scan.stl', size: '18 MB', type: 'STL Mesh' },
  { id: 'f-3', name: 'Mandible_Optical_Scan.stl', size: '16 MB', type: 'STL Mesh' }
]);

const triggerToast = (msg: string) => {
  feedbackMessage.value = msg;
  sound.playClick(600);
  setTimeout(() => (feedbackMessage.value = null), 3500);
};

const copyOrderId = () => {
  navigator.clipboard.writeText(flowOrder.value.orderNum);
  isCopiedId.value = true;
  triggerToast(`Order ID #${flowOrder.value.orderNum} copied!`);
  setTimeout(() => (isCopiedId.value = false), 2000);
};

const toggleRush = () => {
  isRushTask.value = !isRushTask.value;
  triggerToast(isRushTask.value ? 'Flagged as RUSH PRIORITY!' : 'Normal priority restored');
};

const printPrescription = () => {
  window.print();
};

const exportSummary = () => {
  const summary = `3D DIAGNOSTIX CLINICAL CASE SUMMARY\nOrder ID: #${flowOrder.value.orderNum}\nDoctor: ${doctorName.value}\nPatient: ${patientName.value}\nStatus: ${orderStatus.value}`;
  const blob = new Blob([summary], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Case_${flowOrder.value.orderNum}_Summary.txt`;
  a.click();
  URL.revokeObjectURL(url);
  triggerToast('Case summary exported successfully!');
};

const editField = (label: string, curVal: string, onSet: (val: string) => void) => {
  const next = prompt(`Edit ${label}:`, curVal);
  if (next) {
    onSet(next);
    triggerToast(`${label} updated!`);
  }
};

const applyTemplate = (t: string) => {
  newInternalNote.value = newInternalNote.value ? `${newInternalNote.value} - ${t}` : t;
};

const toggleMailDept = (d: string) => {
  if (mailToSelected.value.has(d)) mailToSelected.value.delete(d);
  else mailToSelected.value.add(d);
};

const selectAllMail = () => {
  mailToSelected.value = new Set(MAIL_DEPARTMENTS);
};

const clearAllMail = () => {
  mailToSelected.value.clear();
};

const handlePostNote = () => {
  if (!newInternalNote.value.trim()) {
    triggerToast('Please write a note before dispatching!');
    return;
  }
  const now = new Date();
  const dateStr = `${now.getFullYear()}/${now.toLocaleString('en', { month: 'short' })}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  oldNotes.value.unshift({
    id: Date.now(),
    by: 'Current CS Agent',
    to: ihTaskSelected.value,
    timeSent: dateStr,
    history: `${isRushTask.value ? '[⚡ RUSH] ' : ''}${newInternalNote.value.trim()}`,
    attach: '-'
  });

  triggerToast(`Dispatched note to ${ihTaskSelected.value}!`);
  newInternalNote.value = '';
};

const previewDoc = (n: any) => {
  activePreviewDoc.value = {
    title: `Attachment for Note #${n.id} (${n.to})`,
    content: n.attachContent || 'Standard surgical planning document attached.'
  };
};

const saveShippingInstruction = () => {
  if (!specialPreShippingNew.value.trim()) {
    triggerToast('Please enter shipping instructions!');
    return;
  }
  specialPreShippingOld.value = specialPreShippingNew.value.trim();
  specialPreShippingNew.value = '';
  triggerToast('Shipping instructions saved!');
};

const browseFiles = () => {
  fileInputRef.value?.click();
};

const onFileSelected = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (file) selectedFileName.value = file.name;
};

const handleUploadFile = () => {
  if (!selectedFileName.value.trim()) {
    triggerToast('Please select a file first!');
    return;
  }
  isUploading.value = true;
  uploadProgress.value = 25;
  const interval = setInterval(() => {
    uploadProgress.value += 35;
    if (uploadProgress.value >= 100) {
      clearInterval(interval);
      isUploading.value = false;
      uploadedFilesList.value.unshift({
        id: `f-${Date.now()}`,
        name: selectedFileName.value.trim(),
        size: '22.4 MB',
        type: 'Clinical Asset'
      });
      selectedFileName.value = '';
      triggerToast('File successfully uploaded!');
    }
  }, 150);
};

const deleteFile = (id: string, name: string) => {
  uploadedFilesList.value = uploadedFilesList.value.filter(f => f.id !== id);
  triggerToast(`File ${name} deleted.`);
};

const downloadFile = (name: string) => {
  const blob = new Blob([`3DDX Asset File: ${name}`], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
  triggerToast(`Download started for ${name}`);
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
