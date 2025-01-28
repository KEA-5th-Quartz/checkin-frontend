<script setup lang="ts">
import { userApi } from '@/services/userService/userService';
import { useMemberStore } from '@/stores/memberStore';
import { MemberType } from '@/types/member';
import { useRouter } from 'vue-router';
import { useForm, useField } from 'vee-validate';
import { schema } from '@/utils/passwordSchema';
import SvgIcon from '../common/SvgIcon.vue';
import { ref } from 'vue';
import { EyeIcon, EyeSlashIcon } from '@/assets/icons/path';

const router = useRouter();
const memberStore = useMemberStore();

// Form 설정
const { handleSubmit, errors, meta } = useForm({
  validationSchema: schema,
});

// Field 설정
const { value: newPwd } = useField('newPwd');
const { value: checkPwd } = useField('checkPwd');

const getRedirectPath = (role: string | MemberType): string => {
  const roleRedirectMap: Record<MemberType, string> = {
    ADMIN: '/administrator/memberManagement',
    MANAGER: '/manager/dashboard',
    USER: '/user/tickets',
  };
  return roleRedirectMap[role as MemberType];
};

const resetForm = () => {
  newPwd.value = '';
  checkPwd.value = '';
};

const onSubmit = handleSubmit(async (values) => {
  try {
    await userApi.changePassword(memberStore.memberId, {
      originalpassword: '5v,nkbde',
      newpassword: values.newPwd,
    });

    const redirectPath = getRedirectPath(memberStore.role);
    router.replace(redirectPath);

    resetForm();
  } catch (error) {
    console.log('비밀번호 변경 실패:', error);
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
</template>
