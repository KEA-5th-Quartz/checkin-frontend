<template>
  <div v-if="isOpen" class="category-modal-overlay" @click="closeModal">
    <div class="category-modal-container" @click.stop>
      <!-- 모달 헤더 -->
      <div class="category-modal-header">
        <h3 class="category-modal-title">카테고리 수정</h3>
        <button @click="closeModal" class="category-modal-close-button">✕</button>
      </div>
      <!-- 모달 본문 -->
      <div class="category-modal-body">
        <label class="category-modal-input-label">카테고리 이름</label>
        <input
          type="text"
          v-model="updatedName"
          class="category-modal-input"
          placeholder="카테고리 이름을 입력하세요"
        />
        <p v-if="errorMessage" class="category-modal-error-message">{{ errorMessage }}</p>
      </div>
      <!-- 모달 푸터 -->
      <div class="category-modal-footer">
        <button @click="closeModal" class="category-modal-cancel-button">취소</button>
        <button @click="submitEdit" class="category-modal-submit-button">확인</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue';
import { FirstCategory, SecondCategory } from '@/types/category';

const props = defineProps({
  isOpen: Boolean,
  category: {
    type: Object as () => FirstCategory | SecondCategory | null,
    required: true,
  },
  errorMessage: String,
});

// Emits 정의
const emit = defineEmits(['close', 'submit']);

const updatedName = ref('');

// 모달이 열릴 때마다 updatedName을 업데이트
watch(
  () => props.category,
  (newCategory) => {
    if (!newCategory) return;
    updatedName.value = 'firstCategoryId' in newCategory ? newCategory.firstCategoryName : newCategory.name;
  },
  { immediate: true },
);

// 모달 닫기
function closeModal() {
  emit('close');
}

// 수정된 이름 제출
function submitEdit() {
  if (!updatedName.value.trim()) {
    return;
  } else if (props.errorMessage) {
    return;
  }
  emit('submit', { ...props.category, name: updatedName.value });
}
</script>
