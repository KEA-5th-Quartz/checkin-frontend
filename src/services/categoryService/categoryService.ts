import api from '@/api/axios';

export const categoryApi = {
  getCategories() {
    return api.get('/categories');
  },

  postFirstCategory(data: { name: string; alias: string; contentGuide: string }) {
    return api.post('/categories', data);
  },

  putFirstCategory(firstCategoryId: number, data: { name: string; alias: string; contentGuide: string }) {
    return api.put(`/categories/${firstCategoryId}`, data);
  },

  deleteFirstCategory(firstCategoryId: number) {
    return api.delete(`/categories/${firstCategoryId}`);
  },

  postSecondCategory(firstCategoryId: number, data: { name: string; alias: string }) {
    return api.post(`/categories/${firstCategoryId}/second-categories`, data);
  },

  putSecondCategory(
    firstCategoryId: number,
    secondCategoryId: number,
    data: { secondCategory: string; alias: string },
  ) {
    return api.put(`/categories/${firstCategoryId}/second-categories/${secondCategoryId}`, data);
  },

  deleteSecondCategory(firsteCategoryId: number, secondCategoryId: number) {
    return api.delete(`/categories/${firsteCategoryId}/second-categories/${secondCategoryId}`);
  },
};
