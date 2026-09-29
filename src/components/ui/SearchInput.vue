<template>
  <div class="relative w-full">
    <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
      <Search class="w-4 h-4" />
    </div>

    <input
      ref="inputRef"
      type="text"
      :value="modelValue"
      @input="handleInput"
      :placeholder="placeholder"
      :class="[
        'w-full pl-10 pr-10 py-2 text-sm rounded-xl transition-all duration-200',
        'bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800',
        'text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500',
        'focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900',
        className
      ]"
    />

    <!-- Clear button or keyboard shortcut -->
    <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
      <button
        v-if="modelValue"
        type="button"
        @click="clear"
        class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-md hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors"
      >
        <X class="w-3.5 h-3.5" />
      </button>
      <span
        v-else-if="showShortcut"
        class="hidden sm:inline-flex items-center text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-500 border border-slate-300 dark:border-slate-700"
      >
        ⌘K
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Search, X } from 'lucide-vue-next';
import { sound } from '@/utils/sound';

const props = withDefaults(defineProps<{
  modelValue?: string;
  placeholder?: string;
  showShortcut?: boolean;
  className?: string;
}>(), {
  modelValue: '',
  placeholder: 'Search cases, patients, clinics...',
  showShortcut: false,
  className: '',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const inputRef = ref<HTMLInputElement | null>(null);

const handleInput = (e: Event) => {
  const val = (e.target as HTMLInputElement).value;
  emit('update:modelValue', val);
};

const clear = () => {
  emit('update:modelValue', '');
  sound.playClick(450);
  inputRef.value?.focus();
};
</script>
