<script setup lang="ts">
import { ClipIcon, LikeIcon, PencilIcon, SendIcon, XIcon } from '@/assets/icons/path';
import SvgIcon from '../common/SvgIcon.vue';
import { computed, ref, watch } from 'vue';
import PriorityBadge from '../common/Badges/PriorityBadge.vue';
import StatusBadge from '../common/Badges/StatusBadge.vue';
import { useTicketStore } from '@/stores/userTicketStore';
import { firstCategory, secondCategory } from '../manager/ticketOptionTest';
import { BaseTicketOption } from '@/types/tickets';
import CustomDropdown from '../common/CustomDropdown.vue';
import '@/assets/slideAnimation.css';
import { useMemberStore } from '@/stores/memberStore';
import { useQueryClient } from '@tanstack/vue-query';
import { useCustomQuery } from '@/composables/useCustomQuery';
import { ticketApi } from '@/services/ticketService/ticketService';
import { formatMinusDate } from '@/utils/dateFormat';
import { useCustomMutation } from '@/composables/useCustomMutation';

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
    handleCancelEdit();
  }, 300);
};

const { data: detailData } = useCustomQuery(['ticket-detail', props.ticketId], async () => {
  try {
    const response = await ticketApi.getTicketDetail(props.ticketId);
    return response.data.data;
  } catch (err) {
    console.error('티켓 상세 조회 실패:', err);
    throw err;
  }
});

const commentContent = ref('');
// 댓글 데이터 페치
const { data: commentData } = useCustomQuery(['ticket-comments', props.ticketId], async () => {
  try {
    const response = await ticketApi.getTicketComments(props.ticketId);
    return response.data.data;
  } catch (err) {
    console.error('티켓 댓글 조회 실패:', err);
    throw err;
  }
});
// 댓글 작성 뮤테이션
const commentsMutation = useCustomMutation(
  async ({ ticketId, content }: { ticketId: number; content: string }) => {
    const response = await ticketApi.postTicketComments(ticketId, { content });
    return response.data;
  },
  {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket-comments', props.ticketId] });
    },
  },
);
// 댓글 작성 함수
const handleAddComments = async () => {
  if (!commentContent.value.trim()) return; // 빈 댓글 방지
  try {
    await commentsMutation.mutateAsync({
      ticketId: props.ticketId,
      content: commentContent.value,
    });
    // 성공적으로 댓글이 작성되면 textarea 비우기
    commentContent.value = '';
  } catch (err) {
    console.error('댓글 작성 실패:', err);
  }
};

const ticketStore = useTicketStore();

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

const handleCancelEdit = () => {
  ticketStore.resetToOriginal();
  ticketStore.isEditMode = false;
};

const handleConfirmEdit = () => {
  ticketStore.toggleEditMode();
};

const startEdit = () => {
  ticketStore.toggleEditMode();
};

const createComputedProperty = (options: BaseTicketOption[], field: keyof typeof ticketStore.ticket) => {
  return computed({
    get: () => options.find((option) => option.label === ticketStore.ticket?.[field]) || options[0],
    set: (newValue: BaseTicketOption) => {
      if (ticketStore.ticket) {
        ticketStore.updateTicket({
          ...ticketStore.ticket,
          [field]: newValue.label,
        });
      }
    },
  });
};

const formattedDueDate = computed({
  get: () => {
    return formatMinusDate(ticketStore.ticket.due_date);
  },
  set: (newValue: string) => {
    // '-' 형식을 '/' 형식으로 변환하여 저장
    const formattedValue = newValue.replace(/-/g, '/');
    ticketStore.updateTicket({
      ...ticketStore.ticket,
      due_date: formattedValue,
    });
  },
});

const firstCategorySelected = createComputedProperty(firstCategory, 'firstCategory');
const secondCategorySelected = createComputedProperty(secondCategory, 'secondCategory');

