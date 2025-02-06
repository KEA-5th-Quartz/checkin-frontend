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
          상위 카테고리: <span class="font-semibold">{{ parentCategory.firstCategoryName }}</span>
        </p>
        <label class="category-modal-input-label">카테고리 이름</label>
        <input
          type="text"
          v-model="categoryName"
          class="category-modal-input"
          placeholder="카테고리 이름을 입력하세요"
        />
        <!-- Alias 입력란 -->
        <label v-if="!isSecondaryCategory" class="category-modal-input-label">Alias (2~4글자 대문자)</label>
        <input
          v-if="!isSecondaryCategory"
          type="text"
          v-model="alias"
          class="category-modal-input"
          placeholder="예: INFS"
        />

        <!-- Content Guide 입력란 -->
        <label v-if="!isSecondaryCategory" class="category-modal-input-label">Content Guide</label>
        <textarea v-if="!isSecondaryCategory" v-model="contentGuide" class="category-modal-input"></textarea>
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
import { ref, defineEmits, defineProps, computed } from 'vue';

const props = defineProps<{
  isOpen: boolean;
  modalTitle: string;
  errorMessage: string;
  parentCategory?: { firstCategoryId: number; firstCategoryName: string } | null;
}>();

const emit = defineEmits(['close', 'submit']);

const isSecondaryCategory = computed(() => {
  return props.parentCategory !== null;
});

const categoryName = ref('');
const alias = ref('');
const contentGuide = ref('');
const errorMessage = ref('');

// 입력 상태 초기화
function resetState() {
  categoryName.value = '';
  alias.value = '';
  contentGuide.value = '';
}

// 모달 닫기
function close() {
  emit('close');
  resetState();
}

// 카테고리 추가 제출
function submit() {
  if (!isSecondaryCategory.value && !alias.value.match(/^[A-Z]{2,4}$/)) {
    errorMessage.value = 'Alias는 2~4자의 대문자 영문이어야 합니다.';
    return;
  }
  emit('submit', {
    name: categoryName.value,
    alias: alias.value,
    contentGuide: contentGuide.value,
    parentId: props.parentCategory?.firstCategoryId || null,
  });
}
</script>
