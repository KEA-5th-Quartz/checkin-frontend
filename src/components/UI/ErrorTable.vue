<script setup lang="ts">
import { ErrorTableProps } from '@/types/common/error';

withDefaults(defineProps<ErrorTableProps>(), {
  message: '데이터를 불러오는 중 오류가 발생했습니다',
  error: undefined,
});

const getErrorMessage = (err: unknown) => {
  if (err && typeof err === 'object' && 'message' in err) {
    return (err as { message: string }).message;
  }
  return '알 수 없는 오류가 발생했습니다';
};
</script>

<template>
  <div class="flex-center flex-col h-[calc(100vh-340px)] gap-4">
    <div class="text-red-1 text-xl font-medium">{{ message }}</div>
    <p class="text-gray-600">
      {{ getErrorMessage(error) }}
    </p>
  </div>
</template>
