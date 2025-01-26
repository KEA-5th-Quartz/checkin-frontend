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

    <!-- 카테고리별 티켓 수-->
    <div class="p-5 bg-white-0">
      <h2 class="font-bold mb-5">카테고리별 티켓 수</h2>
      <apexchart type="bar" height="400" :options="chartOptions2" :series="series2" />
    </div>

    <!-- 작업 완성률 -->
    <div class="p-5 bg-white-0">
      <h2 class="font-bold mb-5">작업 완성률</h2>
      <div class="flex gap-4 mb-5">
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
      <apexchart type="donut" height="400" :options="chartOptions3" :series="series3" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { timeFilter, chartData, updateChartData } from '../StatisticsTest.ts';

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
    categories: [],
  },
  yaxis: {
    max: 100, // y축 최대값을 100으로 제한
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

// 카테고리가 추가되었을 때 아래의 색상을 반복함
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

const series2 = ref([
  {
    name: '티켓 수',
    data: [20, 17, 26, 18, 21, 19, 10, 8, 10, 12, 29],
  },
]);
const chartOptions2 = ref({
  chart: {
    type: 'bar',
    stacked: false,
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '30%',
      borderRadius: 5,
      colors: {
        ranges: [], // customColors를 데이터 포인트별로 지정 가능
      },
      distributed: true, // 데이터 포인트별로 색상 적용
    },
  },
  dataLabels: {
    enabled: true,
    style: {
      fontSize: '13px',
    },
  },
  xaxis: {
    categories: categories.value,
  },
  yaxis: {},
  colors: customColors,
  legend: {
    show: false,
  },
});

// 도넛 차트 옵션

const closedRateData = ref({ closed_rate: 50 }); // 초기값 50%
const series3 = ref([closedRateData.value.closed_rate, 100 - closedRateData.value.closed_rate]);

const chartOptions3 = ref({
  chart: {
    type: 'donut',
  },
  labels: ['완료된 작업', '미완료 작업'],
  colors: ['#3570FF', '#D1D5DB'], // 완료/미완료 색상
  dataLabels: {
    enabled: true,
    formatter: (val: number) => `${val.toFixed(1)}%`,
  },
  legend: {
    position: 'top',
    horizontalAlign: 'center',
  },
  states: {
    hover: {
      filter: {
        type: 'dark',
        value: 0.15,
      },
    },
  },
});

// 데이터 업데이트 함수
const updateClosedRateData = () => {
  series3.value = [closedRateData.value.closed_rate, 100 - closedRateData.value.closed_rate];
};

// 필터 변경 감지
watch(
  () => timeFilter.value,
  () => {
    if (timeFilter.value === 'WEEK') {
      closedRateData.value.closed_rate = 50;
    } else if (timeFilter.value === 'MONTH') {
      closedRateData.value.closed_rate = 60;
    } else if (timeFilter.value === 'QUARTER') {
      closedRateData.value.closed_rate = 75;
    }
    updateClosedRateData();
  },
);

// 초기 데이터 설정
updateClosedRateData();
</script>
