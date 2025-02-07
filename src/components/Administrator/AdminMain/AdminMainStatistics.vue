<template>
  <div class="w-full p-5">
    <div class="grid grid-cols-3 gap-6 gap-y-0">
      <!-- 담당자별 티켓 진행 현황 -->
      <div class="p-5 col-span-2">
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
        <apexchart type="bar" height="300" :options="chartOptions" :series="series" />
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
        <apexchart type="donut" height="300" :options="chartOptions3" :series="series3" />
      </div>
      <!-- 전체 작업 상태 분포 -->
      <div class="p-5">
        <h2 class="statistics-section-title">전체 작업 상태 분포</h2>
        <apexchart type="donut" height="300" :options="chartOptions4" :series="series4" />
      </div>
      <!-- 카테고리별 티켓 수 -->
      <div class="p-5 col-span-2">
        <h2 class="statistics-section-title">카테고리별 티켓 수</h2>
        <apexchart type="bar" height="300" :options="chartOptions2" :series="series2" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import {
  ChartSeries,
  ManagerStats,
  ChartOptions,
  StatusRate,
  CategoryStat,
  ClosedRateResponse,
} from '@/types/adminChart';
import { statsApi } from '@/services/statsService/statsService';

const timeFilterTickets = ref('WEEK');
const series = ref<{ name: string; data: number[] }[]>([]);
const categories = ref<string[]>([]);

const chartOptions = ref<ChartOptions>({
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
    console.log('담당자별 티켓 목록 api 응답 데이터:', response.data);

    // API 응답 데이터 타입 적용
    const data: ManagerStats[] = response.data.data;

    //  담당자 목록 (X축)
    categories.value = data.map((manager) => manager.userName);
    console.log('X축 카테고리 (담당자):', categories.value);

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

const series2 = ref<ChartSeries[]>([]);
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

const chartOptions2 = ref<ChartOptions>({
  chart: {
    type: 'bar',
    stacked: false,
    toolbar: { show: false },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '30%',
      borderRadius: 5,
      // distributed: true,
    },
  },
  dataLabels: {
    enabled: true,
    style: { fontSize: '13px' },
  },
  xaxis: {
    categories: [],
  },
  colors: customColors,
  legend: {
    position: 'top',
    horizontalAlign: 'right',
    markers: {
      radius: 12,
      shape: 'circle',
    },
  },
});

const loadCategoryStats = async () => {
  try {
    const response = await statsApi.getCategoryStats();
    const data: CategoryStat[] = response.data.data;

    // 필드명 맞춰서 매핑
    categories.value = data.map((item) => item.categoryName);
    series2.value = [
      {
        name: '티켓 수',
        data: data.map((item) => item.ticketCount),
      },
    ];

    // chartOptions2를 반응형으로 업데이트
    chartOptions2.value = {
      ...chartOptions2.value,
      xaxis: { categories: categories.value },
    };
  } catch (error) {
    console.error('Error fetching category stats:', error);
  }
};

// 필터링 값 (초기값: WEEK)
const timeFilterCompletion = ref('WEEK');

// 차트 데이터 (완료율, 미완료율)
const series3 = ref<number[]>([50, 50]);

//  차트 옵션 정의
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

//  API 호출 함수
const loadClosedRateStats = async () => {
  try {
    console.log('API 호출: getClosedRateStats()', timeFilterCompletion.value);

    const response = await statsApi.getClosedRateStats(timeFilterCompletion.value);
    console.log(' 작업 완성률 API 응답 데이터:', response.data);

    const data: ClosedRateResponse = response.data.data;
    const closedRate = data.closedRate; //  완료율 값
    const openRate = 100 - closedRate; //  미완료율 계산

    //  차트 데이터 업데이트
    series3.value = [closedRate, openRate];
  } catch (error) {
    console.error('Error fetching closed rate stats:', error);
  }
};

//  필터 변경 시 API 재호출
watch(timeFilterCompletion, () => {
  console.log('🛠 작업 완성률 필터 변경 감지:', timeFilterCompletion.value);
  loadClosedRateStats();
});

// 전체 작업 상태 분포

const series4 = ref<number[]>([]);
const labels = ref<string[]>([]);

const chartOptions4 = ref({
  chart: {
    type: 'donut',
  },
  labels: [] as string[],
  colors: ['#3570FF', '#F59E0B', '#10B981', '#EF4444'], // 진행 중, 오픈, 완료, 연체
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

const loadStatusRateStats = async () => {
  try {
    console.log(' API 호출: getStatusRateStats()');

    const response = await statsApi.getStatusRateStats();
    console.log('전체 작업 상태 분포 API 응답 데이터:', response.data);

    const data: StatusRate[] = response.data.data;

    // 상태(labels) 및 티켓 수(series) 가공
    labels.value = data.map((item) => item.status);
    series4.value = data.map((item) => item.ticketCount);

    // 차트 옵션 업데이트
    chartOptions4.value = {
      ...chartOptions4.value,
      labels: labels.value,
    };
  } catch (error) {
    console.error('Error fetching status rate stats:', error);
  }
};

// 컴포넌트 마운트 시 데이터 불러오기
onMounted(loadManagerStats);
onMounted(loadCategoryStats);
onMounted(loadStatusRateStats);
onMounted(loadClosedRateStats);
</script>

<style scoped></style>
