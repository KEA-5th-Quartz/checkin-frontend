import api from '@/api/axios';

export const statsApi = {
  // [담당자] 각 담당자의 카테고리별 티켓 수
  getManagerCategoryStats() {
    return api.get('/stats/managers/categories');
  },
  // [담당자] 기한이 오늘까지인 특정 담당자 1명의 진행중 티켓 수
  getManagerDueTodayStats(managerId: number | null) {
    return api.get(`/stats/${managerId}/due-today`);
  },
  // [담당자, 관리자] 각 담당자의 상태별 티켓 수
  getManagersStats() {
    return api.get('/stats/managers');
  },
  // [담당자, 관리자] 카테고리별 진행중인 티켓 수
  getCategoryStats() {
    return api.get('/stats/categories');
  },
  // [관리자] 작업 완성률 조회
  getClosedRateStats() {
    return api.get('/stats/closed-rate');
  },
  // [관리자] 전체 작업 상태 분포
  getStatusRateStats() {
    return api.get('/stats/status-rate');
  },
};
