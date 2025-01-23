<script setup lang="ts">
import { OverlayProps } from '@/types/common/dialog';

defineProps<OverlayProps>();
</script>

<template>
  <div
    @click="onClick"
    class="overlay-container fixed inset-0 flex-center bg-black-2 bg-opacity-25 z-50 backdrop-blur-[2px] cursor-default"
  >
    <slot></slot>
  </div>
</template>

<style scoped>
.overlay-container {
  animation: dialogFadeIn 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes dialogFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
