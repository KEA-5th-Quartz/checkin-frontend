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
  disabled: false,
  isManager: false,
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
  if (!props.disabled) {
    isOpen.value = !isOpen.value;
  }
};

// 선택된 옵션에 대해 이벤트를 발생시키고, 콜백을 실행하며, 드롭다운을 닫음
const handleSelect = (option: BaseTicketOption) => {
  if (props.disabled) return; // disabled일 경우 클릭 무시

  emit('select', option);
  if (props.onOptionSelect) {
    props.onOptionSelect(option);
  }
  isOpen.value = false;
};

// 타입 가드(주어진 옵션이 ColorOption타입인지 확인)
const hasColorStyle = (option: BaseTicketOption | null | undefined): option is StatusTicketOption => {
  return option != null && 'bg' in option && 'text' in option;
};
</script>

<template>
  <div ref="dropdownRef" class="relative">
    <p class="text-sm mb-1.5 max-w-fit">{{ label }}</p>

    <!-- 드롭다운 -->
    <button
      @click.stop="toggleDropdown"
      :class="[
        'dropdown-bar',
        hasColor ? 'dropdown-bar-hasColor' : isEdit ? 'dropdown-bar-isEdit' : 'dropdown-bar-default',
        isManager && 'py-1 w-full justify-start',
        hasColor && hasColorStyle(selectedOption) && `${selectedOption.bg} ${selectedOption.text} max-w-fit`,
        disabled && 'border-gray-2 hover:border-gray-2 cursor-default hover:ring-0',
        $attrs.class || '' /* 부모에서 전달한 class 적용 */,
      ]"
    >
      <img
        v-if="isManager"
        :src="
          selectedOption?.profilePic ||
          'https://qaurtz-bucket.s3.ap-northeast-2.amazonaws.com/profile/565ba116-f192-4866-9886-09def9216eaf.jpeg'
        "
        class="w-7 h-7 object-fill rounded-full mr-2"
      />
      <div class="w-full flex-between">
        <span :class="['text-sm', hasColor ? 'font-semibold' : 'text-gray-1', disabled ? 'pr-0' : 'pr-4']">
          {{ selectedOption?.label }}
        </span>
        <SvgIcon v-if="!disabled" :icon="ArrowDownIcon" :class="['transition-02s', isOpen ? 'rotate-180' : '']" />
      </div>
    </button>

    <!-- 메뉴들 -->
    <div v-if="isOpen" :class="['dropdown-menu', isEdit ? 'border-gray-3' : 'border-primary-2']">
      <ul>
        <li
          v-for="option in options"
          :key="option.id"
          @click="handleSelect(option)"
          :class="['dropdown-li', selectedOption?.id === option.id ? 'bg-gray-50' : '']"
        >
          <img
            v-if="isManager"
            :src="
              option.profilePic ||
              'https://qaurtz-bucket.s3.ap-northeast-2.amazonaws.com/profile/565ba116-f192-4866-9886-09def9216eaf.jpeg'
            "
            class="w-5 h-5 object-fill rounded-full mr-2"
          />
          {{ option.label }}
        </li>
      </ul>
    </div>
  </div>
</template>
