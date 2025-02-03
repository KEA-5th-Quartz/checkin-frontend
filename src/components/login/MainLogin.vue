<script setup lang="ts">
import { userApi } from '@/services/userService/userService';
import { useMemberStore } from '@/stores/memberStore';
import { MemberType } from '@/types/member';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import SvgIcon from '../common/SvgIcon.vue';
import { EyeIcon, EyeSlashIcon } from '@/assets/icons/path';
import { DialogProps, initialDialog } from '@/types/common/dialog';
import CommonDialog from '../common/CommonDialog.vue';
import { ApiError } from '@/types/common/error';

const router = useRouter();
const memberStore = useMemberStore();
const username = ref('');
const password = ref('');

const dialogState = ref<DialogProps>({ ...initialDialog });

const getRedirectPath = (role: MemberType): string => {
  const roleRedirectMap: Record<MemberType, string> = {
    ADMIN: '/admin',
    MANAGER: '/manager/dashboard',
    USER: '/user/ticketlist',
  };
  return roleRedirectMap[role];
};

const handleLogin = async () => {
  try {
    const response = await userApi.login({
      username: username.value,
      password: password.value,
    });
    const memberData = response.data.data;

    memberStore.setMemberInfo({
      memberId: memberData.memberId,
      username: memberData.username,
      profilePic: memberData.profilePic,
      role: memberData.role,
      email: memberData.email,
      accessToken: memberData.accessToken,
      passwordResetToken: memberData.passwordResetToken,
    });

    // 로그인 성공 시 isLoggedOut 플래그를 false로 설정
    memberStore.isLoggedOut = false;

    // 최초로그인인지 검사
    if (memberData.passwordResetToken !== null) {
      router.push('/first-login');
    } else {
      const redirectPath = getRedirectPath(memberData.role);
      router.replace(redirectPath);
    }
  } catch (error: unknown) {
    const { message } = error as ApiError;

    dialogState.value = {
      open: true,
      isOneBtn: true,
      title: message,
      mainText: '확인',
      onMainClick: () => {
        dialogState.value = { ...initialDialog };
      },
    };
  }
};

const showPwd = ref(false);
const togglePwdVisibility = () => {
  showPwd.value = !showPwd.value;
};
</script>

<template>
  <form class="login-form" @submit.prevent="handleLogin">
    <input v-model="username" type="text" required class="login-input border-primary-0" placeholder="Username" />
    <div class="relative">
      <input
        v-model="password"
        :type="showPwd ? 'text' : 'password'"
        required
        class="login-input border-primary-0"
        placeholder="Password"
      />
      <SvgIcon
        class="absolute top-1/3 right-3 transform cursor-pointer"
        @click="togglePwdVisibility()"
        :icon="showPwd ? EyeIcon : EyeSlashIcon"
      />
    </div>

    <button type="submit" class="login-btn mt-4">로그인</button>
  </form>

  <CommonDialog
    v-if="dialogState.open"
    :isOneBtn="dialogState.isOneBtn"
    :title="dialogState.title"
    :mainText="dialogState.mainText"
    :onCancelClick="dialogState.onMainClick"
    :onMainClick="dialogState.onMainClick"
  />
</template>
