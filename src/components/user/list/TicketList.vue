<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import StatusBadge from '@/components/common/Badges/StatusBadge.vue';
import TicketDetail from './TicketDetail.vue';
import { useUserTicketListStore } from '@/stores/userTicketListStore';
import SvgIcon from '@/components/common/SvgIcon.vue';
import { ArrowDownIcon, CreateTicketIcon, FilterIcon, SearchIcon, TrashcanIcon } from '@/assets/icons/path';
import { perPageOptions } from '@/components/manager/ticketOptionTest';
import { onClickOutside } from '@vueuse/core';
import { DialogProps, initialDialog } from '@/types/common/dialog';
import CommonDialog from '@/components/common/CommonDialog.vue';
import TicketFilter from './TicketFilter.vue';
import { useCustomQuery } from '@/composables/useCustomQuery';
import { ticketApi } from '@/services/ticketService/ticketService';
import SkeletonTable from '@/components/UI/SkeletonTable.vue';
import CustomPagination from '@/components/common/CustomPagination.vue';
import { UserFilterPayload, UserFilterState } from '@/types/user';
import ErrorTable from '@/components/UI/ErrorTable.vue';
import { QueryKey, useQueryClient } from '@tanstack/vue-query';
import { useCustomMutation } from '@/composables/useCustomMutation';
import { useDebounce } from '@vueuse/core';
import { useRouter } from 'vue-router';

const router = useRouter();

const ticketStore = useUserTicketListStore();
const queryClient = useQueryClient();

const selectedTicketId = ref<number | null>(null);
const selectedPerPage = ref(perPageOptions[0]);
const isSizeOpen = ref(false);
const isFilterOpen = ref(false);

const currentPage = ref(parseInt(sessionStorage.getItem('userCurrentPage') || '1'));
const pageSize = ref(perPageOptions[0].value);
const keyword = ref('');
const debouncedKeyword = useDebounce(keyword, 1000); // 1초 동안 추가 입력이 없으면 반응
const searchQueryKey = ref<QueryKey>(['user-tickets']); // 초기 쿼리 키
const isSearch = ref(false);

// 필터링 상태
const UserfilterState = ref<UserFilterState>({
  statuses: [],
  categories: [],
});
const isFiltering = computed(() => {
  return (
    (UserfilterState.value.statuses && UserfilterState.value.statuses.length > 0) ||
    (UserfilterState.value.categories && UserfilterState.value.categories.length > 0)
  );
});

// 정렬
const order = ref('DESC');

// 다이얼로그 상태
const dialogState = ref<DialogProps>({ ...initialDialog });

// ------------------ 핵심: "검색 결과가 없는지" 판별 (inline 사용도 가능하지만, computed로 더 깔끔하게)
const noSearchResults = computed(() => {
  // (검색 중 또는 필터 중) 이면서, 티켓이 없거나 length가 0이면 true
  return (isSearch.value || isFiltering.value) && (!ticketData.value || ticketData.value.tickets.length === 0);
});

// 검색 파라미터
const searchQueryParams = computed(() => ({
  page: currentPage.value,
  size: pageSize.value,
  order: order.value,
}));

// 검색 함수
const handleSearch = () => {
  if (keyword.value.trim()) {
    isSearch.value = true;
    currentPage.value = 1; // 검색 시 첫 페이지로
    sessionStorage.setItem('userCurrentPage', '1');
  } else {
    resetSearch();
  }
};

// 검색 초기화
const resetSearch = () => {
  keyword.value = '';
  isSearch.value = false;
  currentPage.value = parseInt(sessionStorage.getItem('userCurrentPage') || '1');
};

// 드롭다운(ref) 관련
const dropdownRef = ref<HTMLElement | null>(null);
onClickOutside(dropdownRef, () => (isSizeOpen.value = false));

// 페이지 사이즈 선택
const selectOption = (option: { id: number; value: number; label: string }) => {
  selectedPerPage.value = option;
  pageSize.value = option.value;
  currentPage.value = 1;
  sessionStorage.setItem('sizeCurrentPage', '1');
  isSizeOpen.value = false;
};

