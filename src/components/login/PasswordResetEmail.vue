<script setup lang="ts">
import { userApi } from '@/services/userService/userService';
import { DialogProps, initialDialog } from '@/types/common/dialog';
import { useField, useForm } from 'vee-validate';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import CommonDialog from '../common/CommonDialog.vue';
import CommonInput from '../common/CommonInput.vue';

const router = useRouter();
const dialogState = ref<DialogProps>({ ...initialDialog });

const { handleSubmit } = useForm();

const { value: username } = useField<string>('username');

const isDisabled = computed(() => {
  return !username.value || username.value.trim() === '';
});

const resetForm = () => {
  username.value = '';
};

const onSubmit = handleSubmit(async () => {
  try {
    await userApi.passwordSearch(username.value);

    dialogState.value = {
      open: true,
      isOneBtn: true,
      title: '가입한 계정의 이메일로 메일이 전송되었습니다.',
      mainText: '홈으로',
      onMainClick: () => {
        dialogState.value = { ...initialDialog };
        router.replace('/');
      },
    };
    resetForm();
  } catch (error: unknown) {
    dialogState.value = {
      open: true,
      isOneBtn: true,
      title: '입력한 계정이 올바르지 않습니다.',
      mainText: '확인',
      onMainClick: () => {
        dialogState.value = { ...initialDialog };
      },
    };
  }
});
</script>

<template>
  <form class="login-form" @submit="onSubmit">
    <div class="relative">
      <label>아이디</label>
      <CommonInput
        v-model="username"
        maxlength="14"
        name="username"
        type="text"
        placeholder="아이디를 입력해주세요"
        class="login-input border-b-2 border-gray-0"
      />

      <button
        :disabled="isDisabled"
        type="submit"
        class="login-btn mt-12 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        메일 전송
      </button>
    </div>
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
