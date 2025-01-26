<script setup lang="ts">
import { ref } from 'vue'; // 반응형 상태 생성
import UserTemplateFilter from './UserTemplateFilter.vue'; // 템플리 목록 상단 컴포넌트
import { TemplateDataTest } from '../user/dashboardVacantTest'; // 템플릿 목록 조회
import UserTemplateTicket from './UserTemplateTicket.vue'; // 상세 템플릿 조회
import { useUserTemplateListStore } from '@/stores/userTemplateListStore'; // 템플릿 상태관리
import SvgIcon from '../common/SvgIcon.vue'; // 아이콘
import { CreateTicketIcon } from '@/assets/icons/path';

const ticketStore = useUserTemplateListStore();

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
</script>

<template>
  <section v-if="TemplateDataTest.length !== 0">
    <UserTemplateFilter />
    <article class="overflow-x-auto mt-5 px-5 pb-20">
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
              <th class="manager-th w-[7.5%]">진행 상태</th>
            </tr>
          </thead>

          <tbody class="whitespace-nowrap">
            <tr
              v-for="item in TemplateDataTest"
              :key="item.id"
              class="hover:bg-white-1 relative"
              @click="handleRowClick(item.id)"
            >
              <td v-if="ticketStore.isDeleteMode" class="manager-td">
                <div class="flex items-center justify-center">
                  <input
                    type="checkbox"
                    :class="['w-4 h-4 cursor-pointer']"
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

      <UserTemplateTicket v-if="selectedTicketId" :ticket-id="selectedTicketId" @close="handleCloseModal" />
    </article>
  </section>
  <section v-else class="w-full flex flex-col items-center pb-40">
    <div class="flex flex-col items-center gap-8 mt-32">
      <img src="@/assets/no-template.png" class="w-96 h-96" />
      <div class="flex flex-col items-center gap-2">
        <h1 class="text-xl">아직 생성한 템플릿이 없어요</h1>
        <p>템플릿 생성을 눌러 새로운 템플릿을 생성하세요</p>
      </div>
    </div>

    <button class="flex items-center bg-primary-0 py-2.5 px-8 rounded text-white-0 gap-2.5 text-sm font-semibold mt-20">
      <SvgIcon :icon="CreateTicketIcon" />
      템플릿 생성
    </button>
  </section>
</template>
