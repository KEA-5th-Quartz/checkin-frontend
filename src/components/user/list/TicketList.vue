<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';
import StatusBadge from '@/components/common/Badges/StatusBadge.vue';
import TicketDetail from './TicketDetail.vue';
import { useUserTicketListStore } from '@/stores/userTicketListStore';
import SvgIcon from '@/components/common/SvgIcon.vue';
import { ArrowDownIcon, CreateTicketIcon, FilterIcon, SearchIcon, TrashcanIcon } from '@/assets/icons/path';
import { perPageOptions, status } from '@/components/manager/ticketOptionTest';
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
import { QueryKey } from '@tanstack/vue-query';

const ticketStore = useUserTicketListStore();

const selectedTicketId = ref<number | null>(null);
const selectedPerPage = ref(perPageOptions[0]);
const isSizeOpen = ref(false);
const isFilterOpen = ref(false);

const currentPage = ref(parseInt(sessionStorage.getItem('userCurrentPage') || '1'));
const pageSize = ref(perPageOptions[0].value);
const keyword = ref('');
const isSearch = ref(false);

// 검색 쿼리 파라미터
const searchQueryParams = computed(() => ({
  page: currentPage.value,
  size: pageSize.value,
}));

// 검색 함수
const handleSearch = () => {
  if (keyword.value.trim()) {
    isSearch.value = true;
    currentPage.value = 1; // 검색 시 첫 페이지로 초기화
    sessionStorage.setItem('userCurrentPage', '1');
  } else {
    resetSearch(); // 검색어가 비어있을 때 초기화 함수 호출
  }
};

// 검색 초기화 함수
const resetSearch = () => {
  keyword.value = '';
  isSearch.value = false;
  currentPage.value = parseInt(sessionStorage.getItem('userCurrentPage') || '1');
};

const dropdownRef = ref<HTMLElement | null>(null);
onClickOutside(dropdownRef, () => (isSizeOpen.value = false));

const selectOption = (
  option: { id: number; value: number; label: string } | { id: number; value: number; label: string },
) => {
  selectedPerPage.value = option;
  pageSize.value = option.value;
  currentPage.value = 1;
  sessionStorage.setItem('sizeCurrentPage', '1');
  isSizeOpen.value = false;
};

const dialogState = ref<DialogProps>({ ...initialDialog });

const UserfilterState = ref<UserFilterState>({
  statuses: [],
  categories: [],
});

// 필터 적용 핸들러
const handleApplyFilters = (filters: UserFilterPayload) => {
  UserfilterState.value = {
    statuses: filters.statuses.map((id: string) => {
      const statusItem = status.find((s) => s.id === (id as unknown as number));
      return statusItem?.label || '';
    }),
    categories: filters.categories,
  };
  currentPage.value = 1;
  sessionStorage.setItem('userCurrentPage', '1');
};

// 쿼리 파라미터
const queryParams = computed(() => ({
  page: currentPage.value,
  size: pageSize.value,
  statuses: Array.isArray(UserfilterState.value.statuses) ? UserfilterState.value.statuses : [],
  categories: Array.isArray(UserfilterState.value.categories) ? UserfilterState.value.categories : [],
}));

// 검색 쿼리 키 computed
const queryKey = computed<QueryKey>(() => {
  if (isSearch.value) {
    return ['search-user-tickets', keyword.value, currentPage.value, pageSize.value] as const;
  }
  return ['user-tickets', queryParams.value] as const;
});

// 데이터 페칭
const {
  data: ticketData,
  isLoading,
  error,
} = useCustomQuery(queryKey as unknown as QueryKey, () => {
  if (isSearch.value) {
    return ticketApi
      .getSearchUserTickets(keyword.value, searchQueryParams.value.page, searchQueryParams.value.size)
      .then((response) => response.data.data);
  }
  return ticketApi
    .getUserTickets(
      queryParams.value.statuses,
      queryParams.value.categories,
      queryParams.value.page,
      queryParams.value.size,
    )
    .then((response) => response.data.data);
});

const handleDelete = () => {
  // Set을 배열로 변환하여 선택된 티켓 ID들을 가져옴
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
      console.log('삭제하는 id 배열: ', selectedTicketIds);

      ticketStore.clearSelectedTickets(); // 선택된 티켓 초기화
      ticketStore.toggleDeleteMode(); // 삭제 모드 종료
      dialogState.value = { ...initialDialog }; // 다이얼로그 닫기
    },
  };
};

const handleCancel = () => {
  ticketStore.toggleDeleteMode();
  ticketStore.clearSelectedTickets();
};

const handleRowClick = (id: number) => {
  selectedTicketId.value = id;
};
const handleCloseModal = () => {
  selectedTicketId.value = null;
};

