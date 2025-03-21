<script setup lang="ts">
import { ref } from 'vue';
import { ArrowDownIcon, FilterIcon, SearchIcon, TrashcanIcon } from '@/assets/icons/path';
import SvgIcon from '@/components/common/SvgIcon.vue';
import { useUserTicketListStore } from '@/stores/userTicketListStore';
import { DialogProps, initialDialog } from '@/types/common/dialog';
import CommonDialog from '@/components/common/CommonDialog.vue';
import FilterModal from './TicketFilter.vue';
import { onClickOutside } from '@vueuse/core';
import { perPageOptions } from '@/components/manager/ticketOptionTest';
import CommonInput from '@/components/common/CommonInput.vue';

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
      ticketStore.clearSelectedTickets();
      ticketStore.toggleDeleteMode();
      dialogState.value = { ...initialDialog };
    },
  };
};
</script>

<template>
  <header v-if="!ticketStore.isDeleteMode" class="board-header">
    <div class="manager-search-div">
      <CommonInput type="text" maxlength="20" placeholder="티켓 검색..." class="manager-search-input" />
      <SvgIcon :icon="SearchIcon" />
    </div>

    <div class="flex items-center gap-10">
      <div ref="dropdownRef" class="relative mt-1">
        <button @click="isSizeOpen = !isSizeOpen" class="manager-filter-btn">
          <span class="font-medium">{{ selectedPerPage.label }}</span>
          <SvgIcon :icon="ArrowDownIcon" :class="['transition-02s', isSizeOpen ? 'rotate-180' : '']" />
        </button>

        <div v-if="isSizeOpen" class="manager-filter-menu">
          <ul>
            <li v-for="option in perPageOptions" :key="option.id" @click="selectOption(option)" class="board-size-menu">
              {{ option.label }}
            </li>
          </ul>
        </div>
      </div>

      <div class="flex items-center">
        <div class="relative flex items-center">
          <button @click.stop="isFilterOpen = !isFilterOpen" class="board-filter-icon">
            <SvgIcon :icon="FilterIcon" />
            필터
          </button>

          <FilterModal v-if="isFilterOpen" @closeFilter="isFilterOpen = false" class="board-filter-modal" />
        </div>
      </div>
      <SvgIcon :icon="TrashcanIcon" class="cursor-pointer" @click="ticketStore.toggleDeleteMode" />
    </div>
  </header>

  <section v-else class="board-header">
    <div class="header-cancel-delete-div">
      <button @click="handleCancel" class="btn-cancel py-2">취소</button>
      <button @click="handleDelete" class="btn-main py-2">삭제</button>
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
