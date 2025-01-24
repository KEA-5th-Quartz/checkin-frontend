<template>
  <div v-if="isOpen" class="fixed inset-0 flex-center bg-black-0 bg-opacity-50 z-50" @click="close">
    <div class="bg-white-0 p-6 rounded-lg shadow-lg w-[90%] max-w-lg" @click.stop>
      <!-- 모달 헤더 -->
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-lg font-semibold text-black-0">{{ modalTitle }}</h3>
        <button @click="close" class="text-gray-0 hover:text-black-0 text-lg">✕</button>
      </div>

      <!-- 모달 본문 -->
      <div class="mb-4">
        <p v-if="parentCategory" class="text-sm text-gray-600 mb-2">
          상위 카테고리: <span class="font-semibold">{{ parentCategory.name }}</span>
        </p>
        <label class="block text-sm font-medium text-gray-0 mb-2">카테고리 이름</label>
        <input
          type="text"
          v-model="categoryName"
          class="w-full border border-gray-300 p-2 rounded-lg"
          placeholder="카테고리 이름을 입력하세요"
        />
        <!-- 경고 메시지 -->
        <p v-if="errorMessage" class="text-sm text-red-500 mt-1">{{ errorMessage }}</p>
      </div>
      <!-- 모달 푸터 -->
      <div class="flex justify-end mt-6">
        <button @click="close" class="px-4 py-2 mr-3 bg-gray-2 text-black-0 rounded-md hover:opacity-80">취소</button>
        <button @click="submit" class="px-4 py-2 bg-primary-0 text-white-0 rounded-md hover:opacity-80">확인</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits, defineProps } from 'vue';

const props = defineProps<{
  isOpen: boolean;
  modalTitle: string;
  parentCategory?: { id: number; name: string } | null;
}>();

const emit = defineEmits(['close', 'submit']);

const categoryName = ref('');
const errorMessage = ref(''); // 경고 메시지 상태

// 입력 상태 초기화
function resetState() {
  categoryName.value = '';
  errorMessage.value = '';
}

// 모달 닫기
function close() {
  emit('close');
  resetState();
}

// 카테고리 추가 제출
function submit() {
  if (!categoryName.value.trim()) {
    errorMessage.value = '카테고리 이름을 입력해주세요.';
    return;
  }
  emit('submit', { name: categoryName.value, parentId: props.parentCategory?.id || null });
  close();
}
</script>
