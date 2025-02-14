<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';
import CustomPagination from '@/components/common/CustomPagination.vue';
import { perPageOptions } from '@/components/manager/ticketOptionTest';
import { onClickOutside } from '@vueuse/core';
import { useCustomQuery } from '@/composables/useCustomQuery';
import { memberApi } from '@/services/memberService/memberService';
import { formatDateTime } from '@/utils/dateFormat';
import { ArrowDownIcon } from '@/assets/icons/path';
import SvgIcon from '@/components/common/SvgIcon.vue';
import CommonDialog from '@/components/common/CommonDialog.vue';
import { DialogProps, initialDialog } from '@/types/common/dialog';
import { handleError } from '@/utils/handleError';

// 페이지 상태 관리
const currentPage = ref(parseInt(sessionStorage.getItem('logCurrentPage') || '1'));
const pageSize = ref(perPageOptions[0].value);
const order = ref('DESC');

const selectedPerPage = ref(perPageOptions[0]);
const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);
const dialogState = ref<DialogProps>({ ...initialDialog });

onClickOutside(dropdownRef, () => (isOpen.value = false));

const selectOption = (option: { id: number; value: number; label: string }) => {
  selectedPerPage.value = option;
  pageSize.value = option.value;
  currentPage.value = 1;
  sessionStorage.setItem('logCurrentPage', '1');
  isOpen.value = false;
};

// 쿼리 파라미터
const queryParams = computed(() => ({
  page: currentPage.value,
  size: pageSize.value,
  order: order.value,
}));

const { data: logData } = useCustomQuery(['log-list', queryParams], async () => {
  try {
    const response = await memberApi.getMemberLog(
      queryParams.value.page,
      queryParams.value.size,
      queryParams.value.order,
    );
    return response.data.data;
  } catch (err) {
    handleError(dialogState, '로그 목록 조회 실패');
    throw err;
  }
});

// 페이지 변경 핸들러
const handlePageChange = (page: number) => {
  currentPage.value = page;
  sessionStorage.setItem('logCurrentPage', page.toString());
};

const toggleOrder = () => {
  order.value = order.value === 'DESC' ? 'ASC' : 'DESC';
  // 정렬이 변경될 때 첫 페이지로 이동
  currentPage.value = 1;
  sessionStorage.setItem('logCurrentPage', '1');
};

onBeforeUnmount(() => {
  sessionStorage.setItem('logCurrentPage', currentPage.value.toString());
});
</script>

<template>
  <article class="pt-10">
    <header class="w-full flex justify-end gap-6 pr-10">
      <div ref="dropdownRef" class="relative">
        <button @click="isOpen = !isOpen" class="manager-filter-btn">
          <span class="font-medium">{{ selectedPerPage.label }}</span>
          <SvgIcon :icon="ArrowDownIcon" :class="['transition-02s', isOpen ? 'rotate-180' : '']" />
        </button>

        <div v-if="isOpen" class="manager-filter-menu w-[112px]">
          <ul>
            <li v-for="option in perPageOptions" :key="option.id" @click="selectOption(option)" class="board-size-menu">
              {{ option.label }}
            </li>
          </ul>
        </div>
      </div>
    </header>
    <section class="overflow-y-auto mt-4 px-5 mb-10 hide-scrollbar">
      <div class="h-[calc(100vh-200px)]">
        <table class="min-w-full table-fixed">
          <thead class="administrator-thead sticky top-0 bg-primary-2 z-10">
            <tr>
              <th @click="toggleOrder" class="administrator-th text-start w-1/6 cursor-pointer duration-200">
                <div class="flex items-center gap-2">
                  시간
                  <SvgIcon
                    :icon="ArrowDownIcon"
                    :class="['w-4 h-4 transition-transform duration-200', order === 'ASC' ? 'rotate-180' : '']"
                  />
                </div>
              </th>
              <th class="administrator-th w-1/6">이름</th>
              <th class="administrator-th w-1/6">이메일</th>
              <th class="administrator-th w-1/6">상태</th>
              <th class="administrator-th w-1/6">유형</th>
              <th class="administrator-th w-1/6">IP</th>
            </tr>
          </thead>
          <tbody class="whitespace-nowrap">
            <tr v-for="item in logData?.accessLogs" :key="item.id" class="hover:bg-white-1">
              <td class="administrator-td text-start max-w-0">
                <p class="truncate">{{ formatDateTime(item.createdAt) }}</p>
              </td>
              <td class="administrator-td max-w-0">
                <p class="truncate">{{ item.username }}</p>
              </td>
              <td class="administrator-td max-w-0">
                <p class="truncate">{{ item.email }}</p>
              </td>
              <td class="administrator-td max-w-0">
                <div
                  :class="[
                    'px-3 py-1 rounded-full inline-flex items-center justify-center',
                    item.accessLogType === '로그인 성공' ? 'bg-green-0 text-green-1' : 'bg-red-0 text-red-1',
                  ]"
                >
                  <span class="text-sm font-medium">{{ item.accessLogType }}</span>
                </div>
              </td>
              <td class="administrator-td max-w-0">
                <p class="truncate">{{ item.role }}</p>
              </td>
              <td class="administrator-td max-w-0">
                <p class="truncate">{{ item.ip }}</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
    <CustomPagination
      :items-per-page="pageSize"
      :current-page="currentPage"
      :total-pages="logData?.totalPages || 1"
      :visible-pages="5"
      @page-change="handlePageChange"
    />
  </article>
  <CommonDialog
    v-if="dialogState.open"
    :isOneBtn="dialogState.isOneBtn"
    :title="dialogState.title"
    :mainText="dialogState.mainText"
    :onCancelClick="dialogState.onMainClick"
    :onMainClick="dialogState.onMainClick"
  />
</template>
