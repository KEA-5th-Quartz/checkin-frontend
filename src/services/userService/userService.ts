import api from '@/api/axios';

// 임시 유저 CRUD
export const userApi = {
  // 로그인
  login(data: { username: string; password: string }) {
    return api.post('/auth/login', data);
  },
  // refresh토큰으로 accessToken과 refreshToken 재발급
  refresh() {
    return api.post('/auth/refresh');
  },
  // 비밀번호 변경(최초 로그인)
  changePassword(memberId: number | null, data: { originalpassword: string; newpassword: string }) {
    return api.put(`/members/${memberId}/password`, data);
  },
  // 회원의 프로필 사진 변경
  changeProfileImg(memberId: number | null, data: FormData) {
    return api.put(`/members/${memberId}/profile-pic`, data);
  },
};
