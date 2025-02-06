import api from '@/api/axios';

export const categoryApi = {
  // 카테고리 전체 조회
  getCategories() {
    return api.get('/categories');
  },
  // 1차 카테고리 생성
  postFirstCategory(data: { name: string }) {
    return api.post('/categories', data);
  },
  // 1차 카테고리 수정
  putFirstCategory(firstCategoryId: number, data: { firstCategory: string }) {
    return api.put(`/categories/${firstCategoryId}`, data);
  },
  // 1차 카테고리 삭제
  deleteFirstCategory(firstCategoryId: number) {
    return api.delete(`/categories/${firstCategoryId}`);
  },
  // 2차 카테고리 생성
  postSecondCategory(firstCategoryId: number, data: { name: string }) {
    return api.post(`/categories/${firstCategoryId}/second-categories`, data);
  },
  // 2차 카테고리 수정
  putSecondCategory(firsteCategoryId: number, secondCategoryId: number, data: { secondCategory: string }) {
    return api.put(`/categories/${firsteCategoryId}/second-categories/${secondCategoryId}`, data);
  },
  // 2차 카테고리 삭제
  deleteSecondCategory(firsteCategoryId: number, secondCategoryId: number) {
    return api.delete(`/categories/${firsteCategoryId}/second-categories/${secondCategoryId}`);
  },
};
