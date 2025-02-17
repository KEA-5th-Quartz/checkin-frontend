<script setup lang="ts">
import CommonOverlay from '../common/CommonOverlay.vue';
import { DialogProps } from '@/types/common/dialog';

const props = withDefaults(defineProps<DialogProps>(), {
  isOneBtn: false,
  placeholder: '',
  isWarn: false,
  title: '',
  content: '',
  cancelText: '취소',
  onCancelClick: () => undefined,
  mainText: '',
  onMainClick: () => undefined,
});

const handleMainClick = () => {
  props.onMainClick();
};
</script>

<template>
  <CommonOverlay @click="onCancelClick">
    <section @click.stop class="dialog-container dialog-section">
      <p class="font-bold">{{ title }}</p>

      <p v-if="content" class="mt-2 text-gray-0 text-sm">{{ content }}</p>

      <div v-if="$slots.default" class="mt-4">
        <slot></slot>
      </div>

      <div class="flex w-full gap-6 mt-6">
        <button v-if="!isOneBtn" @click="onCancelClick" class="dialog-btn bg-gray-2">
          {{ cancelText }}
        </button>
        <button
          type="button"
          @click="handleMainClick"
          :class="['dialog-btn text-white-0', isWarn ? ' bg-red-1' : 'bg-primary-0']"
        >
          {{ mainText }}
        </button>
      </div>
    </section>
  </CommonOverlay>
</template>

<style scoped>
.dialog-container {
  animation: slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  transform-origin: bottom;
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
