<script setup lang="ts">
import { PencilIcon, XIcon } from '@/assets/icons/path';
import SvgIcon from '@/components/common/SvgIcon.vue';
import { computed, ref, watch } from 'vue';
import { useTemplateStore } from '@/stores/userTemplateStore';
import { BaseTicketOption } from '@/types/tickets';
import CustomDropdown from '@/components/common/CustomDropdown.vue';
import '@/assets/slideAnimation.css';
import { useCustomQuery } from '@/composables/useCustomQuery';
import { templateApi } from '@/services/templateService/templateService';
import { useQueryClient } from '@tanstack/vue-query';
import { categoryApi } from '@/services/categoryService/categoryService';
import { useCustomMutation } from '@/composables/useCustomMutation';
import { DialogProps, initialDialog } from '@/types/common/dialog';
import { templateEditValidationSchema } from '@/utils/templateEditValidation';
import { ValidationError } from 'yup';
import { ApiError } from '@/types/common/error';
import CommonInput from '@/components/common/CommonInput.vue';
import CommonTextarea from '@/components/common/commonTextarea.vue';
import CommonDialog from '@/components/common/CommonDialog.vue';
import { AxiosError } from 'axios';

const queryClient = useQueryClient();
const firstCategorySelected = ref();
const secondCategorySelected = ref();
const dialogState = ref<DialogProps>({ ...initialDialog });

const templateStore = useTemplateStore();