const handleCheckboxClick = (event: Event, id: number) => {
  // 체크박스 클릭 시 이벤트 전파 중지 (행 클릭 이벤트 방지)
  event.stopPropagation();

  if (ticketStore.selectedTickets.has(id)) {
    ticketStore.removeSelectedTicket(id);
  } else {
    ticketStore.addSelectedTicket(id);
  }
  // 현재 선택된 모든 티켓 출력
  console.log('현재 선택된 티켓들:', {
    selectedIds: Array.from(ticketStore.selectedTickets),
    totalSelected: ticketStore.selectedTickets.size,
  });
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  sessionStorage.setItem('userCurrentPage', page.toString());
};

onBeforeUnmount(() => {
  sessionStorage.setItem('managerCurrentPage', currentPage.value.toString());
});
</script>

<template>
  <section v-if="ticketData?.tickets?.length !== 0">
    <!-- 티켓 헤더 -->
    <header v-if="!ticketStore.isDeleteMode" class="board-header">
      <!-- 검색 -->
      <div class="flex w-1/4">
        <div class="manager-search-div">
          <button v-if="isSearch" class="text-sm btn-cancel px-2 ml-2 py-0" @click="resetSearch">초기화</button>
          <input
            v-model="keyword"
            placeholder="티켓 검색..."
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
          <!-- 필터링 아이콘 -->
          <div class="relative flex items-center">
            <button @click.stop="isFilterOpen = !isFilterOpen" class="board-filter-icon">
              <SvgIcon :icon="FilterIcon" />
              필터
            </button>
            <!-- 필터 모달 -->
            <TicketFilter
              v-if="isFilterOpen"
              @applyFilters="handleApplyFilters"
              @closeFilter="isFilterOpen = false"
              class="board-filter-modal"
            />
          </div>
        </div>
        <SvgIcon :icon="TrashcanIcon" class="cursor-pointer" @click="ticketStore.toggleDeleteMode" />
      </div>
    </header>
    <!-- 티켓 삭제모드 헤더 -->
    <header v-else class="board-header">
      <div class="flex items-center gap-4 ml-auto">
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
      <SkeletonTable v-if="isLoading" />
      <ErrorTable v-else-if="error" :error="error" />

      <div v-else class="h-[calc(100vh-220px)]">
        <table class="min-w-full">
          <thead class="manager-thead">
            <tr>
              <th v-if="ticketStore.isDeleteMode" class="manager-th w-[1%]">선택</th>
              <th :class="['manager-th w-[5%]', ticketStore.isDeleteMode ? 'pl-0' : 'pl-6']">번호</th>
              <th class="manager-th text-start w-[25%]">제목</th>
              <th class="manager-th w-[10%]">1차 <span class="hidden lg:inline-block">카테고리</span></th>
              <th class="manager-th w-[7.5%]">2차 <span class="hidden lg:inline-block">카테고리</span></th>
              <th class="manager-th w-[25%]">설명</th>
              <th class="manager-th w-[7.5%]">진행 상태</th>
              <th class="manager-th w-[10%]">담당자</th>
              <th class="manager-th w-[5%]">마감일</th>
            </tr>
          </thead>

          <tbody class="whitespace-nowrap">
            <tr
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
              <td :class="['manager-td max-w-0', ticketStore.isDeleteMode ? 'pl-0' : 'pl-6']">
                <p :title="item.ticketId as unknown as string">
                  {{ item.ticketId }}
                </p>
              </td>
              <td class="manager-td max-w-0 text-start">
                <p class="truncate" :title="item.title">
                  {{ item.title }}
                </p>
              </td>
              <td class="manager-td max-w-0">
                <p class="truncate">
                  {{ item.firstCategory }}
                </p>
              </td>
              <td class="manager-td max-w-0">
                <p class="truncate">
                  {{ item.secondCategory }}
                </p>
              </td>
              <td class="manager-td max-w-0 text-start">
                <p class="truncate" :title="item.content">
                  {{ item.content }}
                </p>
              </td>
              <td class="manager-td text-center">
                <StatusBadge :status="item.status" size="md" />
              </td>
              <td class="manager-td">
                <div class="flex items-center gap-2 ml-4">
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
                <p class="truncate">
                  {{ item.dueDate }}
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <TicketDetail v-if="selectedTicketId" :ticket-id="selectedTicketId" @close="handleCloseModal" />
    </article>

    <CustomPagination
      :items-per-page="pageSize"
      :current-page="currentPage"
      :total-pages="ticketData?.totalPages || 1"
      :visible-pages="5"
      @page-change="handlePageChange"
    />
  </section>
  <section v-else class="w-full flex-stack items-center pb-40">
    <div class="flex-stack items-center gap-8 mt-32">
      <img src="@/assets/no-ticket.png" />
      <div class="flex-stack items-center gap-2">
        <h1 class="text-xl">아직 요청한 티켓이 없어요</h1>
        <p>티켓 생성을 눌러 새로운 티켓을 생성하세요</p>
      </div>
    </div>

    <button class="flex items-center bg-primary-0 py-2.5 px-8 rounded text-white-0 gap-2.5 text-sm font-semibold mt-20">
      <SvgIcon :icon="CreateTicketIcon" />

      티켓 생성
    </button>
  </section>
</template>
