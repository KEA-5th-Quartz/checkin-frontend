<script setup lang="ts">
import { ClipIcon, PencilIcon, XIcon } from '@/assets/icons/path';
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
import { useMemberStore } from '@/stores/memberStore';

const queryClient = useQueryClient();
const firstCategorySelected = ref();
const secondCategorySelected = ref();

const templateStore = useTemplateStore();
const memberStore = useMemberStore();

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
      queryClient.invalidateQueries({ queryKey: ['template-list', memberStore.memberId] });
      templateStore.isEditMode = false;
    },
    onError: (error) => {
      console.error('템플릿 수정 실패:', error);
    },
  },
);

const handleCancelEdit = () => {
  templateStore.resetToOriginal();
  templateStore.isEditMode = false;
};

const handleConfirmEdit = () => {
  updateMutation.mutate();
};

const startEdit = () => {
  templateStore.toggleEditMode();
};

// 1차 카테고리 변경
const handleFirstCategorySelect = async (option: BaseTicketOption) => {
  try {
    firstCategorySelected.value = option;

    // ticketStore 업데이트
    templateStore.updateTemplate({
      ...templateStore.template,
      firstCategory: option.label,
    });

    // 선택된 1차 카테고리에 해당하는 2차 카테고리들 찾기
    const selectedFirstCategory = categoryData.value?.data?.data.find(
      (category: { firstCategoryId: number }) => category.firstCategoryId === option.id,
    );

    // 2차 카테고리를 첫 번째 요소로 설정
    if (selectedFirstCategory?.secondCategories?.length > 0) {
      const firstSecondCategoryOption = {
        id: selectedFirstCategory.secondCategories[0].secondCategoryId,
        value: selectedFirstCategory.secondCategories[0].name,
        label: selectedFirstCategory.secondCategories[0].name,
      };
      secondCategorySelected.value = firstSecondCategoryOption;

      // 2차 카테고리도 ticketStore에 업데이트
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
          <input v-else v-model="templateStore.template.title" class="ticket-edit-input" />
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
            <div v-else>
              <textarea v-model="templateStore.template.content" class="ticket-desc-textarea" />
              <div class="flex w-full justify-end pr-2 cursor-pointer">
                <SvgIcon :icon="ClipIcon" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
input[type='date']::-webkit-calendar-picker-indicator {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

input[type='date'] {
  position: relative;
  background-color: white;
}
</style>
