<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { statsApi } from '@/services/statsService/statsService';

interface CategoryData {
  categoryName: string;
  ticketCount: number;
}

interface SeriesData {
  name: string;
  data: number[];
}

const series = ref<SeriesData[]>([]);
const chartOptions = ref({
  chart: {
    type: 'bar',
    height: 450,
    toolbar: {
      show: true,
    },
  },
  grid: {
    show: true,
    padding: {
      top: 0,
      right: 20,
      bottom: 0,
      left: 20,
    },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '60%',
      borderRadius: 4,
      dataLabels: {
        position: 'top',
      },
      distributed: true, // 각 막대별로 다른 색상 적용
    },
  },
  dataLabels: {
    enabled: true,
    formatter: function (val: number) {
      return val.toString();
    },
    offsetY: -20,
    style: {
      fontSize: '12px',
      colors: ['#666'],
    },
  },
  stroke: {
    show: true,
    width: 2,
    colors: ['transparent'],
  },
  title: {
    text: '카테고리별 티켓 현황',
    align: 'left',
    style: {
      fontSize: '18px',
      fontWeight: 'bold',
    },
  },
  xaxis: {
    categories: [],
    labels: {
      rotate: -45,
      style: {
        fontSize: '12px',
      },
    },
  },
  yaxis: {
    title: {
      text: '티켓 수',
    },
    labels: {
      formatter: function (val: number) {
        return Math.round(val);
      },
    },
  },
  fill: {
    opacity: 1,
  },
  colors: [
    '#FF6B6B', // 산호색
    '#4ECDC4', // 청록색
    '#45B7D1', // 하늘색
    '#96CEB4', // 민트
    '#FFEEAD', // 연한 노랑
    '#D4A5A5', // 연한 분홍
    '#9ED2C6', // 연한 청록
    '#FFB6B9', // 연한 주황
    '#957DAD', // 연한 보라
    '#7AC7D4', // 하늘색
    '#F9C74F', // 골드
    '#90BE6D', // 연두색
    '#F94144', // 빨강
    '#43AA8B', // 초록
    '#577590', // 남색
  ],
  legend: {
    show: false, // 범례 숨김
  },
  tooltip: {
    y: {
      formatter: function (val: number) {
        return val + ' 건';
      },
    },
  },
});

const fetchCategoryStats = async () => {
  try {
    const response = await statsApi.getCategoryStats();
    const apiData: CategoryData[] = response.data.data;

    if (!Array.isArray(apiData)) {
      console.error('데이터 페칭 실패:', apiData);
      return;
    }

    // 카테고리명과 티켓 수 배열 생성
    const categories = apiData.map((item) => item.categoryName);
    const ticketCounts = apiData.map((item) => item.ticketCount);

    // 시리즈 데이터 설정
    series.value = [
      {
        name: '티켓 수',
        data: ticketCounts,
      },
    ];

    // 차트 옵션 업데이트
    chartOptions.value = {
      ...chartOptions.value,
      xaxis: {
        ...chartOptions.value.xaxis,
        categories: categories,
      },
    };
  } catch (error) {
    console.error('카테고리별 통계 조회 실패:', error);
  }
};

onMounted(() => {
  fetchCategoryStats();
});
</script>

<template>
  <section class="overflow-x-auto mt-5 pb-20">
    <div class="statistics-section">
      <div v-if="series.length">
        <apexchart type="bar" height="450" :options="chartOptions" :series="series" />
      </div>
      <div v-else class="flex justify-center items-center h-64 text-gray-500">데이터를 불러오는 중...</div>
    </div>
  </section>
</template>

<style scoped>
.statistics-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
}
</style>
