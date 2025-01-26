import { defineStore } from 'pinia';

export interface MemberState {
  memberId: number | null;
  username: string;
  profilePic: string;
  role: string;
  accessToken: string;
}

export const useMemberStore = defineStore('member', {
  state: (): MemberState => ({
    memberId: null,
    username: '',
    profilePic: '',
    role: '',
    accessToken: '',
  }),

  actions: {
    setMemberInfo(memberData: MemberState) {
      this.memberId = memberData.memberId;
      this.username = memberData.username;
      this.profilePic = memberData.profilePic;
      this.role = memberData.role;
      this.accessToken = memberData.accessToken;
    },

    clearMemberInfo() {
      this.memberId = null;
      this.username = '';
      this.profilePic = '';
      this.role = '';
      this.accessToken = '';
    },
  },
});
