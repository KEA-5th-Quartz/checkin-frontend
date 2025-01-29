<script setup lang="ts">
import { ClipIcon, LikeIcon, SendIcon, XIcon } from '@/assets/icons/path';
import SvgIcon from '../../common/SvgIcon.vue';
import StatusBadge from '../../common/Badges/StatusBadge.vue';
import { computed, ref, watch } from 'vue';
import CustomDropdown from '../../common/CustomDropdown.vue';
import { BaseTicketOption } from '@/types/tickets';
import { priority, firstCategory, secondCategory, managerOptions, ticket_status } from '../ticketOptionTest';
import '@/assets/slideAnimation.css';
import { useCustomQuery } from '@/composables/useCustomQuery';
import { ticketApi } from '@/services/ticketService/ticketService';
import { useMemberStore } from '@/stores/memberStore';
import { useCustomMutation } from '@/composables/useCustomMutation';
import { useQueryClient } from '@tanstack/vue-query';

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

const { data: detailData, isLoading } = useCustomQuery(['ticket-detail', props.ticketId], async () => {
  try {
    const response = await ticketApi.getTicketDetail(props.ticketId);
    return response.data.data;
  } catch (err) {
    console.error('티켓 상세 조회 실패:', err);
    throw err;
  }
});

// 초기값 설정
const prioritySelected = ref<BaseTicketOption>(priority[0]);
const statusSelected = ref<BaseTicketOption>(ticket_status[0]);
const firstCategorySelected = ref(firstCategory[0]);
const secondCategorySelected = ref(secondCategory[0]);
const managerSelected = ref(managerOptions[0]);

// API 데이터로 초기값 설정
watch(
  detailData,
  (newData) => {
    if (newData) {
      prioritySelected.value = priority.find((p) => p.value === newData.priority) || priority[0];
      statusSelected.value = ticket_status.find((s) => s.value === newData.status) || ticket_status[0];
      firstCategorySelected.value = firstCategory.find((f) => f.value === newData.firstCategory) || firstCategory[0];
      secondCategorySelected.value =
        secondCategory.find((s) => s.value === newData.secondCategory) || secondCategory[0];
      managerSelected.value = managerOptions.find((m) => m.value === newData.manager) || managerOptions[0];
    }
  },
  { immediate: true },
);

const { data: commentData } = useCustomQuery(['ticket-comments', props.ticketId], async () => {
  try {
    const response = await ticketApi.getTicketComments(props.ticketId);
    return response.data.data;
  } catch (err) {
    console.error('티켓 댓글 조회 실패:', err);
    throw err;
  }
});

// 본인인지 확인
const isMe = computed(() => {
  if (!detailData.value) return false;
  return memberStore.username === detailData.value.manager;
});

