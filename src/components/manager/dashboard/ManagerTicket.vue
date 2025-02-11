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
import ManagerComments from './ManagerComments.vue';
import { userApi } from '@/services/userService/userService';
import { categoryApi } from '@/services/categoryService/categoryService';
import { getFileType, isImageFile } from '@/utils/getFileType';

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

// 초기값 설정
const prioritySelected = ref<BaseTicketOption>(priority[2]);
const statusSelected = ref<BaseTicketOption>(ticket_status[0]);
const firstCategorySelected = ref();
const secondCategorySelected = ref();
const managerSelected = ref();

// 티켓 상세 페치
const { data: detailData, isLoading } = useCustomQuery(['ticket-detail', props.ticketId], async () => {
  try {
    const response = await ticketApi.getTicketDetail(props.ticketId);
    return response.data.data;
  } catch (err) {
    console.error('티켓 상세 조회 실패:', err);
    throw err;
  }
});
// 담당자 목록 페치
const { data: managersData } = useCustomQuery(['manager-list'], async () => {
  try {
    const response = await userApi.getManagers('MANAGER', 1, 100);
    return response;
  } catch (err) {
    console.error('담당자 목록 조회 실패:', err);
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

// managerOptions를 동적으로 생성하는 computed 속성 추가
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

// 1차 카테고리 옵션 동적 생성
const firstCategoryOptions = computed(() => {
  if (!categoryData.value?.data?.data) return [];
  // categoryData에서 1차 카테고리 목록을 변환하여 반환
  return categoryData.value.data.data.map((category: { firstCategoryId: number; firstCategoryName: string }) => ({
    id: category.firstCategoryId, // 드롭다운에서 사용할 고유 ID, 값, 이름
    value: category.firstCategoryName,
    label: category.firstCategoryName,
  }));
});
// 2차 카테고리 옵션 동적 생성
const secondCategoryOptions = computed(() => {
  if (!categoryData.value?.data?.data || !firstCategorySelected.value) return [];
  // 선택된 1차 카테고리에 해당하는 카테고리 객체를 찾음
  const selectedFirstCategory = categoryData.value.data.data.find(
    // 현재 선택된 1차 카테고리의 ID와 일치하는 카테고리를 찾음
    (category: { firstCategoryId: number }) => category.firstCategoryId === firstCategorySelected.value.id,
  );

  // 선택된 1차 카테고리의 2차 카테고리 목록을 변환하여 반환
  return (
    selectedFirstCategory?.secondCategories.map((category: { secondCategoryId: number; name: string }) => ({
      id: category.secondCategoryId,
      value: category.name,
      label: category.name,
    })) || []
  );
});

// API 데이터로 초기값 설정
watch(
  // 감시할 대상 데이터들을 배열로 지정
  [detailData, categoryData, managerOptions],
  // 새로운 값들을 배열 구조분해로 받아서 처리하는 콜백 함수
  ([newDetailData, newCategoryData, options]) => {
    if (newDetailData && newCategoryData?.data?.data && options.length > 0) {
      prioritySelected.value = priority.find((p) => p.value === newDetailData.priority) || priority[2];
      statusSelected.value = ticket_status.find((s) => s.value === newDetailData.status) || ticket_status[0];
      // 1차 카테고리 설정
      const firstCategory = newCategoryData.data.data.find(
        // 티켓의 현재 1차 카테고리와 일치하는 카테고리 찾기
        (category: { firstCategoryName: string }) => category.firstCategoryName === newDetailData.firstCategory,
      );
      if (firstCategory) {
        firstCategorySelected.value = {
          id: firstCategory.firstCategoryId,
          value: firstCategory.firstCategoryName,
          label: firstCategory.firstCategoryName,
        };
        // 2차 카테고리 설정
        const secondCategory = firstCategory.secondCategories.find(
          // 티켓의 현재 2차 카테고리와 일치하는 카테고리 찾기
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
      // 담당자 설정, 티켓에 담당자가 있으면 해당 담당자를 찾고, 없으면 첫 번째 옵션 사용
      managerSelected.value = newDetailData.manager
        ? options.find((m) => m.value === newDetailData.manager)
        : options[0];
    }
  },
  { immediate: true }, // 컴포넌트 마운트 시 즉시 실행
);

// 본인인지 확인
const isMe = computed(() => {
  if (!detailData.value) return false;
  return memberStore.username === detailData.value.manager;
});

// 완료된 티켓의 담당자 변경 불가능
const isManagerChangeDisabled = computed(() => {
  // 현재 manager가 null이면 변경 가능
  if (!detailData.value?.manager) return false;
  // isMe가 false면서 manager가 있으면 disabled
  if (!isMe.value && detailData.value.manager) return true;
  // 상태가 CLOSED면 담당자 변경 불가
  return statusSelected.value.value === 'CLOSED';
});

// 공통 쿼리 무효화 함수
const invalidateTicketQueries = () => {
  queryClient.invalidateQueries({ queryKey: ['tickets'] });
  queryClient.invalidateQueries({ queryKey: ['search-tickets'] });
  queryClient.invalidateQueries({
    queryKey: ['ticket-detail', props.ticketId],
  });
  queryClient.invalidateQueries({ queryKey: ['ticket-comments', props.ticketId] });
};

// 현재 상태에 따른 사용 가능한 상태 옵션 계산
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

// 중요도 변경 뮤테이션
const priorityMutation = useCustomMutation(
  async ({ ticketId, priority }: { ticketId: number; priority: string }) => {
    const response = await ticketApi.patchTicketPriority(ticketId, { priority });
    return response.data;
  },
  {
    onSuccess: invalidateTicketQueries,
  },
);

// 티켓 완료 뮤테이션
const closeMutation = useCustomMutation(
  async (ticketId: number) => {
    const response = await ticketApi.patchTicketClose(ticketId);
    return response.data;
  },
  {
    onSuccess: invalidateTicketQueries,
  },
);
// 1차 카테고리 변경 뮤테이션
const firstCategoryMution = useCustomMutation(
  async ({ ticketId, firstCategory }: { ticketId: number; firstCategory: string }) => {
    const response = await ticketApi.patchTicketFirstCategory(ticketId, { firstCategory });
    return response.data;
  },
  {
    onSuccess: invalidateTicketQueries,
  },
);
// 2차 카테고리 변경 뮤테이션
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
// 담당자 변경 뮤테이션
const reassignMutation = useCustomMutation(
  async ({ ticketId, manager }: { ticketId: number; manager: string }) => {
    const response = await ticketApi.patchTicketAssign(ticketId, { manager });
    return response.data;
  },
  {
    onSuccess: invalidateTicketQueries,
  },
);

// 상태 변경 핸들러
const handleStatusSelect = async (option: BaseTicketOption) => {
  const currentStatus = statusSelected.value.value;
  const newStatus = option.value;

  try {
    if (currentStatus === 'IN_PROGRESS' && newStatus === 'CLOSED') {
      await closeMutation.mutateAsync(props.ticketId);
    }
    statusSelected.value = option;
  } catch (err) {
    console.error('상태 변경 실패:', err);
  }
};
// 중요도 변경
const handlePrioritySelect = async (option: BaseTicketOption) => {
  try {
    await priorityMutation.mutateAsync({
      ticketId: props.ticketId,
      priority: option.value,
    });
    prioritySelected.value = option;
  } catch (err) {
    console.error('중요도 변경 실패:', err);
  }
};
// 1차 카테고리 변경
const handleFirstCategorySelect = async (option: BaseTicketOption) => {
  try {
    await firstCategoryMution.mutateAsync({
      ticketId: props.ticketId,
      firstCategory: option.value,
    });
    firstCategorySelected.value = option;

    // 선택된 1차 카테고리에 해당하는 2차 카테고리들 찾기
    const selectedFirstCategory = categoryData.value?.data?.data.find(
      (category: { firstCategoryId: number }) => category.firstCategoryId === option.id,
    );

    // 2. 2차 카테고리를 첫 번째 요소로 설정
    if (selectedFirstCategory?.secondCategories?.length > 0) {
      const firstSecondCategoryOption = {
        id: selectedFirstCategory.secondCategories[0].secondCategoryId,
        value: selectedFirstCategory.secondCategories[0].name,
        label: selectedFirstCategory.secondCategories[0].name,
      };
      secondCategorySelected.value = firstSecondCategoryOption;

      // 3. 2차 카테고리 변경 API 호출
      await secondCategoryMutation.mutateAsync({
        ticketId: props.ticketId,
        firstCategoryId: option.id as number,
        secondCategory: firstSecondCategoryOption.value,
      });
    }
  } catch (err) {
    console.error('1차 카테고리 변경 실패:', err);
  }
};
// 2차 카테고리 변경
const handleSecondCategorySelect = async (option: BaseTicketOption) => {
  try {
    await secondCategoryMutation.mutateAsync({
      ticketId: props.ticketId,
      firstCategoryId: firstCategorySelected.value.id,
      secondCategory: option.value,
    });
    secondCategorySelected.value = option;
  } catch (err) {
    console.error('2차 카테고리 변경 실패:', err);
  }
};
// 담당자 변경
const handleManagerSelect = async (option: BaseTicketOption) => {
  try {
    await reassignMutation.mutateAsync({
      ticketId: props.ticketId,
      manager: option.value,
    });
    managerSelected.value = option;
  } catch (err) {
    console.error('담당자 변경 실패:', err);
  }
};

// 파일 다운로드 처리 함수
const handleFileDownload = async (fileUrl: string) => {
  try {
    // 파일명 추출
    const fileName = fileUrl.split('/').pop() || 'download';

    // 이미지 파일인 경우
    if (isImageFile(fileName)) {
      window.open(fileUrl, '_blank');
      return;
    }

    // 일반 파일인 경우 API 호출
    const response = await ticketApi.getTicketAttachment(String(props.ticketId), fileUrl);

    // response 타입에 따른 처리
    const blob =
      response.data instanceof Blob
        ? response.data
        : new Blob([response.data], {
            type: response.headers['content-type'] || 'application/octet-stream',
          });

    // 다운로드 링크 생성 및 클릭
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();

    // cleanup
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    }, 100);
  } catch (err) {
    console.error('파일 다운로드 실패:', err);
    alert('파일 다운로드에 실패했습니다.');
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
          <!-- 헤더 -->
          <header class="ticket-header">
            <div class="flex-stack justify-center">
              <p class="text-2xl">{{ detailData.title }}</p>
              <p class="text-sm text-gray-1">{{ detailData.customId }}</p>
            </div>
            <SvgIcon :icon="XIcon" class="cursor-pointer self-start" @click="handleClose" />
          </header>

          <!-- 컨텐츠 -->
          <div class="ticket-contents-div">
            <div class="flex gap-2.5 w-full">
              <!-- 왼쪽 섹션 -->
              <section class="ticket-section">
                <!-- 중요도 블록 -->
                <CustomDropdown
                  label="중요도"
                  :options="priority"
                  :selected-option="prioritySelected"
                  @select="handlePrioritySelect"
                  has-color
                  :disabled="!isMe"
                />
                <!-- 1차 카테고리 블록 -->
                <CustomDropdown
                  label="1차 카테고리"
                  :options="firstCategoryOptions"
                  :selected-option="firstCategorySelected"
                  @select="handleFirstCategorySelect"
                  :disabled="!isMe"
                />
                <!-- 요청자 블록 -->
                <div>
                  <label class="ticket-label">요청자</label>
                  <div class="manager-filter-btn w-full border-primary-2 justify-start gap-2">
                    <p class="text-sm text-gray-1">{{ detailData.username }}</p>
                  </div>
                </div>
                <!-- 요청 일자 블록 -->
                <div>
                  <label class="ticket-label">요청 일자</label>
                  <p class="ticket-date">{{ detailData.createdAt }}</p>
                </div>
              </section>

              <!-- 오른쪽 섹션 -->
              <section class="ticket-section">
                <!-- 진행상태 블록 -->
                <CustomDropdown
                  label="진행상태"
                  :options="availableStatusOptions"
                  :selected-option="statusSelected"
                  @select="handleStatusSelect"
                  has-color
                  :disabled="!isMe"
                />
                <!-- 2차 카테고리 블록 -->
                <CustomDropdown
                  label="2차 카테고리"
                  :options="secondCategoryOptions"
                  :selected-option="secondCategorySelected"
                  @select="handleSecondCategorySelect"
                  :disabled="!isMe"
                />
                <!-- 담당자 블록 -->
                <CustomDropdown
                  label="담당자"
                  :options="managerOptions"
                  :selected-option="managerSelected"
                  @select="handleManagerSelect"
                  :disabled="isManagerChangeDisabled"
                  isManager
                />
                <!-- 마감 기한 블록 -->
                <div>
                  <label class="ticket-label">마감 기한</label>
                  <p class="ticket-date">{{ detailData.dueDate }}</p>
                </div>
              </section>
            </div>

            <!-- 설명 -->
            <div class="mt-11">
              <label class="ticket-desc-label">설명</label>
              <div class="ticket-desc-area">
                <p class="ticket-desc-content">{{ detailData.content }}</p>
              </div>
            </div>

            <!-- 첨부파일 -->
            <div v-if="detailData.ticketAttachmentUrls?.length > 0" class="mt-4 space-y-2">
              <label class="ticket-label">첨부파일</label>
              <div class="space-y-2">
                <button
                  v-for="(fileUrl, index) in detailData.ticketAttachmentUrls"
                  :key="index"
                  @click="handleFileDownload(fileUrl)"
                  class="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-0 bg-gray-3 rounded-lg hover:bg-gray-2 transition-colors"
                >
                  <SvgIcon :icon="DownloadIcon" class="w-4 h-4" />
                  <span>{{ getFileType(fileUrl) }} 다운</span>
                </button>
              </div>
            </div>

            <ManagerComments :ticket-id="ticketId" />
          </div>
        </div>
      </template>
    </div>
  </Teleport>
</template>
