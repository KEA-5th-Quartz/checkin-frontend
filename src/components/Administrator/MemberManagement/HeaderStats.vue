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
          <p class="text-lg lg:text-xl pr-2">{{ stats.admins }}</p>
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
          <p class="text-lg lg:text-xl pr-2">{{ stats.managers }}</p>
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
          <p class="text-lg lg:text-xl pr-2">{{ stats.users }}</p>
          <p class="text-black-0">명</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { AdminIcon, ManagerIcon, UserIcon } from '@/assets/icons/path';
import SvgIcon from '../../../components/common/SvgIcon.vue';
import { useCustomQuery } from '@/composables/useCustomQuery';
import { memberApi } from '@/services/memberService/memberService';

const { data: memberStatsData } = useCustomQuery(
  ['member-stats'],
  async () => {
    const response = await memberApi.getMemberStatsRole();
    return response.data;
  },
  {
    refetchInterval: 1000 * 60,
  },
);

const stats = computed(() => ({
  admins: memberStatsData.value?.data?.totalAdmins ?? 0,
  managers: memberStatsData.value?.data?.totalManagers ?? 0,
  users: memberStatsData.value?.data?.totalUsers ?? 0,
}));
</script>
