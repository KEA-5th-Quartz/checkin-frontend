<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import SvgIcon from './SvgIcon.vue';
import { ArrowDownIcon } from '@/assets/icons/path';
import { BaseTicketOption, StatusTicketOption, DropdownProps } from '@/types/tickets';
import { onClickOutside } from '@vueuse/core';

// withDefaults를 사용하여 props의 기본값 설정
const props = withDefaults(defineProps<DropdownProps>(), {
  hasColor: false,
  onOptionSelect: undefined, // 옵션 선택 시 실행할 콜백 함수
  options: () => [], // 드롭다운 옵션 배열
  selectedOption: () => ({ id: 0, value: '', label: '' }),
  isEdit: false,
});

// 'select' 이벤트를 발생시킬 때 BaseTicketOption 타입의 값을 전달
const emit = defineEmits<{
  (e: 'select', value: BaseTicketOption): void;
}>();

const dropdownRef = ref<HTMLElement | null>(null);
const isOpen = ref(false);
let stopClickOutside: (() => void) | undefined;

onMounted(() => {
  if (dropdownRef.value) {
    stopClickOutside = onClickOutside(dropdownRef, () => {
      isOpen.value = false;
    });
  }
});
onUnmounted(() => {
  if (stopClickOutside) {
    stopClickOutside();
  }
});

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

// 선택된 옵션에 대해 이벤트를 발생시키고, 콜백을 실행하며, 드롭다운을 닫음
const handleSelect = (option: BaseTicketOption) => {
  emit('select', option); // select 이벤트 발생
  if (props.onOptionSelect) {
    props.onOptionSelect(option); // 콜백 함수 실행
  }
  isOpen.value = false;
};

// 타입 가드(주어진 옵션이 ColorOption타입인지 확인)
const hasColorStyle = (option: BaseTicketOption | null | undefined): option is StatusTicketOption => {
  return option != null && 'bg' in option && 'text' in option;
};
</script>

<template>
  <div ref="dropdownRef" class="relative max-w-fit">
    <p class="text-sm mb-1.5 max-w-fit">{{ label }}</p>

    <!-- 드롭다운 -->
    <button
      @click.stop="toggleDropdown"
      :class="[
        'min-w-0 inline-flex items-center justify-between px-3 rounded-lg transition-colors duration-200',
        hasColor
          ? 'inline-flex items-center gap-2 py-1'
          : isEdit
          ? 'border border-gray-2 py-2 w-full -mt-2 rounded-xl'
          : 'border border-primary-2 hover:border-primary-4 py-2',
        hasColor && hasColorStyle(selectedOption) ? `${selectedOption.bg} ${selectedOption.text} max-w-fit` : '',
      ]"
    >
      <span :class="['text-sm pr-4', hasColor ? 'font-semibold' : 'text-gray-1']">
        {{ selectedOption.label }}
      </span>
      <SvgIcon :icon="ArrowDownIcon" :class="['transition-transform duration-200', isOpen ? 'rotate-180' : '']" />
    </button>

    <!-- 메뉴들 -->
    <div
      v-if="isOpen"
      :class="[
        'absolute bg-white-0 z-10 w-full mt-1 bg-white rounded-lg shadow-md border max-h-60 overflow-y-auto hide-scrollbar',
        isEdit ? 'border-gray-3' : 'border-primary-2',
      ]"
    >
      <ul>
        <li
          v-for="option in options"
          :key="option.id"
          @click="handleSelect(option)"
          :class="[
            'px-3 py-2 cursor-pointer text-sm transition-colors duration-200 text-gray-0 hover:bg-gray-3 min-w-full whitespace-nowrap',
            selectedOption.id === option.id ? 'bg-gray-50' : '',
          ]"
        >
          {{ option.label }}
        </li>
      </ul>
    </div>
  </div>
</template>
