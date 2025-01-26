<script setup lang="ts">
import { userApi } from '@/services/userService/userService';
import { useMemberStore } from '@/stores/memberStore';
import { MemberType } from '@/types/member';
import { useRouter } from 'vue-router';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';

const router = useRouter();
const memberStore = useMemberStore();

// 유효성 검사 스키마 정의
const schema = yup.object({
  newPassword: yup
    .string()
    .required('비밀번호를 입력해주세요.')
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다.')
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/,
      '비밀번호는 영문, 숫자, 특수문자를 포함해야 합니다.',
    ),
  checkPassword: yup
    .string()
    .required('비밀번호 확인을 입력해주세요.')
    .oneOf([yup.ref('newPassword')], '비밀번호가 일치하지 않습니다.'),
});

// Form 설정
const { handleSubmit, errors, meta } = useForm({
  validationSchema: schema,
});

// Field 설정
const { value: newPassword } = useField('newPassword');
const { value: checkPassword } = useField('checkPassword');

const getRedirectPath = (role: string | MemberType): string => {
  const roleRedirectMap: Record<MemberType, string> = {
    ADMIN: '/administrator/memberManagement',
    MANAGER: '/manager/dashboard',
    USER: '/user/tickets',
  };
  return roleRedirectMap[role as MemberType];
};

const resetForm = () => {
  newPassword.value = '';
  checkPassword.value = '';
};

const onSubmit = handleSubmit(async (values) => {
  try {
    await userApi.changePassword(memberStore.memberId, {
      originalpassword: '',
      newpassword: values.newPassword,
    });

    const redirectPath = getRedirectPath(memberStore.role);
    router.replace(redirectPath);

    resetForm();
  } catch (error) {
    console.log('비밀번호 변경 실패:', error);
  }
});
</script>

<template>
  <form class="login-form" @submit="onSubmit">
    <div>
      <label>비밀번호</label>
      <input
        v-model="newPassword"
        type="password"
        name="newPassword"
        maxlength="20"
        placeholder="password"
        :class="[
          'login-input',
          {
            'border-primary-0': !newPassword,
            'border-red-1': errors.newPassword,
            'border-green-1': newPassword && !errors.newPassword,
          },
        ]"
      />
      <p
        :class="[
          'login-p',
          {
            'text-gray-1': !newPassword,
            'text-red-1': errors.newPassword,
            'text-green-1': newPassword && !errors.newPassword,
          },
        ]"
      >
        {{
          errors.newPassword
            ? errors.newPassword
            : newPassword
            ? '사용 가능한 비밀번호입니다.'
            : '비밀번호는 영문, 숫자, 특수문자를 포함한 8자리 이상 20자리 이하'
        }}
      </p>
    </div>

    <div>
      <label>비밀번호 확인</label>
      <input
        v-model="checkPassword"
        type="password"
        name="checkPassword"
        placeholder="check password"
        :class="[
          'login-input',
          {
            'border-primary-0': !checkPassword,
            'border-red-1': errors.checkPassword,
            'border-green-1': checkPassword && !errors.checkPassword,
          },
        ]"
      />
      <p
        v-if="checkPassword"
        :class="[
          'login-p',
          {
            'text-red-1': errors.checkPassword,
            'text-green-1': !errors.checkPassword && checkPassword,
          },
        ]"
      >
        {{ errors.checkPassword || '비밀번호가 일치합니다.' }}
      </p>
    </div>

    <button
      type="submit"
      :disabled="!meta.valid"
      class="login-btn mt-20 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      변경
    </button>
  </form>
</template>
