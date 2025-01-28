<script setup lang="ts">
import { ref, computed } from 'vue';
import PriorityBadge from '../../common/Badges/PriorityBadge.vue';
import StatusBadge from '../../common/Badges/StatusBadge.vue';
import ManagerTicket from './ManagerTicket.vue';
import { useCustomQuery } from '@/composables/useCustomQuery';
import { ticketApi } from '@/services/ticketService/ticketService';

interface Ticket {
  ticketId: number;
  title: string;
  firstCategory: string;
  secondCategory: string;
  manager: string;
  content: string;
  dueDate: string;
  priority: 'EMERGENCY' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
}

interface TicketResponse {
  page: number;
  size: number;
  totalPages: number;
  totalTickets: number;
  tickets: Ticket[];
}

const selectedTicketId = ref<number | null>(null);
const currentPage = ref(1);
const pageSize = ref(10);

// Query Parameters
const queryParams = computed(() => ({
  page: currentPage.value,
  size: pageSize.value,
  statuses: '',
  usernames: '',
  categories: '',
  priorities: '',
  dueToday: false,
  dueThisWeek: false,
}));

// 데이터 페칭
const {
  data: ticketData,
  isLoading,
  error,
} = useCustomQuery<TicketResponse>(['tickets', queryParams], () =>
  ticketApi
    .getTickets(
      queryParams.value.statuses,
      queryParams.value.usernames,
      queryParams.value.categories,
      queryParams.value.priorities,
      queryParams.value.dueToday,
      queryParams.value.dueThisWeek,
      queryParams.value.page,
      queryParams.value.size,
    )
    .then((response) => response.data.data),
);

const handleRowClick = (id: number) => {
  selectedTicketId.value = id;
};

const handleCloseModal = () => {
  selectedTicketId.value = null;
};
</script>

<template>
  <section class="overflow-x-auto mt-5 px-5 pb-20">
    <div v-if="isLoading" class="flex justify-center items-center min-h-[calc(100vh-300px)]">로딩 중...</div>

    <div v-else-if="error" class="flex justify-center items-center min-h-[calc(100vh-300px)]">
      데이터를 불러오는데 실패했습니다.
    </div>

    <div v-else class="min-h-[calc(100vh-300px)]">
      <table class="min-w-full table-fixed">
        <thead class="manager-thead">
          <tr>
            <th class="manager-th w-[5%] pl-6">번호</th>
            <th class="manager-th text-start w-[25%]">제목</th>
            <th class="manager-th w-[10%]">1차 카테고리</th>
            <th class="manager-th w-[7.5%]">2차 카테고리</th>
            <th class="manager-th w-[25%]">설명</th>
            <th class="manager-th w-[7.5%]">진행 상태</th>
            <th class="manager-th w-[10%]">담당자</th>
            <th class="manager-th w-[5%]">마감일</th>
            <th class="manager-th w-[5%] pr-6">중요도</th>
          </tr>
        </thead>

        <tbody class="whitespace-nowrap">
          <tr
            v-for="ticket in ticketData?.tickets"
            :key="ticket.ticketId"
            class="hover:bg-white-1"
            @click="handleRowClick(ticket.ticketId)"
          >
            <td class="manager-td max-w-0 pl-6">
              <p :title="ticket.ticketId.toString()">
                {{ ticket.ticketId }}
              </p>
            </td>
            <td class="manager-td max-w-0 text-start">
              <p class="truncate" :title="ticket.title">
                {{ ticket.title }}
              </p>
            </td>
            <td class="manager-td max-w-0">
              <p class="truncate">
                {{ ticket.firstCategory }}
              </p>
            </td>
            <td class="manager-td max-w-0">
              <p class="truncate">
                {{ ticket.secondCategory }}
              </p>
            </td>
            <td class="manager-td max-w-0 text-start">
              <p class="truncate" :title="ticket.content">
                {{ ticket.content }}
              </p>
            </td>
            <td class="manager-td text-center">
              <StatusBadge :status="ticket.status" size="md" />
            </td>
            <td class="manager-td">
              <div class="flex items-center gap-2 ml-4">
                <img class="h-7 w-7 rounded-full bg-pink-200" />
                <span class="truncate">{{ ticket.manager }}</span>
              </div>
            </td>
            <td class="manager-td">
              <p class="truncate">
                {{ ticket.dueDate }}
              </p>
            </td>
            <td class="manager-td pr-6">
              <PriorityBadge :priority="ticket.priority" size="md" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div>페이지네이션</div>

    <ManagerTicket v-if="selectedTicketId" :ticket-id="selectedTicketId" @close="handleCloseModal" />
  </section>
</template>
