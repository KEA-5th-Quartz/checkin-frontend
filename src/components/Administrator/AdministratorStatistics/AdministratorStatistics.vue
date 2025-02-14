<template>
  <div class="w-full p-5">
    <div class="statistics-section">
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
      <apexchart type="bar" height="380" :options="chartOptions" :series="series" />
    </div>

    <div class="statistics-section">
      <h2 class="statistics-section-title">카테고리별 티켓 수</h2>
      <apexchart type="bar" height="380" :options="chartOptions2" :series="series2" />
    </div>

    <div class="statistics-section">
      <h2 class="statistics-section-title">작업 완성률</h2>
      <div class="statistics-flex-gap mb-5">
        <button
          v-for="filter in ['WEEK', 'MONTH', 'QUARTER']"
          :key="filter"
          :class="[
            'statistics-button',
            timeFilterCompletion === filter ? 'statistics-button-active' : 'statistics-button-inactive',
          ]"
          @click="timeFilterCompletion = filter"
        >
          {{ filter }}
        </button>
      </div>
      <apexchart type="donut" height="380" :options="chartOptions3" :series="series3" />
    </div>

    <div class="statistics-section">
      <h2 class="statistics-section-title">작업 상태 현황</h2>
      <apexchart type="donut" height="380" :options="chartOptions4" :series="series4" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import {
  ChartSeries,
  ManagerStats,
  ChartOptions,
  CategoryStat,
  ClosedRateResponse,
  StatusRateResponse,
} from '@/types/adminChart';
import { statsApi } from '@/services/statsService/statsService';
import { useCustomQuery } from '@/composables/useCustomQuery';
import { ApexOptions } from 'apexcharts';

const timeFilterTickets = ref('WEEK');
const series = ref<{ name: string; data: number[] }[]>([]);

const managerCategories = ref<string[]>([]);
const categoryCategories = ref<string[]>([]);

const commonChartOptions = {
  toolbar: {
    show: true,
    tools: {
      download: true,
      selection: false,
      zoom: false,
      zoomin: false,
      zoomout: false,
      pan: false,
      reset: false,
    },
    export: {
      csv: {
        filename: 'chart_data',
        columnDelimiter: ',',
        headerCategory: 'Category',
        headerValue: 'Value',
      },
      svg: {
        filename: 'chart_data',
      },
      png: {
        filename: 'chart_data',
      },
    },
  },
};

const chartOptions = ref<ChartOptions>({
  chart: {
    type: 'bar',
    stacked: true,
    ...commonChartOptions,
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '30%',
      borderRadius: 3,
      distributed: false,
    },
  },
  grid: {
    show: true,
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
    horizontalAlign: 'left',
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
    refetchInterval: 1000 * 60,
    keepPreviousData: true,
  },
);

watchEffect(() => {
  if (!managerProgressData.value) return;

  managerCategories.value = managerProgressData.value.map((manager: ManagerStats) => manager.userName);

  const inProgressData = managerProgressData.value.map((manager: ManagerStats) => {
    const inProgress = manager.state.find((s) => s.categoryName === 'IN_PROGRESS');
    return inProgress ? inProgress.ticketCount : 0;
  });

  const closedData = managerProgressData.value.map((manager: ManagerStats) => {
    const closed = manager.state.find((s) => s.categoryName === 'CLOSED');
    return closed ? closed.ticketCount : 0;
  });

  series.value = [
    { name: '진행중', data: inProgressData },
    { name: '완료', data: closedData },
  ];

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
    ...commonChartOptions,
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '30%',
      borderRadius: 3,
      distributed: true,
    },
  },
  grid: {
    show: true,
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
    horizontalAlign: 'left',
    offsetY: 10,
    markers: { radius: 12, shape: 'circle' },
  },
});

const { data: categoryStatsData } = useCustomQuery<CategoryStat[]>(
  ['category-stats'],
  async () => {
    const response = await statsApi.getCategoryStats();
    return response.data.data;
  },
  {
    refetchInterval: 1000 * 60,
    keepPreviousData: true,
  },
);

