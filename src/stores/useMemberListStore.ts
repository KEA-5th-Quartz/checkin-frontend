import { defineStore } from 'pinia';
import { MemberListItem } from '@/types/memberList';

export const useMemberListStore = defineStore('member-list', {
  state: () => ({
    members: [] as MemberListItem[],
    currentPage: 1,
    totalPages: 0,
    selectedRole: 'ADMIN' as MemberListItem['role'],
    searchQuery: '',
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
