<script setup lang="ts">
import { DownloadIcon, XIcon } from '@/assets/icons/path';
import SvgIcon from '../../common/SvgIcon.vue';
import { computed, ref, watch } from 'vue';
import CustomDropdown from '../../common/CustomDropdown.vue';
import { BaseTicketOption } from '@/types/tickets';
import { priority, ticket_status } from '../ticketOptionTest';
import '@/assets/slideAnimation.css';
import { useCustomQuery } from '@/composables/useCustomQuery';
import { ticketApi } from '@/services/ticketService/ticketService';
import { useMemberStore } from '@/stores/memberStore';
import { useCustomMutation } from '@/composables/useCustomMutation';
import { useQueryClient } from '@tanstack/vue-query';
import { userApi } from '@/services/userService/userService';
import { categoryApi } from '@/services/categoryService/categoryService';
import { getFileType, isImageFile } from '@/utils/getFileType';
import { ApiError } from '@/types/common/error';
import { DialogProps, initialDialog } from '@/types/common/dialog';
import CommonDialog from '@/components/common/CommonDialog.vue';
import { handleError } from '@/utils/handleError';
import TicketComment from '@/components/TicketComment.vue';

const memberStore = useMemberStore();
const queryClient = useQueryClient();

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
  }, 300);
};

const prioritySelected = ref<BaseTicketOption>(priority[2]);
const statusSelected = ref<BaseTicketOption>(ticket_status[0]);
const firstCategorySelected = ref();
const secondCategorySelected = ref();
const managerSelected = ref();
const dialogState = ref<DialogProps>({ ...initialDialog });

const { data: detailData, isLoading } = useCustomQuery(['ticket-detail', props.ticketId], async () => {
  try {
    const response = await ticketApi.getTicketDetail(props.ticketId);
    return response.data.data;
  } catch (err) {
    dialogState.value = handleError(dialogState, '중요도 변경 실패');
    throw err;
  }
});

const { data: managersData } = useCustomQuery(['manager-list'], async () => {
  try {
    const response = await userApi.getManagers('MANAGER', 1, 100);
    return response;
  } catch (err) {
    dialogState.value = handleError(dialogState, '담당자 목록 조회 실패');
    throw err;
  }
});

const { data: categoryData } = useCustomQuery(['category-list'], async () => {
  try {
    const response = await categoryApi.getCategories();
    return response;
  } catch (err) {
    dialogState.value = handleError(dialogState, '카테고리 목록 조회 실패');
    throw err;
  }
});

const managerOptions = computed(() => {
  if (!managersData.value?.data?.data?.members) return [];
  return [
    {
      id: 0,
      value: null,
      label: '-',
      profilePic: null,
    },
    ...managersData.value.data.data.members.map(
      (manager: { memberId: number; username: string; profilePic: string }) => ({
        id: manager.memberId,
        value: manager.username,
        label: manager.username,
        profilePic: manager.profilePic,
      }),
    ),
  ];
});

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
  [detailData, categoryData, managerOptions],
  ([newDetailData, newCategoryData, options]) => {
    if (newDetailData && newCategoryData?.data?.data && options.length > 0) {
      prioritySelected.value = priority.find((p) => p.value === newDetailData.priority) || priority[2];
      statusSelected.value = ticket_status.find((s) => s.value === newDetailData.status) || ticket_status[0];

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

      managerSelected.value = newDetailData.manager
        ? options.find((m) => m.value === newDetailData.manager)
        : options[0];
    }
  },
  { immediate: true },
);

const isMe = computed(() => {
  if (!detailData.value) return false;
  return memberStore.username === detailData.value.manager;
});

const isManagerChangeDisabled = computed(() => {
  if (!detailData.value?.manager) return false;

  if (!isMe.value && detailData.value.manager) return true;
  return statusSelected.value.value === 'CLOSED';
});

const invalidateTicketQueries = () => {
  queryClient.invalidateQueries({ queryKey: ['tickets'] });
  queryClient.invalidateQueries({ queryKey: ['search-tickets'] });
  queryClient.invalidateQueries({
    queryKey: ['ticket-detail', props.ticketId],
  });
  queryClient.invalidateQueries({ queryKey: ['ticket-comments', props.ticketId] });
  queryClient.invalidateQueries({ queryKey: ['manager-category-stats'] });
  queryClient.invalidateQueries({ queryKey: ['manager-progress'] });
  queryClient.invalidateQueries({ queryKey: ['category-stats'] });
  queryClient.invalidateQueries({ queryKey: ['closed-rate-stats'] });
  queryClient.invalidateQueries({ queryKey: ['status-rate-stats'] });
};

