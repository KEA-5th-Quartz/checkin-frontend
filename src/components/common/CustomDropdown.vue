<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import SvgIcon from './SvgIcon.vue';
import { ArrowDownIcon } from '@/assets/icons/path';
import { BaseTicketOption, StatusTicketOption, DropdownProps } from '@/types/tickets';
import { onClickOutside } from '@vueuse/core';

const props = withDefaults(defineProps<DropdownProps>(), {
  hasColor: false,
  onOptionSelect: undefined,
  options: () => [],
  selectedOption: () => ({ id: 0, value: '', label: '' }),
  isEdit: false,
  disabled: false,
  isManager: false,
});

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

const handleSelect = (option: BaseTicketOption) => {
  if (props.disabled) return;

  emit('select', option);
  if (props.onOptionSelect) {
    props.onOptionSelect(option);
  }
  isOpen.value = false;
};

const hasColorStyle = (option: BaseTicketOption | null | undefined): option is StatusTicketOption => {
  return option != null && 'bg' in option && 'text' in option;
};
</script>

<template>
  <div ref="dropdownRef" class="relative">
    <p class="text-sm mb-1.5 max-w-fit">{{ label }}</p>

    <button
      type="button"
      @click.stop="toggleDropdown"
      :class="[
        'dropdown-bar',
        hasColor ? 'dropdown-bar-hasColor' : isEdit ? 'dropdown-bar-isEdit' : 'dropdown-bar-default',
        isManager && 'py-1 w-full justify-start',
        hasColor && hasColorStyle(selectedOption) && `${selectedOption.bg} ${selectedOption.text} max-w-fit`,
        disabled && 'border-gray-2 hover:border-gray-2 cursor-default hover:ring-0',
        $attrs.class || '',
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
