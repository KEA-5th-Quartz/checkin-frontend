<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue';
import StatusBadge from '../../common/Badges/StatusBadge.vue';
import ManagerTicket from './ManagerTicket.vue';
import { useCustomQuery } from '@/composables/useCustomQuery';
import { ticketApi } from '@/services/ticketService/ticketService';
import CustomPagination from '@/components/common/CustomPagination.vue';
import { onClickOutside } from '@vueuse/core';
import { perPageOptions, status } from '../ticketOptionTest';
import { ArrowDownIcon, FilterIcon, SearchIcon } from '@/assets/icons/path';
import ManagerFilter from './ManagerFilter.vue';
import SvgIcon from '@/components/common/SvgIcon.vue';
import PriorityBadge from '@/components/common/Badges/PriorityBadge.vue';
import SkeletonTable from '@/components/UI/SkeletonTable.vue';
import { ManagerFilterPayload, ManagerFilterState } from '@/types/manager';
import ErrorTable from '@/components/UI/ErrorTable.vue';
import { QueryKey } from '@tanstack/vue-query';
import { useMemberStore } from '@/stores/memberStore';
import CommonInput from '@/components/common/CommonInput.vue';

const selectedTicketId = ref<number | null>(null);
const currentPage = ref(parseInt(sessionStorage.getItem('managerCurrentPage') || '1'));
const pageSize = ref(perPageOptions[0].value);
const isMyTicket = ref(false);

const memberStore = useMemberStore();
const keyword = ref('');
const searchKeyword = ref('');
const isSearch = ref(false);
const order = ref('ASC');

const ManagerfilterState = ref<ManagerFilterState>({
  statuses: [],
  usernames: [],
  categories: [],
  dueToday: false,
  dueThisWeek: false,
});

const queryParams = computed(() => ({
  page: currentPage.value,
  size: pageSize.value,
  statuses: Array.isArray(ManagerfilterState.value.statuses) ? ManagerfilterState.value.statuses : [],
  usernames: isMyTicket.value
    ? [memberStore.username]
    : Array.isArray(ManagerfilterState.value.usernames)
    ? ManagerfilterState.value.usernames
    : [],
  categories: Array.isArray(ManagerfilterState.value.categories) ? ManagerfilterState.value.categories : [],
  dueToday: ManagerfilterState.value.dueToday,
  dueThisWeek: ManagerfilterState.value.dueThisWeek,
  order: order.value,
}));

const searchQueryParams = computed(() => ({
  page: currentPage.value,
  size: pageSize.value,
  order: order.value,
}));

const handleSearch = () => {
  if (keyword.value.trim()) {
    isSearch.value = true;
    searchKeyword.value = keyword.value;
    currentPage.value = 1;
    sessionStorage.setItem('managerCurrentPage', '1');
  } else {
    resetSearch();
  }
};

const resetSearch = () => {
  keyword.value = '';
  searchKeyword.value = '';
  isSearch.value = false;
  currentPage.value = parseInt(sessionStorage.getItem('managerCurrentPage') || '1');
};

const handleApplyFilters = (filters: ManagerFilterPayload) => {
  ManagerfilterState.value = {
    statuses: filters.statuses.map((id: string) => {
      const statusItem = status.find((s) => s.id === (id as unknown as number));
      return statusItem?.label || '';
    }),
    usernames: filters.managers,
    categories: filters.categories,
    dueToday: filters.quickFilters.includes('dueToday'),
    dueThisWeek: filters.quickFilters.includes('dueThisWeek'),
  };
  currentPage.value = 1;
  sessionStorage.setItem('managerCurrentPage', '1');
};

const toggleMyTicket = () => {
  isMyTicket.value = !isMyTicket.value;
  currentPage.value = 1;
  sessionStorage.setItem('managerCurrentPage', '1');
};

const queryKey = computed<QueryKey>(() => {
  if (isSearch.value) {
    return ['search-tickets', searchKeyword.value, currentPage.value, pageSize.value, order.value];
  }
  return ['tickets', queryParams.value];
});

