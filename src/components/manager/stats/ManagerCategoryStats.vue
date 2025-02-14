<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue';
import { statsApi } from '@/services/statsService/statsService';
import { useCustomQuery } from '@/composables/useCustomQuery';
import { ChartOptions } from '@/types/Chart';
import { CategoryStat, UserData, SeriesData } from '@/types/Chart';

const series = ref<SeriesData[]>([]);
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
      horizontal: true,
      columnWidth: '30%',
      borderRadius: 3,
      distributed: false,
    },
  },
  grid: {
    show: false,
  },
  dataLabels: { enabled: true, style: { fontSize: '13px' } },
  xaxis: { categories: [], labels: { maxHeight: 80, trim: true } },
  colors: [
    '#4C6EF5',
    '#748FFC',
    '#9775FA',
    '#B197FC',
    '#63E6BE',
    '#38D9A9',
    '#22B8CF',
    '#FF6B6B',
    '#FF8787',
    '#FAA2C1',
  ],
  legend: {
    position: 'top',
    horizontalAlign: 'left',
    offsetY: 10,
    markers: { radius: 12, shape: 'circle' },
  },
});

const { data: managerCategoryStats, error } = useCustomQuery<UserData[]>(
  ['manager-category-stats'],
  async () => {
    try {
      isLoading.value = true;
      const response = await statsApi.getManagerCategoryStats();
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
  if (!managerCategoryStats.value || error.value) {
    return;
  }

  if (!Array.isArray(managerCategoryStats.value) || managerCategoryStats.value.length === 0) {
    return;
  }

  categories.value = managerCategoryStats.value.map((user: UserData) => user.userName);

  const allCategories = new Set<string>();
  managerCategoryStats.value.forEach((user: UserData) => {
    user.state?.forEach((state: CategoryStat) => allCategories.add(state.categoryName));
  });

  const seriesData: SeriesData[] = Array.from(allCategories).map((category) => {
    const data = categories.value.map((userName) => {
      const user = managerCategoryStats.value.find((u: UserData) => u.userName === userName);
      if (!user || !user.state) return 0;
      const categoryState = user.state.find((s: CategoryStat) => s.categoryName === category);
      return categoryState ? categoryState.ticketCount : 0;
    });

    return { name: category, data };
  });

  series.value = seriesData;

  chartOptions.value = { ...chartOptions.value, xaxis: { categories: categories.value } };
});

const tableData = computed(() => {
  if (!series.value.length || !categories.value.length) return [];

  return categories.value.map((category, index) => {
    const categoryData = series.value.map((s) => s.data[index] || 0);
    return {
      manager: category,
      categoryData,
      total: categoryData.reduce((sum, value) => sum + value, 0),
    };
  });
});
</script>

<template>
  <div class="mt-5 w-full p-5">
    <div class="statistics-section">
      <h2 class="statistics-section-title">담당자별 카테고리 티켓 수</h2>

      <apexchart type="bar" height="380" :options="chartOptions" :series="series" />

      <div class="mt-6 flex justify-center">
        <table class="w-full max-w-4xl border border-gray-3 shadow-sm rounded-lg overflow-hidden bg-white text-sm">
          <thead>
            <tr class="bg-gray-3 text-gray-600 uppercase tracking-wide">
              <th class="px-4 py-2 text-left whitespace-nowrap">담당자</th>
              <th v-for="series in series" :key="series.name" class="px-4 py-2 text-center whitespace-nowrap text-sm">
                {{ series.name }}
              </th>
              <th class="px-4 py-2 text-center">전체</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in tableData" :key="index" :class="index % 2 === 0 ? 'bg-white-0' : 'bg-white-1'">
              <td class="px-4 py-2 text-gray-800 font-medium">{{ row.manager }}</td>
              <td v-for="(val, i) in row.categoryData" :key="i" class="px-4 py-2 text-center text-gray-700">
                {{ val }}
              </td>
              <td class="px-4 py-2 text-center font-semibold text-gray-900">{{ row.total }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="bg-gray-3 font-semibold">
              <td class="px-4 py-2 text-black-2">합계</td>
              <td v-for="series in series" :key="series.name" class="px-4 py-2 text-center">
                <span class="px-2 py-1 rounded bg-blue-100 text-blue-700 font-semibold">
                  {{ series.data.reduce((sum, val) => sum + val, 0) }}
                </span>
              </td>
              <td class="px-4 py-2 text-center">
                <span class="px-2 py-1 rounded bg-yellow-100 text-yellow-800 font-semibold">
                  {{ series.reduce((sum, s) => sum + s.data.reduce((innerSum, val) => innerSum + val, 0), 0) }}
                </span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</template>
