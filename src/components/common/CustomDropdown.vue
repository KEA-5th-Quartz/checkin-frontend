<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

export interface BaseOption {
  id: number;
  value: string;
  label: string;
}

export interface ColorOption extends BaseOption {
  bg: string;
  text: string;
}

interface Props {
  options: BaseOption[] | ColorOption[];
  selectedOption: BaseOption | ColorOption;
  label: string;
  hasColor?: boolean;
  onOptionSelect?: (option: BaseOption | ColorOption) => void;
}

const props = withDefaults(defineProps<Props>(), {
  hasColor: false,
  onOptionSelect: undefined,
});

const emit = defineEmits<{
  (e: 'select', value: BaseOption | ColorOption): void;
}>();

const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const handleSelect = (option: BaseOption | ColorOption) => {
  emit('select', option);
  if (props.onOptionSelect) {
    props.onOptionSelect(option);
  }
  isOpen.value = false;
};

// 타입 가드
const hasColorStyle = (option: BaseOption | ColorOption): option is ColorOption => {
  return 'bg' in option && 'text' in option;
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div ref="dropdownRef" class="relative">
    <p class="text-sm mb-1.5">{{ label }}</p>

    <button
      @click.stop="toggleDropdown"
      class="w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors duration-200 border border-gray-200 hover:border-gray-300"
    >
      <span class="text-sm text-gray-700">{{ selectedOption.label }}</span>
      <ChevronDownIcon
        class="w-4 h-4 text-gray-500 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>

    <div
      v-if="isOpen"
      class="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto"
    >
      <ul class="py-1">
        <li
          v-for="option in options"
          :key="option.id"
          @click="handleSelect(option)"
          class="px-3 py-2 cursor-pointer text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
          :class="{ 'bg-gray-50': selectedOption.id === option.id }"
        >
          {{ option.label }}
        </li>
      </ul>
    </div>
  </div>
</template>
