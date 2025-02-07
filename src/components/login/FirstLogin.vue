<script setup lang="ts">
import { useMemberStore } from '@/stores/memberStore';
import { MemberType } from '@/types/member';
import { useForm, useField } from 'vee-validate';
import { schema } from '@/utils/passwordSchema';
import SvgIcon from '../common/SvgIcon.vue';
import { ref } from 'vue';
import { EyeIcon, EyeSlashIcon } from '@/assets/icons/path';
import { userApi } from '@/services/userService/userService';
import CommonDialog from '../common/CommonDialog.vue';
import { DialogProps, initialDialog } from '@/types/common/dialog';

const memberStore = useMemberStore();
const dialogState = ref<DialogProps>({ ...initialDialog });

// Form 설정
const { handleSubmit, errors, meta } = useForm({
  validationSchema: schema,
});

// Field 설정
const { value: newPwd } = useField('newPwd');
const { value: checkPwd } = useField('checkPwd');

const getRedirectPath = (role: string | MemberType): string => {
  const roleRedirectMap: Record<MemberType, string> = {
    ADMIN: '/admin',
    MANAGER: '/manager/dashboard',
    USER: '/user/ticketlist',
  };
  return roleRedirectMap[role as MemberType] || '/'; // 기본값으로 홈으로 리다이렉트
};

const resetForm = () => {
  newPwd.value = '';
  checkPwd.value = '';
};

const onSubmit = handleSubmit(async (values) => {
  try {
    if (!memberStore.passwordResetToken) {
      dialogState.value = {
        open: true,
        isOneBtn: true,
        title: '오류가 발생했습니다 다시 로그인해주세요.',
        mainText: '확인',
        onMainClick: () => {
          dialogState.value = { ...initialDialog };
          window.location.replace('/');
        },
      };
    }

    await userApi.passwordReset(memberStore.memberId, {
      passwordResetToken: memberStore.passwordResetToken,
      newPassword: values.newPwd,
    });
    const redirectPath = getRedirectPath(memberStore.role);

    dialogState.value = {
      open: true,
      isOneBtn: true,
      title: '비밀번호가 변경되었습니다.',
      mainText: '확인',
      onMainClick: () => {
        dialogState.value = { ...initialDialog };
        window.location.replace(redirectPath);
      },
    };

    resetForm();
  } catch (error) {
    console.error('비밀번호 변경 실패:', error);
  }
});

// 비밀번호 표시 여부
const showPwd = ref({
  new: false,
  check: false,
});

// 비밀번호 표시/숨김 토글 함수
const togglePwdVisibility = (field: 'new' | 'check') => {
  showPwd.value[field] = !showPwd.value[field];
};
</script>

<template>
  <form class="login-form" @submit="onSubmit">
    <div class="relative">
      <label>비밀번호</label>
      <input
        v-model="newPwd"
        :type="showPwd.new ? 'text' : 'password'"
        name="newPwd"
        maxlength="20"
        placeholder="Password"
        :class="[
          'login-input',
          {
            'border-primary-0': !newPwd,
            'border-red-1': errors.newPwd,
            'border-green-1': newPwd && !errors.newPwd,
          },
        ]"
      />
      <SvgIcon
        class="absolute top-1/2 right-3 transform cursor-pointer"
        @click="togglePwdVisibility('new')"
        :icon="showPwd.new ? EyeIcon : EyeSlashIcon"
      />
      <p
        :class="[
          'login-p',
          {
            'text-gray-1': !newPwd,
            'text-red-1': errors.newPwd,
            'text-green-1': newPwd && !errors.newPwd,
          },
        ]"
      >
        {{
          errors.newPwd
            ? errors.newPwd
            : newPwd
            ? '사용 가능한 비밀번호입니다.'
            : '비밀번호는 영문, 숫자, 특수문자를 포함한 8자리 이상 20자리 이하'
        }}
      </p>
    </div>

    <div class="relative">
      <label>비밀번호 확인</label>
      <input
        v-model="checkPwd"
        :type="showPwd.check ? 'text' : 'password'"
        name="checkPwd"
        placeholder="Check Password"
        :class="[
          'login-input',
          {
            'border-primary-0': !checkPwd,
            'border-red-1': errors.checkPwd,
            'border-green-1': checkPwd && !errors.checkPwd,
          },
        ]"
      />
      <SvgIcon
        class="absolute top-1/2 right-3 transform cursor-pointer"
        @click="togglePwdVisibility('check')"
        :icon="showPwd.check ? EyeIcon : EyeSlashIcon"
      />
      <p
        v-if="checkPwd"
        :class="[
          'login-p',
          {
            'text-red-1': errors.checkPwd,
            'text-green-1': !errors.checkPwd && checkPwd,
          },
        ]"
      >
        {{ errors.checkPwd || '비밀번호가 일치합니다.' }}
      </p>
    </div>

    <button
      type="submit"
      :disabled="!meta.valid"
      class="login-btn mt-12 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      변경
    </button>
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
