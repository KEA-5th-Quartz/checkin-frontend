import { ref } from 'vue';

export const timeFilterTickets = ref('WEEK'); // 기본 필터링: WEEK

export const chartData = ref([
  {
    username: '담당자1',
    state: [
      { status: 'In Progress', rate: 60 },
      { status: 'Closed', rate: 40 },
    ],
  },
  {
    username: '담당자2',
    state: [
      { status: 'In Progress', rate: 70 },
      { status: 'Closed', rate: 30 },
    ],
  },
  {
    username: '담당자3',
    state: [
      { status: 'In Progress', rate: 50 },
      { status: 'Closed', rate: 50 },
    ],
  },
  {
    username: '담당자4',
    state: [
      { status: 'In Progress', rate: 65 },
      { status: 'Closed', rate: 35 },
    ],
  },
  {
    username: '담당자5',
    state: [
      { status: 'In Progress', rate: 55 },
      { status: 'Closed', rate: 45 },
    ],
  },
  {
    username: '담당자6',
    state: [
      { status: 'In Progress', rate: 70 },
      { status: 'Closed', rate: 30 },
    ],
  },
  {
    username: '담당자7',
    state: [
      { status: 'In Progress', rate: 40 },
      { status: 'Closed', rate: 60 },
    ],
  },
  {
    username: '담당자8',
    state: [
      { status: 'In Progress', rate: 80 },
      { status: 'Closed', rate: 20 },
    ],
  },
  {
    username: '담당자9',
    state: [
      { status: 'In Progress', rate: 75 },
      { status: 'Closed', rate: 25 },
    ],
  },
]);

// 필터링에 따른 데이터 업데이트
export const updateChartData = () => {
  if (timeFilterTickets.value === 'WEEK') {
    chartData.value = [
      {
        username: '담당자1',
        state: [
          { status: 'In Progress', rate: 60 },
          { status: 'Closed', rate: 40 },
        ],
      },
      {
        username: '담당자2',
        state: [
          { status: 'In Progress', rate: 70 },
          { status: 'Closed', rate: 30 },
        ],
      },
      {
        username: '담당자3',
        state: [
          { status: 'In Progress', rate: 50 },
          { status: 'Closed', rate: 50 },
        ],
      },
      {
        username: '담당자4',
        state: [
          { status: 'In Progress', rate: 65 },
          { status: 'Closed', rate: 35 },
        ],
      },
      {
        username: '담당자5',
        state: [
          { status: 'In Progress', rate: 55 },
          { status: 'Closed', rate: 45 },
        ],
      },
      {
        username: '담당자6',
        state: [
          { status: 'In Progress', rate: 70 },
          { status: 'Closed', rate: 30 },
        ],
      },
      {
        username: '담당자7',
        state: [
          { status: 'In Progress', rate: 40 },
          { status: 'Closed', rate: 60 },
        ],
      },
      {
        username: '담당자8',
        state: [
          { status: 'In Progress', rate: 80 },
          { status: 'Closed', rate: 20 },
        ],
      },
      {
        username: '담당자9',
        state: [
          { status: 'In Progress', rate: 75 },
          { status: 'Closed', rate: 25 },
        ],
      },
    ];
  } else if (timeFilterTickets.value === 'MONTH') {
    chartData.value = [
      {
        username: '담당자1',
        state: [
          { status: 'In Progress', rate: 50 },
          { status: 'Closed', rate: 50 },
        ],
      },
      {
        username: '담당자2',
        state: [
          { status: 'In Progress', rate: 80 },
          { status: 'Closed', rate: 20 },
        ],
      },
      {
        username: '담당자3',
        state: [
          { status: 'In Progress', rate: 50 },
          { status: 'Closed', rate: 50 },
        ],
      },
      {
        username: '담당자4',
        state: [
          { status: 'In Progress', rate: 40 },
          { status: 'Closed', rate: 60 },
        ],
      },
      {
        username: '담당자5',
        state: [
          { status: 'In Progress', rate: 60 },
          { status: 'Closed', rate: 40 },
        ],
      },
      {
        username: '담당자6',
        state: [
          { status: 'In Progress', rate: 30 },
          { status: 'Closed', rate: 70 },
        ],
      },
      {
        username: '담당자7',
        state: [
          { status: 'In Progress', rate: 10 },
          { status: 'Closed', rate: 90 },
        ],
      },
      {
        username: '담당자8',
        state: [
          { status: 'In Progress', rate: 40 },
          { status: 'Closed', rate: 60 },
        ],
      },
      {
        username: '담당자9',
        state: [
          { status: 'In Progress', rate: 80 },
          { status: 'Closed', rate: 20 },
        ],
      },
    ];
  } else if (timeFilterTickets.value === 'QUARTER') {
    chartData.value = [
      // "QUARTER" 필터에 따른 데이터
    ];
  }
};
