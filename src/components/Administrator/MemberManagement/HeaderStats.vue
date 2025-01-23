<template>
  <section class="flex justify-center gap-5 lg:gap-[80px] mt-12 w-full px-2">
    <!-- 관리자 -->
    <div class="flex-center gap-3 lg:gap-6 pr-20 lg:pr-[120px] border-r">
      <div class="flex-center min-w-12 lg:min-w-[60px] min-h-12 lg:min-h-[60px] bg-primary-5 rounded-full">
        <SvgIcon :icon="AdminIcon" />
      </div>
      <div>
        <p class="text-gray-1 pb-1.5 whitespace-nowrap">관리자</p>
        <div class="flex items-end">
          <p class="text-lg lg:text-xl pr-2">{{ adminCount }}</p>
          <p class="text-black-0">명</p>
        </div>
      </div>
    </div>

    <!-- 담당자 -->
    <div class="flex-center gap-3 lg:gap-6 px-20 lg:px-[70px]">
      <div class="flex-center min-w-12 lg:min-w-[60px] min-h-12 lg:min-h-[60px] bg-primary-5 rounded-full">
        <SvgIcon :icon="ManagerIcon" />
      </div>
      <div>
        <p class="text-gray-1 pb-1.5 whitespace-nowrap">담당자</p>
        <div class="flex items-end">
          <p class="text-lg lg:text-xl pr-2">{{ managerCount }}</p>
          <p class="text-black-0">명</p>
        </div>
      </div>
    </div>

    <!-- 사용자 -->
    <div class="flex-center gap-3 lg:gap-6 pl-20 lg:pl-[120px] border-l">
      <div class="flex-center min-w-12 lg:min-w-[60px] min-h-12 lg:min-h-[60px] bg-primary-5 rounded-full">
        <SvgIcon :icon="UserIcon" />
      </div>
      <div>
        <p class="text-gray-1 pb-1.5 whitespace-nowrap">사용자</p>
        <div class="flex items-end">
          <p class="text-lg lg:text-xl pr-2">{{ userCount }}</p>
          <p class="text-black-0">명</p>
        </div>
      </div>
    </div>
  </section>

  <!-- </div> -->
</template>

<script setup lang="ts">
import { AdminIcon, ManagerIcon, UserIcon } from '@/assets/icons/path';
import SvgIcon from '../../../components/common/SvgIcon.vue';

const props = defineProps({
  adminCount: {
    type: Number,
    required: true,
  },
  managerCount: {
    type: Number,
    required: true,
  },
  userCount: {
    type: Number,
    required: true,
  },
});
</script>
