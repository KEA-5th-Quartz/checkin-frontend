<script setup lang="ts">
import { ref } from 'vue';
import { tableDataTest } from '../manager/dashboardTest';
import UserTemplateTicket from './UserTemplateTicket.vue';
import { useUserTicketListStore } from '@/stores/userTicketListStore';

const ticketStore = useUserTicketListStore();
console.log(ticketStore);

const selectedTicketId = ref<number | null>(null);

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
    console.log(`체크 해제된 티켓 ID: ${id}`);
    ticketStore.removeSelectedTicket(id);
  } else {
    console.log(`체크된 티켓 ID: ${id}`);
    ticketStore.addSelectedTicket(id);
  }
  // 현재 선택된 모든 티켓 출력
  console.log('현재 선택된 티켓들:', {
    selectedIds: Array.from(ticketStore.selectedTickets),
    totalSelected: ticketStore.selectedTickets.size,
  });
};
</script>

<template>
  <section class="overflow-x-auto mt-5 px-5 pb-20">
    <div class="min-h-[calc(100vh-300px)] h-full">
      <table class="min-w-full table-fixed">
        <thead class="manager-thead">
          <tr>
            <th v-if="ticketStore.isDeleteMode" class="manager-th w-[1%]">선택</th>
            <th :class="['manager-th w-[5%]', ticketStore.isDeleteMode ? 'pl-0' : 'pl-6']">번호</th>
            <th class="manager-th text-start w-[25%]">제목</th>
            <th class="manager-th w-[10%]">1차 <span class="hidden lg:inline-block">카테고리</span></th>
            <th class="manager-th w-[7.5%]">2차 <span class="hidden lg:inline-block">카테고리</span></th>
            <th class="manager-th w-[25%]">설명</th>
            <th class="manager-th w-[5%]">마감일</th>
          </tr>
        </thead>

        <tbody class="whitespace-nowrap">
          <tr
            v-for="item in tableDataTest"
            :key="item.id"
            class="hover:bg-white-1 relative"
            @click="handleRowClick(item.id)"
          >
            <td v-if="ticketStore.isDeleteMode" class="manager-td">
              <div class="flex items-center justify-center">
                <input
                  type="checkbox"
                  :class="[item.status !== '진행중' ? 'w-4 h-4 cursor-pointer' : 'hidden']"
                  :checked="ticketStore.selectedTickets.has(item.id)"
                  @click="(e) => handleCheckboxClick(e, item.id)"
                />
              </div>
            </td>
            <td :class="['manager-td max-w-0', ticketStore.isDeleteMode ? 'pl-0' : 'pl-6']">
              <p :title="item.id as unknown as string">
                {{ item.id }}
              </p>
            </td>
            <td class="manager-td max-w-0 text-start">
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
            <td class="manager-td">
              <p class="truncate">
                {{ item.dueDate }}
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div>페이지네이션</div>

    <UserTemplateTicket v-if="selectedTicketId" :ticket-id="selectedTicketId" @close="handleCloseModal" />
  </section>
</template>
