<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { statsApi } from '@/services/statsService/statsService';

interface CategoryState {
  categoryName: string;
  ticketCount: number;
}

interface UserData {
  userName: string;
  state: CategoryState[];
}

interface SeriesData {
  name: string;
  data: number[];
}

interface ChartOptions {
  chart: {
    type: string;
    height: number;
    stacked: boolean;
    toolbar: {
      show: boolean;
    };
  };
  grid: {
    show: boolean;
    padding: {
      top: number;
      right: number;
      bottom: number;
      left: number;
    };
  };
  plotOptions: {
    bar: {
      horizontal: boolean;
      barHeight: string;
    };
  };
  dataLabels: {
    enabled: boolean;
    style: {
      fontSize: string;
    };
  };
  stroke: {
    width: number;
    colors: string[];
  };
  title: {
    offsetX: number;
    offsetY: number;
  };
  xaxis: {
    categories: string[];
  };
  legend: {
    position: string;
    horizontalAlign: string;
    markers: {
      radius: number;
      shape: string;
    };
  };
  colors: string[];
}

const series2 = ref<SeriesData[]>([]);
const chartOptions2 = ref<ChartOptions>({
  chart: {
    type: 'bar',
    height: 550,
    stacked: true,
    toolbar: {
      show: false,
    },
  },
  grid: {
    show: false,
    padding: {
      top: 0,
      right: 40,
      bottom: 0,
      left: 40,
    },
  },
  plotOptions: {
    bar: {
      horizontal: true,
      barHeight: '80%',
    },
  },
  dataLabels: {
    enabled: true,
    style: {
      fontSize: '13px',
    },
  },
  stroke: {
    width: 0,
    colors: ['#fff'],
  },
  title: {
    offsetX: 40,
    offsetY: 40,
  },
  xaxis: {
    categories: [],
  },
  legend: {
    position: 'top',
    horizontalAlign: 'left',
    markers: {
      radius: 12,
      shape: 'circle',
    },
  },
  colors: [
    '#FF5733',
    '#33FF57',
    '#5733FF',
    '#FFD700',
    '#FF33A8',
    '#33A8FF',
    '#FF8C00',
    '#8AFF33',
    '#FF4500',
    '#00CED1',
    '#FF1493',
  ],
});

const fetchManagerCategoryStats = async () => {
  try {
    const response = await statsApi.getManagerCategoryStats();
    const apiData: UserData[] = response.data.data;

    if (!Array.isArray(apiData)) {
      console.error('데이터 페칭 실패:', apiData);
      return;
    }

    // 사용자명 배열 생성
    const userNames = apiData.map((user) => user.userName);

    // 모든 고유 카테고리 수집
    const allCategories = new Set<string>();
    apiData.forEach((user) => {
      if (user.state && Array.isArray(user.state)) {
        user.state.forEach((state) => {
          if (state.categoryName) {
            allCategories.add(state.categoryName);
          }
        });
      }
    });

    // 시리즈 데이터 생성
    const seriesData: SeriesData[] = Array.from(allCategories).map((category) => {
      const data = userNames.map((userName) => {
        const user = apiData.find((u) => u.userName === userName);
        if (!user || !user.state) return 0;

        const categoryState = user.state.find((s) => s.categoryName === category);
        return categoryState ? categoryState.ticketCount : 0;
      });

      return {
        name: category,
        data: data,
      };
    });

    // 차트 데이터 업데이트
    chartOptions2.value = {
      ...chartOptions2.value,
      xaxis: {
        ...chartOptions2.value.xaxis,
        categories: userNames,
      },
    };

    series2.value = seriesData;
  } catch (error) {
    console.error('담당자 카테고리 목록 조회 실패:', error);
  }
};

onMounted(() => {
  fetchManagerCategoryStats();
});
</script>

<template>
  <section class="overflow-x-auto mt-5 p-5 pb-20">
    <div class="statistics-section">
      <h2 class="statistics-section-title">담당자 카테고리별 티켓 수</h2>
      <div v-if="series2.length">
        <apexchart type="bar" height="400" :options="chartOptions2" :series="series2" />
      </div>
      <div v-else>데이터를 불러오는 중...</div>
    </div>
  </section>
</template>
