<script setup lang="ts">
import { ArrowDownIcon } from '@/assets/icons/path';
import CustomPagination from '@/components/common/CustomPagination.vue';
import SvgIcon from '@/components/common/SvgIcon.vue';
import { perPageOptions } from '@/components/manager/ticketOptionTest';
import { useCustomMutation } from '@/composables/useCustomMutation';
import { useCustomQuery } from '@/composables/useCustomQuery';
import { ticketApi } from '@/services/ticketService/ticketService';
import { useUserTrashListStore } from '@/stores/userTrashStore';
import { DialogProps, initialDialog } from '@/types/common/dialog';
import { useQueryClient } from '@tanstack/vue-query';
import { onClickOutside } from '@vueuse/core';
import { computed, onBeforeUnmount, ref } from 'vue';
import TrashDetail from './TrashDetail.vue';
import CommonDialog from '@/components/common/CommonDialog.vue';
import StatusBadge from '@/components/common/Badges/StatusBadge.vue';

const trashStore = useUserTrashListStore();
const queryClient = useQueryClient();

const currentPage = ref(parseInt(sessionStorage.getItem('trashCurrentPage') || '1'));
const pageSize = ref(perPageOptions[0].value);
const dialogState = ref<DialogProps>({ ...initialDialog });

const handlePageChange = (page: number) => {
  currentPage.value = page;
  sessionStorage.setItem('trashCurrentPage', page.toString());
};

const selectedTicketId = ref<number | null>(null);
const selectedPerPage = ref(perPageOptions[0]);
const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

onClickOutside(dropdownRef, () => (isOpen.value = false));

const selectOption = (option: { id: number; value: number; label: string }) => {
  selectedPerPage.value = option;
  pageSize.value = option.value;
  currentPage.value = 1;
  sessionStorage.setItem('trashCurrentPage', '1');
  isOpen.value = false;
};

const queryParams = computed(() => ({
  page: currentPage.value,
  size: pageSize.value,
}));

const { data: trashData } = useCustomQuery(['trash-list', queryParams], async () => {
  try {
    const response = await ticketApi.getTrashTickets({
      page: currentPage.value,
      size: pageSize.value,
    });
    return response.data.data;
  } catch (err) {
    console.error('휴지통 목록 조회 실패:', err);
    throw err;
  }
});

// 복구 뮤테이션
const restoreMutation = useCustomMutation(
  async ({ ticketIds }: { ticketIds: number[] }) => {
    const response = await ticketApi.patchTrashTicket({ ticketIds });
    return response.data;
  },
  {
    onSuccess: () => {
      queryClient.refetchQueries();
    },
  },
);

const handleRestore = () => {
  // Set을 배열로 변환하여 선택된 티켓 ID들을 가져옴
  const selectedTicketIds = Array.from(trashStore.selectedTickets);
  const ticketCount = selectedTicketIds.length;

  dialogState.value = {
    open: true,
    title: `${ticketCount}개의 티켓을 복구하시겠습니까?`,
    cancelText: '취소',
    onCancelClick: () => {
      dialogState.value = { ...initialDialog };
    },
    mainText: '복구',
    onMainClick: () => {
      restoreMutation.mutate({ ticketIds: selectedTicketIds });

      trashStore.clearSelectedTickets(); // 선택된 티켓 초기화
      dialogState.value = { ...initialDialog }; // 다이얼로그 닫기
    },
  };
};

// 영구 삭제 뮤테이션
const deleteMutation = useCustomMutation(
  async ({ ticketIds }: { ticketIds: number[] }) => {
    const response = await ticketApi.deleteTrashTickets({ ticketIds });
    return response.data;
  },
  {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trash-list'] });
    },
  },
);

const handleDelete = () => {
  // Set을 배열로 변환하여 선택된 티켓 ID들을 가져옴
  const selectedTicketIds = Array.from(trashStore.selectedTickets);
  const ticketCount = selectedTicketIds.length;

  dialogState.value = {
    open: true,
    isWarn: true,
    title: `${ticketCount}개의 티켓을 영구 삭제하시겠습니까?`,
    content: '영구 삭제된 티켓은 복구할 수 없습니다.',
    cancelText: '취소',
    onCancelClick: () => {
      dialogState.value = { ...initialDialog };
    },
    mainText: '삭제',
    onMainClick: () => {
      deleteMutation.mutate({ ticketIds: selectedTicketIds });

      trashStore.clearSelectedTickets(); // 선택된 티켓 초기화
      dialogState.value = { ...initialDialog }; // 다이얼로그 닫기
    },
  };
};

const handleCheckboxClick = (event: Event, id: number) => {
  // 체크박스 클릭 시 이벤트 전파 중지 (행 클릭 이벤트 방지)
  event.stopPropagation();

  if (trashStore.selectedTickets.has(id)) {
    trashStore.removeSelectedTicket(id);
  } else {
    trashStore.addSelectedTicket(id);
  }
};

