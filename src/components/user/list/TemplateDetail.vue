<script setup lang="ts">
import { ClipIcon, PencilIcon, XIcon } from '@/assets/icons/path';
import SvgIcon from '@/components/common/SvgIcon.vue';
import { computed, onMounted, ref, watch } from 'vue';
import PriorityBadge from '@/components/common/Badges/PriorityBadge.vue';
import StatusBadge from '@/components/common/Badges/StatusBadge.vue';
import { useTemplateStore } from '@/stores/userTemplateStore';
import { firstCategory, secondCategory } from '@/components/manager/ticketOptionTest';
import { BaseTicketOption } from '@/types/tickets';
import CustomDropdown from '@/components/common/CustomDropdown.vue';
import '@/assets/slideAnimation.css';
import { useCustomQuery } from '@/composables/useCustomQuery';
import { templateApi } from '@/services/templateService/templateService';

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

const templateStore = useTemplateStore();

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

const handleCancelEdit = () => {
  templateStore.resetToOriginal();
  templateStore.isEditMode = false;
};

const handleConfirmEdit = () => {
  templateStore.toggleEditMode();
};

const startEdit = () => {
  templateStore.toggleEditMode();
};

const createComputedProperty = (options: BaseTicketOption[], field: keyof typeof templateStore.template) => {
  return computed({
    get: () => options.find((option) => option.label === templateStore.template?.[field]) || options[0],
    set: (newValue: BaseTicketOption) => {
      if (templateStore.template) {
        templateStore.updateTemplate({
          ...templateStore.template,
          [field]: newValue.label,
        });
      }
    },
  });
};

const firstCategorySelected = createComputedProperty(firstCategory, 'firstCategory');
const secondCategorySelected = createComputedProperty(secondCategory, 'secondCategory');

const handleOptionSelect = (field: keyof typeof templateStore.template) => (option: BaseTicketOption) => {
  if (templateStore.template) {
    templateStore.updateTemplate({
      ...templateStore.template,
      [field]: option.label,
    });
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
                  :options="firstCategory"
                  :selected-option="firstCategorySelected"
                  :onOptionSelect="handleOptionSelect('firstCategory')"
                  @select="(option: BaseTicketOption) => (firstCategorySelected = option)"
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
                  :options="secondCategory"
                  :selected-option="secondCategorySelected"
                  :onOptionSelect="handleOptionSelect('secondCategory')"
                  @select="(option: BaseTicketOption) => (secondCategorySelected = option)"
                  isEdit
                />
              </div>
            </section>
          </div>

          <!-- 설명 -->
          <div class="mt-11">
            <label class="ticket-desc-label">설명</label>
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
