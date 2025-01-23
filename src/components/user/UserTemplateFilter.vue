<script setup lang="ts">
import { TrashcanIcon } from '../../assets/icons/path';
import SvgIcon from '../common/SvgIcon.vue';
import { useUserTicketListStore } from '../../stores/userTicketListStore';

const ticketStore = useUserTicketListStore();

const handleCancel = () => {
  ticketStore.toggleDeleteMode();
  ticketStore.clearSelectedTickets();
};

const handleDelete = () => {
  console.log('삭제 확인 모달 등장');
};
</script>

<template>
  <section v-if="!ticketStore.isDeleteMode" class="flex justify-between mx-auto w-[95%] mt-[50px]">
    <!-- 필터 -->
    <div class="flex items-center gap-10 w-full">
      <SvgIcon :icon="TrashcanIcon" class="cursor-pointer ml-auto" @click="ticketStore.toggleDeleteMode" />
    </div>
  </section>

  <section v-else class="flex justify-between mx-auto w-[95%] mt-14">
    <div class="flex items-center gap-4 ml-auto">
      <button @click="handleCancel" class="px-6 py-2 text-sm border border-gray-1 rounded-lg hover:bg-gray-100">
        취소
      </button>
      <button
        @click="handleDelete"
        class="px-6 py-2 text-sm text-white bg-primary-0 rounded-lg hover:bg-opacity-80 text-white-0"
      >
        삭제
      </button>
    </div>
  </section>
</template>
