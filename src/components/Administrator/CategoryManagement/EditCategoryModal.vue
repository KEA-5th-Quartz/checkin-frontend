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
        <!-- Alias 입력란 -->
        <label v-if="isFirstCategory" class="category-modal-input-label">Alias (2~4글자 대문자)</label>
        <input
          v-if="isFirstCategory"
          type="text"
          v-model="updatedAlias"
          class="category-modal-input"
          placeholder="예: INFS"
        />

        <!-- Content Guide 입력란 -->
        <label v-if="isFirstCategory" class="category-modal-input-label">Content Guide</label>
        <textarea v-if="isFirstCategory" v-model="updatedContentGuide" class="category-modal-input"></textarea>
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
import { ref, defineProps, defineEmits, watch, computed } from 'vue';
import { FirstCategory, SecondCategory } from '@/types/category';

const props = defineProps({
  isOpen: Boolean,
  category: {
    type: Object as () => FirstCategory | SecondCategory | null,
    required: true,
  },
  errorMessage: String,
});

const isFirstCategory = computed(() => {
  return props.category && 'firstCategoryId' in props.category;
});

// Emits 정의
const emit = defineEmits(['close', 'submit']);

const updatedName = ref('');
const updatedAlias = ref('');
const updatedContentGuide = ref('');

// 모달이 열릴 때마다 updatedName을 업데이트
watch(
  () => props.category,
  (newCategory) => {
    if (!newCategory) return;

    if ('firstCategoryId' in newCategory) {
      // newCategory가 FirstCategory인 경우
      updatedName.value = newCategory.firstCategoryName;
      updatedAlias.value = newCategory.alias || '';
      updatedContentGuide.value = newCategory.contentGuide || '';
    } else {
      // newCategory가 SecondCategory인 경우
      updatedName.value = newCategory.name;
      updatedAlias.value = '';
      updatedContentGuide.value = '';
    }
  },
  { immediate: true },
);

// 모달 닫기
function closeModal() {
  emit('close');
}

// 수정된 이름 제출
function submitEdit() {
  if (!props.category) return;

  if ('firstCategoryId' in props.category) {
    emit('submit', {
      firstCategoryId: props.category.firstCategoryId,
      name: updatedName.value,
      alias: updatedAlias.value,
      contentGuide: updatedContentGuide.value,
    });
  } else {
    emit('submit', {
      secondCategoryId: props.category.secondCategoryId,
      name: updatedName.value,
    });
  }
}
</script>
