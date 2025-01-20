<script setup lang="ts">
import { tableDataTest } from './dashboardTest';

const getStatusClass = (status: string) => {
  switch (status) {
    case '생성':
      return 'bg-gray-4 text-gray-0';
    case '진행중':
      return 'bg-primary-2 text-primary-3';
    case '완료':
      return 'bg-green-0 text-green-1';
    default:
      return '';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case '긴급':
      return {
        dot: 'bg-red-1',
        text: 'text-red-1',
      };
    case '높음':
      return {
        dot: 'bg-orange-1',
        text: 'text-orange-1',
      };
    case '보통':
      return {
        dot: 'bg-green-1',
        text: 'text-green-1',
      };
    case '낮음':
      return {
        dot: 'bg-green-1',
        text: 'text-green-1',
      };
    default:
      return {
        dot: '',
        text: '',
      };
  }
};
</script>

<template>
  <section class="overflow-x-auto mt-5 px-5 pb-20">
    <table class="min-w-full table-fixed">
      <thead class="manager-thead">
        <tr>
          <th class="manager-th text-start w-[25%] pl-6">제목</th>
          <th class="manager-th w-[10%]">1차 카테고리</th>
          <th class="manager-th w-[10%]">2차 카테고리</th>
          <th class="manager-th w-[25%]">설명</th>
          <th class="manager-th w-[10%]">진행 상태</th>
          <th class="manager-th w-[10%]">담당자</th>
          <th class="manager-th w-[5%]">마감기한</th>
          <th class="manager-th w-[5%] pr-6">중요도</th>
        </tr>
      </thead>

      <tbody class="whitespace-nowrap">
        <tr v-for="item in tableDataTest" :key="item.id" class="hover:bg-white-1">
          <td class="manager-td max-w-0 text-start pl-6">
            <p class="truncate" :title="item.title">
              {{ item.title }}
            </p>
          </td>
          <td class="manager-td max-w-0">
            <p class="truncate">
              {{ item.category1 }}
            </p>
          </td>
          <td class="manager-td max-w-0">
            <p class="truncate">
              {{ item.category2 }}
            </p>
          </td>
          <td class="manager-td max-w-0 text-start">
            <p class="truncate" :title="item.description">
              {{ item.description }}
            </p>
          </td>
          <td class="manager-td text-center">
            <span :class="['px-2 py-1 text-xs font-medium rounded-full', getStatusClass(item.status)]">
              {{ item.status }}
            </span>
          </td>
          <td class="manager-td">
            <div class="flex items-center gap-2 ml-4">
              <div class="h-7 w-7 rounded-full bg-pink-200" />
              <span class="truncate">{{ item.assignee }}</span>
            </div>
          </td>
          <td class="manager-td">
            <p class="truncate">
              {{ item.dueDate }}
            </p>
          </td>
          <td class="manager-td pr-6">
            <div v-if="item.priority" class="flex-center gap-2">
              <div :class="[`w-2 h-2 rounded-full ${getPriorityColor(item.priority).dot}`]"></div>
              <span :class="['text-sm', getPriorityColor(item.priority).text]">
                {{ item.priority }}
              </span>
            </div>
            <div v-else class="text-center">-</div>
          </td>
        </tr>
        <!-- 빈 행 추가 (10 - 실제 데이터 수) -->
        <tr v-for="i in 10 - tableDataTest.length" :key="`empty-${i}`">
          <td class="manager-none-td">&nbsp;</td>
          <td class="manager-none-td">&nbsp;</td>
          <td class="manager-none-td">&nbsp;</td>
          <td class="manager-none-td">&nbsp;</td>
          <td class="manager-none-td">&nbsp;</td>
          <td class="manager-none-td">&nbsp;</td>
          <td class="manager-none-td">&nbsp;</td>
          <td class="manager-none-td">&nbsp;</td>
        </tr>
      </tbody>
    </table>

    <div>페이지네이션</div>
  </section>
</template>
