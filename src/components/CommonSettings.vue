<script setup lang="ts">
import { userApi } from '@/services/userService/userService';
import { useMemberStore } from '@/stores/memberStore';
import { schema } from '@/utils/passwordSchema';
import { useField, useForm } from 'vee-validate';
import { ref } from 'vue';

const assignmentNotification = ref(false);
const statusNotification = ref(false);
const commentNotification = ref(false);

const memberStore = useMemberStore();

const { handleSubmit, errors, meta } = useForm({
  validationSchema: schema,
});

const { value: originalpassword } = useField('originalPassword');
const { value: newPassword } = useField('newPassword');
const { value: checkPassword } = useField('checkPassword');

const resetForm = () => {
  originalpassword.value = '';
  newPassword.value = '';
  checkPassword.value = '';
};

const onSubmit = handleSubmit(async (values) => {
  try {
    await userApi.changePassword(memberStore.memberId, {
      originalpassword: values.originalpassword,
      newpassword: values.newPassword,
    });

    resetForm();
  } catch (error) {
    console.log('비밀번호 변경 실패:', error);
  }
});
</script>

<template>
  <div class="flex-stack w-1/2">
    <section class="flex gap-8 items-center">
      <div class="relative">
        <img src="../assets/logo.png" class="border w-36 h-36 rounded-full bg-pink-300" />
        <button class="absolute bottom-1 right-2 w-7 h-7 bg-gray-2 rounded-full flex-center text-xl hover:bg-gray-1">
          +
        </button>
      </div>
      <div class="flex flex-col gap-5">
        <p class="font-semibold text-2xl">stone.vue</p>
        <p class="text-2xl text-gray-1">stone@gmail.com</p>
      </div>
    </section>

    <form class="flex-stack gap-10 mt-14" @submit="onSubmit">
      <div class="flex-stack gap-0.5">
        <label class="text-gray-0">현재 비밀번호</label>
        <input
          v-model="originalpassword"
          class="w-full bg-gray-2 bg-opacity-80 rounded-lg py-2 px-3.5 focus:outline-none"
          type="password"
          placeholder="현재 비밀번호를 입력해주세요"
        />
      </div>

      <div class="flex-stack gap-0.5 relative">
        <label class="text-gray-0">새 비밀번호</label>
        <input
          v-model="newPassword"
          name="newPassword"
          maxlength="20"
          class="w-full bg-gray-2 bg-opacity-80 rounded-lg py-2 px-3.5 focus:outline-none"
          type="password"
          placeholder="새 비밀번호를 입력해주세요"
        />
        <p
          :class="[
            'absolute top-[70px]',
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

      <div class="flex-stack gap-0.5 relative">
        <label class="text-gray-0">새 비밀번호 확인</label>
        <input
          v-model="checkPassword"
          name="checkPassword"
          class="w-full bg-gray-2 bg-opacity-80 rounded-lg py-2 px-3.5 focus:outline-none"
          type="password"
          placeholder="새 비밀번호를 확인해주세요"
        />
        <p
          v-if="checkPassword"
          :class="[
            'absolute top-[70px]',
            {
              'text-red-1': errors.checkPassword,
              'text-green-1': !errors.checkPassword && checkPassword,
            },
          ]"
        >
          {{ errors.checkPassword || '비밀번호가 일치합니다.' }}
        </p>
      </div>

      <!-- 알림 조건부 렌더링 -->
      <div class="flex-stack gap-5 mt-5">
        <div class="flex items-center justify-between w-1/3">
          <p class="font-bold">담당자 배정 알림</p>
          <button
            type="button"
            class="relative inline-flex h-6 w-11 items-center rounded-full"
            :class="assignmentNotification ? 'bg-blue-1' : 'bg-gray-1'"
            @click="assignmentNotification = !assignmentNotification"
          >
            <div
              class="inline-block h-4 w-4 transform rounded-full bg-white-0 transition"
              :class="assignmentNotification ? 'translate-x-6' : 'translate-x-1'"
            />
          </button>
        </div>

        <div class="flex items-center justify-between w-1/3">
          <p class="font-bold">진행상태 변경 알림</p>
          <button
            type="button"
            class="relative inline-flex h-6 w-11 items-center rounded-full"
            :class="statusNotification ? 'bg-blue-1' : 'bg-gray-1'"
            @click="statusNotification = !statusNotification"
          >
            <div
              class="inline-block h-4 w-4 transform rounded-full bg-white-0 transition"
              :class="statusNotification ? 'translate-x-6' : 'translate-x-1'"
            />
          </button>
        </div>

        <div class="flex items-center justify-between w-1/3">
          <p class="font-bold">티켓 댓글 알림</p>
          <button
            type="button"
            class="relative inline-flex h-6 w-11 items-center rounded-full"
            :class="commentNotification ? 'bg-blue-1' : 'bg-gray-1'"
            @click="commentNotification = !commentNotification"
          >
            <div
              class="inline-block h-4 w-4 transform rounded-full bg-white-0 transition"
              :class="commentNotification ? 'translate-x-6' : 'translate-x-1'"
            />
          </button>
        </div>
      </div>

      <button type="submit" class="btn-main max-w-fit self-end">저장</button>
    </form>
  </div>
</template>
