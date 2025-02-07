<script setup lang="ts">
import { OverlayProps } from '@/types/common/dialog';

defineProps<OverlayProps>();
</script>

<template>
  <div @click="onClick" class="overlay-container dialog-overlay">
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
