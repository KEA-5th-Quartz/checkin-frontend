<script setup lang="ts">
import { DownloadIcon, PencilIcon, XIcon } from '@/assets/icons/path';
import SvgIcon from '@/components/common/SvgIcon.vue';
import { computed, ref, watch } from 'vue';
import StatusBadge from '@/components/common/Badges/StatusBadge.vue';
import { useTicketStore } from '@/stores/userTicketStore';
import { BaseTicketOption } from '@/types/tickets';
import CustomDropdown from '@/components/common/CustomDropdown.vue';
import '@/assets/slideAnimation.css';
import { useCustomQuery } from '@/composables/useCustomQuery';
import { ticketApi } from '@/services/ticketService/ticketService';
import { formatMinusDate } from '@/utils/dateFormat';
import { useCustomMutation } from '@/composables/useCustomMutation';
import { useQueryClient } from '@tanstack/vue-query';
import { categoryApi } from '@/services/categoryService/categoryService';
import { getFileType, isImageFile } from '@/utils/getFileType';
import { ValidationError } from 'yup';
import { ticketEditValidationSchema } from '@/utils/ticketEditValidation';
import CommonTextarea from '@/components/common/commonTextarea.vue';
import CommonInput from '@/components/common/CommonInput.vue';
import CommonDialog from '@/components/common/CommonDialog.vue';
import { DialogProps, initialDialog } from '@/types/common/dialog';
import { AxiosError } from 'axios';
import { handleError } from '@/utils/handleError';
import TicketComment from '@/components/TicketComment.vue';

const queryClient = useQueryClient();
const firstCategorySelected = ref();
const secondCategorySelected = ref();
const dialogState = ref<DialogProps>({ ...initialDialog });

