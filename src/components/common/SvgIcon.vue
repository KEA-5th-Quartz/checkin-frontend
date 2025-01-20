<script setup lang="ts">
import type { IconProps } from '@/types/icon';

const props = defineProps<IconProps>();
</script>

<template>
  <svg
    :width="props.icon.width"
    :height="props.icon.height"
    :viewBox="`0 0 ${props.icon.width} ${props.icon.height}`"
    xmlns="http://www.w3.org/2000/svg"
    :class="props.className"
  >
    <template v-if="Array.isArray(props.icon.path)">
      <path
        v-for="(p, index) in props.icon.path"
        :key="index"
        :d="p"
        :fill="props.icon.fill"
        v-bind="props.icon.options"
      />
    </template>
    <template v-else>
      <path :d="props.icon.path" :fill="props.icon.fill" v-bind="props.icon.options" />
    </template>
  </svg>
</template>
