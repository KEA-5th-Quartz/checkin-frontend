<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue';
import { CategoryStat, ChartOptions } from '@/types/Chart';
import { statsApi } from '@/services/statsService/statsService';
import { useCustomQuery } from '@/composables/useCustomQuery';

const series = ref<{ name: string; data: number[] }[]>([]);
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
  colors: [
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
  ],
  legend: {
    position: 'top',
    horizontalAlign: 'left',
    offsetY: 10,
    markers: { radius: 12, shape: 'circle' },
  },
});

const totalTickets = computed(() => {
  return series.value.length ? series.value[0].data.reduce((sum, val) => sum + val, 0) : 0;
});

const { data: categoryStatsData } = useCustomQuery<CategoryStat[]>(
  ['category-stats'],
  async () => {
    const response = await statsApi.getCategoryStats();
    return response.data.data;
  },
  { refetchInterval: 1000 * 60, keepPreviousData: true },
);

watchEffect(() => {
  if (!categoryStatsData.value) return;
  const filteredData = categoryStatsData.value.filter((item) => item.ticketCount > 0);
  categoryCategories.value = filteredData.map((item) => item.categoryName);
  series.value = [
    {
      name: '티켓 수',
      data: filteredData.map((item) => item.ticketCount),
    },
  ];
  chartOptions.value = {
    ...chartOptions.value,
    xaxis: {
      ...chartOptions.value.xaxis,
      categories: categoryCategories.value,
    },
  };
});
</script>

<template>
  <div class="mt-5 w-full p-5">
    <div class="statistics-section">
      <h2 class="statistics-section-title">카테고리별 티켓 진행 현황</h2>
      <apexchart type="bar" height="380" :options="chartOptions" :series="series" />

      <div class="manager-table-chart">
        <table class="manager-table-wrapper">
          <thead>
            <tr class="manager-table-header">
              <th class="manager-table-header-cell">카테고리</th>
              <th class="manager-table-header-cell-center">티켓 수</th>
              <th class="manager-table-header-cell-center">비율</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(category, index) in chartOptions.xaxis.categories"
              :key="category"
              :class="index % 2 === 0 ? 'bg-white-0' : 'bg-white-1'"
            >
              <td class="manager-table-row">{{ category }}</td>
              <td class="manager-table-row-data">{{ series[0].data[index] }}</td>
              <td class="manager-table-row-total">{{ ((series[0].data[index] / totalTickets) * 100).toFixed(1) }}%</td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="manager-table-footer">
              <td class="manager-table-footer-cell">합계</td>
              <td class="manager-table-footer-data">
                <span class="manager-table-badge manager-table-badge-blue">
                  {{ totalTickets }}
                </span>
              </td>
              <td class="manager-table-footer-data">
                <span class="manager-table-badge manager-table-badge-gray">100%</span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</template>
