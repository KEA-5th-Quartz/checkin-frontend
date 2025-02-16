import api from '@/api/axios';

export const statsApi = {
  getManagerCategoryStats() {
    return api.get('/stats/managers/categories');
  },

  getManagerDueTodayStats(managerId: number | null) {
    return api.get(`/stats/${managerId}/due-today`);
  },

  getManagersStats(type: string) {
    return api.get('/stats/managers', {
      params: { type },
    });
  },

  getCategoryStats() {
    return api.get('/stats/categories');
  },

  getClosedRateStats(type: string) {
    return api.get('/stats/closed-rate', {
      params: { type },
    });
  },

  getStatusRateStats() {
    return api.get('/stats/status-rate');
  },
};
