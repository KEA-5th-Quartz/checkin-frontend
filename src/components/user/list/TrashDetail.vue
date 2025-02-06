<script setup lang="ts">
import { XIcon } from '@/assets/icons/path';
import SvgIcon from '@/components/common/SvgIcon.vue';
import { useCustomQuery } from '@/composables/useCustomQuery';
import { ticketApi } from '@/services/ticketService/ticketService';
import { useQueryClient } from '@tanstack/vue-query';
import { ref } from 'vue';

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

// 티켓 상세 페치
const { data: detailData } = useCustomQuery(['ticket-detail', props.ticketId], async () => {
  try {
    const response = await ticketApi.getTicketDetail(props.ticketId);
    return response.data.data;
  } catch (err) {
    console.error('티켓 상세 조회 실패:', err);
    throw err;
  }
});
</script>

<template>
  <Teleport to="body">
    <div v-if="ticketId && detailData" class="ticket-overlay">
      <div class="ticket-click-outside" @click="handleClose" />
      <div class="ticket-container" :class="{ 'drawer-enter': show, 'drawer-leave': !show }">
        <!-- 헤더 -->
        <header class="ticket-header">
          <p>{{ detailData.ticket.title }}</p>

          <div class="flex items-center gap-8">
            <SvgIcon :icon="XIcon" class="cursor-pointer" @click="handleClose" />
          </div>
        </header>

        <!-- 컨텐츠 -->
        <div class="ticket-contents-div">
          <div class="flex gap-2.5 w-full">
            <!-- 왼쪽 섹션 -->
            <section class="ticket-section">
              <!-- 진행상태 블록 -->
              <div class="flex-stack items-start">
                <label class="ticket-label">진행상태</label>
                <StatusBadge :status="detailData?.status" size="xl" />
              </div>

              <!-- 1차 카테고리 블록 -->
              <div>
                <label class="ticket-label">1차 카테고리</label>
                <div
                  class="border border-gray-2 rounded-xl py-2 px-4 text-gray-1 text-sm line-clamp-1 overflow-scroll hide-scrollbar"
                >
                  {{ detailData.ticket.firstCategory }}
                </div>
              </div>
              <!-- 요청자 블록 -->
              <div>
                <label class="ticket-label">요청자</label>
                <div class="manager-filter-btn w-full rounded-xl border-gray-2 justify-start gap-2">
                  <p class="text-sm text-gray-1">{{ detailData?.username }}</p>
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
              <!-- 2차 카테고리 블록 -->
              <div class="mt-[76px]">
                <label class="ticket-label">2차 카테고리</label>
                <div class="border border-gray-2 rounded-xl py-2 px-4 text-gray-1 text-sm">
                  {{ detailData.ticket.secondCategory }}
                </div>
              </div>
              <!-- 담당자 블록 -->
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
              <!-- 마감 기한 블록 -->
              <div>
                <label class="ticket-label">마감 기한</label>
                <p class="ticket-date">
                  {{ detailData.ticket.due_date }}
                </p>
              </div>
            </section>
          </div>

          <!-- 설명 -->
          <div class="mt-11">
            <label class="ticket-desc-label">설명</label>
            <div class="ticket-desc-area">
              <p class="ticket-desc-content">{{ detailData.ticket.content }}</p>
            </div>
          </div>

          <!-- 첨부 파일 -->
          <div class="mt-4">
            <div class="ticket-attachment">Customer KYC</div>
          </div>

          <UserComment :ticket-id="ticketId" />
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