const availableStatusOptions = computed(() => {
  const currentStatus = statusSelected.value.value;

  switch (currentStatus) {
    case 'OPEN':
      return ticket_status.filter((status) => ['OPEN', 'IN_PROGRESS'].includes(status.value));
    case 'IN_PROGRESS':
      return ticket_status.filter((status) => ['IN_PROGRESS', 'CLOSED'].includes(status.value));
    case 'CLOSED':
      return ticket_status.filter((status) => ['CLOSED'].includes(status.value));
    default:
      return ticket_status;
  }
});

const priorityMutation = useCustomMutation(
  async ({ ticketId, priority }: { ticketId: number; priority: string }) => {
    const response = await ticketApi.patchTicketPriority(ticketId, { priority });
    return response.data;
  },
  {
    onSuccess: invalidateTicketQueries,
  },
);

const closeMutation = useCustomMutation(
  async (ticketId: number) => {
    const response = await ticketApi.patchTicketClose(ticketId);
    return response.data;
  },
  {
    onSuccess: invalidateTicketQueries,
  },
);

const firstCategoryMution = useCustomMutation(
  async ({ ticketId, firstCategory }: { ticketId: number; firstCategory: string }) => {
    const response = await ticketApi.patchTicketFirstCategory(ticketId, { firstCategory });
    return response.data;
  },
  {
    onSuccess: invalidateTicketQueries,
  },
);

const secondCategoryMutation = useCustomMutation(
  async ({
    ticketId,
    firstCategoryId,
    secondCategory,
  }: {
    ticketId: number;
    firstCategoryId: number;
    secondCategory: string;
  }) => {
    const response = await ticketApi.patchTicketSecondCategory(ticketId, firstCategoryId, { secondCategory });
    return response.data;
  },
  {
    onSuccess: invalidateTicketQueries,
  },
);

const reassignMutation = useCustomMutation(
  async ({ ticketId, manager }: { ticketId: number; manager: string }) => {
    const response = await ticketApi.patchTicketAssign(ticketId, { manager });
    return response.data;
  },
  {
    onSuccess: invalidateTicketQueries,
  },
);

const handleStatusSelect = async (option: BaseTicketOption) => {
  const currentStatus = statusSelected.value.value;
  const newStatus = option.value;

  try {
    if (currentStatus === 'IN_PROGRESS' && newStatus === 'CLOSED') {
      await closeMutation.mutateAsync(props.ticketId);
    }
    statusSelected.value = option;
  } catch (err) {
    dialogState.value = handleError(dialogState, '상태 변경 실패');
  }
};

const handlePrioritySelect = async (option: BaseTicketOption) => {
  try {
    await priorityMutation.mutateAsync({
      ticketId: props.ticketId,
      priority: option.value,
    });
    prioritySelected.value = option;
  } catch (err) {
    dialogState.value = handleError(dialogState, '중요도 변경 실패');
  }
};

const handleFirstCategorySelect = async (option: BaseTicketOption) => {
  try {
    await firstCategoryMution.mutateAsync({
      ticketId: props.ticketId,
      firstCategory: option.value,
    });
    firstCategorySelected.value = option;

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

      await secondCategoryMutation.mutateAsync({
        ticketId: props.ticketId,
        firstCategoryId: option.id as number,
        secondCategory: firstSecondCategoryOption.value,
      });
    }
  } catch (err) {
    dialogState.value = handleError(dialogState, '1차 카테고리 변경 실패');
  }
};

const handleSecondCategorySelect = async (option: BaseTicketOption) => {
  try {
    await secondCategoryMutation.mutateAsync({
      ticketId: props.ticketId,
      firstCategoryId: firstCategorySelected.value.id,
      secondCategory: option.value,
    });
    secondCategorySelected.value = option;
  } catch (err) {
    dialogState.value = handleError(dialogState, '2차 카테고리 변경 실패');
  }
};

