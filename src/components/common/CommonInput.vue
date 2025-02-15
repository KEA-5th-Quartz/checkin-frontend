<script setup lang="ts">
import { CommonInputProps } from '@/types/common/input';

const props = defineProps<CommonInputProps>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
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
  <input :value="modelValue" :placeholder="placeholder" @input="handleInput" v-bind="$attrs" />
</template>