// 완료된 티켓의 담당자 변경 불가능
const isManagerChangeDisabled = computed(() => {
  // isMe가 false면 무조건 disabled
  if (!isMe.value) return true;
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
};

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

// 상태 변경 뮤테이션들
const inProgressMutation = useCustomMutation(
  async ({ ticketId, status }: { ticketId: number; status: string }) => {
    const response = await ticketApi.patchTicketInProgress(ticketId, { status });
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

// 현재 상태에 따른 사용 가능한 상태 옵션 계산
const availableStatusOptions = computed(() => {
  const currentStatus = statusSelected.value.value;

  switch (currentStatus) {
    case 'CREATED':
      return ticket_status.filter((status) => ['CREATED', 'IN_PROGRESS'].includes(status.value));
    case 'IN_PROGRESS':
      return ticket_status.filter((status) => ['IN_PROGRESS', 'CLOSED'].includes(status.value));
    case 'CLOSED':
      return ticket_status.filter((status) => ['CLOSED'].includes(status.value));
    default:
      return ticket_status;
  }
});

// 상태 변경 핸들러
const handleStatusSelect = async (option: BaseTicketOption) => {
  const currentStatus = statusSelected.value.value;
  const newStatus = option.value;

  try {
    if (currentStatus === 'CREATED' && newStatus === 'IN_PROGRESS') {
      await inProgressMutation.mutateAsync({ ticketId: props.ticketId, status: 'in_progress' });
    } else if (currentStatus === 'IN_PROGRESS' && newStatus === 'CLOSED') {
      await closeMutation.mutateAsync(props.ticketId);
    }
    statusSelected.value = option;
  } catch (err) {
    console.error('상태 변경 실패:', err);
  }
};

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
// 1차 카테고리 변경
const handleFirstCategorySelect = async (option: BaseTicketOption) => {
  try {
    await firstCategoryMution.mutateAsync({
      ticketId: props.ticketId,
      firstCategory: option.value,
    });
    firstCategorySelected.value = option;

    // 2. 2차 카테고리를 첫 번째 요소로 설정
    const firstSecondCategoryOption = secondCategory[0];
    secondCategorySelected.value = firstSecondCategoryOption;

    // 3. 2차 카테고리 변경 API 호출
    await secondCategoryMutation.mutateAsync({
      ticketId: props.ticketId,
      firstCategoryId: option.id, // 새로 선택된 1차 카테고리의 ID
      secondCategory: firstSecondCategoryOption.value,
    });
  } catch (err) {
    console.error('1차 카테고리 변경 실패:', err);
  }
};

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

// 담당자 변경 뮤테이션
const reassignMutation = useCustomMutation(
  async ({ ticketId, manager }: { ticketId: number; manager: string }) => {
    const response = await ticketApi.patchTicketReassign(ticketId, { manager });
    return response.data;
  },
  {
    onSuccess: invalidateTicketQueries,
  },
);
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
</script>

<template>
  <Teleport to="body">
    <div v-if="ticketId" class="ticket-overlay">
      <div v-if="isLoading" class="loading-spinner">Loading...</div>
      <template v-else-if="detailData">
        <div class="ticket-click-outside" @click="handleClose" />
        <div class="ticket-container" :class="{ 'drawer-enter': show, 'drawer-leave': !show }">
          <!-- 헤더 -->
          <header class="ticket-header">
            <p class="text-2xl">{{ detailData.title }}</p>
            <SvgIcon :icon="XIcon" class="cursor-pointer" @click="handleClose" />
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
                  :options="firstCategory"
                  :selected-option="firstCategorySelected"
                  @select="handleFirstCategorySelect"
                  :disabled="!isMe"
                />
                <!-- 요청자 블록 -->
                <div>
                  <label class="ticket-label">요청자</label>
                  <div class="manager-filter-btn w-full border-primary-2 justify-start gap-2">
                    <div class="w-5 h-5 bg-green-500 rounded-full" />
                    <p class="text-xs text-gray-1">{{ detailData.username }}</p>
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
                  :options="secondCategory"
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
            <div class="mt-4">
              <div class="ticket-attachment">Customer KYC</div>
            </div>

            <!-- 댓글 창 -->
            <div class="ticket-comment-container">
              <!-- 로그 -->
              <div v-if="commentData">
                <div v-for="item in commentData.activities" :key="item.type === 'LOG' ? item.log_id : item.comment_id">
                  <!-- 로그 표시 -->
                  <div v-if="item.type === 'LOG'" class="ticket-comment-log">
                    <div class="w-8 h-8 bg-blue-300 rounded-full" />
                    <div>
                      <p class="text-sm text-gray-1">
                        {{ item.log_content }}
                        {{ new Date(item.created_at).toLocaleString() }}
                      </p>
                    </div>
                  </div>

                  <!-- 댓글 표시 -->
                  <div v-else class="flex gap-2 mb-4">
                    <div class="flex-stack gap-2">
                      <div class="w-8 h-8 bg-blue-300 rounded-full" />
                      <p class="text-xs whitespace-nowrap">user{{ item.member_id }}</p>
                    </div>
                    <div class="ticket-comment-bubble">
                      <p class="text-sm">{{ item.comment_content }}</p>
                      <p class="text-xs text-gray-500 mt-1">
                        {{ new Date(item.created_at).toLocaleString() }}
                      </p>
                    </div>
                    <SvgIcon :icon="LikeIcon" class-name="flex self-end cursor-pointer" />
                  </div>
                </div>
              </div>
            </div>

            <!-- 댓글 인풋 -->
            <div class="ticket-comment-input-area">
              <textarea placeholder="댓글을 작성하세요" class="ticket-comment-textarea" />
              <div class="flex gap-2 w-full justify-end pb-1.5">
                <SvgIcon :icon="ClipIcon" class="cursor-pointer" />
                <SvgIcon :icon="SendIcon" class="cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </Teleport>
</template>