const handleOptionSelect = (field: keyof typeof ticketStore.ticket) => (option: BaseTicketOption) => {
  if (ticketStore.ticket) {
    ticketStore.updateTicket({
      ...ticketStore.ticket,
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
    <div v-if="ticketId && ticketStore.ticket && detailData" class="ticket-overlay">
      <div class="ticket-click-outside" @click="handleClose" />
      <div class="ticket-container" :class="{ 'drawer-enter': show, 'drawer-leave': !show }">
        <!-- 헤더 -->
        <header class="ticket-header">
          <p v-if="!ticketStore.isEditMode">{{ ticketStore.ticket.title }}</p>
          <input v-else v-model="ticketStore.ticket.title" class="ticket-edit-input" />
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

        <!-- 컨텐츠 -->
        <div class="ticket-contents-div">
          <div class="flex gap-2.5 w-full">
            <!-- 왼쪽 섹션 -->
            <section class="ticket-section">
              <!-- 중요도 블록 -->
              <div class="flex-stack items-start">
                <label class="ticket-label">중요도</label>
                <div class="py-1">
                  <PriorityBadge :priority="detailData?.priority" size="lg" />
                </div>
              </div>

              <!-- 1차 카테고리 블록 -->
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
                  :options="firstCategory"
                  :selected-option="firstCategorySelected"
                  :onOptionSelect="handleOptionSelect('firstCategory')"
                  @select="(option: BaseTicketOption) => (firstCategorySelected = option)"
                  isEdit
                />
              </div>
              <!-- 요청자 블록 -->
              <div>
                <label class="ticket-label">요청자</label>
                <div class="manager-filter-btn w-full rounded-xl border-gray-2 justify-start gap-2">
                  <div class="w-5 h-5 bg-green-500 rounded-full" />
                  <p class="text-xs text-gray-1">{{ detailData?.username }}</p>
                </div>
              </div>
              <!-- 요청 일자 블록 -->
              <div>
                <label class="ticket-label">요청 일자</label>
                <p class="ticket-date">{{ detailData?.createdAt }}</p>
              </div>
            </section>

            <!-- 오른쪽 섹션 -->
            <section class="ticket-section">
              <!-- 진행상태 블록 -->
              <div class="flex-stack items-start">
                <label class="ticket-label">진행상태</label>
                <StatusBadge :status="detailData?.status" size="xl" />
              </div>

              <!-- 2차 카테고리 블록 -->
              <div>
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
                  :options="secondCategory"
                  :selected-option="secondCategorySelected"
                  :onOptionSelect="handleOptionSelect('secondCategory')"
                  @select="(option: BaseTicketOption) => (secondCategorySelected = option)"
                  isEdit
                />
              </div>
              <!-- 담당자 블록 -->
              <div>
                <label class="ticket-label">담당자</label>
                <div class="manager-filter-btn w-full rounded-xl border-gray-2 justify-start gap-2">
                  <div class="w-5 h-5 bg-green-500 rounded-full" />
                  <p class="text-xs text-gray-1">{{ detailData?.manager }}</p>
                </div>
              </div>
              <!-- 마감 기한 블록 -->
              <div>
                <label class="ticket-label">마감 기한</label>
                <p v-if="!ticketStore.isEditMode" class="ticket-date">
                  {{ formatMinusDate(ticketStore.ticket.due_date) }}
                </p>
                <input
                  v-else
                  type="date"
                  :min="new Date().toISOString().split('T')[0]"
                  class="ticket-date ticket-edit-input py-2"
                  v-model="formattedDueDate"
                />
              </div>
            </section>
          </div>

          <!-- 설명 -->
          <div class="mt-11">
            <label class="ticket-desc-label">설명</label>
            <div v-if="!ticketStore.isEditMode" class="ticket-desc-area">
              <p class="ticket-desc-content">{{ ticketStore.ticket.content }}</p>
            </div>
            <div v-else>
              <textarea v-model="ticketStore.ticket.content" class="ticket-desc-textarea" />
              <div class="flex w-full justify-end pr-2 cursor-pointer">
                <SvgIcon :icon="ClipIcon" />
              </div>
            </div>
          </div>

          <!-- 첨부 파일 -->
          <div class="mt-4" v-if="!ticketStore.isEditMode">
            <div class="ticket-attachment">Customer KYC</div>
          </div>

          <!-- 댓글 입력창 -->
          <div class="ticket-comment-container">
            <!-- 로그 -->
            <div v-if="commentData">
              <div v-for="item in commentData.activities" :key="item.type === 'LOG' ? item.log_id : item.comment_id">
                <!-- 로그 표시 -->
                <div v-if="item.type === 'LOG'" class="ticket-comment-log">
                  <div class="flex-stack items-center">
                    <p class="text-xs text-gray-1">
                      {{ new Date(item.createdAt).toLocaleString() }}
                    </p>
                    <p class="ticket-log-p-content">
                      {{ item.logContent }}
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
                      {{ new Date(item.createdAt).toLocaleString() }}
                    </p>
                  </div>
                  <SvgIcon :icon="LikeIcon" class-name="flex self-end cursor-pointer" />
                </div>
              </div>
            </div>
          </div>

          <!-- 댓글 인풋 -->
          <div v-if="!ticketStore.isEditMode" class="ticket-comment-input-area">
            <textarea v-model="commentContent" placeholder="댓글을 작성하세요" class="ticket-comment-textarea" />
            <div class="flex gap-2 w-full justify-end pb-1.5">
              <SvgIcon :icon="ClipIcon" class="cursor-pointer" />
              <SvgIcon :icon="SendIcon" class="cursor-pointer" @click="handleAddComments" />
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
