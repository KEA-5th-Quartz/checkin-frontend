<script setup lang="ts">
import { StatusBadgeProps, StatusType } from '@/types/common/badges';
import { computed } from 'vue';

const props = withDefaults(defineProps<StatusBadgeProps>(), {
  size: 'sm',
  class: '',
});

const statusMap: Record<StatusType, string> = {
  OPEN: '생성',
  IN_PROGRESS: '진행중',
  CLOSED: '완료',
};

const statusText = computed(() => {
  return (props.status && statusMap[props.status as StatusType]) || '-';
});

const getStatusClass = (status: StatusType | undefined) => {
  if (!status) return '';

  switch (status) {
    case 'OPEN':
      return 'bg-gray-4 text-gray-0';
    case 'IN_PROGRESS':
      return 'bg-primary-2 text-primary-3';
    case 'CLOSED':
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
      getStatusClass(status as StatusType),
      getSizeClass(size),
      props.class,
    ]"
  >
    {{ statusText }}
  </span>
</template>
