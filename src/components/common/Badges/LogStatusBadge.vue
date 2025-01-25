<script setup lang="ts">
import { LogStatusBadgeProps } from '@/types/common/badges';

const props = withDefaults(defineProps<LogStatusBadgeProps>(), {
  size: 'sm',
  class: '',
});

const getStatusClass = (status: string) => {
  switch (status) {
    case '로그인 성공':
      return 'bg-green-100 text-green-600';
    case '패스워드 불일치':
      return 'bg-red-100 text-red-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

const getSizeClass = (size: string) => {
  switch (size) {
    case 'sm':
      return 'px-1.5 py-0.5 text-xs';
    case 'md':
      return 'px-2 py-1 text-sm';
    case 'lg':
      return 'px-3 py-1.5 text-base';
    case 'xl':
      return 'px-4 py-2 text-lg';
    default:
      return 'px-2 py-1 text-sm';
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
