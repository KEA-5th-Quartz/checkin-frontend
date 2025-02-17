<script setup lang="ts">
import { XIcon } from '@/assets/icons/path';
import SvgIcon from '@/components/common/SvgIcon.vue';
import StatusBadge from '@/components/common/Badges/StatusBadge.vue';
import { useCustomQuery } from '@/composables/useCustomQuery';
import { ticketApi } from '@/services/ticketService/ticketService';
import { ref } from 'vue';
import CommonDialog from '@/components/common/CommonDialog.vue';
import { DialogProps, initialDialog } from '@/types/common/dialog';
import { handleError } from '@/utils/handleError';

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
const dialogState = ref<DialogProps>({ ...initialDialog });

const { data: detailData } = useCustomQuery(['ticket-detail', props.ticketId], async () => {
  try {
    const response = await ticketApi.getTicketDetail(props.ticketId);
    return response.data.data;
  } catch (err) {
    handleError(dialogState, '티켓 상세 조회 실패');
    throw err;
  }
});
</script>

<template>
  <Teleport to="body">
    <div v-if="props.ticketId && detailData" class="ticket-overlay">
      <div class="ticket-click-outside" @click="handleClose" />
      <div class="ticket-container" :class="{ 'drawer-enter': show, 'drawer-leave': !show }">
        <header class="ticket-header">
          <div>
            <p>{{ detailData.title }}</p>
            <p class="sm-gray-1">{{ detailData.customId }}</p>
          </div>
          <div class="flex items-center gap-8 self-start">
            <SvgIcon :icon="XIcon" class="cursor-pointer" @click="handleClose" />
          </div>
        </header>

        <div class="ticket-contents-div">
          <div class="flex gap-2.5 w-full">
            <section class="ticket-section">
              <div class="flex-stack items-start">
                <label class="ticket-label">진행상태</label>
                <StatusBadge :status="detailData.status" size="xl" />
              </div>

              <div>
                <label class="ticket-label">1차 카테고리</label>
                <div
                  class="border border-gray-2 rounded-xl py-2 px-4 text-gray-1 text-sm line-clamp-1 overflow-scroll hide-scrollbar"
                >
                  {{ detailData.firstCategory }}
                </div>
              </div>

              <div>
                <label class="ticket-label">요청자</label>
                <div class="manager-filter-btn w-full rounded-xl border-gray-2 justify-start gap-2">
                  <p class="sm-gray-1">{{ detailData.username }}</p>
                </div>
              </div>

              <div>
                <label class="ticket-label">요청 일자</label>
                <p class="ticket-date">{{ detailData.createdAt }}</p>
              </div>
            </section>

            <section class="ticket-section">
              <div class="mt-[76px]">
                <label class="ticket-label">2차 카테고리</label>
                <div class="border border-gray-2 rounded-xl py-2 px-4 text-gray-1 text-sm">
                  {{ detailData.secondCategory }}
                </div>
              </div>

              <div>
                <label class="ticket-label">담당자</label>
                <div class="manager-filter-btn w-full rounded-xl border-gray-2 justify-start gap-2">
                  <img
                    v-if="detailData.managerProfilePic"
                    :src="detailData.managerProfilePic"
                    class="w-5 h-5 object-fill rounded-full mr-2"
                  />
                  <p class="text-xs text-gray-1">{{ detailData.manager || '━' }}</p>
                </div>
              </div>

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
        </div>
      </div>
    </div>
  </Teleport>
  <CommonDialog
    v-if="dialogState.open"
    :isOneBtn="dialogState.isOneBtn"
    :title="dialogState.title"
    :mainText="dialogState.mainText"
    :onCancelClick="dialogState.onMainClick"
    :onMainClick="dialogState.onMainClick"
  />
</template>
