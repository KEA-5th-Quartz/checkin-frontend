<script setup lang="ts">
import { ClipIcon, LikeIcon, SendIcon, XIcon } from '@/assets/icons/path';
import SvgIcon from '../../common/SvgIcon.vue';
import StatusBadge from '../../common/Badges/StatusBadge.vue';
import { ref } from 'vue';
import CustomDropdown from '../../common/CustomDropdown.vue';
import { StatusTicketOption, BaseTicketOption } from '@/types/tickets';
import { priority, status, firstCategory, secondCategory, managerOptions } from '../ticketOptionTest';

defineProps<{
  ticketId: number;
}>();
// 'close'라는 이벤트를 방출할 수 있는 emit 함수 정의
const emit = defineEmits<{
  (e: 'close'): void; // void는 이벤트가 데이터를 전달하지 않음을 의미
}>();
// drawer의 표시 여부를 제어하는 반응형 변수
const show = ref(true);

const handleClose = () => {
  show.value = false;
  setTimeout(() => {
    emit('close');
  }, 300);
};

const prioritySelected = ref<StatusTicketOption>(priority[0]);
const handlePrioritySelect = (option: StatusTicketOption) => {
  console.log('중요도 변경:', option.label);
  prioritySelected.value = option;
};

const statusSelected = ref<StatusTicketOption>(status[0]);
const handleStatusSelect = (option: StatusTicketOption) => {
  console.log('상태 변경:', option.label);
  statusSelected.value = option;
};

const firstCategorySelected = ref(firstCategory[0]);
const handleFirstCategorySelect = (option: BaseTicketOption) => {
  console.log('1차 카테고리 변경:', option.label);
  firstCategorySelected.value = option;
};

const secondCategorySelected = ref(secondCategory[0]);
const handleSecondCategorySelect = (option: BaseTicketOption) => {
  console.log('2차 카테고리 변경:', option.label);
  secondCategorySelected.value = option;
};

const managerSelected = ref(managerOptions[0]);
const handleManagerSelect = (option: BaseTicketOption) => {
  console.log('담당자 변경:', option.label);
  managerSelected.value = option;
};
</script>

<template>
  <Teleport to="body">
    <div v-if="ticketId" class="fixed inset-0 z-10">
      <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="handleClose" />
      <div
        class="fixed top-0 right-0 w-[490px] h-screen bg-white-0 flex flex-col py-9 px-6 rounded-[10px] shadow-md translate-x-full z-10"
        :class="{ 'drawer-enter': show, 'drawer-leave': !show }"
      >
        <!-- 헤더 -->
        <div class="flex items-center justify-between w-full">
          <p class="text-2xl">SSH 접속 확인</p>
          <SvgIcon :icon="XIcon" class="cursor-pointer" @click="handleClose" />
        </div>

        <!-- 컨텐츠 -->
        <div class="mt-6 flex-1 overflow-y-auto hide-scrollbar">
          <div class="flex gap-2.5 w-full">
            <!-- 왼쪽 섹션 -->
            <section class="flex flex-col w-full">
              <!-- 중요도 블록 -->
              <CustomDropdown
                label="중요도"
                :options="priority"
                :selected-option="prioritySelected"
                :onOptionSelect="handlePrioritySelect"
                @select="(option: StatusTicketOption) => prioritySelected = option"
                has-color
              />
              <!-- 1차 카테고리 블록 -->
              <CustomDropdown
                label="1차 카테고리"
                :options="firstCategory"
                :selected-option="firstCategorySelected"
                :onOptionSelect="handleFirstCategorySelect"
                @select="(option:BaseTicketOption ) => (firstCategorySelected = option)"
                class="mt-[18px]"
              />
              <!-- 요청자 블록 -->
              <div class="mt-7">
                <p class="text-sm pb-2">요청자</p>
                <div class="manager-filter-btn w-full rounded-xl border-primary-2 justify-start gap-2">
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
              <CustomDropdown
                label="진행상태"
                :options="status"
                :selected-option="statusSelected"
                :onOptionSelect="handleStatusSelect"
                @select="(option:StatusTicketOption) => (statusSelected = option)"
                has-color
              />
              <!-- 2차 카테고리 블록 -->
              <CustomDropdown
                label="2차 카테고리"
                :options="secondCategory"
                :selected-option="secondCategorySelected"
                :onOptionSelect="handleSecondCategorySelect"
                @select="(option:BaseTicketOption) => (secondCategorySelected = option)"
                class="mt-[18px]"
              />
              <!-- 담당자 블록 -->
              <CustomDropdown
                label="담당자"
                :options="managerOptions"
                :selected-option="managerSelected"
                :onOptionSelect="handleManagerSelect"
                @select="(option:BaseTicketOption) => (managerSelected = option)"
                class="mt-7"
              />
              <!-- 마감 기한 블록 -->
              <div class="mt-7">
                <p class="text-sm pb-2">마감 기한</p>
                <p class="text-xs text-blue-1">2025/01/20</p>
              </div>
            </section>
          </div>

          <!-- 설명 -->
          <div class="mt-11">
            <p class="font-semibold mb-3">설명</p>
            <div class="min-h-32 border-y border-y-primary-2 px-2 py-6">
              <p class="text-sm text-gray-1">Github Repo가 접속이 되지 않습니다.</p>
            </div>
          </div>

          <!-- 첨부파일 -->
          <div class="mt-6">
            <div
              class="bg-white-1 text-gray-0 rounded-[14px] border border-gray-2 py-1 px-2.5 max-w-fit cursor-pointer text-sm"
            >
              Customer KYC
            </div>
          </div>

          <!-- 댓글 창 -->
          <div class="flex flex-col gap-5 mt-4 h-56 overflow-y-auto hide-scrollbar pb-4">
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
          <div class="mt-4 w-full border border-gray-2 px-4 pt-4 rounded-xl">
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
</style>
