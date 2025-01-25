<script setup lang="ts">
import { ref } from 'vue';
import CommonOverlay from '../common/CommonOverlay.vue';
import { DialogProps } from '@/types/common/dialog';

const props = withDefaults(defineProps<DialogProps>(), {
  isOneBtn: false, // 버튼 1개짜리 다이얼로그인지 (선택)
  hasInput: false, // input이 있는 다이얼로그인지 (선택)
  placeholder: '', // (선택)
  isWarn: false, // 경고(빨간색) 다이얼로그인지 (선택)
  title: '',
  content: '', // (선택)
  cancelText: '취소', // (선택)
  onCancelClick: () => undefined, // (선택)
  mainText: '',
  onMainClick: () => undefined,
});

const inputValue = ref('');

const handleMainClick = () => {
  if (props.hasInput) {
    props.onMainClick(inputValue.value);
  } else {
    props.onMainClick();
  }
};
</script>

<template>
  <CommonOverlay @click="onCancelClick">
    <section class="dialog-container dialog-section">
      <p class="font-bold">{{ title }}</p>

      <input v-if="hasInput" v-model="inputValue" :placeholder="placeholder" class="dialog-input" />

      <div class="flex w-full gap-6 mt-6">
        <button v-if="!isOneBtn" @click="onCancelClick" class="dialog-btn bg-gray-2">
          {{ cancelText }}
        </button>
        <button @click="handleMainClick" :class="['dialog-btn text-white-0', isWarn ? ' bg-red-1' : 'bg-primary-0']">
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
