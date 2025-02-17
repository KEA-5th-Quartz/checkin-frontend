<script setup lang="ts">
import { useMemberStore } from '@/stores/memberStore';
import { MemberType } from '@/types/member';
import { useForm, useField } from 'vee-validate';
import { firstLoginSchema } from '@/utils/firstLoginSchema';
import SvgIcon from '../common/SvgIcon.vue';
import { computed, ref } from 'vue';
import { EyeIcon, EyeSlashIcon } from '@/assets/icons/path';
import { userApi } from '@/services/userService/userService';
import CommonDialog from '../common/CommonDialog.vue';
import { DialogProps, initialDialog } from '@/types/common/dialog';
import CommonInput from '../common/CommonInput.vue';

const memberStore = useMemberStore();
const dialogState = ref<DialogProps>({ ...initialDialog });

const { handleSubmit, errors, meta } = useForm({
  validationSchema: firstLoginSchema,
});

const { value: newPwd } = useField<string>('newPwd');
const { value: checkPwd } = useField<string>('checkPwd');

const getRedirectPath = (role: string | MemberType): string => {
  const roleRedirectMap: Record<MemberType, string> = {
    ADMIN: '/admin',
    MANAGER: '/manager/dashboard',
    USER: '/user/ticketlist',
  };
  return roleRedirectMap[role as MemberType] || '/';
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
  } catch (error) {
    dialogState.value = {
      open: true,
      isOneBtn: true,
      title: '예상치 못한 문제가 발생했습니다.',
      mainText: '확인',
      onMainClick: () => {
        dialogState.value = { ...initialDialog };
        window.location.replace('/');
      },
    };
  }
});

const newPassword = computed({
  get: () => newPwd.value,
  set: (val: string) => (newPwd.value = val),
});

const confirmPassword = computed({
  get: () => checkPwd.value,
  set: (val: string) => (checkPwd.value = val),
});

const showPwd = ref({
  new: false,
  check: false,
});

const togglePwdVisibility = (field: 'new' | 'check') => {
  showPwd.value[field] = !showPwd.value[field];
};
</script>

<template>
  <form class="login-form" @submit="onSubmit">
    <div class="relative">
      <label>비밀번호</label>
      <CommonInput
        v-model="newPassword"
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
      <CommonInput
        v-model="confirmPassword"
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
