<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { statsApi } from '@/services/statsService/statsService';
import { useMemberStore } from '@/stores/memberStore';

const memberStore = useMemberStore();
const ticketCount = ref(0);

const fetchManagerDueTodayStats = async () => {
  try {
    const response = await statsApi.getManagerDueTodayStats(memberStore.memberId);
    const apiData = response.data;

    ticketCount.value = apiData.data.ticketCount;
  } catch (error) {
    console.error('담당자 통계 조회 실패:', error);
  }
};

onMounted(() => {
  fetchManagerDueTodayStats();
});
</script>

<template>
  <section class="overflow-x-auto mt-5 pr-5 pb-20 w-1/5">
    <div class="statistics-section">
      <h2 class="statistics-section-title">오늘까지인 티켓</h2>
      <div class="text-2xl font-bold text-blue-3">{{ ticketCount }} 건</div>
    </div>
  </section>
</template>
