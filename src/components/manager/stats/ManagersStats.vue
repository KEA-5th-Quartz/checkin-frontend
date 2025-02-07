<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';

import { statsApi } from '@/services/statsService/statsService';
import { computed } from 'vue';
const timeFilterTickets = ref('WEEK');
const series = ref<{ name: string; data: number[] }[]>([]);
const categories = ref<string[]>([]);
const chartOptions = ref({
  chart: {
    type: 'bar',
    stacked: true,
    toolbar: { show: false },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '30%',
      borderRadius: 5,
    },
  },
  dataLabels: {
    enabled: true,
    style: { fontSize: '13px' },
  },
  xaxis: {
    categories: [],
  },
  colors: ['#3570FF', '#828DCA'],
  legend: {
    position: 'top',
    horizontalAlign: 'right',
    markers: {
      radius: 12,
      shape: 'circle',
    },
  },
});
//  API 호출 함수 (필터값 변경 시 재호출)
const loadManagerStats = async () => {
  try {
    const response = await statsApi.getManagersStats(timeFilterTickets.value);

    // API 응답 데이터 타입 적용
    const data = response.data.data;
    //  담당자 목록 (X축)
    categories.value = data.map((manager) => manager.userName);

    //  진행 중 / 완료 티켓 개수 추출
    const inProgressData = data.map((manager) => {
      const inProgress = manager.state.find((s) => s.status === 'IN_PROGRESS');
      return inProgress ? inProgress.ticketCount : 0;
    });
    const closedData = data.map((manager) => {
      const closed = manager.state.find((s) => s.status === 'CLOSED');
      return closed ? closed.ticketCount : 0;
    });
    series.value = [
      { name: '진행중', data: inProgressData },
      { name: '완료', data: closedData },
    ];
    // X축 카테고리 반영
    chartOptions.value = {
      ...chartOptions.value,
      xaxis: { categories: categories.value },
    };
  } catch (error) {
    console.error('Error fetching manager stats:', error);
  }
};
watch(timeFilterTickets, loadManagerStats);

const tableData = computed(() => {
  if (!series.value.length || !categories.value.length) return [];

  return categories.value.map((category, index) => ({
    manager: category,
    inProgress: series.value[0].data[index],
    closed: series.value[1].data[index],
    total: series.value[0].data[index] + series.value[1].data[index],
  }));
});

// 컴포넌트 마운트 시 데이터 불러오기
onMounted(loadManagerStats);
</script>

<template>
  <section class="overflow-x-auto mt-5">
    <!-- 담당자별 티켓 진행 상황 -->
    <div class="flex-center gap-4">
      <div class="statistics-section w-full">
        <h2 class="statistics-section-title">담당자별 티켓 진행 현황</h2>
        <div class="statistics-flex-gap">
          <button
            v-for="filter in ['WEEK', 'MONTH', 'QUARTER']"
            :key="filter"
            :class="[
              'statistics-button',
              timeFilterTickets === filter ? 'statistics-button-active' : 'statistics-button-inactive',
            ]"
            @click="timeFilterTickets = filter"
          >
            {{ filter }}
          </button>
        </div>
        <apexchart type="bar" height="400" :options="chartOptions" :series="series" />
      </div>

      <div class="mt-8 flex-center h-fit bg-white-0">
        <table class="w-fit table-auto">
          <thead>
            <tr class="bg-gray-100">
              <th class="table-header min-w-[120px]">담당자</th>
              <th class="table-header min-w-[100px] text-center">진행중</th>
              <th class="table-header min-w-[100px] text-center">완료</th>
              <th class="table-header min-w-[100px] text-center">전체</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in tableData" :key="index" :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'">
              <td class="table-cell font-medium">{{ row.manager }}</td>
              <td class="table-cell text-center">{{ row.inProgress }}</td>
              <td class="table-cell text-center">{{ row.closed }}</td>
              <td class="table-cell text-center">{{ row.total }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td class="table-footer font-bold bg-blue-50">합계</td>
              <td class="table-footer font-bold text-center bg-blue-50">
                <span class="px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                  {{ tableData.reduce((sum, row) => sum + row.inProgress, 0) }}
                </span>
              </td>
              <td class="table-footer font-bold text-center bg-blue-50">
                <span class="px-3 py-1 rounded-full bg-green-100 text-green-800">
                  {{ tableData.reduce((sum, row) => sum + row.closed, 0) }}
                </span>
              </td>
              <td class="table-footer font-bold text-center bg-blue-50">
                <span class="px-3 py-1 rounded-full bg-gray-100 text-gray-800">
                  {{ tableData.reduce((sum, row) => sum + row.total, 0) }}
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </section>
</template>

<style scoped>
.statistics-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.statistics-section-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}
</style>
