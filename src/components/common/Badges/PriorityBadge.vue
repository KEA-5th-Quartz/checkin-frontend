<script setup lang="ts">
import { PriorityBadgeProps } from '@/types/common/badges';

const props = withDefaults(defineProps<PriorityBadgeProps>(), {
  size: 'sm',
  class: '',
  dotClass: '',
  textClass: '',
});

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case '긴급':
      return {
        dot: 'bg-red-1',
        text: 'text-red-1',
      };
    case '높음':
      return {
        dot: 'bg-orange-1',
        text: 'text-orange-1',
      };
    case '보통':
      return {
        dot: 'bg-green-1',
        text: 'text-green-1',
      };
    case '낮음':
      return {
        dot: 'bg-green-1',
        text: 'text-green-1',
      };
    default:
      return {
        dot: '',
        text: '',
      };
  }
};

const getSizeClass = (size: string) => {
  switch (size) {
    case 'sm':
      return 'w-1.5 h-1.5 text-xs';
    case 'md':
      return 'w-2 h-2 text-sm';
    case 'lg':
      return 'w-2.5 h-2.5 text-base';
    default:
      return 'w-2 h-2 text-sm';
  }
};
</script>

<template>
  <div v-if="priority" :class="['flex-center gap-2', props.class]">
    <div :class="['rounded-full', getSizeClass(size), getPriorityColor(priority).dot, props.dotClass]" />
    <span :class="['font-medium', getPriorityColor(priority).text, props.textClass]">
      {{ priority }}
    </span>
  </div>
  <div v-else class="text-center">-</div>
</template>
