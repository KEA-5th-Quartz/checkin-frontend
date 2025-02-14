import api from '@/api/axios';
import { MemberListResponse, MemberListItem } from '@/types/memberList';

export const memberApi = {
  addMember(data: { username: string; email: string; role: string }) {
    return api.post('/members', data);
  },

  checkUsername(username: string) {
    return api.get(`/members/check-username?username=${encodeURIComponent(username)}`);
  },

  checkEmail(email: string) {
    return api.get(`/members/check-email?email=${encodeURIComponent(email)}`);
  },

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

  async getDeletedMembers(role: MemberListItem['role'], page = 1, size = 10, username = '') {
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

  getMemberStatsRole() {
    return api.get('/members/stats/role');
  },

  getDeletedMember(page: number, size: number) {
    return api.get(`/members/trash?page=${page}&size=${size}`);
  },

  deleteMember(memberId: number) {
    return api.delete(`/members/${memberId}`);
  },

  patchRestoreMember(memberId: number) {
    return api.patch(`/members/trash/${memberId}/restore`);
  },

  deleteMemberDelete(memberId: number) {
    return api.delete(`/members/trash/${memberId}`);
  },

  putMemberRole(memberId: number, data: { role: string }) {
    return api.put(`/members/${memberId}/role`, data);
  },

  getManagerProgress() {
    return api.get('/tickets/progress');
  },

  getMemberLog(page: number, size: number, order: string) {
    return api.get(`/members/access-logs?page=${page}&size=${size}&order=${order}`);
  },
};
