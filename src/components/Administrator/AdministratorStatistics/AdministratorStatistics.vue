<script setup lang="ts">
import { ref, watch } from 'vue';
import { timeFilter, chartData, updateChartData } from '../StatisticsTest.ts';

// ApexChart 옵션 및 데이터 설정
const series = ref([]);
const chartOptions = ref({
  chart: {
    type: 'bar',
    stacked: true,
    toolbar: {
      show: false,
    },
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
    style: {
      fontSize: '13px',
    },
  },
  xaxis: {
    categories: [], // 담당자 이름 리스트
  },
  yaxis: {
    max: 100, // y축 최대값을 100으로 제한
  },
  colors: ['#3570FF', '#828DCA'], // 진행중(In Progress), 완료(Closed) 색상
  legend: {
    position: 'top',
    horizontalAlign: 'right',
    markers: {
      radius: 12, // 마커의 크기
      shape: 'circle', // 마커를 원형으로 설정
    },
  },
});

// 데이터 처리 함수
const processChartData = () => {
  const newSeries = [
    {
      name: '진행중',
      data: chartData.value.map((item) => item.state.find((s) => s.status === 'In Progress')?.rate || 0),
    },
    {
      name: '완료',
      data: chartData.value.map((item) => item.state.find((s) => s.status === 'Closed')?.rate || 0),
    },
  ];

  const newCategories = chartData.value.map((item) => item.username);

  series.value = newSeries;
  chartOptions.value.xaxis.categories = newCategories;
};

// 필터 변경 감지
watch(
  () => timeFilter.value,
  () => {
    updateChartData();
    processChartData();
  },
);

// 초기 데이터 처리
updateChartData();
processChartData();
</script>

<template>
  <section class="overflow-x-auto mt-5 p-5 pb-20">
    <!-- 담당자별 티켓 진행 상황 -->
    <div class="p-5 bg-white-0">
      <h2 class="font-bold mb-5">담당자별 티켓 진행 현황</h2>
      <div class="flex gap-4">
        <button
          v-for="filter in ['WEEK', 'MONTH', 'QUARTER']"
          :key="filter"
          :class="[
            'px-4 py-2 rounded-lg border text-sm',
            timeFilter === filter
              ? 'bg-primary-0 text-white-0 border-blue-3'
              : 'bg-white-0 text-blue-1 border-gray-1 hover:bg-primary-2',
          ]"
          @click="timeFilter = filter"
        >
          {{ filter }}
        </button>
      </div>
      <apexchart type="bar" height="400" :options="chartOptions" :series="series" />
    </div>
  </section>
</template>

<style scoped></style>
