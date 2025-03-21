<template>
  <div v-if="isOpen" class="category-modal-overlay" @click="closeModal">
    <div class="category-modal-container" @click.stop>
      <div class="category-modal-header">
        <h3 class="category-modal-title">카테고리 수정</h3>
        <button @click="closeModal" class="category-modal-close-button">✕</button>
      </div>
      <div class="category-modal-body">
        <label class="category-modal-input-label">카테고리 이름</label>
        <CommonInput
          type="text"
          v-model="updatedName"
          class="category-modal-input"
          placeholder="카테고리 이름을 입력하세요"
        />
        <label class="category-modal-input-label">카테고리 약어</label>
        <CommonInput type="text" v-model="updatedAlias" class="category-modal-input" :placeholder="aliasPlaceholder" />
        <label v-if="isFirstCategoryComputed" class="category-modal-input-label">카테고리 요청 가이드</label>
        <CommonTextarea
          maxlength="255"
          v-if="isFirstCategoryComputed"
          v-model="updatedContentGuide"
          class="category-modal-input category-modal-textarea"
          placeholder="ex) 인프라 관련 요청 시 점검 대상, 주요 증상 등을 포함해 주세요."
        ></CommonTextarea>
        <p v-if="errorMessage" class="category-modal-error-message">{{ errorMessage }}</p>
      </div>
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
import CommonTextarea from '@/components/common/commonTextarea.vue';
import CommonInput from '@/components/common/CommonInput.vue';

const props = defineProps({
  isOpen: Boolean,
  category: {
    type: Object as () => FirstCategory | SecondCategory | null,
    required: true,
  },
  parentCategory: {
    type: Object as () => FirstCategory | null,
    required: false,
  },
});

function isFirstCategory(category: FirstCategory | SecondCategory | null): category is FirstCategory {
  return !!category && 'firstCategoryId' in category;
}

function isSecondCategory(category: FirstCategory | SecondCategory | null): category is SecondCategory {
  return !!category && 'secondCategoryId' in category;
}

const isFirstCategoryComputed = computed(() => isFirstCategory(props.category));

const aliasPlaceholder = computed(() => {
  return isFirstCategoryComputed.value ? '영문 2~4글자 대문자 ex) INFR' : '영문 3글자 대문자 ex) NFS';
});

const emit = defineEmits(['close', 'updateCategories', 'showDialog']);

const updatedName = ref('');
const updatedAlias = ref('');
const updatedContentGuide = ref('');
const errorMessage = ref('');

const { mutate: updateCategory } = useCustomMutation(
  async (data: { id: number; name: string; alias: string; contentGuide?: string }) => {
    if (!props.category) throw new Error('수정할 카테고리가 선택되지 않았습니다.');

    if (isFirstCategory(props.category)) {
      return await categoryApi.putFirstCategory(data.id, {
        name: data.name,
        alias: data.alias || '',
        contentGuide: data.contentGuide || '',
      });
    } else if (isSecondCategory(props.category) && props.parentCategory) {
      return await categoryApi.putSecondCategory(
        props.parentCategory.firstCategoryId,
        props.category.secondCategoryId,
        {
          secondCategory: data.name,
          alias: data.alias || '',
        },
      );
    }

    throw new Error('잘못된 카테고리 타입');
  },
  {
    onSuccess: () => {
      resetState();
      emit('updateCategories');
      emit('showDialog', {
        title: '카테고리 수정 완료',
        content: '카테고리가 성공적으로 수정되었습니다.',
        mainText: '확인',
      });
      closeModal();
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
          errorMessage.value = '카테고리 수정 중 알 수 없는 오류가 발생했습니다.';
        }
      }
    },
  },
);

watch(
  () => props.category,
  (newCategory) => {
    if (!newCategory) return;

    if (isFirstCategory(newCategory)) {
      updatedName.value = newCategory.firstCategoryName;
      updatedAlias.value = newCategory.alias ?? '';
      updatedContentGuide.value = newCategory.contentGuide ?? '';
    } else if (isSecondCategory(newCategory)) {
      updatedName.value = newCategory.name;
      updatedAlias.value = newCategory.alias ?? '';
      updatedContentGuide.value = '';
    }
  },
  { immediate: true },
);

function closeModal() {
  emit('close');
}

watch(
  () => props.isOpen,
  (newVal) => {
    if (!newVal) resetState();
  },
);

function resetState() {
  updatedName.value = '';
  updatedAlias.value = '';
  updatedContentGuide.value = '';
  errorMessage.value = '';
}

function submitEdit() {
  errorMessage.value = '';

  if (!props.category) {
    return;
  }

  updateCategory({
    id: isFirstCategory(props.category)
      ? (props.category as FirstCategory).firstCategoryId
      : (props.category as SecondCategory).secondCategoryId,
    name: updatedName.value,
    alias: updatedAlias.value,
    contentGuide: updatedContentGuide.value,
  });
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
