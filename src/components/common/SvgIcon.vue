<script setup lang="ts">
import type { IconPathTypes, IconProps } from '@/types/common/icon';
import { computed } from 'vue';

const props = defineProps<
  IconProps & {
    iconOptions?: Partial<IconPathTypes>;
  }
>();

const mergedIcon = computed(() => ({
  ...props.icon,
  ...props.iconOptions,
}));
</script>

<template>
  <svg
    :width="mergedIcon.width"
    :height="mergedIcon.height"
    :viewBox="`0 0 ${mergedIcon.width} ${mergedIcon.height}`"
    xmlns="http://www.w3.org/2000/svg"
    :class="props.className"
  >
    <template v-if="Array.isArray(mergedIcon.path)">
      <path
        v-for="(p, index) in mergedIcon.path"
        :key="index"
        :d="p"
        :fill="mergedIcon.fill"
        v-bind="mergedIcon.options"
      />
    </template>
    <template v-else>
      <path :d="mergedIcon.path" :fill="mergedIcon.fill" v-bind="mergedIcon.options" />
    </template>
  </svg>
</template>
