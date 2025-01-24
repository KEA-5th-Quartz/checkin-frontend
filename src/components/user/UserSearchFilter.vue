<script setup lang="ts">
import { ref } from 'vue';
import { ArrowDownIcon, FilterIcon, SearchIcon, TrashcanIcon } from '../../assets/icons/path';
import SvgIcon from '../common/SvgIcon.vue';
import { useUserTicketListStore } from '../../stores/userTicketListStore';
import { DialogProps, initialDialog } from '@/types/common/dialog';
import CommonDialog from '../common/CommonDialog.vue';
import FilterModal from '../user/UserFilter.vue';
import { onClickOutside } from '@vueuse/core';
import { perPageOptions } from '../manager/ticketOptionTest';

const ticketStore = useUserTicketListStore();

const selectedPerPage = ref(perPageOptions[0]);
const isSizeOpen = ref(false);
const isFilterOpen = ref(false);

const dropdownRef = ref<HTMLElement | null>(null);

onClickOutside(dropdownRef, () => (isSizeOpen.value = false));

const selectOption = (
  option: { id: number; value: number; label: string } | { id: number; value: number; label: string },
) => {
  selectedPerPage.value = option;
  isSizeOpen.value = false;
};

const handleCancel = () => {
  ticketStore.toggleDeleteMode();
  ticketStore.clearSelectedTickets();
};

const dialogState = ref<DialogProps>({ ...initialDialog });

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
</script>

<template>
  <section v-if="!ticketStore.isDeleteMode" class="flex justify-between mx-auto w-[95%] mt-[50px]">
    <!-- 검색 -->
    <div class="manager-search-div">
      <input placeholder="티켓 검색..." class="manager-search-input" />
      <SvgIcon :icon="SearchIcon" />
    </div>

    <!-- 개수 & 필터 -->
    <div class="flex items-center gap-10">
      <!-- 개수 -->
      <div ref="dropdownRef" class="relative mt-1">
        <button @click="isSizeOpen = !isSizeOpen" class="manager-filter-btn">
          <span class="font-medium">{{ selectedPerPage.label }}</span>
          <SvgIcon
            :icon="ArrowDownIcon"
            :class="['transition-transform duration-200', isSizeOpen ? 'rotate-180' : '']"
          />
        </button>

        <div v-if="isSizeOpen" class="manager-filter-menu">
          <ul>
            <li
              v-for="option in perPageOptions"
              :key="option.id"
              @click="selectOption(option)"
              class="px-3 py-2 hover:bg-gray-3 cursor-pointer"
            >
              {{ option.label }}
            </li>
          </ul>
        </div>
      </div>

      <div class="flex items-center">
        <!-- 필터링 아이콘 -->
        <div class="relative flex items-center">
          <button @click.stop="isFilterOpen = !isFilterOpen" class="text-gray-0 flex items-center gap-2">
            <SvgIcon :icon="FilterIcon" />
            필터
          </button>
          <!-- 필터 모달 -->
          <FilterModal v-if="isFilterOpen" @closeFilter="isFilterOpen = false" class="absolute top-8 right-0" />
        </div>
      </div>
      <SvgIcon :icon="TrashcanIcon" class="cursor-pointer" @click="ticketStore.toggleDeleteMode" />
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

  <CommonDialog
    v-if="dialogState.open"
    :isWarn="dialogState.isWarn"
    :title="dialogState.title"
    :cancelText="dialogState.cancelText"
    :mainText="dialogState.mainText"
    :onCancelClick="dialogState.onCancelClick"
    :onMainClick="dialogState.onMainClick"
  />
</template>