const props = defineProps<{
  ticketId: number;
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

const { data: detailData } = useCustomQuery(['ticket-detail', props.ticketId], async () => {
  try {
    const response = await ticketApi.getTicketDetail(props.ticketId);
    return response.data.data;
  } catch (err) {
    handleError(dialogState, '티켓 상세 조회 실패');
    throw err;
  }
});

const { data: categoryData } = useCustomQuery(['category-list'], async () => {
  try {
    const response = await categoryApi.getCategories();
    return response;
  } catch (err) {
    handleError(dialogState, '카테고리 목록 조회 실패');
    throw err;
  }
});

const ticketStore = useTicketStore();

type ErrorFields = {
  [key: string]: string;
  title: string;
  firstCategory: string;
  secondCategory: string;
  content: string;
  dueDate: string;
  attachments: string;
};

const errors = ref<ErrorFields>({
  title: '',
  firstCategory: '',
  secondCategory: '',
  content: '',
  dueDate: '',
  attachments: '',
});
const getValidationData = (ticket: any) => {
  return {
    ...ticket,
    firstCategory: ticket.firstCategory?.value || ticket.firstCategory,
    secondCategory: ticket.secondCategory?.value || ticket.secondCategory,
  };
};

const validateField = async (field: string, value: unknown) => {
  try {
    const validationData = getValidationData({
      ...ticketStore.ticket,
      [field]: value,
    });

    await ticketEditValidationSchema.validateAt(field, validationData);
    errors.value[field] = '';
    return true;
  } catch (err) {
    if (err instanceof ValidationError) {
      errors.value[field] = err.message;
    }
    return false;
  }
};

const validateForm = async () => {
  try {
    const validationData = getValidationData(ticketStore.ticket);
    await ticketEditValidationSchema.validate(validationData, { abortEarly: false });
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
  () => ticketStore.ticket?.title,
  async (newTitle) => {
    await validateField('title', newTitle);
  },
);

const firstCategoryOptions = computed(() => {
  if (!categoryData.value?.data?.data) return [];

  return categoryData.value.data.data.map((category: { firstCategoryId: number; firstCategoryName: string }) => ({
    id: category.firstCategoryId,
    value: category.firstCategoryName,
    label: category.firstCategoryName,
  }));
});

const secondCategoryOptions = computed(() => {
  if (!categoryData.value?.data?.data || !firstCategorySelected.value) return [];

  const selectedFirstCategory = categoryData.value.data.data.find(
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
      const ticketDefaultData = {
        title: newData.title,
        firstCategory: newData.firstCategory,
        secondCategory: newData.secondCategory,
        due_date: newData.dueDate,
        content: newData.content,
      };
      ticketStore.setTicket(ticketDefaultData);
    }
  },
  { immediate: true },
);

watch(
  () => ticketStore.ticket?.content,
  async (newContent) => {
    await validateField('content', newContent);
  },
);

const updateMutation = useCustomMutation(
  async () => {
    if (!ticketStore.ticket || !props.ticketId) return;

    const updateData = {
      title: ticketStore.ticket.title,
      firstCategory: firstCategorySelected.value.label,
      secondCategory: secondCategorySelected.value.label,
      content: ticketStore.ticket.content,
      dueDate: formatMinusDate(ticketStore.ticket.due_date),
      attachmentIds: [],
    };

    const response = await ticketApi.puTicket(props.ticketId, updateData);
    return response.data;
  },
  {
    onSuccess: () => {
      queryClient.invalidateQueries(['ticket-detail', props.ticketId]);
      queryClient.invalidateQueries(['user-tickets']);
      ticketStore.isEditMode = false;
    },
    onError: (error) => {
      const err = error as unknown as AxiosError;
      const apiError = err.message as string;

      dialogState.value = {
        open: true,
        isOneBtn: true,
        title: apiError || '오류가 발생했습니다.',
        mainText: '확인',
        onMainClick: () => {
          dialogState.value = { ...initialDialog };
        },
      };
    },
  },
);

const handleCancelEdit = () => {
  ticketStore.resetToOriginal();
  ticketStore.isEditMode = false;
};

const handleConfirmEdit = async () => {
  if (!(await validateForm())) {
    return;
  }
  updateMutation.mutate();
};

const startEdit = () => {
  ticketStore.toggleEditMode();
};

const handleFirstCategorySelect = async (option: BaseTicketOption) => {
  try {
    firstCategorySelected.value = option;
    await validateField('firstCategory', option);

    ticketStore.updateTicket({
      ...ticketStore.ticket,
      firstCategory: option.label,
    });

    const selectedFirstCategory = categoryData.value?.data?.data.find(
      (category: { firstCategoryId: number }) => category.firstCategoryId === option.id,
    );

    if (selectedFirstCategory?.secondCategories?.length > 0) {
      const firstSecondCategoryOption = {
        id: selectedFirstCategory.secondCategories[0].secondCategoryId,
        value: selectedFirstCategory.secondCategories[0].name,
        label: selectedFirstCategory.secondCategories[0].name,
      };
      secondCategorySelected.value = firstSecondCategoryOption;

      ticketStore.updateTicket({
        ...ticketStore.ticket,
        secondCategory: firstSecondCategoryOption.label,
      });
    }
  } catch (err) {
    handleError(dialogState, '1차 카테고리 변경 실패');
  }
};

const handleSecondCategorySelect = async (option: BaseTicketOption) => {
  try {
    secondCategorySelected.value = option;

    ticketStore.updateTicket({
      ...ticketStore.ticket,
      secondCategory: option.label,
    });
  } catch (err) {
    handleError(dialogState, '2차 카테고리 변경 실패');
  }
};

const formattedDueDate = computed({
  get: () => {
    return formatMinusDate(ticketStore.ticket.due_date);
  },
  set: (newValue: string) => {
    const formattedValue = newValue.replace(/-/g, '/');
    ticketStore.updateTicket({
      ...ticketStore.ticket,
      due_date: formattedValue,
    });
  },
});

const handleFileDownload = async (fileUrl: string) => {
  try {
    const fileName = fileUrl.split('/').pop() || 'download';

    if (isImageFile(fileName)) {
      window.open(fileUrl, '_blank');
      return;
    }

    const response = await ticketApi.getTicketAttachment(String(props.ticketId), fileUrl);

    const blob =
      response.data instanceof Blob
        ? response.data
        : new Blob([response.data], {
            type: response.headers['content-type'] || 'application/octet-stream',
          });

    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    }, 100);
  } catch (err) {
    handleError(dialogState, '파일 다운로드 실패');
  }
};

const canEdit = computed(() => {
  return detailData.value?.status !== 'IN_PROGRESS' && detailData.value?.status !== 'CLOSED';
});
</script>

