<script setup lang="ts">
import { CommonInputProps } from '@/types/common/input';

const props = defineProps<CommonInputProps>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement;
  // 스크립트와 HTML 태그를 제거
  const sanitizedValue = target.value
    .replace(/<[^>]*>/g, '') // HTML 태그 제거
    .replace(/javascript:/gi, '') // javascript: 프로토콜 제거
    .replace(/on\w+\s*=/gi, ''); // 이벤트 핸들러 제거

  if ('modelValue' in props) {
    emit('update:modelValue', sanitizedValue);
  }
};
</script>

<template>
  <textarea :value="modelValue" :placeholder="placeholder" @input="handleInput" v-bind="$attrs" />
</template>