const handleManagerSelect = async (option: BaseTicketOption) => {
  try {
    await reassignMutation.mutateAsync({
      ticketId: props.ticketId,
      manager: option.value,
    });
    managerSelected.value = option;
  } catch (err) {
    const error = err as ApiError;
    switch (error.code) {
      case 'MEMBER_4040':
        break;
      case 'TICKET_4090':
        dialogState.value = {
          open: true,
          isOneBtn: true,
          title: error.message,
          mainText: '확인',
          onMainClick: () => {
            dialogState.value = { ...initialDialog };
            window.location.reload();
          },
        };
        break;
      case 'TICKET_4091':
        dialogState.value = {
          open: true,
          isOneBtn: true,
          title: error.message,
          mainText: '확인',
          onMainClick: () => {
            dialogState.value = { ...initialDialog };
          },
        };
        break;
      default:
        dialogState.value = handleError(dialogState, '담당자 변경 실패');
    }
  }
};

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
    dialogState.value = handleError(dialogState, '파일 다운로드 실패');
  }
};
</script>

<template>
  <Teleport to="body">
    <div v-if="ticketId" class="ticket-overlay">
      <div v-if="isLoading" class="loading-spinner">로딩중...</div>
      <template v-else-if="detailData">
        <div class="ticket-click-outside" @click="handleClose" />
        <div class="ticket-container" :class="{ 'drawer-enter': show, 'drawer-leave': !show }">
          <header class="ticket-header">
            <div class="flex-stack justify-center">
              <p class="text-2xl">{{ detailData.title }}</p>
              <p class="sm-gray-1">{{ detailData.customId }}</p>
            </div>
            <SvgIcon :icon="XIcon" class="cursor-pointer self-start" @click="handleClose" />
          </header>

          <div class="ticket-contents-div">
            <div class="flex gap-2.5 w-full">
              <section class="ticket-section">
                <div :class="{ invisible: statusSelected.value === 'OPEN' }">
                  <CustomDropdown
                    label="중요도"
                    :options="priority"
                    :selected-option="prioritySelected"
                    @select="handlePrioritySelect"
                    has-color
                    :disabled="!isMe"
                  />
                </div>

                <CustomDropdown
                  label="1차 카테고리"
                  :options="firstCategoryOptions"
                  :selected-option="firstCategorySelected"
                  @select="handleFirstCategorySelect"
                  :disabled="!isMe"
                />

                <div>
                  <label class="ticket-label">요청자</label>
                  <div class="manager-filter-btn w-full border-primary-2 justify-start gap-2">
                    <p class="sm-gray-1">{{ detailData.username }}</p>
                  </div>
                </div>

                <div>
                  <label class="ticket-label">요청 일자</label>
                  <p class="ticket-date">{{ detailData.createdAt }}</p>
                </div>
              </section>

              <section class="ticket-section">
                <CustomDropdown
                  label="진행상태"
                  :options="availableStatusOptions"
                  :selected-option="statusSelected"
                  @select="handleStatusSelect"
                  has-color
                  :disabled="!isMe"
                />

                <CustomDropdown
                  label="2차 카테고리"
                  :options="secondCategoryOptions"
                  :selected-option="secondCategorySelected"
                  @select="handleSecondCategorySelect"
                  :disabled="!isMe"
                />

                <CustomDropdown
                  label="담당자"
                  :options="managerOptions"
                  :selected-option="managerSelected"
                  @select="handleManagerSelect"
                  :disabled="isManagerChangeDisabled"
                  isManager
                />

                <div>
                  <label class="ticket-label">마감 기한</label>
                  <p class="ticket-date">{{ detailData.dueDate }}</p>
                </div>
              </section>
            </div>

            <div class="mt-11">
              <label class="ticket-desc-label">요청사항</label>
              <div class="ticket-desc-area">
                <p class="ticket-desc-content">{{ detailData.content }}</p>
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
      </template>

      <CommonDialog
        v-if="dialogState.open"
        :isOneBtn="dialogState.isOneBtn"
        :title="dialogState.title"
        :content="dialogState.content"
        :mainText="dialogState.mainText"
        :onCancelClick="dialogState.onMainClick"
        :onMainClick="dialogState.onMainClick"
      />
    </div>
  </Teleport>
</template>
