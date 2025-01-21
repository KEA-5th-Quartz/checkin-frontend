<script setup lang="ts">
import StatusBadge from '@/components/common/Badges/StatusBadge.vue';
import { onClickOutside } from '@vueuse/core';
import { ref, onMounted, watch, nextTick } from 'vue';

const props = defineProps<{
  filterActive: boolean;
  buttonRef: HTMLElement | null;
}>();

const emit = defineEmits(['close']);
const modalRef = ref<HTMLElement | null>(null);

onClickOutside(modalRef, () => {
  emit('close');
});

const updatePosition = () => {
  if (modalRef.value && props.buttonRef) {
    const buttonRect = props.buttonRef.getBoundingClientRect();
    modalRef.value.style.position = 'fixed';
    modalRef.value.style.top = `${buttonRect.bottom}px`;
    modalRef.value.style.left = `${buttonRect.left - 250}px`;
  }
};

onMounted(() => {
  updatePosition();
  window.addEventListener('resize', updatePosition);
});

watch(
  () => props.filterActive,
  () => {
    nextTick(updatePosition);
  },
);
</script>

<template>
  <Teleport to="body">
    <div ref="modalRef" class="bg-white-0 rounded-lg w-[300px] shadow-md pb-4">
      <div class="py-4 px-8 bg-primary-0 text-white-1 font-bold">필터</div>

      <div class="flex flex-col gap-3 py-6 px-7 text-sm">
        <div class="flex items-center">
          <div />
          <p>나에게 할당</p>
        </div>

        <div class="flex items-center">
          <div />
          <p>이번 주에 기한</p>
        </div>

        <div class="flex items-center">
          <div />
          <p>할당되지 않음</p>
        </div>
      </div>

      <!-- 담당자 -->
      <div class="flex flex-col px-7 pb-5">
        <p class="border-b-2 border-gray-0 max-w-fit pr-4">담당자</p>
        <div class="flex flex-wrap gap-2 pt-2">
          <div v-for="i in 13" :key="i" class="w-7 h-7 rounded-full bg-purple-500" />
        </div>
      </div>

      <!-- 상태 -->
      <div class="flex flex-col px-7">
        <p class="border-b-2 border-gray-0 max-w-fit pr-4">상태</p>
        <div class="flex justify-center gap-2 pt-3.5">
          <StatusBadge status="생성" size="lg" class="cursor-pointer" />
          <StatusBadge status="진행중" size="lg" class="cursor-pointer" />
          <StatusBadge status="완료" size="lg" class="cursor-pointer" />
        </div>
      </div>

      <!-- 우선순위 -->
      <div class="flex flex-col px-7 pt-10">
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
          <div
            class="px-3 py-1.5 text-sm flex-center font-bold rounded-full cursor-pointer bg-primary-2 text-primary-3"
          >
            낮음
          </div>
        </div>
      </div>

      <!-- 카테고리 -->
    </div>
  </Teleport>
</template>
