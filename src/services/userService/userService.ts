import api from '@/api/axios';

// 임시 유저 CRUD
export const userApi = {
  // 로그인
  login(data: { username: string; password: string }) {
    return api.post('/auth/login', data);
  },
  // 비밀번호 변경(최초 로그인)
  changePassword(memberId: number | null, data: { originalpassword: string; newpassword: string }) {
    return api.put(`/members/${memberId}/password`, data);
  },
};
