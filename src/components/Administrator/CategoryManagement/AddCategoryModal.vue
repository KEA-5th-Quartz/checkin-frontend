<template>
  <div v-if="isOpen" class="category-modal-overlay" @click="close">
    <div class="category-modal-container" @click.stop>
      <!-- 모달 헤더 -->
      <div class="category-modal-header">
        <h3 class="category-modal-title">{{ modalTitle }}</h3>
        <button @click="close" class="category-modal-close-button">✕</button>
      </div>

      <!-- 모달 본문 -->
      <div class="category-modal-body">
        <p v-if="parentCategory" class="text-sm text-gray-0 mb-4">
          상위 카테고리: <span class="font-semibold">{{ parentCategory.name }}</span>
        </p>
        <label class="category-modal-input-label">카테고리 이름</label>
        <input
          type="text"
          v-model="categoryName"
          class="category-modal-input"
          placeholder="카테고리 이름을 입력하세요"
        />
        <!-- 경고 메시지 -->
        <p v-if="errorMessage" class="category-modal-error-message">{{ errorMessage }}</p>
      </div>
      <!-- 모달 푸터 -->
      <div class="category-modal-footer">
        <button @click="close" class="category-modal-cancel-button">취소</button>
        <button @click="submit" class="category-modal-submit-button">확인</button>
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
