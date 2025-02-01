import api from '@/api/axios';

export const memberApi = {
  // 관리자 인원 등록 API
  addMember(data: { username: string; email: string; role: string }) {
    return api.post('/members', data);
  },
  // 아이디 중복 검사 API
  checkUsername(username: string) {
    return api.get(`/members/check-username?username=${encodeURIComponent(username)}`);
  },
  // 이메일 중복 검사 API
  checkEmail(email: string) {
    return api.get(`/members/check-email?email=${encodeURIComponent(email)}`);
  },
};
