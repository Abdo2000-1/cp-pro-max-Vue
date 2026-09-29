<template>
  <div class="relative w-full" ref="containerRef">
    <!-- Trigger Button -->
    <button
      type="button"
      :disabled="disabled"
      @click="toggleOpen"
      :class="[
        'w-full flex items-center justify-between px-3.5 py-2.5 text-sm rounded-xl transition-all duration-150 text-left select-none',
        'bg-slate-50 dark:bg-slate-900/80 border',
        isOpen
          ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-white dark:bg-slate-900 shadow-sm'
          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        className
      ]"
    >
      <div class="flex items-center gap-2 truncate">
        <span v-if="selectedOption?.icon" class="text-base">{{ selectedOption.icon }}</span>
        <div class="truncate">
          <span v-if="selectedOption" class="font-medium text-slate-900 dark:text-white">
            {{ selectedOption.label }}
          </span>
          <span v-else class="text-slate-400 dark:text-slate-500">
            {{ placeholder }}
          </span>
          <span v-if="selectedOption?.subtitle" class="block text-[11px] text-slate-500 dark:text-slate-400 truncate">
            {{ selectedOption.subtitle }}
          </span>
        </div>
      </div>

      <div class="flex items-center gap-1.5 shrink-0 ml-2 text-slate-400">
        <span
          v-if="selectedOption?.badge"
          :class="['text-[10px] font-bold px-1.5 py-0.5 rounded-full', selectedOption.badgeColor || 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300']"
        >
          {{ selectedOption.badge }}
        </span>
        <ChevronDown
          class="w-4 h-4 transition-transform duration-200"
          :class="isOpen ? 'rotate-180 text-emerald-500' : ''"
        />
      </div>
    </button>

    <!-- Dropdown Menu -->
    <Transition name="dropdown">
      <div
        v-if="isOpen"
        class="absolute z-50 mt-1.5 w-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl shadow-emerald-950/20 overflow-hidden max-h-72 flex flex-col"
      >
        <!-- Search filter if searchable or options > 5 -->
        <div v-if="searchable || options.length > 6" class="p-2 border-b border-slate-100 dark:border-slate-800">
          <div class="relative">
            <Search class="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              ref="searchInputRef"
              v-model="searchQuery"
              type="text"
              placeholder="Filter options..."
              class="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              @click.stop
            />
          </div>
        </div>

        <!-- Options list -->
        <div class="overflow-y-auto p-1.5 space-y-0.5">
          <div
            v-for="opt in filteredOptions"
            :key="opt.value"
            @click="selectOption(opt)"
            :class="[
              'flex items-center justify-between px-3 py-2 rounded-xl text-sm cursor-pointer transition-colors duration-100 select-none',
              modelValue === opt.value
                ? 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold'
                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80'
            ]"
          >
            <div class="flex items-center gap-2 truncate">
              <span v-if="opt.icon" class="text-base">{{ opt.icon }}</span>
              <div class="truncate">
                <span class="block truncate">{{ opt.label }}</span>
                <span v-if="opt.subtitle" class="block text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {{ opt.subtitle }}
                </span>
              </div>
            </div>

            <div class="flex items-center gap-2 shrink-0 ml-2">
              <span
                v-if="opt.badge"
                :class="['text-[10px] font-bold px-1.5 py-0.5 rounded-full', opt.badgeColor || 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400']"
              >
                {{ opt.badge }}
              </span>
              <Check
                v-if="modelValue === opt.value"
                class="w-4 h-4 text-emerald-500 stroke-[2.5]"
              />
            </div>
          </div>

          <div
            v-if="filteredOptions.length === 0"
            class="px-3 py-6 text-center text-xs text-slate-400"
          >
            No matches found
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { ChevronDown, Check, Search } from 'lucide-vue-next';
import { sound } from '@/utils/sound';

export interface SelectOption {
  value: string;
  label: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: string;
  icon?: string;
}

const props = withDefaults(defineProps<{
  modelValue?: string;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  searchable?: boolean;
  className?: string;
}>(), {
  modelValue: '',
  placeholder: 'Select an option...',
  disabled: false,
  searchable: false,
  className: '',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'change', value: string, option: SelectOption): void;
}>();

const isOpen = ref(false);
const searchQuery = ref('');
const containerRef = ref<HTMLElement | null>(null);
const searchInputRef = ref<HTMLInputElement | null>(null);

const selectedOption = computed(() => {
  return props.options.find(opt => opt.value === props.modelValue);
});

const filteredOptions = computed(() => {
  if (!searchQuery.value.trim()) return props.options;
  const q = searchQuery.value.toLowerCase();
  return props.options.filter(opt => 
    opt.label.toLowerCase().includes(q) ||
    (opt.subtitle && opt.subtitle.toLowerCase().includes(q))
  );
});

const toggleOpen = () => {
  if (props.disabled) return;
  isOpen.value = !isOpen.value;
  sound.playClick(isOpen.value ? 680 : 540);
  if (isOpen.value) {
    searchQuery.value = '';
    nextTick(() => {
      searchInputRef.value?.focus();
    });
  }
};

const selectOption = (opt: SelectOption) => {
  emit('update:modelValue', opt.value);
  emit('change', opt.value, opt);
  isOpen.value = false;
  sound.playPop();
};

const handleClickOutside = (e: MouseEvent) => {
  if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px) scale(0.98);
}
</style>
