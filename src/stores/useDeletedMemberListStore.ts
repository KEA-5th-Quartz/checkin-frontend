import { defineStore } from 'pinia';
import { MemberListItem } from '@/types/memberList';

export const useDeletedMemberListStore = defineStore('deleted-member-list', {
  state: () => ({
    members: [] as MemberListItem[],
    currentPage: 1,
    totalPages: 0,
  }),
  actions: {
    setMembers(members: MemberListItem[], totalPages: number) {
      this.members = members;
      this.totalPages = totalPages;
    },
    setCurrentPage(page: number) {
      this.currentPage = page;
    },
  },
});