watchEffect(() => {
  if (!categoryStatsData.value) return;

  const filteredData = categoryStatsData.value.filter((item) => item.ticketCount > 0);

  categoryCategories.value = filteredData.map((item) => item.categoryName);

  series2.value = [
    {
      name: '티켓 수',
      data: filteredData.map((item) => item.ticketCount),
    },
  ];

  chartOptions2.value = {
    ...chartOptions2.value,
    xaxis: {
      ...chartOptions2.value.xaxis,
      categories: categoryCategories.value,
    },
  };
});

const timeFilterCompletion = ref('WEEK');

const series3 = ref<number[]>([]);

const chartOptions3 = ref<ApexOptions>({
  chart: {
    type: 'donut',
    ...commonChartOptions,
  },
  labels: ['완료된 작업', '미완료 작업'],
  colors: ['#3B82F6', '#D1D5DB'],
  dataLabels: {
    enabled: true,
    formatter: (val: number, opts) => {
      if (!opts || !opts.w || !opts.w.config.series) return '';
      const index = opts.seriesIndex;
      const total = series3.value.reduce((sum, num) => sum + num, 0);
      return `${((series3.value[index] / total) * 100).toFixed(1)}%`;
    },
  },
  legend: {
    position: 'top',
    horizontalAlign: 'center',
  },
  plotOptions: {
    pie: {
      donut: {
        labels: {
          show: true,
          total: {
            show: true,
            label: '총 작업 수',
            formatter: () => '0개',
          },
        },
      },
    },
  },
  tooltip: {
    enabled: true,
  },
  states: {
    hover: {
      filter: {
        type: 'dark',
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
    refetchInterval: 1000 * 60,
    keepPreviousData: true,
  },
);

watchEffect(() => {
  if (!closedRateData.value) return;

  const totalCount: number = closedRateData.value.totalCount;
  const closedCount: number = closedRateData.value.closedCount;
  const unclosedCount: number = closedRateData.value.unclosedCount;

  series3.value = [closedCount, unclosedCount];

  chartOptions3.value = {
    ...chartOptions3.value,
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: '총 작업 수',
              formatter: () => String(totalCount) + '개',
            },
          },
        },
      },
    },
  };
});

const series4 = ref<number[]>([]);
const labels = ref<string[]>([]);
const totalCount = ref<number>(0);

const chartOptions4 = ref<ApexOptions>({
  chart: {
    type: 'donut',
    ...commonChartOptions,
  },
  labels: [],
  colors: ['#74B3E2', '#5FCB92', '#B0B8C4', '#F28C8C'],
  dataLabels: {
    enabled: true,
    formatter: (_val: number, opts) => {
      if (!opts || !opts.w || !opts.w.config.series) return '';

      const index = opts.seriesIndex;
      const percentage = ((series4.value[index] / totalCount.value) * 100).toFixed(1);
      return `${percentage}%`;
    },
  },
  legend: {
    position: 'top',
    horizontalAlign: 'center',
  },

  plotOptions: {
    pie: {
      donut: {
        labels: {
          show: true,
          total: {
            show: true,
            label: '작업 상태',
            formatter: () => `0개`,
          },
        },
      },
    },
  },
  tooltip: {
    enabled: true,
  },
});

const { data: statusRateData } = useCustomQuery<StatusRateResponse>(
  ['status-rate-stats'],
  async () => {
    const response = await statsApi.getStatusRateStats();
    return response.data.data;
  },
  {
    refetchInterval: 1000 * 60,
    keepPreviousData: true,
  },
);

watchEffect(() => {
  if (!statusRateData.value) return;

  const statusMapping: Record<string, string> = {
    IN_PROGRESS: '진행 중',
    OPEN: '오픈',
    CLOSED: '완료',
    OVERDUE: '연체',
  };

  labels.value = statusRateData.value.result.map((item) => statusMapping[item.status] || item.status);
  series4.value = statusRateData.value.result.map((item) => item.ticketCount);
  totalCount.value = statusRateData.value.totalCount;

  chartOptions4.value = {
    ...chartOptions4.value,
    labels: [...labels.value],
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: '작업 상태',
              formatter: () => `${totalCount.value}개`,
            },
          },
        },
      },
    },
  };
});
</script>
