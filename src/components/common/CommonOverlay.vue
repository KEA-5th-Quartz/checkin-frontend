<script setup lang="ts">
import { OverlayProps } from '@/types/common/dialog';

const props = withDefaults(defineProps<OverlayProps>(), {
  onClick: () => undefined,
});
</script>

<template>
  <div
    @click="onClick"
    class="fixed inset-0 flex-center bg-black-2 bg-opacity-25 z-50 backdrop-blur-[2px] cursor-default"
  >
    <slot></slot>
  </div>
</template>
