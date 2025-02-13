<template>
  <div class="w-full p-5">
    <div class="grid md:grid-cols-3 sm:grid-cols-2 gap-6 gap-y-0">
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
import { ref, watchEffect } from 'vue';
import {
  ChartSeries,
  ManagerStats,
  ChartOptions,
  StatusRate,
  CategoryStat,
  ClosedRateResponse,
} from '@/types/adminChart';
import { statsApi } from '@/services/statsService/statsService';
import { useCustomQuery } from '@/composables/useCustomQuery';

const timeFilterTickets = ref('WEEK');
const series = ref<{ name: string; data: number[] }[]>([]);

const managerCategories = ref<string[]>([]); // 담당자 X축 카테고리
const categoryCategories = ref<string[]>([]); // 카테고리 X축 카테고리

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
    labels: { maxHeight: 80, trim: true },
  },
  colors: ['#3570FF', '#828DCA'],
  legend: {
    position: 'top',
    horizontalAlign: 'right',
    offsetY: 10,
    markers: {
      radius: 12,
      shape: 'circle',
    },
  },
});

const { data: managerProgressData } = useCustomQuery(
  ['manager-progress', timeFilterTickets],
  async () => {
    const response = await statsApi.getManagersStats(timeFilterTickets.value);
    return response.data.data;
  },
  {
    refetchInterval: 1000 * 60, // 60초마다 자동으로 데이터 다시 가져오기
    keepPreviousData: true, // 데이터 변경 중에도 기존 데이터 유지
  },
);

// `managerProgressData` 변경 시 `series`, `categories`, `chartOptions` 업데이트
watchEffect(() => {
  if (!managerProgressData.value) return;

  //  담당자 데이터를 별도의 변수에 저장
  managerCategories.value = managerProgressData.value.map((manager: ManagerStats) => manager.userName);

  const inProgressData = managerProgressData.value.map((manager: ManagerStats) => {
    const inProgress = manager.state.find((s) => s.status === 'IN_PROGRESS');
    return inProgress ? inProgress.ticketCount : 0;
  });

  const closedData = managerProgressData.value.map((manager: ManagerStats) => {
    const closed = manager.state.find((s) => s.status === 'CLOSED');
    return closed ? closed.ticketCount : 0;
  });

  series.value = [
    { name: '진행중', data: inProgressData },
    { name: '완료', data: closedData },
  ];

  //  X축 카테고리 업데이트
  chartOptions.value = {
    ...chartOptions.value,
    xaxis: {
      ...chartOptions.value.xaxis,
      categories: managerCategories.value,
    },
  };
});

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
    },
  },
  dataLabels: {
    enabled: true,
    style: { fontSize: '13px' },
  },
  xaxis: {
    categories: [],
    labels: { maxHeight: 80, trim: true },
  },
  colors: customColors,
  legend: {
    position: 'top',
    horizontalAlign: 'right',
    offsetY: 10,
    markers: {
      radius: 12,
      shape: 'circle',
    },
  },
});

const { data: categoryStatsData } = useCustomQuery<CategoryStat[]>(
  ['category-stats'],
  async () => {
    const response = await statsApi.getCategoryStats();
    return response.data.data;
  },
  {
    refetchInterval: 1000 * 60, // 60초마다 자동 갱신
    keepPreviousData: true, // 이전 데이터 유지 (깜빡임 방지)
  },
);

watchEffect(() => {
  if (!categoryStatsData.value) return;

  // 티켓 개수가 0 이상인 데이터만 필터링
  const filteredData = categoryStatsData.value.filter((item) => item.ticketCount > 0);

  // X축 카테고리 업데이트
  categoryCategories.value = filteredData.map((item) => item.categoryName);

  // 시리즈 데이터 업데이트
  series2.value = [
    {
      name: '티켓 수',
      data: filteredData.map((item) => item.ticketCount),
    },
  ];

  // 차트 옵션 업데이트
  chartOptions2.value = {
    ...chartOptions2.value,
    xaxis: {
      ...chartOptions2.value.xaxis,
      categories: categoryCategories.value,
    },
  };
});

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

const { data: closedRateData } = useCustomQuery<ClosedRateResponse>(
  ['closed-rate-stats', timeFilterCompletion],
  async () => {
    const response = await statsApi.getClosedRateStats(timeFilterCompletion.value);
    return response.data.data;
  },
  {
    refetchInterval: 1000 * 60, // 60초마다 자동 갱신
    keepPreviousData: true, // 기존 데이터 유지
  },
);

//  데이터 변경 시 `series3` 업데이트
watchEffect(() => {
  if (!closedRateData.value) return;

  const closedRate = closedRateData.value.closedRate;
  const openRate = 100 - closedRate;

  series3.value = [closedRate, openRate];
});

// 전체 작업 상태 분포

const series4 = ref<number[]>([]);
const labels = ref<string[]>([]);

const chartOptions4 = ref({
  chart: {
    type: 'donut',
  },
  labels: [] as string[],
  colors: ['#3570FF', '#10B981', '#9CA3AF', '#EF4444'], // 진행 중, 오픈, 완료, 연체
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

const { data: statusRateData } = useCustomQuery<StatusRate[]>(
  ['status-rate-stats'],
  async () => {
    const response = await statsApi.getStatusRateStats();
    return response.data.data;
  },
  {
    refetchInterval: 1000 * 60, // 60초마다 자동 갱신
    keepPreviousData: true, // 기존 데이터 유지
  },
);

watchEffect(() => {
  if (!statusRateData.value) return;

  // 상태명을 한글로 변환
  const statusMapping: Record<string, string> = {
    IN_PROGRESS: '진행 중',
    OPEN: '오픈',
    CLOSED: '완료',
    OVERDUE: '연체',
  };

  labels.value = statusRateData.value.map((item) => statusMapping[item.status] || item.status);
  series4.value = statusRateData.value.map((item) => item.ticketCount);

  chartOptions4.value = {
    ...chartOptions4.value,
    labels: [...labels.value],
  };
});
</script>

<style scoped></style>
