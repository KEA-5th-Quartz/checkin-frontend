<script setup lang="ts">
import { CalendarIcon, ExclamationMarkIcon, PersonIcon } from '@/assets/icons/path';
import StatusBadge from '@/components/common/Badges/StatusBadge.vue';
import SvgIcon from '@/components/common/SvgIcon.vue';
import { onClickOutside } from '@vueuse/core';
import { ref } from 'vue';

const emit = defineEmits(['closeFilter']);
const modalRef = ref<HTMLElement | null>(null);

onClickOutside(modalRef, () => {
  emit('closeFilter');
});
</script>

<template>
  <div ref="modalRef" class="bg-white-0 rounded-lg w-[300px] h-[600px] overflow-y-auto shadow-md pb-4 hide-scrollbar">
    <div class="py-4 px-8 bg-primary-0 text-white-1 font-bold">필터</div>

    <section class="flex flex-col gap-3 py-6 px-7 text-sm">
      <div class="flex items-center gap-1">
        <SvgIcon :icon="PersonIcon" class="p-0.5 bg-gray-2 opacity-75 rounded-full" />
        <p>나에게 할당</p>
      </div>
      <div class="flex items-center gap-1">
        <SvgIcon :icon="CalendarIcon" />
        <p>이번 주에 기한</p>
      </div>
      <div class="flex items-center gap-1">
        <SvgIcon :icon="ExclamationMarkIcon" />
        <p>할당되지 않음</p>
      </div>
    </section>

    <!-- 담당자 -->
    <section class="flex flex-col px-7 pb-5">
      <p class="border-b-2 border-gray-0 max-w-fit pr-4">담당자</p>
      <div class="pt-2"></div>
    </section>

    <!-- 상태 -->
    <section class="flex flex-col px-7">
      <p class="border-b-2 border-gray-0 max-w-fit pr-4">상태</p>
      <div class="flex justify-center gap-2 pt-3.5">
        <StatusBadge status="생성" size="lg" class="cursor-pointer" />
        <StatusBadge status="진행중" size="lg" class="cursor-pointer" />
        <StatusBadge status="완료" size="lg" class="cursor-pointer" />
      </div>
    </section>

    <!-- 우선순위 -->
    <section class="flex flex-col px-7 pt-10">
      <p class="border-b-2 border-gray-0 max-w-fit pr-4">우선순위</p>
      <div class="flex gap-2 pt-3.5">
        <div class="px-3 py-1.5 text-sm flex-center font-bold rounded-full cursor-pointer bg-red-0 text-red-1">
          긴급
        </div>
        <div class="px-3 py-1.5 text-sm flex-center font-bold rounded-full cursor-pointer bg-orange-0 text-orange-1">
          높음
        </div>
        <div class="px-3 py-1.5 text-sm flex-center font-bold rounded-full cursor-pointer bg-green-0 text-green-1">
          보통
        </div>
        <div class="px-3 py-1.5 text-sm flex-center font-bold rounded-full cursor-pointer bg-primary-2 text-primary-3">
          낮음
        </div>
      </div>
    </section>

    <!-- 카테고리 -->
    <section class="flex flex-col px-7 pt-10">
      <p class="border-b-2 border-gray-0 max-w-fit">카테고리</p>
      <div class="flex flex-col gap-3 pb-5">
        <div class="border border-gray-1 rounded-[10px] py-[5px] text-start pl-3 hover:bg-gray-3 mt-5">
          1차 카테고리
        </div>
        <div class="border border-gray-1 rounded-[10px] py-[5px] text-start pl-3 hover:bg-gray-3">1차 카테고리</div>
        <div class="border border-gray-1 rounded-[10px] py-[5px] text-start pl-3 hover:bg-gray-3">1차 카테고리</div>
      </div>
    </section>
  </div>
</template>
