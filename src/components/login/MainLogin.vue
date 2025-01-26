<script setup lang="ts">
import { userApi } from '@/services/userService/userService';
import { useMemberStore } from '@/stores/memberStore';
import { MemberType } from '@/types/member';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const memberStore = useMemberStore();
const username = ref('');
const password = ref('');

const getRedirectPath = (role: MemberType): string => {
  const roleRedirectMap: Record<MemberType, string> = {
    ADMIN: '/administrator/memberManagement',
    MANAGER: '/manager/dashboard',
    USER: '/user/tickets',
  };
  return roleRedirectMap[role];
};

const handleLogin = async () => {
  try {
    const response = await userApi.login({
      username: username.value,
      password: password.value,
    });
    console.log('data:', response.data.data);
    const memberData = response.data.data;

    memberStore.setMemberInfo({
      memberId: memberData.memberId,
      username: memberData.username,
      profilePic: memberData.profilePic,
      role: memberData.role,
      accessToken: memberData.accessToken,
      passwordChangedAt: memberData.passwordChangedAt,
    });

    // 최초로그인인지 검사
    if (memberData.passwordChangedAt === null) {
      router.push('/first-login');
    } else {
      const redirectPath = getRedirectPath(memberData.role);
      router.replace(redirectPath);
    }
  } catch (error) {
    console.error('로그인 실패:', error);
  }
};
</script>

<template>
  <form class="login-form" @submit.prevent="handleLogin">
    <input v-model="username" type="text" required class="login-input border-primary-0" placeholder="Username" />

    <input v-model="password" type="password" required class="login-input border-primary-0" placeholder="Password" />

    <button type="submit" class="login-btn mt-4">로그인</button>

    <a href="#" class="block text-center text-sm text-gray-1 hover:text-gray-0">비밀번호 찾기</a>
  </form>
</template>
