<script setup lang="ts">
import type { IconPathTypes, IconProps } from '@/types/common/icon';
import { computed } from 'vue';

// IconProps를 확장하여 iconOptions 추가
const props = defineProps<
  IconProps & {
    iconOptions?: Partial<IconPathTypes>; // 추가 옵션을 위한 prop
  }
>();

// computed 속성으로 기본 아이콘과 추가 옵션을 병합, props.iconOptions이 props.icon의 속성을 덮어씀
const mergedIcon = computed(() => ({
  ...props.icon,
  ...props.iconOptions,
})); // 병합을 한 이유는 필요한 속성만 수정해서 덮어쓰기 위해
</script>

<template>
  <svg
    :width="mergedIcon.width"
    :height="mergedIcon.height"
    :viewBox="`0 0 ${mergedIcon.width} ${mergedIcon.height}`"
    xmlns="http://www.w3.org/2000/svg"
    :class="props.className"
  >
    <!-- path가 배열일 경우 -->
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