const handleRowClick = (id: number) => {
  selectedTicketId.value = id;
};
const handleCloseModal = () => {
  selectedTicketId.value = null;
};

onBeforeUnmount(() => {
  sessionStorage.setItem('trashCurrentPage', currentPage.value.toString());
});
</script>

<template>
  <article class="py-10 relative mt-5">
    <header class="w-full flex justify-between gap-6">
      <div>
        <p class="pl-12 text-xl font-semibold">삭제된 항목은 30일간 휴지통에 보관됩니다.</p>
      </div>
      <div v-if="trashData?.tickets?.length !== 0 || !trashData" class="flex gap-8">
        <div ref="dropdownRef" class="relative">
          <button @click="isOpen = !isOpen" class="manager-filter-btn">
            <span class="font-medium">{{ selectedPerPage.label }}</span>
            <SvgIcon :icon="ArrowDownIcon" :class="['transition-02s', isOpen ? 'rotate-180' : '']" />
          </button>

          <div v-if="isOpen" class="manager-filter-menu w-[112px]">
            <ul>
              <li
                v-for="option in perPageOptions"
                :key="option.id"
                @click="selectOption(option)"
                class="board-size-menu"
              >
                {{ option.label }}
              </li>
            </ul>
          </div>
        </div>

        <div v-if="trashData?.tickets?.length !== 0 || !trashData" class="flex items-center gap-4 pr-10">
          <button @click="handleRestore" class="btn-cancel py-2">복구</button>
          <button @click="handleDelete" class="btn-main py-2">삭제</button>
        </div>
      </div>
    </header>

    <CommonDialog
      v-if="dialogState.open"
      :isWarn="dialogState.isWarn"
      :title="dialogState.title"
      :cancelText="dialogState.cancelText"
      :mainText="dialogState.mainText"
      :onCancelClick="dialogState.onCancelClick"
      :onMainClick="dialogState.onMainClick"
    />

    <section class="overflow-y-auto mt-4 px-5 mb-10 hide-scrollbar">
      <div class="h-[calc(100vh-290px)]">
        <table class="min-w-full">
          <thead class="manager-thead">
            <tr>
              <th class="manager-th w-[5%] pl-6">선택</th>
              <th class="manager-th w-[20%] pl-6">번호</th>
              <th class="manager-th text-start w-[20%]">제목</th>
              <th class="manager-th text-start w-[27.5%]">요청사항</th>
              <th class="manager-th w-[7.5%]">진행 상태</th>
              <th class="manager-th w-[10%]">담당자</th>
              <th class="manager-th w-[5%]">마감일</th>
            </tr>
          </thead>

          <tbody class="whitespace-nowrap">
            <tr v-if="trashData?.tickets?.length === 0 || !trashData">
              <td colspan="8" class="text-center py-6 text-gray-500">휴지통에 항목이 존재하지 않습니다.</td>
            </tr>
            <tr
              v-for="ticket in trashData?.tickets"
              :key="ticket.ticketId"
              class="hover:bg-white-1"
              @click="handleRowClick(ticket.ticketId)"
            >
              <td class="manager-td">
                <div class="flex-center">
                  <input
                    type="checkbox"
                    :class="['w-4 h-4 cursor-pointer']"
                    :checked="trashStore.selectedTickets.has(ticket.ticketId)"
                    @click="(e) => handleCheckboxClick(e, ticket.ticketId)"
                  />
                </div>
              </td>
              <td class="manager-td max-w-0 pl-6">
                <p :title="ticket.customId.toString()">
                  {{ ticket.customId }}
                </p>
              </td>
              <td class="manager-td max-w-0 text-start">
                <p class="truncate" :title="ticket.title">
                  {{ ticket.title }}
                </p>
              </td>
              <td class="manager-td max-w-0">
                <p class="truncate">
                  {{ ticket.content }}
                </p>
              </td>
              <td class="manager-td text-center">
                <StatusBadge :status="ticket.status" size="md" />
              </td>
              <td class="manager-td">
                <div class="flex items-center gap-2 ml-4 w-full">
                  <img
                    v-if="ticket.manager !== null"
                    :src="ticket.managerProfilePic"
                    class="h-7 max-w-7 rounded-full object-fill"
                  />
                  <span class="truncate" :class="ticket.manager ? '' : 'flex-center w-full mr-3'">
                    {{ ticket.manager || '━' }}
                  </span>
                </div>
              </td>
              <td class="manager-td">
                <p class="truncate">
                  {{ ticket.dueDate }}
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <TrashDetail v-if="selectedTicketId" :ticket-id="selectedTicketId" @close="handleCloseModal" />
    </section>

    <CustomPagination
      v-if="trashData?.tickets?.length !== 0 || !trashData"
      :items-per-page="pageSize"
      :current-page="currentPage"
      :total-pages="trashData?.totalPages || 1"
      :visible-pages="5"
      @page-change="handlePageChange"
    />
  </article>
</template>