// 필터 적용
const handleApplyFilters = (filters: UserFilterPayload) => {
  UserfilterState.value = {
    statuses: filters.statuses,
    categories: filters.categories,
  };
  currentPage.value = 1;
  sessionStorage.setItem('userCurrentPage', '1');
};

// 전체 쿼리 파라미터
const queryParams = computed(() => ({
  page: currentPage.value,
  size: pageSize.value,
  order: order.value,
  statuses: Array.isArray(UserfilterState.value.statuses) ? UserfilterState.value.statuses : [],
  categories: Array.isArray(UserfilterState.value.categories) ? UserfilterState.value.categories : [],
}));

// 검색/필터 파라미터 변경 감지
watch([debouncedKeyword, queryParams], ([newKeyword, newQueryParams]) => {
  if (newKeyword.trim()) {
    searchQueryKey.value = ['search-user-tickets', newKeyword, currentPage.value, pageSize.value, order.value];
  } else {
    searchQueryKey.value = [
      'user-tickets',
      newQueryParams.page,
      newQueryParams.size,
      newQueryParams.order,
      newQueryParams.statuses.length > 0 ? newQueryParams.statuses : [],
      newQueryParams.categories.length > 0 ? newQueryParams.categories : [],
    ];
  }
});

// 티켓 조회
const {
  data: ticketData,
  isLoading,
  error,
} = useCustomQuery(searchQueryKey as unknown as QueryKey, () => {
  // 검색 중이면 검색 API
  if (isSearch.value) {
    return ticketApi
      .getSearchUserTickets(debouncedKeyword.value, searchQueryParams.value.page, searchQueryParams.value.size)
      .then((res) => res.data.data);
  }
  // 필터링(또는 기본 조회) API
  return ticketApi
    .getUserTickets(
      queryParams.value.statuses,
      queryParams.value.categories,
      queryParams.value.page,
      queryParams.value.size,
      queryParams.value.order,
    )
    .then((res) => res.data.data);
});

// 티켓 삭제 뮤테이션
const deleteMutation = useCustomMutation(
  async ({ ticketIds }: { ticketIds: number[] }) => {
    const response = await ticketApi.patchTickets({ ticketIds });
    return response.data;
  },
  {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-tickets'] });
    },
  },
);

// 삭제 버튼
const handleDelete = () => {
  const selectedTicketIds = Array.from(ticketStore.selectedTickets);
  const ticketCount = selectedTicketIds.length;

  dialogState.value = {
    open: true,
    isWarn: true,
    title: `${ticketCount}개의 티켓을 삭제하시겠습니까?`,
    cancelText: '취소',
    onCancelClick: () => {
      dialogState.value = { ...initialDialog };
    },
    mainText: '삭제',
    onMainClick: () => {
      deleteMutation.mutate({ ticketIds: selectedTicketIds });
      ticketStore.clearSelectedTickets();
      ticketStore.toggleDeleteMode();
      dialogState.value = { ...initialDialog };
    },
  };
};

// 삭제 취소
const handleCancel = () => {
  ticketStore.toggleDeleteMode();
  ticketStore.clearSelectedTickets();
};

// 테이블 행 클릭 → 티켓 상세
const handleRowClick = (id: number) => {
  selectedTicketId.value = id;
};
const handleCloseModal = () => {
  selectedTicketId.value = null;
};

// 체크박스 클릭
const handleCheckboxClick = (event: Event, id: number) => {
  event.stopPropagation();
  if (ticketStore.selectedTickets.has(id)) {
    ticketStore.removeSelectedTicket(id);
  } else {
    ticketStore.addSelectedTicket(id);
  }
};

// 페이지 변경
const handlePageChange = (page: number) => {
  currentPage.value = page;
  sessionStorage.setItem('userCurrentPage', page.toString());
};

