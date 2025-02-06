<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { statsApi } from '@/services/statsService/statsService';

interface StatusState {
  status: 'IN_PROGRESS' | 'CLOSED';
  ticketCount: number;
}

interface UserData {
  userName: string;
  state: StatusState[];
}

interface SeriesData {
  name: string;
  data: number[];
}

type TimeFilter = 'WEEK' | 'MONTH' | 'QUARTER';

const selectedFilter = ref<TimeFilter>('WEEK');
const series2 = ref<SeriesData[]>([]);
const chartOptions2 = ref({
  chart: {
    type: 'bar',
    height: 550,
    stacked: true,
    stackType: '100%',
    toolbar: {
      show: true,
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
      horizontal: false,
      columnWidth: '60%',
    },
  },
  dataLabels: {
    enabled: true,
    formatter: function (val: number) {
      return Math.round(val) + '%';
    },
    style: {
      fontSize: '13px',
    },
  },
  stroke: {
    width: 0,
    colors: ['#fff'],
  },
  title: {
    text: '담당자별 티켓 상태 비율',
    align: 'left',
    offsetX: 40,
    offsetY: 40,
  },
  xaxis: {
    categories: [],
  },
  yaxis: {
    max: 100,
    labels: {
      formatter: function (val: number) {
        return val + '%';
      },
    },
  },
  legend: {
    position: 'top',
    horizontalAlign: 'right',
    markers: {
      radius: 12,
      shape: 'circle',
    },
  },
  colors: ['#FF5733', '#33FF57'], // IN_PROGRESS, CLOSED 색상
});

const fetchManagerStats = async (type: TimeFilter) => {
  try {
    const response = await statsApi.getManagerCategoryStats();
    const apiData: UserData[] = response.data.data;

    if (!Array.isArray(apiData)) {
      console.error('데이터 페칭 실패:', apiData);
      return;
    }

    // 사용자명 배열 생성
    const userNames = apiData.map((user) => user.userName);

    // 각 상태별 비율 계산
    const inProgressData: number[] = [];
    const closedData: number[] = [];

    apiData.forEach((user) => {
      const inProgress = user.state.find((s) => s.status === 'IN_PROGRESS')?.ticketCount || 0;
      const closed = user.state.find((s) => s.status === 'CLOSED')?.ticketCount || 0;
      const total = inProgress + closed;

      if (total === 0) {
        inProgressData.push(0);
        closedData.push(0);
      } else {
        inProgressData.push((inProgress / total) * 100);
        closedData.push((closed / total) * 100);
      }
    });

    // 시리즈 데이터 설정
    series2.value = [
      {
        name: 'In Progress',
        data: inProgressData,
      },
      {
        name: 'Closed',
        data: closedData,
      },
    ];

    // 차트 옵션 업데이트
    chartOptions2.value = {
      ...chartOptions2.value,
      xaxis: {
        ...chartOptions2.value.xaxis,
        categories: userNames,
      },
    };
  } catch (error) {
    console.error('각 담당자의 상태별 티켓수 조회 실패:', error);
  }
};

const handleFilterChange = (filter: TimeFilter) => {
  selectedFilter.value = filter;
  fetchManagerStats(filter);
};

onMounted(() => {
  fetchManagerStats('WEEK');
});
</script>

<template>
  <section class="overflow-x-auto mt-5 shadow-md">
    <div class="statistics-section">
      <div class="flex justify-between items-center mb-4">
        <h2 class="statistics-section-title">각 담당자의 상태별 티켓 수</h2>
        <div class="flex gap-2">
          <button
            v-for="filter in ['WEEK', 'MONTH', 'QUARTER'] as TimeFilter[]"
            :key="filter"
            :class="[
              'px-4 py-2 rounded-lg',
              selectedFilter === filter ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
            ]"
            @click="handleFilterChange(filter)"
          >
            {{ filter }}
          </button>
        </div>
      </div>
      <div v-if="series2.length">
        <apexchart type="bar" height="400" :options="chartOptions2" :series="series2" />
      </div>
      <div v-else>데이터를 불러오는 중...</div>
    </div>
  </section>
</template>

<style scoped>
.statistics-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.statistics-section-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}
</style>
