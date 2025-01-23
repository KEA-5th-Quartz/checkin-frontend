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
  <CommonOverlay @click="onCalcelClick">
    <div class="fixed flex flex-col bg-white-1 w-96 p-6 shadow-md rounded-xl">
      <p class="font-bold">{{ title }}</p>

      <input
        v-if="hasInput"
        v-model="inputValue"
        :placeholder="placeholder"
        class="placeholder:text-sm placeholder:text-gray-1 p-2 bg-white-1 focus:outline-none border-b border-gray-0 mt-4"
      />

      <div class="flex w-full gap-6 mt-6">
        <button
          v-if="!isOneBtn"
          @click="onCalcelClick"
          class="w-full rounded-lg font-bold px-12 py-3 hover:bg-opacity-80 bg-gray-2"
        >
          {{ cancelText }}
        </button>
        <button
          @click="handleMainClick"
          :class="[
            'w-full rounded-lg font-bold px-12 py-3 hover:bg-opacity-80 text-white-0',
            isWarn ? ' bg-red-1' : 'bg-primary-0',
          ]"
        >
          {{ mainText }}
        </button>
      </div>
    </div>
  </CommonOverlay>
</template>