// 정렬 변경
const toggleOrder = () => {
  order.value = order.value === 'DESC' ? 'ASC' : 'DESC';
  currentPage.value = 1;
  sessionStorage.setItem('logCurrentPage', '1');
};

// 페이지 떠날 때 현재 페이지 저장
onBeforeUnmount(() => {
  sessionStorage.setItem('userCurrentPage', currentPage.value.toString());
});
</script>

<template>
  <!-- 1. 티켓이 있거나, 검색/필터 중이라면 -->
  <section v-if="ticketData?.tickets?.length > 0 || isSearch || isFiltering">
    <!-- (삭제 모드 X) -->
    <header v-if="!ticketStore.isDeleteMode" class="board-header">
      <!-- 검색 -->
      <div class="flex w-1/4">
        <div class="manager-search-div">
          <button v-if="isSearch" class="search-reset-btn" @click="resetSearch">초기화</button>
          <input
            v-model="keyword"
            maxlength="20"
            placeholder="제목 또는 내용 입력"
            class="manager-search-input"
            @keyup.enter="handleSearch"
          />
          <div class="flex items-center gap-2">
            <SvgIcon :icon="SearchIcon" class="cursor-pointer pl-1" @click="handleSearch" />
          </div>
        </div>
      </div>

      <!-- 개수 & 필터 -->
      <div class="flex items-center gap-10">
        <!-- 개수 -->
        <div ref="dropdownRef" class="relative mt-1">
          <button @click="isSizeOpen = !isSizeOpen" class="manager-filter-btn">
            <span class="font-medium">{{ selectedPerPage.label }}</span>
            <SvgIcon :icon="ArrowDownIcon" :class="['transition-02s', isSizeOpen ? 'rotate-180' : '']" />
          </button>

          <div v-if="isSizeOpen" class="manager-filter-menu">
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

        <div class="flex items-center">
          <!-- 필터 아이콘 -->
          <div class="relative flex items-center">
            <button @click.stop="isFilterOpen = !isFilterOpen" class="board-filter-icon">
              <SvgIcon :icon="FilterIcon" />
              필터
            </button>
            <!-- 필터 모달 -->
            <TicketFilter
              v-if="isFilterOpen"
              :initialStatuses="UserfilterState.statuses"
              :initialCategories="UserfilterState.categories"
              @applyFilters="handleApplyFilters"
              @closeFilter="isFilterOpen = false"
              class="board-filter-modal"
            />
          </div>
        </div>
        <SvgIcon :icon="TrashcanIcon" class="cursor-pointer" @click="ticketStore.toggleDeleteMode" />
      </div>
    </header>

    <!-- (삭제 모드 O) -->
    <header v-else class="board-header">
      <div class="header-cancel-delete-div">
        <button @click="handleCancel" class="btn-cancel py-2">취소</button>
        <button @click="handleDelete" class="btn-main py-2">삭제</button>
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

    <article class="overflow-x-auto mt-5 px-5 mb-10 hide-scrollbar">
      <!-- 로딩 상태 -->
      <SkeletonTable v-if="isLoading" />
      <!-- 에러 상태 -->
      <ErrorTable v-else-if="error" :error="error" />
      <!-- 테이블 -->
      <div v-else class="h-[calc(100vh-220px)]">
        <table class="min-w-full">
          <thead class="manager-thead">
            <tr>
              <th v-if="ticketStore.isDeleteMode" class="manager-th w-[1%]">선택</th>
              <th
                @click="toggleOrder"
                :class="[
                  'manager-th text-start w-[15%] cursor-pointer duration-200',
                  ticketStore.isDeleteMode ? 'pl-0' : 'pl-6',
                ]"
              >
                <div class="flex items-center gap-2">
                  번호
                  <SvgIcon
                    :icon="ArrowDownIcon"
                    :class="['arrow-down-transition', order === 'ASC' ? 'rotate-180' : '']"
                  />
                </div>
              </th>
              <th class="manager-th text-start w-[25%]">제목</th>
              <th class="manager-th w-[15%]">1차 <span class="hidden lg:inline-block">카테고리</span></th>
              <th class="manager-th w-[7.5%]">2차 <span class="hidden lg:inline-block">카테고리</span></th>
              <th class="manager-th w-[7.5%]">진행 상태</th>
              <th class="manager-th w-[15%]">담당자</th>
              <th class="manager-th w-[10%]">마감일</th>
            </tr>
          </thead>

          <tbody class="overflow-hidden text-ellipsis">
            <!-- 검색 or 필터 중이고 결과가 없으면 -->
            <tr v-if="(isSearch || isFiltering) && (ticketData?.tickets?.length === 0 || !ticketData)">
              <td colspan="8" class="text-center py-6 text-gray-500">일치하는 티켓이 존재하지 않습니다.</td>
            </tr>

            <!-- 티켓 목록 렌더링 -->
            <tr
              v-else
              v-for="item in ticketData?.tickets"
              :key="item.ticketId"
              class="hover:bg-white-1 relative"
              @click="handleRowClick(item.ticketId)"
            >
              <td v-if="ticketStore.isDeleteMode" class="manager-td">
                <div class="flex-center">
                  <input
                    type="checkbox"
                    :class="[item.status !== 'IN_PROGRESS' ? 'w-4 h-4 cursor-pointer' : 'hidden']"
                    :checked="ticketStore.selectedTickets.has(item.ticketId)"
                    @click="(e) => handleCheckboxClick(e, item.ticketId)"
                  />
                </div>
              </td>
              <td :class="['manager-td text-start max-w-0', ticketStore.isDeleteMode ? 'pl-0' : 'pl-6']">
                <p :title="item.customId as unknown as string">
                  {{ item.customId }}
                </p>
              </td>
              <td class="manager-td max-w-0 text-start">
                <p class="truncate" :title="item.title">
                  {{ item.title }}
                </p>
              </td>
              <td class="manager-td max-w-0">
                <p class="truncate">{{ item.firstCategory }}</p>
              </td>
              <td class="manager-td max-w-0">
                <p class="truncate">{{ item.secondCategory }}</p>
              </td>
              <td class="manager-td text-center">
                <StatusBadge :status="item.status" size="md" />
              </td>
              <td class="manager-td">
                <div class="flex items-center justify-center gap-2">
                  <img
                    v-if="item.manager !== null"
                    :src="item.managerProfilePic"
                    class="h-7 max-w-7 rounded-full object-fill"
                  />
                  <span class="truncate" :class="item.manager ? '' : 'flex-center w-full mr-3'">
                    {{ item.manager || '━' }}
                  </span>
                </div>
              </td>
              <td class="manager-td">
                <p class="truncate">{{ item.dueDate }}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 티켓 상세 -->
      <TicketDetail v-if="selectedTicketId" :ticket-id="selectedTicketId" @close="handleCloseModal" />
    </article>

    <!-- (검색/필터 결과 없으면) 페이지네이션 숨기기 -->
    <CustomPagination
      v-if="!noSearchResults"
      :items-per-page="pageSize"
      :current-page="currentPage"
      :total-pages="ticketData?.totalPages || 1"
      :visible-pages="5"
      @page-change="handlePageChange"
    />
  </section>

  <!-- 2. 최초 진입 시 티켓 없고, 검색/필터도 안 한 경우 -->
  <section v-else class="w-full flex-stack items-center pb-40">
    <div class="flex-stack items-center gap-8 mt-32">
      <img src="@/assets/no-ticket.png" />
      <div class="flex-stack items-center gap-2">
        <h1 class="text-xl">아직 요청한 티켓이 없어요</h1>
        <p>티켓 생성을 눌러 새로운 티켓을 생성하세요</p>
      </div>
    </div>

    <button
      class="flex items-center bg-primary-0 py-2.5 px-8 rounded text-white-0 gap-2.5 text-sm font-semibold mt-20"
      @click="router.push({ name: 'user-ticketcreate' })"
    >
      <SvgIcon :icon="CreateTicketIcon" />
      티켓 생성
    </button>
  </section>
</template>
