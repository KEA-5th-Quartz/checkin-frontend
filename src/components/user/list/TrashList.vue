<script setup lang="ts">
import { ArrowDownIcon } from '@/assets/icons/path';
import CustomPagination from '@/components/common/CustomPagination.vue';
import SvgIcon from '@/components/common/SvgIcon.vue';
import { perPageOptions } from '@/components/manager/ticketOptionTest';
import { useCustomQuery } from '@/composables/useCustomQuery';
import { ticketApi } from '@/services/ticketService/ticketService';
import { onClickOutside } from '@vueuse/core';
import { onBeforeUnmount, ref } from 'vue';

const currentPage = ref(parseInt(sessionStorage.getItem('trashCurrentPage') || '1'));
const pageSize = ref(perPageOptions[0].value);

const handlePageChange = (page: number) => {
  currentPage.value = page;
  sessionStorage.setItem('trashCurrentPage', page.toString());
};

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

const { data: trashData } = useCustomQuery(['trash-list'], async () => {
  try {
    const response = await ticketApi.getTrashTickets();
    return response.data.data;
  } catch (err) {
    console.error('휴지통 목록 조회 실패:', err);
    throw err;
  }
});

onBeforeUnmount(() => {
  sessionStorage.setItem('trashCurrentPage', currentPage.value.toString());
});
</script>

<template>
  <article class="py-10">
    <header class="w-full flex justify-end">
      <div ref="dropdownRef" class="relative pr-20 max-w-fit">
        <button @click="isOpen = !isOpen" class="manager-filter-btn">
          <span class="font-medium">{{ selectedPerPage.label }}</span>
          <SvgIcon :icon="ArrowDownIcon" :class="['transition-02s', isOpen ? 'rotate-180' : '']" />
        </button>

        <div v-if="isOpen" class="manager-filter-menu max-w-fit">
          <ul>
            <li v-for="option in perPageOptions" :key="option.id" @click="selectOption(option)" class="board-size-menu">
              {{ option.label }}
            </li>
          </ul>
        </div>
      </div>
    </header>

    <section class="overflow-y-auto mt-4 px-5 mb-10 hide-scrollbar">
      <div class="h-[calc(100vh-290px)]">
        <table class="min-w-full">
          <thead class="manager-thead">
            <tr>
              <th class="manager-th w-[5%] pl-6">번호</th>
              <th class="manager-th text-start w-[25%]">제목</th>
              <th class="manager-th w-[10%]">1차 카테고리</th>
              <th class="manager-th w-[7.5%]">2차 카테고리</th>
              <th class="manager-th w-[25%]">요청사항</th>
              <th class="manager-th w-[7.5%]">진행 상태</th>
              <th class="manager-th w-[10%]">담당자</th>
              <th class="manager-th w-[5%]">마감일</th>
            </tr>
          </thead>

          <tbody class="whitespace-nowrap">
            <tr v-for="ticket in trashData?.tickets" :key="ticket.ticketId" class="hover:bg-white-1">
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
    </section>

    <CustomPagination
      :items-per-page="pageSize"
      :current-page="currentPage"
      :total-pages="trashData?.totalPages || 1"
      :visible-pages="5"
      @page-change="handlePageChange"
    />
  </article>
</template>
