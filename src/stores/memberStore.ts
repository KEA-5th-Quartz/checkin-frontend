import { userApi } from '@/services/userService/userService';
import { MemberState } from '@/types/member';
import { defineStore } from 'pinia';

export const useMemberStore = defineStore('member', {
  state: (): MemberState => ({
    memberId: null,
    username: '',
    profilePic: '',
    role: '',
    email: '',
    accessToken: '',
    passwordResetToken: null,
  }),

  actions: {
    setMemberInfo(memberData: MemberState) {
      this.memberId = memberData.memberId;
      this.username = memberData.username;
      this.profilePic = memberData.profilePic;
      this.role = memberData.role;
      this.email = memberData.email;
      this.accessToken = memberData.accessToken;
      this.passwordResetToken = memberData.passwordResetToken;
    },

    clearMemberInfo() {
      this.memberId = null;
      this.username = '';
      this.profilePic = '';
      this.role = '';
      this.email = '';
      this.accessToken = '';
      this.passwordResetToken = null;
    },

    async restoreAuth() {
      try {
        const response = await userApi.refresh();
        this.setMemberInfo(response.data.data);
        return true;
      } catch (error) {
        this.clearMemberInfo();
        return false;
      }
    },
  },
});
