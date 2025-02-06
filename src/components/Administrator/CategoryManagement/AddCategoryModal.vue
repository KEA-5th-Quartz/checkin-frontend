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
          maxlength="33"
          v-model="categoryName"
          class="category-modal-input"
          placeholder="카테고리 이름을 입력하세요"
        />
        <!-- Alias 입력란 -->
        <label v-if="isFirstCategory" class="category-modal-input-label"> 카테고리 약어 (영문 2~4글자 대문자) </label>
        <input v-if="isFirstCategory" type="text" v-model="alias" class="category-modal-input" placeholder="예: INFR" />

        <label v-if="isSecondaryCategory" class="category-modal-input-label"> Alias (영문 3글자 대문자) </label>
        <input
          v-if="isSecondaryCategory"
          type="text"
          v-model="alias"
          class="category-modal-input"
          placeholder="예: CRM"
        />

        <!-- Content Guide 입력란 -->
        <label v-if="!isSecondaryCategory" class="category-modal-input-label">Content Guide</label>
        <textarea
          v-if="!isSecondaryCategory"
          v-model="contentGuide"
          class="category-modal-input"
          placeholder="예: 인프라 관련 요청 시 점검 대상, 주요 증상 등을 포함해 주세요."
        ></textarea>
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
import { ref, defineEmits, defineProps, computed, watch } from 'vue';
import { useCustomMutation } from '@/composables/useCustomMutation';
import { categoryApi } from '@/services/categoryService/categoryService';
import { isApiError } from '@/types/common/error';

const props = defineProps<{
  isOpen: boolean;
  modalTitle: string;
  parentCategory?: { firstCategoryId: number; firstCategoryName: string } | null;
}>();

const emit = defineEmits(['close', 'updateCategories', 'showDialog']);

const isFirstCategory = computed(() => !props.parentCategory);
const isSecondaryCategory = computed(() => !!props.parentCategory);

const categoryName = ref('');
const alias = ref('');
const contentGuide = ref('');
const errorMessage = ref('');

const { mutate: createCategory } = useCustomMutation(
  async (data: { name: string; alias: string; contentGuide?: string }) => {
    return isSecondaryCategory.value
      ? await categoryApi.postSecondCategory(props.parentCategory?.firstCategoryId ?? 0, {
          name: data.name,
          alias: data.alias || '',
        })
      : await categoryApi.postFirstCategory({
          name: data.name,
          alias: data.alias || '',
          contentGuide: data.contentGuide || '',
        });
  },
  {
    onSuccess: () => {
      resetState(); // 성공 시 입력값 초기화
      emit('updateCategories'); // 리스트 갱신 요청
      emit('showDialog', {
        title: '카테고리 추가 완료',
        content: '새로운 카테고리가 추가되었습니다.',
        mainText: '확인',
      }); // 다이얼로그 표시 요청
      close();
    },
    onError: (error: unknown) => {
      console.error('카테고리 수정 실패:', error);
      if (isApiError(error)) {
        if (error.code === 'CATEGORY_4090') {
          errorMessage.value = '동일한 이름의 카테고리가 존재합니다.';
        } else {
          errorMessage.value = '카테고리 수정 중 오류가 발생했습니다.';
        }
      }
    },
  },
);

watch(
  () => props.isOpen,
  (newVal) => {
    if (!newVal) resetState();
  },
);

// 입력 상태 초기화
function resetState() {
  categoryName.value = '';
  alias.value = '';
  contentGuide.value = '';
  errorMessage.value = '';
}

// 모달 닫기
function close() {
  emit('close');
}

// 카테고리 추가 제출
function submit() {
  errorMessage.value = '';

  if (isFirstCategory.value && !alias.value.match(/^[A-Z]{2,4}$/)) {
    errorMessage.value = 'Alias는 2~4자의 대문자 영문이어야 합니다.';
    return;
  }

  if (isSecondaryCategory.value && !alias.value.match(/^[A-Z]{3}$/)) {
    errorMessage.value = 'Alias는 3자의 대문자 영문이어야 합니다.';
    return;
  }

  createCategory({ name: categoryName.value, alias: alias.value, contentGuide: contentGuide.value });
}
</script>

<style scoped>
.category-modal-container {
  animation: slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  transform-origin: bottom;
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
