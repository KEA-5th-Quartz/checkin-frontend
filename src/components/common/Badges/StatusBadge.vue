<script setup lang="ts">
import { StatusBadgeProps } from '@/types/common/badges';

const props = withDefaults(defineProps<StatusBadgeProps>(), {
  size: 'sm',
  class: '',
});

const getStatusClass = (status: string) => {
  switch (status) {
    case '생성':
      return 'bg-gray-4 text-gray-0';
    case '진행중':
      return 'bg-primary-2 text-primary-3';
    case '완료':
      return 'bg-green-0 text-green-1';
    default:
      return '';
  }
};

const getSizeClass = (size: string) => {
  switch (size) {
    case 'sm':
      return 'px-1 py-0.5 text-xs';
    case 'md':
      return 'px-2 py-1 text-xs';
    case 'lg':
      return 'px-3 py-1.5 text-sm';
    case 'xl':
      return 'px-5 py-1 font-medium';
    default:
      return 'px-2 py-1 text-xs';
  }
};
</script>

<template>
  <span
    :class="[
      'inline-flex items-center justify-center font-medium rounded-full',
      getStatusClass(status),
      getSizeClass(size),
      props.class,
    ]"
  >
    {{ status }}
  </span>
</template>
