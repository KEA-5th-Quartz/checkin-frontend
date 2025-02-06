<template>
  <div class="w-full p-5">
    <div class="grid grid-cols-2 gap-6">
      <!-- 담당자별 티켓 진행 현황 -->
      <div class="p-5">
        <h2 class="statistics-section-title">담당자별 티켓 진행 현황</h2>
        <div class="flex gap-3 mb-4">
          <button
            v-for="filter in ['WEEK', 'MONTH', 'QUARTER']"
            :key="filter"
            @click="timeFilterTickets = filter"
            :class="[
              'statistics-button',
              timeFilterTickets === filter ? 'statistics-button-active' : 'statistics-button-inactive',
            ]"
          >
            {{ filter }}
          </button>
        </div>
        <apexchart type="bar" height="350" :options="chartOptions" :series="series" />
      </div>

      <!-- 작업 완성률 -->
      <div class="p-5">
        <h2 class="statistics-section-title">작업 완성률</h2>
        <div class="flex gap-3 mb-4">
          <button
            v-for="filter in ['WEEK', 'MONTH', 'QUARTER']"
            :key="filter"
            @click="timeFilterCompletion = filter"
            :class="[
              'statistics-button',
              timeFilterCompletion === filter ? 'statistics-button-active' : 'statistics-button-inactive',
            ]"
          >
            {{ filter }}
          </button>
        </div>
        <apexchart type="donut" height="350" :options="chartOptions3" :series="series3" />
      </div>

      <!-- 카테고리별 티켓 수 -->
      <div class="p-5 col-span-2">
        <h2 class="statistics-section-title">카테고리별 티켓 수</h2>
        <apexchart type="bar" height="350" :options="chartOptions2" :series="series2" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, Ref } from 'vue';
import { timeFilterTickets, chartData, updateChartData } from '@/components/Administrator/StatisticsTest';
import { ChartSeries, ChartOptions } from '@/types/adminChart';

const series: Ref<ChartSeries[]> = ref([]);

const chartOptions = ref<ChartOptions>({
  chart: { type: 'bar', stacked: true, toolbar: { show: false } },
  plotOptions: { bar: { horizontal: false, columnWidth: '40%', borderRadius: 6 } },
  dataLabels: { enabled: true, style: { fontSize: '13px' } },
  xaxis: { categories: [] },
  yaxis: { max: 100 },
  colors: ['#3570FF', '#828DCA'],
  legend: { position: 'top', horizontalAlign: 'right', markers: { radius: 12, shape: 'circle' } },
});

// 데이터 처리
const processChartData = () => {
  series.value = [
    {
      name: '진행중',
      data: chartData.value.map((item) => item.state.find((s) => s.status === 'In Progress')?.rate || 0),
    },
    {
      name: '완료',
      data: chartData.value.map((item) => item.state.find((s) => s.status === 'Closed')?.rate || 0),
    },
  ];
  chartOptions.value.xaxis.categories = chartData.value.map((item) => item.username);
};

// 필터 변경 감지
watch(
  () => timeFilterTickets.value,
  () => {
    updateChartData();
    processChartData();
  },
);

//  초기 데이터 설정
updateChartData();
processChartData();

const categories = ref([
  '인프라검토',
  'VM',
  'NFS',
  'DNS',
  'SSL',
  'LB',
  '프로젝트 사용자',
  'KE',
  'CR',
  '솔루션',
  '기타',
]);

const customColors = [
  '#232D64',
  '#2C396C',
  '#1A2357',
  '#3C4A85',
  '#121A46',
  '#465493',
  '#2E3772',
  '#394B6E',
  '#556AA3',
  '#1B274B',
  '#3F5689',
];

const series2 = ref([{ name: '티켓 수', data: [20, 17, 26, 18, 21, 19, 10, 8, 10, 12, 29] }]);
const chartOptions2 = ref({
  chart: { type: 'bar', stacked: false, toolbar: { show: false } },
  plotOptions: { bar: { horizontal: false, columnWidth: '30%', borderRadius: 6, distributed: true } },
  dataLabels: { enabled: true, style: { fontSize: '13px' } },
  xaxis: { categories: categories.value },
  colors: customColors,
  legend: { show: false },
});

const closedRateData = ref({ closed_rate: 50 });
const series3 = ref([closedRateData.value.closed_rate, 100 - closedRateData.value.closed_rate]);
const timeFilterCompletion = ref('WEEK');

const chartOptions3 = ref({
  chart: { type: 'donut' },
  labels: ['완료된 작업', '미완료 작업'],
  colors: ['#3570FF', '#D1D5DB'],
  dataLabels: { enabled: true, formatter: (val: number) => `${val.toFixed(1)}%` },
  legend: { position: 'top', horizontalAlign: 'center' },
  states: { hover: { filter: { type: 'dark', value: 0.15 } } },
});

// 도넛 차트 데이터 업데이트
const updateClosedRateData = () => {
  series3.value = [closedRateData.value.closed_rate, 100 - closedRateData.value.closed_rate];
};

// 필터 변경 감지
watch(
  () => timeFilterCompletion.value,
  () => {
    if (timeFilterCompletion.value === 'WEEK') {
      closedRateData.value.closed_rate = 50;
    } else if (timeFilterCompletion.value === 'MONTH') {
      closedRateData.value.closed_rate = 60;
    } else if (timeFilterCompletion.value === 'QUARTER') {
      closedRateData.value.closed_rate = 75;
    }
    updateClosedRateData();
  },
);

// 초기 데이터 설정
updateClosedRateData();
</script>

<style scoped></style>
