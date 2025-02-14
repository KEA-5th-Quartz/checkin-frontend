<script setup lang="ts">
import { CommonInputProps } from '@/types/common/input';

const props = defineProps<CommonInputProps>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement;

  const sanitizedValue = target.value
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '');

  if ('modelValue' in props) {
    emit('update:modelValue', sanitizedValue);
  }
};
</script>

<template>
  <textarea :value="modelValue" :placeholder="placeholder" @input="handleInput" v-bind="$attrs" class="resize-none" />
</template>
