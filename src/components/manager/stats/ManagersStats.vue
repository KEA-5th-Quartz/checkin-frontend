<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue';
import { statsApi } from '@/services/statsService/statsService';
import { useCustomQuery } from '@/composables/useCustomQuery';
import { ChartOptions, ManagerStats } from '@/types/Chart';

const timeFilterTickets = ref('WEEK');
const series = ref<{ name: string; data: number[] }[]>([]);
const categories = ref<string[]>([]);
const isLoading = ref(true);

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
  chart: { type: 'bar', stacked: true, ...commonChartOptions },
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
  dataLabels: { enabled: true, style: { fontSize: '13px' } },
  xaxis: { categories: [], labels: { maxHeight: 80, trim: true } },
  colors: ['#3570FF', '#828DCA'],
  legend: {
    position: 'top',
    horizontalAlign: 'left',
    offsetY: 10,
    markers: { radius: 12, shape: 'circle' },
  },
});

const { data: managerProgressData, error } = useCustomQuery<ManagerStats[]>(
  ['manager-progress', timeFilterTickets],
  async () => {
    try {
      isLoading.value = true;
      const response = await statsApi.getManagersStats(timeFilterTickets.value);
      return response.data?.data || [];
    } catch (err) {
      return [];
    } finally {
      isLoading.value = false;
    }
  },
  { refetchInterval: 1000 * 60, keepPreviousData: true },
);

watchEffect(() => {
  if (!managerProgressData.value || error.value) {
    return;
  }

  if (!Array.isArray(managerProgressData.value) || managerProgressData.value.length === 0) {
    return;
  }

  categories.value = managerProgressData.value.map((manager) => manager.userName);

  const inProgressData = managerProgressData.value.map((manager) => {
    const inProgress = manager.state?.find((s) => s.categoryName === 'IN_PROGRESS');
    return inProgress ? inProgress.ticketCount : 0;
  });

  const closedData = managerProgressData.value.map((manager) => {
    const closed = manager.state?.find((s) => s.categoryName === 'CLOSED');
    return closed ? closed.ticketCount : 0;
  });

  series.value = [
    { name: '진행 중', data: inProgressData },
    { name: '완료', data: closedData },
  ];

  chartOptions.value = { ...chartOptions.value, xaxis: { categories: categories.value } };
});

const tableData = computed(() => {
  if (!series.value.length || !categories.value.length) return [];

  return categories.value.map((category, index) => ({
    manager: category,
    inProgress: series.value[0].data[index],
    closed: series.value[1].data[index],
    total: series.value[0].data[index] + series.value[1].data[index],
  }));
});
</script>

<template>
  <div class="mt-5 w-full p-5">
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

      <div class="manager-table-chart">
        <table class="manager-table-wrapper">
          <thead>
            <tr class="manager-table-header">
              <th class="manager-table-header-cell">담당자</th>
              <th class="manager-table-header-cell-center">진행 중</th>
              <th class="manager-table-header-cell-center">완료</th>
              <th class="manager-table-header-cell-center">전체</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in tableData" :key="index" :class="index % 2 === 0 ? 'bg-white-0' : 'bg-white-1'">
              <td class="manager-table-row">{{ row.manager }}</td>
              <td class="manager-table-row-data">{{ row.inProgress }}</td>
              <td class="manager-table-row-data">{{ row.closed }}</td>
              <td class="manager-table-row-total">{{ row.total }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="manager-table-footer">
              <td class="manager-table-footer-cell">합계</td>
              <td class="manager-table-footer-data">
                <span class="manager-table-badge manager-table-badge-blue">
                  {{ tableData.reduce((sum, row) => sum + row.inProgress, 0) }}
                </span>
              </td>
              <td class="manager-table-footer-data">
                <span class="manager-table-badge manager-table-badge-green">
                  {{ tableData.reduce((sum, row) => sum + row.closed, 0) }}
                </span>
              </td>
              <td class="manager-table-footer-data">
                <span class="manager-table-badge manager-table-badge-gray">
                  {{ tableData.reduce((sum, row) => sum + row.total, 0) }}
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</template>
