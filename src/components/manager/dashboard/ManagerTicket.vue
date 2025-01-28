<script setup lang="ts">
import { ClipIcon, LikeIcon, SendIcon, XIcon } from '@/assets/icons/path';
import SvgIcon from '../../common/SvgIcon.vue';
import StatusBadge from '../../common/Badges/StatusBadge.vue';
import { computed, ref, watch } from 'vue';
import CustomDropdown from '../../common/CustomDropdown.vue';
import { StatusTicketOption, BaseTicketOption } from '@/types/tickets';
import { priority, firstCategory, secondCategory, managerOptions, ticket_status } from '../ticketOptionTest';
import '@/assets/slideAnimation.css';
import { useCustomQuery } from '@/composables/useCustomQuery';
import { ticketApi } from '@/services/ticketService/ticketService';
import { useMemberStore } from '@/stores/memberStore';

const memberStore = useMemberStore();

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
const prioritySelected = ref<StatusTicketOption>(priority[0]);
const statusSelected = ref<StatusTicketOption>(ticket_status[0]);
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

const isMe = computed(() => {
  if (!detailData.value) return false;
  return memberStore.username === detailData.value.manager;
});

const handlePrioritySelect = (option: StatusTicketOption) => {
  console.log('중요도 변경:', option.label);
  prioritySelected.value = option;
};

const handleStatusSelect = (option: StatusTicketOption) => {
  console.log('상태 변경:', option.label);
  statusSelected.value = option;
};

const handleFirstCategorySelect = (option: BaseTicketOption) => {
  console.log('1차 카테고리 변경:', option.label);
  firstCategorySelected.value = option;
};

const handleSecondCategorySelect = (option: BaseTicketOption) => {
  console.log('2차 카테고리 변경:', option.label);
  secondCategorySelected.value = option;
};

const handleManagerSelect = (option: BaseTicketOption) => {
  console.log('담당자 변경:', option.label);
  managerSelected.value = option;
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
                  :onOptionSelect="handlePrioritySelect"
                  @select="(option) => handlePrioritySelect(option as StatusTicketOption)"
                  has-color
                  :disabled="!isMe"
                />
                <!-- 1차 카테고리 블록 -->
                <CustomDropdown
                  label="1차 카테고리"
                  :options="firstCategory"
                  :selected-option="firstCategorySelected"
                  :onOptionSelect="handleFirstCategorySelect"
                  @select="(option) => handleFirstCategorySelect(option)"
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
                  :options="ticket_status"
                  :selected-option="statusSelected"
                  :onOptionSelect="handleStatusSelect"
                  @select="(option) => handleStatusSelect(option as StatusTicketOption)"
                  has-color
                  :disabled="!isMe"
                />
                <!-- 2차 카테고리 블록 -->
                <CustomDropdown
                  label="2차 카테고리"
                  :options="secondCategory"
                  :selected-option="secondCategorySelected"
                  :onOptionSelect="handleSecondCategorySelect"
                  @select="(option) => handleSecondCategorySelect(option)"
                  :disabled="!isMe"
                />
                <!-- 담당자 블록 -->
                <CustomDropdown
                  label="담당자"
                  :options="managerOptions"
                  :selected-option="managerSelected"
                  :onOptionSelect="handleManagerSelect"
                  @select="(option) => handleManagerSelect(option)"
                  :disabled="!isMe"
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
              <div class="ticket-comment-log">
                <div class="w-8 h-8 bg-blue-300 rounded-full" />
                <div>
                  <p class="text-sm text-gray-1">Neo.js 상태 변경 2025-01-17 13:27</p>
                  <div class="flex gap-2">
                    <StatusBadge status="OPEN" size="sm" />
                    <span>→</span>
                    <StatusBadge status="IN_PROGRESS" size="sm" />
                  </div>
                </div>
              </div>

              <!-- 댓글 -->
              <div class="flex gap-2">
                <div class="flex-stack gap-2">
                  <div class="w-8 h-8 bg-blue-300 rounded-full" />
                  <p class="text-xs whitespace-nowrap">Neo.js</p>
                </div>
                <div class="ticket-comment-bubble">
                  <p class="text-sm">
                    화면에 출력된 로그좀 볼 수 있을까요? 스샷 첨부 부탁 드려요. 사용하시는 계정과 서버 호스트명도
                    부탁드립니다.
                  </p>
                </div>
                <SvgIcon :icon="LikeIcon" class-name="flex self-end cursor-pointer" />
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
