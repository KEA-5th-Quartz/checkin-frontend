<script setup lang="ts">
import { ArrowDownIcon, ClipIcon, LikeIcon, SendIcon, XIcon } from '@/assets/icons/path';
import SvgIcon from '../common/SvgIcon.vue';
import StatusBadge from '../common/Badges/StatusBadge.vue';
import { ref } from 'vue';
import { onClickOutside } from '@vueuse/core';

export interface TestTicketOption {
  id: number;
  value: string;
  label: string;
}

const firstCategory = [
  { id: 1, value: 'VM1', label: 'VM1' },
  { id: 2, value: 'VM2', label: 'VM2' },
  { id: 3, value: 'VM3', label: 'VM3' },
];

const secondCategory = [
  { id: 1, value: '생성', label: '생성' },
  { id: 2, value: '수정', label: '수정' },
  { id: 3, value: '삭제', label: '삭제' },
];

const managerOptions = [
  { id: 1, value: '김철환', label: '김철환' },
  { id: 2, value: '김현중', label: '김현중' },
  { id: 3, value: '박가현', label: '박가현' },
  { id: 4, value: '박석종', label: '박석종' },
  { id: 5, value: '박준한', label: '박준한' },
  { id: 6, value: '손성민', label: '손성민' },
  { id: 7, value: '임찬호', label: '임찬호' },
  { id: 8, value: '조기헌', label: '조기헌' },
  { id: 9, value: '최현준', label: '최현준' },
];

// 1차 카테고리
const firstCategorySelected = ref(firstCategory[0]);
const isFirstCategoryOpen = ref(false);
const firstCategoryDropdownRef = ref<HTMLElement | null>(null);

// 2차 카테고리
const secondCategorySelected = ref(secondCategory[0]);
const isSecondCategoryOpen = ref(false);
const secondCategoryDropdownRef = ref<HTMLElement | null>(null);

// 담당자
const managerSelected = ref(managerOptions[0]);
const isManagerOpen = ref(false);
const managerDropdownRef = ref<HTMLElement | null>(null);

// 1차 카테고리 이벤트
onClickOutside(firstCategoryDropdownRef, () => (isFirstCategoryOpen.value = false));

const firstCategorySelectOption = (option: TestTicketOption) => {
  firstCategorySelected.value = option;
  isFirstCategoryOpen.value = false;
};

// 2차 카테고리 이벤트
onClickOutside(secondCategoryDropdownRef, () => (isSecondCategoryOpen.value = false));

const secondCategorySelectOption = (option: TestTicketOption) => {
  secondCategorySelected.value = option;
  isSecondCategoryOpen.value = false;
};

// 담당자 이벤트
onClickOutside(managerDropdownRef, () => (isManagerOpen.value = false));

const managerSelectOption = (option: TestTicketOption) => {
  managerSelected.value = option;
  isManagerOpen.value = false;
};
</script>

