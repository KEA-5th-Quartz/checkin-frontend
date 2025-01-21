<script setup lang="ts">
import PriorityBadge from '../common/Badges/PriorityBadge.vue';
import StatusBadge from '../common/Badges/StatusBadge.vue';
import { tableDataTest } from './dashboardTest';
import ManagerTicket from './ManagerTicket.vue';
</script>

<template>
  <section class="overflow-x-auto mt-5 px-5 pb-20">
    <div class="min-h-[calc(100vh-300px)]">
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
              <StatusBadge :status="item.status" size="md" />
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
              <PriorityBadge :priority="item.priority" size="md" />
            </td>
          </tr>
          <!-- 빈 행 추가 (10 - 실제 데이터 수) -->
        </tbody>
      </table>
    </div>

    <div>페이지네이션</div>

    <ManagerTicket />
  </section>
</template>
