<script setup lang="ts">
import { ClipIcon, PencilIcon, XIcon } from '@/assets/icons/path';
import SvgIcon from '@/components/common/SvgIcon.vue';
import { computed, onMounted, ref } from 'vue';
import PriorityBadge from '@/components/common/Badges/PriorityBadge.vue';
import StatusBadge from '@/components/common/Badges/StatusBadge.vue';
import { useTemplateStore } from '@/stores/userTemplateStore';
import { firstCategory, secondCategory } from '@/components/manager/ticketOptionTest';
import { BaseTicketOption } from '@/types/tickets';
import CustomDropdown from '@/components/common/CustomDropdown.vue';
import '@/assets/slideAnimation.css';

defineProps<{
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
  }, 300);
};

let templateDefaultTest = {
  title: 'SSH 접속 확인',
  firstCategory: 'VM1',
  secondCategory: '생성',
  due_date: '2025-02-22',
  content: 'Github Repo가 접속이 되지 않습니다.',
};

const templateStore = useTemplateStore();

onMounted(() => {
  templateStore.setTemplate(templateDefaultTest);
});

const handleCancelEdit = () => {
  templateStore.resetToOriginal();
  templateStore.toggleEditMode();
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
        templateStore.updateTicket({
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
    templateStore.updateTicket({
      ...templateStore.template,
      [field]: option.label,
    });
  }
};
</script>

<template>
  <Teleport to="body">
    <div v-if="templateId && templateStore.template" class="fixed inset-0 z-10">
      <div class="fixed inset-0 transition-opacity" @click="handleClose" />
      <div
        class="fixed top-0 right-0 w-[490px] h-screen bg-white-0 flex flex-col py-9 px-6 rounded-[10px] shadow-md translate-x-full z-10"
        :class="{ 'drawer-enter': show, 'drawer-leave': !show }"
      >
        <!-- 헤더 -->
        <div class="flex items-center justify-between w-full gap-3">
          <p v-if="!templateStore.isEditMode">{{ templateStore.template.title }}</p>
          <input
            v-else
            v-model="templateStore.template.title"
            class="w-full rounded-xl px-1 py-1 mb-1 border border-gray-2 focus:outline-none"
          />
          <div v-if="!templateStore.isEditMode" class="flex items-center gap-8">
            <SvgIcon :icon="PencilIcon" :iconOptions="{ fill: '#000' }" class="cursor-pointer" @click="startEdit" />
            <SvgIcon :icon="XIcon" class="cursor-pointer" @click="handleClose" />
          </div>
          <div v-else class="flex items-center gap-4">
            <button
              @click="handleCancelEdit"
              class="px-6 py-1.5 text-sm border border-gray-1 rounded-lg hover:bg-gray-100 whitespace-nowrap"
            >
              취소
            </button>
            <button
              @click="handleConfirmEdit"
              class="px-6 py-1.5 text-sm text-white bg-primary-0 rounded-lg hover:bg-opacity-80 text-white-0 whitespace-nowrap"
            >
              저장
            </button>
          </div>
        </div>

        <!-- 컨텐츠 -->
        <div class="mt-6 flex-1 overflow-y-auto hide-scrollbar">
          <div class="flex gap-2.5 w-full">
            <!-- 왼쪽 섹션 -->
            <section class="flex flex-col w-full">
              <!-- 중요도 블록 -->
              <div class="flex flex-col items-start">
                <p class="text-sm pb-2">중요도</p>
                <div class="py-1">
                  <PriorityBadge />
                </div>
              </div>

              <!-- 1차 카테고리 블록 -->
              <div class="flex flex-col mt-7">
                <p class="text-sm pb-2">1차 카테고리</p>
                <div
                  v-if="!templateStore.isEditMode"
                  class="border border-gray-2 rounded-xl py-2 px-4 text-gray-1 text-sm"
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

              <!-- 요청 일자 블록 -->
              <div class="mt-7">
                <p class="text-sm pb-2">요청 일자</p>
                <p class="text-xs text-blue-1">2025/01/20</p>
              </div>
            </section>

            <!-- 오른쪽 섹션 -->
            <section class="flex flex-col w-full">
              <!-- 진행상태 블록 -->
              <div class="flex flex-col items-start">
                <p class="text-sm pb-2">진행상태</p>
                <StatusBadge status="생성" size="xl" />
              </div>

              <!-- 2차 카테고리 블록 -->
              <div class="flex flex-col mt-7">
                <p class="text-sm pb-2">2차 카테고리</p>
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

              <!-- 마감 기한 블록 -->
              <div class="mt-7">
                <p class="text-sm pb-2">마감 기한</p>
                <p v-if="!templateStore.isEditMode" class="text-xs text-blue-1">
                  {{ templateStore.template.due_date }}
                </p>
                <input
                  v-else
                  type="date"
                  :min="new Date().toISOString().split('T')[0]"
                  class="text-xs text-blue-1 border border-gray-2 rounded-xl w-full px-1 py-2"
                  v-model="templateStore.template.due_date"
                />
              </div>
            </section>
          </div>

          <!-- 설명 -->
          <div class="mt-11">
            <p class="font-semibold mb-3">설명</p>
            <div
              v-if="!templateStore.isEditMode"
              class="min-h-32 max-h-36 overflow-scroll border-y border-y-primary-2 px-2 py-6 hide-scrollbar"
            >
              <p class="text-sm text-gray-1 break-words">{{ templateStore.template.content }}</p>
            </div>
            <div v-else>
              <textarea
                v-model="templateStore.template.content"
                class="min-h-32 max-h-36 overflow-scroll border-y border-y-primary-2 px-2 py-6 hide-scrollbar w-full resize-none text-sm text-gray-1 break-words focus:outline-none"
              />
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