const {
  data: ticketData,
  isLoading,
  error,
} = useCustomQuery(queryKey as unknown as QueryKey, () => {
  if (isSearch.value) {
    return ticketApi
      .getSearchTicekts(keyword.value, searchQueryParams.value.page, searchQueryParams.value.size)
      .then((response) => response.data.data);
  }
  return ticketApi
    .getTickets(
      queryParams.value.statuses,
      queryParams.value.usernames,
      queryParams.value.categories,
      queryParams.value.dueToday,
      queryParams.value.dueThisWeek,
      queryParams.value.page,
      queryParams.value.size,
      queryParams.value.order,
    )
    .then((response) => response.data.data);
});

const handleRowClick = (id: number) => {
  selectedTicketId.value = id;
};

const handleCloseModal = () => {
  selectedTicketId.value = null;
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  sessionStorage.setItem('managerCurrentPage', page.toString());
};

const selectedPerPage = ref(perPageOptions[0]);
const isOpen = ref(false);
const isFilterOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

onClickOutside(dropdownRef, () => (isOpen.value = false));

const selectOption = (option: { id: number; value: number; label: string }) => {
  selectedPerPage.value = option;
  pageSize.value = option.value;
  currentPage.value = 1;
  sessionStorage.setItem('managerCurrentPage', '1');
  isOpen.value = false;
};

const toggleOrder = () => {
  if (!isSearch.value) {
    order.value = order.value === 'DESC' ? 'ASC' : 'DESC';
    currentPage.value = 1;
    sessionStorage.setItem('logCurrentPage', '1');
  }
};

const hasActiveFilters = computed(() => {
  return (
    ManagerfilterState.value.statuses.length > 0 ||
    ManagerfilterState.value.usernames.length > 0 ||
    ManagerfilterState.value.categories.length > 0 ||
    ManagerfilterState.value.dueToday ||
    ManagerfilterState.value.dueThisWeek
  );
});

const statusMapping: { [key: string]: string } = {
  OPEN: '생성',
  IN_PROGRESS: '진행중',
  CLOSED: '완료',
};

const getActiveFilters = computed(() => {
  const filters = [
    ...ManagerfilterState.value.statuses.map((status) => statusMapping[status] || status),
    ...ManagerfilterState.value.categories,
    ...ManagerfilterState.value.usernames,
    ManagerfilterState.value.dueToday ? '오늘 마감' : '',
    ManagerfilterState.value.dueThisWeek ? '이번 주 마감' : '',
  ].filter(Boolean);

  return filters.join(' · ');
});

onBeforeUnmount(() => {
  sessionStorage.setItem('managerCurrentPage', currentPage.value.toString());
});
</script>

