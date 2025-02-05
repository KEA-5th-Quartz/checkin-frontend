import api from '@/api/axios';
import { MemberListResponse, MemberListItem } from '@/types/memberList';

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
  // 역할별 멤버 목록 조회 API
  async getMembers(role: MemberListItem['role'], page = 1, size = 10, username = '') {
    const params = new URLSearchParams();
    params.append('role', role);
    params.append('page', page.toString());
    params.append('size', size.toString());
    if (username) {
      params.append('username', username);
    }

    const response = await api.get<MemberListResponse>(`/members?${params.toString()}`);

    return response.data.data;
  },
  // [관리자] 사용자, 담당자, 관리자 수 전체 조회
  getMemberStatsRole() {
    return api.get('/members/stats/role');
  },
  // [관리자] 회원 권한 변경
  putMemberRole(memberId: number, data: { role: string }) {
    return api.put(`/members/${memberId}/role`, data);
  },
  // [담당자] 담당자 개인 데이터 조회
  getManagerProgress() {
    return api.get('/tickets/progress');
  },
};
