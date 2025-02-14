<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue';
import { CategoryStat, ChartOptions } from '@/types/adminChart';
import { statsApi } from '@/services/statsService/statsService';
import { useCustomQuery } from '@/composables/useCustomQuery';

const series = ref<{ name: string; data: number[] }[]>([]);
const categoryCategories = ref<string[]>([]); // X축 카테고리 (카테고리명)

const commonChartOptions = {
  toolbar: {
    show: true,
    tools: {
      download: true, // Export 버튼 활성화
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
      distributed: true, //  각 막대 개별 색상 적용
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
    categories: [], //  X축에 카테고리별로 개별 표시
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
  ], //  카테고리별 색상 적용
  legend: {
    position: 'top',
    horizontalAlign: 'left',
    offsetY: 10,
    markers: { radius: 12, shape: 'circle' },
  },
});

//  전체 티켓 수 계산 (computed 사용)
const totalTickets = computed(() => {
  return series.value.length ? series.value[0].data.reduce((sum, val) => sum + val, 0) : 0;
});

const { data: categoryStatsData } = useCustomQuery<CategoryStat[]>(
  ['category-stats'],
  async () => {
    const response = await statsApi.getCategoryStats();
    return response.data.data;
  },
  { refetchInterval: 1000 * 60, keepPreviousData: true }, //  60초마다 데이터 갱신
);

watchEffect(() => {
  if (!categoryStatsData.value) return;

  //  티켓 개수가 0 이상인 항목만 표시
  const filteredData = categoryStatsData.value.filter((item) => item.ticketCount > 0);

  //  X축 카테고리 업데이트
  categoryCategories.value = filteredData.map((item) => item.categoryName);

  //  시리즈 데이터 업데이트 (각 카테고리를 개별 막대로 표시)
  series.value = [
    {
      name: '티켓 수',
      data: filteredData.map((item) => item.ticketCount),
    },
  ];

  //  X축 업데이트 (카테고리별로 개별 표시)
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

      <div class="mt-6 flex justify-center">
        <table class="w-full max-w-4xl border border-gray-3 shadow-sm rounded-lg overflow-hidden bg-white text-sm">
          <thead>
            <tr class="bg-gray-3 text-gray-600 uppercase tracking-wide">
              <th class="px-4 py-2 text-left whitespace-nowrap">카테고리</th>
              <th class="px-4 py-2 text-center whitespace-nowrap">티켓 수</th>
              <th class="px-4 py-2 text-center whitespace-nowrap">비율</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(category, index) in chartOptions.xaxis.categories"
              :key="category"
              :class="index % 2 === 0 ? 'bg-white-0' : 'bg-white-1'"
            >
              <td class="px-4 py-2 text-gray-800 font-medium">{{ category }}</td>
              <td class="px-4 py-2 text-center text-gray-700">{{ series[0].data[index] }}</td>
              <td class="px-4 py-2 text-center font-semibold text-gray-900">
                {{ ((series[0].data[index] / totalTickets) * 100).toFixed(1) }}%
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="bg-gray-3 font-semibold">
              <td class="px-4 py-2 text-black-2">합계</td>
              <td class="px-4 py-2 text-center">
                <span class="px-2 py-1 rounded bg-blue-100 text-blue-700 font-semibold">
                  {{ totalTickets }}
                </span>
              </td>
              <td class="px-4 py-2 text-center">
                <span class="px-2 py-1 rounded bg-gray-3 text-black-2 font-semibold">100%</span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</template>
