import { defineStore } from 'pinia';
import { MemberListItem } from '@/types/memberList';

export const useDeletedMemberListStore = defineStore('deleted-member-list', {
  state: () => ({
    members: [] as MemberListItem[], // 삭제된 회원 목록
    currentPage: 1, // 현재 페이지
    totalPages: 0, // 총 페이지 수
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
