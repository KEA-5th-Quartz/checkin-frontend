import { MemberState } from '@/types/member';
import { defineStore } from 'pinia';

export const useMemberStore = defineStore('member', {
  state: (): MemberState => ({
    memberId: null,
    username: '',
    profilePic: '',
    role: '',
    accessToken: '',
    passwordChangedAt: null,
  }),

  actions: {
    setMemberInfo(memberData: MemberState) {
      this.memberId = memberData.memberId;
      this.username = memberData.username;
      this.profilePic = memberData.profilePic;
      this.role = memberData.role;
      this.accessToken = memberData.accessToken;
      this.passwordChangedAt = memberData.passwordChangedAt;
    },

    clearMemberInfo() {
      this.memberId = null;
      this.username = '';
      this.profilePic = '';
      this.role = '';
      this.accessToken = '';
      this.passwordChangedAt = null;
    },
  },
});
