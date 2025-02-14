<template>
  <div v-if="isOpen" class="category-modal-overlay" @click="close">
    <div class="category-modal-container" @click.stop>
      <div class="category-modal-header">
        <h3 class="category-modal-title">{{ modalTitle }}</h3>
        <button @click="close" class="category-modal-close-button">✕</button>
      </div>
      <div class="category-modal-body">
        <p v-if="parentCategory" class="text-sm text-gray-0 mb-4">
          상위 카테고리: <span class="font-semibold">{{ parentCategory.firstCategoryName }}</span>
        </p>
        <label class="category-modal-input-label">카테고리 이름</label>
        <CommonInput
          type="text"
          v-model="categoryName"
          class="category-modal-input"
          placeholder="카테고리 이름을 입력하세요"
        />
        <label v-if="isFirstCategory" class="category-modal-input-label"> 카테고리 약어 </label>
        <CommonInput
          type="text"
          v-if="isFirstCategory"
          v-model="alias"
          maxLength="4"
          class="category-modal-input"
          placeholder="영문 2~4글자 대문자 ex) INFR"
        />
        <label v-if="isSecondaryCategory" class="category-modal-input-label"> 카테고리 약어 </label>
        <CommonInput
          type="text"
          v-if="isSecondaryCategory"
          v-model="alias"
          class="category-modal-input"
          placeholder="영문 3글자 대문자 ex) CRT"
        />
        <label v-if="!isSecondaryCategory" class="category-modal-input-label">카테고리 요청 가이드</label>
        <CommonTextarea
          maxlength="255"
          v-if="!isSecondaryCategory"
          v-model="contentGuide"
          class="category-modal-input category-modal-textarea"
          placeholder="ex) 인프라 관련 요청 시 점검 대상, 주요 증상 등을 포함해 주세요."
        />
        <p v-if="errorMessage" class="category-modal-error-message">{{ errorMessage }}</p>
      </div>
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
import CommonInput from '@/components/common/CommonInput.vue';
import CommonTextarea from '@/components/common/commonTextarea.vue';

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
      resetState();
      emit('updateCategories');
      emit('showDialog', {
        title: '카테고리 추가 완료',
        content: '새로운 카테고리가 추가되었습니다.',
        mainText: '확인',
      });
      close();
    },
    onError: (error: unknown) => {
      if (isApiError(error)) {
        if (error.code === 'CATEGORY_4090') {
          errorMessage.value = '동일한 이름의 카테고리가 존재합니다.';
        } else if (error.code === 'COMMON_4000') {
          errorMessage.value = '요청 본문에 필수적인 필드가 없거나 유효하지 않습니다.';
        } else if (error.code === 'CATEGORY_4093') {
          errorMessage.value = '동일한 이름의 약어가 존재합니다.';
        } else if (error.code === 'CATEGORY_4091') {
          errorMessage.value = '동일한 이름의 2차 카테고리가 존재합니다.';
        } else {
          errorMessage.value = '카테고리 생성 중 알 수 없는 오류가 발생했습니다.';
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

function resetState() {
  categoryName.value = '';
  alias.value = '';
  contentGuide.value = '';
  errorMessage.value = '';
}

function close() {
  emit('close');
}

function submit() {
  errorMessage.value = '';

  const missingFields = [];
  if (!categoryName.value.trim()) missingFields.push('카테고리 이름');
  if (!alias.value.trim()) missingFields.push('Alias');
  if (isFirstCategory.value && !contentGuide.value?.trim()) missingFields.push('Content Guide');
  if (missingFields.length > 0) {
    errorMessage.value = `다음 필드를 입력해주세요: ${missingFields.join(', ')}`;
    return;
  }
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
