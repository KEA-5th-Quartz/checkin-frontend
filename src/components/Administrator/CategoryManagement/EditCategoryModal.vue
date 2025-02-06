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
import { useCustomMutation } from '@/composables/useCustomMutation';
import { categoryApi } from '@/services/categoryService/categoryService';
import { isApiError } from '@/types/common/error';

const props = defineProps({
  isOpen: Boolean,
  category: {
    type: Object as () => FirstCategory | SecondCategory | null,
    required: true,
  },
});

const isFirstCategory = computed((): boolean => {
  return props.category !== null && (props.category as FirstCategory).firstCategoryId !== undefined;
});

// Emits 정의
const emit = defineEmits(['close', 'updateCategories', 'showDialog']);

const updatedName = ref('');
const updatedAlias = ref('');
const updatedContentGuide = ref('');
const errorMessage = ref('');

const { mutate: updateCategory } = useCustomMutation(
  async (data: { id: number; name: string; alias?: string; contentGuide?: string }) => {
    if (!props.category) throw new Error('수정할 카테고리가 선택되지 않았습니다.');

    return isFirstCategory.value
      ? await categoryApi.putFirstCategory(data.id, {
          name: data.name,
          alias: data.alias || '',
          contentGuide: data.contentGuide || '',
        })
      : await categoryApi.putSecondCategory((props.category as SecondCategory).secondCategoryId, data.id, {
          secondCategory: data.name,
        });
  },
  {
    onSuccess: () => {
      resetState(); // ✅ 입력값 초기화
      emit('updateCategories'); // ✅ 리스트 갱신 요청
      emit('showDialog', {
        title: '카테고리 수정 완료',
        content: '카테고리가 성공적으로 수정되었습니다.',
        mainText: '확인',
      }); // ✅ 다이얼로그 표시 요청
      closeModal();
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

watch(
  () => props.isOpen,
  (newVal) => {
    if (!newVal) resetState();
  },
);

// 입력 상태 초기화
function resetState() {
  updatedName.value = '';
  updatedAlias.value = '';
  updatedContentGuide.value = '';
  errorMessage.value = '';
}

// 수정된 이름 제출
function submitEdit() {
  errorMessage.value = ''; // ✅ 이전 오류 메시지 초기화

  if (!props.category) {
    console.error('카테고리 정보가 없습니다.');
    return;
  }

  updateCategory({
    id: isFirstCategory.value
      ? (props.category as FirstCategory).firstCategoryId
      : (props.category as SecondCategory).secondCategoryId,
    name: updatedName.value,
    alias: updatedAlias.value,
    contentGuide: updatedContentGuide.value,
  });
}
</script>