const props = defineProps<{
  templateId: number;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();
const show = ref(true);

const handleClose = () => {
  show.value = false;
  setTimeout(() => {
    emit('close');
    handleCancelEdit();
  }, 300);
};

type ErrorFields = {
  [key: string]: string;
  title: string;
  firstCategory: string;
  secondCategory: string;
  content: string;
  dueDate: string;
};

const errors = ref<ErrorFields>({
  title: '',
  firstCategory: '',
  secondCategory: '',
  content: '',
  dueDate: '',
});
const getValidationData = (ticket: any) => {
  return {
    ...ticket,
    firstCategory: ticket.firstCategory?.value || ticket.firstCategory,
    secondCategory: ticket.secondCategory?.value || ticket.secondCategory,
  };
};

// 개별 필드 검증 함수
const validateField = async (field: string, value: unknown) => {
  try {
    const validationData = getValidationData({
      ...templateStore.template,
      [field]: value,
    });

    await templateEditValidationSchema.validateAt(field, validationData);
    errors.value[field] = '';
    return true;
  } catch (err) {
    if (err instanceof ValidationError) {
      errors.value[field] = err.message;
    }
    return false;
  }
};

// 전체 폼 검증 함수
const validateForm = async () => {
  try {
    const validationData = getValidationData(templateStore.template);
    await templateEditValidationSchema.validate(validationData, { abortEarly: false });
    return true;
  } catch (err) {
    if (err instanceof ValidationError) {
      err.inner.forEach((error) => {
        if (error.path) {
          errors.value[error.path] = error.message;
        }
      });
    }
    return false;
  }
};

watch(
  () => templateStore.template?.title,
  async (newTitle) => {
    await validateField('title', newTitle);
  },
);

// 티켓 상세 페치
const { data: detailData } = useCustomQuery(['template-detail', props.templateId], async () => {
  try {
    const response = await templateApi.getTemplateDetail(props.templateId);
    return response.data.data;
  } catch (err) {
    console.error('티켓 상세 조회 실패:', err);
    throw err;
  }
});

// 카테고리 목록 페치
const { data: categoryData } = useCustomQuery(['category-list'], async () => {
  try {
    const response = await categoryApi.getCategories();
    return response;
  } catch (err) {
    console.error('카테고리 목록 조회 실패:', err);
    throw err;
  }
});

// 1차 카테고리 옵션 동적 생성
const firstCategoryOptions = computed(() => {
  if (!categoryData.value?.data?.data) return [];
  // categoryData에서 1차 카테고리 목록을 변환하여 반환
  return categoryData.value.data.data.map((category: { firstCategoryId: number; firstCategoryName: string }) => ({
    id: category.firstCategoryId,
    value: category.firstCategoryName,
    label: category.firstCategoryName,
  }));
});
// 2차 카테고리 옵션 동적 생성
const secondCategoryOptions = computed(() => {
  if (!categoryData.value?.data?.data || !firstCategorySelected.value) return [];
  // 선택된 1차 카테고리에 해당하는 객체를 찾음
  const selectedFirstCategory = categoryData.value.data.data.find(
    // 현재 선택된 1차 카테고리의 ID와 일치하는 카테고리를 찾음
    (category: { firstCategoryId: number }) => category.firstCategoryId === firstCategorySelected.value.id,
  );

  return (
    selectedFirstCategory?.secondCategories.map((category: { secondCategoryId: number; name: string }) => ({
      id: category.secondCategoryId,
      value: category.name,
      label: category.name,
    })) || []
  );
});

watch(
  [detailData, categoryData],
  ([newDetailData, newCategoryData]) => {
    if (newDetailData && newCategoryData?.data?.data) {
      const firstCategory = newCategoryData.data.data.find(
        (category: { firstCategoryName: string }) => category.firstCategoryName === newDetailData.firstCategory,
      );
      if (firstCategory) {
        firstCategorySelected.value = {
          id: firstCategory.firstCategoryId,
          value: firstCategory.firstCategoryName,
          label: firstCategory.firstCategoryName,
        };
        const secondCategory = firstCategory.secondCategories.find(
          (category: { name: string }) => category.name === newDetailData.secondCategory,
        );
        if (secondCategory) {
          secondCategorySelected.value = {
            id: secondCategory.secondCategoryId,
            value: secondCategory.name,
            label: secondCategory.name,
          };
        }
      }
    }
  },
  { immediate: true },
);

watch(
  () => detailData.value,
  (newData) => {
    if (newData) {
      const templateDefaultData = {
        title: newData.title,
        firstCategory: newData.firstCategory,
        secondCategory: newData.secondCategory,
        content: newData.content,
      };
      templateStore.setTemplate(templateDefaultData);
    }
  },
  { immediate: true },
);

watch(
  () => templateStore.template?.content,
  async (newContent) => {
    await validateField('content', newContent);
  },
);

const updateMutation = useCustomMutation(
  async () => {
    if (!templateStore.template || !props.templateId) return;

    const updateData = {
      title: templateStore.template.title,
      firstCategory: firstCategorySelected.value.label,
      secondCategory: secondCategorySelected.value.label,
      content: templateStore.template.content,
      attachmentIds: [],
    };

    const response = await templateApi.putTemplate(props.templateId, updateData);
    return response.data;
  },
  {
    onSuccess: () => {
      queryClient.invalidateQueries(['template-detail', props.templateId]);
      queryClient.invalidateQueries(['template-list']);
      templateStore.isEditMode = false;
    },
    onError: (error) => {
      const err = error as unknown as AxiosError;
      const apiError = err.response?.data as ApiError;

      dialogState.value = {
        open: true,
        isOneBtn: true,
        title: apiError.message || '오류가 발생했습니다.',
        mainText: '확인',
        onMainClick: () => {
          dialogState.value = { ...initialDialog };
        },
      };
    },
  },
);

const handleCancelEdit = () => {
  templateStore.resetToOriginal();
  templateStore.isEditMode = false;
};

const handleConfirmEdit = async () => {
  if (!(await validateForm())) {
    return;
  }
  updateMutation.mutate();
};

const startEdit = () => {
  templateStore.toggleEditMode();
};

// 1차 카테고리 변경
const handleFirstCategorySelect = async (option: BaseTicketOption) => {
  try {
    firstCategorySelected.value = option;
    await validateField('firstCategory', option);

    // 선택된 1차 카테고리의 contentGuide 찾기
    const selectedFirstCategory = categoryData.value?.data?.data.find(
      (category: { firstCategoryId: number }) => category.firstCategoryId === option.id,
    );

    // templateStore 업데이트 - contentGuide를 content에 설정
    templateStore.updateTemplate({
      ...templateStore.template,
      firstCategory: option.label,
      content: selectedFirstCategory?.contentGuide || '', // contentGuide를 content에 설정
    });

    // 2차 카테고리 설정 (기존 코드)
    if (selectedFirstCategory?.secondCategories?.length > 0) {
      const firstSecondCategoryOption = {
        id: selectedFirstCategory.secondCategories[0].secondCategoryId,
        value: selectedFirstCategory.secondCategories[0].name,
        label: selectedFirstCategory.secondCategories[0].name,
      };
      secondCategorySelected.value = firstSecondCategoryOption;

      templateStore.updateTemplate({
        ...templateStore.template,
        secondCategory: firstSecondCategoryOption.label,
      });
    }
  } catch (err) {
    console.error('1차 카테고리 변경 실패:', err);
  }
};

const handleSecondCategorySelect = async (option: BaseTicketOption) => {
  try {
    secondCategorySelected.value = option;

    // ticketStore 업데이트
    templateStore.updateTemplate({
      ...templateStore.template,
      secondCategory: option.label,
    });
  } catch (err) {
    console.error('2차 카테고리 변경 실패:', err);
  }
};

const canEdit = computed(() => {
  return detailData.value?.status !== 'IN_PROGRESS' && detailData.value?.status !== 'CLOSED';
});
</script>

<template>
  <Teleport to="body">
    <div v-if="templateId && templateStore.template && detailData" class="ticket-overlay">
      <div class="ticket-click-outside" @click="handleClose" />
      <div class="ticket-container" :class="{ 'drawer-enter': show, 'drawer-leave': !show }">
        <!-- 헤더 -->
        <header class="ticket-header">
          <p v-if="!templateStore.isEditMode">{{ templateStore.template.title }}</p>
          <CommonInput
            v-else
            v-model="templateStore.template.title"
            class="ticket-edit-input"
            :class="{ 'border-red-1': errors.title }"
          />
          <div v-if="!templateStore.isEditMode" class="flex items-center gap-8">
            <SvgIcon
              v-if="canEdit"
              :icon="PencilIcon"
              :iconOptions="{ fill: '#000' }"
              class="cursor-pointer"
              @click="startEdit"
            />
            <SvgIcon :icon="XIcon" class="cursor-pointer" @click="handleClose" />
          </div>
          <div v-else class="filter-btn-section pt-0">
            <button @click="handleCancelEdit" class="btn-cancel">취소</button>
            <button @click="handleConfirmEdit" class="btn-main">저장</button>
          </div>
        </header>

        <!-- 컨텐츠 -->
        <div class="ticket-contents-div">
          <div class="flex gap-2.5 w-full">
            <!-- 왼쪽 섹션 -->
            <section class="ticket-section">
              <!-- 1차 카테고리 블록 -->
              <div>
                <label class="ticket-label">1차 카테고리</label>
                <div
                  v-if="!templateStore.isEditMode"
                  class="border border-gray-2 rounded-xl py-2 px-4 text-gray-1 text-sm line-clamp-1 overflow-scroll hide-scrollbar"
                >
                  {{ templateStore.template.firstCategory }}
                </div>
                <CustomDropdown
                  v-else
                  label=""
                  :options="firstCategoryOptions"
                  :selected-option="firstCategorySelected"
                  @select="handleFirstCategorySelect"
                  :class="{ 'border-red-1': errors.firstCategory }"
                  isEdit
                />
              </div>
            </section>

            <!-- 오른쪽 섹션 -->
            <section class="ticket-section">
              <!-- 2차 카테고리 블록 -->
              <div>
                <label class="ticket-label">2차 카테고리</label>
                <div
                  v-if="!templateStore.isEditMode"
                  class="border border-gray-2 rounded-xl py-2 px-4 text-gray-1 text-sm"
                >
                  {{ templateStore.template.secondCategory }}
                </div>
                <CustomDropdown
                  v-else
                  label=""
                  :options="secondCategoryOptions"
                  :selected-option="secondCategorySelected"
                  @select="handleSecondCategorySelect"
                  isEdit
                />
              </div>
            </section>
          </div>

          <!-- 요청사항 -->
          <div class="mt-11">
            <label class="ticket-desc-label">요청사항</label>
            <div v-if="!templateStore.isEditMode" class="ticket-desc-area">
              <p class="ticket-desc-content">{{ templateStore.template.content }}</p>
            </div>

            <CommonTextarea
              v-else
              v-model="templateStore.template.content"
              class="ticket-desc-textarea"
              :class="{ 'border-red-1': errors.content }"
            />
            <span v-if="errors.content" class="text-xs text-red-1 mt-1 block">{{ errors.content }}</span>
          </div>
        </div>
      </div>
    </div>

    <CommonDialog
      v-if="dialogState.open"
      :isOneBtn="dialogState.isOneBtn"
      :title="dialogState.title"
      :mainText="dialogState.mainText"
      :onCancelClick="dialogState.onMainClick"
      :onMainClick="dialogState.onMainClick"
    />
  </Teleport>
</template>
