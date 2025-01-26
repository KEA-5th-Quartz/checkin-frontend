import api from '@/api/axios';

// 임시 유저 CRUD
export const userApi = {
  // 로그인
  login(data: { username: string; password: string }) {
    return api.post('/auth/login', data);
  },
};