<template>
  <header class="board-header max-w-full">
    <div class="flex items-center w-1/4">
      <div v-if="!hasActiveFilters" class="manager-search-div">
        <button v-if="isSearch" class="search-reset-btn" @click="resetSearch">초기화</button>
        <CommonInput
          type="text"
          v-model="keyword"
          maxlength="20"
          placeholder="티켓 검색..."
          class="manager-search-input"
          @keyup.enter="handleSearch"
        />
        <div class="flex items-center gap-2">
          <SvgIcon :icon="SearchIcon" class="cursor-pointer pl-1" @click="handleSearch" />
        </div>
      </div>
      <div
        v-else
        class="max-w-[600px] sm-gray-1 truncate text-sm text-gray-500"
        :title="'필터링 중인 항목 : ' + getActiveFilters"
      >
        필터링 : {{ getActiveFilters }}
      </div>
    </div>

    <div v-if="!isSearch && (ticketData?.tickets?.length !== 0 || ticketData)" class="flex items-center gap-10">
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

      <button v-if="!isSearch" class="btn-main py-2" @click="toggleMyTicket">
        {{ !isMyTicket ? '내 티켓 조회' : '전체 티켓 조회' }}
      </button>

      <div v-if="!isSearch" class="relative flex items-center max-h-fit">
        <button @click.stop="isFilterOpen = !isFilterOpen" class="board-filter-icon">
          <SvgIcon :icon="FilterIcon" />
          필터
        </button>

        <ManagerFilter
          v-if="isFilterOpen"
          :isMyTicket="isMyTicket"
          @applyFilters="handleApplyFilters"
          @closeFilter="isFilterOpen = false"
        />
      </div>
    </div>
  </header>

  <section class="overflow-y-auto mt-4 px-5 mb-10 hide-scrollbar">
    <SkeletonTable v-if="isLoading" />
    <ErrorTable v-else-if="error" :error="error" />

    <div v-else class="h-[calc(100vh-290px)]">
      <table v-if="!isMyTicket" class="min-w-full">
        <thead class="manager-thead">
          <tr>
            <th @click="toggleOrder" class="manager-th w-[10%] text-start pl-6 cursor-pointer duration-200">
              <div class="flex items-center gap-2">
                번호
                <SvgIcon
                  v-if="!isSearch"
                  :icon="ArrowDownIcon"
                  :class="['arrow-down-transition', order === 'ASC' ? 'rotate-180' : '']"
                />
              </div>
            </th>
            <th class="manager-th text-start w-[37.5%]">제목</th>
            <th class="manager-th w-[10%]">1차 카테고리</th>
            <th class="manager-th w-[7.5%]">2차 카테고리</th>
            <th class="manager-th w-[7.5%]">진행 상태</th>
            <th class="manager-th w-[7.5%] text-center pl-6">담당자</th>
            <th class="manager-th w-[5%]">마감일</th>
          </tr>
        </thead>

        <tbody class="whitespace-nowrap">
          <tr v-if="isSearch && (ticketData?.tickets?.length === 0 || !ticketData)">
            <td colspan="8" class="text-center py-6 text-gray-500">티켓이 존재하지 않습니다.</td>
          </tr>
          <tr
            v-for="ticket in ticketData?.tickets"
            :key="ticket.ticketId"
            class="hover:bg-white-1"
            @click="handleRowClick(ticket.ticketId)"
          >
            <td class="manager-td text-start max-w-0 pl-6">
              <p class="truncate text-xs" :title="ticket.customId.toString()">
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
                {{ ticket.firstCategory }}
              </p>
            </td>
            <td class="manager-td max-w-0">
              <p class="truncate">
                {{ ticket.secondCategory }}
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

      <table v-else class="min-w-full table-fixed">
        <thead class="manager-thead">
          <tr>
            <th class="manager-th w-[10%] text-start pl-6">번호</th>
            <th class="manager-th text-start w-[35%]">제목</th>
            <th class="manager-th w-[10%]">1차 카테고리</th>
            <th class="manager-th w-[12.5%]">2차 카테고리</th>
            <th class="manager-th w-[7.5%]">진행 상태</th>
            <th class="manager-th w-[12.5%] text-start pl-6">담당자</th>
            <th class="manager-th w-[5%]">마감일</th>
            <th class="manager-th w-[7.5%] pr-6">중요도</th>
          </tr>
        </thead>

        <tbody class="whitespace-nowrap">
          <tr v-if="isSearch && (ticketData?.tickets?.length === 0 || !ticketData)">
            <td colspan="8" class="text-center py-6 text-gray-500">일치하는 티켓이 존재하지 않습니다.</td>
          </tr>
          <tr
            v-for="ticket in ticketData?.tickets"
            :key="ticket.ticketId"
            class="hover:bg-white-1"
            @click="handleRowClick(ticket.ticketId)"
          >
            <td class="manager-td text-start pl-6">
              <p class="text-xs" :title="ticket.customId.toString()">
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
                {{ ticket.firstCategory }}
              </p>
            </td>
            <td class="manager-td max-w-0">
              <p class="truncate">
                {{ ticket.secondCategory }}
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
                <p class="truncate" :class="ticket.manager ? '' : 'flex-center w-full mr-3'">
                  {{ ticket.manager || '━' }}
                </p>
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

    <ManagerTicket v-if="selectedTicketId" :ticket-id="selectedTicketId" @close="handleCloseModal" />
  </section>

  <CustomPagination
    v-if="!isSearch && (ticketData?.tickets?.length !== 0 || ticketData)"
    :items-per-page="pageSize"
    :current-page="currentPage"
    :total-pages="ticketData?.totalPages || 1"
    :visible-pages="5"
    @page-change="handlePageChange"
  />
</template>
