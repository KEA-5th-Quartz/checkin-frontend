<template>
  <section class="adminHeader-container">
    <div class="adminHeader-section adminHeader-section-left">
      <div class="adminHeader-icon">
        <SvgIcon :icon="AdminIcon" />
      </div>
      <div>
        <p class="adminHeader-label">관리자</p>
        <div class="flex items-end">
          <p class="adminHeader-value">{{ stats.admins }}</p>
          <p class="adminHeader-unit">명</p>
        </div>
      </div>
    </div>
    <div class="adminHeader-section adminHeader-section-center">
      <div class="adminHeader-icon">
        <SvgIcon :icon="ManagerIcon" />
      </div>
      <div>
        <p class="adminHeader-label">담당자</p>
        <div class="flex items-end">
          <p class="adminHeader-value">{{ stats.managers }}</p>
          <p class="adminHeader-unit">명</p>
        </div>
      </div>
    </div>
    <div class="adminHeader-section adminHeader-section-right">
      <div class="adminHeader-icon">
        <SvgIcon :icon="UserIcon" />
      </div>
      <div>
        <p class="adminHeader-label">사용자</p>
        <div class="flex items-end">
          <p class="adminHeader-value">{{ stats.users }}</p>
          <p class="adminHeader-unit">명</p>
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
