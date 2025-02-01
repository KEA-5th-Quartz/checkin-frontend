import api from '@/api/axios';

export const userApi = {
  // 로그인
  login(data: { username: string; password: string }) {
    return api.post('/auth/login', data);
  },
  // 로그아웃
  logout() {
    return api.post('/auth/logout');
  },
  // 첫 로그인 비밀번호 초기화
  passwordReset(memberId: number | null, data: { passwordResetToken: string | null; newPassword: string }) {
    return api.put(`/members/${memberId}/password-reset`, data);
  },
  // refresh토큰으로 accessToken과 refreshToken 재발급
  refresh() {
    return api.post('/auth/refresh');
  },
  // 비밀번호 변경(최초 로그인)
  changePassword(memberId: number | null, data: { originalPassword: string; newPassword: string }) {
    return api.put(`/members/${memberId}/password`, data);
  },
  // 담당자 목록 조회
  getManagers(role: string, page: number, size: number, username?: string) {
    const params = new URLSearchParams();

    if (page) params.append('page', page.toString());
    if (size) params.append('size', size.toString());
    if (username) params.append('username', username.toString());
    return api.get(`/members?role=${role}&${params.toString()}`);
  },
  // 회원 ID로 회원 정보 조회
  getMemberId(memberId: number) {
    return api.get(`/members/${memberId}`);
  },
  // 회원의 프로필 사진 변경
  changeProfileImg(memberId: number | null, data: FormData) {
    return api.put(`/members/${memberId}/profile-pic`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
