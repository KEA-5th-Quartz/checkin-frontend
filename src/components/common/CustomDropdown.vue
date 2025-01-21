<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import SvgIcon from './SvgIcon.vue';
import { ArrowDownIcon } from '@/assets/icons/path';
import { BaseTicketOption } from '@/types/tickets';

export interface ColorOption extends BaseTicketOption {
  bg: string;
  text: string;
}

interface Props {
  options: BaseTicketOption[];
  selectedOption: BaseTicketOption;
  label: string;
  hasColor?: boolean;
  onOptionSelect?: (option: BaseTicketOption) => void;
}

const props = withDefaults(defineProps<Props>(), {
  hasColor: false,
  onOptionSelect: undefined,
  options: () => [],
  selectedOption: () => ({ id: 0, value: '', label: '' }),
});

const emit = defineEmits<{
  (e: 'select', value: BaseTicketOption): void;
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

const handleSelect = (option: BaseTicketOption) => {
  emit('select', option);
  if (props.onOptionSelect) {
    props.onOptionSelect(option);
  }
  isOpen.value = false;
};

// 타입 가드
const hasColorStyle = (option: BaseTicketOption | null | undefined): option is ColorOption => {
  return option != null && 'bg' in option && 'text' in option;
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
      :class="[
        'w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors duration-200',
        hasColor ? 'inline-flex items-center gap-2' : 'border border-gray-200 hover:border-gray-300',
        hasColor && hasColorStyle(selectedOption) ? `${selectedOption.bg} ${selectedOption.text} max-w-fit` : '',
      ]"
    >
      <span :class="['text-sm', hasColor ? '' : 'text-gray-700']">
        {{ selectedOption.label }}
      </span>
      <SvgIcon
        :icon="ArrowDownIcon"
        :class="['w-4 h-4 transition-transform duration-200', isOpen ? 'rotate-180' : '']"
      />
    </button>

    <div
      v-if="isOpen"
      class="absolute bg-white-0 z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto"
    >
      <ul class="py-1">
        <li
          v-for="option in options"
          :key="option.id"
          @click="handleSelect(option)"
          :class="[
            ' px-3 py-2 cursor-pointer text-sm transition-colors duration-200 text-gray-700 hover:bg-gray-100',
            selectedOption.id === option.id ? 'bg-gray-50' : '',
          ]"
        >
          {{ option.label }}
        </li>
      </ul>
    </div>
  </div>
</template>
