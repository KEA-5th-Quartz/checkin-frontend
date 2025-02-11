<script setup lang="ts">
import { userApi } from '@/services/userService/userService';
import { useMemberStore } from '@/stores/memberStore';
import { MemberType } from '@/types/member';
import { computed, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import SvgIcon from '../common/SvgIcon.vue';
import { EyeIcon, EyeSlashIcon } from '@/assets/icons/path';
import { DialogProps, initialDialog } from '@/types/common/dialog';
import CommonDialog from '../common/CommonDialog.vue';
import { ApiError } from '@/types/common/error';
import { useQueryClient } from '@tanstack/vue-query';
import CommonInput from '../common/CommonInput.vue';

const router = useRouter();
const memberStore = useMemberStore();
const username = ref('');
const password = ref('');
const queryClient = useQueryClient();
let blockTime = ref('');
let timerInterval: number | null = null;

const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}분 ${seconds}초`;
};

const startBlockTimer = (initialTime: string) => {
  const matches = initialTime.match(/(\d+)분\s*(\d+)초/);
  if (!matches) return;

  let totalSeconds = parseInt(matches[1]) * 60 + parseInt(matches[2]);

  // 이전 타이머가 있다면 제거
  if (timerInterval) {
    clearInterval(timerInterval);
  }

  blockTime.value = formatTime(totalSeconds);

  timerInterval = setInterval(() => {
    totalSeconds -= 1;

    if (totalSeconds <= 0) {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
      blockTime.value = '';
      return;
    }

    blockTime.value = formatTime(totalSeconds);
  }, 1000);
};

const dialogState = ref<DialogProps>({ ...initialDialog });

const dialogContent = computed(() => {
  return blockTime.value ? `남은시간 ${blockTime.value}` : undefined;
});

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
    queryClient.clear();

    // 최초로그인인지 검사
    if (memberData.passwordResetToken !== null) {
      router.push('/first-login');
    } else {
      const redirectPath = getRedirectPath(memberData.role);
      router.replace(redirectPath);
    }
  } catch (error: unknown) {
    const { message, data } = error as ApiError;

    if (data?.blockTime) {
      startBlockTimer(data.blockTime);
      dialogState.value = {
        open: true,
        isOneBtn: true,
        title: message,
        content: dialogContent.value,
        mainText: '확인',
        onMainClick: () => {
          dialogState.value = { ...initialDialog };
          if (timerInterval) {
            clearInterval(timerInterval);
          }
        },
      };
    } else {
      dialogState.value = {
        open: true,
        isOneBtn: true,
        title: message,
        content: '',
        mainText: '확인',
        onMainClick: () => {
          dialogState.value = { ...initialDialog };
        },
      };
    }
  }
};

onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
});

const showPwd = ref(false);
const togglePwdVisibility = () => {
  showPwd.value = !showPwd.value;
};
</script>

<template>
  <form class="login-form" @submit.prevent="handleLogin">
    <CommonInput
      :maxLength="15"
      v-model="username"
      type="text"
      required
      class="login-input border-primary-0"
      placeholder="Username"
    />
    <div class="relative">
      <CommonInput
        :maxLength="30"
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
    :content="dialogContent"
    :mainText="dialogState.mainText"
    :onCancelClick="dialogState.onMainClick"
    :onMainClick="dialogState.onMainClick"
  />
</template>
