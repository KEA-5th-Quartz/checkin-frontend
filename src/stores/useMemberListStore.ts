import { defineStore } from 'pinia';
import { MemberListItem } from '@/types/memberList';

export const useMemberListStore = defineStore('member-list', {
  state: () => ({
    members: [] as MemberListItem[], // 멤버 목록
    currentPage: 1, // 현재 페이지
    totalPages: 0, // 총 페이지 수
    selectedRole: 'ADMIN' as MemberListItem['role'], // 선택된 역할
    searchQuery: '', // 검색어
  }),
  actions: {
    setMembers(members: MemberListItem[], totalPages: number) {
      this.members = members;
      this.totalPages = totalPages;
    },
    setRole(role: MemberListItem['role']) {
      this.selectedRole = role;
    },
    setSearchQuery(query: string) {
      this.searchQuery = query;
    },
    setCurrentPage(page: number) {
      this.currentPage = page;
    },
  },
});