<template>
  <Teleport to="body">
    <div v-if="ticketId && ticketStore.ticket && detailData" class="ticket-overlay">
      <div class="ticket-click-outside" @click="handleClose" />
      <div class="ticket-container" :class="{ 'drawer-enter': show, 'drawer-leave': !show }">
        <header class="ticket-header">
          <div v-if="!ticketStore.isEditMode">
            <p>{{ ticketStore.ticket.title }}</p>
            <p class="sm-gray-1">{{ detailData.customId }}</p>
          </div>
          <CommonInput
            v-else
            v-model="ticketStore.ticket.title"
            type="text"
            class="ticket-edit-input"
            :class="{ 'border-red-1': errors.title }"
          />

          <div v-if="!ticketStore.isEditMode" class="flex items-center gap-8">
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

        <div class="ticket-contents-div">
          <div class="flex gap-2.5 w-full">
            <section class="ticket-section">
              <div class="flex-stack items-start">
                <label class="ticket-label">진행상태</label>
                <StatusBadge :status="detailData?.status" size="xl" />
              </div>

              <div>
                <label class="ticket-label">1차 카테고리</label>
                <div
                  v-if="!ticketStore.isEditMode"
                  class="border border-gray-2 rounded-xl py-2 px-4 text-gray-1 text-sm line-clamp-1 overflow-scroll hide-scrollbar"
                >
                  {{ ticketStore.ticket.firstCategory }}
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

              <div>
                <label class="ticket-label">요청자</label>
                <div class="manager-filter-btn w-full rounded-xl border-gray-2 justify-start gap-2">
                  <p class="sm-gray-1">{{ detailData?.username }}</p>
                </div>
              </div>

              <div>
                <label class="ticket-label">요청 일자</label>
                <p class="ticket-date">{{ detailData?.createdAt }}</p>
              </div>
            </section>

            <section class="ticket-section">
              <div class="mt-[76px]">
                <label class="ticket-label">2차 카테고리</label>
                <div
                  v-if="!ticketStore.isEditMode"
                  class="border border-gray-2 rounded-xl py-2 px-4 text-gray-1 text-sm"
                >
                  {{ ticketStore.ticket.secondCategory }}
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

              <div>
                <label class="ticket-label">담당자</label>
                <div class="manager-filter-btn w-full rounded-xl border-gray-2 justify-start gap-2">
                  <img
                    :src="
                      detailData?.managerProfilePic ||
                      'https://qaurtz-bucket.s3.ap-northeast-2.amazonaws.com/profile/565ba116-f192-4866-9886-09def9216eaf.jpeg'
                    "
                    class="w-5 h-5 object-fill rounded-full mr-2"
                  />
                  <p class="text-xs text-gray-1">{{ detailData?.manager || '━' }}</p>
                </div>
              </div>

              <div>
                <label class="ticket-label">마감 기한</label>
                <p v-if="!ticketStore.isEditMode" class="ticket-date">
                  {{ formatMinusDate(ticketStore.ticket.due_date) }}
                </p>
                <CommonInput
                  v-else
                  type="date"
                  :min="new Date().toISOString().split('T')[0]"
                  class="ticket-date ticket-edit-input py-2"
                  :class="{ 'border-red-1': errors.dueDate }"
                  v-model="formattedDueDate"
                />
                <span v-if="errors.due_date" class="ticket-error-p">{{ errors.due_date }}</span>
              </div>
            </section>
          </div>

          <div class="mt-11">
            <label class="ticket-desc-label">요청사항</label>
            <div v-if="!ticketStore.isEditMode" class="ticket-desc-area">
              <p class="ticket-desc-content">{{ ticketStore.ticket.content }}</p>
            </div>
            <div v-else>
              <CommonTextarea
                v-model="ticketStore.ticket.content"
                class="ticket-desc-textarea"
                :class="{ 'border-red-1': errors.content }"
              />
              <span v-if="errors.content" class="ticket-error-p">{{ errors.content }}</span>
            </div>
          </div>

          <div v-if="detailData.ticketAttachmentUrls?.length > 0" class="mt-4 space-y-2">
            <label class="ticket-label">첨부파일</label>
            <div class="space-y-2">
              <button
                v-for="(fileUrl, index) in detailData.ticketAttachmentUrls"
                :key="index"
                @click="handleFileDownload(fileUrl)"
                class="ticket-attachment-btn"
              >
                <SvgIcon :icon="DownloadIcon" class="w-4 h-4" />
                <span>{{ getFileType(fileUrl) }} 다운</span>
              </button>
            </div>
          </div>

          <TicketComment :ticket-id="ticketId" />
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
