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
    isLoggedOut: false,
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

    async logout() {
      // 로그아웃 API 호출
      await userApi.logout();
      this.clearMemberInfo();
      this.isLoggedOut = true; // 로그아웃 시 플래그 설정
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
