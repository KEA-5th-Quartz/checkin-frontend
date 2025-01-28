<script setup lang="ts">
import { ref, computed } from 'vue';
import PriorityBadge from '../../common/Badges/PriorityBadge.vue';
import StatusBadge from '../../common/Badges/StatusBadge.vue';
import ManagerTicket from './ManagerTicket.vue';
import { useCustomQuery } from '@/composables/useCustomQuery';
import { ticketApi } from '@/services/ticketService/ticketService';
import CustomPagination from '@/components/common/CustomPagination.vue';
import { onClickOutside } from '@vueuse/core';
import { perPageOptions } from '../ticketOptionTest';
import { ArrowDownIcon, FilterIcon, SearchIcon } from '@/assets/icons/path';
import ManagerFilter from './ManagerFilter.vue';
import SvgIcon from '@/components/common/SvgIcon.vue';

const selectedTicketId = ref<number | null>(null);
const currentPage = ref(1);
const pageSize = ref(10);

// 쿼리 파라미터
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
} = useCustomQuery(['tickets', queryParams], () =>
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

const handlePageChange = (page: number) => {
  currentPage.value = page;
};

// 배너
const selectedPerPage = ref(perPageOptions[0]);
const isOpen = ref(false);
const isFilterOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

onClickOutside(dropdownRef, () => (isOpen.value = false));

const selectOption = (
  option: { id: number; value: number; label: string } | { id: number; value: number; label: string },
) => {
  selectedPerPage.value = option;
  isOpen.value = false;
};
</script>

<template>
  <header class="board-header">
    <!-- 검색 -->
    <div class="manager-search-div">
      <input placeholder="티켓 검색..." class="manager-search-input" />
      <SvgIcon :icon="SearchIcon" class="cursor-pointer" />
    </div>

    <!-- 필터 -->
    <div class="flex items-center gap-10">
      <div ref="dropdownRef" class="relative">
        <button @click="isOpen = !isOpen" class="manager-filter-btn">
          <span class="font-medium">{{ selectedPerPage.label }}</span>
          <SvgIcon :icon="ArrowDownIcon" :class="['transition-02s', isOpen ? 'rotate-180' : '']" />
        </button>

        <div v-if="isOpen" class="manager-filter-menu">
          <ul>
            <li v-for="option in perPageOptions" :key="option.id" @click="selectOption(option)" class="board-size-menu">
              {{ option.label }}
            </li>
          </ul>
        </div>
      </div>

      <!-- 필터링 아이콘 -->
      <div class="relative flex items-center max-h-fit">
        <button @click.stop="isFilterOpen = !isFilterOpen" class="board-filter-icon">
          <SvgIcon :icon="FilterIcon" />
          필터
        </button>
        <!-- 필터 모달 -->
        <ManagerFilter v-if="isFilterOpen" @closeFilter="isFilterOpen = false" class="board-filter-modal" />
      </div>
    </div>
  </header>

  <section class="overflow-x-auto mt-1 px-5 pb-20 hide-scrollbar">
    <div v-if="isLoading" class="flex justify-center items-center min-h-[calc(100vh-300px)]">로딩 중...</div>

    <div v-else class="max-h-[calc(100vh-340px)]">
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
            <!-- <th class="manager-th w-[5%] pr-6">중요도</th> -->
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
            <!-- <td class="manager-td pr-6">
              <PriorityBadge :priority="ticket.priority" size="md" />
            </td> -->
          </tr>
        </tbody>
      </table>
    </div>

    <ManagerTicket v-if="selectedTicketId" :ticket-id="selectedTicketId" @close="handleCloseModal" />
  </section>

  <CustomPagination
    :items-per-page="pageSize"
    :current-page="currentPage"
    :total-pages="ticketData?.totalPages || 1"
    :visible-pages="5"
    @page-change="handlePageChange"
  />
</template>
