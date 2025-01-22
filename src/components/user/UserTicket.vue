<script setup lang="ts">
import { ClipIcon, LikeIcon, PencilIcon, SendIcon, XIcon } from '@/assets/icons/path';
import SvgIcon from '../common/SvgIcon.vue';
import { computed, onMounted, ref } from 'vue';
import PriorityBadge from '../common/Badges/PriorityBadge.vue';
import StatusBadge from '../common/Badges/StatusBadge.vue';
import { useTicketStore } from '@/stores/userTicketStore';
import { firstCategory, managerOptions, secondCategory } from '../manager/ticketOptionTest';
import { BaseTicketOption } from '@/types/tickets';
import CustomDropdown from '../common/CustomDropdown.vue';

defineProps<{
  ticketId: number;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();
const show = ref(true);

const handleClose = () => {
  show.value = false;
  setTimeout(() => {
    emit('close');
  }, 300);
};

let ticketDefaultTest = {
  title: 'SSH 접속 확인',
  firstCategory: 'VM1',
  secondCategory: '생성',
  manager: 'King.kim',
  endDate: '2025-02-22',
  content: 'Github Repo가 접속이 되지 않습니다.',
};

const ticketStore = useTicketStore();

onMounted(() => {
  ticketStore.setTicket(ticketDefaultTest);
});

const handleCancelEdit = () => {
  ticketStore.resetToOriginal();
  ticketStore.toggleEditMode();
};

const handleConfirmEdit = () => {
  ticketStore.toggleEditMode();
};

const startEdit = () => {
  ticketStore.toggleEditMode();
};

const firstCategorySelected = computed({
  get: () => {
    // store의 현재 값과 매칭되는 option을 찾음
    return firstCategory.find((option) => option.label === ticketStore.ticket?.firstCategory) || firstCategory[0];
  },
  set: (newValue: BaseTicketOption) => {
    if (ticketStore.ticket) {
      ticketStore.updateTicket({
        ...ticketStore.ticket,
        firstCategory: newValue.label,
      });
    }
  },
});

const handleFirstCategorySelect = (option: BaseTicketOption) => {
  if (ticketStore.ticket) {
    ticketStore.updateTicket({
      ...ticketStore.ticket,
      firstCategory: option.label,
    });
  }
};

const secondCategorySelected = computed({
  get: () => {
    return secondCategory.find((option) => option.label === ticketStore.ticket?.secondCategory) || secondCategory[0];
  },
  set: (newValue: BaseTicketOption) => {
    if (ticketStore.ticket) {
      ticketStore.updateTicket({
        ...ticketStore.ticket,
        secondCategory: newValue.label,
      });
    }
  },
});

const handleSecondCategorySelect = (option: BaseTicketOption) => {
  if (ticketStore.ticket) {
    ticketStore.updateTicket({
      ...ticketStore.ticket,
      secondCategory: option.label,
    });
  }
};

const managerSelected = computed({
  get: () => {
    return managerOptions.find((option) => option.label === ticketStore.ticket?.manager) || managerOptions[0];
  },
  set: (newValue: BaseTicketOption) => {
    if (ticketStore.ticket) {
      ticketStore.updateTicket({
        ...ticketStore.ticket,
        manager: newValue.label,
      });
    }
  },
});

const handleManagerSelect = (option: BaseTicketOption) => {
  if (ticketStore.ticket) {
    ticketStore.updateTicket({
      ...ticketStore.ticket,
      manager: option.label,
    });
  }
};
</script>

<template>
  <Teleport to="body">
    <div v-if="ticketId && ticketStore.ticket" class="fixed inset-0 z-10">
      <div class="fixed inset-0 transition-opacity" @click="handleClose" />
      <div
        class="fixed top-0 right-0 w-[490px] h-screen bg-white-0 flex flex-col py-9 px-6 rounded-[10px] shadow-md translate-x-full z-10"
        :class="{ 'drawer-enter': show, 'drawer-leave': !show }"
      >
        <!-- 헤더 -->
        <div class="flex items-center justify-between w-full gap-3">
          <p v-if="!ticketStore.isEditMode">{{ ticketStore.ticket.title }}</p>
          <input
            v-else
            v-model="ticketStore.ticket.title"
            class="w-full rounded-xl px-1 py-1 mb-1 border border-gray-2 focus:outline-none"
          />
          <div v-if="!ticketStore.isEditMode" class="flex items-center gap-8">
            <SvgIcon :icon="PencilIcon" :iconOptions="{ fill: '#000' }" class="cursor-pointer" @click="startEdit" />
            <SvgIcon :icon="XIcon" class="cursor-pointer" @click="handleClose" />
          </div>
          <div v-else class="flex items-center gap-4">
            <button
              @click="handleCancelEdit"
              class="px-6 py-1.5 text-sm border border-gray-1 rounded-lg hover:bg-gray-100 whitespace-nowrap"
            >
              취소
            </button>
            <button
              @click="handleConfirmEdit"
              class="px-6 py-1.5 text-sm text-white bg-primary-0 rounded-lg hover:bg-opacity-80 text-white-0 whitespace-nowrap"
            >
              저장
            </button>
          </div>
        </div>

        <!-- 컨텐츠 -->
        <div class="mt-6 flex-1 overflow-y-auto hide-scrollbar">
          <div class="flex gap-2.5 w-full">
            <!-- 왼쪽 섹션 -->
            <section class="flex flex-col w-full">
              <!-- 중요도 블록 -->
              <div class="flex flex-col items-start">
                <p class="text-sm pb-2">중요도</p>
                <div class="py-1">
                  <PriorityBadge />
                </div>
              </div>

              <!-- 1차 카테고리 블록 -->
              <div class="flex flex-col mt-7">
                <p class="text-sm pb-2">1차 카테고리</p>
                <div
                  v-if="!ticketStore.isEditMode"
                  class="border border-gray-2 rounded-xl py-2 px-4 text-gray-1 text-sm"
                >
                  {{ ticketStore.ticket.firstCategory }}
                </div>
                <CustomDropdown
                  v-else
                  label=""
                  :options="firstCategory"
                  :selected-option="firstCategorySelected"
                  :onOptionSelect="handleFirstCategorySelect"
                  @select="(option: BaseTicketOption) => (firstCategorySelected = option)"
                  isEdit
                />
              </div>
              <!-- 요청자 블록 -->
              <div class="flex flex-col mt-7">
                <p class="text-sm pb-2">요청자</p>
                <div class="manager-filter-btn w-full rounded-xl border-gray-2 justify-start gap-2">
                  <div class="w-5 h-5 bg-green-500 rounded-full" />
                  <p class="text-xs text-gray-1">King.kim</p>
                </div>
              </div>
              <!-- 요청 일자 블록 -->
              <div class="mt-7">
                <p class="text-sm pb-2">요청 일자</p>
                <p class="text-xs text-blue-1">2025/01/20</p>
              </div>
            </section>

            <!-- 오른쪽 섹션 -->
            <section class="flex flex-col w-full">
              <!-- 진행상태 블록 -->
              <div class="flex flex-col items-start">
                <p class="text-sm pb-2">진행상태</p>
                <StatusBadge status="생성" size="xl" />
              </div>

              <!-- 2차 카테고리 블록 -->
              <div class="flex flex-col mt-7">
                <p class="text-sm pb-2">2차 카테고리</p>
                <div
                  v-if="!ticketStore.isEditMode"
                  class="border border-gray-2 rounded-xl py-2 px-4 text-gray-1 text-sm"
                >
                  {{ ticketStore.ticket.secondCategory }}
                </div>
                <CustomDropdown
                  v-else
                  label=""
                  :options="secondCategory"
                  :selected-option="secondCategorySelected"
                  :onOptionSelect="handleSecondCategorySelect"
                  @select="(option: BaseTicketOption) => (secondCategorySelected = option)"
                  isEdit
                />
              </div>
              <!-- 담당자 블록 -->
              <div class="flex flex-col mt-7">
                <p class="text-sm pb-2">담당자</p>
                <div
                  v-if="!ticketStore.isEditMode"
                  class="manager-filter-btn w-full rounded-xl border-gray-2 justify-start gap-2"
                >
                  <div class="w-5 h-5 bg-green-500 rounded-full" />
                  <p class="text-xs text-gray-1">{{ ticketStore.ticket.manager }}</p>
                </div>
                <CustomDropdown
                  v-else
                  label=""
                  :options="managerOptions"
                  :selected-option="managerSelected"
                  :onOptionSelect="handleManagerSelect"
                  @select="(option: BaseTicketOption)=> (managerSelected = option)"
                  isEdit
                />
              </div>
              <!-- 마감 기한 블록 -->
              <div class="mt-7">
                <p class="text-sm pb-2">마감 기한</p>
                <p v-if="!ticketStore.isEditMode" class="text-xs text-blue-1">{{ ticketStore.ticket.endDate }}</p>
                <input
                  v-else
                  type="date"
                  :min="new Date().toISOString().split('T')[0]"
                  class="text-xs text-blue-1 border border-gray-2 rounded-xl w-full p-1"
                  v-model="ticketStore.ticket.endDate"
                />
              </div>
            </section>
          </div>

          <!-- 설명 -->
          <div class="mt-11">
            <p class="font-semibold mb-3">설명</p>
            <div
              v-if="!ticketStore.isEditMode"
              class="min-h-32 max-h-36 overflow-scroll border-y border-y-primary-2 px-2 py-6 hide-scrollbar"
            >
              <p class="text-sm text-gray-1 break-words">{{ ticketStore.ticket.manager }}</p>
            </div>
            <textarea
              v-else
              v-model="ticketStore.ticket.manager"
              class="min-h-32 max-h-36 overflow-scroll border-y border-y-primary-2 px-2 py-6 hide-scrollbar w-full resize-none text-sm text-gray-1 break-words focus:outline-none"
            />
          </div>

          <!-- 첨부 파일 -->
          <div class="mt-6" v-if="!ticketStore.isEditMode">
            <div
              class="bg-white-1 text-gray-0 rounded-[14px] border border-gray-2 py-1 px-2.5 max-w-fit cursor-pointer text-sm"
            >
              Customer KYC
            </div>
          </div>

          <!-- 댓글 입력창 -->
          <div v-if="!ticketStore.isEditMode" class="flex flex-col gap-5 mt-4 h-56 overflow-y-auto hide-scrollbar pb-4">
            <!-- 로그 -->
            <div class="flex items-center gap-5">
              <div class="w-8 h-8 bg-blue-300 rounded-full" />
              <div>
                <p class="text-sm text-gray-1">Neo.js 상태 변경 2025-01-17 13:27</p>
                <div class="flex gap-2">
                  <StatusBadge status="생성" size="sm" />
                  <span>→</span>
                  <StatusBadge status="진행중" size="sm" />
                </div>
              </div>
            </div>

            <!-- 댓글 -->
            <div class="flex gap-2">
              <div class="flex flex-col gap-2">
                <div class="w-8 h-8 bg-blue-300 rounded-full" />
                <p class="text-xs whitespace-nowrap">Neo.js</p>
              </div>
              <div class="px-3 py-3 border border-gray-1 rounded-[10px]">
                <p class="text-sm">
                  화면에 출력된 로그좀 볼 수 있을까요? 스샷 첨부 부탁 드려요. 사용하시는 계정과 서버 호스트명도
                  부탁드립니다.
                </p>
              </div>
              <SvgIcon :icon="LikeIcon" class-name="flex self-end cursor-pointer" />
            </div>

            <div class="flex gap-2">
              <div class="flex flex-col gap-2">
                <div class="w-8 h-8 bg-blue-300 rounded-full" />
                <p class="text-xs whitespace-nowrap">Neo.js</p>
              </div>
              <div class="px-3 py-3 border border-gray-1 rounded-[10px]">
                <p class="text-sm">
                  화면에 출력된 로그좀 볼 수 있을까요? 스샷 첨부 부탁 드려요. 사용하시는 계정과 서버 호스트명도
                  부탁드립니다.
                </p>
              </div>
              <SvgIcon :icon="LikeIcon" class-name="flex self-end cursor-pointer" />
            </div>
          </div>

          <!-- 댓글 인풋 -->
          <div v-if="!ticketStore.isEditMode" class="mt-4 w-full border border-gray-2 px-4 pt-4 rounded-xl">
            <textarea
              placeholder="댓글을 작성하세요"
              class="w-full placeholder:text-gray-1 resize-none focus:outline-none hide-scrollbar"
            />
            <div class="flex gap-2 w-full justify-end pb-1.5">
              <SvgIcon :icon="ClipIcon" class="cursor-pointer" />
              <SvgIcon :icon="SendIcon" class="cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.drawer-enter {
  animation: slideIn 0.3s forwards;
}
.drawer-leave {
  animation: slideOut 0.3s forwards;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
@keyframes slideOut {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(100%);
  }
}

input[type='date']::-webkit-calendar-picker-indicator {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

input[type='date'] {
  position: relative;
  background-color: white;
}
</style>
