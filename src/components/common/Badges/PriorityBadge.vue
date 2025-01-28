<script setup lang="ts">
import { PriorityBadgeProps } from '@/types/common/badges';
import { computed } from 'vue';

const props = withDefaults(defineProps<PriorityBadgeProps>(), {
  size: 'sm',
  class: '',
  dotClass: '',
  textClass: '',
});

type PriorityType = 'EMERGENCY' | 'HIGH' | 'MEDIUM' | 'LOW';

const priorityMap: Record<PriorityType, string> = {
  EMERGENCY: '긴급',
  HIGH: '높음',
  MEDIUM: '보통',
  LOW: '낮음',
};

const priorityText = computed(() => {
  return (props.priority && priorityMap[props.priority as PriorityType]) || '-';
});

const getPriorityColor = (priority: PriorityType | undefined) => {
  if (!priority)
    return {
      dot: '',
      text: '',
    };

  switch (priority) {
    case 'EMERGENCY':
      return {
        dot: 'bg-red-1',
        text: 'text-red-1',
      };
    case 'HIGH':
      return {
        dot: 'bg-orange-1',
        text: 'text-orange-1',
      };
    case 'MEDIUM':
      return {
        dot: 'bg-green-1',
        text: 'text-green-1',
      };
    case 'LOW':
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
    <div
      :class="['rounded-full', getSizeClass(size), getPriorityColor(priority as PriorityType).dot, props.dotClass]"
    />
    <span :class="['font-medium', getPriorityColor(priority as PriorityType).text, props.textClass]">
      {{ priorityText }}
    </span>
  </div>
  <div v-else class="text-center">-</div>
</template>
