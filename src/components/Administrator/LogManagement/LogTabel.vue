<script setup lang="ts">
import { ref } from 'vue';
import { logDataTest } from '../LogTest';
import CustomPagination from '@/components/common/CustomPagination.vue';
import LogStatusBadge from '@/components/common/Badges/LogStatusBadge.vue';

// 페이지 상태 관리
const currentPage = ref(1);
const itemsPerPage = 10;
const totalPages = 20;
// 페이지 변경 핸들러
const handlePageChange = (page: number) => {
  console.log(`페이지 변경: ${page}, 한 페이지에 표시할 데이터 수: ${itemsPerPage}`);
  console.log('추후 api에 현재 페이지와 한 페이지에 표시할 데이터 수 담아서 호출? ');
  currentPage.value = page; // 현재 페이지 업데이트
};
</script>

<template>
  <section class="overflow-x-auto mt-5 px-10 pb-20">
    <div class="min-h-[calc(100vh-300px)]">
      <table class="min-w-full table-fixed">
        <thead>
          <tr class="administrator-thead">
            <th class="administrator-th text-start w-1/6">시간</th>
            <th class="administrator-th w-1/6">이름</th>
            <th class="administrator-th w-1/6">이메일</th>
            <th class="administrator-th w-1/6">상태</th>
            <th class="administrator-th w-1/6">유형</th>
            <th class="administrator-th w-1/6">IP</th>
          </tr>
        </thead>
        <tbody class="whitespace-nowrap">
          <tr v-for="item in logDataTest" :key="item.id" class="hover:bg-white-1">
            <td class="administrator-td text-start max-w-0">
              <p class="truncate">{{ item.time }}</p>
            </td>
            <td class="administrator-td max-w-0">
              <p class="truncate">{{ item.name }}</p>
            </td>
            <td class="administrator-td max-w-0">
              <p class="truncate">{{ item.email }}</p>
            </td>
            <td class="administrator-td max-w-0">
              <LogStatusBadge :status="item.status" size="md" />
            </td>
            <td class="administrator-td max-w-0">
              <p class="truncate">{{ item.type }}</p>
            </td>
            <td class="administrator-td max-w-0">
              <p class="truncate">{{ item.ip }}</p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <CustomPagination
      :itemsPerPage="itemsPerPage"
      :currentPage="currentPage"
      :totalPages="totalPages"
      @pageChange="handlePageChange"
    />
  </section>
</template>