<template>
  <section class="fixed right-0 top-0 w-[490px] h-screen overflow-y-auto rounded-[10px] shadow-md bg-white-0 py-9 px-7">
    <div class="flex items-center justify-between w-full">
      <p class="text-2xl">SSH 접속 확인</p>
      <SvgIcon :icon="XIcon" class="cursor-pointer" @click="console.log('x')" />
    </div>

    <div class="mt-6">
      <div class="flex gap-2.5 w-full">
        <!-- 왼쪽 블록 -->
        <div class="flex flex-col w-full">
          <!-- 중요도 블록 -->
          <div class="flex flex-col gap-3.5">
            <p class="text-sm">중요도</p>
            <div class="flex items-center gap-1 ml-1.5 bg-red-0 text-red-1 rounded-md pl-3 pr-2 py-1 max-w-fit">
              긴급 <SvgIcon :icon="ArrowDownIcon" />
            </div>
          </div>
          <!-- 1차 카테고리 블록 -->
          <div ref="firstCategoryDropdownRef" class="relative mt-[18px]">
            <p class="text-sm pb-1.5">1차 카테고리</p>
            <button
              @click="isFirstCategoryOpen = !isFirstCategoryOpen"
              class="manager-filter-btn w-full rounded-xl border-primary-2"
            >
              <span class="text-xs text-gray-1">{{ firstCategorySelected.label }}</span>
              <SvgIcon :icon="ArrowDownIcon" />
            </button>

            <div v-if="isFirstCategoryOpen" class="manager-filter-menu rounded-xl border-primary-2">
              <ul>
                <li
                  v-for="option in firstCategory"
                  :key="option.id"
                  @click="firstCategorySelectOption(option)"
                  class="px-3 py-2 hover:bg-gray-3 cursor-pointer text-xs text-gray-1"
                >
                  {{ option.label }}
                </li>
              </ul>
            </div>
          </div>

          <!-- 요청자 블록 -->
          <div class="mt-7">
            <p class="text-sm pb-2">요청자</p>
            <div class="manager-filter-btn w-full rounded-xl border-primary-2 justify-start gap-2">
              <div class="w-5 h-5 bg-green-500 rounded-full" />
              <p class="text-xs text-gray-1">King.kim</p>
            </div>
          </div>
          <!-- 요청 일자 블록 -->
          <div class="mt-11">
            <p class="text-sm pb-2">요청 일자</p>
            <p class="text-xs text-blue-1">2025/01/20</p>
          </div>
        </div>

        <!-- 오른쪽 블록 -->
        <div class="flex flex-col w-full">
          <!-- 중요도 블록 -->
          <div class="flex flex-col gap-3.5">
            <p class="text-sm">진행상태</p>
            <div class="flex items-center gap-1 ml-1.5 bg-blue-4 text-blue-2 rounded-md pl-3 pr-2 py-1 max-w-fit">
              진행중 <SvgIcon :icon="ArrowDownIcon" />
            </div>
          </div>
          <!-- 2차 카테고리 블록 -->
          <div ref="secondCategoryDropdownRef" class="relative mt-[18px]">
            <p class="text-sm pb-1.5">2차 카테고리</p>
            <button
              @click="isSecondCategoryOpen = !isSecondCategoryOpen"
              class="manager-filter-btn w-full rounded-xl border-primary-2"
            >
              <span class="text-xs text-gray-1">{{ secondCategorySelected.label }}</span>
              <SvgIcon :icon="ArrowDownIcon" />
            </button>

            <div v-if="isSecondCategoryOpen" class="manager-filter-menu rounded-xl border-primary-2 z-10">
              <ul>
                <li
                  v-for="option in secondCategory"
                  :key="option.id"
                  @click="secondCategorySelectOption(option)"
                  class="px-3 py-2 hover:bg-gray-3 cursor-pointer text-xs text-gray-1"
                >
                  {{ option.label }}
                </li>
              </ul>
            </div>
          </div>
          <!-- 담당자 블록 -->
          <div ref="managerDropdownRef" class="relative mt-7">
            <p class="text-sm pb-1.5">담당자</p>
            <button
              @click="isManagerOpen = !isManagerOpen"
              class="manager-filter-btn w-full rounded-xl border-primary-2 py-2.5"
            >
              <span class="text-xs text-gray-1">{{ managerSelected.label }}</span>
              <SvgIcon :icon="ArrowDownIcon" />
            </button>

            <div v-if="isManagerOpen" class="manager-filter-menu rounded-xl border-primary-2">
              <ul>
                <li
                  v-for="option in managerOptions"
                  :key="option.id"
                  @click="managerSelectOption(option)"
                  class="px-3 py-2 hover:bg-gray-3 cursor-pointer text-xs text-gray-1"
                >
                  {{ option.label }}
                </li>
              </ul>
            </div>
          </div>
          <!-- 마감 기한 블록 -->
          <div class="mt-11">
            <p class="text-sm pb-2">마감 기한</p>
            <p class="text-xs text-blue-1">2025/01/20</p>
          </div>
        </div>
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
  </section>
</template>
