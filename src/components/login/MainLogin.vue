<script setup lang="ts">
import { userApi } from '@/services/userService/userService';
import { useMemberStore } from '@/stores/memberStore';
import { MemberType } from '@/types/member';
import { computed, onMounted, onUnmounted, ref } from 'vue';
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

const removeEmojiAndSpaces = (str: string): string => {
  return str
    .replace(
      /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu,
      '',
    )
    .replace(/\s/g, '');
};

const handleUsernameInput = (e: Event) => {
  const input = (e.target as HTMLInputElement).value;
  username.value = removeEmojiAndSpaces(input);
};

const handlePasswordInput = (e: Event) => {
  const input = (e.target as HTMLInputElement).value;
  password.value = removeEmojiAndSpaces(input);
};

const formatTime = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}분 ${seconds}초`;
};

const startBlockTimer = (initialTime: string) => {
  const matches = initialTime.match(/(\d+)분\s*(\d+)초/);
  if (!matches) return;

  let totalSeconds = parseInt(matches[1]) * 60 + parseInt(matches[2]);

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

    memberStore.isLoggedOut = false;
    queryClient.clear();

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
      blockTime.value = '';
      if (timerInterval) {
        clearInterval(timerInterval);
      }

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

onMounted(() => {
  sessionStorage.clear();
  memberStore.clearMemberInfo();
});

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
      @input="handleUsernameInput"
      type="text"
      required
      :value="username"
      class="login-input border-primary-0"
      placeholder="Username"
    />
    <div class="relative">
      <CommonInput
        :maxLength="30"
        @input="handlePasswordInput"
        :type="showPwd ? 'text' : 'password'"
        required
        :value="password"
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
