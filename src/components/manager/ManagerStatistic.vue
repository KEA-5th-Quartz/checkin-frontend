<script setup lang="ts">
import { ref } from 'vue';

const series = ref([
  {
    name: '카테고리1',
    data: [11, 5, 11, 7, 12, 1, 8, 14, 6],
  },
  {
    name: '카테고리2',
    data: [13, 2, 13, 2, 13, 13, 3, 11, 10],
  },
  {
    name: '카테고리3',
    data: [12, 17, 11, 9, 5, 11, 0, 13, 5],
  },
  {
    name: '카테고리4',
    data: [9, 7, 5, 8, 6, 9, 4, 7, 8],
  },
  {
    name: '카테고리5',
    data: [5, 1, 9, 2, 5, 4, 10, 6, 7],
  },
]);

const chartOptions = ref({
  chart: {
    type: 'bar',
    height: 550,
    stacked: true,
    toolbar: {
      show: false,
    },
  },
  grid: {
    // padding 대신 grid 사용
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
    offsetX: 0,
  },
  stroke: {
    width: 0,
    colors: ['#fff'],
  },
  title: {
    text: '담당자별 티켓 상태',
    margin: 40, // 제목 여백 추가
  },
  xaxis: {
    categories: ['김철환', '김현중', '박가현', '박석종', '박준한', '손성민', '임찬호', '조기헌', '최현준'],
  },
  legend: {
    position: 'top',
    horizontalAlign: 'right',
  },
  colors: ['#232D64', '#828DCA', '#D7DCF5', '#EBEDF8'],
});
</script>

<template>
  <section class="overflow-x-auto mt-5 p-5 pb-20">
    <div class="bg-white-0 w-full h-[704px]">
      <apexchart type="bar" height="500" :options="chartOptions" :series="series" />
    </div>
  </section>
</template>
